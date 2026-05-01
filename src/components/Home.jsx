import React, { useEffect, useMemo, useState } from 'react'
import { useUser } from '../auth/AuthProvider.jsx'
import {
  getGarage,
  getServiceLog,
  getMods,
  subscribe,
  isInitialPullPending
} from '../data/storage.js'
import { intervals, evaluateInterval, findLastMatchingEntry } from '../data/serviceIntervals.js'
import SearchBar from './SearchBar.jsx'

// Signed-in dashboard. Replaces the old "About this app" home page
// with an at-a-glance summary of the user's actual data.
//
// Sections:
//   1. Welcome line — uses the Clerk first-name if available
//   2. Search — quick jump into a job by keyword
//   3. Three stat cards — bikes, due-soon, recent activity
//   4. Quick actions — three big buttons
//
// The dashboard cards are computed cheaply from local cache (getGarage,
// getServiceLog) so this renders instantly even when offline.
export default function Home({ onOpenGarage, onOpenManual, onOpenIntervals, onPickJob, onOpenServiceBook }) {
  const { user } = useUser()
  const firstName = user?.firstName || 'rider'

  // Re-render whenever the storage layer notifies us (pulls, writes,
  // sign-in user changes). Without this the dashboard captures the
  // empty cache at first paint and never updates until you navigate.
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const unsub = subscribe(() => setTick((t) => t + 1))
    return unsub
  }, [])

  // True until the very first server pull settles. Lets us show
  // "Loading your garage…" instead of "0 bikes" on a fresh sign-in.
  const [pullPending, setPullPending] = useState(() => isInitialPullPending())
  useEffect(() => {
    setPullPending(isInitialPullPending())
  }, [tick])

  // tick is intentionally a dep so the memos rebuild on every notify().
  const garage = useMemo(() => getGarage(), [tick])
  const summary = useMemo(() => buildSummary(garage), [garage])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            Dashboard
          </div>
          <h1 className="mt-1 font-display text-3xl tracking-wider sm:text-4xl">
            HEY, {firstName.toUpperCase()}.
          </h1>
          <p className="mt-1 text-sm text-hd-muted">
            {pullPending
              ? 'Loading your garage…'
              : garage.length === 0
              ? 'Add your first bike to get rolling.'
              : `${garage.length} bike${garage.length > 1 ? 's' : ''} in the garage. Here's what's up.`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <SearchBar onPickJob={onPickJob} />
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          kicker="Garage"
          headline={
            pullPending
              ? '…'
              : garage.length === 0
              ? 'No bikes yet'
              : `${garage.length} bike${garage.length > 1 ? 's' : ''}`
          }
          sub={
            pullPending
              ? 'Loading…'
              : garage.length === 0
              ? 'Tap to add your first bike.'
              : garage
                  .slice(0, 3)
                  .map((b) => b.nickname || b.model || `${b.year || ''} bike`)
                  .filter(Boolean)
                  .join(' · ')
          }
          onClick={onOpenGarage}
        />
        <StatCard
          kicker="Due soon"
          tone={summary.dueSoon.length > 0 ? 'warn' : 'ok'}
          headline={
            pullPending
              ? '…'
              : summary.dueSoon.length === 0
              ? 'Nothing due'
              : `${summary.dueSoon.length} item${summary.dueSoon.length > 1 ? 's' : ''}`
          }
          sub={
            pullPending
              ? 'Loading…'
              : summary.dueSoon.length === 0
              ? 'Service intervals all green for now.'
              : summary.dueSoon
                  .slice(0, 2)
                  .map(
                    (d) =>
                      `${d.intervalLabel} on ${d.bikeName} ${
                        d.status === 'overdue'
                          ? `(overdue ${d.milesOver.toLocaleString()} mi)`
                          : `(in ${d.milesLeft.toLocaleString()} mi)`
                      }`
                  )
                  .join(' · ')
          }
          onClick={onOpenIntervals || onOpenGarage}
        />
        <StatCard
          kicker="Recent"
          headline={
            pullPending
              ? '…'
              : summary.recent
              ? formatTimeAgo(summary.recent.date)
              : 'No activity yet'
          }
          sub={
            pullPending
              ? 'Loading…'
              : summary.recent
              ? `${summary.recent.title || 'Service'} on ${summary.recent.bikeName}`
              : 'Your service entries will show up here.'
          }
          onClick={
            summary.recent && onOpenServiceBook
              ? () => onOpenServiceBook(summary.recent.bike)
              : onOpenGarage
          }
        />
      </div>

      {/* Quick actions */}
      <div>
        <div className="mb-3 text-xs uppercase tracking-widest text-hd-muted">
          Quick actions
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <QuickAction
            title="Open garage"
            sub="See and edit your bikes"
            onClick={onOpenGarage}
          />
          <QuickAction
            title="Browse manual"
            sub="Procedures, torque, tools"
            onClick={onOpenManual}
            primary
          />
          <QuickAction
            title="HD intervals"
            sub="Reference schedule"
            onClick={onOpenIntervals}
          />
        </div>
      </div>

    </div>
  )
}

// ---------- Bits ----------

function StatCard({ kicker, headline, sub, tone, onClick }) {
  // tone: 'warn' tints the kicker red, 'ok' is default muted.
  const kickerCls =
    tone === 'warn'
      ? 'text-hd-orange'
      : 'text-hd-muted'
  return (
    <button
      onClick={onClick}
      className="group rounded-md border border-hd-border bg-hd-dark p-4 text-left transition hover:border-hd-orange"
    >
      <div className={`text-xs uppercase tracking-widest ${kickerCls}`}>
        {kicker}
      </div>
      <div className="mt-2 font-display text-2xl tracking-wider text-hd-text">
        {headline}
      </div>
      <div className="mt-2 line-clamp-2 text-xs text-hd-muted">{sub}</div>
      <div className="mt-3 text-xs text-hd-muted opacity-60 transition group-hover:opacity-100 group-hover:text-hd-orange">
        Open →
      </div>
    </button>
  )
}

function QuickAction({ title, sub, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border p-4 text-left transition ${
        primary
          ? 'border-hd-orange bg-hd-orange/10 hover:bg-hd-orange/15'
          : 'border-hd-border bg-hd-dark hover:border-hd-orange'
      }`}
    >
      <div
        className={`font-display text-xl tracking-wider ${
          primary ? 'text-hd-orange' : 'text-hd-text'
        }`}
      >
        {title.toUpperCase()}
      </div>
      <div className="mt-1 text-xs text-hd-muted">{sub}</div>
    </button>
  )
}

// ---------- Summary helpers ----------

// Build the dashboard summary across all bikes. Cheap — runs once
// per render and against the local cache.
function buildSummary(garage) {
  let mostRecent = null
  const dueSoon = []
  for (const bike of garage) {
    const log = getServiceLog(bike.id)
    // Track most-recent service entry across all bikes
    for (const e of log) {
      if (!mostRecent || (e.date || '') > (mostRecent.date || '')) {
        mostRecent = {
          ...e,
          bike,
          bikeName: bike.nickname || bike.model || `${bike.year || ''} bike`
        }
      }
    }
    // Evaluate every HD interval for this bike's current mileage
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
  // Sort due-soon: overdue first (descending miles over), then due-soon
  // ascending miles left.
  dueSoon.sort((a, b) => {
    if (a.status === 'overdue' && b.status !== 'overdue') return -1
    if (b.status === 'overdue' && a.status !== 'overdue') return 1
    if (a.status === 'overdue') return (b.milesOver || 0) - (a.milesOver || 0)
    return (a.milesLeft || 0) - (b.milesLeft || 0)
  })
  return { dueSoon, recent: mostRecent }
}

// Render a date string like "2025-12-30" as "3 days ago" / "today".
function formatTimeAgo(iso) {
  if (!iso) return ''
  const then = new Date(iso)
  if (Number.isNaN(then.getTime())) return iso
  const now = new Date()
  const ms = now.getTime() - then.getTime()
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} wk ago`
  if (days < 365) return `${Math.floor(days / 30)} mo ago`
  return `${Math.floor(days / 365)} yr ago`
}
