import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import { isNativeApp } from './data/platform.js'
import './index.css'

// Vite exposes env vars prefixed VITE_ to the browser.
// The publishable key is safe to ship — it identifies the app, not a user.
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// On native, OAuth providers reject capacitor:// URLs as redirect
// targets. We force the redirect to our real https domain so OAuth
// roundtrips complete; iOS catches the post-auth landing via
// Universal Links and routes it back into the app.
const NATIVE_POST_AUTH_URL = 'https://sidestand.app/'

function makeClerkProps() {
  const props = {
    publishableKey: CLERK_PUBLISHABLE_KEY
  }
  if (isNativeApp()) {
    props.signInForceRedirectUrl = NATIVE_POST_AUTH_URL
    props.signUpForceRedirectUrl = NATIVE_POST_AUTH_URL
    props.signInFallbackRedirectUrl = NATIVE_POST_AUTH_URL
    props.signUpFallbackRedirectUrl = NATIVE_POST_AUTH_URL
  }
  return props
}

// =====================================================================
// Diagnostic error UI — shows boot errors on screen so we can debug
// problems without requiring Xcode console access. Especially useful
// inside the Capacitor WebView where opening DevTools is awkward.
// =====================================================================

function ErrorScreen({ title, detail, hint }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0E0E10',
        color: '#E8E2D5',
        padding: '2rem 1.25rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      <h1 style={{ color: '#E03A36', fontSize: 22, margin: '0 0 12px' }}>
        {title}
      </h1>
      {hint && (
        <p style={{ color: '#9A9A9F', fontSize: 13, margin: '0 0 20px' }}>
          {hint}
        </p>
      )}
      <div
        style={{
          fontFamily: 'ui-monospace, SF Mono, monospace',
          fontSize: 12,
          background: '#1A1A1F',
          padding: '14px',
          borderRadius: 8,
          border: '0.5px solid #2A2A30',
          color: '#E8E2D5',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}
      >
        {detail}
      </div>
      <div style={{ marginTop: 16, fontSize: 11, color: '#6F6E76' }}>
        Native: {String(isNativeApp())} · Origin:{' '}
        {typeof window !== 'undefined' ? window.location?.origin : '(no window)'}
        {' · Key prefix: '}
        {CLERK_PUBLISHABLE_KEY ? CLERK_PUBLISHABLE_KEY.slice(0, 12) : '(missing)'}
      </div>
    </div>
  )
}

class BootBoundary extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('[Sidestand] BootBoundary caught', error, info)
  }
  render() {
    if (this.state.error) {
      const e = this.state.error
      const detail = [
        `Name: ${e.name || ''}`,
        `Message: ${e.message || ''}`,
        e.stack ? `\nStack:\n${e.stack}` : ''
      ]
        .filter(Boolean)
        .join('\n')
      return (
        <ErrorScreen
          title="Sidestand failed to boot"
          hint="Caught a render-time error during startup."
          detail={detail}
        />
      )
    }
    return this.props.children
  }
}

// Catch unhandled promise rejections (Clerk init errors usually land here).
let lastUnhandled = null
const unhandledListeners = new Set()
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const r = event?.reason
    lastUnhandled = {
      message: r?.message || String(r || 'Unknown'),
      stack: r?.stack || '',
      name: r?.name || 'UnhandledRejection'
    }
    console.error('[Sidestand] unhandledrejection', r)
    unhandledListeners.forEach((fn) => {
      try {
        fn(lastUnhandled)
      } catch (_) {}
    })
  })
}

function PromiseRejectionWatcher({ children }) {
  const [rej, setRej] = React.useState(lastUnhandled)
  React.useEffect(() => {
    const fn = (info) => setRej(info)
    unhandledListeners.add(fn)
    return () => unhandledListeners.delete(fn)
  }, [])
  if (rej) {
    return (
      <ErrorScreen
        title="Sign-in service failed to load"
        hint="A background request rejected during boot. This is usually a network or auth-key problem."
        detail={`${rej.name}\n${rej.message}\n\n${rej.stack || ''}`}
      />
    )
  }
  return children
}

const root = ReactDOM.createRoot(document.getElementById('root'))

if (!CLERK_PUBLISHABLE_KEY) {
  root.render(
    <React.StrictMode>
      <ErrorScreen
        title="Auth not configured"
        hint="VITE_CLERK_PUBLISHABLE_KEY is missing from the build."
        detail="Add it to .env.local (local) or Netlify env vars (production), then rebuild."
      />
    </React.StrictMode>
  )
} else {
  root.render(
    <React.StrictMode>
      <BootBoundary>
        <PromiseRejectionWatcher>
          <ClerkProvider {...makeClerkProps()}>
            <App />
          </ClerkProvider>
        </PromiseRejectionWatcher>
      </BootBoundary>
    </React.StrictMode>
  )
}
