-- Sidestand — service-manual data model.
--
-- Background: until now, all service procedures lived in a single
-- src/data/jobs.js bundle (~530 entries, ~13.6kLOC). That doesn't scale
-- to many manufacturers, many manuals, premium tiers, or fast search.
-- This migration moves procedures into Supabase with a real schema.
--
-- Hierarchy:
--   manufacturer (Harley-Davidson, Indian, Honda, ...)
--     manual    (one service-manual book — title, year range, models)
--       chapter   (Maintenance, Engine, Transmission, ...)
--         procedure   (the unit a rider actually performs)
--           tools, parts, fluids, torque, warnings, steps
--
-- Authoring: admins (flagged in user_profiles.is_admin) can write all
-- tables. Riders are read-only on procedures, and only see those
-- flagged is_clean = true (paraphrased + safe to publish) AND tier
-- they have access to (free for everyone for now; premium gated later).
--
-- Service intervals: moved into the same DB so Honda intervals can
-- coexist with HD intervals. Intervals are ALWAYS free, regardless of
-- the manual's tier — this matches the rule "service intervals should
-- be accessible for free users."
--
-- Run in Supabase SQL Editor.

-- =====================================================================
-- 0) USER PROFILES — admin flag
-- =====================================================================
-- We don't have a user-profiles table yet (Clerk holds the auth, and
-- everything else is per-user keyed in localStorage + per-row user_id
-- columns on existing tables). Add a small profile row keyed by Clerk
-- user id (text, since that's what the JWT 'sub' claim is).
create table if not exists public.user_profiles (
  clerk_user_id text primary key,
  is_admin      boolean not null default false,
  display_name  text,
  logo_url      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

-- Anyone authenticated can read their own profile.
drop policy if exists "user_profiles: own row read" on public.user_profiles;
create policy "user_profiles: own row read"
  on public.user_profiles for select
  to authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'));

-- Anyone authenticated can insert/update their own profile (display
-- name + logo_url etc.). They CANNOT toggle is_admin; that column is
-- protected by a trigger below.
drop policy if exists "user_profiles: own row write" on public.user_profiles;
create policy "user_profiles: own row write"
  on public.user_profiles for insert
  to authenticated
  with check (clerk_user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "user_profiles: own row update" on public.user_profiles;
create policy "user_profiles: own row update"
  on public.user_profiles for update
  to authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'))
  with check (clerk_user_id = (auth.jwt() ->> 'sub'));

-- Trigger: a user cannot self-promote to admin. is_admin can only be
-- changed by another admin OR via direct SQL / service-role context
-- (no JWT present), which is fine because that's only available to
-- the project owner via the Supabase dashboard.
--
-- The early return when jwt_sub is null is what lets the seed insert
-- below land with is_admin = true — at migration time there's no
-- JWT, so the trigger gets out of its own way.
create or replace function public.user_profiles_protect_admin()
returns trigger
language plpgsql
security definer
as $$
declare
  jwt_sub text := auth.jwt() ->> 'sub';
begin
  -- No JWT = direct SQL, service role, or migration. Allow anything.
  if jwt_sub is null then
    return new;
  end if;

  if tg_op = 'INSERT' and new.is_admin = true then
    -- New rows start as non-admin unless inserted by an existing admin.
    if not exists (
      select 1 from public.user_profiles
      where clerk_user_id = jwt_sub and is_admin = true
    ) then
      new.is_admin := false;
    end if;
  elsif tg_op = 'UPDATE' and new.is_admin is distinct from old.is_admin then
    if not exists (
      select 1 from public.user_profiles
      where clerk_user_id = jwt_sub and is_admin = true
    ) then
      new.is_admin := old.is_admin;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists user_profiles_protect_admin_trg on public.user_profiles;
create trigger user_profiles_protect_admin_trg
  before insert or update on public.user_profiles
  for each row execute function public.user_profiles_protect_admin();

grant select, insert, update on public.user_profiles to authenticated;

-- Seed: Waseem (project owner) as the first admin. This is the one
-- bootstrap insert; subsequent admin promotions go through SQL.
insert into public.user_profiles (clerk_user_id, is_admin, display_name)
values ('user_3ChotU4zf3nXMWfeF4k2gM4SNJ0', true, 'Waseem')
on conflict (clerk_user_id)
do update set is_admin = true;

-- Helper: is the current JWT bearer an admin?  Used by RLS policies
-- below so we don't repeat the lookup.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.user_profiles
    where clerk_user_id = (auth.jwt() ->> 'sub')
      and is_admin = true
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

-- =====================================================================
-- 1) MANUALS
-- =====================================================================
-- A manual is one service-manual book. We keep year ranges + a
-- model_codes array so a manual can apply to many specific bikes
-- (eg. "2017–2023 HD Touring" covers Street Glide, Road Glide, etc.).
create table if not exists public.manuals (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,           -- 'hd-touring-2017-2023'
  manufacturer    text not null,                  -- 'Harley-Davidson', 'Indian', ...
  title           text not null,                  -- '2020 HD Touring Service Manual'
  family          text,                           -- 'Touring' / 'Softail' (manufacturer's grouping)
  year_from       integer,
  year_to         integer,
  model_codes     text[] default '{}',            -- ['FLHX', 'FLTRX', ...] for filtering by model
  tier            text not null default 'free',   -- 'free' | 'premium'
  -- Private audit columns — never displayed to riders unless the
  -- procedure has been audited & rewritten (is_clean=true on the
  -- procedure). Staying private here so even an admin's accidental
  -- copy-paste doesn't leak through the public API.
  source_pdf      text,
  source_owner    text,                           -- copyright holder ('Harley-Davidson, Inc.')
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists manuals_manufacturer_idx on public.manuals (manufacturer);
create index if not exists manuals_year_idx on public.manuals (year_from, year_to);
create index if not exists manuals_tier_idx on public.manuals (tier);

alter table public.manuals enable row level security;

-- Public can read FREE manuals; premium manuals only visible to
-- authenticated users (will gate by purchased entitlements later, for
-- now treat any signed-in user as "has free tier" only).
drop policy if exists "manuals: public read free" on public.manuals;
create policy "manuals: public read free"
  on public.manuals for select
  to anon, authenticated
  using (tier = 'free' or public.is_admin());

-- Admins can write everything.
drop policy if exists "manuals: admin write" on public.manuals;
create policy "manuals: admin write"
  on public.manuals for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.manuals to anon, authenticated;
grant insert, update, delete on public.manuals to authenticated;

-- =====================================================================
-- 2) CHAPTERS
-- =====================================================================
-- One row per chapter within a manual. sort_order drives display order
-- in the procedure browser.
create table if not exists public.chapters (
  id          uuid primary key default gen_random_uuid(),
  manual_id   uuid not null references public.manuals(id) on delete cascade,
  slug        text not null,                       -- 'maintenance', 'engine', etc.
  name        text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  unique (manual_id, slug)
);

create index if not exists chapters_manual_idx on public.chapters (manual_id, sort_order);

alter table public.chapters enable row level security;

-- Inherit visibility from the parent manual (free/premium).
drop policy if exists "chapters: read inherit manual" on public.chapters;
create policy "chapters: read inherit manual"
  on public.chapters for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.manuals m
      where m.id = chapters.manual_id
        and (m.tier = 'free' or public.is_admin())
    )
  );

drop policy if exists "chapters: admin write" on public.chapters;
create policy "chapters: admin write"
  on public.chapters for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.chapters to anon, authenticated;
grant insert, update, delete on public.chapters to authenticated;

-- =====================================================================
-- 3) PROCEDURES
-- =====================================================================
-- The unit a rider actually performs. is_clean gates public visibility
-- — until an admin marks a procedure clean (paraphrased + audited),
-- non-admins can't read it.
create table if not exists public.procedures (
  id              uuid primary key default gen_random_uuid(),
  chapter_id      uuid not null references public.chapters(id) on delete cascade,
  -- Slug is unique within a chapter so URLs stay clean across re-imports.
  slug            text not null,
  -- Legacy ID from src/data/jobs.js (eg. 'cvo18-air-filter') so existing
  -- service log entries that reference these jobs by id keep working.
  -- Populated by the ingestion script; new procedures can leave null.
  legacy_id       text unique,
  title           text not null,
  summary         text,
  difficulty      text,                            -- 'Easy' | 'Moderate' | 'Advanced'
  time_minutes    integer,
  -- bikes this procedure applies to (catalog ids from the bikes.js
  -- catalog — same shape as garage_bikes.bike_type_id). Empty array
  -- means "applies to all bikes covered by the parent manual."
  applies_to      text[] default '{}',
  -- Tier override: usually inherits from the parent manual, but can
  -- be set on individual procedures (eg. all of "Engine" is premium
  -- but the oil-change is free as a teaser).
  tier            text not null default 'free',
  -- Audit / safety:
  is_clean        boolean not null default false,  -- has been paraphrased + reviewed
  source_page     integer,                         -- private; for admin verification only
  source_section  text,                            -- private
  -- Full-text search vector — generated column, no triggers needed.
  search_text     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (chapter_id, slug)
);

create index if not exists procedures_chapter_idx on public.procedures (chapter_id);
create index if not exists procedures_legacy_idx on public.procedures (legacy_id);
create index if not exists procedures_clean_idx on public.procedures (is_clean) where is_clean = true;
create index if not exists procedures_tier_idx on public.procedures (tier);
-- Full-text search index. tsvector is computed at query time from the
-- search_text column for simplicity; if this gets slow we'll swap to
-- a generated tsvector column with a GIN index.
create index if not exists procedures_search_idx
  on public.procedures using gin (to_tsvector('english', coalesce(search_text, '')));

alter table public.procedures enable row level security;

-- Public can read CLEAN + FREE procedures whose parent manual is FREE.
-- Premium procedures need authenticated user (and later: purchased
-- entitlement). Admins read everything regardless.
drop policy if exists "procedures: public read clean free" on public.procedures;
create policy "procedures: public read clean free"
  on public.procedures for select
  to anon, authenticated
  using (
    public.is_admin() or (
      is_clean = true
      and tier = 'free'
      and exists (
        select 1
        from public.chapters c
        join public.manuals m on m.id = c.manual_id
        where c.id = procedures.chapter_id
          and m.tier = 'free'
      )
    )
  );

drop policy if exists "procedures: admin write" on public.procedures;
create policy "procedures: admin write"
  on public.procedures for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.procedures to anon, authenticated;
grant insert, update, delete on public.procedures to authenticated;

-- =====================================================================
-- 4) PROCEDURE COMPONENT TABLES (tools, parts, fluids, torque, warnings, steps)
-- =====================================================================
-- All inherit visibility from the parent procedure via RLS. All have
-- sort_order so the UI renders them in deterministic order.

create table if not exists public.procedure_tools (
  id            uuid primary key default gen_random_uuid(),
  procedure_id  uuid not null references public.procedures(id) on delete cascade,
  name          text not null,
  note          text,
  sort_order    integer not null default 0
);
create index if not exists procedure_tools_proc_idx on public.procedure_tools (procedure_id, sort_order);

create table if not exists public.procedure_parts (
  id            uuid primary key default gen_random_uuid(),
  procedure_id  uuid not null references public.procedures(id) on delete cascade,
  part_number   text,
  description   text not null,
  qty           integer,
  note          text,
  sort_order    integer not null default 0
);
create index if not exists procedure_parts_proc_idx on public.procedure_parts (procedure_id, sort_order);

create table if not exists public.procedure_fluids (
  id            uuid primary key default gen_random_uuid(),
  procedure_id  uuid not null references public.procedures(id) on delete cascade,
  name          text not null,
  capacity      text,
  note          text,
  sort_order    integer not null default 0
);
create index if not exists procedure_fluids_proc_idx on public.procedure_fluids (procedure_id, sort_order);

create table if not exists public.procedure_torque (
  id            uuid primary key default gen_random_uuid(),
  procedure_id  uuid not null references public.procedures(id) on delete cascade,
  fastener      text not null,
  value         text not null,
  note          text,
  sort_order    integer not null default 0
);
create index if not exists procedure_torque_proc_idx on public.procedure_torque (procedure_id, sort_order);

create table if not exists public.procedure_warnings (
  id            uuid primary key default gen_random_uuid(),
  procedure_id  uuid not null references public.procedures(id) on delete cascade,
  -- 'warning' = serious safety, 'caution' = damage risk, 'notice' = info
  level         text not null default 'warning',
  text          text not null,
  sort_order    integer not null default 0
);
create index if not exists procedure_warnings_proc_idx on public.procedure_warnings (procedure_id, sort_order);

create table if not exists public.procedure_steps (
  id            uuid primary key default gen_random_uuid(),
  procedure_id  uuid not null references public.procedures(id) on delete cascade,
  step_number   integer not null,
  body          text not null,
  warning       text,                              -- inline warning attached to this step
  note          text,                              -- inline tip / clarification
  image_url     text,                              -- optional figure
  sort_order    integer not null default 0,
  unique (procedure_id, step_number)
);
create index if not exists procedure_steps_proc_idx on public.procedure_steps (procedure_id, sort_order);

-- Apply the same RLS pattern to every component table:
--   - Read: visible if the parent procedure is visible
--   - Write: admin only
do $$
declare
  t text;
begin
  foreach t in array array[
    'procedure_tools',
    'procedure_parts',
    'procedure_fluids',
    'procedure_torque',
    'procedure_warnings',
    'procedure_steps'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);

    execute format(
      $f$
      drop policy if exists "%1$s: read inherit procedure" on public.%1$I;
      create policy "%1$s: read inherit procedure"
        on public.%1$I for select
        to anon, authenticated
        using (
          public.is_admin() or exists (
            select 1
            from public.procedures p
            join public.chapters c on c.id = p.chapter_id
            join public.manuals m on m.id = c.manual_id
            where p.id = %1$I.procedure_id
              and p.is_clean = true
              and p.tier = 'free'
              and m.tier = 'free'
          )
        );
      $f$, t);

    execute format(
      $f$
      drop policy if exists "%1$s: admin write" on public.%1$I;
      create policy "%1$s: admin write"
        on public.%1$I for all
        to authenticated
        using (public.is_admin())
        with check (public.is_admin());
      $f$, t);

    execute format('grant select on public.%I to anon, authenticated;', t);
    execute format(
      'grant insert, update, delete on public.%I to authenticated;', t);
  end loop;
end $$;

-- =====================================================================
-- 5) SERVICE INTERVALS — ALWAYS FREE
-- =====================================================================
-- Recommended service intervals. ALWAYS publicly readable, regardless
-- of the parent manual's tier — matches the rule that intervals stay
-- free for everyone.
--
-- An interval can be tied to a manual (manufacturer's specific
-- recommendation) or be standalone (general best practice).
create table if not exists public.service_intervals (
  id              uuid primary key default gen_random_uuid(),
  -- Stable text id so the existing serviceIntervals.js code can match
  -- service entries to intervals by id without a full DB round-trip
  -- after we wire this up.
  legacy_id       text unique,
  manual_id       uuid references public.manuals(id) on delete set null,
  slug            text not null,
  label           text not null,
  description     text,
  -- Mileage-based: do this every N miles, first due at M.
  first_due_miles integer,
  every_miles     integer,
  -- match-string array used to find a service entry that satisfies
  -- this interval (fuzzy substring match against entry.title).
  match_terms     text[] default '{}',
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  unique (manual_id, slug)
);

create index if not exists service_intervals_manual_idx on public.service_intervals (manual_id, sort_order);
create index if not exists service_intervals_legacy_idx on public.service_intervals (legacy_id);

alter table public.service_intervals enable row level security;

-- Always free, always public-readable (anon AND authenticated).
drop policy if exists "service_intervals: public read" on public.service_intervals;
create policy "service_intervals: public read"
  on public.service_intervals for select
  to anon, authenticated
  using (true);

drop policy if exists "service_intervals: admin write" on public.service_intervals;
create policy "service_intervals: admin write"
  on public.service_intervals for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.service_intervals to anon, authenticated;
grant insert, update, delete on public.service_intervals to authenticated;

-- =====================================================================
-- 6) updated_at triggers — keep timestamps honest
-- =====================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists manuals_touch on public.manuals;
create trigger manuals_touch before update on public.manuals
  for each row execute function public.touch_updated_at();

drop trigger if exists procedures_touch on public.procedures;
create trigger procedures_touch before update on public.procedures
  for each row execute function public.touch_updated_at();

drop trigger if exists user_profiles_touch on public.user_profiles;
create trigger user_profiles_touch before update on public.user_profiles
  for each row execute function public.touch_updated_at();
