import { useEffect, useReducer } from 'react'
import { getPrefs, subscribe } from '../data/userPrefs.js'

// useUserPrefs — drop-in hook for any component that displays
// preference-dependent values (mileage, speed, distance, currency,
// dates, etc.). Subscribes to pref changes so the component re-renders
// the moment the rider flips Imperial → Metric (or any other pref) in
// Settings. Returns the current prefs snapshot.
//
// Usage:
//   import { useUserPrefs } from '../hooks/useUserPrefs.js'
//   import { formatMileage } from '../data/userPrefs.js'
//
//   function MyComponent({ bike }) {
//     useUserPrefs() // <- subscribe; the return value is rarely needed
//     return <div>{formatMileage(bike.mileage || 0)}</div>
//   }
//
// CONVENTION: any component calling formatDistance / formatMileage /
// formatSpeed / formatTemperature / formatDate from userPrefs.js
// should call this hook so the user sees changes immediately.

export function useUserPrefs() {
  const [, force] = useReducer((x) => x + 1, 0)
  useEffect(() => {
    const unsub = subscribe(() => force())
    return unsub
  }, [])
  return getPrefs()
}
