// Procedure data layer — reads from Supabase manuals/chapters/procedures
// tables introduced in migration 006.
//
// Replaces the bundled jobs.js lookup that previously powered the
// JobBrowser/JobView components. Procedures now live in the database
// and we fetch them on demand, scoping by the user's bike.
//
// Filtering model — hybrid year-range + per-procedure override:
//
//   1. Look up which manuals cover the user's bike. A manual matches when:
//        bike.year is in [manual.year_from, manual.year_to]
//        AND
//        (manual.model_codes is empty OR bike.modelCode is in manual.model_codes)
//   2. Pull all procedures from those manuals.
//   3. For each procedure, if procedure.applies_to is non-empty, filter
//      out procedures whose applies_to doesn't include the bike's catalog id.
//
// Riders only see procedures with is_clean = true and tier = 'free'
// (RLS enforces this server-side; we don't need client filters).
//
// Caching: each Supabase response is cached in memory for the life of
// the React tree. Navigating between procedures is instant after the
// first load. Cache busts on sign-out.

import { getSupabaseClient } from './supabaseClient.js'

// ---------- in-memory cache ----------

let manualsCache = null
let proceduresByManualCache = new Map() // manualId → procedures[]
let procedureDetailCache = new Map()    // procedureId → full detail

export function clearProceduresCache() {
  manualsCache = null
  proceduresByManualCache = new Map()
  procedureDetailCache = new Map()
}

// ---------- public API ----------

// Returns every manual the rider can see, plus its chapter list.
export async function getAllManuals() {
  if (manualsCache) return manualsCache
  const sb = getSupabaseClient()
  const { data: manuals, error: mErr } = await sb
    .from('manuals')
    .select('id, slug, manufacturer, title, family, year_from, year_to, model_codes, tier')
    .order('year_from', { ascending: false })
  if (mErr) throw mErr

  const { data: chapters, error: cErr } = await sb
    .from('chapters')
    .select('id, manual_id, slug, name, sort_order')
    .order('sort_order', { ascending: true })
  if (cErr) throw cErr

  const byManual = new Map()
  for (const c of chapters || []) {
    if (!byManual.has(c.manual_id)) byManual.set(c.manual_id, [])
    byManual.get(c.manual_id).push(c)
  }
  manualsCache = (manuals || []).map((m) => ({
    ...m,
    chapters: byManual.get(m.id) || []
  }))
  return manualsCache
}

// Returns manuals that apply to a specific bike, using year-range +
// model-code matching. If `bike` is null/undefined, returns all manuals.
export async function getManualsForBike(bike) {
  const all = await getAllManuals()
  if (!bike) return all
  const year = Number(bike.year) || null
  const code = extractModelCode(bike)
  return all.filter((m) => {
    if (year != null && m.year_from && m.year_to) {
      if (year < m.year_from || year > m.year_to) return false
    }
    if (code && m.model_codes && m.model_codes.length > 0) {
      if (!m.model_codes.includes(code)) return false
    }
    return true
  })
}

// Returns the procedures (lightweight metadata only — title, summary,
// difficulty, etc.) inside a single manual, grouped by chapter.
export async function getProceduresForManual(manualId) {
  if (proceduresByManualCache.has(manualId)) {
    return proceduresByManualCache.get(manualId)
  }
  const sb = getSupabaseClient()
  // Need both procedures AND chapters to group. Chapters already
  // came back from getAllManuals() but we don't pass them here, so
  // fetch chapters again scoped to this manual.
  const [{ data: chapters }, { data: procedures }] = await Promise.all([
    sb
      .from('chapters')
      .select('id, slug, name, sort_order')
      .eq('manual_id', manualId)
      .order('sort_order', { ascending: true }),
    sb
      .from('procedures')
      .select(
        'id, chapter_id, slug, title, summary, difficulty, time_minutes, applies_to, is_clean, tier'
      )
      .in(
        'chapter_id',
        // Filter procedures to only those whose chapter belongs to
        // this manual. We do this client-side because Postgres can't
        // easily do a cross-table filter via Supabase's filter API.
        // Workaround: fetch chapters first, then filter procedures by
        // their chapter_id list. Supabase's .in() takes an array.
        []
      )
      .order('title', { ascending: true })
  ])
  // Re-do the procedures query with the proper chapter ids list
  const chapterIds = (chapters || []).map((c) => c.id)
  if (chapterIds.length === 0) {
    const empty = { chapters: [], procedures: [] }
    proceduresByManualCache.set(manualId, empty)
    return empty
  }
  const { data: realProcedures, error: pErr } = await sb
    .from('procedures')
    .select(
      'id, chapter_id, slug, title, summary, difficulty, time_minutes, applies_to, is_clean, tier'
    )
    .in('chapter_id', chapterIds)
    .order('title', { ascending: true })
  if (pErr) throw pErr

  const result = {
    chapters: chapters || [],
    procedures: realProcedures || []
  }
  proceduresByManualCache.set(manualId, result)
  return result
}

// Returns procedures for a specific bike across ALL the manuals that
// apply to that bike. Applies the per-procedure applies_to override.
//
// Result shape:
//   [
//     { manual: { id, title, ... }, chapters: [...], procedures: [...] },
//     ...
//   ]
export async function getProceduresForBike(bike) {
  const manuals = await getManualsForBike(bike)
  const groups = []
  const code = extractModelCode(bike)
  for (const m of manuals) {
    const { chapters, procedures } = await getProceduresForManual(m.id)
    const filtered = procedures.filter((p) => {
      const list = p.applies_to || []
      if (list.length === 0) return true
      // applies_to has values — must intersect bike's identifiers
      // (catalog id like 'touring-2020', or model code like 'FLHX')
      if (bike?.bikeTypeId && list.includes(bike.bikeTypeId)) return true
      if (code && list.includes(code)) return true
      return false
    })
    if (filtered.length === 0) continue
    groups.push({ manual: m, chapters, procedures: filtered })
  }
  return groups
}

// Returns the full detail for one procedure: parent + tools + parts +
// fluids + torque + warnings + steps. Used by ProcedureDetail and
// Walkthrough components.
export async function getProcedureDetail(procedureId) {
  if (procedureDetailCache.has(procedureId)) {
    return procedureDetailCache.get(procedureId)
  }
  const sb = getSupabaseClient()
  const [
    { data: procedure, error: pErr },
    { data: tools, error: tErr },
    { data: parts, error: paErr },
    { data: fluids, error: fErr },
    { data: torque, error: trErr },
    { data: warnings, error: wErr },
    { data: steps, error: sErr }
  ] = await Promise.all([
    sb.from('procedures').select('*').eq('id', procedureId).single(),
    sb
      .from('procedure_tools')
      .select('*')
      .eq('procedure_id', procedureId)
      .order('sort_order'),
    sb
      .from('procedure_parts')
      .select('*')
      .eq('procedure_id', procedureId)
      .order('sort_order'),
    sb
      .from('procedure_fluids')
      .select('*')
      .eq('procedure_id', procedureId)
      .order('sort_order'),
    sb
      .from('procedure_torque')
      .select('*')
      .eq('procedure_id', procedureId)
      .order('sort_order'),
    sb
      .from('procedure_warnings')
      .select('*')
      .eq('procedure_id', procedureId)
      .order('sort_order'),
    sb
      .from('procedure_steps')
      .select('id, step_number, body, warning, note, sort_order')
      .eq('procedure_id', procedureId)
      .order('sort_order')
  ])
  if (pErr) throw pErr
  // Other errors are non-fatal — empty arrays are OK.
  if (tErr) console.warn('procedure_tools fetch failed', tErr)
  if (paErr) console.warn('procedure_parts fetch failed', paErr)
  if (fErr) console.warn('procedure_fluids fetch failed', fErr)
  if (trErr) console.warn('procedure_torque fetch failed', trErr)
  if (wErr) console.warn('procedure_warnings fetch failed', wErr)
  if (sErr) console.warn('procedure_steps fetch failed', sErr)

  const detail = {
    procedure,
    tools: tools || [],
    parts: parts || [],
    fluids: fluids || [],
    torque: torque || [],
    warnings: warnings || [],
    steps: steps || []
  }
  procedureDetailCache.set(procedureId, detail)
  return detail
}

// ---------- helpers ----------

// Pull the model code from a bike. Bikes can have an explicit
// modelCode field, or we extract it as the leading uppercase
// alphanumeric token of the model string ("FLHX Street Glide" → "FLHX").
function extractModelCode(bike) {
  if (!bike) return null
  if (bike.modelCode) return bike.modelCode
  if (bike.model) {
    const m = bike.model.match(/^([A-Z][A-Z0-9]+)\b/)
    return m ? m[1] : null
  }
  return null
}
