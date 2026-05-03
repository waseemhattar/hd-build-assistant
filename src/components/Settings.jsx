import React, { useEffect, useState } from 'react'
import { useUser } from '../auth/AuthProvider.jsx'
import { getPrefs, setPref, resetPrefs, subscribe } from '../data/userPrefs.js'
import {
  getDeadLetterQueue,
  retryDeadLetterOp,
  retryAllDeadLetterOps,
  discardDeadLetterOp,
  clearDeadLetterQueue,
  subscribe as subscribeStorage
} from '../data/storage.js'
import {
  formatTimeAgo,
  formatDate,
  formatCurrency
} from '../data/userPrefs.js'

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

      <Section title="Region" subtitle="Date, currency, and number formatting.">
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

        <Row label="Number style">
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

        <RegionPreview prefs={prefs} />
      </Section>

      <SyncIssuesSection />

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

// Live preview of how the chosen Region settings render an actual
// date and number. Without this, a rider picking "France" sees no
// change anywhere and assumes the setting is broken. With this,
// the preview row updates in place and they can see "2 mai 2026 ·
// 1 234,56 €" immediately.
//
// We also tell the rider explicitly that this isn't a language
// switch — the app interface is English-only for now. That's the
// honest framing; the previous "Français/Deutsch" labels implied
// translation was happening when it wasn't.
function RegionPreview({ prefs }) {
  const today = new Date()
  const sampleAmount = 1234.56
  let dateStr = '—'
  let currencyStr = '—'
  let numberStr = '—'
  let timeAgoStr = '—'
  try {
    dateStr = formatDate(today, { long: true })
  } catch (_) {}
  try {
    currencyStr = formatCurrency(sampleAmount)
  } catch (_) {}
  try {
    numberStr = new Intl.NumberFormat(prefs.locale).format(sampleAmount)
  } catch (_) {}
  try {
    const fiveDaysAgo = new Date(today.getTime() - 5 * 86400000)
    timeAgoStr = formatTimeAgo(fiveDaysAgo)
  } catch (_) {}

  return (
    <div className="rounded-md border border-hd-border bg-hd-black/40 p-4">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-hd-orange">
        Preview
      </div>
      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div className="flex justify-between gap-3">
          <dt className="text-hd-muted">Today</dt>
          <dd className="text-hd-text">{dateStr}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-hd-muted">Number</dt>
          <dd className="font-mono text-hd-text">{numberStr}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-hd-muted">Currency</dt>
          <dd className="font-mono text-hd-text">{currencyStr}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-hd-muted">5 days ago</dt>
          <dd className="text-hd-text">{timeAgoStr}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] leading-relaxed text-hd-muted">
        Region only changes how dates and numbers are <em>formatted</em>.
        Sidestand's interface is currently English; full language
        translation is on the roadmap.
      </p>
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

// Number/date formatting locales. We label these by COUNTRY rather
// than language because this isn't a UI translation switch — it
// only controls how dates and numbers are formatted (1,234.56 vs
// 1.234,56 etc.). The previous "Français/Deutsch" labels misled
// riders into thinking the app would translate.
const LOCALE_OPTIONS = [
  { code: 'en-US', label: 'United States' },
  { code: 'en-GB', label: 'United Kingdom' },
  { code: 'en-CA', label: 'Canada' },
  { code: 'en-AU', label: 'Australia' },
  { code: 'en-IN', label: 'India' },
  { code: 'fr-FR', label: 'France' },
  { code: 'de-DE', label: 'Germany' },
  { code: 'es-ES', label: 'Spain' },
  { code: 'it-IT', label: 'Italy' },
  { code: 'nl-NL', label: 'Netherlands' },
  { code: 'sv-SE', label: 'Sweden' },
  { code: 'pt-BR', label: 'Brazil' },
  { code: 'ja-JP', label: 'Japan' },
  { code: 'zh-CN', label: 'China' },
  { code: 'ar-AE', label: 'United Arab Emirates' }
]


// ============================================================
// Sync Issues — dead-letter queue surfaced to the rider
// ============================================================
//
// The sync queue (storage.js) moves any op that failed MAX_SYNC_RETRIES
// times into a dead-letter list so a single bad write doesn't block
// every subsequent one. This panel makes that list visible: the rider
// sees what failed + when, and can either retry (push the op back
// onto the main queue with a fresh budget) or discard it.
//
// In normal operation this section shows "All synced" — the queue
// usually drains cleanly. It only surfaces real ops to the rider
// when something genuinely went wrong (server-side constraint
// violation, FK error, etc.).

function SyncIssuesSection() {
  const [dlq, setDlq] = useState(() => getDeadLetterQueue())

  useEffect(() => {
    const unsub = subscribeStorage(() => setDlq(getDeadLetterQueue()))
    return unsub
  }, [])

  if (dlq.length === 0) {
    return (
      <Section
        title="Sync"
        subtitle="Pull down on any page to re-sync with the cloud."
      >
        <div className="rounded-md border border-hd-border bg-hd-dark p-4">
          <div className="flex items-center gap-2 text-sm text-emerald-300">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            All synced — nothing pending.
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section
      title="Sync"
      subtitle={`${dlq.length} write${dlq.length === 1 ? '' : 's'} failed and need attention.`}
    >
      <div className="rounded-md border border-amber-500/40 bg-amber-500/5 p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[12px] leading-relaxed text-amber-200">
            These changes couldn't sync to the cloud after several
            tries. Retry them once you fix the cause, or discard if
            the change is no longer needed.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const n = retryAllDeadLetterOps()
                console.info('retried', n, 'dead-lettered ops')
              }}
              className="rounded bg-hd-orange px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white hover:brightness-110"
            >
              Retry all
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Discard ${dlq.length} failed write${dlq.length === 1 ? '' : 's'}? This cannot be undone.`
                  )
                ) {
                  clearDeadLetterQueue()
                }
              }}
              className="rounded border border-hd-border bg-hd-dark px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-hd-muted hover:text-red-400"
            >
              Clear all
            </button>
          </div>
        </div>

        <ul className="space-y-2">
          {dlq.map((op) => {
            const id = op.queuedAt
            return (
              <li
                key={id}
                className="rounded border border-hd-border bg-hd-dark p-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-mono text-[11px] uppercase tracking-widest text-hd-orange">
                      {humanizeOp(op.op)}
                    </div>
                    <div className="mt-0.5 text-xs text-hd-muted">
                      {op.deadLetteredAt
                        ? `Failed ${formatTimeAgo(op.deadLetteredAt)}`
                        : 'Failed recently'}
                      {op.retries ? ` · ${op.retries} attempts` : ''}
                    </div>
                    {op.lastError && (
                      <div className="mt-1.5 break-words rounded bg-hd-black/60 px-2 py-1.5 font-mono text-[11px] leading-snug text-red-300">
                        {op.lastError}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => retryDeadLetterOp(id)}
                      className="rounded bg-hd-orange px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white hover:brightness-110"
                    >
                      Retry
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Discard this failed write?')) {
                          discardDeadLetterOp(id)
                        }
                      }}
                      className="rounded border border-hd-border bg-hd-dark px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-hd-muted hover:text-red-400"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}

// Humanize the internal op name so riders see "Save bike" instead
// of "upsertBike" in the failure list.
function humanizeOp(op) {
  switch (op) {
    case 'upsertBike':
      return 'Save bike'
    case 'deleteBike':
      return 'Delete bike'
    case 'upsertEntry':
      return 'Save service entry'
    case 'deleteEntry':
      return 'Delete service entry'
    case 'upsertBuild':
      return 'Save build'
    case 'deleteBuild':
      return 'Delete build'
    case 'upsertMod':
      return 'Save mod'
    case 'deleteMod':
      return 'Delete mod'
    default:
      return op || 'Unknown op'
  }
}
