import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useUser } from '../auth/AuthProvider.jsx'
import {
  startTracking,
  stopTracking,
  requestPermission,
  openLocationSettings
} from '../data/geolocation.js'
import {
  saveRide,
  haversineMeters,
  formatDistance,
  formatDuration,
  formatSpeed
} from '../data/rides.js'
import { getGarage, updateBikeMileage } from '../data/storage.js'
import { formatMileage, formatTemperature } from '../data/userPrefs.js'
import { useUserPrefs } from '../hooks/useUserPrefs.js'
import { fetchCurrentWeather, formatWeatherShort } from '../data/weather.js'
import RideMap from './RideMap.jsx'

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
  // Re-render whenever the rider flips a unit pref so live distance,
  // speed, and stopwatch labels swap mi ⇄ km without remounting.
  useUserPrefs()
  const { user } = useUser()
  const garage = useMemo(() => getGarage(), [])
  const [bikeId, setBikeId] = useState(garage[0]?.id || null)
  const [phase, setPhase] = useState('idle') // 'idle' | 'recording' | 'saving' | 'done' | 'error'
  const [err, setErr] = useState(null)
  // When iOS denies (or has previously denied) location permission,
  // we surface a friendly modal with an "Open Settings" button rather
  // than failing silently with values stuck at 0.
  const [permissionBlocked, setPermissionBlocked] = useState(false)

  // Refs hold the live state we don't want to re-render on every sample.
  // We re-derive UI metrics from these via the tick effect below.
  const routeRef = useRef([]) // [[lat, lng, ts, speed], ...]
  const startedAtRef = useRef(null)
  const stopFnRef = useRef(null)
  // Weather snapshot captured at ride start. Saved with the ride
  // record so future-me can browse "hot rides" / "rainy rides".
  const weatherRef = useRef(null)

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
    setPermissionBlocked(false)
    setPhase('saving') // brief loading state during permission prompt
    try {
      const perm = await requestPermission()
      console.log('[RideTracker] requestPermission returned:', perm)
      // Block on 'denied'. 'prompt' is fine on native iOS — the
      // background-geolocation plugin runs its own permission dialog
      // inside addWatcher when requestPermissions:true.
      if (perm === 'denied') {
        setPermissionBlocked(true)
        setPhase('idle')
        return
      }
      routeRef.current = []
      startedAtRef.current = Date.now()
      weatherRef.current = null
      console.log('[RideTracker] calling startTracking, started at', startedAtRef.current)
      const stop = await startTracking((sample) => {
        // First-sample side effect: fire off a weather lookup. We
        // intentionally do this off the first GPS fix (rather than at
        // tap-Start) so we have an actual lat/lng to ask the API
        // about. Fire-and-forget so a slow Wi-Fi handoff never blocks
        // the ride — by the time the ride ends the result is back.
        if (routeRef.current.length === 0 && weatherRef.current == null) {
          fetchCurrentWeather(sample.lat, sample.lng)
            .then((w) => {
              if (w) weatherRef.current = w
            })
            .catch(() => {})
        }
        routeRef.current.push([
          sample.lat,
          sample.lng,
          sample.ts,
          sample.speed
        ])
      })
      console.log('[RideTracker] startTracking returned, stopFn type:', typeof stop)
      stopFnRef.current = stop
      setPhase('recording')
    } catch (e) {
      console.error('[RideTracker] start failed', e)
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
          endMileage,
          // The rides table has a JSONB `weather` column. We stuff
          // the snapshot in as JSON so the saver doesn't need to
          // know its shape; consumers (RideHistory, summary card)
          // pull what they want from it.
          weather: weatherRef.current
            ? JSON.stringify(weatherRef.current)
            : null
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

      {/* Live map — drawing the polyline as samples arrive */}
      {(phase === 'recording' || phase === 'saving') && (
        <LiveRouteMap
          routeRef={routeRef}
          tick={tick}
          height={240}
        />
      )}

      {/* Live stats */}
      {(phase === 'recording' || phase === 'saving') && (
        <div className="mb-6 rounded-3xl bg-hd-dark p-5">
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
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-hd-muted">
            <span>
              {routeRef.current.length} GPS point
              {routeRef.current.length === 1 ? '' : 's'} recorded
            </span>
            {phase === 'recording' && (
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
                live
              </span>
            )}
            {/* Weather chip — empty until the API call returns. The
                useMemo on `tick` re-runs once per second so this
                appears within ~1s of the first GPS sample. */}
            {weatherRef.current && (
              <span
                className="rounded-full bg-hd-black/40 px-2.5 py-1 text-[12px] text-hd-text"
                title={`Captured at ride start: ${weatherRef.current.label}`}
              >
                {weatherRef.current.emoji}{' '}
                {formatTemperature(weatherRef.current.tempC)}{' '}
                · {Math.round(weatherRef.current.windKph)} km/h wind
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

      {permissionBlocked && (
        <PermissionDeniedModal
          onClose={() => setPermissionBlocked(false)}
          onRetry={async () => {
            setPermissionBlocked(false)
            // After the user toggles in Settings and comes back, the
            // OS may not re-prompt. Re-running start() picks up the
            // new state via fg.checkPermissions().
            await start()
          }}
        />
      )}
    </div>
  )
}

// ============================================================
// Live route map
// ============================================================
//
// Draws the in-progress route polyline as new GPS samples come in.
// We deliberately avoid storing the route as React state (each push
// would force a re-render of the entire RideTracker tree) — instead
// the route lives in routeRef, and this component subscribes via a
// `tick` that increments once per second from the parent. On every
// tick we shallow-copy routeRef.current (a new array reference) and
// pass it as the route prop. RideMap detects the new reference and
// redraws.

function LiveRouteMap({ routeRef, tick, height = 240 }) {
  // Spread on every tick so route is a fresh array reference — that's
  // what causes RideMap to re-draw. routeRef.current itself never
  // changes identity even as we push new samples.
  const route = useMemo(() => [...routeRef.current], [tick, routeRef])
  if (route.length === 0) {
    return (
      <div
        className="mb-4 flex items-center justify-center rounded-3xl bg-hd-dark text-[13px] text-hd-muted"
        style={{ height }}
      >
        Waiting for GPS lock…
      </div>
    )
  }
  return (
    <div className="mb-4 overflow-hidden rounded-3xl">
      <RideMap
        route={route}
        height={height}
        className="rounded-3xl border-0"
        live={true}
      />
    </div>
  )
}

// ============================================================
// Permission denied modal
// ============================================================
//
// Shown when iOS reports location permission as 'denied' (either the
// user previously tapped Don't Allow, or device-wide Location Services
// is off). Offers two paths: Open Settings (uses the bg-geo plugin's
// openSettings(), which deep-links straight to the app's Location
// settings on iOS), or Retry (in case they granted permission and
// came back without us realising).

function PermissionDeniedModal({ onClose, onRetry }) {
  const [opening, setOpening] = useState(false)
  async function handleOpenSettings() {
    setOpening(true)
    try {
      const ok = await openLocationSettings()
      if (!ok) {
        alert(
          'Could not open Settings automatically. Open iPhone Settings → Sidestand → Location and choose Always or While Using.'
        )
      }
    } finally {
      setOpening(false)
    }
  }
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-t-3xl bg-hd-dark p-6 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-hd-orange/15 text-hd-orange">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-hd-text">
          Location access needed
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-hd-muted">
          Sidestand uses your iPhone's GPS to track distance, speed, and
          route while you ride. iOS is currently blocking that — it only
          takes a tap to fix.
        </p>
        <div className="mt-4 rounded-2xl bg-hd-black/40 px-4 py-3 text-[13px] text-hd-muted">
          <div className="font-semibold text-hd-text">In Settings:</div>
          <div className="mt-1">
            1. Tap <strong className="text-hd-text">Location</strong>
          </div>
          <div>
            2. Choose <strong className="text-hd-text">Always</strong> or{' '}
            <strong className="text-hd-text">While Using the App</strong>
          </div>
          <div>
            3. Make sure{' '}
            <strong className="text-hd-text">Precise Location</strong> is on
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={handleOpenSettings}
            disabled={opening}
            className="rounded-full bg-hd-orange px-5 py-3.5 text-[15px] font-semibold text-white transition active:scale-95 disabled:opacity-50"
          >
            {opening ? 'Opening…' : 'Open iPhone Settings'}
          </button>
          <button
            onClick={onRetry}
            className="rounded-full bg-hd-card px-5 py-3 text-[14px] font-medium text-hd-text"
          >
            I've granted access — try again
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-[13px] text-hd-muted"
          >
            Not now
          </button>
        </div>
      </div>
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
