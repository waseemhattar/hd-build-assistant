// Sign in with Apple — via @capgo/capacitor-social-login.
//
// We use one plugin for both Apple AND Google because @capgo's
// capacitor-social-login is actively maintained for Capacitor 6 and
// reliably bridges the native dialogs on iOS. The older
// @capacitor-community/apple-sign-in works too, but bundling everything
// in one plugin keeps the iOS native config simpler.
//
// Flow on iOS:
//   1. SocialLogin.login({provider: 'apple'}) shows the native Apple dialog
//   2. User authenticates with Face ID / Touch ID
//   3. Plugin returns { idToken, user } where idToken is Apple's signed JWT
//   4. We hand the idToken to Supabase via signInWithIdToken
//   5. Supabase verifies against Apple's JWKS, creates/matches user, issues session

import { isNativeApp } from './platform.js'
import { getSupabaseClient } from './supabaseClient.js'

let plugin = null
let initialised = false

async function loadPlugin() {
  if (!isNativeApp()) {
    throw new Error('Apple Sign In is only available in the native app.')
  }
  if (plugin) return plugin
  const mod = await import('@capgo/capacitor-social-login')
  plugin = mod.SocialLogin
  if (!initialised) {
    // Initialize the Apple side. clientId for native iOS is the bundle ID.
    await plugin.initialize({
      apple: {
        clientId: 'app.sidestand.app'
      }
    })
    initialised = true
  }
  return plugin
}

export async function signInWithAppleNative() {
  const SocialLogin = await loadPlugin()

  let resp
  try {
    resp = await SocialLogin.login({
      provider: 'apple',
      options: {
        scopes: ['email', 'name']
      }
    })
  } catch (err) {
    const msg = err?.message || String(err)
    if (msg.toLowerCase().includes('cancel')) {
      throw new Error('Sign-in cancelled.')
    }
    throw new Error(`Apple sign-in failed: ${msg}`)
  }

  // Plugin response shape: { result: { idToken, accessToken, profile, ... } }
  // or sometimes flat { idToken, ... } depending on version. Handle both.
  const idToken =
    resp?.result?.idToken || resp?.idToken || resp?.identityToken
  if (!idToken) {
    throw new Error('Apple did not return an identity token.')
  }

  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: idToken
  })
  if (error) {
    throw new Error(
      `Supabase Apple sign-in failed: ${error.message || String(error)}`
    )
  }
  return data
}
