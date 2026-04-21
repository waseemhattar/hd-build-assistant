// Client-side global search across the jobs catalog.
//
// ~300 jobs fit comfortably in memory; no external index needed yet.
// When the catalog grows past a few thousand jobs we can swap in lunr
// or fuse.js behind the same searchJobs() API.
//
// Ranking is simple-but-useful:
//   - Title exact-ish match                 : +100
//   - Title word-boundary match              : +50
//   - Part number match (any in parts[])     : +40
//   - Torque fastener match                  : +20
//   - Step text match                        : +10 per hit (capped at 30)
//   - Tool match                             : +5
//   - Summary match                          : +5
//   - System/difficulty match                : +3
// Ties break on title length (shorter wins).

import { jobs } from './jobs.js'
import { bikes } from './bikes.js'

const bikesById = Object.fromEntries(bikes.map((b) => [b.id, b]))

function normalize(s) {
  return (s || '').toString().toLowerCase()
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Returns a snippet of text with the first match boldable via a marker.
// We return { text, hitIndex, hitLength } so the UI can render it.
function firstHit(haystack, needle) {
  if (!haystack) return null
  const hay = normalize(haystack)
  const idx = hay.indexOf(needle)
  if (idx < 0) return null
  const start = Math.max(0, idx - 40)
  const end = Math.min(haystack.length, idx + needle.length + 60)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < haystack.length ? '…' : ''
  return {
    before: prefix + haystack.slice(start, idx),
    match: haystack.slice(idx, idx + needle.length),
    after: haystack.slice(idx + needle.length, end) + suffix
  }
}

function scoreJob(job, q) {
  const needle = normalize(q).trim()
  if (!needle) return null

  const title = normalize(job.title)
  const summary = normalize(job.summary)
  const system = normalize(job.system)
  const difficulty = normalize(job.difficulty)

  let score = 0
  const hits = [] // [{field, text, snippet?}]

  // Title
  if (title === needle) score += 150
  else if (title.startsWith(needle)) score += 120
  else if (new RegExp('\\b' + escapeRegex(needle)).test(title)) score += 70
  else if (title.includes(needle)) score += 50

  if (title.includes(needle)) {
    hits.push({
      field: 'title',
      snippet: firstHit(job.title, needle)
    })
  }

  // Parts
  for (const p of job.parts || []) {
    const num = normalize(p.number)
    const desc = normalize(p.description)
    if (num && num.includes(needle)) {
      score += 40
      hits.push({
        field: 'part',
        snippet: firstHit(`${p.number} — ${p.description}`, needle)
      })
      break
    }
    if (desc && desc.includes(needle)) {
      score += 15
      hits.push({
        field: 'part',
        snippet: firstHit(`${p.number} — ${p.description}`, needle)
      })
      break
    }
  }

  // Torque
  for (const t of job.torque || []) {
    const f = normalize(t.fastener)
    const v = normalize(t.value)
    if ((f && f.includes(needle)) || (v && v.includes(needle))) {
      score += 20
      hits.push({
        field: 'torque',
        snippet: firstHit(`${t.fastener}: ${t.value}`, needle)
      })
      break
    }
  }

  // Steps (cap contribution to avoid a 40-step job dominating)
  let stepHits = 0
  for (const s of job.steps || []) {
    if (normalize(s.text).includes(needle)) {
      stepHits++
      if (stepHits <= 3) {
        hits.push({
          field: 'step',
          snippet: firstHit(s.text, needle)
        })
      }
      if (stepHits >= 3) break
    }
  }
  score += Math.min(stepHits, 3) * 10

  // Tools
  for (const t of job.tools || []) {
    if (normalize(t).includes(needle)) {
      score += 5
      hits.push({ field: 'tool', snippet: firstHit(t, needle) })
      break
    }
  }

  // Summary
  if (summary.includes(needle)) {
    score += 5
    if (!hits.find((h) => h.field === 'title')) {
      hits.push({ field: 'summary', snippet: firstHit(job.summary, needle) })
    }
  }

  if (system.includes(needle)) score += 3
  if (difficulty.includes(needle)) score += 3

  if (score === 0) return null

  // Resolve the primary bike to show alongside the result.
  const bike = (job.bikeIds || [])
    .map((id) => bikesById[id])
    .find(Boolean)

  return {
    job,
    bike,
    score,
    // Take the best 3 snippets, prefer title > part > torque > step > tool > summary.
    hits: hits.slice(0, 3)
  }
}

export function searchJobs(q, { limit = 30 } = {}) {
  const needle = (q || '').trim()
  if (needle.length < 2) return []
  const results = []
  for (const job of jobs) {
    const r = scoreJob(job, needle)
    if (r) results.push(r)
  }
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.job.title.length - b.job.title.length
  })
  return results.slice(0, limit)
}
