// Sign in with Apple — native flow for iOS via Capacitor.
//
// Why Apple specifically: it's the only OAuth provider that works
// inside a Capacitor WebView, because Apple's native dialog is a
// system-level UI (not a redirect to a website that gets blocked
// by `disallowed_useragent`).
//
// Bonus: Apple's App Store policy REQUIRES Sign in with Apple if
// any other social login is offered. Since we offer Google on web,
// implementing this is a launch requirement anyway.
//
// Flow:
//   1. User taps "Sign in with Apple"
//   2. Capacitor calls Apple's native ASAuthorization API
//   3. Apple shows the native sheet (Face ID / password / select email)
//   4. Apple returns an identity_token (a signed JWT)
//   5. We hand the token to Clerk's signIn.create({strategy: 'oauth_token_apple', token})
//   6. Clerk verifies the token with Apple's public key and creates
//      (or matches) a user, then returns a session
//   7. setActive(session) signs the user in inside the WebView

import { isNativeApp } from './platform.js'

let pluginCache = null

async function loadPlugin() {
  if (!isNativeApp()) {
    throw new Error('Apple Sign In is only available in the native app.')
  }
  if (pluginCache) return pluginCache
  // Lazy-load so the web bundle doesn't pay for native-only code.
  const mod = await import('@capacitor-community/apple-sign-in')
  pluginCache = mod.SignInWithApple
  return pluginCache
}

export async function signInWithAppleNative({ signIn, setActive }) {
  if (!signIn) throw new Error('Clerk signIn hook not available.')
  if (!setActive) throw new Error('Clerk setActive not available.')

  const SignInWithApple = await loadPlugin()

  // Trigger the native Apple dialog. The user authenticates with
  // Face ID / Touch ID / their Apple-ID password.
  // clientId for native iOS is the bundle ID (not the services-id
  // we'd use on web). Apple Developer recognizes our app via the
  // Sign-in-with-Apple capability we added in Xcode.
  const options = {
    clientId: 'app.sidestand.app',
    redirectURI: 'https://sidestand.app/sso-callback',
    scopes: 'email name',
    state: cryptoRandomState(),
    nonce: cryptoRandomState()
  }

  let appleResp
  try {
    appleResp = await SignInWithApple.authorize(options)
  } catch (err) {
    // User cancelled the dialog, or Apple errored. Surface a clean
    // message so the UI can show it.
    const msg =
      err?.message?.includes('canceled') || err?.code === '1001'
        ? 'Sign-in cancelled.'
        : `Apple sign-in failed: ${err?.message || err}`
    throw new Error(msg)
  }

  const identityToken = appleResp?.response?.identityToken
  if (!identityToken) {
    throw new Error('Apple did not return an identity token.')
  }

  // Hand the token to Clerk to verify + create/match the user.
  // The strategy 'oauth_token_apple' is Clerk's API for accepting
  // a pre-issued Apple identity token (vs. driving the OAuth dance
  // ourselves — much simpler for native).
  let result
  try {
    result = await signIn.create({
      strategy: 'oauth_token_apple',
      token: identityToken
    })
  } catch (err) {
    throw new Error(
      `Clerk could not verify the Apple token: ${err?.message || err}`
    )
  }

  // Clerk returns a SignIn resource. If the result is "complete," it
  // includes a sessionId we hand to setActive() to make it the
  // current session (signing the user in across the WebView).
  if (result?.status === 'complete' && result?.createdSessionId) {
    await setActive({ session: result.createdSessionId })
    return { ok: true }
  }

  // Otherwise Clerk needs more info (eg. they want a username for new
  // users, MFA, etc.). For Sidestand v1 we'll surface that as an error
  // and the user can fall back to email sign-in.
  throw new Error(
    `Sign-in needs additional info (status: ${result?.status || 'unknown'}). Try email sign-in.`
  )
}

// Apple requires a state + nonce per request to prevent replay attacks.
// We don't strictly verify these on the client (Clerk verifies the
// token server-side) but Apple's dialog rejects the request without
// them, so we generate something random.
function cryptoRandomState() {
  const a = new Uint8Array(16)
  crypto.getRandomValues(a)
  return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('')
}
