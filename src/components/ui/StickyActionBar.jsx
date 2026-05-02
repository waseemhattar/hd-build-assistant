import React from 'react'

// Pinned-to-bottom action bar. Stays visible while the page scrolls
// behind it so the primary CTA never falls below the fold. iOS-native
// pattern. We respect:
//   - safe-area-inset-bottom (iPhone home indicator)
//   - bottom-tab-bar height (~56px) on mobile so we don't overlap it
//   - desktop: a more relaxed footer rather than a sticky overlay
//
// Pages using this must add bottom padding to their scroll content
// matching `pb-32 sm:pb-24` (or set `padContent` on the page itself)
// so the last row isn't hidden behind the bar.
export default function StickyActionBar({ children, className = '' }) {
  return (
    <div
      className={`fixed inset-x-0 bottom-[3.75rem] z-20 border-t border-white/5 bg-hd-black/95 px-4 py-3 backdrop-blur-md sm:bottom-0 ${className}`}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        {children}
      </div>
    </div>
  )
}
