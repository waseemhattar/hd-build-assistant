// Netlify Edge Function — bike-specific OG tags for /b/<slug>.
//
// Why this exists: link unfurlers (iMessage, Slack, Discord, Twitter,
// WhatsApp, etc.) fetch the static HTML and read <meta> tags before any
// JavaScript runs. A pure SPA can only ever serve the same generic
// preview, so we run this edge function in front of /b/<slug> to
// rewrite the <head> with bike-specific tags before sending the HTML
// down to the unfurler. The React app still mounts and renders normally
// for human visitors — we only touch <head>.
//
// How:
//  1. Match the path /b/<slug> via the [[edge_functions]] config in
//     netlify.toml; everything else falls through to the SPA shell.
//  2. Call Supabase REST directly (no SDK — keeps the function small
//     and avoids cold-start cost). Anon key reads only succeed against
//     rows where is_public = true, per the RLS policies in migration 003.
//  3. Pull the original HTML response from origin, splice in our tags,
//     and return it. If anything fails, fall back to the original HTML
//     so a Supabase outage never breaks the page itself.
//
// This file is TypeScript-flavored JS — Netlify edge functions run on
// Deno, which understands TS natively. We avoid imports so we can keep
// the function as a single self-contained file.

interface PublicBike {
  year?: number | null
  model?: string | null
  nickname?: string | null
  display_name?: string | null
  cover_photo_url?: string | null
  mileage?: number | null
}

export default async (request: Request, context: { next: () => Promise<Response> }): Promise<Response> => {
  const url = new URL(request.url)
  const match = url.pathname.match(/^\/b\/([0-9a-z]{4,32})\/?$/i)
  // No slug in the URL → let the SPA shell handle it. (Shouldn't happen
  // because netlify.toml only routes /b/<slug>* to us, but defend anyway.)
  if (!match) return context.next()

  const slug = match[1]

  // Pull origin HTML in parallel with the Supabase lookup so we don't
  // serialize the latencies. If Supabase fails or 404s, we'll still
  // return the origin HTML (with default tags) so the page works.
  const originPromise = context.next()

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || Deno.env.get('VITE_SUPABASE_URL')
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('VITE_SUPABASE_ANON_KEY')

  let bike: PublicBike | null = null
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      // PostgREST query: select only what we need, filter on the slug
      // and the public flag. RLS will already enforce both, but being
      // explicit means a misconfigured policy still can't leak rows.
      const apiUrl =
        `${SUPABASE_URL}/rest/v1/garage_bikes` +
        `?select=year,model,nickname,display_name,cover_photo_url,mileage` +
        `&public_slug=eq.${encodeURIComponent(slug)}` +
        `&is_public=eq.true` +
        `&limit=1`
      const r = await fetch(apiUrl, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Accept: 'application/json'
        }
      })
      if (r.ok) {
        const rows = (await r.json()) as PublicBike[]
        if (rows.length > 0) bike = rows[0]
      }
    } catch (e) {
      console.warn('og: supabase fetch failed', e)
    }
  }

  const origin = await originPromise
  // Only rewrite text/html responses — assets and JSON pass through.
  const ctype = origin.headers.get('content-type') || ''
  if (!ctype.includes('text/html')) return origin

  let html = await origin.text()

  // If we couldn't load the bike (private/unpublished/error), keep the
  // generic site-wide OG tags. The React app will render its own 404 UI.
  if (!bike) {
    return new Response(html, {
      status: origin.status,
      headers: origin.headers
    })
  }

  const headline =
    bike.nickname || bike.model || (bike.year ? `${bike.year} bike` : 'A custom build')
  const titleSuffix = bike.year ? ` (${bike.year})` : ''
  const ogTitle = `${headline}${titleSuffix} · Sidestand`
  const description = buildDescription(bike)
  const pageUrl = `${url.origin}/b/${slug}`
  const image = bike.cover_photo_url || ''

  // Replace existing OG/twitter tags + <title> with bike-specific ones.
  // The replacement is conservative: we only change tags we recognize,
  // and otherwise inject after the existing block so the static defaults
  // act as fallbacks if anything below is mis-formed.
  html = replaceTitle(html, ogTitle)
  html = replaceMeta(html, 'description', description, /name/)
  html = replaceMeta(html, 'og:title', ogTitle, /property/)
  html = replaceMeta(html, 'og:description', description, /property/)
  html = replaceMeta(html, 'og:url', pageUrl, /property/)
  html = upsertMeta(html, 'og:type', 'article', 'property')
  if (image) {
    html = upsertMeta(html, 'og:image', image, 'property')
    html = replaceMeta(html, 'twitter:card', 'summary_large_image', /name/)
    html = upsertMeta(html, 'twitter:image', image, 'name')
  }
  html = upsertMeta(html, 'twitter:title', ogTitle, 'name')
  html = upsertMeta(html, 'twitter:description', description, 'name')

  // Tell unfurlers we're happy to be cached briefly. Public pages don't
  // change often and any change is already debounced behind a manual
  // unpublish toggle.
  const headers = new Headers(origin.headers)
  headers.set('Cache-Control', 'public, max-age=300, must-revalidate')

  return new Response(html, {
    status: origin.status,
    headers
  })
}

// Build a human-friendly description for the OG card. Cap at ~155 chars,
// which is the rough sweet spot for unfurlers (Twitter truncates at ~200,
// Slack at ~300, but iMessage prefers shorter).
function buildDescription(bike: PublicBike): string {
  const bits: string[] = []
  if (bike.display_name) bits.push(`${bike.display_name}'s`)
  else bits.push('A')
  if (bike.year) bits.push(`${bike.year}`)
  if (bike.model) bits.push(bike.model)
  if (!bike.year && !bike.model) bits.push('motorcycle')
  bits.push('build sheet')
  if (typeof bike.mileage === 'number' && bike.mileage > 0) {
    bits.push(`— ${bike.mileage.toLocaleString()} mi`)
  }
  bits.push('on Sidestand.')
  const out = bits.join(' ')
  return out.length > 155 ? out.slice(0, 152) + '…' : out
}

// Replace <title>...</title> with the new title.
function replaceTitle(html: string, title: string): string {
  const safe = htmlEscape(title)
  if (/<title>[^<]*<\/title>/i.test(html)) {
    return html.replace(/<title>[^<]*<\/title>/i, `<title>${safe}</title>`)
  }
  return html.replace(/<head>/i, `<head>\n    <title>${safe}</title>`)
}

// Replace an existing <meta name|property="X" content="..."> tag with
// new content. attrPattern is a regex that matches "name" or "property"
// — used because OG tags use `property=` while standard ones use `name=`.
function replaceMeta(html: string, key: string, value: string, attrPattern: RegExp): string {
  const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(
    `<meta\\s+[^>]*${attrPattern.source}\\s*=\\s*["']${safeKey}["'][^>]*>`,
    'i'
  )
  if (!re.test(html)) {
    // Tag wasn't there — insert it. attr= picks "property" for og: keys
    // and "name" for everything else. Mirrors the existing index.html.
    const attr = key.startsWith('og:') ? 'property' : 'name'
    return html.replace(
      /<\/head>/i,
      `    <meta ${attr}="${key}" content="${htmlEscape(value)}" />\n  </head>`
    )
  }
  const attr = key.startsWith('og:') ? 'property' : 'name'
  return html.replace(re, `<meta ${attr}="${key}" content="${htmlEscape(value)}" />`)
}

// Insert a meta tag if it isn't already there. Used for tags like
// twitter:image that index.html doesn't ship by default.
function upsertMeta(html: string, key: string, value: string, attr: string): string {
  const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(
    `<meta\\s+[^>]*${attr}\\s*=\\s*["']${safeKey}["'][^>]*>`,
    'i'
  )
  if (re.test(html)) {
    return html.replace(re, `<meta ${attr}="${key}" content="${htmlEscape(value)}" />`)
  }
  return html.replace(
    /<\/head>/i,
    `    <meta ${attr}="${key}" content="${htmlEscape(value)}" />\n  </head>`
  )
}

function htmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
