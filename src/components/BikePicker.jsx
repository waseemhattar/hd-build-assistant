import React from 'react'
import { bikes } from '../data/bikes.js'

export default function BikePicker({ onSelect }) {
  // Group bikes by family for a tidier picker
  const groups = bikes.reduce((acc, b) => {
    acc[b.family] = acc[b.family] || []
    acc[b.family].push(b)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 sm:mb-10">
        <h1 className="font-display text-4xl tracking-wider text-hd-orange sm:text-5xl">
          HD BUILD ASSISTANT
        </h1>
        <p className="mt-2 text-sm text-hd-muted sm:text-base">
          Pick the bike you're working on. Step-by-step procedures, torque specs
          and part numbers from my personal service-manual library.
        </p>

        <div className="mt-4 rounded-md border border-hd-border bg-hd-dark p-3 text-xs leading-relaxed text-hd-muted sm:text-sm">
          <strong className="text-hd-text">Heads up —</strong> this is a
          personal reference assistant, not an official Harley-Davidson
          resource. Always verify torque values and part numbers against the
          printed service manual and current HD service bulletins before
          final assembly. Work at your own risk. Harley-Davidson® is a
          registered trademark of H-D U.S.A., LLC — this site is not
          affiliated with or endorsed by Harley-Davidson.
        </div>
      </div>

      {Object.entries(groups).map(([family, list]) => (
        <section key={family} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-hd-muted">
            {family}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list
              .sort((a, b) => a.year - b.year)
              .map((b) => (
                <button
                  key={b.id}
                  onClick={() => onSelect(b)}
                  className="card text-left transition hover:border-hd-orange hover:bg-hd-dark"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl tracking-wider">
                      {b.year}
                    </span>
                    <span className="chip">{b.family}</span>
                  </div>
                  <div className="mt-2 text-lg font-semibold">{b.label}</div>
                  <div className="mt-2 line-clamp-2 text-sm text-hd-muted">
                    {b.models.slice(0, 4).join(' · ')}
                    {b.models.length > 4 ? ` · +${b.models.length - 4} more` : ''}
                  </div>
                </button>
              ))}
          </div>
        </section>
      ))}

      <footer className="mt-16 border-t border-hd-border pt-4 text-xs text-hd-muted">
        <div>
          Built by{' '}
          <a
            href="https://h-dbuilds.com"
            className="text-hd-orange hover:underline"
            target="_top"
            rel="noopener"
          >
            h-dbuilds.com
          </a>{' '}
          — a personal Harley build assistant.
        </div>
        <div className="mt-1">
          Data sourced from personal service manuals. Always verify torque
          values against the printed manual before final assembly.
        </div>
      </footer>
    </div>
  )
}
