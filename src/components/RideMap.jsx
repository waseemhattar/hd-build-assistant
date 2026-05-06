import React, { useEffect, useRef } from 'react'

// Reusable Leaflet map for showing a ride's route polyline.
//
// Why this isn't react-leaflet: react-leaflet has weird interactions
// with Capacitor's WebView and the Tailwind dark theme — the tile
// container kept getting re-mounted. Plain Leaflet via a ref is more
// reliable, and the wrapper here is small enough that we don't really
// need a React-aware library.
//
// IMPORTANT — live mode behavior:
//   When `live=true`, the map only auto-fits ONCE (on the first draw)
//   and then leaves the user's zoom alone. Without this rule the live
//   map jitters every time a new GPS sample arrives because we
//   fitBounds() on every redraw, which keeps re-zooming as the
//   polyline grows. After the initial fit we just pan to keep the
//   latest position visible if it's drifted off-screen.
//
//   For the post-ride / completed-route case (live=false, the default),
//   we always fit-bounds on draw — that's the natural behavior when
//   showing a finished ride.
//
// Tiles: free OpenStreetMap tiles. For production we'd switch to a
// hosted tile server (Mapbox, Stadia, etc.) once we have real traffic;
// OSM has a usage policy that says "don't hammer us." For dev + small
// audience: fine.

const OSM_TILES =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

export default function RideMap({
  route,
  targetRoute = null,
  height = 280,
  className = '',
  live = false
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const polylineRef = useRef(null)
  // Separate ref for the target-route polyline (the "guide" line
  // drawn beneath the live route, e.g., when "Ride this route" is
  // active). Held separately so it isn't recreated when the live
  // route updates.
  const targetPolylineRef = useRef(null)
  // Track whether we've already done the initial bounds fit. In live
  // mode we only fit once; subsequent route updates pan but don't zoom.
  const hasFittedOnceRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    let cleanup = null

    async function init() {
      // Dynamic import so the leaflet package only loads when this
      // component mounts (saves ~150KB on first paint of the rest of
      // the app).
      const L = await import('leaflet')
      // Side-effect import for the CSS — Vite handles the bundling.
      await import('leaflet/dist/leaflet.css')
      if (cancelled) return
      if (!containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true
      })
      mapRef.current = map

      L.tileLayer(OSM_TILES, {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Draw the target route FIRST (underneath) so the live route
      // appears on top. Target uses an orange dashed line so it's
      // visually distinct from the rider's red live trail.
      if (targetRoute && targetRoute.length >= 2) {
        targetPolylineRef.current = drawTargetRoute(L, map, targetRoute)
      }

      drawRoute(L, map, route, null, {
        live,
        hasFittedOnceRef,
        targetRoute // include target's bounds in the initial fit
      })
      polylineRef.current = null // populated on draw

      cleanup = () => {
        try {
          map.remove()
        } catch (_) {}
      }
    }

    init()

    return () => {
      cancelled = true
      if (cleanup) cleanup()
      mapRef.current = null
      polylineRef.current = null
      hasFittedOnceRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-draw when route prop changes (after the initial mount)
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then((L) => {
      polylineRef.current = drawRoute(
        L,
        mapRef.current,
        route,
        polylineRef.current,
        { live, hasFittedOnceRef, targetRoute }
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, live])

  // Re-draw target route when it changes. Separate effect from `route`
  // so updates to the live trail don't redraw the static guide.
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then((L) => {
      if (targetPolylineRef.current) {
        try {
          targetPolylineRef.current.remove()
        } catch (_) {}
        targetPolylineRef.current = null
      }
      if (targetRoute && targetRoute.length >= 2) {
        targetPolylineRef.current = drawTargetRoute(
          L,
          mapRef.current,
          targetRoute
        )
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRoute])

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-md border border-hd-border bg-hd-card ${className}`}
      style={{ height }}
    />
  )
}

// Draws/updates the polyline. Bounds-fitting behavior depends on `live`:
//   - live=false → always fit. Static post-ride map.
//   - live=true  → fit ONLY on the first draw with ≥2 points; later
//     updates leave the zoom alone but pan if the latest sample has
//     drifted outside the visible area.
//
// When `targetRoute` is non-empty, the initial fit includes both the
// live route's bounds AND the target route's bounds, so the rider can
// see the planned route + their trail together.
function drawRoute(
  L,
  map,
  route,
  existingPolyline,
  { live, hasFittedOnceRef, targetRoute }
) {
  if (!route || route.length === 0) return null

  // Strip out any non-[lat,lng] entries defensively
  const latlngs = route
    .map((pt) => (Array.isArray(pt) ? [pt[0], pt[1]] : null))
    .filter(Boolean)
  if (latlngs.length === 0) return null

  // Remove old polyline if any
  if (existingPolyline) {
    try {
      existingPolyline.remove()
    } catch (_) {}
  }

  const polyline = L.polyline(latlngs, {
    color: '#E03A36', // signal red — brand
    weight: 4,
    opacity: 0.9,
    lineCap: 'round',
    lineJoin: 'round'
  }).addTo(map)

  // Start + end markers
  L.circleMarker(latlngs[0], {
    radius: 6,
    color: '#9CA3AF',
    fillColor: '#9CA3AF',
    fillOpacity: 1,
    weight: 2
  })
    .addTo(map)
    .bindTooltip('Start', { permanent: false, direction: 'top' })

  L.circleMarker(latlngs[latlngs.length - 1], {
    radius: 6,
    color: '#E03A36',
    fillColor: '#E03A36',
    fillOpacity: 1,
    weight: 2
  })
    .addTo(map)
    .bindTooltip('End', { permanent: false, direction: 'top' })

  // Combined bounds — if a target route is present, include its
  // bounds so the initial fit shows the whole planned route plus
  // the rider's start point. Important on the first frames of a
  // "Ride this route" session when the rider has only one or two
  // GPS samples and the natural fit-bounds would zoom in way too
  // close on their start point.
  const combinedBounds = polyline.getBounds()
  if (targetRoute && targetRoute.length >= 2) {
    const targetLatLngs = targetRoute
      .map((p) => (Array.isArray(p) ? [p[0], p[1]] : null))
      .filter(Boolean)
    for (const ll of targetLatLngs) combinedBounds.extend(ll)
  }

  if (live) {
    // First draw with at least 2 points → fit once. Subsequent draws
    // pan-to-latest-if-out-of-view but don't change zoom.
    if (!hasFittedOnceRef?.current && latlngs.length >= 2) {
      map.fitBounds(combinedBounds, {
        padding: [40, 40],
        maxZoom: 16
      })
      hasFittedOnceRef.current = true
    } else if (hasFittedOnceRef?.current) {
      // Pan to keep the latest sample visible if it's drifted off the
      // current viewport. setView with the existing zoom level avoids
      // re-zoom, but we use map.panInside so we only pan if needed —
      // not if the rider's still inside the viewport.
      const last = latlngs[latlngs.length - 1]
      try {
        map.panInside(last, { paddingTopLeft: [40, 40], paddingBottomRight: [40, 40] })
      } catch (_) {
        // Older Leaflet doesn't have panInside — fall back to setView
        // with current zoom.
        map.setView(last, map.getZoom(), { animate: true })
      }
    }
    // Edge case: only 1 point so far, no zoom yet → centre on it.
    if (!hasFittedOnceRef?.current && latlngs.length === 1) {
      map.setView(latlngs[0], 15)
    }
  } else {
    // Static (post-ride) — always fit. Use combined bounds so the
    // target route, if any, is included in the view.
    map.fitBounds(combinedBounds, {
      padding: [20, 20],
      maxZoom: 15
    })
  }

  return polyline
}

// Draws the "guide" polyline (the route the rider chose to follow
// via "Ride this route"). Renders BENEATH the live trail using a
// dashed orange line so the two are easy to tell apart at a glance:
// solid red = where you've been, dashed orange = where you're going.
function drawTargetRoute(L, map, route) {
  if (!route || route.length < 2) return null
  const latlngs = route
    .map((pt) => (Array.isArray(pt) ? [pt[0], pt[1]] : null))
    .filter(Boolean)
  if (latlngs.length < 2) return null
  return L.polyline(latlngs, {
    color: '#F47A26', // HD orange, distinct from the live trail's red
    weight: 4,
    opacity: 0.7,
    dashArray: '8 6',
    lineCap: 'round',
    lineJoin: 'round'
  }).addTo(map)
}
