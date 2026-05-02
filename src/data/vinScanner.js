// VIN scanner — Capacitor barcode-scanning wrapper.
//
// Why a separate module: the scanner only loads on native (iOS/Android),
// but the rest of the app still runs in any web context. We dynamic-
// import @capacitor-mlkit/barcode-scanning so the web bundle isn't
// forced to include a native-only plugin (and the import cost only
// happens the first time the rider taps "Scan VIN").
//
// HD VIN tags use Code 39 (linear) barcodes on the steering-head plate
// and on the frame near the seat. ML Kit decodes those reliably via
// the iPhone's main camera. We also accept Code 128 + QR as a safety
// net for anything atypical (older or non-HD bikes).
//
// What we return:
//   { ok: true, vin }   — clean 17-char VIN, normalized
//   { ok: false, reason } — why it failed (permission denied, cancelled, no VIN found)

import { isNativeApp } from './platform.js'
import { normalizeVin } from './vinDecoder.js'

let pluginPromise = null
function loadPlugin() {
  if (!pluginPromise) {
    pluginPromise = import('@capacitor-mlkit/barcode-scanning').then(
      (mod) => mod
    )
  }
  return pluginPromise
}

// Returns true on iOS/Android Capacitor builds where the scanner plugin
// is available. Web builds always return false — caller hides the
// "Scan VIN" button in that case.
export function isVinScanSupported() {
  return isNativeApp()
}

export async function scanVin() {
  if (!isNativeApp()) {
    return { ok: false, reason: 'Camera scanning is only available on the iOS app.' }
  }

  let mod
  try {
    mod = await loadPlugin()
  } catch (e) {
    return {
      ok: false,
      reason:
        'Couldn’t load the barcode scanner. Try reinstalling the app or scan the VIN manually.'
    }
  }

  const { BarcodeScanner, BarcodeFormat } = mod

  // Permissions: ML Kit auto-prompts the first time, but we ask
  // explicitly so we can short-circuit a denied permission with a
  // friendly message instead of letting scan() throw.
  try {
    const perm = await BarcodeScanner.requestPermissions()
    if (perm.camera !== 'granted' && perm.camera !== 'limited') {
      return {
        ok: false,
        reason:
          'Camera permission is off. Enable it in iOS Settings → Sidestand to scan VINs.'
      }
    }
  } catch (e) {
    // Some plugin versions don't surface permission state — fall
    // through to scan(); it'll prompt natively.
  }

  // Some Android builds need an ML Kit module installed on first run.
  // Safe no-op on iOS (ML Kit ships in the framework).
  try {
    if (typeof BarcodeScanner.isGoogleBarcodeScannerModuleAvailable === 'function') {
      const { available } =
        await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()
      if (!available) {
        await BarcodeScanner.installGoogleBarcodeScannerModule()
      }
    }
  } catch (_) {
    // Non-fatal. Continue.
  }

  let res
  try {
    res = await BarcodeScanner.scan({
      formats: [
        BarcodeFormat.Code39, // HD steering-head VIN tag
        BarcodeFormat.Code128, // some non-HD bikes
        BarcodeFormat.QrCode, // future-proofing
        BarcodeFormat.DataMatrix
      ]
    })
  } catch (e) {
    const msg = String(e?.message || e || '')
    if (/cancel/i.test(msg)) {
      return { ok: false, reason: 'cancelled' }
    }
    return {
      ok: false,
      reason: msg || 'Scan failed. Try again or enter the VIN manually.'
    }
  }

  const barcodes = res?.barcodes || []
  // Pick the first scan that normalizes to a 17-char VIN. Some HD
  // tags also encode the build number (10-12 chars) on a second
  // barcode strip — we ignore those.
  for (const b of barcodes) {
    const v = normalizeVin(b.rawValue || b.displayValue || '')
    if (v.length === 17) {
      return { ok: true, vin: v }
    }
  }

  return {
    ok: false,
    reason:
      'No 17-character VIN found in that scan. Frame the steering-head VIN tag and try again.'
  }
}
