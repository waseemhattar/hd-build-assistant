import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  getMessages,
  sendMessage,
  clearConversation,
  subscribe,
  isConfigured
} from '../data/mechanic.js'
import { getGarage } from '../data/storage.js'

// Mechanic chat — floating button + slide-up modal on every signed-in
// screen.
//
// Two parts:
//   <MechanicFAB />   — the always-visible red round button (bottom-right)
//   <MechanicModal /> — the slide-up sheet with the conversation
//
// Both live in this file because they share state and the FAB needs to
// show a small unread/streaming dot when the modal is closed.

export default function MechanicChat() {
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
      {open && <MechanicModal onClose={() => setOpen(false)} />}
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

function MechanicModal({ onClose }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [snapshot, setSnapshot] = useState({ messages: [], pending: '' })
  const garage = useMemo(() => getGarage(), [])
  const [bikeId, setBikeId] = useState(garage[0]?.id || null)

  // Subscribe to mechanic state
  useEffect(() => {
    const unsub = subscribe((s) => setSnapshot(s))
    return unsub
  }, [])

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
    if (!text.trim() || busy) return
    const t = text
    setText('')
    setBusy(true)
    try {
      await sendMessage(t, { bikeId })
    } finally {
      setBusy(false)
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
              streaming={m.streaming}
            />
          ))}
        </div>

        {/* Composer */}
        <form
          onSubmit={submit}
          className="flex items-end gap-2 border-t border-white/5 bg-hd-dark/95 p-3 backdrop-blur"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={
              configured
                ? 'Ask about service, mods, diagnostic…'
                : 'Mechanic is not configured yet.'
            }
            disabled={!configured || busy}
            className="flex-1 resize-none rounded-2xl bg-hd-card px-4 py-3 text-[15px] text-hd-text placeholder:text-hd-muted/70 focus:outline-none focus:ring-2 focus:ring-hd-orange/40 disabled:opacity-50"
            style={{ maxHeight: '8rem' }}
          />
          <button
            type="submit"
            disabled={!configured || busy || !text.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-hd-orange text-white transition active:scale-90 disabled:opacity-40"
            aria-label="Send"
          >
            {busy ? (
              <SpinnerIcon className="h-5 w-5" />
            ) : (
              <SendIcon className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

// ============================================================
// Pieces
// ============================================================

function Bubble({ role, content, streaming }) {
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
        className={`max-w-[88%] whitespace-pre-wrap rounded-3xl px-4 py-2.5 text-[15px] leading-relaxed ${
          isUser
            ? 'bg-hd-orange text-white'
            : 'bg-hd-dark text-hd-text'
        }`}
      >
        {content}
        {streaming && (
          <span className="ml-1 inline-block h-2 w-2 animate-pulse rounded-full bg-hd-orange/70 align-middle" />
        )}
      </div>
    </div>
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
