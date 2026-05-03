import React, { useState } from 'react'
import TopNav from './TopNav.jsx'
import Logo from './Logo.jsx'
import { getSupabaseClient } from '../data/supabaseClient.js'
import { isNativeApp } from '../data/platform.js'
import { signInWithAppleNative } from '../data/appleAuth.js'
import { signInWithGoogleNative } from '../data/googleAuth.js'

// Sign-in page. Branches on native vs web because the OAuth mechanics
// differ:
//
// On the web:
//   supabase.auth.signInWithOAuth({provider: 'google'}) → redirect →
//   Google → redirect back → Supabase reads ?code= from URL → session.
//
// On native (Capacitor iOS):
//   We use NATIVE plugins (Apple's GoogleSignIn SDK + Apple Sign In)
//   that show a system-level dialog. They return a signed idToken JWT.
//   We hand the token to supabase.auth.signInWithIdToken(), which
//   verifies it server-side and issues our session.
//
// Why the split: Google blocks OAuth flows from inside embedded
// WebViews ("disallowed_useragent"), and Capacitor WebViews can't
// handle the redirect-callback dance cleanly with custom URL schemes.
// Native plugins sidestep both problems entirely.

const native = isNativeApp()

export default function SignInPage({ onBack }) {
  const [mode, setMode] = useState('signin')

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
            {mode === 'signin' ? 'Welcome back' : 'Welcome to Sidestand'}
          </div>
        </div>

        <div className="w-full rounded-md border border-hd-border bg-hd-dark p-5">
          <div className="mb-4 text-center">
            <div className="font-display text-xl tracking-wider text-hd-text">
              {mode === 'signin' ? 'SIGN IN' : 'SIGN UP'}
            </div>
            <div className="mt-1 text-xs text-hd-muted">
              {mode === 'signin'
                ? 'Pick how you want to sign in.'
                : 'Takes about 30 seconds.'}
            </div>
          </div>

          {/* Native button(s) — native takes the native plugin path,
              web takes the standard Supabase OAuth redirect path. */}
          {native ? (
            <div className="space-y-3">
              <AppleNativeButton />
              <GoogleNativeButton mode={mode} />
            </div>
          ) : (
            <GoogleWebButton mode={mode} />
          )}

          <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-widest text-hd-muted">
            <div className="h-px flex-1 bg-hd-border" />
            or use email
            <div className="h-px flex-1 bg-hd-border" />
          </div>

          <EmailForm mode={mode} />

          <div className="mt-4 text-center text-xs text-hd-muted">
            {mode === 'signin' ? (
              <>
                No account yet?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-hd-orange hover:brightness-110"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-hd-orange hover:brightness-110"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          {/* Consent line. Shown on both signin and signup since
              even returning users benefit from the privacy/support
              links, and Apple's App Store Review Guidelines (5.1.1)
              expect a clear privacy-policy reference at the auth
              moment. Anchor tags (not buttons) so the URLs are
              copyable and crawlable. */}
          <div className="mt-3 text-center text-[11px] leading-relaxed text-hd-muted">
            By continuing, you agree to our{' '}
            <a
              href="/privacy"
              className="text-hd-orange hover:brightness-110"
            >
              Privacy Policy
            </a>
            . Need a hand? Visit{' '}
            <a
              href="/support"
              className="text-hd-orange hover:brightness-110"
            >
              Support
            </a>
            .
          </div>
        </div>

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

// ----- Native Apple Sign In (iOS) -----

function AppleNativeButton() {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function tap() {
    setErr(null)
    setBusy(true)
    try {
      await signInWithAppleNative()
      // AuthProvider's onAuthStateChange fires and re-renders the app.
    } catch (e) {
      setErr(e?.message || 'Sign-in failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        onClick={tap}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded bg-white px-4 py-3 text-sm font-semibold text-black transition hover:brightness-95 disabled:opacity-50"
      >
        <AppleLogo />
        <span>{busy ? 'Continuing…' : 'Sign in with Apple'}</span>
      </button>
      {err && <ErrorBlock message={err} />}
    </>
  )
}

// ----- Native Google Sign In (iOS) -----

function GoogleNativeButton({ mode }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function tap() {
    setErr(null)
    setBusy(true)
    try {
      await signInWithGoogleNative()
    } catch (e) {
      setErr(e?.message || 'Sign-in failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        onClick={tap}
        disabled={busy}
        className="flex w-full items-center justify-center gap-3 rounded border border-hd-border bg-hd-black px-4 py-3 text-sm font-semibold text-hd-text transition hover:border-hd-orange disabled:opacity-50"
      >
        <GoogleG />
        <span>
          {busy
            ? 'Opening Google…'
            : mode === 'signin'
            ? 'Continue with Google'
            : 'Sign up with Google'}
        </span>
      </button>
      {err && <ErrorBlock message={err} />}
    </>
  )
}

// ----- Web Google OAuth (browser redirect flow) -----

function GoogleWebButton({ mode }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function tap() {
    setErr(null)
    setBusy(true)
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          skipBrowserRedirect: false
        }
      })
      if (error) throw error
    } catch (e) {
      setErr(e?.message || 'Sign-in failed.')
      setBusy(false)
    }
  }

  return (
    <>
      <button
        onClick={tap}
        disabled={busy}
        className="flex w-full items-center justify-center gap-3 rounded border border-hd-border bg-hd-black px-4 py-3 text-sm font-semibold text-hd-text transition hover:border-hd-orange disabled:opacity-50"
      >
        <GoogleG />
        <span>
          {busy
            ? 'Opening Google…'
            : mode === 'signin'
            ? 'Continue with Google'
            : 'Sign up with Google'}
        </span>
      </button>
      {err && <ErrorBlock message={err} />}
    </>
  )
}

// ----- Email + password (works on web AND native unchanged) -----

function EmailForm({ mode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const [info, setInfo] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setErr(null)
    setInfo(null)
    setBusy(true)
    try {
      const supabase = getSupabaseClient()
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })
        if (error) throw error
      } else {
        // Email confirmation links go to https://sidestand.app — works
        // on web; on native, tapping the link opens Safari, the user
        // confirms, then comes back to the app and signs in normally.
        const redirectTo = 'https://sidestand.app/'
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: redirectTo }
        })
        if (error) throw error
        if (!data?.session) {
          setInfo("We sent you an email — click the link to confirm and you're in.")
        }
      }
    } catch (e) {
      setErr(e?.message || 'Auth failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs uppercase tracking-widest text-hd-muted">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          autoComplete="email"
          inputMode="email"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-widest text-hd-muted">
          Password
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
        />
      </div>
      {err && <ErrorBlock message={err} />}
      {info && (
        <div className="rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          {info}
        </div>
      )}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded bg-hd-orange px-4 py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
      >
        {busy
          ? mode === 'signin'
            ? 'Signing in…'
            : 'Creating account…'
          : mode === 'signin'
          ? 'Continue'
          : 'Create account'}
      </button>
    </form>
  )
}

// ----- Visual bits -----

function ErrorBlock({ message }) {
  return (
    <div className="mt-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
      {message}
    </div>
  )
}

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
