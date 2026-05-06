// Harley-Davidson recommended service intervals.
//
// These are used ONLY as a reference on the Service Book dashboard.
// The app does not enforce them, nag the user, or block anything if a
// bike is "overdue". The goal is: "here's what HD suggests, you decide".
//
// Source: 2020 HD Touring Service Manual, Chapter 1 (Maintenance
// Schedule). The full matrix in the manual is dense; this captures the
// items that most riders track. Riders can log anything else freeform.
//
// `mileageInterval` is the recurring interval in miles.
// `firstDue` is the first scheduled mileage (often matches the interval
//   but sometimes there's a first-service milestone at 1,000 mi).
// `match` is a case-insensitive substring search over service-log entry
//   titles AND against jobs.js titles, so a logged oil change counts
//   whether the user picked a manual job or just typed "oil change".

export const intervals = [
  {
    id: 'first-service',
    label: 'First Service (1,000 mi break-in)',
    description: 'Initial service: oil & filter, fastener check, road test.',
    firstDue: 1000,
    mileageInterval: null, // one-time
    match: ['first service', 'break-in', 'initial service']
  },
  {
    id: 'engine-oil-filter',
    label: 'Engine oil & filter',
    description: 'Change engine oil and filter.',
    firstDue: 5000,
    mileageInterval: 5000,
    match: ['engine oil', 'oil change', 'oil and filter', 'oil & filter']
  },
  {
    id: 'primary-fluid',
    label: 'Primary chaincase lubricant',
    description: 'Change primary chaincase lubricant.',
    firstDue: 20000,
    mileageInterval: 20000,
    match: ['primary chaincase', 'primary fluid', 'primary lubricant']
  },
  {
    id: 'trans-fluid',
    label: 'Transmission lubricant',
    description: 'Change transmission lubricant.',
    firstDue: 20000,
    mileageInterval: 20000,
    match: ['transmission lubricant', 'transmission fluid', 'transmission oil']
  },
  {
    id: 'brake-fluid',
    label: 'Brake fluid',
    description: 'Change brake fluid (front and rear).',
    firstDue: 24000,
    mileageInterval: 24000,
    match: ['brake fluid']
  },
  {
    id: 'air-filter',
    label: 'Air cleaner element',
    description: 'Inspect; replace as needed.',
    firstDue: 25000,
    mileageInterval: 25000,
    match: ['air cleaner', 'air filter']
  },
  {
    id: 'spark-plugs',
    label: 'Spark plugs',
    description: 'Replace spark plugs.',
    firstDue: 25000,
    mileageInterval: 25000,
    match: ['spark plug']
  },
  {
    id: 'clutch-adjust',
    label: 'Clutch adjustment',
    description: 'Inspect and adjust clutch.',
    firstDue: 5000,
    mileageInterval: 10000,
    match: ['clutch adjust', 'clutch inspection']
  },
  {
    id: 'drive-belt',
    label: 'Drive belt & sprockets',
    description: 'Inspect drive belt and sprockets for wear.',
    firstDue: 10000,
    mileageInterval: 10000,
    match: ['drive belt', 'rear belt']
  },
  {
    id: 'tires',
    label: 'Tires',
    description: 'Inspect tread depth and condition; check pressure.',
    firstDue: 5000,
    mileageInterval: 5000,
    match: ['tire', 'tires']
  },
  {
    id: 'brakes-pads',
    label: 'Brake pads & rotors',
    description: 'Inspect pad thickness and rotor condition.',
    firstDue: 5000,
    mileageInterval: 5000,
    match: ['brake pad', 'brake pads', 'rotor']
  },
  {
    id: 'fasteners',
    label: 'Critical fasteners',
    description: 'Inspect/retorque critical fasteners per manual.',
    firstDue: 1000,
    mileageInterval: 10000,
    match: ['critical fastener', 'fastener torque', 'retorque']
  },
  {
    id: 'battery',
    label: 'Battery',
    description: 'Check state of charge; clean terminals.',
    firstDue: 5000,
    mileageInterval: 5000,
    match: ['battery']
  },
  {
    id: 'cooling',
    label: 'Coolant (Twin-Cooled models)',
    description: 'Applies to Twin-Cooled engines only.',
    firstDue: 25000,
    mileageInterval: 50000,
    match: ['coolant', 'cooling system']
  },
  {
    id: 'fork-oil',
    label: 'Fork oil',
    description: 'Change front fork oil.',
    firstDue: 50000,
    mileageInterval: 50000,
    match: ['fork oil', 'front fork']
  }
]

// Determine status for a given interval based on the current bike
// mileage and the most recent matching service entry.
//
// Returns one of:
//   { status: 'due-soon', dueAt, milesLeft }
//   { status: 'overdue',  dueAt, milesOver }
//   { status: 'ok',       dueAt, milesLeft }
//   { status: 'never-due' }  (one-time service already done)
//
// The thresholds are soft. "Due soon" kicks in within 500 miles.
export function evaluateInterval(interval, currentMileage, lastServiceEntry) {
  const lastAt = lastServiceEntry ? lastServiceEntry.mileage || 0 : null

  // Figure out the next due mileage.
  let dueAt
  if (lastAt == null) {
    dueAt = interval.firstDue
  } else if (!interval.mileageInterval) {
    // One-time item (e.g. break-in) that's already been done.
    return { status: 'never-due', lastAt }
  } else {
    dueAt = lastAt + interval.mileageInterval
  }

  const delta = dueAt - (currentMileage || 0)
  if (delta <= 0) {
    return { status: 'overdue', dueAt, milesOver: -delta, lastAt }
  }
  if (delta <= 500) {
    return { status: 'due-soon', dueAt, milesLeft: delta, lastAt }
  }
  return { status: 'ok', dueAt, milesLeft: delta, lastAt }
}

// ---------- Milestones ----------
//
// Riders think in milestones — "the 25k service", "the 50k service" —
// not in individual interval items. The factory schedule is laid out
// the same way: at every 5,000 miles a chunk of items come due, with
// bigger chunks at 10k / 25k / 50k. This helper rolls the per-item
// intervals up into the next milestone the rider is approaching, so
// the dashboard can surface one actionable row per bike instead of a
// dozen per-item rows.
//
// Unit awareness: HD's source numbers are in miles, so per-item
// intervals (engine oil at 5,000 mi etc.) stay in miles internally.
// But milestones are surfaced to the rider, so we compute them in
// the rider's preferred unit — a metric rider sees the next 5k km
// milestone, an imperial rider sees the next 5k mi one. We convert
// the chosen milestone back to miles internally so the per-item
// dueAt comparison still works against the (mile-keyed) interval data.
//
// We surface a milestone alert when the rider is within
// ALERT_WITHIN_MILES of it OR when they have overdue items they
// should clear at it.
//
// The returned shape:
//   {
//     milestoneMiles:  Number — the milestone expressed in miles,
//                      ready to feed into formatMileage() for display
//                      (formatMileage handles unit conversion).
//     milesLeft:       Number (positive — distance to milestone, in
//                      miles; format with formatMileage for display)
//     items:           Array<{ interval, status, milesLeft|milesOver }>
//                      (everything the rider should attend to AT the
//                       milestone — overdue items + items that come
//                       due at or before the milestone)
//     overdueCount:    Number (items already past their dueAt)
//     hasItems:        Boolean
//     isUpcoming:      Boolean (within ALERT_WITHIN_MILES)
//   }

import { isMetric } from './userPrefs.js'

const MILESTONE_STEP = 5000
const ALERT_WITHIN_MILES = 1500
const KM_PER_MI = 1.609344

export function nextMilestoneForBike(bike, log) {
  const mi = Math.max(0, Number(bike?.mileage) || 0)
  const metric = isMetric()

  // Compute the milestone in the rider's preferred unit so it lands
  // on a round number there, then convert back to miles for internal
  // due-date math.
  let milestoneMiles
  if (metric) {
    const currentKm = mi * KM_PER_MI
    const milestoneKm =
      Math.floor(currentKm / MILESTONE_STEP) * MILESTONE_STEP +
      MILESTONE_STEP
    milestoneMiles = milestoneKm / KM_PER_MI
  } else {
    milestoneMiles =
      Math.floor(mi / MILESTONE_STEP) * MILESTONE_STEP + MILESTONE_STEP
  }
  const milesLeft = milestoneMiles - mi

  const items = []
  let overdueCount = 0

  for (const interval of intervals) {
    const last = findLastMatchingEntry(interval, log)
    const ev = evaluateInterval(interval, mi, last)
    if (ev.status === 'never-due') continue

    if (ev.status === 'overdue') {
      overdueCount += 1
      items.push({ interval, status: 'overdue', milesOver: ev.milesOver, dueAt: ev.dueAt })
    } else if (ev.dueAt != null && ev.dueAt <= milestoneMiles) {
      // The interval's next service falls at or before this milestone —
      // include it as something to address at the milestone visit.
      items.push({ interval, status: 'due-soon', milesLeft: ev.milesLeft, dueAt: ev.dueAt })
    }
  }

  // Order: overdue first (most urgent), then by smallest dueAt.
  items.sort((a, b) => {
    if (a.status === 'overdue' && b.status !== 'overdue') return -1
    if (b.status === 'overdue' && a.status !== 'overdue') return 1
    return (a.dueAt || 0) - (b.dueAt || 0)
  })

  return {
    milestoneMiles,
    milesLeft,
    items,
    overdueCount,
    hasItems: items.length > 0,
    isUpcoming: milesLeft <= ALERT_WITHIN_MILES
  }
}

// Given a service log, return the most recent entry that matches an
// interval (by substring match against title OR jobId being one of the
// job ids we'd expect).
export function findLastMatchingEntry(interval, log) {
  const needles = (interval.match || []).map((s) => s.toLowerCase())
  return (
    log.find((e) => {
      const hay = `${e.title || ''} ${e.jobId || ''}`.toLowerCase()
      return needles.some((n) => hay.includes(n))
    }) || null
  )
}
