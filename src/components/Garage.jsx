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
  subscribe
} from '../data/storage.js'
import {
  decodeVinLocal,
  decodeVinRemote,
  matchToBikeCatalog,
  normalizeVin
} from '../data/vinDecoder.js'

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
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
      >
        ← Back
      </button>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wider text-hd-orange sm:text-4xl">
            MY GARAGE
          </h1>
          <p className="mt-1 text-sm text-hd-muted">
            Track every bike you own, log the work you do, and keep an
            eye on what's due next. Harley's service intervals are used
            only as a soft reference — ride and wrench how you like.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 self-start">
          <button
            onClick={() => setBrandOpen(true)}
            className="rounded border border-hd-border bg-hd-dark px-3 py-2 text-sm text-hd-muted hover:border-hd-orange hover:text-hd-text"
            title="Upload your own brand logo"
          >
            Brand
          </button>
          <button
            onClick={() => setEditing({ new: true })}
            className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            + Add bike
          </button>
        </div>
      </div>

      {garage.length === 0 && !editing && (
        <div className="card text-center">
          <div className="mb-2 font-display text-xl tracking-wider">
            No bikes yet.
          </div>
          <p className="mb-4 text-sm text-hd-muted">
            Add your first bike to start logging service.
          </p>
          <button
            onClick={() => setEditing({ new: true })}
            className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            + Add bike
          </button>
        </div>
      )}

      {garage.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-md border border-hd-border bg-hd-dark p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wider text-hd-orange">
            BRAND
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-hd-muted hover:text-hd-orange"
          >
            ×
          </button>
        </div>

        <p className="mb-4 text-sm text-hd-muted">
          Upload your own logo to replace the default Sidestand wordmark
          across the app. PNG with transparent background works best.
          Square or wide horizontal both work.
        </p>

        <div className="mb-4 rounded border border-hd-border bg-hd-black p-4">
          <div className="mb-2 text-xs uppercase tracking-widest text-hd-muted">
            Current
          </div>
          <div className="flex items-center justify-center rounded bg-hd-dark py-4">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Your logo"
                style={{ height: 40, width: 'auto' }}
              />
            ) : (
              <span className="font-light tracking-wordmark text-2xl text-hd-text">
                sidestand
              </span>
            )}
          </div>
        </div>

        {err && (
          <div className="mb-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
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
            className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : logoUrl ? 'Replace logo' : 'Upload logo'}
          </button>
          {logoUrl && (
            <button
              onClick={reset}
              disabled={uploading}
              className="rounded border border-hd-border bg-hd-dark px-4 py-2 text-sm text-hd-muted hover:border-hd-orange hover:text-hd-text disabled:opacity-50"
            >
              Reset to default
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function BikeCard({ bike, onEdit, onRemove, onShare, onOpenServiceBook, onOpenJobs }) {
  const preset = bikeCatalog.find((p) => p.id === bike.bikeTypeId)
  return (
    <div className="card flex flex-col">
      {bike.coverPhotoUrl && (
        // object-contain on a fixed-height black frame so the whole bike
        // shows on the card regardless of photo orientation. The black
        // background blends with the card border on letterboxed shots.
        <div className="-mx-4 -mt-4 mb-3 sm:-mx-5 sm:-mt-5">
          <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-t-md bg-hd-black">
            <img
              src={bike.coverPhotoUrl}
              alt={bike.nickname || bike.model || 'bike'}
              className="max-h-48 w-full object-contain"
            />
          </div>
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-xs uppercase tracking-widest text-hd-orange">
              {bike.year} {preset?.family || ''}
            </div>
            {bike.isPublic && (
              <span
                title="This bike has a public build sheet you can share"
                className="rounded border border-green-700 bg-green-900/40 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-green-400"
              >
                Public
              </span>
            )}
          </div>
          <div className="mt-1 font-display text-2xl tracking-wider">
            {bike.nickname || bike.model || 'Unnamed bike'}
          </div>
          {bike.nickname && bike.model && (
            <div className="text-sm text-hd-muted">{bike.model}</div>
          )}
          {preset && (
            <div className="mt-1 text-xs text-hd-muted">{preset.label}</div>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-widest text-hd-muted">
            Mileage
          </div>
          <div className="font-display text-2xl tracking-wider text-hd-orange">
            {(bike.mileage || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {bike.vin && (
        <div className="mt-3 text-xs text-hd-muted">
          VIN: <span className="font-mono text-hd-text">{bike.vin}</span>
        </div>
      )}
      {bike.notes && (
        <div className="mt-2 text-sm text-hd-text whitespace-pre-wrap">
          {bike.notes}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={onOpenServiceBook}
          className="rounded bg-hd-orange px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110"
        >
          Service Book
        </button>
        {preset && (
          <button
            onClick={onOpenJobs}
            className="rounded border border-hd-border bg-hd-dark px-3 py-1.5 text-xs text-hd-text hover:border-hd-orange"
          >
            Browse jobs
          </button>
        )}
        <button
          onClick={onShare}
          className="rounded border border-hd-border bg-hd-dark px-3 py-1.5 text-xs text-hd-muted hover:border-hd-orange hover:text-hd-text"
          title="Publish a public build sheet for this bike"
        >
          {bike.isPublic ? 'Share link' : 'Share'}
        </button>
        <button
          onClick={onEdit}
          className="rounded border border-hd-border bg-hd-dark px-3 py-1.5 text-xs text-hd-muted hover:border-hd-orange hover:text-hd-text"
        >
          Edit
        </button>
        <button
          onClick={onRemove}
          className="ml-auto rounded border border-hd-border bg-hd-dark px-3 py-1.5 text-xs text-hd-muted hover:border-red-500 hover:text-red-400"
        >
          Remove
        </button>
      </div>
    </div>
  )
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
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
      onClick={onCancel}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-md border border-hd-border bg-hd-dark p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wider text-hd-orange">
            {bike ? 'EDIT BIKE' : 'ADD BIKE'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-2xl leading-none text-hd-muted hover:text-hd-orange"
          >
            ×
          </button>
        </div>

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

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-hd-border bg-hd-dark px-4 py-2 text-sm text-hd-muted hover:border-hd-orange hover:text-hd-text"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            {bike ? 'Save changes' : 'Add to garage'}
          </button>
        </div>
      </form>
    </div>
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
