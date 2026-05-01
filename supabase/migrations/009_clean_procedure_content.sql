-- Sidestand — strip brand, manual, and figure references from procedure
-- content so the user-facing walkthrough is clean Sidestand prose.
--
-- What this migration does, in order:
--
--   1. Backs up current step.body and step.note into _original columns
--      so we can roll back individual rows after eyeball review.
--   2. Strips figure references — the most common pollution. Patterns:
--        "See Figure 3-29. Remove screws (3)…"   → "Remove screws…"
--        "See Fig. 12-4."                          → ""
--        "(8)" / "(see Figure 3-2)"                → ""
--        "Refer to Figure 3-7"                     → ""
--   3. Strips brand and manual references:
--        "Harley-Davidson", "Harley", "HD", "H-D"  → ""
--        "service manual"                          → "instructions"
--        "Refer to Page 47"                        → ""
--        "See Chapter 3" / "See Section 4"         → ""
--   4. Wipes any remaining step.image_url values (we don't show them).
--   5. Cleans up whitespace artefacts left by the strips:
--        double spaces / orphan periods / leading whitespace.
--   6. Capitalizes the first letter of step bodies (some lost their
--      initial cap when the leading "See Figure X." sentence was cut).
--   7. Rebuilds procedures.search_text from cleaned step bodies so FTS
--      doesn't surface stale matches like "Figure 3-29".
--   8. Sets is_clean = false on every procedure so they stay admin-only
--      until you audit and approve a final pass.
--
-- Safe to re-run thanks to the backup columns. To undo a single
-- procedure's cleanup:
--    update procedure_steps set body = body_original where procedure_id = '<uuid>';
--
-- Run in Supabase SQL Editor.

-- =====================================================================
-- 1) Backup current content
-- =====================================================================
alter table public.procedure_steps
  add column if not exists body_original text,
  add column if not exists note_original text;

-- Only seed the backup if it's null (preserves backups on re-run).
update public.procedure_steps
  set body_original = body
  where body_original is null;

update public.procedure_steps
  set note_original = note
  where note_original is null and note is not null;

-- =====================================================================
-- 2) Figure-reference strip — apply to body and note
-- =====================================================================

-- Strip leading "See Figure X-Y." or "See Fig. X-Y." (anchored at start)
update public.procedure_steps
  set body = regexp_replace(body, '^\s*see\s+fig(\.|ure)?\s*[0-9]+(-[0-9]+)?\.?\s*', '', 'i');

update public.procedure_steps
  set note = regexp_replace(note, '^\s*see\s+fig(\.|ure)?\s*[0-9]+(-[0-9]+)?\.?\s*', '', 'i')
  where note is not null;

-- Strip mid-sentence "(see Figure X-Y)" / "(See Fig. X)"
update public.procedure_steps
  set body = regexp_replace(body, '\(\s*see\s+fig(\.|ure)?\s*[0-9]+(-[0-9]+)?\s*\)', '', 'gi');

update public.procedure_steps
  set note = regexp_replace(note, '\(\s*see\s+fig(\.|ure)?\s*[0-9]+(-[0-9]+)?\s*\)', '', 'gi')
  where note is not null;

-- Strip standalone "See Figure X-Y." sentences anywhere in the body
update public.procedure_steps
  set body = regexp_replace(body, '\s*see\s+fig(\.|ure)?\s*[0-9]+(-[0-9]+)?\.?\s*', ' ', 'gi');

update public.procedure_steps
  set note = regexp_replace(note, '\s*see\s+fig(\.|ure)?\s*[0-9]+(-[0-9]+)?\.?\s*', ' ', 'gi')
  where note is not null;

-- Strip "Refer to Figure X-Y."
update public.procedure_steps
  set body = regexp_replace(body, '\s*refer\s+to\s+fig(\.|ure)?\s*[0-9]+(-[0-9]+)?\.?\s*', ' ', 'gi');

-- Strip parenthetical figure-item markers like "(3)", "(4)", "(8)" — they
-- only make sense alongside the figures they reference, which we don't show.
update public.procedure_steps
  set body = regexp_replace(body, '\s*\([0-9]+\)', '', 'g');

update public.procedure_steps
  set note = regexp_replace(note, '\s*\([0-9]+\)', '', 'g')
  where note is not null;

-- =====================================================================
-- 3) Brand and manual-attribution strip
-- =====================================================================

-- "Harley-Davidson" / "Harley Davidson" → removed
update public.procedure_steps
  set body = regexp_replace(body, 'harley[\s-]+davidson''?s?\s*', '', 'gi'),
      note = case when note is not null
                  then regexp_replace(note, 'harley[\s-]+davidson''?s?\s*', '', 'gi')
                  else note end;

-- Standalone "Harley" → removed (only when used as a brand name, not in
-- "Harley engine oil" type compounds — we'll replace with empty string
-- and clean spacing in step 5).
update public.procedure_steps
  set body = regexp_replace(body, '\bharley''?s?\b\s*', '', 'gi'),
      note = case when note is not null
                  then regexp_replace(note, '\bharley''?s?\b\s*', '', 'gi')
                  else note end;

-- "HD" / "H-D" as standalone brand — only at word boundaries, won't catch
-- words like "HDD" or "HDMI"
update public.procedure_steps
  set body = regexp_replace(body, '\b(HD|H-D)\b\s*', '', 'g'),
      note = case when note is not null
                  then regexp_replace(note, '\b(HD|H-D)\b\s*', '', 'g')
                  else note end;

-- "service manual" → "instructions" (keeps step natural-sounding)
update public.procedure_steps
  set body = regexp_replace(body, 'service\s+manual', 'instructions', 'gi'),
      note = case when note is not null
                  then regexp_replace(note, 'service\s+manual', 'instructions', 'gi')
                  else note end;

-- "Refer to Page X" / "See Page X" / "Refer to Chapter X" / "Refer to Table X"
update public.procedure_steps
  set body = regexp_replace(body,
    '\s*(refer\s+to|see)\s+(page|chapter|section|table|appendix)\s*[0-9-]+\.?\s*',
    ' ', 'gi');

update public.procedure_steps
  set note = regexp_replace(note,
    '\s*(refer\s+to|see)\s+(page|chapter|section|table|appendix)\s*[0-9-]+\.?\s*',
    ' ', 'gi')
  where note is not null;

-- =====================================================================
-- 4) Wipe images explicitly (idempotent — already done outside this file)
-- =====================================================================
update public.procedure_steps set image_url = null where image_url is not null;

-- =====================================================================
-- 5) Whitespace + punctuation cleanup
-- =====================================================================

-- Collapse multi-space runs to a single space
update public.procedure_steps
  set body = regexp_replace(body, '\s{2,}', ' ', 'g'),
      note = case when note is not null
                  then regexp_replace(note, '\s{2,}', ' ', 'g')
                  else note end;

-- Trim leading and trailing whitespace
update public.procedure_steps
  set body = btrim(body),
      note = case when note is not null then btrim(note) else note end;

-- Drop orphan leading punctuation: ". Foo" / ", Foo" / "; Foo" / "- Foo"
update public.procedure_steps
  set body = regexp_replace(body, '^[\.,;:\-]+\s*', ''),
      note = case when note is not null
                  then regexp_replace(note, '^[\.,;:\-]+\s*', '')
                  else note end;

-- Drop double periods left behind ("Remove the bolts.. Tighten")
update public.procedure_steps
  set body = regexp_replace(body, '\.{2,}', '.', 'g'),
      note = case when note is not null
                  then regexp_replace(note, '\.{2,}', '.', 'g')
                  else note end;

-- Final btrim after the punctuation pass
update public.procedure_steps
  set body = btrim(body),
      note = case when note is not null then btrim(note) else note end;

-- =====================================================================
-- 6) Capitalize first letter of step body
-- =====================================================================
-- After stripping leading "See Figure X-Y." many bodies start with a
-- lowercase letter ("remove the screws…"). Re-capitalize.
update public.procedure_steps
  set body = upper(substring(body from 1 for 1)) || substring(body from 2)
  where length(body) > 0
    and substring(body from 1 for 1) ~ '[a-z]';

-- =====================================================================
-- 7) Rebuild procedures.search_text from cleaned step bodies
-- =====================================================================
-- search_text was concatenated when procedures were imported. Now that
-- step bodies have changed, refresh the cache so FTS doesn't surface
-- stale matches like "Figure 3-29" or "Harley".
update public.procedures p
set search_text = sub.text
from (
  select
    p.id as proc_id,
    p.title || ' ' ||
    coalesce(p.summary, '') || ' ' ||
    coalesce(string_agg(s.body, ' ' order by s.sort_order), '') as text
  from public.procedures p
  left join public.procedure_steps s on s.procedure_id = p.id
  group by p.id
) sub
where p.id = sub.proc_id;

-- =====================================================================
-- 8) Reset is_clean so the audit gate engages again
-- =====================================================================
-- After a content rewrite we want admin-eyes-on every procedure before
-- it's visible to riders. Flip everything back to is_clean = false.
update public.procedures
  set is_clean = false
  where is_clean = true;
