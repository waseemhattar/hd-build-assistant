-- Sidestand — migrate from Clerk JWT auth to Supabase Auth.
--
-- Until now, RLS policies used `auth.jwt() ->> 'sub'` to pick up the
-- Clerk user id (a text value like 'user_3ChotU4zf3nXMWfeF4k2gM4SNJ0').
-- We're switching to Supabase Auth, where users are stored in
-- auth.users with UUID ids, and RLS uses `auth.uid()` (returns uuid).
--
-- This migration:
--   1) Adds `auth_user_id uuid` columns alongside the old text user_id
--      columns on every per-user table. The text columns stay (renamed
--      to legacy_clerk_id) so we can roll back if needed.
--   2) Rewrites every RLS policy to filter on auth_user_id = auth.uid()
--      instead of user_id = auth.jwt() ->> 'sub'.
--   3) Updates the user_profiles table similarly — its primary key was
--      a Clerk text id; we add an auth_user_id uuid that becomes the
--      new identity.
--   4) Provides an UPDATE statement (commented) you can run after
--      signing up your same email via Supabase Auth, to remap your
--      existing rows from the Clerk id to the new Supabase auth id.
--
-- Run this in Supabase SQL Editor AFTER you've signed up at least once
-- via Supabase Auth on the production app — that creates an auth.users
-- row whose id we point everything at in step 4.

-- =====================================================================
-- Helper: known mapping of legacy Clerk ids → Supabase auth user ids.
-- After you sign up via Supabase Auth, look up your new auth.users.id
-- and add a row here. Then the UPDATE block below picks up the mapping
-- and migrates your rows in place.
-- =====================================================================
create table if not exists public._auth_migration_map (
  clerk_user_id text primary key,
  supabase_user_id uuid not null references auth.users(id) on delete cascade,
  notes text,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- 1) garage_bikes — add auth_user_id, mirror existing user_id values
-- =====================================================================
alter table public.garage_bikes
  add column if not exists auth_user_id uuid references auth.users(id) on delete cascade;

-- Any existing rows where the user_id matches a row in our migration
-- map get their auth_user_id populated. Rows whose Clerk id isn't in
-- the map stay with auth_user_id = null until you add the mapping +
-- re-run this UPDATE.
update public.garage_bikes b
  set auth_user_id = m.supabase_user_id
  from public._auth_migration_map m
  where b.user_id = m.clerk_user_id
    and b.auth_user_id is null;

create index if not exists garage_bikes_auth_user_idx
  on public.garage_bikes (auth_user_id);

-- Drop the Clerk-shaped policies and recreate against auth_user_id.
drop policy if exists "garage_bikes: own user read" on public.garage_bikes;
drop policy if exists "garage_bikes: own user write" on public.garage_bikes;
drop policy if exists "garage_bikes: own user update" on public.garage_bikes;
drop policy if exists "garage_bikes: own user delete" on public.garage_bikes;

create policy "garage_bikes: own auth read"
  on public.garage_bikes for select
  to authenticated
  using (auth_user_id = auth.uid());
create policy "garage_bikes: own auth insert"
  on public.garage_bikes for insert
  to authenticated
  with check (auth_user_id = auth.uid());
create policy "garage_bikes: own auth update"
  on public.garage_bikes for update
  to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());
create policy "garage_bikes: own auth delete"
  on public.garage_bikes for delete
  to authenticated
  using (auth_user_id = auth.uid());

-- Public-read policy for bikes flagged is_public stays as-is from
-- migration 003 — it doesn't reference user_id.

-- =====================================================================
-- 2) service_entries — same treatment
-- =====================================================================
alter table public.service_entries
  add column if not exists auth_user_id uuid references auth.users(id) on delete cascade;

update public.service_entries e
  set auth_user_id = m.supabase_user_id
  from public._auth_migration_map m
  where e.user_id = m.clerk_user_id
    and e.auth_user_id is null;

create index if not exists service_entries_auth_user_idx
  on public.service_entries (auth_user_id);

drop policy if exists "service_entries: own user read" on public.service_entries;
drop policy if exists "service_entries: own user write" on public.service_entries;
drop policy if exists "service_entries: own user update" on public.service_entries;
drop policy if exists "service_entries: own user delete" on public.service_entries;

create policy "service_entries: own auth read"
  on public.service_entries for select
  to authenticated
  using (auth_user_id = auth.uid());
create policy "service_entries: own auth insert"
  on public.service_entries for insert
  to authenticated
  with check (auth_user_id = auth.uid());
create policy "service_entries: own auth update"
  on public.service_entries for update
  to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());
create policy "service_entries: own auth delete"
  on public.service_entries for delete
  to authenticated
  using (auth_user_id = auth.uid());

-- =====================================================================
-- 3) bike_builds
-- =====================================================================
alter table public.bike_builds
  add column if not exists auth_user_id uuid references auth.users(id) on delete cascade;

update public.bike_builds b
  set auth_user_id = m.supabase_user_id
  from public._auth_migration_map m
  where b.user_id = m.clerk_user_id
    and b.auth_user_id is null;

create index if not exists bike_builds_auth_user_idx
  on public.bike_builds (auth_user_id);

drop policy if exists "bike_builds: own user read" on public.bike_builds;
drop policy if exists "bike_builds: own user write" on public.bike_builds;
drop policy if exists "bike_builds: own user update" on public.bike_builds;
drop policy if exists "bike_builds: own user delete" on public.bike_builds;

create policy "bike_builds: own auth read"
  on public.bike_builds for select
  to authenticated
  using (auth_user_id = auth.uid());
create policy "bike_builds: own auth insert"
  on public.bike_builds for insert
  to authenticated
  with check (auth_user_id = auth.uid());
create policy "bike_builds: own auth update"
  on public.bike_builds for update
  to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());
create policy "bike_builds: own auth delete"
  on public.bike_builds for delete
  to authenticated
  using (auth_user_id = auth.uid());

-- =====================================================================
-- 4) bike_mods
-- =====================================================================
alter table public.bike_mods
  add column if not exists auth_user_id uuid references auth.users(id) on delete cascade;

update public.bike_mods m2
  set auth_user_id = m.supabase_user_id
  from public._auth_migration_map m
  where m2.user_id = m.clerk_user_id
    and m2.auth_user_id is null;

create index if not exists bike_mods_auth_user_idx
  on public.bike_mods (auth_user_id);

drop policy if exists "bike_mods: own user read" on public.bike_mods;
drop policy if exists "bike_mods: own user write" on public.bike_mods;
drop policy if exists "bike_mods: own user update" on public.bike_mods;
drop policy if exists "bike_mods: own user delete" on public.bike_mods;

create policy "bike_mods: own auth read"
  on public.bike_mods for select
  to authenticated
  using (auth_user_id = auth.uid());
create policy "bike_mods: own auth insert"
  on public.bike_mods for insert
  to authenticated
  with check (auth_user_id = auth.uid());
create policy "bike_mods: own auth update"
  on public.bike_mods for update
  to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());
create policy "bike_mods: own auth delete"
  on public.bike_mods for delete
  to authenticated
  using (auth_user_id = auth.uid());

-- The public-read policy on bike_mods (anon visitors of public bikes)
-- doesn't reference user_id and stays intact.

-- =====================================================================
-- 5) user_profiles — switch identity to UUID
-- =====================================================================
-- Add an auth_user_id uuid column. The old clerk_user_id stays as a
-- legacy reference. New rows going forward use auth_user_id as the
-- effective identity.
alter table public.user_profiles
  add column if not exists auth_user_id uuid references auth.users(id) on delete cascade;

create unique index if not exists user_profiles_auth_user_id_unique
  on public.user_profiles (auth_user_id) where auth_user_id is not null;

update public.user_profiles p
  set auth_user_id = m.supabase_user_id
  from public._auth_migration_map m
  where p.clerk_user_id = m.clerk_user_id
    and p.auth_user_id is null;

-- New RLS using auth.uid() against auth_user_id
drop policy if exists "user_profiles: own row read" on public.user_profiles;
drop policy if exists "user_profiles: own row write" on public.user_profiles;
drop policy if exists "user_profiles: own row update" on public.user_profiles;

create policy "user_profiles: own row read"
  on public.user_profiles for select
  to authenticated
  using (auth_user_id = auth.uid() or public.is_admin());
create policy "user_profiles: own row insert"
  on public.user_profiles for insert
  to authenticated
  with check (auth_user_id = auth.uid());
create policy "user_profiles: own row update"
  on public.user_profiles for update
  to authenticated
  using (auth_user_id = auth.uid() or public.is_admin())
  with check (auth_user_id = auth.uid() or public.is_admin());

-- Update is_admin() helper to look up by auth.uid().
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.user_profiles
    where auth_user_id = auth.uid()
      and is_admin = true
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

-- =====================================================================
-- 6) Multi-tenant tables (garage_clients, parts_listings, manual_imports)
-- =====================================================================
-- Same pattern: add auth_user_id columns, rewrite policies.

alter table public.garage_clients
  add column if not exists garage_auth_user_id uuid references auth.users(id) on delete cascade,
  add column if not exists rider_auth_user_id  uuid references auth.users(id) on delete cascade;

update public.garage_clients g
  set garage_auth_user_id = m.supabase_user_id
  from public._auth_migration_map m
  where g.garage_user_id = m.clerk_user_id
    and g.garage_auth_user_id is null;
update public.garage_clients g
  set rider_auth_user_id = m.supabase_user_id
  from public._auth_migration_map m
  where g.rider_user_id = m.clerk_user_id
    and g.rider_auth_user_id is null;

drop policy if exists "garage_clients: rider read own" on public.garage_clients;
drop policy if exists "garage_clients: garage request" on public.garage_clients;
drop policy if exists "garage_clients: rider grant" on public.garage_clients;

create policy "garage_clients: read own"
  on public.garage_clients for select
  to authenticated
  using (
    rider_auth_user_id = auth.uid()
    or garage_auth_user_id = auth.uid()
    or public.is_admin()
  );
create policy "garage_clients: garage insert"
  on public.garage_clients for insert
  to authenticated
  with check (garage_auth_user_id = auth.uid());
create policy "garage_clients: rider update"
  on public.garage_clients for update
  to authenticated
  using (rider_auth_user_id = auth.uid())
  with check (rider_auth_user_id = auth.uid());

alter table public.parts_listings
  add column if not exists supplier_auth_user_id uuid references auth.users(id) on delete cascade;

update public.parts_listings p
  set supplier_auth_user_id = m.supabase_user_id
  from public._auth_migration_map m
  where p.supplier_user_id = m.clerk_user_id
    and p.supplier_auth_user_id is null;

drop policy if exists "parts_listings: supplier write own" on public.parts_listings;
create policy "parts_listings: supplier write own"
  on public.parts_listings for all
  to authenticated
  using (supplier_auth_user_id = auth.uid())
  with check (supplier_auth_user_id = auth.uid());

-- =====================================================================
-- HOW TO MIGRATE YOUR DATA (run AFTER signing up via Supabase Auth)
-- =====================================================================
-- Step 1: sign up at https://sidestand.app with the same email you used
--         on Clerk. This creates a row in auth.users.
-- Step 2: find your new auth user id:
--           select id, email from auth.users order by created_at desc limit 5;
-- Step 3: insert the mapping (replace the placeholder uuid):
--           insert into public._auth_migration_map (clerk_user_id, supabase_user_id)
--           values
--             ('user_3ChotU4zf3nXMWfeF4k2gM4SNJ0', '<paste-your-auth.users.id-here>');
-- Step 4: re-run this migration's UPDATE statements to back-fill
--         auth_user_id columns on existing rows. Easiest:
--           update public.garage_bikes b
--             set auth_user_id = m.supabase_user_id
--             from public._auth_migration_map m
--             where b.user_id = m.clerk_user_id
--               and b.auth_user_id is null;
--           -- repeat for service_entries, bike_builds, bike_mods,
--           -- user_profiles, garage_clients (×2), parts_listings.
-- Step 5: refresh the app — your bikes/mods/services should appear.
