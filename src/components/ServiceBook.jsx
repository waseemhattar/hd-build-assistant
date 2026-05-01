import React, { useEffect, useMemo, useState } from 'react'
import {
  getServiceLog,
  logService,
  removeServiceEntry,
  updateServiceEntry,
  updateBikeMileage,
  getBike,
  subscribe,
  getMods,
  addMod,
  updateMod,
  removeMod,
  getModsTotalCost
} from '../data/storage.js'
import {
  intervals,
  evaluateInterval,
  findLastMatchingEntry
} from '../data/serviceIntervals.js'
import { exportServiceBookPDF, exportBikeReportPDF } from '../data/pdfExport.js'
import {
  MOD_CATEGORY_GROUPS,
  MOD_STATUSES,
  CATEGORY_TO_GROUP
} from '../data/modCategories.js'
import RideHistory from './RideHistory.jsx'

// ServiceBook = per-bike service history + HD-interval reference panel.
// Two tabs:
//   - Log: chronological service history, add new entries
//   - Intervals: HD's recommended schedule shown as a soft reference
//
// Members never get blocked by the schedule — it's there to answer
// "when did I last do X and what's HD's suggestion for next time?"

export default function ServiceBook({ bike: initialBike, onBack }) {
  // Bike may be mutated (mileage bump after logging service), so we
  // pull the latest from storage each refresh.
  const [bikeId] = useState(initialBike.id)
  const [refreshKey, setRefreshKey] = useState(0)
  const bike = useMemo(() => getBike(bikeId) || initialBike, [bikeId, refreshKey])
  const log = useMemo(() => getServiceLog(bikeId), [bikeId, refreshKey])
  const mods = useMemo(() => getMods(bikeId), [bikeId, refreshKey])

  const [tab, setTab] = useState('log')
  const [adding, setAdding] = useState(false)
  const [editingMileage, setEditingMileage] = useState(false)
  // Mod add/edit modal: null = closed, { mod: null } = new, { mod: existing } = edit
  const [modEditing, setModEditing] = useState(null)

  function refresh() {
    setRefreshKey((k) => k + 1)
  }

  // Re-render when the background pull from Supabase refreshes the cache
  // (eg. service entries logged on another device).
  useEffect(() => {
    const unsub = subscribe(() => setRefreshKey((k) => k + 1))
    return unsub
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
      >
        ← Back to garage
      </button>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            Service Book
          </div>
          <h1 className="mt-1 font-display text-3xl tracking-wider sm:text-4xl">
            {bike.nickname || bike.model || `${bike.year} ${bike.model}`}
          </h1>
          <div className="mt-1 text-sm text-hd-muted">
            {bike.year} · {bike.model}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => exportServiceBookPDF({ bike, log })}
              className="inline-flex items-center gap-2 rounded border border-hd-border bg-hd-dark px-3 py-1.5 text-xs text-hd-text hover:border-hd-orange hover:text-hd-orange"
              title="Download a printable service record"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12" />
                <path d="M7 10l5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              Service Book
            </button>
            <button
              onClick={() => exportBikeReportPDF({ bike, log, mods })}
              className="inline-flex items-center gap-2 rounded border border-hd-orange bg-hd-orange/10 px-3 py-1.5 text-xs text-hd-orange hover:bg-hd-orange hover:text-white"
              title="Full bike report: specs, build, service, totals"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12" />
                <path d="M7 10l5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              Bike Report
            </button>
          </div>
        </div>
        <div className="rounded border border-hd-border bg-hd-dark p-3">
          <div className="text-xs uppercase tracking-widest text-hd-muted">
            Current mileage
          </div>
          {!editingMileage ? (
            <div className="flex items-center gap-3">
              <div className="font-display text-3xl tracking-wider text-hd-orange">
                {(bike.mileage || 0).toLocaleString()}
              </div>
              <button
                onClick={() => setEditingMileage(true)}
                className="text-xs text-hd-muted hover:text-hd-orange"
              >
                Update
              </button>
            </div>
          ) : (
            <MileageEditor
              initial={bike.mileage || 0}
              onCancel={() => setEditingMileage(false)}
              onSave={(m) => {
                updateBikeMileage(bikeId, m)
                setEditingMileage(false)
                refresh()
              }}
            />
          )}
        </div>
      </div>

      <nav className="mb-4 flex flex-wrap gap-1 border-b border-hd-border">
        {[
          { id: 'log', label: `Service log (${log.length})` },
          { id: 'build', label: `Build / Mods (${mods.length})` },
          { id: 'rides', label: `Rides` },
          { id: 'intervals', label: `HD intervals (reference)` }
        ].map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm transition ${
                active
                  ? 'border-hd-orange text-hd-orange font-semibold'
                  : 'border-transparent text-hd-muted hover:text-hd-text'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </nav>

      {tab === 'log' && (
        <LogPanel
          log={log}
          onAdd={() => setAdding(true)}
          onRemove={(id) => {
            removeServiceEntry(id)
            refresh()
          }}
          onTogglePublic={(id, next) => {
            updateServiceEntry(id, { isPublic: next })
            refresh()
          }}
        />
      )}

      {tab === 'build' && (
        <BuildPanel
          mods={mods}
          onAdd={() => setModEditing({ mod: null })}
          onEdit={(mod) => setModEditing({ mod })}
          onRemove={(id) => {
            if (confirm('Remove this mod?')) {
              removeMod(id)
              refresh()
            }
          }}
          onTogglePublic={(id, next) => {
            updateMod(id, { isPublic: next })
            refresh()
          }}
          bikeId={bikeId}
        />
      )}

      {tab === 'rides' && (
        <RidesPanel bike={bike} />
      )}

      {tab === 'intervals' && (
        <IntervalsPanel
          currentMileage={bike.mileage || 0}
          log={log}
          onLogInterval={(interval) => setAdding({ fromInterval: interval })}
        />
      )}

      {adding && (
        <EntryEditor
          bike={bike}
          prefill={adding.fromInterval ? { title: adding.fromInterval.label } : null}
          onCancel={() => setAdding(false)}
          onSave={(data) => {
            logService(bikeId, data)
            setAdding(false)
            refresh()
          }}
        />
      )}

      {modEditing && (
        <ModEditor
          bike={bike}
          mod={modEditing.mod}
          onCancel={() => setModEditing(null)}
          onSave={({ data, alsoLogService }) => {
            if (modEditing.mod) {
              updateMod(modEditing.mod.id, data, { alsoLogService })
            } else {
              addMod(bikeId, data, { alsoLogService })
            }
            setModEditing(null)
            refresh()
          }}
        />
      )}

      <div className="mt-10 rounded-md border border-hd-border bg-hd-dark p-4 text-xs text-hd-muted">
        Your service log lives only on this browser for now. Export/backup
        and cloud sync are on the roadmap.
      </div>
    </div>
  )
}

// ---------- Panels ----------

function LogPanel({ log, onAdd, onRemove, onTogglePublic }) {
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={onAdd}
          className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Log service
        </button>
      </div>

      {log.length === 0 ? (
        <div className="card text-center">
          <div className="mb-2 font-display text-xl tracking-wider">
            No entries yet.
          </div>
          <p className="text-sm text-hd-muted">
            Log your first service — oil change, tire swap, mod, anything.
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {log.map((e) => (
            <li key={e.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg tracking-wider">
                      {e.title || 'Service'}
                    </span>
                    <span className="chip">{e.date}</span>
                    <span className="text-xs text-hd-orange">
                      @ {(e.mileage || 0).toLocaleString()} mi
                    </span>
                  </div>
                  {e.notes && (
                    <div className="mt-2 whitespace-pre-wrap text-sm text-hd-text">
                      {e.notes}
                    </div>
                  )}
                  {e.parts && (
                    <div className="mt-2 text-xs text-hd-muted">
                      <span className="uppercase tracking-widest">Parts:</span>{' '}
                      {e.parts}
                    </div>
                  )}
                  {e.cost != null && (
                    <div className="mt-1 text-xs text-hd-muted">
                      <span className="uppercase tracking-widest">Cost:</span>{' '}
                      ${e.cost.toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <PublicToggle
                    isPublic={e.isPublic !== false}
                    onChange={(next) => onTogglePublic(e.id, next)}
                  />
                  <button
                    onClick={() => {
                      if (confirm('Remove this service entry?')) onRemove(e.id)
                    }}
                    className="text-xs text-hd-muted hover:text-red-400"
                    title="Remove entry"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function IntervalsPanel({ currentMileage, log, onLogInterval }) {
  const evaluated = intervals.map((i) => {
    const last = findLastMatchingEntry(i, log)
    return { interval: i, last, ...evaluateInterval(i, currentMileage, last) }
  })

  // Sort: overdue first, then due-soon, then ok, then never-due.
  const order = { overdue: 0, 'due-soon': 1, ok: 2, 'never-due': 3 }
  evaluated.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9))

  return (
    <div>
      <div className="mb-4 rounded-md border border-hd-border bg-hd-dark/60 p-3 text-xs text-hd-muted">
        <strong className="text-hd-text">Reference only.</strong> Harley's
        recommended intervals are a starting point — how you actually ride
        (hot climate, short trips, heavy loads) matters more than the
        number on the page. Use this panel to see what's coming up.
      </div>

      <div className="space-y-2">
        {evaluated.map(({ interval, last, status, dueAt, milesLeft, milesOver }) => (
          <div
            key={interval.id}
            className={`card flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between ${
              status === 'overdue'
                ? 'border-red-500/50'
                : status === 'due-soon'
                ? 'border-amber-500/50'
                : ''
            }`}
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={status} />
                <span className="font-display text-lg tracking-wider">
                  {interval.label}
                </span>
              </div>
              <div className="mt-1 text-xs text-hd-muted">
                {interval.description}
              </div>
              <div className="mt-1 text-xs text-hd-muted">
                {last ? (
                  <>
                    Last logged:{' '}
                    <span className="text-hd-text">
                      {(last.mileage || 0).toLocaleString()} mi
                    </span>{' '}
                    ({last.date})
                  </>
                ) : (
                  <>Not yet logged on this bike.</>
                )}
              </div>
              <div className="mt-1 text-xs">
                {status === 'overdue' && (
                  <span className="text-red-400">
                    Overdue by {milesOver.toLocaleString()} mi (HD suggested {dueAt.toLocaleString()})
                  </span>
                )}
                {status === 'due-soon' && (
                  <span className="text-amber-300">
                    Due in {milesLeft.toLocaleString()} mi (at {dueAt.toLocaleString()})
                  </span>
                )}
                {status === 'ok' && dueAt && (
                  <span className="text-hd-muted">
                    Next suggested at {dueAt.toLocaleString()} mi
                  </span>
                )}
                {status === 'never-due' && (
                  <span className="text-hd-muted">One-time — already done.</span>
                )}
              </div>
            </div>
            <button
              onClick={() => onLogInterval(interval)}
              className="rounded border border-hd-border bg-hd-dark px-3 py-1.5 text-xs text-hd-text hover:border-hd-orange"
            >
              Log this
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Per-bike Rides panel — read-only list of rides for THIS bike.
//
// Starting a new ride happens from the global Rides nav (top-level
// page) so the user can pick a bike at start. Here we just show the
// history scoped to one bike, with the same expand-inline-map UX as
// the global page.
function RidesPanel({ bike }) {
  // Pass the single bike so RideHistory can show "bike: <nickname>"
  // labels — even though we already know it, the row formatter is
  // shared with the global view and reads from the garage list.
  return (
    <div>
      <div className="mb-4 rounded-md border border-hd-border bg-hd-dark/60 p-3 text-xs text-hd-muted">
        GPS-tracked rides on <span className="text-hd-text">{bike.nickname || bike.model || `${bike.year} ${bike.model}`}</span>.
        Start a new ride from the <span className="text-hd-text">Rides</span> tab in the top nav.
      </div>
      <RideHistory bikeId={bike.id} garage={[bike]} />
    </div>
  )
}

function StatusPill({ status }) {
  const map = {
    overdue: { label: 'Overdue', cls: 'bg-red-500/20 text-red-300 border-red-500/40' },
    'due-soon': { label: 'Due soon', cls: 'bg-amber-500/20 text-amber-200 border-amber-500/40' },
    ok: { label: 'OK', cls: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
    'never-due': { label: 'Done', cls: 'bg-hd-dark text-hd-muted border-hd-border' }
  }
  const s = map[status] || map.ok
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${s.cls}`}
    >
      {s.label}
    </span>
  )
}

// ---------- Editors ----------

function MileageEditor({ initial, onCancel, onSave }) {
  const [v, setV] = useState(initial)
  return (
    <div className="mt-1 flex items-center gap-2">
      <input
        type="number"
        value={v}
        onChange={(e) => setV(e.target.value)}
        className="input w-28 text-right"
        min={0}
      />
      <button
        onClick={() => onSave(Number(v) || 0)}
        className="rounded bg-hd-orange px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="text-xs text-hd-muted hover:text-hd-orange"
      >
        Cancel
      </button>
    </div>
  )
}

export function EntryEditor({ bike, prefill, onCancel, onSave }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState(() => ({
    title: prefill?.title || '',
    jobId: prefill?.jobId || '',
    mileage: bike?.mileage ?? '',
    date: today,
    notes: prefill?.notes || '',
    parts: '',
    cost: '',
    // Default new entries to public so they show up on the public bike page.
    isPublic: true
  }))

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
      onClick={onCancel}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-md border border-hd-border bg-hd-dark p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wider text-hd-orange">
            LOG SERVICE
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-2xl leading-none text-hd-muted hover:text-hd-orange"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="What was done?" wide>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="e.g. Oil & filter change"
              required
            />
          </Field>
          <Field label="Mileage at service">
            <input
              type="number"
              value={form.mileage}
              onChange={(e) => setForm({ ...form, mileage: e.target.value })}
              className="input"
              min={0}
              required
            />
          </Field>
          <Field label="Date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input"
              required
            />
          </Field>
          <Field label="Parts used (optional)" wide>
            <input
              type="text"
              value={form.parts}
              onChange={(e) => setForm({ ...form, parts: e.target.value })}
              className="input"
              placeholder="e.g. HD 63798-99 filter, 4 qt Syn3 20W50"
            />
          </Field>
          <Field label="Cost (optional)">
            <input
              type="number"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              className="input"
              min={0}
              step="0.01"
              placeholder="0.00"
            />
          </Field>
          <Field label="Notes (optional)" wide>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input min-h-[80px]"
              placeholder="How did it go? Anything unusual?"
            />
          </Field>
        </div>

        <label className="mt-4 flex items-start gap-2 text-xs text-hd-muted">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
            className="mt-0.5"
          />
          <span>
            Show this entry on my public bike page (only matters when the
            bike itself is published).
          </span>
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-hd-border bg-hd-dark px-4 py-2 text-sm text-hd-muted hover:border-hd-orange hover:text-hd-text"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            Save entry
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, wide, children }) {
  return (
    <label className={`block text-sm ${wide ? 'sm:col-span-2' : ''}`}>
      <div className="mb-1 text-xs uppercase tracking-widest text-hd-muted">
        {label}
      </div>
      {children}
    </label>
  )
}

// ---------- Build / Mods ----------

function BuildPanel({ mods, onAdd, onEdit, onRemove, onTogglePublic, bikeId }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const filtered = useMemo(
    () =>
      statusFilter === 'all'
        ? mods
        : mods.filter((m) => m.status === statusFilter),
    [mods, statusFilter]
  )

  // Group by category group for display
  const grouped = useMemo(() => {
    const byGroup = new Map()
    for (const m of filtered) {
      const g = CATEGORY_TO_GROUP[m.category] || 'Other'
      if (!byGroup.has(g)) byGroup.set(g, [])
      byGroup.get(g).push(m)
    }
    // Order groups the same way MOD_CATEGORY_GROUPS defines them
    const order = MOD_CATEGORY_GROUPS.map((g) => g.group)
    return order
      .filter((g) => byGroup.has(g))
      .map((g) => ({ group: g, items: byGroup.get(g) }))
  }, [filtered])

  const totalInstalled = getModsTotalCost(bikeId, { onlyInstalled: true })
  const totalAll = getModsTotalCost(bikeId)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {['all', 'planned', 'installed', 'removed'].map((s) => {
            const active = statusFilter === s
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded border px-3 py-1 text-xs uppercase tracking-widest transition ${
                  active
                    ? 'border-hd-orange bg-hd-orange/10 text-hd-orange'
                    : 'border-hd-border bg-hd-dark text-hd-muted hover:text-hd-text'
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
        <button
          onClick={onAdd}
          className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Add mod
        </button>
      </div>

      {mods.length === 0 ? (
        <div className="card text-center">
          <div className="mb-2 font-display text-xl tracking-wider">
            No mods logged yet.
          </div>
          <p className="text-sm text-hd-muted">
            Track OEM and aftermarket parts — plan what you want, log what
            you install, and keep the cost running.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ group, items }) => (
            <section key={group}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-hd-muted">
                {group}
              </div>
              <ul className="space-y-2">
                {items.map((m) => (
                  <li key={m.id} className="card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-lg tracking-wider">
                            {m.title || m.category || 'Mod'}
                          </span>
                          <ModStatusPill status={m.status} />
                          {m.category && (
                            <span className="chip">{m.category}</span>
                          )}
                          {m.brand && (
                            <span className="text-xs text-hd-orange">
                              {m.brand}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-hd-muted">
                          {m.partNumber && <span>PN: {m.partNumber}</span>}
                          {m.vendor && <span>Vendor: {m.vendor}</span>}
                          {m.installDate && (
                            <span>Installed: {m.installDate}</span>
                          )}
                          {m.installMileage != null && (
                            <span>
                              @ {m.installMileage.toLocaleString()} mi
                            </span>
                          )}
                          {m.cost != null && (
                            <span className="text-hd-text">
                              ${Number(m.cost).toFixed(2)}
                            </span>
                          )}
                        </div>
                        {m.notes && (
                          <div className="mt-2 whitespace-pre-wrap text-sm text-hd-text">
                            {m.notes}
                          </div>
                        )}
                        {m.sourceUrl && (
                          <a
                            href={m.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block text-xs text-hd-muted underline hover:text-hd-orange"
                          >
                            Source link
                          </a>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <PublicToggle
                          isPublic={m.isPublic !== false}
                          onChange={(next) => onTogglePublic(m.id, next)}
                        />
                        <button
                          onClick={() => onEdit(m)}
                          className="text-xs text-hd-muted hover:text-hd-orange"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onRemove(m.id)}
                          className="text-xs text-hd-muted hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {mods.length > 0 && (
        <div className="mt-6 rounded-md border border-hd-border bg-hd-dark p-3 text-xs text-hd-muted">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <span className="uppercase tracking-widest">Installed total</span>{' '}
              <span className="ml-2 text-hd-text">
                ${totalInstalled.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="uppercase tracking-widest">All (incl. planned)</span>{' '}
              <span className="ml-2 text-hd-text">${totalAll.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ModStatusPill({ status }) {
  const map = {
    planned: {
      label: 'Planned',
      cls: 'bg-hd-dark text-hd-muted border-hd-border'
    },
    installed: {
      label: 'Installed',
      cls: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
    },
    removed: {
      label: 'Removed',
      cls: 'bg-red-500/10 text-red-300 border-red-500/30'
    }
  }
  const s = map[status] || map.planned
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${s.cls}`}
    >
      {s.label}
    </span>
  )
}

function ModEditor({ bike, mod, onCancel, onSave }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState(() => ({
    title: mod?.title || '',
    category: mod?.category || '',
    status: mod?.status || 'planned',
    brand: mod?.brand || '',
    partNumber: mod?.partNumber || '',
    vendor: mod?.vendor || '',
    sourceUrl: mod?.sourceUrl || '',
    cost: mod?.cost == null ? '' : String(mod.cost),
    installDate: mod?.installDate || (mod?.status === 'installed' ? today : ''),
    installMileage:
      mod?.installMileage == null
        ? bike?.mileage ?? ''
        : String(mod.installMileage),
    removeDate: mod?.removeDate || '',
    notes: mod?.notes || '',
    // Default new mods to public so they show up on the public bike page;
    // keep existing mods at whatever they're currently set to.
    isPublic: mod ? mod.isPublic !== false : true
  }))
  // Auto-log checkbox: default OFF (opt-in) as user specified.
  const [alsoLogService, setAlsoLogService] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim() && !form.category) return
    onSave({ data: form, alsoLogService })
  }

  const isNew = !mod
  // Only meaningful when a status flip to 'installed' is about to happen.
  const willFlipToInstalled =
    form.status === 'installed' && (!mod || mod.status !== 'installed')

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
      onClick={onCancel}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-md border border-hd-border bg-hd-dark p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wider text-hd-orange">
            {isNew ? 'ADD MOD' : 'EDIT MOD'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-2xl leading-none text-hd-muted hover:text-hd-orange"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title" wide>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="e.g. Stage 1 air cleaner"
              required
            />
          </Field>
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input"
              required
            >
              <option value="">— Pick a category —</option>
              {MOD_CATEGORY_GROUPS.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="input"
            >
              {MOD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Brand">
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="input"
              placeholder="e.g. Vance & Hines, S&S, HD"
            />
          </Field>
          <Field label="Part number">
            <input
              type="text"
              value={form.partNumber}
              onChange={(e) =>
                setForm({ ...form, partNumber: e.target.value })
              }
              className="input"
              placeholder="e.g. 46563-09"
            />
          </Field>
          <Field label="Vendor">
            <input
              type="text"
              value={form.vendor}
              onChange={(e) => setForm({ ...form, vendor: e.target.value })}
              className="input"
              placeholder="Where bought"
            />
          </Field>
          <Field label="Cost">
            <input
              type="number"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              className="input"
              min={0}
              step="0.01"
              placeholder="0.00"
            />
          </Field>
          <Field label="Source URL" wide>
            <input
              type="url"
              value={form.sourceUrl}
              onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
              className="input"
              placeholder="https://…"
            />
          </Field>
          <Field label="Install date">
            <input
              type="date"
              value={form.installDate}
              onChange={(e) =>
                setForm({ ...form, installDate: e.target.value })
              }
              className="input"
            />
          </Field>
          <Field label="Install mileage">
            <input
              type="number"
              value={form.installMileage}
              onChange={(e) =>
                setForm({ ...form, installMileage: e.target.value })
              }
              className="input"
              min={0}
            />
          </Field>
          {form.status === 'removed' && (
            <Field label="Remove date">
              <input
                type="date"
                value={form.removeDate}
                onChange={(e) =>
                  setForm({ ...form, removeDate: e.target.value })
                }
                className="input"
              />
            </Field>
          )}
          <Field label="Notes" wide>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input min-h-[80px]"
              placeholder="Tuning notes, install gotchas, torque specs…"
            />
          </Field>
        </div>

        <label className="mt-4 flex items-start gap-2 text-xs text-hd-muted">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
            className="mt-0.5"
          />
          <span>
            Show this mod on my public bike page (only matters when the bike
            itself is published).
          </span>
        </label>

        {willFlipToInstalled && (
          <label className="mt-3 flex items-start gap-2 text-xs text-hd-muted">
            <input
              type="checkbox"
              checked={alsoLogService}
              onChange={(e) => setAlsoLogService(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Also log as a service entry (captures this install in your
              Service Log and Bike Report).
            </span>
          </label>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-hd-border bg-hd-dark px-4 py-2 text-sm text-hd-muted hover:border-hd-orange hover:text-hd-text"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            {isNew ? 'Add mod' : 'Save mod'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ---------- Per-item Public toggle ----------
//
// Tiny inline pill that flips an item's is_public flag. Used in both the
// service log row and the mod row so each entry can be hidden from the
// public bike page individually (without un-publishing the whole bike).
function PublicToggle({ isPublic, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!isPublic)}
      title={
        isPublic
          ? 'Visible on your public bike page — click to hide'
          : 'Hidden from your public bike page — click to show'
      }
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest transition ${
        isPublic
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:brightness-125'
          : 'border-hd-border bg-hd-dark text-hd-muted hover:text-hd-text'
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          isPublic ? 'bg-emerald-400' : 'bg-hd-muted'
        }`}
      />
      {isPublic ? 'Public' : 'Private'}
    </button>
  )
}
