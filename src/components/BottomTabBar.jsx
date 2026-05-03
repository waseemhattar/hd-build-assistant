import React from 'react'

// Bottom tab bar — iOS-native pattern.
//
// Visible whenever the viewport is mobile-sized (≤ sm: breakpoint) or
// we're inside the Capacitor native shell. Hidden on wide web layouts
// where the top-nav links work fine.
//
// Uses env(safe-area-inset-bottom) so the home indicator on
// iPhone X-and-later doesn't sit on top of the tabs. The translucent
// blur background mimics native UITabBar.
//
// Active tab: signal-red icon + label. Inactive: muted gray.

const TABS = [
  { id: 'home', label: 'Home', icon: IconHome },
  { id: 'garage', label: 'Garage', icon: IconGarage },
  { id: 'rides', label: 'Rides', icon: IconRide },
  { id: 'discover', label: 'Discover', icon: IconCompass },
  { id: 'manual', label: 'Procedures', icon: IconManual }
]

export default function BottomTabBar({ activeSection, onNavigate }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/5 bg-hd-black sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary navigation"
      data-tour-anchor="bottom-tabs"
    >
      <ul className="grid grid-cols-5">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = activeSection === t.id
          return (
            <li key={t.id}>
              <button
                onClick={() => onNavigate(t.id)}
                className="flex w-full flex-col items-center justify-center gap-1 px-1 py-2.5 transition active:scale-95"
                aria-current={active ? 'page' : undefined}
                aria-label={t.label}
              >
                <Icon
                  className={`h-6 w-6 ${
                    active ? 'text-hd-orange' : 'text-hd-muted'
                  }`}
                />
                <span
                  className={`text-[10px] font-medium tracking-wide ${
                    active ? 'text-hd-orange' : 'text-hd-muted'
                  }`}
                >
                  {t.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// ---------- icons ----------
// SF Symbols-inspired stroked glyphs. Kept simple, two-state (active /
// inactive) handled by stroke color.

function IconHome({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  )
}
function IconGarage({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 21V9l9-6 9 6v12" />
      <path d="M7 21V11h10v10" />
      <path d="M9 14h6M9 17h6" />
    </svg>
  )
}
function IconRide({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M6 17l3-7h6l3 7" />
      <path d="M9 10V6h2" />
    </svg>
  )
}
function IconManual({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 5a2 2 0 0 1 2-2h11v18H6a2 2 0 0 1-2-2V5z" />
      <path d="M4 19a2 2 0 0 1 2-2h11" />
      <path d="M9 7h5M9 11h5" />
    </svg>
  )
}
function IconCompass({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <polygon points="14 8 11 13 10 16 13 11" />
    </svg>
  )
}
