import React, { useEffect, useMemo, useRef, useState } from 'react'
import { searchJobs } from '../data/search.js'
import { systems as systemList } from '../data/bikes.js'

// Global search input + results panel.
// Use: <SearchBar onPickJob={(bike, job) => ...} />

const systemLabel = Object.fromEntries(systemList.map((s) => [s.id, s.label]))

export default function SearchBar({ onPickJob, autoFocus = false, placeholder }) {
  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 120)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus()
  }, [autoFocus])

  const results = useMemo(() => {
    if (debounced.trim().length < 2) return []
    return searchJobs(debounced, { limit: 25 })
  }, [debounced])

  return (
    <div className="w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder || 'Search every job, part number, torque spec…'}
          className="input pl-10 pr-4 py-3 text-base"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-hd-muted"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
          />
        </svg>
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-hd-muted hover:text-hd-orange"
          >
            Clear
          </button>
        )}
      </div>

      {q.trim().length >= 2 && (
        <div className="mt-3">
          {results.length === 0 ? (
            <div className="card text-sm text-hd-muted">
              No matches for <span className="text-hd-text">"{q}"</span>.
              Try a part number, fastener name, or a system like "brakes".
            </div>
          ) : (
            <div className="text-xs text-hd-muted mb-2">
              {results.length} match{results.length === 1 ? '' : 'es'}
            </div>
          )}
          <ul className="space-y-2">
            {results.map(({ job, bike, hits }) => (
              <li key={job.id}>
                <button
                  onClick={() => onPickJob(bike, job)}
                  className="card w-full text-left transition hover:border-hd-orange hover:bg-hd-dark"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-lg tracking-wider">
                        {job.title}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-hd-muted">
                        {bike && (
                          <span className="text-hd-orange">{bike.label}</span>
                        )}
                        {bike && <span>·</span>}
                        <span>{systemLabel[job.system] || job.system}</span>
                        <span>·</span>
                        <span>{job.difficulty}</span>
                        {job.timeMinutes ? (
                          <>
                            <span>·</span>
                            <span>~{job.timeMinutes} min</span>
                          </>
                        ) : null}
                      </div>
                      {hits.length > 0 && (
                        <div className="mt-2 space-y-1 text-xs text-hd-text">
                          {hits.map((h, i) => (
                            <HitLine key={i} hit={h} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function HitLine({ hit }) {
  const s = hit.snippet
  if (!s) return null
  const fieldLabel = {
    title: 'Title',
    part: 'Part',
    torque: 'Torque',
    step: 'Step',
    tool: 'Tool',
    summary: 'Summary'
  }[hit.field] || hit.field
  return (
    <div className="flex items-start gap-2">
      <span className="shrink-0 rounded border border-hd-border bg-hd-black px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-hd-muted">
        {fieldLabel}
      </span>
      <span className="min-w-0 flex-1 truncate">
        {s.before}
        <mark className="rounded bg-hd-orange/30 px-0.5 text-hd-text">
          {s.match}
        </mark>
        {s.after}
      </span>
    </div>
  )
}
