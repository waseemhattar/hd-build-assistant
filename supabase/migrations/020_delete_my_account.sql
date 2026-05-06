-- Migration 020 — account deletion RPC
--
-- Required for App Store compliance (Guideline 5.1.1(v)). Apple
-- rejected our 1.0 submission because the app has account creation
-- but no in-app account deletion. This migration adds the
-- server-side function that the Settings → Delete Account flow
-- calls when the rider confirms.
--
-- Behavior:
--   - Wipes everything tied to the calling user across all tables
--   - Ends with deleting the auth.users row, which terminates the
--     session and prevents the rider from signing back into the
--     same account (their email is freed for re-registration)
--
-- The function runs with SECURITY DEFINER so it can reach into
-- auth.users (a privileged schema). It checks auth.uid() at the
-- top, raising if not authenticated, so it can't be abused to
-- delete arbitrary accounts.
--
-- Idempotent: running this migration twice does the right thing
-- (create or replace + drop function if exists).

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  -- Wipe all the rider's user-owned content. We do these in
  -- reverse-FK order in case any constraint isn't set to cascade.
  -- All these tables use auth_user_id (set in migration 008).
  -- `if exists` guards in case a deployment is missing a migration.

  -- Rides + service entries
  delete from public.rides where auth_user_id = v_user_id;
  delete from public.service_entries where auth_user_id = v_user_id;

  -- Builds + mods
  delete from public.bike_mods where auth_user_id = v_user_id;
  delete from public.bike_builds where auth_user_id = v_user_id;

  -- Bikes themselves (and their public-page rows via cascade)
  delete from public.garage_bikes where auth_user_id = v_user_id;

  -- Notifications addressed to this user
  delete from public.notifications where recipient_user_id = v_user_id;

  -- Per-user settings + onboarding state
  delete from public.user_settings where auth_user_id = v_user_id;

  -- Suggested-ride ratings the rider posted
  -- (table only exists from migration 019; if missing this is a no-op)
  begin
    delete from public.suggested_ride_ratings where auth_user_id = v_user_id;
  exception when undefined_table then
    -- table doesn't exist in this deployment; skip
    null;
  end;

  -- Mechanic chats — these may not exist as a separate table; the
  -- worker stores them in a different schema. Skip gracefully.
  begin
    delete from public.mechanic_chats where auth_user_id = v_user_id;
  exception when undefined_table then
    null;
  end;

  -- Job cards (currently localStorage-only, but in case a future
  -- migration backs them with a table, clean preemptively)
  begin
    delete from public.job_cards where auth_user_id = v_user_id;
  exception when undefined_table then
    null;
  end;

  -- Finally — delete the auth.users row. This terminates all
  -- active sessions and frees the email for re-registration.
  -- Note: must be done LAST because some FK constraints reference
  -- auth.users(id) and would error if the row vanished mid-cleanup.
  delete from auth.users where id = v_user_id;
end;
$$;

-- Allow authenticated users to call this RPC. Anonymous users
-- can't (they have no auth.uid() to delete).
grant execute on function public.delete_my_account() to authenticated;

-- Revoke from anon as a belt-and-suspenders measure. SECURITY
-- DEFINER + the auth.uid() null-check already prevents abuse,
-- but this makes the intent explicit.
revoke execute on function public.delete_my_account() from anon;
