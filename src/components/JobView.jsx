import React, { useState } from 'react'

const TABS = [
  { id: 'steps', label: 'Steps' },
  { id: 'torque', label: 'Torque Specs' },
  { id: 'parts', label: 'Parts' },
  { id: 'tools', label: 'Tools' }
]

export default function JobView({ job, bike, onBack }) {
  const [tab, setTab] = useState('steps')

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
      >
        ← Back to jobs
      </button>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            {bike.year} {bike.family} · {bike.label}
          </div>
          <h1 className="mt-1 font-display text-3xl tracking-wider sm:text-4xl">{job.title}</h1>
          <p className="mt-1 text-hd-muted">{job.summary}</p>
        </div>
        <div className="shrink-0 text-right text-xs text-hd-muted">
          <div className="chip mb-1">{job.difficulty}</div>
          <div>{job.timeMinutes ? `~${job.timeMinutes} min` : ''}</div>
        </div>
      </div>

      {job.source?.manual && (
        <div className="mb-6 text-xs text-hd-muted">
          Source: <span className="text-hd-text">{job.source.manual}</span>
          {job.source.page ? ` · p. ${job.source.page}` : ''}
        </div>
      )}

      {/* Tabs */}
      <nav className="mb-4 flex flex-wrap gap-1 border-b border-hd-border">
        {TABS.map((t) => {
          const count = t.id === 'steps' ? job.steps.length
            : t.id === 'torque' ? job.torque.length
            : t.id === 'parts' ? job.parts.length
            : job.tools.length
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
              {t.label}{' '}
              <span className={active ? 'text-hd-orange' : 'text-hd-muted'}>
                ({count})
              </span>
            </button>
          )
        })}
      </nav>

      {tab === 'steps' && <StepsPanel steps={job.steps} />}
      {tab === 'torque' && <TorquePanel torque={job.torque} />}
      {tab === 'parts' && <PartsPanel parts={job.parts} />}
      {tab === 'tools' && <ToolsPanel tools={job.tools} />}

      <div className="mt-10 rounded-md border border-hd-border bg-hd-dark p-4 text-xs text-hd-muted">
        Always confirm torque values and part numbers against the printed
        service manual and the latest HD service bulletins before final
        assembly. This app is an assistant, not a replacement for the manual.
      </div>
    </div>
  )
}

function StepsPanel({ steps }) {
  if (!steps.length) return <EmptyPanel text="No steps recorded yet." />
  return (
    <ol className="space-y-3">
      {steps.map((s) => (
        <li key={s.n} className="card">
          <div className="flex gap-4">
            <div className="font-display text-3xl text-hd-orange leading-none w-10 text-right">
              {s.n}
            </div>
            <div className="flex-1">
              <div>{s.text}</div>
              {s.warning && (
                <div className="mt-2 rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                  <strong className="mr-1">Warning:</strong>
                  {s.warning}
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}

function TorquePanel({ torque }) {
  if (!torque.length) return <EmptyPanel text="No torque specs recorded for this job yet." />
  return (
    <div className="card p-0 overflow-x-auto">
      <table className="w-full min-w-[480px] text-sm">
        <thead className="bg-hd-dark text-xs uppercase tracking-widest text-hd-muted">
          <tr>
            <th className="px-4 py-3 text-left">Fastener</th>
            <th className="px-4 py-3 text-left">Torque</th>
            <th className="px-4 py-3 text-left">Note</th>
          </tr>
        </thead>
        <tbody>
          {torque.map((t, i) => (
            <tr key={i} className="border-t border-hd-border">
              <td className="px-4 py-3 font-medium">{t.fastener}</td>
              <td className="px-4 py-3 text-hd-orange font-semibold whitespace-nowrap">
                {t.value}
              </td>
              <td className="px-4 py-3 text-hd-muted">{t.note || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PartsPanel({ parts }) {
  if (!parts.length) return <EmptyPanel text="No part numbers recorded for this job yet." />
  return (
    <div className="card p-0 overflow-x-auto">
      <table className="w-full min-w-[480px] text-sm">
        <thead className="bg-hd-dark text-xs uppercase tracking-widest text-hd-muted">
          <tr>
            <th className="px-4 py-3 text-left">Part #</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-right">Qty</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((p, i) => (
            <tr key={i} className="border-t border-hd-border">
              <td className="px-4 py-3 font-mono text-hd-orange">{p.number}</td>
              <td className="px-4 py-3">{p.description}</td>
              <td className="px-4 py-3 text-right">{p.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ToolsPanel({ tools }) {
  if (!tools.length) return <EmptyPanel text="No tools listed for this job yet." />
  return (
    <ul className="card space-y-2">
      {tools.map((t, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-hd-orange" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

function EmptyPanel({ text }) {
  return (
    <div className="card text-center text-sm text-hd-muted">{text}</div>
  )
}
