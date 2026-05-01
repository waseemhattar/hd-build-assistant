import React, { useEffect, useState } from 'react'
import { useUser } from '../auth/AuthProvider.jsx'
import { getPrefs, setPref, resetPrefs, subscribe } from '../data/userPrefs.js'

// User Settings page — units of measurement and regional formatting.
//
// Pattern intentionally simple: each control updates prefs immediately
// (no save button). We subscribe to the prefs module so any number on
// the page that's already rendered with a formatter re-renders too,
// giving the user instant visual feedback on their choice.
//
// Layout follows the Apple Health "settings sheet" feel: grouped
// sections, soft cards, generous spacing. Bebas Neue for section
// headers stays consistent with the rest of the app.

export default function Settings({ onBack }) {
  const { user } = useUser()
  const [prefs, setLocalPrefs] = useState(() => getPrefs())

  useEffect(() => {
    const unsub = subscribe((p) => setLocalPrefs({ ...p }))
    return unsub
  }, [])

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
      >
        ← Back
      </button>

      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-hd-orange">
          Settings
        </div>
        <h1 className="mt-1 font-display text-3xl tracking-wider sm:text-4xl">
          PREFERENCES
        </h1>
        <p className="mt-1 text-sm text-hd-muted">
          Tune how Sidestand shows distances, dates, and money. Detected
          from your device on first run; tweak anything here and we'll
          remember it.
        </p>
      </div>

      <Section title="Units" subtitle="Distance, speed, fuel, temperature.">
        <SegmentedRow
          label="Measurement system"
          value={prefs.units}
          onChange={(v) => {
            // Flipping the master units toggle also flips the related
            // sub-prefs so the display is internally consistent. User
            // can override individually below if needed.
            setPref('units', v)
            if (v === 'metric') {
              setPref('temperature', 'C')
              setPref('fuelVolume', 'liters')
            } else {
              setPref('temperature', 'F')
              setPref('fuelVolume', 'gallons')
            }
          }}
          options={[
            { value: 'imperial', label: 'Imperial', sub: 'mi · mph · gal · °F' },
            { value: 'metric', label: 'Metric', sub: 'km · km/h · L · °C' }
          ]}
        />

        <SegmentedRow
          label="Temperature"
          value={prefs.temperature}
          onChange={(v) => setPref('temperature', v)}
          options={[
            { value: 'F', label: 'Fahrenheit', sub: '°F' },
            { value: 'C', label: 'Celsius', sub: '°C' }
          ]}
        />

        <SegmentedRow
          label="Fuel volume"
          value={prefs.fuelVolume}
          onChange={(v) => setPref('fuelVolume', v)}
          options={[
            { value: 'gallons', label: 'Gallons', sub: 'gal' },
            { value: 'liters', label: 'Liters', sub: 'L' }
          ]}
        />
      </Section>

      <Section title="Region" subtitle="Date format, language, currency.">
        <SegmentedRow
          label="Date format"
          value={prefs.dateFormat}
          onChange={(v) => setPref('dateFormat', v)}
          options={[
            { value: 'mdy', label: 'Month / Day / Year', sub: 'May 1, 2026' },
            { value: 'dmy', label: 'Day / Month / Year', sub: '1 May 2026' }
          ]}
        />

        <Row label="Currency">
          <select
            value={prefs.currency}
            onChange={(e) => setPref('currency', e.target.value)}
            className="input min-w-[10rem]"
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </Row>

        <Row label="Locale">
          <select
            value={prefs.locale}
            onChange={(e) => setPref('locale', e.target.value)}
            className="input min-w-[10rem]"
          >
            {LOCALE_OPTIONS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </Row>
      </Section>

      <Section title="Account" subtitle="Signed in as">
        <div className="rounded-md border border-hd-border bg-hd-dark p-4">
          <div className="text-xs uppercase tracking-widest text-hd-muted">
            Email
          </div>
          <div className="mt-1 text-sm text-hd-text">
            {user?.primaryEmailAddress?.emailAddress || user?.email || '—'}
          </div>
        </div>
      </Section>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            if (
              window.confirm(
                'Reset all preferences to your region defaults?'
              )
            ) {
              resetPrefs()
            }
          }}
          className="text-xs text-hd-muted hover:text-red-400"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  )
}

// ---------- layout primitives ----------

function Section({ title, subtitle, children }) {
  return (
    <section className="mb-8">
      <div className="mb-3">
        <div className="font-display text-lg tracking-wider text-hd-text">
          {title.toUpperCase()}
        </div>
        {subtitle && (
          <div className="text-xs text-hd-muted">{subtitle}</div>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-hd-border bg-hd-dark p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-hd-text">{label}</div>
      <div>{children}</div>
    </div>
  )
}

// Pill-style segmented control for binary or 2–4 way choices. Active
// option lights up signal-red; inactive options stay muted. Each
// option may have a sub-label below the main label (eg. "mi · mph").
function SegmentedRow({ label, value, onChange, options }) {
  return (
    <div className="rounded-md border border-hd-border bg-hd-dark p-4">
      <div className="mb-3 text-sm text-hd-text">{label}</div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`rounded border px-3 py-3 text-left transition ${
                active
                  ? 'border-hd-orange bg-hd-orange/10'
                  : 'border-hd-border bg-hd-black hover:border-hd-orange/40'
              }`}
            >
              <div
                className={`text-sm font-semibold ${
                  active ? 'text-hd-orange' : 'text-hd-text'
                }`}
              >
                {opt.label}
              </div>
              {opt.sub && (
                <div className="mt-0.5 text-[11px] text-hd-muted">
                  {opt.sub}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------- option lists ----------

const CURRENCY_OPTIONS = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', name: 'Swedish Krona' },
  { code: 'NOK', name: 'Norwegian Krone' },
  { code: 'DKK', name: 'Danish Krone' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'ZAR', name: 'South African Rand' }
]

const LOCALE_OPTIONS = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'en-CA', label: 'English (Canada)' },
  { code: 'en-AU', label: 'English (Australia)' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'de-DE', label: 'Deutsch' },
  { code: 'es-ES', label: 'Español' },
  { code: 'it-IT', label: 'Italiano' },
  { code: 'nl-NL', label: 'Nederlands' },
  { code: 'sv-SE', label: 'Svenska' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
  { code: 'ja-JP', label: '日本語' },
  { code: 'zh-CN', label: '中文 (简体)' },
  { code: 'ar-AE', label: 'العربية' }
]
