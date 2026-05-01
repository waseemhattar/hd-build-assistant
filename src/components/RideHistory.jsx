import React, { useEffect, useState } from 'react'
import {
  listRides,
  getRideDetail,
  deleteRide,
  formatDistance,
  formatDuration,
  formatSpeed
} from '../data/rides.js'
import RideMap from './RideMap.jsx'

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
      <div className="rounded-md border border-hd-border bg-hd-dark p-6 text-center">
        <div className="font-display text-xl tracking-wider">
          NO RIDES YET
        </div>
        <p className="mt-2 text-sm text-hd-muted">
          Tap "Start a ride" to record your first GPS-tracked trip.
        </p>
        {onStartRide && (
          <button
            onClick={onStartRide}
            className="mt-4 rounded bg-hd-orange px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
          >
            Start a ride
          </button>
        )}
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {rides.map((r) => (
        <RideRow
          key={r.id}
          ride={r}
          isOpen={openRideId === r.id}
          onToggle={() => setOpenRideId(openRideId === r.id ? null : r.id)}
          garage={garage}
          onDeleted={reload}
        />
      ))}
    </ul>
  )
}

function RideRow({ ride, isOpen, onToggle, garage, onDeleted }) {
  const [detail, setDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [deleting, setDeleting] = useState(false)

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
              {formatDistance(ride.distance_m, 'mi')}
            </span>
            <span>{formatDuration(ride.duration_seconds || 0)}</span>
            {ride.avg_speed_mps != null && (
              <span>avg {formatSpeed(ride.avg_speed_mps, 'mph')}</span>
            )}
            {ride.max_speed_mps != null && ride.max_speed_mps > 0 && (
              <span>max {formatSpeed(ride.max_speed_mps, 'mph')}</span>
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
            <div className="mt-4 flex justify-end gap-2">
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
