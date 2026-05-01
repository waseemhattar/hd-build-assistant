import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useUser } from '../auth/AuthProvider.jsx'
import { startTracking, stopTracking, requestPermission } from '../data/geolocation.js'
import {
  saveRide,
  haversineMeters,
  formatDistance,
  formatDuration,
  formatSpeed
} from '../data/rides.js'
import { getGarage, updateBikeMileage } from '../data/storage.js'
import { formatMileage } from '../data/userPrefs.js'

// Live ride tracker.
//
// Flow:
//   1. User opens this view
//   2. Optionally pick a bike from the garage (defaults to first bike)
//   3. Tap "Start ride" → permission prompt → GPS starts
//   4. Live stats: stopwatch, distance, current speed, max speed
//   5. Tap "End ride" → saves to Supabase, optionally bumps bike mileage
//
// Defensive details:
//   - If the user accidentally background-quits the app before saving,
//     we keep the in-progress route in localStorage so we can offer to
//     resume on next launch (deferred to a follow-up session).
//   - Distance is computed client-side from the route polyline so we
//     don't trust speed readings that GPS sometimes hallucinates.
//   - Tick the stopwatch from a useEffect interval; don't rely on
//     route updates (which may stall when the bike is stopped).

export default function RideTracker({ onBack, onSaved }) {
  const { user } = useUser()
  const garage = useMemo(() => getGarage(), [])
  const [bikeId, setBikeId] = useState(garage[0]?.id || null)
  const [phase, setPhase] = useState('idle') // 'idle' | 'recording' | 'saving' | 'done' | 'error'
  const [err, setErr] = useState(null)

  // Refs hold the live state we don't want to re-render on every sample.
  // We re-derive UI metrics from these via the tick effect below.
  const routeRef = useRef([]) // [[lat, lng, ts, speed], ...]
  const startedAtRef = useRef(null)
  const stopFnRef = useRef(null)

  // UI state derived from refs — updated once a second by an interval
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (phase !== 'recording') return
    const i = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(i)
  }, [phase])

  // Stats — recomputed every tick / every new sample
  const stats = useMemo(() => {
    const r = routeRef.current
    if (r.length === 0) {
      return { distanceM: 0, durationSec: 0, speedMps: 0, maxSpeedMps: 0 }
    }
    let dist = 0
    for (let i = 1; i < r.length; i++) dist += haversineMeters(r[i - 1], r[i])
    const startTs = startedAtRef.current || r[0][2] || Date.now()
    const lastTs = r[r.length - 1][2] || Date.now()
    const durationSec = Math.max(0, Math.round((Date.now() - startTs) / 1000))
    let max = 0
    for (const pt of r) if (pt[3] > max) max = pt[3]
    const recent = r.slice(-3)
    const recentSpeed =
      recent.length > 0
        ? recent.reduce((s, p) => s + (p[3] > 0 ? p[3] : 0), 0) / recent.length
        : 0
    return {
      distanceM: Math.round(dist),
      durationSec,
      speedMps: recentSpeed,
      maxSpeedMps: max
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, phase])

  // --- start / stop handlers ---

  async function start() {
    setErr(null)
    setPhase('saving') // brief loading state during permission prompt
    try {
      const perm = await requestPermission()
      if (perm !== 'granted') {
        setErr(
          'Location permission required to track rides. Enable it in Settings → Sidestand → Location.'
        )
        setPhase('idle')
        return
      }
      routeRef.current = []
      startedAtRef.current = Date.now()
      const stop = await startTracking((sample) => {
        routeRef.current.push([
          sample.lat,
          sample.lng,
          sample.ts,
          sample.speed
        ])
      })
      stopFnRef.current = stop
      setPhase('recording')
    } catch (e) {
      setErr(e?.message || 'Could not start tracking.')
      setPhase('idle')
    }
  }

  async function end() {
    setPhase('saving')
    try {
      if (stopFnRef.current) {
        await stopFnRef.current()
        stopFnRef.current = null
      }
      await stopTracking()

      const route = routeRef.current
      if (route.length < 2) {
        setErr('Ride too short to save (no GPS movement detected).')
        setPhase('idle')
        return
      }
      // Mileage column is always stored as miles in the DB regardless of
      // user's display unit, so we always convert from meters → miles when
      // bumping. The display layer (formatMileage) handles km rendering.
      const startMileage = bikeId
        ? garage.find((b) => b.id === bikeId)?.mileage || null
        : null
      const dist = stats.distanceM
      const distMi = Math.round(dist / 1609.344)
      const endMileage = startMileage != null ? startMileage + distMi : null

      await saveRide(
        {
          bikeId: bikeId || null,
          startedAtMs: startedAtRef.current,
          route,
          startMileage,
          endMileage
        },
        user.id
      )

      // Auto-bump bike mileage if attached
      if (bikeId && endMileage != null) {
        try {
          updateBikeMileage(bikeId, endMileage)
        } catch (e) {
          console.warn('mileage bump failed', e)
        }
      }

      setPhase('done')
      onSaved && onSaved()
    } catch (e) {
      setErr(e?.message || 'Could not save ride.')
      setPhase('error')
    }
  }

  async function discard() {
    try {
      if (stopFnRef.current) {
        await stopFnRef.current()
        stopFnRef.current = null
      }
      await stopTracking()
    } catch (_) {}
    routeRef.current = []
    startedAtRef.current = null
    setPhase('idle')
    setErr(null)
  }

  // Cleanup: stop GPS on unmount
  useEffect(() => {
    return () => {
      if (stopFnRef.current) {
        stopFnRef.current().catch(() => {})
      }
      stopTracking().catch(() => {})
    }
  }, [])

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={() => {
          if (phase === 'recording') {
            if (
              !window.confirm(
                "You're still recording. Discard this ride?"
              )
            )
              return
          }
          discard()
          onBack && onBack()
        }}
        className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
      >
        ← Back
      </button>

      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-hd-orange">
          Ride
        </div>
        <h1 className="mt-1 font-display text-3xl tracking-wider sm:text-4xl">
          {phase === 'recording' ? 'RECORDING' : 'NEW RIDE'}
        </h1>
        <p className="mt-1 text-sm text-hd-muted">
          {phase === 'recording'
            ? 'GPS is recording. Keep your phone where it can see the sky.'
            : 'Track distance, speed, and route. Auto-updates your bike mileage when you finish.'}
        </p>
      </div>

      {/* Bike picker (idle only) */}
      {phase === 'idle' && garage.length > 0 && (
        <div className="mb-6 rounded-md border border-hd-border bg-hd-dark p-4">
          <div className="mb-2 text-xs uppercase tracking-widest text-hd-muted">
            Which bike?
          </div>
          <select
            value={bikeId || ''}
            onChange={(e) => setBikeId(e.target.value || null)}
            className="input"
          >
            <option value="">— No bike (just track the route) —</option>
            {garage.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nickname || b.model || b.year || 'Bike'}{' '}
                ({formatMileage(b.mileage || 0)})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Live stats */}
      {(phase === 'recording' || phase === 'saving') && (
        <div className="mb-6 rounded-md border border-hd-border bg-hd-dark p-5">
          <div className="grid grid-cols-2 gap-4">
            <Stat
              label="Distance"
              value={formatDistance(stats.distanceM)}
              big
            />
            <Stat
              label="Duration"
              value={formatDuration(stats.durationSec)}
              big
            />
            <Stat label="Speed" value={formatSpeed(stats.speedMps)} />
            <Stat
              label="Max speed"
              value={formatSpeed(stats.maxSpeedMps)}
            />
          </div>
          <div className="mt-4 text-xs text-hd-muted">
            {routeRef.current.length} GPS point
            {routeRef.current.length === 1 ? '' : 's'} recorded
            {phase === 'recording' && (
              <span className="ml-2 inline-flex items-center gap-1">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
                live
              </span>
            )}
          </div>
        </div>
      )}

      {err && (
        <div className="mb-4 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {err}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {phase === 'idle' && (
          <button
            onClick={start}
            className="flex-1 rounded bg-hd-orange px-6 py-4 text-base font-semibold text-white hover:brightness-110"
          >
            Start ride
          </button>
        )}
        {phase === 'recording' && (
          <>
            <button
              onClick={discard}
              className="rounded border border-hd-border bg-hd-dark px-6 py-4 text-base text-hd-muted hover:border-red-500 hover:text-red-400"
            >
              Cancel
            </button>
            <button
              onClick={end}
              className="flex-1 rounded bg-hd-orange px-6 py-4 text-base font-semibold text-white hover:brightness-110"
            >
              End ride & save
            </button>
          </>
        )}
        {phase === 'saving' && (
          <button
            disabled
            className="flex-1 rounded bg-hd-orange/60 px-6 py-4 text-base font-semibold text-white"
          >
            Saving…
          </button>
        )}
        {phase === 'done' && (
          <button
            onClick={() => onBack && onBack()}
            className="flex-1 rounded bg-hd-orange px-6 py-4 text-base font-semibold text-white"
          >
            Done — view rides
          </button>
        )}
        {phase === 'error' && (
          <>
            <button
              onClick={discard}
              className="rounded border border-hd-border bg-hd-dark px-6 py-4 text-base text-hd-muted hover:border-hd-orange"
            >
              Discard
            </button>
            <button
              onClick={end}
              className="flex-1 rounded bg-hd-orange px-6 py-4 text-base font-semibold text-white hover:brightness-110"
            >
              Try save again
            </button>
          </>
        )}
      </div>

      {phase === 'idle' && (
        <p className="mt-6 text-xs text-hd-muted">
          Heads up: GPS uses real battery. For long rides, plug into a
          USB-C charger or a tank-top charger.
        </p>
      )}
    </div>
  )
}

function Stat({ label, value, big }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-hd-muted">
        {label}
      </div>
      <div
        className={`mt-1 font-display tracking-wider text-hd-orange ${
          big ? 'text-3xl sm:text-4xl' : 'text-xl'
        }`}
      >
        {value}
      </div>
    </div>
  )
}
