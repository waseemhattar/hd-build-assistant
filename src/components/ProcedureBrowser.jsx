import React, { useEffect, useMemo, useState } from 'react'
import { getProceduresForBike, getAllManuals, getProceduresForManual } from '../data/procedures.js'

// Procedure browser. Two modes:
//
//   1. Bike mode — shows procedures whose manual matches the user's
//      bike (year + model). This is the default when the user has
//      bikes in their Garage. Procedures are grouped by chapter
//      across all matching manuals.
//
//   2. All-manuals mode — shows every published procedure across
//      every manual. Useful when the user is curious or hasn't added
//      a bike yet. Toggle in the top-right.
//
// Tap a procedure → ProcedureDetail. Detail has the "Start walkthrough"
// CTA. Browser stays focused on discovery; walking is a separate UI.

export default function ProcedureBrowser({ bike, onBack, onSelectProcedure }) {
  const [mode, setMode] = useState(bike ? 'bike' : 'all') // 'bike' | 'all'
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState([]) // [{ manual, chapters, procedures }]
  const [err, setErr] = useState(null)

  useEffect(() => {
    let alive = true
    async function load() {
      setLoading(true)
      setErr(null)
      try {
        if (mode === 'bike' && bike) {
          const data = await getProceduresForBike(bike)
          if (alive) setGroups(data)
        } else {
          // All-manuals mode — load every manual + its procedures
          const manuals = await getAllManuals()
          const all = []
          for (const m of manuals) {
            const { chapters, procedures } = await getProceduresForManual(m.id)
            if (procedures.length === 0) continue
            all.push({ manual: m, chapters, procedures })
          }
          if (alive) setGroups(all)
        }
      } catch (e) {
        if (alive) setErr(e?.message || 'Failed to load procedures.')
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => { alive = false }
  }, [mode, bike?.id])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
      >
        ← Back
      </button>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            Manual
          </div>
          <h1 className="mt-1 font-display text-3xl tracking-wider sm:text-4xl">
            {mode === 'bike' && bike
              ? `PROCEDURES FOR ${(bike.nickname || bike.model || 'YOUR BIKE').toUpperCase()}`
              : 'ALL PROCEDURES'}
          </h1>
          <p className="mt-1 text-sm text-hd-muted">
            {mode === 'bike' && bike
              ? `Showing procedures from manuals that cover ${bike.year || ''} ${bike.model || ''}.`
              : 'Every published procedure across every manual.'}
          </p>
        </div>
        {bike && (
          <div className="flex flex-wrap gap-1 self-start rounded border border-hd-border bg-hd-dark p-1">
            <button
              onClick={() => setMode('bike')}
              className={`rounded px-3 py-1.5 text-xs uppercase tracking-widest transition ${
                mode === 'bike'
                  ? 'bg-hd-orange/10 text-hd-orange'
                  : 'text-hd-muted hover:text-hd-text'
              }`}
            >
              For my bike
            </button>
            <button
              onClick={() => setMode('all')}
              className={`rounded px-3 py-1.5 text-xs uppercase tracking-widest transition ${
                mode === 'all'
                  ? 'bg-hd-orange/10 text-hd-orange'
                  : 'text-hd-muted hover:text-hd-text'
              }`}
            >
              All
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="card text-center text-sm text-hd-muted">
          Loading procedures…
        </div>
      )}

      {err && !loading && (
        <div className="card text-center">
          <div className="font-display text-xl tracking-wider text-hd-orange">
            COULDN'T LOAD
          </div>
          <p className="mt-2 text-sm text-hd-muted">{err}</p>
        </div>
      )}

      {!loading && !err && groups.length === 0 && (
        <div className="card text-center">
          <div className="mb-2 font-display text-xl tracking-wider">
            No procedures yet.
          </div>
          <p className="text-sm text-hd-muted">
            {mode === 'bike'
              ? "Looks like there aren't any published procedures for this bike yet. Check back as more manuals are added."
              : "No procedures are published yet."}
          </p>
        </div>
      )}

      {!loading && !err && groups.length > 0 && (
        <div className="space-y-8">
          {groups.map((g) => (
            <ManualSection
              key={g.manual.id}
              group={g}
              onSelectProcedure={onSelectProcedure}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// One manual = one section. Each section groups procedures by chapter.
function ManualSection({ group, onSelectProcedure }) {
  const { manual, chapters, procedures } = group

  // Group procedures by chapter
  const byChapter = useMemo(() => {
    const map = new Map()
    for (const c of chapters) map.set(c.id, { chapter: c, procedures: [] })
    for (const p of procedures) {
      if (!map.has(p.chapter_id)) {
        // Procedure references a chapter we didn't get — skip
        continue
      }
      map.get(p.chapter_id).procedures.push(p)
    }
    // Drop empty chapters
    return Array.from(map.values()).filter((g) => g.procedures.length > 0)
  }, [chapters, procedures])

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <div className="font-display text-2xl tracking-wider text-hd-text">
            {manual.title.toUpperCase()}
          </div>
          {manual.year_from && manual.year_to && (
            <div className="text-xs uppercase tracking-widest text-hd-muted">
              {manual.year_from === manual.year_to
                ? manual.year_from
                : `${manual.year_from}–${manual.year_to}`}
              {manual.family ? ` · ${manual.family}` : ''}
            </div>
          )}
        </div>
        <div className="text-xs text-hd-muted">
          {procedures.length} procedure{procedures.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="space-y-4">
        {byChapter.map(({ chapter, procedures }) => (
          <div key={chapter.id}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-hd-muted">
              {chapter.name}
            </div>
            <ul className="space-y-1.5">
              {procedures.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => onSelectProcedure(p)}
                    className="w-full rounded border border-hd-border bg-hd-dark px-4 py-3 text-left transition hover:border-hd-orange"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-display text-base tracking-wider text-hd-text">
                          {p.title}
                        </div>
                        {p.summary && (
                          <div className="mt-0.5 text-xs text-hd-muted line-clamp-2">
                            {p.summary}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 text-xs text-hd-muted">
                        {p.difficulty && (
                          <span className="rounded border border-hd-border bg-hd-black px-2 py-0.5 uppercase tracking-widest">
                            {p.difficulty}
                          </span>
                        )}
                        {p.time_minutes && (
                          <span>{p.time_minutes} min</span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
