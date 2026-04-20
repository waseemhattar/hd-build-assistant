// Jobs database.
//
// Each job:
//   id          unique id
//   bikeIds     which bikes this job applies to (from bikes.js)
//   system      one of the `systems` ids from bikes.js
//   title       short title shown in the list
//   summary     one-line description
//   difficulty  'Easy' | 'Moderate' | 'Advanced'
//   timeMinutes rough time estimate
//   source      { manual: filename, page: <pdf page number> } so you can jump back to the PDF
//   tools       array of required tools / HD service tools
//   parts       array of { number, description, qty }
//   torque      array of { fastener, value, note }
//   steps       array of { n, text, warning? }
//
// To add a new job, copy one of the entries below and fill it in from the
// service manual. Keep the source page so you can verify it later.

export const jobs = [
  {
    id: 'cvo18-air-filter',
    bikeIds: ['cvo-road-glide-2018'],
    system: 'maintenance',
    title: 'Air Filter Element — Remove & Install',
    summary: 'Remove and reinstall the air filter element on the 2018 CVO Road Glide (FLTRXSE).',
    difficulty: 'Easy',
    timeMinutes: 20,
    source: {
      manual: '2018 HD CVO Road Glide FLTRXSE Service Manual Supplement.pdf',
      page: 25
    },
    tools: [
      'T27 Torx bit',
      'Small torque wrench (in-lb)',
      'Clean shop rags',
      'LOCTITE 243 (blue) — medium-strength threadlocker'
    ],
    parts: [
      { number: '29400267', description: 'Element, air filter (FLHXSE reference)', qty: 1 },
      { number: '29000149', description: 'Gasket (if replacing)', qty: 1 },
      { number: '14100871', description: 'Insert, air cleaner cover', qty: 1 }
    ],
    torque: [
      {
        fastener: 'Air filter cover screws (item 3)',
        value: '5.6–6.8 N·m (50–60 in-lbs)',
        note: 'Apply LOCTITE 243 (blue) to threads before installing.'
      },
      {
        fastener: 'Air cleaner insert screws (item 1)',
        value: '3.1–3.6 N·m (27–32 in-lbs)',
        note: 'Tighten evenly; do not overtighten.'
      }
    ],
    steps: [
      { n: 1, text: 'Remove the two screws (item 1) and remove the air cleaner insert (item 2).' },
      { n: 2, text: 'Remove the two screws (item 3).' },
      { n: 3, text: 'Remove the air cleaner cover (item 4) and the air filter element (item 5).' },
      {
        n: 4,
        text: 'Inspect the element. For cleaning information, see the base service manual. Replace element if damaged or heavily soiled.',
        warning: 'Do not wash paper elements with solvent — replace if contaminated with oil.'
      },
      { n: 5, text: 'Install the new air filter element (5).' },
      {
        n: 6,
        text: 'Apply LOCTITE 243 (blue) to screws (3). Secure element (5) and cover (4) with screws (3). Tighten to 5.6–6.8 N·m (50–60 in-lbs).'
      },
      { n: 7, text: 'Install insert (2). Secure with screws (1). Tighten to 3.1–3.6 N·m (27–32 in-lbs).' }
    ]
  },

  {
    id: 'cvo18-rider-footboards',
    bikeIds: ['cvo-road-glide-2018'],
    system: 'chassis',
    title: 'Rider Footboards — Fastener Torque Specs',
    summary: 'Reference card for rider footboard bracket and pivot bolt torque values.',
    difficulty: 'Easy',
    timeMinutes: 30,
    source: {
      manual: '2018 HD CVO Road Glide FLTRXSE Service Manual Supplement.pdf',
      page: 36
    },
    tools: ['Torque wrench (ft-lb and in-lb)', 'T40 Torx or socket as needed'],
    parts: [],
    torque: [
      {
        fastener: 'Footboard bracket screws (rider)',
        value: '48.8–57 N·m (36.0–42.0 ft-lbs)',
        note: 'Section 2.9 FOOTBOARDS AND CONTROLS, Rider Footboards.'
      },
      {
        fastener: 'Footboard pivot bolt nut (rider)',
        value: '6.8–9 N·m (60.2–79.7 in-lbs)',
        note: ''
      },
      {
        fastener: 'Shift lever clamp screws',
        value: '24.4–29.8 N·m (18–22 ft-lbs)',
        note: ''
      },
      {
        fastener: 'Shift lever peg fastener',
        value: '16.3–19 N·m (12–14 ft-lbs)',
        note: ''
      },
      {
        fastener: 'Passenger footpeg position screw',
        value: '20.3–24.4 N·m (15–18 ft-lbs)',
        note: 'Apply LOCTITE 243 (blue).'
      },
      {
        fastener: 'Passenger footpeg support upper screw',
        value: '48.8–56.9 N·m (36–42 ft-lbs)',
        note: 'Apply LOCTITE 243 (blue).'
      }
    ],
    steps: [
      { n: 1, text: 'Reference only — use these torque values when reinstalling rider/passenger footboards and shift lever components.' }
    ]
  },

  {
    id: 'cvo18-front-brake-fasteners',
    bikeIds: ['cvo-road-glide-2018'],
    system: 'brakes',
    title: 'Front Brake Disc — Fastener Spec',
    summary: 'Torque spec for the front brake disc screws on the 2018 CVO Road Glide.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: {
      manual: '2018 HD CVO Road Glide FLTRXSE Service Manual Supplement.pdf',
      page: 36
    },
    tools: ['Torque wrench', 'T40 Torx bit', 'New disc screws'],
    parts: [],
    torque: [
      {
        fastener: 'Brake disc screws, front',
        value: '21.7–32.5 N·m (16.0–24.0 ft-lbs)',
        note: 'Always use new screws — these are torque-to-yield.'
      }
    ],
    steps: [
      { n: 1, text: 'Always replace front brake disc screws — do not re-use.' },
      { n: 2, text: 'Tighten in a star pattern to 21.7–32.5 N·m (16.0–24.0 ft-lbs).' }
    ]
  },

  // =========================================================================
  //  2020 TOURING — Engine / Maintenance jobs extracted from the
  //  "2020 HD Touring Service Manual.pdf" (Milwaukee-Eight 107/114).
  //  Page numbers refer to the PDF (printed section refs in parentheses).
  // =========================================================================

  {
    id: 't20-engine-oil-filter',
    bikeIds: ['touring-2020'],
    system: 'engine',
    title: 'Engine Oil & Filter — Replace',
    summary:
      'Drain oil, replace filter, refill with 4.0 qt (3.8 L), then cold + hot level check. Initial service at 1000 mi (1600 km).',
    difficulty: 'Easy',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 42 },
    tools: [
      'Oil Filter Wrench — HD 94686-00',
      'Oil Filter Wrench — HD 94863-10',
      'Torque wrench (ft-lb)',
      'Oil Catcher — P&A 62700199 (or equivalent)',
      'Drain pan, funnel, shop rags'
    ],
    parts: [
      { number: '63731-99A / 63798-99A', description: 'Oil filter (verify against parts catalog for your exact model)', qty: 1 },
      { number: '—', description: 'Drain plug O-ring (replace every oil change)', qty: 1 },
      { number: '—', description: 'Engine oil — SCREAMIN\' EAGLE SYN3 20W50 or H-D 360 20W50', qty: 1 }
    ],
    torque: [
      { fastener: 'Engine oil drain plug', value: '19–28.5 N·m (14–21 ft-lbs)', note: 'Use a NEW O-ring every time.' }
    ],
    steps: [
      { n: 1, text: 'Run the motorcycle until the engine is at normal operating temperature, then shut it off.' },
      { n: 2, text: 'Remove the filler plug / dipstick.' },
      { n: 3, text: 'Remove the oil drain plug (item 2, Figure 2-3) and its O-ring. Let oil drain completely.' },
      {
        n: 4,
        text: 'Use the P&A Oil Catcher (62700199) or equivalent to keep drain oil off the crankcase when removing the filter. Residual oil could later look like a false crankcase leak.'
      },
      {
        n: 5,
        text: 'Remove the oil filter using the oil filter wrench (94686-00 or 94863-10) and hand tools only.',
        warning: 'Do not use air tools on the oil filter.'
      },
      { n: 6, text: 'Clean the oil filter mount flange.' },
      { n: 7, text: 'Clean any residual oil from the crankcase and transmission housing.' },
      {
        n: 8,
        text: 'Install the new oil filter: lubricate the gasket with a thin film of clean engine oil. Hand-tighten one-half to three-quarters of a turn after the gasket first contacts the mounting surface. Do NOT use the filter wrench for installation.'
      },
      {
        n: 9,
        text: 'Install the engine oil drain plug with a NEW O-ring. Tighten to 19–28.5 N·m (14–21 ft-lbs).'
      },
      { n: 10, text: 'Add an initial 4.0 qt (3.8 L) of engine oil. Use the lubricant in Table 2-4 for the lowest temperature expected before next change.' },
      { n: 11, text: 'Cold oil-level check: on jiffy stand, insert dipstick and tighten into the fill spout, then remove and read. Correct cold level is midway between ADD QT and FULL HOT.' },
      { n: 12, text: 'Start and idle the engine on the jiffy stand for two minutes. Turn off. Re-check; add only enough to bring level midway between ADD QT and FULL HOT.' },
      {
        n: 13,
        text: 'Hot oil-level check: ride until oil reaches at least 93 °C (200 °F). Idle 1–2 minutes on jiffy stand, shut off, then check. Level must register between ADD QT and FULL HOT.',
        warning: 'Do not allow hot oil level to fall below the ADD/FILL mark. Do NOT overfill.'
      },
      { n: 14, text: 'Check for leaks around drain plug and oil filter.' }
    ]
  },

  {
    id: 't20-primary-chaincase',
    bikeIds: ['touring-2020'],
    system: 'drive',
    title: 'Primary Chaincase Lubricant — Change',
    summary:
      'Drain chaincase, replace drain plug O-ring, refill ~34 oz (1.0 L) dry fill / ~30 oz (0.9 L) wet fill, reinstall clutch inspection cover in torque sequence.',
    difficulty: 'Easy',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 44 },
    tools: [
      'T27 / Torx driver for clutch inspection cover screws',
      'Torque wrench (in-lb and ft-lb)',
      'Drain pan, funnel, shop rags'
    ],
    parts: [
      { number: '—', description: 'Primary chaincase drain plug O-ring (replace)', qty: 1 },
      { number: '—', description: 'Clutch inspection cover seal (new)', qty: 1 },
      { number: '—', description: 'FORMULA+ Transmission and Primary Chaincase Lubricant (or SCREAMIN\' EAGLE SYN3 20W50)', qty: 1 }
    ],
    torque: [
      { fastener: 'Primary chaincase drain plug', value: '19–28.5 N·m (14–21 ft-lbs)', note: '' },
      {
        fastener: 'Clutch inspection cover screws',
        value: '9.5–12.2 N·m (84–108 in-lbs)',
        note: 'Tighten in the sequence shown in Figure 2-8.'
      }
    ],
    steps: [
      { n: 1, text: 'Run the motorcycle until the engine is at normal operating temperature, then shut off.' },
      {
        n: 2,
        text: 'Secure the motorcycle upright on a level surface — NOT leaning on the jiffy stand.',
        warning: 'Do not let lubricant/fluid get on tires, wheels or brakes — traction loss can cause death or serious injury.'
      },
      { n: 3, text: 'Drain the primary chaincase via the drain plug (Figure 2-5).' },
      { n: 4, text: 'Clean the drain plug magnet. If plug has excessive debris, inspect the chaincase components.' },
      {
        n: 5,
        text: 'Install the drain plug with a NEW O-ring. Tighten to 19–28.5 N·m (14–21 ft-lbs).'
      },
      { n: 6, text: 'Remove the five clutch inspection cover screws (item 3) and the cover (item 2).' },
      { n: 7, text: 'Remove the seal (item 1). Wipe oil from the groove in the chaincase cover and the mounting surface.' },
      {
        n: 8,
        text: 'Pour the specified amount of lubricant through the clutch inspection cover opening. Target: dry fill 34 oz (1.0 L); wet fill (drain only) 30 oz (0.9 L). Proper level is approximately at the bottom of the pressure plate OD with the bike upright.',
        warning: 'Do not overfill the primary. Overfilling can cause rough clutch engagement, clutch drag and/or difficulty finding neutral at idle.'
      },
      { n: 9, text: 'Thoroughly wipe all lubricant from the cover mounting surface and groove.' },
      { n: 10, text: 'Place a NEW seal (1) in the groove of the clutch inspection cover (2). Press each nub into the groove.' },
      { n: 11, text: 'Install the clutch inspection cover (2) with its five captive-washer screws (3).' },
      {
        n: 12,
        text: 'Tighten screws in the sequence shown in Figure 2-8 to 9.5–12.2 N·m (84–108 in-lbs).'
      }
    ]
  },

  {
    id: 't20-transmission-fluid',
    bikeIds: ['touring-2020'],
    system: 'transmission',
    title: 'Transmission Lubricant — Change',
    summary:
      'Drain transmission, reinstall drain plug with new O-ring, refill 28 fl oz (0.83 L), verify level between A and F on the dipstick.',
    difficulty: 'Easy',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 46 },
    tools: [
      'Torque wrench (ft-lb and in-lb)',
      'Drain pan, funnel, shop rags'
    ],
    parts: [
      { number: '—', description: 'Transmission drain plug O-ring (replace)', qty: 1 },
      { number: '—', description: 'FORMULA+ Transmission and Primary Chain Lubricant (or SCREAMIN\' EAGLE SYN3 20W50)', qty: 1 }
    ],
    torque: [
      { fastener: 'Transmission drain plug', value: '19–28.5 N·m (14–21 ft-lbs)', note: '' },
      { fastener: 'Transmission filler plug / dipstick', value: '2.8–8.5 N·m (25–75 in-lbs)', note: 'Do not over-tighten.' }
    ],
    steps: [
      {
        n: 1,
        text: 'Remove the transmission filler plug / dipstick.',
        warning: 'Keep lubricant off tires, wheels and brakes.'
      },
      { n: 2, text: 'Remove the transmission drain plug. Drain the transmission.' },
      { n: 3, text: 'Clean and inspect the drain plug and O-ring. Replace the O-ring.' },
      { n: 4, text: 'Install the drain plug with a NEW O-ring. Tighten to 19–28.5 N·m (14–21 ft-lbs). Do not over-tighten.' },
      { n: 5, text: 'Fill the transmission with 28 fl oz (0.83 L) of the recommended lubricant.' },
      { n: 6, text: 'Check lubricant level — add enough to bring the level between the ADD (A) and FULL (F) marks on the dipstick (Figure 2-10). Install filler plug/dipstick until O-ring contacts the case, do not tighten, remove and read.' },
      { n: 7, text: 'Install filler plug/dipstick. Tighten to 2.8–8.5 N·m (25–75 in-lbs).' }
    ]
  },

  {
    id: 't20-air-filter',
    bikeIds: ['touring-2020'],
    system: 'engine',
    title: 'Air Filter — Inspect / Clean / Install',
    summary:
      'Remove cover and element, wash element in warm water with mild detergent, air-dry, reinstall with LOCTITE 243 on cover screw.',
    difficulty: 'Easy',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 77 },
    tools: [
      'Torx driver as required',
      'Mild detergent and warm water',
      'Low-pressure compressed air',
      'LOCTITE 243 (blue) — medium-strength threadlocker',
      'Torque wrench (in-lb)'
    ],
    parts: [
      { number: '—', description: 'Air filter element (if replacing — verify part number in parts catalog)', qty: 1 }
    ],
    torque: [
      { fastener: 'Air cleaner cover screw (item 1)', value: '4.1–6.8 N·m (36–60 in-lbs)', note: 'Apply LOCTITE 243 (blue) to threads.' },
      { fastener: 'Air filter element screws (item 3)', value: '4.5–6.8 N·m (40–60 in-lbs)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove the air cleaner cover: remove screw (1) and remove cover (2). See Figure 2-34.' },
      { n: 2, text: 'Remove the filter element: remove screws (3) and pull the filter element (4) off while pulling the breather tube (5) from the element.' },
      { n: 3, text: 'Remove the breather tube (5) from the breather bolts.' },
      {
        n: 4,
        text: 'Inspect the breather tube and fittings for damage.',
        warning: 'Do not strike the filter element on a hard surface to dislodge dirt. Do not apply air-cleaner filter oil to the H-D paper/wire-mesh element.'
      },
      {
        n: 5,
        text: 'Wash the filter element and breather tubes in lukewarm water with a mild detergent. Allow to air-dry, or use low-pressure compressed air from the INSIDE.',
        warning: 'Do not use gasoline or solvents — flammable cleaning agents can cause an intake system fire.'
      },
      { n: 6, text: 'Hold the element up to a strong light — it is sufficiently clean when light is uniformly visible through the media. Replace if damaged or if media cannot be adequately cleaned.' },
      { n: 7, text: 'Verify the rubber seal (6) is properly seated and undamaged.' },
      { n: 8, text: 'Install the breather tube (5).' },
      { n: 9, text: 'Install the filter element (4) while pushing the breather tube into the element. Install screws (3). Tighten to 4.5–6.8 N·m (40–60 in-lbs).' },
      { n: 10, text: 'Apply LOCTITE 243 (blue) to the threads of cover screw (1). Install cover (2) and screw (1). Tighten to 4.1–6.8 N·m (36–60 in-lbs).' }
    ]
  },

  {
    id: 't20-spark-plugs',
    bikeIds: ['touring-2020'],
    system: 'engine',
    title: 'Spark Plugs — Clean, Inspect & Install',
    summary:
      'Remove fuse + fuel tank for access, pull plugs once cool, inspect deposits, set gap 0.031–0.035 in (0.8–0.9 mm), torque 89–133 in-lbs.',
    difficulty: 'Moderate',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 80 },
    tools: [
      'Spark plug socket',
      'Spark Plug Wire Puller — HD-52006 (for stubborn boots)',
      'Wire-type feeler gauge',
      'Torque wrench (in-lb)'
    ],
    parts: [
      { number: 'HD-6R10', description: 'Spark plug (all Touring models)', qty: 2 }
    ],
    torque: [
      { fastener: 'Spark plug', value: '10–15 N·m (89–133 in-lbs)', note: 'Verify threads are clean and dry before installing.' }
    ],
    steps: [
      {
        n: 1,
        text: 'Remove the main fuse (POWER DISCONNECT, Page 8-8).'
      },
      { n: 2, text: 'Remove the fuel tank for access to the right-side plugs (FUEL TANK, Page 6-9).' },
      {
        n: 3,
        text: 'Never remove spark plugs until the heads have cooled.',
        warning: 'Disconnecting a spark plug cable with engine running can cause electric shock and serious injury.'
      },
      { n: 4, text: 'Disconnect the spark plug cables. Use HD-52006 Adjustable Spark Plug Wire Puller on stubborn boots.' },
      { n: 5, text: 'Remove the spark plugs.' },
      {
        n: 6,
        text: 'Inspect deposits per Figure 2-37 / Table 2-22. Discard plugs with eroded electrodes, heavy deposits or a cracked insulator.'
      },
      {
        n: 7,
        text: 'Verify gap with a wire-type feeler gauge. Target: 0.031–0.035 in (0.8–0.9 mm). Bend the outer electrode to adjust.'
      },
      { n: 8, text: 'Verify threads are clean and dry. Install plugs and tighten to 10–15 N·m (89–133 in-lbs).' },
      { n: 9, text: 'Connect the spark plug cables. Check connections at coil, plugs, and anchor clips / harness caddies (Figure 2-38).' },
      { n: 10, text: 'Reinstall the fuel tank (Page 6-9). Reinstall the main fuse (Page 8-8).' }
    ]
  }
]

export function jobsForBike(bikeId) {
  return jobs.filter((j) => j.bikeIds.includes(bikeId))
}

export function searchJobs(bikeId, query) {
  const q = (query || '').trim().toLowerCase()
  const base = jobsForBike(bikeId)
  if (!q) return base
  return base.filter((j) => {
    const hay = [
      j.title,
      j.summary,
      j.system,
      ...(j.tools || []),
      ...(j.parts || []).map((p) => `${p.number} ${p.description}`),
      ...(j.torque || []).map((t) => `${t.fastener} ${t.value}`),
      ...(j.steps || []).map((s) => s.text)
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })
}
