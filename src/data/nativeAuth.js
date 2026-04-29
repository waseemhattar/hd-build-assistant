// Native auth orchestration for Capacitor iOS / Android.
//
// Why this exists: Google (and Apple, and Microsoft) blocks OAuth
// flows that run inside an embedded WebView. Their `disallowed_useragent`
// check looks at the User-Agent header and refuses anything that
// isn't a real browser. So we can't just `window.location =` the
// OAuth URL inside Capacitor's WKWebView.
//
// The solution Apple/Google bless is Safari View Controller (iOS) /
// Custom Tabs (Android) — the system browser embedded as an overlay,
// running with a real Safari/Chrome user-agent. The user signs in,
// the OAuth callback redirects to our domain, iOS catches it via
// Universal Links, our app reopens, we hand the auth params to Clerk
// to complete the session, and close the browser overlay.
//
// Flow:
//   1. User taps "Continue with Google"
//   2. We compute the OAuth URL from Clerk's SDK
//   3. We open it via @capacitor/browser (Safari View Controller)
//   4. User authenticates with Google in real Safari
//   5. Google → Clerk → sidestand.app/sso-callback?... (real https URL)
//   6. iOS sees our Universal Link → routes to the app
//   7. Capacitor's appUrlOpen event fires with the full URL
//   8. We parse the query params and pass them to Clerk SDK
//   9. We close the Safari overlay
//  10. WebView is now signed in
//
// On the web (non-Capacitor), we do nothing — Clerk's default
// browser-based flow works fine.

import { isNativeApp } from './platform.js'

let browserPlugin = null
let appPlugin = null
let urlOpenSubscription = null

// Lazy-load the Capacitor plugins. They're only present in the native
// runtime; importing them on web triggers warnings and adds dead code
// to the bundle.
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

// Hook: install a one-shot listener that catches the OAuth callback
// URL when it lands on the device. iOS dispatches `appUrlOpen` with
// the full URL the Universal Link pointed at — we use that to extract
// Clerk's auth params, hand them to the Clerk SDK, and close the
// Safari overlay.
//
// We accept a `clerk` argument (the Clerk SDK instance from useClerk
// or from `window.Clerk`) so this module isn't bound to a specific
// React hook.
export async function startNativeOAuth({ clerk, strategy = 'oauth_google' }) {
  if (!isNativeApp()) {
    // On the web, fall back to the SDK's default flow.
    if (clerk?.openSignIn) {
      return clerk.openSignIn()
    }
    return
  }

  const plugins = await loadPlugins()
  if (!plugins) return

  const { Browser, App } = plugins

  // Build the OAuth URL Clerk expects. Clerk's React SDK exposes
  // signIn.authenticateWithRedirect() which both creates the OAuth
  // attempt AND navigates the page — we don't want the navigate part,
  // so we intercept by overriding window.open temporarily.
  //
  // The redirect URL is the universal-link URL that iOS will catch.
  const redirectUrl = 'https://sidestand.app/sso-callback'
  const redirectUrlComplete = 'https://sidestand.app/'

  // Set up the Universal Link listener BEFORE opening the browser
  // so we don't miss the callback if it fires fast.
  await teardownUrlListener()
  urlOpenSubscription = await App.addListener('appUrlOpen', async (event) => {
    const url = event?.url || ''
    if (!url.includes('/sso-callback')) return

    try {
      // Hand the callback URL to Clerk to finish the OAuth flow.
      // The SDK reads the rotating_token / __clerk_status / etc. from
      // the URL query and completes the session.
      if (clerk?.handleRedirectCallback) {
        await clerk.handleRedirectCallback({
          redirectUrl: url
        })
      }
    } catch (err) {
      console.warn('Clerk callback failed', err)
    } finally {
      // Always close the Safari overlay so the user lands back in
      // the app, signed-in.
      try {
        await Browser.close()
      } catch (_) {
        // close() throws if already closed; safe to ignore
      }
      await teardownUrlListener()
    }
  })

  // Trigger Clerk to build the OAuth URL. We hijack the window.open
  // call the SDK uses internally so we can route the URL through the
  // Capacitor Browser plugin instead.
  const originalOpen = window.open
  let capturedUrl = null
  window.open = (urlArg) => {
    capturedUrl = urlArg
    return null
  }

  try {
    // signIn.authenticateWithRedirect kicks off the OAuth flow.
    // Pass strategy ('oauth_google' / 'oauth_microsoft' etc.) and
    // redirect URLs.
    if (clerk?.client?.signIn?.authenticateWithRedirect) {
      await clerk.client.signIn.authenticateWithRedirect({
        strategy,
        redirectUrl,
        redirectUrlComplete
      })
    } else if (clerk?.signIn?.authenticateWithRedirect) {
      await clerk.signIn.authenticateWithRedirect({
        strategy,
        redirectUrl,
        redirectUrlComplete
      })
    } else {
      throw new Error(
        'Clerk SDK signIn.authenticateWithRedirect not available'
      )
    }
  } finally {
    window.open = originalOpen
  }

  // If we caught the OAuth URL via window.open hijacking, open it in
  // Safari View Controller. Otherwise the SDK already navigated and
  // there's nothing more to do (probably the web fallback).
  if (capturedUrl) {
    await Browser.open({
      url: capturedUrl,
      presentationStyle: 'popover',
      // Light theme works better with Google's sign-in page
      toolbarColor: '#0E0E10'
    })
  }
}

async function teardownUrlListener() {
  if (urlOpenSubscription) {
    try {
      await urlOpenSubscription.remove()
    } catch (_) {
      // ignore double-remove
    }
    urlOpenSubscription = null
  }
}
