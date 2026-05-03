// Route navigation — turn a recorded ride's GPS polyline into a real
// Apple Maps / Google Maps directions URL, so a rider can hit "Open
// in Maps" on a Discover ride and have their phone navigate the same
// roads, complete with turn-by-turn voice prompts.
//
// The catch: GPS rides have hundreds-to-thousands of points; both
// Maps apps cap waypoint counts strictly:
//
//   - Apple Maps URL scheme: ~16 waypoints total (start + 14 + end)
//   - Google Maps URL scheme: 9 waypoints + 1 origin + 1 destination
//
// So we DECIMATE the route to ~8 waypoints (10 total stops) before
// building the URL — that fits both providers comfortably and leaves
// margin for routing engine quirks. We pick those 8 waypoints
// strategically using an iterative Douglas-Peucker variant: always
// include start + end, then repeatedly add whichever point is
// farthest from the current simplified polyline until we hit the
// budget. The result preserves the "twisty bit through the canyon"
// while skipping the dead-straight highway middle, so the rider's
// Maps app gets routed through the actual road choices the original
// rider made.
//
// The decimation is intentionally provider-agnostic — the URL
// builders below don't know about it. If we ever swap Maps URL
// schemes (Mapbox, Waze, etc.) this file is the only place to touch.

import { Browser } from '@capacitor/browser'
import { isNativeApp, getPlatform } from './platform.js'

// Max waypoints we send to either Maps app. Apple's hard cap is ~16,
// Google's is 9 + origin + destination. 8 covers the route shape on
// any reasonable ride and stays safely under both. Bump only if the
// Maps providers raise their limits.
const MAX_WAYPOINTS = 8

// ---------- decimation ----------

// Simplify a route to at most `maxPoints` (start + end + intermediate
// waypoints) while keeping the points that most define the route's
// shape. Iterative variant of Douglas-Peucker — keeps adding the
// farthest-from-current-polyline point until we hit the budget.
//
// Input: route — array of [lat, lng] tuples (any extra trailing fields
//                are preserved on the survivors).
//        maxPoints — target output length, including start + end.
// Output: subset of route, in original order.
export function decimateRoute(route, maxPoints = MAX_WAYPOINTS + 2) {
  const pts = (route || []).filter((p) => Array.isArray(p) && p.length >= 2)
  if (pts.length <= maxPoints) return pts
  if (maxPoints < 2) return [pts[0], pts[pts.length - 1]]

  // Set of indices we've decided to keep, anchored by start + end.
  const kept = new Set([0, pts.length - 1])

  while (kept.size < maxPoints) {
    const sorted = [...kept].sort((a, b) => a - b)
    let bestIdx = -1
    let bestDist = 0

    // Walk each segment between adjacent kept indices and find the
    // single farthest-from-segment point we haven't kept yet.
    for (let i = 0; i < sorted.length - 1; i++) {
      const aIdx = sorted[i]
      const bIdx = sorted[i + 1]
      const a = pts[aIdx]
      const b = pts[bIdx]
      for (let j = aIdx + 1; j < bIdx; j++) {
        if (kept.has(j)) continue
        const d = perpendicularDistance(pts[j], a, b)
        if (d > bestDist) {
          bestDist = d
          bestIdx = j
        }
      }
    }

    if (bestIdx < 0) break // no candidates left
    kept.add(bestIdx)
  }

  return [...kept].sort((a, b) => a - b).map((i) => pts[i])
}

// Perpendicular distance from point p to the line segment a–b. We
// treat lat/lng as flat 2D — at the scale of a single ride the
// spherical-earth distortion is negligible compared to the magnitudes
// we're comparing. Returns degrees.
function perpendicularDistance(p, a, b) {
  const px = p[0]
  const py = p[1]
  const ax = a[0]
  const ay = a[1]
  const dx = b[0] - ax
  const dy = b[1] - ay
  // Degenerate segment (start === end): distance from p to a.
  if (dx === 0 && dy === 0) {
    return Math.hypot(px - ax, py - ay)
  }
  // Project p onto line a–b, clamped to the [a, b] segment.
  const t = Math.max(
    0,
    Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))
  )
  const projX = ax + t * dx
  const projY = ay + t * dy
  return Math.hypot(px - projX, py - projY)
}

// ---------- URL builders ----------

// Apple Maps directions URL with waypoints. The `?saddr=` is the start,
// `&daddr=` carries the destination with optional waypoints joined by
// "+to:". `&dirflg=d` requests driving directions (motorcycle uses the
// driving routing engine).
//
// On iOS, https://maps.apple.com/?... auto-opens the Apple Maps app.
// On macOS Safari, it opens the Maps app. On other platforms, it opens
// the maps.apple.com web view.
export function appleMapsUrl(route) {
  const pts = decimateRoute(route, MAX_WAYPOINTS + 2)
  if (pts.length < 2) return null
  const start = pts[0]
  const end = pts[pts.length - 1]
  const waypoints = pts.slice(1, -1)
  const fmt = (p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`
  const dest = [...waypoints.map(fmt), fmt(end)].join('+to:')
  const url = new URL('https://maps.apple.com/')
  url.searchParams.set('saddr', fmt(start))
  url.searchParams.set('daddr', dest)
  url.searchParams.set('dirflg', 'd')
  return url.toString()
}

// Google Maps directions URL with waypoints. Uses the recommended
// `?api=1` URL scheme rather than the deprecated `dir/...` path
// format — works on iOS, Android, and web identically.
//
// `&waypoints=` is a `|`-separated list of intermediate stops. Up to
// 9 in the public URL scheme.
export function googleMapsUrl(route) {
  const pts = decimateRoute(route, MAX_WAYPOINTS + 2)
  if (pts.length < 2) return null
  const start = pts[0]
  const end = pts[pts.length - 1]
  const waypoints = pts.slice(1, -1)
  const fmt = (p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`
  const url = new URL('https://www.google.com/maps/dir/')
  url.searchParams.set('api', '1')
  url.searchParams.set('origin', fmt(start))
  url.searchParams.set('destination', fmt(end))
  if (waypoints.length > 0) {
    url.searchParams.set('waypoints', waypoints.map(fmt).join('|'))
  }
  url.searchParams.set('travelmode', 'driving')
  return url.toString()
}

// ---------- open ----------

// Open a Maps URL in the right place for the current platform. On
// native iOS we use Capacitor's Browser plugin so iOS routes the
// `maps.apple.com` URL into the Apple Maps app via the universal-link
// handler. On web we open in a new tab.
//
// `app` selects which provider:
//   - 'apple'  → Apple Maps (default on iOS)
//   - 'google' → Google Maps (default on web/Android)
//
// Returns a promise that resolves when the URL has been handed off
// to the OS.
export async function openInMaps(route, app = null) {
  const provider = app || defaultMapsProvider()
  const url = provider === 'google' ? googleMapsUrl(route) : appleMapsUrl(route)
  if (!url) {
    throw new Error('Route has no GPS data — nothing to navigate.')
  }
  if (isNativeApp()) {
    await Browser.open({ url })
  } else if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener')
  }
  return url
}

// Sensible default per platform: Apple Maps on iOS (it ships
// preinstalled and handles the URL natively), Google Maps everywhere
// else.
export function defaultMapsProvider() {
  return getPlatform() === 'ios' ? 'apple' : 'google'
}
