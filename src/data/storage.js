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
// setStorageUser(clerkUserId) right after sign-in.

let currentUserId = null
let getTokenFn = null

export function setStorageUser(userId, getToken) {
  currentUserId = userId || null
  getTokenFn = getToken || null
  // After the user changes, do a full pull so the cache matches the server.
  if (currentUserId && getTokenFn && isSupabaseConfigured()) {
    // Give Clerk a tick to hand out a JWT; the template-scoped token call
    // inside supabaseClient handles retries, but doing it on the next tick
    // avoids a spurious "not authenticated" race during very first render.
    Promise.resolve().then(() => pullFromServer().catch(() => {}))
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
  const garage = getGarage().filter((b) => b.id !== id)
  write(garageKey(), garage)
  // Also drop any service entries for that bike.
  const log = getAllServiceEntries().filter((e) => e.bikeId !== id)
  write(logKey(), log)
  // ON DELETE CASCADE in Postgres handles the service_entries side server-side.
  enqueue({ op: 'deleteBike', id })
}

export function updateBikeMileage(id, mileage) {
  return updateBike(id, { mileage: Number(mileage) || 0 })
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
  const log = getAllServiceEntries().filter((e) => e.id !== entryId)
  write(logKey(), log)
  enqueue({ op: 'deleteEntry', id: entryId })
}

export function findLastService(bikeId, predicate) {
  const log = getServiceLog(bikeId)
  return log.find(predicate) || null
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
  if (!currentUserId || !getTokenFn) return

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
  if (!currentUserId || !getTokenFn) return
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return

  // Avoid overlapping flushes.
  if (flushInFlight) return flushInFlight
  flushInFlight = (async () => {
    const supabase = getSupabaseClient(getTokenFn)
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
  if (!currentUserId || !getTokenFn) return
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return

  const supabase = getSupabaseClient(getTokenFn)
  const [{ data: bikes, error: bErr }, { data: entries, error: eErr }] =
    await Promise.all([
      supabase
        .from('garage_bikes')
        .select('*')
        .order('created_at', { ascending: true }),
      supabase
        .from('service_entries')
        .select('*')
        .order('created_at', { ascending: true })
    ])
  if (bErr || eErr) {
    console.warn('pull failed', bErr || eErr)
    return
  }

  // Build local-shape arrays. We use the server uuid as the local id going
  // forward, which means future writes from this device use the same id.
  const localBikes = (bikes || []).map((r) => ({
    id: r.id,
    bikeTypeId: r.bike_type_id || null,
    year: r.year || null,
    model: r.model || '',
    nickname: r.nickname || '',
    vin: r.vin || '',
    mileage: r.mileage || 0,
    purchaseDate: r.purchase_date || '',
    notes: r.notes || '',
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }))
  const localEntries = (entries || []).map((r) => ({
    id: r.id,
    bikeId: r.bike_id,
    jobId: r.job_id || null,
    title: r.title || '',
    mileage: r.mileage || 0,
    date: r.service_date || '',
    notes: r.notes || '',
    parts: r.parts || '',
    cost: r.cost == null ? null : Number(r.cost),
    createdAt: r.created_at
  }))

  // Merge with any local-only rows that haven't synced yet (they live in the
  // queue). Prefer local copy for any ids present in both, since local is
  // "ahead" of the server until the queue drains.
  const existingBikes = getGarage()
  const mergedBikes = mergeById(localBikes, existingBikes)
  write(garageKey(), mergedBikes)

  const existingEntries = getAllServiceEntries()
  const mergedEntries = mergeById(localEntries, existingEntries)
  write(logKey(), mergedEntries)

  notify()

  // Opportunistically drain any queued writes now that we know we're online.
  flushQueue().catch(() => {})
}

function mergeById(server, local) {
  const byId = new Map(server.map((r) => [r.id, r]))
  for (const r of local) byId.set(r.id, r) // local wins on conflict
  return [...byId.values()]
}

// ---------- online detection ----------
// When the browser comes back online, drain the queue automatically.
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushQueue().catch(() => {})
  })
}
