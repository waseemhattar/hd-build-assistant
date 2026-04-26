import React from 'react'
import { getGarage } from '../data/storage.js'
import SearchBar from './SearchBar.jsx'

export default function Home({ onOpenGarage, onOpenManual, onPickJob }) {
  const garage = getGarage()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl tracking-wider text-hd-orange sm:text-5xl">
          HD BUILD ASSISTANT
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-hd-muted sm:text-base">
          A community DIY reference for Harley-Davidson owners. Track the
          bikes in your garage, keep a service log, and dig into step-by-step
          procedures from the factory service manuals.
        </p>
      </div>

      <div className="mb-10">
        <SearchBar onPickJob={onPickJob} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          onClick={onOpenGarage}
          className="card text-left transition hover:border-hd-orange hover:bg-hd-dark"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-hd-orange">
                My Garage
              </div>
              <div className="mt-2 font-display text-2xl tracking-wider">
                {garage.length === 0
                  ? 'Start a garage'
                  : `${garage.length} bike${garage.length > 1 ? 's' : ''}`}
              </div>
              <p className="mt-2 text-sm text-hd-muted">
                Add the bikes you own, keep a service book, and track what's
                coming up next. Harley's intervals are shown as soft
                reference — you decide when to wrench.
              </p>
            </div>
          </div>
          {garage.length > 0 && (
            <div className="mt-4 space-y-1 text-xs text-hd-muted">
              {garage.slice(0, 3).map((b) => (
                <div key={b.id} className="flex items-center justify-between">
                  <span className="text-hd-text">
                    {b.nickname || b.model || `${b.year} ${b.model}`}
                  </span>
                  <span>{(b.mileage || 0).toLocaleString()} mi</span>
                </div>
              ))}
            </div>
          )}
        </button>

        <button
          onClick={onOpenManual}
          className="card text-left transition hover:border-hd-orange hover:bg-hd-dark"
        >
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            Browse Manual
          </div>
          <div className="mt-2 font-display text-2xl tracking-wider">
            Step-by-step procedures
          </div>
          <p className="mt-2 text-sm text-hd-muted">
            Pick a platform and drill into the factory service manual —
            torque specs, part numbers, tool lists, and figures for every
            job.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-hd-muted">
            <span className="chip">Maintenance</span>
            <span className="chip">Engine</span>
            <span className="chip">Transmission</span>
            <span className="chip">Electrical</span>
            <span className="chip">+7 more</span>
          </div>
        </button>
      </div>

      <div className="mt-10 rounded-md border border-hd-border bg-hd-dark p-3 text-xs leading-relaxed text-hd-muted sm:text-sm">
        <strong className="text-hd-text">Heads up —</strong> this is a
        community reference assistant, not an official Harley-Davidson
        resource. Always verify torque values and part numbers against the
        printed service manual and current HD service bulletins before
        final assembly. Work at your own risk. Harley-Davidson® is a
        registered trademark of H-D U.S.A., LLC — this site is not
        affiliated with or endorsed by Harley-Davidson.
      </div>

      <footer className="mt-12 border-t border-hd-border pt-4 text-xs text-hd-muted">
        Sidestand — a personal build assistant for motorcycle riders.
      </footer>
    </div>
  )
}
