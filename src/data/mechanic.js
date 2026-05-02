// Mechanic AI client — talks to the Cloudflare Worker that fronts
// Workers AI. Keeps a local conversation buffer in localStorage and
// streams responses back as they arrive.
//
// Design choices:
//   - One conversation per user, persisted to localStorage. This is
//     enough for MVP; per-bike scoping + Supabase persistence land in
//     Session 2.
//   - Streaming via fetch + ReadableStream + TextDecoder so we can
//     show tokens as they come in (much better UX than waiting 5–10s
//     for a full reply).
//   - We assemble the bike-context payload here, NOT in the Worker.
//     The Worker only handles the LLM call + JWT auth. This keeps the
//     Worker stateless and lets us evolve context shape without
//     redeploying.
//
// Public API:
//   getMessages()
//   sendMessage(text, { bikeId, onToken })
//   clearConversation()
//   subscribe(fn)  → unsubscribe
//   isConfigured()

import { getSupabaseClient } from './supabaseClient.js'
import { getBike, getGarage, getServiceLog, getMods } from './storage.js'

const STORAGE_KEY = 'sidestand:mechanic/v1'
// Note: Vite's env-var replacement is a static text scan for the literal
// `import.meta.env.VITE_*`. Optional-chaining (?.) BREAKS that scan and
// the value silently becomes undefined. Always use the bare form.
const WORKER_URL = import.meta.env.VITE_MECHANIC_WORKER_URL || ''

// In-memory store. Hydrated from localStorage on module load. Mirrored
// back to localStorage whenever it changes.
let messages = loadFromStorage() || []
let pendingAssistantText = '' // tokens accumulated for the streaming reply
const listeners = new Set()

function loadFromStorage() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch (_) {
    return null
  }
}

function persist() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch (_) {}
}

function notify() {
  for (const fn of listeners) {
    try {
      fn({ messages: [...messages], pending: pendingAssistantText })
    } catch (e) {
      console.warn('mechanic listener threw', e)
    }
  }
}

export function subscribe(fn) {
  listeners.add(fn)
  // Send the current state immediately so the new subscriber doesn't
  // need a separate getMessages() call.
  try {
    fn({ messages: [...messages], pending: pendingAssistantText })
  } catch (_) {}
  return () => listeners.delete(fn)
}

export function getMessages() {
  return [...messages]
}

export function clearConversation() {
  messages = []
  pendingAssistantText = ''
  persist()
  notify()
}

export function isConfigured() {
  return Boolean(WORKER_URL)
}

// ============================================================
// Send message
// ============================================================
//
// Adds the user's message to the conversation, calls the Worker,
// streams tokens into pendingAssistantText (notifying listeners on
// every token), and finalises the assistant message at the end.
//
// onToken(text) is also called per-token for callers who want a more
// direct view than the subscribe() pattern.

export async function sendMessage(text, opts = {}) {
  const trimmed = (text || '').trim()
  if (!trimmed) return

  if (!WORKER_URL) {
    pushSystemMessage(
      "Mechanic isn't configured yet. Tell the developer to set VITE_MECHANIC_WORKER_URL."
    )
    return
  }

  // 1. Append user message
  messages = [
    ...messages,
    { role: 'user', content: trimmed, ts: Date.now() }
  ]
  pendingAssistantText = ''
  persist()
  notify()

  // 2. Get auth token
  const sb = getSupabaseClient()
  const { data: sessionData } = await sb.auth.getSession()
  const accessToken = sessionData?.session?.access_token
  if (!accessToken) {
    pushSystemMessage('Please sign in to use the mechanic assistant.')
    return
  }

  // 3. Build context payload for the system prompt
  const context = buildContext(opts.bikeId)

  // 4. Call the Worker
  let response
  try {
    response = await fetch(`${WORKER_URL}/chat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content
        })),
        context
      })
    })
  } catch (e) {
    pushSystemMessage(`Network error: ${e?.message || e}`)
    return
  }

  if (!response.ok) {
    let detail = ''
    try {
      const err = await response.json()
      detail = err?.error || ''
    } catch (_) {}
    pushSystemMessage(
      `Mechanic call failed (${response.status}). ${detail}`
    )
    return
  }

  if (!response.body) {
    pushSystemMessage('Mechanic returned an empty response.')
    return
  }

  // 5. Stream tokens
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      // Parse SSE: split by double-newline to get full events
      const events = buffer.split('\n\n')
      buffer = events.pop() || '' // keep the incomplete trailing chunk

      for (const evt of events) {
        const line = evt
          .split('\n')
          .find((l) => l.startsWith('data:'))
        if (!line) continue
        const data = line.replace(/^data:\s?/, '').trim()
        if (data === '[DONE]') continue
        let parsed
        try {
          parsed = JSON.parse(data)
        } catch (_) {
          // Workers AI sometimes emits raw text — accept it as the token
          pendingAssistantText += data
          opts.onToken?.(data)
          notify()
          continue
        }
        const tok = extractToken(parsed)
        if (tok) {
          pendingAssistantText += tok
          opts.onToken?.(tok)
          notify()
        }
      }
    }
  } catch (e) {
    pushSystemMessage(`Stream error: ${e?.message || e}`)
    return
  }

  // 6. Finalise assistant message
  if (pendingAssistantText) {
    messages = [
      ...messages,
      {
        role: 'assistant',
        content: pendingAssistantText,
        ts: Date.now()
      }
    ]
    pendingAssistantText = ''
    persist()
    notify()
  }
}

// Workers AI emits SSE objects shaped like { response: "tok" } per chunk
// for chat completions. Different models / older versions may use
// `delta.content` or `text` — we accept all of them.
function extractToken(obj) {
  if (!obj) return ''
  if (typeof obj.response === 'string') return obj.response
  if (typeof obj.text === 'string') return obj.text
  if (obj.delta?.content) return obj.delta.content
  if (obj.choices?.[0]?.delta?.content) return obj.choices[0].delta.content
  return ''
}

function pushSystemMessage(text) {
  messages = [
    ...messages,
    { role: 'system', content: text, ts: Date.now() }
  ]
  pendingAssistantText = ''
  persist()
  notify()
}

// ============================================================
// Context builder
// ============================================================
//
// Reads the user's local cache (storage.js) and assembles a tight
// payload for the system prompt. We deliberately summarise here so
// the Worker doesn't have to make any DB calls — it only needs the
// data we send.

function buildContext(bikeId) {
  const garage = getGarage()
  const ctx = {}

  // Selected bike (if any) → detailed view
  const bike = bikeId ? getBike(bikeId) : null
  if (bike) {
    ctx.bike = pickBikeFields(bike)

    const log = getServiceLog(bike.id) || []
    if (log.length > 0) {
      ctx.recentService = log.slice(0, 8).map((e) => ({
        date: e.date,
        mileage: e.mileage,
        title: e.title,
        parts: e.parts
      }))
    }
    const mods = getMods(bike.id) || []
    if (mods.length > 0) {
      ctx.mods = mods.map((m) => ({
        title: m.title,
        brand: m.brand,
        partNumber: m.partNumber,
        category: m.category,
        status: m.status
      }))
    }
  } else if (garage.length > 0) {
    ctx.garage = garage.map(pickBikeFields)
  }

  return ctx
}

function pickBikeFields(b) {
  return {
    year: b.year,
    model: b.model,
    nickname: b.nickname,
    mileage: b.mileage,
    vin: b.vin,
    engineDisplacement: b.engineDisplacement
  }
}
