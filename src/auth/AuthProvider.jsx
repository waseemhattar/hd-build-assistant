import React, { createContext, useContext, useEffect, useState } from 'react'
import { getSupabaseClient } from '../data/supabaseClient.js'

// AuthProvider — wraps the app and exposes sign-in state via a simple
// context. Replaces Clerk's <ClerkProvider> + useAuth/useUser hooks.
//
// Shape we expose (matches the API we used with Clerk so call sites
// barely change):
//   const { user, session, loading, signOut, isSignedIn } = useAuth()
//
// `user` is the Supabase Auth user object: { id (uuid), email,
// user_metadata, app_metadata, created_at, ... }. `id` is the UUID we
// key all RLS policies and per-user rows on.
//
// On mount: ask Supabase for the existing session (from localStorage
// if previously signed in). Then subscribe to onAuthStateChange so the
// context re-renders the moment a sign-in/out happens — no manual
// refresh needed.

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  isSignedIn: false,
  signOut: async () => {}
})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const supabase = getSupabaseClient()

    // Initial session load (covers page refresh / app restart).
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return
        setSession(data?.session || null)
        setLoading(false)
      })
      .catch((e) => {
        console.warn('[Sidestand] auth.getSession failed', e)
        if (!active) return
        setLoading(false)
      })

    // Live updates — fires on sign-in, sign-out, token refresh.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (!active) return
      setSession(sess || null)
      // Some events (TOKEN_REFRESHED, SIGNED_IN) carry sessions; others
      // (SIGNED_OUT) hand us null. Either way we stop being "loading"
      // once we get an event.
      setLoading(false)
    })

    return () => {
      active = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  async function signOut() {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    // The auth-state-change listener will clear `session` for us.
  }

  const user = session?.user || null
  const value = {
    user,
    session,
    loading,
    isSignedIn: Boolean(user),
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

// Backward-compatible alias matching Clerk's hook name. Lets us swap
// `import { useUser } from '@clerk/clerk-react'` →
// `import { useUser } from '../auth/AuthProvider'` with one-line fixes.
export function useUser() {
  const { user, loading } = useAuth()
  return {
    user: user
      ? {
          // Clerk-shaped fields the app currently reads:
          id: user.id,
          firstName: user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0] || null,
          lastName: user.user_metadata?.last_name || null,
          fullName: user.user_metadata?.full_name || user.user_metadata?.name || null,
          primaryEmailAddress: user.email
            ? { emailAddress: user.email }
            : null,
          imageUrl: user.user_metadata?.avatar_url || null,
          // Pass-through to the raw Supabase user for code that wants it.
          _supabase: user
        }
      : null,
    isLoaded: !loading,
    isSignedIn: Boolean(user)
  }
}
