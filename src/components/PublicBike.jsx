import React, { useEffect, useState } from 'react'
import { getPublicBikeBySlug } from '../data/storage.js'
import { formatMileage, formatDate } from '../data/userPrefs.js'
import Logo from './Logo.jsx'

// Public, unauthenticated build sheet. Rendered by App.jsx when the URL
// matches /b/<slug>. Server-side RLS only returns the row when the
// bike's is_public flag is true and a public_slug is set, so a 404 here
// usually means the rider unpublished the bike (or the slug is wrong).
//
// Shown:
//   - Hero with cover photo + name + year + owner
//   - Stats grid: mileage, mods total, installed, services
//   - Builds (named build groupings) with their mods
//   - Orphan mods (mods not in a build), grouped by category
//   - Optional public service history (entries the owner left as public)
//
// NOT shown — even when RLS would technically permit it:
//   - VIN, purchase date, internal notes, cost (defense-in-depth)
//
// Visual rules (iOS-native, matches Home dashboard):
//   - Cards have NO border. Bg contrast (hd-black under, hd-dark on)
//     is the separation.
//   - rounded-3xl corners. Generous.
//   - Section header = small uppercase kicker + optional subtitle.
//   - Inside cards: thin border-white/5 dividers between rows.
//   - Hero photo is full-bleed with a dark gradient at the bottom
//     for the bike-name overlay.

export default function PublicBike({ slug }) {
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let alive = true
    setState({ status: 'loading' })
    getPublicBikeBySlug(slug)
      .then((data) => {
        if (!alive) return
        if (!data) setState({ status: 'not-found' })
        else setState({ status: 'ready', data })
      })
      .catch((err) => {
        if (!alive) return
        console.warn('public bike load failed', err)
        setState({ status: 'error', message: err?.message || 'Load failed.' })
      })
    return () => {
      alive = false
    }
  }, [slug])

  // Document title + meta description for sharing.
  useEffect(() => {
    if (state.status !== 'ready') return
    const { bike } = state.data
    const prevTitle = document.title
    const headline = bike.nickname || bike.model || `${bike.year || ''} bike`
    document.title = `${headline} · Sidestand`
    return () => {
      document.title = prevTitle
    }
  }, [state])

  if (state.status === 'loading') {
    return (
      <Shell>
        <Centered>
          <div className="text-sm text-hd-muted">Loading bike…</div>
        </Centered>
      </Shell>
    )
  }
  if (state.status === 'not-found') {
    return (
      <Shell>
        <Centered>
          <div className="text-2xl font-bold text-hd-text">
            Bike not found
          </div>
          <p className="mt-2 max-w-md text-[14px] text-hd-muted">
            This build sheet either doesn't exist or has been unpublished
            by the owner. If they re-publish, the original link will work
            again.
          </p>
          <a
            href="/"
            className="mt-5 inline-block rounded-full bg-hd-orange px-6 py-3 text-[15px] font-semibold text-white"
          >
            Build your own
          </a>
        </Centered>
      </Shell>
    )
  }
  if (state.status === 'error') {
    return (
      <Shell>
        <Centered>
          <div className="text-2xl font-bold text-hd-text">
            Couldn't load
          </div>
          <p className="mt-2 max-w-md text-[14px] text-hd-muted">
            {state.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-full bg-hd-dark px-6 py-3 text-[15px] font-semibold text-hd-text"
          >
            Try again
          </button>
        </Centered>
      </Shell>
    )
  }

  const { bike, builds, mods, serviceEntries = [] } = state.data

  // Bucket mods by buildId. Anything with a null/unknown buildId goes
  // into "orphan mods" so it still gets surfaced.
  const knownBuildIds = new Set(builds.map((b) => b.id))
  const modsByBuild = new Map()
  const orphanMods = []
  for (const m of mods) {
    if (m.buildId && knownBuildIds.has(m.buildId)) {
      const list = modsByBuild.get(m.buildId) || []
      list.push(m)
      modsByBuild.set(m.buildId, list)
    } else {
      orphanMods.push(m)
    }
  }

  const totalMods = mods.length
  const installedCount = mods.filter((m) => m.status === 'installed').length

  return (
    <Shell>
      {/* Hero */}
      <section className="px-4 pb-4 pt-3 sm:px-6 sm:pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-hd-dark">
          {bike.coverPhotoUrl ? (
            <div className="relative aspect-[4/3] w-full bg-hd-black sm:aspect-[16/9]">
              <img
                src={bike.coverPhotoUrl}
                alt={bike.nickname || bike.model || 'bike'}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Dark gradient at bottom so overlay text is readable. */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              {/* Bike name overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                {bike.year && (
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
                    {bike.year}
                  </div>
                )}
                <div className="mt-0.5 text-3xl font-bold text-white sm:text-4xl">
                  {bike.nickname || bike.model || 'Unnamed bike'}
                </div>
                {bike.nickname && bike.model && (
                  <div className="mt-0.5 text-[14px] text-white/70">
                    {bike.model}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6">
              {bike.year && (
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
                  {bike.year}
                </div>
              )}
              <div className="mt-0.5 text-3xl font-bold text-hd-text sm:text-4xl">
                {bike.nickname || bike.model || 'Unnamed bike'}
              </div>
              {bike.nickname && bike.model && (
                <div className="mt-0.5 text-[14px] text-hd-muted">
                  {bike.model}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Owner attribution sits below the hero for breathing room */}
        {bike.displayName && (
          <div className="mt-3 px-1 text-[13px] text-hd-muted">
            By <span className="text-hd-text">{bike.displayName}</span>
          </div>
        )}
      </section>

      {/* Stats grid */}
      <section className="px-4 pb-6 sm:px-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatTile
            label="Mileage"
            value={formatMileage(bike.mileage || 0)}
          />
          <StatTile
            label="Mods"
            value={String(totalMods)}
            suffix={totalMods === 1 ? 'item' : 'items'}
          />
          <StatTile
            label="Installed"
            value={String(installedCount)}
            tone={installedCount > 0 ? 'good' : 'muted'}
          />
          {serviceEntries.length > 0 && (
            <StatTile
              label="Services"
              value={String(serviceEntries.length)}
              suffix={
                serviceEntries.length === 1 ? 'entry' : 'entries'
              }
            />
          )}
        </div>
      </section>

      {/* Builds */}
      {builds.length > 0 && (
        <SectionHeader
          title="Builds"
          subtitle="Themed mod groupings."
        />
      )}
      {builds.map((b) => (
        <BuildSection
          key={b.id}
          build={b}
          mods={modsByBuild.get(b.id) || []}
        />
      ))}

      {/* Orphan mods */}
      {orphanMods.length > 0 && (
        <>
          <SectionHeader
            title={builds.length > 0 ? 'Other mods' : 'Mods'}
            subtitle="Parts not part of a named build."
          />
          <ModsSection mods={orphanMods} />
        </>
      )}

      {builds.length === 0 && orphanMods.length === 0 && (
        <section className="px-4 pb-6 sm:px-6">
          <div className="rounded-3xl bg-hd-dark p-6 text-center text-[14px] text-hd-muted">
            No mods listed yet — owner hasn't filled in their build sheet.
          </div>
        </section>
      )}

      {/* Service history (only entries the owner left as public) */}
      {serviceEntries.length > 0 && (
        <>
          <SectionHeader
            title="Service history"
            subtitle="Maintenance entries the owner published."
          />
          <ServiceSection entries={serviceEntries} />
        </>
      )}

      <footer className="px-6 pb-8 pt-6 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-hd-muted hover:text-hd-orange"
          title="Sidestand"
        >
          <span>Built on</span>
          <Logo size={14} />
          <span className="font-semibold">Sidestand</span>
        </a>
      </footer>
    </Shell>
  )
}

// ============================================================
// Layout primitives
// ============================================================

function Shell({ children }) {
  return (
    <div
      className="min-h-screen bg-hd-black pb-12 text-hd-text"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'max(3rem, env(safe-area-inset-bottom))'
      }}
    >
      <header className="sticky top-0 z-30 border-b border-white/5 bg-hd-black/85 backdrop-blur-xl">
        <div
          className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <a href="/" className="hover:opacity-80 transition" title="Sidestand">
            <Logo size={22} />
          </a>
          <a
            href="/"
            className="rounded-full border border-white/10 px-3.5 py-1.5 text-[12px] font-semibold text-hd-text hover:border-hd-orange hover:text-hd-orange"
          >
            Build your own
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-3xl">{children}</main>
    </div>
  )
}

function Centered({ children }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      {children}
    </div>
  )
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-2 flex items-end justify-between gap-3 px-5 pt-2 sm:px-7">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
          {title}
        </div>
        {subtitle && (
          <div className="mt-0.5 text-[13px] text-hd-muted">{subtitle}</div>
        )}
      </div>
      {action}
    </div>
  )
}

// ============================================================
// Stat tiles
// ============================================================

function StatTile({ label, value, suffix, tone }) {
  const valueClr =
    tone === 'good'
      ? 'text-emerald-400'
      : tone === 'muted'
      ? 'text-hd-muted'
      : 'text-hd-text'
  return (
    <div className="rounded-2xl bg-hd-dark px-4 py-3.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-hd-muted">
        {label}
      </div>
      <div
        className={`mt-1 text-lg font-bold tracking-tight sm:text-xl ${valueClr}`}
      >
        {value}
      </div>
      {suffix && (
        <div className="text-[10px] text-hd-muted">{suffix}</div>
      )}
    </div>
  )
}

// ============================================================
// Builds and mods
// ============================================================

function BuildSection({ build, mods }) {
  return (
    <section className="px-4 pb-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl bg-hd-dark">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 pb-3 pt-5">
          <div className="text-xl font-bold text-hd-text">
            {build.title || 'Untitled build'}
          </div>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-hd-muted">
            {build.status || 'planned'}
          </span>
        </div>
        {build.notes && (
          <div className="px-5 pb-4 text-[14px] leading-relaxed text-hd-text/85">
            {build.notes}
          </div>
        )}
        {mods.length > 0 ? (
          <ModsList mods={mods} />
        ) : (
          <div className="border-t border-white/5 px-5 py-4 text-[13px] text-hd-muted">
            No mods in this build yet.
          </div>
        )}
      </div>
    </section>
  )
}

// Top-level "orphan mods" container. Same visual treatment as a build,
// without the build header.
function ModsSection({ mods }) {
  return (
    <section className="px-4 pb-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl bg-hd-dark">
        <ModsList mods={mods} />
      </div>
    </section>
  )
}

function ModsList({ mods }) {
  // Group by category (alphabetical, "Uncategorized" floats to bottom).
  const byCategory = new Map()
  for (const m of mods) {
    const key = m.category || 'Uncategorized'
    const list = byCategory.get(key) || []
    list.push(m)
    byCategory.set(key, list)
  }
  const categories = [...byCategory.keys()].sort((a, b) => {
    if (a === 'Uncategorized') return 1
    if (b === 'Uncategorized') return -1
    return a.localeCompare(b)
  })

  return (
    <div>
      {categories.map((cat, ci) => (
        <div key={cat} className={ci > 0 ? 'border-t border-white/5' : ''}>
          <div className="px-5 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-hd-muted">
            {cat}
          </div>
          <ul>
            {byCategory.get(cat).map((m) => (
              <ModRow key={m.id} mod={m} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function ModRow({ mod }) {
  const meta = []
  if (mod.brand) meta.push(mod.brand)
  if (mod.partNumber) meta.push(`PN ${mod.partNumber}`)
  if (mod.vendor) meta.push(mod.vendor)
  return (
    <li className="border-t border-white/5 px-5 py-3 first:border-t-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <div className="text-[15px] font-medium text-hd-text">
              {mod.title || 'Untitled mod'}
            </div>
            <ModStatusPill status={mod.status} />
          </div>
          {meta.length > 0 && (
            <div className="mt-0.5 text-[12px] text-hd-muted">
              {meta.join(' · ')}
            </div>
          )}
          {mod.notes && (
            <div className="mt-1.5 whitespace-pre-wrap text-[13px] text-hd-muted/90">
              {mod.notes}
            </div>
          )}
        </div>
        <div className="shrink-0 text-right text-[12px] text-hd-muted">
          {mod.installDate && <div>{formatDate(mod.installDate)}</div>}
          {mod.installMileage != null && (
            <div className="mt-0.5">
              @ {formatMileage(Number(mod.installMileage))}
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

function ModStatusPill({ status }) {
  const map = {
    installed: 'bg-emerald-500/10 text-emerald-300',
    in_progress: 'bg-amber-500/10 text-amber-300',
    planned: 'bg-white/5 text-hd-muted',
    removed: 'bg-red-500/10 text-red-300'
  }
  const cls = map[status] || map.planned
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${cls}`}
    >
      {status || 'planned'}
    </span>
  )
}

// ============================================================
// Service history
// ============================================================

function ServiceSection({ entries }) {
  return (
    <section className="px-4 pb-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl bg-hd-dark">
        <ul>
          {entries.map((e, i) => (
            <li
              key={e.id}
              className={i > 0 ? 'border-t border-white/5' : ''}
            >
              <div className="flex items-start justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-medium text-hd-text">
                    {e.title || 'Service'}
                  </div>
                  {e.parts && (
                    <div className="mt-0.5 text-[12px] text-hd-muted">
                      {e.parts}
                    </div>
                  )}
                  {e.notes && (
                    <div className="mt-1.5 whitespace-pre-wrap text-[13px] text-hd-muted/90">
                      {e.notes}
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right text-[12px] text-hd-muted">
                  {e.date && <div>{formatDate(e.date)}</div>}
                  {e.mileage > 0 && (
                    <div className="mt-0.5">
                      @ {formatMileage(Number(e.mileage))}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
