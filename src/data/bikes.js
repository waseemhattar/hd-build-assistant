// Bikes catalog. Each bike entry maps to a manual folder on disk,
// plus the family/year used for selecting jobs.
//
// manualFolder fields are informational (what folder in the workspace
// the PDFs live in) — the app doesn't open PDFs directly yet, but this
// lets us wire that up later.

export const bikes = [
  {
    id: 'touring-2017',
    family: 'Touring',
    year: 2017,
    label: '2017 Touring',
    models: ['FLHX Street Glide', 'FLHTK Ultra Limited', 'FLHR Road King', 'FLTRX Road Glide'],
    manualFolder: '2017',
    manuals: [
      '2017_Touring.pdf',
      '2017 Touring Models Factory Parts Catalog .pdf',
      '2017_FLHXSE_Parts.pdf',
      '2017_FLHTKSE_Parts.pdf'
    ]
  },
  {
    id: 'cvo-road-glide-2018',
    family: 'CVO Touring',
    year: 2018,
    label: '2018 CVO Road Glide (FLTRXSE)',
    models: ['FLTRXSE'],
    manualFolder: '2018',
    manuals: ['2018 HD CVO Road Glide FLTRXSE Service Manual Supplement.pdf']
  },
  {
    id: 'touring-2019',
    family: 'Touring',
    year: 2019,
    label: '2019 Touring',
    models: ['FLHX Street Glide', 'FLHTK Ultra Limited', 'FLHR Road King', 'FLTRX Road Glide'],
    manualFolder: 'Touring--2019',
    manuals: [
      '2019 HD Touring Service Manual.pdf',
      '2019 HD TOURING  Parts Catalog.pdf',
      '2019-05-23 BOOMBOX_GTS_94000601 English v2.pdf'
    ]
  },
  {
    id: 'cvo-street-glide-2019',
    family: 'CVO Touring',
    year: 2019,
    label: '2019 CVO Street Glide (FLHXSE)',
    models: ['FLHXSE'],
    manualFolder: 'Touring--2019',
    manuals: [
      '2019 HD CVO Street Glide  FLHXSE Service Manual Supplement.pdf',
      '2019 HD CVO Parts Catalog.pdf'
    ]
  },
  {
    id: 'cvo-road-glide-2019',
    family: 'CVO Touring',
    year: 2019,
    label: '2019 CVO Road Glide (FLTRXSE)',
    models: ['FLTRXSE'],
    manualFolder: 'Touring--2019',
    manuals: [
      '2019 HD CVO Road Glide  FLTRXSE Service Manual Supplement.pdf',
      '2019 HD CVO Parts Catalog.pdf'
    ]
  },
  {
    id: 'touring-2020',
    family: 'Touring',
    year: 2020,
    label: '2020 Touring',
    models: ['FLHX Street Glide', 'FLHTK Ultra Limited', 'FLHR Road King', 'FLTRX Road Glide'],
    manualFolder: 'Touring--2020',
    manuals: ['2020 HD Touring Service Manual.pdf', '2020 HD Touring Parts Catalog.pdf']
  },
  {
    id: 'softail-2019',
    family: 'Softail',
    year: 2019,
    label: '2019 Softail',
    models: ['FXBB Street Bob', 'FLSL Slim', 'FLDE Deluxe', 'FLHC Heritage', 'FXBR Breakout', 'FXDR', 'FLFB Fat Boy', 'FXFB Fat Bob', 'FXLR Low Rider', 'FXLRS'],
    manualFolder: 'SOFTAIL--2019',
    manuals: ['2019 Softail.pdf', '2019 Softail Parts Catalog.pdf']
  },
  {
    id: 'softail-2020',
    family: 'Softail',
    year: 2020,
    label: '2020 Softail',
    models: ['FXBB Street Bob', 'FLSL Slim', 'FLDE Deluxe', 'FLHC Heritage', 'FXBR Breakout', 'FXDR', 'FLFB Fat Boy', 'FXFB Fat Bob', 'FXLR Low Rider', 'FXLRS'],
    manualFolder: 'SOFTAIL--2020',
    manuals: ['2020 HD Softail Service Manual .pdf']
  }
]

// Service systems used to group jobs. Order matters — these are the
// buttons you see on the left side of the job browser.
export const systems = [
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'engine', label: 'Engine' },
  { id: 'fuel', label: 'Fuel System' },
  { id: 'drive', label: 'Drive / Primary' },
  { id: 'transmission', label: 'Transmission' },
  { id: 'chassis', label: 'Chassis' },
  { id: 'brakes', label: 'Brakes / Wheels' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'bodywork', label: 'Bodywork / Bags' }
]
