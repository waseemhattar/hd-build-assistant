import React, { useEffect, useRef, useState } from 'react'

// usePullToRefresh — wire iOS-style "drag down at top of list to
// refresh" gesture to a scrollable container OR to the whole page.
//
// Two modes:
//
// 1) Container mode (default): attach `containerRef` to a scrollable
//    element and place the returned `indicator` inside it.
//
//      const { containerRef, indicator } = usePullToRefresh(reload)
//      <div ref={containerRef}>{indicator}<YourList /></div>
//
// 2) Page mode (`{ attachToWindow: true }`): listens on the document
//    and fires whenever the user pulls down while the page is scrolled
//    to the top. Use this on full-screen views where the natural
//    scroller is the window itself (most pages in this app). Place
//    the returned `indicator` anywhere — it's rendered position:fixed
//    at the top of the viewport.
//
// Triggers when the user drags down past `threshold` (default 60px)
// while at the top. While awaiting onRefresh the spinner spins.
//
// File extension is .jsx because the indicator returned to the caller
// includes inline JSX. Vite only transforms JSX in .jsx/.tsx files.

export default function usePullToRefresh(onRefresh, opts = {}) {
  const threshold = opts.threshold ?? 60
  const attachToWindow = !!opts.attachToWindow
  const containerRef = useRef(null)
  const startYRef = useRef(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const target = attachToWindow
      ? typeof document !== 'undefined' ? document : null
      : containerRef.current
    if (!target) return

    function isAtTop() {
      if (attachToWindow) {
        if (typeof window === 'undefined') return true
        // iOS Safari sometimes reports a small negative bounce-back
        // value; treat anything ≤ 0 as "at top".
        return (window.scrollY || window.pageYOffset || 0) <= 0
      }
      const el = containerRef.current
      return el ? el.scrollTop <= 0 : true
    }

    function onTouchStart(e) {
      if (!isAtTop()) {
        startYRef.current = null
        return
      }
      startYRef.current = e.touches?.[0]?.clientY ?? null
    }

    function onTouchMove(e) {
      if (startYRef.current == null) return
      // If the user scrolled away during the drag, abort the gesture.
      if (!isAtTop()) {
        startYRef.current = null
        setPullDistance(0)
        return
      }
      const dy = (e.touches?.[0]?.clientY ?? 0) - startYRef.current
      if (dy > 0) {
        setPullDistance(Math.min(dy, threshold * 1.5))
      }
    }

    async function onTouchEnd() {
      if (startYRef.current == null) return
      const distance = pullDistance
      setPullDistance(0)
      startYRef.current = null
      if (distance >= threshold && !refreshing) {
        setRefreshing(true)
        try {
          await onRefresh?.()
        } finally {
          setRefreshing(false)
        }
      }
    }

    target.addEventListener('touchstart', onTouchStart, { passive: true })
    target.addEventListener('touchmove', onTouchMove, { passive: true })
    target.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      target.removeEventListener('touchstart', onTouchStart)
      target.removeEventListener('touchmove', onTouchMove)
      target.removeEventListener('touchend', onTouchEnd)
    }
  }, [onRefresh, threshold, pullDistance, refreshing, attachToWindow])

  // Spinner. In page mode it floats fixed at the top of the viewport
  // so it doesn't shift the underlying layout. In container mode it
  // sits inline and reveals as content pushes down.
  const Spinner = (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={refreshing ? 'animate-spin' : ''}
      style={{
        opacity: refreshing ? 1 : Math.min(1, pullDistance / threshold),
        transform: refreshing
          ? undefined
          : `rotate(${(pullDistance / threshold) * 270}deg)`
      }}
    >
      <path d="M21 12a9 9 0 1 1-6.2-8.55" />
    </svg>
  )

  const indicator = attachToWindow ? (
    <div
      className="pointer-events-none fixed inset-x-0 z-30 flex items-center justify-center overflow-hidden text-hd-orange"
      style={{
        top: 'env(safe-area-inset-top, 0px)',
        height: refreshing ? 36 : pullDistance,
        transition:
          refreshing || pullDistance === 0 ? 'height 0.2s ease' : undefined
      }}
    >
      {Spinner}
    </div>
  ) : (
    <div
      className="pointer-events-none flex items-center justify-center overflow-hidden text-hd-orange"
      style={{
        height: refreshing ? 36 : pullDistance,
        transition:
          refreshing || pullDistance === 0 ? 'height 0.2s ease' : undefined
      }}
    >
      {Spinner}
    </div>
  )

  return { containerRef, indicator, refreshing }
}
