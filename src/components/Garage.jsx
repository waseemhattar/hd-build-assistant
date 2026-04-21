import React, { useEffect, useMemo, useState } from 'react'
import { bikes as bikeCatalog } from '../data/bikes.js'
import {
  getGarage,
  addBike,
  updateBike,
  removeBike
} from '../data/storage.js'

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

          <Field label="VIN (optional)">
            <input
              type="text"
              value={form.vin}
              onChange={(e) =>
                setForm({ ...form, vin: e.target.value.toUpperCase() })
              }
              className="input font-mono"
              maxLength={17}
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
