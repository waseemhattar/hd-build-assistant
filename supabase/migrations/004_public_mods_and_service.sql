-- HD Build Assistant — relax mod visibility + open up service entries.
--
-- Two changes after testing migration 003:
--
--   1. Mods on a public bike weren't showing on /b/<slug> because the
--      public-read RLS for bike_mods required the mod itself to have
--      is_public = true, but the app has no UI to set that. The new
--      policy drops that check — if the parent bike is public, all its
--      mods are public.
--
--   2. Service entries (service_entries) were always private. The user
--      wants service-history entries to show on the public page too, so
--      this migration adds an is_public flag to service_entries (default
--      true so existing rows surface) and a public-read RLS policy
--      identical in shape to the one used for bike_mods.
--
-- To run: paste into Supabase SQL Editor → Run.

-- =====================================================================
-- 1) Relax bike_mods public-read policy
-- =====================================================================
drop policy if exists "bike_mods: public can select shared" on public.bike_mods;
create policy "bike_mods: public can select shared"
  on public.bike_mods for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.garage_bikes b
      where b.id = bike_mods.bike_id
        and b.is_public = true
    )
  );

-- =====================================================================
-- 2) Service entries become public-shareable
-- =====================================================================
alter table public.service_entries
  add column if not exists is_public boolean not null default true;

-- Anyone can SELECT service entries whose owning bike is public AND
-- the entry itself is_public. Riders can still mark a single entry
-- private (eg. "fixed something embarrassing") even on a public bike.
drop policy if exists "service_entries: public can select shared" on public.service_entries;
create policy "service_entries: public can select shared"
  on public.service_entries for select
  to anon, authenticated
  using (
    is_public = true
    and exists (
      select 1 from public.garage_bikes b
      where b.id = service_entries.bike_id
        and b.is_public = true
    )
  );

-- Make sure the anon role can hit the table at all so RLS is reachable.
grant select on public.service_entries to anon;
