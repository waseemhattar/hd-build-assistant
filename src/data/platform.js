// Tiny platform-detection helper. Lets React components branch on
// "are we running inside a Capacitor native app?" without pulling in
// the whole Capacitor SDK at every call site.
//
// In a normal browser tab, `window.Capacitor` is undefined → isNative
// returns false. Inside the iOS/Android Capacitor WebView, that global
// is injected by the runtime → isNative returns true.
//
// Why we want this flag at the React level:
//   - Different auth flow on mobile (Clerk uses native deep-link
//     callbacks; web uses popups)
//   - Different camera/photo picker (mobile gets Capacitor's native
//     plugin; web uses <input type="file">)
//   - Tap targets / safe-area padding (notch + home indicator)
//   - Future: GPS / accelerometer / mic require native plugins

export function isNativeApp() {
  if (typeof window === 'undefined') return false
  return Boolean(window.Capacitor?.isNativePlatform?.())
}

// Convenience: which OS we're on. Returns 'ios' | 'android' | 'web'.
export function getPlatform() {
  if (typeof window === 'undefined') return 'web'
  const cap = window.Capacitor
  if (cap?.getPlatform) return cap.getPlatform() // 'ios' | 'android' | 'web'
  return 'web'
}

// True when running on an iPhone/iPad inside the Capacitor app.
export function isIOS() {
  return getPlatform() === 'ios'
}

export function isAndroid() {
  return getPlatform() === 'android'
}
