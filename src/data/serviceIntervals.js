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
