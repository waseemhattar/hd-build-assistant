// Handles the one-time migration of un-namespaced localStorage data into
// a per-user namespace when a user signs in.
//
// Before auth, the app stored data under:
//   hd-ba:garage:v1
//   hd-ba:service-log:v1
//
// After auth, storage.js reads/writes per-user keys:
//   hd-ba:<clerkUserId>:garage:v1
//   hd-ba:<clerkUserId>:service-log:v1
//
// On first sign-in from a device that has legacy un-namespaced data AND no
// per-user data yet, we copy the legacy blob into the user's namespace.
// We leave the legacy blob alone so if the user signs out and back in as a
// different account, we don't accidentally hand their bikes to that account.
// After a successful copy we set a marker so this runs exactly once per user
// on this device.
//
// Called from App.jsx once we have a signed-in clerk user id.

const LEGACY_GARAGE = 'hd-ba:garage:v1'
const LEGACY_LOG = 'hd-ba:service-log:v1'

function userKey(userId, key) {
  return `hd-ba:${userId}:${key}`
}

function migrationMarkerKey(userId) {
  return `hd-ba:${userId}:migrated:v1`
}

export function migrateLegacyLocalDataIfNeeded(userId) {
  if (!userId || typeof window === 'undefined') return
  const marker = migrationMarkerKey(userId)
  try {
    if (window.localStorage.getItem(marker)) return // already migrated
    const legacyGarage = window.localStorage.getItem(LEGACY_GARAGE)
    const legacyLog = window.localStorage.getItem(LEGACY_LOG)
    const userGarageKey = userKey(userId, 'garage:v1')
    const userLogKey = userKey(userId, 'service-log:v1')

    const hasUserData =
      window.localStorage.getItem(userGarageKey) ||
      window.localStorage.getItem(userLogKey)

    // Only import if user has no namespaced data yet. If they do, they've
    // been using the app on this device while signed in, so leave them alone.
    if (!hasUserData) {
      if (legacyGarage) window.localStorage.setItem(userGarageKey, legacyGarage)
      if (legacyLog) window.localStorage.setItem(userLogKey, legacyLog)
    }
    window.localStorage.setItem(marker, new Date().toISOString())
  } catch (e) {
    console.error('legacy-data migration failed', e)
  }
}
