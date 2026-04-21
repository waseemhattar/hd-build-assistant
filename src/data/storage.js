// Storage repository for Garage + Service Book.
//
// Today this is backed by localStorage so the app works offline with
// zero backend. The API is intentionally shaped like a server client
// (async, single entity per call, id-based) so we can swap in Supabase
// later without rewriting the UI.
//
// Data model:
//   Garage  -> Bike[]           (bikes the user owns)
//   Bike    -> { id, bikeTypeId, year, model, nickname, vin?, mileage,
//                purchaseDate?, notes?, createdAt, updatedAt }
//   Log     -> ServiceEntry[]   (service events, newest first)
//   Entry   -> { id, bikeId, jobId?, title, mileage, date (ISO),
//                notes?, parts?, cost?, createdAt }
//
// bikeTypeId corresponds to an entry in bikes.js (e.g. 'touring-2020').
// jobId corresponds to an entry in jobs.js when the service matches a
// manual procedure. Freeform entries (e.g. "cleaned air filter") just
// leave jobId blank and use `title`.

const GARAGE_KEY = 'hd-ba:garage:v1'
const LOG_KEY = 'hd-ba:service-log:v1'

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

// ---------- Garage ----------

export function getGarage() {
  return read(GARAGE_KEY, [])
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
  write(GARAGE_KEY, garage)
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
  write(GARAGE_KEY, garage)
  return garage[idx]
}

export function removeBike(id) {
  const garage = getGarage().filter((b) => b.id !== id)
  write(GARAGE_KEY, garage)
  // Also drop any service entries for that bike.
  const log = getAllServiceEntries().filter((e) => e.bikeId !== id)
  write(LOG_KEY, log)
}

export function updateBikeMileage(id, mileage) {
  return updateBike(id, { mileage: Number(mileage) || 0 })
}

// ---------- Service log ----------

function getAllServiceEntries() {
  return read(LOG_KEY, [])
}

export function getServiceLog(bikeId) {
  return getAllServiceEntries()
    .filter((e) => e.bikeId === bikeId)
    .sort((a, b) => {
      // Sort by service date desc, then created desc as tiebreaker.
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
  write(LOG_KEY, log)

  // If the service entry includes a mileage that's higher than the bike's
  // current mileage, bump the bike. Keeps the odometer honest with no
  // extra bookkeeping from the user.
  const bike = getBike(bikeId)
  if (bike && entry.mileage > (bike.mileage || 0)) {
    updateBikeMileage(bikeId, entry.mileage)
  }

  return entry
}

export function removeServiceEntry(entryId) {
  const log = getAllServiceEntries().filter((e) => e.id !== entryId)
  write(LOG_KEY, log)
}

// Returns the most recent service entry that matches a given predicate
// (usually "same jobId" or "title contains 'oil'"). Used by the
// maintenance dashboard to answer "when did I last do X?".
export function findLastService(bikeId, predicate) {
  const log = getServiceLog(bikeId)
  return log.find(predicate) || null
}
