// Sidestand Mechanic — Cloudflare Worker
//
// One endpoint:
//   POST /chat
//     headers: Authorization: Bearer <supabase-access-token>
//     body: {
//       messages: [{ role, content }, ...],
//       context: {
//         bike?: { year, model, mileage, vin, ... },
//         recentService?: [{ date, mileage, title, parts, notes }, ...],
//         mods?: [{ title, brand, status, category, ... }, ...],
//         availableProcedures?: [{ id, title }, ...]
//       }
//     }
//     returns: text/event-stream of token chunks (SSE), terminated by `data: [DONE]`
//
// The Worker:
//   1. Validates the Supabase JWT signature → identifies the user.
//   2. Builds a system prompt containing the user's bike context.
//   3. Calls env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', ...)
//      with stream: true.
//   4. Pipes the model's stream straight back to the browser as SSE.
//
// CORS: allow sidestand.app, harley.h-dbuilds.com (legacy), capacitor://localhost (iOS),
//       and localhost:5173 (dev).

const ALLOWED_ORIGINS = [
  'https://sidestand.app',
  'https://www.sidestand.app',
  'https://harley.h-dbuilds.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'capacitor://localhost',
  'ionic://localhost'
]

// The model to call. Llama 3.3 70B is the recommended starting choice
// for general chat — fast, cheap, decent at structured reasoning.
// Swap to a different Workers AI model by changing this string.
const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'

// Soft cap on tokens to keep responses bounded and costs predictable.
const MAX_TOKENS = 768

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || ''
    const corsHeaders = buildCorsHeaders(origin)

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    const url = new URL(request.url)

    if (url.pathname === '/health') {
      return json({ ok: true, model: MODEL }, 200, corsHeaders)
    }

    if (url.pathname !== '/chat') {
      return json({ error: 'Not found' }, 404, corsHeaders)
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, corsHeaders)
    }

    // ---------- auth ----------
    const auth = request.headers.get('Authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
    if (!token) {
      return json({ error: 'Missing Authorization' }, 401, corsHeaders)
    }
    let user
    try {
      user = await verifySupabaseJwt(token, env.SUPABASE_JWT_SECRET)
    } catch (e) {
      return json(
        { error: `Invalid token: ${e.message || String(e)}` },
        401,
        corsHeaders
      )
    }

    // ---------- body ----------
    let body
    try {
      body = await request.json()
    } catch (_) {
      return json({ error: 'Invalid JSON body' }, 400, corsHeaders)
    }
    const userMessages = Array.isArray(body?.messages) ? body.messages : []
    const context = body?.context || {}

    if (userMessages.length === 0) {
      return json({ error: 'No messages provided' }, 400, corsHeaders)
    }

    // Trim to last 12 turns so we don't blow the context window. We
    // always preserve the system prompt (added below) and the most
    // recent user message — older history is the first to drop.
    const trimmedHistory = trimHistory(userMessages, 12)

    // ---------- system prompt ----------
    const systemPrompt = buildSystemPrompt(context)

    const finalMessages = [
      { role: 'system', content: systemPrompt },
      ...trimmedHistory
    ]

    // ---------- call Workers AI (streaming) ----------
    let stream
    try {
      stream = await env.AI.run(MODEL, {
        messages: finalMessages,
        stream: true,
        max_tokens: MAX_TOKENS
      })
    } catch (e) {
      console.error('AI.run failed', e)
      return json(
        { error: `Model error: ${e.message || String(e)}` },
        500,
        corsHeaders
      )
    }

    // Workers AI returns a ReadableStream of SSE bytes already. We
    // forward it as-is with the right Content-Type so the browser's
    // EventSource (or our fetch + reader) can parse it.
    return new Response(stream, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        // Header lets the browser tell us which user the stream is for
        // — useful for client-side rate-limit banners etc.
        'X-User-Id': user.sub || 'unknown'
      }
    })
  }
}

// ============================================================
// CORS
// ============================================================

function buildCorsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  }
}

// ============================================================
// JSON helper
// ============================================================

function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      ...extraHeaders,
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
}

// ============================================================
// Supabase JWT verification (HS256)
// ============================================================
//
// Supabase Auth signs access tokens with HS256 using the project's
// JWT secret. We do a full signature check — not just decode — so a
// malicious user can't forge claims.
//
// We avoid pulling in a heavy JWT library; the WebCrypto API on
// Cloudflare Workers handles HS256 verification in ~20 lines.

async function verifySupabaseJwt(token, secret) {
  if (!secret) throw new Error('Worker missing SUPABASE_JWT_SECRET')
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Malformed JWT')
  const [headerB64, payloadB64, signatureB64] = parts

  // Verify signature
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  const sig = base64UrlDecodeToBytes(signatureB64)
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )
  const valid = await crypto.subtle.verify('HMAC', key, sig, data)
  if (!valid) throw new Error('Bad signature')

  // Decode + sanity-check claims
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecodeToBytes(payloadB64)))
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) throw new Error('Token expired')
  if (payload.nbf && payload.nbf > now) throw new Error('Token not yet valid')
  return payload
}

function base64UrlDecodeToBytes(s) {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4))
  const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

// ============================================================
// History trimming
// ============================================================

function trimHistory(messages, maxTurns) {
  // A "turn" = one user msg + one assistant msg pair. We measure in
  // messages, not turns, so maxTurns=12 keeps roughly 6 back-and-forths.
  if (messages.length <= maxTurns) return messages
  return messages.slice(-maxTurns)
}

// ============================================================
// System prompt builder
// ============================================================
//
// The system prompt is the foundation of the assistant's personality
// AND the channel for injecting the user's specific bike data. Keep it:
//   - Short. Llama 3.3 starts to ramble if the system prompt is huge.
//   - Concrete. Always cite specifics, not "your bike" abstractly.
//   - Honest. Tell the model to say "I don't know" when context is thin.
//   - Action-oriented. Most users want a clear next step, not a lecture.

function buildSystemPrompt(context) {
  const lines = [
    'You are Sidestand, an AI mechanic assistant for motorcycle riders.',
    'Your job: help the user diagnose problems, plan service, choose parts, and understand their service manual.',
    '',
    'Style:',
    '- Be concise. Skip filler. 2–4 short paragraphs is plenty.',
    '- Default to specifics over generalities. Reference the user\'s actual mileage and history when it matters.',
    '- If the question is ambiguous, ask one clarifying question instead of speculating.',
    '- If you genuinely don\'t know, say so — never invent torque specs or part numbers.',
    '- Never tell the user to do something dangerous without flagging the safety concern first.',
    '',
    'You have NO browse-the-web capability and NO access to images. If the user asks for current parts pricing or wants to share a photo, tell them you can\'t see it yet.'
  ]

  // Selected bike
  if (context.bike) {
    const b = context.bike
    lines.push('', "USER'S BIKE:")
    if (b.year || b.model) lines.push(`- ${[b.year, b.model].filter(Boolean).join(' ')}`)
    if (b.nickname) lines.push(`- Nickname: ${b.nickname}`)
    if (b.mileage != null) lines.push(`- Mileage: ${b.mileage.toLocaleString()} mi`)
    if (b.vin) lines.push(`- VIN: ${b.vin}`)
    if (b.engineDisplacement) lines.push(`- Engine: ${b.engineDisplacement}`)
  } else if (Array.isArray(context.garage) && context.garage.length > 0) {
    lines.push(
      '',
      `USER OWNS ${context.garage.length} BIKE(S):`,
      ...context.garage.slice(0, 6).map(
        (b) =>
          `- ${[b.year, b.model].filter(Boolean).join(' ')}${
            b.nickname ? ` "${b.nickname}"` : ''
          }${b.mileage != null ? ` (${b.mileage.toLocaleString()} mi)` : ''}`
      )
    )
    lines.push(
      'No specific bike is selected for this conversation; ask which one if relevant.'
    )
  } else {
    lines.push('', "User hasn't added any bikes yet. If they ask about service or parts, suggest they add a bike first via the Garage tab.")
  }

  // Recent service
  if (Array.isArray(context.recentService) && context.recentService.length > 0) {
    lines.push('', 'RECENT SERVICE (newest first):')
    for (const e of context.recentService.slice(0, 8)) {
      const parts = []
      if (e.date) parts.push(e.date)
      if (e.mileage != null) parts.push(`${e.mileage.toLocaleString()} mi`)
      const meta = parts.join(' @ ')
      const summary = [e.title, e.parts].filter(Boolean).join(' — ')
      lines.push(`- ${meta}: ${summary}`)
    }
  }

  // Mods
  if (Array.isArray(context.mods) && context.mods.length > 0) {
    const installed = context.mods.filter((m) => m.status === 'installed')
    const planned = context.mods.filter((m) => m.status === 'planned')
    if (installed.length > 0) {
      lines.push('', `INSTALLED MODS (${installed.length}):`)
      for (const m of installed.slice(0, 12)) {
        lines.push(
          `- ${[m.title, m.brand].filter(Boolean).join(' — ')}${m.partNumber ? ` (PN ${m.partNumber})` : ''}`
        )
      }
    }
    if (planned.length > 0) {
      lines.push('', `PLANNED MODS (${planned.length}):`)
      for (const m of planned.slice(0, 8)) {
        lines.push(`- ${[m.title, m.brand].filter(Boolean).join(' — ')}`)
      }
    }
  }

  // Available manual procedures
  if (Array.isArray(context.availableProcedures) && context.availableProcedures.length > 0) {
    lines.push(
      '',
      `MANUAL PROCEDURES AVAILABLE FOR THIS BIKE (${context.availableProcedures.length}):`
    )
    for (const p of context.availableProcedures.slice(0, 30)) {
      lines.push(`- ${p.title}`)
    }
    lines.push(
      '',
      'If the user\'s question maps to one of these, recommend they open it via the Manual tab.'
    )
  }

  return lines.join('\n')
}
