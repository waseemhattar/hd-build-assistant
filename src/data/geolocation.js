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

let bgPlugin = null
let fgPlugin = null
let watcherId = null
let webWatchId = null
let currentStopFn = null

async function loadBackgroundPlugin() {
  if (!isNativeApp()) return null
  if (bgPlugin === false) return null // tried before, not available
  if (bgPlugin) return bgPlugin
  try {
    // The @capacitor-community/background-geolocation package ships
    // ONLY native code + TypeScript types — no JS module entry. So we
    // can't `import` it; we register it through Capacitor's runtime
    // bridge instead, which talks to the iOS plugin directly.
    const { Capacitor, registerPlugin } = await import('@capacitor/core')
    if (!Capacitor?.isNativePlatform?.()) {
      bgPlugin = false
      return null
    }
    bgPlugin = registerPlugin('BackgroundGeolocation')
    return bgPlugin
  } catch (e) {
    console.warn('background-geolocation not available, falling back', e)
    bgPlugin = false
    return null
  }
}

async function loadForegroundPlugin() {
  if (!isNativeApp()) return null
  if (fgPlugin) return fgPlugin
  try {
    const mod = await import('@capacitor/geolocation')
    fgPlugin = mod.Geolocation
    return fgPlugin
  } catch (e) {
    console.warn('@capacitor/geolocation not available', e)
    return null
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

  // Native: the community background plugin doesn't expose
  // checkPermissions/requestPermissions — it requests them on the
  // first addWatcher call when requestPermissions: true is passed.
  // So for the BG plugin, we just confirm the JS bridge is wired and
  // let startTracking handle the prompt. For the foreground plugin
  // (which DOES expose proper perm methods) we still ask explicitly
  // so the user sees a prompt before the recording UI animates in.
  const bg = await loadBackgroundPlugin()
  if (bg) {
    // Defer real permission prompt to addWatcher. From here we just
    // report 'prompt' so the UI knows iOS will ask on Start.
    return 'prompt'
  }
  const fg = await loadForegroundPlugin()
  if (fg) {
    const status = await fg.checkPermissions()
    if (status?.location === 'granted') return 'granted'
    const req = await fg.requestPermissions()
    return req?.location === 'granted' ? 'granted' : 'denied'
  }
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

  if (!isNativeApp()) {
    return startWebWatch(callback)
  }

  // Native — try background plugin first
  const bg = await loadBackgroundPlugin()
  if (bg) {
    try {
      watcherId = await bg.addWatcher(
        {
          backgroundMessage: 'Sidestand is recording your ride.',
          backgroundTitle: 'Sidestand',
          requestPermissions: true,
          stale: false,
          distanceFilter
        },
        (location, error) => {
          if (error) {
            console.warn('bg location error', error)
            return
          }
          if (!location) return
          callback({
            lat: location.latitude,
            lng: location.longitude,
            ts: Date.now(),
            speed: typeof location.speed === 'number' ? location.speed : -1,
            accuracy: location.accuracy ?? -1
          })
        }
      )
      currentStopFn = async () => {
        if (watcherId) {
          try {
            await bg.removeWatcher({ id: watcherId })
          } catch (_) {}
          watcherId = null
        }
      }
      return currentStopFn
    } catch (e) {
      console.warn('bg.addWatcher failed, falling back to fg', e)
    }
  }

  // Fallback — foreground plugin
  const fg = await loadForegroundPlugin()
  if (fg) {
    return startCapacitorFgWatch(fg, callback)
  }

  // Last resort — web API
  return startWebWatch(callback)
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
