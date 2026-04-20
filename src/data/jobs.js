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
    figures: [
      { file: '/figures/t20/fig-2-1.png', caption: 'Figure 2-1. Engine Oil Filler Plug', stepRefs: [2] },
      { file: '/figures/t20/fig-2-2.png', caption: 'Figure 2-2. Engine Oil Dipstick', stepRefs: [11, 13] },
      { file: '/figures/t20/fig-2-3.png', caption: 'Figure 2-3. Oil Pan', stepRefs: [3, 9] },
      { file: '/figures/t20/fig-2-4.png', caption: 'Figure 2-4. Lubricating New Oil Filter Gasket', stepRefs: [8] }
    ],
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
    figures: [
      { file: '/figures/t20/fig-2-5.png', caption: 'Figure 2-5. Removal/Installation of Chaincase Drain Plug', stepRefs: [] },
      { file: '/figures/t20/fig-2-6.png', caption: 'Figure 2-6. Primary Lubricant Level', stepRefs: [] },
      { file: '/figures/t20/fig-2-7.png', caption: 'Figure 2-7. Clutch Cover (Typical)', stepRefs: [] },
      { file: '/figures/t20/fig-2-8.png', caption: 'Figure 2-8. Clutch Cover Tightening Sequence', stepRefs: [] }
    ],
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
    figures: [
      { file: '/figures/t20/fig-2-9.png', caption: 'Figure 2-9. Transmission Filler Plug/Dipstick Location', stepRefs: [1, 7] },
      { file: '/figures/t20/fig-2-10.png', caption: 'Figure 2-10. Transmission Lubricant Level', stepRefs: [6] },
      { file: '/figures/t20/fig-2-11.png', caption: 'Figure 2-11. Transmission Drain Plug', stepRefs: [2, 4] }
    ],
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
    figures: [
      { file: '/figures/t20/fig-2-34.png', caption: 'Figure 2-34. Air Cleaner Assembly', stepRefs: [1, 2, 9, 10] }
    ],
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
    figures: [
      { file: '/figures/t20/fig-2-37.png', caption: 'Figure 2-37. Spark Plug Deposits', stepRefs: [6] },
      { file: '/figures/t20/fig-2-38.png', caption: 'Figure 2-38. Spark Plug Cables', stepRefs: [9] }
    ],
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
  },

  {
    id: 't20-front-brake-pads',
    bikeIds: ['touring-2020'],
    system: 'brakes',
    title: 'Front Brake Pads — Replace',
    summary:
      'Retract caliper pistons, remove old pads, inspect pad spring, install new pads with pin, torque pad pin 75–102 in-lbs. Bleed brakes if spongy.',
    difficulty: 'Moderate',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 42 },
    figures: [
      { file: '/figures/t20/fig-2-16.png', caption: 'Figure 2-16. Brake Pad Inspection', stepRefs: [] },
      { file: '/figures/t20/fig-2-17.png', caption: 'Figure 2-17. Front Brake Caliper Assembly', stepRefs: [4, 9] },
      { file: '/figures/t20/fig-2-18.png', caption: 'Figure 2-18. Brake Pad', stepRefs: [10] }
    ],
    tools: [
      'C-clamp',
      'Torque wrench (in-lb)',
      'Flashlight or trouble light',
      'Shop rags'
    ],
    parts: [
      { number: '—', description: 'Front brake pads (complete set)', qty: 1 },
      { number: '—', description: 'Brake pad pin (metric, discard old)', qty: 1 }
    ],
    torque: [
      { fastener: 'Brake pad pin', value: '75–102 in-lbs (8.5–11.5 N·m)', note: 'Always use new pad pin.' }
    ],
    steps: [
      { n: 1, text: 'Remove front brake caliper. See FRONT BRAKE CALIPER (Page 3-34).' },
      { n: 2, text: 'Loosen master cylinder reservoir cap. See FRONT BRAKE MASTER CYLINDER (Page 3-31).' },
      { n: 3, text: 'Remove grit and debris from caliper piston area. Rinse with warm soapy water and dry with low-pressure air.' },
      { n: 4, text: 'See Figure 2-17. Remove screen (3) from caliper.' },
      { n: 5, text: 'Using the old brake pad and a C-clamp, retract the pistons fully into the caliper.' },
      { n: 6, text: 'Remove retaining clip (4).' },
      { n: 7, text: 'Discard old pad pin (5). Remove brake pads.' },
      { n: 8, text: 'Inspect pad spring (7). Replace if needed.' },
      {
        n: 9,
        text: 'Install new brake pads. See Figure 2-17. Install pad spring (7) on flat in caliper so clips engage indentations. Make sure forked end is on pad pin side.',
        warning: 'Always replace brake pads in complete sets for correct and safe brake operation. Improper brake operation could result in death or serious injury.'
      },
      { n: 10, text: 'Insert each brake pad with square corner (1) in slot of caliper. Push pad pin tab (2) into caliper.' },
      { n: 11, text: 'Install new pad pin. Tighten to 75–102 in-lbs (8.5–11.5 N·m).' },
      { n: 12, text: 'Install clip (4). Install screen (3).' },
      { n: 13, text: 'Tighten master cylinder reservoir cap. Install caliper.' },
      { n: 14, text: 'Pump brakes to move pistons out until brake pads contact rotor. Check for excessive drag.' },
      { n: 15, text: 'Check fluid level in brake master cylinder reservoir. See CHECK AND REPLACE BRAKE FLUID (Page 2-24).' },
      { n: 16, text: 'Test brakes. If spongy, bleed brakes. Avoid hard stops for first 100 mi (160 km) to wear in pads.' }
    ]
  },

  {
    id: 't20-rear-brake-pads',
    bikeIds: ['touring-2020'],
    system: 'brakes',
    title: 'Rear Brake Pads — Replace',
    summary:
      'Remove caliper, retract pistons, discard old pads and pin, install new pads with spring, torque pin 75–102 in-lbs. Bleed if spongy.',
    difficulty: 'Moderate',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 48 },
    figures: [
      { file: '/figures/t20/fig-2-19.png', caption: 'Figure 2-19. Rear Brake Caliper Assembly', stepRefs: [8] },
      { file: '/figures/t20/fig-2-20.png', caption: 'Figure 2-20. Brake Pad', stepRefs: [10] }
    ],
    tools: [
      'C-clamp',
      'Torque wrench (in-lb)',
      'Shop rags',
      'Paste (supplied in brake pad kit for backing plate)'
    ],
    parts: [
      { number: '—', description: 'Rear brake pads (complete set)', qty: 1 },
      { number: '—', description: 'Brake pad pin (metric, discard old)', qty: 1 }
    ],
    torque: [
      { fastener: 'Brake pad pin', value: '75–102 in-lbs (8.5–11.5 N·m)', note: 'Always use new pad pin.' }
    ],
    steps: [
      { n: 1, text: 'Remove rear brake caliper. See REAR BRAKE CALIPER (Page 3-39).' },
      { n: 2, text: 'Loosen master cylinder reservoir cap. See REAR BRAKE MASTER CYLINDER (Page 3-36).' },
      { n: 3, text: 'Remove grit and debris from caliper piston area. Rinse with warm soapy water; dry with low-pressure air.' },
      { n: 4, text: 'Using the old brake pad and a C-clamp, retract the pistons fully into the caliper.' },
      { n: 5, text: 'Remove retaining clip (4).' },
      { n: 6, text: 'Discard old pad pin (5). Remove brake pads.' },
      { n: 7, text: 'Inspect pad spring (7). Replace if needed.' },
      {
        n: 8,
        text: 'Install new brake pads. See Figure 2-19. Install pad spring (7) on flat in caliper so clips engage indentations.',
        warning: 'Always replace brake pads in complete sets for correct and safe brake operation. Improper brake operation could result in death or serious injury.'
      },
      { n: 9, text: 'Apply paste supplied in kit to back of brake pads.' },
      { n: 10, text: 'See Figure 2-20. Insert each brake pad with square corner (1) in slot of caliper.' },
      { n: 11, text: 'Push pad pin tab (2) into caliper. Install new pad pin. Tighten to 75–102 in-lbs (8.5–11.5 N·m).' },
      { n: 12, text: 'Install clip (4).' },
      { n: 13, text: 'Tighten rear master cylinder reservoir cap. Install caliper.' },
      { n: 14, text: 'Pump brakes to move pistons out until brake pads contact rotor.' },
      { n: 15, text: 'Check fluid level in brake master cylinder. See CHECK AND REPLACE BRAKE FLUID (Page 2-24).' },
      { n: 16, text: 'Test brakes. If spongy, bleed brakes. Avoid hard stops for first 100 mi (160 km).' }
    ]
  },

  {
    id: 't20-brake-fluid-flush',
    bikeIds: ['touring-2020'],
    system: 'brakes',
    title: 'Brake Fluid — Flush & Replace (DOT 4)',
    summary:
      'Use vacuum brake bleeder. Flush front/rear circuits per Table 2-12 (3–6 fl oz each), replace DOT 4 fluid every 2 years per maintenance schedule.',
    difficulty: 'Moderate',
    timeMinutes: 90,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 52 },
    figures: [
      { file: '/figures/t20/fig-2-21.png', caption: 'Figure 2-21. Sight Glass Minimum Marks', stepRefs: [5, 8] }
    ],
    tools: [
      'Basic Vacuum Brake Bleeder — BB200A',
      'Torque wrench (in-lb)',
      'Clean shop towel (to protect paint)',
      'Bleeder screw wrench (wrench size depends on caliper type)'
    ],
    parts: [
      { number: '99953-99A', description: 'DOT 4 Brake Fluid — 12 oz bottle', qty: 1 }
    ],
    torque: [
      { fastener: 'Brake bleeder screw, front', value: '72–108 in-lbs (8.1–12.2 N·m)', note: '' },
      { fastener: 'Brake bleeder screw, rear', value: '75–102 in-lbs (8.5–11.5 N·m)', note: '' },
      { fastener: 'Brake master cylinder reservoir cover screws', value: '12–15 in-lbs (1.4–1.7 N·m)', note: '' }
    ],
    steps: [
      {
        n: 1,
        text: 'Wrap a clean shop towel around the outside of the master cylinder reservoir to protect paint from brake fluid spills.',
        warning: 'Contact with DOT 4 brake fluid can have serious health effects. Failure to wear proper skin and eye protection could result in death or serious injury. See Safety Data Sheet (SDS) at sds.harley-davidson.com'
      },
      { n: 2, text: 'Position vehicle or handlebar so master cylinder reservoir is level.' },
      { n: 3, text: 'Remove cover from master cylinder reservoir. Clean cover before removing.' },
      { n: 4, text: 'Remove bleeder screw cap. Install BASIC VACUUM BRAKE BLEEDER (PART NUMBER: BB200A) to bleeder screw.' },
      { n: 5, text: 'Add brake fluid as necessary. Verify proper operation of the master cylinder relief port by actuating the brake pedal or lever. Refer to Table 2-10 for proper level.' },
      { n: 6, text: 'Operate vacuum bleeder while maintaining fluid level in master cylinder reservoir. Following the sequence in Table 2-12, open bleeder screw about 3/4 turn. Continue until specified volume has been replaced. Tighten bleeder screw to specification. Install bleeder screw cap.' },
      { n: 7, text: 'Repeat with each caliper following the sequence in Table 2-12 until all brake lines have been serviced.' },
      { n: 8, text: 'Fill reservoir to specified level. Refer to Table 2-10.' },
      { n: 9, text: 'Clean gasket and sealing surfaces of debris. Install master cylinder reservoir covers with proper orientation. Tighten cover screws to specification.' },
      { n: 10, text: 'Apply brakes to check proper lamp operation. Test ride motorcycle. If brakes feel spongy, perform bleeding procedure.' }
    ]
  },

  {
    id: 't20-battery-inspect',
    bikeIds: ['touring-2020'],
    system: 'electrical',
    title: 'Battery — Remove, Inspect & Install',
    summary:
      'Disconnect cables (negative first), clean terminals & case, inspect for damage, voltage test (target 12.7V+), torque cable screws 60–70 in-lbs.',
    difficulty: 'Easy',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 104 },
    figures: [
      { file: '/figures/t20/fig-2-35.png', caption: 'Figure 2-35. Battery Compartment', stepRefs: [3, 4] }
    ],
    tools: [
      'Torque wrench (in-lb)',
      'Baking soda and water solution (5 teaspoons per liter)',
      'Wire brush or sandpaper',
      'Multimeter or battery voltmeter',
      'Shop rags'
    ],
    parts: [
      { number: '—', description: 'Electrical contact lubricant (11300004)', qty: 1 }
    ],
    torque: [
      { fastener: 'Battery cable screws', value: '60–70 in-lbs (6.8–7.9 N·m)', note: 'Connect positive cable first. Do not over-tighten.' }
    ],
    steps: [
      { n: 1, text: 'Remove seat. See SEAT (Page 3-148).' },
      { n: 2, text: 'Move top caddy away from battery. See TOP CADDY (Page 8-110).' },
      {
        n: 3,
        text: 'See Figure 2-35. Disconnect both battery cables (2, 3), negative cable first.',
        warning: 'Connect positive (+) battery cable first during reinstall. If positive (+) cable should contact ground with negative (−) cable connected, the resulting sparks can cause a battery explosion, which could result in death or serious injury.'
      },
      { n: 4, text: 'Pull up on battery strap (1) to raise battery. Remove battery.' },
      { n: 5, text: 'Clean battery top. Mix a solution of five teaspoons of baking soda per liter of water. Apply to battery top. When solution stops bubbling, rinse off with clean water.' },
      { n: 6, text: 'Clean cable connectors and battery terminals with a wire brush or sandpaper. Remove any oxidation.' },
      { n: 7, text: 'Inspect the battery terminal screws and cables for breakage, loose connections and corrosion.' },
      { n: 8, text: 'Check the battery terminals for melting or damage.' },
      { n: 9, text: 'Inspect the battery for discoloration, raised top or a warped or distorted case. Replace as necessary.' },
      { n: 10, text: 'Inspect the battery case for cracks or leaks.' },
      { n: 11, text: 'Voltage Test: If the open circuit (disconnected) voltage reading is below 12.6V, charge the battery and re-check after at least one hour. If 12.7V or above, proceed to install.' },
      { n: 12, text: 'Run battery strap rearward across bottom of battery tray, then up and across the frame crossmember.' },
      { n: 13, text: 'Place battery into battery tray, terminal side forward.' },
      { n: 14, text: 'Connect both battery cables, positive battery cable first. Tighten to 60–70 in-lbs (6.8–7.9 N·m).' },
      { n: 15, text: 'Apply a light coat of petroleum or electrical contact lubricant to both battery terminals.' },
      { n: 16, text: 'Fold battery strap over top of battery.' },
      { n: 17, text: 'Install top caddy. Install seat.' }
    ]
  },

  {
    id: 't20-tire-pressure-wheel-check',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Tire Pressures & Wheel Torque Check',
    summary:
      'Check tire pressures cold (36 psi front / 40 psi rear per Table 2-8). Inspect tread wear. Check wheel bearings for play. Torque spoke nipples 55 in-lbs if needed.',
    difficulty: 'Easy',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 44 },
    figures: [
      { file: '/figures/t20/fig-2-12.png', caption: 'Figure 2-12. Tread Wear Indicator: Michelin Tires', stepRefs: [2] },
      { file: '/figures/t20/fig-2-13.png', caption: 'Figure 2-13. Dunlop Sidewall Tread Wear Indicator Bar', stepRefs: [2] },
      { file: '/figures/t20/fig-2-14.png', caption: 'Figure 2-14. Dunlop Tread Wear Indicator Bar Appearance', stepRefs: [2] },
      { file: '/figures/t20/fig-2-15.png', caption: 'Figure 2-15. Tightening Laced Wheels (typical)', stepRefs: [5] }
    ],
    tools: [
      'Tire pressure gauge',
      'Spoke torque wrench (HD-48985)',
      'Spoke wrench (HD-94681-80) for loosening',
      'Wheel chocks or stand'
    ],
    parts: [],
    torque: [
      { fastener: 'Spoke nipple', value: '55 in-lbs (6.2 N·m)', note: 'Do not over-tighten. Do not tighten more than one-quarter turn past alignment mark.' }
    ],
    steps: [
      { n: 1, text: 'Check tire pressures when tires are cold. Refer to Table 2-8 for specifications. 2020 Touring: Front 36 psi (248 kPa), Rear 40 psi (276 kPa).' },
      { n: 2, text: 'Inspect each tire for punctures, cuts and breaks. Replace tire immediately if wear bars become visible or only 1/32 in (1 mm) tread depth remains.' },
      { n: 3, text: 'Inspect the play of the wheel bearings by hand while they are in the wheel. Rotate the inner bearing race and check for abnormal noise. Make sure bearing rotates smoothly.' },
      { n: 4, text: 'Check wheel bearings and axle spacers for wear and corrosion. Excessive play or roughness indicates worn bearings.' },
      { n: 5, text: 'If wheel bearings or spokes require adjustment, refer to SEALED WHEEL BEARINGS (Page 3-21) or ADJUST WHEEL SPOKES (Page 2-17).' }
    ]
  },

  {
    id: 't20-drive-belt-deflection',
    bikeIds: ['touring-2020'],
    system: 'drive',
    title: 'Drive Belt — Inspect & Measure Deflection',
    summary:
      'Inspect belt for cuts, cracks, stone damage, hook wear, bevel wear. Measure deflection with Belt Tension Gauge (HD-35381-A) to spec (1/4–7/16 in or 3/8–9/16 in per model and shock type).',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 84 },
    figures: [
      { file: '/figures/t20/fig-2-26.png', caption: 'Figure 2-26. Drive Belt Wear Patterns', stepRefs: [] },
      { file: '/figures/t20/fig-2-27.png', caption: 'Figure 2-27. Belt Tension Gauge', stepRefs: [] },
      { file: '/figures/t20/fig-2-28.png', caption: 'Figure 2-28. Belt Deflection Window', stepRefs: [] },
      { file: '/figures/t20/fig-2-29.png', caption: 'Figure 2-29. Checking Belt Deflection', stepRefs: [] },
      { file: '/figures/t20/fig-2-30.png', caption: 'Figure 2-30. Install Tool Perpendicular to Torque Wrench', stepRefs: [] },
      { file: '/figures/t20/fig-2-31.png', caption: 'Figure 2-31. Rear Wheel Adjuster Cams', stepRefs: [] }
    ],
    tools: [
      'Belt Tension Gauge — HD-35381-A',
      'Clean shop rag',
      'Torque wrench (ft-lb)',
      'Axle Nut Torque Adapter — HD-47925 (for adjustment)'
    ],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Disarm security system. Remove main fuse. See POWER DISCONNECT (Page 8-8).' },
      { n: 2, text: 'Keep dirt, grease, oil, and debris off the drive belt and sprockets. Clean the belt with a rag slightly dampened with a light cleaning agent.' },
      { n: 3, text: 'See Figure 2-25. Inspect each tooth of rear sprocket for major tooth damage, large chrome chips with sharp edges, gouges caused by hard objects, and excessive loss of chrome plating.' },
      { n: 4, text: 'Check for worn chrome plating. Drag a sharp object across the bottom of a sprocket groove using medium pressure. If sharp object digs in and leaves a visible mark, the chrome plating is worn. Replace rear sprocket if major tooth damage or loss of chrome exists.' },
      { n: 5, text: 'See Figure 2-26 and Table 2-16. Inspect drive belt for cuts, unusual wear patterns, outside bevel wear, stone damage, exposed tensile cords, and punctures or cracking at the base of belt teeth. Replace belt if conditions 2, 3, 6, or 7 (edge damage) exist.' },
      { n: 6, text: 'Shift transmission to neutral. Measure belt deflection using BELT TENSION GAUGE (PART NUMBER: HD-35381-A) with motorcycle at ambient temperature, upright or on jiffy stand with rear wheel on ground, unladen (no rider, luggage, or saddlebags).' },
      { n: 7, text: 'Slide O-ring (4) to zero mark (3). Fit belt cradle (2) against bottom of drive belt in line with deflection window (or halfway between drive pulleys if no window). Press upward on knob (6) until O-ring slides down to 10 lb (4.54 kg) mark (5) and hold steady.' },
      { n: 8, text: 'Measure belt deflection while holding gauge steady. Each deflection graduation is approximately 1/16 in (1.6 mm). Refer to Table 2-17 for model specifications.' },
      { n: 9, text: 'Service belt tension spec is for belts with more than 1000 mi (1,600 km). Set to new belt tension if belt has less than 1000 mi (1,600 km).' },
      { n: 10, text: 'If deflection is not within specifications, belt adjustment is required. Contact a Harley-Davidson dealer or refer to ADJUST BELT (Page 2-38).' },
      { n: 11, text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).' }
    ]
  },

  {
    id: 't20-fuel-tank-remove',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Tank — Remove & Install',
    summary:
      'Purge fuel line, disconnect fuel level sender/pump connector, remove vapor vent tube. Remove screws and bracket. Torque tank screws 15–20 ft-lbs on reinstall.',
    difficulty: 'Moderate',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 132 },
    tools: [
      'Torque wrench (ft-lb)',
      'Fuel line disconnect tool or equivalent',
      'Shop rags',
      'Drain pan (for residual fuel)'
    ],
    parts: [],
    torque: [
      { fastener: 'Fuel tank front screws', value: '15–20 ft-lbs (20.3–27.1 N·m)', note: '' },
      { fastener: 'Fuel tank rear bracket screws', value: '15–20 ft-lbs (20.3–27.1 N·m)', note: '' }
    ],
    steps: [
      {
        n: 1,
        text: 'Purge fuel line. See PURGE FUEL LINE (Page 6-6).',
        warning: 'To prevent spray of fuel, purge system of high-pressure fuel before supply line is disconnected. Gasoline is extremely flammable and highly explosive, which could result in death or serious injury.'
      },
      { n: 2, text: 'Remove left side saddlebag. See SADDLEBAGS (Page 3-161).' },
      { n: 3, text: 'Remove left side cover. See LEFT SIDE COVER (Page 3-58).' },
      { n: 4, text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).' },
      { n: 5, text: 'Disconnect fuel line from tank. See FUEL LINE (Page 6-7).' },
      { n: 6, text: 'Remove seat. See SEAT (Page 3-148).' },
      { n: 7, text: 'Remove console. See CONSOLE (Page 6-4).' },
      { n: 8, text: 'Remove fuel vapor vent tube from fitting on top plate.' },
      { n: 9, text: 'Remove fuel level sender/fuel pump connector from top plate.' },
      {
        n: 10,
        text: 'Remove rubber caps from front fuel tank screws.',
        warning: 'Gasoline can drain from the fuel line when disconnected from fuel tank. Gasoline is extremely flammable and highly explosive, which could result in death or serious injury. Wipe up spilled fuel immediately and dispose of rags in a suitable manner.'
      },
      { n: 11, text: 'Remove screws.' },
      { n: 12, text: 'Remove two screws to release rear tank bracket from frame backbone.' },
      { n: 13, text: 'Remove fuel tank.' },
      { n: 14, text: 'To install: Place fuel tank onto frame backbone and start front fuel tank screws.' },
      { n: 15, text: 'Install rear fuel tank bracket to frame with two screws. Tighten to 15–20 ft-lbs (20.3–27.1 N·m). If removed, install plastic trim cover over bracket.' },
      { n: 16, text: 'Tighten front fuel tank screws to 15–20 ft-lbs (20.3–27.1 N·m). Install rubber caps over screws (left and right caps are not interchangeable).' },
      { n: 17, text: 'Install fuel level sender/fuel pump connector from top plate. Install fuel vapor vent tube to vapor valve fitting on top plate.' },
      { n: 18, text: 'Install console. Install seat. Install fuel line. Install main fuse. Install left side cover. Install left side saddlebag.' }
    ]
  },

  {
    id: 't20-rear-sprocket-isolator',
    bikeIds: ['touring-2020'],
    system: 'drive',
    title: 'Rear Sprocket Isolator — Inspect Wear',
    summary:
      'Hang weighted string on left axle spacer. Rotate sprocket both directions, mark limits on tape. Measure distance between marks; replace isolator if exceeds 0.400 in (10.2 mm).',
    difficulty: 'Easy',
    timeMinutes: 20,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 88 },
    figures: [
      { file: '/figures/t20/fig-2-25.png', caption: 'Figure 2-25. Rear Sprocket', stepRefs: [] },
      { file: '/figures/t20/fig-2-32.png', caption: 'Figure 2-32. Check Compensator Wear', stepRefs: [3, 10] }
    ],
    tools: [
      'Weighted string',
      'Masking tape',
      'Ruler or calipers (metric or imperial)'
    ],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Support the vehicle in an upright position in neutral. Do not lift the wheels off the ground.' },
      { n: 2, text: 'Remove left saddlebag.' },
      { n: 3, text: 'See Figure 2-32. Hang a weighted string (1) on the left axle spacer as close as possible to, but not touching, the rear sprocket.' },
      { n: 4, text: 'Place a piece of masking tape on the face of the sprocket where the marks will be drawn.' },
      { n: 5, text: 'Do not allow the rear wheel to rotate when rotating the sprocket; a false measurement will occur.' },
      { n: 6, text: 'Rotate the rear sprocket by hand in one direction until it stops.' },
      { n: 7, text: 'While holding the sprocket in place, mark the masking tape in line with the string.' },
      { n: 8, text: 'Rotate the rear sprocket in the opposite direction until it stops.' },
      { n: 9, text: 'While holding the sprocket in place, make a second mark in line with the string.' },
      { n: 10, text: 'Measure the distance (2) along the edge of the sprocket between the marks. If the measurement exceeds 0.400 in (10.2 mm), replace the rubber isolator. Refer to REAR WHEEL COMPENSATOR (Page 3-19) for repair.' }
    ]
  },

  {
    id: 't20-front-axle-nut-torque',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Front Axle Nut — Torque Check',
    summary:
      'Reference torque spec for front axle nut. Verify security with torque wrench at specification. Essential for safe wheel alignment and bearing preload.',
    difficulty: 'Easy',
    timeMinutes: 15,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 88 },
    tools: [
      'Torque wrench (ft-lb)',
      'Socket or wrench appropriate to axle nut size'
    ],
    parts: [],
    torque: [
      { fastener: 'Front axle nut', value: '(verify in printed manual)', note: 'See FRONT WHEEL (Page 3-12) for complete torque spec and bearing preload adjustment.' }
    ],
    steps: [
      { n: 1, text: 'Support motorcycle on centerstand or lift. Do not lift wheel off the ground unless necessary for wheel removal.' },
      { n: 2, text: 'Locate front axle nut on right side of front wheel. See FRONT WHEEL (Page 3-12) for complete assembly details and torque specification.' },
      { n: 3, text: 'Using torque wrench, verify front axle nut is at specification. If adjustment is needed, refer to FRONT WHEEL assembly procedure.' },
      { n: 4, text: 'This is a reference job. For detailed wheel bearing preload and complete installation procedure, see FRONT WHEEL (Page 3-12).' }
    ]
  },

  {
    id: 't20-rear-axle-nut-torque',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Rear Axle Nut — Torque Check & Belt Adjustment',
    summary:
      'Check rear axle cone nut torque: 1st 15–20 ft-lbs, final 135–145 ft-lbs. Verify cams touch frame bosses. Use Axle Nut Torque Adapter (HD-47925) for proper technique.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 88 },
    tools: [
      'Torque wrench (ft-lb)',
      'Axle Nut Torque Adapter — HD-47925',
      'Breaker bar or ratchet',
      'Wheel blocks or stand'
    ],
    parts: [
      { number: '—', description: 'E-clip (new, for right side axle groove)', qty: 1 }
    ],
    torque: [
      { fastener: 'Rear axle cone nut, 1st torque', value: '15–20 ft-lbs (20–27 N·m)', note: '' },
      { fastener: 'Rear axle cone nut, final torque', value: '135–145 ft-lbs (183–196.6 N·m)', note: 'Hold weld nut while tightening. Verify cams contact bosses on both sides of rear fork.' }
    ],
    steps: [
      { n: 1, text: 'Disarm security system. Remove main fuse. See POWER DISCONNECT (Page 8-8).' },
      { n: 2, text: 'Remove both saddlebags.' },
      { n: 3, text: 'If AXLE NUT TORQUE ADAPTER (PART NUMBER: HD-47925) is not available, remove both mufflers. See MUFFLERS (Page 6-33).' },
      { n: 4, text: 'Remove and discard E-clip from groove at end of axle.' },
      { n: 5, text: 'See Figure 2-30. Install adapter perpendicular to breaker bar for best clearance with muffler. Install on the outboard side.' },
      { n: 6, text: 'Install adapter on torque wrench, perpendicular to torque wrench. The torque wrench must be perpendicular to the torque adapter to obtain proper torque.' },
      { n: 7, text: 'Loosen cone nut.' },
      { n: 8, text: 'See Figure 2-31. Push wheel forward. Verify that cam (5) contacts boss (4) on both sides of rear fork.' },
      { n: 9, text: 'Snug cone nut (6). Torque: 15–20 ft-lbs (20–27 N·m).' },
      { n: 10, text: 'It is beneficial to use a second AXLE NUT TORQUE ADAPTER (HD-47925) to rotate and hold the weld nut. Check belt deflection as adjustment is made. See MEASURE DRIVE BELT DEFLECTION (Page 2-37).' },
      { n: 11, text: 'See Figure 2-31. Adjust belt tension by rotating weld nut (3) on left side. Turn clockwise to tighten or counterclockwise to loosen. If loosening belt tension, push the wheel forward. Verify both cams (5) touch the bosses (4) on both sides after the weld nut is rotated.' },
      { n: 12, text: 'Hold weld nut and tighten cone nut. Torque: 135–145 ft-lbs (183–196.6 N·m).' },
      { n: 13, text: 'Again, verify the cams touch the bosses on both sides of the rear fork and that belt deflection is still within specification.' },
      { n: 14, text: 'With the flat side out, install new E-clip in groove on right side of axle.' },
      { n: 15, text: 'If removed, install fasteners that attach mufflers to saddlebag frames and tighten to 14–18 ft-lbs (19–24.4 N·m). Install saddlebags. Install main fuse.' }
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
