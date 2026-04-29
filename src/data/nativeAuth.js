// Native auth orchestration for Capacitor iOS / Android.
//
// Why this exists: Google blocks OAuth from inside an embedded
// WebView ("Error 403: disallowed_useragent"). The fix is to open
// the OAuth flow in Safari View Controller — a real native browser
// overlay running with the system Safari user-agent. The user signs
// in there, the OAuth callback redirects via Universal Links back
// to Sidestand, the WebView regains focus signed-in.
//
// Approach: instead of trying to hijack Clerk's internal navigation,
// we drive the OAuth flow ourselves:
//
//   1. Call signIn.create({strategy, redirectUrl, redirectUrlComplete})
//      Clerk returns a SignIn resource with a `firstFactorVerification`
//      that includes an `externalVerificationRedirectURL` — the actual
//      URL Google wants us to open.
//   2. We open that URL via @capacitor/browser (Safari View Controller).
//   3. User signs in with Google in real Safari.
//   4. Google redirects to Clerk, Clerk redirects to
//      sidestand.app/sso-callback?... — caught by our Universal Link.
//   5. iOS dispatches an `appUrlOpen` event with the full URL.
//   6. We close the Safari overlay and call
//      handleRedirectCallback({redirectUrl: that URL}) to complete.
//   7. Clerk SDK reads tokens from the URL, sets up the session,
//      WebView shows signed-in state.

import { isNativeApp } from './platform.js'

let browserPlugin = null
let appPlugin = null
let urlOpenSubscription = null

async function loadPlugins() {
  if (!isNativeApp()) return null
  if (!browserPlugin) {
    const { Browser } = await import('@capacitor/browser')
    browserPlugin = Browser
  }
  if (!appPlugin) {
    const { App } = await import('@capacitor/app')
    appPlugin = App
  }
  return { Browser: browserPlugin, App: appPlugin }
}

// Listen for the OAuth callback URL and finish the sign-in.
async function setupCallbackListener(clerk) {
  await teardownCallbackListener()
  const plugins = await loadPlugins()
  if (!plugins) return
  const { Browser, App } = plugins

  urlOpenSubscription = await App.addListener('appUrlOpen', async (event) => {
    const url = event?.url || ''
    // We only care about the SSO callback. Any other deep link (eg.
    // a public bike share link) can be handled separately.
    if (!url.includes('/sso-callback')) return

    try {
      // The callback URL contains Clerk's auth params. Hand it to
      // Clerk to complete the sign-in.
      if (clerk?.handleRedirectCallback) {
        await clerk.handleRedirectCallback({ redirectUrl: url })
      }
    } catch (err) {
      console.warn('Clerk redirect callback failed', err)
    } finally {
      // Close the Safari View Controller overlay.
      try {
        await Browser.close()
      } catch (_) {
        // already closed
      }
      await teardownCallbackListener()
    }
  })
}

async function teardownCallbackListener() {
  if (urlOpenSubscription) {
    try {
      await urlOpenSubscription.remove()
    } catch (_) {}
    urlOpenSubscription = null
  }
}

// Native OAuth entrypoint. `strategy` is one of Clerk's strategies
// like 'oauth_google', 'oauth_apple', 'oauth_microsoft'.
export async function startNativeOAuth({ clerk, strategy = 'oauth_google' }) {
  if (!isNativeApp()) {
    // Web fallback — let the SDK do its thing.
    if (clerk?.openSignIn) clerk.openSignIn()
    return
  }

  const plugins = await loadPlugins()
  if (!plugins) throw new Error('Capacitor plugins not available')
  const { Browser } = plugins

  const redirectUrl = 'https://sidestand.app/sso-callback'
  const redirectUrlComplete = 'https://sidestand.app/'

  // Set up the Universal Link listener BEFORE we open the browser
  // so we don't miss the callback if it fires fast.
  await setupCallbackListener(clerk)

  // Get the SignIn resource from Clerk.
  const signIn = clerk?.client?.signIn
  if (!signIn) {
    throw new Error('Clerk client.signIn not available')
  }

  // Step 1: create a SignIn attempt with the OAuth strategy. Clerk
  // returns the URL we need to send the user to.
  //
  // Different Clerk SDK versions accept different parameter shapes.
  // signIn.create() in 5.x only accepts { strategy, redirectUrl }.
  // The redirectUrlComplete is configured at the ClerkProvider level
  // (we set it in main.jsx for native), not on this call.
  let oauthUrl = null
  try {
    await signIn.create({ strategy, redirectUrl })

    // After create(), the SignIn object has a `firstFactorVerification`
    // pointing at Google's OAuth URL. Different SDK versions surface
    // it under slightly different paths — try them all.
    oauthUrl =
      signIn.firstFactorVerification?.externalVerificationRedirectURL?.toString?.() ||
      signIn.firstFactorVerification?.externalVerificationRedirectURL ||
      signIn.externalVerificationRedirectURL ||
      null

    if (oauthUrl) oauthUrl = String(oauthUrl)
  } catch (err) {
    await teardownCallbackListener()
    throw new Error(`Clerk signIn.create failed: ${err?.message || err}`)
  }

  if (!oauthUrl) {
    await teardownCallbackListener()
    throw new Error(
      'Clerk did not return an OAuth redirect URL. Check Google OAuth credentials in Clerk dashboard.'
    )
  }

  // Step 2: open the OAuth URL in Safari View Controller. This is
  // a real Safari instance with the system user-agent — Google's
  // disallowed_useragent check will pass.
  try {
    await Browser.open({
      url: oauthUrl,
      presentationStyle: 'popover',
      toolbarColor: '#0E0E10'
    })
  } catch (err) {
    await teardownCallbackListener()
    throw new Error(`Browser.open failed: ${err?.message || err}`)
  }

  // From here, the appUrlOpen listener takes over once the user
  // finishes signing in and the redirect comes back via Universal Link.
}
