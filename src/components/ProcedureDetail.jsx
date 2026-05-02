import React, { useEffect, useMemo, useState } from 'react'
import { getProcedureDetail } from '../data/procedures.js'

// Procedure detail page. Shows everything the rider needs to decide
// whether to start the procedure: tools, parts, fluids, torque table,
// warnings, and a list of all steps.
//
// The big "Start walkthrough →" button at the top is the primary CTA.
// Tapping it transitions to the Walkthrough component (full-screen
// step-by-step UI).
//
// Two prop modes (caller picks one):
//   - procedureId  → load that single procedure as-is.
//   - item         → a paired item from the procedure browser; if it
//                    has both `remove` and `install` halves we render
//                    a Remove ⇄ Install toggle at the top and load
//                    detail for whichever direction is selected. If
//                    only one half exists, we treat it like a single.
//
// Read-only — no edits here. Editing happens in the admin tools or
// via JSON ingest.

export default function ProcedureDetail({
  procedureId,
  item, // optional paired item from ProcedureBrowser
  bike,
  onBack,
  onStartWalkthrough
}) {
  // Resolve the active procedure id from either prop. For a paired
  // item we keep direction in local state so the user can flip it.
  const initialDirection = item?.hasPair
    ? 'remove'
    : item?.remove
    ? 'remove'
    : item?.install
    ? 'install'
    : null
  const [direction, setDirection] = useState(initialDirection)

  const activeId = useMemo(() => {
    if (item?.hasPair) {
      return direction === 'install' ? item.install?.id : item.remove?.id
    }
    if (item) return item.remove?.id || item.install?.id || item.id
    return procedureId
  }, [item, direction, procedureId])

  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    if (!activeId) {
      setState({ status: 'not-found' })
      return
    }
    let alive = true
    setState({ status: 'loading' })
    getProcedureDetail(activeId)
      .then((detail) => {
        if (!alive) return
        if (!detail?.procedure) {
          setState({ status: 'not-found' })
          return
        }
        setState({ status: 'ready', detail })
      })
      .catch((e) => {
        if (!alive) return
        setState({ status: 'error', message: e?.message || 'Load failed.' })
      })
    return () => { alive = false }
  }, [activeId])

  if (state.status === 'loading') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="card text-center text-sm text-hd-muted">
          Loading procedure…
        </div>
      </div>
    )
  }
  if (state.status === 'not-found') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <button
          onClick={onBack}
          className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
        >
          ← Back
        </button>
        <div className="card text-center">
          <div className="font-display text-2xl tracking-wider text-hd-orange">
            PROCEDURE NOT FOUND
          </div>
        </div>
      </div>
    )
  }
  if (state.status === 'error') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <button
          onClick={onBack}
          className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
        >
          ← Back
        </button>
        <div className="card text-center">
          <div className="font-display text-2xl tracking-wider text-hd-orange">
            COULDN'T LOAD
          </div>
          <p className="mt-2 text-sm text-hd-muted">{state.message}</p>
        </div>
      </div>
    )
  }

  const { procedure, tools, parts, fluids, torque, warnings, steps } = state.detail

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
      >
        ← Back to manual
      </button>

      {/* Header */}
      <div className="mb-4">
        <div className="text-xs uppercase tracking-widest text-hd-orange">
          Procedure
        </div>
        <h1 className="mt-1 font-display text-3xl tracking-wider sm:text-4xl">
          {(item?.baseTitle || procedure.title || '').toUpperCase()}
        </h1>
        {(item?.summary || procedure.summary) && (
          <p className="mt-2 text-sm text-hd-muted sm:text-base">
            {item?.summary || procedure.summary}
          </p>
        )}

        {/* Direction toggle — only shown when both halves of a pair
            are available. Flipping it re-loads the other procedure's
            detail above. */}
        {item?.hasPair && (
          <div className="mt-4 inline-flex rounded-md border border-hd-border bg-hd-dark p-1">
            <button
              onClick={() => setDirection('remove')}
              className={`rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${
                direction === 'remove'
                  ? 'bg-hd-orange text-white'
                  : 'text-hd-muted hover:text-hd-text'
              }`}
            >
              Remove
            </button>
            <button
              onClick={() => setDirection('install')}
              className={`rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${
                direction === 'install'
                  ? 'bg-hd-orange text-white'
                  : 'text-hd-muted hover:text-hd-text'
              }`}
            >
              Install
            </button>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {procedure.difficulty && (
            <span className="rounded border border-hd-border bg-hd-dark px-2 py-1 uppercase tracking-widest text-hd-muted">
              {procedure.difficulty}
            </span>
          )}
          {procedure.time_minutes && (
            <span className="rounded border border-hd-border bg-hd-dark px-2 py-1 uppercase tracking-widest text-hd-muted">
              ~{procedure.time_minutes} min
            </span>
          )}
          <span className="rounded border border-hd-border bg-hd-dark px-2 py-1 uppercase tracking-widest text-hd-muted">
            {steps.length} step{steps.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Big primary CTA — start the walkthrough */}
      <button
        onClick={() => onStartWalkthrough(procedure, state.detail)}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded bg-hd-orange px-6 py-4 text-base font-semibold text-white transition hover:brightness-110"
      >
        Start walkthrough
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="13 6 19 12 13 18" />
        </svg>
      </button>

      {/* Warnings — top-of-procedure callouts */}
      {warnings.length > 0 && (
        <section className="mb-6 space-y-2">
          {warnings.map((w) => (
            <div
              key={w.id}
              className={`rounded-md border px-4 py-3 text-sm ${
                w.level === 'warning'
                  ? 'border-red-500/40 bg-red-500/10 text-red-300'
                  : w.level === 'caution'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                  : 'border-hd-border bg-hd-dark text-hd-text'
              }`}
            >
              <div className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
                {w.level || 'note'}
              </div>
              <div className="mt-1 leading-relaxed">{w.text}</div>
            </div>
          ))}
        </section>
      )}

      {/* Tools */}
      {tools.length > 0 && (
        <Section title="Tools">
          <ul className="space-y-1.5">
            {tools.map((t) => (
              <li key={t.id} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-hd-orange">·</span>
                <div>
                  <div className="text-hd-text">{t.name}</div>
                  {t.note && (
                    <div className="text-xs text-hd-muted">{t.note}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Parts */}
      {parts.length > 0 && (
        <Section title="Parts">
          <ul className="space-y-1.5">
            {parts.map((p) => (
              <li key={p.id} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-hd-orange">·</span>
                <div className="flex-1">
                  <div className="text-hd-text">
                    {p.qty ? `${p.qty}× ` : ''}
                    {p.description}
                  </div>
                  <div className="flex flex-wrap gap-x-3 text-xs text-hd-muted">
                    {p.part_number && (
                      <span>PN: <span className="font-mono">{p.part_number}</span></span>
                    )}
                    {p.note && <span>{p.note}</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Fluids */}
      {fluids.length > 0 && (
        <Section title="Fluids">
          <ul className="space-y-1.5">
            {fluids.map((f) => (
              <li key={f.id} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-hd-orange">·</span>
                <div>
                  <div className="text-hd-text">
                    {f.name}
                    {f.capacity ? ` — ${f.capacity}` : ''}
                  </div>
                  {f.note && (
                    <div className="text-xs text-hd-muted">{f.note}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Torque table */}
      {torque.length > 0 && (
        <Section title="Torque values">
          <div className="overflow-hidden rounded-md border border-hd-border">
            <table className="w-full text-sm">
              <thead className="bg-hd-dark text-xs uppercase tracking-widest text-hd-muted">
                <tr>
                  <th className="px-3 py-2 text-left">Fastener</th>
                  <th className="px-3 py-2 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {torque.map((t) => (
                  <tr key={t.id} className="border-t border-hd-border">
                    <td className="px-3 py-2 align-top text-hd-text">
                      <div>{t.fastener}</div>
                      {t.note && (
                        <div className="mt-0.5 text-xs text-hd-muted">{t.note}</div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right align-top font-mono text-hd-orange">
                      {t.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Steps preview */}
      <Section title={`Steps (${steps.length})`}>
        <ol className="space-y-3">
          {steps.map((s) => (
            <li key={s.id} className="flex gap-3 rounded border border-hd-border bg-hd-dark p-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hd-orange bg-hd-orange/10 text-xs font-semibold text-hd-orange">
                {s.step_number}
              </div>
              <div className="flex-1 text-sm leading-relaxed text-hd-text">
                {s.body}
                {s.note && (
                  <div className="mt-1.5 text-xs text-hd-muted">{s.note}</div>
                )}
                {s.warning && (
                  <div className="mt-2 rounded border border-red-500/40 bg-red-500/10 px-2.5 py-1.5 text-xs text-red-300">
                    <span className="font-semibold">Warning:</span> {s.warning}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Sticky bottom — second start CTA for long procedures */}
      <div className="mt-8 mb-4">
        <button
          onClick={() => onStartWalkthrough(procedure, state.detail)}
          className="flex w-full items-center justify-center gap-2 rounded bg-hd-orange px-6 py-4 text-base font-semibold text-white transition hover:brightness-110"
        >
          Start walkthrough
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="13 6 19 12 13 18" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-hd-muted">
        {title}
      </div>
      {children}
    </section>
  )
}
