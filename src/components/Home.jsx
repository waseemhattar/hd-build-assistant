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
  subscribe as subscribePrefs
} from '../data/userPrefs.js'
import { listRides } from '../data/rides.js'
import RideMap from './RideMap.jsx'

// Home dashboard — designed to feel like an iOS app, not a website.
//
// Visual rules in play:
//   - Full-bleed sections on mobile; we don't constrain to a max width
//     until sm: where it makes sense.
//   - Cards have NO border. Subtle background contrast is the only
//     separation (hd-dark sits on top of hd-black). This is the iOS
//     "inset grouped" pattern.
//   - Section corners are rounded-3xl (24px), not rounded-md. Generous.
//   - Rows inside sections use a thin internal divider (border-white/5)
//     not a card-per-row.
//   - Chevron (›) replaces "Open →" on tappable rows.
//   - Vertical rhythm: 16px between cards, 24-32px between sections.
//   - Greeting line in big bold sans + signal-red kicker (date) — feels
//     like Apple Health's Today header.
//
// Sections (top → bottom):
//   1. Today header (date + greeting)
//   2. Hero card — most recent ride OR primary bike OR onboarding empty
//   3. Quick action grid (icons)
//   4. Service health rings — one per bike
//   5. Heads up alerts (only if anything is overdue/due-soon)
//   6. Recent rides
//   7. Totals footer

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
  const firstName =
    user?.firstName ||
    user?.fullName?.split(' ')[0] ||
    user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
    'rider'

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

  const [rides, setRides] = useState([])
  useEffect(() => {
    let cancelled = false
    listRides({ limit: 4 })
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
    <div className="mx-auto max-w-3xl pt-2 sm:pt-6">
      {/* Today header */}
      <header className="px-5 pb-4 pt-4 sm:px-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
          {dateLabel}
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-hd-text sm:text-4xl">
          {greetingFor(today)}, {capitalize(firstName)}.
        </h1>
        <p className="mt-1 text-[15px] text-hd-muted">
          {pullPending
            ? 'Loading your garage…'
            : garage.length === 0
            ? 'Add your first bike to get rolling.'
            : `${garage.length} bike${garage.length > 1 ? 's' : ''} ready to roll.`}
        </p>
      </header>

      {/* Hero card */}
      <div className="px-4 pb-4 sm:px-6">
        {rides.length > 0 ? (
          <RideHeroCard
            ride={rides[0]}
            garage={garage}
            onOpenRides={onOpenRides}
          />
        ) : garage.length > 0 ? (
          <BikeHeroCard
            bike={garage[0]}
            onOpenServiceBook={onOpenServiceBook}
          />
        ) : (
          <EmptyHeroCard onOpenGarage={onOpenGarage} />
        )}
      </div>

      {/* Quick actions */}
      <div className="px-4 pb-6 sm:px-6">
        <div className="grid grid-cols-4 gap-2">
          <QuickTile
            label="Ride"
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
      </div>

      {/* Service health */}
      {garage.length > 0 && (
        <Section title="Service health" subtitle="How current each bike is.">
          <div className="grid grid-cols-3 gap-3 px-1 py-1 sm:grid-cols-4">
            {garage.map((b) => (
              <ServiceRing
                key={b.id}
                bike={b}
                onClick={() => onOpenServiceBook && onOpenServiceBook(b)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Heads up */}
      {summary.dueSoon.length > 0 && (
        <Section
          title="Heads up"
          subtitle="What's due now or coming up."
          accent="warn"
        >
          <Rows>
            {summary.dueSoon.slice(0, 5).map((d, i) => (
              <Row
                key={i}
                title={d.intervalLabel}
                sub={`${d.bikeName} · ${
                  d.status === 'overdue'
                    ? `overdue ${formatMileage(d.milesOver)}`
                    : `in ${formatMileage(d.milesLeft)}`
                }`}
                tone={d.status === 'overdue' ? 'bad' : 'warn'}
                onClick={() =>
                  onOpenServiceBook && onOpenServiceBook(d.bike)
                }
              />
            ))}
          </Rows>
        </Section>
      )}

      {/* Recent rides */}
      {rides.length > 1 && (
        <Section
          title="Recent rides"
          subtitle="Last few trips."
          action={
            onOpenRides && (
              <button
                onClick={onOpenRides}
                className="text-[13px] font-medium text-hd-orange"
              >
                See all
              </button>
            )
          }
        >
          <Rows>
            {rides.slice(1).map((r) => (
              <RideRow key={r.id} ride={r} garage={garage} />
            ))}
          </Rows>
        </Section>
      )}

      {/* Totals footer */}
      {(rides.length > 0 || garage.length > 0) && (
        <Section title="Totals" subtitle="A quick look at the numbers.">
          <div className="grid grid-cols-3 gap-2 p-1">
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
        </Section>
      )}

      <div className="h-6" />
    </div>
  )
}

// ============================================================
// Hero cards
// ============================================================

function RideHeroCard({ ride, garage, onOpenRides }) {
  const bike = garage.find((b) => b.id === ride.bike_id)
  const dateStr = formatDate(ride.started_at)
  return (
    <button
      onClick={onOpenRides}
      className="group block w-full overflow-hidden rounded-3xl bg-hd-dark text-left transition active:scale-[0.99]"
    >
      <RideHeroMap rideId={ride.id} />
      <div className="p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
          Latest ride
        </div>
        <div className="mt-1 text-2xl font-bold text-hd-text sm:text-3xl">
          {ride.title || dateStr}
        </div>
        <div className="mt-1 text-[13px] text-hd-muted">
          {dateStr}
          {bike && <> · {bike.nickname || bike.model || 'bike'}</>}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <BigStat
            label="Distance"
            value={formatDistance(ride.distance_m)}
          />
          <BigStat
            label="Duration"
            value={formatDuration(ride.duration_seconds || 0)}
          />
          <BigStat
            label={ride.avg_speed_mps ? 'Avg speed' : 'Time'}
            value={
              ride.avg_speed_mps
                ? `${(ride.avg_speed_mps * (
                    isMetricFromBrowserMemo()
                      ? 3.6
                      : 2.23694
                  )).toFixed(0)} ${
                    isMetricFromBrowserMemo() ? 'km/h' : 'mph'
                  }`
                : formatTimeAgo(ride.started_at)
            }
          />
        </div>
      </div>
    </button>
  )
}

// Memoized check — avoids importing isMetric here just to keep imports
// tidy. Resolves once per render and the closure cache makes repeated
// calls in a single render free.
function isMetricFromBrowserMemo() {
  // Lazy: read from localStorage directly to avoid coupling. Same key
  // userPrefs uses; if missing, locale default applies.
  try {
    const raw = window.localStorage.getItem('sidestand:userPrefs/v1')
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed.units === 'metric'
    }
  } catch (_) {}
  // Fallback: detect from locale
  const lang = navigator?.language || 'en-US'
  return !/-(US|LR|MM|GB)$/i.test(lang)
}

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

  if (!route) {
    return (
      <div
        className="flex h-44 w-full items-center justify-center bg-hd-card"
        aria-hidden="true"
      >
        <div className="text-[11px] uppercase tracking-widest text-hd-muted">
          Loading map…
        </div>
      </div>
    )
  }
  if (route.length === 0) {
    return (
      <div className="flex h-44 w-full items-center justify-center bg-hd-card">
        <div className="text-[11px] uppercase tracking-widest text-hd-muted">
          No GPS route
        </div>
      </div>
    )
  }
  return (
    <div className="overflow-hidden">
      <RideMap route={route} height={200} className="rounded-none border-0" />
    </div>
  )
}

function BikeHeroCard({ bike, onOpenServiceBook }) {
  return (
    <button
      onClick={() => onOpenServiceBook && onOpenServiceBook(bike)}
      className="group block w-full overflow-hidden rounded-3xl bg-hd-dark text-left transition active:scale-[0.99]"
    >
      {bike.imageUrl ? (
        <img
          src={bike.imageUrl}
          alt=""
          className="h-44 w-full object-cover"
        />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-hd-card">
          <IconBikeLarge />
        </div>
      )}
      <div className="p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
          Your bike
        </div>
        <div className="mt-1 text-2xl font-bold text-hd-text sm:text-3xl">
          {bike.nickname || bike.model || 'Bike'}
        </div>
        <div className="mt-1 text-[13px] text-hd-muted">
          {bike.year ? `${bike.year} · ` : ''}
          {bike.model || 'Custom'}
        </div>
        <div className="mt-4">
          <BigStat
            label="Mileage"
            value={formatMileage(bike.mileage || 0)}
          />
        </div>
      </div>
    </button>
  )
}

function EmptyHeroCard({ onOpenGarage }) {
  return (
    <div className="rounded-3xl bg-hd-dark p-7 text-center">
      <div className="text-2xl font-bold text-hd-text">
        Add your first bike
      </div>
      <p className="mx-auto mt-2 max-w-md text-[14px] text-hd-muted">
        Track service, plan mods, follow procedures from the manual,
        record GPS rides — all scoped to your bike.
      </p>
      <button
        onClick={onOpenGarage}
        className="mt-5 rounded-full bg-hd-orange px-6 py-3 text-[15px] font-semibold text-white"
      >
        Open garage
      </button>
    </div>
  )
}

// ============================================================
// Service ring
// ============================================================

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
  const ringColor =
    pct >= 80 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#f87171'

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-2xl p-2 transition active:scale-95"
    >
      <Ring percent={pct} color={ringColor} size={64} stroke={6} />
      <div className="text-center">
        <div className="line-clamp-1 text-[12px] font-semibold text-hd-text">
          {bike.nickname || bike.model || 'bike'}
        </div>
        <div className="text-[10px] text-hd-muted">{pct}%</div>
      </div>
    </button>
  )
}

function Ring({ percent, color, size = 64, stroke = 6 }) {
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
        stroke="rgba(255,255,255,0.06)"
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
        fontSize={size * 0.3}
        fontWeight="700"
      >
        {percent}
      </text>
    </svg>
  )
}

// ============================================================
// List rows  (iOS inset-grouped pattern)
// ============================================================

function Rows({ children }) {
  // Shave dividers between children with last-of-type:border-b-0.
  return <ul className="overflow-hidden">{children}</ul>
}

function Row({ title, sub, onClick, tone }) {
  const dotColor =
    tone === 'bad'
      ? 'bg-red-400'
      : tone === 'warn'
      ? 'bg-amber-400'
      : 'bg-emerald-400'
  return (
    <li className="border-b border-white/5 last:border-b-0">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition active:bg-white/5"
      >
        <div className="flex flex-1 items-start gap-3">
          {tone && (
            <span
              className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${dotColor}`}
              aria-hidden="true"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="line-clamp-1 text-[15px] font-medium text-hd-text">
              {title}
            </div>
            {sub && (
              <div className="mt-0.5 text-[13px] text-hd-muted">{sub}</div>
            )}
          </div>
        </div>
        <Chevron />
      </button>
    </li>
  )
}

function RideRow({ ride, garage }) {
  const bike = garage.find((b) => b.id === ride.bike_id)
  const subParts = [
    formatDistance(ride.distance_m),
    formatDuration(ride.duration_seconds || 0)
  ]
  if (bike) subParts.push(bike.nickname || bike.model)
  return (
    <li className="border-b border-white/5 last:border-b-0">
      <div className="flex w-full items-center justify-between gap-3 px-4 py-3.5">
        <div className="min-w-0 flex-1">
          <div className="line-clamp-1 text-[15px] font-medium text-hd-text">
            {ride.title || formatDate(ride.started_at)}
          </div>
          <div className="mt-0.5 text-[12px] text-hd-muted">
            {subParts.join(' · ')}
          </div>
        </div>
        <div className="text-[12px] text-hd-muted">
          {formatTimeAgo(ride.started_at)}
        </div>
      </div>
    </li>
  )
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-hd-muted/70"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

// ============================================================
// Section + tile primitives
// ============================================================

function Section({ title, subtitle, action, children, accent }) {
  return (
    <section className="px-4 pb-6 sm:px-6">
      <div className="mb-2 flex items-end justify-between gap-3 px-1">
        <div>
          <div
            className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
              accent === 'warn' ? 'text-amber-400' : 'text-hd-orange'
            }`}
          >
            {title}
          </div>
          {subtitle && (
            <div className="mt-0.5 text-[13px] text-hd-muted">{subtitle}</div>
          )}
        </div>
        {action}
      </div>
      <div className="overflow-hidden rounded-3xl bg-hd-dark">
        {children}
      </div>
    </section>
  )
}

function QuickTile({ label, icon, onClick, tone }) {
  const isPrimary = tone === 'primary'
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 text-center transition active:scale-95 ${
        isPrimary
          ? 'bg-hd-orange text-white'
          : 'bg-hd-dark text-hd-text'
      }`}
    >
      <div className={`h-6 w-6 ${isPrimary ? '' : 'text-hd-orange'}`}>
        {icon}
      </div>
      <div
        className={`text-[11px] font-semibold ${
          isPrimary ? 'text-white' : 'text-hd-text'
        }`}
      >
        {label}
      </div>
    </button>
  )
}

function BigStat({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-hd-muted">
        {label}
      </div>
      <div className="mt-0.5 text-xl font-bold tracking-tight text-hd-orange sm:text-2xl">
        {value}
      </div>
    </div>
  )
}

function StatTile({ label, value, suffix }) {
  return (
    <div className="rounded-2xl px-3 py-3 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-hd-muted">
        {label}
      </div>
      <div className="mt-1 text-lg font-bold tracking-tight text-hd-text">
        {value}
      </div>
      {suffix && (
        <div className="text-[10px] text-hd-muted">{suffix}</div>
      )}
    </div>
  )
}

// ============================================================
// Icons
// ============================================================

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
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="56" height="56" className="text-hd-muted">
      <circle cx="16" cy="44" r="10" />
      <circle cx="48" cy="44" r="10" />
      <path d="M16 44l10-22h12l10 22" />
      <path d="M26 22V14h6" />
    </svg>
  )
}

// ============================================================
// Helpers
// ============================================================

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
  if (h < 5) return 'Still up'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Late one'
}

function capitalize(s) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}
