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

// Stadia Maps API key — optional. If absent, only the silhouette
// template is offered (no map tiles fetched). Add it via the
// VITE_STADIA_API_KEY env var. Free tier is generous (~200K/month).
// Sign up at https://client.stadiamaps.com/dashboard/.
const STADIA_KEY = import.meta.env.VITE_STADIA_API_KEY || ''

// All available templates. `requiresKey` controls whether a particular
// template can be shown without VITE_STADIA_API_KEY set — silhouette
// is pure-canvas and always available.
export const SHARE_TEMPLATES = [
  {
    id: 'silhouette',
    label: 'Silhouette',
    description: 'Glowing route on black. Iconic.',
    requiresKey: false
  },
  {
    id: 'dark-map',
    label: 'Dark map',
    description: 'Real road map underneath the route.',
    requiresKey: true,
    stadiaStyle: 'alidade_smooth_dark'
  },
  {
    id: 'satellite',
    label: 'Satellite',
    description: 'Earth-from-above with the route on top.',
    requiresKey: true,
    stadiaStyle: 'alidade_satellite'
  }
]

export function isStadiaConfigured() {
  return Boolean(STADIA_KEY)
}

// Returns the SHARE_TEMPLATES filtered to those usable in the current
// environment (silhouette is always available; map-based templates are
// gated behind VITE_STADIA_API_KEY being present).
export function availableTemplates() {
  return SHARE_TEMPLATES.filter((t) => !t.requiresKey || isStadiaConfigured())
}

// Generate the share card and return it as a Blob.
//
// `template` — one of SHARE_TEMPLATES[].id. Defaults to 'silhouette'
// because it works without any third-party API key.
export async function generateRideCard({
  ride,
  bike,
  weather,
  template = 'silhouette'
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
  // The whole point of the share card. Render the route HUGE on
  // whatever background the chosen template calls for:
  //   - silhouette: glowing red polyline on solid black (canvas only)
  //   - dark-map:   route over Stadia "alidade_smooth_dark" tiles
  //   - satellite:  route over Stadia "alidade_satellite" tiles
  //
  // For the map-backed templates we ask Stadia to draw the polyline as
  // part of the static map (two stacked paths give a halo). If the
  // fetch fails we silently fall back to silhouette so the user still
  // gets a card.
  const ROUTE_TOP = 130
  const ROUTE_H = 970
  const ROUTE_X = 60
  const ROUTE_W = W - 120

  const tpl =
    SHARE_TEMPLATES.find((t) => t.id === template) || SHARE_TEMPLATES[0]
  const wantsMap = tpl.requiresKey

  let mapBg = null
  if (wantsMap && isStadiaConfigured()) {
    try {
      mapBg = await fetchStadiaMap(tpl, ride.route || [], ROUTE_W, ROUTE_H)
    } catch (e) {
      console.warn('Stadia map fetch failed, falling back to silhouette', e)
    }
  }

  if (mapBg) {
    // Paint the tile image as background then overlay our glowing
    // polyline using the SAME projection Stadia rendered with so the
    // route lines up perfectly with the roads underneath.
    drawCovered(ctx, mapBg.img, ROUTE_X, ROUTE_TOP, ROUTE_W, ROUTE_H)
    // Subtle vertical fade at the bottom so the title sits on a
    // darker base — improves text contrast when the map is bright
    // (esp. satellite at midday).
    const fade = ctx.createLinearGradient(
      0,
      ROUTE_TOP + ROUTE_H - 200,
      0,
      ROUTE_TOP + ROUTE_H
    )
    fade.addColorStop(0, 'rgba(14,12,16,0)')
    fade.addColorStop(1, 'rgba(14,12,16,0.85)')
    ctx.fillStyle = fade
    ctx.fillRect(ROUTE_X, ROUTE_TOP + ROUTE_H - 200, ROUTE_W, 200)
    drawGlowingPolylineMercator(
      ctx,
      ride.route || [],
      ROUTE_X,
      ROUTE_TOP,
      ROUTE_W,
      ROUTE_H,
      mapBg.centerLat,
      mapBg.centerLng,
      mapBg.zoom
    )
  } else {
    drawRouteHero(ctx, ride.route || [], ROUTE_X, ROUTE_TOP, ROUTE_W, ROUTE_H)
  }

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

// ============================================================
// Stadia Maps integration
// ============================================================
//
// We use the Stadia Maps Static Maps API to fetch a tile-rendered
// background for "dark-map" and "satellite" templates.
//
// IMPORTANT: Stadia uses different URL conventions than Google Maps
// Static API:
//   - Polyline goes in `l=encoded,HEXCOLOR,WIDTH` (comma-separated)
//   - Polyline precision is 6 (Math.round * 1e6), not 5
//   - Size is `WxH` with optional `@2x` for retina
//   - There's no auto-fit; we have to compute center+zoom ourselves
//
// We deliberately don't pass a polyline to Stadia — instead we ask
// for tiles only (center+zoom we computed) and draw our own glowing
// polyline on top using the same web-mercator projection. This keeps
// the signature halo glow consistent with the silhouette template.

async function fetchStadiaMap(tpl, route, w, h) {
  if (!STADIA_KEY) throw new Error('Stadia API key not configured')
  if (!tpl?.stadiaStyle) {
    throw new Error(`Template "${tpl?.id}" has no stadiaStyle`)
  }

  const points = (route || [])
    .map((p) => (Array.isArray(p) ? [p[0], p[1]] : null))
    .filter(Boolean)
  if (points.length < 1) {
    throw new Error('Need at least 1 route point for a map')
  }

  const { centerLat, centerLng, zoom } = computeCenterZoom(points, w, h)

  // Stadia accepts up to 2000×2000 base size on paid plans; free
  // tier caps at 800×800 base. We use @2x to get effective 2× pixel
  // density without bumping the base over the cap.
  // Base pixels: 480×485, with @2x yields 960×970 in the response.
  const baseW = Math.min(Math.round(w / 2), 800)
  const baseH = Math.min(Math.round(h / 2), 800)

  const url =
    `https://tiles.stadiamaps.com/static/${encodeURIComponent(tpl.stadiaStyle)}.png` +
    `?api_key=${encodeURIComponent(STADIA_KEY)}` +
    `&center=${centerLat.toFixed(6)},${centerLng.toFixed(6)}` +
    `&zoom=${zoom}` +
    `&size=${baseW}x${baseH}@2x`

  const img = await loadImage(url)
  return { img, centerLat, centerLng, zoom }
}

// ============================================================
// Web-mercator projection helpers
// ============================================================
//
// At zoom z the entire world is (256 * 2^z) pixels wide and tall.
// Our share card uses the same projection Stadia uses (Web Mercator
// EPSG:3857) so we can overlay our polyline pixel-perfect on top of
// their tiles given matching center+zoom.

function latLngToWorldPixel(lat, lng, zoom) {
  const scale = 256 * Math.pow(2, zoom)
  const x = ((lng + 180) / 360) * scale
  const sinLat = Math.sin((lat * Math.PI) / 180)
  // Clamp sinLat to avoid Infinity at the poles (we'll never see this
  // for motorcycle rides but cheap insurance).
  const clamped = Math.max(-0.9999, Math.min(0.9999, sinLat))
  const y =
    (0.5 - Math.log((1 + clamped) / (1 - clamped)) / (4 * Math.PI)) * scale
  return [x, y]
}

// Pick the highest zoom that still fits the whole route bbox inside
// the requested image with 8% padding. Caps at 17 so degenerate
// (~stationary) rides don't zoom in to neighbourhood-fence detail.
function computeCenterZoom(points, w, h) {
  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity
  for (const [lat, lng] of points) {
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
  }
  const centerLat = (minLat + maxLat) / 2
  const centerLng = (minLng + maxLng) / 2

  const padW = w * 0.84
  const padH = h * 0.84

  // For a degenerate (single-point or near-zero-span) route, just
  // use a sensible default zoom showing the surrounding ~1km.
  if (maxLat - minLat < 1e-5 && maxLng - minLng < 1e-5) {
    return { centerLat, centerLng, zoom: 16 }
  }

  // Search from high zoom (most detailed) downward — first zoom at
  // which the bbox fits in the padded canvas wins.
  for (let z = 17; z >= 1; z--) {
    const [x1, y1] = latLngToWorldPixel(maxLat, minLng, z)
    const [x2, y2] = latLngToWorldPixel(minLat, maxLng, z)
    if (Math.abs(x2 - x1) <= padW && Math.abs(y2 - y1) <= padH) {
      return { centerLat, centerLng, zoom: z }
    }
  }
  return { centerLat, centerLng, zoom: 1 }
}

// Overlay a glowing red polyline on top of an existing map background,
// projected to match the given center+zoom (same projection as Stadia).
function drawGlowingPolylineMercator(
  ctx,
  route,
  x,
  y,
  w,
  h,
  centerLat,
  centerLng,
  zoom
) {
  const pts = (route || [])
    .map((p) => (Array.isArray(p) ? [p[0], p[1]] : null))
    .filter(Boolean)
  if (pts.length === 0) return

  const [cx, cy] = latLngToWorldPixel(centerLat, centerLng, zoom)
  const xy = pts.map(([lat, lng]) => {
    const [px, py] = latLngToWorldPixel(lat, lng, zoom)
    return [x + w / 2 + (px - cx), y + h / 2 + (py - cy)]
  })

  // Outer halo — wide, mostly transparent
  ctx.strokeStyle = 'rgba(224, 58, 54, 0.22)'
  ctx.lineWidth = 32
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  strokePath(ctx, xy)

  // Inner halo
  ctx.strokeStyle = 'rgba(224, 58, 54, 0.4)'
  ctx.lineWidth = 18
  strokePath(ctx, xy)

  // Core — solid signal red
  ctx.strokeStyle = ORANGE
  ctx.lineWidth = 8
  strokePath(ctx, xy)

  // Start marker — gray dot, white halo
  const [sx, sy] = xy[0]
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(sx, sy, 18, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#9CA3AF'
  ctx.beginPath()
  ctx.arc(sx, sy, 11, 0, Math.PI * 2)
  ctx.fill()

  // End marker — red dot, white halo
  const [ex, ey] = xy[xy.length - 1]
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(ex, ey, 18, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = ORANGE
  ctx.beginPath()
  ctx.arc(ex, ey, 11, 0, Math.PI * 2)
  ctx.fill()
}

function strokePath(ctx, xy) {
  ctx.beginPath()
  for (let i = 0; i < xy.length; i++) {
    const [px, py] = xy[i]
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}
