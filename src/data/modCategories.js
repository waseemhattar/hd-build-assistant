// Mod category taxonomy for the Build / Mods feature.
//
// 47 categories across 9 groups. Groups exist for the grouped <select>
// in the Build tab; the underlying DB `category` column stores the leaf
// label (e.g. "Transmission"). Add new entries by appending to the
// appropriate group — the leaf label becomes the stored value.
//
// If you rename a leaf here, existing rows in Supabase will still hold
// the old label. Prefer adding a new entry over renaming.

export const MOD_CATEGORY_GROUPS = [
  {
    group: 'Powertrain',
    items: [
      'Engine',
      'Exhaust',
      'Intake',
      'Fuel System',
      'Ignition',
      'Performance Tuning',
      'Transmission',
      'Clutch',
      'Primary Drive',
      'Final Drive'
    ]
  },
  {
    group: 'Chassis & Handling',
    items: [
      'Suspension Front',
      'Suspension Rear',
      'Brakes',
      'Wheels & Tires',
      'Frame & Swingarm'
    ]
  },
  {
    group: 'Controls & Ergonomics',
    items: [
      'Handlebars',
      'Hand Controls',
      'Foot Controls',
      'Seat',
      'Windshield/Fairing'
    ]
  },
  {
    group: 'Bodywork & Styling',
    items: [
      'Paint & Graphics',
      'Bodywork',
      'Chrome & Trim',
      'Badges & Emblems'
    ]
  },
  {
    group: 'Electrical',
    items: [
      'Lighting Headlight',
      'Lighting Auxiliary',
      'Lighting Tail/Brake/Signal',
      'Wiring & Electrical',
      'Battery & Charging',
      'Gauges & Instruments',
      'Keyless/Security'
    ]
  },
  {
    group: 'Luggage & Storage',
    items: [
      'Saddlebags & Tour-Paks',
      'Racks & Luggage Mounts',
      'Tank Bags & Soft Bags'
    ]
  },
  {
    group: 'Audio & Comfort',
    items: [
      'Audio & Infotainment',
      'Heated Components',
      'Passenger Accessories'
    ]
  },
  {
    group: 'Hardware & Fluids',
    items: ['Hardware', 'Fluids & Consumables']
  },
  {
    group: 'Other',
    items: ['Tools', 'Miscellaneous']
  }
]

// Flat list of every leaf label, useful for <datalist> or validation.
export const MOD_CATEGORIES = MOD_CATEGORY_GROUPS.flatMap((g) => g.items)

// Reverse lookup: leaf label → group name. Useful when rendering a mod
// row and we want to show its group heading.
export const CATEGORY_TO_GROUP = MOD_CATEGORY_GROUPS.reduce((acc, g) => {
  for (const item of g.items) acc[item] = g.group
  return acc
}, {})

// Allowed statuses for a mod (bike_mods.status). Keep in sync with the
// DB default 'planned' in 002_builds_and_mods.sql.
export const MOD_STATUSES = ['planned', 'installed', 'removed']

// Allowed statuses for a build (bike_builds.status).
export const BUILD_STATUSES = ['planned', 'active', 'completed']
