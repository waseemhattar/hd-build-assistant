import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import { isNativeApp } from './data/platform.js'
import './index.css'

// Vite exposes env vars prefixed VITE_ to the browser.
// The publishable key is safe to ship — it identifies the app, not a user.
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Mobile-aware redirect URL.
//
// Why: when the app runs in a Capacitor WebView, the page URL is
// `capacitor://localhost/...`. Clerk's REST API rejects any redirect
// URL whose scheme isn't http or https — so OAuth flows that pass the
// current page URL as the redirect target fail with:
//   "Please provide a URL with one of the following schemes: https, http"
//
// Fix: when running natively, override the redirect URL to a real
// https URL on our domain (sidestand.app/post-auth). The WebView
// intercepts navigation to that URL — Capacitor lets us route the
// post-auth landing back into the bundled webDir before the WebView
// actually visits the URL externally. From the user's perspective:
// they tap "Continue with Google", Safari opens for sign-in, then
// the WebView regains focus signed-in.
//
// On the web (regular browser), we don't need any override — Clerk's
// default uses window.location which is already https.
const NATIVE_POST_AUTH_URL = 'https://sidestand.app/'

function makeClerkProps() {
  const props = {
    publishableKey: CLERK_PUBLISHABLE_KEY
  }
  if (isNativeApp()) {
    // These three are the post-OAuth landing targets. Clerk reads
    // them when building the OAuth redirect URL it sends to Google /
    // Microsoft / etc.
    props.signInForceRedirectUrl = NATIVE_POST_AUTH_URL
    props.signUpForceRedirectUrl = NATIVE_POST_AUTH_URL
    props.afterSignInUrl = NATIVE_POST_AUTH_URL
    props.afterSignUpUrl = NATIVE_POST_AUTH_URL
  }
  return props
}

function MissingKeyScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#e5e5e5',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <h1 style={{ color: '#f97316' }}>Auth not configured</h1>
      <p>
        <code>VITE_CLERK_PUBLISHABLE_KEY</code> is missing. Add it to{' '}
        <code>.env.local</code> (for local dev) or Netlify environment
        variables (for production), then rebuild.
      </p>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

if (!CLERK_PUBLISHABLE_KEY) {
  root.render(
    <React.StrictMode>
      <MissingKeyScreen />
    </React.StrictMode>
  )
} else {
  root.render(
    <React.StrictMode>
      <ClerkProvider {...makeClerkProps()}>
        <App />
      </ClerkProvider>
    </React.StrictMode>
  )
}
