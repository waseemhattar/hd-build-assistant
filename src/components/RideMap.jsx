import React, { useEffect, useRef } from 'react'

// Reusable Leaflet map for showing a ride's route polyline.
//
// Why this isn't react-leaflet: react-leaflet has weird interactions
// with Capacitor's WebView and the Tailwind dark theme — the tile
// container kept getting re-mounted. Plain Leaflet via a ref is more
// reliable, and the wrapper here is small enough that we don't really
// need a React-aware library.
//
// Tiles: free OpenStreetMap tiles. For production we'd switch to a
// hosted tile server (Mapbox, Stadia, etc.) once we have real traffic;
// OSM has a usage policy that says "don't hammer us." For dev + small
// audience: fine.

const OSM_TILES =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

export default function RideMap({ route, height = 280, className = '' }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const polylineRef = useRef(null)

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

      drawRoute(L, map, route)

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-draw when route prop changes (after the initial mount)
  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then((L) => {
      drawRoute(L, mapRef.current, route, polylineRef.current)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route])

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-md border border-hd-border bg-hd-card ${className}`}
      style={{ height }}
    />
  )
}

// Draws/updates the polyline + auto-fits the map to the bounds.
function drawRoute(L, map, route, existingPolyline) {
  if (!route || route.length === 0) return

  // Strip out any non-[lat,lng] entries defensively
  const latlngs = route
    .map((pt) => (Array.isArray(pt) ? [pt[0], pt[1]] : null))
    .filter(Boolean)
  if (latlngs.length === 0) return

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
  if (latlngs.length > 0) {
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
  }

  // Fit bounds with a little padding so the polyline isn't right at the edge
  map.fitBounds(polyline.getBounds(), {
    padding: [20, 20],
    maxZoom: 15
  })
}
