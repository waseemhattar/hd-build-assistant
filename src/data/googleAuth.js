// Sign in with Google — via @capgo/capacitor-social-login.
//
// Same plugin as appleAuth.js. Uses Apple's native GoogleSignIn iOS
// SDK under the hood (via the plugin's native bridge), which presents
// the system-blessed Google dialog — bypassing the disallowed_useragent
// problem that affects WebView OAuth.
//
// Required setup outside this file:
//   - Google Cloud Console: TWO OAuth client IDs in the same project
//       (a) Web client — already created when we set up Google for web
//       (b) iOS client — bundle ID `app.sidestand.app`, type "iOS"
//   - capacitor.config.json: GoogleAuth.iosClientId + serverClientId
//     (the plugin reads them from there)
//   - Supabase Dashboard: Google provider → Authorized Client IDs
//     includes BOTH client IDs

import { isNativeApp } from './platform.js'
import { getSupabaseClient } from './supabaseClient.js'

let plugin = null
let initialised = false

async function loadPlugin() {
  if (!isNativeApp()) {
    throw new Error('Native Google Sign In is only available in the iOS app.')
  }
  if (plugin) return plugin
  const mod = await import('@capgo/capacitor-social-login')
  plugin = mod.SocialLogin
  if (!initialised) {
    // Initialize the Google side. The plugin needs both client IDs
    // here; iOS uses iosClientId for the dialog, web/server uses
    // webClientId to mint a server-verifiable idToken.
    await plugin.initialize({
      google: {
        iOSClientId:
          '840227267450-abot6d3srrj0pko9jan8ltg23mvgulh9.apps.googleusercontent.com',
        webClientId:
          '840227267450-ba10hp55jobl6glq2f54dbionkk35o25.apps.googleusercontent.com'
      }
    })
    initialised = true
  }
  return plugin
}

export async function signInWithGoogleNative() {
  const SocialLogin = await loadPlugin()

  let resp
  try {
    resp = await SocialLogin.login({
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
