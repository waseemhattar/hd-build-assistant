import React, { useEffect, useMemo, useState } from 'react'
import { getCategoriesForBike } from '../data/procedures.js'
import {
  getGarage,
  subscribe as subscribeStorage,
  getJobCard,
  addProcedureToJobCard
} from '../data/storage.js'
import EmptyState from './ui/EmptyState.jsx'

// Procedure browser, v2.
//
// Always bike-scoped — the page is useless without knowing what bike
// you own, because procedure counts and applicability depend on the
// year/model. If the garage is empty we show a CTA to add a bike.
//
// Two screens layered into one component:
//
//   1. Category grid — top-level chapters from the matching manuals,
//      flattened and deduped so a 2020 Touring rider sees a clean
//      "Engine / Brakes / Electrical / …" grid instead of the raw
//      manual structure.
//
//   2. Procedure list — tap a category, see its procedures. Removal
//      and Installation are paired into one row — the detail page is
//      where the user picks which direction they want to walk through.
//
// We deliberately do NOT show the manual title or the "275 procedures"
// count anywhere. The rider doesn't care which manual the data came
// from; they care about what applies to their bike.

export default function ProcedureBrowser({
  bike: bikeProp,
  onBack,
  onSelectProcedure,
  // When set, the browser is in "add to job card" mode — tapping a
  // procedure adds it to the card instead of starting a walkthrough.
  // Caller is responsible for navigating back when done (we expose
  // onDoneAdding so the rider can finish whenever they want).
  addingToJobCardId = null,
  onDoneAdding
}) {
  // The Manual page can be reached without a bike already in scope
  // (e.g. tapping the Manual nav from anywhere). To make it work
  // standalone we read the garage ourselves and pick a sensible
  // default bike, while still respecting an explicit `bike` prop
  // when the caller provides one.
  const [garage, setGarage] = useState(() => getGarage())
  const [activeBikeId, setActiveBikeId] = useState(
    () => bikeProp?.id || getGarage()[0]?.id || null
  )

  // Keep `garage` in sync if the user adds/removes bikes elsewhere.
  useEffect(() => {
    const unsub = subscribeStorage(() => setGarage(getGarage()))
    return unsub
  }, [])

  // If a bike prop is passed in (because the user came from the
  // Garage screen for a specific bike), prefer that — but fall back
  // to the first garage bike otherwise.
  useEffect(() => {
    if (bikeProp?.id) {
      setActiveBikeId(bikeProp.id)
    } else if (!activeBikeId && garage[0]?.id) {
      setActiveBikeId(garage[0].id)
    } else if (activeBikeId && !garage.find((b) => b.id === activeBikeId)) {
      // The previously-active bike was removed — fall back.
      setActiveBikeId(garage[0]?.id || null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bikeProp?.id, garage])

  const bike = useMemo(
    () => garage.find((b) => b.id === activeBikeId) || bikeProp || null,
    [garage, activeBikeId, bikeProp]
  )

  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedSlug, setSelectedSlug] = useState(null)

  useEffect(() => {
    if (!bike) {
      setLoading(false)
      setCategories([])
      return
    }
    let alive = true
    setLoading(true)
    setErr(null)
    setSelectedSlug(null)
    getCategoriesForBike(bike)
      .then((data) => {
        if (alive) setCategories(data)
      })
      .catch((e) => {
        if (alive) setErr(e?.message || 'Failed to load procedures.')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => { alive = false }
  }, [bike?.id])

  const selected = useMemo(
    () => categories.find((c) => c.slug === selectedSlug) || null,
    [categories, selectedSlug]
  )

  // Snapshot of the job card we're adding to (read once on entry to
  // this mode + after each add so we can show the running count and
  // hint at what's already in the card).
  const [addingCard, setAddingCard] = useState(() =>
    addingToJobCardId ? getJobCard(addingToJobCardId) : null
  )
  useEffect(() => {
    setAddingCard(addingToJobCardId ? getJobCard(addingToJobCardId) : null)
  }, [addingToJobCardId])

  // Route picks based on mode. In normal mode → call up to App via
  // onSelectProcedure. In add-to-card mode → add the picked
  // direction(s) to the card and refresh the local snapshot.
  function handlePick(item) {
    if (addingToJobCardId) {
      addItemToCard(item)
    } else {
      onSelectProcedure && onSelectProcedure(item, bike)
    }
  }

  function addItemToCard(item) {
    const refs = []
    if (item.hasPair && item.remove && item.install) {
      // Paired procedure — add both halves (Remove then Install).
      // Phase 2 may add a picker so the rider can pick just one.
      refs.push({
        procedureId: item.remove.id,
        pairId: item.id,
        direction: 'remove',
        title: `${item.baseTitle} — Remove`
      })
      refs.push({
        procedureId: item.install.id,
        pairId: item.id,
        direction: 'install',
        title: `${item.baseTitle} — Install`
      })
    } else if (item.remove) {
      refs.push({
        procedureId: item.remove.id,
        pairId: null,
        direction: 'remove',
        title: item.baseTitle
      })
    } else if (item.install) {
      refs.push({
        procedureId: item.install.id,
        pairId: null,
        direction: 'install',
        title: item.baseTitle
      })
    } else {
      refs.push({
        procedureId: item.id,
        pairId: null,
        direction: null,
        title: item.baseTitle
      })
    }
    let next = addingCard
    for (const ref of refs) {
      next = addProcedureToJobCard(addingToJobCardId, ref)
    }
    if (next) setAddingCard(next)
  }

  // -------- render --------

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      {addingToJobCardId && addingCard && (
        <div className="sticky top-0 z-10 -mx-4 mb-4 border-b border-hd-orange/40 bg-hd-orange/10 px-4 py-3 sm:-mx-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-hd-orange">
                Adding to job card
              </div>
              <div className="text-sm font-semibold text-hd-text">
                {addingCard.title}
              </div>
              <div className="mt-0.5 text-[11px] text-hd-muted">
                {addingCard.procedures.length} procedure
                {addingCard.procedures.length === 1 ? '' : 's'} so far ·
                tap any procedure to add it
              </div>
            </div>
            <button
              onClick={() => onDoneAdding && onDoneAdding()}
              className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onBack}
        className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
      >
        ← Back
      </button>

      {/* Page header — title + (when multi-bike) a switcher */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            Manual
          </div>
          <h1 className="mt-1 font-display text-3xl tracking-wider sm:text-4xl">
            {bike
              ? `PROCEDURES FOR ${(bike.nickname || bike.model || 'YOUR BIKE').toUpperCase()}`
              : 'PROCEDURES'}
          </h1>
          {bike && (
            <p className="mt-1 text-sm text-hd-muted">
              {bike.year ? `${bike.year} ` : ''}
              {bike.model || ''}
              {selected ? <> · <span className="text-hd-text">{selected.name}</span></> : null}
            </p>
          )}
        </div>

        {garage.length > 1 && (
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-widest text-hd-muted">
              Showing for
            </label>
            <select
              value={activeBikeId || ''}
              onChange={(e) => setActiveBikeId(e.target.value)}
              className="rounded border border-hd-border bg-hd-dark px-3 py-2 text-sm text-hd-text focus:border-hd-orange focus:outline-none"
            >
              {garage.map((b) => (
                <option key={b.id} value={b.id}>
                  {(b.nickname || b.model || 'Bike').trim()}
                  {b.year ? ` · ${b.year}` : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Empty garage — friendly CTA */}
      {garage.length === 0 && (
        <EmptyState
          title="Add a bike to see procedures"
          description="Service procedures are filtered by year and model so you only see what applies to your machine. Add a bike in your Garage to get started."
          icon={
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="17" r="3" />
              <circle cx="18" cy="17" r="3" />
              <path d="M6 17l3-7h6l3 7" />
              <path d="M9 10V6h2" />
            </svg>
          }
        />
      )}

      {bike && loading && (
        <div className="card text-center text-sm text-hd-muted">
          Loading procedures…
        </div>
      )}

      {bike && err && !loading && (
        <div className="card text-center">
          <div className="font-display text-xl tracking-wider text-hd-orange">
            COULDN'T LOAD
          </div>
          <p className="mt-2 text-sm text-hd-muted">{err}</p>
        </div>
      )}

      {bike && !loading && !err && categories.length === 0 && (
        <div className="card text-center">
          <div className="mb-2 font-display text-xl tracking-wider">
            No procedures yet.
          </div>
          <p className="text-sm text-hd-muted">
            We don't have published procedures for this bike's year/model
            yet. As more manuals get indexed they'll show up here.
          </p>
        </div>
      )}

      {/* Category grid (default view) */}
      {bike && !loading && !err && categories.length > 0 && !selected && (
        <CategoryGrid
          categories={categories}
          onSelect={(slug) => setSelectedSlug(slug)}
        />
      )}

      {/* Procedure list (after picking a category) */}
      {bike && !loading && !err && selected && (
        <CategoryDetail
          category={selected}
          onBack={() => setSelectedSlug(null)}
          onSelectProcedure={handlePick}
        />
      )}
    </div>
  )
}

// ---------- Category grid ----------

function CategoryGrid({ categories, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {categories.map((c) => (
        <button
          key={c.slug}
          onClick={() => onSelect(c.slug)}
          className="group flex flex-col items-start rounded-md border border-hd-border bg-hd-dark p-4 text-left transition hover:border-hd-orange"
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-hd-orange/10 text-hd-orange transition group-hover:bg-hd-orange/20">
            <CategoryIcon name={c.name} />
          </div>
          <div className="font-display text-lg leading-tight tracking-wider text-hd-text">
            {c.name.toUpperCase()}
          </div>
          <div className="mt-1 text-xs text-hd-muted">
            {c.items.length} procedure{c.items.length === 1 ? '' : 's'}
          </div>
        </button>
      ))}
    </div>
  )
}

// ---------- One category's procedure list ----------

function CategoryDetail({ category, onBack, onSelectProcedure }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-hd-muted hover:text-hd-orange"
      >
        ← All categories
      </button>

      <ul className="space-y-1.5">
        {category.items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onSelectProcedure(item)}
              className="w-full rounded border border-hd-border bg-hd-dark px-4 py-3 text-left transition hover:border-hd-orange"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <div className="font-display text-base tracking-wider text-hd-text">
                      {item.baseTitle}
                    </div>
                    {item.hasPair && (
                      <span className="rounded-full border border-hd-border bg-hd-black px-2 py-0.5 text-[10px] uppercase tracking-widest text-hd-muted">
                        Remove · Install
                      </span>
                    )}
                  </div>
                  {item.summary && (
                    <div className="mt-0.5 line-clamp-2 text-xs text-hd-muted">
                      {item.summary}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 text-xs text-hd-muted">
                  {item.difficulty && (
                    <span className="rounded border border-hd-border bg-hd-black px-2 py-0.5 uppercase tracking-widest">
                      {item.difficulty}
                    </span>
                  )}
                  {item.time_minutes && (
                    <span>{item.time_minutes} min</span>
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------- Category icon ----------
//
// Maps a chapter name like "Brakes" to a simple line icon. We do
// keyword matching so name variants ("Brake System", "BRAKES") still
// resolve. Falls back to a generic wrench.
function CategoryIcon({ name }) {
  const n = (name || '').toLowerCase()
  const sw = 1.8
  const props = {
    viewBox: '0 0 24 24',
    width: 18,
    height: 18,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: sw,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  }

  if (n.includes('brake')) {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <path d="M3 12h2M19 12h2M12 3v2M12 19v2" />
      </svg>
    )
  }
  if (n.includes('engine') || n.includes('motor')) {
    return (
      <svg {...props}>
        <rect x="4" y="7" width="16" height="11" rx="1.5" />
        <path d="M8 7V4h8v3M4 11h2M18 11h2M9 18v2M15 18v2" />
      </svg>
    )
  }
  if (n.includes('electric') || n.includes('lighting') || n.includes('battery')) {
    return (
      <svg {...props}>
        <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7z" />
      </svg>
    )
  }
  if (n.includes('wheel') || n.includes('tire') || n.includes('tyre')) {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      </svg>
    )
  }
  if (n.includes('suspension') || n.includes('fork') || n.includes('shock')) {
    return (
      <svg {...props}>
        <path d="M12 3v3M12 18v3" />
        <path d="M9 6h6M9 18h6" />
        <path d="M10 8l4 8M14 8l-4 8" />
      </svg>
    )
  }
  if (n.includes('fuel') || n.includes('induct')) {
    return (
      <svg {...props}>
        <path d="M5 4h9v16H5z" />
        <path d="M14 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2" />
        <path d="M5 12h9" />
      </svg>
    )
  }
  if (n.includes('exhaust')) {
    return (
      <svg {...props}>
        <path d="M3 12h12l4-4M3 12h12l4 4" />
        <circle cx="20" cy="12" r="1" />
      </svg>
    )
  }
  if (n.includes('transmission') || n.includes('clutch') || n.includes('gear')) {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      </svg>
    )
  }
  if (n.includes('body') || n.includes('frame') || n.includes('chassis') || n.includes('seat')) {
    return (
      <svg {...props}>
        <path d="M3 17l4-9h10l4 9" />
        <path d="M7 17v2M17 17v2" />
      </svg>
    )
  }
  if (n.includes('maintenance') || n.includes('schedule') || n.includes('service')) {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    )
  }
  // Default — wrench
  return (
    <svg {...props}>
      <path d="M14.7 6.3a4 4 0 0 1 .9 4.4l5.4 5.4-2.9 2.9-5.4-5.4a4 4 0 0 1-4.4-.9 4 4 0 0 1-.9-4.4l2.7 2.7 2.1-2.1-2.7-2.7a4 4 0 0 1 5.2.1z" />
    </svg>
  )
}
