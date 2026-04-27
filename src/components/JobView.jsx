import React, { useState } from 'react'
import { getGarage, logService } from '../data/storage.js'
import { EntryEditor } from './ServiceBook.jsx'

const TABS = [
  { id: 'steps', label: 'Steps' },
  { id: 'figures', label: 'Figures' },
  { id: 'torque', label: 'Torque Specs' },
  { id: 'parts', label: 'Parts' },
  { id: 'tools', label: 'Tools' }
]

export default function JobView({ job, bike, onBack }) {
  const [tab, setTab] = useState('steps')
  const [lightbox, setLightbox] = useState(null)   // figure object or null
  const [logging, setLogging] = useState(null)      // bike being logged-to, or null
  const [justLogged, setJustLogged] = useState(false)
  const figures = job.figures || []

  // When the user clicks "Log this service", pick the bike:
  //   - 0 garage bikes: prompt to add one
  //   - 1 garage bike:  jump straight to the editor
  //   - 2+ garage bikes: show a picker
  function startLogging() {
    const garage = getGarage()
    if (garage.length === 0) {
      alert('Add a bike to your Garage first, then come back to log this service.')
      return
    }
    if (garage.length === 1) {
      setLogging(garage[0])
    } else {
      setLogging({ __pick: true, garage })
    }
  }

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
          <button
            onClick={startLogging}
            className="mt-3 rounded bg-hd-orange px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110"
          >
            Log this service
          </button>
          {justLogged && (
            <div className="mt-2 text-[11px] text-emerald-300">
              Saved to Service Book.
            </div>
          )}
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
            : t.id === 'figures' ? figures.length
            : t.id === 'torque' ? job.torque.length
            : t.id === 'parts' ? job.parts.length
            : job.tools.length
          // Hide Figures tab if there are no figures for this job
          if (t.id === 'figures' && count === 0) return null
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

      {tab === 'steps' && <StepsPanel steps={job.steps} figures={figures} onOpenFigure={setLightbox} />}
      {tab === 'figures' && <FiguresPanel figures={figures} onOpen={setLightbox} />}
      {tab === 'torque' && <TorquePanel torque={job.torque} />}
      {tab === 'parts' && <PartsPanel parts={job.parts} />}
      {tab === 'tools' && <ToolsPanel tools={job.tools} />}

      {lightbox && <Lightbox figure={lightbox} onClose={() => setLightbox(null)} />}

      {logging && logging.__pick && (
        <BikePickerModal
          garage={logging.garage}
          onCancel={() => setLogging(null)}
          onPick={(b) => setLogging(b)}
        />
      )}

      {logging && !logging.__pick && (
        <EntryEditor
          bike={logging}
          prefill={{ title: job.title, jobId: job.id }}
          onCancel={() => setLogging(null)}
          onSave={(data) => {
            logService(logging.id, { ...data, jobId: job.id })
            setLogging(null)
            setJustLogged(true)
            setTimeout(() => setJustLogged(false), 3000)
          }}
        />
      )}

      <div className="mt-10 rounded-md border border-hd-border bg-hd-dark p-4 text-xs text-hd-muted">
        Always confirm torque values and part numbers against the printed
        service manual and the latest HD service bulletins before final
        assembly. This app is an assistant, not a replacement for the manual.
      </div>
    </div>
  )
}

function StepsPanel({ steps, figures = [], onOpenFigure }) {
  if (!steps.length) return <EmptyPanel text="No steps recorded yet." />
  // Build a map: step number -> [figures that reference it]
  const byStep = {}
  for (const f of figures) {
    for (const n of (f.stepRefs || [])) {
      byStep[n] = byStep[n] || []
      byStep[n].push(f)
    }
  }
  return (
    <ol className="space-y-3">
      {steps.map((s) => {
        const figsForStep = byStep[s.n] || []
        return (
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
                {figsForStep.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {figsForStep.map((f) => (
                      <button
                        key={f.file}
                        onClick={() => onOpenFigure(f)}
                        className="group inline-flex items-center gap-2 rounded border border-hd-border bg-hd-dark px-2 py-1 text-xs text-hd-muted transition hover:border-hd-orange hover:text-hd-text"
                        title={f.caption}
                      >
                        <img
                          src={f.file}
                          alt={f.caption}
                          loading="lazy"
                          className="h-10 w-14 bg-white object-contain p-0.5"
                        />
                        <span className="max-w-[200px] truncate">{f.caption}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function FiguresPanel({ figures, onOpen }) {
  if (!figures.length) return <EmptyPanel text="No figures available for this job yet." />
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {figures.map((f) => (
        <button
          key={f.file}
          onClick={() => onOpen(f)}
          className="card text-left transition hover:border-hd-orange hover:bg-hd-dark"
        >
          <div className="overflow-hidden rounded bg-white">
            <img
              src={f.file}
              alt={f.caption}
              loading="lazy"
              className="h-48 w-full object-contain"
            />
          </div>
          <div className="mt-2 text-sm text-hd-text">{f.caption}</div>
        </button>
      ))}
    </div>
  )
}

function Lightbox({ figure, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] max-w-[92vw] overflow-auto rounded border border-hd-border bg-hd-dark p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl leading-none text-hd-muted hover:text-hd-orange"
          aria-label="Close"
        >
          ×
        </button>
        <img
          src={figure.file}
          alt={figure.caption}
          className="mx-auto max-h-[80vh] bg-white object-contain"
        />
        <div className="mt-3 text-center text-sm text-hd-text">
          {figure.caption}
        </div>
      </div>
    </div>
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

function BikePickerModal({ garage, onCancel, onPick }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-md border border-hd-border bg-hd-dark p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl tracking-wider text-hd-orange">
            WHICH BIKE?
          </h2>
          <button
            onClick={onCancel}
            className="text-2xl leading-none text-hd-muted hover:text-hd-orange"
          >
            ×
          </button>
        </div>
        <div className="space-y-2">
          {garage.map((b) => (
            <button
              key={b.id}
              onClick={() => onPick(b)}
              className="card w-full text-left transition hover:border-hd-orange"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-lg tracking-wider">
                    {b.nickname || b.model || `${b.year} ${b.model}`}
                  </div>
                  <div className="text-xs text-hd-muted">
                    {b.year} · {b.model}
                  </div>
                </div>
                <div className="text-right text-xs text-hd-muted">
                  <div className="uppercase tracking-widest">Mileage</div>
                  <div className="font-display text-lg text-hd-orange">
                    {(b.mileage || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
