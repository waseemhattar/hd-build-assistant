#!/usr/bin/env node
//
// Sidestand — one-shot ingestion of the legacy src/data/jobs.js bundle
// into the new manuals/chapters/procedures Supabase tables created by
// migration 006.
//
// Usage:
//
//   SUPABASE_URL=https://<project>.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=<service-role-key> \
//   node scripts/ingest-jobs.mjs
//
// Reads ./src/data/jobs.js + ./src/data/bikes.js + ./src/data/serviceIntervals.js,
// transforms each entry into the new schema, upserts into Supabase.
// Idempotent — safe to re-run after editing source files (uses
// `legacy_id` as the upsert key on procedures + service_intervals,
// `slug` on manuals + chapters).
//
// IMPORTANT: This script uses the SERVICE ROLE key to bypass RLS for
// the bulk insert. Never commit the service role key. Pull it from
// the env each run. The service role bypass is only safe because:
//   1. This script is only run by you (admin) locally, not by users
//   2. We're inserting content you wrote / are authoring
//   3. After ingest, all procedures land with is_clean=false so they
//      stay invisible to non-admins until you audit & flag clean
//
// Procedures land with is_clean=false by default. Use the in-app
// admin UI (or a follow-up SQL update) to flip them clean as you
// audit each one for paraphrasing. Until then, only admins see them.

import { createClient } from '@supabase/supabase-js'
import { jobs as legacyJobs } from '../src/data/jobs.js'
import { bikes as legacyBikes, systems as legacySystems } from '../src/data/bikes.js'
import { intervals as legacyIntervals } from '../src/data/serviceIntervals.js'

// ---------------- env / client ----------------

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing env: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required.')
  console.error('Find the service role key in Supabase dashboard → Settings → API.')
  console.error('Never commit it. Run this script with a one-off env line:')
  console.error('  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/ingest-jobs.mjs')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// ---------------- helpers ----------------

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

// Normalize the difficulty values that exist in the legacy data
// (Easy / Moderate / Medium / Hard / Advanced) into a consistent set.
function normalizeDifficulty(d) {
  if (!d) return null
  const s = String(d).toLowerCase()
  if (s === 'easy') return 'Easy'
  if (s === 'medium' || s === 'moderate') return 'Moderate'
  if (s === 'hard' || s === 'advanced') return 'Advanced'
  return d
}

// Build the per-procedure search_text by concatenating the searchable
// strings (title, summary, step bodies, parts, tools). Postgres FTS
// index sits over this column.
function buildSearchText(job) {
  const bits = [
    job.title || '',
    job.summary || '',
    ...(job.tools || []).filter(Boolean),
    ...(job.parts || []).map((p) => `${p?.number || ''} ${p?.description || ''}`),
    ...(job.steps || []).map((s) => s?.text || ''),
    ...(job.torque || []).map((t) => `${t?.fastener || ''} ${t?.value || ''}`)
  ]
  return bits.join(' ').replace(/\s+/g, ' ').trim()
}

// Pretty progress logger that overwrites the same line.
let lastLogLen = 0
function progress(line) {
  const pad = Math.max(0, lastLogLen - line.length)
  process.stdout.write('\r' + line + ' '.repeat(pad))
  lastLogLen = line.length
}
function done(line) {
  progress(line)
  process.stdout.write('\n')
}

// ---------------- group jobs into manuals ----------------

// The legacy jobs.js has each job tagged with a bikeIds array
// (catalog ids). We map each catalog id to a "manual" so all jobs
// for the same bike-platform end up in the same manual. Each manual
// covers one (catalog) bike entry — the cleanest mapping given the
// existing data.
function buildManualsFromBikes() {
  return legacyBikes.map((b) => ({
    legacy_bike_id: b.id,
    slug: `hd-${slugify(b.family)}-${b.year}`,
    manufacturer: 'Harley-Davidson',
    title: `${b.year} HD ${b.family} Service Manual`,
    family: b.family,
    year_from: extractYearStart(b) || b.year,
    year_to: extractYearEnd(b) || b.year,
    model_codes: extractModelCodes(b),
    tier: 'free',
    source_pdf: (b.manuals && b.manuals[0]) || null,
    source_owner: 'Harley-Davidson, Inc.',
    notes: `Auto-imported from jobs.js (${b.id}). Procedures land as is_clean=false until audited.`
  }))
}

function extractYearStart(b) {
  const m = (b.label || '').match(/\((\d{4})\s*[-–]\s*\d{4}\)/)
  return m ? Number(m[1]) : null
}
function extractYearEnd(b) {
  const m = (b.label || '').match(/\(\d{4}\s*[-–]\s*(\d{4})\)/)
  return m ? Number(m[1]) : null
}
function extractModelCodes(b) {
  // bikes.js has "FLHX Street Glide" — pull the leading model code.
  return (b.models || [])
    .map((m) => (m.match(/^([A-Z0-9]+)\b/) || [])[1])
    .filter(Boolean)
}

// ---------------- main ----------------

async function main() {
  const validJobs = (legacyJobs || []).filter(Boolean)
  console.log(`Found ${validJobs.length} legacy jobs across ${legacyBikes.length} bike platforms.`)

  // ---- 1) MANUALS ----
  // Upsert one manual row per legacy bike platform.
  console.log('\n[1/4] Manuals')
  const manualsToInsert = buildManualsFromBikes()
  // Keep map of legacy bike id → manual UUID for use when picking
  // which manual a procedure belongs to.
  const manualByBike = new Map()
  for (const m of manualsToInsert) {
    progress(`upsert manual: ${m.slug}`)
    const { data, error } = await sb
      .from('manuals')
      .upsert(
        {
          slug: m.slug,
          manufacturer: m.manufacturer,
          title: m.title,
          family: m.family,
          year_from: m.year_from,
          year_to: m.year_to,
          model_codes: m.model_codes,
          tier: m.tier,
          source_pdf: m.source_pdf,
          source_owner: m.source_owner,
          notes: m.notes
        },
        { onConflict: 'slug', ignoreDuplicates: false }
      )
      .select('id, slug')
      .single()
    if (error) throw new Error(`Manual upsert failed for ${m.slug}: ${error.message}`)
    manualByBike.set(m.legacy_bike_id, data.id)
  }
  done(`[1/4] Manuals — ${manualsToInsert.length} upserted`)

  // ---- 2) CHAPTERS ----
  // For every (manual, system) pair in the data, create a chapter.
  // We find systems used per manual by scanning legacyJobs.
  console.log('\n[2/4] Chapters')
  const chapterByManualSystem = new Map() // key `manualId|systemId` → chapter UUID
  const systemLabel = new Map(legacySystems.map((s) => [s.id, s.label]))

  // Group jobs by (manual, system) so we know which chapters need to exist.
  const neededChapters = new Set()
  for (const j of validJobs) {
    if (!j?.system) continue
    for (const bikeId of j.bikeIds || []) {
      const manualId = manualByBike.get(bikeId)
      if (!manualId) continue
      neededChapters.add(`${manualId}|${j.system}`)
    }
  }
  let chapterIdx = 0
  for (const key of neededChapters) {
    const [manualId, systemId] = key.split('|')
    const sortOrder = legacySystems.findIndex((s) => s.id === systemId)
    progress(`upsert chapter ${++chapterIdx}/${neededChapters.size}: ${systemId}`)
    const { data, error } = await sb
      .from('chapters')
      .upsert(
        {
          manual_id: manualId,
          slug: systemId,
          name: systemLabel.get(systemId) || systemId,
          sort_order: sortOrder >= 0 ? sortOrder : 99
        },
        { onConflict: 'manual_id,slug', ignoreDuplicates: false }
      )
      .select('id')
      .single()
    if (error) throw new Error(`Chapter upsert failed for ${systemId}: ${error.message}`)
    chapterByManualSystem.set(key, data.id)
  }
  done(`[2/4] Chapters — ${neededChapters.size} upserted`)

  // ---- 3) PROCEDURES (+ children) ----
  // For each legacy job, we may upsert MULTIPLE procedure rows: one
  // per (bike, system) chapter the job applies to. The legacy id is
  // mangled with the chapter slug to keep legacy_id unique across
  // multi-bike jobs while preserving lookup via the original id.
  console.log('\n[3/4] Procedures')
  let procCount = 0, procFailed = 0, childCount = 0
  let procIdx = 0
  for (const job of validJobs) {
    procIdx++
    if (!job?.id || !job?.title) continue

    // Pick the chapters this job lands in. We do one procedure row
    // per (bike, system) so reads scoped by chapter return the right
    // procedures, even though that means duplicating the content for
    // multi-bike jobs. With <500 jobs it's fine; for larger imports
    // we'd switch to a many-to-many mapping table.
    for (const bikeId of job.bikeIds || []) {
      const manualId = manualByBike.get(bikeId)
      if (!manualId) continue
      const chapterId = chapterByManualSystem.get(`${manualId}|${job.system}`)
      if (!chapterId) continue

      // Compose a stable legacy_id that's unique across chapters.
      const legacyId =
        (job.bikeIds || []).length > 1
          ? `${job.id}::${bikeId}`
          : job.id
      const slug = slugify(`${job.id}-${bikeId}`)

      progress(`upsert procedure ${procIdx}/${validJobs.length}: ${job.id} (${bikeId})`)

      const { data: proc, error: procErr } = await sb
        .from('procedures')
        .upsert(
          {
            chapter_id: chapterId,
            slug,
            legacy_id: legacyId,
            title: job.title,
            summary: job.summary || null,
            difficulty: normalizeDifficulty(job.difficulty),
            time_minutes: job.timeMinutes || null,
            applies_to: [bikeId],
            tier: 'free',
            // Land as not-yet-clean so it stays admin-only until
            // you audit each procedure for paraphrasing.
            is_clean: false,
            source_page: job.source?.page || null,
            source_section: null,
            search_text: buildSearchText(job)
          },
          { onConflict: 'chapter_id,slug', ignoreDuplicates: false }
        )
        .select('id')
        .single()
      if (procErr) {
        procFailed++
        process.stdout.write(`\n  ⚠ ${job.id}/${bikeId}: ${procErr.message}\n`)
        continue
      }
      const procId = proc.id

      // Wipe + re-insert children for idempotency. Cheap because each
      // procedure has < ~30 children total. delete-then-insert is
      // simpler than diffing.
      await sb.from('procedure_tools').delete().eq('procedure_id', procId)
      await sb.from('procedure_parts').delete().eq('procedure_id', procId)
      await sb.from('procedure_torque').delete().eq('procedure_id', procId)
      await sb.from('procedure_warnings').delete().eq('procedure_id', procId)
      await sb.from('procedure_steps').delete().eq('procedure_id', procId)

      const tools = (job.tools || []).filter(Boolean).map((name, i) => ({
        procedure_id: procId,
        name: String(name),
        sort_order: i
      }))
      if (tools.length) {
        const { error } = await sb.from('procedure_tools').insert(tools)
        if (error) process.stdout.write(`\n  ⚠ tools: ${error.message}\n`)
        else childCount += tools.length
      }

      const parts = (job.parts || [])
        .filter((p) => p && (p.description || p.number))
        .map((p, i) => ({
          procedure_id: procId,
          part_number: p.number ? String(p.number) : null,
          description: String(p.description || ''),
          qty: typeof p.qty === 'number' ? p.qty : null,
          sort_order: i
        }))
      if (parts.length) {
        const { error } = await sb.from('procedure_parts').insert(parts)
        if (error) process.stdout.write(`\n  ⚠ parts: ${error.message}\n`)
        else childCount += parts.length
      }

      const torque = (job.torque || [])
        .filter((t) => t && t.fastener && t.value)
        .map((t, i) => ({
          procedure_id: procId,
          fastener: String(t.fastener),
          value: String(t.value),
          note: t.note ? String(t.note) : null,
          sort_order: i
        }))
      if (torque.length) {
        const { error } = await sb.from('procedure_torque').insert(torque)
        if (error) process.stdout.write(`\n  ⚠ torque: ${error.message}\n`)
        else childCount += torque.length
      }

      // Steps + their inline warnings. Warnings on a step land on the
      // step row's `warning` column AND get a row in procedure_warnings
      // for top-of-procedure aggregated display.
      const steps = (job.steps || []).filter(Boolean).map((s, i) => ({
        procedure_id: procId,
        step_number: typeof s.n === 'number' ? s.n : i + 1,
        body: String(s.text || ''),
        warning: s.warning ? String(s.warning) : null,
        note: s.note ? String(s.note) : null,
        sort_order: i
      }))
      if (steps.length) {
        const { error } = await sb.from('procedure_steps').insert(steps)
        if (error) process.stdout.write(`\n  ⚠ steps: ${error.message}\n`)
        else childCount += steps.length
      }
      // Aggregate warnings (one row per warned step) for the top of
      // the procedure UI.
      const warningRows = steps
        .filter((s) => s.warning)
        .map((s, i) => ({
          procedure_id: procId,
          level: 'warning',
          text: s.warning,
          sort_order: i
        }))
      if (warningRows.length) {
        const { error } = await sb.from('procedure_warnings').insert(warningRows)
        if (error) process.stdout.write(`\n  ⚠ warnings: ${error.message}\n`)
        else childCount += warningRows.length
      }

      procCount++
    }
  }
  done(
    `[3/4] Procedures — ${procCount} upserted, ${procFailed} failed, ${childCount} child rows`
  )

  // ---- 4) SERVICE INTERVALS ----
  console.log('\n[4/4] Service intervals')
  let intervalCount = 0
  for (const it of legacyIntervals) {
    progress(`upsert interval: ${it.id}`)
    const { error } = await sb.from('service_intervals').upsert(
      {
        legacy_id: it.id,
        slug: slugify(it.id),
        label: it.label,
        description: it.description || null,
        first_due_miles: it.firstDue || null,
        every_miles: it.mileageInterval || null,
        match_terms: it.match || [],
        sort_order: intervalCount
      },
      { onConflict: 'legacy_id', ignoreDuplicates: false }
    )
    if (error) throw new Error(`Interval upsert failed for ${it.id}: ${error.message}`)
    intervalCount++
  }
  done(`[4/4] Service intervals — ${intervalCount} upserted`)

  console.log('\n✅ Done.')
  console.log(
    '   Procedures landed with is_clean=false. Audit each one for paraphrasing,'
  )
  console.log(
    '   then flip is_clean=true (in admin UI or via SQL) to publish to riders.'
  )
}

main().catch((e) => {
  console.error('\n❌ Ingest failed:', e.message)
  console.error(e.stack)
  process.exit(1)
})
