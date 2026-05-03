import React, { useState } from 'react'
import {
  getPrefs,
  setPref,
  setPrefs,
  markOnboardingComplete
} from '../data/userPrefs.js'

// First-time setup wizard. Shown ONCE on a fresh sign-in (gated via
// userPrefs.onboardingCompletedAt). Three steps:
//
//   1. Welcome — what Sidestand is
//   2. Preferences — units (imperial/metric) + region niceties
//   3. Privacy & data consent — the full list of what we collect, why,
//      where it lives, who has access. The user must tick "I agree"
//      to proceed.
//
// Completion writes onboardingCompletedAt + consentDataCollection=true
// to userPrefs (localStorage) so we never bother the user again on
// this device. They can revisit & change preferences anytime via
// Settings.
//
// Existing users who already have data are auto-marked complete by
// the parent (App.jsx) — we only show this for users who genuinely
// haven't seen it.

export default function FirstTimeSetup({ onDone }) {
  const [stepIdx, setStepIdx] = useState(0)
  const [prefs, setLocalPrefs] = useState(() => getPrefs())
  const [agreed, setAgreed] = useState(false)

  function update(patch) {
    setPrefs(patch)
    setLocalPrefs((p) => ({ ...p, ...patch }))
  }

  function finish() {
    markOnboardingComplete()
    onDone?.()
  }

  const stepCount = 3

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 sm:items-center"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div
        className="w-full max-w-lg overflow-y-auto rounded-t-3xl bg-hd-dark sm:rounded-3xl"
        style={{
          maxHeight: '90vh',
          paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))'
        }}
      >
        {/* Progress bar */}
        <div className="flex items-center gap-1.5 px-6 pt-6">
          {Array.from({ length: stepCount }).map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= stepIdx ? 'bg-hd-orange' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="px-6 pt-5">
          {stepIdx === 0 && <Welcome />}
          {stepIdx === 1 && (
            <PreferencesStep prefs={prefs} update={update} />
          )}
          {stepIdx === 2 && (
            <ConsentStep agreed={agreed} setAgreed={setAgreed} />
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 px-6">
          {stepIdx > 0 ? (
            <button
              onClick={() => setStepIdx((s) => s - 1)}
              className="rounded-full bg-hd-card px-4 py-2.5 text-[13px] font-medium text-hd-text"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={() => {
              if (stepIdx < stepCount - 1) {
                setStepIdx((s) => s + 1)
              } else if (agreed) {
                finish()
              }
            }}
            disabled={stepIdx === stepCount - 1 && !agreed}
            className="rounded-full bg-hd-orange px-6 py-2.5 text-[14px] font-semibold text-white transition active:scale-95 disabled:opacity-40"
          >
            {stepIdx === stepCount - 1 ? 'Agree & continue' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Step 1 — Welcome
// ============================================================

function Welcome() {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
        Welcome
      </div>
      <h2 className="mt-1 text-3xl font-bold tracking-tight text-hd-text">
        Sidestand
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-hd-muted">
        The app for everyone who actually rides — save your rides,
        share them, stay on top of service, and find new roads to
        try out.
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-hd-muted">
        Two quick things before you add your first bike — pick
        your units, then have a quick read of how we handle
        your data.
      </p>
      <ul className="mt-5 space-y-2.5 text-[14px] text-hd-text">
        <li className="flex items-start gap-3">
          <Check />
          <span>
            <strong className="font-semibold">Rides</strong> — save
            every ride and share it with friends or on social.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Check />
          <span>
            <strong className="font-semibold">Garage</strong> — every
            bike, mod, and service in one place.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Check />
          <span>
            <strong className="font-semibold">Service</strong> — walk
            through any factory job step by step.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Check />
          <span>
            <strong className="font-semibold">Discover</strong> —
            find new roads near you, posted by other riders.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Check />
          <span>
            <strong className="font-semibold">Mechanic</strong> —
            ask anything; it knows your bike and your service manual.
          </span>
        </li>
      </ul>
    </div>
  )
}

// ============================================================
// Step 2 — Preferences
// ============================================================

function PreferencesStep({ prefs, update }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
        Preferences
      </div>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-hd-text">
        How do you measure things?
      </h2>
      <p className="mt-2 text-[14px] text-hd-muted">
        We took a guess from your phone's region — change whatever
        looks off and the rest of the app updates right away. You
        can always tweak this later in Settings.
      </p>

      <div className="mt-5 space-y-3">
        <SegmentedRow
          label="Measurement system"
          value={prefs.units}
          onChange={(v) => {
            update({
              units: v,
              temperature: v === 'metric' ? 'C' : 'F',
              fuelVolume: v === 'metric' ? 'liters' : 'gallons'
            })
          }}
          options={[
            {
              value: 'imperial',
              label: 'Imperial',
              sub: 'mi · mph · °F · gal'
            },
            {
              value: 'metric',
              label: 'Metric',
              sub: 'km · km/h · °C · L'
            }
          ]}
        />
        <SegmentedRow
          label="Date format"
          value={prefs.dateFormat}
          onChange={(v) => update({ dateFormat: v })}
          options={[
            { value: 'mdy', label: 'Month Day Year', sub: 'May 1, 2026' },
            { value: 'dmy', label: 'Day Month Year', sub: '1 May 2026' }
          ]}
        />
      </div>
    </div>
  )
}

// ============================================================
// Step 3 — Privacy & data collection consent
// ============================================================

function ConsentStep({ agreed, setAgreed }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hd-orange">
        Privacy
      </div>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-hd-text">
        Your data, your bike
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-hd-muted">
        We hold onto whatever you put in so you can pick up where
        you left off. Here's exactly what we keep, where it lives,
        and who else can see it.
      </p>

      <div className="mt-4 space-y-3">
        <DataSection
          title="What we collect"
          items={[
            'Account: your email, name, and profile photo (from Google or Apple sign-in).',
            'Bikes: year, make, model, optional VIN, mileage, nickname, notes, photos.',
            'Service: dates, mileage at service, parts, costs, notes for each entry.',
            'Mods: brands, part numbers, costs, install dates, photos.',
            'Rides: GPS coordinates while recording, distance, speed, duration, weather snapshot at start.',
            'Mechanic chats: your messages and any photos you send to the AI mechanic.',
            'Preferences: units, date format, currency, locale.'
          ]}
        />
        <DataSection
          title="Where it lives"
          items={[
            'Supabase (Postgres + storage) — your bike data, service log, mods, rides, and AI chat history.',
            'Cloudflare Workers AI / Anthropic — your AI mechanic messages are sent for inference. Photos sent to the mechanic are processed but not stored by Anthropic.',
            'Open-Meteo — weather lookups during rides (lat/lng only, no account info).',
            'Your device — copies of recent data cached for offline use.'
          ]}
        />
        <DataSection
          title="Who can see it"
          items={[
            'You — through your signed-in account.',
            'Public bike pages — only the bikes, mods, and service entries you explicitly mark as public. Default is private.',
            'No third-party advertisers. No analytics resold. No data sales.'
          ]}
        />
        <DataSection
          title="Your controls"
          items={[
            'Edit or delete any item anytime from inside the app.',
            'Toggle each bike, mod, or service entry between public and private.',
            'Delete your account from Settings to remove all stored data.',
            'Revoke AI mechanic access by avoiding the chat — no other feature uses it.'
          ]}
        />
      </div>

      <label className="mt-5 flex items-start gap-3 rounded-2xl bg-hd-black/40 p-4">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-5 w-5 accent-hd-orange"
        />
        <span className="text-[14px] leading-relaxed text-hd-text">
          I understand what Sidestand collects and where it's stored.
          I agree to the data handling described above.
        </span>
      </label>
    </div>
  )
}

// ============================================================
// Bits
// ============================================================

function DataSection({ title, items }) {
  return (
    <div className="rounded-2xl bg-hd-black/40 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-hd-orange">
        {title}
      </div>
      <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-hd-text/85">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-hd-orange" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SegmentedRow({ label, value, onChange, options }) {
  return (
    <div className="rounded-2xl bg-hd-black/40 p-4">
      <div className="mb-3 text-sm font-medium text-hd-text">{label}</div>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`
        }}
      >
        {options.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`rounded-xl border px-3 py-2.5 text-left transition ${
                active
                  ? 'border-hd-orange bg-hd-orange/10'
                  : 'border-white/10 bg-hd-dark hover:border-hd-orange/40'
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

function Check() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-hd-orange/15 text-hd-orange">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3 w-3"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )
}
