// Share helper — bridges browser Share API + Capacitor native Share.
//
// On native iOS:
//   1. Write the image to the app's Cache directory via Filesystem
//   2. Pass that file URI to the Share plugin → opens the iOS share
//      sheet with options for Instagram, WhatsApp, iMessage, Photos,
//      Save Image, etc.
//
// On web (no Capacitor):
//   1. Try navigator.share({ files }) — supported on Safari iOS web,
//      Chrome Android, recent desktop browsers
//   2. If unsupported, fall back to a download <a> tag — saves the
//      image, the user can then attach it to whatever they like
//
// Caller passes a Blob and an optional title/text; we handle the rest.

import { isNativeApp } from './platform.js'

export async function sharePngBlob(blob, opts = {}) {
  const filename = opts.filename || 'sidestand-ride.jpg'
  const title = opts.title || 'My ride'
  const text = opts.text || 'Recorded on Sidestand.'

  if (isNativeApp()) {
    return shareNative(blob, { filename, title, text })
  }
  return shareWeb(blob, { filename, title, text })
}

// ============================================================
// Native (Capacitor) path
// ============================================================

async function shareNative(blob, { filename, title, text }) {
  const [{ Filesystem, Directory }, { Share }] = await Promise.all([
    import('@capacitor/filesystem'),
    import('@capacitor/share')
  ])

  // Filesystem.writeFile takes base64 (without the data: prefix).
  const base64 = await blobToBase64(blob)
  const written = await Filesystem.writeFile({
    path: filename,
    data: base64,
    directory: Directory.Cache,
    recursive: true
  })

  // We need the file:// URI to pass to Share. Filesystem returns it
  // on iOS as `uri` (newer plugin versions) or via getUri().
  let fileUri = written?.uri
  if (!fileUri) {
    const got = await Filesystem.getUri({
      directory: Directory.Cache,
      path: filename
    })
    fileUri = got?.uri
  }
  if (!fileUri) throw new Error('Filesystem.writeFile did not return a URI')

  await Share.share({
    title,
    text,
    files: [fileUri],
    dialogTitle: 'Share your ride'
  })
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      const idx = String(result).indexOf(',')
      // Strip "data:image/jpeg;base64," prefix — Filesystem expects raw base64.
      resolve(idx >= 0 ? String(result).slice(idx + 1) : result)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// ============================================================
// Web path
// ============================================================

async function shareWeb(blob, { filename, title, text }) {
  const file = new File([blob], filename, { type: blob.type || 'image/jpeg' })

  // Try the Web Share API first (Chrome Android, Safari iOS web,
  // recent macOS Safari and Edge).
  if (
    typeof navigator !== 'undefined' &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        title,
        text,
        files: [file]
      })
      return
    } catch (e) {
      // User cancelled or share failed — fall through to download
      if (e?.name === 'AbortError') return
      console.warn('navigator.share failed, falling back to download', e)
    }
  }

  // Fallback: trigger a download. The user can then attach the file
  // to whatever messenger / social app they want.
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
