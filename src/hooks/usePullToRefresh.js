import { useEffect, useRef, useState } from 'react'

// usePullToRefresh — wire iOS-style "drag down at top of list to
// refresh" gesture to any scrollable container.
//
// Usage:
//   const { containerRef, indicator, refreshing } = usePullToRefresh(
//     async () => { await reloadData() }
//   )
//   return (
//     <div ref={containerRef} className="...">
//       {indicator}
//       <YourList />
//     </div>
//   )
//
// Triggers when the user drags down past `threshold` (default 60px)
// while the container is scrolled to the top. Calls onRefresh; while
// awaiting, the spinner spins. The user can keep scrolling normally
// any other time.
//
// We deliberately keep this self-contained — no external lib — because
// most pull-to-refresh libraries pull in their own scroll-locking and
// fight the WebView's native scrolling.

export default function usePullToRefresh(onRefresh, opts = {}) {
  const threshold = opts.threshold ?? 60
  const containerRef = useRef(null)
  const startYRef = useRef(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onTouchStart(e) {
      // Only engage if container is scrolled to the top.
      if (el.scrollTop > 0) {
        startYRef.current = null
        return
      }
      startYRef.current = e.touches?.[0]?.clientY ?? null
    }

    function onTouchMove(e) {
      if (startYRef.current == null) return
      const dy = (e.touches?.[0]?.clientY ?? 0) - startYRef.current
      if (dy > 0) {
        setPullDistance(Math.min(dy, threshold * 1.5))
      }
    }

    async function onTouchEnd() {
      if (startYRef.current == null) {
        return
      }
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

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [onRefresh, threshold, pullDistance, refreshing])

  // The visible indicator. Sits above the list. Reveals proportional
  // to pull distance; spins while refreshing.
  const indicator = (
    <div
      className="pointer-events-none flex items-center justify-center overflow-hidden text-hd-orange"
      style={{
        height: refreshing ? 36 : pullDistance,
        transition: refreshing || pullDistance === 0 ? 'height 0.2s ease' : undefined
      }}
    >
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
    </div>
  )

  return { containerRef, indicator, refreshing }
}
