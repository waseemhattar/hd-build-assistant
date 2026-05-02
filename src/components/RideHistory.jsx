import React, { useCallback, useEffect, useState } from 'react'
import {
  listRides,
  getRideDetail,
  deleteRide,
  formatDistance,
  formatDuration,
  formatSpeed
} from '../data/rides.js'
import RideMap from './RideMap.jsx'
import EmptyState from './ui/EmptyState.jsx'
import usePullToRefresh from '../hooks/usePullToRefresh.jsx'
import { generateRideCard } from '../data/shareCard.js'
import { sharePngBlob } from '../data/share.js'

// Ride history list. Two flavors:
//   - bikeId provided → list rides for that bike only
//   - bikeId null      → list ALL of the user's rides across bikes
//
// Tap a ride row → detail card slides in with the route map. We don't
// route-change on tap; we just expand inline because rides are usually
// a quick glance, not a deep navigation.

export default function RideHistory({ bikeId = null, onStartRide, garage = [] }) {
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

  if (loading) {
    return (
      <div className="card text-center text-sm text-hd-muted">
        Loading rides…
      </div>
    )
  }

  if (err) {
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
  const [sharing, setSharing] = useState(false)

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

  async function handleShare() {
    if (!detail) return
    setSharing(true)
    try {
      const blob = await generateRideCard({
        ride: detail,
        bike,
        // Weather lives on the ride row as JSONB; fall back to null
        // if absent (older rides predate the weather feature).
        weather: detail.weather || ride.weather || null
      })
      await sharePngBlob(blob, {
        filename: `sidestand-ride-${ride.id.slice(0, 8)}.jpg`,
        title: bike?.nickname || bike?.model || 'My ride',
        text: 'Recorded on Sidestand.'
      })
    } catch (e) {
      console.warn('share failed', e)
      alert(`Could not share ride: ${e?.message || e}`)
    } finally {
      setSharing(false)
    }
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
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleShare}
                disabled={sharing}
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
                {sharing ? 'Preparing…' : 'Share ride'}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs text-hd-muted hover:text-red-400 disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete ride'}
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  )
}
