import React, { useState } from 'react'
import { SignIn, useSignIn } from '@clerk/clerk-react'
import TopNav from './TopNav.jsx'
import Logo from './Logo.jsx'
import { isNativeApp } from '../data/platform.js'
import { signInWithAppleNative } from '../data/appleAuth.js'

// Sign-in page. Layout differs slightly between web and native:
//   - Web: just the Clerk <SignIn /> widget (Google, Microsoft, email).
//   - Native (iOS/Android): a "Sign in with Apple" button at the top
//     using Apple's native dialog, plus the Clerk widget below for
//     email + password fallback. We hide the social buttons on the
//     Clerk widget when native, since OAuth providers reject embedded
//     WebViews.
//
// Design rationale:
//   - Apple is the only OAuth provider that works inside a Capacitor
//     WebView (it uses a system-level dialog, not a redirect to a
//     web page that gets blocked by `disallowed_useragent`).
//   - Apple Sign In is REQUIRED by App Store policy when other social
//     login is offered, so adding it now also satisfies that.
//   - Email + password always works as a universal fallback.
const native = isNativeApp()

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

// Native (iOS/Android): Apple button on top, then Clerk's widget for
// email sign-in below. Social buttons in Clerk are hidden — they
// would just hit the disallowed-useragent block.
function NativeSignIn() {
  const { signIn, setActive } = useSignIn()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function tapApple() {
    setErr(null)
    setBusy(true)
    try {
      await signInWithAppleNative({ signIn, setActive })
    } catch (e) {
      console.error('[Sidestand] Apple sign-in failed', e)
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
          onClick={tapApple}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded bg-white px-4 py-3 text-sm font-semibold text-black transition hover:brightness-95 disabled:opacity-50"
        >
          <AppleLogo />
          <span>{busy ? 'Continuing…' : 'Sign in with Apple'}</span>
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
          signUpForceRedirectUrl="/"
          signInForceRedirectUrl="/"
          appearance={{
            variables: clerkVariables,
            elements: {
              ...clerkElements,
              // Hide the social buttons row — embedded WebView OAuth
              // doesn't work, so we don't tease it.
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

// Web sign-in: standard Clerk widget. OAuth works fine in a real browser.
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

function AppleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#000"
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
      />
    </svg>
  )
}

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
