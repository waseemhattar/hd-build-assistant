// Sidestand Mechanic — Cloudflare Worker
//
// Powered by Anthropic's Claude Sonnet 4.6 via direct API call. Claude
// handles BOTH text-only and image-bearing turns natively (one model,
// one endpoint), which simplifies the dispatch logic considerably from
// the previous Workers-AI / Llama setup.
//
// One endpoint:
//   POST /chat
//     headers: Authorization: Bearer <supabase-access-token>
//     body: {
//       messages: [{ role, content }, ...],
//       image?: <base64 jpeg, optional>,
//       context: {
//         bike?, recentService?, mods?, availableProcedures?, garage?
//       }
//     }
//     returns: text/event-stream of token chunks (SSE), terminated by `data: [DONE]`
//
// We re-emit Anthropic's SSE events as `data: {"response": token}` so the
// React client's existing token-stream parser works unchanged. (Anthropic's
// native event format is `event: content_block_delta\ndata: {...}` and
// our client only handles single-event SSE.)
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

// Claude Sonnet 4.6 — best balance of quality/cost for our domain.
// Handles text + vision in a single call. No license-acceptance gate
// (unlike Llama 3.2 Vision on Workers AI).
const MODEL = 'claude-sonnet-4-6'

// Soft cap on tokens to keep responses bounded and costs predictable.
// Sonnet 4.6 follows the cap reliably; we don't have to set anything else.
const MAX_TOKENS = 1024

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || ''
    const corsHeaders = buildCorsHeaders(origin)

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
    if (!env.ANTHROPIC_API_KEY) {
      return json(
        {
          error:
            'Worker missing ANTHROPIC_API_KEY. Run `wrangler secret put ANTHROPIC_API_KEY` and paste your Anthropic API key.'
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
    const imageBase64 = typeof body?.image === 'string' ? body.image : null

    if (userMessages.length === 0) {
      return json({ error: 'No messages provided' }, 400, corsHeaders)
    }

    // Trim to last 12 turns. Older history is the first to drop.
    const trimmedHistory = trimHistory(userMessages, 12)

    // ---------- system prompt ----------
    const systemPrompt = buildSystemPrompt(context, Boolean(imageBase64))

    // Convert our internal messages to Anthropic's format. The LAST
    // user message gets the image attached as a content block if the
    // request carried one.
    const anthropicMessages = []
    for (let i = 0; i < trimmedHistory.length; i++) {
      const m = trimmedHistory[i]
      // Skip empty assistant messages that may have streamed in but
      // not yet been finalized client-side (defensive).
      if (!m?.content && !(i === trimmedHistory.length - 1 && imageBase64)) {
        continue
      }
      const role = m.role === 'assistant' ? 'assistant' : 'user'
      const isLast = i === trimmedHistory.length - 1
      if (isLast && role === 'user' && imageBase64) {
        const cleaned = imageBase64.replace(
          /^data:image\/[a-z+]+;base64,/i,
          ''
        )
        anthropicMessages.push({
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: cleaned
              }
            },
            {
              type: 'text',
              text: m.content || 'What is this part? Where is it on the bike, and is anything obviously wrong with it?'
            }
          ]
        })
      } else {
        anthropicMessages.push({ role, content: m.content || '' })
      }
    }

    // Anthropic requires the conversation start with a user message.
    // If the very first item is an assistant turn (shouldn't happen
    // normally, but defensively), drop until we hit a user one.
    while (anthropicMessages[0] && anthropicMessages[0].role !== 'user') {
      anthropicMessages.shift()
    }

    if (anthropicMessages.length === 0) {
      return json(
        { error: 'No valid user messages to send' },
        400,
        corsHeaders
      )
    }

    // ---------- call Anthropic (streaming) ----------
    let resp
    try {
      resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: systemPrompt,
          messages: anthropicMessages,
          stream: true
        })
      })
    } catch (e) {
      console.error('Anthropic fetch failed', e)
      return json(
        { error: `Network error reaching Anthropic: ${e.message || e}` },
        502,
        corsHeaders
      )
    }

    if (!resp.ok || !resp.body) {
      let errBody = ''
      try {
        errBody = await resp.text()
      } catch (_) {}
      console.error('Anthropic non-OK', resp.status, errBody)
      return json(
        {
          error: `Anthropic ${resp.status}: ${errBody.slice(0, 500) || 'no body'}`
        },
        500,
        corsHeaders
      )
    }

    const reformatted = reformatAnthropicStream(resp.body)
    return new Response(reformatted, {
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
}

// ============================================================
// Anthropic SSE → client format
// ============================================================
//
// Anthropic streams events like:
//   event: message_start    \n data: {...}    \n\n
//   event: content_block_delta \n data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}    \n\n
//   ...
//   event: message_stop     \n data: {...}    \n\n
//
// Our React client only knows how to parse `data: {"response": "token"}`
// chunks (the format Workers AI uses). So we walk Anthropic's events,
// pull the text deltas, and re-emit them as the simpler shape. We also
// emit `data: [DONE]` at the end for the client's terminator.

function reformatAnthropicStream(anthropicStream) {
  return new ReadableStream({
    async start(controller) {
      const reader = anthropicStream.getReader()
      const decoder = new TextDecoder()
      const enc = new TextEncoder()
      let buffer = ''
      let closed = false

      function pushEvent(payload) {
        if (closed) return
        controller.enqueue(enc.encode(`data: ${payload}\n\n`))
      }

      try {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          // SSE events are separated by blank lines.
          const events = buffer.split('\n\n')
          buffer = events.pop() || '' // keep the trailing partial chunk

          for (const evt of events) {
            const lines = evt.split('\n')
            let eventType = null
            let dataStr = null
            for (const line of lines) {
              if (line.startsWith('event: ')) eventType = line.slice(7).trim()
              else if (line.startsWith('data:')) {
                dataStr = line.slice(5).replace(/^\s/, '')
              }
            }
            if (!dataStr) continue

            if (eventType === 'content_block_delta') {
              try {
                const parsed = JSON.parse(dataStr)
                const text = parsed?.delta?.text
                if (typeof text === 'string' && text.length > 0) {
                  pushEvent(JSON.stringify({ response: text }))
                }
              } catch (_) {
                /* ignore unparseable */
              }
            } else if (eventType === 'message_stop') {
              pushEvent('[DONE]')
              closed = true
            } else if (eventType === 'error') {
              try {
                const parsed = JSON.parse(dataStr)
                pushEvent(
                  JSON.stringify({
                    response: `\n\n[Anthropic error: ${
                      parsed?.error?.message || 'unknown'
                    }]`
                  })
                )
              } catch (_) {}
            }
          }
        }
      } catch (e) {
        try {
          pushEvent(
            JSON.stringify({ response: `\n\n[Stream interrupted: ${e.message || e}]` })
          )
        } catch (_) {}
      } finally {
        if (!closed) {
          try {
            controller.enqueue(enc.encode('data: [DONE]\n\n'))
          } catch (_) {}
        }
        try {
          controller.close()
        } catch (_) {}
      }
    }
  })
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
  return { sub: user.id, email: user.email, raw: user }
}

// ============================================================
// History trimming
// ============================================================

function trimHistory(messages, maxTurns) {
  if (messages.length <= maxTurns) return messages
  return messages.slice(-maxTurns)
}

// ============================================================
// System prompt builder
// ============================================================
//
// Tight "stay in your lane" rules. Until RAG ships next session, we
// rely on the model's own judgment to admit ignorance — which Sonnet
// 4.6 does much better than Llama. The prompt explicitly:
//   - Limits scope to motorcycle service / mods / diagnostic
//   - Forbids invented torque specs, part numbers, or model-specific
//     mechanical claims that aren't in the user's own data
//   - Promotes "I'm not sure — check your service manual" over guessing
//   - For images: acknowledges the model's uncertainty and asks for
//     more angles when the photo is ambiguous

function buildSystemPrompt(context, hasImage) {
  const lines = [
    'You are Sidestand, an AI mechanic assistant for motorcycle riders.',
    '',
    'Scope:',
    '- ONLY answer questions about motorcycle service, maintenance, mods, parts, riding gear, and diagnostics.',
    "- If asked about anything off-topic (politics, jokes, life advice, other vehicles), redirect: 'I'm a motorcycle mechanic — let's stick to your bike.'",
    '',
    'Style:',
    '- Be concise. 2–4 short paragraphs is plenty.',
    '- Reference the user\'s actual data (mileage, service history, mods) when it matters.',
    '- If the question is ambiguous, ask one clarifying question instead of speculating.',
    '',
    'Honesty:',
    "- If you don't know a specific torque spec, part number, fluid capacity, or service interval for the user's exact bike, SAY YOU DON'T KNOW. Tell them to check their service manual or dealer.",
    '- DO NOT invent torque values, part numbers, or fluid capacities. They will get a rider hurt or wreck a part.',
    '- DO NOT confidently identify a specific brand/model from a photo unless you can clearly see a logo or stamping. Say what you can verify, hedge what you can\'t.',
    "- If the user describes a symptom you've never seen on this exact engine/family, say so and suggest a dealer or experienced wrench.",
    '',
    'Safety:',
    '- Always flag safety concerns before procedure advice (hot exhaust, fuel near sparks, suspension under tension, brake bleeding sequence, etc.).',
    '- Never give torque specs you\'re not sure about. Recommend the manual.',
    ''
  ]

  if (hasImage) {
    lines.push(
      'IMAGE GUIDANCE:',
      '- This message includes a photo. Look at what is actually visible — colors, shapes, fasteners, fluid color, what is NOT in frame.',
      '- Describe what you can see with confidence first. Hedge anything you have to guess at.',
      '- If you see fluid: say what color and consistency. Engine oil is dark amber; primary chaincase oil is amber/red; transmission oil is heavy and amber; brake fluid is clear-to-amber; coolant (where applicable) is colored. Don\'t guess past that.',
      "- For Harley-Davidson specifically: the swing arm is structural and carries no oil. Don't claim a swing-arm oil leak. Common Harley leak points are: rocker covers, primary inspection cover, derby cover, transmission top cover, oil tank fittings, drain plugs, push-rod tubes.",
      ''
    )
  }

  // Selected bike
  if (context.bike) {
    const b = context.bike
    lines.push("USER'S BIKE:")
    if (b.year || b.model) lines.push(`- ${[b.year, b.model].filter(Boolean).join(' ')}`)
    if (b.nickname) lines.push(`- Nickname: ${b.nickname}`)
    if (b.mileage != null) lines.push(`- Mileage: ${b.mileage.toLocaleString()} mi`)
    if (b.vin) lines.push(`- VIN: ${b.vin}`)
    if (b.engineDisplacement) lines.push(`- Engine: ${b.engineDisplacement}`)
  } else if (Array.isArray(context.garage) && context.garage.length > 0) {
    lines.push(`USER OWNS ${context.garage.length} BIKE(S):`)
    for (const b of context.garage.slice(0, 6)) {
      lines.push(
        `- ${[b.year, b.model].filter(Boolean).join(' ')}${
          b.nickname ? ` "${b.nickname}"` : ''
        }${b.mileage != null ? ` (${b.mileage.toLocaleString()} mi)` : ''}`
      )
    }
    lines.push(
      'No specific bike is selected for this conversation; ask which one if relevant.'
    )
  } else {
    lines.push(
      "User hasn't added any bikes yet. If they ask service-specific questions, say so and suggest they add a bike via the Garage tab first."
    )
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

  // Mods grouped by category
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
            `    - ${m.title || cat}${tail.length ? ` (${tail.join(', ')})` : ''}`
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
      'When the user asks about a system (suspension, exhaust, intake, brakes, electrical, etc.), reference ONLY mods from that matching CATEGORY. Do not pattern-match on brand or title alone.'
    )
  }

  // Manual procedures available for this bike
  if (
    Array.isArray(context.availableProcedures) &&
    context.availableProcedures.length > 0
  ) {
    lines.push(
      '',
      `MANUAL PROCEDURES AVAILABLE FOR THIS BIKE (id → title):`
    )
    for (const p of context.availableProcedures.slice(0, 30)) {
      lines.push(`- ${p.id} → ${p.title}`)
    }
    lines.push(
      '',
      'When you reference a procedure FROM THE LIST ABOVE, embed it as [PROC:<id>] using the EXACT id shown to the left of the arrow. The user\'s app turns [PROC:<id>] into a tap-to-open link.',
      '- Only use [PROC:<id>] for procedures from the list. NEVER invent procedure IDs.',
      "- Don't wrap [PROC:...] in code formatting or quotes — emit it literally.",
      "- If no listed procedure matches the question, just answer in prose; don't fabricate a link."
    )
  }

  return lines.join('\n')
}
