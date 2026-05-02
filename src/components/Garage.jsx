import React, { useEffect, useMemo, useRef, useState } from 'react'
import { bikes as bikeCatalog } from '../data/bikes.js'
import {
  getGarage,
  addBike,
  updateBike,
  removeBike,
  setBikePublic,
  uploadCoverPhoto,
  uploadUserLogo,
  getUserLogoUrl,
  setUserLogoUrl,
  getServiceLog,
  getMods,
  subscribe
} from '../data/storage.js'
import {
  intervals,
  evaluateInterval,
  findLastMatchingEntry
} from '../data/serviceIntervals.js'
import { formatMileage, distanceUnitLabel, isMetric } from '../data/userPrefs.js'
import {
  decodeVinLocal,
  decodeVinRemote,
  matchToBikeCatalog,
  normalizeVin
} from '../data/vinDecoder.js'
import StickyActionBar from './ui/StickyActionBar.jsx'
import EmptyState from './ui/EmptyState.jsx'
import BottomSheet from './ui/BottomSheet.jsx'

// The Garage is where members list the bikes they own. Each bike has a
// current mileage, which drives the maintenance-due dashboard in the
// Service Book.

export default function Garage({ onBack, onOpenBike, onOpenServiceBook }) {
  const [garage, setGarage] = useState(() => getGarage())
  const [editing, setEditing] = useState(null) // bike or {new:true}
  const [confirmingRemove, setConfirmingRemove] = useState(null)
  const [sharing, setSharing] = useState(null) // bike to share/publish
  const [brandOpen, setBrandOpen] = useState(false) // brand-settings modal

  function refresh() {
    setGarage(getGarage())
  }

  // Re-render whenever the background pull from Supabase refreshes the cache,
  // so bikes added on another device show up without a manual reload.
  useEffect(() => {
    const unsub = subscribe(() => setGarage(getGarage()))
    return unsub
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-4 sm:px-6 sm:pb-24 sm:pt-8">
      <header className="mb-5 flex items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
            Garage
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-hd-text sm:text-4xl">
            Your bikes
          </h1>
          <p className="mt-1 text-[14px] text-hd-muted">
            {garage.length === 0
              ? 'Add a bike to start tracking service, mods, and rides.'
              : `${garage.length} bike${garage.length > 1 ? 's' : ''} in the garage.`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setBrandOpen(true)}
            className="rounded-full bg-hd-dark px-3.5 py-1.5 text-[12px] font-semibold text-hd-muted hover:text-hd-text"
            title="Upload your own logo"
          >
            Logo
          </button>
          <button
            onClick={() => setEditing({ new: true })}
            className="rounded-full bg-hd-orange px-4 py-1.5 text-[13px] font-semibold text-white"
          >
            + Add
          </button>
        </div>
      </header>

      {garage.length === 0 && !editing && (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21V9l9-6 9 6v12" />
              <path d="M7 21V11h10v10" />
              <path d="M9 14h6M9 17h6" />
            </svg>
          }
          title="Your garage is empty"
          description="Add your first bike and Sidestand will track service intervals, log mods, and give you a public build sheet you can share."
          ctaLabel="Add a bike"
          onCtaClick={() => setEditing({ new: true })}
        />
      )}

      {garage.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {garage.map((b) => (
            <BikeCard
              key={b.id}
              bike={b}
              onEdit={() => setEditing(b)}
              onRemove={() => setConfirmingRemove(b)}
              onShare={() => setSharing(b)}
              onOpenServiceBook={() => onOpenServiceBook(b)}
              onOpenJobs={() => onOpenBike(b)}
            />
          ))}
        </div>
      )}

      {editing && (
        <BikeEditor
          bike={editing.new ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={(patch) => {
            if (editing.new) {
              addBike(patch)
            } else {
              updateBike(editing.id, patch)
            }
            setEditing(null)
            refresh()
          }}
        />
      )}

      {confirmingRemove && (
        <ConfirmRemove
          bike={confirmingRemove}
          onCancel={() => setConfirmingRemove(null)}
          onConfirm={() => {
            removeBike(confirmingRemove.id)
            setConfirmingRemove(null)
            refresh()
          }}
        />
      )}

      {sharing && (
        <ShareSheet
          bike={sharing}
          onClose={() => {
            setSharing(null)
            refresh()
          }}
          onChange={refresh}
        />
      )}

      {brandOpen && (
        <BrandSettings onClose={() => setBrandOpen(false)} />
      )}

      {/* Sticky bottom action bar — pinned primary CTA so it's always
          visible while the user scrolls through their bikes. Only
          shown when there are bikes; the empty state has its own CTA. */}
      {garage.length > 0 && (
        <StickyActionBar>
          <button
            onClick={() => setEditing({ new: true })}
            className="w-full rounded-full bg-hd-orange px-6 py-3 text-[15px] font-semibold text-white transition active:scale-95"
          >
            + Add a bike
          </button>
        </StickyActionBar>
      )}
    </div>
  )
}

// Lets the user upload (or remove) a custom brand logo. The URL is
// stored locally for now; later, when we add a real shop concept,
// we'll save it on the shop row instead. The Logo component already
// reads the URL via getUserLogoUrl() so the brand bar updates live.
function BrandSettings({ onClose }) {
  const [logoUrl, setLogoUrl] = useState(() => getUserLogoUrl())
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState(null)
  const fileRef = useRef(null)

  async function pick(file) {
    if (!file) return
    setErr(null)
    setUploading(true)
    try {
      const url = await uploadUserLogo(file)
      setLogoUrl(url)
    } catch (e) {
      setErr(e.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  function reset() {
    setUserLogoUrl(null)
    setLogoUrl(null)
  }

  return (
    <BottomSheet open={true} onClose={onClose} size="md">
      <BottomSheet.Header
        title="Brand"
        subtitle="Upload your own logo to replace the default Sidestand wordmark."
        onClose={onClose}
      />

      <div className="mb-4 rounded-2xl bg-hd-black p-4">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-hd-muted">
          Current
        </div>
        <div className="flex items-center justify-center rounded-xl bg-hd-dark py-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Your logo"
              style={{ height: 40, width: 'auto' }}
            />
          ) : (
            <span className="font-display tracking-wider text-3xl text-hd-text">
              SIDESTAND
            </span>
          )}
        </div>
      </div>

      {err && (
        <div className="mb-3 rounded-2xl bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {err}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="rounded-full bg-hd-orange px-5 py-2.5 text-sm font-semibold text-white transition active:scale-95 disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : logoUrl ? 'Replace logo' : 'Upload logo'}
        </button>
        {logoUrl && (
          <button
            onClick={reset}
            disabled={uploading}
            className="rounded-full bg-hd-card px-5 py-2.5 text-sm text-hd-muted transition active:scale-95 disabled:opacity-50"
          >
            Reset to default
          </button>
        )}
      </div>
    </BottomSheet>
  )
}

function BikeCard({ bike, onEdit, onRemove, onShare, onOpenServiceBook, onOpenJobs }) {
  const preset = bikeCatalog.find((p) => p.id === bike.bikeTypeId)

  // Surface a few cheap stats inside the card so users get signal at a
  // glance without having to drill in. All reads hit local cache.
  const modCount = useMemo(() => getMods(bike.id).length, [bike.id])
  const nextDue = useMemo(() => computeNextDue(bike), [bike.id, bike.mileage])

  return (
    <article className="overflow-hidden rounded-3xl bg-hd-dark transition active:scale-[0.995]">
      {bike.coverPhotoUrl ? (
        <button
          type="button"
          onClick={onOpenServiceBook}
          className="block w-full"
          title="Open service book"
        >
          <div className="aspect-[16/10] w-full bg-hd-black">
            <img
              src={bike.coverPhotoUrl}
              alt={bike.nickname || bike.model || 'bike'}
              className="h-full w-full object-cover"
            />
          </div>
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpenServiceBook}
          className="flex aspect-[16/10] w-full items-center justify-center bg-hd-card"
          title="Open service book"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-hd-muted">
            No cover photo
          </span>
        </button>
      )}

      <div className="p-5">
        {/* Heading row: year/family + public pill */}
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
            {bike.year} {preset?.family || ''}
          </div>
          {bike.isPublic && (
            <span
              title="This bike has a public build sheet you can share"
              className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Public
            </span>
          )}
        </div>

        {/* Bike name */}
        <div className="mt-1 text-2xl font-bold tracking-tight text-hd-text">
          {bike.nickname || bike.model || 'Unnamed bike'}
        </div>
        {bike.nickname && bike.model && (
          <div className="text-[13px] text-hd-muted">{bike.model}</div>
        )}

        {/* Stat strip: mileage / mods / next-due */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat
            label="Mileage"
            value={
              isMetric()
                ? Math.round((bike.mileage || 0) * 1.609344).toLocaleString()
                : (bike.mileage || 0).toLocaleString()
            }
            unit={distanceUnitLabel()}
          />
          <Stat
            label="Mods"
            value={String(modCount)}
            unit={modCount === 1 ? 'item' : 'items'}
          />
          <NextDueChip nextDue={nextDue} />
        </div>

        {/* Primary CTA: open service book */}
        <button
          onClick={onOpenServiceBook}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-hd-orange px-4 py-3 text-[15px] font-semibold text-white transition active:scale-95"
        >
          Open service book
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="13 6 19 12 13 18" />
          </svg>
        </button>

        {/* Secondary actions: icon buttons */}
        <div className="mt-3 flex items-center justify-end gap-1.5">
          {preset && (
            <IconButton
              onClick={onOpenJobs}
              label="Browse jobs"
              title="Browse manual procedures for this platform"
            >
              <svg
                viewBox="0 0 24 24" width="16" height="16"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M4 4h16v16H4z" />
                <line x1="8" y1="9" x2="16" y2="9" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="13" y2="17" />
              </svg>
            </IconButton>
          )}
          <IconButton
            onClick={onShare}
            label={bike.isPublic ? 'Share link' : 'Share'}
            title="Publish a public build sheet"
          >
            <svg
              viewBox="0 0 24 24" width="16" height="16"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
              <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
            </svg>
          </IconButton>
          <IconButton onClick={onEdit} label="Edit" title="Edit bike details">
            <svg
              viewBox="0 0 24 24" width="16" height="16"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </IconButton>
          <IconButton
            onClick={onRemove}
            label="Remove"
            title="Remove this bike"
            danger
          >
            <svg
              viewBox="0 0 24 24" width="16" height="16"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </IconButton>
        </div>
      </div>
    </article>
  )
}

// ---------- Bike-card sub-bits ----------

function Stat({ label, value, unit }) {
  return (
    <div className="rounded-2xl bg-hd-black/40 px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-hd-muted">
        {label}
      </div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="text-lg font-bold leading-none tracking-tight text-hd-text">
          {value}
        </span>
        {unit && (
          <span className="text-[10px] text-hd-muted">{unit}</span>
        )}
      </div>
    </div>
  )
}

// Replaces the third stat slot. Three states:
//   - none due       → green "All caught up"
//   - overdue        → red "Overdue"
//   - due soon       → amber "Due in N mi"
function NextDueChip({ nextDue }) {
  if (!nextDue) {
    return (
      <div className="rounded-2xl bg-hd-black/40 px-3 py-2">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-hd-muted">
          Next due
        </div>
        <div className="mt-0.5 truncate text-xs font-medium text-emerald-400">
          All caught up
        </div>
      </div>
    )
  }
  const overdue = nextDue.status === 'overdue'
  return (
    <div
      className={`rounded-2xl px-3 py-2 ${
        overdue
          ? 'bg-red-500/10'
          : 'bg-amber-500/10'
      }`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-hd-muted">
        {overdue ? 'Overdue' : 'Due soon'}
      </div>
      <div
        className={`mt-0.5 truncate text-xs ${
          overdue ? 'text-red-300' : 'text-amber-200'
        }`}
        title={nextDue.intervalLabel}
      >
        {overdue
          ? `${nextDue.intervalLabel} (${formatMileage(nextDue.milesOver)} over)`
          : `${nextDue.intervalLabel} in ${formatMileage(nextDue.milesLeft)}`}
      </div>
    </div>
  )
}

function IconButton({ onClick, children, label, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title || label}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded border border-hd-border bg-hd-dark text-hd-muted transition hover:border-hd-orange hover:text-hd-text ${
        danger ? 'hover:border-red-500 hover:text-red-400' : ''
      }`}
    >
      {children}
    </button>
  )
}

// Compute the most-pressing service interval for one bike. Returns
// the worst (overdue first, then due-soon nearest miles) or null if
// nothing is overdue/due-soon. Cheap: only walks the intervals + log.
function computeNextDue(bike) {
  const log = getServiceLog(bike.id)
  const mi = bike.mileage || 0
  let best = null
  for (const interval of intervals) {
    const last = findLastMatchingEntry(interval, log)
    const ev = evaluateInterval(interval, mi, last)
    if (ev.status !== 'overdue' && ev.status !== 'due-soon') continue
    const candidate = {
      intervalLabel: interval.label,
      status: ev.status,
      milesLeft: ev.milesLeft || 0,
      milesOver: ev.milesOver || 0
    }
    if (!best) {
      best = candidate
      continue
    }
    // Overdue beats due-soon. Within overdue, more miles over wins.
    // Within due-soon, fewer miles left wins.
    if (candidate.status === 'overdue' && best.status !== 'overdue') {
      best = candidate
    } else if (
      candidate.status === 'overdue' &&
      best.status === 'overdue' &&
      candidate.milesOver > best.milesOver
    ) {
      best = candidate
    } else if (
      candidate.status === 'due-soon' &&
      best.status === 'due-soon' &&
      candidate.milesLeft < best.milesLeft
    ) {
      best = candidate
    }
  }
  return best
}

function BikeEditor({ bike, onCancel, onSave }) {
  const [form, setForm] = useState(() => ({
    bikeTypeId: bike?.bikeTypeId || bikeCatalog[0]?.id || '',
    year: bike?.year || bikeCatalog[0]?.year || new Date().getFullYear(),
    model: bike?.model || '',
    nickname: bike?.nickname || '',
    vin: bike?.vin || '',
    mileage: bike?.mileage ?? '',
    purchaseDate: bike?.purchaseDate || '',
    notes: bike?.notes || '',
    // Public-page profile fields. displayName is what shows up as the
    // owner credit on /b/<slug>; coverPhotoUrl is the hero image. We
    // surface them on every bike edit (not just when publishing) so the
    // user can prep the page before flipping the toggle.
    displayName: bike?.displayName || '',
    coverPhotoUrl: bike?.coverPhotoUrl || ''
  }))

  // Photo upload state is local because the upload happens *now* (on file
  // pick) rather than on form submit — Supabase Storage gives us back a
  // URL synchronously per file, which is then patched onto the bike row.
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')

  // VIN decoder state. `local` is instant and recomputed on every keystroke;
  // `remote` only runs when the user has a full 17-char VIN (auto or on
  // pressing the Decode button) and holds the NHTSA response.
  const local = useMemo(() => decodeVinLocal(form.vin), [form.vin])
  const [remote, setRemote] = useState(null)
  const [decoding, setDecoding] = useState(false)
  const [autoDecoded, setAutoDecoded] = useState(false)
  const abortRef = useRef(null)

  // When the user picks a preset, auto-fill year + a reasonable default model.
  function pickPreset(id) {
    const preset = bikeCatalog.find((p) => p.id === id)
    setForm((f) => ({
      ...f,
      bikeTypeId: id,
      year: preset?.year || f.year,
      model: f.model || preset?.models?.[0] || ''
    }))
  }

  // Kick off a NHTSA decode. Safe to call anytime — if the VIN isn't 17
  // chars it just no-ops. `autofill`=true will fill empty form fields with
  // the decoded data; the manual "Decode" button passes autofill=true.
  async function runRemoteDecode({ autofill } = { autofill: true }) {
    const vin = normalizeVin(form.vin)
    if (vin.length !== 17) return
    // Cancel any in-flight decode so a fast typist doesn't stack requests.
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setDecoding(true)
    const result = await decodeVinRemote(vin, { signal: ctrl.signal })
    setDecoding(false)
    if (result.reason === 'aborted') return
    setRemote(result)

    if (!autofill || !result.ok) return

    const patch = {}
    if (result.year && !form.year) patch.year = result.year
    if (result.year) patch.year = patch.year ?? result.year

    // Upgrade model name via catalog if we can.
    const match = matchToBikeCatalog(result)
    if (result.model && !form.model) {
      const friendly = upgradeModel(result.model, match.entry)
      patch.model = friendly
    }
    if (match.id && !form.bikeTypeId) {
      patch.bikeTypeId = match.id
    }
    // If the matched catalog entry differs from the current one and we're
    // reasonably confident, upgrade it.
    if (match.id && match.confidence === 'exact' && form.bikeTypeId !== match.id) {
      patch.bikeTypeId = match.id
    }

    if (Object.keys(patch).length) {
      setForm((f) => ({ ...f, ...patch }))
      setAutoDecoded(true)
    }
  }

  // Auto-decode when the user reaches 17 characters for the first time.
  useEffect(() => {
    const vin = normalizeVin(form.vin)
    if (vin.length === 17 && !remote && !decoding) {
      runRemoteDecode({ autofill: true })
    }
    if (vin.length !== 17 && remote) {
      // User edited the VIN down; clear stale decode.
      setRemote(null)
      setAutoDecoded(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.vin])

  // Clean up any pending request on unmount.
  useEffect(() => () => abortRef.current?.abort(), [])

  function submit(e) {
    e.preventDefault()
    onSave({
      ...form,
      year: Number(form.year) || null,
      mileage: Number(form.mileage) || 0
    })
  }

  const preset = bikeCatalog.find((p) => p.id === form.bikeTypeId)

  return (
    <BottomSheet open={true} onClose={onCancel} size="lg">
      <BottomSheet.Header
        title={bike ? 'Edit bike' : 'Add bike'}
        subtitle={
          bike
            ? 'Update specs, mileage, and the public-page profile.'
            : 'Add a bike to track service, mods, and rides.'
        }
        onClose={onCancel}
      />
      <form onSubmit={submit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Platform" wide>
            <select
              value={form.bikeTypeId}
              onChange={(e) => pickPreset(e.target.value)}
              className="input"
            >
              {bikeCatalog.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Year">
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="input"
              min={1900}
              max={2100}
              required
            />
          </Field>

          <Field label="Model">
            <select
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              className="input"
            >
              <option value="">— pick a model —</option>
              {(preset?.models || []).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Nickname (optional)">
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              className="input"
              placeholder="e.g. Old Faithful"
            />
          </Field>

          <Field label="Current mileage">
            <input
              type="number"
              value={form.mileage}
              onChange={(e) => setForm({ ...form, mileage: e.target.value })}
              className="input"
              min={0}
              required
            />
          </Field>

          <Field label="VIN (optional — auto-decodes 17-char Harley VINs)" wide>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.vin}
                onChange={(e) => {
                  // Uppercase and strip banned VIN chars (I/O/Q) + whitespace
                  // so the user can't get into an invalid state by typing or
                  // pasting. normalizeVin handles both.
                  setForm({ ...form, vin: normalizeVin(e.target.value) })
                }}
                className="input flex-1 font-mono uppercase"
                maxLength={17}
                placeholder="e.g. 1HD1KHM18LB610234"
              />
              <button
                type="button"
                onClick={() => runRemoteDecode({ autofill: true })}
                disabled={normalizeVin(form.vin).length !== 17 || decoding}
                className="rounded border border-hd-border bg-hd-dark px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-hd-text hover:border-hd-orange hover:text-hd-orange disabled:opacity-40 disabled:hover:border-hd-border disabled:hover:text-hd-text"
                title="Look up this VIN via the NHTSA public database"
              >
                {decoding ? 'Decoding…' : 'Decode'}
              </button>
            </div>
            <VinChip
              vin={form.vin}
              local={local}
              remote={remote}
              decoding={decoding}
              autoDecoded={autoDecoded}
            />
          </Field>

          <Field label="Purchase date (optional)">
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) =>
                setForm({ ...form, purchaseDate: e.target.value })
              }
              className="input"
            />
          </Field>

          <Field label="Notes (optional)" wide>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input min-h-[80px]"
              placeholder="Mods, quirks, tuneup notes..."
            />
          </Field>

          <Field
            label="Owner display name (optional — shown on public build page)"
            wide
          >
            <input
              type="text"
              value={form.displayName}
              onChange={(e) =>
                setForm({ ...form, displayName: e.target.value })
              }
              className="input"
              placeholder="e.g. Waseem H."
              maxLength={60}
            />
          </Field>

          <Field
            label="Cover photo (optional — shown at the top of the public page)"
            wide
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              {form.coverPhotoUrl ? (
                <div className="relative">
                  <img
                    src={form.coverPhotoUrl}
                    alt="cover"
                    className="h-24 w-40 rounded border border-hd-border object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-40 items-center justify-center rounded border border-dashed border-hd-border text-xs text-hd-muted">
                  No photo
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  disabled={photoUploading || !bike}
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file || !bike) return
                    setPhotoError('')
                    setPhotoUploading(true)
                    try {
                      const url = await uploadCoverPhoto(bike.id, file)
                      setForm((f) => ({ ...f, coverPhotoUrl: url }))
                    } catch (err) {
                      setPhotoError(err?.message || 'Upload failed.')
                    } finally {
                      setPhotoUploading(false)
                      // Reset the input so the same file can be re-picked.
                      e.target.value = ''
                    }
                  }}
                  className="block w-full text-xs text-hd-muted file:mr-3 file:rounded file:border file:border-hd-border file:bg-hd-dark file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-widest file:text-hd-text hover:file:border-hd-orange hover:file:text-hd-orange disabled:opacity-40"
                />
                {!bike && (
                  <div className="mt-2 text-xs text-hd-muted">
                    Save the bike first, then come back here to upload a
                    photo.
                  </div>
                )}
                {photoUploading && (
                  <div className="mt-2 text-xs text-hd-muted">Uploading…</div>
                )}
                {photoError && (
                  <div className="mt-2 text-xs text-amber-400">
                    ⚠ {photoError}
                  </div>
                )}
                {form.coverPhotoUrl && !photoUploading && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, coverPhotoUrl: '' }))
                    }
                    className="mt-2 text-xs text-hd-muted underline hover:text-hd-orange"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </Field>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-hd-card px-5 py-3 text-sm text-hd-muted transition active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-hd-orange px-5 py-3 text-sm font-semibold text-white transition active:scale-95"
          >
            {bike ? 'Save changes' : 'Add to garage'}
          </button>
        </div>
      </form>
    </BottomSheet>
  )
}

// Tiny status chip shown under the VIN field. States:
//  - empty      → nothing rendered
//  - partial    → "12/17 characters"
//  - invalid    → red warning
//  - valid + not HD → amber "not a Harley VIN"
//  - valid + HD + decoding → "Looking up…"
//  - valid + HD + decoded (hit)  → green "2020 FLHR Road King — auto-filled"
//  - valid + HD + decoded (miss) → amber "NHTSA didn't recognize this VIN"
function VinChip({ vin, local, remote, decoding, autoDecoded }) {
  const norm = normalizeVin(vin)
  if (!norm) return null

  if (local.partial) {
    return (
      <div className="mt-2 text-xs text-hd-muted">{local.reason}</div>
    )
  }

  if (!local.valid) {
    return (
      <div className="mt-2 text-xs text-amber-400">⚠ {local.reason}</div>
    )
  }

  if (local.valid && !local.isHarley) {
    return (
      <div className="mt-2 text-xs text-amber-400">
        ⚠ WMI "{local.wmi}" isn't a known Harley-Davidson prefix. You can
        still save this bike manually.
      </div>
    )
  }

  if (decoding) {
    return (
      <div className="mt-2 text-xs text-hd-muted">
        ✓ Harley VIN — looking up details…
      </div>
    )
  }

  if (remote && remote.ok) {
    const parts = []
    if (remote.year) parts.push(remote.year)
    if (remote.make) parts.push(remote.make)
    if (remote.model) parts.push(remote.model)
    return (
      <div className="mt-2 text-xs text-green-400">
        ✓ {parts.join(' ')}
        {remote.engineDisplacementL && ` · ${remote.engineDisplacementL}L`}
        {remote.plant && ` · built in ${remote.plant}`}
        {autoDecoded && (
          <span className="ml-1 text-hd-muted">— auto-filled below</span>
        )}
      </div>
    )
  }

  if (remote && !remote.ok) {
    return (
      <div className="mt-2 text-xs text-amber-400">
        ⚠ Couldn't look up via NHTSA: {remote.reason}. Year detected locally:{' '}
        {local.year || 'unknown'}.
      </div>
    )
  }

  // Valid HD VIN, remote not yet triggered.
  return (
    <div className="mt-2 text-xs text-hd-muted">
      ✓ Looks like a Harley VIN
      {local.year && ` — model year ${local.year}`}
      . Press Decode for full details.
    </div>
  )
}

// Turn "FLHR" into "FLHR Road King" if the catalog knows it.
function upgradeModel(nhtsaModel, catalogEntry) {
  if (!nhtsaModel) return ''
  if (!catalogEntry) return nhtsaModel
  const token = nhtsaModel.split(/\s+/)[0].toUpperCase()
  const hit = (catalogEntry.models || []).find(
    (m) => m.split(/\s+/)[0].toUpperCase() === token
  )
  return hit || nhtsaModel
}

function Field({ label, wide, children }) {
  return (
    <label className={`block text-sm ${wide ? 'sm:col-span-2' : ''}`}>
      <div className="mb-1 text-xs uppercase tracking-widest text-hd-muted">
        {label}
      </div>
      {children}
    </label>
  )
}

// Modal that toggles a bike's public visibility, mints a slug on first
// publish, and gives the rider a copy-friendly URL to send around. We
// show the same modal whether the bike is currently public or private —
// just with different controls.
function ShareSheet({ bike, onClose, onChange }) {
  // Resolve public-page origin from the current location. Works in dev
  // (localhost:5173/b/...) and in prod (harley.h-dbuilds.com/b/...).
  const origin =
    typeof window !== 'undefined' && window.location ? window.location.origin : ''
  const [current, setCurrent] = useState(bike)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  const url = current.publicSlug ? `${origin}/b/${current.publicSlug}` : ''

  async function togglePublic(next) {
    setBusy(true)
    try {
      const updated = setBikePublic(current.id, next)
      if (updated) setCurrent(updated)
      onChange?.()
    } finally {
      setBusy(false)
    }
  }

  async function copyLink() {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard can fail in iframes / insecure contexts; fall back to
      // selecting the text so the user can copy manually.
      const el = document.getElementById('share-url-input')
      if (el && el.select) el.select()
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-md border border-hd-border bg-hd-dark p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wider text-hd-orange">
            SHARE BIKE
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-hd-muted hover:text-hd-orange"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-hd-muted">
          Publish a public build sheet for{' '}
          <span className="text-hd-text">
            {current.nickname || current.model || 'this bike'}
          </span>
          . Anyone with the link can see your bike's identity, builds, and
          mods. Service history stays private.
        </p>

        <div className="mt-4 flex items-center justify-between rounded border border-hd-border bg-hd-black/40 px-3 py-2">
          <div>
            <div className="text-xs uppercase tracking-widest text-hd-muted">
              Public page
            </div>
            <div className="text-sm text-hd-text">
              {current.isPublic ? 'On — link works' : 'Off — link returns 404'}
            </div>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => togglePublic(!current.isPublic)}
            className={`rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-widest disabled:opacity-40 ${
              current.isPublic
                ? 'border border-hd-border bg-hd-dark text-hd-text hover:border-red-500 hover:text-red-400'
                : 'bg-hd-orange text-white hover:brightness-110'
            }`}
          >
            {current.isPublic ? 'Unpublish' : 'Publish'}
          </button>
        </div>

        {current.publicSlug && (
          <div className="mt-4">
            <div className="mb-1 text-xs uppercase tracking-widest text-hd-muted">
              Shareable link
            </div>
            <div className="flex gap-2">
              <input
                id="share-url-input"
                readOnly
                value={url}
                onFocus={(e) => e.target.select()}
                className="input flex-1 font-mono text-xs"
              />
              <button
                type="button"
                onClick={copyLink}
                className="rounded border border-hd-border bg-hd-dark px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-hd-text hover:border-hd-orange hover:text-hd-orange"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            {current.isPublic && (
              <div className="mt-2 text-xs text-hd-muted">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-hd-orange"
                >
                  Open page in a new tab ↗
                </a>
              </div>
            )}
          </div>
        )}

        {!current.coverPhotoUrl && (
          <div className="mt-4 rounded border border-hd-border bg-hd-black/40 px-3 py-2 text-xs text-hd-muted">
            Tip: add a cover photo from the bike's <em>Edit</em> screen so
            your build sheet has a hero image.
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded border border-hd-border bg-hd-dark px-4 py-2 text-sm text-hd-muted hover:border-hd-orange hover:text-hd-text"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfirmRemove({ bike, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-md border border-hd-border bg-hd-dark p-5"
      >
        <h2 className="font-display text-xl tracking-wider text-hd-orange">
          REMOVE BIKE?
        </h2>
        <p className="mt-2 text-sm text-hd-muted">
          This will remove{' '}
          <span className="text-hd-text">
            {bike.nickname || bike.model || 'this bike'}
          </span>{' '}
          and its service history. You can't undo this.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded border border-hd-border bg-hd-dark px-4 py-2 text-sm text-hd-muted hover:border-hd-orange hover:text-hd-text"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
