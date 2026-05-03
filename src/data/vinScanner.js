// VIN scanner — Capacitor barcode + OCR wrapper.
//
// Two-stage scan flow so we cover both spec variants:
//
//   1. BARCODE — open ML Kit's live barcode scanner. US-spec Harleys
//      print a Code 39 barcode on the steering-head plate; that path
//      is fast (sub-second) and very reliable.
//
//   2. OCR FALLBACK — European-spec (and many other-region) bikes
//      have a TEXT-ONLY VIN plate with no barcode at all. When the
//      barcode scan returns nothing useful, we capture a still photo
//      via @capacitor/camera and run @capacitor-mlkit/text-recognition
//      on the image, then regex out the 17-character VIN.
//
// Both stages are dynamically imported so the web bundle stays light.
// scanVin() resolves to:
//   { ok: true, vin, source: 'barcode'|'ocr' }
//   { ok: false, reason: 'cancelled'|'permission'|<message> }

import { isNativeApp } from './platform.js'
import { normalizeVin } from './vinDecoder.js'

let barcodePromise = null
let textRecPromise = null
let cameraPromise = null

function loadBarcode() {
  if (!barcodePromise) {
    barcodePromise = import('@capacitor-mlkit/barcode-scanning')
  }
  return barcodePromise
}
function loadTextRec() {
  if (!textRecPromise) {
    // @capacitor-community/image-to-text wraps Apple Vision text
    // recognition on iOS and Google ML Kit on Android. The exposed
    // class is `Ocr`; call `Ocr.detectText({ filename })` to OCR a
    // local image and get back { textDetections: [{ text, ... }] }.
    textRecPromise = import('@capacitor-community/image-to-text')
  }
  return textRecPromise
}
function loadCamera() {
  if (!cameraPromise) {
    cameraPromise = import('@capacitor/camera')
  }
  return cameraPromise
}

export function isVinScanSupported() {
  return isNativeApp()
}

// Pull the first 17-char VIN-shaped substring out of a free-text blob.
// VINs use alphanumerics minus I/O/Q (so they can't be confused with
// digits 1, 0). The OCR text usually has the VIN as its own line plus
// a bunch of metadata around it (kg, kW, dB, etc.) — this regex picks
// out the right run.
export function extractVinFromText(text) {
  if (!text) return null
  const upper = String(text).toUpperCase()
  // Drop anything that isn't VIN-legal (I/O/Q excluded, no whitespace).
  // Replace runs of disallowed chars with a single space so legit
  // 17-char runs don't get fused into longer non-VIN strings.
  const cleaned = upper.replace(/[^A-HJ-NPR-Z0-9]+/g, ' ')
  // First pass — exactly 17-char run with letter+digit mix (a real
  // VIN must contain at least one digit and at least one letter).
  const tokens = cleaned.split(/\s+/).filter((t) => t.length === 17)
  for (const t of tokens) {
    if (/[A-Z]/.test(t) && /[0-9]/.test(t)) return t
  }
  // Second pass — looser: a 17-char run anywhere inside a longer
  // alphanumeric blob.
  const m = cleaned.match(/[A-HJ-NPR-Z0-9]{17}/)
  if (m && /[A-Z]/.test(m[0]) && /[0-9]/.test(m[0])) return m[0]
  return null
}

// ----- Stage 1: live barcode scan -----

async function scanVinBarcode() {
  let mod
  try {
    mod = await loadBarcode()
  } catch (e) {
    return { ok: false, reason: 'plugin-load-failed' }
  }

  const { BarcodeScanner, BarcodeFormat } = mod

  try {
    const perm = await BarcodeScanner.requestPermissions()
    if (perm.camera !== 'granted' && perm.camera !== 'limited') {
      return {
        ok: false,
        reason:
          'Camera permission is off. Enable it in iOS Settings → Sidestand to scan VINs.'
      }
    }
  } catch (_) {
    // Some plugin versions don't surface permission state — let scan() prompt natively.
  }

  // Android may need an ML Kit module on first run. iOS no-op.
  try {
    if (
      typeof BarcodeScanner.isGoogleBarcodeScannerModuleAvailable === 'function'
    ) {
      const { available } =
        await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()
      if (!available) await BarcodeScanner.installGoogleBarcodeScannerModule()
    }
  } catch (_) {}

  let res
  try {
    res = await BarcodeScanner.scan({
      formats: [
        BarcodeFormat.Code39,
        BarcodeFormat.Code128,
        BarcodeFormat.QrCode,
        BarcodeFormat.DataMatrix
      ]
    })
  } catch (e) {
    const msg = String(e?.message || e || '')
    if (/cancel/i.test(msg)) return { ok: false, reason: 'cancelled' }
    return { ok: false, reason: 'no-result', detail: msg }
  }

  for (const b of res?.barcodes || []) {
    const v = normalizeVin(b.rawValue || b.displayValue || '')
    if (v.length === 17) return { ok: true, vin: v }
  }
  return { ok: false, reason: 'no-result' }
}

// ----- Stage 2: photo + text-recognition fallback -----

async function scanVinFromPhoto() {
  let cam, ocr
  try {
    cam = await loadCamera()
    ocr = await loadTextRec()
  } catch (_) {
    return {
      ok: false,
      reason: 'Couldn’t load the text scanner. Reinstall the app or enter the VIN manually.'
    }
  }

  const { Camera, CameraResultType, CameraSource } = cam
  const { Ocr } = ocr

  let photo
  try {
    photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 85,
      allowEditing: false,
      saveToGallery: false,
      // High enough for OCR but not so big that the file path bloats.
      width: 1600,
      height: 1600,
      correctOrientation: true,
      promptLabelHeader: 'Scan VIN plate',
      promptLabelPicture: 'Take photo',
      promptLabelCancel: 'Cancel'
    })
  } catch (e) {
    const msg = String(e?.message || e || '')
    if (/cancel|user.*cancel/i.test(msg)) {
      return { ok: false, reason: 'cancelled' }
    }
    return {
      ok: false,
      reason: msg || 'Photo capture failed. Try again or enter the VIN manually.'
    }
  }

  const path = photo?.path || photo?.webPath
  if (!path) {
    return { ok: false, reason: 'No image was captured.' }
  }

  let textResult
  try {
    textResult = await Ocr.detectText({ filename: path })
  } catch (e) {
    return {
      ok: false,
      reason: e?.message || 'Couldn’t read text from the photo.'
    }
  }

  // Plugin returns { textDetections: [{ text, bottomLeft, ... }, ...] }.
  // Concatenate every detected text fragment so our VIN regex can
  // match across line breaks and whitespace.
  const detections = Array.isArray(textResult?.textDetections)
    ? textResult.textDetections
    : []
  const allText = detections.map((d) => d.text || '').join('\n')

  const vin = extractVinFromText(allText)
  if (vin) return { ok: true, vin }

  return {
    ok: false,
    reason:
      'No 17-character VIN found in the photo. Frame the VIN plate and try again with steady hands and good light.'
  }
}

// ----- Public entry point -----

export async function scanVin() {
  if (!isNativeApp()) {
    return {
      ok: false,
      reason: 'Camera scanning is only available on the iOS app.'
    }
  }

  const r1 = await scanVinBarcode()
  if (r1.ok) return { ...r1, source: 'barcode' }
  if (r1.reason === 'cancelled') return r1
  // Permission errors and plugin-load errors aren't recoverable via OCR.
  if (
    typeof r1.reason === 'string' &&
    /permission|plugin-load-failed/.test(r1.reason)
  ) {
    return r1
  }

  // Barcode found nothing usable (no barcode on this plate, or scan
  // closed without a hit). Fall through to text-recognition. The
  // caller's loading state stays true across both stages.
  const r2 = await scanVinFromPhoto()
  if (r2.ok) return { ...r2, source: 'ocr' }
  return r2
}
