import React, { useState } from 'react'
import { addJobCard } from '../data/storage.js'
import EmptyState from './ui/EmptyState.jsx'

// JobCardsPanel — the "Jobs" tab inside ServiceBook. Lists every job
// card the rider has planned for this bike, plus a CTA to plan a new
// one. Tapping a row opens the JobCardDetail page (App.jsx switches
// view to 'job-card' with the card id).
//
// The panel doesn't manage the cards itself — it delegates create
// (via addJobCard) and navigation up to the parent.

export default function JobCardsPanel({ bike, cards, onOpen, onCreated }) {
  const [creating, setCreating] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')

  function startCreate() {
    setTitleDraft('')
    setCreating(true)
  }

  function commitCreate() {
    const title = titleDraft.trim()
    if (!title) {
      setCreating(false)
      return
    }
    const card = addJobCard(bike.id, { title })
    setCreating(false)
    setTitleDraft('')
    if (card) {
      onCreated && onCreated(card)
      onOpen && onOpen(card.id)
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl tracking-wider text-hd-text">
            JOB CARDS
          </h2>
          <p className="mt-1 text-xs text-hd-muted">
            Plan a job once — multiple procedures grouped, run them in
            sequence, log everything as a single service entry when done.
          </p>
        </div>
        {!creating && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 rounded bg-hd-orange px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            + Plan a job
          </button>
        )}
      </div>

      {creating && (
        <div className="mb-4 rounded-md border border-hd-orange/40 bg-hd-orange/5 p-3">
          <label className="mb-1 block text-[10px] uppercase tracking-widest text-hd-orange">
            New job card
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              autoFocus
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitCreate()
                if (e.key === 'Escape') setCreating(false)
              }}
              placeholder="e.g. Spring service"
              maxLength={80}
              className="input flex-1 min-w-[14rem]"
            />
            <button
              onClick={commitCreate}
              className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Create
            </button>
            <button
              onClick={() => setCreating(false)}
              className="rounded border border-hd-border bg-hd-dark px-4 py-2 text-sm text-hd-muted transition hover:text-hd-text"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {cards.length === 0 && !creating && (
        <EmptyState
          title="No job cards yet"
          description="Group multiple procedures into a single planned job — like a spring service or a pre-track-day check — and run them in sequence."
          ctaLabel="Plan a job"
          onCtaClick={startCreate}
          icon={
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M8 9h8M8 13h8M8 17h5" />
            </svg>
          }
        />
      )}

      {cards.length > 0 && (
        <ul className="space-y-2">
          {cards.map((c) => {
            const total = c.procedures.length
            const done = c.procedures.filter((p) => p.doneAt).length
            const status =
              total === 0
                ? 'draft'
                : done === total
                ? 'complete'
                : done > 0
                ? 'in-progress'
                : 'draft'
            return (
              <li key={c.id}>
                <button
                  onClick={() => onOpen && onOpen(c.id)}
                  className="flex w-full items-start justify-between gap-3 rounded border border-hd-border bg-hd-dark p-4 text-left transition hover:border-hd-orange"
                >
                  <div className="flex-1">
                    <div className="font-display text-base tracking-wider text-hd-text">
                      {c.title}
                    </div>
                    <div className="mt-0.5 text-xs text-hd-muted">
                      {total === 0
                        ? 'No procedures yet'
                        : `${done} of ${total} done`}
                    </div>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                      status === 'complete'
                        ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                        : status === 'in-progress'
                        ? 'border-hd-orange/40 bg-hd-orange/10 text-hd-orange'
                        : 'border-hd-border bg-hd-card text-hd-muted'
                    }`}
                  >
                    {status === 'in-progress' ? 'In progress' : status}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
