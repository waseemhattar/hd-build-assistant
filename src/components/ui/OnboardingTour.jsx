import React, { useEffect, useLayoutEffect, useState } from 'react'

// First-launch onboarding tour — spotlight edition.
//
// Each step targets a real DOM element marked with `data-tour-anchor`.
// We measure its bounding rect, render a full-page dark overlay with
// a transparent "spotlight" cutout exactly over the target (the
// box-shadow trick — a small transparent rect with a 9999px-spread
// dark shadow makes everything else dim), and place a tooltip card
// beside it with an arrow pointing at the target.
//
// Targets used:
//   data-tour-anchor="bottom-tabs"  → the navigation tab bar
//   data-tour-anchor="mechanic-fab" → the floating chat button
//   data-tour-anchor="user-menu"    → the user avatar in the top nav
//
// If a target isn't on screen for the current step (e.g., bottom tabs
// hidden on desktop), we fall back to a centred dialog without a
// spotlight — the explanation still lands, just without the visual
// pointer.
//
// Persists "seen" via localStorage so the tour only ever runs once
// per device. User can also Skip mid-tour.

const STORAGE_KEY = 'sidestand:onboardingSeen/v1'

const STEPS = [
  {
    anchor: 'bottom-tabs',
    title: 'Tap to navigate',
    body:
      'Use the bottom tab bar to jump between Home, Garage, Rides, and the Manual.',
    placement: 'top'
  },
  {
    anchor: 'mechanic-fab',
    title: 'Ask the mechanic',
    body:
      'Tap the red chat button anytime. The AI mechanic knows your bike, mileage, mods, and service history — and it can quote your manual.',
    placement: 'top'
  },
  {
    anchor: 'user-menu',
    title: 'Settings live here',
    body:
      'Switch units (mi / km), update your profile, or sign out from the user menu.',
    placement: 'bottom'
  }
]

export default function OnboardingTour() {
  const [stepIdx, setStepIdx] = useState(0)
  const [visible, setVisible] = useState(false)
  // anchorRect is updated whenever the target element's position
  // changes (resize, scroll, viewport rotation). null means we
  // couldn't find the target → fall back to a centred dialog.
  const [anchorRect, setAnchorRect] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const seen = window.localStorage.getItem(STORAGE_KEY)
      if (!seen) {
        // Wait briefly so the rest of the UI paints first.
        const t = setTimeout(() => setVisible(true), 800)
        return () => clearTimeout(t)
      }
    } catch (_) {}
  }, [])

  // Measure the current step's target element — and re-measure on
  // resize / scroll so the spotlight stays glued to the moving target.
  useLayoutEffect(() => {
    if (!visible) return
    function measure() {
      const step = STEPS[stepIdx]
      const el =
        typeof document !== 'undefined' &&
        document.querySelector(`[data-tour-anchor="${step.anchor}"]`)
      if (!el) {
        setAnchorRect(null)
        return
      }
      const r = el.getBoundingClientRect()
      // Skip targets that aren't actually painted (display:none on
      // desktop for bottom-tabs, etc.)
      if (r.width === 0 || r.height === 0) {
        setAnchorRect(null)
        return
      }
      setAnchorRect({
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height
      })
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    // The first paint after a step transition can lag the layout —
    // re-measure on next frame to catch any animation settling.
    const raf = requestAnimationFrame(measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
      cancelAnimationFrame(raf)
    }
  }, [stepIdx, visible])

  function dismiss() {
    setVisible(false)
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch (_) {}
  }

  if (!visible) return null

  const step = STEPS[stepIdx]
  const last = stepIdx === STEPS.length - 1

  // ---- Layout for the spotlight + tooltip ----

  // Spotlight: 8px padding around the target. The transparent rect
  // PLUS its 9999px box-shadow paints a hole-in-overlay in one go.
  const padding = 8
  const cutout = anchorRect && {
    top: anchorRect.top - padding,
    left: anchorRect.left - padding,
    width: anchorRect.width + padding * 2,
    height: anchorRect.height + padding * 2
  }

  // Tooltip placement. We pick top/bottom based on the step config but
  // flip if the target is too close to that edge.
  const tooltipMaxWidth = 320
  let tooltipStyle = {
    maxWidth: tooltipMaxWidth,
    width: 'min(86vw, 320px)'
  }
  let arrowStyle = null
  if (anchorRect) {
    const targetCenterX = anchorRect.left + anchorRect.width / 2
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800
    const placement =
      step.placement === 'top'
        ? anchorRect.top < 200
          ? 'bottom'
          : 'top'
        : anchorRect.top + anchorRect.height > screenH - 200
        ? 'top'
        : 'bottom'

    // Try to centre tooltip horizontally over the target, but clamp
    // so it doesn't fall off either edge.
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 360
    const halfW = Math.min(tooltipMaxWidth, screenW * 0.86) / 2
    let centreX = targetCenterX
    if (centreX < halfW + 8) centreX = halfW + 8
    if (centreX > screenW - halfW - 8) centreX = screenW - halfW - 8

    if (placement === 'top') {
      tooltipStyle = {
        ...tooltipStyle,
        position: 'fixed',
        left: centreX,
        bottom: screenH - anchorRect.top + padding + 8,
        transform: 'translateX(-50%)'
      }
      // Arrow pokes out the bottom of the tooltip
      arrowStyle = {
        position: 'absolute',
        bottom: -6,
        left: targetCenterX - centreX + halfW,
        width: 12,
        height: 12,
        background: 'var(--hd-dark, #18161b)',
        transform: 'translateX(-50%) rotate(45deg)'
      }
    } else {
      tooltipStyle = {
        ...tooltipStyle,
        position: 'fixed',
        left: centreX,
        top: anchorRect.top + anchorRect.height + padding + 8,
        transform: 'translateX(-50%)'
      }
      arrowStyle = {
        position: 'absolute',
        top: -6,
        left: targetCenterX - centreX + halfW,
        width: 12,
        height: 12,
        background: 'var(--hd-dark, #18161b)',
        transform: 'translateX(-50%) rotate(45deg)'
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Dim layer + cutout. If we have a target, the cutout punches
          through the dim. If not, we show a plain dim and a centred
          dialog. */}
      {cutout ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              top: cutout.top,
              left: cutout.left,
              width: cutout.width,
              height: cutout.height,
              borderRadius: 16,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.72)',
              outline: '2px solid #E03A36',
              outlineOffset: 0
            }}
          />
          {/* Click-shield over the entire screen so taps don't reach
              underlying buttons. We pass through clicks on the area
              of the spotlight cutout itself so the user can interact
              with whatever's highlighted (e.g., they CAN tap the chat
              button when it's the highlighted target). */}
          <div
            className="absolute inset-0"
            onClick={dismiss}
            style={{ pointerEvents: 'auto' }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0 bg-black/72"
          onClick={dismiss}
        />
      )}

      {/* Tooltip card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={tooltipStyle}
        className={
          anchorRect
            ? 'rounded-2xl bg-hd-dark p-4 shadow-2xl'
            : 'fixed inset-x-0 bottom-0 mx-auto max-w-md rounded-t-3xl bg-hd-dark p-6 sm:bottom-auto sm:top-1/2 sm:rounded-3xl'
        }
      >
        {/* Arrow pointing at the target */}
        {arrowStyle && <div style={arrowStyle} />}

        <div className="mb-2 flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i === stepIdx ? 'bg-hd-orange' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
          Step {stepIdx + 1} of {STEPS.length}
        </div>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-hd-text">
          {step.title}
        </h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-hd-muted">
          {step.body}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            onClick={dismiss}
            className="text-[12px] text-hd-muted hover:text-hd-text"
          >
            Skip
          </button>
          <div className="flex items-center gap-2">
            {stepIdx > 0 && (
              <button
                onClick={() => setStepIdx((s) => s - 1)}
                className="rounded-full bg-hd-card px-3.5 py-2 text-[13px] font-medium text-hd-text"
              >
                Back
              </button>
            )}
            <button
              onClick={() =>
                last ? dismiss() : setStepIdx((s) => s + 1)
              }
              className="rounded-full bg-hd-orange px-4 py-2 text-[13px] font-semibold text-white"
            >
              {last ? 'Got it' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
