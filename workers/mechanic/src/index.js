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

// Text-only chat model. Llama 3.3 70B — fast, cheap, decent at
// structured reasoning. Swap to a different Workers AI model by
// changing this string.
const TEXT_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'

// Vision model for image-bearing turns. Llama 3.2 11B Vision can take
// a single image + a text prompt and answer about what it sees. Smaller
// than the text model but the only "free with image input" choice on
// Workers AI today.
const VISION_MODEL = '@cf/meta/llama-3.2-11b-vision-instruct'

// Soft cap on tokens to keep responses bounded and costs predictable.
const MAX_TOKENS = 768
const VISION_MAX_TOKENS = 512

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
    // We let Supabase verify the access token for us. Supabase's
    // /auth/v1/user endpoint accepts the access token in Authorization
    // and returns the matching user when the token is valid (regardless
    // of HS256/ES256 / which signing key version the project uses).
    // Slightly slower than local crypto (one HTTP round-trip ~50ms)
    // but completely future-proof against Supabase signing-key rotations.
    const auth = request.headers.get('Authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
    if (!token) {
      return json({ error: 'Missing Authorization' }, 401, corsHeaders)
    }
    if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
      return json(
        {
          error:
            'Worker missing SUPABASE_URL or SUPABASE_ANON_KEY. Set them via wrangler secrets.'
        },
        500,
        corsHeaders
      )
    }
    let user
    try {
      user = await verifySupabaseTokenViaApi(
        token,
        env.SUPABASE_URL,
        env.SUPABASE_ANON_KEY
      )
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

    // Detect whether the most recent message includes an image. If so
    // we'll route to the vision model and ignore the multi-turn
    // history (Workers AI vision endpoints are single-turn for now).
    const lastMessage = userMessages[userMessages.length - 1]
    const imageBase64 = typeof body?.image === 'string' ? body.image : null

    if (imageBase64) {
      return await handleVisionTurn(
        env,
        user,
        lastMessage?.content || '',
        imageBase64,
        context,
        corsHeaders
      )
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
      stream = await env.AI.run(TEXT_MODEL, {
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
// Vision turn — image + text → text (non-streaming)
// ============================================================
//
// Why non-streaming: Llama 3.2 Vision on Workers AI doesn't reliably
// stream tokens for image-bearing turns at this point. We fetch the
// full response in one shot and return it as a single SSE event so
// the React client's existing token-stream parser still works
// without any branching.
//
// Image format: we accept a base64 string (no data: prefix) from the
// client. Workers AI takes images as Uint8Array, so we decode here.

async function handleVisionTurn(env, user, prompt, imageBase64, context, corsHeaders) {
  const trimmedPrompt = (prompt || 'What is in this image?').trim()
  const systemContext = buildVisionSystemPrompt(context)

  let imageBytes
  try {
    // Strip a data: URL prefix if the client sent one.
    const cleaned = imageBase64.replace(/^data:image\/[a-z+]+;base64,/i, '')
    const bin = atob(cleaned)
    imageBytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) imageBytes[i] = bin.charCodeAt(i)
  } catch (e) {
    return json(
      { error: 'Bad image payload (base64 decode failed)' },
      400,
      corsHeaders
    )
  }

  let result
  try {
    result = await env.AI.run(VISION_MODEL, {
      prompt: `${systemContext}\n\nUser question: ${trimmedPrompt}`,
      image: [...imageBytes],
      max_tokens: VISION_MAX_TOKENS
    })
  } catch (e) {
    console.error('Vision AI.run failed', e)
    return json(
      { error: `Vision model error: ${e.message || String(e)}` },
      500,
      corsHeaders
    )
  }

  // Workers AI returns { description } or { response } depending on
  // model version. Normalise to a single string.
  const responseText =
    result?.description ||
    result?.response ||
    (typeof result === 'string' ? result : '') ||
    "I couldn't make out the image — try a clearer shot or a different angle."

  // Encode as a single SSE event so the client's stream parser works
  // unchanged. Followed by [DONE] terminator.
  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder()
      const payload = JSON.stringify({ response: responseText })
      controller.enqueue(enc.encode(`data: ${payload}\n\n`))
      controller.enqueue(enc.encode('data: [DONE]\n\n'))
      controller.close()
    }
  })
  return new Response(stream, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-User-Id': user.sub || 'unknown'
    }
  })
}

// Vision system prompt — kept small. Llama 3.2 vision has a tighter
// context window and rambles less if we don't drown it in metadata.
function buildVisionSystemPrompt(context) {
  const lines = [
    'You are Sidestand, an AI mechanic looking at a photo of a motorcycle part.',
    'Identify what the user is showing you. Be specific — model, brand, function. If the image is unclear, say so and ask for a different angle.'
  ]
  if (context?.bike) {
    const b = context.bike
    lines.push(
      '',
      `Context: this is from a ${[b.year, b.model].filter(Boolean).join(' ') || 'motorcycle'}.`
    )
  }
  return lines.join('\n')
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
// Supabase token verification (via the Auth API)
// ============================================================
//
// Why we don't verify the JWT signature locally: Supabase projects can
// use HS256 (legacy shared-secret) OR ES256 (asymmetric ECC P-256 key
// signing) depending on which version of Supabase Auth they're on.
// Verifying both locally adds significant code (JWKS fetching, key
// caching, signature verification per-alg). It's much simpler to ask
// Supabase itself: "is this token valid?" by calling /auth/v1/user.
//
// The endpoint:
//   GET ${SUPABASE_URL}/auth/v1/user
//   Authorization: Bearer <access_token>
//   apikey: <anon_key>
//
// Returns 200 + user JSON on success, 401 on bad/expired token.

async function verifySupabaseTokenViaApi(token, supabaseUrl, anonKey) {
  const resp = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: anonKey
    }
  })
  if (resp.status === 401) {
    throw new Error('Token rejected by Supabase')
  }
  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(`Supabase auth check failed: ${resp.status} ${text}`)
  }
  const user = await resp.json()
  if (!user?.id) {
    throw new Error('Supabase returned no user id')
  }
  // Match the shape of the previous local-verified payload so the rest
  // of the worker can keep using `user.sub` as the user identifier.
  return { sub: user.id, email: user.email, raw: user }
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

  // Mods — grouped by CATEGORY so the model understands what each
  // mod actually IS, not just what it's called. Without this grouping
  // the model tends to grab any mod whose name mentions a related
  // word (e.g. recommending a "Legends shock" when the user asks
  // about an air filter).
  if (Array.isArray(context.mods) && context.mods.length > 0) {
    const installed = context.mods.filter((m) => m.status === 'installed')
    const planned = context.mods.filter((m) => m.status === 'planned')

    function dumpModsGroupedByCategory(label, list, cap) {
      if (list.length === 0) return
      const byCategory = new Map()
      for (const m of list) {
        const cat = m.category || 'Uncategorized'
        if (!byCategory.has(cat)) byCategory.set(cat, [])
        byCategory.get(cat).push(m)
      }
      lines.push('', `${label} (${list.length}, grouped by system):`)
      let printed = 0
      for (const [cat, mods] of byCategory) {
        lines.push(`  ${cat}:`)
        for (const m of mods) {
          if (printed >= cap) break
          const tail = []
          if (m.brand) tail.push(m.brand)
          if (m.partNumber) tail.push(`PN ${m.partNumber}`)
          lines.push(
            `    - ${m.title || cat}${
              tail.length ? ` (${tail.join(', ')})` : ''
            }`
          )
          printed += 1
        }
        if (printed >= cap) break
      }
    }

    dumpModsGroupedByCategory('INSTALLED MODS', installed, 16)
    dumpModsGroupedByCategory('PLANNED MODS', planned, 10)

    lines.push(
      '',
      'When the user asks about a system (suspension, exhaust, intake, brakes, electrical, etc.), reference ONLY mods from that matching CATEGORY. Do not pattern-match on brand/title alone.'
    )
  }

  // Available manual procedures
  if (Array.isArray(context.availableProcedures) && context.availableProcedures.length > 0) {
    lines.push(
      '',
      `MANUAL PROCEDURES AVAILABLE FOR THIS BIKE (id → title):`
    )
    for (const p of context.availableProcedures.slice(0, 30)) {
      lines.push(`- ${p.id} → ${p.title}`)
    }
    lines.push(
      '',
      'When you reference a procedure FROM THE LIST ABOVE, embed it as [PROC:<id>] using the EXACT id shown to the left of the arrow. The user\'s app turns [PROC:<id>] into a tap-to-open link, so the user can jump straight into the walkthrough. Example: "For your air filter, see [PROC:abc-123-...]."',
      'Critical rules:',
      '- Only use [PROC:<id>] for procedures from the list. NEVER invent procedure IDs.',
      '- Do not wrap [PROC:...] in code formatting or quotes — emit it literally.',
      '- If no listed procedure matches the question, just answer in prose; don\'t fabricate a link.'
    )
  }

  return lines.join('\n')
}
