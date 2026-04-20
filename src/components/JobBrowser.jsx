import React, { useMemo, useState } from 'react'
import { systems } from '../data/bikes.js'
import { searchJobs } from '../data/jobs.js'

export default function JobBrowser({ bike, onBack, onSelectJob }) {
  const [query, setQuery] = useState('')
  const [activeSystem, setActiveSystem] = useState('all')

  const results = useMemo(() => {
    const list = searchJobs(bike.id, query)
    if (activeSystem === 'all') return list
    return list.filter((j) => j.system === activeSystem)
  }, [bike.id, query, activeSystem])

  const countsBySystem = useMemo(() => {
    const list = searchJobs(bike.id, query)
    const counts = { all: list.length }
    systems.forEach((s) => (counts[s.id] = 0))
    list.forEach((j) => (counts[j.system] = (counts[j.system] || 0) + 1))
    return counts
  }, [bike.id, query])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:shrink-0">
        <button
          onClick={onBack}
          className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
        >
          ← Change bike
        </button>

        <div className="card mb-4">
          <div className="text-xs uppercase tracking-widest text-hd-muted">
            Working on
          </div>
          <div className="mt-1 font-display text-2xl tracking-wider text-hd-orange">
            {bike.year} {bike.family}
          </div>
          <div className="mt-1 text-sm">{bike.label}</div>
        </div>

        <div className="card">
          <div className="mb-3 text-xs uppercase tracking-widest text-hd-muted">
            Browse by system
          </div>
          <ul className="space-y-1">
            <li>
              <SystemButton
                label="All jobs"
                active={activeSystem === 'all'}
                count={countsBySystem.all}
                onClick={() => setActiveSystem('all')}
              />
            </li>
            {systems.map((s) => (
              <li key={s.id}>
                <SystemButton
                  label={s.label}
                  active={activeSystem === s.id}
                  count={countsBySystem[s.id] || 0}
                  onClick={() => setActiveSystem(s.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main list */}
      <section className="flex-1">
        <h1 className="mb-1 font-display text-3xl tracking-wider sm:text-4xl">
          What's today's job?
        </h1>
        <p className="mb-4 text-sm text-hd-muted">
          Search or browse. Each job includes steps, torque specs, part numbers
          and tools required.
        </p>

        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search — e.g. &quot;air filter&quot;, &quot;brake disc&quot;, &quot;rider footboard&quot;"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-hd-border bg-hd-card px-4 py-3 text-hd-text placeholder:text-hd-muted focus:border-hd-orange focus:outline-none"
          />
          {query && (
            <button className="btn-ghost" onClick={() => setQuery('')}>
              Clear
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <EmptyState query={query} activeSystem={activeSystem} />
        ) : (
          <ul className="space-y-3">
            {results.map((j) => (
              <li key={j.id}>
                <button
                  onClick={() => onSelectJob(j)}
                  className="card w-full text-left transition hover:border-hd-orange hover:bg-hd-dark"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-hd-orange">
                        {systems.find((s) => s.id === j.system)?.label || j.system}
                      </div>
                      <div className="mt-1 text-lg font-semibold">{j.title}</div>
                      <div className="mt-1 text-sm text-hd-muted">{j.summary}</div>
                    </div>
                    <div className="shrink-0 text-right text-xs text-hd-muted">
                      <div className="chip mb-1">{j.difficulty}</div>
                      <div>{j.timeMinutes ? `~${j.timeMinutes} min` : ''}</div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function SystemButton({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
        active
          ? 'bg-hd-orange text-black font-semibold'
          : 'text-hd-text hover:bg-hd-dark'
      }`}
    >
      <span>{label}</span>
      <span
        className={`text-xs ${
          active ? 'text-black/70' : 'text-hd-muted'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function EmptyState({ query, activeSystem }) {
  return (
    <div className="card text-center text-hd-muted">
      <div className="mb-2 text-lg">No jobs found.</div>
      <div className="text-sm">
        {query
          ? `Nothing matched "${query}" in ${activeSystem === 'all' ? 'any system' : activeSystem}.`
          : 'No jobs added for this bike / system yet.'}
      </div>
      <div className="mt-3 text-xs">
        Add jobs by editing <code>src/data/jobs.js</code>.
      </div>
    </div>
  )
}
