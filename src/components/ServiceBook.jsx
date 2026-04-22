import React, { useEffect, useMemo, useState } from 'react'
import {
  getServiceLog,
  logService,
  removeServiceEntry,
  updateBikeMileage,
  getBike,
  subscribe
} from '../data/storage.js'
import {
  intervals,
  evaluateInterval,
  findLastMatchingEntry
} from '../data/serviceIntervals.js'
import { exportServiceBookPDF } from '../data/pdfExport.js'

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

  const [tab, setTab] = useState('log')
  const [adding, setAdding] = useState(false)
  const [editingMileage, setEditingMileage] = useState(false)

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
          <button
            onClick={() => exportServiceBookPDF({ bike, log })}
            className="mt-3 inline-flex items-center gap-2 rounded border border-hd-border bg-hd-dark px-3 py-1.5 text-xs text-hd-text hover:border-hd-orange hover:text-hd-orange"
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
            Download PDF
          </button>
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
        />
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

      <div className="mt-10 rounded-md border border-hd-border bg-hd-dark p-4 text-xs text-hd-muted">
        Your service log lives only on this browser for now. Export/backup
        and cloud sync are on the roadmap.
      </div>
    </div>
  )
}

// ---------- Panels ----------

function LogPanel({ log, onAdd, onRemove }) {
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={onAdd}
          className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-hd-black hover:brightness-110"
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
        className="rounded bg-hd-orange px-3 py-1.5 text-xs font-semibold text-hd-black hover:brightness-110"
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
    cost: ''
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
            className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-hd-black hover:brightness-110"
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
