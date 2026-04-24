// VIN decoder for Harley-Davidson motorcycles.
//
// Two layers:
//   1. decodeVinLocal(vin)   — pure JS, zero network. Parses the WMI
//                              (positions 1-3) to check for Harley-Davidson
//                              and the model-year character (position 10)
//                              to derive the year. Good for instant feedback
//                              as the user types.
//   2. decodeVinRemote(vin)  — hits NHTSA's vPIC free public API. Returns
//                              manufacturer, model, make, engine info, etc.
//                              for nearly every bike sold in the US since
//                              1981 (17-char VINs).
//
// Plus:
//   - matchToBikeCatalog(decoded, catalog) — attempts to map the NHTSA
//     model + year to one of your `bikes.js` catalog entries so the
//     "Browse jobs" link lights up automatically.
//
// Design notes:
//   - Pre-1981 VINs vary in length. We only attempt to decode 17-char VINs;
//     anything shorter returns { valid: false } but the UI still lets users
//     save the bike with whatever they entered.
//   - NHTSA failures are never surface as exceptions to callers — they
//     return { ok: false, reason } so the UI can shrug and move on.

import { bikes as defaultCatalog } from './bikes.js'

// ----- VIN charset ----------------------------------------------------------
// I, O, Q are banned in VINs (to avoid confusion with 1/0).
const VIN_CHAR = /^[A-HJ-NPR-Z0-9]$/i
const VIN_17 = /^[A-HJ-NPR-Z0-9]{17}$/i

// ISO 3779 model-year character → calendar year. The character set cycles
// every 30 years (the decade digit position 7 is letter-vs-digit: letter
// means 1980–2009 or 2040+, digit means 2010–2039). We support modern HDs
// only, so assume the newer cycle (2010-2039) unless it doesn't make sense.
const YEAR_CHAR = {
  // 2010-2039 cycle (position 7 is a digit)
  A: 2010, B: 2011, C: 2012, D: 2013, E: 2014, F: 2015, G: 2016, H: 2017,
  J: 2018, K: 2019, L: 2020, M: 2021, N: 2022, P: 2023, R: 2024, S: 2025,
  T: 2026, V: 2027, W: 2028, X: 2029, Y: 2030,
  1: 2031, 2: 2032, 3: 2033, 4: 2034, 5: 2035, 6: 2036, 7: 2037, 8: 2038, 9: 2039
}

// Older cycle (1980-2009, position 7 is a letter). Fallback if the newer
// year doesn't look right. Very little of this catalog is pre-2010 but it's
// harmless to keep the mapping.
const YEAR_CHAR_OLD = {
  A: 1980, B: 1981, C: 1982, D: 1983, E: 1984, F: 1985, G: 1986, H: 1987,
  J: 1988, K: 1989, L: 1990, M: 1991, N: 1992, P: 1993, R: 1994, S: 1995,
  T: 1996, V: 1997, W: 1998, X: 1999, Y: 2000,
  1: 2001, 2: 2002, 3: 2003, 4: 2004, 5: 2005, 6: 2006, 7: 2007, 8: 2008, 9: 2009
}

// World Manufacturer Identifier prefixes (positions 1-3) that we recognize
// as Harley-Davidson. This isn't exhaustive — HD has used several over the
// years and for different vehicle classes — but it covers the big ones:
//   1HD  - US-built on-road motorcycles (most common)
//   5HD  - US-built, later production runs
//   4HD  - specific model series
// Anything else we flag as "not a Harley" so the chip can warn the user.
const HD_WMIS = new Set(['1HD', '5HD', '4HD'])

// ----- local decode --------------------------------------------------------

// Normalize a user-entered VIN: uppercase, strip whitespace, strip any chars
// that aren't valid VIN characters (paranoia against pastes with punctuation).
export function normalizeVin(vin) {
  if (!vin) return ''
  return String(vin)
    .toUpperCase()
    .replace(/\s+/g, '')
    .split('')
    .filter((c) => VIN_CHAR.test(c))
    .join('')
}

// Returns a shape the UI can render as a status chip:
//   { valid, isHarley, year, wmi, reason }
// `valid` is true only for a 17-character VIN using valid charset.
export function decodeVinLocal(rawVin) {
  const vin = normalizeVin(rawVin)

  if (!vin) {
    return { valid: false, isHarley: null, year: null, wmi: null, reason: null }
  }

  if (vin.length < 17) {
    return {
      valid: false,
      isHarley: null,
      year: null,
      wmi: vin.slice(0, 3),
      reason: `Incomplete — ${vin.length}/17 characters`,
      partial: true
    }
  }

  if (!VIN_17.test(vin)) {
    return {
      valid: false,
      isHarley: null,
      year: null,
      wmi: vin.slice(0, 3),
      reason: 'Contains invalid characters (I, O, and Q are not allowed in VINs).'
    }
  }

  const wmi = vin.slice(0, 3)
  const isHarley = HD_WMIS.has(wmi)
  const yearChar = vin.charAt(9) // position 10 (0-indexed 9)
  const plant = vin.charAt(10)   // position 11, informational

  // Decide which year cycle to use. Modern (2010-2039) is the default; fall
  // back to 1980-2009 only if the newer year would be in the future.
  const now = new Date().getFullYear()
  let year = YEAR_CHAR[yearChar] ?? null
  if (year && year > now + 1) {
    // e.g. 'Y' → 2030, which is fine in 2026, but if cycle says 2040+ we'd
    // rather pick the older cycle.
    const older = YEAR_CHAR_OLD[yearChar]
    if (older) year = older
  }

  return {
    valid: true,
    isHarley,
    year,
    wmi,
    plant,
    raw: vin,
    reason: isHarley ? null : `WMI ${wmi} is not a known Harley-Davidson prefix.`
  }
}

// ----- NHTSA remote decode -------------------------------------------------

const NHTSA_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin'

// Returns:
//   { ok: true, make, model, year, modelYear, engineDisplacementL,
//     bodyClass, plant, raw }
// or:
//   { ok: false, reason }
//
// Never throws. The UI can wait for this promise or show a spinner.
export async function decodeVinRemote(rawVin, { signal } = {}) {
  const vin = normalizeVin(rawVin)
  if (!VIN_17.test(vin)) {
    return { ok: false, reason: 'Only 17-character VINs can be decoded.' }
  }

  try {
    const res = await fetch(`${NHTSA_URL}/${vin}?format=json`, { signal })
    if (!res.ok) {
      return { ok: false, reason: `NHTSA returned HTTP ${res.status}` }
    }
    const body = await res.json()
    const rows = Array.isArray(body?.Results) ? body.Results : []

    // vPIC returns a big flat list of { Variable, Value, ... }. Pick out
    // the handful of fields we care about.
    const pick = (name) => {
      const row = rows.find((r) => r.Variable === name)
      const v = row?.Value
      if (v == null) return null
      const s = String(v).trim()
      if (!s || s === 'Not Applicable' || s === '0' || s === 'null') return null
      return s
    }

    const make = pick('Make')
    const model = pick('Model')
    const year = pick('Model Year')
    const displacement = pick('Displacement (L)')
    const bodyClass = pick('Body Class')
    const plant = pick('Plant City')
    const errorText = pick('Error Text')

    // NHTSA sometimes returns a row for every requested VIN but with error
    // codes. If Make/Year are null we treat it as a miss.
    if (!make && !year) {
      return {
        ok: false,
        reason: errorText || 'NHTSA did not recognize this VIN.'
      }
    }

    return {
      ok: true,
      make,
      model,
      year: year ? Number(year) : null,
      modelYear: year,
      engineDisplacementL: displacement ? Number(displacement) : null,
      bodyClass,
      plant,
      raw: rows
    }
  } catch (e) {
    if (e?.name === 'AbortError') return { ok: false, reason: 'aborted' }
    return { ok: false, reason: e?.message || 'network error' }
  }
}

// ----- Catalog matching ----------------------------------------------------

// Given a decoded-remote result (or just a { year, model } object), try to
// find the best-fit catalog entry from bikes.js.
//
// Strategy:
//   1. Exact model match: catalog.models includes the NHTSA model string
//      (case insensitive) AND the year falls inside the catalog entry's
//      generational range.
//   2. Model-code prefix match: if the model starts with the classic HD
//      alphabet code (FLHX, FLHR, FLTRXS, FXBR, ...), match on that AND
//      year range.
//   3. Year-range fallback: a catalog entry exists whose year-range includes
//      the decoded year. Returns that catalog entry's id but marks the
//      match as "loose" so the UI can say "you may want to double-check".
//
// Returns: { id, confidence: 'exact' | 'prefix' | 'loose' | null, entry }
// If no match at all, returns { id: null, confidence: null, entry: null }.
export function matchToBikeCatalog(decoded, catalog = defaultCatalog) {
  if (!decoded) return { id: null, confidence: null, entry: null }

  const year = decoded.year ? Number(decoded.year) : null
  const modelStr = (decoded.model || '').toString().trim().toUpperCase()

  // For each catalog entry, compute its year range. The `year` field in
  // bikes.js is usually the latest year of a generation; the label often
  // contains the full range (e.g. "Milwaukee 8 Gen 1 (2017 - 2023)"). We
  // parse the range from the label when present.
  const withRanges = catalog.map((entry) => ({
    entry,
    range: parseYearRange(entry.label, entry.year)
  }))

  // 1. Exact model match within range.
  if (modelStr && year) {
    for (const { entry, range } of withRanges) {
      if (!inRange(year, range)) continue
      const hit = (entry.models || []).some(
        (m) => m.toUpperCase() === modelStr
      )
      if (hit) return { id: entry.id, confidence: 'exact', entry }
    }
  }

  // 2. Model-code prefix match. NHTSA often returns just the code
  //    ("FLHR") or "FLHR ROAD KING", so compare on the first token.
  if (modelStr && year) {
    const firstToken = modelStr.split(/\s+/)[0]
    for (const { entry, range } of withRanges) {
      if (!inRange(year, range)) continue
      const hit = (entry.models || []).some((m) => {
        const code = m.split(/\s+/)[0].toUpperCase()
        return code === firstToken
      })
      if (hit) return { id: entry.id, confidence: 'prefix', entry }
    }
  }

  // 3. Year-range fallback (e.g. we know it's a 2020 touring-year but the
  //    model string is unfamiliar).
  if (year) {
    // Prefer the entry whose range contains the year AND whose family hint
    // matches what NHTSA calls it (Touring / Softail / CVO).
    const bodyHint = (decoded.bodyClass || '').toUpperCase()
    const family = /SOFTAIL/.test(bodyHint)
      ? 'Softail'
      : /TOUR/.test(bodyHint)
        ? 'Touring'
        : null
    if (family) {
      const match = withRanges.find(
        (r) => inRange(year, r.range) && r.entry.family === family
      )
      if (match) return { id: match.entry.id, confidence: 'loose', entry: match.entry }
    }
    const any = withRanges.find((r) => inRange(year, r.range))
    if (any) return { id: any.entry.id, confidence: 'loose', entry: any.entry }
  }

  return { id: null, confidence: null, entry: null }
}

// Pull "(2017 - 2023)" style ranges out of a catalog label. Falls back to
// [fallbackYear, fallbackYear] if no range is present.
function parseYearRange(label, fallbackYear) {
  const m = /(\d{4})\s*[-–]\s*(\d{4})/.exec(label || '')
  if (m) return [Number(m[1]), Number(m[2])]
  return [fallbackYear, fallbackYear]
}

function inRange(year, [lo, hi]) {
  if (!year || !lo || !hi) return false
  return year >= lo && year <= hi
}

// ----- Convenience: one-shot "decode and fill" -----------------------------

// Helper the UI can call with the current form state. Returns a patch you
// can merge into form state. Safe to call for any VIN length — it does
// nothing and resolves to {} if the VIN is too short.
//
// Options:
//   - force: if true, overwrite existing year/model/bikeTypeId even if the
//     user already filled them in. Default false (don't clobber user input).
export async function decodeAndFill(rawVin, currentForm = {}, opts = {}) {
  const local = decodeVinLocal(rawVin)
  if (!local.valid) return {}

  const remote = await decodeVinRemote(rawVin)
  if (!remote.ok) {
    // Even if NHTSA couldn't help, we might have a year from local decode.
    if (local.year && (opts.force || !currentForm.year)) {
      return { year: local.year }
    }
    return {}
  }

  const patch = {}

  // Year: prefer NHTSA, fall back to local.
  const bestYear = remote.year || local.year
  if (bestYear && (opts.force || !currentForm.year)) {
    patch.year = bestYear
  }

  // Model: only auto-fill if empty. NHTSA's model is often the HD code
  // ("FLHR") — try to upgrade to the full friendly name from the catalog.
  if ((opts.force || !currentForm.model) && remote.model) {
    const match = matchToBikeCatalog(remote)
    const friendly = upgradeModelName(remote.model, match.entry)
    patch.model = friendly
    if (match.id && (opts.force || !currentForm.bikeTypeId)) {
      patch.bikeTypeId = match.id
    }
  }

  return patch
}

// Turn "FLHR" into "FLHR Road King" if the catalog knows it. Leave whatever
// NHTSA gave us if we can't improve it.
function upgradeModelName(nhtsaModel, catalogEntry) {
  if (!nhtsaModel) return ''
  if (!catalogEntry) return nhtsaModel
  const token = nhtsaModel.split(/\s+/)[0].toUpperCase()
  const hit = (catalogEntry.models || []).find(
    (m) => m.split(/\s+/)[0].toUpperCase() === token
  )
  return hit || nhtsaModel
}
