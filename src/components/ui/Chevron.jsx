import React from 'react'

// iOS-style right-pointing chevron used on tappable list rows.
// Sized to ~16px tall with a generous stroke so it reads at a glance.
// Color defaults to muted-gray (text-hd-muted/70) so it doesn't fight
// the row content.

export default function Chevron({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 shrink-0 text-hd-muted/70 ${className}`}
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}
