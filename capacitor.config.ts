import type { CapacitorConfig } from '@capacitor/cli'

// Capacitor wraps the React/Vite build into a native iOS (and later
// Android) shell. The web app runs inside a WKWebView; native plugins
// expose phone APIs (camera, GPS, etc.) when we're ready to use them.
//
// The webDir points at Vite's build output (`dist/`). When you run
// `npm run ios:sync`, Capacitor copies that folder into the iOS app
// bundle so the WebView loads it on launch.

const config: CapacitorConfig = {
  // Bundle ID, registered in your Apple Developer account.
  // Must match the App ID you created at developer.apple.com.
  appId: 'app.sidestand.app',

  // Display name under the home-screen icon. Keep ≤ 12 chars or iOS
  // truncates with an ellipsis.
  appName: 'Sidestand',

  // Where Vite writes the built site.
  webDir: 'dist',

  // Bundle the web assets into the app rather than loading from a
  // remote URL. Good for offline use; required for App Store review
  // (Apple rejects apps that are pure web-view loaders without offline
  // support).
  bundledWebRuntime: false,

  ios: {
    // The scheme used for deep links back into the app (eg. Clerk
    // OAuth callbacks). Must match what we register in Info.plist
    // and what Clerk's allowed-redirect-URIs list contains.
    //
    // Format: `sidestand://...` deep links will route to the app.
    scheme: 'Sidestand',
    // Allow the WebView to load arbitrary HTTPS resources (Supabase,
    // Clerk, Cloudflare images, etc.). We're not relaxing for HTTP —
    // everything Sidestand talks to is HTTPS.
    contentInset: 'always',
    // Set the WebView background to match the dark theme so there's
    // no white flash during navigation transitions.
    backgroundColor: '#0E0E10'
  },

  // Splash screen behavior — shown while the WebView boots.
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#0E0E10',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      // Light icons on the dark status bar.
      style: 'DARK',
      backgroundColor: '#0E0E10',
      overlaysWebView: false
    }
  },

  // While iterating with `npm run dev` you can flip this to true and
  // set `url` to your laptop's IP so the iPhone loads from your dev
  // server with hot reload. Keep `false` for production builds.
  server: {
    androidScheme: 'https',
    iosScheme: 'sidestand',
    cleartext: false
  }
}

export default config
