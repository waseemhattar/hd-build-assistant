import React, { useEffect, useMemo, useRef, useState } from 'react'
import { bikes as bikeCatalog } from '../data/bikes.js'
import {
  getGarage,
  addBike,
  updateBike,
  removeBike,
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
        <button
          onClick={() => setEditing({ new: true })}
          className="self-start rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-hd-black hover:brightness-110"
        >
          + Add bike
        </button>
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
            className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-hd-black hover:brightness-110"
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
    </div>
  )
}

function BikeCard({ bike, onEdit, onRemove, onOpenServiceBook, onOpenJobs }) {
  const preset = bikeCatalog.find((p) => p.id === bike.bikeTypeId)
  return (
    <div className="card flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            {bike.year} {preset?.family || ''}
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
          className="rounded bg-hd-orange px-3 py-1.5 text-xs font-semibold text-hd-black hover:brightness-110"
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
    notes: bike?.notes || ''
  }))

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
            className="rounded bg-hd-orange px-4 py-2 text-sm font-semibold text-hd-black hover:brightness-110"
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
