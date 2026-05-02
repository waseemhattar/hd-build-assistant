import React, { useMemo } from 'react'
import { getGarage } from '../data/storage.js'
import RideHistory from './RideHistory.jsx'
import StickyActionBar from './ui/StickyActionBar.jsx'

// Top-level Rides page (wired into the main nav). Shows:
//   - All rides across all bikes, newest first
//   - Sticky bottom "+ Start a ride" CTA that's always visible
//
// Per-bike rides also live inside ServiceBook → Rides tab. This page
// is the global view.

export default function RidesPage({ onStartRide, onBack }) {
  const garage = useMemo(() => getGarage(), [])

  return (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-4 sm:px-6 sm:pb-24 sm:pt-8">
      <header className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
          Rides
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-hd-text sm:text-4xl">
          Every ride
        </h1>
        <p className="mt-1 text-[14px] text-hd-muted">
          GPS-tracked trips. Distance, route, max speed.
        </p>
      </header>

      <RideHistory
        bikeId={null}
        onStartRide={onStartRide}
        garage={garage}
      />

      <StickyActionBar>
        <button
          onClick={onStartRide}
          className="w-full rounded-full bg-hd-orange px-6 py-3 text-[15px] font-semibold text-white transition active:scale-95"
        >
          + Start a ride
        </button>
      </StickyActionBar>
    </div>
  )
}
