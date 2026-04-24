-- HD Build Assistant — Builds & Mods schema.
--
-- Adds two tables: bike_builds (a named project on a bike, e.g. "Stage 2
-- power build") and bike_mods (an individual part/modification on a bike,
-- optionally grouped under a build). Same RLS pattern as 001 — user_id
-- comes from the Clerk JWT's `sub` claim.
--
-- To run this migration, paste the whole file into Supabase SQL Editor
-- and click "Run".

-- =====================================================================
-- Table: bike_builds
-- =====================================================================
-- A "build" is a named project that groups related mods together. Users
-- can have multiple builds per bike over its lifetime (e.g. a "Stage 1"
-- build early on, a "Touring long-haul" build later).
create table if not exists public.bike_builds (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,                              -- Clerk user id
  bike_id uuid not null references public.garage_bikes(id) on delete cascade,
  title text not null default '',
  status text not null default 'planned',             -- planned | active | completed
  is_public boolean not null default false,           -- future share feature
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bike_builds_user_id_idx on public.bike_builds (user_id);
create index if not exists bike_builds_bike_id_idx on public.bike_builds (bike_id);

drop trigger if exists bike_builds_touch_updated_at on public.bike_builds;
create trigger bike_builds_touch_updated_at
  before update on public.bike_builds
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- Table: bike_mods
-- =====================================================================
-- A mod is one installed (or planned) aftermarket/OEM part. build_id is
-- nullable so mods can be logged standalone without being grouped into a
-- named build.
create table if not exists public.bike_mods (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,                              -- Clerk user id
  bike_id uuid not null references public.garage_bikes(id) on delete cascade,
  build_id uuid references public.bike_builds(id) on delete set null,
  title text not null default '',
  category text not null default '',                  -- see modCategories.js
  status text not null default 'planned',             -- planned | installed | removed
  brand text not null default '',                     -- free-form (OEM, S&S, Vance & Hines, etc.)
  part_number text not null default '',
  vendor text not null default '',                    -- where purchased
  source_url text not null default '',
  cost numeric(10,2),
  install_date date,
  install_mileage int,
  remove_date date,
  notes text not null default '',
  is_public boolean not null default false,           -- future share feature
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bike_mods_user_id_idx on public.bike_mods (user_id);
create index if not exists bike_mods_bike_id_idx on public.bike_mods (bike_id);
create index if not exists bike_mods_build_id_idx on public.bike_mods (build_id);

drop trigger if exists bike_mods_touch_updated_at on public.bike_mods;
create trigger bike_mods_touch_updated_at
  before update on public.bike_mods
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- Row-level security
-- =====================================================================
alter table public.bike_builds enable row level security;
alter table public.bike_mods enable row level security;

-- bike_builds policies
drop policy if exists "bike_builds: owner can select" on public.bike_builds;
create policy "bike_builds: owner can select"
  on public.bike_builds for select
  using (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "bike_builds: owner can insert" on public.bike_builds;
create policy "bike_builds: owner can insert"
  on public.bike_builds for insert
  with check (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "bike_builds: owner can update" on public.bike_builds;
create policy "bike_builds: owner can update"
  on public.bike_builds for update
  using (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "bike_builds: owner can delete" on public.bike_builds;
create policy "bike_builds: owner can delete"
  on public.bike_builds for delete
  using (user_id = (auth.jwt() ->> 'sub'));

-- bike_mods policies
drop policy if exists "bike_mods: owner can select" on public.bike_mods;
create policy "bike_mods: owner can select"
  on public.bike_mods for select
  using (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "bike_mods: owner can insert" on public.bike_mods;
create policy "bike_mods: owner can insert"
  on public.bike_mods for insert
  with check (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "bike_mods: owner can update" on public.bike_mods;
create policy "bike_mods: owner can update"
  on public.bike_mods for update
  using (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "bike_mods: owner can delete" on public.bike_mods;
create policy "bike_mods: owner can delete"
  on public.bike_mods for delete
  using (user_id = (auth.jwt() ->> 'sub'));

-- Revoke blanket public/anon access. RLS handles it but be explicit.
revoke all on public.bike_builds from anon;
revoke all on public.bike_mods from anon;
grant select, insert, update, delete on public.bike_builds to authenticated;
grant select, insert, update, delete on public.bike_mods to authenticated;
