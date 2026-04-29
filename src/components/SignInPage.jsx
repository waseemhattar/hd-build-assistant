import React, { useState } from 'react'
import { SignIn, useClerk } from '@clerk/clerk-react'
import TopNav from './TopNav.jsx'
import Logo from './Logo.jsx'
import { isNativeApp } from '../data/platform.js'
import { startNativeOAuth } from '../data/nativeAuth.js'

// When running in a Capacitor WebView, OAuth providers (Google /
// Microsoft / etc.) block embedded WebViews entirely (Google returns
// "Error 403: disallowed_useragent"). The fix is to open the OAuth
// flow in Safari View Controller — a real native browser overlay
// that has the system Safari user agent. We do that here with our
// own native sign-in buttons that bypass Clerk's default flow when
// running natively.
//
// On the web, we render the regular Clerk <SignIn /> widget which
// handles everything including OAuth.
const NATIVE_POST_AUTH_URL = 'https://sidestand.app/'
const native = isNativeApp()

// Dedicated sign-in page. Loaded when the URL is /sign-in (handled by
// App.jsx). The whole page is centered around the Clerk <SignIn /> with
// the same TopNav + brand framing as Landing.
//
// The Clerk appearance settings here mirror the dark + signal red
// palette and force light text colors on every Clerk element so
// nothing inherits a default that's invisible against our dark surface.
export default function SignInPage({ onBack }) {
  return (
    <div className="min-h-screen bg-hd-black text-hd-text">
      <TopNav
        activeSection={null}
        onNavigate={onBack}
        signedOut
        onSignInClick={onBack}
      />

      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-10 sm:py-16">
        <div className="mb-6 flex flex-col items-center gap-3">
          <Logo size={36} />
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            Welcome to Sidestand
          </div>
        </div>

        {native ? <NativeSignIn /> : <WebSignIn />}

        <button
          onClick={onBack}
          className="mt-6 text-xs text-hd-muted hover:text-hd-orange"
        >
          ← Back to home
        </button>
      </div>
    </div>
  )
}

// Native sign-in: render our own buttons that route OAuth through
// Safari View Controller (via @capacitor/browser). The Clerk
// <SignIn /> widget below it handles email + password fallback.
function NativeSignIn() {
  const clerk = useClerk()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function tap(strategy) {
    setErr(null)
    setBusy(true)
    console.log('[Sidestand] startNativeOAuth begin', { strategy })
    try {
      await startNativeOAuth({ clerk, strategy })
      console.log('[Sidestand] startNativeOAuth dispatched (waiting on callback)')
    } catch (e) {
      console.error('[Sidestand] startNativeOAuth error', e)
      setErr(e?.message || 'Sign-in failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="w-full">
      <div className="rounded-md border border-hd-border bg-hd-dark p-5">
        <div className="mb-4 text-center">
          <div className="font-display text-xl tracking-wider text-hd-text">
            SIGN IN
          </div>
          <div className="mt-1 text-xs text-hd-muted">
            Pick how you want to continue
          </div>
        </div>

        <button
          onClick={() => tap('oauth_google')}
          disabled={busy}
          className="flex w-full items-center justify-center gap-3 rounded border border-hd-border bg-hd-black px-4 py-3 text-sm text-hd-text transition hover:border-hd-orange disabled:opacity-50"
        >
          <GoogleG />
          <span>{busy ? 'Opening Google…' : 'Continue with Google'}</span>
        </button>

        {err && (
          <div className="mt-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {err}
          </div>
        )}

        <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-widest text-hd-muted">
          <div className="h-px flex-1 bg-hd-border" />
          or use email
          <div className="h-px flex-1 bg-hd-border" />
        </div>

        <SignIn
          routing="hash"
          signUpForceRedirectUrl={NATIVE_POST_AUTH_URL}
          signInForceRedirectUrl={NATIVE_POST_AUTH_URL}
          appearance={{
            variables: clerkVariables,
            elements: {
              ...clerkElements,
              // Hide the social buttons row — we render our own above.
              socialButtons: 'hidden',
              socialButtonsBlockButton: 'hidden',
              divider: 'hidden',
              dividerText: 'hidden',
              dividerLine: 'hidden',
              header: 'hidden',
              card: clerkElements.card + ' shadow-none bg-transparent border-0 p-0'
            }
          }}
        />
      </div>
    </div>
  )
}

// Web sign-in: just the Clerk widget. OAuth works fine in a real
// browser, so no special handling.
function WebSignIn() {
  return (
    <SignIn
      routing="hash"
      signUpForceRedirectUrl="/"
      signInForceRedirectUrl="/"
      appearance={{
        variables: clerkVariables,
        elements: clerkElements
      }}
    />
  )
}

// Inline Google G logo so the button looks legit even without an
// external image asset.
function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.5 4.2-5.5 7.2-10.3 7.2a11 11 0 0 1 0-22c2.6 0 5 .9 7 2.5l5.1-5.1A18 18 0 1 0 24 42c10 0 18-7 18-18 0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l5.9 4.3A11 11 0 0 1 24 13c2.6 0 5 .9 7 2.5l5.1-5.1A18 18 0 0 0 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 42a18 18 0 0 0 12-4.6l-5.5-4.7c-1.8 1.3-4 2.1-6.5 2.1-4.8 0-8.8-3-10.3-7.2l-5.9 4.6C10.5 38 16.7 42 24 42z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20.4H24v7.2h11.3c-.7 2-2 3.7-3.7 5l5.5 4.7c4-3.6 6.5-9 6.5-15-.1-1.2-.2-2.4-.4-3.6z"/>
    </svg>
  )
}

// Pulled out so both the native and web flows share the same theming.
const clerkVariables = {
  colorPrimary: '#E03A36',
  colorBackground: '#16161A',
  colorText: '#E8E2D5',
  colorTextSecondary: '#9A9A9F',
  colorTextOnPrimaryBackground: '#FFFFFF',
  colorInputBackground: '#0E0E10',
  colorInputText: '#E8E2D5',
  colorNeutral: '#E8E2D5',
  colorShimmer: 'rgba(232, 226, 213, 0.1)',
  borderRadius: '0.5rem',
  fontFamily: 'inherit'
}

const clerkElements = {
  card: 'border border-hd-border shadow-none bg-hd-dark',
  headerTitle: 'text-hd-text font-display tracking-wider',
  headerSubtitle: 'text-hd-muted',
  formFieldLabel: 'text-hd-text',
  formFieldInput: 'text-hd-text',
  identityPreviewText: 'text-hd-text',
  identityPreviewEditButton: 'text-hd-orange',
  dividerText: 'text-hd-muted',
  footerActionText: 'text-hd-muted',
  footerActionLink: 'text-hd-orange hover:brightness-110',
  socialButtonsBlockButton:
    'border border-hd-border text-hd-text hover:border-hd-orange',
  socialButtonsBlockButtonText: 'text-hd-text',
  formButtonPrimary:
    'bg-hd-orange text-white hover:brightness-110 normal-case tracking-wide'
}
