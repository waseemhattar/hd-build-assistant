// Share card generator — composes a 1080×1920 (Story 9:16) JPEG of a
// completed ride for sharing to Instagram / WhatsApp / iMessage etc.
//
// Pure HTML5 Canvas — no html2canvas dependency, no Leaflet runtime.
// We project the route polyline ourselves over the canvas. Reliable
// across iOS WebView quirks; fast (~150ms) for typical ride lengths.
//
// Layout (top → bottom):
//   0–80    Header: SIDESTAND wordmark left, date right
//   80–1100 Route polyline hero — the actual map of where you rode,
//           glowing red stroke on dark canvas (Strava-style silhouette).
//           No tiles, just the route — looks iconic at any size.
//   1100–1280 Title: BIG distance value, bike name kicker
//   1280–1840 Stats grid: Duration, Max speed, Avg speed, Weather
//   1840–1920 sidestand.app watermark strip
//
// Stats are rendered respecting the user's units pref so a metric
// rider's share card shows "42 km · 95 km/h" not "26 mi · 59 mph".

import {
  isMetric,
  formatDistance,
  formatDuration,
  formatSpeed,
  formatDate
} from './userPrefs.js'

const W = 1080
const H = 1920

// Brand palette mirrored from index.css
const BG_BLACK = '#0e0c10'
const BG_DARK = '#18161b'
const ORANGE = '#E03A36'
const TEXT = '#f5efe2'
const MUTED = '#7d7872'

// Generate the share card and return it as a Blob.
export async function generateRideCard({
  ride,
  bike,
  weather
} = {}) {
  if (!ride) throw new Error('No ride to render')

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Solid black background — Strava-style canvas.
  ctx.fillStyle = BG_BLACK
  ctx.fillRect(0, 0, W, H)

  // ---------- 1. Header strip ----------
  ctx.fillStyle = ORANGE
  ctx.font = 'bold 28px Inter, system-ui, sans-serif'
  ctx.textBaseline = 'top'
  ctx.fillText('SIDESTAND', 60, 60)

  ctx.fillStyle = TEXT
  ctx.font = '500 28px Inter, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(
    formatDate(ride.started_at).toUpperCase(),
    W - 60,
    60
  )
  ctx.textAlign = 'left'

  // ---------- 2. Route polyline hero ----------
  // The whole point of the share card. Render the route HUGE, glowing
  // red, on the dark canvas. We give it the most pixel real-estate
  // because the route IS the story.
  const ROUTE_TOP = 130
  const ROUTE_H = 970
  drawRouteHero(
    ctx,
    ride.route || [],
    60,
    ROUTE_TOP,
    W - 120,
    ROUTE_H
  )

  // ---------- 3. Title — big distance + bike name kicker ----------
  const TITLE_TOP = ROUTE_TOP + ROUTE_H + 30

  ctx.fillStyle = ORANGE
  ctx.font = '600 28px Inter, system-ui, sans-serif'
  ctx.textBaseline = 'top'
  const kicker = (
    bike?.nickname || bike?.model || 'My ride'
  ).toUpperCase()
  drawTextClamped(ctx, kicker, 60, TITLE_TOP, W - 120, 28)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 140px Inter, system-ui, sans-serif'
  drawTextClamped(
    ctx,
    formatDistance(ride.distance_m || 0).toUpperCase(),
    60,
    TITLE_TOP + 44,
    W - 120,
    140
  )

  // ---------- 4. Stats grid (3-up at bottom) ----------
  // Three core stats below the title, no boxes — clean Strava-y feel.
  const STATS_TOP = TITLE_TOP + 230
  const colW = (W - 120) / 3

  drawCompactStat(
    ctx,
    60 + colW * 0,
    STATS_TOP,
    colW,
    'DURATION',
    formatDuration(ride.duration_seconds || 0)
  )
  drawCompactStat(
    ctx,
    60 + colW * 1,
    STATS_TOP,
    colW,
    'MAX SPEED',
    formatSpeed(ride.max_speed_mps || 0)
  )
  drawCompactStat(
    ctx,
    60 + colW * 2,
    STATS_TOP,
    colW,
    weather ? 'WEATHER' : 'AVG SPEED',
    weather
      ? `${weather.emoji || ''} ${Math.round(weather.tempC ?? 0)}°${
          isMetric() ? 'C' : 'F'
        }`.trim()
      : formatSpeed(ride.avg_speed_mps || 0)
  )

  // ---------- 5. Watermark strip ----------
  ctx.fillStyle = MUTED
  ctx.font = '500 28px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('sidestand.app', W / 2, H - 56)
  ctx.textAlign = 'left'

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('canvas.toBlob returned null'))
      },
      'image/jpeg',
      0.92
    )
  })
}

// Same as generateRideCard but returns a data URL — handy for native
// share which often needs base64.
export async function generateRideCardDataUrl(opts) {
  const blob = await generateRideCard(opts)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// ============================================================
// Drawing helpers
// ============================================================

// Cover-style image draw — fills the rect, cropping the photo as
// needed (like CSS object-fit: cover).
function drawCovered(ctx, img, x, y, w, h) {
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  const scale = Math.max(w / iw, h / ih)
  const dw = iw * scale
  const dh = ih * scale
  const dx = x + (w - dw) / 2
  const dy = y + (h - dh) / 2
  ctx.drawImage(img, dx, dy, dw, dh)
}

// When there's no bike photo, paint a moody gradient + abstract pattern
// so the card still looks designed instead of empty.
function drawHeroFallback(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(x, y, x, y + h)
  g.addColorStop(0, '#26211c')
  g.addColorStop(1, BG_BLACK)
  ctx.fillStyle = g
  ctx.fillRect(x, y, w, h)
  // Subtle red glow in the bottom-right
  const r = ctx.createRadialGradient(
    x + w * 0.85,
    y + h * 0.7,
    0,
    x + w * 0.85,
    y + h * 0.7,
    w * 0.6
  )
  r.addColorStop(0, 'rgba(224,58,54,0.25)')
  r.addColorStop(1, 'rgba(224,58,54,0)')
  ctx.fillStyle = r
  ctx.fillRect(x, y, w, h)
}

// Project the route's lat/lng list to the rect and draw a thick red
// polyline. Origin/destination are marked with circles.
function drawRoute(ctx, route, x, y, w, h) {
  const pts = (route || [])
    .map((p) => (Array.isArray(p) ? [p[0], p[1]] : null))
    .filter(Boolean)
  if (pts.length === 0) {
    ctx.fillStyle = MUTED
    ctx.font = '500 28px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('No route recorded', x + w / 2, y + h / 2)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    return
  }
  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity
  for (const [lat, lng] of pts) {
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
  }
  const spanLat = Math.max(maxLat - minLat, 1e-6)
  const spanLng = Math.max(maxLng - minLng, 1e-6)
  // Maintain aspect ratio of the geographic area inside the rect.
  const geoAspect = spanLng / spanLat
  const rectAspect = w / h
  let drawW = w
  let drawH = h
  if (geoAspect > rectAspect) {
    drawH = w / geoAspect
  } else {
    drawW = h * geoAspect
  }
  const offX = x + (w - drawW) / 2
  const offY = y + (h - drawH) / 2

  // Project points to canvas coords (lng → x, lat → y, y inverted).
  const xy = pts.map(([lat, lng]) => [
    offX + ((lng - minLng) / spanLng) * drawW,
    offY + (1 - (lat - minLat) / spanLat) * drawH
  ])

  ctx.strokeStyle = ORANGE
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  for (let i = 0; i < xy.length; i++) {
    const [px, py] = xy[i]
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Start marker (gray) and end marker (red)
  const [sx, sy] = xy[0]
  const [ex, ey] = xy[xy.length - 1]
  ctx.fillStyle = '#9CA3AF'
  ctx.beginPath()
  ctx.arc(sx, sy, 14, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = ORANGE
  ctx.beginPath()
  ctx.arc(ex, ey, 14, 0, Math.PI * 2)
  ctx.fill()
}

// Hero-scale route render: big bold polyline with a soft red glow,
// centred and aspect-fit inside the rect, with start/end markers.
//
// The "glow" is faked with two extra polyline strokes underneath the
// main one — wider, lower opacity. Cheap visually-rich effect that
// renders identically across browsers.
function drawRouteHero(ctx, route, x, y, w, h) {
  const pts = (route || [])
    .map((p) => (Array.isArray(p) ? [p[0], p[1]] : null))
    .filter(Boolean)
  if (pts.length === 0) {
    ctx.fillStyle = MUTED
    ctx.font = '500 32px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('No route recorded', x + w / 2, y + h / 2)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    return
  }

  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity
  for (const [lat, lng] of pts) {
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
  }
  const spanLat = Math.max(maxLat - minLat, 1e-6)
  const spanLng = Math.max(maxLng - minLng, 1e-6)

  // Add 8% padding so the route doesn't kiss the edges.
  const padding = 0.08
  const padW = w * (1 - padding * 2)
  const padH = h * (1 - padding * 2)

  const geoAspect = spanLng / spanLat
  const rectAspect = padW / padH
  let drawW = padW
  let drawH = padH
  if (geoAspect > rectAspect) {
    drawH = padW / geoAspect
  } else {
    drawW = padH * geoAspect
  }
  const offX = x + (w - drawW) / 2
  const offY = y + (h - drawH) / 2

  const xy = pts.map(([lat, lng]) => [
    offX + ((lng - minLng) / spanLng) * drawW,
    offY + (1 - (lat - minLat) / spanLat) * drawH
  ])

  // Outer glow — wide, very transparent
  ctx.strokeStyle = 'rgba(224, 58, 54, 0.18)'
  ctx.lineWidth = 36
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  for (let i = 0; i < xy.length; i++) {
    const [px, py] = xy[i]
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Mid glow — narrower, more opaque
  ctx.strokeStyle = 'rgba(224, 58, 54, 0.35)'
  ctx.lineWidth = 22
  ctx.beginPath()
  for (let i = 0; i < xy.length; i++) {
    const [px, py] = xy[i]
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Core stroke — solid signal red
  ctx.strokeStyle = ORANGE
  ctx.lineWidth = 12
  ctx.beginPath()
  for (let i = 0; i < xy.length; i++) {
    const [px, py] = xy[i]
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Start marker — gray with white center
  const [sx, sy] = xy[0]
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(sx, sy, 22, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#9CA3AF'
  ctx.beginPath()
  ctx.arc(sx, sy, 14, 0, Math.PI * 2)
  ctx.fill()

  // End marker — red with white center (the "you ended here" pin)
  const [ex, ey] = xy[xy.length - 1]
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(ex, ey, 22, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = ORANGE
  ctx.beginPath()
  ctx.arc(ex, ey, 14, 0, Math.PI * 2)
  ctx.fill()
}

// Compact stat for the 3-up grid below the title. Just label + value
// stacked vertically, no card background — keeps the design clean.
function drawCompactStat(ctx, x, y, w, label, value) {
  ctx.textBaseline = 'top'
  ctx.fillStyle = MUTED
  ctx.font = '600 22px Inter, system-ui, sans-serif'
  ctx.fillText(label, x + 10, y)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 56px Inter, system-ui, sans-serif'
  drawTextClamped(ctx, String(value), x + 10, y + 36, w - 20, 56)
}

function drawStat(ctx, x, y, w, h, label, value) {
  ctx.fillStyle = MUTED
  ctx.font = '600 26px Inter, system-ui, sans-serif'
  ctx.textBaseline = 'top'
  ctx.fillText(label, x + 40, y + 50)
  ctx.fillStyle = ORANGE
  ctx.font = 'bold 80px Inter, system-ui, sans-serif'
  drawTextClamped(ctx, String(value), x + 40, y + 100, w - 80, 80)
}

// Draw text but shrink the font size if the natural width exceeds
// maxWidth — keeps long bike names from spilling off the canvas.
function drawTextClamped(ctx, text, x, y, maxWidth, baseSize) {
  let size = baseSize
  while (size > 24) {
    ctx.font = `${ctx.font.replace(/\d+px/, `${size}px`)}`
    if (ctx.measureText(text).width <= maxWidth) break
    size -= 4
  }
  ctx.fillText(text, x, y)
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  if (fill) ctx.fill()
  if (stroke) ctx.stroke()
}

// Load an image with crossOrigin so we can read pixels back from a
// canvas with the photo drawn on it. Supabase storage serves the
// right CORS headers; if anything fails we throw so the caller can
// fall back to the no-photo hero.
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Could not load ${url}`))
    img.src = url
  })
}
