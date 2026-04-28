-- Sidestand — multi-tenant foundations + dev visibility flip.
--
-- Two things in this migration:
--
--   1. Lay down the schema for the future 3-sided platform:
--        rider    — the default; uses Sidestand to track their bikes (free)
--        garage   — a shop tracking many customers' bikes (paid, eventually)
--        supplier — a parts/merch seller listed in the directory (paid)
--      We're NOT exposing any of this in the UI yet. The point is to
--      stake out columns + tables so when we DO turn on garage / supplier
--      flows, no rider data has to migrate.
--
--   2. Flip every imported procedure to is_clean=true so riders see
--      something during dev. We'll re-tighten this once the audit/UI
--      for marking individual procedures clean is in place.
--
-- Run in Supabase SQL Editor.

-- =====================================================================
-- 1) account_type on user_profiles
-- =====================================================================
-- An enum-like text column (text + check constraint, not a real ENUM,
-- so we can add new types later without ALTER TYPE pain).
alter table public.user_profiles
  add column if not exists account_type text not null default 'rider';

alter table public.user_profiles
  drop constraint if exists user_profiles_account_type_check;

alter table public.user_profiles
  add constraint user_profiles_account_type_check
  check (account_type in ('rider', 'garage', 'supplier'));

create index if not exists user_profiles_account_type_idx
  on public.user_profiles (account_type);

-- =====================================================================
-- 2) garage_clients — links a garage account to a rider's bikes
-- =====================================================================
-- The garage requests access; the rider grants it. Access starts
-- read-only ("can view my service log") and can be upgraded by the
-- rider to read-write ("can log services on my behalf").
--
-- We don't enable RLS-driven sharing of bikes yet; this table just
-- holds the relationship. Garage UI flows will land in a later phase.
create table if not exists public.garage_clients (
  id              uuid primary key default gen_random_uuid(),
  garage_user_id  text not null,                  -- Clerk user id of the garage account
  rider_user_id   text not null,                  -- Clerk user id of the rider
  bike_id         uuid references public.garage_bikes(id) on delete cascade,
  -- access scope:
  --   'view'  : garage can read service log + mods
  --   'log'   : garage can also write service entries
  --   'full'  : garage can also edit bike, mods, mileage
  access_level    text not null default 'view'
                  check (access_level in ('view', 'log', 'full')),
  -- workflow:
  --   'requested' : garage asked, waiting on rider
  --   'active'    : rider granted access
  --   'paused'    : rider revoked access (kept for audit/history)
  status          text not null default 'requested'
                  check (status in ('requested', 'active', 'paused')),
  granted_at      timestamptz,
  revoked_at      timestamptz,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (garage_user_id, bike_id)
);

create index if not exists garage_clients_garage_idx
  on public.garage_clients (garage_user_id, status);
create index if not exists garage_clients_rider_idx
  on public.garage_clients (rider_user_id, status);
create index if not exists garage_clients_bike_idx
  on public.garage_clients (bike_id);

alter table public.garage_clients enable row level security;

-- Rider sees their own bike's relationships; garage sees their own
-- client relationships. Admins see everything.
drop policy if exists "garage_clients: rider read own" on public.garage_clients;
create policy "garage_clients: rider read own"
  on public.garage_clients for select
  to authenticated
  using (
    rider_user_id = (auth.jwt() ->> 'sub')
    or garage_user_id = (auth.jwt() ->> 'sub')
    or public.is_admin()
  );

-- Garage account requests access (insert their own row).
drop policy if exists "garage_clients: garage request" on public.garage_clients;
create policy "garage_clients: garage request"
  on public.garage_clients for insert
  to authenticated
  with check (garage_user_id = (auth.jwt() ->> 'sub'));

-- Rider grants/revokes access (updates rows where they're the rider).
-- Garage can't change status — only the rider holds that.
drop policy if exists "garage_clients: rider grant" on public.garage_clients;
create policy "garage_clients: rider grant"
  on public.garage_clients for update
  to authenticated
  using (rider_user_id = (auth.jwt() ->> 'sub'))
  with check (rider_user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "garage_clients: admin write" on public.garage_clients;
create policy "garage_clients: admin write"
  on public.garage_clients for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update on public.garage_clients to authenticated;

drop trigger if exists garage_clients_touch on public.garage_clients;
create trigger garage_clients_touch before update on public.garage_clients
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- 3) parts_listings — supplier inventory (schema only)
-- =====================================================================
-- One row per part offered by a supplier. The directory feature shows
-- listings publicly (riders browse + click out to buy). No checkout
-- in-platform yet.
create table if not exists public.parts_listings (
  id                uuid primary key default gen_random_uuid(),
  supplier_user_id  text not null,                  -- Clerk user id of the supplier
  -- product fields
  title             text not null,
  brand             text,
  part_number       text,
  category          text,                           -- 'engine', 'exhaust', 'lighting', etc.
  fits_models       text[] default '{}',            -- model codes ('FLHX', 'FXBR', ...)
  fits_year_from    integer,
  fits_year_to      integer,
  description       text,
  price_cents       integer,                        -- store cents to avoid float math
  currency          text default 'USD',
  -- where to send the rider when they click "buy"
  external_url      text,
  -- listing lifecycle
  status            text not null default 'draft'
                    check (status in ('draft', 'active', 'paused', 'archived')),
  -- supplier-uploaded photo URLs (in order)
  image_urls        text[] default '{}',
  -- search
  search_text       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists parts_listings_supplier_idx
  on public.parts_listings (supplier_user_id, status);
create index if not exists parts_listings_status_idx
  on public.parts_listings (status);
create index if not exists parts_listings_category_idx
  on public.parts_listings (category);
create index if not exists parts_listings_search_idx
  on public.parts_listings using gin (to_tsvector('english', coalesce(search_text, '')));

alter table public.parts_listings enable row level security;

-- Public can read ACTIVE listings. Supplier reads their own at any
-- status (including drafts). Admins see everything.
drop policy if exists "parts_listings: public read active" on public.parts_listings;
create policy "parts_listings: public read active"
  on public.parts_listings for select
  to anon, authenticated
  using (
    status = 'active'
    or supplier_user_id = (auth.jwt() ->> 'sub')
    or public.is_admin()
  );

-- Suppliers manage their own listings.
drop policy if exists "parts_listings: supplier write own" on public.parts_listings;
create policy "parts_listings: supplier write own"
  on public.parts_listings for all
  to authenticated
  using (supplier_user_id = (auth.jwt() ->> 'sub'))
  with check (supplier_user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "parts_listings: admin write" on public.parts_listings;
create policy "parts_listings: admin write"
  on public.parts_listings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.parts_listings to anon, authenticated;
grant insert, update, delete on public.parts_listings to authenticated;

drop trigger if exists parts_listings_touch on public.parts_listings;
create trigger parts_listings_touch before update on public.parts_listings
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- 4) manual_imports — audit trail of what was imported, when, by whom
-- =====================================================================
-- Future-you wants to know "I imported 2024 Indian Chief manual on
-- Apr 30, 2026." This table holds that history.
create table if not exists public.manual_imports (
  id                uuid primary key default gen_random_uuid(),
  manual_id         uuid references public.manuals(id) on delete set null,
  imported_by       text,                           -- Clerk user id (or 'script' / 'cli')
  source_file       text,                           -- e.g. '2024-indian-chief.json'
  source_format     text,                           -- 'json', 'jobs.js-legacy', etc.
  procedures_added  integer not null default 0,
  procedures_updated integer not null default 0,
  steps_added       integer not null default 0,
  notes             text,
  created_at        timestamptz not null default now()
);

create index if not exists manual_imports_manual_idx
  on public.manual_imports (manual_id, created_at desc);

alter table public.manual_imports enable row level security;

-- Admin-only read + write. Riders never see import history.
drop policy if exists "manual_imports: admin all" on public.manual_imports;
create policy "manual_imports: admin all"
  on public.manual_imports for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update, delete on public.manual_imports to authenticated;

-- =====================================================================
-- 5) DEV: flip imported procedures to clean
-- =====================================================================
-- During development the user wants to see the imported procedures
-- without auditing each one for paraphrasing first. Risk acknowledged
-- — content audit comes later. We flip everything currently is_clean
-- = false to is_clean = true. Newly-imported procedures going forward
-- will still default to is_clean = false (the migration 006 column
-- default), so the audit gate still applies to fresh content.
update public.procedures
  set is_clean = true
  where is_clean = false;
