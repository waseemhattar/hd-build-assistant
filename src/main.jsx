import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

// Vite exposes env vars prefixed VITE_ to the browser.
// The publishable key is safe to ship — it identifies the app, not a user.
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

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
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </React.StrictMode>
  )
}
