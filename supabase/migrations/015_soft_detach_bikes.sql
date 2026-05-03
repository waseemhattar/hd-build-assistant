-- Migration 015 — soft-detach bikes + privacy-safe VIN ownership check
--
-- Why this migration exists:
--
--   Migration 010 introduced soft-delete via `archived_at` so a bike's
--   service-and-mod history persists across owner changes (the per-VIN
--   ledger is the product moat). But two destructive client paths
--   silently bypassed it:
--
--     1) `removeBike()` in storage.js called PostgREST DELETE directly.
--     2) `upsertBike` had a "VIN-collision self-heal" that DELETE'd the
--        existing row BEFORE confirming the retry insert succeeded —
--        if the retry failed for any reason, history was destroyed
--        with no recovery. (This is what wiped the test bike on
--        2026-05-03.)
--
--   Migration 015 closes both holes by routing the client through three
--   SECURITY DEFINER RPCs. The destructive paths become impossible to
--   take from any client, even with a service-role key.
--
-- Run in Supabase SQL Editor.

-- =====================================================================
-- 1) detach_bike(p_id)
-- =====================================================================
-- Soft-detach a bike: sets archived_at = now() (the existing migration-010
-- RLS policy "garage_bikes: own auth read" already filters archived rows
-- out of the user's own SELECT, so the bike disappears from their garage
-- without losing data).
--
-- Also writes a row to the `deletions` log. The trigger from migration
-- 013 only fires on actual DELETE, so a soft-detach would otherwise be
-- invisible to other devices until the periodic full-sync. Mirroring it
-- here gives sub-second propagation through the existing sync path.

create or replace function public.detach_bike(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
begin
  select auth_user_id
    into v_owner
    from public.garage_bikes
   where id = p_id;
  if v_owner is null then
    raise exception 'Bike not found' using errcode = 'P0002';
  end if;
  if v_owner != auth.uid() then
    raise exception 'Not the owner' using errcode = '42501';
  end if;
  update public.garage_bikes
     set archived_at = now(),
         updated_at  = now()
   where id = p_id
     and archived_at is null;
  -- Mirror to deletions log so peers prune local cache via existing sync.
  insert into public.deletions (table_name, row_id, user_id, deleted_at)
  values ('garage_bikes', p_id, v_owner, now());
end;
$$;

revoke all on function public.detach_bike(uuid) from public;
grant execute on function public.detach_bike(uuid) to authenticated;

-- =====================================================================
-- 2) check_vin_availability_safe(p_vin)
-- =====================================================================
-- Privacy-safe pre-flight. Replaces migration 010's check_vin_availability,
-- which returned `taken_by_user_id` — a leak by the project's own privacy
-- standard. This version returns one scalar text:
--
--   'available'            — VIN unseen or only archived rows (none caller's)
--   'available_to_reclaim' — caller previously archived this VIN, no other claim
--   'already_in_garage'    — caller already has an active row for this VIN
--   'owned_by_other'       — another user has an active row for this VIN
--
-- The 'owned_by_other' branch is what the UI uses to show:
--   "This bike is now attached to another biker."

create or replace function public.check_vin_availability_safe(p_vin text)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_caller uuid := auth.uid();
  v_active_owner uuid;
  v_caller_archived boolean;
begin
  if p_vin is null or length(trim(p_vin)) = 0 then
    -- No VIN entered — uniqueness isn't enforced for nulls, always allowed.
    return 'available';
  end if;
  select auth_user_id
    into v_active_owner
    from public.garage_bikes
   where vin = p_vin and archived_at is null
   limit 1;
  if v_active_owner = v_caller then
    return 'already_in_garage';
  end if;
  if v_active_owner is not null then
    return 'owned_by_other';
  end if;
  select exists (
    select 1
      from public.garage_bikes
     where vin = p_vin
       and archived_at is not null
       and auth_user_id = v_caller
  ) into v_caller_archived;
  if v_caller_archived then
    return 'available_to_reclaim';
  end if;
  return 'available';
end;
$$;

revoke all on function public.check_vin_availability_safe(text) from public;
grant execute on function public.check_vin_availability_safe(text) to authenticated;

-- =====================================================================
-- 3) claim_or_revive_bike(p_bike)
-- =====================================================================
-- Atomic replacement for the destructive client-side VIN-collision
-- self-heal. All decision branches happen inside one SECURITY DEFINER
-- function, so partial failure (delete-then-failed-retry) is impossible.
--
--   * Active row owned by ANOTHER user           → raise 'owned_by_other'
--   * Active row owned by caller, different id   → raise 'already_in_garage'
--     (caller's local cache is out of sync; client should pull and retry)
--   * Archived row owned by caller, same VIN     → revive that row (un-archive),
--                                                  merge fresh fields,
--                                                  return its id
--   * Otherwise                                  → upsert by id
--
-- Returns the id of the active row, which may differ from the input id
-- when a revive happens. Caller should reconcile local cache to that id.

create or replace function public.claim_or_revive_bike(p_bike jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller uuid := auth.uid();
  v_id     uuid := nullif(p_bike->>'id','')::uuid;
  v_vin    text := nullif(trim(p_bike->>'vin'), '');
  v_active_owner uuid;
  v_revivable_id uuid;
  v_dup_count    int;
begin
  if v_caller is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;
  if v_id is null then
    raise exception 'Bike id required' using errcode = '22023';
  end if;

  if v_vin is not null then
    -- 1) Is the VIN actively claimed by anyone right now?
    select auth_user_id
      into v_active_owner
      from public.garage_bikes
     where vin = v_vin and archived_at is null
     limit 1;
    if v_active_owner is not null
       and v_active_owner != v_caller then
      raise exception 'VIN already claimed by another rider'
        using errcode = 'P0001',
              hint    = 'owned_by_other';
    end if;
    -- Caller already has this VIN active under a DIFFERENT id — refuse.
    -- (Same-id case falls through to the upsert below, which refreshes it.)
    if v_active_owner = v_caller then
      select count(*)
        into v_dup_count
        from public.garage_bikes
       where vin = v_vin
         and archived_at is null
         and auth_user_id = v_caller
         and id != v_id;
      if v_dup_count > 0 then
        raise exception 'Already in your garage under a different id'
          using errcode = 'P0001',
                hint    = 'already_in_garage';
      end if;
    end if;
    -- 2) Caller has a previously-archived row for this VIN — revive it.
    if v_active_owner is null then
      select id
        into v_revivable_id
        from public.garage_bikes
       where vin = v_vin
         and archived_at is not null
         and auth_user_id = v_caller
       order by archived_at desc
       limit 1;
      if v_revivable_id is not null then
        update public.garage_bikes
           set archived_at     = null,
               updated_at      = now(),
               mileage         = coalesce(nullif(p_bike->>'mileage','')::int, mileage),
               nickname        = coalesce(p_bike->>'nickname', nickname),
               year            = coalesce(nullif(p_bike->>'year','')::int, year),
               model           = coalesce(p_bike->>'model', model),
               bike_type_id    = coalesce(p_bike->>'bike_type_id', bike_type_id),
               display_name    = coalesce(p_bike->>'display_name', display_name),
               cover_photo_url = coalesce(p_bike->>'cover_photo_url', cover_photo_url),
               notes           = coalesce(p_bike->>'notes', notes),
               purchase_date   = coalesce(nullif(p_bike->>'purchase_date','')::date, purchase_date),
               is_public       = coalesce(nullif(p_bike->>'is_public','')::boolean, is_public),
               public_slug     = coalesce(p_bike->>'public_slug', public_slug)
         where id = v_revivable_id;
        return v_revivable_id;
      end if;
    end if;
  end if;

  -- 3) Plain upsert by id (insert new, or refresh existing same-id row).
  insert into public.garage_bikes (
    id, user_id, auth_user_id, vin, year, model, nickname, mileage,
    purchase_date, notes, is_public, public_slug, cover_photo_url,
    display_name, bike_type_id, created_at, updated_at
  ) values (
    v_id,
    v_caller::text,             -- legacy text user_id, holds uuid as string
    v_caller,
    v_vin,
    nullif(p_bike->>'year','')::int,
    coalesce(p_bike->>'model', ''),
    coalesce(p_bike->>'nickname', ''),
    coalesce(nullif(p_bike->>'mileage','')::int, 0),
    nullif(p_bike->>'purchase_date','')::date,
    coalesce(p_bike->>'notes', ''),
    coalesce(nullif(p_bike->>'is_public','')::boolean, false),
    p_bike->>'public_slug',
    coalesce(p_bike->>'cover_photo_url', ''),
    coalesce(p_bike->>'display_name', ''),
    p_bike->>'bike_type_id',
    coalesce(nullif(p_bike->>'created_at','')::timestamptz, now()),
    coalesce(nullif(p_bike->>'updated_at','')::timestamptz, now())
  )
  on conflict (id) do update
    set vin             = excluded.vin,
        year            = excluded.year,
        model           = excluded.model,
        nickname        = excluded.nickname,
        mileage         = excluded.mileage,
        purchase_date   = excluded.purchase_date,
        notes           = excluded.notes,
        is_public       = excluded.is_public,
        public_slug     = excluded.public_slug,
        cover_photo_url = excluded.cover_photo_url,
        display_name    = excluded.display_name,
        bike_type_id    = excluded.bike_type_id,
        updated_at      = now();
  return v_id;
end;
$$;

revoke all on function public.claim_or_revive_bike(jsonb) from public;
grant execute on function public.claim_or_revive_bike(jsonb) to authenticated;
