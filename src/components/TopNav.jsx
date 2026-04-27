import React, { useEffect, useState } from 'react'
import { UserButton } from '@clerk/clerk-react'
import Logo from './Logo.jsx'

// Persistent top navigation, used on every signed-in screen.
//
// Layout:
//   [Logo]   Garage   Manual   Intervals          [user]
//
// The middle nav links highlight when the matching `activeSection` is
// in view. Clicking a link calls onNavigate(<section>) so the parent
// can drive its state-machine. We keep this as a presentational
// component (no state-machine knowledge) so it's easy to reuse from
// anywhere.
//
// On narrow viewports the middle row collapses into a hamburger that
// opens a slide-down sheet. The user button stays visible at every
// width so signing out is always one tap away.
export default function TopNav({
  activeSection,
  onNavigate,
  userLogoUrl,
  // When `signedOut` is true we render a "Sign in" button on the right
  // instead of the Clerk user widget (used on Landing).
  signedOut = false,
  onSignInClick
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  // Close the mobile menu when the user picks a destination.
  function go(section) {
    setMenuOpen(false)
    onNavigate(section)
  }

  // Close the menu on viewport resize past sm — otherwise an open
  // mobile sheet sticks around when the user rotates / resizes.
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 640) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const links = [
    { id: 'garage', label: 'Garage' },
    { id: 'manual', label: 'Manual' },
    { id: 'intervals', label: 'Intervals' }
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-hd-border bg-hd-dark/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: wordmark, always returns to home */}
        <button
          onClick={() => go('home')}
          className="hover:opacity-80 transition"
          title="Sidestand"
        >
          <Logo imageUrl={userLogoUrl} size={26} />
        </button>

        {/* Middle: nav links — hidden on mobile, replaced with hamburger */}
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => {
            const active = activeSection === l.id
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`rounded px-3 py-1.5 text-sm transition ${
                  active
                    ? 'bg-hd-orange/10 text-hd-orange'
                    : 'text-hd-muted hover:bg-hd-card hover:text-hd-text'
                }`}
              >
                {l.label}
              </button>
            )
          })}
        </nav>

        {/* Right: user (signed-in) or Sign in (signed-out) + mobile toggle */}
        <div className="flex items-center gap-2">
          {signedOut ? (
            <button
              onClick={onSignInClick}
              className="rounded bg-hd-orange px-4 py-1.5 text-sm font-semibold text-white hover:brightness-110"
            >
              Sign in
            </button>
          ) : (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { userButtonAvatarBox: 'w-7 h-7' }
              }}
            />
          )}
          {/* Mobile hamburger — only when there are nav links to show */}
          {!signedOut && (
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded border border-hd-border bg-hd-card p-1.5 text-hd-text hover:border-hd-orange sm:hidden"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile slide-down sheet */}
      {menuOpen && !signedOut && (
        <div className="border-t border-hd-border bg-hd-dark sm:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {links.map((l) => {
              const active = activeSection === l.id
              return (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className={`flex items-center justify-between rounded px-3 py-3 text-left text-sm transition ${
                    active
                      ? 'bg-hd-orange/10 text-hd-orange'
                      : 'text-hd-text hover:bg-hd-card'
                  }`}
                >
                  <span>{l.label}</span>
                  <span aria-hidden="true" className="text-hd-muted">›</span>
                </button>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
