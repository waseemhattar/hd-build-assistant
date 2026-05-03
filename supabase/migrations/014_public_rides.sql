-- Sidestand — public/community rides for the Discover feature.
--
-- Riders can opt-in to share a ride to the community. Shared rides
-- show up on the Discover map for any nearby Sidestand user. We do
-- NOT expose the raw `route` JSONB through RLS — that would leak the
-- exact GPS coordinates of every share, including the rider's home /
-- workplace at the start and end of the ride. Instead we:
--
--   1. Pre-compute a bounding box (bbox_min/max_lat/lng) so the
--      "rides near me" query is an indexed range scan.
--   2. Expose public rides ONLY through a SECURITY DEFINER RPC that
--      returns a privacy-trimmed view: the first and last
--      `share_radius_m` (default 300m) of each route are clipped off.
--   3. Keep the base rides table strictly owner-only via RLS.
--
-- Cold-start strategy is "Sidestand riders only" — Phase 1. A later
-- migration can add a separate `curated_rides` table for OSM /
-- editorial seeded routes without changing this one.
--
-- Run in Supabase SQL Editor.

-- =====================================================================
-- 1) New columns on rides
-- =====================================================================

alter table public.rides
  add column if not exists is_public boolean not null default false,
  add column if not exists share_name text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists share_radius_m integer not null default 300,
  add column if not exists bbox_min_lat double precision,
  add column if not exists bbox_max_lat double precision,
  add column if not exists bbox_min_lng double precision,
  add column if not exists bbox_max_lng double precision;

-- Index supporting the nearby-public-rides bbox-intersection query.
-- Only public rides are interesting for that query — partial index
-- keeps it small.
create index if not exists rides_public_bbox_idx
  on public.rides (bbox_min_lat, bbox_max_lat, bbox_min_lng, bbox_max_lng)
  where is_public = true;

-- =====================================================================
-- 2) Bounding-box trigger
-- =====================================================================
-- Recomputes the bbox columns from the route JSONB on insert/update.
-- Keeps the data we need for spatial queries without bringing in the
-- full PostGIS extension just for this.

create or replace function public.compute_ride_bbox()
returns trigger
language plpgsql
as $$
declare
  arr jsonb := new.route;
  pt jsonb;
  lat double precision;
  lng double precision;
  min_lat double precision := null;
  max_lat double precision := null;
  min_lng double precision := null;
  max_lng double precision := null;
  i int;
begin
  if arr is null or jsonb_typeof(arr) <> 'array' or jsonb_array_length(arr) = 0 then
    new.bbox_min_lat := null;
    new.bbox_max_lat := null;
    new.bbox_min_lng := null;
    new.bbox_max_lng := null;
    return new;
  end if;

  for i in 0..jsonb_array_length(arr) - 1 loop
    pt := arr -> i;
    lat := (pt -> 0)::text::double precision;
    lng := (pt -> 1)::text::double precision;
    if lat is null or lng is null then continue; end if;
    if min_lat is null or lat < min_lat then min_lat := lat; end if;
    if max_lat is null or lat > max_lat then max_lat := lat; end if;
    if min_lng is null or lng < min_lng then min_lng := lng; end if;
    if max_lng is null or lng > max_lng then max_lng := lng; end if;
  end loop;

  new.bbox_min_lat := min_lat;
  new.bbox_max_lat := max_lat;
  new.bbox_min_lng := min_lng;
  new.bbox_max_lng := max_lng;
  return new;
end;
$$;

drop trigger if exists rides_compute_bbox on public.rides;
create trigger rides_compute_bbox
  before insert or update of route on public.rides
  for each row execute function public.compute_ride_bbox();

-- One-time backfill so existing rides get bbox values. The trigger
-- fires on UPDATE, so no-op self-update on the route column populates
-- the new columns without touching anything else.
update public.rides set route = route where bbox_min_lat is null and route is not null;

-- =====================================================================
-- 3) Haversine + privacy-trim helpers
-- =====================================================================
-- Both used by the public-read RPC below. We don't enable PostGIS for
-- this — the math is light and the column count is tiny.

create or replace function public.haversine_m(
  lat1 double precision, lng1 double precision,
  lat2 double precision, lng2 double precision
)
returns double precision
language plpgsql
immutable
as $$
declare
  r_earth_m constant double precision := 6371000.0;
  dlat double precision := radians(lat2 - lat1);
  dlng double precision := radians(lng2 - lng1);
  a double precision;
begin
  a := sin(dlat / 2) * sin(dlat / 2)
     + cos(radians(lat1)) * cos(radians(lat2))
       * sin(dlng / 2) * sin(dlng / 2);
  return r_earth_m * 2 * atan2(sqrt(a), sqrt(greatest(0, 1 - a)));
end;
$$;

-- Trims the first and last `radius_m` (cumulative distance) of the
-- route polyline. Returns the inner segment that's safe to expose
-- publicly. If the ride is shorter than 2× the radius (a quick
-- around-the-block trip), returns an empty array — those rides
-- don't yield meaningful public routes anyway.

create or replace function public.trim_route_for_privacy(
  p_route jsonb,
  p_radius_m integer
)
returns jsonb
language plpgsql
stable
as $$
declare
  arr_len int;
  i int;
  pt jsonb;
  lat double precision;
  lng double precision;
  prev_lat double precision := null;
  prev_lng double precision := null;
  cumulative double precision := 0;
  start_idx int := 0;
  end_idx int := 0;
  result jsonb;
begin
  if p_route is null or jsonb_typeof(p_route) <> 'array' then
    return '[]'::jsonb;
  end if;
  arr_len := jsonb_array_length(p_route);
  if arr_len < 4 then return '[]'::jsonb; end if;

  -- Walk forward: first index whose cumulative distance from the
  -- start exceeds the privacy radius.
  start_idx := arr_len; -- sentinel
  for i in 0..arr_len - 1 loop
    pt := p_route -> i;
    lat := (pt -> 0)::text::double precision;
    lng := (pt -> 1)::text::double precision;
    if prev_lat is not null then
      cumulative := cumulative + public.haversine_m(prev_lat, prev_lng, lat, lng);
    end if;
    if cumulative >= p_radius_m then
      start_idx := i;
      exit;
    end if;
    prev_lat := lat;
    prev_lng := lng;
  end loop;

  -- Walk backward: last index whose cumulative distance from the
  -- end exceeds the privacy radius.
  cumulative := 0;
  prev_lat := null;
  end_idx := -1; -- sentinel
  for i in reverse arr_len - 1 .. 0 loop
    pt := p_route -> i;
    lat := (pt -> 0)::text::double precision;
    lng := (pt -> 1)::text::double precision;
    if prev_lat is not null then
      cumulative := cumulative + public.haversine_m(prev_lat, prev_lng, lat, lng);
    end if;
    if cumulative >= p_radius_m then
      end_idx := i;
      exit;
    end if;
    prev_lat := lat;
    prev_lng := lng;
  end loop;

  if start_idx >= end_idx then return '[]'::jsonb; end if;

  select jsonb_agg(p_route -> idx)
  into result
  from generate_series(start_idx, end_idx) as t(idx);

  return coalesce(result, '[]'::jsonb);
end;
$$;

-- =====================================================================
-- 4) nearby_public_rides RPC
-- =====================================================================
-- The ONLY way the app reads other riders' shared rides. SECURITY
-- DEFINER bypasses RLS internally; the function itself enforces
-- is_public = true. We do NOT add a public-read RLS policy on the
-- rides table, so the raw (untrimmed) route never escapes the owner.

create or replace function public.nearby_public_rides(
  p_center_lat double precision,
  p_center_lng double precision,
  p_radius_km numeric default 50,
  p_limit int default 100
)
returns table (
  id uuid,
  share_name text,
  tags text[],
  started_at timestamptz,
  duration_seconds integer,
  distance_m integer,
  weather text,
  display_name text,
  bike_label text,
  route_public jsonb
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  -- 1° latitude is ~111 km. 1° longitude ≈ 111 km × cos(lat); use a
  -- generous expansion so we don't false-negative near the poles.
  dlat double precision := p_radius_km::double precision / 111.0;
  cos_lat double precision := greatest(0.01, cos(radians(p_center_lat)));
  dlng double precision := p_radius_km::double precision / (111.0 * cos_lat);
begin
  return query
  select
    r.id,
    coalesce(nullif(r.share_name, ''), to_char(r.started_at, 'Mon DD, YYYY')) as share_name,
    r.tags,
    r.started_at,
    r.duration_seconds,
    r.distance_m,
    r.weather,
    coalesce(nullif(b.display_name, ''), 'Sidestand rider') as display_name,
    case
      when b.year is not null and b.model <> '' then trim(b.year::text || ' ' || b.model)
      when b.model <> '' then b.model
      else null
    end as bike_label,
    public.trim_route_for_privacy(r.route, r.share_radius_m) as route_public
  from public.rides r
  left join public.garage_bikes b on b.id = r.bike_id
  where r.is_public = true
    and r.bbox_min_lat is not null
    -- Bbox-intersect: each axis range overlaps the search bbox.
    and r.bbox_max_lat >= p_center_lat - dlat
    and r.bbox_min_lat <= p_center_lat + dlat
    and r.bbox_max_lng >= p_center_lng - dlng
    and r.bbox_min_lng <= p_center_lng + dlng
  order by r.started_at desc
  limit p_limit;
end;
$$;

grant execute on function public.nearby_public_rides(
  double precision, double precision, numeric, int
) to authenticated;
