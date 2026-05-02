// Geolocation wrapper.
//
// Three runtime modes:
//   1. Native iOS with @capacitor-community/background-geolocation
//      → background-capable, gets "Always" permission, GPS keeps
//        running when screen is off. Best accuracy.
//   2. Native iOS with @capacitor/geolocation (foreground only)
//      → fallback when the background plugin isn't available
//   3. Web browser with navigator.geolocation
//      → foreground only by definition
//
// We pick at runtime based on isNativeApp() + plugin availability.
//
// Unified API:
//   await requestPermission()      → 'granted' | 'denied' | 'prompt'
//   await startTracking(callback)  → returns a stop fn; callback fires per sample
//   stopTracking()                 → also stops via the returned fn
//
// Each sample passed to callback is { lat, lng, ts, speed, accuracy }.
// ts is unix milliseconds. speed is meters/second (-1 if unknown).

import { isNativeApp } from './platform.js'

// IMPORTANT — Capacitor plugin proxies intercept EVERY property access,
// including `.then`. If we return a plugin object from an async function,
// JavaScript's `await` machinery reads `.then` to check for thenability,
// the proxy forwards that to the native bridge, native errors with
// "<Plugin>.then() is not implemented on ios", and we get an unhandled
// promise rejection. So:
//   - Plugin objects live ONLY in module-level vars.
//   - Loader functions return a boolean ("did we load it?"), never the
//     plugin itself.
//   - Callers reference `bgPlugin` / `fgPlugin` directly after a
//     successful load.

let bgPlugin = null      // Capacitor plugin proxy or null
let fgPlugin = null
let bgLoadAttempted = false
let fgLoadAttempted = false
let watcherId = null
let webWatchId = null
let currentStopFn = null

async function ensureBackgroundPlugin() {
  if (!isNativeApp()) return false
  if (bgPlugin) return true
  if (bgLoadAttempted) return false
  bgLoadAttempted = true
  try {
    // The @capacitor-community/background-geolocation package ships
    // ONLY native code + TypeScript types — no JS module entry. So we
    // can't `import` it; we register it through Capacitor's runtime
    // bridge instead, which talks to the iOS plugin directly.
    const { Capacitor, registerPlugin } = await import('@capacitor/core')
    if (!Capacitor?.isNativePlatform?.()) return false
    bgPlugin = registerPlugin('BackgroundGeolocation')
    return Boolean(bgPlugin)
  } catch (e) {
    console.warn('background-geolocation not available, falling back', e)
    return false
  }
}

async function ensureForegroundPlugin() {
  if (!isNativeApp()) return false
  if (fgPlugin) return true
  if (fgLoadAttempted) return false
  fgLoadAttempted = true
  try {
    const mod = await import('@capacitor/geolocation')
    fgPlugin = mod.Geolocation
    return Boolean(fgPlugin)
  } catch (e) {
    console.warn('@capacitor/geolocation not available', e)
    return false
  }
}

// ---------- permission ----------

export async function requestPermission() {
  if (!isNativeApp()) {
    // Web: permission is requested implicitly on the first watchPosition
    // call. We can probe via the Permissions API where available.
    if (navigator.permissions?.query) {
      try {
        const res = await navigator.permissions.query({ name: 'geolocation' })
        return res.state // 'granted' | 'denied' | 'prompt'
      } catch (_) {
        return 'prompt'
      }
    }
    return 'prompt'
  }

  // Native: we use @capacitor/geolocation (the foreground plugin)
  // for the ACTUAL permission state — its checkPermissions /
  // requestPermissions APIs are reliable across iOS versions.
  //
  // We never RETURN the plugin from an async function — we just
  // ensure it's loaded and reference the module-level `fgPlugin`
  // directly (see thenable-trap note at the top of this file).
  const fgReady = await ensureForegroundPlugin()
  if (fgReady && fgPlugin) {
    try {
      const status = await fgPlugin.checkPermissions()
      const cur = status?.location || status?.coarseLocation || 'prompt'
      if (cur === 'granted') return 'granted'
      if (cur === 'denied') return 'denied'
      // Need to ask. iOS shows the system dialog (or returns the
      // existing decision immediately if already answered).
      const req = await fgPlugin.requestPermissions()
      const after = req?.location || req?.coarseLocation || 'denied'
      return after === 'granted' ? 'granted' : 'denied'
    } catch (e) {
      console.warn('[geolocation] permission check failed', e?.message || e)
      return 'denied'
    }
  }

  // No fg plugin available. Fall through to the bg plugin's internal
  // prompt — best effort.
  const bgReady = await ensureBackgroundPlugin()
  if (bgReady) return 'prompt'
  return 'denied'
}

// ---------- start / stop tracking ----------

// callback: (sample) => void
//   sample = { lat, lng, ts, speed, accuracy }
// options:
//   distanceFilter — meters between samples (default 5)
//   accuracy       — 'high' | 'navigation'
export async function startTracking(callback, options = {}) {
  // Always stop any previous run before starting fresh.
  await stopTracking()

  const distanceFilter = options.distanceFilter ?? 5
  console.log('[geolocation] startTracking; isNative=', isNativeApp(), 'distanceFilter=', distanceFilter)

  if (!isNativeApp()) {
    console.log('[geolocation] using web navigator.geolocation')
    return startWebWatch(callback)
  }

  // Native — try background plugin first
  const bgReady = await ensureBackgroundPlugin()
  console.log('[geolocation] background plugin ready:', bgReady)
  if (bgReady && bgPlugin) {
    try {
      console.log('[geolocation] calling bg.addWatcher')
      watcherId = await bgPlugin.addWatcher(
        {
          backgroundMessage: 'Sidestand is recording your ride.',
          backgroundTitle: 'Sidestand',
          requestPermissions: true,
          stale: false,
          distanceFilter
        },
        (location, error) => {
          if (error) {
            console.warn('[geolocation] bg location error:', JSON.stringify(error))
            return
          }
          if (!location) {
            console.log('[geolocation] bg callback fired with no location')
            return
          }
          console.log(
            '[geolocation] bg sample lat=',
            location.latitude,
            'lng=',
            location.longitude,
            'speed=',
            location.speed,
            'acc=',
            location.accuracy
          )
          callback({
            lat: location.latitude,
            lng: location.longitude,
            ts: Date.now(),
            speed: typeof location.speed === 'number' ? location.speed : -1,
            accuracy: location.accuracy ?? -1
          })
        }
      )
      console.log('[geolocation] bg.addWatcher returned watcherId:', watcherId)
      currentStopFn = async () => {
        if (watcherId) {
          try {
            await bgPlugin.removeWatcher({ id: watcherId })
          } catch (_) {}
          watcherId = null
        }
      }
      return currentStopFn
    } catch (e) {
      console.warn('[geolocation] bg.addWatcher FAILED, falling back to fg:', e?.message || e)
    }
  }

  // Fallback — foreground plugin
  const fgReady = await ensureForegroundPlugin()
  console.log('[geolocation] foreground plugin ready:', fgReady)
  if (fgReady && fgPlugin) {
    console.log('[geolocation] using @capacitor/geolocation watchPosition')
    return startCapacitorFgWatch(fgPlugin, callback)
  }

  // Last resort — web API
  console.log('[geolocation] no native plugins available; using web')
  return startWebWatch(callback)
}

// Open iOS Settings to the Sidestand entry so the user can grant
// location permission. Uses the bg-geo plugin's native openSettings()
// when available; falls back to @capacitor/app's openUrl with the
// `app-settings:` scheme.
//
// Returns true if we successfully kicked off Settings, false otherwise.
export async function openLocationSettings() {
  // Web fallback — alert the user; we can't open native settings.
  if (!isNativeApp()) {
    return false
  }
  const bgReady = await ensureBackgroundPlugin()
  if (bgReady && bgPlugin && typeof bgPlugin.openSettings === 'function') {
    try {
      await bgPlugin.openSettings()
      return true
    } catch (e) {
      console.warn('[geolocation] bg.openSettings failed', e?.message || e)
    }
  }
  // Fall back to Capacitor App plugin's openUrl. The App plugin is a
  // proxy too, so we hold it in a local var only long enough to call
  // the method and never return it from this function.
  try {
    const { App } = await import('@capacitor/app')
    if (App && typeof App.openUrl === 'function') {
      await App.openUrl({ url: 'app-settings:' })
      return true
    }
  } catch (e) {
    console.warn('[geolocation] App.openUrl failed', e?.message || e)
  }
  return false
}

export async function stopTracking() {
  if (currentStopFn) {
    try {
      await currentStopFn()
    } catch (_) {}
    currentStopFn = null
  }
  if (webWatchId != null && navigator.geolocation) {
    navigator.geolocation.clearWatch(webWatchId)
    webWatchId = null
  }
}

// ---------- private helpers ----------

async function startCapacitorFgWatch(fg, callback) {
  const id = await fg.watchPosition(
    { enableHighAccuracy: true, timeout: 10000 },
    (position, error) => {
      if (error || !position) return
      callback({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        ts: position.timestamp || Date.now(),
        speed:
          typeof position.coords.speed === 'number'
            ? position.coords.speed
            : -1,
        accuracy: position.coords.accuracy
      })
    }
  )
  currentStopFn = async () => {
    try {
      await fg.clearWatch({ id })
    } catch (_) {}
  }
  return currentStopFn
}

function startWebWatch(callback) {
  if (!navigator.geolocation) {
    throw new Error('Geolocation not supported in this browser.')
  }
  webWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      callback({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        ts: pos.timestamp || Date.now(),
        speed: typeof pos.coords.speed === 'number' ? pos.coords.speed : -1,
        accuracy: pos.coords.accuracy
      })
    },
    (err) => {
      console.warn('web geolocation error', err)
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  )
  currentStopFn = async () => {
    if (webWatchId != null) {
      navigator.geolocation.clearWatch(webWatchId)
      webWatchId = null
    }
  }
  return currentStopFn
}
