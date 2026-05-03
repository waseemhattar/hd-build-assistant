-- Migration 018 — server-side user_settings
--
-- Why this migration exists:
--
--   userPrefs.js was originally localStorage-only with the rationale
--   "preferences are per-device by design." That turned out to be the
--   wrong product call: when a rider deletes the app and reinstalls,
--   they get walked through unit selection / onboarding again, even
--   though they already chose imperial vs metric on a previous device
--   (or even the same device, before the wipe).
--
--   This migration adds a per-user settings row that follows the
--   account. The client treats localStorage as a fast-boot cache
--   fronting this row; on sign-in it fetches server-side and merges,
--   and every change is debounced-upserted back. New device, same
--   rider → no wizard, units already correct.
--
--   Schema is a single JSONB column rather than typed columns. We add
--   pref keys often (currency, temperature, fuel volume, dateFormat,
--   onboardingCompletedAt, etc.) and don't want a migration for each.
--   Read/write performance at this scale is fine — settings is a few
--   hundred bytes per row at most.
--
-- Run in Supabase SQL Editor.

create table if not exists public.user_settings (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  -- Free-form JSONB. Shape matches the userPrefs.js DEFAULTS object:
  --   { units, dateFormat, currency, temperature, fuelVolume, locale,
  --     onboardingCompletedAt, onboardingSkipped, consentDataCollection,
  --     ...future keys }
  settings    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- touch_updated_at() defined in migration 001.
drop trigger if exists user_settings_touch_updated_at on public.user_settings;
create trigger user_settings_touch_updated_at
  before update on public.user_settings
  for each row execute function public.touch_updated_at();

alter table public.user_settings enable row level security;

drop policy if exists "user_settings: own select" on public.user_settings;
create policy "user_settings: own select"
  on public.user_settings for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "user_settings: own insert" on public.user_settings;
create policy "user_settings: own insert"
  on public.user_settings for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "user_settings: own update" on public.user_settings;
create policy "user_settings: own update"
  on public.user_settings for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

revoke all on public.user_settings from anon;
grant select, insert, update on public.user_settings to authenticated;
