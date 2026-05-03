#!/usr/bin/env node
//
// seed-curated-routes — bulk-insert curated routes into suggested_rides
//                       using the service-role key (bypasses RLS).
//
// Why this script exists:
//
//   The Discover surface has two content sources: user-recorded public
//   rides (flow through the rides table + existing share toggle) and
//   admin-curated iconic routes (this script). User submissions are
//   locked to authentic GPS recordings — no GPX upload UI — so the
//   curated path exists purely to seed the platform with regional
//   "must-ride" content from day one. ("Hatta loop", "Stelvio",
//   "Tail of the Dragon", etc.)
//
// Layout:
//
//   curated/
//     hatta-loop.gpx
//     hatta-loop.json
//     stelvio.gpx
//     stelvio.json
//     ...
//
// For each <name>.gpx the script expects a sibling <name>.json with
// metadata. Only `title` is required; everything else is optional and
// inferred from sensible defaults if missing.
//
//   {
//     "title": "Hatta Loop via Madha",
//     "description": "Twisty mountain loop east of Dubai...",
//     "region": "UAE / Hatta",
//     "difficulty": "moderate",                 // 'easy'|'moderate'|'expert'
//     "ridingStyle": ["scenic", "twisty"],      // free-form tags
//     "bikeType": ["touring", "softail", "adv"],
//     "surface": "paved",                       // 'paved'|'mixed'|'gravel'
//     "seasonRecommended": "winter",
//     "tags": ["mountain", "border-crossing", "fuel-stop-recommended"],
//     "pointsOfInterest": [
//       { "name": "Hatta Heritage Village", "lat": 24.79, "lng": 56.13, "kind": "scenic" }
//     ],
//     "photoUrls": ["https://.../hatta-1.jpg"],
//     "externalUrl": "https://www.scenic.app/...",
//     "gpxAttribution": "Original GPX by ScenicApp community"
//   }
//
// Usage:
//
//   SUPABASE_URL=https://<ref>.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   node scripts/seed-curated-routes.mjs ./curated
//
// Idempotency:
//
//   The script uses the JSON's `title + region` as a soft uniqueness
//   key. If a row with that pair already exists in suggested_rides
//   it's UPDATED in place rather than duplicated. Re-running after
//   editing a metadata file is safe.

import { readdir, readFile } from 'node:fs/promises'
import { extname, join, basename } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Missing env. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.\n' +
      'You can find both in Supabase Dashboard → Project Settings → API.'
  )
  process.exit(1)
}

const dir = process.argv[2]
if (!dir) {
  console.error('Usage: node seed-curated-routes.mjs <directory>')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
})

// Minimal GPX parser. We only care about <trkpt lat="..." lon="..."> and
// <rtept> nodes. No XML lib dep — regex is enough for this format.
function parseGpx(xml) {
  const points = []
  const re = /<(?:trkpt|rtept)\s+lat="([\-0-9.]+)"\s+lon="([\-0-9.]+)"/gi
  let m
  while ((m = re.exec(xml)) !== null) {
    const lat = Number(m[1])
    const lng = Number(m[2])
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      points.push([lat, lng])
    }
  }
  return points
}

// Haversine distance between two [lat, lng] points in meters.
function haversine(a, b) {
  const R = 6371000
  const toRad = (x) => (x * Math.PI) / 180
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const lat1 = toRad(a[0])
  const lat2 = toRad(b[0])
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function totalDistance(points) {
  let d = 0
  for (let i = 1; i < points.length; i++) d += haversine(points[i - 1], points[i])
  return Math.round(d)
}

function bbox(points) {
  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity
  for (const [lat, lng] of points) {
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
  }
  return { minLat, maxLat, minLng, maxLng }
}

// Estimate planning duration from distance. Curated routes are guidance,
// not measured trips — we assume ~50 km/h average for the planner card,
// which matches typical mixed-road touring pace.
function estimateDurationSeconds(distanceMeters) {
  const kmh = 50
  return Math.round((distanceMeters / 1000 / kmh) * 3600)
}

async function processOne(gpxPath, metaPath) {
  const xml = await readFile(gpxPath, 'utf8')
  const points = parseGpx(xml)
  if (points.length < 2) {
    return { ok: false, reason: `${basename(gpxPath)}: no track points` }
  }
  const distance_m = totalDistance(points)
  const bb = bbox(points)
  const duration_estimate_seconds = estimateDurationSeconds(distance_m)

  let meta = {}
  try {
    meta = JSON.parse(await readFile(metaPath, 'utf8'))
  } catch (e) {
    return {
      ok: false,
      reason: `${basename(metaPath)} missing or unparseable: ${e.message}`
    }
  }

  if (!meta.title || typeof meta.title !== 'string') {
    return { ok: false, reason: `${basename(metaPath)}: missing "title"` }
  }

  const row = {
    source: 'curated_admin',
    title: meta.title,
    description: meta.description || null,
    region: meta.region || null,
    route: points,
    bbox_min_lat: bb.minLat,
    bbox_max_lat: bb.maxLat,
    bbox_min_lng: bb.minLng,
    bbox_max_lng: bb.maxLng,
    distance_m,
    duration_estimate_seconds,
    difficulty: meta.difficulty || null,
    riding_style: Array.isArray(meta.ridingStyle) ? meta.ridingStyle : [],
    bike_type: Array.isArray(meta.bikeType) ? meta.bikeType : [],
    surface: meta.surface || null,
    season_recommended: meta.seasonRecommended || null,
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    points_of_interest: Array.isArray(meta.pointsOfInterest)
      ? meta.pointsOfInterest
      : [],
    photo_urls: Array.isArray(meta.photoUrls) ? meta.photoUrls : [],
    external_url: meta.externalUrl || null,
    gpx_attribution: meta.gpxAttribution || null,
    is_published: meta.isPublished !== false   // default to published
  }

  // Soft-uniqueness: title + region. Update existing row if present.
  const { data: existing, error: selErr } = await supabase
    .from('suggested_rides')
    .select('id')
    .eq('title', row.title)
    .eq('region', row.region || '')
    .limit(1)
    .maybeSingle()
  if (selErr && selErr.code !== 'PGRST116') {
    return { ok: false, reason: `lookup failed: ${selErr.message}` }
  }

  if (existing?.id) {
    const { error } = await supabase
      .from('suggested_rides')
      .update(row)
      .eq('id', existing.id)
    if (error) return { ok: false, reason: `update failed: ${error.message}` }
    return { ok: true, action: 'updated', id: existing.id, title: row.title }
  } else {
    const { data, error } = await supabase
      .from('suggested_rides')
      .insert(row)
      .select('id')
      .single()
    if (error) return { ok: false, reason: `insert failed: ${error.message}` }
    return { ok: true, action: 'inserted', id: data.id, title: row.title }
  }
}

async function main() {
  const entries = await readdir(dir)
  const gpxFiles = entries.filter((f) => extname(f).toLowerCase() === '.gpx')
  if (gpxFiles.length === 0) {
    console.error(`No .gpx files in ${dir}`)
    process.exit(1)
  }

  console.log(`Found ${gpxFiles.length} GPX file(s) in ${dir}`)
  let inserted = 0,
    updated = 0,
    failed = 0
  for (const gpx of gpxFiles) {
    const base = gpx.slice(0, -extname(gpx).length)
    const meta = `${base}.json`
    const result = await processOne(join(dir, gpx), join(dir, meta))
    if (result.ok) {
      console.log(`  ✓ ${result.action.padEnd(8)} ${result.title}`)
      if (result.action === 'inserted') inserted++
      else updated++
    } else {
      console.log(`  ✗ ${result.reason}`)
      failed++
    }
  }
  console.log(
    `\nDone. ${inserted} inserted, ${updated} updated, ${failed} failed.`
  )
}

main().catch((e) => {
  console.error('Seed failed:', e.message || e)
  process.exit(1)
})
