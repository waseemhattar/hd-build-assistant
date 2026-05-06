import React, { useEffect, useState } from 'react'
import BottomSheet from './ui/BottomSheet.jsx'
import RideMap from './RideMap.jsx'
import { formatDistance, formatDuration } from '../data/rides.js'
import {
  openInMaps,
  defaultMapsProvider
} from '../data/routeNavigation.js'
import { isNativeApp } from '../data/platform.js'

// RideDetailSheet — bottom sheet that opens when the rider taps a ride
// in Discover (or, eventually, in their own ride history). Surfaces:
//
//   - Ride name + author + tags
//   - Mini route map
//   - Stats row (distance, duration, surface/difficulty if curated)
//   - Two CTAs at the bottom:
//       * Open in Apple Maps (or the rider's default Maps provider)
//       * Open in Google Maps (always offered as the cross-platform
//         alternative — handy on iOS too if the rider prefers Google's
//         routing)
//
// "Open in Maps" is the headline feature: we decimate the recorded
// route to ~8 strategic waypoints and hand the URL to the OS so the
// rider gets turn-by-turn navigation along the SAME roads the original
// rider took, not the shortest highway shortcut.
//
// The sheet receives a `ride` object that's either:
//   - a community ride  (kind === 'recorded')   from listNearbyPublicRides
//   - a curated ride    (kind === 'suggested')  from listNearbySuggested
// Both shapes share `id`, `title`, `distance_m`, `duration_seconds`,
// and a `route` array of [lat, lng] tuples (which we fetch lazily via
// getRideDetail because the listing query strips it for payload size).

export default function RideDetailSheet({ ride, open, onClose, onRideThisRoute }) {
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(false)
  const [openingProvider, setOpeningProvider] = useState(null)
  const [openError, setOpenError] = useState(null)

  // Reset + lazy-fetch the full GPS route whenever the sheet opens
  // for a different ride. Listing queries strip `route` to keep the
  // payload small; we re-fetch here only when the rider has signaled
  // intent (= opened the sheet). Detail queries use the same
  // server-side privacy trim as the map preview, so what we get here
  // matches what shows on the Discover map.
  useEffect(() => {
    if (!open || !ride) {
      setRoute(null)
      setOpenError(null)
      return
    }
    // If the listing already included `route` (curated rides do, since
    // they're not privacy-sensitive), skip the fetch.
    if (Array.isArray(ride.route) && ride.route.length > 0) {
      setRoute(ride.route)
      return
    }
    let cancelled = false
    setLoading(true)
    import('../data/rides.js').then(({ getRideDetail }) => {
      getRideDetail(ride.id)
        .then((d) => {
          if (cancelled) return
          setRoute(d?.route || [])
          setLoading(false)
        })
        .catch(() => {
          if (cancelled) return
          setRoute([])
          setLoading(false)
        })
    })
    return () => {
      cancelled = true
    }
  }, [open, ride?.id])

  if (!ride) return null

  async function handleOpen(provider) {
    setOpenError(null)
    setOpeningProvider(provider)
    try {
      await openInMaps(route, provider)
    } catch (e) {
      setOpenError(e?.message || 'Could not open Maps.')
    } finally {
      setOpeningProvider(null)
    }
  }

  const defaultProvider = defaultMapsProvider()
  const onIOS = isNativeApp() && defaultProvider === 'apple'

  return (
    <BottomSheet open={open} onClose={onClose} size="lg">
      <BottomSheet.Header
        title={ride.title || 'Untitled ride'}
        subtitle={
          ride.display_name
            ? `Shared by ${ride.display_name}`
            : ride.kind === 'suggested'
            ? 'Curated route'
            : null
        }
        onClose={onClose}
      />

      {/* Tags row — render only when present. Curated rides have
          tags + difficulty; community rides usually carry tags too. */}
      {((ride.tags && ride.tags.length > 0) || ride.difficulty) && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {ride.difficulty && (
            <span className="rounded-full bg-hd-orange/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-hd-orange">
              {ride.difficulty}
            </span>
          )}
          {(ride.tags || []).map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-wider text-hd-muted"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Route preview map — loads the full polyline lazily. Loading
          state is muted; empty state means no GPS (rare). */}
      <div className="mb-4 overflow-hidden rounded-2xl bg-hd-card">
        {loading || route === null ? (
          <div className="flex h-44 w-full items-center justify-center">
            <div className="text-[11px] uppercase tracking-widest text-hd-muted">
              Loading map…
            </div>
          </div>
        ) : route.length < 2 ? (
          <div className="flex h-44 w-full items-center justify-center">
            <div className="text-[11px] uppercase tracking-widest text-hd-muted">
              No GPS data
            </div>
          </div>
        ) : (
          <RideMap route={route} height={200} className="rounded-none border-0" />
        )}
      </div>

      {/* Stats row */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <Stat label="Distance" value={formatDistance(ride.distance_m || 0)} />
        <Stat
          label="Duration"
          value={
            ride.duration_seconds
              ? formatDuration(ride.duration_seconds)
              : '—'
          }
        />
      </div>

      {/* Open-in-Maps CTAs */}
      <div className="space-y-2">
        {/* "Ride this route" — primary action when available. Hands
            the chosen ride to RideTracker, which overlays the route
            on its live map so the rider can follow it visually
            while their own GPS trail draws on top. The button only
            renders when the parent passes onRideThisRoute (i.e.,
            we're in Discover; doesn't make sense for, e.g., the
            rider's own already-recorded rides). */}
        {onRideThisRoute && (
          <button
            onClick={() => {
              if (!route || route.length < 2) return
              // Hand the ride object enriched with the fetched
              // route polyline to the parent — App.jsx stashes it
              // in state and switches to the tracker view.
              onRideThisRoute({ ...ride, route })
            }}
            disabled={!route || route.length < 2}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-hd-orange px-4 py-3.5 text-[15px] font-semibold text-white transition active:scale-[0.99] disabled:opacity-40"
          >
            <BikeIcon />
            Ride this route
          </button>
        )}

        <button
          onClick={() => handleOpen(onIOS ? 'apple' : 'google')}
          disabled={openingProvider !== null || !route || route.length < 2}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[14px] font-medium transition active:scale-[0.99] disabled:opacity-40 ${
            onRideThisRoute
              ? 'border border-hd-border bg-hd-dark text-hd-text'
              : 'bg-hd-orange py-3.5 text-[15px] font-semibold text-white'
          }`}
        >
          {openingProvider !== null ? (
            <>Opening{openingProvider === 'apple' ? ' Apple Maps' : ' Google Maps'}…</>
          ) : (
            <>
              <PinIcon />
              {onIOS ? 'Open in Apple Maps' : 'Open in Google Maps'}
            </>
          )}
        </button>

        {/* Always offer the alternative provider as a secondary
            action — riders often prefer one over the other and we'd
            rather respect that than make them figure out a workaround. */}
        <button
          onClick={() => handleOpen(onIOS ? 'google' : 'apple')}
          disabled={openingProvider !== null || !route || route.length < 2}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-hd-border bg-hd-dark px-4 py-3 text-[14px] font-medium text-hd-text transition active:scale-[0.99] disabled:opacity-40"
        >
          <PinIcon />
          {onIOS ? 'Open in Google Maps' : 'Open in Apple Maps'}
        </button>

        {/* Educational note. Riders sometimes wonder why their
            navigation route looks slightly different from the original
            line on the map — explain in plain language so it doesn't
            feel like a bug. */}
        <p className="px-1 pt-2 text-[11px] leading-relaxed text-hd-muted">
          We send Maps a handful of waypoints along the route so it
          guides you through the same roads. Your turn-by-turn might
          differ slightly from the original GPS line.
        </p>

        {openError && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-[12px] text-red-300">
            {openError}
          </div>
        )}
      </div>
    </BottomSheet>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-hd-card px-3 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-hd-muted">
        {label}
      </div>
      <div className="mt-1 text-lg font-bold tracking-tight text-hd-text">
        {value}
      </div>
    </div>
  )
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function BikeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M6 17l3-7h6l3 7" />
      <path d="M9 10V6h2" />
    </svg>
  )
}
