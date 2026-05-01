// Sign in with Google — via @capgo/capacitor-social-login.
//
// Same plugin as appleAuth.js. Uses Apple's native GoogleSignIn iOS
// SDK under the hood (via the plugin's native bridge), which presents
// the system-blessed Google dialog — bypassing the disallowed_useragent
// problem that affects WebView OAuth.
//
// IMPORTANT IMPLEMENTATION NOTE:
//   Capacitor plugin objects are JS Proxies that forward every property
//   access to native. JavaScript's `await x` semantics inspect `x.then`
//   to see if `x` is a thenable. Forwarding `.then` to the native side
//   yields "SocialLogin.then() is not implemented on ios" and an
//   unhandled rejection. Therefore: never return the plugin from an
//   async function; never `await` an expression that resolves to it.
//   We hold the plugin in module-level `plugin` and access it directly.
//
// Required setup outside this file:
//   - Google Cloud Console: TWO OAuth client IDs in the same project
//       (a) Web client — already created when we set up Google for web
//       (b) iOS client — bundle ID `app.sidestand.app`, type "iOS"
//   - Info.plist: CFBundleURLTypes with the reversed iOS client ID
//     so iOS can route the auth callback back to the app
//   - Supabase Dashboard: Google provider → Authorized Client IDs
//     includes BOTH client IDs

import { isNativeApp } from './platform.js'
import { getSupabaseClient } from './supabaseClient.js'

let plugin = null
let initPromise = null

async function ensureReady() {
  if (!isNativeApp()) {
    throw new Error('Native Google Sign In is only available in the iOS app.')
  }
  if (plugin) return
  if (initPromise) {
    await initPromise
    return
  }
  initPromise = (async () => {
    const mod = await import('@capgo/capacitor-social-login')
    plugin = mod.SocialLogin
    await plugin.initialize({
      google: {
        iOSClientId:
          '840227267450-abot6d3srrj0pko9jan8ltg23mvgulh9.apps.googleusercontent.com',
        webClientId:
          '840227267450-ba10hp55jobl6glq2f54dbionkk35o25.apps.googleusercontent.com'
      }
    })
  })()
  try {
    await initPromise
  } catch (e) {
    // Reset so a retry can re-attempt initialization
    initPromise = null
    plugin = null
    throw e
  }
}

export async function signInWithGoogleNative() {
  await ensureReady()
  // Use the module-level `plugin` directly — never via a return value
  // from an async function (see header note about thenable trap).

  let resp
  try {
    resp = await plugin.login({
      provider: 'google',
      options: { scopes: ['profile', 'email'] }
    })
  } catch (err) {
    const msg = err?.message || String(err)
    if (msg.toLowerCase().includes('cancel')) {
      throw new Error('Sign-in cancelled.')
    }
    throw new Error(`Google sign-in failed: ${msg}`)
  }

  // Plugin response shape varies; idToken can land at result.idToken
  // or be top-level depending on plugin version.
  const idToken =
    resp?.result?.idToken ||
    resp?.idToken ||
    resp?.result?.authentication?.idToken
  if (!idToken) {
    throw new Error('Google did not return an identity token.')
  }

  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken
  })
  if (error) {
    throw new Error(
      `Supabase Google sign-in failed: ${error.message || String(error)}`
    )
  }
  return data
}
