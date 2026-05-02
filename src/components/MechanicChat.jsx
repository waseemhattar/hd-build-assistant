import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  getMessages,
  sendMessage,
  clearConversation,
  subscribe,
  isConfigured
} from '../data/mechanic.js'
import { getGarage } from '../data/storage.js'
import { getProceduresForBike } from '../data/procedures.js'

// Mechanic chat — floating button + slide-up modal on every signed-in
// screen.
//
// Two parts:
//   <MechanicFAB />   — the always-visible red round button (bottom-right)
//   <MechanicModal /> — the slide-up sheet with the conversation
//
// Both live in this file because they share state and the FAB needs to
// show a small unread/streaming dot when the modal is closed.

export default function MechanicChat({ onOpenProcedure }) {
  const [open, setOpen] = useState(false)
  const [streaming, setStreaming] = useState(false)

  // Watch the conversation so the FAB can flicker its dot while the
  // assistant is replying.
  useEffect(() => {
    const unsub = subscribe(({ pending }) => {
      setStreaming(Boolean(pending))
    })
    return unsub
  }, [])

  return (
    <>
      <MechanicFAB
        onClick={() => setOpen(true)}
        streaming={streaming && !open}
      />
      {open && (
        <MechanicModal
          onClose={() => setOpen(false)}
          onOpenProcedure={(procId, bikeId) => {
            // Close the chat so the procedure is the focus, then bubble
            // up so App.jsx can navigate.
            setOpen(false)
            onOpenProcedure?.(procId, bikeId)
          }}
        />
      )}
    </>
  )
}

// ============================================================
// FAB
// ============================================================

function MechanicFAB({ onClick, streaming }) {
  return (
    <button
      onClick={onClick}
      title="Ask the mechanic"
      aria-label="Ask the mechanic"
      className="group fixed bottom-24 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-hd-orange text-white shadow-xl shadow-black/40 transition active:scale-90 sm:bottom-6"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ChatIcon className="h-6 w-6" />
      {streaming && (
        <span
          className="absolute right-1 top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 ring-2 ring-hd-black"
          aria-hidden="true"
        />
      )}
    </button>
  )
}

// ============================================================
// Modal
// ============================================================

function MechanicModal({ onClose, onOpenProcedure }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [snapshot, setSnapshot] = useState({ messages: [], pending: '' })
  // Pending image attachment — set when the user picks a photo, cleared
  // after we send. Stores both:
  //   - base64Full: the full-fidelity image we send to the Worker
  //   - preview: a smaller data URL for the user's bubble (avoids
  //     bloating localStorage with megabytes of base64 per chat)
  const [attachment, setAttachment] = useState(null)
  const fileInputRef = useRef(null)
  const garage = useMemo(() => getGarage(), [])
  const [bikeId, setBikeId] = useState(garage[0]?.id || null)
  // Title-lookup map for [PROC:id] tokens. Loaded async when the
  // bike scope changes; without it we still render "Open procedure"
  // labels on tap-buttons (functional, just less descriptive).
  const [procIndex, setProcIndex] = useState(() => new Map())

  // Subscribe to mechanic state
  useEffect(() => {
    const unsub = subscribe((s) => setSnapshot(s))
    return unsub
  }, [])

  // Refresh the proc-id → title map when the chat is scoped to a
  // different bike. We hit Supabase but procedures.js caches in-memory.
  useEffect(() => {
    if (!bikeId) {
      setProcIndex(new Map())
      return
    }
    const bike = garage.find((b) => b.id === bikeId)
    if (!bike) return
    let cancelled = false
    getProceduresForBike(bike)
      .then((groups) => {
        if (cancelled) return
        const map = new Map()
        for (const g of groups || []) {
          for (const p of g.procedures || []) {
            map.set(p.id, p.title)
          }
        }
        setProcIndex(map)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [bikeId, garage])

  const scrollRef = useRef(null)
  useEffect(() => {
    // Auto-scroll to bottom when messages or streaming text change.
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [snapshot.messages, snapshot.pending])

  async function submit(e) {
    e?.preventDefault()
    const haveText = text.trim().length > 0
    const haveImage = Boolean(attachment)
    if ((!haveText && !haveImage) || busy) return
    const t = text
    const att = attachment
    setText('')
    setAttachment(null)
    setBusy(true)
    try {
      await sendMessage(t, {
        bikeId,
        imageBase64: att?.base64Full,
        imagePreview: att?.preview
      })
    } finally {
      setBusy(false)
    }
  }

  // Convert the picked file to base64 strings — full for the Worker,
  // a smaller resized preview for local display. We use a canvas to
  // produce the resized version so we don't ship megabytes of base64
  // into localStorage for every photo.
  async function pickPhoto(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please pick an image file.')
      return
    }
    try {
      const fullBase64 = await fileToBase64(file)
      const preview = await downscaleToDataUrl(fullBase64, 256)
      setAttachment({ base64Full: fullBase64, preview, name: file.name })
    } catch (e) {
      alert('Could not load that image.')
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const configured = isConfigured()
  const allMessages = [
    ...snapshot.messages,
    ...(snapshot.pending
      ? [{ role: 'assistant', content: snapshot.pending, streaming: true }]
      : [])
  ]

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative flex h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl bg-hd-black sm:h-[80vh] sm:max-w-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-white/5 bg-hd-dark/95 px-5 py-3 backdrop-blur">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-hd-orange text-white">
              <ChatIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-bold text-hd-text">
                Mechanic
              </div>
              <div className="text-[11px] text-hd-muted">
                AI · Llama 3.3 · in beta
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {snapshot.messages.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear this conversation?')) {
                    clearConversation()
                  }
                }}
                className="rounded-full px-3 py-1.5 text-[12px] text-hd-muted hover:text-hd-orange"
                title="Clear conversation"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-hd-muted hover:bg-hd-card hover:text-hd-text"
              aria-label="Close"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Bike scope chooser */}
        {garage.length > 0 && (
          <div className="border-b border-white/5 bg-hd-dark/50 px-5 py-2.5">
            <label className="flex items-center gap-3 text-[12px]">
              <span className="text-hd-muted">Talking about:</span>
              <select
                value={bikeId || ''}
                onChange={(e) => setBikeId(e.target.value || null)}
                className="flex-1 rounded-full bg-hd-card px-3 py-1.5 text-[13px] text-hd-text"
              >
                <option value="">All my bikes (general)</option>
                {garage.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nickname || b.model || `${b.year || ''} bike`}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 sm:px-5"
        >
          {!configured && <NotConfiguredBanner />}
          {configured && allMessages.length === 0 && (
            <EmptyState onSeed={(t) => setText(t)} />
          )}
          {allMessages.map((m, i) => (
            <Bubble
              key={i}
              role={m.role}
              content={m.content}
              image={m.image}
              streaming={m.streaming}
              procIndex={procIndex}
              onProcedureClick={(procId) =>
                onOpenProcedure?.(procId, bikeId)
              }
            />
          ))}
        </div>

        {/* Composer */}
        <form
          onSubmit={submit}
          className="border-t border-white/5 bg-hd-dark/95 p-3 backdrop-blur"
        >
          {/* Attachment preview (above the input row) */}
          {attachment && (
            <div className="mb-2 flex items-center gap-2 rounded-2xl bg-hd-card p-2">
              <img
                src={attachment.preview}
                alt="Attached photo"
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div className="flex-1 truncate text-[12px] text-hd-muted">
                {attachment.name || 'Photo attached'}
              </div>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="rounded-full bg-hd-black/50 px-2.5 py-1 text-[11px] text-hd-muted hover:text-hd-text"
                aria-label="Remove attachment"
              >
                Remove
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                pickPhoto(e.target.files?.[0])
                e.target.value = '' // allow re-pick same file
              }}
            />
            {/* Photo button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!configured || busy}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-hd-card text-hd-text transition active:scale-90 disabled:opacity-40"
              title="Attach a photo of the part"
              aria-label="Attach photo"
            >
              <CameraIcon className="h-5 w-5" />
            </button>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={
                configured
                  ? attachment
                    ? "What's this part? (optional)"
                    : 'Ask about service, mods, diagnostic…'
                  : 'Mechanic is not configured yet.'
              }
              disabled={!configured || busy}
              className="flex-1 resize-none rounded-2xl bg-hd-card px-4 py-3 text-[15px] text-hd-text placeholder:text-hd-muted/70 focus:outline-none focus:ring-2 focus:ring-hd-orange/40 disabled:opacity-50"
              style={{ maxHeight: '8rem' }}
            />
            <button
              type="submit"
              disabled={
                !configured ||
                busy ||
                (!text.trim() && !attachment)
              }
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-hd-orange text-white transition active:scale-90 disabled:opacity-40"
              aria-label="Send"
            >
              {busy ? (
                <SpinnerIcon className="h-5 w-5" />
              ) : (
                <SendIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================================
// Pieces
// ============================================================

function Bubble({
  role,
  content,
  image,
  streaming,
  procIndex,
  onProcedureClick
}) {
  if (role === 'system') {
    return (
      <div className="my-2 rounded-2xl bg-amber-500/10 px-4 py-2.5 text-[13px] text-amber-200">
        {content}
      </div>
    )
  }
  const isUser = role === 'user'
  return (
    <div
      className={`mb-3 flex ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[88%] overflow-hidden rounded-3xl text-[15px] leading-relaxed ${
          isUser
            ? 'bg-hd-orange text-white'
            : 'bg-hd-dark text-hd-text'
        }`}
      >
        {image && (
          <img
            src={image}
            alt="Attached photo"
            className="max-h-72 w-full object-cover"
          />
        )}
        <div className="whitespace-pre-wrap px-4 py-2.5">
          {role === 'assistant' ? (
            <ParsedAssistantContent
              content={content}
              procIndex={procIndex}
              onProcedureClick={onProcedureClick}
            />
          ) : (
            content
          )}
          {streaming && (
            <span className="ml-1 inline-block h-2 w-2 animate-pulse rounded-full bg-hd-orange/70 align-middle" />
          )}
        </div>
      </div>
    </div>
  )
}

// Splits an assistant message body into a list of plain-text spans
// and inline procedure-link buttons. The token shape is [PROC:<uuid>],
// where <uuid> matches an id from the user's available procedures.
//
// Defensive details:
//   - Unknown ids still render as a button (labeled "Open procedure")
//     in case the AI hallucinates an id; clicking still tries to open
//     it via the parent's handler — better than breaking the layout.
//   - We use a non-greedy regex with a permissive id charset (uuid-ish
//     plus any alphanumerics, dashes, underscores) to handle whatever
//     id format the procedures table is using.
function ParsedAssistantContent({ content, procIndex, onProcedureClick }) {
  const parts = useMemo(
    () => parseProcTokens(content || ''),
    [content]
  )
  return (
    <>
      {parts.map((p, i) => {
        if (p.type === 'proc') {
          const title = procIndex?.get(p.id) || 'Open procedure'
          return (
            <button
              key={i}
              type="button"
              onClick={() => onProcedureClick?.(p.id)}
              className="mx-0.5 my-0.5 inline-flex items-center gap-1 rounded-full bg-hd-orange/15 px-2.5 py-0.5 text-[13px] font-semibold text-hd-orange transition active:scale-95 hover:bg-hd-orange/25"
              title="Open this procedure in the manual"
            >
              <BookIcon className="h-3 w-3" />
              <span>{title}</span>
            </button>
          )
        }
        return <span key={i}>{p.text}</span>
      })}
    </>
  )
}

function parseProcTokens(text) {
  const re = /\[PROC:([A-Za-z0-9_-]+)\]/g
  const out = []
  let last = 0
  let m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      out.push({ type: 'text', text: text.slice(last, m.index) })
    }
    out.push({ type: 'proc', id: m[1] })
    last = re.lastIndex
  }
  if (last < text.length) {
    out.push({ type: 'text', text: text.slice(last) })
  }
  return out
}

function BookIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 5a2 2 0 0 1 2-2h11v18H6a2 2 0 0 1-2-2V5z" />
      <path d="M4 19a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

function EmptyState({ onSeed }) {
  const seeds = [
    'What service is overdue on my bike?',
    'Explain the next interval check coming up.',
    'I hear a tick at idle — where do I start?',
    'What torque spec for my axle pinch bolts?'
  ]
  return (
    <div className="mx-auto max-w-md py-6 text-center">
      <div className="mb-1 text-2xl font-bold text-hd-text">
        Ask the mechanic
      </div>
      <p className="mb-5 text-[14px] text-hd-muted">
        I know your bike, mileage, mods, and recent service. Ask anything.
      </p>
      <div className="space-y-2">
        {seeds.map((s) => (
          <button
            key={s}
            onClick={() => onSeed(s)}
            className="block w-full rounded-2xl bg-hd-dark px-4 py-3 text-left text-[14px] text-hd-text transition active:scale-[0.99]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function NotConfiguredBanner() {
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-amber-500/10 p-5 text-[13px] text-amber-200">
      <div className="mb-1 font-semibold">Mechanic not configured</div>
      <p>
        Deploy the Cloudflare Worker (see <code>workers/mechanic/README.md</code>)
        and set <code>VITE_MECHANIC_WORKER_URL</code> in your env, then rebuild.
      </p>
    </div>
  )
}

// ============================================================
// Icons
// ============================================================

function ChatIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a8 8 0 0 1-12.5 6.6L4 20l1.4-4.5A8 8 0 1 1 21 12z" />
      <path d="M9 11h.01M12 11h.01M15 11h.01" />
    </svg>
  )
}

function CloseIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  )
}

function SendIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12l18-9-9 18-2-7-7-2z" />
    </svg>
  )
}

function SpinnerIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`animate-spin ${className}`}
    >
      <path d="M21 12a9 9 0 1 1-6.2-8.55" />
    </svg>
  )
}

function CameraIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

// ============================================================
// Image helpers
// ============================================================

// Read a File and resolve to a `data:image/...;base64,...` URL.
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Downscale a base64 image so it's suitable for an inline preview.
// Maintains aspect ratio. Output is always JPEG to keep the size small.
async function downscaleToDataUrl(srcDataUrl, maxDim = 256) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const ratio = Math.min(
        maxDim / img.naturalWidth,
        maxDim / img.naturalHeight,
        1
      )
      const w = Math.round(img.naturalWidth * ratio)
      const h = Math.round(img.naturalHeight * ratio)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.onerror = reject
    img.src = srcDataUrl
  })
}
