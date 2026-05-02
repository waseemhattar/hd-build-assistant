import React, { useEffect, useState } from 'react'
import {
  getJobCard,
  updateJobCard,
  removeJobCard,
  removeProcedureFromJobCard,
  setJobCardProcedureDone,
  subscribe
} from '../data/storage.js'
import EmptyState from './ui/EmptyState.jsx'

// JobCardDetail — view + edit one job card.
//
// What you see here:
//   - Card title (inline-editable)
//   - List of procedures in the order the rider added them, each with
//     a checkbox (mark as done individually) and a remove button.
//   - "+ Add procedure" CTA → routes back into the procedure browser
//     in select-mode, scoped to this card.
//   - "Run job" CTA → kicks off the sequential walkthrough (Phase 2).
//   - "Delete card" — hidden behind a confirm.
//
// Status badge:
//   draft         → no procedures completed yet
//   in-progress   → some completed, some open
//   complete      → all done

export default function JobCardDetail({
  cardId,
  bike,
  onBack,
  onAddProcedures,
  onRunJob,
  onOpenProcedure
}) {
  const [card, setCard] = useState(() => getJobCard(cardId))
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(card?.title || '')

  // Re-read whenever storage notifies (e.g. after returning from the
  // procedure browser with new items added).
  useEffect(() => {
    const reload = () => {
      const next = getJobCard(cardId)
      setCard(next)
      if (next) setTitleDraft(next.title)
    }
    reload()
    const unsub = subscribe(reload)
    return unsub
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId])

  if (!card) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <button
          onClick={onBack}
          className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
        >
          ← Back
        </button>
        <div className="card text-center">
          <div className="font-display text-xl tracking-wider text-hd-orange">
            JOB CARD NOT FOUND
          </div>
        </div>
      </div>
    )
  }

  const total = card.procedures.length
  const done = card.procedures.filter((p) => p.doneAt).length
  const status =
    total === 0
      ? 'draft'
      : done === total
      ? 'complete'
      : done > 0
      ? 'in-progress'
      : 'draft'

  function commitTitle() {
    const t = titleDraft.trim()
    if (!t || t === card.title) {
      setEditingTitle(false)
      return
    }
    const next = updateJobCard(cardId, { title: t })
    if (next) setCard(next)
    setEditingTitle(false)
  }

  function handleDeleteCard() {
    if (!window.confirm(`Delete "${card.title}"? This cannot be undone.`))
      return
    removeJobCard(cardId)
    onBack && onBack()
  }

  function handleRemoveProc(itemId) {
    const next = removeProcedureFromJobCard(cardId, itemId)
    if (next) setCard(next)
  }

  function handleToggleDone(itemId, current) {
    const next = setJobCardProcedureDone(cardId, itemId, !current)
    if (next) setCard(next)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            Job card
          </div>
          {editingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitTitle()
                if (e.key === 'Escape') {
                  setTitleDraft(card.title)
                  setEditingTitle(false)
                }
              }}
              className="mt-1 w-full bg-transparent font-display text-3xl tracking-wider text-hd-text outline-none focus:border-b focus:border-hd-orange sm:text-4xl"
              maxLength={80}
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="mt-1 text-left font-display text-3xl tracking-wider text-hd-text hover:text-hd-orange sm:text-4xl"
              title="Rename"
            >
              {card.title}
            </button>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-hd-muted">
            <span>For {bike?.nickname || bike?.model || 'this bike'}</span>
            <span>·</span>
            <StatusPill status={status} />
            {total > 0 && (
              <>
                <span>·</span>
                <span>
                  {done} of {total} done
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onAddProcedures}
            className="inline-flex items-center gap-1.5 rounded border border-hd-border bg-hd-dark px-3 py-2 text-sm text-hd-text transition hover:border-hd-orange hover:text-hd-orange"
          >
            + Add procedure
          </button>
          {total > 0 && status !== 'complete' && (
            <button
              onClick={onRunJob}
              className="inline-flex items-center gap-1.5 rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Run job
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
            </button>
          )}
        </div>
      </div>

      {/* Procedures list */}
      {total === 0 ? (
        <EmptyState
          title="No procedures yet"
          description="Tap “Add procedure” to plan what this job will cover. You can pick from the manual just like normal."
          ctaLabel="Add procedure"
          onCtaClick={onAddProcedures}
          icon={
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3 8-8" />
              <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
            </svg>
          }
        />
      ) : (
        <ul className="space-y-2">
          {card.procedures
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((p, idx) => (
              <li
                key={p.id}
                className="flex items-start gap-3 rounded-md border border-hd-border bg-hd-dark p-3"
              >
                <button
                  onClick={() => handleToggleDone(p.id, !!p.doneAt)}
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                    p.doneAt
                      ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                      : 'border-hd-border bg-hd-card text-hd-muted hover:border-hd-orange'
                  }`}
                  aria-label={p.doneAt ? 'Mark not done' : 'Mark done'}
                >
                  {p.doneAt && (
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <div className="text-xs text-hd-muted">
                    Step {idx + 1}
                  </div>
                  <button
                    onClick={() => onOpenProcedure && onOpenProcedure(p)}
                    className={`mt-0.5 block text-left font-display text-base tracking-wider transition ${
                      p.doneAt
                        ? 'text-hd-muted line-through'
                        : 'text-hd-text hover:text-hd-orange'
                    }`}
                  >
                    {p.title}
                    {p.direction && (
                      <span className="ml-2 rounded-full border border-hd-border bg-hd-black px-2 py-0.5 align-middle text-[10px] uppercase tracking-widest text-hd-muted">
                        {p.direction}
                      </span>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveProc(p.id)}
                  className="mt-0.5 text-xs text-hd-muted hover:text-red-400"
                  aria-label="Remove"
                  title="Remove from job"
                >
                  ✕
                </button>
              </li>
            ))}
        </ul>
      )}

      {/* Danger zone */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleDeleteCard}
          className="text-xs text-hd-muted hover:text-red-400"
        >
          Delete this job card
        </button>
      </div>
    </div>
  )
}

function StatusPill({ status }) {
  const map = {
    draft: { label: 'Draft', cls: 'border-hd-border bg-hd-card text-hd-muted' },
    'in-progress': {
      label: 'In progress',
      cls: 'border-hd-orange/40 bg-hd-orange/10 text-hd-orange'
    },
    complete: {
      label: 'Complete',
      cls: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
    }
  }
  const cfg = map[status] || map.draft
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  )
}
