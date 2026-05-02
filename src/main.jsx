import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './auth/AuthProvider.jsx'
import App from './App.jsx'
import { isNativeApp } from './data/platform.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)

// Hide Capacitor's native splash screen as soon as React has rendered.
// Without this the splash hides on a hard-coded timeout, which makes
// cold starts feel slow even after the web app is fully painted. We
// fire-and-forget on a microtask so the import doesn't block startup.
if (isNativeApp()) {
  // Lazy import keeps the web bundle lean — splash plugin only ships
  // for native, never gets evaluated in the browser.
  import('@capacitor/splash-screen')
    .then(({ SplashScreen }) => SplashScreen.hide())
    .catch((e) => console.warn('[splash] hide failed', e))
}
