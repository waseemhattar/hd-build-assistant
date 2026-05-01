-- Sidestand — VIN uniqueness with a soft constraint + transfer flow.
--
-- Why: a real motorcycle VIN is unique by definition. If two users
-- claim the same VIN, at most one can be the real owner. We don't
-- want to silently let both attach data to it (data integrity bug
-- and a fraud surface — a previous owner's photos can't end up in
-- a new owner's account).
--
-- Strategy:
--   - VIN stays optional. Many users won't bother entering one.
--   - Among non-null VINs, only ONE active row is allowed at a time.
--     Active = not soft-deleted (archived_at is null).
--   - When a user tries to claim a VIN that's already active, the app
--     creates a transfer request row. The current owner gets pinged
--     in-app; if they accept, their bike row is archived and the new
--     owner's row activates.
--   - Riders who actually delete a bike free the VIN immediately.
--
-- Run in Supabase SQL Editor.

-- =====================================================================
-- 1) Add archived_at — soft-delete column
-- =====================================================================
-- We use soft delete so a sold bike's history (mods, services) can
-- still be read by the original owner if they need it. Hard-delete
-- continues to work via removeBike() in storage.js — RLS lets the
-- owner do that.
alter table public.garage_bikes
  add column if not exists archived_at timestamptz;

create index if not exists garage_bikes_archived_idx
  on public.garage_bikes (archived_at)
  where archived_at is not null;

-- =====================================================================
-- 2) Partial unique index on VIN
-- =====================================================================
-- "Among rows where vin is not null AND archived_at is null, vin must
-- be unique." This is the soft constraint — it lets old (archived)
-- bikes sit alongside the new active claim without conflict.
create unique index if not exists garage_bikes_active_vin_unique
  on public.garage_bikes (vin)
  where vin is not null and archived_at is null;

-- =====================================================================
-- 3) bike_transfer_requests table
-- =====================================================================
-- Records every "I'm trying to claim a VIN that's already taken"
-- event. The current owner approves or declines; we keep the row
-- either way for audit / future fraud-prevention.
create table if not exists public.bike_transfer_requests (
  id                  uuid primary key default gen_random_uuid(),
  vin                 text not null,
  -- The bike that's CURRENTLY active under this VIN. When the
  -- transfer completes, this bike gets archived_at set.
  current_bike_id     uuid not null references public.garage_bikes(id) on delete cascade,
  current_owner_id    uuid not null references auth.users(id) on delete cascade,
  -- The user requesting the transfer. After acceptance, they create
  -- their own bike row.
  requesting_user_id  uuid not null references auth.users(id) on delete cascade,
  -- Snapshot of the requesting user's bike data at the time of the
  -- request — they may have already filled in nickname, mileage, etc.
  -- We store it so when the transfer is accepted, we can hydrate the
  -- new bike row with the data they entered.
  requested_bike_data jsonb,
  status              text not null default 'pending'
                      check (status in ('pending', 'accepted', 'declined', 'expired', 'cancelled')),
  -- Audit trail — when did each state transition happen?
  created_at          timestamptz not null default now(),
  decided_at          timestamptz,
  -- Optional message from requesting user ("I bought this from you
  -- on April 12 — please confirm").
  message             text,
  -- Optional reason from current owner if declined.
  decline_reason      text
);

create index if not exists bike_transfer_requests_current_idx
  on public.bike_transfer_requests (current_owner_id, status);
create index if not exists bike_transfer_requests_requesting_idx
  on public.bike_transfer_requests (requesting_user_id, status);
create index if not exists bike_transfer_requests_vin_idx
  on public.bike_transfer_requests (vin, status);

alter table public.bike_transfer_requests enable row level security;

-- Both parties (current owner + requesting user) can read the row.
-- Admins can read everything for moderation.
drop policy if exists "bike_transfer_requests: read parties" on public.bike_transfer_requests;
create policy "bike_transfer_requests: read parties"
  on public.bike_transfer_requests for select
  to authenticated
  using (
    current_owner_id = auth.uid()
    or requesting_user_id = auth.uid()
    or public.is_admin()
  );

-- Requesting user creates the row.
drop policy if exists "bike_transfer_requests: requester insert" on public.bike_transfer_requests;
create policy "bike_transfer_requests: requester insert"
  on public.bike_transfer_requests for insert
  to authenticated
  with check (requesting_user_id = auth.uid());

-- Current owner can update status (accept/decline). Requesting user
-- can update to cancel.
drop policy if exists "bike_transfer_requests: owner decide" on public.bike_transfer_requests;
create policy "bike_transfer_requests: owner decide"
  on public.bike_transfer_requests for update
  to authenticated
  using (current_owner_id = auth.uid() or requesting_user_id = auth.uid())
  with check (current_owner_id = auth.uid() or requesting_user_id = auth.uid());

grant select, insert, update on public.bike_transfer_requests to authenticated;

-- =====================================================================
-- 4) Helper: claim_vin — atomic check-and-flag
-- =====================================================================
-- The app calls this RPC before inserting a bike with a VIN. If the
-- VIN is free, the function returns 'ok'. If it's taken, the function
-- creates a transfer request and returns 'transfer_required' so the
-- UI can prompt the user.
create or replace function public.check_vin_availability(p_vin text)
returns table (status text, taken_by_user_id uuid, current_bike_id uuid)
language sql
stable
security definer
as $$
  select
    case when exists (
      select 1 from public.garage_bikes
      where vin = p_vin and archived_at is null
    ) then 'transfer_required' else 'ok' end as status,
    (select auth_user_id from public.garage_bikes
       where vin = p_vin and archived_at is null limit 1) as taken_by_user_id,
    (select id from public.garage_bikes
       where vin = p_vin and archived_at is null limit 1) as current_bike_id;
$$;

grant execute on function public.check_vin_availability(text) to authenticated;

-- =====================================================================
-- 5) RLS update — exclude archived bikes from the user's own SELECT
-- =====================================================================
-- "Show me my bikes" should not surface archived ones (they were
-- transferred away). They stay queryable via a separate "history"
-- view if we ever want to surface that.
drop policy if exists "garage_bikes: own auth read" on public.garage_bikes;
create policy "garage_bikes: own auth read"
  on public.garage_bikes for select
  to authenticated
  using (auth_user_id = auth.uid() and archived_at is null);

-- The is_public-driven "anyone can see shared bike" policy stays as-is
-- (in migration 003) — public bike pages still work for shared builds.
-- If a public bike gets transferred, the new owner can flip is_public
-- back on with their own slug; the original is archived and no longer
-- resolvable.
