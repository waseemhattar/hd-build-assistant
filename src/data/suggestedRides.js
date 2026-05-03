// Suggested rides — admin-curated routes surfaced in Discover alongside
// user-recorded public rides.
//
// This module is the read-and-rate side of the surface. Writes are
// admin-only via scripts/seed-curated-routes.mjs (which uses the
// service-role key). The client never inserts into suggested_rides.

import { getSupabaseClient } from './supabaseClient.js'

// Normalize the RPC result into a shape that mirrors listNearbyPublicRides
// from rides.js, so Discover can merge both arrays without per-source
// branches in the rendering code. The `source` field is preserved so
// the UI can badge differently (CURATED vs RECORDED).
function shapeRow(r) {
  return {
    id: r.id,
    kind: 'suggested',                  // discriminator for merged lists
    source: r.source,                   // 'curated_admin' | 'recorded'
    title: r.share_name,
    description: r.description || '',
    region: r.region || '',
    tags: r.tags || [],
    ridingStyle: r.riding_style || [],
    bikeType: r.bike_type || [],
    difficulty: r.difficulty || null,
    surface: r.surface || null,
    seasonRecommended: r.season_recommended || null,
    started_at: r.created_at,           // sort-key compatibility with rides
    duration_seconds: r.duration_seconds || 0,
    distance_m: r.distance_m || 0,
    weather: null,                      // not meaningful for curated routes
    display_name: r.display_name,
    bike_label: r.bike_label || null,
    ratingAvg: r.rating_avg != null ? Number(r.rating_avg) : null,
    ratingCount: r.rating_count || 0,
    externalUrl: r.external_url || null,
    gpxAttribution: r.gpx_attribution || null,
    photoUrls: r.photo_urls || [],
    route: r.route_public || []
  }
}

// Fetch curated rides whose bbox intersects a circle of radiusKm
// around (lat, lng). Mirrors listNearbyPublicRides from rides.js.
export async function listNearbySuggested({
  lat,
  lng,
  radiusKm = 50,
  limit = 100
}) {
  const sb = getSupabaseClient()
  const { data, error } = await sb.rpc('nearby_suggested_rides', {
    p_center_lat: Number(lat),
    p_center_lng: Number(lng),
    p_radius_km: Number(radiusKm),
    p_limit: Number(limit)
  })
  if (error) throw error
  return (data || []).map(shapeRow)
}

// Submit (or replace) the caller's rating for a curated route.
// rating must be 1-5; review is optional free text.
export async function rateSuggestedRide(rideId, rating, review = null) {
  if (!rideId) throw new Error('rideId required')
  const r = Number(rating)
  if (!Number.isFinite(r) || r < 1 || r > 5) {
    throw new Error('Rating must be 1-5')
  }
  const sb = getSupabaseClient()
  const { error } = await sb.rpc('rate_suggested_ride', {
    p_ride_id: rideId,
    p_rating: Math.round(r),
    p_review: review || null
  })
  if (error) throw error
}

// Fetch the caller's existing rating for a route, if any. Returns
// { rating, review } or null.
export async function getMyRating(rideId) {
  const sb = getSupabaseClient()
  const {
    data: { user }
  } = await sb.auth.getUser()
  if (!user) return null
  const { data, error } = await sb
    .from('suggested_ride_ratings')
    .select('rating, review')
    .eq('ride_id', rideId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (error) {
    console.warn('getMyRating', error.message || error)
    return null
  }
  return data || null
}

// Fetch all reviews for a route (for a "what other riders said" panel).
// Returns ratings ordered by most-recent first, capped at 50.
export async function listRatings(rideId) {
  const sb = getSupabaseClient()
  const { data, error } = await sb
    .from('suggested_ride_ratings')
    .select('rating, review, created_at, user_id')
    .eq('ride_id', rideId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) {
    console.warn('listRatings', error.message || error)
    return []
  }
  return data || []
}
