-- Sidestand — ride tracking.
--
-- A "ride" is a single GPS-recorded trip: start time, end time,
-- distance, the route as an ordered list of GPS samples, and an
-- optional bike association.
--
-- Why not PostGIS: we don't need real geographic queries (radius
-- searches, intersections, etc.) for v1. We're just storing and
-- displaying tracks. JSONB is plenty fast for "list my rides" and
-- the polyline rendering happens client-side. We can add PostGIS
-- later if we want "find rides near me" features.
--
-- Storage shape: route is a JSONB array of [lat, lng, timestamp_ms,
-- speed_mps] tuples. Compression is fine — we'll typically have a
-- few thousand points per ride at 1Hz, ~50KB JSON, well within
-- Supabase row limits.
--
-- Run in Supabase SQL Editor.

create table if not exists public.rides (
  id              uuid primary key default gen_random_uuid(),
  -- Owner — who recorded the ride
  auth_user_id    uuid not null references auth.users(id) on delete cascade,
  -- Optional: which bike were they riding? Null is allowed because the
  -- user might track a ride before adding the bike to their garage.
  bike_id         uuid references public.garage_bikes(id) on delete set null,
  -- Timing
  started_at      timestamptz not null default now(),
  ended_at        timestamptz,
  -- Computed at save time, but stored for fast list queries
  duration_seconds integer,
  distance_m       integer,        -- meters; convert to mi/km client-side
  max_speed_mps    real,           -- meters per second
  avg_speed_mps    real,
  -- The actual track. Array of [lat, lng, ts_ms, speed_mps] tuples.
  -- Sampled at ~1Hz; throttled to 5s when speed is steady.
  route           jsonb default '[]'::jsonb,
  -- User-supplied
  title           text,
  notes           text,
  weather         text,             -- free-form: "sunny", "drizzle", etc.
  -- Mileage at start, computed from bike's mileage when ride starts.
  -- Null when no bike attached.
  start_mileage   integer,
  end_mileage     integer,
  -- Lifecycle
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists rides_user_idx
  on public.rides (auth_user_id, started_at desc);
create index if not exists rides_bike_idx
  on public.rides (bike_id, started_at desc) where bike_id is not null;

alter table public.rides enable row level security;

drop policy if exists "rides: own auth read" on public.rides;
create policy "rides: own auth read"
  on public.rides for select
  to authenticated
  using (auth_user_id = auth.uid());

drop policy if exists "rides: own auth insert" on public.rides;
create policy "rides: own auth insert"
  on public.rides for insert
  to authenticated
  with check (auth_user_id = auth.uid());

drop policy if exists "rides: own auth update" on public.rides;
create policy "rides: own auth update"
  on public.rides for update
  to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

drop policy if exists "rides: own auth delete" on public.rides;
create policy "rides: own auth delete"
  on public.rides for delete
  to authenticated
  using (auth_user_id = auth.uid());

grant select, insert, update, delete on public.rides to authenticated;

-- updated_at trigger
drop trigger if exists rides_touch on public.rides;
create trigger rides_touch before update on public.rides
  for each row execute function public.touch_updated_at();
