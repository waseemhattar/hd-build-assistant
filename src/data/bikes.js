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
      'FLHXSE CVO Street Glide',
      'FLHTK Ultra Limited',
      'FLHTKL Ultra Limited Low',
      'FLHTKSE CVO Limited',
      'FLHR Road King',
      'FLHRXS Road King Special',
      'FLTRX Road Glide',
      'FLTRXS Road Glide Special',
      'FLTRXSE CVO Road Glide',
      'FLTRK Road Glide Limited',
      'FLTRKSE CVO Road Glide Limited',
      'FLHTCU Electra Glide Ultra Classic',
      'FLHTCUTG Tri Glide Ultra'
    ],
    manualFolder: 'Touring--2020',
    manuals: ['2020 HD Touring Service Manual.pdf', '2020 HD Touring Parts Catalog.pdf']
  },
  {
    id: 'softail-2018',
    family: 'Softail',
    year: 2020,
    label: 'Milwaukee 8 Gen 1 Softail (2018 - 2023)',
    models: [
      'FLDE Softail Deluxe',
      'FLHC Heritage Classic',
      'FLHCS Heritage Classic 114',
      'FLSL Softail Slim',
      'FLSB Sport Glide',
      'FLFB Fat Boy',
      'FLFBS Fat Boy 114',
      'FXBB Street Bob',
      'FXBBS Street Bob 114',
      'FXBR Breakout',
      'FXBRS Breakout 114',
      'FXFB Fat Bob',
      'FXFBS Fat Bob 114',
      'FXLR Low Rider',
      'FXLRS Low Rider S',
      'FXST Standard'
    ],
    manualFolder: 'SOFTAIL--2018',
    manuals: ['2020 HD Softail Service Manual.pdf']
  },
  {
    id: 'softail-2025',
    family: 'Softail',
    year: 2025,
    label: 'Milwaukee 8 Gen 2 Softail (2024 - 2025)',
    models: [
      'FXBB Street Bob',
      'FXLRS Low Rider S',
      'FXLRST Low Rider ST',
      'FXBR Breakout',
      'FLFB Fat Boy',
      'FLFBS Fat Boy 114',
      'FLHC Heritage Classic',
      'FLHCS Heritage Classic 114'
    ],
    manualFolder: 'SOFTAIL--2025',
    manuals: ['2025 HD Softail Service Manual 94001289.pdf']
  }
]

// Service systems used to group jobs. Order matters — these are the
// buttons you see on the left side of the job browser.
export const systems = [
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'engine', label: 'Engine' },
  { id: 'fuel', label: 'Fuel System' },
  { id: 'exhaust', label: 'Exhaust' },
  { id: 'drivetrain', label: 'Drivetrain / Primary' },
  { id: 'transmission', label: 'Transmission' },
  { id: 'cooling', label: 'Cooling System' },
  { id: 'chassis', label: 'Chassis' },
  { id: 'brakes', label: 'Brakes / Wheels' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'bodywork', label: 'Bodywork / Bags' }
]
