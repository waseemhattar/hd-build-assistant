// Procedure data layer — reads from Supabase manuals/chapters/procedures
// tables introduced in migration 006.
//
// Procedures live in the database and we fetch them on demand,
// scoping by the user's bike (year, model, model code).
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
//
// Model-code matching expands the bike's literal code into a list of
// candidates so that, e.g., a CVO FLHXSE bike still matches a base
// Touring manual that only lists FLHX. See expandModelCodes() for the
// rules.
export async function getManualsForBike(bike) {
  const all = await getAllManuals()
  if (!bike) return all
  const year = Number(bike.year) || null
  const codes = expandModelCodes(bike)
  return all.filter((m) => {
    if (year != null && m.year_from && m.year_to) {
      if (year < m.year_from || year > m.year_to) return false
    }
    if (m.model_codes && m.model_codes.length > 0) {
      if (codes.length === 0) return false
      if (!codes.some((c) => m.model_codes.includes(c))) return false
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
  const codes = expandModelCodes(bike)
  for (const m of manuals) {
    const { chapters, procedures } = await getProceduresForManual(m.id)
    const filtered = procedures.filter((p) => {
      const list = p.applies_to || []
      if (list.length === 0) return true
      // applies_to has values — must intersect bike's identifiers
      // (catalog id like 'touring-2020', or any of the expanded
      // model codes like 'FLHXSE' or its base 'FLHX')
      if (bike?.bikeTypeId && list.includes(bike.bikeTypeId)) return true
      if (codes.some((c) => list.includes(c))) return true
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

// Returns the bike-scoped procedure list flattened into top-level
// categories. Chapter names are normalized + deduplicated across
// matching manuals, and Remove/Install procedures are paired into
// single logical "items" (so "Brake Caliper, Front Removal" and
// "Brake Caliper, Front Installation" become one row with a direction
// toggle).
//
// Result shape:
//   [
//     {
//       name: 'Brakes',         // canonical display name
//       slug: 'brakes',
//       items: [
//         {
//           id: '<canonical-procedure-id>',
//           baseTitle: 'Brake Caliper, Front',
//           summary,
//           difficulty,         // worst-case across the pair
//           time_minutes,       // sum across the pair
//           remove: { id, title, time_minutes, ... } | null,
//           install: { id, title, time_minutes, ... } | null,
//           hasPair: true | false,
//         },
//         ...
//       ]
//     },
//     ...
//   ]
export async function getCategoriesForBike(bike) {
  const groups = await getProceduresForBike(bike) // [{manual, chapters, procedures}]

  // Flatten chapter metadata so we can look up the chapter name for
  // any given procedure.
  const chapterById = new Map()
  for (const g of groups) {
    for (const c of g.chapters) chapterById.set(c.id, c)
  }

  // Group procedures by canonical category name (= chapter name).
  // Many manuals may share a category name like "Engine" — we
  // dedupe by normalized name so the rider sees a flat list.
  const byCategory = new Map() // normalizedName -> { name, slug, procedures: [] }

  for (const g of groups) {
    for (const p of g.procedures) {
      const chapter = chapterById.get(p.chapter_id)
      const rawName = chapter?.name || 'Other'
      const norm = rawName.trim().toLowerCase()
      if (!byCategory.has(norm)) {
        byCategory.set(norm, {
          name: rawName,
          slug: rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          procedures: []
        })
      }
      byCategory.get(norm).procedures.push(p)
    }
  }

  // Convert to array, then within each category pair Remove/Install
  // procedures by base title (the title with the trailing direction
  // word stripped out).
  const result = []
  for (const cat of byCategory.values()) {
    const items = pairRemoveInstall(cat.procedures)
    if (items.length === 0) continue
    result.push({
      name: cat.name,
      slug: cat.slug,
      items: items.sort((a, b) =>
        a.baseTitle.localeCompare(b.baseTitle, undefined, { sensitivity: 'base' })
      )
    })
  }
  // Stable ordering for the grid — alphabetical by category name.
  result.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  )
  return result
}

// ---------- pairing helpers ----------

// Parse a procedure title into its base + direction. We treat both
// "REMOVAL"/"INSTALLATION" (HD service-manual style) and
// "REMOVE"/"INSTALL" (plain English) as direction markers, only at
// the very end of the title, optionally preceded by a comma.
//
// Examples:
//   "BRAKE CALIPER, FRONT REMOVAL"      → { base: "BRAKE CALIPER, FRONT", direction: "remove" }
//   "Fuel Pump Installation"            → { base: "Fuel Pump",            direction: "install" }
//   "Oil Change"                        → { base: "Oil Change",           direction: null }
//   "Removal of Clip Rivets"            → unchanged (direction word is at the start, not end)
function parseDirection(title) {
  const t = (title || '').trim()
  const m = t.match(/^(.+?)[,\s]+(REMOVAL|INSTALLATION|REMOVE|INSTALL)$/i)
  if (!m) return { base: t, direction: null }
  const base = m[1].trim().replace(/[,;:\s]+$/, '').trim()
  const word = m[2].toLowerCase()
  const direction =
    word === 'removal' || word === 'remove' ? 'remove' : 'install'
  return { base, direction }
}

// Take a flat list of procedures, return a list of items where each
// item is either a single procedure (no pair found) or a paired
// {remove, install} object. Pairing key = normalized base title; we
// only pair within the same category (caller already grouped by
// category).
function pairRemoveInstall(procedures) {
  const buckets = new Map() // baseKey → { base, remove, install, others: [] }
  for (const p of procedures) {
    const { base, direction } = parseDirection(p.title)
    const key = base.toLowerCase()
    if (!buckets.has(key)) buckets.set(key, { base, items: [] })
    buckets.get(key).items.push({ procedure: p, direction })
  }

  const result = []
  for (const { base, items } of buckets.values()) {
    const remove = items.find((i) => i.direction === 'remove')?.procedure
    const install = items.find((i) => i.direction === 'install')?.procedure
    const singles = items
      .filter((i) => i.direction == null)
      .map((i) => i.procedure)

    if (remove && install) {
      // Proper pair. Pick canonical id = remove.id (we'll default the
      // detail page to "remove" direction).
      result.push({
        id: remove.id,
        baseTitle: base || remove.title,
        summary: remove.summary || install.summary,
        difficulty: pickWorseDifficulty(remove.difficulty, install.difficulty),
        time_minutes:
          (remove.time_minutes || 0) + (install.time_minutes || 0) || null,
        remove: stripProc(remove),
        install: stripProc(install),
        hasPair: true,
        applies_to: mergeAppliesTo(remove.applies_to, install.applies_to)
      })
    } else if (remove || install) {
      // Only one half of a pair — present it as a single, but record
      // which direction it actually is so the detail page can label it.
      const only = remove || install
      result.push({
        id: only.id,
        baseTitle: base || only.title,
        summary: only.summary,
        difficulty: only.difficulty,
        time_minutes: only.time_minutes || null,
        remove: remove ? stripProc(remove) : null,
        install: install ? stripProc(install) : null,
        hasPair: false,
        applies_to: only.applies_to || []
      })
    }

    // Singles (no direction in title) — e.g. "Oil Change". Each
    // becomes its own item, no pair.
    for (const s of singles) {
      result.push({
        id: s.id,
        baseTitle: s.title,
        summary: s.summary,
        difficulty: s.difficulty,
        time_minutes: s.time_minutes || null,
        remove: null,
        install: null,
        hasPair: false,
        applies_to: s.applies_to || []
      })
    }
  }
  return result
}

function stripProc(p) {
  if (!p) return null
  return {
    id: p.id,
    title: p.title,
    summary: p.summary,
    difficulty: p.difficulty,
    time_minutes: p.time_minutes
  }
}

function pickWorseDifficulty(a, b) {
  const order = { beginner: 1, intermediate: 2, advanced: 3 }
  const av = order[(a || '').toLowerCase()] || 0
  const bv = order[(b || '').toLowerCase()] || 0
  return av >= bv ? a : b
}

function mergeAppliesTo(a, b) {
  const set = new Set([...(a || []), ...(b || [])])
  return Array.from(set)
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

// Expand a bike's literal model code into a list of candidates we
// should match against a manual's `model_codes` list. The expansion
// goes from most specific → least specific, so the rider gets
// procedures from both their CVO supplement (when ingested) AND the
// underlying base manual.
//
// Rules (HD nomenclature):
//   - SE suffix    → CVO/Custom Vehicle Operations variant.
//                    FLHXSE → ['FLHXSE', 'FLHX']
//                    FLHTKSE → ['FLHTKSE', 'FLHTK']
//                    FLTRXSE → ['FLTRXSE', 'FLTRX']
//   - S suffix (single trailing 'S', not 'SE') → "Special" trim.
//                    FLHXS → ['FLHXS', 'FLHX']
//                    FLTRXS → ['FLTRXS', 'FLTRX']
//                    FLHRXS → ['FLHRXS', 'FLHRX']
//   - L suffix     → "Low" variant (e.g. FLHTKL Ultra Limited Low).
//                    FLHTKL → ['FLHTKL', 'FLHTK']
//   - Otherwise    → [literal code]
//
// We require the stripped form to be ≥4 chars so we don't accidentally
// peel back a short base code.
function expandModelCodes(bike) {
  const out = []
  const base = extractModelCode(bike)
  if (!base) return out
  out.push(base)

  if (/SE$/.test(base)) {
    const stripped = base.slice(0, -2)
    if (stripped.length >= 4) out.push(stripped)
  } else if (/[A-Z]L$/.test(base)) {
    const stripped = base.slice(0, -1)
    if (stripped.length >= 4) out.push(stripped)
  } else if (/[A-Z]S$/.test(base)) {
    const stripped = base.slice(0, -1)
    if (stripped.length >= 4) out.push(stripped)
  }
  return out
}
