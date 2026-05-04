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
// Two URL schemes are supported:
//   - `maps://?...`             — iOS native scheme. iOS's UIApplication
//                                 URL handler routes this directly to the
//                                 Apple Maps app, no embedded browser.
//                                 Use this when calling from the native
//                                 iOS app via App.openUrl().
//   - `https://maps.apple.com/?...` — Universal-link form. Opens Apple
//                                 Maps app on iOS Safari (sometimes),
//                                 falls back to maps.apple.com web on
//                                 other browsers / platforms.
//
// We default to the https scheme for the public API (so the URL is
// safe to share, copy, paste in chat, etc.) and switch to `maps://`
// inside openInMaps() when running on iOS native — that's where
// Apple Maps app deep-linking actually matters.
export function appleMapsUrl(route, { native = false } = {}) {
  const pts = decimateRoute(route, MAX_WAYPOINTS + 2)
  if (pts.length < 2) return null
  const start = pts[0]
  const end = pts[pts.length - 1]
  const waypoints = pts.slice(1, -1)
  const fmt = (p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`
  const dest = [...waypoints.map(fmt), fmt(end)].join('+to:')
  const params = new URLSearchParams({
    saddr: fmt(start),
    daddr: dest,
    dirflg: 'd'
  })
  if (native) {
    // iOS native scheme — routes to Apple Maps app via UIApplication.
    return `maps://?${params.toString()}`
  }
  return `https://maps.apple.com/?${params.toString()}`
}

// Google Maps directions URL with waypoints.
//
// Two URL schemes:
//   - `comgooglemaps://?saddr=...&daddr=...&waypoints=...` — iOS native
//                                 scheme. Routes to Google Maps app via
//                                 UIApplication. Only works if the user
//                                 has Google Maps installed (we should
//                                 fall back to https if not).
//   - `https://www.google.com/maps/dir/?api=1&...` — Universal URL. Works
//                                 in any browser; on iOS with Google
//                                 Maps installed, it deep-links via
//                                 Universal Links.
//
// Google Maps caps waypoints at 9 in the public URL scheme.
export function googleMapsUrl(route, { native = false } = {}) {
  const pts = decimateRoute(route, MAX_WAYPOINTS + 2)
  if (pts.length < 2) return null
  const start = pts[0]
  const end = pts[pts.length - 1]
  const waypoints = pts.slice(1, -1)
  const fmt = (p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`
  if (native) {
    // iOS native scheme — comgooglemaps:// routes to Google Maps app.
    // Note: the native scheme uses different query keys than the https
    // version (`saddr`/`daddr` not `origin`/`destination`).
    const params = new URLSearchParams({
      saddr: fmt(start),
      daddr: fmt(end),
      directionsmode: 'driving'
    })
    if (waypoints.length > 0) {
      params.set('waypoints', waypoints.map(fmt).join('|'))
    }
    return `comgooglemaps://?${params.toString()}`
  }
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

// Open a Maps URL in the right place for the current platform.
//
// The whole game on iOS is "deep-link to the Maps app, don't load a
// webpage in an embedded browser." We achieve that with a single
// `window.open(url, '_blank')` call — Capacitor's WKWebView bridge
// intercepts `_blank` opens and routes them through
// `UIApplication.shared.open(url)`, which respects iOS URL schemes:
//
//   - `maps://?saddr=...&daddr=...` → opens Apple Maps app
//   - `comgooglemaps://?...`        → opens Google Maps app (if installed)
//   - `https://...`                  → opens system Safari (fallback)
//
// Note we do NOT use @capacitor/browser's Browser.open() — that plugin
// forces the URL into an in-app SFSafariViewController, which loads
// the page as web content and never deep-links. Hard-learned lesson.
//
// For Apple Maps: always use the `maps://` scheme on iOS native — it's
// guaranteed to open the Maps app since Apple Maps is preinstalled.
//
// For Google Maps: we use the https URL universally. On iOS with the
// Google Maps app installed, iOS Universal Links route it directly to
// the app. Without Google Maps installed, it loads in Safari (slower
// but still functional). Avoiding `comgooglemaps://` means we don't
// need to declare it in `LSApplicationQueriesSchemes` in Info.plist
// and we don't have a "Google Maps not installed" failure mode.
//
// `app` selects which provider:
//   - 'apple'  → Apple Maps (default on iOS)
//   - 'google' → Google Maps (default on web/Android)
//
// Returns the URL that was handed to the OS. Throws if the route has
// no GPS data.
export async function openInMaps(route, app = null) {
  const provider = app || defaultMapsProvider()
  const onIOS = getPlatform() === 'ios' && isNativeApp()

  // Apple Maps: native scheme on iOS, https everywhere else.
  // Google Maps: always https (Universal Links handle iOS deep-link).
  const url =
    provider === 'google'
      ? googleMapsUrl(route, { native: false })
      : appleMapsUrl(route, { native: onIOS })
  if (!url) {
    throw new Error('Route has no GPS data — nothing to navigate.')
  }

  if (typeof window !== 'undefined') {
    // _blank target. On iOS native, Capacitor's WebView delegate
    // captures this and forwards the URL to UIApplication.shared.open(),
    // which deep-links to the app. On web it opens in a new tab.
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
