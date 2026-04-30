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
  notify()

  if (currentUserId && isSupabaseConfigured()) {
    Promise.resolve()
      .then(() => pullFromServer())
      .catch((e) => console.warn('pullFromServer threw', e))
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
  return read(garageKey(), [])
}

export function getBike(id) {
  return getGarage().find((b) => b.id === id) || null
}

export function addBike(input) {
  const now = new Date().toISOString()
  const bike = {
    id: uid('bike'),
    bikeTypeId: input.bikeTypeId || null,
    year: input.year || null,
    model: input.model || '',
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
  garage[idx] = {
    ...garage[idx],
    ...patch,
    id: garage[idx].id,
    updatedAt: new Date().toISOString()
  }
  write(garageKey(), garage)
  enqueue({ op: 'upsertBike', bike: garage[idx] })
  return garage[idx]
}

export function removeBike(id) {
  addTombstone('bikes', id)
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
  enqueue({ op: 'deleteBike', id })
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
    while (q.length > 0) {
      const op = q[0]
      try {
        await applyOp(supabase, op)
        q.shift()
        writeQueue(q)
      } catch (e) {
        console.warn('sync op failed, will retry', op.op, e?.message || e)
        return // leave the op at the head of the queue, stop flushing
      }
    }
  })()
  try {
    await flushInFlight
  } finally {
    flushInFlight = null
  }
}

async function applyOp(supabase, op) {
  switch (op.op) {
    case 'upsertBike': {
      const b = op.bike
      const row = {
        id: localIdToUuid(b.id),
        user_id: currentUserId,
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
      const { error } = await supabase
        .from('garage_bikes')
        .upsert(row, { onConflict: 'id' })
      if (error) throw error
      return
    }
    case 'deleteBike': {
      const { error } = await supabase
        .from('garage_bikes')
        .delete()
        .eq('id', localIdToUuid(op.id))
      if (error) throw error
      clearTombstone('bikes', op.id)
      return
    }
    case 'upsertEntry': {
      const e = op.entry
      const row = {
        id: localIdToUuid(e.id),
        user_id: currentUserId,
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

async function pullFromServer() {
  if (!isSupabaseConfigured()) return
  if (!currentUserId) return
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return

  const supabase = getSupabaseClient()
  const [
    { data: bikes, error: bErr },
    { data: entries, error: eErr },
    { data: builds, error: buErr },
    { data: mods, error: mErr }
  ] = await Promise.all([
    supabase
      .from('garage_bikes')
      .select('*')
      .order('created_at', { ascending: true }),
    supabase
      .from('service_entries')
      .select('*')
      .order('created_at', { ascending: true }),
    supabase
      .from('bike_builds')
      .select('*')
      .order('created_at', { ascending: true }),
    supabase
      .from('bike_mods')
      .select('*')
      .order('created_at', { ascending: true })
  ])
  if (bErr || eErr || buErr || mErr) {
    console.warn('pull failed', bErr || eErr || buErr || mErr)
    return
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
  const existingBikes = getGarage()
  const mergedBikes = mergeByTranslatedId(localBikes, existingBikes)
  write(garageKey(), mergedBikes)

  const existingEntries = getAllServiceEntries()
  const mergedEntries = mergeByTranslatedId(localEntries, existingEntries)
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
  const mergedBuilds = mergeByTranslatedId(localBuilds, existingBuilds)
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
  const mergedMods = mergeByTranslatedId(localMods, existingMods)
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
  reconcileLocalOnlyWrites(localBikes, localEntries, localBuilds, localMods)

  // Opportunistically drain any queued writes now that we know we're online.
  flushQueue().catch(() => {})
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
// Authority rule: when a row in the local cache has a *uuid* id (meaning
// it was previously accepted by the server), and the server did NOT return
// it in the current pull, and no pending write would re-create it, we drop
// the local copy. This is how the cache learns about rows deleted elsewhere
// (another device, Supabase dashboard, etc.). Local-id rows are never
// dropped — those are unconfirmed writes waiting for the server.
function mergeByTranslatedId(server, local) {
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
      // Server didn't return this row. Two cases:
      //  1. Local row has a uuid id → it was once accepted by the server,
      //     so absence on the server means it was deleted elsewhere.
      //     Drop it, *unless* there's a pending write that would re-create
      //     it (e.g. a queued upsert that hasn't flushed yet).
      //  2. Local row has a local-id → it never made it to the server,
      //     keep it so reconciliation can re-enqueue.
      if (!isLocalId(r.id) && !hasPendingWriteFor(key)) {
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
