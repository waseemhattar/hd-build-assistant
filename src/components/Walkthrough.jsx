import React, { useEffect, useMemo, useState } from 'react'
import { logService } from '../data/storage.js'
import { EntryEditor } from './ServiceBook.jsx'

// Walkthrough — full-screen step-by-step UI for performing a procedure.
//
// Why this exists: a rider in a garage with greasy hands wants ONE
// thing on screen at a time. The procedure detail page is a
// long-scrolling document — useful for reference but bad while
// wrenching. The walkthrough breaks the same content into single-step
// chunks with big tap targets.
//
// Structure:
//   - Top progress bar: "Step 5 of 12" + a thin red bar
//   - Step body in a large readable size
//   - Inline warning callout if step.warning
//   - Inline note callout if step.note
//   - Bottom: Previous / Next buttons (Next becomes "Mark complete" on last step)
//   - "I'll come back to this" pauses the walkthrough (state lost for now)
//   - Sticky reference panel — collapsed by default — surfaces tools/parts/torque
//
// On Mark complete we open the EntryEditor with the procedure's title,
// parts, and current bike's mileage prefilled. User adjusts and saves
// → service log entry created on the bike.

export default function Walkthrough({
  procedure,
  detail,
  bike,
  onExit,
  onComplete
}) {
  const steps = detail?.steps || []
  const [stepIndex, setStepIndex] = useState(0)
  const [refOpen, setRefOpen] = useState(false)
  const [confirmingExit, setConfirmingExit] = useState(false)
  const [logEditorOpen, setLogEditorOpen] = useState(false)

  // Defensive: if there are no steps, send the user back.
  useEffect(() => {
    if (steps.length === 0) onExit()
  }, [steps.length, onExit])

  if (steps.length === 0) return null

  const currentStep = steps[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === steps.length - 1
  const progressPct = ((stepIndex + 1) / steps.length) * 100

  function next() {
    if (!isLast) {
      setStepIndex((i) => i + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (bike) {
      // On the last step, "Next" turns into "Mark complete" → open
      // the log-service form with prefilled fields. The form is the
      // existing EntryEditor used everywhere else.
      setLogEditorOpen(true)
    } else {
      // No bike attached — procedures are bike-scoped now so this is
      // a fallback path. Just exit cleanly without trying to log.
      onComplete && onComplete()
    }
  }
  function prev() {
    if (!isFirst) {
      setStepIndex((i) => i - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  function exit() {
    setConfirmingExit(true)
  }

  // Build the prefill for EntryEditor when user marks complete.
  // Title sources, in priority order:
  //   1. The actual loaded procedure title from `detail` (most accurate;
  //      reflects which direction of a paired Remove/Install was done).
  //   2. The paired item's baseTitle (e.g. "Brake Caliper, Front").
  //   3. The legacy `procedure.title` (kept as a fallback for old code
  //      paths that still pass a single procedure object directly).
  const logPrefill = useMemo(() => {
    const partsList = (detail?.parts || [])
      .filter((p) => p.description)
      .map((p) => `${p.qty ? p.qty + 'x ' : ''}${p.part_number ? p.part_number + ' ' : ''}${p.description}`)
      .join(', ')
    const rawTitle =
      detail?.procedure?.title ||
      procedure?.baseTitle ||
      procedure?.title ||
      ''
    return {
      title: titleCase(rawTitle),
      jobId:
        detail?.procedure?.legacy_id ||
        detail?.procedure?.id ||
        procedure?.legacy_id ||
        procedure?.id ||
        null,
      parts: partsList,
      notes: ''
    }
  }, [procedure, detail])

  // HD service-manual titles arrive in ALL CAPS ("BRAKE CALIPER, FRONT
  // REMOVAL"). The service-log "What was done" reads more naturally in
  // sentence case ("Brake caliper, front removal"). User can still
  // edit before saving — this is just a friendlier default.
  function titleCase(s) {
    if (!s) return ''
    const lower = s.toLowerCase()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  }

  return (
    <div className="min-h-screen bg-hd-black text-hd-text">
      {/* Top bar — progress + exit */}
      <div className="sticky top-0 z-20 border-b border-hd-border bg-hd-dark/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={exit}
              className="rounded border border-hd-border bg-hd-card px-3 py-1.5 text-xs text-hd-muted hover:border-hd-orange hover:text-hd-text"
            >
              ← Pause
            </button>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-widest text-hd-muted">
                Step {stepIndex + 1} of {steps.length}
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-hd-card">
                <div
                  className="h-full bg-hd-orange transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => setRefOpen((v) => !v)}
              className="rounded border border-hd-border bg-hd-card px-3 py-1.5 text-xs text-hd-muted hover:border-hd-orange hover:text-hd-text"
            >
              {refOpen ? 'Hide' : 'Reference'}
            </button>
          </div>
        </div>
      </div>

      {/* Reference panel (collapsible) — tools/parts/torque at a glance */}
      {refOpen && (
        <ReferencePanel detail={detail} />
      )}

      {/* Main step body */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-3 text-xs uppercase tracking-widest text-hd-orange">
          {procedure.title}
        </div>

        {/* Big numbered step badge + body */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-hd-orange bg-hd-orange/10 font-display text-xl tracking-wider text-hd-orange">
            {currentStep.step_number}
          </div>
          <div className="flex-1 pt-1">
            <p className="text-lg leading-relaxed text-hd-text sm:text-xl">
              {currentStep.body}
            </p>
            {currentStep.note && (
              <div className="mt-4 rounded-md border border-hd-border bg-hd-dark px-4 py-3 text-sm text-hd-muted">
                <span className="font-semibold text-hd-text">Tip:</span>{' '}
                {currentStep.note}
              </div>
            )}
            {currentStep.warning && (
              <div className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <span className="font-semibold">Warning:</span>{' '}
                {currentStep.warning}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom navigation — Previous / Next */}
      <div className="sticky bottom-0 z-20 border-t border-hd-border bg-hd-dark/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={prev}
            disabled={isFirst}
            className="rounded border border-hd-border bg-hd-card px-4 py-3 text-sm font-semibold text-hd-text transition hover:border-hd-orange disabled:opacity-30"
          >
            ← Previous
          </button>
          <button
            onClick={next}
            className="flex flex-1 items-center justify-center gap-2 rounded bg-hd-orange px-6 py-3 text-base font-semibold text-white transition hover:brightness-110"
          >
            {isLast ? (
              <>Mark complete</>
            ) : (
              <>
                Next
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="13 6 19 12 13 18" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pause confirmation */}
      {confirmingExit && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setConfirmingExit(false)}
        >
          <div
            className="w-full max-w-sm rounded-md border border-hd-border bg-hd-dark p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-display text-xl tracking-wider text-hd-orange">
              PAUSE WALKTHROUGH?
            </div>
            <p className="mt-2 text-sm text-hd-muted">
              You're on step {stepIndex + 1} of {steps.length}. We'll pick up
              where you left off when you come back. (For now, your place
              isn't saved — that's coming soon.)
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmingExit(false)}
                className="rounded border border-hd-border bg-hd-card px-4 py-2 text-sm text-hd-text hover:border-hd-orange"
              >
                Keep going
              </button>
              <button
                onClick={onExit}
                className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
              >
                Pause
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark complete → open EntryEditor pre-filled */}
      {logEditorOpen && bike && (
        <EntryEditor
          bike={bike}
          prefill={logPrefill}
          onCancel={() => setLogEditorOpen(false)}
          onSave={(data) => {
            logService(bike.id, data)
            setLogEditorOpen(false)
            onComplete && onComplete()
          }}
        />
      )}

    </div>
  )
}

// Quick-reference panel that slides under the top bar. Shows tools,
// parts, fluids, torque without leaving the walkthrough.
function ReferencePanel({ detail }) {
  const { tools = [], parts = [], fluids = [], torque = [] } = detail
  const isEmpty = tools.length + parts.length + fluids.length + torque.length === 0
  if (isEmpty) {
    return (
      <div className="border-b border-hd-border bg-hd-dark px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-xs text-hd-muted">
          No reference info for this procedure.
        </div>
      </div>
    )
  }
  return (
    <div className="border-b border-hd-border bg-hd-dark">
      <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tools.length > 0 && (
            <RefBlock title="Tools">
              {tools.map((t) => (
                <div key={t.id} className="text-xs text-hd-text">· {t.name}</div>
              ))}
            </RefBlock>
          )}
          {parts.length > 0 && (
            <RefBlock title="Parts">
              {parts.map((p) => (
                <div key={p.id} className="text-xs text-hd-text">
                  · {p.qty ? `${p.qty}× ` : ''}{p.description}
                  {p.part_number && (
                    <span className="ml-1 font-mono text-hd-muted">
                      ({p.part_number})
                    </span>
                  )}
                </div>
              ))}
            </RefBlock>
          )}
          {fluids.length > 0 && (
            <RefBlock title="Fluids">
              {fluids.map((f) => (
                <div key={f.id} className="text-xs text-hd-text">
                  · {f.name}
                  {f.capacity && (
                    <span className="ml-1 text-hd-muted">— {f.capacity}</span>
                  )}
                </div>
              ))}
            </RefBlock>
          )}
          {torque.length > 0 && (
            <RefBlock title="Torque">
              {torque.map((t) => (
                <div key={t.id} className="text-xs text-hd-text">
                  · {t.fastener}:{' '}
                  <span className="font-mono text-hd-orange">{t.value}</span>
                </div>
              ))}
            </RefBlock>
          )}
        </div>
      </div>
    </div>
  )
}

function RefBlock({ title, children }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-hd-muted">
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}
