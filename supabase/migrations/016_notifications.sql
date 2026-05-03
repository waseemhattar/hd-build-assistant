-- Migration 016 — notifications table + per-VIN-claim trigger
--
-- Why this migration exists:
--
--   With migration 015, a previous owner who detached a bike only
--   finds out it's been claimed by someone else when they try to
--   re-add it. That's passive — fine, but the riding-community
--   appropriate behaviour is proactive: "hey, your old Street Glide
--   is now in someone else's garage."
--
--   This migration adds a generic `notifications` inbox + a trigger
--   on `garage_bikes` that fires `bike_claimed_by_other` events when
--   a row "becomes active" under a VIN that has archived rows owned
--   by other users. Privacy preserved: the payload deliberately omits
--   the new owner's identity. Previous owner learns the VIN status,
--   not who has it now.
--
--   The same notifications table will carry future event kinds
--   (transfer_request_received, ride_comment, public_build_liked,
--   etc.) — generic schema, kind-discriminated payload. APNs push
--   is a separate phase (requires Apple cert + Worker route); this
--   schema is push-ready (event already persisted, push is just a
--   delivery mechanism on top).
--
-- Run in Supabase SQL Editor.

-- =====================================================================
-- 1) notifications table
-- =====================================================================

create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  -- Discriminator. Add new kinds as they appear.
  kind        text not null,
  -- Kind-specific data. For 'bike_claimed_by_other':
  --   { "vin": "1HD1...", "claimed_at": "2026-05-03T..." }
  payload     jsonb not null default '{}'::jsonb,
  read_at     timestamptz,           -- null = unread
  created_at  timestamptz not null default now()
);

-- Most common queries: "my unread" and "my recent". Both index-supported.
create index if not exists notifications_user_unread_idx
  on public.notifications (user_id, created_at desc)
  where read_at is null;

create index if not exists notifications_user_recent_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

-- Owner can read their inbox.
drop policy if exists "notifications: owner read" on public.notifications;
create policy "notifications: owner read"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

-- Owner can mark-read (update read_at). Other fields are immutable from
-- the client. We allow the broad UPDATE here and rely on the
-- with-check expression to scope it; the expectation is the client
-- only sets read_at. If we ever care about field-level locking we can
-- swap this for a SECURITY DEFINER mark_read RPC.
drop policy if exists "notifications: owner update" on public.notifications;
create policy "notifications: owner update"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- No client INSERT/DELETE — only SECURITY DEFINER triggers/functions write.
revoke all on public.notifications from anon;
grant select, update on public.notifications to authenticated;

-- =====================================================================
-- 2) notify_previous_vin_owners() trigger function
-- =====================================================================
-- Fires AFTER insert or update on garage_bikes whenever a row "becomes
-- active" with a VIN. If any OTHER user has an archived row under that
-- same VIN, drop a 'bike_claimed_by_other' notification into their
-- inbox.
--
-- Privacy: the payload contains VIN + timestamp only. We deliberately
-- do NOT include the new claimant's auth_user_id, display_name, or
-- public_slug. The previous owner learns the *status* of the VIN, not
-- the identity behind the new claim.
--
-- Idempotency: we don't dedupe inside the trigger. If a rider claims
-- a VIN, archives it, then claims it again, the previous owner will
-- get two notifications. That's accurate — two distinct events. The
-- client UI can collapse if needed.

create or replace function public.notify_previous_vin_owners()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prev_owner uuid;
begin
  -- Only fire when the row is currently active and has a VIN.
  if NEW.vin is null or NEW.archived_at is not null then
    return NEW;
  end if;
  -- On UPDATE, skip if the row was already active under the same VIN
  -- (a normal field update, not a claim event).
  if TG_OP = 'UPDATE'
     and OLD.archived_at is null
     and OLD.vin is not distinct from NEW.vin then
    return NEW;
  end if;

  -- Find all distinct previous owners (other users who hold an archived
  -- row for this VIN) and notify each.
  for v_prev_owner in
    select distinct auth_user_id
      from public.garage_bikes
     where vin = NEW.vin
       and archived_at is not null
       and auth_user_id is not null
       and auth_user_id != NEW.auth_user_id
  loop
    insert into public.notifications (user_id, kind, payload)
    values (
      v_prev_owner,
      'bike_claimed_by_other',
      jsonb_build_object(
        'vin', NEW.vin,
        'claimed_at', now()
      )
    );
  end loop;

  return NEW;
end;
$$;

drop trigger if exists garage_bikes_notify_prev_owners on public.garage_bikes;
create trigger garage_bikes_notify_prev_owners
  after insert or update on public.garage_bikes
  for each row execute function public.notify_previous_vin_owners();

-- =====================================================================
-- 3) mark_notification_read(p_id) — convenience RPC
-- =====================================================================
-- The RLS UPDATE policy already lets the owner write read_at directly,
-- but having an RPC means the client code reads more clearly and we
-- can centralize side-effects (e.g. badge-count cache invalidation)
-- here later without touching every call site.

create or replace function public.mark_notification_read(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.notifications
     set read_at = now()
   where id = p_id
     and user_id = auth.uid()
     and read_at is null;
$$;

revoke all on function public.mark_notification_read(uuid) from public;
grant execute on function public.mark_notification_read(uuid) to authenticated;
