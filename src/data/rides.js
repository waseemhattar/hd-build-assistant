// Ride data layer — CRUD against the public.rides table.
//
// Mirrors the pattern in storage.js: synchronous reads from cache,
// async writes that resolve back into cache. Different from storage.js
// in one important way: rides are append-only from the user's
// perspective (they don't usually edit a ride after saving) so we
// don't need the elaborate write-through queue. We just write to
// Supabase directly.

import { getSupabaseClient } from './supabaseClient.js'

// ---------- helpers ----------

// Distance between two GPS points (Haversine formula). Returns meters.
export function haversineMeters(p1, p2) {
  const [lat1, lng1] = p1
  const [lat2, lng2] = p2
  const R = 6371000 // earth radius in meters
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// Total distance of a route (array of [lat, lng, ...] tuples). Meters.
export function totalDistanceM(route) {
  if (!route || route.length < 2) return 0
  let sum = 0
  for (let i = 1; i < route.length; i++) {
    sum += haversineMeters(route[i - 1], route[i])
  }
  return Math.round(sum)
}

// Route summary stats — feed it the [lat,lng,ts,speed] array, get
// back duration_seconds, distance_m, max_speed_mps, avg_speed_mps.
export function summarizeRoute(route, startedAtMs) {
  if (!route || route.length === 0) {
    return {
      durationSec: 0,
      distanceM: 0,
      maxSpeedMps: 0,
      avgSpeedMps: 0
    }
  }
  const distanceM = totalDistanceM(route)
  const lastTs = route[route.length - 1]?.[2] || Date.now()
  const startTs = route[0]?.[2] || startedAtMs || Date.now()
  const durationSec = Math.max(1, Math.round((lastTs - startTs) / 1000))
  let maxSpeed = 0
  for (const pt of route) {
    const speed = pt[3] || 0
    if (speed > maxSpeed) maxSpeed = speed
  }
  const avgSpeed = distanceM / durationSec
  return {
    durationSec,
    distanceM,
    maxSpeedMps: Math.round(maxSpeed * 100) / 100,
    avgSpeedMps: Math.round(avgSpeed * 100) / 100
  }
}

// ---------- CRUD ----------

// Save a completed ride. Computes summary stats, writes to Supabase,
// returns the inserted row.
//
// `payload`:
//   {
//     bikeId: uuid | null,
//     startedAtMs: number,
//     route: [[lat, lng, ts_ms, speed_mps], ...],
//     title?: string,
//     notes?: string,
//     weather?: string,
//     startMileage?: number,
//     endMileage?: number
//   }
export async function saveRide(payload, authUserId) {
  const sb = getSupabaseClient()
  const summary = summarizeRoute(payload.route, payload.startedAtMs)
  const startedAt = new Date(
    payload.route?.[0]?.[2] || payload.startedAtMs || Date.now()
  ).toISOString()
  const endedAt = new Date(
    payload.route?.[payload.route.length - 1]?.[2] || Date.now()
  ).toISOString()

  const row = {
    auth_user_id: authUserId,
    bike_id: payload.bikeId || null,
    started_at: startedAt,
    ended_at: endedAt,
    duration_seconds: summary.durationSec,
    distance_m: summary.distanceM,
    max_speed_mps: summary.maxSpeedMps,
    avg_speed_mps: summary.avgSpeedMps,
    route: payload.route,
    title: payload.title || null,
    notes: payload.notes || null,
    weather: payload.weather || null,
    start_mileage: payload.startMileage || null,
    end_mileage: payload.endMileage || null
  }

  const { data, error } = await sb.from('rides').insert(row).select().single()
  if (error) throw error
  return data
}

// List rides for the current user (or just for one bike). Returns
// lightweight metadata only — route polyline is excluded for speed.
// Use getRideDetail() to fetch the full route when needed.
export async function listRides({ bikeId = null, limit = 50 } = {}) {
  const sb = getSupabaseClient()
  let q = sb
    .from('rides')
    .select(
      'id, bike_id, started_at, ended_at, duration_seconds, distance_m, max_speed_mps, avg_speed_mps, title, weather, start_mileage, end_mileage'
    )
    .order('started_at', { ascending: false })
    .limit(limit)
  if (bikeId) q = q.eq('bike_id', bikeId)
  const { data, error } = await q
  if (error) throw error
  return data || []
}

// Full ride detail — includes the route polyline.
export async function getRideDetail(rideId) {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('rides')
    .select('*')
    .eq('id', rideId)
    .single()
  if (error) throw error
  return data
}

// Delete a ride. Soft delete is overkill for rides; hard delete is fine.
export async function deleteRide(rideId) {
  const sb = getSupabaseClient()
  const { error } = await sb.from('rides').delete().eq('id', rideId)
  if (error) throw error
}

// Update a ride's bike association after the fact (rider rode without
// picking a bike, then assigned it later) or its title/notes.
export async function updateRide(rideId, patch) {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('rides')
    .update(patch)
    .eq('id', rideId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ---------- formatting ----------

export function formatDistance(meters, unit = 'mi') {
  if (!meters) return '0 mi'
  if (unit === 'km') return `${(meters / 1000).toFixed(1)} km`
  // miles
  return `${(meters / 1609.344).toFixed(1)} mi`
}

export function formatDuration(seconds) {
  if (!seconds) return '0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function formatSpeed(mps, unit = 'mph') {
  if (!mps) return '0 mph'
  if (unit === 'kmh') return `${(mps * 3.6).toFixed(0)} km/h`
  return `${(mps * 2.23694).toFixed(0)} mph`
}
