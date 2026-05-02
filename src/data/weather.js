// Weather lookup for rides — Open-Meteo.
//
// Why Open-Meteo: free forever, no API key, no quota for personal use,
// generous rate limit (~10k requests/day). Perfect for occasional ride
// queries. Other options (OpenWeatherMap) require an API key + have
// 1000/day free-tier quota that can lapse.
//
// We fetch a snapshot at ride START — temperature, wind, weather code.
// The snapshot is saved to the ride's `weather` JSONB column so years
// later you can browse "rides on rainy days," "hottest ride of summer,"
// etc.
//
// The plain text helper turns the snapshot into something like
// "28°C, partly cloudy, 12 km/h wind" for display.

const ENDPOINT = 'https://api.open-meteo.com/v1/forecast'

// WMO weather codes → human label + emoji.
// https://open-meteo.com/en/docs#weather-variable-documentation
const WMO_CODE = {
  0: { label: 'Clear', emoji: '☀️' },
  1: { label: 'Mostly clear', emoji: '🌤️' },
  2: { label: 'Partly cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Fog', emoji: '🌫️' },
  48: { label: 'Freezing fog', emoji: '🌫️' },
  51: { label: 'Light drizzle', emoji: '🌦️' },
  53: { label: 'Drizzle', emoji: '🌦️' },
  55: { label: 'Heavy drizzle', emoji: '🌧️' },
  61: { label: 'Light rain', emoji: '🌧️' },
  63: { label: 'Rain', emoji: '🌧️' },
  65: { label: 'Heavy rain', emoji: '⛈️' },
  71: { label: 'Light snow', emoji: '🌨️' },
  73: { label: 'Snow', emoji: '🌨️' },
  75: { label: 'Heavy snow', emoji: '❄️' },
  80: { label: 'Light showers', emoji: '🌦️' },
  81: { label: 'Showers', emoji: '🌧️' },
  82: { label: 'Heavy showers', emoji: '⛈️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
  96: { label: 'Thunderstorm w/ hail', emoji: '⛈️' },
  99: { label: 'Severe thunderstorm', emoji: '⛈️' }
}

// Look up the weather at a given lat/lng. Returns:
//   {
//     tempC: number,            // °C
//     windKph: number,          // km/h
//     code: number,             // WMO code
//     label: string,            // human label
//     emoji: string,            // matching emoji
//     fetchedAt: ISO string
//   }
// or null if the API was unreachable.
//
// We send a 5-second timeout so a slow Wi-Fi handoff doesn't stall the
// "Start ride" flow — weather is a nice-to-have, not a blocker.
export async function fetchCurrentWeather(lat, lng) {
  if (lat == null || lng == null) return null
  const url =
    `${ENDPOINT}?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}` +
    `&current=temperature_2m,wind_speed_10m,weather_code` +
    `&wind_speed_unit=kmh&temperature_unit=celsius`
  let resp
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 5000)
    resp = await fetch(url, { signal: ctrl.signal })
    clearTimeout(timer)
  } catch (e) {
    console.warn('[weather] fetch failed', e?.message || e)
    return null
  }
  if (!resp.ok) {
    console.warn('[weather] non-200', resp.status)
    return null
  }
  let json
  try {
    json = await resp.json()
  } catch (_) {
    return null
  }
  const c = json?.current
  if (!c) return null
  const code = Number(c.weather_code)
  const meta = WMO_CODE[code] || { label: 'Unknown', emoji: '🌡️' }
  return {
    tempC: typeof c.temperature_2m === 'number' ? c.temperature_2m : null,
    windKph: typeof c.wind_speed_10m === 'number' ? c.wind_speed_10m : null,
    code,
    label: meta.label,
    emoji: meta.emoji,
    fetchedAt: new Date().toISOString()
  }
}

// "28°C, partly cloudy, 12 km/h wind" — locale-aware via userPrefs
// (handles °C/°F + km/mi conversion via the formatTemperature /
// distanceUnitLabel helpers).
export function formatWeatherShort(weather, opts = {}) {
  if (!weather) return ''
  const parts = []
  if (weather.emoji) parts.push(weather.emoji)
  if (weather.tempC != null) {
    parts.push(opts.formatTemp ? opts.formatTemp(weather.tempC) : `${Math.round(weather.tempC)}°C`)
  }
  if (weather.label) parts.push(weather.label.toLowerCase())
  if (weather.windKph != null) {
    parts.push(`${Math.round(weather.windKph)} km/h wind`)
  }
  return parts.join(' · ')
}
