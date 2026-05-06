import React, { useCallback, useEffect, useState } from 'react'
import {
  listRides,
  getRideDetail,
  deleteRide,
  setRidePublic,
  formatDistance,
  formatDuration,
  formatSpeed
} from '../data/rides.js'
import RideMap from './RideMap.jsx'
import EmptyState from './ui/EmptyState.jsx'
import usePullToRefresh from '../hooks/usePullToRefresh.jsx'
import { useUserPrefs } from '../hooks/useUserPrefs.js'
import ShareRideSheet from './ShareRideSheet.jsx'
import {
  openInMaps,
  defaultMapsProvider
} from '../data/routeNavigation.js'

// Ride history list. Two flavors:
//   - bikeId provided → list rides for that bike only
//   - bikeId null      → list ALL of the user's rides across bikes
//
// Tap a ride row → detail card slides in with the route map. We don't
// route-change on tap; we just expand inline because rides are usually
// a quick glance, not a deep navigation.

export default function RideHistory({ bikeId = null, onStartRide, garage = [] }) {
  // Re-render whenever the rider flips a unit pref so distance,
  // speed, etc. swap mi ⇄ km without a remount.
  useUserPrefs()
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [openRideId, setOpenRideId] = useState(null)

  async function reload() {
    setLoading(true)
    setErr(null)
    try {
      const data = await listRides({ bikeId })
      setRides(data)
    } catch (e) {
      setErr(e?.message || 'Failed to load rides.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bikeId])

  // Only show the "Loading rides…" placeholder on the FIRST load
  // (when we have no data yet). Subsequent reloads — pull-to-refresh,
  // post-delete, post-rename — keep the existing list visible and let
  // the new data slot in when it arrives. Without this guard, the
  // list unmounts on every refresh, which loses every RideRow's
  // internal `detail` state (the lazily-fetched route polyline).
  // Visible symptom: tapping a ride to expand its map, scrolling, then
  // pull-to-refresh would close + reopen the map like a flicker.
  if (loading && rides.length === 0) {
    return (
      <div className="card text-center text-sm text-hd-muted">
        Loading rides…
      </div>
    )
  }

  if (err && rides.length === 0) {
    return (
      <div className="card text-center">
        <div className="font-display text-xl tracking-wider text-hd-orange">
          COULDN'T LOAD
        </div>
        <p className="mt-2 text-sm text-hd-muted">{err}</p>
      </div>
    )
  }

  if (rides.length === 0) {
    return (
      <EmptyState
        icon={
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="17" r="3" />
            <circle cx="18" cy="17" r="3" />
            <path d="M6 17l3-7h6l3 7" />
            <path d="M9 10V6h2" />
          </svg>
        }
        title="No rides yet"
        description="Tap Start a ride to record your first GPS-tracked trip. We'll capture distance, route, max speed, and the weather."
        ctaLabel={onStartRide ? 'Start a ride' : undefined}
        onCtaClick={onStartRide}
      />
    )
  }

  return (
    <RideList
      rides={rides}
      garage={garage}
      openRideId={openRideId}
      setOpenRideId={setOpenRideId}
      onReload={reload}
    />
  )
}

// Wrapped list so we can attach pull-to-refresh without entangling it
// with the early-return branches (loading / error / empty state). The
// hook scrolls the inner div, so we wrap the <ul> in a refreshable
// container with the indicator pinned at the top.
function RideList({ rides, garage, openRideId, setOpenRideId, onReload }) {
  const handleRefresh = useCallback(async () => {
    await onReload()
  }, [onReload])
  const { containerRef, indicator } = usePullToRefresh(handleRefresh)
  return (
    <div ref={containerRef} className="space-y-2">
      {indicator}
      <ul className="space-y-2">
        {rides.map((r) => (
          <RideRow
            key={r.id}
            ride={r}
            isOpen={openRideId === r.id}
            onToggle={() =>
              setOpenRideId(openRideId === r.id ? null : r.id)
            }
            garage={garage}
            onDeleted={onReload}
          />
        ))}
      </ul>
    </div>
  )
}

function RideRow({ ride, isOpen, onToggle, garage, onDeleted }) {
  const [detail, setDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  // Fetch full route only when expanded (saves bandwidth)
  useEffect(() => {
    if (!isOpen || detail) return
    setLoadingDetail(true)
    getRideDetail(ride.id)
      .then((d) => setDetail(d))
      .catch((e) => console.warn('getRideDetail failed', e))
      .finally(() => setLoadingDetail(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const bike = garage.find((b) => b.id === ride.bike_id)
  const dateStr = new Date(ride.started_at).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  const timeStr = new Date(ride.started_at).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  })

  function handleShareClick() {
    if (!detail) return
    setShareOpen(true)
  }

  async function handleDelete() {
    if (!window.confirm('Delete this ride? Cannot be undone.')) return
    setDeleting(true)
    try {
      await deleteRide(ride.id)
      onDeleted && onDeleted()
    } catch (e) {
      alert('Could not delete: ' + (e?.message || e))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <li className="overflow-hidden rounded-md border border-hd-border bg-hd-dark">
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 p-4 text-left hover:bg-hd-card"
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <div className="font-display text-lg tracking-wider text-hd-text">
              {ride.title || dateStr}
            </div>
            <div className="text-xs text-hd-muted">
              {timeStr}
              {bike && (
                <>
                  {' · '}
                  {bike.nickname || bike.model || 'bike'}
                </>
              )}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-hd-muted">
            <span className="text-hd-text">
              {formatDistance(ride.distance_m)}
            </span>
            <span>{formatDuration(ride.duration_seconds || 0)}</span>
            {ride.avg_speed_mps != null && (
              <span>avg {formatSpeed(ride.avg_speed_mps)}</span>
            )}
            {ride.max_speed_mps != null && ride.max_speed_mps > 0 && (
              <span>max {formatSpeed(ride.max_speed_mps)}</span>
            )}
          </div>
        </div>
        <div className="text-hd-muted">{isOpen ? '−' : '+'}</div>
      </button>

      {isOpen && (
        <div className="border-t border-hd-border p-4">
          {loadingDetail && (
            <div className="text-xs text-hd-muted">Loading route…</div>
          )}
          {detail && detail.route && detail.route.length > 0 && (
            <RideMap route={detail.route} />
          )}
          {detail && (!detail.route || detail.route.length === 0) && (
            <div className="text-xs text-hd-muted">
              No route data saved for this ride.
            </div>
          )}
          {detail && (
            <>
              <CommunityShareToggle ride={detail} />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleShareClick}
                    className="inline-flex items-center gap-2 rounded-full bg-hd-orange px-4 py-2 text-[13px] font-semibold text-white transition active:scale-95 disabled:opacity-50"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    Share ride
                  </button>
                  <OpenInMapsButton route={detail.route} />
                </div>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-xs text-hd-muted hover:text-red-400 disabled:opacity-50"
                >
                  {deleting ? 'Deleting…' : 'Delete ride'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <ShareRideSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        ride={detail}
        bike={bike}
        weather={detail?.weather || ride.weather || null}
      />
    </li>
  )
}


// Community-share toggle for a single ride. Distinct from the
// share-card sheet (the orange "Share ride" button which renders a
// 1080×1920 image to send to friends): this opts the route into the
// Discover map for nearby riders. Server-side trims the start/end
// privacy radius before exposing.
function CommunityShareToggle({ ride }) {
  const [isPublic, setIsPublic] = useState(!!ride.is_public)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function toggle() {
    if (busy) return
    setBusy(true)
    setErr(null)
    const next = !isPublic
    setIsPublic(next) // optimistic
    try {
      await setRidePublic(ride.id, next)
    } catch (e) {
      setIsPublic(!next) // revert on failure
      setErr(e?.message || 'Could not update share state.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-4 rounded-md border border-hd-border bg-hd-dark p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm font-semibold text-hd-text">
            Share to community
          </div>
          <div className="mt-0.5 text-[12px] leading-snug text-hd-muted">
            Adds this route to the Discover map for riders nearby.
            The first and last 300 m of the polyline are trimmed
            server-side so your start and end stay private.
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={busy}
          aria-pressed={isPublic}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
            isPublic ? 'bg-hd-orange' : 'bg-hd-card'
          } ${busy ? 'opacity-50' : ''}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
              isPublic ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      {err && (
        <div className="mt-2 text-[11px] text-red-300">{err}</div>
      )}
    </div>
  )
}

// "Open in Maps" pill — sits next to the orange Share-ride button on
// the expanded ride detail card. Single tap opens the rider's default
// Maps app (Apple on iOS, Google elsewhere) with turn-by-turn
// directions that follow the recorded route's road choices via
// decimated waypoints. See src/data/routeNavigation.js for the
// decimation + URL-builder logic.
function OpenInMapsButton({ route }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const provider = defaultMapsProvider()
  const hasRoute = Array.isArray(route) && route.length >= 2

  async function tap() {
    if (!hasRoute || busy) return
    setBusy(true)
    setErr(null)
    try {
      await openInMaps(route, provider)
    } catch (e) {
      setErr(e?.message || 'Could not open Maps.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        onClick={tap}
        disabled={!hasRoute || busy}
        className="inline-flex items-center gap-2 rounded-full border border-hd-border bg-hd-dark px-4 py-2 text-[13px] font-semibold text-hd-text transition active:scale-95 disabled:opacity-40"
      >
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
        {busy
          ? 'Opening…'
          : provider === 'apple'
          ? 'Open in Apple Maps'
          : 'Open in Google Maps'}
      </button>
      {err && (
        <div className="mt-1 w-full text-[11px] text-red-300">{err}</div>
      )}
    </>
  )
}
