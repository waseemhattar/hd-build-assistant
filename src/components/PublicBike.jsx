import React, { useEffect, useState } from 'react'
import { bikes as bikeCatalog } from '../data/bikes.js'
import { getPublicBikeBySlug } from '../data/storage.js'

// Public, unauthenticated build sheet. Rendered by App.jsx when the URL
// matches /b/<slug>. Server-side RLS only returns the row when the
// bike's is_public flag is true and a public_slug is set, so a 404 here
// usually means the rider unpublished the bike (or the slug is wrong).
//
// What's shown:
//   - Cover photo (if set), display name, year/family/model, mileage
//   - Builds, each with their mods grouped under the build
//   - Mods that don't belong to any build, grouped by category
// What's NOT shown:
//   - Service log (rider's maintenance history stays private)
//   - VIN, purchase date, notes, cost (we don't expose those at all,
//     even when the public RLS would technically permit it — keeping
//     the public payload minimal is a defense-in-depth thing)

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

  // Set the document title + a basic meta description while we're on this
  // page so link previews and tab titles are sensible. Cleanup on unmount
  // restores the app's defaults.
  useEffect(() => {
    if (state.status !== 'ready') return
    const { bike } = state.data
    const prevTitle = document.title
    const headline = bike.nickname || bike.model || `${bike.year || ''} bike`
    document.title = `${headline} · HD Build Assistant`
    return () => {
      document.title = prevTitle
    }
  }, [state])

  if (state.status === 'loading') {
    return (
      <Shell>
        <div className="card text-center text-sm text-hd-muted">
          Loading bike…
        </div>
      </Shell>
    )
  }
  if (state.status === 'not-found') {
    return (
      <Shell>
        <div className="card text-center">
          <div className="font-display text-2xl tracking-wider text-hd-orange">
            BIKE NOT FOUND
          </div>
          <p className="mt-2 text-sm text-hd-muted">
            This build sheet either doesn't exist or has been unpublished
            by the owner. Links from before it was unpublished will start
            working again if the owner re-publishes.
          </p>
          <a
            href="/"
            className="mt-4 inline-block rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-hd-black hover:brightness-110"
          >
            Build your own
          </a>
        </div>
      </Shell>
    )
  }
  if (state.status === 'error') {
    return (
      <Shell>
        <div className="card text-center">
          <div className="font-display text-2xl tracking-wider text-hd-orange">
            COULDN'T LOAD
          </div>
          <p className="mt-2 text-sm text-hd-muted">{state.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded border border-hd-border bg-hd-dark px-4 py-2 text-sm text-hd-text hover:border-hd-orange hover:text-hd-orange"
          >
            Try again
          </button>
        </div>
      </Shell>
    )
  }

  const { bike, builds, mods, serviceEntries = [] } = state.data
  const preset = bikeCatalog.find((p) => p.id === bike.bikeTypeId)

  // Bucket mods by buildId. Anything with a null/unknown buildId goes
  // into the "Other mods" bucket so it still gets surfaced.
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
      <div className="overflow-hidden rounded-md border border-hd-border bg-hd-dark">
        {bike.coverPhotoUrl ? (
          // object-contain (not cover) so the full bike fits regardless of
          // whether the rider uploaded a portrait or landscape shot. The
          // black backdrop fills any letterboxing and matches the page bg.
          <div className="flex max-h-[80vh] w-full items-center justify-center bg-hd-black">
            <img
              src={bike.coverPhotoUrl}
              alt={bike.nickname || bike.model || 'bike'}
              className="max-h-[80vh] w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex h-32 w-full items-center justify-center bg-hd-black/60 text-xs uppercase tracking-widest text-hd-muted">
            No cover photo
          </div>
        )}
        <div className="p-5 sm:p-6">
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            {bike.year} {preset?.family || ''}
          </div>
          <div className="mt-1 font-display text-3xl tracking-wider sm:text-4xl">
            {bike.nickname || bike.model || 'Unnamed bike'}
          </div>
          {bike.nickname && bike.model && (
            <div className="mt-1 text-sm text-hd-muted">{bike.model}</div>
          )}
          {preset && (
            <div className="mt-1 text-xs text-hd-muted">{preset.label}</div>
          )}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Stat label="Mileage" value={(bike.mileage || 0).toLocaleString()} />
            <Stat label="Mods" value={String(totalMods)} />
            <Stat label="Installed" value={String(installedCount)} />
            {serviceEntries.length > 0 && (
              <Stat label="Services" value={String(serviceEntries.length)} />
            )}
            {bike.displayName && (
              <Stat label="Owner" value={bike.displayName} />
            )}
          </div>
        </div>
      </div>

      {/* Builds */}
      {builds.length > 0 && (
        <section className="mt-6">
          <h2 className="font-display text-2xl tracking-wider text-hd-orange">
            BUILDS
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {builds.map((b) => (
              <BuildCard
                key={b.id}
                build={b}
                mods={modsByBuild.get(b.id) || []}
              />
            ))}
          </div>
        </section>
      )}

      {/* Orphan mods (not associated with a named build) */}
      {orphanMods.length > 0 && (
        <section className="mt-6">
          <h2 className="font-display text-2xl tracking-wider text-hd-orange">
            {builds.length > 0 ? 'OTHER MODS' : 'MODS'}
          </h2>
          <ModList mods={orphanMods} />
        </section>
      )}

      {builds.length === 0 && orphanMods.length === 0 && (
        <div className="mt-6 card text-center text-sm text-hd-muted">
          No mods listed yet — owner hasn't filled in their build sheet.
        </div>
      )}

      {/* Service history (only entries the owner left as public). Costs
          are deliberately omitted even when the entry is public — riders
          are happy to share what they did, less happy to share what
          they paid for it. */}
      {serviceEntries.length > 0 && (
        <section className="mt-6">
          <h2 className="font-display text-2xl tracking-wider text-hd-orange">
            SERVICE HISTORY
          </h2>
          <div className="mt-3 overflow-hidden rounded border border-hd-border">
            {serviceEntries.map((e, i) => (
              <ServiceRow
                key={e.id}
                entry={e}
                striped={i % 2 === 1}
              />
            ))}
          </div>
        </section>
      )}

      <footer className="mt-10 text-center text-xs text-hd-muted">
        Built on{' '}
        <a
          href="/"
          className="underline hover:text-hd-orange"
          title="HD Build Assistant home"
        >
          HD Build Assistant
        </a>
      </footer>
    </Shell>
  )
}

// Reusable shell that keeps spacing + the top brand bar consistent
// across loading / 404 / ready states. Deliberately minimal — no nav,
// no auth widgets, since this is a public page.
function Shell({ children }) {
  return (
    <div className="min-h-screen bg-hd-black text-hd-text">
      <header className="border-b border-hd-border bg-hd-dark">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <a
            href="/"
            className="font-display text-xl tracking-wider text-hd-orange hover:brightness-110"
          >
            HD BUILD ASSISTANT
          </a>
          <a
            href="/"
            className="text-xs uppercase tracking-widest text-hd-muted hover:text-hd-orange"
          >
            Build your own
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-hd-muted">
        {label}
      </div>
      <div className="font-display text-xl tracking-wider text-hd-text">
        {value}
      </div>
    </div>
  )
}

function BuildCard({ build, mods }) {
  return (
    <div className="card">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <div className="font-display text-xl tracking-wider text-hd-text">
          {build.title || 'Untitled build'}
        </div>
        <span className="rounded border border-hd-border bg-hd-black/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-hd-muted">
          {build.status || 'planned'}
        </span>
      </div>
      {build.notes && (
        <div className="mt-2 whitespace-pre-wrap text-sm text-hd-text">
          {build.notes}
        </div>
      )}
      {mods.length > 0 ? (
        <div className="mt-3">
          <ModList mods={mods} />
        </div>
      ) : (
        <div className="mt-3 text-xs text-hd-muted">
          No mods in this build yet.
        </div>
      )}
    </div>
  )
}

// Mod list grouped by category so a long build sheet reads tidily. Each
// row keeps to the public-friendly fields only (no cost, no source URL).
function ModList({ mods }) {
  const byCategory = new Map()
  for (const m of mods) {
    const key = m.category || 'Uncategorized'
    const list = byCategory.get(key) || []
    list.push(m)
    byCategory.set(key, list)
  }
  // Stable category order: alphabetical, but float "Uncategorized" to the end.
  const categories = [...byCategory.keys()].sort((a, b) => {
    if (a === 'Uncategorized') return 1
    if (b === 'Uncategorized') return -1
    return a.localeCompare(b)
  })
  return (
    <div className="grid grid-cols-1 gap-3">
      {categories.map((cat) => (
        <div key={cat}>
          <div className="mb-1 text-xs uppercase tracking-widest text-hd-muted">
            {cat}
          </div>
          <div className="overflow-hidden rounded border border-hd-border">
            {byCategory.get(cat).map((m, i) => (
              <ModRow key={m.id} mod={m} striped={i % 2 === 1} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// One row in the public service-history list. Mirrors ModRow's layout
// so the two sections feel related, but trims to service-relevant fields.
function ServiceRow({ entry, striped }) {
  return (
    <div
      className={`flex flex-col gap-1 px-3 py-2 sm:flex-row sm:items-baseline sm:justify-between ${
        striped ? 'bg-hd-black/30' : ''
      }`}
    >
      <div className="min-w-0">
        <div className="text-sm text-hd-text">
          {entry.title || 'Service'}
        </div>
        {entry.parts && (
          <div className="text-xs text-hd-muted">{entry.parts}</div>
        )}
        {entry.notes && (
          <div className="mt-1 whitespace-pre-wrap text-xs text-hd-muted">
            {entry.notes}
          </div>
        )}
      </div>
      <div className="text-right text-xs text-hd-muted">
        {entry.date && <div>{entry.date}</div>}
        {entry.mileage > 0 && (
          <div>@ {Number(entry.mileage).toLocaleString()} mi</div>
        )}
      </div>
    </div>
  )
}

function ModRow({ mod, striped }) {
  const meta = []
  if (mod.brand) meta.push(mod.brand)
  if (mod.partNumber) meta.push(`PN ${mod.partNumber}`)
  if (mod.vendor) meta.push(mod.vendor)
  return (
    <div
      className={`flex flex-col gap-1 px-3 py-2 sm:flex-row sm:items-baseline sm:justify-between ${
        striped ? 'bg-hd-black/30' : ''
      }`}
    >
      <div>
        <div className="text-sm text-hd-text">
          {mod.title || 'Untitled mod'}
          <span
            className={`ml-2 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-widest ${
              mod.status === 'installed'
                ? 'border border-green-700 bg-green-900/30 text-green-400'
                : mod.status === 'in_progress'
                ? 'border border-amber-700 bg-amber-900/30 text-amber-300'
                : 'border border-hd-border bg-hd-black/40 text-hd-muted'
            }`}
          >
            {mod.status || 'planned'}
          </span>
        </div>
        {meta.length > 0 && (
          <div className="text-xs text-hd-muted">{meta.join(' · ')}</div>
        )}
        {mod.notes && (
          <div className="mt-1 whitespace-pre-wrap text-xs text-hd-muted">
            {mod.notes}
          </div>
        )}
      </div>
      <div className="text-right text-xs text-hd-muted">
        {mod.installDate && <div>Installed {mod.installDate}</div>}
        {mod.installMileage != null && (
          <div>@ {Number(mod.installMileage).toLocaleString()} mi</div>
        )}
      </div>
    </div>
  )
}
