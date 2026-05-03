-- Migration 019 — suggested_rides (admin-curated routes) + ratings
--
-- Why this migration exists:
--
--   Phase 2 of Discover. The existing nearby_public_rides RPC handles
--   user-RECORDED public rides — those flow through the rides table
--   and the existing share-to-public toggle. This migration adds a
--   parallel surface for ADMIN-CURATED iconic routes ("Hatta Loop",
--   "Stelvio Pass", "Tail of the Dragon") that were never ridden on
--   Sidestand but should still appear in Discover from day one.
--
--   The two surfaces are deliberately separate:
--     - Different write paths: user recordings flow through the rides
--       table via the existing share toggle (only authentic GPS data
--       — no GPX uploads, no hand-drawn routes — is the product rule).
--       Curated content flows through a service-role-only seed script.
--     - Different RLS: rides has per-owner RLS + public-read for
--       is_public; suggested_rides is public-read for is_published
--       only, no client writes. Both keep their own integrity model.
--     - Different metadata: curated routes carry difficulty, riding
--       style, recommended bike type, season, surface, POIs — guidance
--       fields that don't apply to a recorded trip.
--
--   Discover.jsx queries both in parallel and renders them merged
--   with distinct badges so users see CURATED vs RECORDED.
--
--   Ratings live on suggested_rides (Phase 2 scope). Adding ratings
--   to user-recorded public rides is a separate Phase 2B once we
--   decide on cross-table shape.
--
-- Run in Supabase SQL Editor.

-- =====================================================================
-- 1) suggested_rides table
-- =====================================================================

create table if not exists public.suggested_rides (
  id            uuid primary key default gen_random_uuid(),
  -- 'curated_admin' is the only value today. The column exists so we
  -- can layer on additional sources later (e.g., 'recorded' if we
  -- decide to promote recorded rides into this table for unified
  -- discovery, or per-import-source tags like 'scenic_imported').
  source        text not null default 'curated_admin'
                check (source in ('curated_admin', 'recorded')),
  -- Optional contributor attribution. NULL for plain admin seeds.
  contributed_by_user_id uuid references auth.users(id) on delete set null,

  -- Display
  title         text not null,
  description   text,
  region        text,                  -- 'UAE / Hatta', 'USA / Pacific NW', etc.

  -- Route geometry. JSONB array of [lat, lng] pairs (no timestamps —
  -- these are routes-to-follow, not timed tracks). We store privacy-
  -- ready. For curated routes the start/end are intentionally public
  -- landmarks so no trimming is needed.
  route         jsonb not null,

  -- Pre-computed bbox for fast geographic range queries.
  bbox_min_lat  double precision,
  bbox_max_lat  double precision,
  bbox_min_lng  double precision,
  bbox_max_lng  double precision,

  -- Stats
  distance_m                integer,
  duration_estimate_seconds integer,    -- estimated planning time, not measured

  -- Guidance metadata
  difficulty       text check (difficulty in ('easy', 'moderate', 'expert') or difficulty is null),
  riding_style     text[] not null default '{}'::text[],   -- 'scenic','twisty','highway','gravel','urban'
  bike_type        text[] not null default '{}'::text[],   -- 'touring','softail','sport','adv','cruiser'
  surface          text check (surface in ('paved', 'mixed', 'gravel') or surface is null),
  season_recommended text,              -- 'summer','year-round','spring-fall', etc.
  tags             text[] not null default '{}'::text[],
  points_of_interest jsonb not null default '[]'::jsonb,   -- [{name, lat, lng, kind}]
  photo_urls       text[] not null default '{}'::text[],

  -- Source attribution
  external_url     text,                -- original Komoot/Scenic/Kurviger link
  gpx_attribution  text,                -- credit the original creator

  -- Aggregate rating (maintained by trigger on suggested_ride_ratings)
  rating_sum       integer not null default 0,
  rating_count     integer not null default 0,

  -- Moderation
  is_published     boolean not null default false,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Geographic range queries: filter by bbox-overlap + published.
create index if not exists suggested_rides_bbox_published_idx
  on public.suggested_rides (bbox_min_lat, bbox_max_lat, bbox_min_lng, bbox_max_lng)
  where is_published = true;

-- Region browse and "newest" listings.
create index if not exists suggested_rides_region_idx
  on public.suggested_rides (region)
  where is_published = true;

create index if not exists suggested_rides_recent_idx
  on public.suggested_rides (created_at desc)
  where is_published = true;

-- touch_updated_at() defined in migration 001.
drop trigger if exists suggested_rides_touch_updated_at on public.suggested_rides;
create trigger suggested_rides_touch_updated_at
  before update on public.suggested_rides
  for each row execute function public.touch_updated_at();

-- RLS — public can read published rows. Contributors can read their
-- own unpublished rows (for future "your submissions" view). All
-- writes go through SECURITY DEFINER RPCs / service role only.
alter table public.suggested_rides enable row level security;

drop policy if exists "suggested_rides: published read" on public.suggested_rides;
create policy "suggested_rides: published read"
  on public.suggested_rides for select
  using (is_published = true);

drop policy if exists "suggested_rides: contributor read own" on public.suggested_rides;
create policy "suggested_rides: contributor read own"
  on public.suggested_rides for select
  to authenticated
  using (contributed_by_user_id = auth.uid());

-- No insert/update/delete policy for client roles — service role and
-- SECURITY DEFINER functions are the only writers.
revoke all on public.suggested_rides from anon, authenticated;
grant select on public.suggested_rides to anon, authenticated;

-- =====================================================================
-- 2) suggested_ride_ratings — one rating per user per route
-- =====================================================================

create table if not exists public.suggested_ride_ratings (
  ride_id    uuid not null references public.suggested_rides(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  rating     int  not null check (rating between 1 and 5),
  review     text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (ride_id, user_id)
);

create index if not exists suggested_ride_ratings_ride_idx
  on public.suggested_ride_ratings (ride_id);

drop trigger if exists suggested_ride_ratings_touch_updated_at on public.suggested_ride_ratings;
create trigger suggested_ride_ratings_touch_updated_at
  before update on public.suggested_ride_ratings
  for each row execute function public.touch_updated_at();

alter table public.suggested_ride_ratings enable row level security;

-- Anyone can read ratings (so the UI can show review text from others).
drop policy if exists "ratings: read all" on public.suggested_ride_ratings;
create policy "ratings: read all"
  on public.suggested_ride_ratings for select
  using (true);

-- Owner can upsert their own rating. We rely on the rate_suggested_ride
-- RPC for the canonical write path, but allow direct upsert for the
-- caller-owns-it case so the client doesn't have to round-trip an RPC
-- if they're editing their own rating inline.
drop policy if exists "ratings: own insert" on public.suggested_ride_ratings;
create policy "ratings: own insert"
  on public.suggested_ride_ratings for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "ratings: own update" on public.suggested_ride_ratings;
create policy "ratings: own update"
  on public.suggested_ride_ratings for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "ratings: own delete" on public.suggested_ride_ratings;
create policy "ratings: own delete"
  on public.suggested_ride_ratings for delete
  to authenticated
  using (user_id = auth.uid());

revoke all on public.suggested_ride_ratings from anon;
grant select on public.suggested_ride_ratings to anon, authenticated;
grant insert, update, delete on public.suggested_ride_ratings to authenticated;

-- =====================================================================
-- 3) Aggregate maintenance trigger
-- =====================================================================
-- Keeps suggested_rides.rating_sum + rating_count fresh on every
-- insert/update/delete. Without this, every list query that wants
-- to sort by avg rating would have to GROUP BY across the ratings
-- table — fine at small scale, but free to avoid via this trigger.

create or replace function public.update_suggested_ride_rating_aggregate()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    update public.suggested_rides
       set rating_sum   = rating_sum + NEW.rating,
           rating_count = rating_count + 1
     where id = NEW.ride_id;
  elsif TG_OP = 'UPDATE' then
    update public.suggested_rides
       set rating_sum = rating_sum + (NEW.rating - OLD.rating)
     where id = NEW.ride_id;
  elsif TG_OP = 'DELETE' then
    update public.suggested_rides
       set rating_sum   = rating_sum - OLD.rating,
           rating_count = rating_count - 1
     where id = OLD.ride_id;
  end if;
  return null;
end;
$$;

drop trigger if exists suggested_ride_ratings_aggregate
  on public.suggested_ride_ratings;
create trigger suggested_ride_ratings_aggregate
  after insert or update or delete on public.suggested_ride_ratings
  for each row execute function public.update_suggested_ride_rating_aggregate();

-- =====================================================================
-- 4) nearby_suggested_rides RPC
-- =====================================================================
-- Mirrors the shape of nearby_public_rides so the client can merge
-- both result sets trivially. Adds the curated-specific fields
-- (difficulty, riding_style, bike_type, rating aggregates).

create or replace function public.nearby_suggested_rides(
  p_center_lat double precision,
  p_center_lng double precision,
  p_radius_km  numeric default 50,
  p_limit      int     default 100
)
returns table (
  id              uuid,
  share_name      text,
  description     text,
  region          text,
  source          text,
  tags            text[],
  riding_style    text[],
  bike_type       text[],
  difficulty      text,
  surface         text,
  season_recommended text,
  duration_seconds integer,
  distance_m      integer,
  display_name    text,
  bike_label      text,
  rating_avg      numeric,
  rating_count    integer,
  external_url    text,
  gpx_attribution text,
  photo_urls      text[],
  route_public    jsonb,
  created_at      timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  dlat double precision := p_radius_km::double precision / 111.0;
  cos_lat double precision := greatest(0.01, cos(radians(p_center_lat)));
  dlng double precision := p_radius_km::double precision / (111.0 * cos_lat);
begin
  return query
  select
    r.id,
    r.title                                              as share_name,
    r.description,
    r.region,
    r.source,
    r.tags,
    r.riding_style,
    r.bike_type,
    r.difficulty,
    r.surface,
    r.season_recommended,
    r.duration_estimate_seconds                          as duration_seconds,
    r.distance_m,
    coalesce(r.gpx_attribution, 'Sidestand curated')     as display_name,
    -- bike_label has no meaning for curated routes — return null so
    -- the merged-shape consumer can render uniformly.
    null::text                                           as bike_label,
    case
      when r.rating_count > 0
        then round(r.rating_sum::numeric / r.rating_count, 2)
      else null
    end                                                  as rating_avg,
    r.rating_count,
    r.external_url,
    r.gpx_attribution,
    r.photo_urls,
    r.route                                              as route_public,
    r.created_at
  from public.suggested_rides r
  where r.is_published = true
    and r.bbox_min_lat is not null
    and r.bbox_max_lat >= p_center_lat - dlat
    and r.bbox_min_lat <= p_center_lat + dlat
    and r.bbox_max_lng >= p_center_lng - dlng
    and r.bbox_min_lng <= p_center_lng + dlng
  order by r.created_at desc
  limit p_limit;
end;
$$;

grant execute on function public.nearby_suggested_rides(
  double precision, double precision, numeric, int
) to anon, authenticated;

-- =====================================================================
-- 5) rate_suggested_ride RPC
-- =====================================================================
-- Convenience: upsert the caller's rating in one round-trip. The
-- RLS policy already allows direct upsert, but the RPC centralizes
-- the call site so we can later add side-effects (badge update,
-- analytics event, anti-abuse rate-limit) without touching every UI.

create or replace function public.rate_suggested_ride(
  p_ride_id uuid,
  p_rating  int,
  p_review  text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller uuid := auth.uid();
begin
  if v_caller is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'Rating must be 1-5' using errcode = '22023';
  end if;
  insert into public.suggested_ride_ratings (ride_id, user_id, rating, review)
  values (p_ride_id, v_caller, p_rating, p_review)
  on conflict (ride_id, user_id) do update
    set rating     = excluded.rating,
        review     = excluded.review,
        updated_at = now();
end;
$$;

revoke all on function public.rate_suggested_ride(uuid, int, text) from public;
grant execute on function public.rate_suggested_ride(uuid, int, text) to authenticated;
