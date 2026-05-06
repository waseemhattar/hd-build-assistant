import React, { useEffect, useMemo, useRef, useState } from 'react'
import { listNearbyPublicRides, formatDistance, formatDuration } from '../data/rides.js'
import { listNearbySuggested } from '../data/suggestedRides.js'
import EmptyState from './ui/EmptyState.jsx'
import { useUserPrefs } from '../hooks/useUserPrefs.js'
import RideDetailSheet from './RideDetailSheet.jsx'

// Discover — community rides on a map.
//
// The page asks for the user's GPS once (browser geolocation, which on
// the iOS shell maps to the Capacitor geolocation plugin), then queries
// the `nearby_public_rides` RPC for shared rides whose bounding box
// intersects a 50 km radius. Each ride's polyline is rendered on a
// Leaflet map with the start/end privacy-trimmed server-side, and a
// scrollable list below the map shows the same rides as cards.
//
// Cold-start strategy: the map will be sparse until enough riders
// opt-in to sharing. The empty state explicitly invites riders to
// share their own rides as the way to seed the area.

const DEFAULT_RADIUS_KM = 50

export default function Discover({ onBack, onOpenRide, onRideThisRoute }) {
  useUserPrefs()
  const [state, setState] = useState({ status: 'idle' })
  const [rides, setRides] = useState([])
  const [center, setCenter] = useState(null) // { lat, lng }

  // The ride the user has tapped on — drives the RideDetailSheet
  // bottom sheet at the bottom of the page. Sheet shows the route,
  // stats, and the "Open in Apple/Google Maps" CTA which decimates
  // the GPS polyline to ~8 waypoints and hands the URL to the OS so
  // the rider can navigate the same roads turn-by-turn. The legacy
  // `onOpenRide` prop is still called (parent might want to navigate
  // away on tap) but the sheet is the primary interaction now.
  const [selectedRide, setSelectedRide] = useState(null)

  // Acquire location once on mount. We keep the prompt to a single
  // shot — if it fails, we fall back to a manually-pickable region
  // (see "useDubai" / future region picker).
  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      setState({ status: 'locating' })
      try {
        const pos = await getCurrentPosition()
        if (cancelled) return
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCenter(c)
        await load(c)
      } catch (e) {
        if (cancelled) return
        setState({
          status: 'permission-denied',
          reason: e?.message || 'Location unavailable.'
        })
      }
    }

    async function load(c) {
      setState({ status: 'loading' })
      try {
        // Query both surfaces in parallel:
        //   - listNearbyPublicRides → user-RECORDED public rides
        //   - listNearbySuggested   → admin-CURATED iconic routes
        // Merge so Discover shows one stream with distinct badges.
        // We don't fail-hard on one source erroring; partial content
        // is better than a blank page.
        const [recordedSettled, curatedSettled] = await Promise.allSettled([
          listNearbyPublicRides({
            lat: c.lat,
            lng: c.lng,
            radiusKm: DEFAULT_RADIUS_KM,
            limit: 100
          }),
          listNearbySuggested({
            lat: c.lat,
            lng: c.lng,
            radiusKm: DEFAULT_RADIUS_KM,
            limit: 100
          })
        ])
        if (cancelled) return
        const recorded =
          recordedSettled.status === 'fulfilled' ? recordedSettled.value : []
        const curated =
          curatedSettled.status === 'fulfilled' ? curatedSettled.value : []
        // Tag each item with kind so the renderer can branch on badge.
        // listNearbyPublicRides doesn't tag its rows yet — do it here.
        const taggedRecorded = recorded.map((r) => ({ ...r, kind: 'recorded' }))
        // Curated rows are already tagged kind='suggested' by shapeRow().
        // Sort merged by created_at-ish key (newest first). Curated uses
        // its created_at; recorded uses started_at.
        const merged = [...taggedRecorded, ...curated].sort((a, b) => {
          const ka = a.started_at || a.created_at || ''
          const kb = b.started_at || b.created_at || ''
          return kb.localeCompare(ka)
        })
        setRides(merged)
        setState({ status: 'ready' })
        // Surface partial-load failures in console for debugging without
        // disrupting the user.
        if (recordedSettled.status === 'rejected') {
          console.warn('discover: public rides load failed', recordedSettled.reason)
        }
        if (curatedSettled.status === 'rejected') {
          console.warn('discover: curated rides load failed', curatedSettled.reason)
        }
      } catch (e) {
        if (cancelled) return
        setState({
          status: 'error',
          reason: e?.message || 'Couldn’t load nearby rides.'
        })
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
      >
        ← Back
      </button>

      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-hd-orange">
          Discover
        </div>
        <h1 className="mt-1 font-display text-3xl tracking-wider sm:text-4xl">
          RIDES NEAR YOU
        </h1>
        <p className="mt-1 text-sm text-hd-muted">
          Roads near you that other Sidestand riders loved enough to
          share. We trim the start and end of every route a bit, so
          you see the good roads — not where someone parks at night.
        </p>
      </div>

      {state.status === 'locating' && (
        <div className="card text-center text-sm text-hd-muted">
          One sec — finding where you are…
        </div>
      )}

      {state.status === 'permission-denied' && (
        <EmptyState
          title="We need to know where you are"
          description={
            'Discover shows you rides nearby — for that, it needs your location. ' +
            'Open iOS Settings → Privacy & Security → Location Services, turn it on for Sidestand, and pop back here.'
          }
          icon={<CompassIcon />}
        />
      )}

      {state.status === 'error' && (
        <div className="card text-center">
          <div className="font-display text-xl tracking-wider text-hd-orange">
            SOMETHING WENT SIDEWAYS
          </div>
          <p className="mt-2 text-sm text-hd-muted">{state.reason}</p>
        </div>
      )}

      {state.status === 'loading' && (
        <div className="card text-center text-sm text-hd-muted">
          Looking for rides within {DEFAULT_RADIUS_KM} km…
        </div>
      )}

      {state.status === 'ready' && rides.length === 0 && (
        <EmptyState
          title="No one's shared a ride here yet"
          description={
            'You could be the first. Open one of your saved rides, tap Share to community, ' +
            'and it shows up here for everyone nearby. We trim the ends of the route automatically, ' +
            'so where you park stays your business.'
          }
          icon={<CompassIcon />}
        />
      )}

      {state.status === 'ready' && rides.length > 0 && center && (
        <RidesMapAndList
          rides={rides}
          center={center}
          onOpenRide={(r) => {
            setSelectedRide(r)
            onOpenRide && onOpenRide(r)
          }}
        />
      )}

      {/* Ride detail bottom sheet — opens when the rider taps any
          ride card. Carries the "Open in Maps" CTA + a "Ride this
          route" CTA that hands the route to RideTracker so the
          rider can follow it on their own GPS trail. */}
      <RideDetailSheet
        ride={selectedRide}
        open={Boolean(selectedRide)}
        onClose={() => setSelectedRide(null)}
        onRideThisRoute={
          onRideThisRoute
            ? (rideWithRoute) => {
                setSelectedRide(null)
                onRideThisRoute(rideWithRoute)
              }
            : null
        }
      />
    </div>
  )
}

// ---------- map + list combo ----------

function RidesMapAndList({ rides, center, onOpenRide }) {
  return (
    <>
      <div className="mb-4 overflow-hidden rounded-md border border-hd-border bg-hd-dark">
        <DiscoverMap rides={rides} center={center} />
      </div>

      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-widest text-hd-muted">
          {rides.length} ride{rides.length === 1 ? '' : 's'} within {DEFAULT_RADIUS_KM} km
        </div>
      </div>

      <ul className="space-y-2">
        {rides.map((r) => (
          <li key={`${r.kind || 'recorded'}-${r.id}`}>
            <button
              onClick={() => onOpenRide && onOpenRide(r)}
              className="flex w-full items-start gap-3 rounded border border-hd-border bg-hd-dark p-3 text-left transition hover:border-hd-orange"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <SourceBadge kind={r.kind} />
                  <div className="font-display text-base tracking-wider text-hd-text">
                    {r.title || 'Untitled ride'}
                  </div>
                </div>
                <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-hd-muted">
                  <span>{formatDistance(r.distance_m || 0)}</span>
                  <span>{formatDuration(r.duration_seconds || 0)}</span>
                  {r.bike_label && <span>· {r.bike_label}</span>}
                  <span>· by {r.display_name}</span>
                  {r.kind === 'suggested' && r.ratingCount > 0 && (
                    <span className="text-hd-orange">
                      · ★ {r.ratingAvg?.toFixed(1)} ({r.ratingCount})
                    </span>
                  )}
                  {r.kind === 'suggested' && r.difficulty && (
                    <span>· {r.difficulty}</span>
                  )}
                </div>
                {r.tags && r.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {r.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-hd-border bg-hd-card px-2 py-0.5 text-[10px] uppercase tracking-widest text-hd-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1.5 shrink-0 text-hd-muted"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

// ---------- Leaflet map ----------

function DiscoverMap({ rides, center }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const layersRef = useRef([])

  useEffect(() => {
    let cancelled = false
    async function init() {
      const L = await import('leaflet')
      await import('leaflet/dist/leaflet.css')
      if (cancelled || !containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView([center.lat, center.lng], 10)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Marker for the rider's current location.
      L.circleMarker([center.lat, center.lng], {
        radius: 7,
        color: '#E03A36',
        fillColor: '#E03A36',
        fillOpacity: 0.9,
        weight: 2
      })
        .addTo(map)
        .bindTooltip('You', { permanent: false, direction: 'top' })

      drawRides(L, map, rides, layersRef)
    }
    init()
    return () => {
      cancelled = true
      try {
        if (mapRef.current) mapRef.current.remove()
      } catch (_) {}
      mapRef.current = null
      layersRef.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    import('leaflet').then((L) => {
      drawRides(L, map, rides, layersRef)
    })
  }, [rides])

  return (
    <div
      ref={containerRef}
      className="h-[360px] w-full bg-hd-card"
      style={{ minHeight: 280 }}
    />
  )
}

function drawRides(L, map, rides, layersRef) {
  // Clear previous polylines + start markers.
  for (const lyr of layersRef.current) {
    try {
      lyr.remove()
    } catch (_) {}
  }
  layersRef.current = []

  if (!rides || rides.length === 0) return

  const allBounds = []
  for (const r of rides) {
    const pts = (r.route || [])
      .map((p) => (Array.isArray(p) ? [p[0], p[1]] : null))
      .filter(Boolean)
    if (pts.length < 2) continue

    // Visual provenance: curated routes use a slightly cooler accent
    // and a dashed line; recorded rides keep the solid HD orange.
    // Both still pop on the dark tile layer.
    const isCurated = r.kind === 'suggested'
    const polyline = L.polyline(pts, {
      color: isCurated ? '#F59E0B' : '#E03A36',
      weight: isCurated ? 3.5 : 4,
      opacity: 0.85,
      dashArray: isCurated ? '8 6' : null,
      lineCap: 'round',
      lineJoin: 'round'
    })
      .addTo(map)
      .bindTooltip(
        `${isCurated ? '★ ' : ''}${r.title || 'Untitled'} · ${Math.round((r.distance_m || 0) / 1000)} km`,
        { permanent: false, direction: 'top' }
      )

    layersRef.current.push(polyline)
    allBounds.push(...pts)

    // Small marker at the polyline's midpoint so even very short
    // routes get a tap target.
    const mid = pts[Math.floor(pts.length / 2)]
    const marker = L.circleMarker(mid, {
      radius: 5,
      color: isCurated ? '#F59E0B' : '#E03A36',
      fillColor: '#0E0E10',
      fillOpacity: 1,
      weight: 2
    }).addTo(map)
    layersRef.current.push(marker)
  }

  if (allBounds.length > 0) {
    try {
      map.fitBounds(allBounds, { padding: [40, 40], maxZoom: 13 })
    } catch (_) {}
  }
}

// ---------- helpers ----------

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not available on this device.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      resolve,
      (err) => reject(new Error(err?.message || 'Could not read your location.')),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 }
    )
  })
}

// Visual marker so riders can tell at a glance whether a route is an
// authentic GPS recording from another rider, or an admin-curated
// "iconic ride" seeded into the platform. Both are first-class — the
// badge isn't a quality signal, it's a provenance signal.
function SourceBadge({ kind }) {
  if (kind === 'suggested') {
    return (
      <span className="rounded bg-hd-orange/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-hd-orange">
        Curated
      </span>
    )
  }
  return (
    <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-hd-muted">
      Ridden
    </span>
  )
}

function CompassIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <polygon points="14 8 11 13 10 16 13 11" />
    </svg>
  )
}
