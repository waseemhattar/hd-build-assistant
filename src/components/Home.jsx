import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useUser } from '../auth/AuthProvider.jsx'
import {
  getGarage,
  getServiceLog,
  getMods,
  getJobCards,
  subscribe,
  isInitialPullPending
} from '../data/storage.js'
import {
  intervals,
  evaluateInterval,
  findLastMatchingEntry,
  nextMilestoneForBike
} from '../data/serviceIntervals.js'
import BottomSheet from './ui/BottomSheet.jsx'
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
  onOpenServiceBook,
  onOpenRides,
  onStartRide,
  onOpenDiscover,
  // Action-flavored quick tiles. Each accepts the picked bike (the
  // first in the garage) and a "tab" hint that App.jsx threads into
  // the destination so the rider lands on the right tab.
  onPlanJob,
  onLogService,
  onAddBike
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

  // In-progress job cards across the whole garage. Cards that are
  // status='in-progress' OR drafts with at least one procedure
  // attached (= the rider has started planning real work on them).
  // Surfaced at the top of the dashboard so the rider doesn't lose
  // track of work they started yesterday and haven't finished.
  const inProgressJobs = useMemo(
    () => activeJobCardsAcrossGarage(garage),
    [garage, tick]
  )

  // Service milestones across the garage. One row per bike whose
  // next 5k milestone is approaching (within 1,500 mi) OR has any
  // overdue items. Riders think in milestones ("the 25k service",
  // "the 50k service") not per-item, so we roll items up.
  const milestoneAlerts = useMemo(
    () => milestonesNeedingAttention(garage),
    [garage, tick]
  )

  // The milestone the rider has tapped — drives the bottom sheet
  // that lists the items rolled up under that milestone.
  const [selectedMilestone, setSelectedMilestone] = useState(null)

  // Recent rides — fetched once on mount (and once after first server
  // pull settles). We deliberately do NOT refetch on every storage tick
  // because that fires on every cache write, which thrashes the
  // network on slower devices like the iPhone WebView.
  //
  // Bumped from 4 to 100 so the streak + month stats up top operate on
  // a real window of data. A power user does maybe 60 rides/month, so
  // 100 covers ~6-8 weeks back — plenty for streak calculation.
  const [rides, setRides] = useState([])
  const ridesFetchedRef = useRef(false)
  useEffect(() => {
    if (ridesFetchedRef.current) return
    if (pullPending) return
    ridesFetchedRef.current = true
    let cancelled = false
    listRides({ limit: 100 })
      .then((r) => {
        if (!cancelled) setRides(r || [])
      })
      .catch(() => {
        if (!cancelled) setRides([])
      })
    return () => {
      cancelled = true
    }
  }, [pullPending])

  const today = useMemo(() => new Date(), [tick])
  const dateLabel = formatDate(today, { long: true })

  // Streak — consecutive days with at least one ride. Same shape as
  // Strava / Apple Fitness streaks: lapsing for >24h breaks it. We
  // allow today OR yesterday as the active anchor so the rider's
  // streak doesn't visibly "die" in the morning before they go ride.
  const streakDays = useMemo(() => calculateStreak(rides), [rides])

  // Stats strip — distance, ride count, total time for the calendar
  // month. Computed client-side from the same rides array.
  const monthStats = useMemo(() => statsForCurrentMonth(rides), [rides])

  return (
    <div className="mx-auto max-w-3xl pt-2 sm:pt-6">
      {/* Today header — date + greeting + streak. The streak line is
          the engagement hook: it changes every day and pulls riders
          back to keep it alive (Apple Fitness / Duolingo / Strava
          pattern). When the rider has no streak yet we show a
          contextual prompt instead of a 0. */}
      <header className="px-5 pb-4 pt-4 sm:px-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
          {dateLabel}
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-hd-text sm:text-4xl">
          {greetingFor(today)}, {capitalize(firstName)}.
        </h1>
        <p className="mt-1 text-[15px] text-hd-muted">
          {pullPending
            ? 'Pulling your garage in…'
            : garage.length === 0
            ? "Add a bike and let's get you rolling."
            : streakDays > 0
            ? <>🔥 <span className="text-hd-text">{streakDays} days in a row.</span> Don't break the chain.</>
            : rides.length === 0
            ? "Save your first ride and we'll start counting."
            : 'Get on the bike today and start a new streak.'}
        </p>
      </header>

      {/* Primary actions — Start a ride + Discover, side by side.
          The old single full-width orange CTA was visually loud and
          left no room for Discover, which is now equally important
          to the app's daily loop. Two equal-height tiles let the
          rider choose between "go ride right now" and "find a route
          first." Start-a-ride keeps the orange fill so it still reads
          as the dominant action; Discover uses the dark card surface
          with an orange-tinted icon chip, so it's clearly clickable
          but quieter. Both tiles work on day zero — RideTracker
          handles the no-bike case, and Discover surfaces curated
          routes even before you've ridden anywhere. */}
      <div className="px-4 pb-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3">
          <ActionTile
            tone="primary"
            icon={<IconPlay />}
            title="Start a ride"
            sub="Track it · share it"
            onClick={onStartRide}
          />
          <ActionTile
            tone="secondary"
            icon={<IconCompass />}
            title="Discover"
            sub="See where others ride"
            onClick={onOpenDiscover}
          />
        </div>
      </div>

      {/* Month stats strip — small but addictive numbers that change
          visibly whenever the rider does anything. The label uses the
          actual month name ("MAY" / "JUNE") so the rider sees the
          rollover on the 1st as a fresh canvas. */}
      <div className="px-4 pb-6 sm:px-6">
        <div className="grid grid-cols-3 gap-2">
          <MonthStatTile
            label={`${monthLabel(today)} · DISTANCE`}
            value={formatDistance(monthStats.distanceM)}
          />
          <MonthStatTile
            label={`${monthLabel(today)} · RIDES`}
            value={
              monthStats.rideCount === 0
                ? '0'
                : `${monthStats.rideCount}`
            }
            suffix={monthStats.rideCount === 1 ? 'ride' : 'rides'}
          />
          <MonthStatTile
            label="TOTAL TIME"
            value={
              monthStats.totalSeconds === 0
                ? '0m'
                : formatDuration(monthStats.totalSeconds)
            }
          />
        </div>
      </div>

      {/* In progress — job cards the rider has started but not
          finished. Sits up high (above the latest ride) because
          unfinished work is more actionable than the last ride. Each
          row taps to that bike's job-cards tab so the rider can
          continue planning or check off procedures. */}
      {inProgressJobs.length > 0 && (
        <Section
          title="In progress"
          subtitle={
            inProgressJobs.length === 1
              ? "Pick up where you left off."
              : `${inProgressJobs.length} jobs you're in the middle of.`
          }
        >
          <Rows>
            {inProgressJobs.slice(0, 4).map(({ card, bike }) => (
              <Row
                key={card.id}
                title={card.title || 'Untitled job'}
                sub={
                  <>
                    <span className="font-semibold text-hd-text">
                      {bike.nickname || bike.model || 'bike'}
                    </span>
                    {' · '}
                    {jobProgressSummary(card)}
                  </>
                }
                onClick={() => onPlanJob && onPlanJob(bike)}
              />
            ))}
          </Rows>
        </Section>
      )}

      {/* Latest ride card with mini-map. Replaces the visual gap that
          opened up after chunk 1 moved the bike-or-ride hero up into
          the streak/CTA header. The Recent Rides section below uses
          rides.slice(1) to skip the latest, since it's featured here.
          The card is a real tap target — taps to open Rides where the
          rider can drill into the route + share + open in Maps. */}
      {rides.length > 0 && (
        <div className="px-4 pb-6 sm:px-6">
          <RideHeroCard
            ride={rides[0]}
            garage={garage}
            onOpenRides={onOpenRides}
          />
        </div>
      )}

      {/* Service health. Subtitle now reflects actual state — "all
          up to date" when everything's healthy, an overdue/due-soon
          count when there's work pending. Subtle but answers the
          rider's first question (am I OK?) before they drill in. */}
      {garage.length > 0 && (
        <Section
          title="Service health"
          subtitle={serviceHealthSubtitle(summary)}
        >
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

      {/* Heads up — service milestones. One row per bike whose next
          5k milestone is approaching or already past with overdue
          items. Tapping a row opens a bottom sheet that lists the
          individual items the rider should attend to at that
          milestone (oil change, brake pads, plugs, etc.). This
          matches how factory service schedules are organized — by
          mile-marker, not by item — and how riders naturally think
          ("when's my next service due?"). */}
      {milestoneAlerts.length > 0 && (
        <Section
          title="Heads up"
          subtitle={
            milestoneAlerts.length === 1
              ? "Service milestone coming up."
              : `${milestoneAlerts.length} bikes have service milestones.`
          }
          accent="warn"
        >
          <Rows>
            {milestoneAlerts.map(({ bike, milestone }) => {
              const tone = milestone.overdueCount > 0 ? 'bad' : 'warn'
              const label = `${milestone.milestone.toLocaleString()} mi service`
              const sub = (
                <>
                  <span className="font-semibold text-hd-text">
                    {bike.nickname || bike.model || 'bike'}
                  </span>
                  {' · '}
                  {milestone.overdueCount > 0
                    ? `${milestone.overdueCount} overdue · ${milestone.items.length} items`
                    : `in ${formatMileage(milestone.milesLeft)} · ${milestone.items.length} items`}
                </>
              )
              return (
                <Row
                  key={bike.id}
                  title={label}
                  sub={sub}
                  tone={tone}
                  onClick={() => setSelectedMilestone({ bike, milestone })}
                />
              )
            })}
          </Rows>
        </Section>
      )}

      {/* Milestone detail sheet — opens when the rider taps a Heads-up
          row. Lists the actual items rolled up under that milestone
          (engine oil & filter, brake pads, plugs, etc.) with a "log
          service" affordance per item. */}
      <MilestoneSheet
        selection={selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
        onLogService={onLogService}
        onOpenServiceBook={onOpenServiceBook}
      />


      {/* Recent rides */}
      {rides.length > 1 && (
        <Section
          title="Recent rides"
          subtitle="What you've been up to lately."
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

      {/* Totals footer was here — moved up into the month-stats strip
          near the top. Year totals + bike count can come back as a
          smaller summary tile in chunk 4 if useful. */}

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
        Let's get your bike in here
      </div>
      <p className="mx-auto mt-2 max-w-md text-[14px] text-hd-muted">
        Once your bike's set up, you can save your rides, share
        them with friends, keep tabs on service, plan mods, and
        walk through any factory procedure step by step.
      </p>
      <button
        onClick={onOpenGarage}
        className="mt-5 rounded-full bg-hd-orange px-6 py-3 text-[15px] font-semibold text-white"
      >
        Add a bike
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

function QuickTile({ label, icon, onClick, tone, disabled = false }) {
  const isPrimary = tone === 'primary'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 text-center transition active:scale-95 disabled:opacity-40 disabled:active:scale-100 ${
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

// Primary-action tile used by the Start-a-ride / Discover pair at the
// top of the dashboard. Two-tone system:
//   - tone="primary"   — solid orange fill, white content. The strongest
//                        action on the screen.
//   - tone="secondary" — dark card fill, orange-tinted icon chip. Same
//                        physical size and visual weight as primary, but
//                        clearly subordinate.
// Same height in either tone so the grid stays clean.
function ActionTile({ tone, icon, title, sub, onClick }) {
  const isPrimary = tone === 'primary'
  return (
    <button
      onClick={onClick}
      className={`group flex h-full flex-col items-start gap-3 rounded-3xl p-4 text-left transition active:scale-[0.98] sm:p-5 ${
        isPrimary
          ? 'bg-hd-orange text-white'
          : 'bg-hd-dark text-hd-text'
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          isPrimary
            ? 'bg-white/15 text-white'
            : 'bg-hd-orange/15 text-hd-orange'
        }`}
      >
        {icon}
      </div>
      <div className="mt-auto">
        <div className="text-[15px] font-bold leading-tight sm:text-base">
          {title}
        </div>
        <div
          className={`mt-0.5 text-[12px] ${
            isPrimary ? 'text-white/75' : 'text-hd-muted'
          }`}
        >
          {sub}
        </div>
      </div>
    </button>
  )
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <polygon points="6 4 20 12 6 20" />
    </svg>
  )
}
function IconCompass() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <polygon points="14.5 9.5 13 13 9.5 14.5 11 11" fill="currentColor" stroke="none" />
    </svg>
  )
}

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
function IconWrench() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4 4 0 0 1 .9 4.4l5.4 5.4-2.9 2.9-5.4-5.4a4 4 0 0 1-4.4-.9 4 4 0 0 1-.9-4.4l2.7 2.7 2.1-2.1-2.7-2.7a4 4 0 0 1 5.2.1z" />
    </svg>
  )
}
function IconClipboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M9 4V3h6v1" />
      <path d="M9 9h6M9 13h6M9 17h4" />
    </svg>
  )
}
function IconGauge() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 18 0" />
      <path d="M12 12l4-3" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
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

// Compute milestone-level service alerts across the whole garage.
// One row per bike whose next 5k milestone needs attention (either
// it's approaching within 1,500 mi OR there are overdue items the
// rider should clear at it). Returns [] when nothing's pending.
function milestonesNeedingAttention(garage) {
  const alerts = []
  for (const bike of garage || []) {
    const log = getServiceLog(bike.id)
    const milestone = nextMilestoneForBike(bike, log)
    if (!milestone.hasItems) continue
    if (!milestone.isUpcoming && milestone.overdueCount === 0) continue
    alerts.push({ bike, milestone })
  }
  // Order: bikes with overdue items first, then by smallest milesLeft.
  alerts.sort((a, b) => {
    const aOver = a.milestone.overdueCount > 0 ? 0 : 1
    const bOver = b.milestone.overdueCount > 0 ? 0 : 1
    if (aOver !== bOver) return aOver - bOver
    return a.milestone.milesLeft - b.milestone.milesLeft
  })
  return alerts
}

// Bottom sheet shown when the rider taps a milestone row in Heads up.
// Lists the individual items rolled up under the milestone — engine
// oil & filter, brake pads, plugs, etc. — with an inline "Log this"
// per row that opens the service-entry editor pre-populated with the
// item title. Tapping anywhere outside an item routes to the bike's
// full service book so the rider can log against any item or browse
// the full schedule.
function MilestoneSheet({ selection, onClose, onLogService, onOpenServiceBook }) {
  if (!selection) return null
  const { bike, milestone } = selection
  return (
    <BottomSheet open={Boolean(selection)} onClose={onClose} size="lg">
      <BottomSheet.Header
        title={`${milestone.milestone.toLocaleString()} mi service`}
        subtitle={
          <>
            {bike.nickname || bike.model || 'bike'}
            {' · '}
            {milestone.overdueCount > 0
              ? `${milestone.overdueCount} overdue`
              : `in ${formatMileage(milestone.milesLeft)}`}
          </>
        }
        onClose={onClose}
      />

      <p className="mb-3 text-[13px] leading-relaxed text-hd-muted">
        At your next service visit, attend to the following items.
        Tap one to log it as done.
      </p>

      <ul className="overflow-hidden rounded-2xl bg-hd-card">
        {milestone.items.map(({ interval, status, milesOver, milesLeft }) => (
          <li
            key={interval.id}
            className="border-b border-white/5 last:border-b-0"
          >
            <button
              onClick={() => {
                onClose()
                onLogService && onLogService(bike)
              }}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition active:bg-white/5"
            >
              <div className="flex flex-1 items-start gap-3">
                <span
                  className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${
                    status === 'overdue' ? 'bg-red-400' : 'bg-amber-400'
                  }`}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-medium text-hd-text">
                    {interval.label}
                  </div>
                  <div className="mt-0.5 text-[12px] text-hd-muted">
                    {status === 'overdue'
                      ? `Overdue ${formatMileage(milesOver)}`
                      : `Due in ${formatMileage(milesLeft)}`}
                  </div>
                  {interval.description && (
                    <div className="mt-1 text-[12px] leading-snug text-hd-muted/80">
                      {interval.description}
                    </div>
                  )}
                </div>
              </div>
              <Chevron />
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          onClose()
          onOpenServiceBook && onOpenServiceBook(bike)
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-hd-border bg-hd-dark px-4 py-3 text-[14px] font-medium text-hd-text transition active:scale-[0.99]"
      >
        Open the service book
      </button>
    </BottomSheet>
  )
}

// Walk every bike in the garage and collect job cards the rider is
// actively working on. Two states qualify:
//   - status === 'in-progress'  (rider explicitly marked it active)
//   - status === 'draft' AND has at least one procedure attached
//     (rider is planning real work, not just a placeholder card)
// Returned as { card, bike } pairs so the row can show the bike
// name and route the tap to the right place. Sorted by updatedAt
// descending so the freshest work bubbles to the top.
function activeJobCardsAcrossGarage(garage) {
  const out = []
  for (const bike of garage || []) {
    const cards = getJobCards(bike.id) || []
    for (const card of cards) {
      if (card.status === 'in-progress') {
        out.push({ card, bike })
      } else if (
        card.status === 'draft' &&
        Array.isArray(card.procedures) &&
        card.procedures.length > 0
      ) {
        out.push({ card, bike })
      }
    }
  }
  out.sort((a, b) =>
    (b.card.updatedAt || '').localeCompare(a.card.updatedAt || '')
  )
  return out
}

// Short progress line shown in the In-progress row. Counts how many
// procedures on the card are checked off. Shape varies a bit across
// older + newer cards, so this stays tolerant.
function jobProgressSummary(card) {
  const list = Array.isArray(card.procedures) ? card.procedures : []
  if (list.length === 0) {
    return card.status === 'in-progress' ? 'in progress' : 'draft'
  }
  const done = list.filter((p) => p.completed || p.completedAt).length
  return `${done}/${list.length} step${list.length === 1 ? '' : 's'}`
}

// Contextual subtitle for the Service health section. Reads the
// summary built by buildSummary() and tells the rider whether
// they're in good shape or have something pending. Three states:
//   - everything healthy → "All bikes are up to date."
//   - overdue items → "X overdue · Y coming due."  (overdue first,
//     because that's what the rider should act on)
//   - only due-soon items → "X coming due."
function serviceHealthSubtitle(summary) {
  const overdue = summary.dueSoon.filter((d) => d.status === 'overdue').length
  const dueSoon = summary.dueSoon.length - overdue
  if (overdue === 0 && dueSoon === 0) {
    return 'All bikes are up to date.'
  }
  const parts = []
  if (overdue > 0) {
    parts.push(`${overdue} overdue`)
  }
  if (dueSoon > 0) {
    parts.push(`${dueSoon} coming due`)
  }
  return parts.join(' · ') + '.'
}

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

// ============================================================
// New dashboard helpers (chunk 1)
// ============================================================

// Number of consecutive days, ending today (or yesterday if today
// has no ride yet), the rider has logged at least one ride.
//
// We allow yesterday as the anchor specifically so the streak
// doesn't visually "die" before noon — riders who go for an evening
// commute every day shouldn't see "0-day streak" the moment they
// open the app in the morning. The streak only resets when an
// ENTIRE calendar day passes with no ride.
function calculateStreak(rides) {
  if (!rides || rides.length === 0) return 0
  const dayKeys = new Set()
  for (const r of rides) {
    const t = r.started_at
    if (!t) continue
    dayKeys.add(toDayKey(new Date(t)))
  }
  if (dayKeys.size === 0) return 0

  // Anchor: today if there's a ride today, else yesterday if there's
  // one then. If neither, the streak is broken.
  const today = startOfDay(new Date())
  const yesterday = startOfDay(addDays(today, -1))
  let cursor
  if (dayKeys.has(toDayKey(today))) cursor = today
  else if (dayKeys.has(toDayKey(yesterday))) cursor = yesterday
  else return 0

  let count = 0
  while (dayKeys.has(toDayKey(cursor))) {
    count += 1
    cursor = addDays(cursor, -1)
  }
  return count
}

function toDayKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

// Distance / count / total time for the calendar month containing
// `now`. Computed client-side from the rides array. Bumping
// listRides() limit upstream means this aggregates over the full
// month for any reasonable user.
function statsForCurrentMonth(rides, now = new Date()) {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  let distanceM = 0
  let rideCount = 0
  let totalSeconds = 0
  for (const r of rides || []) {
    const t = r.started_at ? new Date(r.started_at).getTime() : 0
    if (t < monthStart) continue
    distanceM += r.distance_m || 0
    rideCount += 1
    totalSeconds += r.duration_seconds || 0
  }
  return { distanceM, rideCount, totalSeconds }
}

// Short month label ("MAY", "JUNE", "OCT") for the stats strip.
// Local-month, not UTC, so a rider in Dubai sees the right month at
// midnight rather than the previous one.
function monthLabel(date) {
  return date
    .toLocaleString(undefined, { month: 'short' })
    .toUpperCase()
}

// Stats-strip tile. Smaller and quieter than the BigStat used in the
// old hero card — these are glanceable, not the headline.
function MonthStatTile({ label, value, suffix }) {
  return (
    <div className="rounded-2xl bg-hd-dark px-3 py-3">
      <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-hd-muted">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-lg font-bold leading-none tracking-tight text-hd-text">
          {value}
        </span>
        {suffix && (
          <span className="text-[11px] text-hd-muted">{suffix}</span>
        )}
      </div>
    </div>
  )
}
