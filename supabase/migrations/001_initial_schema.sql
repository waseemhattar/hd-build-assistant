-- HD Build Assistant — initial Supabase schema.
--
-- Two tables: garage_bikes (one row per bike a user owns) and
-- service_entries (log of completed services). Both are locked down
-- with row-level security so a user can only read/write their own rows.
--
-- Authentication is done via Clerk JWTs: Clerk issues a JWT whose `sub`
-- claim is the Clerk user id. Supabase's JWT verification is configured
-- (in the dashboard) to trust Clerk's JWKS endpoint. Inside RLS policies
-- we read the sub claim with `auth.jwt() ->> 'sub'`.
--
-- To run this migration, paste the whole file into Supabase SQL Editor
-- and click "Run".

-- =====================================================================
-- Table: garage_bikes
-- =====================================================================
create table if not exists public.garage_bikes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,               -- Clerk user id (e.g. 'user_2a...')
  bike_type_id text,                   -- catalog id from bikes.js (e.g. 'touring-2020')
  year int,
  model text not null default '',
  nickname text not null default '',
  vin text not null default '',
  mileage int not null default 0,
  purchase_date date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists garage_bikes_user_id_idx on public.garage_bikes (user_id);

-- Keep updated_at current on every write.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists garage_bikes_touch_updated_at on public.garage_bikes;
create trigger garage_bikes_touch_updated_at
  before update on public.garage_bikes
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- Table: service_entries
-- =====================================================================
create table if not exists public.service_entries (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,               -- Clerk user id
  bike_id uuid not null references public.garage_bikes(id) on delete cascade,
  job_id text,                         -- jobs.js id if this entry is tied to a manual procedure
  title text not null default '',
  mileage int not null default 0,
  service_date date not null default now(),
  notes text not null default '',
  parts text not null default '',
  cost numeric(10,2),
  created_at timestamptz not null default now()
);

create index if not exists service_entries_user_id_idx on public.service_entries (user_id);
create index if not exists service_entries_bike_id_idx on public.service_entries (bike_id);

-- =====================================================================
-- Row-level security
-- =====================================================================
-- Every query from the browser c


omes in with a Clerk JWT. RLS policies
-- below compare the authenticated user id (from the JWT's `sub` claim)
-- to the row's `user_id` column. Anything that doesn't match is invisible
-- and cannot be updated/deleted.

alter table public.garage_bikes enable row level security;
alter table public.service_entries enable row level security;

-- garage_bikes policies
drop policy if exists "garage_bikes: owner can select" on public.garage_bikes;
create policy "garage_bikes: owner can select"
  on public.garage_bikes for select
  using (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "garage_bikes: owner can insert" on public.garage_bikes;
create policy "garage_bikes: owner can insert"
  on public.garage_bikes for insert
  with check (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "garage_bikes: owner can update" on public.garage_bikes;
create policy "garage_bikes: owner can update"
  on public.garage_bikes for update
  using (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "garage_bikes: owner can delete" on public.garage_bikes;
create policy "garage_bikes: owner can delete"
  on public.garage_bikes for delete
  using (user_id = (auth.jwt() ->> 'sub'));

-- service_entries policies
drop policy if exists "service_entries: owner can select" on public.service_entries;
create policy "service_entries: owner can select"
  on public.service_entries for select
  using (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "service_entries: owner can insert" on public.service_entries;
create policy "service_entries: owner can insert"
  on public.service_entries for insert
  with check (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "service_entries: owner can update" on public.service_entries;
create policy "service_entries: owner can update"
  on public.service_entries for update
  using (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "service_entries: owner can delete" on public.service_entries;
create policy "service_entries: owner can delete"
  on public.service_entries for delete
  using (user_id = (auth.jwt() ->> 'sub'));

-- Revoke blanket public/anon access. RLS handles it but be explicit.
revoke all on public.garage_bikes from anon;
revoke all on public.service_entries from anon;
grant select, insert, update, delete on public.garage_bikes to authenticated;
grant select, insert, update, delete on public.service_entries to authenticated;
