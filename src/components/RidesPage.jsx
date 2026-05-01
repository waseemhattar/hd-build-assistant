import React, { useMemo } from 'react'
import { getGarage } from '../data/storage.js'
import RideHistory from './RideHistory.jsx'

// Top-level Rides page (wired into the main nav). Shows:
//   - "Start a new ride" button
//   - All rides across all bikes, newest first
//
// Per-bike rides also live inside ServiceBook → Rides tab. This page
// is the global view.

export default function RidesPage({ onStartRide, onBack }) {
  const garage = useMemo(() => getGarage(), [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
      >
        ← Back
      </button>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            Rides
          </div>
          <h1 className="mt-1 font-display text-3xl tracking-wider sm:text-4xl">
            EVERY RIDE
          </h1>
          <p className="mt-1 text-sm text-hd-muted">
            GPS-tracked trips. Distance, route, max speed — everything
            from your last ride.
          </p>
        </div>
        <button
          onClick={onStartRide}
          className="self-start rounded bg-hd-orange px-5 py-3 text-sm font-semibold text-white hover:brightness-110"
        >
          + Start a ride
        </button>
      </div>

      <RideHistory bikeId={null} onStartRide={onStartRide} garage={garage} />
    </div>
  )
}
