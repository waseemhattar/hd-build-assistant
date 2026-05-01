import React, { useEffect, useRef, useState } from 'react'
import Logo from './Logo.jsx'
import { useAuth, useUser } from '../auth/AuthProvider.jsx'

// Persistent top navigation, used on every signed-in screen.
//
// Layout (sm+):
//   [Logo]   Garage   Manual   Rides   Intervals          [user]
//
// On mobile (< sm) and inside the native app, the middle links are
// hidden — BottomTabBar handles primary navigation. Top bar collapses
// to logo + user avatar so the screen feels app-like, not webby.
export default function TopNav({
  activeSection,
  onNavigate,
  userLogoUrl,
  // When `signedOut` is true we render a "Sign in" button on the right
  // instead of the Clerk user widget (used on Landing).
  signedOut = false,
  onSignInClick,
  // Callback when the user picks "Settings" from the user menu. Parent
  // (App.jsx) routes this to view='settings' so the Settings page
  // renders in place of the current view.
  onOpenSettings
}) {
  function go(section) {
    onNavigate(section)
  }

  const links = [
    { id: 'garage', label: 'Garage' },
    { id: 'manual', label: 'Manual' },
    { id: 'rides', label: 'Rides' },
    { id: 'intervals', label: 'Intervals' }
  ]

  return (
    <header
      className="sticky top-0 z-30 border-b border-white/5 bg-hd-black/85 backdrop-blur-xl sm:border-hd-border sm:bg-hd-dark/95"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
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
            <UserMenu onOpenSettings={onOpenSettings} />
          )}
          {/* Mobile hamburger removed — bottom tab bar handles navigation
              on small viewports. Top bar on mobile collapses to logo + user. */}
        </div>
      </div>

    </header>
  )
}

// Tiny user-menu button on the right side of the nav. Replaces Clerk's
// <UserButton />. Click → reveals a dropdown with the user's email and
// a sign-out action. We keep it minimal here; profile management can
// land in a separate Settings page later.
function UserMenu({ onOpenSettings }) {
  const { user } = useUser()
  const { signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', onDoc)
      return () => document.removeEventListener('mousedown', onDoc)
    }
  }, [open])

  const initials = (user?.fullName || user?.primaryEmailAddress?.emailAddress || 'S')
    .split(/\s|@/)
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-hd-border bg-hd-card text-[11px] font-semibold text-hd-text hover:border-hd-orange"
        aria-label="User menu"
        aria-expanded={open}
      >
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-9 w-56 rounded-md border border-hd-border bg-hd-dark py-1 text-sm shadow-lg">
          <div className="border-b border-hd-border px-3 py-2">
            <div className="truncate text-xs text-hd-muted">Signed in as</div>
            <div className="truncate text-hd-text">
              {user?.primaryEmailAddress?.emailAddress || user?.fullName || 'rider'}
            </div>
          </div>
          {onOpenSettings && (
            <button
              onClick={() => {
                setOpen(false)
                onOpenSettings()
              }}
              className="w-full px-3 py-2 text-left text-hd-text hover:bg-hd-card hover:text-hd-orange"
            >
              Settings
            </button>
          )}
          <button
            onClick={async () => {
              setOpen(false)
              await signOut()
            }}
            className="w-full px-3 py-2 text-left text-hd-text hover:bg-hd-card hover:text-hd-orange"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
