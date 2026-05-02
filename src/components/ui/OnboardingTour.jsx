import React, { useEffect, useState } from 'react'

// First-launch onboarding tour. A small, dismissible carousel of
// tooltips that points out the key affordances most users miss:
//
//   1. Bottom tab bar — primary navigation
//   2. Floating chat — AI mechanic
//   3. Scroll for more — sections below the fold
//
// We persist a localStorage flag so the tour only ever runs once per
// device. The user can also dismiss mid-tour with Skip.
//
// This is rendered globally (mounted in App.jsx) so it overlays
// whatever screen is showing on first sign-in.

const STORAGE_KEY = 'sidestand:onboardingSeen/v1'

export default function OnboardingTour() {
  const [stepIdx, setStepIdx] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const seen = window.localStorage.getItem(STORAGE_KEY)
      if (!seen) {
        // Wait a moment after mount so the rest of the UI is painted.
        const t = setTimeout(() => setVisible(true), 800)
        return () => clearTimeout(t)
      }
    } catch (_) {}
  }, [])

  function dismiss() {
    setVisible(false)
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch (_) {}
  }

  if (!visible) return null

  const steps = [
    {
      title: 'Tap to navigate',
      body: 'Use the bottom tab bar to jump between Home, Garage, Rides, and the Manual.',
      anchor: 'bottom-tabs'
    },
    {
      title: 'Ask the mechanic',
      body: 'The red chat button is your AI mechanic. It knows your bike, mileage, mods, and service history.',
      anchor: 'fab'
    },
    {
      title: 'Scroll for more',
      body: 'Most screens have more sections below the fold — scroll to see service intervals, recent rides, and more.',
      anchor: 'scroll'
    }
  ]
  const step = steps[stepIdx]
  const last = stepIdx === steps.length - 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-hd-dark p-6 sm:mb-8 sm:rounded-3xl"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mb-2 flex items-center gap-1.5">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i === stepIdx ? 'bg-hd-orange' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
          Step {stepIdx + 1} of {steps.length}
        </div>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-hd-text">
          {step.title}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-hd-muted">
          {step.body}
        </p>
        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            onClick={dismiss}
            className="text-[13px] text-hd-muted hover:text-hd-text"
          >
            Skip
          </button>
          <div className="flex items-center gap-2">
            {stepIdx > 0 && (
              <button
                onClick={() => setStepIdx((s) => s - 1)}
                className="rounded-full bg-hd-card px-4 py-2.5 text-[14px] font-medium text-hd-text"
              >
                Back
              </button>
            )}
            <button
              onClick={() =>
                last ? dismiss() : setStepIdx((s) => s + 1)
              }
              className="rounded-full bg-hd-orange px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              {last ? "Got it" : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
