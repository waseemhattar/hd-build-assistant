// Supabase client.
//
// Auth is handled by Supabase Auth itself — sign in via signInWithOAuth
// / signInWithPassword on the client, Supabase tracks the session in
// localStorage, and every PostgREST request automatically carries the
// session JWT. RLS policies read auth.uid() server-side.
//
// We construct the client once and re-use it everywhere. The `auth`
// options below tune how the SDK manages the session: it auto-refreshes
// tokens before they expire, persists the session across page reloads,
// and listens for sign-in completion on the OAuth-callback URL.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

let cachedClient = null

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    )
  }
  if (cachedClient) return cachedClient

  cachedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      // Persist the session across page reloads + Capacitor restarts.
      persistSession: true,
      // Refresh the access token before it expires so users don't
      // randomly get logged out.
      autoRefreshToken: true,
      // Detect the OAuth callback URL on page load and complete
      // the sign-in. Required for Google/Apple OAuth to work.
      detectSessionInUrl: true,
      // Use PKCE flow for OAuth — works well with browsers AND
      // Capacitor WebViews (no implicit-flow client-secret problem).
      flowType: 'pkce'
    }
  })

  return cachedClient
}

// Convenience: synchronously read the current session, without async.
// Returns null if not signed in. Useful for non-React code that just
// needs to know "is there a user?".
export function currentSession() {
  if (!cachedClient) return null
  return cachedClient.auth.getSession() // returns Promise<{data:{session}}>
}
