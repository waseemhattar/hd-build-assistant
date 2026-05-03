// Storage repository for Garage + Service Book.
//
// Architecture: localStorage is a write-through cache in front of Supabase.
//
//   Reads  → synchronous, from localStorage (instant UI, works offline)
//   Writes → synchronous to localStorage, then fire-and-forget to Supabase
//            via a persisted queue. If the network fails or the user is
//            offline, the op stays in the queue and retries when online.
//   Pulls  → on sign-in and periodically, we fetch the server state into
//            localStorage so a user who added a bike on phone A sees it
//            on phone B.
//
// The public API is intentionally identical to the old pure-localStorage
// version (sync getGarage/addBike/etc.) so no component code has to change
// to go from offline-only to cloud-synced. Components can optionally call
// `subscribe(cb)` to be notified when a background pull refreshes the cache.
//
// Data model in localStorage:
//   Garage  -> Bike[]
//   Bike    -> { id, bikeTypeId, year, model, nickname, vin?, mileage,
//                purchaseDate?, notes?, createdAt, updatedAt }
//   Log     -> ServiceEntry[]
//   Entry   -> { id, bikeId, jobId?, title, mileage, date (ISO),
//                notes?, parts?, cost?, createdAt }
//
// bikeTypeId → bikes.js (e.g. 'touring-2020').
// jobId     → jobs.js when the service matches a catalog procedure;
//             freeform entries leave jobId blank and just use `title`.

import {
  isSupabaseConfigured,
  getSupabaseClient
} from './supabaseClient.js'

// ---------- user + key scoping ----------
//
// Each signed-in user gets their own localStorage namespace so two people
// on the same browser don't collide. App.jsx wires this up via
// setStorageUser(supabaseUserId) right after sign-in.
//
// Note: we no longer pass a getToken function in. Supabase Auth manages
// the JWT internally and the supabaseClient gets the token automatically
// for every request. We only need the user id here to scope keys and
// gate writes.

let currentUserId = null

// Tracks the very first pull for the current user so the UI can show
// "Loading your garage…" instead of "0 bikes" while we're waiting for
// Supabase. Flips to false the moment pullFromServer settles.
let initialPullPending = false

export function isInitialPullPending() {
  return initialPullPending
}

// React 18 StrictMode double-invokes mount effects in dev, so App.jsx calls
// us as: setUser(id) → setUser(null) (cleanup) → setUser(id). If we cleared
// state on every null call, the Supabase pull we queued against the real
// user id would race with the null and abort silently. We defer the clear
// by one tick so a quick remount can cancel it.
let pendingClear = 0

export function setStorageUser(userId) {
  if (!userId) {
    pendingClear = pendingClear + 1
    const myToken = pendingClear
    setTimeout(() => {
      if (pendingClear === myToken) {
        currentUserId = null
        initialPullPending = false
        pendingClear = 0
        notify()
      }
    }, 0)
    return
  }

  // New id coming in — cancel any pending clear.
  pendingClear = 0

  const changed = currentUserId !== userId
  if (!changed) return

  currentUserId = userId
  // Mark "loading" before we kick off the pull so any component that
  // reads isInitialPullPending() during this render gets `true`.
  initialPullPending = true
  notify()

  if (currentUserId && isSupabaseConfigured()) {
    Promise.resolve()
      // The first pull after sign-in is ALWAYS a full pull. An
      // incremental pull filters by .gte('updated_at', cursor), and
      // a cursor saved by a previous session can be ahead of any
      // bike whose row is no longer in the local cache (e.g. cache
      // was cleared, or a sync error wiped it). Without forceFull
      // here, those rows stay invisible until pull-to-refresh runs.
      // The cost is one full table read per sign-in — bikes,
      // service_entries, builds, mods all remain small enough that
      // this is sub-100KB across the wire.
      .then(() => pullFromServer({ forceFull: true }))
      .catch((e) => console.warn('pullFromServer threw', e))
      .finally(() => {
        initialPullPending = false
        notify()
      })
  } else {
    // No Supabase configured — nothing to wait for.
    initialPullPending = false
  }
}

function garageKey() {
  return currentUserId
    ? `hd-ba:${currentUserId}:garage:v1`
    : 'hd-ba:garage:v1'
}

function logKey() {
  return currentUserId
    ? `hd-ba:${currentUserId}:service-log:v1`
    : 'hd-ba:service-log:v1'
}

function queueKey() {
  return currentUserId
    ? `hd-ba:${currentUserId}:sync-queue:v1`
    : 'hd-ba:sync-queue:v1'
}

function buildsKey() {
  return currentUserId
    ? `hd-ba:${currentUserId}:builds:v1`
    : 'hd-ba:builds:v1'
}

function modsKey() {
  return currentUserId
    ? `hd-ba:${currentUserId}:mods:v1`
    : 'hd-ba:mods:v1'
}

function jobCardsKey() {
  return currentUserId
    ? `hd-ba:${currentUserId}:jobCards:v1`
    : 'hd-ba:jobCards:v1'
}

function deadLetterKey() {
  return currentUserId
    ? `hd-ba:${currentUserId}:dead-letter:v1`
    : 'hd-ba:dead-letter:v1'
}

// High-water mark per user — the most recent `updated_at` we've seen
// for each synced table, plus a separate cursor for hard-delete
// events captured by the server-side `deletions` log (migration 013).
// Subsequent pulls filter with .gte()/.gt() so we only re-download
// rows that actually changed since the last sign-in or device wake.
// A 5-year power user with thousands of service entries pays the
// full-pull cost ONCE, then ~kilobytes per pull after that.
//
// Cursor schema is versioned. Bump PULL_CURSOR_VERSION when the
// cursor's shape changes (or when a code change requires every
// client to do a one-time full re-pull, e.g. a new column was added
// to a synced table that older cursors don't know to ignore). The
// version is stored on the cursor itself; on read, a mismatched
// version is treated as "no cursor" and the next pull goes full.
const PULL_CURSOR_VERSION = 2

function pullCursorKey() {
  // User-scoped key. Sign-out clears currentUserId; sign-in as a
  // different user gets a different cursor key, so cursors never
  // leak across accounts on a shared device. The version is in the
  // key too so cursors written by an older app version are
  // automatically ignored.
  const u = currentUserId || 'anon'
  return `hd-ba:${u}:pull-cursor:v${PULL_CURSOR_VERSION}`
}

function emptyPullCursor() {
  return {
    version: PULL_CURSOR_VERSION,
    bikes: null,
    entries: null,
    builds: null,
    mods: null,
    deletionsAt: null,
    fullSyncAt: null
  }
}

function readPullCursor() {
  // Defensive: never read a cursor without a real user id, even if
  // some caller invokes us mid-sign-out. Returning an empty cursor
  // forces the next pull to behave like a first pull.
  if (!currentUserId) return emptyPullCursor()
  const c = read(pullCursorKey(), null)
  if (!c || c.version !== PULL_CURSOR_VERSION) return emptyPullCursor()
  return c
}
function writePullCursor(c) {
  // Same guard. Don't persist anonymous cursors — they have nothing
  // useful to save (no auth, no pull) and would only clutter
  // localStorage on shared devices.
  if (!currentUserId) return
  write(pullCursorKey(), c)
}

// Periodic full pull serves as a safety net for any divergence the
// incremental + deletions cursors miss (rare server-side schema
// changes, dropped trigger, manual DB edits). 30 days is far enough
// out that bandwidth is negligible but tight enough that a stale
// device doesn't carry inconsistencies forever. Users can also call
// forceFullPull() to converge on demand.
const FULL_SYNC_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000

// How many times we'll retry a failing sync op before giving up and
// shunting it to the dead-letter queue. Keeps a single bad row from
// blocking every subsequent write for the user (the "poison pill"
// problem). Tuned so transient network/server hiccups still resolve
// before we declare the op permanently broken.
const MAX_SYNC_RETRIES = 5

// User-level brand prefs (e.g. a custom logo URL the user has uploaded).
// Stored locally for now; when we build a real `user_profile` table in
// Supabase later, swap these two functions to talk to it. Call sites
// don't have to change.
function userPrefsKey() {
  return currentUserId
    ? `hd-ba:${currentUserId}:user-prefs:v1`
    : 'hd-ba:user-prefs:v1'
}
export function getUserLogoUrl() {
  const p = read(userPrefsKey(), null)
  return (p && p.logoUrl) || null
}
export function setUserLogoUrl(url) {
  const p = read(userPrefsKey(), null) || {}
  if (url) p.logoUrl = url
  else delete p.logoUrl
  write(userPrefsKey(), p)
}

// Tombstones: remember ids we deleted locally until the server confirms the
// delete. Without these, pullFromServer would happily merge the still-alive
// server row right back into the cache, and the UI shows a "zombie". The
// tombstone is cleared by applyOp once the delete flushes successfully.
function tombstoneKey() {
  return currentUserId
    ? `hd-ba:${currentUserId}:tombstones:v1`
    : 'hd-ba:tombstones:v1'
}

// Tombstones are stored per-table so we only filter the right set when
// merging. Shape: { bikes: { uuid: true }, entries: {...}, builds: {...}, mods: {...} }
function readTombstones() {
  const t = read(tombstoneKey(), null)
  return {
    bikes: (t && t.bikes) || {},
    entries: (t && t.entries) || {},
    builds: (t && t.builds) || {},
    mods: (t && t.mods) || {}
  }
}
function writeTombstones(t) {
  write(tombstoneKey(), t)
}
function addTombstone(kind, id) {
  const t = readTombstones()
  t[kind][localIdToUuid(id)] = true
  writeTombstones(t)
}
function clearTombstone(kind, id) {
  const t = readTombstones()
  delete t[kind][localIdToUuid(id)]
  writeTombstones(t)
}

// ---------- localStorage helpers ----------

function read(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('storage write failed', key, e)
  }
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`
}

// ---------- tiny pub-sub so components can re-render after background pulls ----------

const subscribers = new Set()
export function subscribe(cb) {
  subscribers.add(cb)
  return () => subscribers.delete(cb)
}
function notify() {
  for (const cb of subscribers) {
    try {
      cb()
    } catch (e) {
      console.error('storage subscriber threw', e)
    }
  }
}

// ---------- Garage (sync API, backed by cache + queue) ----------

export function getGarage() {
  const garage = read(garageKey(), [])
  // Silent backfill: any pre-existing bike record without a modelCode
  // (everything saved before this column existed) gets one derived
  // from its model string. Idempotent — once a bike has a code we
  // never touch it again, so this is a no-op on subsequent reads.
  let changed = false
  for (const b of garage) {
    if (!b.modelCode && b.model) {
      const code = deriveModelCode(b.model)
      if (code) {
        b.modelCode = code
        changed = true
      }
    }
  }
  if (changed) write(garageKey(), garage)
  return garage
}

export function getBike(id) {
  return getGarage().find((b) => b.id === id) || null
}

// Pull the leading uppercase token out of a model string, which is
// the canonical Harley model code. "FLHXSE CVO Street Glide" → "FLHXSE".
// Returns '' if no leading uppercase token is found.
export function deriveModelCode(model) {
  if (!model) return ''
  const m = String(model).match(/^([A-Z][A-Z0-9]+)\b/)
  return m ? m[1] : ''
}

// ---------- notifications (migration 016) ----------
//
// Lightweight inbox API. Notifications are persisted server-side; we
// don't cache them locally yet (volume is low and they're useless
// offline anyway — they reference state changes the user needs to
// see fresh). Keep this design intentionally simple until volume
// or latency demands more.

// Fetch up to 50 most recent notifications for the signed-in user,
// optionally filtered to unread. Returns [] on any error so callers
// can `.length`-check without try/catch.
export async function fetchNotifications({ unreadOnly = false } = {}) {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = getSupabaseClient()
    let q = supabase
      .from('notifications')
      .select('id, kind, payload, read_at, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
    if (unreadOnly) q = q.is('read_at', null)
    const { data, error } = await q
    if (error) {
      console.warn('fetchNotifications', error.message || error)
      return []
    }
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchNotifications threw', e?.message || e)
    return []
  }
}

// Mark a single notification as read. Idempotent. RPC writes server-side
// timestamp so all devices observe the same read state on next pull.
export async function markNotificationRead(id) {
  if (!id || !isSupabaseConfigured()) return
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.rpc('mark_notification_read', { p_id: id })
    if (error) console.warn('markNotificationRead', error.message || error)
  } catch (e) {
    console.warn('markNotificationRead threw', e?.message || e)
  }
}

// Privacy-safe VIN pre-flight (migration 015). Returns one of:
//   'available'            — go ahead, you can add this bike
//   'available_to_reclaim' — caller previously archived this VIN; the
//                            upsert path will revive that historic row,
//                            keeping its mods + service entries intact
//   'already_in_garage'    — caller already has this VIN in their garage
//   'owned_by_other'       — another rider has actively claimed this VIN;
//                            caller should NOT add it (no name leaked)
//
// Returns null on any client/network error so the UI can fall back to
// "let the server enforce on submit" rather than blocking on a transient.
export async function checkVinAvailability(vin) {
  if (!vin || !String(vin).trim()) return 'available'
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.rpc(
      'check_vin_availability_safe',
      { p_vin: String(vin).trim() }
    )
    if (error) {
      console.warn('checkVinAvailability rpc error', error.message || error)
      return null
    }
    return typeof data === 'string' ? data : null
  } catch (e) {
    console.warn('checkVinAvailability threw', e?.message || e)
    return null
  }
}

export function addBike(input) {
  const now = new Date().toISOString()
  const bike = {
    id: uid('bike'),
    bikeTypeId: input.bikeTypeId || null,
    year: input.year || null,
    model: input.model || '',
    // modelCode drives manual / procedure scoping. We auto-derive it
    // from the model string but accept an explicit override so the
    // user can fix unusual cases (CVO supplements, prototypes, ...).
    modelCode: (input.modelCode || deriveModelCode(input.model) || '').toUpperCase(),
    nickname: input.nickname || '',
    vin: input.vin || '',
    mileage: Number(input.mileage) || 0,
    purchaseDate: input.purchaseDate || '',
    notes: input.notes || '',
    // Public-share fields (Phase 1 of the public bike pages feature).
    // isPublic gates whether the bike is reachable at /b/<publicSlug>.
    // publicSlug is generated lazily on first publish so private bikes
    // don't reserve random slugs they'll never use.
    isPublic: !!input.isPublic,
    publicSlug: input.publicSlug || '',
    coverPhotoUrl: input.coverPhotoUrl || '',
    displayName: input.displayName || '',
    createdAt: now,
    updatedAt: now
  }
  const garage = getGarage()
  garage.push(bike)
  write(garageKey(), garage)
  enqueue({ op: 'upsertBike', bike })
  return bike
}

export function updateBike(id, patch) {
  const garage = getGarage()
  const idx = garage.findIndex((b) => b.id === id)
  if (idx < 0) return null
  // If the model changed and the caller didn't supply an explicit
  // modelCode in the patch, keep modelCode in sync by re-deriving
  // from the new model string. Explicit modelCode in the patch
  // always wins (handles the "rider knows better than us" override).
  let derivedPatch = patch
  if (
    patch.model != null &&
    patch.model !== garage[idx].model &&
    patch.modelCode == null
  ) {
    derivedPatch = {
      ...patch,
      modelCode: (deriveModelCode(patch.model) || '').toUpperCase()
    }
  } else if (typeof patch.modelCode === 'string') {
    derivedPatch = {
      ...patch,
      modelCode: patch.modelCode.toUpperCase()
    }
  }
  garage[idx] = {
    ...garage[idx],
    ...derivedPatch,
    id: garage[idx].id,
    updatedAt: new Date().toISOString()
  }
  write(garageKey(), garage)
  enqueue({ op: 'upsertBike', bike: garage[idx] })
  return garage[idx]
}

export function removeBike(id) {
  addTombstone('bikes', id)
  const target = getGarage().find((b) => b.id === id)
  const vin = target?.vin || null
  const garage = getGarage().filter((b) => b.id !== id)
  write(garageKey(), garage)
  // Also drop any service entries for that bike.
  const log = getAllServiceEntries().filter((e) => e.bikeId !== id)
  write(logKey(), log)
  // Drop any builds + mods for that bike (mirrors ON DELETE CASCADE in the DB).
  const builds = getAllBuilds().filter((b) => b.bikeId !== id)
  write(buildsKey(), builds)
  const mods = getAllMods().filter((m) => m.bikeId !== id)
  write(modsKey(), mods)
  // ON DELETE CASCADE in Postgres handles the server-side rows.
  // We pass the VIN along so the server-side handler can also scrub
  // any orphan duplicates that share this VIN — protects against a
  // case where a previous (failed) sync left a stray row that would
  // otherwise re-collide on the partial unique-VIN index.
  enqueue({ op: 'deleteBike', id, vin })
}

export function updateBikeMileage(id, mileage) {
  return updateBike(id, { mileage: Number(mileage) || 0 })
}

// ---------- public bike pages ----------
//
// Bikers can publish a build sheet to a shareable URL: /b/<publicSlug>.
// The slug is short, random, and unguessable enough to keep the page
// effectively private until the rider chooses to share the link, but
// not so secret that we treat it as a credential. RLS on the server
// gates reads to is_public = true rows; toggling isPublic off
// effectively unpublishes the page even if the slug leaks later.

// Generates an 8-char slug from a Crockford-ish alphabet (no easily
// confused chars: 0/O, 1/I/L). Collisions on Supabase will surface as
// a unique-constraint error; in practice 32^8 ≈ 1.1e12 keyspace per
// user makes that vanishingly unlikely for one rider's bikes.
function generatePublicSlug() {
  const alphabet = '23456789abcdefghjkmnpqrstuvwxyz'
  let out = ''
  // crypto.getRandomValues is universally available in modern browsers.
  const buf = new Uint8Array(8)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(buf)
  } else {
    for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 256)
  }
  for (let i = 0; i < buf.length; i++) {
    out += alphabet[buf[i] % alphabet.length]
  }
  return out
}

// Toggle a bike's public visibility. On first publish we mint a slug
// (if the bike doesn't already have one). On unpublish we keep the
// slug so re-publishing later restores the same shareable URL — handy
// if someone bookmarks it.
export function setBikePublic(id, isPublic) {
  const bike = getBike(id)
  if (!bike) return null
  const patch = { isPublic: !!isPublic }
  if (isPublic && !bike.publicSlug) {
    patch.publicSlug = generatePublicSlug()
  }
  return updateBike(id, patch)
}

// Uploads a cover photo to Supabase Storage and writes the resulting
// public URL onto the bike row. Path convention matches the storage
// policies in migration 003: `<clerk_user_id>/<bike_uuid>.<ext>` so
// only the owner can write/update/delete the object.
export async function uploadCoverPhoto(bikeId, file) {
  if (!isSupabaseConfigured()) {
    throw new Error('Photo upload requires Supabase to be configured.')
  }
  if (!currentUserId) {
    throw new Error('You must be signed in to upload a photo.')
  }
  if (!file) throw new Error('No file selected.')

  const supabase = getSupabaseClient()
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const bikeUuid = localIdToUuid(bikeId)
  // Cache-bust the URL by including a timestamp in the object name so
  // re-uploads of the same bike's cover photo aren't served stale from
  // any CDN/browser cache.
  const objectPath = `${currentUserId}/${bikeUuid}-${Date.now()}.${ext}`

  const { error: upErr } = await supabase.storage
    .from('bike-photos')
    .upload(objectPath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg'
    })
  if (upErr) throw upErr

  const { data: pub } = supabase.storage
    .from('bike-photos')
    .getPublicUrl(objectPath)
  const url = pub?.publicUrl
  if (!url) throw new Error('Failed to resolve public URL for upload.')

  updateBike(bikeId, { coverPhotoUrl: url })
  return url
}

// Upload a custom brand logo for the current user. Stored in the same
// bike-photos bucket under a `<userId>/logo-<ts>.<ext>` path so we
// reuse the existing public-read storage policy. The resulting URL
// is saved to user prefs and rendered by <Logo imageUrl={...} />.
//
// When we add real shop accounts later, switch the prefs storage to a
// `shops.logo_url` column; the upload path can stay the same.
export async function uploadUserLogo(file) {
  if (!isSupabaseConfigured()) {
    throw new Error('Logo upload requires Supabase to be configured.')
  }
  if (!currentUserId) {
    throw new Error('You must be signed in to upload a logo.')
  }
  if (!file) throw new Error('No file selected.')

  const supabase = getSupabaseClient()
  const ext = (file.name.split('.').pop() || 'png').toLowerCase()
  // Timestamp in the object name forces fresh CDN/browser fetches when
  // the user re-uploads.
  const objectPath = `${currentUserId}/logo-${Date.now()}.${ext}`

  const { error: upErr } = await supabase.storage
    .from('bike-photos')
    .upload(objectPath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/png'
    })
  if (upErr) throw upErr

  const { data: pub } = supabase.storage
    .from('bike-photos')
    .getPublicUrl(objectPath)
  const url = pub?.publicUrl
  if (!url) throw new Error('Failed to resolve public URL for upload.')

  setUserLogoUrl(url)
  notify()
  return url
}

// Reads a published bike + its builds + its mods + public service
// entries by slug. This is the *unauthenticated* path the /b/<slug>
// route uses; anyone hitting RLS without a JWT is treated as anon.
//
// Visibility rules (enforced server-side by RLS, mirrored client-side
// by the .eq() filters below for defense in depth):
//   - garage_bikes: row's is_public must be true (migration 003)
//   - bike_builds: parent bike must be public (migration 003)
//   - bike_mods: parent bike must be public (migration 004 dropped
//     the per-mod is_public requirement)
//   - service_entries: parent bike must be public AND the entry's
//     is_public flag must be true (migration 004; defaults to true)
export async function getPublicBikeBySlug(slug) {
  if (!isSupabaseConfigured()) {
    throw new Error('Public pages require Supabase to be configured.')
  }
  if (!slug) return null

  // Build a fresh anon client — we don't want any Clerk JWT attached,
  // which would scope reads to the signed-in user's rows. Anon reads
  // hit the public-read RLS policies directly.
  const { createClient } = await import('@supabase/supabase-js')
  const url = import.meta.env.VITE_SUPABASE_URL
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY
  const sb = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  const { data: bike, error: bErr } = await sb
    .from('garage_bikes')
    .select(
      'id, bike_type_id, year, model, nickname, mileage, display_name, cover_photo_url, public_slug, is_public, created_at'
    )
    .eq('public_slug', slug)
    .eq('is_public', true)
    .maybeSingle()
  if (bErr) throw bErr
  if (!bike) return null

  const [
    { data: builds, error: buErr },
    { data: mods, error: mErr },
    { data: entries, error: eErr }
  ] = await Promise.all([
    sb
      .from('bike_builds')
      .select('id, title, status, notes, created_at')
      .eq('bike_id', bike.id)
      .order('created_at', { ascending: true }),
    sb
      .from('bike_mods')
      .select(
        'id, build_id, title, category, status, brand, part_number, vendor, install_date, install_mileage, notes, created_at'
      )
      .eq('bike_id', bike.id)
      // Belt-and-braces: RLS post-migration-005 already requires this,
      // but explicit filter keeps the intent obvious in client code and
      // means a misconfigured policy can't leak hidden mods.
      .eq('is_public', true)
      .order('created_at', { ascending: true }),
    sb
      .from('service_entries')
      .select(
        'id, job_id, title, mileage, service_date, notes, parts, created_at'
      )
      .eq('bike_id', bike.id)
      .eq('is_public', true)
      .order('service_date', { ascending: false })
  ])
  if (buErr) throw buErr
  if (mErr) throw mErr
  // service_entries can fail independently if the migration hasn't been
  // run yet — don't blow up the whole page just because of a missing
  // public-read policy. Log and serve the rest.
  if (eErr) console.warn('public service_entries fetch failed', eErr)

  return {
    bike: {
      id: bike.id,
      bikeTypeId: bike.bike_type_id || null,
      year: bike.year || null,
      model: bike.model || '',
      nickname: bike.nickname || '',
      mileage: bike.mileage || 0,
      displayName: bike.display_name || '',
      coverPhotoUrl: bike.cover_photo_url || '',
      publicSlug: bike.public_slug || '',
      createdAt: bike.created_at
    },
    builds: (builds || []).map((r) => ({
      id: r.id,
      title: r.title || '',
      status: r.status || 'planned',
      notes: r.notes || '',
      createdAt: r.created_at
    })),
    mods: (mods || []).map((r) => ({
      id: r.id,
      buildId: r.build_id || null,
      title: r.title || '',
      category: r.category || '',
      status: r.status || 'planned',
      brand: r.brand || '',
      partNumber: r.part_number || '',
      vendor: r.vendor || '',
      installDate: r.install_date || '',
      installMileage:
        r.install_mileage == null ? null : Number(r.install_mileage),
      notes: r.notes || '',
      createdAt: r.created_at
    })),
    serviceEntries: (entries || []).map((r) => ({
      id: r.id,
      jobId: r.job_id || null,
      title: r.title || '',
      mileage: r.mileage || 0,
      date: r.service_date || '',
      notes: r.notes || '',
      parts: r.parts || '',
      createdAt: r.created_at
    }))
  }
}

// ---------- Service log ----------

function getAllServiceEntries() {
  return read(logKey(), [])
}

export function getServiceLog(bikeId) {
  return getAllServiceEntries()
    .filter((e) => e.bikeId === bikeId)
    .sort((a, b) => {
      const ad = a.date || a.createdAt
      const bd = b.date || b.createdAt
      if (ad === bd) return b.createdAt.localeCompare(a.createdAt)
      return bd.localeCompare(ad)
    })
}

export function logService(bikeId, input) {
  const now = new Date().toISOString()
  const entry = {
    id: uid('svc'),
    bikeId,
    jobId: input.jobId || null,
    title: input.title || '',
    mileage: Number(input.mileage) || 0,
    date: input.date || now.slice(0, 10),
    notes: input.notes || '',
    parts: input.parts || '',
    cost: input.cost === '' || input.cost == null ? null : Number(input.cost),
    // Default service entries to public when the bike is published. The
    // server-side RLS still requires the parent bike's is_public to be
    // true, so flipping this on a private bike is a no-op until the
    // bike itself is published.
    isPublic: input.isPublic == null ? true : !!input.isPublic,
    createdAt: now
  }
  const log = getAllServiceEntries()
  log.push(entry)
  write(logKey(), log)
  enqueue({ op: 'upsertEntry', entry })

  // Odometer bump: if this service's mileage is higher than the bike's,
  // roll the bike's mileage forward so we don't have to ask the user twice.
  const bike = getBike(bikeId)
  if (bike && entry.mileage > (bike.mileage || 0)) {
    updateBikeMileage(bikeId, entry.mileage)
  }

  return entry
}

export function removeServiceEntry(entryId) {
  addTombstone('entries', entryId)
  const log = getAllServiceEntries().filter((e) => e.id !== entryId)
  write(logKey(), log)
  enqueue({ op: 'deleteEntry', id: entryId })
}

// Patch fields on an existing service entry. Mirrors updateMod's shape:
// localStorage write is synchronous, the upsert queues to Supabase. The
// main use today is the per-entry isPublic toggle on the public-share
// flow, but it's general-purpose so the editor could call it later.
export function updateServiceEntry(entryId, patch) {
  const log = getAllServiceEntries()
  const idx = log.findIndex((e) => e.id === entryId)
  if (idx < 0) return null
  const before = log[idx]
  const after = {
    ...before,
    ...patch,
    id: before.id
  }
  // Coerce numeric fields if provided in the patch.
  if (patch && 'cost' in patch) {
    after.cost = patch.cost === '' || patch.cost == null ? null : Number(patch.cost)
  }
  if (patch && 'mileage' in patch) {
    after.mileage = Number(patch.mileage) || 0
  }
  log[idx] = after
  write(logKey(), log)
  enqueue({ op: 'upsertEntry', entry: after })
  return after
}

export function findLastService(bikeId, predicate) {
  const log = getServiceLog(bikeId)
  return log.find(predicate) || null
}

// ---------- Builds ----------
//
// A build is a named project that groups related mods (e.g. "Stage 2
// power build"). Builds are optional — mods can exist on a bike without
// belonging to any build.
//
// Build -> { id, bikeId, title, status, isPublic, notes, createdAt, updatedAt }

function getAllBuilds() {
  return read(buildsKey(), [])
}

export function getBuilds(bikeId) {
  return getAllBuilds()
    .filter((b) => b.bikeId === bikeId)
    .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''))
}

export function getBuild(buildId) {
  return getAllBuilds().find((b) => b.id === buildId) || null
}

export function addBuild(bikeId, input) {
  const now = new Date().toISOString()
  const build = {
    id: uid('build'),
    bikeId,
    title: input.title || '',
    status: input.status || 'planned',
    isPublic: !!input.isPublic,
    notes: input.notes || '',
    createdAt: now,
    updatedAt: now
  }
  const all = getAllBuilds()
  all.push(build)
  write(buildsKey(), all)
  enqueue({ op: 'upsertBuild', build })
  return build
}

export function updateBuild(id, patch) {
  const all = getAllBuilds()
  const idx = all.findIndex((b) => b.id === id)
  if (idx < 0) return null
  all[idx] = {
    ...all[idx],
    ...patch,
    id: all[idx].id,
    updatedAt: new Date().toISOString()
  }
  write(buildsKey(), all)
  enqueue({ op: 'upsertBuild', build: all[idx] })
  return all[idx]
}

export function removeBuild(id) {
  addTombstone('builds', id)
  const all = getAllBuilds().filter((b) => b.id !== id)
  write(buildsKey(), all)
  // Detach any mods that pointed at this build — they stay on the bike
  // but lose their build_id. Mirrors the DB's ON DELETE SET NULL.
  const mods = getAllMods().map((m) =>
    m.buildId === id ? { ...m, buildId: null, updatedAt: new Date().toISOString() } : m
  )
  write(modsKey(), mods)
  for (const m of mods) {
    if (m.buildId === null) enqueue({ op: 'upsertMod', mod: m })
  }
  enqueue({ op: 'deleteBuild', id })
}

// ---------- Mods ----------
//
// Mod -> { id, bikeId, buildId?, title, category, status, brand,
//          partNumber?, vendor?, sourceUrl?, cost?, installDate?,
//          installMileage?, removeDate?, notes?, isPublic,
//          createdAt, updatedAt }

function getAllMods() {
  return read(modsKey(), [])
}

export function getMods(bikeId, { buildId } = {}) {
  return getAllMods()
    .filter((m) => m.bikeId === bikeId)
    .filter((m) => (buildId === undefined ? true : m.buildId === buildId))
    .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''))
}

export function getMod(modId) {
  return getAllMods().find((m) => m.id === modId) || null
}

export function addMod(bikeId, input, { alsoLogService = false } = {}) {
  const now = new Date().toISOString()
  const mod = {
    id: uid('mod'),
    bikeId,
    buildId: input.buildId || null,
    title: input.title || '',
    category: input.category || '',
    status: input.status || 'planned',
    brand: input.brand || '',
    partNumber: input.partNumber || '',
    vendor: input.vendor || '',
    sourceUrl: input.sourceUrl || '',
    cost: input.cost === '' || input.cost == null ? null : Number(input.cost),
    installDate: input.installDate || '',
    installMileage:
      input.installMileage === '' || input.installMileage == null
        ? null
        : Number(input.installMileage),
    removeDate: input.removeDate || '',
    notes: input.notes || '',
    // New mods default to public — the rider can flip the per-mod
    // toggle off later if they don't want to share a specific item.
    // Server RLS still requires the parent bike to be is_public for
    // anything to be visible publicly.
    isPublic: input.isPublic == null ? true : !!input.isPublic,
    createdAt: now,
    updatedAt: now
  }
  const all = getAllMods()
  all.push(mod)
  write(modsKey(), all)
  enqueue({ op: 'upsertMod', mod })

  // Opt-in side effect: if the mod is being added already installed AND the
  // caller asked us to log it as a service entry, do so in the same tick.
  if (alsoLogService && mod.status === 'installed') {
    autoLogServiceForMod(mod)
  }

  return mod
}

export function updateMod(id, patch, { alsoLogService = false } = {}) {
  const all = getAllMods()
  const idx = all.findIndex((m) => m.id === id)
  if (idx < 0) return null
  const before = all[idx]
  const after = {
    ...before,
    ...patch,
    id: before.id,
    updatedAt: new Date().toISOString()
  }
  // Coerce cost/mileage if provided in patch (strings from form inputs).
  if (patch && 'cost' in patch) {
    after.cost = patch.cost === '' || patch.cost == null ? null : Number(patch.cost)
  }
  if (patch && 'installMileage' in patch) {
    after.installMileage =
      patch.installMileage === '' || patch.installMileage == null
        ? null
        : Number(patch.installMileage)
  }
  all[idx] = after
  write(modsKey(), all)
  enqueue({ op: 'upsertMod', mod: after })

  // Status flipped to 'installed'? Honor the opt-in checkbox.
  if (
    alsoLogService &&
    before.status !== 'installed' &&
    after.status === 'installed'
  ) {
    autoLogServiceForMod(after)
  }

  return after
}

export function removeMod(id) {
  addTombstone('mods', id)
  const all = getAllMods().filter((m) => m.id !== id)
  write(modsKey(), all)
  enqueue({ op: 'deleteMod', id })
}

// Convenience: compute the running total cost of installed mods on a bike.
// Useful for the Build tab footer and the Bike Report.
export function getModsTotalCost(bikeId, { onlyInstalled = false } = {}) {
  return getMods(bikeId)
    .filter((m) => (onlyInstalled ? m.status === 'installed' : true))
    .reduce((sum, m) => sum + (Number(m.cost) || 0), 0)
}

// Shared auto-log helper. Produces a human-readable service entry so it
// flows into the Service Log + Bike Report naturally.
function autoLogServiceForMod(mod) {
  const brandBit = mod.brand ? `${mod.brand} ` : ''
  const title = `Installed: ${brandBit}${mod.title || mod.category || 'mod'}`
  const parts = [mod.partNumber, mod.brand, mod.vendor]
    .filter(Boolean)
    .join(' · ')
  logService(mod.bikeId, {
    jobId: null,
    title,
    mileage: mod.installMileage || 0,
    date: mod.installDate || new Date().toISOString().slice(0, 10),
    notes: mod.notes || '',
    parts,
    cost: mod.cost
  })
}

// ---------- sync queue ----------
//
// A queue is a persisted list of write operations waiting to be flushed
// to Supabase. Each op is self-contained (has all the data the server
// needs). We drain the queue whenever we're online + authenticated,
// and clear items on success. Failures leave the item in the queue.

function readQueue() {
  return read(queueKey(), [])
}
function writeQueue(q) {
  write(queueKey(), q)
}

function enqueue(op) {
  // No sync required when supabase isn't set up yet (the app still works
  // as a plain localStorage tool).
  if (!isSupabaseConfigured()) return
  if (!currentUserId) return

  const q = readQueue()
  q.push({ ...op, queuedAt: new Date().toISOString() })
  writeQueue(q)
  scheduleFlush()
}

// Debounce flushes so a rapid burst of writes doesn't cause 20 simultaneous
// HTTP requests. This also lets the odometer-bump in logService coalesce
// with the entry write.
let flushTimer = null
function scheduleFlush() {
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    flushTimer = null
    flushQueue().catch(() => {})
  }, 150)
}

let flushInFlight = null
async function flushQueue() {
  if (!isSupabaseConfigured()) return
  if (!currentUserId) return
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return

  // Avoid overlapping flushes.
  if (flushInFlight) return flushInFlight
  flushInFlight = (async () => {
    const supabase = getSupabaseClient()
    let q = readQueue()
    let movedToDLQ = false
    while (q.length > 0) {
      const op = q[0]
      try {
        await applyOp(supabase, op)
        q.shift()
        writeQueue(q)
      } catch (e) {
        // Track per-op retry count + last error so the queue head
        // can age toward the dead-letter rather than block forever.
        const retries = (op.retries || 0) + 1
        const errorMsg = String(e?.message || e || 'unknown')
        op.retries = retries
        op.lastError = errorMsg
        op.lastFailedAt = new Date().toISOString()

        if (retries >= MAX_SYNC_RETRIES) {
          // Poison pill: this op has failed too many times. Move it
          // out of the way so subsequent ops can flush. Surfaced via
          // getDeadLetterQueue() so the UI can show "N writes failed —
          // review" and offer a one-tap retry.
          const dlq = readDeadLetterQueue()
          dlq.push({ ...op, deadLetteredAt: new Date().toISOString() })
          writeDeadLetterQueue(dlq)
          q.shift()
          writeQueue(q)
          movedToDLQ = true
          console.warn(
            `sync op moved to dead-letter after ${retries} failures:`,
            op.op,
            errorMsg
          )
          // Continue to the next op — don't let one bad row stall
          // every subsequent write.
          continue
        }

        // Persist the updated retry count then stop flushing for now.
        // The next scheduleFlush() (kicked by another write or focus
        // event) will pick up where we left off.
        q[0] = op
        writeQueue(q)
        console.warn(
          `sync op failed (${retries}/${MAX_SYNC_RETRIES}), will retry:`,
          op.op,
          errorMsg
        )
        return
      }
    }
    if (movedToDLQ) {
      // Notify subscribers so any UI showing a "sync issues" badge
      // updates.
      notify()
    }
  })()
  try {
    await flushInFlight
  } finally {
    flushInFlight = null
  }
}

// ---------- Dead-letter queue (public API) ----------

function readDeadLetterQueue() {
  return read(deadLetterKey(), [])
}
function writeDeadLetterQueue(q) {
  write(deadLetterKey(), q)
}

// Returns ops that exceeded MAX_SYNC_RETRIES. Each entry has the
// original op shape plus { retries, lastError, lastFailedAt,
// deadLetteredAt } so the UI can show what failed and why. Read-only
// snapshot — mutate via the helpers below.
export function getDeadLetterQueue() {
  return readDeadLetterQueue()
}

// Push a dead-lettered op back onto the main queue so it gets
// retried. We reset the retry counter so the rider's correction
// (e.g. fixed credentials, deleted the duplicate row) gets a fresh
// MAX_SYNC_RETRIES attempts.
export function retryDeadLetterOp(opId) {
  const dlq = readDeadLetterQueue()
  const idx = dlq.findIndex((o) => opIdentity(o) === opId)
  if (idx < 0) return false
  const op = dlq[idx]
  delete op.retries
  delete op.lastError
  delete op.lastFailedAt
  delete op.deadLetteredAt
  const main = readQueue()
  main.push(op)
  writeQueue(main)
  dlq.splice(idx, 1)
  writeDeadLetterQueue(dlq)
  scheduleFlush()
  notify()
  return true
}

// Permanently discard a dead-lettered op. Useful when the rider
// decides the failed write was bogus (e.g. a stale upsert against a
// row they then deleted via another device).
export function discardDeadLetterOp(opId) {
  const dlq = readDeadLetterQueue().filter((o) => opIdentity(o) !== opId)
  writeDeadLetterQueue(dlq)
  notify()
}

// Bulk operations — useful for a "Retry all" / "Clear all" button.
export function retryAllDeadLetterOps() {
  const dlq = readDeadLetterQueue()
  if (dlq.length === 0) return 0
  const main = readQueue()
  for (const op of dlq) {
    delete op.retries
    delete op.lastError
    delete op.lastFailedAt
    delete op.deadLetteredAt
    main.push(op)
  }
  writeQueue(main)
  writeDeadLetterQueue([])
  scheduleFlush()
  notify()
  return dlq.length
}

export function clearDeadLetterQueue() {
  writeDeadLetterQueue([])
  notify()
}

// Stable identity for a queued op. We use the queuedAt timestamp
// (set by enqueue()) which is unique per op even if the op shape
// repeats (e.g. two different upsertBike calls for the same bike).
function opIdentity(op) {
  return op.queuedAt || `${op.op}:${op.id || op.bike?.id || op.entry?.id || ''}`
}

async function applyOp(supabase, op) {
  switch (op.op) {
    case 'upsertBike': {
      const b = op.bike
      const row = {
        id: localIdToUuid(b.id),
        // Old Clerk-shaped column. We keep populating it (with the
        // Supabase UUID now) for backward compat with any code that
        // still reads user_id; new RLS uses auth_user_id below.
        user_id: currentUserId,
        // Supabase Auth user id — what the new RLS policies check
        // against via auth.uid(). Required for inserts.
        auth_user_id: currentUserId,
        bike_type_id: b.bikeTypeId || null,
        year: b.year || null,
        model: b.model || '',
        nickname: b.nickname || '',
        vin: b.vin || '',
        mileage: Number(b.mileage) || 0,
        purchase_date: b.purchaseDate || null,
        notes: b.notes || '',
        // Public-share columns added in migration 003. Older clients pre-
        // dating that migration won't have these on the bike object yet, so
        // we default them defensively.
        is_public: !!b.isPublic,
        public_slug: b.publicSlug || null,
        cover_photo_url: b.coverPhotoUrl || '',
        display_name: b.displayName || '',
        created_at: b.createdAt,
        updated_at: b.updatedAt
      }
      // All bike upserts go through the SECURITY DEFINER RPC
      // `claim_or_revive_bike` (migration 015). It atomically:
      //   - rejects with hint='owned_by_other' if another rider has
      //     this VIN actively claimed
      //   - rejects with hint='already_in_garage' if the caller already
      //     has this VIN under a different id (local cache out of sync)
      //   - revives the caller's previously-archived row for this VIN
      //     (preserving its mods + service history — the per-VIN ledger)
      //   - otherwise upserts by id like a normal write
      //
      // The OLD client-side flow did a destructive "delete-the-dupe-then-
      // retry-insert" pattern on 23505 collisions, which on 2026-05-03
      // wiped a real bike when the retry never landed. Never again.
      const { data: activeId, error } = await supabase.rpc(
        'claim_or_revive_bike',
        { p_bike: row }
      )
      if (error) {
        const hint = String(error.hint || error.details || error.message || '')
        if (hint.includes('owned_by_other')) {
          const e = new Error('VIN_OWNED_BY_OTHER')
          e.code = 'VIN_OWNED_BY_OTHER'
          throw e
        }
        if (hint.includes('already_in_garage')) {
          const e = new Error('VIN_ALREADY_IN_GARAGE')
          e.code = 'VIN_ALREADY_IN_GARAGE'
          throw e
        }
        throw error
      }
      // If the RPC revived a previously-archived row, the active id
      // differs from what the client wrote with. Log it; the next pull
      // brings the canonical row in and the existing localIdToUuid /
      // rewriteLocalParentRefs path reconciles the local cache.
      if (activeId && activeId !== row.id) {
        console.info(
          `[bikes] revived archived row: local ${row.id} → server ${activeId}`
        )
      }
      return
    }
    case 'deleteBike': {
      // Soft-detach via SECURITY DEFINER RPC (migration 015). Sets
      // archived_at = now() server-side and writes a deletions-log
      // row so peers prune their local cache via the existing sync
      // path. The bike's mods + service entries stay attached for
      // the per-VIN ledger; if this rider re-adds the same VIN later,
      // claim_or_revive_bike() reconnects them.
      const { error } = await supabase.rpc('detach_bike', {
        p_id: localIdToUuid(op.id)
      })
      if (error) throw error
      clearTombstone('bikes', op.id)
      return
    }
    case 'upsertEntry': {
      const e = op.entry
      const row = {
        id: localIdToUuid(e.id),
        user_id: currentUserId,
        auth_user_id: currentUserId,
        bike_id: localIdToUuid(e.bikeId),
        job_id: e.jobId || null,
        title: e.title || '',
        mileage: Number(e.mileage) || 0,
        service_date: e.date || null,
        notes: e.notes || '',
        parts: e.parts || '',
        cost: e.cost == null ? null : Number(e.cost),
        // is_public column added in migration 004. Defaults to true on
        // the column so legacy rows surface on public pages once the
        // bike is published.
        is_public: e.isPublic == null ? true : !!e.isPublic,
        created_at: e.createdAt
      }
      const { error } = await supabase
        .from('service_entries')
        .upsert(row, { onConflict: 'id' })
      if (error) throw error
      return
    }
    case 'deleteEntry': {
      const { error } = await supabase
        .from('service_entries')
        .delete()
        .eq('id', localIdToUuid(op.id))
      if (error) throw error
      clearTombstone('entries', op.id)
      return
    }
    case 'upsertBuild': {
      const b = op.build
      const row = {
        id: localIdToUuid(b.id),
        user_id: currentUserId,
        auth_user_id: currentUserId,
        bike_id: localIdToUuid(b.bikeId),
        title: b.title || '',
        status: b.status || 'planned',
        is_public: !!b.isPublic,
        notes: b.notes || '',
        created_at: b.createdAt,
        updated_at: b.updatedAt
      }
      const { error } = await supabase
        .from('bike_builds')
        .upsert(row, { onConflict: 'id' })
      if (error) throw error
      return
    }
    case 'deleteBuild': {
      const { error } = await supabase
        .from('bike_builds')
        .delete()
        .eq('id', localIdToUuid(op.id))
      if (error) throw error
      clearTombstone('builds', op.id)
      return
    }
    case 'upsertMod': {
      const m = op.mod
      const row = {
        id: localIdToUuid(m.id),
        user_id: currentUserId,
        auth_user_id: currentUserId,
        bike_id: localIdToUuid(m.bikeId),
        build_id: m.buildId ? localIdToUuid(m.buildId) : null,
        title: m.title || '',
        category: m.category || '',
        status: m.status || 'planned',
        brand: m.brand || '',
        part_number: m.partNumber || '',
        vendor: m.vendor || '',
        source_url: m.sourceUrl || '',
        cost: m.cost == null ? null : Number(m.cost),
        install_date: m.installDate || null,
        install_mileage:
          m.installMileage == null ? null : Number(m.installMileage),
        remove_date: m.removeDate || null,
        notes: m.notes || '',
        is_public: !!m.isPublic,
        created_at: m.createdAt,
        updated_at: m.updatedAt
      }
      const { error } = await supabase
        .from('bike_mods')
        .upsert(row, { onConflict: 'id' })
      if (error) throw error
      return
    }
    case 'deleteMod': {
      const { error } = await supabase
        .from('bike_mods')
        .delete()
        .eq('id', localIdToUuid(op.id))
      if (error) throw error
      clearTombstone('mods', op.id)
      return
    }
    default:
      console.warn('unknown sync op', op)
  }
}

// ---------- id translation ----------
//
// Local ids look like 'bike_abc123_xyz', but the Postgres schema uses uuids.
// We translate locally — deterministic hash of the local id → uuid v5-ish —
// so the same local id always maps to the same uuid. This lets us do
// upserts safely and also map service entries back to bikes server-side.

function localIdToUuid(localId) {
  // If it already looks like a uuid, pass through.
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      String(localId)
    )
  ) {
    return localId
  }
  // Simple deterministic hash → 32 hex chars → uuid v4-shape (good enough for
  // uniqueness within a single user, and we don't collide across users since
  // user_id is also part of every query).
  const hex = sha1Hex(String(localId)).slice(0, 32)
  return (
    hex.slice(0, 8) +
    '-' +
    hex.slice(8, 12) +
    '-4' +
    hex.slice(13, 16) +
    '-a' +
    hex.slice(17, 20) +
    '-' +
    hex.slice(20, 32)
  )
}

// Small sync sha1. localStorage ids are never secret so we don't need
// Web Crypto; avoiding the async dance keeps the whole write path sync.
function sha1Hex(msg) {
  // djb2-based rolling 128-bit hash is fine here — we only need stability
  // and low collision within one user, not cryptographic strength.
  let h1 = 0x811c9dc5
  let h2 = 0xdeadbeef
  let h3 = 0xcafebabe
  let h4 = 0xfeedface
  for (let i = 0; i < msg.length; i++) {
    const c = msg.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 2654435761)
    h2 = Math.imul(h2 ^ c, 1597334677)
    h3 = Math.imul(h3 ^ c, 1013904223)
    h4 = Math.imul(h4 ^ c, 1664525)
  }
  const hex = (n) => (n >>> 0).toString(16).padStart(8, '0')
  return hex(h1) + hex(h2) + hex(h3) + hex(h4)
}

// ---------- pull from server ----------

async function pullFromServer({ forceFull = false } = {}) {
  if (!isSupabaseConfigured()) return
  if (!currentUserId) return
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return

  const supabase = getSupabaseClient()

  // Resolve the current Supabase auth user. We scope every pull to
  // this user so the public-read RLS policy (which lets ANYONE read
  // is_public=true rows for share links) doesn't leak other users'
  // public bikes into the signed-in user's Garage. Belt-and-braces:
  // RLS narrows server-side, .eq() narrows client-side.
  const { data: authData } = await supabase.auth.getUser()
  const myAuthUserId = authData?.user?.id || null
  if (!myAuthUserId) {
    // Not signed in via Supabase yet — nothing to pull.
    return
  }

  // Decide between incremental and full sync. We do a full pull on:
  //   - First sign-in on this device (no cursor saved yet).
  //   - Explicit forceFull (pull-to-refresh, "Sync now", post-error).
  //   - Stale full-sync timestamp (older than FULL_SYNC_INTERVAL_MS),
  //     so hard deletes on other devices eventually converge here.
  const cursor = readPullCursor()
  const fullSyncAge = cursor.fullSyncAt
    ? Date.now() - new Date(cursor.fullSyncAt).getTime()
    : Infinity
  const isFirstPull = !cursor.fullSyncAt
  const isFullSyncDue = fullSyncAge > FULL_SYNC_INTERVAL_MS
  const wantsFull = forceFull || isFirstPull || isFullSyncDue

  // Build a query with an optional .gte(updated_at, cursor) clause.
  // For incremental pulls this is what shrinks a multi-megabyte
  // payload to a few kilobytes for an active user.
  function tableQuery(tableName, sinceCursor) {
    let q = supabase
      .from(tableName)
      .select('*')
      .eq('auth_user_id', myAuthUserId)
      .order('updated_at', { ascending: true })
    if (!wantsFull && sinceCursor) {
      q = q.gte('updated_at', sinceCursor)
    }
    return q
  }

  // Deletions log query — runs alongside the table queries. We
  // ALWAYS pull deletions incrementally (no full-mode shortcut)
  // because the deletions table only contains delta info; full
  // mode for the row tables already reconciles via row-absence.
  const deletionsQuery = supabase
    .from('deletions')
    .select('table_name, row_id, deleted_at')
    .eq('user_id', myAuthUserId)
    .gt('deleted_at', cursor.deletionsAt || '1970-01-01T00:00:00Z')
    .order('deleted_at', { ascending: true })

  const [
    { data: bikes, error: bErr },
    { data: entries, error: eErr },
    { data: builds, error: buErr },
    { data: mods, error: mErr },
    { data: dels, error: dErr }
  ] = await Promise.all([
    tableQuery('garage_bikes', cursor.bikes),
    tableQuery('service_entries', cursor.entries),
    tableQuery('bike_builds', cursor.builds),
    tableQuery('bike_mods', cursor.mods),
    deletionsQuery
  ])
  if (bErr || eErr || buErr || mErr) {
    console.warn('pull failed', bErr || eErr || buErr || mErr)
    return
  }
  // Deletions log is best-effort: a fresh Supabase project pre-013
  // won't have it. Log + continue — periodic full sync will catch
  // up via row absence.
  if (dErr) {
    console.warn(
      'deletions log unavailable; relying on periodic full sync',
      dErr.message || dErr
    )
  }
  const deletions = Array.isArray(dels) ? dels : []

  // Build "alive" sets per table — server ids the row queries above
  // returned in this same pull. Used to suppress deletions for rows
  // that were "resurrected" (delete trigger fired, then a new row
  // was inserted with the same id soon after — most often by the
  // VIN-collision self-heal in applyOp's upsertBike, which hard-
  // deletes the old row and re-creates it). Without this filter,
  // pruneDeleted would remove the just-merged row from local cache
  // and the rider sees their bike disappear right after it appears.
  const aliveIds = {
    garage_bikes: new Set((bikes || []).map((r) => r.id)),
    service_entries: new Set((entries || []).map((r) => r.id)),
    bike_builds: new Set((builds || []).map((r) => r.id)),
    bike_mods: new Set((mods || []).map((r) => r.id))
  }

  // Index deletions by table for O(1) lookup during local cleanup,
  // skipping any row id that's also in the alive set for that table.
  const deletedIds = {
    garage_bikes: new Set(),
    service_entries: new Set(),
    bike_builds: new Set(),
    bike_mods: new Set()
  }
  for (const d of deletions) {
    const alive = aliveIds[d.table_name]
    if (alive && alive.has(d.row_id)) continue // resurrected — keep it
    if (deletedIds[d.table_name]) deletedIds[d.table_name].add(d.row_id)
  }

  // Suppress server rows that we locally deleted but haven't flushed yet.
  // Without this, merge would happily re-insert a deleted row into the cache
  // (because the local side has no counterpart), resulting in a "zombie".
  // Tombstones are cleared in applyOp once the delete confirms server-side.
  const ts = readTombstones()
  const sieve = (rows, kind) =>
    (rows || []).filter((r) => !ts[kind][localIdToUuid(r.id)])
  const filteredBikes = sieve(bikes, 'bikes')
  const filteredEntries = sieve(entries, 'entries')
  const filteredBuilds = sieve(builds, 'builds')
  const filteredMods = sieve(mods, 'mods')

  // Build local-shape arrays. We use the server uuid as the local id going
  // forward, which means future writes from this device use the same id.
  const localBikes = filteredBikes.map((r) => ({
    id: r.id,
    bikeTypeId: r.bike_type_id || null,
    year: r.year || null,
    model: r.model || '',
    nickname: r.nickname || '',
    vin: r.vin || '',
    mileage: r.mileage || 0,
    purchaseDate: r.purchase_date || '',
    notes: r.notes || '',
    isPublic: !!r.is_public,
    publicSlug: r.public_slug || '',
    coverPhotoUrl: r.cover_photo_url || '',
    displayName: r.display_name || '',
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }))
  const localEntries = filteredEntries.map((r) => ({
    id: r.id,
    bikeId: r.bike_id,
    jobId: r.job_id || null,
    title: r.title || '',
    mileage: r.mileage || 0,
    date: r.service_date || '',
    notes: r.notes || '',
    parts: r.parts || '',
    cost: r.cost == null ? null : Number(r.cost),
    // is_public defaults to true server-side; respect explicit false.
    isPublic: r.is_public == null ? true : !!r.is_public,
    createdAt: r.created_at
  }))

  // Merge with any local-only rows that haven't synced yet. We index by the
  // *translated* uuid (localIdToUuid) so a local-id row and its server copy
  // collapse into one entry instead of showing as duplicates. Local rows
  // still "win" on conflict so the queue's in-flight writes aren't clobbered.
  //
  // `wantsFull` is passed through so the merge knows whether absence on the
  // server means "deleted" (full pull saw the whole table) or "unchanged
  // since cursor" (incremental pull only fetched .gte(updated_at)). Without
  // this, an incremental pull would drop every uuid-id row that didn't
  // happen to be updated in the cursor window.
  const existingBikes = getGarage()
  const mergedBikes = mergeByTranslatedId(localBikes, existingBikes, wantsFull)
  write(garageKey(), mergedBikes)

  const existingEntries = getAllServiceEntries()
  const mergedEntries = mergeByTranslatedId(localEntries, existingEntries, wantsFull)
  write(logKey(), mergedEntries)

  const localBuilds = filteredBuilds.map((r) => ({
    id: r.id,
    bikeId: r.bike_id,
    title: r.title || '',
    status: r.status || 'planned',
    isPublic: !!r.is_public,
    notes: r.notes || '',
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }))
  const existingBuilds = getAllBuilds()
  const mergedBuilds = mergeByTranslatedId(localBuilds, existingBuilds, wantsFull)
  write(buildsKey(), mergedBuilds)

  const localMods = filteredMods.map((r) => ({
    id: r.id,
    bikeId: r.bike_id,
    buildId: r.build_id || null,
    title: r.title || '',
    category: r.category || '',
    status: r.status || 'planned',
    brand: r.brand || '',
    partNumber: r.part_number || '',
    vendor: r.vendor || '',
    sourceUrl: r.source_url || '',
    cost: r.cost == null ? null : Number(r.cost),
    installDate: r.install_date || '',
    installMileage: r.install_mileage == null ? null : Number(r.install_mileage),
    removeDate: r.remove_date || '',
    notes: r.notes || '',
    isPublic: !!r.is_public,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }))
  const existingMods = getAllMods()
  const mergedMods = mergeByTranslatedId(localMods, existingMods, wantsFull)
  write(modsKey(), mergedMods)

  // Self-heal step 1: if any child rows (mods/builds/entries) reference a
  // parent by its local-id, but that parent is now known on the server by
  // its deterministic uuid, rewrite the child's parent reference in place.
  // This unblocks FK-bound upserts that would otherwise loop-fail on flush.
  rewriteLocalParentRefs(localBikes, localBuilds)

  notify()

  // Self-heal step 2: any local-id rows in the cache that weren't also
  // returned from the server probably never synced (eg. written during a
  // window where Supabase env vars weren't configured). Re-enqueue them now
  // so the next flushQueue picks them up. rewriteLocalParentRefs ran first
  // so their parent references are already healed.
  // Note: the `local*` arrays above hold the server-returned rows after
  // snake_case→camelCase mapping, which is what this function needs.
  //
  // Skip this step on incremental pulls — the server-returned set is
  // intentionally narrow (only rows changed since the cursor), so any
  // "missing" local-only rows would all look like un-synced writes
  // and we'd noisily re-enqueue everything the user already has on
  // the server. Reconciliation is a full-sync responsibility.
  if (wantsFull) {
    reconcileLocalOnlyWrites(localBikes, localEntries, localBuilds, localMods)
  }

  // Apply the deletions log: rows that were hard-deleted on another
  // device. We remove them from the local cache so the next render
  // doesn't show stale entries. The merge functions above can't see
  // these because the rows are gone server-side and never come back
  // in the row-table queries.
  function pruneDeleted(rows, idSet, kind) {
    if (idSet.size === 0) return rows
    const before = rows.length
    const next = rows.filter((r) => !idSet.has(localIdToUuid(r.id)))
    if (next.length !== before) {
      console.info(
        `applied ${before - next.length} server-side deletion(s) to ${kind}`
      )
    }
    return next
  }
  if (deletedIds.garage_bikes.size > 0) {
    write(garageKey(), pruneDeleted(getGarage(), deletedIds.garage_bikes, 'bikes'))
  }
  if (deletedIds.service_entries.size > 0) {
    write(
      logKey(),
      pruneDeleted(getAllServiceEntries(), deletedIds.service_entries, 'entries')
    )
  }
  if (deletedIds.bike_builds.size > 0) {
    write(
      buildsKey(),
      pruneDeleted(getAllBuilds(), deletedIds.bike_builds, 'builds')
    )
  }
  if (deletedIds.bike_mods.size > 0) {
    write(modsKey(), pruneDeleted(getAllMods(), deletedIds.bike_mods, 'mods'))
  }

  // Advance the high-water mark per table to the latest updated_at we
  // saw in the response. We do NOT advance to "now" because clock skew
  // between the device and server could swallow a row written during
  // the pull window. Taking the row-level max means the next pull's
  // .gte() catches everything we haven't already merged.
  function maxTimestamp(rows, field, current) {
    let max = current || ''
    for (const r of rows || []) {
      const t = r[field] || ''
      if (t > max) max = t
    }
    return max || current
  }
  cursor.bikes = maxTimestamp(filteredBikes, 'updated_at', cursor.bikes)
  cursor.entries = maxTimestamp(filteredEntries, 'updated_at', cursor.entries)
  cursor.builds = maxTimestamp(filteredBuilds, 'updated_at', cursor.builds)
  cursor.mods = maxTimestamp(filteredMods, 'updated_at', cursor.mods)
  cursor.deletionsAt = maxTimestamp(deletions, 'deleted_at', cursor.deletionsAt)
  if (wantsFull) cursor.fullSyncAt = new Date().toISOString()
  writePullCursor(cursor)

  // Opportunistically drain any queued writes now that we know we're online.
  flushQueue().catch(() => {})
}

// Public helper for the UI: forces a full reconciliation pull. Use
// this on a "Sync now" button or after the user resolves dead-letter
// ops, so deletions on other devices propagate immediately instead
// of waiting up to FULL_SYNC_INTERVAL_MS.
export async function forceFullPull() {
  return pullFromServer({ forceFull: true })
}

// Rewrites parent references on local cache rows when we can prove the
// parent is now a known-on-server uuid. Example of the bug this fixes:
//   1. Device A adds bike (localId = 'bike_foo') → server upserts with
//      uuid = localIdToUuid('bike_foo'). Cache still holds the local id
//      until the next pullFromServer, which swaps it to the uuid.
//   2. Before the pull lands, the user adds a mod on Device A. The mod
//      is written with bikeId = 'bike_foo' (the local id).
//   3. Pull runs, bike rewrites to uuid, but the mod still points at
//      'bike_foo'. Its upsert FK-fails forever and the Build tab filter
//      (which uses the uuid) hides the mod from the UI.
// Fix: for each mod/build/entry with a non-uuid parent id, if that
// parent's translated uuid is in the set of server-known uuids, swap
// the child's parent reference to the uuid. Safe: localIdToUuid is
// deterministic, so the uuid equivalence is exact, not fuzzy.
function rewriteLocalParentRefs(serverBikes, serverBuilds) {
  const knownBikeUuids = new Set((serverBikes || []).map((b) => b.id))
  const knownBuildUuids = new Set((serverBuilds || []).map((b) => b.id))

  const canPromote = (parentId, knownSet) => {
    if (!parentId) return null
    if (!isLocalId(parentId)) return null
    const uuid = localIdToUuid(parentId)
    return knownSet.has(uuid) ? uuid : null
  }

  let modsRewritten = 0
  const mods = getAllMods().map((m) => {
    let next = m
    const newBikeId = canPromote(m.bikeId, knownBikeUuids)
    if (newBikeId) next = { ...next, bikeId: newBikeId }
    const newBuildId = canPromote(m.buildId, knownBuildUuids)
    if (newBuildId) next = { ...next, buildId: newBuildId }
    if (next !== m) modsRewritten++
    return next
  })
  if (modsRewritten > 0) write(modsKey(), mods)

  let buildsRewritten = 0
  const builds = getAllBuilds().map((b) => {
    const newBikeId = canPromote(b.bikeId, knownBikeUuids)
    if (!newBikeId) return b
    buildsRewritten++
    return { ...b, bikeId: newBikeId }
  })
  if (buildsRewritten > 0) write(buildsKey(), builds)

  let entriesRewritten = 0
  const entries = getAllServiceEntries().map((e) => {
    const newBikeId = canPromote(e.bikeId, knownBikeUuids)
    if (!newBikeId) return e
    entriesRewritten++
    return { ...e, bikeId: newBikeId }
  })
  if (entriesRewritten > 0) write(logKey(), entries)

  const total = modsRewritten + buildsRewritten + entriesRewritten
  if (total > 0) {
    console.info(
      '[storage] rewrote',
      total,
      'local parent refs to server uuids',
      { mods: modsRewritten, builds: buildsRewritten, entries: entriesRewritten }
    )
  }
}

// Walks the cache vs the set of rows we just pulled from the server and
// re-enqueues any local-id rows that the server didn't return. Safe to
// call repeatedly — enqueue is idempotent at the op level (upserts on
// the translated uuid) and we only re-queue rows that look local-only.
function reconcileLocalOnlyWrites(serverBikes, serverEntries, serverBuilds, serverMods) {
  if (!currentUserId || !isSupabaseConfigured()) return

  // Fast lookup of everything the server already knows about. We compare
  // against *translated* uuids so a local-id row counts as "known" only
  // if its uuid is in the server set.
  const known = new Set()
  for (const r of serverBikes) known.add(localIdToUuid(r.id))
  for (const r of serverEntries) known.add(localIdToUuid(r.id))
  for (const r of serverBuilds) known.add(localIdToUuid(r.id))
  for (const r of serverMods) known.add(localIdToUuid(r.id))

  let added = 0
  const tryEnqueue = (op) => {
    enqueue(op)
    added++
  }

  for (const b of getGarage()) {
    if (!isLocalId(b.id)) continue
    if (known.has(localIdToUuid(b.id))) continue
    tryEnqueue({ op: 'upsertBike', bike: b })
  }
  for (const e of getAllServiceEntries()) {
    if (!isLocalId(e.id)) continue
    if (known.has(localIdToUuid(e.id))) continue
    tryEnqueue({ op: 'upsertEntry', entry: e })
  }
  for (const b of getAllBuilds()) {
    if (!isLocalId(b.id)) continue
    if (known.has(localIdToUuid(b.id))) continue
    tryEnqueue({ op: 'upsertBuild', build: b })
  }
  for (const m of getAllMods()) {
    if (!isLocalId(m.id)) continue
    if (known.has(localIdToUuid(m.id))) continue
    tryEnqueue({ op: 'upsertMod', mod: m })
  }

  if (added > 0) {
    console.info('[storage] reconciled', added, 'local-only rows back into sync queue')
  }
}

function isLocalId(id) {
  // Anything that isn't a uuid is a local id (eg. 'bike_xyz_abc').
  return !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    String(id)
  )
}

function mergeById(server, local) {
  const byId = new Map(server.map((r) => [r.id, r]))
  for (const r of local) byId.set(r.id, r) // local wins on conflict
  return [...byId.values()]
}

// Detects pending writes in the queue for a given row's uuid. Used so we
// don't accidentally drop a local row that hasn't finished uploading yet
// just because the server doesn't know about it yet.
function hasPendingWriteFor(uuid) {
  const q = readQueue()
  for (const op of q) {
    if (op.op === 'upsertBike' && localIdToUuid(op.bike?.id) === uuid) return true
    if (op.op === 'upsertEntry' && localIdToUuid(op.entry?.id) === uuid) return true
    if (op.op === 'upsertBuild' && localIdToUuid(op.build?.id) === uuid) return true
    if (op.op === 'upsertMod' && localIdToUuid(op.mod?.id) === uuid) return true
  }
  return false
}

// Index by the uuid a row *would sync as* so a local-id row and the server
// row it came from don't both survive the merge. Server rows come with their
// uuid id; local-id rows get matched against the server's uuid of the same
// underlying item.
//
// Conflict rule: local fields win (so unflushed edits aren't clobbered by a
// stale server copy), but the *id* is always promoted to the server's uuid
// once the server knows about the row. This is the key to ever getting a
// local-id row upgraded to its uuid form — without it, the cache would hold
// the local-id forever and any children of that row (mods pointing at a
// bike's bikeId, etc.) stay misaligned with the server indefinitely.
//
// Authority rule (FULL pulls only): when a row in the local cache has a
// *uuid* id (meaning it was previously accepted by the server), and the
// server did NOT return it in the current pull, and no pending write would
// re-create it, we drop the local copy. This is how the cache learns about
// rows deleted elsewhere (another device, Supabase dashboard, etc.) when
// the deletions log is unavailable. Local-id rows are never dropped —
// those are unconfirmed writes waiting for the server.
//
// On INCREMENTAL pulls (`isFullPull = false`), absence on the server only
// means "row hasn't changed since the cursor", NOT "row was deleted". We
// must NOT drop in that case — deletions on incremental pulls are handled
// authoritatively by the deletions log (pruneDeleted in pullFromServer).
// Dropping here would silently delete every untouched row from the cache
// on every focus/visibility-driven pull.
function mergeByTranslatedId(server, local, isFullPull = false) {
  const byKey = new Map()
  for (const r of server) byKey.set(localIdToUuid(r.id), r)
  for (const r of local) {
    const key = localIdToUuid(r.id)
    const serverRow = byKey.get(key)
    if (serverRow && serverRow.id !== r.id) {
      // Server knows this row under its uuid; adopt the uuid but keep our
      // local fields (which may contain unflushed edits).
      byKey.set(key, { ...r, id: serverRow.id })
    } else if (serverRow) {
      // Same id, server and local agree the row exists. Local fields win
      // (preserves unflushed edits).
      byKey.set(key, r)
    } else {
      // Server didn't return this row. Behavior depends on pull mode:
      //  - Full pull: absence is authoritative. Drop uuid-id rows with no
      //    pending write (deleted elsewhere). Keep local-id rows so
      //    reconciliation can re-enqueue them.
      //  - Incremental pull: absence just means "unchanged since cursor".
      //    Always keep the local row. Real deletions arrive via the
      //    deletions log and are applied by pruneDeleted().
      if (isFullPull && !isLocalId(r.id) && !hasPendingWriteFor(key)) {
        // Drop. Don't add to byKey.
        continue
      }
      byKey.set(key, r)
    }
  }
  return [...byKey.values()]
}

// ---------- online detection ----------
// When the browser comes back online, drain the queue automatically.
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushQueue().catch(() => {})
  })

  // When the tab regains focus (user switched back from another device/tab),
  // re-pull so we catch up with writes made elsewhere. Also drain any local
  // writes that didn't make it out earlier.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      pullFromServer().catch(() => {})
      flushQueue().catch(() => {})
    }
  })
  window.addEventListener('focus', () => {
    pullFromServer().catch(() => {})
    flushQueue().catch(() => {})
  })
}


// ---------- Job cards (per-bike planning lists) ----------
//
// A job card groups multiple procedures the rider plans to tackle as
// a single shop visit (e.g. "Spring service: oil + brakes + air filter").
// Cards live per-bike. When the rider runs a card, each procedure
// gets walked through in sequence, and the whole job lands as ONE
// combined service-log entry.
//
// Storage shape:
//   {
//     id, bikeId, title, notes,
//     status: 'draft' | 'in-progress' | 'complete',
//     procedures: [
//       { id, procedureId, pairId?, direction, title, doneAt, sortOrder }
//     ],
//     createdAt, updatedAt, completedAt
//   }
//
// Local-only for now (matches builds/mods); Supabase sync can be
// layered on later without touching call sites.

export function getAllJobCards() {
  return read(jobCardsKey(), [])
}

export function getJobCards(bikeId) {
  if (!bikeId) return []
  return read(jobCardsKey(), [])
    .filter((c) => c.bikeId === bikeId)
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
}

export function getJobCard(id) {
  return read(jobCardsKey(), []).find((c) => c.id === id) || null
}

export function addJobCard(bikeId, input = {}) {
  const now = new Date().toISOString()
  const card = {
    id: uid('jc'),
    bikeId,
    title: (input.title || 'New job').trim(),
    notes: input.notes || '',
    status: 'draft',
    procedures: [],
    createdAt: now,
    updatedAt: now,
    completedAt: null
  }
  const all = read(jobCardsKey(), [])
  all.push(card)
  write(jobCardsKey(), all)
  return card
}

export function updateJobCard(id, patch) {
  const all = read(jobCardsKey(), [])
  const idx = all.findIndex((c) => c.id === id)
  if (idx < 0) return null
  all[idx] = {
    ...all[idx],
    ...patch,
    id: all[idx].id,
    bikeId: all[idx].bikeId, // bikeId is immutable
    updatedAt: new Date().toISOString()
  }
  write(jobCardsKey(), all)
  return all[idx]
}

export function removeJobCard(id) {
  const all = read(jobCardsKey(), []).filter((c) => c.id !== id)
  write(jobCardsKey(), all)
}

// Adds a procedure to a card. `procRef` shape:
//   { procedureId, pairId?, direction?, title }
// `direction` is 'remove' | 'install' | null. For paired procedures
// the caller passes both halves as separate calls (sortOrder reflects
// the order the rider added them).
export function addProcedureToJobCard(cardId, procRef) {
  const card = getJobCard(cardId)
  if (!card) return null
  const item = {
    id: uid('jcp'),
    procedureId: procRef.procedureId,
    pairId: procRef.pairId || null,
    direction: procRef.direction || null,
    title: procRef.title || '',
    doneAt: null,
    sortOrder: card.procedures.length
  }
  return updateJobCard(cardId, {
    procedures: [...card.procedures, item]
  })
}

export function removeProcedureFromJobCard(cardId, itemId) {
  const card = getJobCard(cardId)
  if (!card) return null
  const procedures = card.procedures
    .filter((p) => p.id !== itemId)
    .map((p, i) => ({ ...p, sortOrder: i }))
  return updateJobCard(cardId, { procedures })
}

export function setJobCardProcedureDone(cardId, itemId, isDone = true) {
  const card = getJobCard(cardId)
  if (!card) return null
  const procedures = card.procedures.map((p) =>
    p.id === itemId
      ? { ...p, doneAt: isDone ? new Date().toISOString() : null }
      : p
  )
  return updateJobCard(cardId, { procedures })
}

export function reorderJobCardProcedures(cardId, orderedIds) {
  const card = getJobCard(cardId)
  if (!card) return null
  const byId = new Map(card.procedures.map((p) => [p.id, p]))
  const procedures = orderedIds
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((p, i) => ({ ...p, sortOrder: i }))
  return updateJobCard(cardId, { procedures })
}

export function markJobCardComplete(id) {
  return updateJobCard(id, {
    status: 'complete',
    completedAt: new Date().toISOString()
  })
}
