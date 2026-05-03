-- Sidestand — capture row deletions so the client's incremental pull
-- can converge across devices in seconds, not weeks.
--
-- Why: the client's pullFromServer() uses .gte('updated_at', cursor)
-- to skip rows that haven't changed since the last sync. That works
-- for inserts and updates, but a hard-deleted row has no updated_at —
-- it's just gone. Without a deletion log, a delete on phone B never
-- shows up on phone A until the periodic 30-day full pull. This
-- table closes that gap with sub-second propagation.
--
-- Pattern: AFTER DELETE trigger on each synced table inserts a row
-- here with (table_name, row_id, user_id, deleted_at). The client's
-- pull queries .gt('deleted_at', cursor.deletionsAt) and removes any
-- ids it returns from the local cache.
--
-- Run in Supabase SQL Editor.

-- =====================================================================
-- 1) deletions table
-- =====================================================================

create table if not exists public.deletions (
  id          bigserial primary key,
  table_name  text not null,
  row_id      uuid not null,
  user_id     uuid not null references auth.users(id) on delete cascade,
  deleted_at  timestamptz not null default now()
);

create index if not exists deletions_user_time_idx
  on public.deletions (user_id, deleted_at);

create index if not exists deletions_user_table_idx
  on public.deletions (user_id, table_name, deleted_at);

alter table public.deletions enable row level security;

-- Users can read only their own deletion log (matches the rest of
-- the per-user tables). No insert/update/delete from the client —
-- only the trigger function below populates it.
drop policy if exists "deletions: own user read" on public.deletions;
create policy "deletions: own user read"
  on public.deletions for select
  to authenticated
  using (user_id = auth.uid());

grant select on public.deletions to authenticated;

-- =====================================================================
-- 2) capture_deletion() trigger function
-- =====================================================================

-- SECURITY DEFINER so it can write to public.deletions even when the
-- triggering user has no INSERT privilege there. We narrow risk by
-- pinning search_path and only inserting columns derived from the
-- row we're deleting.
create or replace function public.capture_deletion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.deletions (table_name, row_id, user_id, deleted_at)
  values (TG_TABLE_NAME, OLD.id, OLD.auth_user_id, now());
  return OLD;
end;
$$;

-- =====================================================================
-- 3) Wire each synced table
-- =====================================================================

drop trigger if exists garage_bikes_capture_delete on public.garage_bikes;
create trigger garage_bikes_capture_delete
  after delete on public.garage_bikes
  for each row execute function public.capture_deletion();

drop trigger if exists service_entries_capture_delete on public.service_entries;
create trigger service_entries_capture_delete
  after delete on public.service_entries
  for each row execute function public.capture_deletion();

drop trigger if exists bike_builds_capture_delete on public.bike_builds;
create trigger bike_builds_capture_delete
  after delete on public.bike_builds
  for each row execute function public.capture_deletion();

drop trigger if exists bike_mods_capture_delete on public.bike_mods;
create trigger bike_mods_capture_delete
  after delete on public.bike_mods
  for each row execute function public.capture_deletion();

-- =====================================================================
-- 4) Housekeeping: prune old deletion records
-- =====================================================================

-- Keep deletions for 90 days. Any device offline longer than that
-- will trigger its periodic full pull (FULL_SYNC_INTERVAL_MS in
-- storage.js) which reconciles via row absence — we don't need
-- the per-row trail forever.
create or replace function public.prune_old_deletions()
returns void
language sql
security definer
as $$
  delete from public.deletions
  where deleted_at < now() - interval '90 days';
$$;

-- If pg_cron is enabled, schedule it weekly. Safe to ignore on
-- projects that don't have pg_cron — the function above can be
-- called manually from the SQL editor.
-- select cron.schedule(
--   'sidestand-prune-deletions',
--   '0 4 * * 0',  -- Sundays at 04:00 UTC
--   $$select public.prune_old_deletions();$$
-- );
