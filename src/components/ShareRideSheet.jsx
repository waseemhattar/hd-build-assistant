import React, { useEffect, useRef, useState } from 'react'
import BottomSheet from './ui/BottomSheet.jsx'
import {
  generateRideCard,
  availableTemplates,
  isStadiaConfigured
} from '../data/shareCard.js'
import { sharePngBlob } from '../data/share.js'
import { getPrefs, subscribe } from '../data/userPrefs.js'

// ShareRideSheet — bottom sheet that lets the user pick a card style
// (silhouette, dark map, satellite) and previews it before tapping
// Share. We render the actual 1080×1920 card to a Blob each time the
// template changes, then show it as an <img> at fit-to-width. It's a
// little expensive (~150ms canvas + ~500ms Stadia fetch on map
// templates) but it's the only way to give a true preview, and modern
// phones handle it without breaking a sweat.
//
// We cache previews per template so re-picking is instant.

export default function ShareRideSheet({ open, onClose, ride, bike, weather }) {
  // Use the available-template list so we don't show map templates
  // when no API key is configured.
  const templates = availableTemplates()
  const [tplId, setTplId] = useState(templates[0]?.id || 'silhouette')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [err, setErr] = useState(null)
  const cacheRef = useRef(new Map()) // tplId -> Blob
  const urlsRef = useRef([]) // to revoke later

  // Track a "prefs version" so the preview re-renders when the user
  // changes units / temperature / etc. in Settings while the sheet is
  // open, AND so the cache invalidates so we don't serve a stale blob
  // (e.g. one rendered in mph after the user switched to km/h).
  const [prefsVersion, setPrefsVersion] = useState(() => prefsKey(getPrefs()))
  useEffect(() => {
    const unsub = subscribe((next) => {
      setPrefsVersion(prefsKey(next))
    })
    return unsub
  }, [])

  // Reset cache whenever the underlying ride changes OR the user
  // flipped any pref that affects the rendered card.
  useEffect(() => {
    if (!open) return
    cacheRef.current = new Map()
    setTplId(templates[0]?.id || 'silhouette')
    setErr(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ride?.id, prefsVersion])

  // Clean up object URLs when the sheet closes.
  useEffect(() => {
    if (open) return
    urlsRef.current.forEach((u) => URL.revokeObjectURL(u))
    urlsRef.current = []
    setPreviewUrl(null)
  }, [open])

  // Generate (or read from cache) the preview when the template
  // selection changes. `prefsVersion` is in the dep list so flipping a
  // unit pref forces a re-render — the cache is reset above so this
  // call hits the slow path and produces a fresh blob.
  useEffect(() => {
    if (!open || !ride) return
    let cancelled = false

    async function run() {
      setErr(null)
      const cached = cacheRef.current.get(tplId)
      if (cached) {
        const url = URL.createObjectURL(cached)
        urlsRef.current.push(url)
        if (!cancelled) setPreviewUrl(url)
        return
      }
      setGenerating(true)
      try {
        const blob = await generateRideCard({
          ride,
          bike,
          weather,
          template: tplId
        })
        if (cancelled) return
        cacheRef.current.set(tplId, blob)
        const url = URL.createObjectURL(blob)
        urlsRef.current.push(url)
        setPreviewUrl(url)
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Could not generate preview.')
      } finally {
        if (!cancelled) setGenerating(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tplId, open, ride?.id, prefsVersion])

  async function handleShare() {
    if (!ride) return
    setSharing(true)
    try {
      // Reuse the cached blob if it exists — otherwise generate fresh.
      let blob = cacheRef.current.get(tplId)
      if (!blob) {
        blob = await generateRideCard({
          ride,
          bike,
          weather,
          template: tplId
        })
        cacheRef.current.set(tplId, blob)
      }
      await sharePngBlob(blob, {
        filename: `sidestand-ride-${ride.id.slice(0, 8)}.jpg`,
        title: bike?.nickname || bike?.model || 'My ride',
        text: 'Recorded on Sidestand.'
      })
      onClose?.()
    } catch (e) {
      console.warn('share failed', e)
      setErr(`Could not share: ${e?.message || e}`)
    } finally {
      setSharing(false)
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} size="lg">
      <BottomSheet.Header
        title="Share ride"
        subtitle="Pick a style, preview, then share."
        onClose={onClose}
      />

      {/* Preview frame — fixed aspect 9:16 so the layout doesn't jump
          while the next preview generates. */}
      <div className="relative mx-auto mb-4 w-full max-w-xs overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
        <div className="aspect-[9/16] w-full">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Ride card preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-hd-muted">
              {generating ? 'Generating preview…' : 'Preview unavailable'}
            </div>
          )}
        </div>
        {generating && previewUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-white">
            Generating…
          </div>
        )}
      </div>

      {/* Template picker */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {templates.map((t) => {
          const active = t.id === tplId
          return (
            <button
              key={t.id}
              onClick={() => setTplId(t.id)}
              className={`rounded-xl border p-3 text-left transition active:scale-95 ${
                active
                  ? 'border-hd-orange bg-hd-orange/10'
                  : 'border-hd-border bg-hd-card hover:border-white/30'
              }`}
            >
              <div
                className={`text-[13px] font-semibold ${
                  active ? 'text-hd-orange' : 'text-hd-text'
                }`}
              >
                {t.label}
              </div>
              <div className="mt-1 text-[11px] leading-tight text-hd-muted">
                {t.description}
              </div>
            </button>
          )
        })}
      </div>

      {!isStadiaConfigured() && templates.length === 1 && (
        <div className="mb-4 rounded-md border border-hd-border bg-hd-card px-3 py-2 text-[11px] leading-tight text-hd-muted">
          Tip: add a free Stadia Maps API key as
          <code className="mx-1 rounded bg-black/40 px-1 text-hd-text">
            VITE_STADIA_API_KEY
          </code>
          to unlock the dark-map and satellite styles.
        </div>
      )}

      {err && (
        <div className="mb-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {err}
        </div>
      )}

      <button
        onClick={handleShare}
        disabled={sharing || generating || !previewUrl}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-hd-orange px-4 py-3 text-sm font-semibold text-white transition active:scale-95 disabled:opacity-50"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        {sharing ? 'Sharing…' : 'Share this card'}
      </button>
    </BottomSheet>
  )
}

// Compact signature of just the prefs that affect what's drawn on the
// share card. Anything that changes the displayed value (units,
// temperature, locale for the date) needs to bust the preview cache.
function prefsKey(p) {
  return `${p?.units || ''}|${p?.temperature || ''}|${p?.locale || ''}`
}
