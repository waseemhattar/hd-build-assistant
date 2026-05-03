-- Migration 017 — add updated_at to service_entries
--
-- Why this migration exists:
--
--   storage.js's pullFromServer() incremental sync filters every
--   synced table by `.gte('updated_at', cursor)`. service_entries
--   was the only synced table without an `updated_at` column —
--   migration 001 created it with `created_at` only — so every
--   incremental pull errored:
--
--     [warn] pull failed
--       column service_entries.updated_at does not exist
--
--   Two consequences:
--     1) Pull-to-refresh appeared dead (forceFullPull threw before
--        fresh data could land in any table).
--     2) Edits to service entries never propagated across devices —
--        the pull would have skipped them anyway (created_at < cursor).
--
--   This migration closes both. Adds updated_at backfilled from
--   created_at, plus the same touch_updated_at() trigger every other
--   synced table uses.
--
-- Run in Supabase SQL Editor.

alter table public.service_entries
  add column if not exists updated_at timestamptz not null default now();

-- Backfill updated_at to match created_at for existing rows so the
-- pull's .gte() filter doesn't suddenly resurface every legacy row.
update public.service_entries
   set updated_at = created_at
 where updated_at is distinct from created_at;

-- Reuse the shared touch_updated_at() function (defined in migration 001).
drop trigger if exists service_entries_touch_updated_at on public.service_entries;
create trigger service_entries_touch_updated_at
  before update on public.service_entries
  for each row execute function public.touch_updated_at();

-- Index supports the pull's incremental filter pattern.
create index if not exists service_entries_updated_at_idx
  on public.service_entries (updated_at);
