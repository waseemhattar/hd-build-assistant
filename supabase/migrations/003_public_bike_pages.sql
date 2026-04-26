-- HD Build Assistant — Public bike pages.
--
-- Adds the columns and RLS policies required to share a bike profile via
-- a public link (eg. harley.h-dbuilds.com/b/x7p9k2). Anyone with the slug
-- can read the bike's identity + builds + mods. Service entries stay
-- private (riders share builds, not service history).
--
-- To run this migration:
--   1. Paste the whole file into Supabase SQL Editor → Run.
--   2. In the Supabase dashboard → Storage → New bucket → name "bike-photos",
--      Public bucket = ON. (RLS for the bucket is set up below as a
--      reference; the dashboard toggle is the simplest path.)

-- =====================================================================
-- New columns on garage_bikes
-- =====================================================================
alter table public.garage_bikes
  add column if not exists is_public boolean not null default false,
  add column if not exists public_slug text unique,
  add column if not exists cover_photo_url text not null default '',
  add column if not exists display_name text not null default '';

-- Index helps lookup by slug from the public route. Already unique-indexed
-- via the unique constraint, but keep an explicit one in case the constraint
-- name changes.
create index if not exists garage_bikes_public_slug_idx
  on public.garage_bikes (public_slug)
  where public_slug is not null;

-- =====================================================================
-- Public-read RLS policies
-- =====================================================================
-- We add separate policies that allow anonymous (or any) reads when
-- is_public = true. They sit alongside the existing owner policies; RLS
-- treats multiple policies as OR, so an owner reading their own row still
-- works.

-- garage_bikes: anyone can SELECT a bike where is_public = true
drop policy if exists "garage_bikes: public can select shared" on public.garage_bikes;
create policy "garage_bikes: public can select shared"
  on public.garage_bikes for select
  to anon, authenticated
  using (is_public = true);

-- bike_builds: anyone can SELECT builds whose owning bike is public
drop policy if exists "bike_builds: public can select shared" on public.bike_builds;
create policy "bike_builds: public can select shared"
  on public.bike_builds for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.garage_bikes b
      where b.id = bike_builds.bike_id
        and b.is_public = true
    )
  );

-- bike_mods: anyone can SELECT mods whose owning bike is public, AND the
-- mod itself is_public. Riders can mark individual mods private even on a
-- public bike (eg. they don't want to share what their tuner cost).
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

-- Note: service_entries intentionally has NO public read policy. Build
-- sheets are public; service history is private.

-- Grant SELECT to anon so RLS policies above are reachable. Without this,
-- anon never gets past PostgREST's table-level grants.
grant select on public.garage_bikes to anon;
grant select on public.bike_builds to anon;
grant select on public.bike_mods to anon;

-- =====================================================================
-- Storage bucket policies (reference)
-- =====================================================================
-- Easiest path: create the bucket via the Supabase dashboard with
-- "Public bucket" enabled. That auto-creates the read policy.
--
-- If you want to script it instead, the equivalent is:
--   insert into storage.buckets (id, name, public)
--     values ('bike-photos', 'bike-photos', true)
--     on conflict (id) do nothing;
--
-- Owner-only write policy (run in SQL editor after creating the bucket):
--   create policy "bike-photos: owner can write"
--     on storage.objects for insert
--     to authenticated
--     with check (
--       bucket_id = 'bike-photos'
--       and (auth.jwt() ->> 'sub') = (storage.foldername(name))[1]
--     );
--   create policy "bike-photos: owner can update"
--     on storage.objects for update
--     to authenticated
--     using (
--       bucket_id = 'bike-photos'
--       and (auth.jwt() ->> 'sub') = (storage.foldername(name))[1]
--     );
--   create policy "bike-photos: owner can delete"
--     on storage.objects for delete
--     to authenticated
--     using (
--       bucket_id = 'bike-photos'
--       and (auth.jwt() ->> 'sub') = (storage.foldername(name))[1]
--     );
--
-- The convention is: photos are uploaded under
--   bike-photos/<clerk_user_id>/<bike_uuid>.jpg
-- so storage.foldername(name)[1] gives back the user id and matches the JWT.
