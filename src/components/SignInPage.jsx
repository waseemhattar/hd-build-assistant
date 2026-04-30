import React, { useState } from 'react'
import TopNav from './TopNav.jsx'
import Logo from './Logo.jsx'
import { getSupabaseClient } from '../data/supabaseClient.js'
import { isNativeApp } from '../data/platform.js'

// Sign-in page. Custom UI on top of Supabase Auth — no third-party
// widget, full control over the look + feel.
//
// Supported flows:
//   - Google OAuth (works on web AND inside Capacitor WebView since
//     Supabase uses PKCE and a clean callback URL)
//   - Email + password (universal fallback, works everywhere)
//   - Sign in with Apple via the Capacitor plugin on iOS only (later)
//
// On submit, Supabase Auth tracks the session in localStorage; the
// AuthProvider's onAuthStateChange listener picks it up and re-renders
// the app with the user signed in. No redirect dance, no popups.

export default function SignInPage({ onBack }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
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
            {mode === 'signin' ? 'Welcome to Sidestand' : 'Join Sidestand'}
          </div>
        </div>

        <div className="w-full rounded-md border border-hd-border bg-hd-dark p-5">
          <div className="mb-4 text-center">
            <div className="font-display text-xl tracking-wider text-hd-text">
              {mode === 'signin' ? 'SIGN IN' : 'SIGN UP'}
            </div>
            <div className="mt-1 text-xs text-hd-muted">
              {mode === 'signin'
                ? 'Pick how you want to continue'
                : 'Create an account in 30 seconds'}
            </div>
          </div>

          <GoogleButton mode={mode} />

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

// ----- Google OAuth button -----

function GoogleButton({ mode }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function tap() {
    setErr(null)
    setBusy(true)
    try {
      const supabase = getSupabaseClient()
      // Where to send the user after Google completes.
      //
      // Web: stay on whatever origin the page is on (sidestand.app
      //   in production, localhost during dev).
      // Native iOS: ALSO send back to sidestand.app, NOT capacitor://.
      //   The iOS app is a thin shell that loads sidestand.app over
      //   the network, so Safari can land on https://sidestand.app
      //   and the WebView is already there — session detection runs
      //   inside the WebView and signs the user in.
      //   We tried capacitor://localhost earlier; Safari can't open
      //   that scheme so it errors with "address is invalid."
      const redirectTo = isNativeApp()
        ? 'https://sidestand.app/'
        : `${window.location.origin}/`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: false
        }
      })
      if (error) throw error
      // signInWithOAuth navigates the page; we won't reach this line on web.
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
      {err && (
        <div className="mt-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {err}
        </div>
      )}
    </>
  )
}

// ----- Email + password form -----

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
        // AuthProvider's listener picks up the session and re-renders.
      } else {
        // Same logic as Google OAuth: native + web both come back to
        // sidestand.app since iOS is a thin shell over the website.
        const redirectTo = isNativeApp()
          ? 'https://sidestand.app/'
          : `${window.location.origin}/`
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: redirectTo }
        })
        if (error) throw error
        // If email confirmations are enabled, user has to verify via
        // email before they can sign in. Otherwise the session lands now.
        if (data?.session) {
          // Already signed in — listener will redirect.
        } else {
          setInfo('Check your email to confirm your account.')
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
      {err && (
        <div className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {err}
        </div>
      )}
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
