// Supabase client, wired to use a short-lived Clerk JWT on every request.
//
// How the Clerk ↔ Supabase integration works:
//   1. Clerk has a JWT template named "supabase" that issues a token with
//      `aud: 'authenticated'` and `role: 'authenticated'` claims.
//   2. Supabase is configured (in its dashboard's JWT settings) to trust
//      Clerk's JWKS endpoint, so tokens signed by Clerk validate server-
//      side in Supabase's PostgREST.
//   3. Before every Supabase request, we ask Clerk for a fresh JWT and
//      put it on the Authorization: Bearer <jwt> header. Supabase reads
//      the `sub` claim (the Clerk user id) and RLS policies use it to
//      filter rows per user.
//
// Usage:
//   import { getSupabaseClient } from './supabaseClient'
//   const supabase = await getSupabaseClient(getToken)
//   const { data, error } = await supabase.from('garage_bikes').select()
//
// where `getToken` comes from Clerk's useAuth() hook. We pass it in
// rather than importing Clerk here so this file stays framework-agnostic
// and easier to test.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

let cachedClient = null

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

// Returns a Supabase client that attaches a fresh Clerk JWT on every
// request. `getToken` is Clerk's useAuth().getToken.
//
// We construct the client once (cachedClient) because creating it is
// expensive; the per-request fetch override swaps in a fresh JWT each
// call. Clerk caches tokens internally and only refreshes when the
// cached one is about to expire, so this is safe to call often.
export function getSupabaseClient(getToken) {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    )
  }
  if (cachedClient) return cachedClient

  cachedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      fetch: async (input, init = {}) => {
        // Ask Clerk for a JWT signed with the 'supabase' template.
        // Clerk returns null if no one is signed in.
        let token = null
        try {
          token = await getToken({ template: 'supabase' })
        } catch (e) {
          // Swallow token errors so we don't hard-crash the UI — the request
          // will just fail with an auth error, which the caller can surface.
          console.warn('Clerk getToken failed', e)
        }
        const headers = new Headers(init.headers || {})
        if (token) headers.set('Authorization', `Bearer ${token}`)
        return fetch(input, { ...init, headers })
      }
    },
    // We do auth via Clerk, not Supabase's built-in auth.
    auth: { persistSession: false, autoRefreshToken: false }
  })

  return cachedClient
}
