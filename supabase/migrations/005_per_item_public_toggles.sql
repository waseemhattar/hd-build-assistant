-- HD Build Assistant — per-item public toggles for mods and services.
--
-- Background: migration 003 added is_public on bike_mods. Migration 004
-- temporarily ignored that flag (so existing mods would surface even
-- though no UI ever set it). Now we're adding a per-item toggle in the
-- UI, so we want RLS to honor the flag again.
--
-- Two things this migration does:
--
--   1. Backfill: set is_public = true on all existing bike_mods rows
--      whose owning bike is public, AND on all existing service_entries
--      that haven't been explicitly marked private. Without this, every
--      mod a rider already created would silently disappear from the
--      public page when we re-enable the RLS check.
--
--   2. Re-enable per-mod public-read RLS so flipping the toggle off
--      actually hides a single mod even when the bike is public.
--
-- Run in Supabase SQL Editor.

-- =====================================================================
-- 1) Backfill existing rows
-- =====================================================================
-- Mods: any mod on a published bike opts in by default (matches the
-- "default-on after creation" behavior the new UI promises).
update public.bike_mods
  set is_public = true
  where is_public = false
    and exists (
      select 1 from public.garage_bikes b
      where b.id = bike_mods.bike_id
        and b.is_public = true
    );

-- Service entries: column was added in migration 004 with default true,
-- but be explicit in case anything was inserted with it = false.
update public.service_entries
  set is_public = true
  where is_public = false;

-- =====================================================================
-- 2) Re-tighten bike_mods public-read RLS
-- =====================================================================
-- Anyone can SELECT a mod whose owning bike is public AND the mod
-- itself is_public. Riders flip the per-mod toggle off to hide one
-- specific mod even on an otherwise-public bike.
drop policy if exists "bike_mods: public can select shared" on public.bike_mods;
create policy "bike_mods: public can select shared"
  on public.bike_mods for select
  to anon, authenticated
  using (
    is_public = true
    and exists (
      select 1 from public.garage_bikes b
      where b.id = bike_mods.bike_id
        and b.is_public = true
    )
  );

-- service_entries policy already requires is_public from migration 004,
-- so nothing to change there.
