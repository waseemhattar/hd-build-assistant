import React, { useEffect, useMemo, useState } from 'react'
import { useUser } from '../auth/AuthProvider.jsx'
import {
  getGarage,
  getServiceLog,
  getMods,
  subscribe,
  isInitialPullPending
} from '../data/storage.js'
import {
  intervals,
  evaluateInterval,
  findLastMatchingEntry
} from '../data/serviceIntervals.js'
import {
  formatDistance,
  formatMileage,
  formatDuration,
  formatDate,
  formatTimeAgo,
  subscribe as subscribePrefs,
  getPrefs
} from '../data/userPrefs.js'
import { listRides } from '../data/rides.js'
import RideMap from './RideMap.jsx'

// Signed-in dashboard — Apple-Health-style summary feed.
//
// Stack from top to bottom:
//   1. Today header — date + greeting
//   2. Hero card — most recent ride (with mini-map) OR primary bike
//   3. Service health rings — one per bike (Apple Activity ring vibe)
//   4. Quick actions — big thumb tiles
//   5. Recent rides (last 3 with mini-maps)
//   6. Service alerts — only if something is overdue/due-soon
//   7. Stats footer — distance ridden this month/year (Apple restraint)
//
// Cards reflow gracefully on mobile; everything stays single-column on
// narrow viewports and switches to a 2-up grid where it fits.

export default function Home({
  onOpenGarage,
  onOpenManual,
  onOpenIntervals,
  onPickJob,
  onOpenServiceBook,
  onOpenRides,
  onStartRide
}) {
  const { user } = useUser()
  const firstName = user?.firstName || user?.fullName?.split(' ')[0] || 'rider'

  // Re-render whenever local cache OR user prefs change
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const u1 = subscribe(() => setTick((t) => t + 1))
    const u2 = subscribePrefs(() => setTick((t) => t + 1))
    return () => {
      u1()
      u2()
    }
  }, [])

  const [pullPending, setPullPending] = useState(() => isInitialPullPending())
  useEffect(() => {
    setPullPending(isInitialPullPending())
  }, [tick])

  const garage = useMemo(() => getGarage(), [tick])
  const summary = useMemo(() => buildSummary(garage), [garage])

  // Recent rides — fetched once on mount, refreshed when garage changes.
  const [rides, setRides] = useState([])
  useEffect(() => {
    let cancelled = false
    listRides({ limit: 3 })
      .then((r) => {
        if (!cancelled) setRides(r || [])
      })
      .catch(() => {
        if (!cancelled) setRides([])
      })
    return () => {
      cancelled = true
    }
  }, [tick])

  const today = useMemo(() => new Date(), [tick])
  const dateLabel = formatDate(today, { long: true })

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 pt-4 sm:px-6">
      {/* Today header */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-hd-muted">
          {dateLabel}
        </div>
        <h1 className="mt-1 font-display text-3xl tracking-wider sm:text-4xl">
          {greetingFor(today)}, {firstName.toUpperCase()}.
        </h1>
        <p className="mt-1 text-sm text-hd-muted">
          {pullPending
            ? 'Loading your garage…'
            : garage.length === 0
            ? 'Add your first bike to get rolling.'
            : `${garage.length} bike${garage.length > 1 ? 's' : ''} ready to roll.`}
        </p>
      </div>

      {/* Hero card */}
      <div className="mb-4">
        {rides.length > 0 ? (
          <RideHeroCard ride={rides[0]} garage={garage} onOpenRides={onOpenRides} />
        ) : garage.length > 0 ? (
          <BikeHeroCard
            bike={garage[0]}
            onOpenServiceBook={onOpenServiceBook}
          />
        ) : (
          <EmptyHeroCard onOpenGarage={onOpenGarage} />
        )}
      </div>

      {/* Quick actions — Apple-Health-style "shortcut" tiles */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickTile
          label="Start ride"
          icon={<IconRide />}
          tone="primary"
          onClick={onStartRide}
        />
        <QuickTile
          label="Garage"
          icon={<IconGarage />}
          onClick={onOpenGarage}
        />
        <QuickTile
          label="Manual"
          icon={<IconManual />}
          onClick={onOpenManual}
        />
        <QuickTile
          label="Rides"
          icon={<IconHistory />}
          onClick={onOpenRides}
        />
      </div>

      {/* Service health — one ring per bike */}
      {garage.length > 0 && (
        <SectionCard
          title="Service health"
          subtitle="How current each bike is on its intervals."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {garage.map((b) => (
              <ServiceRing
                key={b.id}
                bike={b}
                onClick={() => onOpenServiceBook && onOpenServiceBook(b)}
              />
            ))}
          </div>
        </SectionCard>
      )}

      {/* Service alerts — only render if there's anything to flag */}
      {summary.dueSoon.length > 0 && (
        <SectionCard
          title="Heads up"
          subtitle="What's due now or coming up."
          accent="warn"
        >
          <ul className="space-y-2">
            {summary.dueSoon.slice(0, 5).map((d, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3 rounded-md border border-hd-border bg-hd-black/40 p-3"
              >
                <div>
                  <div className="text-sm text-hd-text">
                    {d.intervalLabel}
                  </div>
                  <div className="mt-0.5 text-xs text-hd-muted">
                    {d.bikeName} ·{' '}
                    {d.status === 'overdue'
                      ? `overdue ${formatMileage(d.milesOver)} `
                      : `in ${formatMileage(d.milesLeft)}`}
                  </div>
                </div>
                <button
                  onClick={() =>
                    onOpenServiceBook && onOpenServiceBook(d.bike)
                  }
                  className="text-xs text-hd-muted hover:text-hd-orange"
                >
                  Open →
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Recent rides */}
      {rides.length > 1 && (
        <SectionCard
          title="Recent rides"
          subtitle="Last few trips."
          action={
            onOpenRides && (
              <button
                onClick={onOpenRides}
                className="text-xs text-hd-muted hover:text-hd-orange"
              >
                See all →
              </button>
            )
          }
        >
          <div className="space-y-2">
            {rides.slice(1, 4).map((r) => (
              <RideMiniRow key={r.id} ride={r} garage={garage} />
            ))}
          </div>
        </SectionCard>
      )}

      {/* Stats footer */}
      {(rides.length > 0 || garage.length > 0) && (
        <SectionCard title="Totals" subtitle="A quick look at the numbers.">
          <div className="grid grid-cols-3 gap-3">
            <StatTile
              label="This month"
              value={formatDistance(distanceThisMonth(rides))}
            />
            <StatTile
              label="This year"
              value={formatDistance(distanceThisYear(rides))}
            />
            <StatTile
              label="Garage"
              value={`${garage.length}`}
              suffix={garage.length === 1 ? 'bike' : 'bikes'}
            />
          </div>
        </SectionCard>
      )}
    </div>
  )
}

// ---------- hero cards ----------

function RideHeroCard({ ride, garage, onOpenRides }) {
  const bike = garage.find((b) => b.id === ride.bike_id)
  const dateStr = formatDate(ride.started_at)
  return (
    <button
      onClick={onOpenRides}
      className="group block w-full overflow-hidden rounded-2xl border border-hd-border bg-hd-dark text-left transition hover:border-hd-orange"
    >
      <div className="grid grid-cols-1 sm:grid-cols-5">
        {/* Mini map preview */}
        <div className="sm:col-span-2">
          <RideHeroMap rideId={ride.id} />
        </div>
        <div className="flex flex-col justify-between gap-3 p-5 sm:col-span-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-hd-orange">
              Latest ride
            </div>
            <div className="mt-1 font-display text-2xl tracking-wider text-hd-text sm:text-3xl">
              {ride.title || dateStr.toUpperCase()}
            </div>
            <div className="mt-1 text-xs text-hd-muted">
              {dateStr}
              {bike && (
                <>
                  {' · '}
                  {bike.nickname || bike.model || 'bike'}
                </>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <BigStat
              label="Distance"
              value={formatDistance(ride.distance_m)}
            />
            <BigStat
              label="Duration"
              value={formatDuration(ride.duration_seconds || 0)}
            />
          </div>
        </div>
      </div>
    </button>
  )
}

// Inline RideMap for the hero — lighter than a full RideMap rerender.
// Defers route fetch to a child wrapper so the hero can render even if
// the route is empty.
function RideHeroMap({ rideId }) {
  const [route, setRoute] = useState(null)
  useEffect(() => {
    let cancelled = false
    import('../data/rides.js').then(({ getRideDetail }) => {
      getRideDetail(rideId)
        .then((d) => {
          if (!cancelled) setRoute(d?.route || [])
        })
        .catch(() => {
          if (!cancelled) setRoute([])
        })
    })
    return () => {
      cancelled = true
    }
  }, [rideId])

  if (!route || route.length === 0) {
    return (
      <div
        className="flex h-44 w-full items-center justify-center bg-hd-card text-xs text-hd-muted sm:h-full"
        aria-label="No route data"
      >
        No GPS route
      </div>
    )
  }
  return <RideMap route={route} height={200} className="rounded-none border-0" />
}

function BikeHeroCard({ bike, onOpenServiceBook }) {
  return (
    <button
      onClick={() => onOpenServiceBook && onOpenServiceBook(bike)}
      className="group block w-full overflow-hidden rounded-2xl border border-hd-border bg-hd-dark text-left transition hover:border-hd-orange"
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">
        {bike.imageUrl ? (
          <img
            src={bike.imageUrl}
            alt=""
            className="h-32 w-full rounded-md object-cover sm:h-32 sm:w-44"
          />
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-md bg-hd-card sm:w-44">
            <IconBikeLarge />
          </div>
        )}
        <div className="flex-1">
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            Your bike
          </div>
          <div className="mt-1 font-display text-2xl tracking-wider text-hd-text sm:text-3xl">
            {(bike.nickname || bike.model || 'BIKE').toUpperCase()}
          </div>
          <div className="mt-1 text-xs text-hd-muted">
            {bike.year ? `${bike.year} · ` : ''}
            {bike.model || 'Custom'}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            <BigStat
              label="Mileage"
              value={formatMileage(bike.mileage || 0)}
            />
          </div>
        </div>
      </div>
    </button>
  )
}

function EmptyHeroCard({ onOpenGarage }) {
  return (
    <div className="rounded-2xl border border-hd-border bg-hd-dark p-6 text-center">
      <div className="font-display text-2xl tracking-wider text-hd-text">
        ADD YOUR FIRST BIKE
      </div>
      <p className="mx-auto mt-2 max-w-md text-sm text-hd-muted">
        Track service, plan mods, follow procedures from the manual, and
        record GPS rides — all scoped to your bike.
      </p>
      <button
        onClick={onOpenGarage}
        className="mt-4 rounded bg-hd-orange px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
      >
        Open garage
      </button>
    </div>
  )
}

// ---------- service ring ----------

function ServiceRing({ bike, onClick }) {
  const log = getServiceLog(bike.id)
  const mi = bike.mileage || 0
  let total = 0
  let healthy = 0
  for (const interval of intervals) {
    const last = findLastMatchingEntry(interval, log)
    const ev = evaluateInterval(interval, mi, last)
    if (ev.status === 'never-due') continue
    total += 1
    if (ev.status === 'ok') healthy += 1
  }
  const pct = total === 0 ? 100 : Math.round((healthy / total) * 100)
  // Color tone based on health %.
  const tone =
    pct >= 80 ? 'ok' : pct >= 50 ? 'warn' : 'bad'
  const ringColor =
    tone === 'ok' ? '#22c55e' : tone === 'warn' ? '#f59e0b' : '#ef4444'

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-md border border-hd-border bg-hd-black p-3 transition hover:border-hd-orange"
    >
      <Ring percent={pct} color={ringColor} />
      <div className="text-center">
        <div className="line-clamp-1 text-xs font-semibold text-hd-text">
          {bike.nickname || bike.model || 'bike'}
        </div>
        <div className="text-[10px] text-hd-muted">
          {pct}% on schedule
        </div>
      </div>
    </button>
  )
}

// SVG ring — Apple Activity-ring style. Track ring (thin, dim) +
// progress arc on top. We keep stroke geometry symmetric so the ring
// stays clean when ranks pct=100.
function Ring({ percent, color, size = 56, stroke = 6 }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (Math.max(0, Math.min(100, percent)) / 100) * c
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#fff"
        fontSize={size * 0.28}
        fontWeight="600"
      >
        {percent}%
      </text>
    </svg>
  )
}

// ---------- recent ride mini row ----------

function RideMiniRow({ ride, garage }) {
  const bike = garage.find((b) => b.id === ride.bike_id)
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-hd-border bg-hd-black/40 p-3">
      <div className="flex-1">
        <div className="line-clamp-1 text-sm text-hd-text">
          {ride.title || formatDate(ride.started_at)}
        </div>
        <div className="mt-0.5 flex flex-wrap gap-x-3 text-[11px] text-hd-muted">
          <span>{formatDistance(ride.distance_m)}</span>
          <span>{formatDuration(ride.duration_seconds || 0)}</span>
          {bike && <span>{bike.nickname || bike.model}</span>}
          <span>{formatTimeAgo(ride.started_at)}</span>
        </div>
      </div>
    </div>
  )
}

// ---------- layout primitives ----------

function SectionCard({ title, subtitle, children, action, accent }) {
  return (
    <section className="mb-4 rounded-2xl border border-hd-border bg-hd-dark p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div
            className={`text-xs uppercase tracking-widest ${
              accent === 'warn' ? 'text-amber-400' : 'text-hd-orange'
            }`}
          >
            {title}
          </div>
          {subtitle && (
            <div className="mt-0.5 text-xs text-hd-muted">{subtitle}</div>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function QuickTile({ label, icon, onClick, tone }) {
  const isPrimary = tone === 'primary'
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition ${
        isPrimary
          ? 'border-hd-orange bg-hd-orange/15 text-hd-orange hover:bg-hd-orange/20'
          : 'border-hd-border bg-hd-dark text-hd-text hover:border-hd-orange'
      }`}
    >
      <div className="h-7 w-7">{icon}</div>
      <div className="text-xs font-semibold">{label}</div>
    </button>
  )
}

function BigStat({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-hd-muted">
        {label}
      </div>
      <div className="mt-0.5 font-display text-xl tracking-wider text-hd-orange sm:text-2xl">
        {value}
      </div>
    </div>
  )
}

function StatTile({ label, value, suffix }) {
  return (
    <div className="rounded-md border border-hd-border bg-hd-black/40 p-3 text-center">
      <div className="text-[10px] uppercase tracking-widest text-hd-muted">
        {label}
      </div>
      <div className="mt-1 font-display text-xl tracking-wider text-hd-text">
        {value}
      </div>
      {suffix && (
        <div className="text-[10px] text-hd-muted">{suffix}</div>
      )}
    </div>
  )
}

// ---------- icons (inline SVG so we don't pull in another library) ----------

function IconRide() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M6 17l3-7h6l3 7" />
      <path d="M9 10V6h2" />
    </svg>
  )
}
function IconGarage() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V9l9-6 9 6v12" />
      <path d="M7 21V11h10v10" />
      <path d="M9 14h6M9 17h6" />
    </svg>
  )
}
function IconManual() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5a2 2 0 0 1 2-2h11v18H6a2 2 0 0 1-2-2V5z" />
      <path d="M4 19a2 2 0 0 1 2-2h11" />
      <path d="M9 7h5M9 11h5" />
    </svg>
  )
}
function IconHistory() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}
function IconBikeLarge() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" className="text-hd-muted">
      <circle cx="16" cy="44" r="10" />
      <circle cx="48" cy="44" r="10" />
      <path d="M16 44l10-22h12l10 22" />
      <path d="M26 22V14h6" />
    </svg>
  )
}

// ---------- summary helpers ----------

function buildSummary(garage) {
  const dueSoon = []
  for (const bike of garage) {
    const log = getServiceLog(bike.id)
    const mi = bike.mileage || 0
    for (const interval of intervals) {
      const last = findLastMatchingEntry(interval, log)
      const ev = evaluateInterval(interval, mi, last)
      if (ev.status === 'overdue' || ev.status === 'due-soon') {
        dueSoon.push({
          bike,
          bikeName: bike.nickname || bike.model || `${bike.year || ''} bike`,
          intervalLabel: interval.label,
          status: ev.status,
          milesLeft: ev.milesLeft,
          milesOver: ev.milesOver
        })
      }
    }
  }
  dueSoon.sort((a, b) => {
    if (a.status === 'overdue' && b.status !== 'overdue') return -1
    if (b.status === 'overdue' && a.status !== 'overdue') return 1
    if (a.status === 'overdue') return (b.milesOver || 0) - (a.milesOver || 0)
    return (a.milesLeft || 0) - (b.milesLeft || 0)
  })
  return { dueSoon }
}

function distanceThisMonth(rides) {
  if (!rides.length) return 0
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  return rides
    .filter((r) => new Date(r.started_at) >= start)
    .reduce((s, r) => s + (r.distance_m || 0), 0)
}

function distanceThisYear(rides) {
  if (!rides.length) return 0
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  return rides
    .filter((r) => new Date(r.started_at) >= start)
    .reduce((s, r) => s + (r.distance_m || 0), 0)
}

function greetingFor(date) {
  const h = date.getHours()
  if (h < 5) return 'STILL UP'
  if (h < 12) return 'MORNING'
  if (h < 17) return 'AFTERNOON'
  if (h < 21) return 'EVENING'
  return 'LATE'
}
