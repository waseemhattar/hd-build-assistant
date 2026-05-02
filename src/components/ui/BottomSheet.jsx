import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// iOS-style bottom sheet modal. Slides up from the bottom edge with
// a drag handle. Tap outside or swipe the handle down to dismiss.
//
// Replaces full-screen `fixed inset-0` modals like the Service-entry
// editor and Mod editor with a less jarring, more native-feeling
// experience.
//
// Usage:
//   <BottomSheet open={editing} onClose={() => setEditing(null)}>
//     <BottomSheet.Header title="Log service" onClose={...} />
//     ...form fields here...
//   </BottomSheet>
//
// Behavior:
//   - Click/tap on the dimmed backdrop closes the sheet.
//   - Swipe-down on the drag handle closes the sheet (touch only).
//   - Escape key closes the sheet (web/desktop).
//   - On desktop (sm+) the sheet renders centred like a normal dialog.

export default function BottomSheet({
  open,
  onClose,
  children,
  size = 'md', // 'sm' | 'md' | 'lg' | 'full'
  className = ''
}) {
  // Track touch-drag distance so we can dismiss on swipe-down
  const startYRef = useRef(null)
  const sheetRef = useRef(null)
  const [dragOffset, setDragOffset] = useState(0)

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function onTouchStart(e) {
    startYRef.current = e.touches?.[0]?.clientY ?? null
  }
  function onTouchMove(e) {
    if (startYRef.current == null) return
    const dy = (e.touches?.[0]?.clientY ?? 0) - startYRef.current
    if (dy > 0) setDragOffset(dy)
  }
  function onTouchEnd() {
    if (dragOffset > 100) {
      onClose?.()
    }
    setDragOffset(0)
    startYRef.current = null
  }

  if (!open) return null

  const sizeMaxH =
    size === 'sm'
      ? 'max-h-[55vh]'
      : size === 'lg'
      ? 'max-h-[90vh]'
      : size === 'full'
      ? 'max-h-[100vh]'
      : 'max-h-[80vh]'

  // Portal to <body> so we escape any parent that has its own
  // stacking context (e.g. transforms from the pull-to-refresh
  // hook). Without this, Leaflet's tile pane — which uses z-index
  // up to ~1000 internally — can render on top of our overlay.
  const node = (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/85 sm:items-center"
      style={{ isolation: 'isolate' }}
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        className={`w-full overflow-x-hidden rounded-t-3xl bg-hd-dark sm:max-w-lg sm:rounded-3xl ${sizeMaxH} ${className}`}
        style={{
          transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
          transition: dragOffset === 0 ? 'transform 0.2s ease' : undefined,
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
          // Hard cap at the viewport width so any too-wide child (a long
          // VIN, a wide button row) can't push the panel sideways.
          maxWidth: '100vw'
        }}
      >
        {/* Drag handle (touch swipe-down → close). Tap to also close. */}
        <div
          className="flex cursor-pointer items-center justify-center pt-2.5 pb-1.5"
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          aria-label="Close sheet"
          role="button"
        >
          <div className="h-1.5 w-10 rounded-full bg-white/20" />
        </div>
        <div className="overflow-y-auto px-5 pb-5" style={{ maxHeight: 'inherit' }}>
          {children}
        </div>
      </div>
    </div>
  )

  if (typeof document === 'undefined') return node
  return createPortal(node, document.body)
}

// Optional named header — handy for most sheet contents.
function Header({ title, subtitle, onClose }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        {title && (
          <h2 className="text-2xl font-bold tracking-tight text-hd-text">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-0.5 text-[13px] text-hd-muted">{subtitle}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="-mr-2 -mt-1 flex h-9 w-9 items-center justify-center rounded-full text-hd-muted hover:text-hd-text"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
      )}
    </div>
  )
}

BottomSheet.Header = Header
