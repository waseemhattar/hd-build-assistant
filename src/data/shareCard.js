// Share card generator — composes a 1080×1920 (Story 9:16) JPEG of a
// completed ride for sharing to Instagram / WhatsApp / iMessage etc.
//
// Pure HTML5 Canvas — no html2canvas dependency, no Leaflet runtime.
// We project the route polyline ourselves over the canvas. Reliable
// across iOS WebView quirks; fast (~150ms) for typical ride lengths.
//
// Layout (top → bottom):
//   0–960   Bike cover photo full-bleed, dark gradient at the bottom
//           with overlays: SIDESTAND wordmark, ride date, bike name
//   960–1280 Route polyline silhouette in signal red on dark canvas
//   1280–1840 Stats grid: distance, duration, max speed, avg speed
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

  // Solid background first
  ctx.fillStyle = BG_BLACK
  ctx.fillRect(0, 0, W, H)

  // ---------- 1. Hero photo block (or fallback header) ----------
  const HERO_H = 960
  if (bike?.coverPhotoUrl) {
    try {
      const img = await loadImage(bike.coverPhotoUrl)
      drawCovered(ctx, img, 0, 0, W, HERO_H)
    } catch (_) {
      drawHeroFallback(ctx, 0, 0, W, HERO_H)
    }
  } else {
    drawHeroFallback(ctx, 0, 0, W, HERO_H)
  }

  // Dark bottom gradient over the hero so the title text is readable
  const grad = ctx.createLinearGradient(0, HERO_H * 0.55, 0, HERO_H)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(1, 'rgba(0,0,0,0.85)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, HERO_H)

  // Top header bar — wordmark left, date right
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

  // Bike name + year, lower-left of hero
  const titleY = HERO_H - 180
  ctx.fillStyle = ORANGE
  ctx.font = '600 28px Inter, system-ui, sans-serif'
  ctx.fillText(
    `RIDDEN · ${bike?.year || ''}`.trim().toUpperCase(),
    60,
    titleY
  )
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 88px Inter, system-ui, sans-serif'
  const bikeName = (
    bike?.nickname ||
    bike?.model ||
    'My Bike'
  ).toUpperCase()
  drawTextClamped(ctx, bikeName, 60, titleY + 50, W - 120, 88)
  if (bike?.model && bike?.nickname) {
    ctx.fillStyle = '#ffffff'
    ctx.font = '500 32px Inter, system-ui, sans-serif'
    ctx.fillText(bike.model, 60, titleY + 145)
  }

  // ---------- 2. Route polyline band ----------
  const ROUTE_TOP = HERO_H + 30
  const ROUTE_H = 290
  ctx.fillStyle = BG_DARK
  roundRect(ctx, 60, ROUTE_TOP, W - 120, ROUTE_H, 36, true, false)
  drawRoute(ctx, ride.route || [], 60 + 30, ROUTE_TOP + 30, W - 120 - 60, ROUTE_H - 60)

  // ---------- 3. Stats grid ----------
  const STATS_TOP = ROUTE_TOP + ROUTE_H + 30
  const STATS_H = 540

  ctx.fillStyle = BG_DARK
  roundRect(ctx, 60, STATS_TOP, W - 120, STATS_H, 36, true, false)

  const cellW = (W - 120) / 2
  const cellH = STATS_H / 2

  drawStat(
    ctx,
    60,
    STATS_TOP,
    cellW,
    cellH,
    'DISTANCE',
    formatDistance(ride.distance_m || 0)
  )
  drawStat(
    ctx,
    60 + cellW,
    STATS_TOP,
    cellW,
    cellH,
    'DURATION',
    formatDuration(ride.duration_seconds || 0)
  )
  drawStat(
    ctx,
    60,
    STATS_TOP + cellH,
    cellW,
    cellH,
    'MAX SPEED',
    formatSpeed(ride.max_speed_mps || 0)
  )
  drawStat(
    ctx,
    60 + cellW,
    STATS_TOP + cellH,
    cellW,
    cellH,
    weather ? `${weather.emoji || ''} WEATHER`.trim() : 'AVG SPEED',
    weather
      ? `${Math.round(weather.tempC ?? 0)}°${isMetric() ? 'C' : 'F'}`
      : formatSpeed(ride.avg_speed_mps || 0)
  )

  // ---------- 4. Watermark strip ----------
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
