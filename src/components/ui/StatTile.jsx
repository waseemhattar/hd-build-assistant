import React from 'react'

// Small stat tile used in grids — Apple-Health-style.
//
// Used by Home (Totals footer), PublicBike (stats grid), Garage
// (per-bike stats). Keep this strict: one label, one value, optional
// suffix (singular/plural noun) and optional tone (color the value).
//
// Tones:
//   default → text-hd-text
//   good    → text-emerald-400
//   warn    → text-amber-400
//   bad     → text-red-400
//   muted   → text-hd-muted

const TONE_CLASSES = {
  default: 'text-hd-text',
  good: 'text-emerald-400',
  warn: 'text-amber-400',
  bad: 'text-red-400',
  muted: 'text-hd-muted'
}

export default function StatTile({
  label,
  value,
  suffix,
  tone = 'default',
  onClick,
  className = ''
}) {
  const valueClr = TONE_CLASSES[tone] || TONE_CLASSES.default
  const Component = onClick ? 'button' : 'div'
  return (
    <Component
      onClick={onClick}
      className={`rounded-2xl bg-hd-dark px-4 py-3.5 text-left ${
        onClick ? 'transition active:scale-95' : ''
      } ${className}`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-hd-muted">
        {label}
      </div>
      <div
        className={`mt-1 text-lg font-bold tracking-tight sm:text-xl ${valueClr}`}
      >
        {value}
      </div>
      {suffix && <div className="text-[10px] text-hd-muted">{suffix}</div>}
    </Component>
  )
}
