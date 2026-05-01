// User preferences — units of measurement and regional formatting.
//
// Why local-only (for now):
//   We persist to localStorage and skip Supabase sync. Preferences are
//   per-device by design — a US user might have a phone in metric (long
//   trip in Europe) without changing their permanent profile. If we
//   eventually want device-syncing prefs we can layer it on; the storage
//   and subscribe pattern here matches storage.js so adding a server
//   round-trip later is mechanical.
//
// Pubsub: callers can subscribe() to be notified when any pref changes.
// Useful for the formatters in rides.js — we don't want every consumer
// to re-implement their own listener.

const STORAGE_KEY = 'sidestand:userPrefs/v1'

// Defaults derived from the browser's locale at module load time.
// We resolve once at startup; if the user later overrides, their pick
// wins forever (until they reset).
function detectFromLocale() {
  const lang = (typeof navigator !== 'undefined' && navigator.language) || 'en-US'
  // The handful of countries on imperial: US, Liberia, Myanmar. The rest
  // of the planet is metric. We also bucket UK as 'imperial' because UK
  // riders typically still talk in miles even though everything else
  // (fuel, weather) is metric — see uk-specific overrides below.
  const region = lang.split('-')[1]?.toUpperCase() || 'US'
  const imperialRegions = new Set(['US', 'LR', 'MM'])
  const ukRegions = new Set(['GB', 'UK'])

  let units = 'metric' // 'imperial' | 'metric'
  if (imperialRegions.has(region)) units = 'imperial'
  else if (ukRegions.has(region)) units = 'imperial' // miles for UK roads

  // Date format. en-US is mm/dd/yyyy; everywhere else is dd/mm/yyyy or
  // ISO-ish. We normalize to two buckets and let display code expand.
  const dateFormat = region === 'US' ? 'mdy' : 'dmy'

  // Currency. Best-effort guess from locale. User can override.
  const currencyMap = {
    US: 'USD',
    GB: 'GBP',
    UK: 'GBP',
    CA: 'CAD',
    AU: 'AUD',
    NZ: 'NZD',
    JP: 'JPY',
    CN: 'CNY',
    IN: 'INR'
  }
  const currency = currencyMap[region] || 'EUR'

  // Temperature: 'F' for US (and only US, really), 'C' everywhere else.
  const temperature = region === 'US' ? 'F' : 'C'

  // Fuel volume: gallons in US, liters everywhere else. UK uses both
  // colloquially; we default to liters since pumps are liters.
  const fuelVolume = region === 'US' ? 'gallons' : 'liters'

  return { units, dateFormat, currency, temperature, fuelVolume, locale: lang }
}

const DEFAULTS = detectFromLocale()

let prefs = loadFromStorage() || { ...DEFAULTS }

const listeners = new Set()

function loadFromStorage() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Merge with defaults so newly added prefs auto-fill on upgrade.
    return { ...DEFAULTS, ...parsed }
  } catch (_) {
    return null
  }
}

function persist() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch (_) {}
}

function notify() {
  for (const fn of listeners) {
    try {
      fn(prefs)
    } catch (e) {
      console.warn('userPrefs listener threw', e)
    }
  }
}

// ---------- public API ----------

export function getPrefs() {
  return { ...prefs }
}

export function setPref(key, value) {
  if (prefs[key] === value) return
  prefs = { ...prefs, [key]: value }
  persist()
  notify()
}

export function setPrefs(patch) {
  let changed = false
  const next = { ...prefs }
  for (const [k, v] of Object.entries(patch || {})) {
    if (next[k] !== v) {
      next[k] = v
      changed = true
    }
  }
  if (!changed) return
  prefs = next
  persist()
  notify()
}

// Reset everything back to locale defaults. Wipes the user's overrides.
export function resetPrefs() {
  prefs = { ...DEFAULTS }
  persist()
  notify()
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// Convenience getter for the most commonly checked pref.
export function isMetric() {
  return prefs.units === 'metric'
}

// ---------- formatters ----------
//
// Centralizing format logic here means callers don't need to know
// what unit system the user prefers — they just pass meters / m/s /
// celsius and we render the right text.

export function formatDistance(meters, opts = {}) {
  if (meters == null || isNaN(meters)) return opts.placeholder ?? '—'
  const fixed = opts.fixed ?? 1
  if (prefs.units === 'metric') {
    return `${(meters / 1000).toFixed(fixed)} km`
  }
  return `${(meters / 1609.344).toFixed(fixed)} mi`
}

// Mileage as it lives in the database is always miles (legacy). When
// rendering we still want to respect the user's display pref.
export function formatMileage(miles, opts = {}) {
  if (miles == null || isNaN(miles)) return opts.placeholder ?? '—'
  if (prefs.units === 'metric') {
    return `${Math.round(miles * 1.609344).toLocaleString()} km`
  }
  return `${Math.round(miles).toLocaleString()} mi`
}

// Just the unit label (for "X mi" style headers where the number is
// shown separately).
export function distanceUnitLabel() {
  return prefs.units === 'metric' ? 'km' : 'mi'
}

export function formatSpeed(mps, opts = {}) {
  if (mps == null || isNaN(mps)) return opts.placeholder ?? '—'
  if (prefs.units === 'metric') {
    return `${(mps * 3.6).toFixed(0)} km/h`
  }
  return `${(mps * 2.23694).toFixed(0)} mph`
}

export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function formatTemperature(celsius, opts = {}) {
  if (celsius == null || isNaN(celsius)) return opts.placeholder ?? '—'
  if (prefs.temperature === 'F') {
    return `${Math.round(celsius * 9 / 5 + 32)}°F`
  }
  return `${Math.round(celsius)}°C`
}

export function formatVolume(liters, opts = {}) {
  if (liters == null || isNaN(liters)) return opts.placeholder ?? '—'
  if (prefs.fuelVolume === 'gallons') {
    return `${(liters / 3.78541).toFixed(2)} gal`
  }
  return `${liters.toFixed(2)} L`
}

export function formatCurrency(amount, opts = {}) {
  if (amount == null || isNaN(amount)) return opts.placeholder ?? '—'
  try {
    return new Intl.NumberFormat(prefs.locale, {
      style: 'currency',
      currency: prefs.currency,
      maximumFractionDigits: opts.fixed ?? 2
    }).format(amount)
  } catch (_) {
    return `$${amount.toFixed(opts.fixed ?? 2)}`
  }
}

export function formatDate(input, opts = {}) {
  if (!input) return opts.placeholder ?? '—'
  const d = input instanceof Date ? input : new Date(input)
  if (isNaN(d.getTime())) return opts.placeholder ?? '—'
  try {
    return new Intl.DateTimeFormat(prefs.locale, {
      year: 'numeric',
      month: opts.long ? 'long' : 'short',
      day: 'numeric',
      ...(opts.withTime
        ? { hour: 'numeric', minute: '2-digit' }
        : {})
    }).format(d)
  } catch (_) {
    return d.toISOString().slice(0, 10)
  }
}

// Locale-aware "3 days ago" / "yesterday" / "today" formatter using
// Intl.RelativeTimeFormat where available (every modern browser).
export function formatTimeAgo(input) {
  if (!input) return ''
  const then = input instanceof Date ? input : new Date(input)
  if (isNaN(then.getTime())) return ''
  const now = Date.now()
  const diffMs = then.getTime() - now
  const diffSec = Math.round(diffMs / 1000)
  const absSec = Math.abs(diffSec)

  let value, unit
  if (absSec < 60) {
    return absSec < 5 ? 'just now' : `${absSec}s`
  }
  if (absSec < 3600) {
    value = Math.round(diffSec / 60)
    unit = 'minute'
  } else if (absSec < 86400) {
    value = Math.round(diffSec / 3600)
    unit = 'hour'
  } else if (absSec < 86400 * 30) {
    value = Math.round(diffSec / 86400)
    unit = 'day'
  } else if (absSec < 86400 * 365) {
    value = Math.round(diffSec / (86400 * 30))
    unit = 'month'
  } else {
    value = Math.round(diffSec / (86400 * 365))
    unit = 'year'
  }
  try {
    return new Intl.RelativeTimeFormat(prefs.locale, { numeric: 'auto' }).format(value, unit)
  } catch (_) {
    return `${Math.abs(value)} ${unit}${Math.abs(value) === 1 ? '' : 's'} ${diffSec < 0 ? 'ago' : 'from now'}`
  }
}
