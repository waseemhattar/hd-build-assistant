// Bikes catalog. Each bike entry maps to a manual folder on disk,
// plus the family/year used for selecting jobs.
//
// manualFolder fields are informational (what folder in the workspace
// the PDFs live in) — the app doesn't open PDFs directly yet, but this
// lets us wire that up later.

export const bikes = [
  {
    id: 'touring-2020',
    family: 'Touring',
    year: 2020,
    label: 'Milwaukee 8 Gen 1 (2017 - 2023)',
    models: [
      'FLHX Street Glide',
      'FLHXS Street Glide Special',
      'FLHTK Ultra Limited',
      'FLHTKL Ultra Limited Low',
      'FLHR Road King',
      'FLHRXS Road King Special',
      'FLTRX Road Glide',
      'FLTRXS Road Glide Special',
      'FLHTCU Electra Glide Ultra Classic',
      'FLTRK Road Glide Limited'
    ],
    manualFolder: 'Touring--2020',
    manuals: ['2020 HD Touring Service Manual.pdf', '2020 HD Touring Parts Catalog.pdf']
  }
]

// Service systems used to group jobs. Order matters — these are the
// buttons you see on the left side of the job browser.
export const systems = [
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'engine', label: 'Engine' },
  { id: 'fuel', label: 'Fuel System' },
  { id: 'exhaust', label: 'Exhaust' },
  { id: 'drive', label: 'Drive / Primary' },
  { id: 'drivetrain', label: 'Drivetrain' },
  { id: 'transmission', label: 'Transmission' },
  { id: 'cooling', label: 'Cooling System' },
  { id: 'chassis', label: 'Chassis' },
  { id: 'brakes', label: 'Brakes / Wheels' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'bodywork', label: 'Bodywork / Bags' }
]
