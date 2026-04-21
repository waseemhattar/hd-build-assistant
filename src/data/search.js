// Client-side global search across the jobs catalog.
//
// Smart search pipeline:
//   1. Tokenize the query — split on whitespace/punct, each word is a
//      separate constraint. All tokens must match somewhere in the job.
//   2. Expand synonyms so rider slang ("tranny", "M8", "pads") finds
//      manual-speak ("transmission", "Milwaukee 8", "brake pads").
//   3. Stem each token (light Porter) so "plugs" == "plug", "gaskets"
//      == "gasket", "bearings" == "bearing".
//   4. Score each job against the expanded token set and return ranked
//      results with snippet previews.
//
// No external dependencies — fast enough for ~300 jobs and scales
// cleanly to a few thousand before we'd want lucene/fuse.

import { jobs } from './jobs.js'
import { bikes } from './bikes.js'

const bikesById = Object.fromEntries(bikes.map((b) => [b.id, b]))

// ---------------- Harley-specific synonym map ----------------
//
// Each entry: canonical form -> list of riders' aliases.
// At query time we expand aliases -> canonical. For indexing we stem
// both sides, so "sparkplug" -> "spark plug" -> ["spark", "plug"].

const SYNONYMS = [
  ['spark plug', ['sparkplug', 'sparkplugs', 'plug', 'plugs']],
  ['brake pad', ['pads', 'pad', 'brake pads', 'brakepad', 'brakepads']],
  ['brake rotor', ['rotor', 'rotors', 'disc', 'discs', 'brake disc']],
  ['brake fluid', ['brakefluid']],
  ['handlebar', ['bars', 'bar', 'handle bars']],
  ['footboard', ['floorboards', 'floorboard', 'footboards', 'boards']],
  ['footpeg', ['pegs', 'peg', 'footpegs']],
  ['transmission', ['trans', 'tranny', 'gearbox', 'gear box']],
  ['milwaukee 8', ['m8', 'milwaukee eight']],
  ['twin cam', ['tc', 'twincam']],
  ['harley davidson', ['hd', 'harley', 'h-d', 'h d']],
  ['lubricant', ['fluid', 'oil']],
  ['fuel', ['gas', 'gasoline', 'petrol']],
  ['primary chaincase', ['primary', 'chaincase', 'primary fluid', 'primary oil']],
  ['air cleaner', ['air filter', 'airfilter', 'aircleaner']],
  ['caliper', ['calliper']], // common misspelling
  ['fork', ['forks', 'front fork', 'front forks']],
  ['battery', ['batt']],
  ['ignition coil', ['coil', 'coils']],
  ['swingarm', ['swing arm', 'swing-arm']],
  ['drive belt', ['belt', 'rear belt']],
  ['oil pan', ['oilpan']],
  ['oil filter', ['oilfilter']],
  ['throttle body', ['throttlebody', 'tb']],
  ['exhaust', ['pipe', 'pipes', 'mufflers', 'muffler', 'slip on', 'slip-on', 'slipon']],
  ['wheel bearing', ['bearings', 'bearing']],
  ['cam chain tensioner', ['cct', 'tensioner']],
  ['ecm', ['ecu', 'computer']],
  ['voltage regulator', ['regulator', 'vreg', 'v-reg']],
  ['stator', ['charging stator']],
  ['clutch lever', ['lever']],
  ['master cylinder', ['mastercylinder', 'mc']],
  ['windshield', ['windscreen', 'screen']],
  ['saddlebag', ['saddle bag', 'bag', 'bags', 'bags']],
  ['headlight', ['head light', 'headlamp', 'head lamp']],
  ['tail light', ['taillight', 'tail lamp', 'taillamp']],
  ['turn signal', ['blinker', 'blinkers', 'indicator', 'indicators']],
  ['wheel', ['rim', 'rims']],
  ['tire', ['tyre', 'tyres', 'tires']],
  ['mount', ['mounts', 'mounting']],
  ['install', ['installation', 'installing']],
  ['remove', ['removal', 'removing']],
  ['replace', ['replacement', 'replacing', 'swap', 'swapping', 'change', 'changing']]
]

// Build reverse map alias -> canonical (both normalized).
const aliasToCanonical = new Map()
for (const [canonical, aliases] of SYNONYMS) {
  const can = normalize(canonical)
  aliasToCanonical.set(can, can)
  for (const a of aliases) {
    aliasToCanonical.set(normalize(a), can)
  }
}

// ---------------- Normalize / tokenize / stem ----------------

function normalize(s) {
  return (s || '').toString().toLowerCase().trim()
}

// Tokenize on anything that isn't an alphanumeric. This handles
// "Engine Oil & Filter — Replace" -> ["engine","oil","filter","replace"].
// Part numbers like "41300149" stay intact.
function tokenize(s) {
  return normalize(s)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

// Light Porter-style stemmer — good enough for service-manual English.
// Not a full Porter implementation; intentionally conservative so we
// don't over-stem (e.g. "gas" must stay "gas").
function stem(word) {
  if (!word || word.length <= 3) return word
  let w = word

  // Keep pure numbers / part numbers untouched.
  if (/^\d+$/.test(w)) return w

  // Common suffix rules, ordered longest-first.
  const suffixes = [
    ['ational', 'ate'],
    ['tional', 'tion'],
    ['ization', 'ize'],
    ['ational', 'ate'],
    ['iveness', 'ive'],
    ['fulness', 'ful'],
    ['ousness', 'ous'],
    ['ement', ''],
    ['ments', ''],
    ['ment', ''],
    ['ness', ''],
    ['able', ''],
    ['ible', ''],
    ['ance', ''],
    ['ence', ''],
    ['ings', ''],
    ['ing', ''],
    ['ied', 'y'],
    ['ies', 'y'],
    ['ied', 'y'],
    ['ies', 'y'],
    ['sses', 'ss'],
    ['ied', 'y'],
    ['ers', 'er'],
    ['ed', ''],
    ['ly', ''],
    ['es', ''],
    ['s', '']
  ]

  for (const [suf, rep] of suffixes) {
    if (w.endsWith(suf) && w.length - suf.length >= 3) {
      w = w.slice(0, w.length - suf.length) + rep
      break
    }
  }

  // Collapse doubled consonants at end: "stopp" -> "stop".
  if (/[bdfgmnprt]{2}$/.test(w)) {
    w = w.slice(0, -1)
  }

  return w
}

// Expand synonyms for a single token. Returns a Set of canonical+stemmed
// forms. Example: "plugs" -> {"plug", "spark", "plug"} ... the token
// "plugs" has synonym "spark plug", so its canonical tokens are
// ["spark","plug"] both stemmed.
function expandToken(token) {
  const out = new Set()
  const stemmed = stem(token)
  out.add(stemmed)

  // Direct alias hit on raw token.
  const canon = aliasToCanonical.get(token) || aliasToCanonical.get(stemmed)
  if (canon) {
    for (const t of tokenize(canon)) out.add(stem(t))
  }
  return out
}

// Expand a multi-word query. Also tries matching two-word alias keys
// ("brake pad", "twin cam") so we don't miss multi-word synonyms.
function expandQuery(q) {
  const raw = tokenize(q)
  if (raw.length === 0) return { perToken: [], allExpanded: new Set() }

  // Try 2-token windows for multi-word alias hits (non-greedy: we still
  // keep the individual tokens, but if "brake pad" resolves, the output
  // set also includes its canonical-form stems).
  const perToken = raw.map(expandToken)

  for (let i = 0; i < raw.length - 1; i++) {
    const phrase = raw[i] + ' ' + raw[i + 1]
    const canon = aliasToCanonical.get(phrase)
    if (canon) {
      const extras = tokenize(canon).map(stem)
      // Fold the phrase's canonical stems into BOTH involved tokens'
      // expansion sets. That way "brake pad" still scores as two
      // constraints, but both of them can be satisfied by the canonical
      // phrase tokens.
      for (const e of extras) {
        perToken[i].add(e)
        perToken[i + 1].add(e)
      }
    }
  }

  const allExpanded = new Set()
  for (const set of perToken) for (const t of set) allExpanded.add(t)
  return { perToken, allExpanded }
}

// ---------------- Job indexing ----------------

// Build a per-field token bag once on module load so scoring is cheap.
// Each job gets an index: {title:Set, parts:Set, torque:Set, steps:Set, ...}

function indexJob(job) {
  const fieldTokens = (s) => {
    const set = new Set()
    for (const t of tokenize(s)) {
      const stemmed = stem(t)
      set.add(stemmed)
      // Also add any alias canonicals this token participates in, so a
      // job titled "Spark Plugs" is also findable via "sparkplug".
      const canon = aliasToCanonical.get(t) || aliasToCanonical.get(stemmed)
      if (canon) {
        for (const c of tokenize(canon)) set.add(stem(c))
      }
    }
    return set
  }

  const titleSet = fieldTokens(job.title)
  const summarySet = fieldTokens(job.summary)
  const systemSet = fieldTokens(job.system)
  const difficultySet = fieldTokens(job.difficulty)

  // For parts: separate the number from the description.
  const partNumberSet = new Set()
  const partDescSet = new Set()
  for (const p of job.parts || []) {
    if (p.number) partNumberSet.add(normalize(p.number))
    for (const t of fieldTokens(p.description)) partDescSet.add(t)
  }

  const torqueSet = new Set()
  for (const t of job.torque || []) {
    for (const w of fieldTokens(t.fastener)) torqueSet.add(w)
    for (const w of fieldTokens(t.value)) torqueSet.add(w)
  }

  const stepSet = new Set()
  for (const s of job.steps || []) {
    for (const w of fieldTokens(s.text)) stepSet.add(w)
  }

  const toolSet = new Set()
  for (const t of job.tools || []) {
    for (const w of fieldTokens(t)) toolSet.add(w)
  }

  return {
    title: titleSet,
    summary: summarySet,
    system: systemSet,
    difficulty: difficultySet,
    partNumber: partNumberSet,
    partDesc: partDescSet,
    torque: torqueSet,
    step: stepSet,
    tool: toolSet
  }
}

// Build the whole index once.
const JOB_INDEX = jobs.map((job) => ({ job, idx: indexJob(job) }))

// ---------------- Scoring ----------------

// Per-field weights.
const WEIGHTS = {
  title: 50,
  partNumber: 40,
  partDesc: 15,
  torque: 18,
  summary: 8,
  step: 10,
  tool: 6,
  system: 5,
  difficulty: 3
}

// Does any of these tokens appear in the field set?
function fieldHasAny(fieldSet, tokens) {
  for (const t of tokens) if (fieldSet.has(t)) return true
  return false
}

function scoreJob({ job, idx }, perToken, rawQuery) {
  // Constraint: every raw query token must be satisfied by at least one
  // field. Without this, "oil filter" would return any job that contains
  // either "oil" or "filter".
  const fieldsPool = [
    idx.title, idx.partDesc, idx.partNumber, idx.torque, idx.summary,
    idx.step, idx.tool, idx.system, idx.difficulty
  ]
  for (const tokenSet of perToken) {
    let satisfied = false
    for (const f of fieldsPool) {
      if (fieldHasAny(f, tokenSet)) { satisfied = true; break }
    }
    if (!satisfied) return null
  }

  // Score: sum per-field weight once per token that appears in that
  // field. Title match for multi-word ("oil filter") -> titleScore = 2 *
  // WEIGHTS.title, which is correct: both tokens live in the title.
  let score = 0

  // Phrase bonus: if the whole raw query appears contiguously in the
  // title (case-insensitive), add a big boost. This recovers the
  // "exact phrase match is best" behavior without requiring it.
  const rawNorm = normalize(rawQuery)
  if (normalize(job.title).includes(rawNorm)) score += 100
  if (normalize(job.title).startsWith(rawNorm)) score += 40

  for (const tokenSet of perToken) {
    if (fieldHasAny(idx.title, tokenSet)) score += WEIGHTS.title
    if (fieldHasAny(idx.partNumber, tokenSet)) score += WEIGHTS.partNumber
    if (fieldHasAny(idx.partDesc, tokenSet)) score += WEIGHTS.partDesc
    if (fieldHasAny(idx.torque, tokenSet)) score += WEIGHTS.torque
    if (fieldHasAny(idx.summary, tokenSet)) score += WEIGHTS.summary
    if (fieldHasAny(idx.step, tokenSet)) score += WEIGHTS.step
    if (fieldHasAny(idx.tool, tokenSet)) score += WEIGHTS.tool
    if (fieldHasAny(idx.system, tokenSet)) score += WEIGHTS.system
    if (fieldHasAny(idx.difficulty, tokenSet)) score += WEIGHTS.difficulty
  }

  return score
}

// ---------------- Snippet rendering ----------------
//
// For preview we still do a literal scan against the original text so
// the highlighted substring is the user's actual query. We try the full
// query first, then each raw token, against each field in priority order.

const SNIPPET_FIELDS = ['title', 'parts', 'torque', 'steps', 'tools', 'summary']

function snippetFromText(text, needle) {
  if (!text) return null
  const hay = text.toLowerCase()
  const idx = hay.indexOf(needle.toLowerCase())
  if (idx < 0) return null
  const start = Math.max(0, idx - 40)
  const end = Math.min(text.length, idx + needle.length + 60)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < text.length ? '…' : ''
  return {
    before: prefix + text.slice(start, idx),
    match: text.slice(idx, idx + needle.length),
    after: text.slice(idx + needle.length, end) + suffix
  }
}

function findSnippet(job, needle) {
  if (!needle) return null
  // Title
  let s = snippetFromText(job.title, needle)
  if (s) return { field: 'title', snippet: s }
  // Parts
  for (const p of job.parts || []) {
    const s1 = snippetFromText(`${p.number} — ${p.description}`, needle)
    if (s1) return { field: 'part', snippet: s1 }
  }
  // Torque
  for (const t of job.torque || []) {
    const s1 = snippetFromText(`${t.fastener}: ${t.value}`, needle)
    if (s1) return { field: 'torque', snippet: s1 }
  }
  // Steps
  for (const st of job.steps || []) {
    const s1 = snippetFromText(st.text, needle)
    if (s1) return { field: 'step', snippet: s1 }
  }
  // Tools
  for (const t of job.tools || []) {
    const s1 = snippetFromText(t, needle)
    if (s1) return { field: 'tool', snippet: s1 }
  }
  // Summary
  const s2 = snippetFromText(job.summary, needle)
  if (s2) return { field: 'summary', snippet: s2 }
  return null
}

function buildHits(job, rawQuery, rawTokens) {
  const hits = []
  const seenFields = new Set()

  // Try whole phrase first.
  const phraseHit = findSnippet(job, rawQuery)
  if (phraseHit) {
    hits.push(phraseHit)
    seenFields.add(phraseHit.field)
  }

  // Then per-token.
  for (const tok of rawTokens) {
    const h = findSnippet(job, tok)
    if (h && !seenFields.has(h.field)) {
      hits.push(h)
      seenFields.add(h.field)
    }
    if (hits.length >= 3) break
  }
  return hits
}

// ---------------- Public API ----------------

export function searchJobs(q, { limit = 30 } = {}) {
  const raw = (q || '').trim()
  if (raw.length < 2) return []

  const rawTokens = tokenize(raw)
  if (rawTokens.length === 0) return []

  const { perToken } = expandQuery(raw)

  const scored = []
  for (const entry of JOB_INDEX) {
    const score = scoreJob(entry, perToken, raw)
    if (score == null) continue
    scored.push({ entry, score })
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.entry.job.title.length - b.entry.job.title.length
  })

  return scored.slice(0, limit).map(({ entry, score }) => {
    const job = entry.job
    const bike = (job.bikeIds || [])
      .map((id) => bikesById[id])
      .find(Boolean)
    return {
      job,
      bike,
      score,
      hits: buildHits(job, raw, rawTokens)
    }
  })
}

// Exposed for tests/debugging.
export const _internals = { stem, tokenize, expandQuery }
