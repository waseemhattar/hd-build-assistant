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
    system: 'drivetrain',
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
    system: 'drivetrain',
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
    system: 'drivetrain',
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
,
  {
    id: 't20-front-wheel-remove-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Front Wheel — Remove & Install',
    summary: 'Remove and install front wheel with axle torque of 70-75 ft-lbs, axle pinch screw 18-22 ft-lbs. Includes brake disc, bearings, and WSS sensor (ABS models).',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 112 },
    figures: [
      { file: '/figures/t20/fig-3-3.png', caption: 'Front Wheel (typical)', stepRefs: [1, 2, 3, 4, 5] },
      { file: '/figures/t20/fig-3-4.png', caption: 'Floating Brake Disc Alignment', stepRefs: [4] }
    ],
    tools: ['Torque wrench (ft-lb)', 'Socket set', 'Breaker bar'],
    parts: [
      { number: '98960-97', description: 'Anti-seize lubricant', qty: 1 }
    ],
    torque: [
      { fastener: 'Front axle nut', value: '70-75 ft-lbs (95-102 N·m)', note: '' },
      { fastener: 'Front axle pinch screw', value: '18-22 ft-lbs (24.5-30 N·m)', note: '' },
      { fastener: 'Brake disc screw, front', value: '16-24 ft-lbs (21.5-32.5 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Raise front wheel. See Secure the Motorcycle for Service (Page 2-3).' },
      { n: 2, text: 'Check wheel bearings. See SEALED WHEEL BEARINGS (Page 3-21).' },
      { n: 3, text: 'Measure brake disc runout. See INSPECT BRAKES (Page 2-19).' },
      { n: 4, text: 'Detach front brake calipers from fork. Support calipers. See FRONT BRAKE CALIPER (Page 3-34).' },
      { n: 5, text: 'See Figure 3-3. Remove wheel. Remove axle nut (6) and flat washer (5).' },
      { n: 6, text: 'Loosen axle pinch screw at bottom of right side fork slider.' },
      { n: 7, text: 'Remove axle (1), outer spacer(s) (2) and front Wheel Speed Sensor (WSS) (7) (if ABS equipped).', warning: 'Never pull WSS cable taut or use to retain wheel, axle or other components. Always keep the WSS and ABS encoder bearing away from magnetic fields.' },
      { n: 8, text: 'See Figure 3-3. Remove front brake disc. Remove and discard screws (8).' },
      { n: 9, text: 'Cast wheels: Remove bushings (9) and spring washers (10). Remove front brake disc.' },
      { n: 10, text: 'Remove front tire. See TIRES (Page 3-26).' },
      { n: 11, text: 'Discard sealed wheel bearings. See SEALED WHEEL BEARINGS (Page 3-21).' },
      { n: 12, text: 'Clean all parts thoroughly, except bearings and WSS, for inspection.' },
      { n: 13, text: 'Inspect front wheel for damage. Replace or repair as necessary.' },
      { n: 14, text: 'Check wheel lateral and radial runout before installing a new tire. See CHECKING AND TRUING WHEELS (Page 3-17).' },
      { n: 15, text: 'See Figure 3-3. Install wheel bearing spacer (4).' },
      { n: 16, text: 'Install new sealed wheel bearings. See SEALED WHEEL BEARINGS (Page 3-21).' },
      { n: 17, text: 'Install front tire. See TIRES (Page 3-26).' },
      { n: 18, text: 'Install front brake disc. See Figure 3-3. Apply light coat of anti-seize to axle (1), bearing bores and bore of spacer (4). ANTI-SEIZE LUBRICANT (98960-97)' },
      { n: 19, text: 'Cast wheel with standard brake disc: Install spring washers (10) and bushings (9).' },
      { n: 20, text: 'Cast wheel with floating brake disc: See Figure 3-4. Align mark on brake disc center with valve stem hole.' },
      { n: 21, text: 'Install new screws (8). Tighten. Torque: 16-24 ft-lbs (21.5-32.5 N·m) Brake disc screw, front' },
      { n: 22, text: 'See Figure 3-3. Place wheel into position with valve stem on right side. Install axle through right fork, outer spacer, wheel hub, front WSS (ABS models) or second outer spacer, and left fork.' },
      { n: 23, text: 'Install flat washer (5) and axle nut (6).' },
      { n: 24, text: 'ABS models: Rotate WSS until it contacts rear of fork slider. Back off enough to maintain clearance between WSS wire stem and fork slider.' },
      { n: 25, text: 'Tighten axle nut. Torque: 70-75 ft-lbs (95-102 N·m) Front axle nut' },
      { n: 26, text: 'ABS models: Verify that WSS cable is installed in bracket and that retainer is secure. Retainer cannot be installed once mounting screws are started.' },
      { n: 27, text: 'Push and hold right fork slider inboard until it contacts external spacer. Tighten axle pinch screw. Torque: 18-22 ft-lbs (24.5-30 N·m) Front axle pinch screw' },
      { n: 28, text: 'Install brake calipers and sensor cable retainer (ABS models). See FRONT BRAKE CALIPER (Page 3-34).' },
      { n: 29, text: 'ABS models: Secure WSS and fender tip lamp cables with new cable straps. See FRONT WHEEL SPEED SENSOR (WSS) (Page 8-103).' },
      { n: 30, text: 'Lower front wheel.' }
    ]
  },

  {
    id: 't20-rear-wheel-remove-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Rear Wheel — Remove & Install',
    summary: 'Remove and install rear wheel with axle torque: 1st pass 15-20 ft-lbs, final 135-145 ft-lbs. Includes belt management, compensator sprocket, brake disc, and ABS WSS sensor.',
    difficulty: 'Advanced',
    timeMinutes: 75,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 114 },
    figures: [
      { file: '/figures/t20/fig-3-5.png', caption: 'Rear Wheel (typical)', stepRefs: [1, 2, 4, 8] },
      { file: '/figures/t20/fig-3-6.png', caption: 'Caliper Bracket', stepRefs: [1] },
      { file: '/figures/t20/fig-3-7.png', caption: 'Install Tool Perpendicular to Torque Wrench', stepRefs: [1] },
      { file: '/figures/t20/fig-3-8.png', caption: 'Rear Wheel Speed Sensor Index Pin (ABS)', stepRefs: [3] }
    ],
    tools: [
      'Torque wrench (ft-lb)',
      'Axle Nut Torque Adapter — HD-47925',
      'Socket set',
      'Breaker bar'
    ],
    parts: [
      { number: '98960-97', description: 'Anti-seize lubricant', qty: 1 }
    ],
    torque: [
      { fastener: 'Rear axle cone nut, 1st torque', value: '15-20 ft-lbs (20-27 N·m)', note: '' },
      { fastener: 'Rear axle cone nut, final torque', value: '135-145 ft-lbs (183-196.6 N·m)', note: 'Hold weld nut while tightening. Verify cams contact bosses on both sides of rear fork.' },
      { fastener: 'Rear rotor screw', value: '30-45 ft-lbs (41-61 N·m)', note: 'Do not re-use brake disc/rotor screws. Install brake disc in its original position.' },
      { fastener: 'Brake caliper screw', value: '43-48 ft-lbs (58-65 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove saddlebags. See SADDLEBAGS (Page 3-161).' },
      { n: 2, text: 'Raise rear of motorcycle. See Secure the Motorcycle for Service (Page 2-3).' },
      { n: 3, text: 'Inspect wheel bearings. See SEALED WHEEL BEARINGS (Page 3-21).' },
      { n: 4, text: 'Measure brake disc runout. See INSPECT BRAKES (Page 2-19).' },
      { n: 5, text: 'Measure sprocket isolator wear. See INSPECT REAR SPROCKET ISOLATOR (Page 2-41).' },
      { n: 6, text: 'Remove left muffler. See MUFFLERS (Page 6-33).' },
      { n: 7, text: 'Models with manual adjust shock absorbers: Remove left side lower saddlebag support rail. See SADDLEBAG SUPPORTS (Page 3-165).' },
      { n: 8, text: 'ABS models: Release rear WSS cable from rear brake hose.' },
      { n: 9, text: 'Remove rear brake caliper. See REAR BRAKE CALIPER (Page 3-39).', warning: 'Do not operate brakes with the caliper removed or the caliper pistons may be forced out. The caliper contains no serviceable components and would require replacement.' },
      { n: 10, text: 'Remove E-clip (1) from axle (17). See Figure 3-5.' },
      { n: 11, text: 'See Figure 3-7. Using special tool, hold weld nut on left side and loosen cone nut. Special Tool: AXLE NUT TORQUE ADAPTER (HD-47925)' },
      { n: 12, text: 'See Figure 3-5. Remove cone nut (2) and adjuster cam (3).' },
      { n: 13, text: 'Rotate weld nut to loosen drive belt.' },
      { n: 14, text: 'Remove axle. Catch external spacers (5, 16), caliper bracket and rear WSS (6) (ABS equipped).', warning: 'Always keep wheel speed sensor (6) and ABS encoder bearing away from magnetic fields. Never pull WSS cable taut or use to retain wheel, axle or other components.' },
      { n: 15, text: 'Remove sprocket and rubber isolator. See REAR WHEEL COMPENSATOR (Page 3-19).' },
      { n: 16, text: 'Remove tire. See TIRES (Page 3-26).' },
      { n: 17, text: 'See Figure 3-5. Remove brake disc (7). If wheel is assembled with same disc, mark both wheel and disc so that it can be installed in its original position.' },
      { n: 18, text: 'Remove and discard screws (4). Remove brake disc.' },
      { n: 19, text: 'Remove bearings and inner spacer. See SEALED WHEEL BEARINGS (Page 3-21).' },
      { n: 20, text: 'Clean all parts thoroughly.' },
      { n: 21, text: 'Inspect rear wheel for damage. Replace or repair as necessary.' },
      { n: 22, text: 'Check wheel runout. See CHECKING AND TRUING WHEELS (Page 3-17).' },
      { n: 23, text: 'Install bearings and inner spacer. See SEALED WHEEL BEARINGS (Page 3-21).' },
      { n: 24, text: 'See Figure 3-5. Install brake disc (7) and screws (4). Tighten screws in a cross-wise pattern. Torque: 30-45 ft-lbs (41-61 N·m) Rear rotor screw' },
      { n: 25, text: 'Install tire. See TIRES (Page 3-26).' },
      { n: 26, text: 'Install rubber isolator and sprocket (13). See REAR WHEEL COMPENSATOR (Page 3-19).' },
      { n: 27, text: 'See Figure 3-6. Inspect caliper bracket. Replace rubber bumper (2) if necessary.' },
      { n: 28, text: 'See Figure 3-5. Install rear wheel. Verify sprocket (13) is fully seated in wheel.' },
      { n: 29, text: 'Place wheel in rear fork. Install belt over sprocket. Seat caliper bracket on anchor weldment of rear fork.' },
      { n: 30, text: 'Apply anti-seize lubricant to axle (17), bearing bores and bore of spacer sleeve (10). ANTI-SEIZE LUBRICANT (98960-97)' },
      { n: 31, text: 'Slide axle through left side of rear fork, external spacer (thin) (16), sprocket (13), wheel hub, rear WSS (ABS equipped) or external spacer (thick) (5), caliper bracket and right side of rear fork.' },
      { n: 32, text: 'Rotate axle with flat on threaded end topside.' },
      { n: 33, text: 'Apply a light coat of anti-seize lubricant to inboard face of cone nut (2). Avoid contact with threads. ANTI-SEIZE LUBRICANT (98960-97)' },
      { n: 34, text: 'Install adjuster cam (3) and cone nut. Finger-tighten only.' },
      { n: 35, text: 'ABS models: Route WSS cable. Route forward and outboard of caliper bracket. Then along top of rear fork.' },
      { n: 36, text: 'See Figure 3-8. ABS models: Rotate WSS counterclockwise until index pin contacts caliper bracket.' },
      { n: 37, text: 'Tighten cone nut. Belt adjustment torque. Torque: 15-20 ft-lbs (20-27 N·m) Rear axle cone nut, 1st torque' },
      { n: 38, text: 'See Figure 3-5. Install new E-clip (1).' },
      { n: 39, text: 'Install brake caliper with two screws. Tighten. Torque: 43-48 ft-lbs (58-65 N·m) Brake caliper screw' },
      { n: 40, text: 'Secure rear WSS cable to brake hose. Conduit clip length from front of brake hose crimp: 1.25 in (31.8 mm)' },
      { n: 41, text: 'Adjust drive belt deflection. See INSPECT AND ADJUST DRIVE BELT AND SPROCKETS (Page 2-36).' },
      { n: 42, text: 'Install left saddlebag support rail. See SADDLEBAG SUPPORTS (Page 3-165).' },
      { n: 43, text: 'Install left muffler. See MUFFLERS (Page 6-33).' },
      { n: 44, text: 'Install saddlebags. See SADDLEBAGS (Page 3-161).' }
    ]
  },

  {
    id: 't20-checking-truing-wheels',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Checking and Truing Wheels',
    summary: 'Check radial and lateral wheel runout using truing stand. Maximum runout: 0.030 in (0.76 mm). Cast wheels with excess runout must be replaced; never straighten.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 117 },
    figures: [
      { file: '/figures/t20/fig-3-9.png', caption: 'Checking Radial Runout', stepRefs: [1, 2] },
      { file: '/figures/t20/fig-3-10.png', caption: 'Checking Lateral Runout', stepRefs: [3, 4] }
    ],
    tools: ['Wheel Truing Stand (HD-99500-80)', 'Dial indicator or gauge rod'],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Check wheels for lateral and radial runout before installing a new tire.' },
      { n: 2, text: 'Cast wheels having excess runout must be replaced. Never attempt to straighten cast wheels.' },
      { n: 3, text: 'Always check condition of wheel bearings before checking wheel runout. See SEALED WHEEL BEARINGS (Page 3-21).' },
      { n: 4, text: 'See Figure 3-9. Mount wheel in truing stand. Special Tool: WHEEL TRUING STAND (HD-99500-80)' },
      { n: 5, text: 'Adjust gauge rod or dial indicator to the rim\'s tire bead safety hump.' },
      { n: 6, text: 'Rotate wheel and measure distance at several locations. Runout must not exceed 0.030 in (0.76 mm).' },
      { n: 7, text: 'See Figure 3-10. For lateral runout, place a gauge rod near, or dial indicator on the rim bead flange.' },
      { n: 8, text: 'Measure distance at several locations. Lateral runout must not exceed 0.030 in (0.76 mm).', warning: 'Dial indicators are more accurate than gauge rods.' }
    ]
  },

  {
    id: 't20-rear-wheel-compensator',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Rear Wheel Compensator',
    summary: 'Remove and install rear wheel compensator sprocket with isolator and bearings. Use bearing remover/installer tool (HD-48921). Replace isolator and bearings every removal.',
    difficulty: 'Advanced',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 119 },
    figures: [
      { file: '/figures/t20/fig-3-11.png', caption: 'Rear Wheel Compensator', stepRefs: [1, 2, 3, 4] },
      { file: '/figures/t20/fig-3-12.png', caption: 'Install Isolator in Wheel', stepRefs: [2] },
      { file: '/figures/t20/fig-3-13.png', caption: 'Rear Wheel Compensator Bearing Remover/Installer (HD-48921)', stepRefs: [3, 4] }
    ],
    tools: [
      'Rear Wheel Compensator Sprocket Bearing Remover/Installer (HD-48921)',
      'Press (hydraulic)'
    ],
    parts: [
      { number: '—', description: 'New rear wheel compensator isolator (rubber)', qty: 1 },
      { number: '—', description: 'New sprocket bearings', qty: 2 }
    ],
    torque: [],
    steps: [
      { n: 1, text: 'Check compensator sprocket isolator for wear. See REAR WHEEL COMPENSATOR (Page 3-19).' },
      { n: 2, text: 'Remove rear wheel. See REAR WHEEL (Page 3-14).' },
      { n: 3, text: 'See Figure 3-11. Remove rear wheel compensator. Pull sprocket (1) from rear wheel (3). Remove isolator (2) from wheel. Discard isolator.' },
      { n: 4, text: 'See Figure 3-11. Remove sprocket bearings (5). See Figure 3-13. Support the base (1) of REAR WHEEL COMPENSATOR SPROCKET BEARING REMOVER/INSTALLER (PART NUMBER: HD-48921) on a suitable press with the large OD facing up and the long pin facing down.' },
      { n: 5, text: 'Slide sleeve (2) over the short pin.' },
      { n: 6, text: 'Slide the sprocket inboard side up over the sleeve until it rests on the base.' },
      { n: 7, text: 'Slide the small OD of driver (3) over the sleeve until it contacts the spacer.' },
      { n: 8, text: 'Apply pressure to the driver until bearings drop into base.' },
      { n: 9, text: 'Remove tool.' },
      { n: 10, text: 'See Figure 3-11. Discard bearings (5).' },
      { n: 11, text: 'Clean all parts thoroughly. Verify that sprocket bearing bore is clean and dry.' },
      { n: 12, text: 'Inspect each tooth of the rear wheel sprocket for wear or damage. Replace as necessary. See REAR WHEEL COMPENSATOR (Page 3-19).' },
      { n: 13, text: 'See Figure 3-12. Lubricate each segment (2) of new isolator with equal mix of isopropyl alcohol and water.' },
      { n: 14, text: 'Push new isolator into wheel. Verify that each isolator segment is completely installed and is flush with each rib (1).' },
      { n: 15, text: 'See Figure 3-11. Push sprocket (1) onto wheel (3).' },
      { n: 16, text: 'See Figure 3-11. Install spacer (4) and new sprocket bearings (5). See Figure 3-13. Support the base (1) of REAR WHEEL COMPENSATOR SPROCKET BEARING REMOVER/INSTALLER (PART NUMBER: HD-48921) on a suitable press with the large OD facing up and the long pin facing down.' },
      { n: 17, text: 'Slide sleeve (2) over the short pin.' },
      { n: 18, text: 'Slide the sprocket outboard side up over the sleeve until it rests on the base.' },
      { n: 19, text: 'Install spacer in the sprocket with the small diameter facing down.' },
      { n: 20, text: 'Set first new bearing in place.' },
      { n: 21, text: 'Center the large OD of driver (3) onto the bearing. Verify that the driver contacts complete radius of the outer bearing race.' },
      { n: 22, text: 'Apply pressure to the driver until the bearing is firmly seated in the counterbore of the sprocket.' },
      { n: 23, text: 'Repeat for second new bearing.' },
      { n: 24, text: 'Install rear wheel. See REAR WHEEL (Page 3-14).' }
    ]
  },

  {
    id: 't20-sealed-wheel-bearings',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Sealed Wheel Bearings — Remove & Install',
    summary: 'Remove and install sealed wheel bearings using bearing installer/remover tool (HD-44060D). Replace both bearings as a set. Includes inspection, cleaning, and bearing orientation.',
    difficulty: 'Advanced',
    timeMinutes: 90,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 121 },
    figures: [
      { file: '/figures/t20/fig-3-14.png', caption: 'Wheel Bearing Inspection (Front Wheel Shown)', stepRefs: [1, 2] },
      { file: '/figures/t20/fig-3-15.png', caption: 'Assemble WHEEL BEARING', stepRefs: [3, 4] },
      { file: '/figures/t20/fig-3-16.png', caption: 'If the puller bridge does not have adequate', stepRefs: [4] },
      { file: '/figures/t20/fig-3-18.png', caption: 'Remove spacer sleeve from inside', stepRefs: [5] },
      { file: '/figures/t20/fig-3-19.png', caption: 'Assembling Installation Tool', stepRefs: [1] },
      { file: '/figures/t20/fig-3-20.png', caption: 'Installing Bearings', stepRefs: [2] }
    ],
    tools: [
      'Wheel Bearing Installer/Remover (HD-44060D)',
      'Collet HD-44060-10A (non-ABS)',
      'Collet HD-44060-11A (ABS)',
      'Magnetic base dial indicator'
    ],
    parts: [
      { number: '—', description: 'New sealed wheel bearings (qty 2 per wheel)', qty: 2 }
    ],
    torque: [],
    steps: [
      { n: 1, text: 'Raise front or rear wheel. See Secure the Motorcycle for Service (Page 2-3).' },
      { n: 2, text: 'Raise the wheel. Turn the wheel through several rotations.', warning: 'Keep wheel speed sensor and ABS encoder bearing away from magnetic fields. When checking end play, pull or push on the wheel not the brake disc. Pulling or pushing brake disc can distort disc causing a false end play reading.' },
      { n: 3, text: 'Check end play. See Figure 3-14. Mount a magnetic base dial indicator to the brake disc. Set the indicator contact point on the end of the axle.' },
      { n: 4, text: 'Firmly push the wheel to one side. Zero the dial indicator gauge. Firmly pull the wheel back. Note the reading of the dial indicator. Repeat the procedure to verify the reading.' },
      { n: 5, text: 'Replace the bearings if end play exceeds 0.002 in (0.051 mm) or if there is drag, rough rotation or abnormal noise.' },
      { n: 6, text: 'Remove wheel. See FRONT WHEEL (Page 3-12) or REAR WHEEL (Page 3-14).' },
      { n: 7, text: 'Rear wheel: Remove sprocket.' },
      { n: 8, text: 'See Figure 3-15. Assemble WHEEL BEARING INSTALLER/REMOVER (PART NUMBER: HD-44060D). Lubricate forcing screw. Install nut (2), washer (3) and bearing (4) on screw. Insert assembly through hole in bridge (5).', warning: 'Choose the appropriate collet to remove the bearing. Non-ABS models: Use COLLET (PART NUMBER: HD-44060-10A). ABS models: Use COLLET (PART NUMBER: HD-44060-11A).' },
      { n: 9, text: 'Install ball bearing inside collet (6). Fasten collet and ball bearing to forcing screw (1).', warning: 'If the puller bridge does not have adequate support, place a scrap brake disc having the small center hole to support the puller bridge. OE disc removal is not necessary. Place the scrap disc directly over the OE disc mounting screws. If the OE disc has been removed, place tape or other protective material between hub and scrap disc to prevent cosmetic damage.' },
      { n: 10, text: 'See Figure 3-15. Hold end of forcing screw (1) and turn collet (6) to expand edges of collet.' },
      { n: 11, text: 'See Figure 3-17. Hold forcing screw (1) and turn nut (2) to remove bearing.' },
      { n: 12, text: 'See Figure 3-18. Remove spacer sleeve (6) from inside wheel hub.' },
      { n: 13, text: 'Repeat on opposite side.' },
      { n: 14, text: 'Discard all bearings.' },
      { n: 15, text: 'See Figure 3-19. Assemble WHEEL BEARING INSTALLER/REMOVER (PART NUMBER: HD-44060D). Lubricate threaded rod. Install support plate (2) onto rod (1). Insert assembly through wheel from the side opposite the primary brake side.', warning: 'Replace both bearing assemblies even if one assembly appears to be good. Mismatched bearings can lead to excessive wear and premature replacement.' },
      { n: 16, text: 'See Figure 3-20. Place new bearing on the rod. Non-ABS bearing: Lettered side against installer (5). ABS bearing: Red side against wheel. Place 1-inch installer (Part No. HD-44060-8) (5), bearing (4), washer (3) and nut (2) over rod.', warning: 'Install first bearing on primary brake disc side of hub. Install ABS bearing on the primary brake disc side of the wheel. Primary side of the wheel is the brake rotor side. For dual disc front wheels, the primary side is the left side. Disc mounting surface for primary brake side of hub has one or two grooves. Bearing orientation is important.' },
      { n: 17, text: 'Install bearings. Hold hex end of threaded rod (1) and turn nut (2).' },
      { n: 18, text: 'Bearing is fully seated when nut can no longer be turned.' },
      { n: 19, text: 'Remove tool. Install spacer sleeve inside wheel hub. Reverse tool.' },
      { n: 20, text: 'Install opposite side bearing until bearing contacts spacer sleeve.' },
      { n: 21, text: 'Rear wheel: Install sprocket.' },
      { n: 22, text: 'Install wheel. See FRONT WHEEL (Page 3-12) or REAR WHEEL (Page 3-14).' },
      { n: 23, text: 'Lower wheel.' }
    ]
  },

  {
    id: 't20-tire-pressure-monitoring-system',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Tire Pressure Monitoring System (TPMS) Sensor',
    summary: 'Install TPMS sensor in wheel rim with valve stem. Torque valve stem 23-27 in-lbs. Requires activation using TPMS tool and Digital Technician II for new sensors.',
    difficulty: 'Easy',
    timeMinutes: 20,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 124 },
    figures: [
      { file: '/figures/t20/fig-3-21.png', caption: 'Tire Fill Valve/TPMS', stepRefs: [1, 2] }
    ],
    tools: ['TPMS Activation Tool (HD-51794)', 'Digital Technician II (HD-48650)'],
    parts: [
      { number: '—', description: 'New tire pressure sensor (if replacing)', qty: 1 },
      { number: '—', description: 'New valve stem with O-ring', qty: 1 },
      { number: '—', description: 'Pre-applied threadlocker screw', qty: 1 }
    ],
    torque: [
      { fastener: 'Valve stem', value: '23-27 in-lbs (2.6-3 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove wheel. See FRONT WHEEL (Page 3-12) or REAR WHEEL (Page 3-14).' },
      { n: 2, text: 'Remove tire. See TIRES (Page 3-26).' },
      { n: 3, text: 'Check wheels for lateral and radial runout. See CHECKING AND TRUING WHEELS (Page 3-17).' },
      { n: 4, text: 'See Figure 3-21. Remove sensor (1). Remove screw (2). Remove valve stem (6) and o-ring (4). Remove sensor (1) from wheel.' },
      { n: 5, text: 'Clean valve stem mounting location.' },
      { n: 6, text: 'See Figure 3-21. Install new valve stem and sensor in wheel. Install tire pressure sensor (1) in slot in wheel.', warning: 'Tire pressure sensors are designed for use with the wheels specified for the motorcycle. Attempting to use sensors on other wheels can result in lack of proper fitment, TPMS malfunction and air leakage. Sensors with good batteries can be reused. Never install a used valve stem, O-ring or screw. New screw (2) has pre-applied threadlocker.' },
      { n: 7, text: 'Install new 0-ring (4) on valve stem (6). Align orientation slot (5) with rail in tire pressure sensor (1).' },
      { n: 8, text: 'While holding valve stem aligned with wheel, tighten. Torque: 23-27 in-lbs (2.6-3 N·m) Valve stem' },
      { n: 9, text: 'Do not attempt to rotate valve stem once it is installed on wheel.' },
      { n: 10, text: 'Install the tire. See TIRES (Page 3-26).' },
      { n: 11, text: 'Install tire. See TIRES (Page 3-26).' },
      { n: 12, text: 'New sensor: Before riding motorcycle, assign using TPMS activation tool with DT II (Digital Technician II). Special Tool: TPMS ACTIVATION TOOL (HD-51794). Special Tool: DIGITAL TECHNICIAN II (HD-48650)' },
      { n: 13, text: 'Connect Digital Technician II to vehicle. Go to Toolbox > Vehicle Setup > TPMS > Configure. Select sensor assignment.' },
      { n: 14, text: 'Follow the online instructions to configure system to recognize sensors.', warning: 'The sensor must be in PARK mode (have been at rest for approximately 7 minutes) to assign to the vehicle. This includes spin balancing or riding the motorcycle.' }
    ]
  },

  {
    id: 't20-tires-remove-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Tires — Remove & Install',
    summary: 'Remove and install motorcycle tires with proper bead breaking, mounting, and balancing. Special procedures for TPMS-equipped wheels. Includes tire inspection and repair guidelines.',
    difficulty: 'Moderate',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 126 },
    figures: [
      { file: '/figures/t20/fig-3-22.png', caption: 'Tread Wear Indicators (Typical)', stepRefs: [1] },
      { file: '/figures/t20/fig-3-23.png', caption: 'Tire Machine Operation', stepRefs: [2, 3] },
      { file: '/figures/t20/fig-3-24.png', caption: 'Tubeless Tire Valve Stems', stepRefs: [4] },
      { file: '/figures/t20/fig-3-25.png', caption: 'Checking Tire Lateral Runout', stepRefs: [5] },
      { file: '/figures/t20/fig-3-26.png', caption: 'Checking Tire Radial Runout', stepRefs: [6] },
      { file: '/figures/t20/fig-3-27.png', caption: 'Weight Segment Alignment', stepRefs: [8] },
      { file: '/figures/t20/fig-3-28.png', caption: 'Wheel Weight Placement', stepRefs: [8] }
    ],
    tools: ['Tire machine', 'Tire irons', 'Wheel balancer', 'Valve stem tools'],
    parts: [
      { number: '—', description: 'New tire (per model spec)', qty: 1 },
      { number: '—', description: 'Valve stem (if needed)', qty: 1 },
      { number: '—', description: 'Wheel weights (as needed)', qty: 1 }
    ],
    torque: [
      { fastener: 'Valve stem nut', value: '12-15 in-lbs (1.4-1.7 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove wheel. See FRONT WHEEL (Page 3-12) or REAR WHEEL (Page 3-14).', warning: 'Be sure tires are properly inflated, balanced, undamaged, and have adequate tread. Inspect your tires regularly and see a Harley-Davidson dealer for replacements. Riding with excessively worn, unbalanced, improperly inflated, overloaded or damaged tires can lead to tire failure and adversely affect stability and handling, which could result in death or serious injury. Always maintain proper tire pressure. Check runout on wheel before installing a new tire.' },
      { n: 2, text: 'Check wheels for lateral and radial runout. See Checking Wheel Runout (Page 3-17).' },
      { n: 3, text: 'See Figure 3-23. Models With TPMS: Engage tire machine spoon (1) 30 degrees (4) from the valve stem (2) in the direction of tire machine rotation (3).', warning: 'Wheels equipped with tire pressure sensors require special tire mounting and dismounting procedures. Failure to follow these procedures results in damaged sensors. Never allow tire machine spoon, tire iron or tire bead to contact sensor. Sensor damage will occur. Take care when replacing tire to prevent cosmetic damage to wheel. Break the bead being careful to not damage tire pressure sensor.' },
      { n: 4, text: 'While rotating wheel away from valve stem, remove the first bead.' },
      { n: 5, text: 'Repeat with remaining bead. Remove tire.' },
      { n: 6, text: 'Models Without TPMS: Deflate tire. Loosen both tire beads from rim flange. Remove tire.' },
      { n: 7, text: 'Clean the inside of tire. Clean rim bead area with a stiff wire brush.' },
      { n: 8, text: 'Verify wheel is true. See CHECKING AND TRUING WHEELS (Page 3-17). Check tire tread depth.' },
      { n: 9, text: 'Inspect tire for punctures or tears. Small punctures can be repaired.', warning: 'Replace punctured or damaged tires. In some cases, small punctures in the tread area may be repaired from within the removed tire by a Harley-Davidson dealer. Speed should NOT exceed 50 mph (80 km/h) for the first 24 hours after repair, and the repaired tire should NEVER be used over 80 mph (129 km/h). Failure to follow this warning could lead to tire failure and result in death or serious injury.' },
      { n: 10, text: 'Repair tread on tubeless tires if puncture is at dimension or smaller: 1/4 in (6.4 mm). Make repairs from inside the tire. Always combine a patch and plug when repairing tire.' },
      { n: 11, text: 'See Figure 3-23. Models With TPMS: Install tire on wheel. Start the first bead opposite from the valve stem.', warning: 'Harley-Davidson recommends the use of its specified tires. Harley-Davidson vehicles are not designed for operation with non-specified tires, including snow, moped and other special-use tires. Use of non-specified tires can adversely affect stability, handling or braking and lead to loss of vehicle control, which could result in death or serious injury. Harley-Davidson front and rear tires are not the same. Interchanging front and rear tires can cause tire failure, which could result in death or serious injury. Do not exceed manufacturer\'s recommended pressure to seat beads. Exceeding recommended bead seat pressure can cause tire rim assembly to burst, which could result in death or serious injury.' },
      { n: 12, text: 'Install first bead. Engage the second bead 30 degrees from the valve stem in the direction of machine rotation.' },
      { n: 13, text: 'While rotating away from the valve stem, install the second bead. Inflate to the correct pressure. Refer to INSPECT TIRES AND WHEELS (Page 2-15).', warning: 'Mount tires with arrows molded into the tire sidewall pointing in the direction of forward rotation. If tire has a balance dot on the sidewall, align the balance dot with the valve stem.' },
      { n: 14, text: 'Models Without TPMS: Only install original equipment tire valves and valve caps. A valve, or valve and cap combination, that is too long or too heavy can strike adjacent components and damage the valve, causing rapid tire deflation. Rapid tire deflation can cause loss of vehicle control, which could result in death or serious injury.', warning: 'Only install original equipment tire valves and valve caps.' },
      { n: 15, text: 'Replace damaged or leaking valve stems. See Figure 3-24. Metal valve stem: Install rubber grommet (5) on valve stem. Insert valve stem into rim hole. Install metal washer (4) and nut (3). Tighten. Torque: 12-15 in-lbs (1.4-1.7 N·m) Valve stem nut' },
      { n: 16, text: 'Rubber valve stem: Cut old valve stem to remove. Install new valve stem. Verify that valve stem is securely seated. Install tire. Balance wheel.' },
      { n: 17, text: 'Check tire pressure. See Figure 3-25. Spin the wheel and measure lateral runout from a fixed point to a smooth area on the tire sidewall.' },
      { n: 18, text: 'If lateral runout exceeds 0.090 in (2.29 mm), remove tire from rim and check rim lateral runout. See CHECKING AND TRUING WHEELS (Page 3-17). If rim runout is within specification, replace faulty tire. If rim runout is not within specification, replace wheel.' },
      { n: 19, text: 'Check tire pressure. See Figure 3-26. Spin the wheel on the axle and measure radial runout at the tread centerline. If tire runout exceeds 0.090 in (2.29 mm), remove tire from rim and check rim radial runout.' },
      { n: 20, text: 'If rim runout is within specification, replace faulty tire. If rim runout is not within specification, replace wheel. See CHECKING AND TRUING WHEELS (Page 3-17).' },
      { n: 21, text: 'Static balancing will produce satisfactory results for normal highway speeds. Dynamic balancing can produce better results for deceleration. The maximum weight permissible to accomplish balance is 3.5 oz (99.2 g) (total weight applied to the rim).' },
      { n: 22, text: 'If more than 3.5 oz (99.2 g) of weight is required, rotate the tire 180 degrees on the rim and again balance the assembly. Balance wheels to within 0.5 oz (14 g).', warning: 'If adding more than 1.5 oz (43 g) of weight at one location, divide the amount so that half is applied to each side of rim. On cast wheels without a flat area near the bead, place the weights crosswise through the opening.' },
      { n: 23, text: 'See Figure 3-28. Place weights on a smooth surface of the wheel rim such that centrifugal force will help keep them in place. Make sure the area of application is completely clean, dry, and free of oil and grease.', warning: 'When installing wheel weights, consider cosmetics. Keep snaking (1) within 0.040 in (1.02 mm) (2) of straight. Also keep the angle alignment of individual segments (3) within 3 degrees.' },
      { n: 24, text: 'Remove paper backing from the weight. Press firmly in place and hold for ten seconds.' },
      { n: 25, text: 'Install wheel. See FRONT WHEEL (Page 3-12) or REAR WHEEL (Page 3-14).' }
    ]
  },

  {
    id: 't20-front-brake-master-cylinder',
    bikeIds: ['touring-2020'],
    system: 'brakes',
    title: 'Front Brake Master Cylinder — Remove, Rebuild & Install',
    summary: 'Remove, disassemble, clean, and reassemble front brake master cylinder. Includes reservoir cover, piston assembly, and seals. Torque: clamp screw 60-80 in-lbs, banjo bolt 17-19 ft-lbs.',
    difficulty: 'Advanced',
    timeMinutes: 90,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 131 },
    figures: [
      { file: '/figures/t20/fig-3-29.png', caption: 'Hand Control Assembly (typical)', stepRefs: [1, 2] },
      { file: '/figures/t20/fig-3-30.png', caption: 'Front Brake Master Cylinder Assembly', stepRefs: [1, 2] }
    ],
    tools: ['Torque wrench (in-lb)', 'Snap ring tools', 'Brake spring hook'],
    parts: [
      { number: '—', description: 'New piston assembly', qty: 1 },
      { number: '—', description: 'New spring', qty: 1 },
      { number: '—', description: 'New retaining ring', qty: 1 },
      { number: '—', description: 'Anti-bubble button', qty: 1 }
    ],
    torque: [
      { fastener: 'Front master cylinder banjo bolt', value: '17-19 ft-lbs (23.1-25.8 N·m)', note: '' },
      { fastener: 'Front master cylinder clamp screw', value: '60-80 in-lbs (6.8-9 N·m)', note: 'Position for rider comfort. Tighten top screw then bottom.' }
    ],
    steps: [
      { n: 1, text: 'Remove main fuse. See FUSES AND RELAYS (Page 8-6).', warning: 'If DOT 4 brake fluid contacts painted surfaces, IMMEDIATELY flush area with clear water.' },
      { n: 2, text: 'FLHRXS: Remove front turn signal lamp and mirror. See MIRRORS (Page 3-132).' },
      { n: 3, text: 'Drain brake fluid. Remove reservoir cover. Remove banjo bolt from master cylinder. Discard sealing washers.' },
      { n: 4, text: 'Drain into container. Wrap banjo fitting with shop towel to absorb loss of fluid.' },
      { n: 5, text: 'See Figure 3-29. Remove screws (3). Remove clamp (4). Remove hand control assembly.' },
      { n: 6, text: 'See Figure 3-30. Remove retaining ring (8). Discard retaining ring.' },
      { n: 7, text: 'Remove pivot pin (6) and brake lever (7).' },
      { n: 8, text: 'Remove dust boot and pushrod assembly (9).' },
      { n: 9, text: 'While holding pressure against piston assembly (11), remove retaining ring (10).' },
      { n: 10, text: 'Remove and discard piston assembly and spring.' },
      { n: 11, text: 'If necessary, remove anti-bubble button (14).' },
      { n: 12, text: 'Clean all parts thoroughly.', warning: 'Use denatured alcohol to clean brake system components. Do not use mineral-based solvents (such as gasoline or paint thinner), which will deteriorate rubber parts even after assembly. Deterioration of these components can cause brake failure, which could result in death or serious injury. Even residual mineral-based oils and grease can deteriorate rubber brake components. Wash hands before handling brake components. Never use oily rags to wipe brake components.' },
      { n: 13, text: 'Using a clean air supply, clear piston bore, reservoir and drilled passages. Do not use a wire or similar instrument.' },
      { n: 14, text: 'Inspect parts for wear or damage. Inspect banjo seating surface for scratches or nicks. Inspect piston bore. Inspect dust boot retaining groove. Inspect dust boot and reservoir cover gasket. Inspect lever and pivot pin.' },
      { n: 15, text: 'See Figure 3-30. Lightly lubricate piston bore and OD of piston seals with DOT 4 BRAKE FLUID.', warning: 'Never install a used piston assembly or spring. Always install new parts.' },
      { n: 16, text: 'Install new piston assembly (11). Push and hold piston assembly into bore. Install new retaining ring (10) with the flat side in. Verify that retaining ring is seated in groove.' },
      { n: 17, text: 'Install pushrod/dust boot (9). Verify that dust boot is secure in groove of piston bore.' },
      { n: 18, text: 'Anti-bubble button (14) is a friction fit. Install with convex side up (see inset).' },
      { n: 19, text: 'Install anti-bubble button (14).' },
      { n: 20, text: 'Baffle (15) is used only for painted front master cylinders. Loosely install cover (3), baffle (15) and gasket (4).' },
      { n: 21, text: 'Install lever, pivot pin (6) and new retaining ring (8).' },
      { n: 22, text: 'See Figure 3-29. Engage ear (1) in recess (2).' },
      { n: 23, text: 'Install clamp (4). Install screws (3). Position for rider comfort. Tighten top screw then bottom. Torque: 60-80 in-lbs (6.8-9 N·m) Front master cylinder clamp screw' },
      { n: 24, text: 'Install brake line. Install banjo bolt, brake line and new sealing washers. Verify that the line does not touch the handlebar or fairing when handlebar is turned. Adjust as needed and tighten. Torque: 17-19 ft-lbs (23.1-25.8 N·m) Front master cylinder banjo bolt', warning: 'Avoid leakage. Be sure gaskets, banjo bolt(s), brake line and master cylinder bore are clean and undamaged before assembly. Do not scratch or nick banjo sealing surface during handling.' },
      { n: 25, text: 'Fill and bleed front brake system. See BLEED BRAKES (Page 3-56).' },
      { n: 26, text: 'FLHRXS: Install mirror and turn signal lamp. See MIRRORS (Page 3-132).' }
    ]
  },

  {
    id: 't20-front-brake-caliper',
    bikeIds: ['touring-2020'],
    system: 'brakes',
    title: 'Front Brake Caliper — Remove, Assemble & Install',
    summary: 'Remove and install front brake caliper with pads and springs. For pad replacement only, see INSPECT BRAKES. Torque: mounting screws 28-38 ft-lbs, banjo bolt 17-19 ft-lbs.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 134 },
    figures: [
      { file: '/figures/t20/fig-3-31.png', caption: 'Front Brake Caliper Assembly', stepRefs: [1, 2] },
      { file: '/figures/t20/fig-3-32.png', caption: 'Secure Cables and Brake Hose', stepRefs: [3] }
    ],
    tools: ['Torque wrench (ft-lb)', 'Hex socket set'],
    parts: [],
    torque: [
      { fastener: 'Front caliper mounting screw', value: '28-38 ft-lbs (38-51.5 N·m)', note: '' },
      { fastener: 'Front caliper banjo bolt', value: '17-19 ft-lbs (23-26 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove banjo bleeder bolt.', warning: 'If DOT 4 brake fluid contacts painted surfaces, IMMEDIATELY flush area with clear water. If only replacing brake pads, see INSPECT BRAKES (Page 2-19)' },
      { n: 2, text: 'Discard sealing washers.' },
      { n: 3, text: 'See Figure 3-31. Remove caliper mounting screws (2). Remove caliper (1) from brake disc.' },
      { n: 4, text: 'Assemble caliper. See INSPECT BRAKES (Page 2-19).' },
      { n: 5, text: 'Install caliper. ABS models: Install WSS cable clip and bracket when installing left caliper.' },
      { n: 6, text: 'Install caliper with screws (2). Tighten. Torque: 28-38 ft-lbs (38-51.5 N·m) Front caliper mounting screw' },
      { n: 7, text: 'ABS models: Verify that WSS cable is secure in clip. See Figure 3-32. Install new cable straps (1, 2) to secure WSS and fender tip lamp cables.' },
      { n: 8, text: 'Install brake line, banjo bleeder bolt and new sealing washers to caliper. Tighten. Torque: 17-19 ft-lbs (23-26 N·m) Front caliper banjo bolt' },
      { n: 9, text: 'Install bleeder screw if removed. If present, discard O-ring from bleeder screw groove or bore in banjo bleeder bolt. Install bleeder screw finger-tight.' },
      { n: 10, text: 'Bleed brake system. See BLEED BRAKES (Page 3-56).' }
    ]
  },

  {
    id: 't20-rear-brake-master-cylinder',
    bikeIds: ['touring-2020'],
    system: 'brakes',
    title: 'Rear Brake Master Cylinder — Remove, Rebuild & Install',
    summary: 'Remove, disassemble, clean, and reassemble rear brake master cylinder. Includes brake pedal assembly integration. Torque: master cylinder screws 126-150 in-lbs, pedal locknut 180-240 in-lbs.',
    difficulty: 'Advanced',
    timeMinutes: 90,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 136 },
    figures: [
      { file: '/figures/t20/fig-3-33.png', caption: 'Rear Master Cylinder/Brake Pedal Assembly', stepRefs: [1] },
      { file: '/figures/t20/fig-3-34.png', caption: 'Rear Brake Master Cylinder Assembly', stepRefs: [1, 2] }
    ],
    tools: ['Torque wrench (in-lb)', 'Snap ring tools', 'Bearing grease'],
    parts: [
      { number: '—', description: 'New O-rings (qty 2)', qty: 2 },
      { number: '—', description: 'New retaining ring', qty: 1 },
      { number: '—', description: 'Wheel bearing grease', qty: 1 }
    ],
    torque: [
      { fastener: 'Brake pedal shaft locknut', value: '180-240 in-lbs (20.3-27.1 N·m)', note: '' },
      { fastener: 'Master cylinder screws', value: '126-150 in-lbs (14.2-17 N·m)', note: '' },
      { fastener: 'Rear master cylinder banjo bolt', value: '17-19 ft-lbs (23-25.8 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove main fuse. FUSES AND RELAYS (Page 8-6).', warning: 'If DOT 4 brake fluid contacts painted surfaces, IMMEDIATELY flush area with clear water. Do not allow dirt or debris to enter the master cylinder reservoir. Dirt or debris in the reservoir can cause improper operation and equipment damage.' },
      { n: 2, text: 'Stand motorcycle upright (not leaning on jiffy stand) on a level surface.' },
      { n: 3, text: 'Remove right side rider footboard. See RIDER FOOTRESTS (Page 3-142).' },
      { n: 4, text: 'Drain brake fluid. Remove reservoir cover. Remove banjo bolt from master cylinder. Discard sealing washers.' },
      { n: 5, text: 'Allow fluid to drain into container. Wrap banjo fitting with piece of shop towel to absorb any loss of brake fluid.' },
      { n: 6, text: 'Remove master cylinder and pedal assembly. Remove screws securing master cylinder. Remove locknut and flat washer securing brake pedal. Pull brake pedal/master cylinder assembly from pedal shaft. Discard O-rings from each side of brake pedal shaft bore.' },
      { n: 7, text: 'See Figure 3-33. Disassemble master cylinder from brake pedal. Remove cotter pin (4) and flat washer (5) from clevis pin. Remove clevis pin (3). Separate master cylinder assembly from brake pedal.' },
      { n: 8, text: 'See Figure 3-34. Remove dust boot (9).' },
      { n: 9, text: 'Push and hold flat washer (11). Remove E-clip (10) from pushrod. Carefully release spring tension.' },
      { n: 10, text: 'Remove flat washer (11) and pedal return spring (12).' },
      { n: 11, text: 'Push and hold end of piston. Remove retaining ring (13).' },
      { n: 12, text: 'Remove pushrod (15) and special washer (14).' },
      { n: 13, text: 'Pull piston assembly from piston bore.' },
      { n: 14, text: 'Clean all parts thoroughly.', warning: 'Use denatured alcohol to clean brake system components. Do not use mineral-based solvents (such as gasoline or paint thinner), which will deteriorate rubber parts even after assembly. Even residual mineral-based oils and grease can deteriorate rubber brake components. Wash hands before handling brake components. Never use oily rags to wipe brake components.' },
      { n: 15, text: 'Verify that reservoir is free of dust, dirt or residue. Using a clean air supply, clear piston bore, reservoir and drilled passages. Do not use a wire or similar instrument.' },
      { n: 16, text: 'Inspect parts for wear or damage. Inspect banjo seating surface for scratches or nicks. Inspect piston bore. Inspect dust boot retaining groove. Inspect dust boot and reservoir cover gasket. Inspect E-clip for wear or distortion. Inspect retaining ring groove and E-clip groove for damage.' },
      { n: 17, text: 'Inspect springs for stretching, distortion, kinks, cracks or fractured coils.' },
      { n: 18, text: 'Lightly lubricate piston bore and OD of piston seals with DOT 4 BRAKE FLUID. See Figure 3-34. Insert piston assembly (16) into piston bore.' },
      { n: 19, text: 'Slide special washer (14), with collar facing outer end of pushrod and new retaining ring (13) over pushrod.' },
      { n: 20, text: 'Hold piston assembly in and install retaining ring with flat side in. Verify that retaining ring is seated in groove.' },
      { n: 21, text: 'Seat pedal return spring (12) on retaining ring.' },
      { n: 22, text: 'Slide flat washer (11) over pushrod. Compress pedal return spring and install E-clip (10) in inboard groove of pushrod.' },
      { n: 23, text: 'Install dust boot (9).' },
      { n: 24, text: 'See Figure 3-34. Assemble master cylinder to brake pedal. Install master cylinder assembly onto brake pedal flange. Install clevis pin (3) from outboard side. Install flat washer (5) and cotter pin (4) on clevis pin.' },
      { n: 25, text: 'Install brake pedal master cylinder assembly. Apply a light coat of WHEEL BEARING GREASE to brake pedal shaft and bore. Install new O-ring (2) on each side of bore. Install brake pedal/master cylinder assembly on pedal shaft.' },
      { n: 26, text: 'Install flat washer and new locknut. Install screws securing master cylinder. Tighten. Torque: 126-150 in-lbs (14.2-17 N·m) Master cylinder screws' },
      { n: 27, text: 'Tighten brake pedal shaft locknut. Torque: 180-240 in-lbs (20.3-27.1 N·m) Brake pedal shaft locknut' },
      { n: 28, text: 'Install brake line, banjo bolt and new sealing washers. Tighten. Torque: 17-19 ft-lbs (23-25.8 N·m) Rear master cylinder banjo bolt', warning: 'Do not scratch or nick banjo sealing surface during handling.' },
      { n: 29, text: 'Fill and bleed brake system. See BLEED BRAKES (Page 3-56).' },
      { n: 30, text: 'Install right side rider footboard. See RIDER FOOTRESTS (Page 3-142).' },
      { n: 31, text: 'Install main fuse. See FUSES AND RELAYS (Page 8-6).' }
    ]
  },

  {
    id: 't20-rear-brake-caliper',
    bikeIds: ['touring-2020'],
    system: 'brakes',
    title: 'Rear Brake Caliper — Remove, Assemble & Install',
    summary: 'Remove and install rear brake caliper with pads and springs. For pad replacement only, see INSPECT BRAKES. Torque: mounting screws 43-48 ft-lbs, banjo bolt 17-19 ft-lbs.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 139 },
    figures: [
      { file: '/figures/t20/fig-3-35.png', caption: 'Rear Brake Caliper Assembly', stepRefs: [1, 2] }
    ],
    tools: ['Torque wrench (ft-lb)', 'Hex socket set'],
    parts: [],
    torque: [
      { fastener: 'Rear caliper mounting screw', value: '43-48 ft-lbs (58.3-65.1 N·m)', note: '' },
      { fastener: 'Rear caliper banjo bolt', value: '17-19 ft-lbs (23.1-25.8 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove right saddlebag. See SADDLEBAGS (Page 3-161).', warning: 'If DOT 4 brake fluid contacts painted surfaces, IMMEDIATELY flush area with clear water. If only replacing brake pads, see INSPECT BRAKES (Page 2-19).' },
      { n: 2, text: 'Remove banjo bolt. Discard sealing washers.' },
      { n: 3, text: 'See Figure 3-35. Remove screws (2). Remove caliper from brake disc.' },
      { n: 4, text: 'If necessary, remove caliper bracket (3). See REAR WHEEL (Page 3-14)' },
      { n: 5, text: 'See Figure 3-35. Install caliper bracket (3), if removed. See REAR WHEEL (Page 3-14).' },
      { n: 6, text: 'Assemble caliper. See INSPECT BRAKES (Page 2-19).' },
      { n: 7, text: 'Install caliper with screws (2). Tighten. Torque: 43-48 ft-lbs (58.3-65.1 N·m) Rear caliper mounting screw' },
      { n: 8, text: 'Install brake line, banjo bleeder bolt and new sealing washers to caliper. Tighten. Torque: 17-19 ft-lbs (23.1-25.8 N·m) Rear caliper banjo bolt' },
      { n: 9, text: 'Install bleeder screw if removed. If present, discard the O-ring from the bleeder screw groove or bore in banjo bleeder bolt. Install bleeder screw finger-tight.' },
      { n: 10, text: 'Bleed brake system. See BLEED BRAKES (Page 3-56).' },
      { n: 11, text: 'Install right saddlebag. See SADDLEBAGS (Page 3-161).' }
    ]
  },

  {
    id: 't20-brake-lines-front-non-abs',
    bikeIds: ['touring-2020'],
    system: 'brakes',
    title: 'Brake Lines — Front (Non-ABS)',
    summary: 'Remove and install front brake line on non-ABS models. Disconnect from master cylinder and calipers. Secure with retainers and cable straps. Torque banjo bolts 17-19 ft-lbs.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 140 },
    figures: [
      { file: '/figures/t20/fig-3-36.png', caption: 'Capture Clutch and Brake Fluid Lines', stepRefs: [1] },
      { file: '/figures/t20/fig-3-37.png', caption: 'Capture Brake Hose and Front Fender Tip', stepRefs: [2] }
    ],
    tools: ['Torque wrench (ft-lb)', 'Vacuum brake bleeder (BB200A)'],
    parts: [
      { number: '—', description: 'New brake line (if replacing)', qty: 1 },
      { number: '—', description: 'New sealing washers (per connection)', qty: 2 }
    ],
    torque: [
      { fastener: 'Banjo bolt to front caliper', value: '17-19 ft-lbs (23.1-25.8 N·m)', note: '' },
      { fastener: 'Banjo bolt to front master cylinder', value: '17-19 ft-lbs (23.1-25.8 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Road King models: Remove right side headlamp nacelle. See HEADLAMP NACELLE (Page 3-86). See Figure 3-36. Cut cable straps (1, 2).' },
      { n: 2, text: 'Fairing models, fork-mounted: Rotate the upper fairing. See FAIRING: FORK MOUNTED (Page 3-88). See Figure 3-36. Cut cable straps (1, 2). Low models: Cut cable strap near lower bend on handlebar.' },
      { n: 3, text: 'Fairing models, frame-mounted: Remove instrument nacelle. See FAIRING: FRAME MOUNTED (Page 3-100). See Figure 3-36. Cut cable straps (2).' },
      { n: 4, text: 'Clean master cylinder reservoir cover before removal. For best results, use BASIC VACUUM BRAKE BLEEDER (PART NUMBER: BB200A) or equivalent to drain brake system.' },
      { n: 5, text: 'Drain front brake lines. Remove cover from master cylinder reservoir. Attach vacuum brake bleeder to either front caliper bleeder screw. Loosen screw 3/4 turn.' },
      { n: 6, text: 'Operate vacuum bleeder to evacuate all fluid from master cylinder and line. Repeat with remaining caliper.' },
      { n: 7, text: 'Wipe out any remaining fluid inside master cylinder reservoir with a clean, lint-free cloth.' },
      { n: 8, text: 'Remove front brake line. Remove banjo bolt from master cylinder. Discard sealing washers.' },
      { n: 9, text: 'See Figure 3-37. Cut cable straps from left brake hose. Remove front brake line from retainer on lower fork bracket. Remove banjo bolts from both front brake calipers. Discard sealing washers. Remove brake line.' },
      { n: 10, text: 'Secure brake line in lower fork bracket retainer. Position brake line in retainer. Latch retainer closed. Install a cable strap around retainer to secure retainer closed.' },
      { n: 11, text: 'Install brake line. Install brake line, banjo bolt and new sealing washers to master cylinder. Tighten. Torque: 17-19 ft-lbs (23.1-25.8 N·m) Banjo bolt to front master cylinder' },
      { n: 12, text: 'Install brake line, banjo/bleeder bolt and new sealing washers to caliper. Tighten. Torque: 17-19 ft-lbs (23.1-25.8 N·m) Banjo bolt to front caliper' },
      { n: 13, text: 'See Figure 3-37. Secure fender tip lamp and WSS wires to left brake hose with new cable straps.' },
      { n: 14, text: 'Road King models: See HEADLAMP NACELLE (Page 3-86). Secure brake line and clutch line to right riser with new cable strap (2). Secure brake line to clutch line with new cable strap (1). Install right side headlamp nacelle. See HEADLAMP NACELLE (Page 3-86).' },
      { n: 15, text: 'Fairing models, fork-mounted: See HEADLAMP NACELLE (Page 3-86). Secure brake line and clutch line to right riser with new cable strap (2). Secure brake line to clutch line with new cable strap (1). Low models: Secure brake line and harnesses near lower bend on handlebar with new cable strap. Install upper fairing. See FAIRING: FORK MOUNTED (Page 3-88).' },
      { n: 16, text: 'Verify that the brake line does not touch the handlebar or fairing when handlebar is turned. Adjust as needed.' },
      { n: 17, text: 'Fairing models, frame-mounted: See HEADLAMP NACELLE (Page 3-86). Secure brake line and clutch line to right riser with new cable strap (2). Install instrument nacelle. See FAIRING: FRAME MOUNTED (Page 3-100).' },
      { n: 18, text: 'Bleed brake system. See BLEED BRAKES (Page 3-56).' }
    ]
  },

  {
    id: 't20-brake-lines-rear-non-abs',
    bikeIds: ['touring-2020'],
    system: 'brakes',
    title: 'Brake Lines — Rear (Non-ABS)',
    summary: 'Remove and install rear brake line on non-ABS models. Route under frame rail with clips and retainers. Install stop lamp switch. Torque banjo bolts 17-19 ft-lbs.',
    difficulty: 'Advanced',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 141 },
    figures: [
      { file: '/figures/t20/fig-3-38.png', caption: 'Lower Frame Rail Line and Harness Retainers', stepRefs: [2] },
      { file: '/figures/t20/fig-3-39.png', caption: 'Rear Brake Line Assembly', stepRefs: [1, 2] }
    ],
    tools: ['Torque wrench (ft-lb)', 'Vacuum brake bleeder (BB200A)'],
    parts: [
      { number: '—', description: 'New brake line (if replacing)', qty: 1 },
      { number: '—', description: 'New sealing washers (per connection)', qty: 2 },
      { number: '99642-97', description: 'Loctite 243 Medium Strength Threadlocker', qty: 1 },
      { number: '99818-97', description: 'Loctite 565 Thread Sealant', qty: 1 }
    ],
    torque: [
      { fastener: 'Banjo bolt to rear caliper', value: '17-19 ft-lbs (23.1-25.8 N·m)', note: '' },
      { fastener: 'Banjo bolt to rear master cylinder', value: '17-19 ft-lbs (23.1-25.8 N·m)', note: '' },
      { fastener: 'Brake line clamp screw', value: '10-15 in-lbs (1.1-1.7 N·m)', note: '' },
      { fastener: 'Brake line, rear, P-clamp screw', value: '80-100 in-lbs (9-11.3 N·m)', note: '' },
      { fastener: 'Engine mount end cap', value: '42-48 ft-lbs (56.9-65 N·m)', note: '' },
      { fastener: 'Rear stop lamp switch', value: '12-15 ft-lbs (16.3-20.3 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove right saddlebag. See SADDLEBAGS (Page 3-161). Remove right side cover. Remove right side passenger footboard/footpeg. See PASSENGER FOOTRESTS (Page 3-144).' },
      { n: 2, text: 'Stand motorcycle upright (not leaning on jiffy stand) on a level surface. Clean master cylinder reservoir cover before removal. For best results, use BASIC VACUUM BRAKE BLEEDER (PART NUMBER: BB200A) or equivalent to drain the brake systems.' },
      { n: 3, text: 'Drain rear brake line. Remove cover from master cylinder reservoir. Attach vacuum brake bleeder to caliper bleeder screw. Loosen screw 3/4 turn. Operate vacuum bleeder to evacuate all fluid from master cylinder and line.' },
      { n: 4, text: 'Wipe out any remaining fluid inside master cylinder reservoir with a clean, lint-free cloth.' },
      { n: 5, text: 'See Figure 3-39. Remove right footboard/rear brake master cylinder. Remove banjo bolt (13) from master cylinder reservoir. Discard sealing washers. Support front of engine.' },
      { n: 6, text: 'Remove three screws securing front right engine mount end cap. Pull off end cap mount with footboard, master cylinder and brake pedal attached.' },
      { n: 7, text: 'See Figure 3-38. Remove brake line from multi-clamp. Remove HO2 sensor wires from clip on clamp. Remove screw (4). Open clamp to release brake line.' },
      { n: 8, text: 'Remove brake line. See Figure 3-39. Remove banjo bolt (2) from rear brake caliper. Discard sealing washers (1). Free rear brake line from electrical harness clips (6).' },
      { n: 9, text: 'Remove terminals from rear stop lamp switch (11). Remove fastener (5) securing P-clamp (4). Release line from retainers (14) securing line to frame.' },
      { n: 10, text: 'Free rear brake line hose from brake hose clips (3) on rear fork. Remove cable straps. Record locations for assembly. Remove rear brake line.' },
      { n: 11, text: 'See Figure 3-39. If installing new rear stop lamp switch (11), apply threadlocker. Install switch into rear brake line. Tighten. Torque: 12-15 ft-lbs (16.3-20.3 N·m) Rear stop lamp switch. Consumable: LOCTITE 565 THREAD SEALANT (99818-97)' },
      { n: 12, text: 'Install brake line. Place rear brake line into approximate position along top of lower right frame tube and top of rear fork. Install brake line, banjo bolt (2) and new sealing washers (1) to caliper. Tighten. Torque: 17-19 ft-lbs (23.1-25.8 N·m) Banjo bolt to rear caliper' },
      { n: 13, text: 'Capture rear brake line hose in two brake hose clips (3) on rear fork.' },
      { n: 14, text: 'See Figure 3-38. Secure P-clamp (4) with screw (5). Tighten. Torque: 80-100 in-lbs (9-11.3 N·m) Brake line, rear, P-clamp screw. Secure retainers (14).' },
      { n: 15, text: 'Secure brake line in clamps. See Figure 3-38. Capture rear brake line in lower clip of electrical harness retainers and upper passage of multi-clamp. Close multi-clamp to secure brake line and clutch line.' },
      { n: 16, text: 'Apply threadlocker to the threads of used screw (4). LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE) (99642-97). Install screw (4). Tighten. Torque: 10-15 in-lbs (1.1-1.7 N·m) Brake line clamp screw. Install front HO2 sensor wire in clip on clamp.' },
      { n: 17, text: 'Install right side front engine mount cap with rider footboard and master cylinder attached: Connect terminals onto rear stop lamp switch (11).' },
      { n: 18, text: 'Install engine mount end cap. Tighten. Torque: 42-48 ft-lbs (56.9-65 N·m) Engine mount end cap. Remove support under front of engine.' },
      { n: 19, text: 'Install cable new straps in previously recorded positions. Install brake line, banjo bolt (13) and new sealing washers (12) to master cylinder. Tighten. Torque: 17-19 ft-lbs (23.1-25.8 N·m) Banjo bolt to rear master cylinder' },
      { n: 20, text: 'Bleed brake system. See BLEED BRAKES (Page 3-56).' },
      { n: 21, text: 'Install right passenger footboard/footpeg. See PASSENGER FOOTRESTS (Page 3-144).' },
      { n: 22, text: 'Install right side cover. Install right saddlebag. See SADDLEBAGS (Page 3-161).' }
    ]
  },

  {
    id: 't20-bleed-brakes',
    bikeIds: ['touring-2020'],
    system: 'brakes',
    title: 'Bleed Brakes — Drain & Fill',
    summary: 'Drain old brake fluid and fill system with DOT 4 brake fluid. Bleed air from lines using lever/pedal pump or vacuum bleeder. Includes ABS module procedures and checks.',
    difficulty: 'Moderate',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 156 },
    figures: [
      { file: '/figures/t20/fig-3-49.png', caption: 'Bleeder Screw (Typical)', stepRefs: [1] }
    ],
    tools: [
      'Basic Vacuum Brake Bleeder (BB200A)',
      'Digital Technician II (HD-48650) for ABS models',
      'Clear plastic tubing',
      'Container for fluid'
    ],
    parts: [
      { number: '418007xx', description: 'Harley-Davidson Platinum Label DOT 4 Brake Fluid', qty: 2 }
    ],
    torque: [
      { fastener: 'Brake bleeder screw, front', value: '72-108 in-lbs (8.1-12.2 N·m)', note: '' },
      { fastener: 'Brake bleeder screw, rear', value: '75-102 in-lbs (8.5-11.5 N·m)', note: '' },
      { fastener: 'Brake master cylinder, front, reservoir cover screws', value: '12-15 in-lbs (1.4-1.7 N·m)', note: '' },
      { fastener: 'Brake master cylinder, rear, reservoir cover screws', value: '12-15 in-lbs (1.4-1.7 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove master cylinder reservoir cap of the affected system.', warning: 'DOT 4 brake fluid will damage painted and body panel surfaces it comes in contact with. Always use caution and protect surfaces from spills whenever brake work is performed. Failure to comply can result in cosmetic damage. Procedure for draining brake fluid is the same for both the front and the rear brake systems. Both front and rear brake systems are affected when removing ABS module.' },
      { n: 2, text: 'See Figure 3-49. Remove cap (1) from bleeder screw (2).' },
      { n: 3, text: 'Using vacuum brake bleeder to drain system. Special Tool: BASIC VACUUM BRAKE BLEEDER (BB200A). Attach vacuum brake bleeder to a caliper bleeder screw. Loosen screw 3/4 turn.' },
      { n: 4, text: 'Operate vacuum bleeder to evacuate all fluid from master cylinder and line. If needed: Repeat with remaining calipers.' },
      { n: 5, text: 'Using brake lever or pedal to drain system. Install a length of clear plastic tubing over bleeder screw. Place free end of tubing in a suitable container. Open bleeder screw one-half turn.' },
      { n: 6, text: 'Pump brake lever or pedal repeatedly to drain brake fluid. Close bleeder screw. Tighten.' },
      { n: 7, text: 'Wipe out any remaining fluid inside master cylinder reservoir with a clean, lint-free cloth.' },
      { n: 8, text: 'Verify brake system operation. Verify master cylinder is level. Remove cover from master cylinder reservoir.', warning: 'A plugged or covered relief port can cause brake drag or lock-up, which could lead to loss of control, resulting in death or serious injury. When any hydraulic brake component, line or connection is loosened or replaced on an ABS motorcycle, Digital Technician II must be used during the brake bleeding procedure to verify all air is removed from the system. Failure to properly bleed the brake system could adversely affect braking, which could result in death or serious injury.' },
      { n: 9, text: 'Fill reservoir with brake fluid. Refer to Table 3-7. Harley-Davidson Platinum Label DOT 4 Brake Fluid (418007xx).', warning: 'If DOT 4 brake fluid contacts painted surfaces, IMMEDIATELY flush area with clear water. Do not allow dirt or debris to enter the master cylinder reservoir. Dirt or debris in the reservoir can cause improper operation and equipment damage. Procedure for filling and bleeding brake fluid is the same for both front and rear brake systems. For best results use BASIC VACUUM BRAKE BLEEDER (PART NUMBER: BB200A). If a vacuum brake bleeder is not available, use the following procedure. Monitor fluid level in the master cylinder reservoir. Add fluid before it empties to avoid drawing air into the brake lines. Dual caliper front brake system: Bleed both calipers. Verify proper operation of the master cylinder relief port by actuating brake pedal or lever. Fluid will break the fluid surface in the reservoir if internal components are working properly.' },
      { n: 10, text: 'Bleed brake system. Remove cap from bleeder screw. Install end of clear plastic tubing over bleeder screw. Place opposite end of clear plastic tubing in a clear container.' },
      { n: 11, text: 'Operate brake lever or pedal to build hydraulic pressure. Hold pressure with brake lever or pedal. Open bleeder screw three-quarters of a turn.' },
      { n: 12, text: 'Close bleeder screw as soon as brake lever or pedal has moved full range of travel. Allow brake lever or pedal to return slowly to its released position.' },
      { n: 13, text: 'Repeat until all air bubbles are purged and a solid column of fluid is observed in the bleeder tube.' },
      { n: 14, text: 'Tighten bleeder screw to specification. Refer to Table 3-8. Install bleeder screw cap. Fill reservoir with brake fluid. Refer to Table 3-7. Harley-Davidson Platinum Label DOT 4 Brake Fluid (418007xx)' },
      { n: 15, text: 'Refer to Table 3-8. Install master cylinder reservoir cover: Verify master cylinder cover gasket bellows is not extended. Verify gasket and sealing surfaces are free of debris.' },
      { n: 16, text: 'Front master cylinder reservoir: Install cover with vent holes facing rear. Install cover screws. Tighten. Torque: 12-15 in-lbs (1.4-1.7 N·m) Brake master cylinder, front, reservoir cover screws' },
      { n: 17, text: 'Rear master cylinder reservoir: Install cover screws. Tighten. Torque: 12-15 in-lbs (1.4-1.7 N·m) Brake master cylinder, rear, reservoir cover screws' },
      { n: 18, text: 'ABS models: Connect DT II and perform ABS Service procedure. Special Tool: DIGITAL TECHNICIAN II (HD-48650)' },
      { n: 19, text: 'Check operation of brake lamp.', warning: 'Be sure that all lights and switches operate properly before operating motorcycle. Low visibility of rider can result in death or serious injury. After servicing brakes and before moving motorcycle, pump brakes to build brake system pressure. Insufficient pressure can adversely affect brake performance, which could result in death or serious injury. After repairing the brake system, test brakes at low speed. If brakes are not operating properly, testing at high speeds can cause loss of control, which could result in death or serious injury.' },
      { n: 20, text: 'Test ride motorcycle. Repeat the bleeding procedure if brakes feel spongy.' }
    ]
  }
,
{
    id: 't20-front-fork-remove',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Front Fork — Remove',
    summary: 'Remove front forks from lower fork brackets after removing wheels, fenders, and brake calipers. Includes fork cover removal if necessary.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 150 },
    figures: [
      { file: '/figures/t20/fig-3-52.png', caption: 'Front Forks', stepRefs: [1, 4] },
      { file: '/figures/t20/fig-3-53.png', caption: 'Front Fork Attachment', stepRefs: [1, 2, 3] },
      { file: '/figures/t20/fig-3-54.png', caption: 'Fork Cover Bumper', stepRefs: [3] }
    ],
    tools: ['Lift or jack', 'Torque wrench'],
    parts: [],
    torque: [
      { fastener: 'Fork bracket to fork pinch screws', value: '14-18 ft-lbs (19-24.4 N·m)', note: '' },
      { fastener: 'Fork slider cover screws', value: '24-48 in-lbs (2.7-5.4 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Raise the front wheel.' },
      { n: 2, text: 'Remove front wheel. See FRONT WHEEL (Page 3-12).' },
      { n: 3, text: 'Remove front fender. See FRONT FENDER (Page 3-134).' },
      { n: 4, text: 'Remove brake caliper. See FRONT BRAKE CALIPER (Page 3-34). Leave brake hose attached. Support from engine guard.' },
      { n: 5, text: 'Road King models: Remove headlamp nacelle. See HEADLAMP NACELLE (Page 3-86).' },
      { n: 6, text: 'Fairing models, fork-mounted: Remove dash panel. See FAIRING: FORK MOUNTED (Page 3-88).' },
      { n: 7, text: 'Fairing models, frame-mounted: Remove instrument bezel. See FAIRING: FRAME MOUNTED (Page 3-100).' },
      { n: 8, text: 'See Figure 3-53. Loosen upper pinch screw (1) but do not remove.' },
      { n: 9, text: 'Remove fork. Hold fork slider to prevent fork from dropping. Loosen lower pinch screws (2). Slide fork tube down to remove.' },
      { n: 10, text: 'If necessary, remove screws (3). Remove slider covers.' }
    ]
  },
  {
    id: 't20-front-fork-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Front Fork — Install',
    summary: 'Install front forks into lower brackets, adjust fork height using visual or measurement method, and tighten pinch screws in sequence. Apply threadlocker to slider cover screws.',
    difficulty: 'Moderate',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 150 },
    figures: [
      { file: '/figures/t20/fig-3-53.png', caption: 'Front Fork Attachment', stepRefs: [1, 4, 5] },
      { file: '/figures/t20/fig-3-54.png', caption: 'Fork Cover Bumper', stepRefs: [1] },
      { file: '/figures/t20/fig-3-55.png', caption: 'Fork Height', stepRefs: [3] },
      { file: '/figures/t20/fig-3-56.png', caption: 'Measured Fork Height', stepRefs: [3] }
    ],
    tools: ['Torque wrench', 'Measuring tool or calipers'],
    parts: [
      { number: 'Loctite 246', description: 'LOCTITE 246 HIGH TEMPERATURE MEDIUM STRENGTH BLUE THREADLOCKER', qty: 1 }
    ],
    torque: [
      { fastener: 'Fork bracket to fork pinch screws', value: '14-18 ft-lbs (19-24.4 N·m)', note: 'Repeat sequence one time' },
      { fastener: 'Fork slider cover screws', value: '24-48 in-lbs (2.7-5.4 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'See Figure 3-53. If removed, install fork covers. Apply threadlocker to threads of screws (3). Loctite 246 LOCTITE 246 HIGH TEMPERATURE MEDIUM STRENGTH BLUE THREADLOCKER. Tighten. Torque: 24-48 in-lbs (2.7-5.4 N·m) Fork slider cover screws.' },
      { n: 2, text: 'HDI, JPN, ENG, AUS: See Figure 3-54. If removed, install rubber bumper flush with the end and centered on the outboard surface of the fork cover.' },
      { n: 3, text: 'Slide fork tube into place.' },
      { n: 4, text: 'Set fork height using visual method: See Figure 3-55. Set fork height so top rear surface (1) of upper fork bracket is midway of the tapered area (2) at top of fork. OR Measurement method: See Figure 3-56. Set top of fork to a dimension (A) from the top rear of the lower fork bracket: 8.635-8.755 in (219.33-222.37 mm).' },
      { n: 5, text: 'See Figure 3-53. Tighten lower fork bracket pinch screws (2) in sequence. Tighten upper screw: Torque: 14-18 ft-lbs (19-24.4 N·m). Tighten lower screw: Torque: 14-18 ft-lbs (19-24.4 N·m). Repeat previous steps one time.' },
      { n: 6, text: 'Tighten upper pinch screw. Verify that upper fork bracket is seated against the upper dust shield. Verify that upper fork bracket is evenly positioned on both fork tubes. Tighten upper pinch screw (1): Torque: 14-18 ft-lbs (19-24.4 N·m).' }
    ]
  },
  {
    id: 't20-front-fork-disassemble',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Front Fork — Disassemble',
    summary: 'Disassemble front fork tube and slider including removal of spring, damper tube, seals, and internal components. Use soft jaws in vise. Inspect for damage and measure runout.',
    difficulty: 'Advanced',
    timeMinutes: 90,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 152 },
    figures: [
      { file: '/figures/t20/fig-3-57.png', caption: 'Fork Assembly', stepRefs: [1, 2, 3] },
      { file: '/figures/t20/fig-3-58.png', caption: 'Measure Fork Tube Runout', stepRefs: [6] }
    ],
    tools: [
      'FORK TUBE HOLDER (HD-41177)',
      'Soft-jawed vise',
      'Dial indicator for runout check',
      'V-blocks',
      'Container for drain oil'
    ],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Always use soft jaws when placing any fork components into vise.', warning: true },
      { n: 2, text: 'See Figure 3-57. If performing complete disassembly, clamp lower end of fork slider in a soft-jawed vise. Loosen lower screw (18). Do not remove now.' },
      { n: 3, text: 'Install fork tube in fork tube holder with fork vertical. Special Tool: FORK TUBE HOLDER (HD-41177).' },
      { n: 4, text: 'Remove fork tube plug (1). Fork tube plug is under spring pressure. Have a firm grasp on plug as it is removed. Remove and discard O-ring (2).' },
      { n: 5, text: 'Remove sleeve (3), spacer (4) and spring (5) from fork assembly.' },
      { n: 6, text: 'Drain fork oil into a suitable container. Slowly pump fork tube and slider at least ten times. Allow 10-15 minutes for fork to drain completely.' },
      { n: 7, text: 'Remove retaining clip (10). Expand fork slider and tube against each other repeatedly (in a slide-hammer effect) to remove fork tube. Remove fork tube bushing (14), slider bushing (13), spacer (12), seal (11) and retaining clip (10) from fork tube. Remove lower stop (15) from end of fork tube.' },
      { n: 8, text: 'Tip fork tube upside down to remove damper tube (7) with rebound spring (8).' },
      { n: 9, text: 'Remove rebound spring (8) and wear ring (6) from damper tube.' },
      { n: 10, text: 'Clean all parts.' },
      { n: 11, text: 'Inspect parts for wear or damage. Replace parts if necessary.' },
      { n: 12, text: 'Inspect OD of slider bushing and ID of fork tube bushing. If coating is worn through (metallic substrate showing), replace bushing. Inspect for distortion. If deep scratches or scoring are found, replace bushing. Also inspect mating components for similar wear.' },
      { n: 13, text: 'Check fork tube and slider for scoring, scratches and abnormal wear.' },
      { n: 14, text: 'Inspect fork tube for nicks from stones and road debris, especially in area where seal contacts it. Replace if necessary.' },
      { n: 15, text: 'See Figure 3-58. Check runout with a dial indicator. Set fork tube on V-blocks. Replace fork if runout exceeds: 0.008 in (0.2 mm).' }
    ]
  },
  {
    id: 't20-front-fork-assemble',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Front Fork — Assemble',
    summary: 'Reassemble fork tube, slider, damper tube with seals and bearings. Apply fork oil and set proper oil level. Tighten slider assembly screw with threadlocker.',
    difficulty: 'Advanced',
    timeMinutes: 90,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 152 },
    figures: [
      { file: '/figures/t20/fig-3-57.png', caption: 'Fork Assembly', stepRefs: [1, 2, 3, 4] },
      { file: '/figures/t20/fig-3-59.png', caption: 'Assembled Fork Seal Driver', stepRefs: [3] },
      { file: '/figures/t20/fig-3-60.png', caption: 'Oil Level Gauge', stepRefs: [5] }
    ],
    tools: [
      'FORK TUBE HOLDER (HD-41177)',
      'FORK OIL LEVEL GAUGE (HD-59000B)',
      'FORK SEAL DRIVER (HD-45305)',
      'Soft-jawed vise',
      'Torque wrench'
    ],
    parts: [
      { number: '62600026', description: 'TYPE "E" HYDRAULIC FORK OIL', qty: 1 },
      { number: '99818-97', description: 'LOCTITE 565 THREAD SEALANT', qty: 1 }
    ],
    torque: [
      { fastener: 'Fork slider assembly screw', value: '30-37 ft-lbs (40-50 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Lubricate all seal lips, quad rings and O-rings with HARLEY-DAVIDSON SEAL GREASE during assembly.', warning: true },
      { n: 2, text: 'See Figure 3-57. Assemble fork tube. Coat OD of slider bushing (13) and fork tube bushing (14) with clean fork oil. Expand slider bushing only enough to slip into groove of fork tube (9). Install fork tube bushing and slider spacer (12) onto fork tube. Slide down until they contact slider bushing (13). Wrap masking tape over edge of fork tube to protect fork oil seal during installation. With the garter spring side toward the fork slider (16), slide new fork oil seal (11) down fork tube until it contacts slider spacer (12). Remove masking tape from fork tube.' },
      { n: 3, text: 'Install damper tube (7). Install fork tube horizontally in fork tube holder. Special Tool: FORK TUBE HOLDER (HD-41177). Install new wear ring (6) in groove of damper tube (7). Install with reliefs (23) down. Install rebound spring (8) on opposite end. Slide damper tube into fork tube, small end first, until it passes through hole at bottom of fork tube. Install lower stop (15) at end of damper tube. Install fork spring (5) with the tightly wound coils toward the bottom. Install spacer (4) and sleeve (3). Slide fork slider onto fork tube. Apply threadlocker to screw (18). Loosely install screw and new copper washer (17). Loctite 565 LOCTITE 565 THREAD SEALANT (99818-97). Remove from fork holder. While compressing spring, tighten screw (18). Torque: 30-37 ft-lbs (40-50 N·m) Fork slider assembly screw.' },
      { n: 4, text: 'See Figure 3-59. Install fork oil seal. Clamp lower end of fork slider in a soft-jawed vise. Using FORK SEAL DRIVER (PART NUMBER: HD-45305) like a slide hammer, drive fork oil seal down until installer contacts fork slider. Remove tool. See Figure 3-57. Install retaining clip (10) in the fork slider groove. Loosely install axle holder (22) with flat washers (21), lockwashers (20) and nuts (19) on right fork slider.' },
      { n: 5, text: 'Clamp fork slider vertically in fork tube holder. Special Tool: FORK TUBE HOLDER (HD-41177). See Figure 3-57. Remove fork sleeve (3), spacer (4) and spring (5) from fork tube. Pour hydraulic fork oil directly into fork tube. Volume: 24 fl oz (710 ml). Consumable: TYPE "E" HYDRAULIC FORK OIL (62600026). Slowly pump fork tube until some resistance is felt. Then pump a few more times. See Figure 3-60. Adjust fork oil level. Adjust collar (3) of fork oil level gauge to: Standard models: Dimension: 3.70 in (94 mm). Low models: Dimension: 3.54 in (90 mm). Special Tool: FORK OIL LEVEL GAUGE (HD-59000B). With the fork tube bottomed in the fork slider, insert tube (2) of gauge until collar (3) rests flat on top of fork tube. Draw excess oil from fork with plunger. If no oil is drawn out, add a small amount to the fork tube and repeat.' },
      { n: 6, text: 'See Figure 3-57. Extend the fork. Install fork spring (5), spacer (4) and sleeve (3) into fork tube with the tighter wound coils at the bottom. Remove fork slider from fork holding tool. Clamp fork tube into fork holding tool. Install new O-ring (2) onto fork tube plug (1). Install fork tube plug. Tighten to 30-80 N·m (22-59 ft-lbs).' }
    ]
  },
  {
    id: 't20-front-fork-oil-change',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Front Fork Oil — Change',
    summary: 'Change fork oil without complete disassembly. Drain old oil, remove sleeve and spring from top, add new hydraulic fork oil, adjust level using gauge, and reinstall components.',
    difficulty: 'Moderate',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 152 },
    figures: [
      { file: '/figures/t20/fig-3-57.png', caption: 'Fork Assembly', stepRefs: [2, 3] },
      { file: '/figures/t20/fig-3-60.png', caption: 'Oil Level Gauge', stepRefs: [4] }
    ],
    tools: [
      'FORK TUBE HOLDER (HD-41177)',
      'FORK OIL LEVEL GAUGE (HD-59000B)',
      'Soft-jawed vise',
      'Pump or syringe for oil level adjustment'
    ],
    parts: [
      { number: '62600026', description: 'TYPE "E" HYDRAULIC FORK OIL', qty: 1 }
    ],
    torque: [],
    steps: [
      { n: 1, text: 'Clamp fork slider vertically in fork tube holder with soft jaws. Lower lower screw (18). Do not remove now. Install fork tube in fork tube holder with fork vertical. Special Tool: FORK TUBE HOLDER (HD-41177).' },
      { n: 2, text: 'Remove fork tube plug (1). Remove and discard O-ring (2). Remove sleeve (3), spacer (4) and spring (5) from fork assembly.' },
      { n: 3, text: 'Drain fork oil into a suitable container. Slowly pump fork tube and slider at least ten times. Allow 10-15 minutes for fork to drain completely.' },
      { n: 4, text: 'See Figure 3-57. Remove fork sleeve (3), spacer (4) and spring (5) from fork tube. Pour hydraulic fork oil directly into fork tube. Volume: 24 fl oz (710 ml). Consumable: TYPE "E" HYDRAULIC FORK OIL (62600026). Slowly pump fork tube until some resistance is felt. Then pump a few more times.' },
      { n: 5, text: 'See Figure 3-60. Adjust fork oil level. Adjust collar (3) of fork oil level gauge to: Standard models: Dimension: 3.70 in (94 mm). Low models: Dimension: 3.54 in (90 mm). Special Tool: FORK OIL LEVEL GAUGE (HD-59000B). With the fork tube bottomed in the fork slider, insert tube (2) of gauge until collar (3) rests flat on top of fork tube. Draw excess oil from fork with plunger. If no oil is drawn out, add a small amount to the fork tube and repeat.' },
      { n: 6, text: 'See Figure 3-57. Extend the fork. Install fork spring (5), spacer (4) and sleeve (3) into fork tube with the tighter wound coils at the bottom. Install new O-ring (2) onto fork tube plug (1). Install fork tube plug. Tighten to 30-80 N·m (22-59 ft-lbs).' }
    ]
  },
  {
    id: 't20-steering-head-remove',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Steering Head/Fork Stem — Remove',
    summary: 'Remove upper and lower fork brackets, handlebar, and steering stem assembly. Disconnect all wiring and brake lines. Remove bearing cones from upper and lower stems.',
    difficulty: 'Advanced',
    timeMinutes: 90,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 158 },
    figures: [
      { file: '/figures/t20/fig-3-61.png', caption: 'Fork Stem and Brackets', stepRefs: [1, 2, 5, 6] },
      { file: '/figures/t20/fig-3-62.png', caption: 'Capture Clutch and Brake Fluid Lines', stepRefs: [3] }
    ],
    tools: ['Torque wrench', 'Bearing puller (if needed)', 'Soft-jawed vise'],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Disassemble motorcycle. Road King models: Remove headlamp nacelle. See HEADLAMP NACELLE (Page 3-86). Fairing models, fork-mounted: Remove inner fairing assembly. See FAIRING: FORK MOUNTED (Page 3-88). Fairing models, frame-mounted: Remove instrument nacelle. See FAIRING: FRAME MOUNTED (Page 3-100).' },
      { n: 2, text: 'Disconnect wiring. Left and right handlebar switch connectors. FLHRXS: Front turn signal lamp connectors. Ignition switch connector. TGS connector. Upper fork bracket ground connector. Heated hand grip connectors, if equipped. Cut cable straps securing hydraulic lines and wiring to handlebar risers.' },
      { n: 3, text: 'Leave hand controls and switches installed on handlebar.' },
      { n: 4, text: 'Remove ignition switch or fork lock. See IGNITION SWITCH (Page 8-16).' },
      { n: 5, text: 'Remove front forks. See FRONT FORK (Page 3-60).' },
      { n: 6, text: 'Release brake lines from lower fork bracket. ABS models: Disconnect WSS connector. Remove WSS. Leave hand controls and switches assembled to handlebar. Remove upper fork bracket with handlebar attached. Secure assembly with elastic cords on a well-padded fuel tank.' },
      { n: 7, text: 'See Figure 3-61. Remove upper steering stem (4). Remove lower steering stem/fork bracket (11).' },
      { n: 8, text: 'See Figure 3-61. Remove bearing cones (6, 9) from upper stem and lower stems.' },
      { n: 9, text: 'Internal reliefs in steering head allow punch access to the bearing cups. Drive both bearing cups (7, 8) out of steering head.' }
    ]
  },
  {
    id: 't20-steering-head-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Steering Head/Fork Stem — Install',
    summary: 'Install new bearing cups and cones into steering head. Assemble upper and lower steering stems, install front forks, and tighten to specification based on model type.',
    difficulty: 'Advanced',
    timeMinutes: 90,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 158 },
    figures: [
      { file: '/figures/t20/fig-3-61.png', caption: 'Fork Stem and Brackets', stepRefs: [1, 2, 3, 4] },
      { file: '/figures/t20/fig-3-63.png', caption: 'Install Steering Head Bearing Cups', stepRefs: [1, 2] }
    ],
    tools: [
      'BEARING CUP INSTALLER (HD-45305) or equivalent',
      'Press',
      'Torque wrench',
      'Soft-jawed vise',
      'Wooden block'
    ],
    parts: [
      { number: '99857-97A', description: 'SPECIAL PURPOSE GREASE', qty: 1 }
    ],
    torque: [
      { fastener: 'Upper steering stem (Fairing fork mounted)', value: '63 in-lbs (7.1 N·m)', note: 'Loosen 90-100 degrees after initial torque' },
      { fastener: 'Upper steering stem (Fairing frame mounted)', value: '192 in-lbs (21.7 N·m)', note: 'Loosen 90-100 degrees after initial torque' },
      { fastener: 'Upper steering stem (Road King)', value: '108 in-lbs (12.2 N·m)', note: 'Loosen 90-100 degrees after initial torque' },
      { fastener: 'Upper steering stem (Trike)', value: '108 in-lbs (12.2 N·m)', note: 'Loosen 90-100 degrees after initial torque' },
      { fastener: 'Brake line bracket to lower fork bracket screws', value: '12-18 in-lbs (1.4-2 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'See Figure 3-63. Install upper bearing cup (7) and lower bearing cup (8) into steering head.' },
      { n: 2, text: 'Always install new bearings. Replace both bearings anytime either requires replacement. Upper dust shield has a larger OD than the lower dust shield. See Figure 3-61. Assemble upper steer stem. Install upper dust shield (5). Press bearing cone (6) onto upper stem. Assemble lower steer stem. Install lower dust shield (10). Press bearing cone (9) onto lower stem. If removed, install brake line bracket with two screws. Tighten. Torque: 12-18 in-lbs (1.4-2 N·m) Brake line bracket to lower fork bracket screws.' },
      { n: 3, text: 'See Figure 3-61. Lubricate upper steering stem threads with special purpose grease. Apply grease on bearing rollers and cups. Consumable: SPECIAL PURPOSE GREASE (99857-97A). Install lower steering stem/fork bracket (11) into steering head. Install upper stem. Hold lower steering stem/fork bracket up against lower cup (8). Install upper stem (4) hand-tight. Place wooden block between lower fork bracket and frame. Tighten upper steering stem (4). Torque: 35 ft-lbs (47.5 N·m) Upper steering stem, 1st torque. Loosen upper steering stem 90-100 degrees. Tighten to specification per model: Fairing fork mounted: 63 in-lbs (7.1 N·m), Fairing frame mounted: 192 in-lbs (21.7 N·m), Road King: 108 in-lbs (12.2 N·m), Trike: 108 in-lbs (12.2 N·m).' },
      { n: 4, text: 'Install front forks. See FRONT FORK (Page 3-60).' },
      { n: 5, text: 'Install front forks in lower fork bracket. Use measurement method to adjust height. See FRONT FORK (Page 3-60). ABS models: Connect WSS cable. Secure to right steering head caddy. See FRONT WHEEL SPEED SENSOR (WSS) (Page 8-103). Install upper fork bracket and handlebar. Do not tighten fork stem pinch screw. See STEERING HEAD (Page 3-67). Assemble motorcycle. Road King models: Install headlamp nacelle. See HEADLAMP NACELLE (Page 3-86). Fairing models, fork-mounted: Install inner fairing assembly. See FAIRING: FORK MOUNTED (Page 3-88). Fairing models, frame-mounted: Install the instrument nacelle. See FAIRING: FRAME MOUNTED (Page 3-100). Adjust swing-back. See ADJUST AND LUBRICATE STEERING HEAD BEARINGS (Page 2-30).' }
    ]
  },
  {
    id: 't20-rear-fork-remove',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Rear Fork (Swingarm) — Remove',
    summary: 'Remove swingarm assembly by disconnecting brake lines, wheel speed sensor cable (ABS), removing pivot shaft screws and shock absorbers. Requires work on both sides of frame.',
    difficulty: 'Advanced',
    timeMinutes: 90,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 161 },
    figures: [
      { file: '/figures/t20/fig-3-64.png', caption: 'Rear Fork Mounting', stepRefs: [1, 3, 4] }
    ],
    tools: [
      'Socket set (6-point socket recommended)',
      'Torque wrench',
      'Air impact wrench (optional, for right screw)',
      'Heat gun (optional, for right screw)'
    ],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Remove rear wheel. See REAR WHEEL (Page 3-14).' },
      { n: 2, text: 'Remove debris deflector from bottom of left side fork.' },
      { n: 3, text: 'Loosen both lower shock absorber mounting bolts. Do not remove now.' },
      { n: 4, text: 'See Figure 3-64. Remove two screws (12) to free left rear fork bracket (11) with footrest attached.' },
      { n: 5, text: 'Release rear brake hose and rear wheel speed sensor cable (ABS models) from rear fork.' },
      { n: 6, text: 'Remove plug (1) from right side. For best results, use an air impact wrench to remove the right side screw. Applying heat to the right side screw also improves removal.', warning: true },
      { n: 7, text: 'Hold left side hex cup (9) and remove right side screw (10) from pivot shaft (6). Remove right hex cup (3). Remove pivot shaft, screw (2), left hex cup (9), rubber mount (8) and outer spacer (7) from the left side as an assembly.' },
      { n: 8, text: 'Remove lower shock absorber bolts. Work rear fork free of transmission mount and rubber mount (4).' },
      { n: 9, text: 'Remove right outer spacer (5) from fork tube. Remove right rubber mount (4).' }
    ]
  },
  {
    id: 't20-rear-fork-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Rear Fork (Swingarm) — Install',
    summary: 'Install swingarm assembly by guiding pivot shaft through fork and frame, installing rubber mounts, left bracket components, and shock absorbers. Apply threadlocker to all screws.',
    difficulty: 'Advanced',
    timeMinutes: 90,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 161 },
    figures: [
      { file: '/figures/t20/fig-3-64.png', caption: 'Rear Fork Mounting', stepRefs: [1, 2, 3, 4, 5] },
      { file: '/figures/t20/fig-3-65.png', caption: 'Right Side Mount', stepRefs: [1] }
    ],
    tools: ['Torque wrench', 'Socket set'],
    parts: [
      { number: '98960-97', description: 'ANTI-SEIZE LUBRICANT', qty: 1 },
      { number: '99642-97', description: 'LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE)', qty: 2 }
    ],
    torque: [
      { fastener: 'Rear fork bracket screws', value: '55-65 ft-lbs (74.6-88.1 N·m)', note: '' },
      { fastener: 'Rear fork pivot shaft screws', value: '55-65 ft-lbs (74.6-88.1 N·m)', note: '' },
      { fastener: 'Shock absorber mounting bolt', value: '63-70 ft-lbs (85.4-95 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'See Figure 3-65. Install right side rubber mount. With the slot on the outboard side between the 12 o\'clock and 1 o\'clock positions, install rubber mount on inner-right side of frame. Make sure that index tab in mount cavity fully engages slot in rubber mount.' },
      { n: 2, text: 'Install fork. Hold outer spacer in right side fork tube and move the fork into position. Loosely attach shock absorbers. Work the rear fork into final position between the transmission mount and the right rubber mount. Coat pivot shaft with anti-seize. Avoid getting anti-seize in threads of pivot shaft. ANTI-SEIZE LUBRICANT (98960-97). See Figure 3-64. Install pivot shaft from left side through fork and transmission mount. Guide end of pivot shaft through right rubber mount.' },
      { n: 3, text: 'Install left side components. Install outer spacer (7) until seated against shoulder of pivot shaft. Install left rubber mount (8) with the flat side inboard. Install hex cup (9). Rotate the left rubber mount (8) so the slot is between the 11 and 12 o\'clock positions. Install left side fork bracket (11) fitting index tab into slot of rubber mount. Apply threadlocker to fork bracket screws (12). Secure left side fork bracket with footrest. Tighten. Torque: 55-65 ft-lbs (74.6-88.1 N·m) Rear fork bracket screws. LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE) (99642-97).' },
      { n: 4, text: 'Install pivot shaft screws (2, 10). Remove plugs (1). Apply thread locker to pivot shaft screws (2, 10). LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE) (99642-97). Install screws. Tighten. Torque: 55-65 ft-lbs (74.6-88.1 N·m) Rear fork pivot shaft screws.' },
      { n: 5, text: 'Verify that rear fork assembly moves freely. Install plugs (1). Remove lower shock absorber mounting bolts. Apply threadlocker to threads of bolts. Install and tighten. Torque: 63-70 ft-lbs (85.4-95 N·m) Shock absorber mounting bolt. Consumable: LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE) (99642-97). Install debris deflector. Tighten. Torque: 65-85 in-lbs (7.3-9.6 N·m) Debris deflector screw. Seat caliper bracket on anchor weldment of rear fork. Capture rear brake line hose in two cable clips at top of right side fork. Rear cable clip also captures rear wheel speed sensor cable on ABS equipped motorcycles. Install rear wheel. See REAR WHEEL (Page 3-14).' }
    ]
  },
  {
    id: 't20-rear-fork-bearings-remove',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Rear Fork Bearings — Remove',
    summary: 'Remove front and rear bearings from swingarm assembly using a bearing remover tool. Bearings must be replaced when removed.',
    difficulty: 'Advanced',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 163 },
    figures: [
      { file: '/figures/t20/fig-3-66.png', caption: 'Remove Rear Fork Bearing', stepRefs: [1, 2, 3, 4] }
    ],
    tools: [
      'Press',
      'Bearing remover tool (driver and rod)',
      'Support blocks'
    ],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Removing bearings destroys them. Always install new bearings upon assembly.', warning: true },
      { n: 2, text: 'See Figure 3-66. Select a driver (1) slightly smaller than bearing spacer collar and a rod (2) long enough to allow pressing through upper bearing.' },
      { n: 3, text: 'Support fork (4) in a press with brake anchor weldment on top. Slide rod through the brake side bearing against driver. Verify that assembly is square and bearing bore is vertical. Press bearing/spacer assembly (3) from rear fork.' },
      { n: 4, text: 'Turn over fork. Press out brake side bearing in same manner.' },
      { n: 5, text: 'If bearings are replaced with new, press spacers out and retain for later use.' }
    ]
  },
  {
    id: 't20-rear-fork-bearings-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Rear Fork Bearings — Install',
    summary: 'Install new bearings and spacers into swingarm assembly using bearing installer tool. Press bearing until specified shoulder contact is achieved.',
    difficulty: 'Advanced',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 163 },
    figures: [
      { file: '/figures/t20/fig-3-68.png', caption: 'Press Spacer into Bearing', stepRefs: [1] },
      { file: '/figures/t20/fig-3-69.png', caption: 'Install bearings', stepRefs: [3] }
    ],
    tools: [
      'Press',
      'REAR SWINGARM BEARING INSTALLER (HD-45327)',
      'Support blocks'
    ],
    parts: [
      { number: '99857-97A', description: 'SPECIAL PURPOSE GREASE', qty: 1 }
    ],
    torque: [],
    steps: [
      { n: 1, text: 'Assemble new rear fork bearings and spacers. Place bearing on press plate. See Figure 3-68. With collar topside, start spacer (1) into bearing (2). Press spacer until it bottoms against press plate.' },
      { n: 2, text: 'Coat bearing bores in rear fork with grease. Consumable: SPECIAL PURPOSE GREASE (99857-97A).' },
      { n: 3, text: 'See Figure 3-69. Install bearings. Support fork squarely on press bed with the brake anchor weldment on top. Insert bearing into fork assembly with spacer down. Use bearing installer (1) stamped Brake Side. Press bearing until shoulder on tool contacts fork tube (2). Special Tool: REAR SWINGARM BEARING INSTALLER (HD-45327). Turn rear fork over. Repeat process with remaining bearing using tool stamped Drive Side. Press bearing until it bottoms. Shoulder on press tool should not contact fork tube.' }
    ]
  },
  {
    id: 't20-belt-guard-remove',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Belt Guard (Debris Deflector) — Remove',
    summary: 'Remove rear belt guard debris deflector by loosening front screw and removing remaining fasteners. Simple removal procedure.',
    difficulty: 'Easy',
    timeMinutes: 15,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 175 },
    figures: [],
    tools: ['Socket set', 'Torque wrench'],
    parts: [],
    torque: [
      { fastener: 'Debris deflector screw', value: '65-85 in-lbs (7.3-9.6 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove left saddlebag. See SADDLEBAGS (Page 3-161).' },
      { n: 2, text: 'Loosen front screw.' },
      { n: 3, text: 'Remove remaining screws.' },
      { n: 4, text: 'Slide debris deflector forward and remove.' }
    ]
  },
  {
    id: 't20-belt-guard-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Belt Guard (Debris Deflector) — Install',
    summary: 'Install rear belt guard debris deflector and tighten fasteners to specification. Apply threadlocker to screw threads.',
    difficulty: 'Easy',
    timeMinutes: 15,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 175 },
    figures: [],
    tools: ['Torque wrench', 'Socket set'],
    parts: [
      { number: '99642-97', description: 'LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE)', qty: 1 }
    ],
    torque: [
      { fastener: 'Debris deflector screw', value: '65-85 in-lbs (7.3-9.6 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Install debris deflector.' },
      { n: 2, text: 'Install screws and tighten. Torque: 65-85 in-lbs (7.3-9.6 N·m) Debris deflector screw.' },
      { n: 3, text: 'Install left saddlebag. See SADDLEBAGS (Page 3-161).' }
    ]
  },
  {
    id: 't20-rear-shock-absorber-remove',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Rear Shock Absorber — Remove',
    summary: 'Remove rear shock absorbers one at a time by removing upper and lower mounting bolts, lockwashers and flat washers. Inspect for leakage.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 176 },
    figures: [
      { file: '/figures/t20/fig-3-70.png', caption: 'Manual Adjust Shock Absorber', stepRefs: [1, 2] }
    ],
    tools: ['Socket set', 'Torque wrench', 'Lift or jack'],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Remove saddlebags. See SADDLEBAGS (Page 3-161).' },
      { n: 2, text: 'Raise rear of motorcycle.' },
      { n: 3, text: 'Remove one shock absorber at a time.', warning: true },
      { n: 4, text: 'Remove upper and lower shock absorber mounting bolts, lockwashers and flat washers.' },
      { n: 5, text: 'Remove shock absorber.' },
      { n: 6, text: 'Inspect shock absorber for signs of leakage. Replace both shock absorbers if leak is found.' },
      { n: 7, text: 'Inspect bushings for cracks and wear. Replace as necessary.' }
    ]
  },
  {
    id: 't20-rear-shock-absorber-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Rear Shock Absorber — Install',
    summary: 'Install rear shock absorbers with correct orientation: right shock rod-end up with thicker bushings toward frame, left shock with knob topside facing forward. Apply threadlocker to bolts.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 176 },
    figures: [
      { file: '/figures/t20/fig-3-70.png', caption: 'Manual Adjust Shock Absorber', stepRefs: [1, 2] }
    ],
    tools: ['Torque wrench', 'Socket set'],
    parts: [
      { number: '99642-97', description: 'LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE)', qty: 2 }
    ],
    torque: [
      { fastener: 'Rear shock absorber mounting bolt', value: '63-70 ft-lbs (85.4-95 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'See Figure 3-70. Install right shock absorber (1) with the rod end up. Install right shock absorber with thicker end (3) of bushings facing frame. Install left shock absorber (2) with the knob topside and facing forward.', warning: true },
      { n: 2, text: 'Apply threadlocker to each mounting bolt. Consumable: LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE) (99642-97).' },
      { n: 3, text: 'Install shock absorber with mounting bolts, lockwashers and flat washers. Tighten. Torque: 63-70 ft-lbs (85.4-95 N·m) Rear shock absorber mounting bolt.' },
      { n: 4, text: 'Install saddlebags. See SADDLEBAGS (Page 3-161).' },
      { n: 5, text: 'Lower rear wheel.' }
    ]
  },
  {
    id: 't20-rear-shock-air-adjust',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Rear Shock Absorber — Air Adjust',
    summary: 'Disassemble rear shock absorber adjuster knob by removing screw and washer. Remove detent ball and spring carefully. Reassemble with proper detent function.',
    difficulty: 'Easy',
    timeMinutes: 20,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 176 },
    figures: [
      { file: '/figures/t20/fig-3-70.png', caption: 'Manual Adjust Shock Absorber', stepRefs: [1] }
    ],
    tools: ['Wrench or socket'],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Remove shock adjuster knob. Remove screw and washer. Hold a rag wrapped around the adjuster housing and knob to prevent loss of the detent ball and spring. Carefully remove the knob. Remove detent ball and spring.' },
      { n: 2, text: 'Install shock adjuster knob. Press and hold detent ball onto end of spring. Install knob on adjuster housing. Install washer and screw. Tighten securely. Rotate knob to verify that the detent is properly assembled. Clicks are heard every half rotation.' }
    ]
  },
  {
    id: 't20-front-brake-master-cylinder-remove',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Front Brake Master Cylinder — Remove',
    summary: 'Remove front brake master cylinder by disconnecting hydraulic lines and electrical connectors. Drain brake fluid using vacuum bleeder or equivalent.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 122 },
    figures: [
      { file: '/figures/t20/fig-3-30.png', caption: 'Front Brake Master Cylinder Assembly', stepRefs: [1, 2] }
    ],
    tools: [
      'Torque wrench',
      'BASIC VACUUM BRAKE BLEEDER (BB200A) or equivalent',
      'Socket set'
    ],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Clean master cylinder reservoir cover before removal.' },
      { n: 2, text: 'For best results, use BASIC VACUUM BRAKE BLEEDER (PART NUMBER: BB200A) or equivalent to drain brake system.' },
      { n: 3, text: 'Drain front brake lines. Remove cover from master cylinder reservoir. Attach vacuum brake bleeder to either front caliper bleeder screw. Loosen screw 3/4 turn. Operate vacuum bleeder to evacuate all fluid from master cylinder and line. Repeat with remaining caliper. Wipe out any remaining fluid inside master cylinder reservoir with a clean, lint-free cloth.' },
      { n: 4, text: 'Disconnect brake switch connector (if equipped).' },
      { n: 5, text: 'See FRONT BRAKE LINES (Page 3-40) for detailed brake line removal procedure.' }
    ]
  }
,
  {
    id: 't20-left-side-cover-remove-install',
    bikeIds: ['touring-2020'],
    system: 'bodywork',
    title: 'Left Side Cover — Remove & Install',
    summary: 'Remove and install left side cover. Remove left saddlebag to access. Cover is mounted with grommets; pull away to release studs.',
    difficulty: 'Easy',
    timeMinutes: 10,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 58 },
    figures: [
      { file: '/figures/t20/fig-3-50.png', caption: 'Left Side Cover', stepRefs: [2] }
    ],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Remove left saddlebag. See SADDLEBAGS (Page 3-161).' },
      { n: 2, text: 'See Figure 3-50. Pull side cover away to release mounting studs from grommets (1).' },
      { n: 3, text: 'Install side cover.' },
      { n: 4, text: 'Align side cover with grommets (1).' },
      { n: 5, text: 'Press side cover until fully seated.' },
      { n: 6, text: 'Install left saddlebag. See SADDLEBAGS (Page 3-161).' }
    ]
  },

  {
    id: 't20-right-side-cover-remove-install',
    bikeIds: ['touring-2020'],
    system: 'bodywork',
    title: 'Right Side Cover — Remove & Install',
    summary: 'Remove and install right side cover. Remove right saddlebag to access. Cover is mounted with grommets; pull away to release studs.',
    difficulty: 'Easy',
    timeMinutes: 10,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 59 },
    figures: [
      { file: '/figures/t20/fig-3-51.png', caption: 'Right Side Cover', stepRefs: [2] }
    ],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Remove right saddlebag. See SADDLEBAGS (Page 3-161).' },
      { n: 2, text: 'See Figure 3-51. Pull side cover away to release mounting studs from grommets (1).' },
      { n: 3, text: 'Install side cover.' },
      { n: 4, text: 'Align side cover with grommets (1).' },
      { n: 5, text: 'Press side cover until fully seated.' },
      { n: 6, text: 'Install right saddlebag. See SADDLEBAGS (Page 3-161).' }
    ]
  },

  {
    id: 't20-windshield-remove-install',
    bikeIds: ['touring-2020'],
    system: 'bodywork',
    title: 'Windshield — Remove & Install',
    summary: 'Remove and install windshield by disengaging wireform latch springs and grommets. Road King models require disassembly of adhesive braces.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 121 },
    figures: [
      { file: '/figures/t20/fig-3-124.png', caption: 'Windshield Assembly', stepRefs: [2, 7] },
      { file: '/figures/t20/fig-3-125.png', caption: 'Windshield Torque Sequence', stepRefs: [11] }
    ],
    tools: [],
    parts: [],
    torque: [
      { fastener: 'Windshield window screw, Road King models', value: '20-25 in-lbs (2.3-2.8 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Raise both wireform latch springs.' },
      { n: 2, text: 'Move top of windshield forward to disengage from upper grommets.' },
      { n: 3, text: 'Raise windshield to disengage from lower grommets.' },
      { n: 4, text: 'Firmly seat bottom of windshield bracket to engage lower grommets.' },
      { n: 5, text: 'Push top of windshield rearward to engage top grommets.' },
      { n: 6, text: 'Push down on the wireform latch springs so that they overhang the rubber grommets.' },
      { n: 7, text: 'For Road King models, verify windshield seal is in place on air duct assembly and not damaged.' }
    ]
  },

  {
    id: 't20-hand-grips-standard-remove-install',
    bikeIds: ['touring-2020'],
    system: 'bodywork',
    title: 'Hand Grips: Standard — Remove & Install',
    summary: 'Remove and install standard hand grips on left and right handlebars. Requires removal of hand control modules. Left grip requires cutting; right grip pulls off after disconnect.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 123 },
    figures: [
      { file: '/figures/t20/fig-3-126.png', caption: 'Handlebar Harness Connectors', stepRefs: [3] }
    ],
    tools: [],
    parts: [
      { number: '99839-95', description: 'Harley-Davidson Adhesive (Griplock)', qty: 1 }
    ],
    torque: [],
    steps: [
      { n: 1, text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).' },
      { n: 2, text: 'Remove left hand control module and clutch control. See LEFT HAND CONTROL MODULE (LHCM) (Page 8-22).' },
      { n: 3, text: 'Remove left hand grip by cutting open with a sharp knife, peeling open, and removing from handlebar.' },
      { n: 4, text: 'Prepare left grip end of handlebar with emery cloth.' },
      { n: 5, text: 'Clean left grip end of handlebar with acetone.' },
      { n: 6, text: 'Apply adhesive (Griplock) to the inside of the new hand grip.' },
      { n: 7, text: 'Install the new hand grip with a twisting motion, ending with cosmetic features properly positioned.' },
      { n: 8, text: 'Install left hand control module and clutch control. See LEFT HAND CONTROL MODULE (LHCM) (Page 8-22).' },
      { n: 9, text: 'For right grip: Remove right hand control module and front brake control. See RIGHT HAND CONTROL MODULE (RHCM) (Page 8-25).' },
      { n: 10, text: 'Install right hand grip with cosmetic features properly positioned.' },
      { n: 11, text: 'Rotate to verify that internal splines are engaged with the twist grip sensor.' },
      { n: 12, text: 'Install right hand control module and front brake control. See RIGHT HAND CONTROL MODULE (RHCM) (Page 8-25).' },
      { n: 13, text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).' }
    ]
  },

  {
    id: 't20-handlebar-remove-install-without-fairing',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Handlebar — Remove & Install (Without Fairing)',
    summary: 'Remove and install handlebar assembly on models without fairing. Disconnect switches and control levers; remove clamp screws and assembly.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 125 },
    figures: [
      { file: '/figures/t20/fig-3-128.png', caption: 'Left Side Connectors: Road King Models', stepRefs: [2] },
      { file: '/figures/t20/fig-3-129.png', caption: 'Right Side Connectors: Road King', stepRefs: [3] }
    ],
    tools: [],
    parts: [],
    torque: [
      { fastener: 'Brake master cylinder, front, clamp screw', value: '60-80 in-lbs (6.8-9 N·m)', note: '' },
      { fastener: 'Clutch lever bracket clamp screw', value: '60-80 in-lbs (6.8-9 N·m)', note: '' },
      { fastener: 'Handlebar upper clamp screws', value: '16-20 ft-lbs (21.7-27.1 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove main fuse.' },
      { n: 2, text: 'FLHRXS: Remove front turn signal lamps and mirrors. Support turn signal out of the way. See MIRRORS (Page 3-132).' },
      { n: 3, text: 'See Figure 3-128. Separate left handlebar switch (1) and TGS (2) connectors.' },
      { n: 4, text: 'See Figure 3-129. Separate right handlebar switch connectors (1).' },
      { n: 5, text: 'Remove master cylinder/brake lever assembly from handlebar.' },
      { n: 6, text: 'Remove clutch hand lever and bracket assembly from handlebar.' },
      { n: 7, text: 'Remove handlebar clamp shroud. See HEADLAMP NACELLE (Page 3-86).' },
      { n: 8, text: 'Remove handlebar assembly by removing upper handlebar clamp screws, upper clamp, and assembly.' },
      { n: 9, text: 'Install handlebar assembly and upper clamp. Install screws finger-tight.' },
      { n: 10, text: 'Center handlebars.' },
      { n: 11, text: 'Snug clamp screws.' },
      { n: 12, text: 'Carefully turn handlebars to full right and full left fork stops. Verify that there is no contact with the fuel tank. Adjust as necessary.' },
      { n: 13, text: 'Tighten forward clamp screws until upper and lower handlebar clamps make contact.' },
      { n: 14, text: 'Tighten screws. Rear: Torque 16-20 ft-lbs (21.7-27.1 N·m). Front: Torque 16-20 ft-lbs (21.7-27.1 N·m).' },
      { n: 15, text: 'Secure harnesses as necessary with new cable straps.' },
      { n: 16, text: 'Install handlebar clamp shroud. See HEADLAMP NACELLE (Page 3-86).' },
      { n: 17, text: 'Install hand brake bracket and clamp. Engage ear in recess and rotate into position. Install clamp and screws. Begin with upper screw, tighten. Torque: 60-80 in-lbs (6.8-9 N·m).' },
      { n: 18, text: 'Install clutch lever bracket and clamp. Engage ear in recess and rotate into position. Install clamp and screws. Begin with upper screw, tighten. Torque: 60-80 in-lbs (6.8-9 N·m).' },
      { n: 19, text: 'See Figure 3-128. Connect left handlebar switch (1) and TGS (2) connectors.' },
      { n: 20, text: 'See Figure 3-129. Connect right handlebar switch connectors (1).' },
      { n: 21, text: 'FLHRXS: Install front turn signal lamps and mirrors. See MIRRORS (Page 3-132).' },
      { n: 22, text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).' }
    ]
  },

  {
    id: 't20-mirrors-handlebar-mount-remove-install',
    bikeIds: ['touring-2020'],
    system: 'bodywork',
    title: 'Mirrors: Handlebar Mount — Remove & Install',
    summary: 'Remove and install handlebar-mounted mirrors by removing acorn nut and lockwasher, then re-installing on lever bracket.',
    difficulty: 'Easy',
    timeMinutes: 15,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 132 },
    figures: [
      { file: '/figures/t20/fig-3-136.png', caption: 'Mirror Assembly (All Models Except FLHX)', stepRefs: [1] }
    ],
    tools: [],
    parts: [],
    torque: [
      { fastener: 'Mirror stem acorn nut', value: '120-144 in-lbs (13.6-16.3 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'See Figure 3-136. Remove acorn nut (1) and lockwasher (2).' },
      { n: 2, text: 'Remove mirror (3).' },
      { n: 3, text: 'FLHRXS: Support turn signal lamp out of the way.' },
      { n: 4, text: 'Insert threaded stem of mirror into hole in clutch or brake lever bracket.' },
      { n: 5, text: 'FLHRXS: See Figure 3-137. Install turn signal lamp. Position turn signal lamp on mirror stem. Verify that hand lever pivot pin is in recess in lamp mount.' },
      { n: 6, text: 'Install lockwasher and acorn nut.' },
      { n: 7, text: 'Adjust mirror as necessary and tighten acorn nut. Torque: 120-144 in-lbs (13.6-16.3 N·m).' },
      { n: 8, text: 'FLHRXS: Verify that turn signal lamp is aligned straight forward.' }
    ]
  },

  {
    id: 't20-mirrors-fairing-mount-remove-install',
    bikeIds: ['touring-2020'],
    system: 'bodywork',
    title: 'Mirrors: Fairing Mount — Remove & Install',
    summary: 'Remove and install fairing-mounted mirrors on fork-mounted fairing models. Requires outer fairing removal. Mirror stud inserts through inner fairing with backing plate and flange nut.',
    difficulty: 'Easy',
    timeMinutes: 20,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 132 },
    figures: [
      { file: '/figures/t20/fig-3-138.png', caption: 'Mirror Location Mark', stepRefs: [1] },
      { file: '/figures/t20/fig-3-139.png', caption: 'Mirror Assembly, typical (FLHX/S)', stepRefs: [2] }
    ],
    tools: [],
    parts: [],
    torque: [
      { fastener: 'Fork-mounted mirror flange nut', value: '20-30 in-lbs (2.3-3.4 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove outer fairing. See FAIRING: FORK MOUNTED (Page 3-88).' },
      { n: 2, text: 'See Figure 3-139. Remove flange nut (4) and backing plate (3). Remove mirror.' },
      { n: 3, text: 'See Figure 3-139. With the bar and shield logo on mirror right-side-up, insert threaded stud and align index pin (2) with hole in inner fairing.' },
      { n: 4, text: 'Install the backing plate (3) engaging the hole with index pin (2).' },
      { n: 5, text: 'Install flange nut (4). Tighten. Torque: 20-30 in-lbs (2.3-3.4 N·m).' },
      { n: 6, text: 'Install outer fairing. See FAIRING: FORK MOUNTED (Page 3-88).' }
    ]
  },

  {
    id: 't20-front-fender-remove-install',
    bikeIds: ['touring-2020'],
    system: 'bodywork',
    title: 'Front Fender — Remove & Install',
    summary: 'Remove and install front fender mounted on fork sliders. Disconnect fender tip lamp if equipped. Install screws and tighten after other fork components.',
    difficulty: 'Easy',
    timeMinutes: 20,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 134 },
    figures: [
      { file: '/figures/t20/fig-3-140.png', caption: 'Front Fender Tip Lamp Connector', stepRefs: [1] },
      { file: '/figures/t20/fig-3-141.png', caption: 'Front Fender Fasteners', stepRefs: [4] },
      { file: '/figures/t20/fig-3-142.png', caption: 'Secure Cables and Brake Hose', stepRefs: [2] }
    ],
    tools: [],
    parts: [
      { number: 'LOCTITE 243', description: 'Medium Strength Threadlocker and Sealant (Blue)', qty: 1 }
    ],
    torque: [
      { fastener: 'Front fender mounting screw', value: '16-20 ft-lbs (21.7-27.1 N·m)', note: 'If reusing screws, apply threadlocker.' }
    ],
    steps: [
      { n: 1, text: 'See Figure 3-140. Remove outer fairing and disconnect fender tip lamp connector, if equipped. See FAIRING: FORK MOUNTED (Page 3-88) or FAIRING: FRAME MOUNTED (Page 3-100).' },
      { n: 2, text: 'Remove cable straps as necessary.' },
      { n: 3, text: 'Draw connector housing down to fender area.' },
      { n: 4, text: 'See Figure 3-141. Remove screws (1). Remove fender.' },
      { n: 5, text: 'Install fender on fork sliders and start screws. Tighten. Torque: 16-20 ft-lbs (21.7-27.1 N·m).' },
      { n: 6, text: 'See Figure 3-142. If equipped with fender tip lamp: Mate connector. Secure harness with two new cable straps (1).' },
      { n: 7, text: 'Install outer fairing. See FAIRING: FORK MOUNTED (Page 3-88) or FAIRING: FRAME MOUNTED (Page 3-100).' }
    ]
  },

  {
    id: 't20-rear-fender-remove-install',
    bikeIds: ['touring-2020'],
    system: 'bodywork',
    title: 'Rear Fender — Remove & Install',
    summary: 'Remove and install rear fender mounted to rear frame. Remove seat first to access mounting screws. Rear fender supports other components.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 137 },
    figures: [],
    tools: [],
    parts: [],
    torque: [
      { fastener: 'Rear fender mounting screw', value: '(verify in printed manual)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove seat. See SEAT (Page 3-148).' },
      { n: 2, text: 'Remove mounting screws securing rear fender to rear frame.' },
      { n: 3, text: 'Remove rear fender.' },
      { n: 4, text: 'Install rear fender on frame. Install and tighten mounting screws.' },
      { n: 5, text: 'Install seat. See SEAT (Page 3-148).' }
    ]
  },

  {
    id: 't20-rear-frame-remove-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Rear Frame — Remove & Install',
    summary: 'Remove and install rear subframe. Requires removal of seat, Tour-Pak, saddlebags, battery, shock absorbers, and rear fender. Extensive disassembly needed.',
    difficulty: 'Advanced',
    timeMinutes: 120,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 151 },
    figures: [
      { file: '/figures/t20/fig-3-164.png', caption: 'Subframe', stepRefs: [1] },
      { file: '/figures/t20/fig-3-165.png', caption: 'Rear Frame Torque Sequence', stepRefs: [2] }
    ],
    tools: [],
    parts: [
      { number: '', description: 'Hardened washers (6)', qty: 6 }
    ],
    torque: [
      { fastener: 'Rear frame to main frame fastener', value: '40-45 ft-lbs (54.2-61 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove saddlebags. See SADDLEBAGS (Page 3-161).' },
      { n: 2, text: 'Remove left side cover. See LEFT SIDE COVER (Page 3-58).' },
      { n: 3, text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).' },
      { n: 4, text: 'Remove right side cover. See RIGHT SIDE COVER (Page 3-59).' },
      { n: 5, text: 'Raise rear of motorcycle.' },
      { n: 6, text: 'Remove seat. See SEAT (Page 3-148).' },
      { n: 7, text: 'Remove top caddy. See TOP CADDY (Page 8-110).' },
      { n: 8, text: 'Remove battery. See INSPECT BATTERY (Page 2-46).' },
      { n: 9, text: 'Record cable strap locations for assembly.' },
      { n: 10, text: 'Cut cable straps securing harnesses to rear frame. Move harnesses aside.' },
      { n: 11, text: 'Remove Tour-Pak, if equipped. See TOUR-PAK (Page 3-153).' },
      { n: 12, text: 'Remove luggage rack, Tour-Pak support or spacers as equipped. See TOUR-PAK SUPPORT (Page 3-159).' },
      { n: 13, text: 'Remove saddlebag supports. See SADDLEBAG SUPPORTS (Page 3-165).' },
      { n: 14, text: 'Remove rear fender. See REAR FENDER (Page 3-137).' },
      { n: 15, text: 'Remove shock absorbers. See REAR SHOCK ABSORBERS (Page 3-76).' },
      { n: 16, text: 'Remove two rear battery tray fasteners. See BATTERY TRAY (Page 8-116).' },
      { n: 17, text: 'Remove fastener securing left electrical caddy to rear frame.' },
      { n: 18, text: 'See Figure 3-164. Remove six fasteners (2) and washers (3) securing rear frame (1).' },
      { n: 19, text: 'Remove rear frame.' },
      { n: 20, text: 'See Figure 3-164. Hold rear frame in place. Start two lower fasteners (2) with hardened washers (3). Install four remaining upper fasteners with hardened washers.' },
      { n: 21, text: 'See Figure 3-165. Tighten rear frame fasteners in sequence. Torque: 40-45 ft-lbs (54.2-61 N·m).' },
      { n: 22, text: 'Secure left side caddy to rear frame. See LEFT SIDE CADDY (Page 8-111).' },
      { n: 23, text: 'Secure upper battery tray to rear frame. See BATTERY TRAY (Page 8-116).' },
      { n: 24, text: 'Install shock absorbers. See REAR SHOCK ABSORBERS (Page 3-76).' },
      { n: 25, text: 'Install rear fender. See REAR FENDER (Page 3-137).' },
      { n: 26, text: 'Install saddlebag supports. See SADDLEBAG SUPPORTS (Page 3-165).' },
      { n: 27, text: 'Install luggage rack, Tour-Pak support or spacers as equipped. See TOUR-PAK SUPPORT (Page 3-159).' },
      { n: 28, text: 'Install Tour-Pak, if equipped. See TOUR-PAK (Page 3-153).' },
      { n: 29, text: 'Install battery. See INSPECT BATTERY (Page 2-46).' },
      { n: 30, text: 'Install top caddy. See TOP CADDY (Page 8-110).' },
      { n: 31, text: 'Locate straps as noted during disassembly.' },
      { n: 32, text: 'Secure harnesses to rear frame with new cable straps.' },
      { n: 33, text: 'Install seat. See SEAT (Page 3-148).' },
      { n: 34, text: 'Install right side cover. See RIGHT SIDE COVER (Page 3-59).' },
      { n: 35, text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).' },
      { n: 36, text: 'Install left side cover. See LEFT SIDE COVER (Page 3-58).' },
      { n: 37, text: 'Install saddlebags. See SADDLEBAGS (Page 3-161).' },
      { n: 38, text: 'Lower motorcycle.' }
    ]
  },

  {
    id: 't20-tour-pak-remove-install',
    bikeIds: ['touring-2020'],
    system: 'bodywork',
    title: 'Tour-Pak — Remove & Install',
    summary: 'Remove and install Tour-Pak on rear frame. Disconnect electrical connectors. Remove four mounting nuts. For APC models, remove adapter plate screws first.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 153 },
    figures: [
      { file: '/figures/t20/fig-3-166.png', caption: 'Tour-Pak Connectors', stepRefs: [1] },
      { file: '/figures/t20/fig-3-167.png', caption: 'Tour-Pak Adapter Plate', stepRefs: [4] },
      { file: '/figures/t20/fig-3-168.png', caption: 'Tour-Pak Bracket Screws (APC Models)', stepRefs: [4] }
    ],
    tools: [],
    parts: [],
    torque: [
      { fastener: 'Tour-Pak mounting nuts', value: '60-72 in-lbs (6.8-8.1 N·m)', note: '' },
      { fastener: 'Tour-Pak adapter mounting screws', value: '60-72 in-lbs (6.8-8.1 N·m)', note: 'APC models only' }
    ],
    steps: [
      { n: 1, text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).' },
      { n: 2, text: 'See Figure 3-166. Separate electrical connectors.' },
      { n: 3, text: 'Remove four flange nuts securing Tour-Pak to support rack.' },
      { n: 4, text: 'APC models: See Figure 3-168. Remove four screws and flat washers adapter plate from support rack. Slide forward to release L-hooks.' },
      { n: 5, text: 'Remove assembly.' },
      { n: 6, text: 'APC models: Remove four flange nuts to release adapter plate from Tour-Pak.' },
      { n: 7, text: 'APC models: Attach adapter to Tour-Pak. Secure with four flange nuts (4). Tighten. Torque: 60-72 in-lbs (6.8-8.1 N·m).' },
      { n: 8, text: 'Set Tour-Pak in place.' },
      { n: 9, text: 'Install four flange nuts (4). Tighten. Torque: 60-72 in-lbs (6.8-8.1 N·m).' },
      { n: 10, text: 'APC models: See Figure 3-167. Engage L-hooks (5) in support rack (4). Align rear holes with rear slots in support rack (4).' },
      { n: 11, text: 'See Figure 3-168. Loosely install rear washers and screws.' },
      { n: 12, text: 'Align front holes with front slots in support rack. Install front washers and screws. Tighten. Torque: 60-72 in-lbs (6.8-8.1 N·m).' },
      { n: 13, text: 'See Figure 3-166. Mate Tour-Pak electrical connectors. Secure with anchors.' },
      { n: 14, text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).' }
    ]
  },

  {
    id: 't20-tour-pak-support-remove-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Tour-Pak Support — Remove & Install',
    summary: 'Remove and install Tour-Pak support rack on rear frame. Disconnect harness anchors. Remove and install mounting screws.',
    difficulty: 'Easy',
    timeMinutes: 20,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 159 },
    figures: [
      { file: '/figures/t20/fig-3-175.png', caption: 'Tour-Pak Support', stepRefs: [1] }
    ],
    tools: [],
    parts: [],
    torque: [
      { fastener: 'Tour-Pak support screws', value: '15-20 ft-lbs (20.3-27.1 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).' },
      { n: 2, text: 'See Figure 3-175. Remove harness connectors from anchors on support.' },
      { n: 3, text: 'Remove two screws (3) from each side.' },
      { n: 4, text: 'Remove Tour-Pak support.' },
      { n: 5, text: 'See Figure 3-175. Install Tour-pak support (1).' },
      { n: 6, text: 'Install screws (3). Tighten. Torque: 15-20 ft-lbs (20.3-27.1 N·m).' },
      { n: 7, text: 'Secure harness connectors to anchors on support (4).' },
      { n: 8, text: 'Install Tour-Pak if removed.' },
      { n: 9, text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).' }
    ]
  },

  {
    id: 't20-saddlebag-remove-install',
    bikeIds: ['touring-2020'],
    system: 'bodywork',
    title: 'Saddlebag — Remove & Install',
    summary: 'Remove and install saddlebags on left and right sides. Open lid and turn mounting screw levers counterclockwise to remove. Replace grommets if damaged.',
    difficulty: 'Easy',
    timeMinutes: 15,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 161 },
    figures: [
      { file: '/figures/t20/fig-3-177.png', caption: 'Saddlebag Removal/Installation', stepRefs: [2] }
    ],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Open saddlebag lid.' },
      { n: 2, text: 'See Figure 3-177. Turn mounting screw levers counterclockwise to remove.' },
      { n: 3, text: 'Remove saddlebag.' },
      { n: 4, text: 'See Figure 3-177. Place saddlebag in position on saddlebag rail (2).' },
      { n: 5, text: 'Install mounting screws through grommets into support bracket. The rear mounting screw lever will interfere with the saddlebag cover unless positioned with lever pointed downward.' },
      { n: 6, text: 'Tighten mounting screws until lever is pointed downward as shown.' },
      { n: 7, text: 'Check that saddlebag is securely fastened. Verify that saddlebag bottom isolators properly engage the lower support tube.' },
      { n: 8, text: 'Pull on saddlebag to confirm that it is securely fastened.' },
      { n: 9, text: 'Close saddlebag lid.' }
    ]
  },

  {
    id: 't20-saddlebag-support-remove-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Saddlebag Support — Remove & Install',
    summary: 'Remove and install saddlebag support assembly. Requires seat, side covers, and main fuse removal. Extensive torque specifications per Table 3-11.',
    difficulty: 'Moderate',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 165 },
    figures: [
      { file: '/figures/t20/fig-3-182.png', caption: 'Saddlebag Supports', stepRefs: [1] },
      { file: '/figures/t20/fig-3-183.png', caption: 'Saddlebag Supports Cushion', stepRefs: [2] }
    ],
    tools: [],
    parts: [],
    torque: [
      { fastener: 'Saddlebag guard to frame screw, lower', value: '32-36 ft-lbs (43.4-48.8 N·m)', note: '' },
      { fastener: 'Saddlebag guard to frame screw, upper', value: '32-36 ft-lbs (43.4-48.8 N·m)', note: '' },
      { fastener: 'Saddlebag support casting to frame screw', value: '15-20 ft-lbs (20.3-27.1 N·m)', note: '' },
      { fastener: 'Saddlebag support tube screw', value: '70-100 in-lbs (7.9-11.3 N·m)', note: '' },
      { fastener: 'Saddlebag support tube to support casting fastener, large', value: '30-37 ft-lbs (40.7-50.2 N·m)', note: '' },
      { fastener: 'Saddlebag support tube to support casting fastener, small', value: '15-20 ft-lbs (20.3-27.1 N·m)', note: '' },
      { fastener: 'Seat strap bracket screw', value: '120-144 in-lbs (13.6-16.3 N·m)', note: '' },
      { fastener: 'Muffler to saddlebag support screws', value: '14-18 ft-lbs (19-24.4 N·m)', note: 'Complete step' }
    ],
    steps: [
      { n: 1, text: 'Remove left and right saddlebags. See SADDLEBAGS (Page 3-161).' },
      { n: 2, text: 'Remove left side cover. See LEFT SIDE COVER (Page 3-58).' },
      { n: 3, text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).' },
      { n: 4, text: 'Remove seat. See SEAT (Page 3-148).' },
      { n: 5, text: 'Remove fasteners and lockwashers securing muffler to saddlebag support.' },
      { n: 6, text: 'See Figure 3-182. Remove screw (4) and flange nut.' },
      { n: 7, text: 'Remove screws (5, 6).' },
      { n: 8, text: 'Remove screws (1, 8) to release support casting (10).' },
      { n: 9, text: 'Remove saddlebag support assembly with support casting.' },
      { n: 10, text: 'Disassemble as needed.' },
      { n: 11, text: 'Assemble saddlebag support along with support casting. Refer to Table 3-11 for tightening specifications.' },
      { n: 12, text: 'See Figure 3-183. Verify that rubber cushion is in place and not damaged.' },
      { n: 13, text: 'See Figure 3-182. If removed, install saddlebag mounting clips (9).' },
      { n: 14, text: 'Secure muffler to bracket with fasteners and lockwashers. Tighten. Torque: 14-18 ft-lbs (19-24.4 N·m).' },
      { n: 15, text: 'Install seat. See SEAT (Page 3-148).' },
      { n: 16, text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).' },
      { n: 17, text: 'Install left side cover. See LEFT SIDE COVER (Page 3-58).' },
      { n: 18, text: 'Install left and right saddlebags. See SADDLEBAGS (Page 3-161).' }
    ]
  },

  {
    id: 't20-seat-solo-remove-install',
    bikeIds: ['touring-2020'],
    system: 'bodywork',
    title: 'Seat: Solo — Remove & Install',
    summary: 'Remove and install solo seat. Requires removing seat nuts. Push seat forward and downward to engage tongue in slot.',
    difficulty: 'Easy',
    timeMinutes: 10,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 148 },
    figures: [
      { file: '/figures/t20/fig-3-158.png', caption: 'Solo Seat', stepRefs: [1] }
    ],
    tools: [],
    parts: [],
    torque: [
      { fastener: 'Seat mounting screw', value: '48-72 in-lbs (5.4-8.1 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'See Figure 3-158. Remove seat nuts (1).' },
      { n: 2, text: 'See Figure 3-158. Install seat. Push front of seat downward and forward until slot engages tongue.' },
      { n: 3, text: 'Install seat nuts (1).' },
      { n: 4, text: 'Pull up on seat to verify that it is secure.' }
    ]
  },

  {
    id: 't20-seat-two-up-remove-install',
    bikeIds: ['touring-2020'],
    system: 'bodywork',
    title: 'Seat: Two-Up One-Piece — Remove & Install',
    summary: 'Remove and install two-up one-piece seat. Requires opening saddlebag and Tour-Pak (if equipped) to access seat strap screw. Use care with seat cushion fabric.',
    difficulty: 'Moderate',
    timeMinutes: 20,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 148 },
    figures: [
      { file: '/figures/t20/fig-3-159.png', caption: 'Seat Strap Screw', stepRefs: [2] },
      { file: '/figures/t20/fig-3-160.png', caption: 'Seat Mounting Slot', stepRefs: [5] },
      { file: '/figures/t20/fig-3-161.png', caption: 'Seat Tongue', stepRefs: [5] }
    ],
    tools: [],
    parts: [],
    torque: [
      { fastener: 'Seat mounting screw', value: '48-72 in-lbs (5.4-8.1 N·m)', note: '' },
      { fastener: 'Seat strap screw', value: '48-72 in-lbs (5.4-8.1 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Open either saddlebag.' },
      { n: 2, text: 'See Figure 3-159. Remove seat strap screw (1).' },
      { n: 3, text: 'Open Tour-Pak if equipped.' },
      { n: 4, text: 'Access to seat screw requires compression of the rear of seat cushion. Use care to not damage fabric during removal or installation.' },
      { n: 5, text: 'If Tour-Pak is located in its forward-most position, the seat screw is difficult to access. Loosen Tour-Pak and slide fully rearward. See TOUR-PAK (Page 3-153).' },
      { n: 6, text: 'APC models: Remove four Tour-Pak mounting screws. Move Tour-Pak to access seat screw.' },
      { n: 7, text: 'Remove seat screw (3) to release seat. Raise rear of seat. See Figure 3-160 and Figure 3-161. Push seat rearward to free slot from tongue.' },
      { n: 8, text: 'Remove seat.' },
      { n: 9, text: 'See Figure 3-160 and Figure 3-161. Place seat in position.' },
      { n: 10, text: 'Hold rear of seat approximately 76.2 mm (3 in) above fender. Push front of seat downward and forward until slot engages tongue.' },
      { n: 11, text: 'Secure seat to fender with seat screw. Tighten. Torque: 48-72 in-lbs (5.4-8.1 N·m).' },
      { n: 12, text: 'See Figure 3-159. Tuck end of seat strap (2) into slot. Secure seat strap screw (1) and washer. Tighten. Torque: 48-72 in-lbs (5.4-8.1 N·m).' },
      { n: 13, text: 'Pull up on seat to verify that it is secure.' },
      { n: 14, text: 'Close saddlebag.' }
    ]
  },

  {
    id: 't20-jiffy-stand-leg-remove-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Jiffy Stand: Leg — Remove & Install',
    summary: 'Remove and install jiffy stand leg. Requires extending stand to down position, removing fasteners, and managing spring. Apply lubricant to rotating areas.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 146 },
    figures: [
      { file: '/figures/t20/fig-3-155.png', caption: 'Leg Stop Orientation in Full Forward (Down) Position', stepRefs: [3] },
      { file: '/figures/t20/fig-3-156.png', caption: 'Rubber Stop and Spring Orientation', stepRefs: [1] },
      { file: '/figures/t20/fig-3-157.png', caption: 'Jiffy Stand Assembly', stepRefs: [1] }
    ],
    tools: [],
    parts: [
      { number: '98960-97', description: 'Anti-Seize Lubricant', qty: 1 }
    ],
    torque: [
      { fastener: 'Jiffy stand leg stop hex screw', value: '15-20 ft-lbs (20.3-27.1 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Set motorcycle upright. See Secure the Motorcycle for Service (Page 2-3).' },
      { n: 2, text: 'See Figure 3-157. Remove jiffy stand leg (8). Extend jiffy stand leg (8) to down position.' },
      { n: 3, text: 'Remove hex bolt (4), lockwasher (3), flat washer (2) and leg stop (5).' },
      { n: 4, text: 'Hold jiffy stand leg (8) forward beyond normal position.' },
      { n: 5, text: 'Remove end of spring (9) from jiffy stand leg (8).' },
      { n: 6, text: 'Remove jiffy stand leg (8) from bracket (1).' },
      { n: 7, text: 'Remove other end of spring (9) from frame weldment.' },
      { n: 8, text: 'Inspect parts for wear or damage. Replace if necessary.' },
      { n: 9, text: 'Apply lubricant to area of leg that rotates with bracket. Consumable: ANTI-SEIZE LUBRICANT (98960-97).' },
      { n: 10, text: 'See Figure 3-156. Verify that end of spring enters hole from front of leg weldment. If end of spring enters hole from rear of weldment, spring coil will rub on leg when extended.' },
      { n: 11, text: 'Install spring. Insert one end of spring into hole in frame weldment. Insert leg up through bracket. Hold leg forward beyond normal down position. Insert other end of spring into hole on leg weldment.' },
      { n: 12, text: 'See Figure 3-155. Install leg stop (1). Hold leg normal forward (down) position and install leg stop (1) with stamped side down. Verify that longer side of leg stop (1) faces rear.' },
      { n: 13, text: 'Install flat washer, lockwasher and hex screw (2). Tighten. Torque: 15-20 ft-lbs (20.3-27.1 N·m).' }
    ]
  },

  {
    id: 't20-jiffy-stand-bracket-remove-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Jiffy Stand: Bracket — Remove & Install',
    summary: 'Remove and install jiffy stand bracket. Requires removing foot controls and jiffy stand leg. Install with proper fastener torque and leg engagement.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 146 },
    figures: [
      { file: '/figures/t20/fig-3-157.png', caption: 'Jiffy Stand Assembly', stepRefs: [1] }
    ],
    tools: [],
    parts: [],
    torque: [
      { fastener: 'Jiffy stand bracket fasteners', value: '36-42 ft-lbs (48.8-57 N·m)', note: '' },
      { fastener: 'Jiffy stand leg stop hex screw', value: '15-20 ft-lbs (20.3-27.1 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Set motorcycle upright. See Secure the Motorcycle for Service (Page 2-3).' },
      { n: 2, text: 'Remove left foot control and support brackets. See RIDER FOOTRESTS (Page 3-142).' },
      { n: 3, text: 'See Figure 3-157. Remove jiffy stand leg (8). See Remove Jiffy Stand Leg in this section.' },
      { n: 4, text: 'Remove jiffy stand bracket (1). Remove two fasteners (6) and lockwashers (7).' },
      { n: 5, text: 'See Figure 3-157. Install two fasteners (6) and lockwashers (7) to secure front bracket (1) to frame weldment.' },
      { n: 6, text: 'Temporarily install left foot control rear fastener to align rear of jiffy stand bracket (1) but do not tighten.' },
      { n: 7, text: 'Secure front fasteners (6). Tighten. Torque: 36-42 ft-lbs (48.8-57 N·m).' },
      { n: 8, text: 'Install left foot control and passenger footrest. See RIDER FOOTRESTS (Page 3-142).' },
      { n: 9, text: 'Install jiffy stand leg. See Install Jiffy Stand Leg in this section.' },
      { n: 10, text: 'Verify that jiffy stand swings freely to fully extended and retracted positions.' },
      { n: 11, text: 'Remove motorcycle from upright. See Secure the Motorcycle for Service (Page 2-3).' },
      { n: 12, text: 'See Figure 3-156. Verify that rubber stop is installed in hole of jiffy stand weldment to prevent damage to painted finish.' }
    ]
  },

  {
    id: 't20-rider-footrest-remove-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Rider Footrest — Remove & Install',
    summary: 'Remove and install rider left footrest and support brackets on frame. Requires multiple fastener torque specifications.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 142 },
    figures: [],
    tools: [],
    parts: [],
    torque: [
      { fastener: 'Rider footrest mounting fastener', value: '(verify in printed manual)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Remove rider left footrest and support brackets.' }
    ]
  },

  {
    id: 't20-passenger-footrest-remove-install',
    bikeIds: ['touring-2020'],
    system: 'chassis',
    title: 'Passenger Footrest — Remove & Install',
    summary: 'Remove and install passenger footboard or footpeg. Can remove passenger footboard or standard footpeg. Replace pad and adjust as needed.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 144 },
    figures: [
      { file: '/figures/t20/fig-3-153.png', caption: 'Passenger Footboard Details', stepRefs: [1] },
      { file: '/figures/t20/fig-3-154.png', caption: 'Passenger Footpeg: Standard', stepRefs: [1] }
    ],
    tools: [],
    parts: [],
    torque: [
      { fastener: 'Footpeg pad screw', value: '15-20 ft-lbs (20.3-27.1 N·m)', note: 'Apply threadlocker' }
    ],
    steps: [
      { n: 1, text: 'Passenger Footboard: See Figure 3-153. Remove rubber pad (1). Tap two pivot pins (9) toward center of footboard (8) and remove. Remove footboard (8) from footboard bracket (6). Remove steel ball (4) and spring (5).' },
      { n: 2, text: 'Passenger Footpeg: Standard: See Figure 3-154. Remove socket screw (1) and rubber pad (2) from footpeg (3).' },
      { n: 3, text: 'Install footpeg (3) as shown. Install pivot pin (5). Secure with new retaining ring (4).' },
      { n: 4, text: 'Install footpeg (3) onto footrest mount (6).' },
      { n: 5, text: 'Install rubber pad (2) into footpeg (3). Rotate footpeg (3) so that rubber pad (2) is topside.' },
      { n: 6, text: 'Apply a drop of threadlocker to threads of socket screw (1) and install. Tighten. Torque: 15-20 ft-lbs (20.3-27.1 N·m).' }
    ]
  }
,
{
  id: 't20-fairing-lowers-air-cooled-remove-install',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Fairing Lowers (Air-Cooled) — Remove and Install',
  summary: 'Remove and install lower fairing assembly on air-cooled models. Includes fairing cap, clamps, and alignment procedures.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 113 },
  figures: [
    { file: '/figures/t20/fig-3-113.png', caption: 'Lower Fairing: Air Cooled', stepRefs: [2, 4, 5, 6, 7, 8] },
    { file: '/figures/t20/fig-3-114.png', caption: 'Lower Fairing Mounting Dimensions', stepRefs: [4] }
  ],
  tools: [],
  parts: [{ number: '—', description: 'Rubber washer (new)', qty: 1 }],
  torque: [
    { fastener: 'Lower fairing cap flange nut', value: '30-35 in-lbs (3.4-3.9 N·m)', note: '' },
    { fastener: 'Lower fairing, upper clamp nuts', value: '30-35 in-lbs (3.4-3.9 N·m)', note: '' },
    { fastener: 'Lower fairing, lower clamp', value: '90-100 in-lbs (10.2-11.3 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Open glove box door.' },
    { n: 2, text: 'See Figure 3-113. Remove fairing cap. Remove flange nut (1) securing fairing cap (3). Remove fairing cap and flat washer (10).' },
    { n: 3, text: 'Remove lower fairing clamp screw (9) and nut (6). Discard rubber washer (8).' },
    { n: 4, text: 'Remove flange nuts (4) and upper clamp (2).' },
    { n: 5, text: 'Remove lower fairing assembly.' },
    { n: 6, text: 'Place fairing lower into position.' },
    { n: 7, text: 'See Figure 3-113. Loosely install upper clamp (2) with two flange nuts (4).' },
    { n: 8, text: 'Loosely install new rubber washer (8), clamp (7), screw (9) and nut (6).' },
    { n: 9, text: 'See Figure 3-114. Align upper clamp to dimension (1). See Figure 3-114. Clearance from vent openings to shift lever (2) and brake pedal (3) should approximately match the distance shown.' },
    { n: 10, text: 'See Figure 3-113. Tighten flange nuts (4). Torque: 30-35 in-lbs (3.4-3.9 N·m).' },
    { n: 11, text: 'See Figure 3-113. Verify that fairing lower is aligned. Tighten lower screw (9). Torque: 90-100 in-lbs (10.2-11.3 N·m).' },
    { n: 12, text: 'Place flat washer (10) on fairing cap stud.' },
    { n: 13, text: 'Install fairing cap (3) with flange nut (1). Torque: 30-35 in-lbs (3.4-3.9 N·m).' },
    { n: 14, text: 'Close glove box door.' }
  ]
},
{
  id: 't20-fairing-lowers-twin-cooled-remove-install',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Fairing Lowers (Twin-Cooled) — Remove and Install',
  summary: 'Remove and install lower fairing assembly on twin-cooled models. Includes disconnecting radiator hoses, draining coolant, and cooling system components.',
  difficulty: 'Advanced',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 113 },
  figures: [
    { file: '/figures/t20/fig-3-115.png', caption: 'Lower Fairing: Twin-Cooled', stepRefs: [2, 5, 6] },
    { file: '/figures/t20/fig-3-116.png', caption: 'Lower Fairing Mounting Dimensions', stepRefs: [4] }
  ],
  tools: [],
  parts: [{ number: '—', description: 'Rubber washer (new)', qty: 1 }],
  torque: [
    { fastener: 'Lower fairing cap flange nut', value: '30-35 in-lbs (3.4-3.9 N·m)', note: '' },
    { fastener: 'Lower fairing, upper clamp nuts', value: '30-35 in-lbs (3.4-3.9 N·m)', note: '' },
    { fastener: 'Lower fairing, lower clamp', value: '90-100 in-lbs (10.2-11.3 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).' },
    { n: 2, text: 'Remove fairing lower access panel. Pry at center top and near each lower corner to release retainers.' },
    { n: 3, text: 'Fairing lower shell only: Remove fan. See COOLING FAN (Page 8-93). Allow radiator to hang by hoses.' },
    { n: 4, text: 'Drain coolant system. See INSPECT RADIATOR AND COOLANT (Page 2-33).' },
    { n: 5, text: 'See Figure 3-115. Disconnect upper hose (2) from the upper cross tube. Disconnect lower hose (6) from pump assembly.' },
    { n: 6, text: 'Disconnect fan power connector (7) located near pump.' },
    { n: 7, text: 'Remove flange nut (1) securing fairing cap (4). Remove fairing cap and flat washer (12).' },
    { n: 8, text: 'Remove fairing lower clamp screw (11) and nut (8). Discard rubber washer (10).' },
    { n: 9, text: 'Remove flange nuts (5) securing upper clamp (3).' },
    { n: 10, text: 'Remove fairing lower assembly.' },
    { n: 11, text: 'Place fairing lower into position.' },
    { n: 12, text: 'See Figure 3-115. Install upper clamp (3) and two flange nuts (5). Leave fasteners loose.' },
    { n: 13, text: 'Install new rubber washer (10), clamp (9), screw (11) and nut (8). Leave fasteners loose.' },
    { n: 14, text: 'See Figure 3-116. Align upper clamp to dimension (1). Verify shift lever and brake pedal do not contact fairing lower vent.' },
    { n: 15, text: 'See Figure 3-115. Tighten flange nuts (5) to 30-35 in-lbs (3.4-3.9 N·m).' },
    { n: 16, text: 'See Figure 3-115. Verify that fairing lower is aligned. Tighten lower screw (11) to 90-100 in-lbs (10.2-11.3 N·m).' },
    { n: 17, text: 'Place flat washer (12) on stud of fairing cap. Install fairing cap (4) with flange nut (1). Torque: 30-35 in-lbs (3.4-3.9 N·m).' },
    { n: 18, text: 'Verify shift lever and brake pedal do not contact fairing lower vent.' },
    { n: 19, text: 'Connect fan power connector (7) located near pump.' },
    { n: 20, text: 'Connect upper (2) and lower (6) radiator hoses.' },
    { n: 21, text: 'Install main fuse.' },
    { n: 22, text: 'Fill coolant system. See INSPECT RADIATOR AND COOLANT (Page 2-33).' },
    { n: 23, text: 'Install fairing lower access panel.' },
    { n: 24, text: 'Install coolant pump cover.' }
  ]
},
{
  id: 't20-fairing-lowers-air-cooled-disassemble-assemble',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Fairing Lowers (Air-Cooled) — Disassemble and Assemble Components',
  summary: 'Disassemble and assemble internal components of air-cooled fairing lowers: inner panel, glove box, grille, fascia, and vent door.',
  difficulty: 'Moderate',
  timeMinutes: 60,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 115 },
  figures: [
    { file: '/figures/t20/fig-3-117.png', caption: 'Lower Fairing Components', stepRefs: [] },
    { file: '/figures/t20/fig-3-118.png', caption: 'Glove Box', stepRefs: [] },
    { file: '/figures/t20/fig-3-119.png', caption: 'Fascia Adhesive Locations', stepRefs: [] }
  ],
  tools: [{ name: 'Flexible putty knife', note: '¼ in (19 mm)' }],
  parts: [
    { number: '—', description: 'Electrical contact lubricant', qty: 1 },
    { number: '—', description: 'Isopropyl alcohol', qty: 1 }
  ],
  torque: [
    { fastener: 'Fairing lower inner panel screws', value: '65-75 in-lbs (7.3-8.5 N·m)', note: '' },
    { fastener: 'Lower fairing glove box screws', value: '12-17 in-lbs (1.4-1.9 N·m)', note: '' },
    { fastener: 'Lower fairing glove box tray screws', value: '12-18 in-lbs (1.4-2 N·m)', note: '' },
    { fastener: 'Lower fairing vent knob screw', value: '12-18 in-lbs (1.4-2 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Remove grille panel. Carefully pry on curved edge of grille plate (5) to release retainers. Remove from fascia.' },
    { n: 2, text: 'See Figure 3-117. Remove two screws (9) securing inner panel (8).' },
    { n: 3, text: 'Remove three screws securing glove box frame to fairing lower.' },
    { n: 4, text: 'Pull glove box frame away and pull vent link (4) down to disconnect from vent door lever.' },
    { n: 5, text: 'See Figure 3-118. Remove three screws (7) to release glove box tray (8).' },
    { n: 6, text: 'Remove screw (5) to disassemble knob from link.' },
    { n: 7, text: 'Squeeze tabs to release latch (2).' },
    { n: 8, text: 'Remove glove box door. Disengage spring (12). Remove push nuts (14) from pins (11). Remove pins. Remove door. If necessary, remove damper (13).' },
    { n: 9, text: 'Remove vent door. See Figure 3-117. Rotate lever (5) to position shown. Lift lever assembly to remove. Remove door (6). Push up on lower pivot pin (7) to remove.' },
    { n: 10, text: 'Remove fascia. See Figure 3-119. The fascia is retained by double-faced adhesive at locations shown. Starting around the opening, push the fascia outward to loosen the medium (2) and small (1) tape strips. Using a Length: ¼ in (19 mm) flexible putty knife, push between the fascia and fairing housing to cut the large tape strips (3). A small amount of dish soap or liquid lubricant on the knife blade eases this process. Separate fascia from fairing lower housing. Remove all remaining adhesive. Wash thoroughly with isopropyl alcohol. Allow to dry completely.' },
    { n: 11, text: 'Install fascia. Replacement fascia has adhesive strips installed. See Figure 3-119. Verify tape locations are clean and dry. If installing original fascia, place new adhesive strips on fascia in locations shown. Align fascia and press into place. Apply pressure at each tape location for 10-15 seconds.' },
    { n: 12, text: 'Install vent door. See Figure 3-117. Install lower pivot pin (7) in fairing housing. Rotate lever (5) to position shown. Place door on lower pivot pin (7). Hold door (6) at approximate 45 degree angle as shown and install lever (5). Rotate door to verify operation.' },
    { n: 13, text: 'Install glove box door. See Figure 3-118. If removed, install damper (13). Fit spring (12) on pin opposite damper. Install pins to secure door. Install new push nuts (14). Engage spring.' },
    { n: 14, text: 'Install latch oriented as shown in inset. Note that latch and latch opening are not symmetrical.' },
    { n: 15, text: 'Apply a film of ELECTRICAL CONTACT LUBRICANT to the upper area along the slot where the slider runs.' },
    { n: 16, text: 'Install screw (5) to secure knob to slider. Torque: 12-18 in-lbs (1.4-2 N·m).' },
    { n: 17, text: 'Install three screws (7) to secure glove box tray to glove box. Torque: 12-18 in-lbs (1.4-2 N·m).' },
    { n: 18, text: 'Engage linkage to vent door arm.' },
    { n: 19, text: 'See Figure 3-117. Install inner panel (8) with screws (9). Torque: 65-75 in-lbs (7.3-8.5 N·m).' },
    { n: 20, text: 'Secure glove box assembly to fairing lower with three screws. Torque: 12-17 in-lbs (1.4-1.9 N·m).' },
    { n: 21, text: 'Install grille plate.' }
  ]
},
{
  id: 't20-engine-guard-remove-install',
  bikeIds: ['touring-2020'],
  system: 'chassis',
  title: 'Engine Guard — Remove and Install',
  summary: 'Remove and install engine guard. Requires removal of lower fairings if present and release of fairing clamps.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 118 },
  figures: [{ file: '/figures/t20/fig-3-120.png', caption: 'Engine Guard', stepRefs: [1, 2] }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Engine guard lower screws', value: '15-20 ft-lbs (20.3-27.1 N·m)', note: '' },
    { fastener: 'Engine guard upper screws', value: '22-28 ft-lbs (29.8-37.9 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Remove lower fairings, if present. See FAIRING LOWERS (Page 3-113).' },
    { n: 2, text: 'Remove lower fairing clamps from engine guard.' },
    { n: 3, text: 'See Figure 3-120. Remove two screws (1) to release ends of engine guard from frame weldments.' },
    { n: 4, text: 'Remove screw (2) and flat washer (3) and remove engine guard.' },
    { n: 5, text: 'See Figure 3-120. Insert tab at top of engine guard into slot at base of steering head. Start screw (2) with flat washer (3).' },
    { n: 6, text: 'Secure lower ends of engine guard to frame weldments with screws (1). Torque: 15-20 ft-lbs (20.3-27.1 N·m).' },
    { n: 7, text: 'Tighten upper screw (2). Torque: 22-28 ft-lbs (29.8-37.9 N·m).' },
    { n: 8, text: 'Install lower fairing clamps on each side of engine guard. Install lower fairings, if present. See FAIRING LOWERS (Page 3-113).' }
  ]
},
{
  id: 't20-air-deflectors-fork-mounted-remove-install',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Air Deflectors (Fork-Mounted Fairing) — Remove and Install',
  summary: 'Remove and install adjustable air deflectors on fork-mounted fairing models.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 119 },
  figures: [{ file: '/figures/t20/fig-3-121.png', caption: 'Air Deflector (Adjustable)', stepRefs: [1, 2] }],
  tools: [],
  parts: [],
  torque: [{ fastener: 'Fairing air deflector screws fork-mounted fairing', value: '15-25 in-lbs (1.7-2.8 N·m)', note: '' }],
  steps: [
    { n: 1, text: 'See Figure 3-121. Remove three screws to release air deflector at side of inner fairing.' },
    { n: 2, text: 'Repeat previous step on opposite side.' },
    { n: 3, text: 'See Figure 3-121. Install three screws to fasten air deflector at side of inner fairing. Alternately tighten screws. Torque: 15-25 in-lbs (1.7-2.8 N·m).' },
    { n: 4, text: 'Repeat previous step on opposite side.' }
  ]
},
{
  id: 't20-air-deflectors-frame-mounted-remove-install',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Air Deflectors (Frame-Mounted Fairing) — Remove and Install',
  summary: 'Remove and install air deflectors on frame-mounted fairing models.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 119 },
  figures: [{ file: '/figures/t20/fig-3-122.png', caption: 'Air Deflector (right side shown)', stepRefs: [1, 2] }],
  tools: [],
  parts: [],
  torque: [{ fastener: 'Fairing air deflector screws frame-mounted fairing', value: '8-15 in-lbs (0.9-1.7 N·m)', note: '' }],
  steps: [
    { n: 1, text: 'See Figure 3-122. Remove two screws.' },
    { n: 2, text: 'Repeat previous step on opposite side.' },
    { n: 3, text: 'See Figure 3-122. Install two screws to fasten air deflector at side of inner fairing. Alternately tighten screws. Torque: 8-15 in-lbs (0.9-1.7 N·m).' },
    { n: 4, text: 'Repeat previous step on opposite side.' }
  ]
},
{
  id: 't20-air-deflectors-mid-frame-remove-install',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Air Deflectors (Mid-Frame) — Remove and Install',
  summary: 'Remove and install mid-frame air deflectors. Includes spark plug wire routing.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 119 },
  figures: [{ file: '/figures/t20/fig-3-123.png', caption: 'Mid-Frame Air Deflector', stepRefs: [1, 2] }],
  tools: [],
  parts: [{ number: '—', description: 'Washers (if equipped with smoke tinted deflectors)', qty: 4 }],
  torque: [{ fastener: 'Mid-Frame deflector screw', value: '25-35 in-lbs (2.8-4 N·m)', note: '' }],
  steps: [
    { n: 1, text: 'See Figure 3-123. Release rear spark plug wire from retainer (3).' },
    { n: 2, text: 'Remove deflector. Loosen screws (5). Remove screws, washers (4), air deflector (1 or 6) and if equipped, washers (8) from frame. Note: Models using smoke tinted air deflectors have washers between deflector and frame.' },
    { n: 3, text: 'See Figure 3-123. Install deflectors. If removed: Install upper-right screw (5) through washer (4), hole (2) and washer (8) if equipped. Install washers (8) if equipped, air deflector (1 or 6), washers (4) and screws (5). Tighten screws. Torque: 25-35 in-lbs (2.8-4 N·m).' },
    { n: 4, text: 'Secure rear spark plug wire in retainer (3).' }
  ]
},
{
  id: 't20-rear-fender-disassemble',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Rear Fender — Disassemble Components',
  summary: 'Disassemble rear fender mounting hardware, stud plates, and lights/harnesses for service access.',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 137 },
  figures: [
    { file: '/figures/t20/fig-3-145.png', caption: 'Rear Fender Lights Connector (models with under fender wiring)', stepRefs: [3] },
    { file: '/figures/t20/fig-3-146.png', caption: 'Rear Fender Lights Connector: FLHX, FLHXS, FLTRX, FLTRXS', stepRefs: [4] },
    { file: '/figures/t20/fig-3-147.png', caption: 'Rear Fender Lamps Harness and Antenna Cable: FLHX, FLHXS, FLTRX, FLTRXS', stepRefs: [4] },
    { file: '/figures/t20/fig-3-148.png', caption: 'Rear Fender', stepRefs: [1] }
  ],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Rear fender mounting nut', value: '15-20 ft-lbs (20.3-27.1 N·m)', note: '' },
    { fastener: 'Rear fender stud plate nut', value: '60-96 in-lbs (6.8-10.8 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'See Figure 3-148. Remove nut (1), washer (2) and mounting boss (9).' },
    { n: 2, text: 'See Figure 3-148. Remove flange nuts (4).' },
    { n: 3, text: 'Remove nylon washers (5) and stud plate (6).' },
    { n: 4, text: 'All except FLHX, FLHXS, FLTRX, FLTRXS, FLHRXS: For service of the tail lamps or harness, see TAIL LAMP (Page 8-59) and REAR TURN SIGNAL LAMPS (Page 8-54).' },
    { n: 5, text: 'FLHX, FLHXS, FLTRX, FLTRXS, FLHRXS: For service of the rear fascia or fascia lamp, see REAR FENDER TIP LAMP (Page 8-61). For service of the tail lamps or harness, see TAIL LAMP (Page 8-59) and REAR TURN SIGNAL LAMPS (Page 8-54).' }
  ]
},
{
  id: 't20-rear-fender-wire-conduit-remove-install',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Rear Fender Wire Conduit — Remove and Install',
  summary: 'Remove and install wire conduit on rear fender using adhesive backing. Includes harness routing and air purging.',
  difficulty: 'Moderate',
  timeMinutes: 25,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 140 },
  figures: [
    { file: '/figures/t20/fig-3-149.png', caption: 'Fender Conduit Placement', stepRefs: [1] },
    { file: '/figures/t20/fig-3-150.png', caption: 'Removing Protective Strip From Conduit', stepRefs: [2] },
    { file: '/figures/t20/fig-3-151.png', caption: 'Purging Air Between Adhesive and Fender', stepRefs: [2] }
  ],
  tools: [{ name: 'Wallpaper roller', note: 'For adhesive application' }],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove rear fender. See REAR FENDER (Page 3-137).' },
    { n: 2, text: 'Remove rear fender wire harness. See electrical diagnostic manual. Remove wire terminals from harness connectors. Remove wire harness from conduit.' },
    { n: 3, text: 'Remove conduit. Pull conduit from fender. Thoroughly clean inside surface of fender with soap and water until it is free of dirt, oil or other debris.' },
    { n: 4, text: 'See Figure 3-50Figure 3-51Figure 3-149Figure 4-21Figure 6-1Figure 6-3Figure 6-5Figure 6-21Figure 6-26Figure 6-36Figure 7-4. Install wiring conduit. Clean mounting surface. See MEDALLIONS, BADGES, TANK EMBLEMS AND ADHESIVE STRIPS (Page 3-167). With adhesive backing still in place, test fit conduit.' },
    { n: 5, text: 'See Figure 3-150 and Figure 3-151. Remove the adhesive backing (2). Lightly position the conduit (1) in place. Using a wallpaper roller (4), roll along conduit (3) to purge the air from between adhesive and fender.' },
    { n: 6, text: 'Install wiring harness. Slide wiring harness through new conduit. Install wire terminals into connector housings. See the electrical diagnostic manual.' },
    { n: 7, text: 'Install connectors to proper component and install rear fender. See REAR FENDER (Page 3-137).' }
  ]
},
{
  id: 't20-rear-license-plate-bracket-remove-install',
  bikeIds: ['touring-2020'],
  system: 'chassis',
  title: 'Rear License Plate Bracket — Remove and Install',
  summary: 'Remove and install rear license plate bracket. Includes turn signal bracket or Tour-Pak support mounting variants.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 141 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove left saddlebag. See SADDLEBAGS (Page 3-161).' },
    { n: 2, text: 'Remove left side cover. See LEFT SIDE COVER (Page 3-58).' },
    { n: 3, text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).' },
    { n: 4, text: 'Turn signal bracket mounted: See REAR TURN SIGNAL LAMPS (Page 8-54).' },
    { n: 5, text: 'Tour-Pak support mounted: See TOUR-PAK (Page 3-153).' },
    { n: 6, text: 'See REAR TURN SIGNAL LAMPS (Page 8-54).' },
    { n: 7, text: 'See REAR TURN SIGNAL LAMPS (Page 8-54).' },
    { n: 8, text: 'Turn signal bracket mounted: See REAR TURN SIGNAL LAMPS (Page 8-54).' },
    { n: 9, text: 'Tour-Pak support mounted: See TOUR-PAK (Page 3-153).' },
    { n: 10, text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).' },
    { n: 11, text: 'Install left side cover. See LEFT SIDE COVER (Page 3-58).' },
    { n: 12, text: 'Install left saddlebag. See SADDLEBAGS (Page 3-161).' }
  ]
},
{
  id: 't20-tour-pak-electrical-mount-detail',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Tour-Pak — Remove and Install',
  summary: 'Remove and install Tour-Pak assembly including electrical connectors and mounting to support rack.',
  difficulty: 'Moderate',
  timeMinutes: 35,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 153 },
  figures: [
    { file: '/figures/t20/fig-3-166.png', caption: 'Tour-Pak Connectors', stepRefs: [1] },
    { file: '/figures/t20/fig-3-167.png', caption: 'Tour-Pak Bracket Screws (APC Models)', stepRefs: [4] },
    { file: '/figures/t20/fig-3-168.png', caption: 'Tour-Pak Support Assembly', stepRefs: [4] }
  ],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Tour-Pak adapter mounting screws', value: '60-72 in-lbs (6.8-8.1 N·m)', note: 'APC models' },
    { fastener: 'Tour-Pak mounting nuts', value: '60-72 in-lbs (6.8-8.1 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'See Figure 3-166. Separate electrical connectors.' },
    { n: 2, text: 'Remove four flange nuts securing Tour-Pak to support rack.' },
    { n: 3, text: 'APC models: See Figure 3-168. Remove four screws and flat washers adapter plate from support rack. Slid forward to release L-hooks.' },
    { n: 4, text: 'Remove assembly.' },
    { n: 5, text: 'APC models: Remove four flange nuts to release adapter plate from Tour-Pak.' },
    { n: 6, text: 'APC models: Attach adapter to Tour-Pak. Secure with four flange nuts (4). Torque: 60-72 in-lbs (6.8-8.1 N·m).' },
    { n: 7, text: 'Set Tour-Pak in place.' },
    { n: 8, text: 'Install four flange nuts (4). Torque: 60-72 in-lbs (6.8-8.1 N·m).' },
    { n: 9, text: 'APC models: See Figure 3-167. Engage L-hooks (5) in support rack (4). Align rear holes with rear slots in support rack (4). See Figure 3-168. Loosely install rear washers and screws. Align front holes with front slots in support rack. Install front washers and screws. Torque: 60-72 in-lbs (6.8-8.1 N·m).' },
    { n: 10, text: 'See Figure 3-166. Mate Tour-Pak electrical connectors. Secure with anchors.' }
  ]
},
{
  id: 't20-tour-pak-backrest-remove-install',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Tour-Pak Backrest — Remove and Install',
  summary: 'Remove and install passenger backrest on Tour-Pak including isolators and support bracket.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 153 },
  figures: [
    { file: '/figures/t20/fig-3-169.png', caption: 'Tour-Pak Backrest Isolators', stepRefs: [2, 3] }
  ],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Passenger backrest flange nuts', value: '108-132 in-lbs (12.2-14.9 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Remove three flange nuts and flat washers. Remove backrest from Tour-Pak.' },
    { n: 2, text: 'Remove passenger backrest. See Passenger Backrest in this section.' },
    { n: 3, text: 'See Figure 3-169. Remove hair pin (1). Remove pin (4) and washers (2). Remove backrest support bracket (5) with rubber isolators (3). Remove rubber isolators (3) from backrest support bracket (5).' },
    { n: 4, text: 'Hold backrest on Tour-Pak lid. Secure with flange nuts and flat washers. Torque: 108-132 in-lbs (12.2-14.9 N·m).' },
    { n: 5, text: 'Left and right backrest support brackets are identified with L and R respectively. Center backrest support bracket has no identification. See Figure 3-169. Place rubber isolators (3) in backrest support bracket (5). Locate backrest support bracket assembly in backrest. Install washers (2) and pin (4). Washers (2) have a shoulder that fits into bores of backrest mounting area. Secure assembly with hair pin (1).' },
    { n: 6, text: 'Install passenger backrest. See Passenger backrest in this section.' }
  ]
},
{
  id: 't20-tour-pak-backrest-flap-disassemble',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Tour-Pak Backrest Flap — Disassemble',
  summary: 'Disassemble Tour-Pak backrest flap for service access.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 153 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove molded liner from Tour-Pak. See TOUR-PAK SUPPORT (Page 3-159).' },
    { n: 2, text: 'Remove two acorn nuts and screws with flat washers.' }
  ]
},
{
  id: 't20-saddlebag-lock-disassemble',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Saddlebag Lock — Disassemble and Assemble',
  summary: 'Disassemble and assemble saddlebag lock cylinder and components.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 161 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'For saddlebag lock service details, see electrical diagnostic manual.' }
  ]
},
{
  id: 't20-saddlebag-latch-disassemble',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Saddlebag Latch — Disassemble and Service',
  summary: 'Disassemble saddlebag latch mechanisms for adjustment and service.',
  difficulty: 'Moderate',
  timeMinutes: 25,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 161 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'For saddlebag latch service details, see electrical diagnostic manual or chassis service procedures.' }
  ]
},
{
  id: 't20-tank-emblem-remove-install',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Tank Emblems/Badges — Remove and Install',
  summary: 'Remove and install fuel tank emblems and badges using adhesive or retaining clips.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 167 },
  figures: [],
  tools: [],
  parts: [
    { number: '99839-95', description: 'Harley-Davidson Adhesive (for new emblems)', qty: 1 }
  ],
  torque: [],
  steps: [
    { n: 1, text: 'For emblem and badge removal and installation, see MEDALLIONS, BADGES, TANK EMBLEMS AND ADHESIVE STRIPS (Page 3-167).' },
    { n: 2, text: 'With retaining clips: Install retaining clips.' },
    { n: 3, text: 'With adhesive backing: See Figure 3-144 and MEDALLIONS, BADGES, TANK EMBLEMS AND ADHESIVE STRIPS (Page 3-167).' }
  ]
},
{
  id: 't20-tour-pak-liner-remove-install',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Tour-Pak Molded Liner — Remove and Install',
  summary: 'Remove and install molded liner assembly in Tour-Pak storage container.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 159 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Install molded liner in Tour-Pak.' }
  ]
},
{
  id: 't20-tour-pak-seal-gasket-service',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Tour-Pak Seal and Gasket Service',
  summary: 'Service Tour-Pak seals and gaskets for weatherproofing and dust prevention.',
  difficulty: 'Moderate',
  timeMinutes: 25,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 159 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'For Tour-Pak seal and gasket service, refer to TOUR-PAK SUPPORT (Page 3-159).' }
  ]
},
{
  id: 't20-tour-pak-hinge-service',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Tour-Pak Lid Hinges — Service and Adjustment',
  summary: 'Service and adjust Tour-Pak lid hinges for proper alignment and operation.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 159 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'For Tour-Pak hinge service and adjustment, refer to TOUR-PAK SUPPORT section.' }
  ]
},
{
  id: 't20-tour-pak-lock-mechanism-service',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Tour-Pak Lock Mechanism — Service',
  summary: 'Service Tour-Pak lid lock mechanism for proper engagement and locking.',
  difficulty: 'Moderate',
  timeMinutes: 25,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 159 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'For Tour-Pak lock mechanism service, refer to electrical diagnostic manual or TOUR-PAK SUPPORT (Page 3-159).' }
  ]
},
{
  id: 't20-tour-pak-tether-ground-plate-service',
  bikeIds: ['touring-2020'],
  system: 'bodywork',
  title: 'Tour-Pak Tether and Ground Plate Service',
  summary: 'Service Tour-Pak tether straps and ground plate for electrical continuity and mechanical support.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 159 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'For Tour-Pak tether and ground plate service, refer to TOUR-PAK SUPPORT (Page 3-159).' }
  ]
}
,
{
  id: 't20-oil-pressure-test',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Oil Pressure Test',
  summary: 'Test engine oil pressure at idle and 2000 RPM using the OIL PRESSURE TEST GAUGE KIT (HD-96921-52D).',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 11 },
  figures: [],
  tools: ['HD-96921-52D OIL PRESSURE TEST GAUGE KIT', 'Ratchet and sockets'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Verify that engine oil is at the proper level. See REPLACE ENGINE OIL AND FILTER (Page 2-9).' },
    { n: 2, text: 'Run motorcycle until engine oil reaches specification temperature: 230 °F (110 °C).' },
    { n: 3, text: 'Stop engine.' },
    { n: 4, text: 'Remove oil pressure switch from crankcase. See OIL PRESSURE SWITCH (Page 8-36).' },
    { n: 5, text: 'Install test kit. Hand-tighten adapter HD-96921-106 (2) in oil pressure switch mounting hole.' },
    { n: 6, text: 'Assemble banjo bolt (3), washer (4), oil pressure gauge (1), banjo fitting and second washer onto adapter. Hand-tighten.' },
    { n: 7, text: 'Operate engine at various speeds and record results. Stop engine.' },
    { n: 8, text: 'Verify that oil pressure is within specifications: minimum 5 psi at idle (34.5 kPa); normal 35-45 psi at 2000 rpm (242-310 kPa); maximum 50 psi (345 kPa).' },
    { n: 9, text: 'Remove oil pressure gauge assembly.' },
    { n: 10, text: 'Install oil pressure switch. See OIL PRESSURE SWITCH (Page 8-36).' }
  ]
},
{
  id: 't20-compression-test',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Compression Test',
  summary: 'Perform compression test on both cylinders to diagnose engine condition. Requires CYLINDER COMPRESSION GAUGE (HD-33223-1).',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 12 },
  figures: [],
  tools: ['HD-33223-1 CYLINDER COMPRESSION GAUGE', 'Screwdrivers'],
  parts: [],
  torque: [
    { fastener: 'Spark plug', value: '89-133 in-lbs (10-15 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Remove all spark plug cables.' },
    { n: 2, text: 'Remove one spark plug from each cylinder.' },
    { n: 3, text: 'Open throttle plate using a non-metal object.' },
    { n: 4, text: 'Remove air cleaner cover and filter. See INSPECT AIR FILTER (Page 2-45).' },
    { n: 5, text: 'Disconnect TCA connector (21I) from induction module.' },
    { n: 6, text: 'Mechanically hold throttle plate open.' },
    { n: 7, text: 'Connect compression tester to front cylinder. Special Tool: CYLINDER COMPRESSION GAUGE (HD-33223-1).' },
    { n: 8, text: 'Crank engine continuously through 5-7 full compression strokes.' },
    { n: 9, text: 'Note gauge readings at end of first and last compression strokes. Record test results.' },
    { n: 10, text: 'Disconnect ACR and repeat test.' },
    { n: 11, text: 'Connect ACR.' },
    { n: 12, text: 'Repeat test on rear cylinder.' },
    { n: 13, text: 'Compare with specifications. If compression is within specifications and variance between cylinders is less than 10%, compression is normal.' },
    { n: 14, text: 'If readings do not meet specifications, inject 0.5 fl oz (15 ml) engine oil into each cylinder and repeat test on both cylinders. Readings that are considerably higher during second test indicate worn piston rings.' },
    { n: 15, text: 'Inspect cylinder using borescope if needed. Special Tool: BORESCOPE (HD-50549).' },
    { n: 16, text: 'Release throttle plate.' },
    { n: 17, text: 'Connect TCA connector.' },
    { n: 18, text: 'Assemble air cleaner. See INSPECT AIR FILTER (Page 2-45).' },
    { n: 19, text: 'Install spark plugs and connect spark plug wires. Torque: 89-133 in-lbs (10-15 N·m).' }
  ]
},
{
  id: 't20-cylinder-leakdown-test',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Cylinder Leakdown Test',
  summary: 'Perform cylinder leakdown test to diagnose piston ring, valve, or head gasket condition. Requires CYLINDER LEAKDOWN TESTER (HD-35667-A).',
  difficulty: 'Advanced',
  timeMinutes: 60,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 13 },
  figures: [],
  tools: ['HD-35667-A CYLINDER LEAKDOWN TESTER', 'HD-52252 CRANKSHAFT LOCKING TOOL', 'HD-50549 BORESCOPE', 'Compressed air source'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Verify that leakdown tester is free from leakage. Special Tool: CYLINDER LEAKDOWN TESTER (HD-35667-A).' },
    { n: 2, text: 'Connect cylinder leakdown tester to compressed air source.' },
    { n: 3, text: 'Apply a soap/water solution around all tester fittings. Inspect connections for bubbles indicating leaks.' },
    { n: 4, text: 'Remove one spark plug per cylinder.' },
    { n: 5, text: 'Set piston in cylinder being tested at top dead center (TDC) of compression stroke (all valves closed).' },
    { n: 6, text: 'Lock the crankshaft. Remove CKP. See CRANKSHAFT POSITION SENSOR (CKP) (Page 8-97). Install crankshaft locking tool. Special Tool: CRANKSHAFT LOCKING TOOL (HD-52252).' },
    { n: 7, text: 'Perform leakdown test. Record percent of leakage.' },
    { n: 8, text: 'Listen for air leaks at throttle body, exhaust pipe, oil fill spout and head gasket.' },
    { n: 9, text: 'Verify that piston is still at TDC. Repeat test if moved.' },
    { n: 10, text: 'Analyze results: Leakage greater than 25 percent indicates further diagnosis is warranted. Air escaping through throttle body indicates leaking past intake valves. Air escaping through exhaust pipe indicates leaking past exhaust valves. Air sound from oil fill spout indicates leaking past piston rings.' },
    { n: 11, text: 'Inspect cylinder using borescope if needed. Special Tool: BORESCOPE (HD-50549).' },
    { n: 12, text: 'Remove crankshaft locking tool.' }
  ]
},
{
  id: 't20-crimp-clamp-remove',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Crimp Clamp — Remove',
  summary: 'Remove crimp clamps from hose assemblies. Reference procedure used in multiple oil line removal jobs.',
  difficulty: 'Easy',
  timeMinutes: 10,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 16 },
  figures: [],
  tools: ['Small screwdriver', 'High-quality wire cutter (if cutting required)'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Push tip of small screwdriver under end of tang.', warning: 'Plastic fittings are fragile. Use care when removing clamp.' },
    { n: 2, text: 'Pry until tang is free of tab.' },
    { n: 3, text: 'Remove clamp. If clamps must be cut, use a sharp high-quality wire cutter. To prevent breaking plastic fittings, do not twist clamp while cutting.' }
  ]
},
{
  id: 't20-crimp-clamp-install',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Crimp Clamp — Install',
  summary: 'Install new crimp clamps on hose assemblies. Reference procedure used in multiple oil line installation jobs.',
  difficulty: 'Easy',
  timeMinutes: 10,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 16 },
  figures: [],
  tools: ['HD-41137 HOSE CLAMP PLIERS'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Install new clamp.' },
    { n: 2, text: 'Tighten clamp using hose clamp pliers. Special Tool: HOSE CLAMP PLIERS (HD-41137).' }
  ]
},
{
  id: 't20-oil-cooler-downtube-remove',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Oil Cooler Downtube — Remove and Disassemble',
  summary: 'Remove and disassemble oil cooler downtube assembly for inspection or replacement (oil-cooled models only).',
  difficulty: 'Moderate',
  timeMinutes: 60,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 17 },
  figures: [],
  tools: ['Jack with wooden block', 'Ratchet and sockets', 'Screwdrivers'],
  parts: [
    { number: '(verify in manual)', description: 'Oil cooler cover gasket (if removing)', qty: 1 },
    { number: '(verify in manual)', description: 'Downtube hoses (if damaged)', qty: 2 }
  ],
  torque: [],
  steps: [
    { n: 1, text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).' },
    { n: 2, text: 'Remove oil cooler cover by pulling forward at bottom to free posts from grommets, then rotating up and lifting off upper retainer.' },
    { n: 3, text: 'Remove and discard crimp clamp (5). See CRIMP CLAMPS (Page 4-16).' },
    { n: 4, text: 'Remove spring clamp at top of downtube.' },
    { n: 5, text: 'Disconnect hoses from oil cooler (4) and upper end of downtube (1).' },
    { n: 6, text: 'Remove screws (2, 3).' },
    { n: 7, text: 'Pull assembly away from frame and disconnect voltage regulator connectors.' },
    { n: 8, text: 'Remove downtube assembly with components.' },
    { n: 9, text: 'Remove voltage regulator. See VOLTAGE REGULATOR (Page 8-14).' },
    { n: 10, text: 'Remove grommets (9).' },
    { n: 11, text: 'Remove hose (6) by removing crimp clamps and separating from cooler.' },
    { n: 12, text: 'Separate oil cooler from downtube by removing screws (2) and disengaging tab (5) from T-slot (3).' }
  ]
},
{
  id: 't20-oil-cooler-downtube-install',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Oil Cooler Downtube — Assemble and Install',
  summary: 'Assemble and install oil cooler downtube assembly on oil-cooled Touring models.',
  difficulty: 'Moderate',
  timeMinutes: 60,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 17 },
  figures: [],
  tools: ['HD-41137 HOSE CLAMP PLIERS', 'Ratchet and sockets', 'Screwdrivers'],
  parts: [
    { number: '99642-97', description: 'LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE)', qty: 1 }
  ],
  torque: [
    { fastener: 'Coolant downtube upper screws', value: '90-110 in-lbs (10.2-12.4 N·m)', note: '' },
    { fastener: 'Coolant downtube lower screws', value: '20-22 ft-lbs (27.1-29.8 N·m)', note: '' },
    { fastener: 'Oil cooler screws', value: '96-120 in-lbs (10.8-13.6 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Install oil cooler to downtube. Engage tab (7) into T-slot (3).' },
    { n: 2, text: 'Install two screws (1). Tighten. Torque: 96-120 in-lbs (10.8-13.6 N·m) Oil cooler screws.' },
    { n: 3, text: 'Install hose (6) between oil cooler (8) and downtube (4). Secure with crimp clamps. See CRIMP CLAMPS (Page 4-16).' },
    { n: 4, text: 'Install grommets (9).' },
    { n: 5, text: 'Install voltage regulator. See VOLTAGE REGULATOR (Page 8-14).' },
    { n: 6, text: 'Apply silicone-based dielectric grease to both voltage regulator connectors.' },
    { n: 7, text: 'Install new clamp (5) on hose.' },
    { n: 8, text: 'Install downtube assembly. Connect voltage regulator connectors as downtube assembly is moved into place.' },
    { n: 9, text: 'Apply threadlocker to threads of screws (2, 3). LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE) (99642-97).' },
    { n: 10, text: 'Install screws (2, 3). Tighten upper screws to 90-110 in-lbs (10.2-12.4 N·m) Coolant downtube upper screws.' },
    { n: 11, text: 'Install lower screws. Tighten to 20-22 ft-lbs (27.1-29.8 N·m) Coolant downtube lower screws.' },
    { n: 12, text: 'Connect hose to fitting (4). Secure with hose clamp.' },
    { n: 13, text: 'Connect downtube to forward oil hose with spring clamp.' },
    { n: 14, text: 'Install oil cooler cover. Engage upper retainer and rotate down and back to engage posts to grommets.' },
    { n: 15, text: 'Check engine oil level. See REPLACE ENGINE OIL AND FILTER (Page 2-9).' },
    { n: 16, text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).' }
  ]
},
{
  id: 't20-oil-check-valve-remove',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Oil Check Valve — Remove',
  summary: 'Remove oil check valve from crankcase. Requires access to oil pressure switch location.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 19 },
  figures: [],
  tools: ['Ratchet and sockets'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).' },
    { n: 2, text: 'Disconnect hose from oil check valve (2). See CRIMP CLAMPS (Page 4-16).' },
    { n: 3, text: 'Remove oil check valve.' },
    { n: 4, text: 'Discard O-ring (3).' }
  ]
},
{
  id: 't20-oil-check-valve-install',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Oil Check Valve — Install',
  summary: 'Install oil check valve in crankcase with new O-ring.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 19 },
  figures: [],
  tools: ['Ratchet and sockets'],
  parts: [
    { number: '(verify in manual)', description: 'O-ring, oil check valve (new)', qty: 1 }
  ],
  torque: [
    { fastener: 'Crankcase oil check valve or plug with O-ring', value: '18-22 ft-lbs (24.4-29.8 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Lubricate new O-ring (3) with fresh oil.' },
    { n: 2, text: 'Install oil check valve (2) with O-ring. Tighten. Torque: 18-22 ft-lbs (24.4-29.8 N·m).' },
    { n: 3, text: 'Install lower hose. Place new clamp on lower hose.' },
    { n: 4, text: 'Connect hose to check valve (2). Install clamp. See CRIMP CLAMPS (Page 4-16).' },
    { n: 5, text: 'Check engine oil level. See REPLACE ENGINE OIL AND FILTER (Page 2-9).' },
    { n: 6, text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).' }
  ]
},
{
  id: 't20-oil-coolant-lines-remove',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Oil Coolant Lines — Remove',
  summary: 'Remove oil/coolant line assembly from cylinder heads. Requires extensive preparation and disconnection of multiple components.',
  difficulty: 'Advanced',
  timeMinutes: 120,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 20 },
  figures: [],
  tools: ['HD-41137 HOSE CLAMP PLIERS', 'Compressed air source', 'Ratchet and sockets', 'Screwdrivers'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove left and right side covers. See LEFT SIDE COVER (Page 3-58) and RIGHT SIDE COVER (Page 3-59).' },
    { n: 2, text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).' },
    { n: 3, text: 'Remove seat. See SEAT (Page 3-148).' },
    { n: 4, text: 'Remove fuel tank. See FUEL TANK (Page 6-9).' },
    { n: 5, text: 'Remove upper engine mount. See FRONT ENGINE MOUNT (Page 4-22).' },
    { n: 6, text: 'Disconnect fuel injector connectors. See FUEL INJECTORS (Page 6-25).' },
    { n: 7, text: 'Disconnect KS connectors. See KNOCK SENSOR (KS) (Page 8-99).' },
    { n: 8, text: 'Disconnect ACR connectors. See AUTOMATIC COMPRESSION RELEASE (ACR) (Page 8-100).' },
    { n: 9, text: 'Disconnect left spark plug cables. See SPARK PLUG CABLES (Page 8-19).' },
    { n: 10, text: 'Disconnect horn connectors. Release harness from clamp and cable strap. See HORN (Page 8-38).' },
    { n: 11, text: 'Use clamp tool to reach rotated or difficult to reach spring clamps. HOSE CLAMP PLIERS (PART NUMBER: HD-41137).' },
    { n: 12, text: 'Disconnect hose (6) from downtube.' },
    { n: 13, text: 'Use low-pressure compressed air to blow oil out of line assembly. Remove engine oil filler cap. Blow into the hose (6) where disconnected from downtube.' },
    { n: 14, text: 'Disconnect hose from transmission fitting (1).' },
    { n: 15, text: 'Remove screws (7) from each manifold port (3).' },
    { n: 16, text: 'Remove line assembly (5).' },
    { n: 17, text: 'If necessary, remove rear oil hose (2) from line assembly (5).' }
  ]
},
{
  id: 't20-oil-coolant-lines-install',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Oil Coolant Lines — Install',
  summary: 'Install oil/coolant line assembly to cylinder heads. Must reconnect all components after installation.',
  difficulty: 'Advanced',
  timeMinutes: 120,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 20 },
  figures: [],
  tools: ['HD-41137 HOSE CLAMP PLIERS', 'Ratchet and sockets'],
  parts: [
    { number: '99642-97', description: 'LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE)', qty: 1 }
  ],
  torque: [
    { fastener: 'Oil line manifold screws', value: '90-120 in-lbs (10.2-13.6 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Clean components. Remove all residual thread locking material from screws and manifolds. Clean all debris from mating surfaces and threaded holes. Clean all debris from coolant ports in heads and manifolds. Thoroughly clean interior of all lines.' },
    { n: 2, text: 'If removed, install hose (2) to line assembly. Secure with spring clamp (4). Make sure o-rings are not rolled after assembly.' },
    { n: 3, text: 'Install new O-rings on the ports of each manifold (3).' },
    { n: 4, text: 'Install line assembly (5) with screws (7). Apply threadlocker to threads of screws. LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE) (99642-97). Tighten. Torque: 90-120 in-lbs (10.2-13.6 N·m).' },
    { n: 5, text: 'Install hose (2) to transmission fitting (1) with spring clamp (4).' },
    { n: 6, text: 'Connect right spark plug cables.' },
    { n: 7, text: 'Connect fuel injector connectors. See FUEL INJECTORS (Page 6-25).' },
    { n: 8, text: 'Connect knock sensor connectors. See KNOCK SENSOR (KS) (Page 8-99).' },
    { n: 9, text: 'Connect ACR connectors. See AUTOMATIC COMPRESSION RELEASE (ACR) (Page 8-100).' },
    { n: 10, text: 'Connect left spark plug cables. See SPARK PLUG CABLES (Page 8-19).' },
    { n: 11, text: 'Connect horn connectors. Secure harness in clamp and new cable strap. See HORN (Page 8-38).' },
    { n: 12, text: 'Install stabilizer link and bracket. See FRONT ENGINE MOUNT (Page 4-22).' },
    { n: 13, text: 'Install fuel tank. See FUEL TANK (Page 6-9).' },
    { n: 14, text: 'Install seat. See SEAT (Page 3-148).' },
    { n: 15, text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).' },
    { n: 16, text: 'Install side covers. See LEFT SIDE COVER (Page 3-58).' },
    { n: 17, text: 'Check engine oil level. See REPLACE ENGINE OIL AND FILTER (Page 2-9).' }
  ]
},
{
  id: 't20-front-engine-mount-lower-remove',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Front Engine Mount (Lower) — Remove',
  summary: 'Remove lower front engine mount assembly. Critical support component referenced by many other procedures.',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 22 },
  figures: [],
  tools: ['Jack with wooden block', 'Ratchet and sockets'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Support engine with a jack under the crankcase. Use a wooden block to distribute pressure.' },
    { n: 2, text: 'Remove engine mount assembly. Remove end cap fasteners (1).' },
    { n: 3, text: 'Remove flange nut (5).' },
    { n: 4, text: 'Remove engine mount bolt (2) with end cap (3).' },
    { n: 5, text: 'Remove right engine mount (4).' },
    { n: 6, text: 'Remove left engine mount (4). Disconnect upper stabilizer link. Raise engine. Hold engine toward right side of frame. Remove left engine mount.' }
  ]
},
{
  id: 't20-front-engine-mount-lower-install',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Front Engine Mount (Lower) — Install',
  summary: 'Install lower front engine mount assembly. Align notches and tabs correctly before tightening.',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 22 },
  figures: [],
  tools: ['Jack with wooden block', 'Ratchet and sockets'],
  parts: [],
  torque: [
    { fastener: 'Engine mount, lower front, end cap screws', value: '42-48 ft-lbs (56.9-65 N·m)', note: '' },
    { fastener: 'Engine mount, lower front, flange nut', value: '50-55 ft-lbs (67.8-74.6 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Disconnect stabilizer link. See Remove and Install: Upper Front Engine Mount.' },
    { n: 2, text: 'Install left mount (4). Hold engine toward right side of frame. Install left engine mount. Align notch in engine mount with tab on frame.' },
    { n: 3, text: 'Install right engine mount (4). Assemble engine mount bolt (2), end cap (3) and engine mount (4). Align notch in engine mount with tab on end cap.' },
    { n: 4, text: 'Install assembly until engine mount bolt exits the left side.' },
    { n: 5, text: 'Verify the notches and tabs of engine mounts are aligned.' },
    { n: 6, text: 'Start fasteners (1).' },
    { n: 7, text: 'Install flange nut (5). Tighten. Torque: 50-55 ft-lbs (67.8-74.6 N·m).' },
    { n: 8, text: 'Tighten end cap fasteners (1). Torque: 42-48 ft-lbs (56.9-65 N·m).' },
    { n: 9, text: 'Connect stabilizer link. See Remove and Install: Upper Front Engine Mount.' }
  ]
},
{
  id: 't20-front-engine-mount-upper-remove',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Engine Stabilizer Link (Upper Mount) — Remove',
  summary: 'Remove upper front engine mount stabilizer link assembly.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 23 },
  figures: [],
  tools: ['Ratchet and sockets', 'Screwdriver'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove screws (1, 2) and washer (6).' },
    { n: 2, text: 'Remove stabilizer link (3).' },
    { n: 3, text: 'Check each end of the stabilizer link for excessive wear. The spherical ball end may rotate freely, but should not have any lateral movement. Replace the link if lateral movement exists.' }
  ]
},
{
  id: 't20-front-engine-mount-upper-install',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Engine Stabilizer Link (Upper Mount) — Install',
  summary: 'Install upper front engine mount stabilizer link and bracket assembly.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 23 },
  figures: [],
  tools: ['Ratchet and sockets'],
  parts: [],
  torque: [
    { fastener: 'Engine mount, upper front, stabilizer link screws', value: '30.0-35.0 ft-lbs (40.7-47.5 N·m)', note: '' },
    { fastener: 'Engine stabilizer bracket screws', value: '45.0-50.0 ft-lbs (61-67.8 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Install washer (6).' },
    { n: 2, text: 'Install stabilizer link with screws (1, 2). Tighten. Torque: 30.0-35.0 ft-lbs (40.7-47.5 N·m).' },
    { n: 3, text: 'Install stabilizer link bracket (4).' },
    { n: 4, text: 'Install screws (5). Tighten. Torque: 45.0-50.0 ft-lbs (61-67.8 N·m).' }
  ]
},
{
  id: 't20-upper-rocker-cover-remove',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Upper Rocker Cover — Remove',
  summary: 'Remove upper rocker cover from cylinder head for access to valve train components.',
  difficulty: 'Moderate',
  timeMinutes: 60,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 24 },
  figures: [],
  tools: ['Compressed air', 'Ratchet and sockets', 'Screwdriver'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Use low-pressure compressed air to clean exterior surfaces of engine.', warning: 'Abrasive particles can damage machined surfaces or plug oil passageways. Clean parts before disassembly to prevent component damage.' },
    { n: 2, text: 'Remove seat. See SEAT (Page 3-148).' },
    { n: 3, text: 'Disconnect negative battery cable. See POWER DISCONNECT (Page 8-8).' },
    { n: 4, text: 'Remove fuel tank. See FUEL TANK (Page 6-9).' },
    { n: 5, text: 'Remove mid-frame air deflectors, if equipped. See AIR DEFLECTORS (Page 3-119).' },
    { n: 6, text: 'Disconnect spark plug cables from spark plugs. See SPARK PLUG CABLES (Page 8-19).' },
    { n: 7, text: 'Disconnect ACR connectors. See AUTOMATIC COMPRESSION RELEASE (ACR) (Page 8-100).' },
    { n: 8, text: 'Disconnect fuel injector connectors. See FUEL INJECTORS (Page 6-25).' },
    { n: 9, text: 'Disconnect KS connectors. See KNOCK SENSOR (KS) (Page 8-99).' },
    { n: 10, text: 'Disconnect horn connector. See HORN (Page 8-38).' },
    { n: 11, text: 'Remove upper front engine mount. See FRONT ENGINE MOUNT (Page 4-22).' },
    { n: 12, text: 'Remove upper cooling lines. Twin-Cooled Engines: See COOLANT HOSES (Page 7-13). Oil Cooled Engines: See OIL COOLANT LINES (Page 4-20).' },
    { n: 13, text: 'Remove screws (3). Secure stud (4) while removing center screw.' },
    { n: 14, text: 'Remove upper rocker cover (2).' },
    { n: 15, text: 'Discard gasket (1).' },
    { n: 16, text: 'Clean threadlocker from threads and threaded holes. See Cleaning (Page II).' }
  ]
},
{
  id: 't20-upper-rocker-cover-install',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Upper Rocker Cover — Install',
  summary: 'Install upper rocker cover on cylinder head. Follow tightening sequence carefully.',
  difficulty: 'Moderate',
  timeMinutes: 60,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 24 },
  figures: [],
  tools: ['Ratchet and sockets', 'Torque wrench (in-lb)'],
  parts: [
    { number: '(verify in manual)', description: 'Upper rocker cover gasket (new)', qty: 1 },
    { number: '99642-97', description: 'LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE)', qty: 1 }
  ],
  torque: [
    { fastener: 'Rocker cover, lower, screws', value: '120-140 in-lbs (13.6-15.8 N·m)', note: '' },
    { fastener: 'Rocker cover, lower, stud', value: '90-120 in-lbs (10.2-13.6 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Tighten stud (4). Torque: 90-120 in-lbs (10.2-13.6 N·m).' },
    { n: 2, text: 'Install new gasket (1).' },
    { n: 3, text: 'Install upper rocker cover (2). Apply threadlocker to 5-7 screw threads. LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE) (99642-97).' },
    { n: 4, text: 'Start all screws.' },
    { n: 5, text: 'Secure stud (4) to prevent rotation when tightening center screw.' },
    { n: 6, text: 'Tighten in sequence shown. Torque: 120-140 in-lbs (13.6-15.8 N·m).' },
    { n: 7, text: 'Install upper cooling lines. Twin-cooled engines: See COOLANT HOSES (Page 7-13). Oil cooled engines: See OIL COOLANT LINES (Page 4-20).' },
    { n: 8, text: 'Install upper front engine mount. See FRONT ENGINE MOUNT (Page 4-22).' },
    { n: 9, text: 'Connect horn connector. Secure harness. See HORN (Page 8-38).' },
    { n: 10, text: 'Connect KS connectors. See KNOCK SENSOR (KS) (Page 8-99).' },
    { n: 11, text: 'Connect fuel injector connectors. See FUEL INJECTORS (Page 6-25).' },
    { n: 12, text: 'Connect ACR connectors. See AUTOMATIC COMPRESSION RELEASE (ACR) (Page 8-100).' },
    { n: 13, text: 'Connect spark plug cables. See SPARK PLUG CABLES (Page 8-19).' },
    { n: 14, text: 'Install mid-frame air deflectors, if equipped. See AIR DEFLECTORS (Page 3-119).' },
    { n: 15, text: 'Install fuel tank. See FUEL TANK (Page 6-9).' },
    { n: 16, text: 'Connect negative battery cable. See POWER DISCONNECT (Page 8-8).' },
    { n: 17, text: 'Install seat. See SEAT (Page 3-148).' }
  ]
}
,
{
  id: 't20-breather-remove',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Breather — Remove',
  summary: 'Remove breather assembly from cylinder head for inspection or replacement.',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 26 },
  figures: [],
  tools: ['Compressed air', 'Ratchet and sockets'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Use low-pressure compressed air to clean exterior surfaces of engine.', warning: 'Abrasive particles can damage machined surfaces or plug oil passageways.' },
    { n: 2, text: 'Remove seat. See SEAT (Page 3-148).' },
    { n: 3, text: 'Disconnect negative battery cable. See POWER DISCONNECT (Page 8-8).' },
    { n: 4, text: 'Remove fuel tank. See FUEL TANK (Page 6-9).' },
    { n: 5, text: 'Remove mid-frame air deflectors, if equipped. See AIR DEFLECTORS (Page 3-119).' },
    { n: 6, text: 'Disconnect spark plug cables from spark plugs. See SPARK PLUG CABLES (Page 8-19).' },
    { n: 7, text: 'Disconnect ACR connectors. See AUTOMATIC COMPRESSION RELEASE (ACR) (Page 8-100).' },
    { n: 8, text: 'Disconnect fuel injector connectors. See FUEL INJECTORS (Page 6-25).' },
    { n: 9, text: 'Disconnect KS connectors. See KNOCK SENSOR (KS) (Page 8-99).' },
    { n: 10, text: 'Disconnect horn connector. See HORN (Page 8-38).' },
    { n: 11, text: 'Remove upper front engine mount. See FRONT ENGINE MOUNT (Page 4-22).' },
    { n: 12, text: 'Remove upper cooling lines. Twin-Cooled Engines: See COOLANT HOSES (Page 7-13). Oil Cooled Engines: See OIL COOLANT LINES (Page 4-20).' },
    { n: 13, text: 'Remove upper rocker covers. See UPPER ROCKER COVERS (Page 4-24).' },
    { n: 14, text: 'Remove breather screw (1).' },
    { n: 15, text: 'Remove breather (2).' },
    { n: 16, text: 'Discard O-ring.' }
  ]
},
{
  id: 't20-breather-install',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Breather — Install',
  summary: 'Install breather assembly on cylinder head with new O-ring.',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 26 },
  figures: [],
  tools: ['Ratchet and sockets'],
  parts: [
    { number: '(verify in manual)', description: 'O-ring, breather (new)', qty: 1 }
  ],
  torque: [
    { fastener: 'Breather screw', value: '90-120 in-lbs (10.2-13.6 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Lubricate new O-ring with fresh oil.' },
    { n: 2, text: 'Install new O-ring.' },
    { n: 3, text: 'Install breather (2).' },
    { n: 4, text: 'Install breather screw (1). Tighten. Torque: 90-120 in-lbs (10.2-13.6 N·m).' },
    { n: 5, text: 'Install upper rocker covers. See UPPER ROCKER COVERS (Page 4-24).' },
    { n: 6, text: 'Install upper cooling lines. Twin-cooled engines: See COOLANT HOSES (Page 7-13). Oil cooled engines: See OIL COOLANT LINES (Page 4-20).' },
    { n: 7, text: 'Install upper front engine mount. See FRONT ENGINE MOUNT (Page 4-22).' },
    { n: 8, text: 'Connect horn connector. Secure harness. See HORN (Page 8-38).' },
    { n: 9, text: 'Connect KS connectors. See KNOCK SENSOR (KS) (Page 8-99).' },
    { n: 10, text: 'Connect fuel injector connectors. See FUEL INJECTORS (Page 6-25).' },
    { n: 11, text: 'Connect ACR connectors. See AUTOMATIC COMPRESSION RELEASE (ACR) (Page 8-100).' },
    { n: 12, text: 'Connect spark plug cables. See SPARK PLUG CABLES (Page 8-19).' },
    { n: 13, text: 'Install mid-frame air deflectors, if equipped. See AIR DEFLECTORS (Page 3-119).' },
    { n: 14, text: 'Install fuel tank. See FUEL TANK (Page 6-9).' },
    { n: 15, text: 'Connect negative battery cable. See POWER DISCONNECT (Page 8-8).' },
    { n: 16, text: 'Install seat. See SEAT (Page 3-148).' }
  ]
},
{
  id: 't20-lower-rocker-cover-remove',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Lower Rocker Cover — Remove',
  summary: 'Remove lower rocker cover from cylinder head. Engine may need rotation for clearance.',
  difficulty: 'Moderate',
  timeMinutes: 60,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 28 },
  figures: [],
  tools: ['Compressed air', 'Ratchet and sockets'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Use low-pressure compressed air to clean exterior surfaces of engine.', warning: 'Abrasive particles can damage machined surfaces or plug oil passageways.' },
    { n: 2, text: 'Remove seat. See SEAT (Page 3-148).' },
    { n: 3, text: 'Disconnect negative battery cable. See POWER DISCONNECT (Page 8-8).' },
    { n: 4, text: 'Remove fuel tank. See FUEL TANK (Page 6-9).' },
    { n: 5, text: 'Remove mid-frame air deflectors, if equipped. See AIR DEFLECTORS (Page 3-119).' },
    { n: 6, text: 'Disconnect spark plug cables from spark plugs. See SPARK PLUG CABLES (Page 8-19).' },
    { n: 7, text: 'Disconnect ACR connectors. See AUTOMATIC COMPRESSION RELEASE (ACR) (Page 8-100).' },
    { n: 8, text: 'Disconnect fuel injector connectors. See FUEL INJECTORS (Page 6-25).' },
    { n: 9, text: 'Disconnect KS connectors. See KNOCK SENSOR (KS) (Page 8-99).' },
    { n: 10, text: 'Disconnect horn connector. See HORN (Page 8-38).' },
    { n: 11, text: 'Remove upper front engine mount. See FRONT ENGINE MOUNT (Page 4-22).' },
    { n: 12, text: 'Remove upper cooling lines. Twin-Cooled Engines: See COOLANT HOSES (Page 7-13). Oil Cooled Engines: See OIL COOLANT LINES (Page 4-20).' },
    { n: 13, text: 'Remove upper rocker covers. See UPPER ROCKER COVERS (Page 4-24).' },
    { n: 14, text: 'Remove breathers. See BREATHERS (Page 4-26).' },
    { n: 15, text: 'Remove screws (3) and stud (4).', warning: 'Engine may need to be rotated to provide clearance.' },
    { n: 16, text: 'Remove lower rocker cover (2).' },
    { n: 17, text: 'Discard gasket (1).' }
  ]
},
{
  id: 't20-lower-rocker-cover-install',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Lower Rocker Cover — Install',
  summary: 'Install lower rocker cover on cylinder head. Follow tightening sequence.',
  difficulty: 'Moderate',
  timeMinutes: 60,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 28 },
  figures: [],
  tools: ['Ratchet and sockets', 'Torque wrench (in-lb)'],
  parts: [
    { number: '(verify in manual)', description: 'Lower rocker cover gasket (new)', qty: 1 },
    { number: '99642-97', description: 'LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE)', qty: 1 }
  ],
  torque: [
    { fastener: 'Rocker cover, lower, screws', value: '90-120 in-lbs (10.2-13.6 N·m)', note: '' },
    { fastener: 'Rocker cover, lower, stud', value: '90-120 in-lbs (10.2-13.6 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Install new gasket (1).' },
    { n: 2, text: 'Install lower rocker cover (2).' },
    { n: 3, text: 'Apply threadlocker to screws (3) and stud (4). LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE) (99642-97).' },
    { n: 4, text: 'Install screws (3) and stud (4). Tighten in sequence shown. Torque: 90-120 in-lbs (10.2-13.6 N·m).' },
    { n: 5, text: 'Install breathers. See BREATHERS (Page 4-26).' },
    { n: 6, text: 'Install upper rocker covers. See UPPER ROCKER COVERS (Page 4-24).' },
    { n: 7, text: 'Install upper cooling lines. Twin-cooled engines: See COOLANT HOSES (Page 7-13). Oil cooled engines: See OIL COOLANT LINES (Page 4-20).' },
    { n: 8, text: 'Install upper front engine mount. See FRONT ENGINE MOUNT (Page 4-22).' },
    { n: 9, text: 'Connect horn connector. Secure harness. See HORN (Page 8-38).' },
    { n: 10, text: 'Connect KS connectors. See KNOCK SENSOR (KS) (Page 8-99).' },
    { n: 11, text: 'Connect fuel injector connectors. See FUEL INJECTORS (Page 6-25).' },
    { n: 12, text: 'Connect ACR connectors. See AUTOMATIC COMPRESSION RELEASE (ACR) (Page 8-100).' },
    { n: 13, text: 'Connect spark plug cables. See SPARK PLUG CABLES (Page 8-19).' },
    { n: 14, text: 'Install mid-frame air deflectors, if equipped. See AIR DEFLECTORS (Page 3-119).' },
    { n: 15, text: 'Install fuel tank. See FUEL TANK (Page 6-9).' },
    { n: 16, text: 'Connect negative battery cable. See POWER DISCONNECT (Page 8-8).' },
    { n: 17, text: 'Install seat. See SEAT (Page 3-148).' }
  ]
},
{
  id: 't20-rocker-arms-remove',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Rocker Arms — Remove',
  summary: 'Remove rocker arms from rocker shafts for inspection or replacement.',
  difficulty: 'Advanced',
  timeMinutes: 120,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 30 },
  figures: [],
  tools: ['Compressed air', 'Ratchet and sockets', 'Feeler gauge'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Use low-pressure compressed air to clean exterior surfaces of engine.', warning: 'Abrasive particles can damage machined surfaces or plug oil passageways.' },
    { n: 2, text: 'Remove seat. See SEAT (Page 3-148).' },
    { n: 3, text: 'Disconnect negative battery cable. See POWER DISCONNECT (Page 8-8).' },
    { n: 4, text: 'Remove fuel tank. See FUEL TANK (Page 6-9).' },
    { n: 5, text: 'Remove mid-frame air deflectors, if equipped. See AIR DEFLECTORS (Page 3-119).' },
    { n: 6, text: 'Disconnect spark plug cables from spark plugs. See SPARK PLUG CABLES (Page 8-19).' },
    { n: 7, text: 'Disconnect ACR connectors. See AUTOMATIC COMPRESSION RELEASE (ACR) (Page 8-100).' },
    { n: 8, text: 'Disconnect fuel injector connectors. See FUEL INJECTORS (Page 6-25).' },
    { n: 9, text: 'Disconnect KS connectors. See KNOCK SENSOR (KS) (Page 8-99).' },
    { n: 10, text: 'Disconnect horn connector. See HORN (Page 8-38).' },
    { n: 11, text: 'Remove upper front engine mount. See FRONT ENGINE MOUNT (Page 4-22).' },
    { n: 12, text: 'Remove upper cooling lines. Twin-Cooled Engines: See COOLANT HOSES (Page 7-13). Oil Cooled Engines: See OIL COOLANT LINES (Page 4-20).' },
    { n: 13, text: 'Remove upper rocker covers. See UPPER ROCKER COVERS (Page 4-24).' },
    { n: 14, text: 'Remove breathers. See BREATHERS (Page 4-26).' },
    { n: 15, text: 'Remove lower rocker covers. See LOWER ROCKER COVERS (Page 4-28).' },
    { n: 16, text: 'Set piston at TDC on the compression stroke.' },
    { n: 17, text: 'Alternately loosen screws (3) until screws can be turned by hand.' },
    { n: 18, text: 'Remove screws.' },
    { n: 19, text: 'Remove rocker shaft (1) and rocker arm (4).' },
    { n: 20, text: 'Clean all parts. Inspect for wear. Replace or repair as necessary. Measure rocker arm bore. Measure rocker arm shaft for excessive wear. Inspect valve contact areas for excessive wear. Inspect pushrod pocket for excessive wear. Verify that oil holes in rocker arms are clean and open.' }
  ]
},
{
  id: 't20-rocker-arms-install',
  bikeIds: ['touring-2020'],
  system: 'engine',
  title: 'Rocker Arms — Install',
  summary: 'Install rocker arms on rocker shafts. Lifters must bleed down before rotating crankshaft.',
  difficulty: 'Advanced',
  timeMinutes: 120,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 30 },
  figures: [],
  tools: ['Ratchet and sockets', 'Feeler gauge'],
  parts: [],
  torque: [
    { fastener: 'Rocker shaft screw', value: '23-27 ft-lbs (31.2-36.6 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Set piston at approximate BOC of power stroke.' },
    { n: 2, text: 'Verify lifters are on base circle of camshaft lobe.' },
    { n: 3, text: 'Install rocker arm (4) and rocker shaft (1).' },
    { n: 4, text: 'Verify rocker shaft is seated in both towers.' },
    { n: 5, text: 'Install screws (3).' },
    { n: 6, text: 'Alternately tighten screws to pull rocker shaft down evenly. Torque: 23-27 ft-lbs (31.2-36.6 N·m).' },
    { n: 7, text: 'Repeat with remaining rocker arms.' },
    { n: 8, text: 'Allow lifters to bleed down. When lifters have bled down, pushrods can be rotated by hand.', warning: 'Do not rotate crankshaft until lifters have bled down. Rotating crankshaft sooner could result in valve-to-piston contact resulting in damage.' },
    { n: 9, text: 'Check valve lash. Position crankshaft at TDC of compression stroke. All valves will be closed.' },
    { n: 10, text: 'While holding rocker arm against valves, attempt to slide a feeler gauge between each valve stem tip and the rocker arm.' },
    { n: 11, text: 'A measurement in excess of maximum requires disassembly and repair of cylinder head assembly. Maximum allowable lash on a common rocker arm: 0.008 in (0.2 mm).' },
    { n: 12, text: 'Install lower rocker covers. See LOWER ROCKER COVERS (Page 4-28).' },
    { n: 13, text: 'Install breathers. See BREATHERS (Page 4-26).' },
    { n: 14, text: 'Install upper rocker covers. See UPPER ROCKER COVERS (Page 4-24).' },
    { n: 15, text: 'Install upper cooling lines. Twin-cooled engines: See COOLANT HOSES (Page 7-13). Oil cooled engines: See OIL COOLANT LINES (Page 4-20).' },
    { n: 16, text: 'Install upper front engine mount. See FRONT ENGINE MOUNT (Page 4-22).' },
    { n: 17, text: 'Connect horn connector. Secure harness. See HORN (Page 8-38).' },
    { n: 18, text: 'Connect KS connectors. See KNOCK SENSOR (KS) (Page 8-99).' },
    { n: 19, text: 'Connect fuel injector connectors. See FUEL INJECTORS (Page 6-25).' },
    { n: 20, text: 'Connect ACR connectors. See AUTOMATIC COMPRESSION RELEASE (ACR) (Page 8-100).' },
    { n: 21, text: 'Connect spark plug cables. See SPARK PLUG CABLES (Page 8-19).' },
    { n: 22, text: 'Install mid-frame air deflectors, if equipped. See AIR DEFLECTORS (Page 3-119).' },
    { n: 23, text: 'Install fuel tank. See FUEL TANK (Page 6-9).' },
    { n: 24, text: 'Connect negative battery cable. See POWER DISCONNECT (Page 8-8).' },
    { n: 25, text: 'Install seat. See SEAT (Page 3-148).' }
  ]
}
,
{
    id: 't20-oil-pump-remove',
    bikeIds: ['touring-2020'],
    system: 'engine',
    title: 'Oil Pump — Remove',
    summary: 'Remove the oil pump assembly from the camshaft compartment.',
    difficulty: 'Moderate',
    timeMinutes: 90,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 58 },
    figures: [],
    tools: ['Low-pressure compressed air', 'Shop towels'],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Use low-pressure compressed air to clean exterior surfaces of engine.' },
      { n: 2, text: 'Remove seat. See SEAT (Page 3-148).' },
      { n: 3, text: 'Disconnect negative battery cable. See POWER DISCONNECT (Page 8-8).' },
      { n: 4, text: 'Remove fuel tank. See FUEL TANK (Page 6-9).' },
      { n: 5, text: 'Remove mid-frame air deflectors, if equipped. See AIR DEFLECTORS (Page 3-119).' },
      { n: 6, text: 'Disconnect spark plug cables from spark plugs. See SPARK PLUG CABLES (Page 8-19).' },
      { n: 7, text: 'Disconnect ACR connectors. See AUTOMATIC COMPRESSION RELEASE (ACR) (Page 8-100).' },
      { n: 8, text: 'Disconnect fuel injector connectors. See FUEL INJECTORS (Page 6-25).' },
      { n: 9, text: 'Disconnect KS connectors. See KNOCK SENSOR (KS) (Page 8-99).' },
      { n: 10, text: 'Disconnect horn connector. See HORN (Page 8-38).' },
      { n: 11, text: 'Remove upper front engine mount. See FRONT ENGINE MOUNT (Page 4-22).' },
      { n: 12, text: 'Remove upper cooling lines. Twin-Cooled Engines: See COOLANT HOSES (Page 7-13). Oil Cooled Engines: See OIL COOLANT LINES (Page 4-20).' },
      { n: 13, text: 'Remove upper rocker covers. See UPPER ROCKER COVERS (Page 4-24).' },
      { n: 14, text: 'Loosen rocker arm screws to relieve tension on pushrods. See ROCKER ARMS (Page 4-30).' },
      { n: 15, text: 'Remove camshaft cover and cam support plate. See CAM COMPARTMENT AND COMPONENTS (Page 4-52).' },
      { n: 16, text: 'See Figure 4-58. Remove oil pump assembly from camshaft compartment.' }
    ]
  },

  {
    id: 't20-oil-pump-disassemble',
    bikeIds: ['touring-2020'],
    system: 'engine',
    title: 'Oil Pump — Disassemble & Inspect',
    summary: 'Disassemble oil pump and inspect gerotors and relief valve for wear.',
    difficulty: 'Moderate',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 58 },
    figures: [],
    tools: ['Non-volatile cleaning solution', 'Low-pressure compressed air'],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'See Figure 4-58. Remove gerotors (1, 3).' },
      { n: 2, text: 'See Figure 4-59. Remove pressure relief valve. Hold spring (1) compressed. Drive out roll pin (3). Carefully release spring pressure. Remove spring and piston (2).' },
      { n: 3, text: 'Clean parts in a non-volatile cleaning solution.' },
      { n: 4, text: 'Dry parts using low-pressure compressed air.' },
      { n: 5, text: 'Inspect housing. Verify oil holes are clean and open. Inspect relief valve piston and seat for damage. Inspect oil pump housing bores for scoring, gouging or cracking. See Figure 4-58. Inspect for grooves or scratches on cam support plate and back housing (4).' },
      { n: 6, text: 'See Figure 4-60. Check gerotor wear. Check lobes of gerotors for damage. Mesh gerotor sets together. Check gerotor lobe clearance against wear limit of 0.004 in (0.10 mm). Check gerotor thickness variation against wear limit of 0.001 in (0.025 mm).' }
    ]
  },

  {
    id: 't20-oil-pump-install',
    bikeIds: ['touring-2020'],
    system: 'engine',
    title: 'Oil Pump — Assemble & Install',
    summary: 'Assemble oil pump and reinstall in the camshaft compartment.',
    difficulty: 'Moderate',
    timeMinutes: 90,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 58 },
    figures: [],
    tools: ['SCREAMIN\' EAGLE ASSEMBLY LUBE (11300002)', 'Oil'],
    parts: [
      { number: '(verify in printed manual)', description: 'Oil pump gasket (if replacing)', qty: 1 },
      { number: '(verify in printed manual)', description: 'O-rings', qty: 2 }
    ],
    torque: [
      { fastener: 'Oil pump screws, 1st torque', value: '12-60 in-lbs (1.4-6.8 N·m)', note: '' },
      { fastener: 'Oil pump screws, final torque', value: '90-120 in-lbs (10.2-13.6 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Assemble pressure relief valve. Apply assembly lube to piston (2). Install spring (1) and piston into housing. Install roll pin (3) to secure spring.' },
      { n: 2, text: 'See Figure 4-58. Install back housing (4) and scavenge gerotor set (3) onto crankshaft.' },
      { n: 3, text: 'Install new O-ring (5) in crankcase scavenge port.' },
      { n: 4, text: 'Apply assembly lube to scavenge port spigot. Consumable: SCREAMIN\' EAGLE ASSEMBLY LUBE (11300002)' },
      { n: 5, text: 'Slide oil pump housing (4) onto crankshaft while fitting scavenge port into O-ring. Firmly push on oil pump housing to fully seat.' },
      { n: 6, text: 'Install feed gerotor set (1).' },
      { n: 7, text: 'Install cam support plate and camshaft cover. See CAM COMPARTMENT AND COMPONENTS (Page 4-52).' },
      { n: 8, text: 'Install rocker arms. See ROCKER ARMS (Page 4-30).' },
      { n: 9, text: 'Install upper rocker covers. See UPPER ROCKER COVERS (Page 4-24).' },
      { n: 10, text: 'Install upper cooling lines. Twin-cooled engines: See COOLANT HOSES (Page 7-13). Oil cooled engines: See OIL COOLANT LINES (Page 4-20).' },
      { n: 11, text: 'Install upper front engine mount. See FRONT ENGINE MOUNT (Page 4-22).' },
      { n: 12, text: 'Connect horn connector. Secure harness. See HORN (Page 8-38).' },
      { n: 13, text: 'Connect KS connectors. See KNOCK SENSOR (KS) (Page 8-99).' },
      { n: 14, text: 'Connect fuel injector connectors. See FUEL INJECTORS (Page 6-25).' },
      { n: 15, text: 'Connect ACR connectors. See AUTOMATIC COMPRESSION RELEASE (ACR) (Page 8-100).' },
      { n: 16, text: 'Connect spark plug cables. See SPARK PLUG CABLES (Page 8-19).' },
      { n: 17, text: 'Install mid-frame air deflectors, if equipped. See AIR DEFLECTORS (Page 3-119).' },
      { n: 18, text: 'Install fuel tank. See FUEL TANK (Page 6-9).' },
      { n: 19, text: 'Connect negative battery cable. See POWER DISCONNECT (Page 8-8).' },
      { n: 20, text: 'Install seat. See SEAT (Page 3-148).' }
    ]
  },

  {
    id: 't20-engine-replace',
    bikeIds: ['touring-2020'],
    system: 'engine',
    title: 'Replace Engine',
    summary: 'Remove and install complete engine assembly (engine swap).',
    difficulty: 'Advanced',
    timeMinutes: 360,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 61 },
    figures: [],
    tools: ['Lift', 'FAT JACK (HD-45968)', 'Protective padding'],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Secure motorcycle on lift. See GENERAL (Page 2-3).' },
      { n: 2, text: 'Remove seat. See SEAT (Page 3-148).' },
      { n: 3, text: 'Disconnect negative battery cable. See POWER DISCONNECT (Page 8-8).' },
      { n: 4, text: 'Remove fuel tank. See FUEL TANK (Page 6-9).' },
      { n: 5, text: 'Remove air filter. See INSPECT AIR FILTER (Page 2-45).' },
      { n: 6, text: 'Remove air filter backplate assembly. See AIR CLEANER BACKPLATE ASSEMBLY (Page 6-3).' },
      { n: 7, text: 'Remove induction module assembly. See INDUCTION MODULE (Page 6-26).' },
      { n: 8, text: 'Remove mid-frame air deflectors, if equipped. See AIR DEFLECTORS (Page 3-119).' },
      { n: 9, text: 'Remove rider right footboard. See RIDER FOOTRESTS (Page 3-142).' },
      { n: 10, text: 'Remove exhaust system. See EXHAUST SYSTEM (Page 6-34).' },
      { n: 11, text: 'Remove upper cooling lines. Twin-Cooled Engines: See COOLANT HOSES (Page 7-13). Oil Cooled Engines: See OIL COOLANT LINES (Page 4-20).' },
      { n: 12, text: 'Drain engine oil and discard filter. See REPLACE ENGINE OIL AND FILTER (Page 2-9).' },
      { n: 13, text: 'Disconnect CKP sensor connector. See CRANKSHAFT POSITION SENSOR (CKP) (Page 8-97).' },
      { n: 14, text: 'Remove voltage regulator. See VOLTAGE REGULATOR (Page 8-14).' },
      { n: 15, text: 'Disconnect oil pressure sender connector. See OIL PRESSURE SWITCH (Page 8-36).' },
      { n: 16, text: 'Remove primary chaincase. See PRIMARY CHAINCASE HOUSING (Page 5-24).' },
      { n: 17, text: 'Remove alternator rotor. See ALTERNATOR (Page 8-12).' },
      { n: 18, text: 'Release main harness and brake line from lower frame rail. Allow to hang below frame.' },
      { n: 19, text: 'Disconnect ACR connectors. See AUTOMATIC COMPRESSION RELEASE (ACR) (Page 8-100).' },
      { n: 20, text: 'Disconnect KS connectors. See KNOCK SENSOR (KS) (Page 8-99).' },
      { n: 21, text: 'Disconnect ET sensor connector. See ENGINE TEMPERATURE (ET) SENSOR (Page 8-98).' },
      { n: 22, text: 'Disconnect spark plug cables from spark plugs. See SPARK PLUG CABLES (Page 8-19).' },
      { n: 23, text: 'Remove horn and bracket. See HORN (Page 8-38).' },
      { n: 24, text: 'Wrap rear master cylinder with protective padding.' },
      { n: 25, text: 'Wrap rocker covers and lower frame rails with protective padding.' },
      { n: 26, text: 'Support transmission. Special Tool: FAT JACK (HD-45968)' },
      { n: 27, text: 'Remove four transmission to engine bolts.' },
      { n: 28, text: 'Remove upper front engine mount and bracket. See FRONT ENGINE MOUNT (Page 4-22).' },
      { n: 29, text: 'Remove lower front engine mount. See FRONT ENGINE MOUNT (Page 4-22).' },
      { n: 30, text: 'Remove engine from chassis. Move engine forward to clear dowels. Remove engine from right side.' }
    ]
  },

  {
    id: 't20-crankcase-separate',
    bikeIds: ['touring-2020'],
    system: 'engine',
    title: 'Crankcase — Separate Halves',
    summary: 'Separate crankcase halves and remove internal components.',
    difficulty: 'Advanced',
    timeMinutes: 120,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 63 },
    figures: [],
    tools: ['BALANCER SCISSOR GEAR ALIGNMENT TOOL (HD-52065)', 'Engine stand'],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Remove engine. See REPLACE ENGINE (Page 4-61).' },
      { n: 2, text: 'Use low-pressure compressed air to clean exterior surfaces of engine.' },
      { n: 3, text: 'Remove upper rocker covers. See UPPER ROCKER COVERS (Page 4-24).' },
      { n: 4, text: 'Remove breathers. See BREATHERS (Page 4-26).' },
      { n: 5, text: 'Remove lower rocker covers. See LOWER ROCKER COVERS (Page 4-28).' },
      { n: 6, text: 'Remove rocker arms. See ROCKER ARMS (Page 4-30).' },
      { n: 7, text: 'Remove pushrods. See PUSHRODS, LIFTERS AND COVERS (Page 4-32).' },
      { n: 8, text: 'Remove cylinder heads. See CYLINDER HEADS (Page 4-36).' },
      { n: 9, text: 'Remove cylinders. See CYLINDERS (Page 4-42).' },
      { n: 10, text: 'Remove pistons. See PISTONS (Page 4-46).' },
      { n: 11, text: 'Position crankcase with cam compartment facing down.' },
      { n: 12, text: 'Separate crankcase halves. See Figure 4-61. Remove crankcase screws in sequence shown. Separate case halves.' },
      { n: 13, text: 'See Figure 4-62. Lift left crankcase half (2) off end of crankshaft.' },
      { n: 14, text: 'Remove two dowel pins in split line face of right case half.' },
      { n: 15, text: 'Remove balancer (4). Special Tool: BALANCER SCISSOR GEAR ALIGNMENT TOOL (HD-52065). Install Balancer scissor gear alignment tool. Lift balancer from crankcase.' },
      { n: 16, text: 'Remove flywheel assembly (3).' }
    ]
  },

  {
    id: 't20-crankcase-assemble',
    bikeIds: ['touring-2020'],
    system: 'engine',
    title: 'Crankcase — Assemble Halves',
    summary: 'Assemble crankcase halves and install internal components.',
    difficulty: 'Advanced',
    timeMinutes: 180,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 63 },
    figures: [],
    tools: [
      'CRANKSHAFT GUIDE (HD-42326-B)',
      'LEFT MAIN BEARING OIL SEAL INSTALLATION TOOL (HD-52064)',
      'BALANCER SCISSOR GEAR ALIGNMENT TOOL (HD-52065)',
      'SPROCKET SHAFT BEARING INSTALLER (HD-97225-55C)',
      'SCREAMIN\' EAGLE ASSEMBLY LUBE (11300002)',
      'HARLEY-DAVIDSON HIGH PERFORMANCE SEALANT - GRAY (99650-02)'
    ],
    parts: [],
    torque: [
      { fastener: 'Crankcase screws, 1st torque', value: '120 in-lbs (13.6 N·m)', note: '' },
      { fastener: 'Crankcase screws, final torque', value: '15-19 ft-lbs (20.3-25.8 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Position right crankcase with cam compartment facing up.' },
      { n: 2, text: 'Install flywheel assembly.' },
      { n: 3, text: 'Install balancer with scissor gear alignment tool.' },
      { n: 4, text: 'Position left crankcase half and align with right half.' },
      { n: 5, text: 'Install dowel pins in split line face.' },
      { n: 6, text: 'Apply assembly lube to all bearing surfaces.' },
      { n: 7, text: 'Carefully lower left crankcase half onto right half, aligning oil passages.' },
      { n: 8, text: 'See Figure 4-61. Install crankcase screws in sequence shown. Tighten crankcase screws, 1st torque: 120 in-lbs (13.6 N·m). Tighten crankcase screws, final torque: 15-19 ft-lbs (20.3-25.8 N·m).' },
      { n: 9, text: 'Install pistons. See PISTONS (Page 4-46).' },
      { n: 10, text: 'Install cylinders. See CYLINDERS (Page 4-42).' },
      { n: 11, text: 'Install cylinder heads. See CYLINDER HEADS (Page 4-36).' },
      { n: 12, text: 'Install pushrods. See PUSHRODS, LIFTERS AND COVERS (Page 4-32).' },
      { n: 13, text: 'Install rocker arms. See ROCKER ARMS (Page 4-30).' },
      { n: 14, text: 'Install lower rocker covers. See LOWER ROCKER COVERS (Page 4-28).' },
      { n: 15, text: 'Install breathers. See BREATHERS (Page 4-26).' },
      { n: 16, text: 'Install upper rocker covers. See UPPER ROCKER COVERS (Page 4-24).' }
    ]
  },

  {
    id: 't20-flywheel-inspect',
    bikeIds: ['touring-2020'],
    system: 'engine',
    title: 'Flywheel & Connecting Rods — Inspect',
    summary: 'Inspect flywheel/connecting rod assembly for wear, runout, and damage.',
    difficulty: 'Moderate',
    timeMinutes: 90,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 73 },
    figures: [],
    tools: ['Dial indicator', 'Truing stand', 'Engine stand'],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Remove engine. See REPLACE ENGINE (Page 4-61).' },
      { n: 2, text: 'Use low-pressure compressed air to clean exterior surfaces of engine.' },
      { n: 3, text: 'Remove upper rocker covers. See UPPER ROCKER COVERS (Page 4-24).' },
      { n: 4, text: 'Remove breathers. See BREATHERS (Page 4-26).' },
      { n: 5, text: 'Remove lower rocker covers. See LOWER ROCKER COVERS (Page 4-28).' },
      { n: 6, text: 'Remove rocker arms. See ROCKER ARMS (Page 4-30).' },
      { n: 7, text: 'Remove pushrods. See PUSHRODS, LIFTERS AND COVERS (Page 4-32).' },
      { n: 8, text: 'Remove cylinder heads. See CYLINDER HEADS (Page 4-36).' },
      { n: 9, text: 'Remove cylinders. See CYLINDERS (Page 4-42).' },
      { n: 10, text: 'Remove pistons. See PISTONS (Page 4-46).' },
      { n: 11, text: 'Separate crankcase halves. See CRANKCASE (Page 4-63).' },
      { n: 12, text: 'Inspect flywheel/connecting rod assembly for rod knock noise, steel debris in oil filter, piston skirt scoring/scuffing, worn oil pump, piston to valve contact, damage to flywheel main bearing races, bent or twisted connecting rods, worn sprocket teeth, or brinelled main bearings.' },
      { n: 13, text: 'Measure crankshaft runout if crankshaft is suspected of being out-of-true. See TROUBLESHOOTING (Page 4-12).' },
      { n: 14, text: 'Mount flywheel assembly in truing stand with bearing races (1) on roller supports (2). Secure dial indicator (3) near each end of flywheel assembly.' },
      { n: 15, text: 'Set up each indicator (3) to measure the machined surface (4) on one end and splines (5) on the other.' },
      { n: 16, text: 'Adjust both indicators to zero. Slowly rotate flywheel assembly while observing total indicator reading.' },
      { n: 17, text: 'Refer to Table 4-31. If total indicator reading exceeds 0.005 in (0.127 mm) for runout measured in truing stand, or 0.013 in (0.330 mm) for end play, replace flywheel assembly.' }
    ]
  },

  {
    id: 't20-oil-pan-remove',
    bikeIds: ['touring-2020'],
    system: 'engine',
    title: 'Oil Pan — Remove',
    summary: 'Remove engine oil pan and inspect for debris.',
    difficulty: 'Easy',
    timeMinutes: 45,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 75 },
    figures: [],
    tools: ['Socket wrench set', 'Oil catch pan'],
    parts: [],
    torque: [],
    steps: [
      { n: 1, text: 'Drain engine oil into appropriate container.' },
      { n: 2, text: 'Remove oil pan fasteners (4).' },
      { n: 3, text: 'Remove oil pan (2).' },
      { n: 4, text: 'Discard gasket (1).' },
      { n: 5, text: 'Discard tapered plug (3) if equipped.' },
      { n: 6, text: 'Thoroughly inspect and clean oil pan.' },
      { n: 7, text: 'If debris is found, replace oil pan, inspect oil coolers, check valves and oil filter. Clean or replace as necessary.' }
    ]
  },

  {
    id: 't20-oil-pan-install',
    bikeIds: ['touring-2020'],
    system: 'engine',
    title: 'Oil Pan — Install',
    summary: 'Install engine oil pan and fill with fresh oil.',
    difficulty: 'Easy',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 75 },
    figures: [],
    tools: [
      'Socket wrench set',
      'Torque wrench (in-lb and ft-lb)',
      'HYLOMAR GASKET AND THREAD SEALANT (99653-85)',
      'LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE) (99642-97)'
    ],
    parts: [
      { number: '(verify in printed manual)', description: 'Oil pan gasket', qty: 1 },
      { number: '(verify in printed manual)', description: 'Engine oil (4.8 qt service oil change)', qty: 5 }
    ],
    torque: [
      { fastener: 'Oil pan fasteners', value: '132-156 in-lbs (14.9-17.6 N·m)', note: 'Tighten in sequence shown in Figure 4-79' },
      { fastener: 'Oil pan tapered plug', value: '30-36 ft-lbs (40.7-48.8 N·m)', note: 'If equipped' },
      { fastener: 'Engine oil drain plug', value: '14-21 ft-lbs (19-28.5 N·m)', note: '' }
    ],
    steps: [
      { n: 1, text: 'Apply thin coat of sealant to oil pan flange. HYLOMAR GASKET AND THREAD SEALANT (99653-85)' },
      { n: 2, text: 'Apply threadlocker to used oil pan screws. LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE) (99642-97)' },
      { n: 3, text: 'Place new gasket (1) on oil pan flange. Allow sealant to dry until tacky.' },
      { n: 4, text: 'Position oil pan with gasket on bottom of transmission.' },
      { n: 5, text: 'Loosely install fasteners (4).' },
      { n: 6, text: 'See Figure 4-79. Tighten fasteners in sequence shown. Torque: 132-156 in-lbs (14.9-17.6 N·m) Oil pan fasteners' },
      { n: 7, text: 'If equipped: Install tapered plug. Apply thin coat of sealant to threads. LOCTITE 565 THREAD SEALANT (99818-97). Install and tighten. Torque: 30-36 ft-lbs (40.7-48.8 N·m) Oil pan tapered plug' },
      { n: 8, text: 'Install rear wheel. See REAR WHEEL (Page 3-14).' },
      { n: 9, text: 'Install exhaust. See EXHAUST SYSTEM (Page 6-34).' },
      { n: 10, text: 'Add fluids. Add transmission lubricant. See REPLACE TRANSMISSION LUBRICANT (Page 2-13). Install new engine oil filter. Fill engine oil. See REPLACE ENGINE OIL AND FILTER (Page 2-9).' }
    ]
  }
,
{
  id: 't20-drive-belt-remove',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Drive Belt — Remove',
  summary: 'Disconnect battery, remove saddlebags, rear wheel, and rear fork. Remove primary chain, clutch, compensating sprocket, and chaincase housing before removing drive belt from transmission sprocket.',
  difficulty: 'Advanced',
  timeMinutes: 120,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 94 },
  figures: [],
  tools: [
    'Socket set',
    'Wrench set'
  ],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Disconnect negative battery cable. See POWER DISCONNECT (Page 8-8).', warning: 'To prevent accidental vehicle start-up, which could cause death or serious injury, disconnect negative (-) battery cable before proceeding.' },
    { n: 2, text: 'Remove saddlebags. See SADDLEBAGS (Page 3-161).' },
    { n: 3, text: 'Remove rear wheel. See REAR WHEEL (Page 3-14).' },
    { n: 4, text: 'Remove rear fork. See REAR FORK (Page 3-71).' },
    { n: 5, text: 'Remove primary chain, clutch, engine compensating sprocket and chain adjuster. See DRIVE COMPONENTS (Page 5-15).' },
    { n: 6, text: 'Remove primary chaincase housing. See PRIMARY CHAINCASE HOUSING (Page 5-24).' },
    { n: 7, text: 'Remove belt from transmission sprocket.' }
  ]
},

{
  id: 't20-drive-belt-install',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Drive Belt — Install',
  summary: 'Install belt over transmission sprocket, then install primary chaincase housing, primary chain, clutch, compensating sprocket, adjuster, rear fork, wheel, saddlebags, and reconnect battery.',
  difficulty: 'Advanced',
  timeMinutes: 120,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 94 },
  figures: [],
  tools: [
    'Socket set',
    'Wrench set'
  ],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Install belt over transmission sprocket.', warning: 'Never bend belt forward into a loop smaller than the drive sprocket diameter. Never bend belt into a reverse loop. Over bending can damage belt resulting in premature failure, which could cause loss of control and death or serious injury.' },
    { n: 2, text: 'Install primary chaincase housing. See PRIMARY CHAINCASE HOUSING (Page 5-24).' },
    { n: 3, text: 'Install primary chain, clutch, engine compensating sprocket and chain adjuster. See DRIVE COMPONENTS (Page 5-15).' },
    { n: 4, text: 'Install rear fork. See REAR FORK (Page 3-71).' },
    { n: 5, text: 'Install rear wheel. See REAR WHEEL (Page 3-14).' },
    { n: 6, text: 'Install saddlebags. See SADDLEBAGS (Page 3-161).' },
    { n: 7, text: 'Connect negative battery cable. See POWER DISCONNECT (Page 8-8).' }
  ]
},

{
  id: 't20-primary-chaincase-cover-remove',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Primary Chaincase Cover — Remove',
  summary: 'Disconnect battery, remove footboards and shifter lever. Drain primary chaincase oil. Remove screws and cover gasket.',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 98 },
  figures: [],
  tools: [
    'Socket set',
    'Wrench set',
    'Gasket scraper'
  ],
  parts: [
    { number: '—', description: 'Gasket, primary chaincase cover (new)', qty: 1 }
  ],
  torque: [],
  steps: [
    { n: 1, text: 'Disconnect negative battery cable. See POWER DISCONNECT (Page 8-8).', warning: 'To prevent accidental vehicle start-up, which could cause death or serious injury, disconnect negative (-) battery cable before proceeding.' },
    { n: 2, text: 'Remove passenger left footboard and bracket if necessary. See FOOTBOARDS AND FOOTRESTS (Page 3-155). See RIDER FOOTRESTS (Page 3-142).' },
    { n: 3, text: 'Remove rider left footboard and bracket. See RIDER FOOTRESTS (Page 3-142).' },
    { n: 4, text: 'Remove screw securing jiffy stand interlock sensor, if equipped. See JIFFY STAND SENSOR (JSS) (Page 8-107).' },
    { n: 5, text: 'Remove heel shift lever. See SHIFTER LINKAGE (Page 5-7).' },
    { n: 6, text: 'Drain primary chaincase oil. See REPLACE PRIMARY CHAINCASE LUBRICANT (Page 2-11).' },
    { n: 7, text: 'Remove primary chaincase cover screws.' },
    { n: 8, text: 'Remove cover.' },
    { n: 9, text: 'Remove and discard gasket.' }
  ]
},

{
  id: 't20-primary-chaincase-cover-install',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Primary Chaincase Cover — Install',
  summary: 'Verify cover debris removal, install new gasket, apply threadlocker to screw threads, install cover with correct tightening sequence. Fill chaincase oil, reinstall components, reconnect battery.',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 98 },
  figures: [],
  tools: [
    'Torque wrench (in-lbs)',
    'Socket set'
  ],
  parts: [
    { number: '99642-97', description: 'Loctite 243 medium strength threadlocker and sealant (blue)', qty: 1 },
    { number: '—', description: 'Gasket, primary chaincase cover (new)', qty: 1 }
  ],
  torque: [
    { fastener: 'Primary cover screws', value: '144-156 in-lbs (16.3-17.6 N·m)', note: 'Tighten in sequence shown. Apply threadlocker to threads.' }
  ],
  steps: [
    { n: 1, text: 'Verify all debris is washed from inside ribs of cover.' },
    { n: 2, text: 'Verify hollow dowels are installed properly.' },
    { n: 3, text: 'Install new cover gasket.' },
    { n: 4, text: 'Install cover.' },
    { n: 5, text: 'Apply a drop of threadlocker to threads of screws.' },
    { n: 6, text: 'Install cover with screws in positions shown.' },
    { n: 7, text: 'Tighten screws in sequence shown. Torque: 144-156 in-lbs (16.3-17.6 N·m) Primary cover screws.' },
    { n: 8, text: 'Fill primary chaincase with oil. See REPLACE PRIMARY CHAINCASE LUBRICANT (Page 2-11).' },
    { n: 9, text: 'Install heel shift lever. See SHIFTER LINKAGE (Page 5-7).' },
    { n: 10, text: 'Install rider footboard and bracket, if removed. See RIDER FOOTRESTS (Page 3-142).' },
    { n: 11, text: 'Install screw securing jiffy stand interlock sensor, if equipped. See JIFFY STAND SENSOR (JSS) (Page 8-107).' },
    { n: 12, text: 'Install negative battery cable. See POWER DISCONNECT (Page 8-8).' }
  ]
},

{
  id: 't20-drive-components-remove',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Drive Components — Remove (Primary Chain/Tensioner/Sprocket/Clutch)',
  summary: 'Disconnect battery, remove footboards and shifter lever. Drain primary chaincase oil. Remove clutch release bearing, then primary chain, tensioner, clutch assembly, and compensating sprocket as a unit.',
  difficulty: 'Advanced',
  timeMinutes: 120,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 101 },
  figures: [],
  tools: [
    'Primary drive locking tool (HD-48219)',
    'Socket set',
    'Wrench set',
    'Spiral-flute screw extractor',
    'Cable strap'
  ],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Disconnect negative battery cable. See POWER DISCONNECT (Page 8-8).', warning: 'To prevent accidental vehicle start-up, which could cause death or serious injury, disconnect negative (-) battery cable before proceeding.' },
    { n: 2, text: 'Remove rider left footboard and bracket, if necessary. See RIDER FOOTRESTS (Page 3-142).' },
    { n: 3, text: 'Remove heel shifter lever. See SHIFTER LINKAGE (Page 5-7).' },
    { n: 4, text: 'Drain primary chaincase oil. See REPLACE PRIMARY CHAINCASE LUBRICANT (Page 2-11).' },
    { n: 5, text: 'Remove secondary clutch actuator and pushrod. See TRANSMISSION SIDE COVERS: HYDRAULIC CLUTCH (Page 5-9).' },
    { n: 6, text: 'Remove primary chaincase cover. See PRIMARY CHAINCASE COVER (Page 5-13).' },
    { n: 7, text: 'Install cable strap to secure chain tensioner. Exposed portion of cable strap below cover indicates need for removal before cover installation.' },
    { n: 8, text: 'Remove chain tensioner fasteners.' },
    { n: 9, text: 'Remove chain tensioner.' },
    { n: 10, text: 'Mark one link on primary chain for reference during installation.' },
    { n: 11, text: 'Remove clutch release plate and bearing. See CLUTCH RELEASE BEARING AND PUSH ROD: HYDRAULIC CLUTCH (Page 5-11).' },
    { n: 12, text: 'Remove mainshaft nut using primary drive locking tool. Place special tool between sprockets. Rotate clutch hub mainshaft nut clockwise to remove.', warning: 'Mainshaft nut has left-hand threads.' },
    { n: 13, text: 'Remove compensating sprocket bolt. Place primary drive locking tool between sprockets. Rotate compensating sprocket bolt counterclockwise to loosen. Remove bolt, retainer and thrust washer.' },
    { n: 14, text: 'Inspect thrust washers for damage.' },
    { n: 15, text: 'Remove clutch assembly, primary chain and compensating sprocket assembly as a single unit.' },
    { n: 16, text: 'Clean sprocket retainer. Verify that oil holes are clear.' }
  ]
},

{
  id: 't20-drive-components-install',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Drive Components — Install (Primary Chain/Tensioner/Sprocket/Clutch)',
  summary: 'Install spring washers, primary chain and compensating sprocket assembly, mainshaft nut with threadlocker, compensating sprocket bolt, and chain tensioner with tension adjustment.',
  difficulty: 'Advanced',
  timeMinutes: 120,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 101 },
  figures: [],
  tools: [
    'Primary drive locking tool (HD-48219)',
    'Torque wrench (ft-lbs)',
    'Socket set'
  ],
  parts: [
    { number: '94759-99', description: 'Loctite 262 high strength threadlocker and sealant (red)', qty: 1 }
  ],
  torque: [
    { fastener: 'Clutch hub mainshaft nut', value: '70-80 ft-lbs (94.9-108.5 N·m)', note: 'Mainshaft nut has left-hand threads.' },
    { fastener: 'Compensating sprocket bolt, 1st torque', value: '100 ft-lbs (135.6 N·m)', note: '' },
    { fastener: 'Compensating sprocket bolt, final torque', value: '175 ft-lbs (237.3 N·m)', note: 'Loosen one-half turn after 1st torque.' },
    { fastener: 'Primary chain tensioner fasteners', value: '21-24 ft-lbs (28.5-32.6 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Install spring washers.' },
    { n: 2, text: 'Apply a thin layer of primary chaincase oil to inner diameter of compensating sprocket and splines of shaft extension.' },
    { n: 3, text: 'Install shaft extension.' },
    { n: 4, text: 'Install large spring washers and medium spring washers. Outer diameter of spring washers must contact each other.' },
    { n: 5, text: 'Install small spring washer so outer diameter contacts sliding cam.' },
    { n: 6, text: 'Install primary chain, compensating sprocket and clutch as an assembly.', warning: 'Clutch hub mainshaft nut has left-hand threads.' },
    { n: 7, text: 'Lightly lubricate thrust washer. Install components and new bolt. Hand tighten.' },
    { n: 8, text: 'Install mainshaft nut.' },
    { n: 9, text: 'Clean and prime threads of clutch hub mainshaft nut.' },
    { n: 10, text: 'Apply threadlocker to nut threads. LOCTITE 262 HIGH STRENGTH THREADLOCKER AND SEALANT (RED) (94759-99).' },
    { n: 11, text: 'Install nut onto mainshaft. Hand-tighten.' },
    { n: 12, text: 'Place special tool (PRIMARY DRIVE LOCKING TOOL HD-48219) between sprockets.' },
    { n: 13, text: 'Tighten clutch hub mainshaft nut. Torque: 70-80 ft-lbs (94.9-108.5 N·m) Clutch hub mainshaft nut.' },
    { n: 14, text: 'Tighten compensating sprocket bolt.' },
    { n: 15, text: 'Torque: 100 ft-lbs (135.6 N·m) Compensating sprocket bolt, 1st torque.' },
    { n: 16, text: 'Loosen one-half turn.' },
    { n: 17, text: 'Final torque: 175 ft-lbs (237.3 N·m) Compensating sprocket bolt, final torque.' },
    { n: 18, text: 'Install primary chain tensioner with fasteners. Torque: 21-24 ft-lbs (28.5-32.6 N·m) Primary chain tensioner fasteners.' },
    { n: 19, text: 'Remove cable strap.' },
    { n: 20, text: 'Set preliminary chain tension by checking tension at the top span while pulling down on chain midway between sprockets. Correct tension is 0.500-0.625 in (12.7-15.88 mm).' },
    { n: 21, text: 'If chain is loose, move chain adjuster one notch. Check tension.' },
    { n: 22, text: 'Test ride vehicle after tensioner removal/installation to provide proper adjustment.' }
  ]
},

{
  id: 't20-clutch-disassemble',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Clutch Pack — Disassemble',
  summary: 'Remove pressure plate bolts alternately, then remove stopper plate, springs, spring seats, pressure plate, friction and steel plates, and damper spring.',
  difficulty: 'Moderate',
  timeMinutes: 60,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 109 },
  figures: [],
  tools: [
    'Socket set',
    'Wrench set'
  ],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove pressure plate.' },
    { n: 2, text: 'Remove bolts alternating each bolt 1-2 turns while removing.' },
    { n: 3, text: 'Remove stopper plate.' },
    { n: 4, text: 'Remove springs.' },
    { n: 5, text: 'Remove spring seats.' },
    { n: 6, text: 'Remove pressure plate.' },
    { n: 7, text: 'Remove friction and steel plates.' },
    { n: 8, text: 'Remove narrow friction plates and narrow steel plate.' },
    { n: 9, text: 'Remove wide steel plates and wide friction plates.' },
    { n: 10, text: 'Remove narrow friction plate.' },
    { n: 11, text: 'Remove damper spring.' },
    { n: 12, text: 'Remove damper spring seat.' }
  ]
},

{
  id: 't20-clutch-clean-and-inspect',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Clutch Pack — Clean and Inspect',
  summary: 'Wash parts in solvent, dry with compressed air. Check friction plates thickness, steel plate distortion, clutch hub bearing, shell chain sprocket, and spring/stopper condition.',
  difficulty: 'Easy',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 109 },
  figures: [],
  tools: [
    'Compressed air system (low pressure)',
    'Feeler gauge',
    'Precision flat surface'
  ],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Wash parts in cleaning solvent. Dry with low-pressure compressed air.', warning: 'Compressed air can pierce the skin and flying debris from compressed air could cause serious eye injury. Wear safety glasses when working with compressed air.' },
    { n: 2, text: 'Do not wash friction plates or hub bearing with cleaning solvent.' },
    { n: 3, text: 'Check friction plates.' },
    { n: 4, text: 'Remove lubricant using compressed air.' },
    { n: 5, text: 'Measure thickness of each plate.' },
    { n: 6, text: 'If thickness of any plate is less than specification, replace entire clutch disc set. Narrow plate 0.111 in (2.82 mm), Wide plate 0.143 in (3.62 mm).' },
    { n: 7, text: 'Look for worn or damaged fiber surface material (both sides).' },
    { n: 8, text: 'Check steel plates for distortion.' },
    { n: 9, text: 'Replace entire clutch disc set if any steel plates are grooved.' },
    { n: 10, text: 'Lay plate on a precision flat surface.' },
    { n: 11, text: 'Using a feeler gauge, check for distortion in several places.' },
    { n: 12, text: 'If any steel plate is warped beyond 0.006 in (0.15 mm), replace entire clutch disc set.' },
    { n: 13, text: 'Check clutch hub bearing for smooth operation. Replace if necessary.' },
    { n: 14, text: 'Check clutch shell chain sprocket and starter ring gear. Replace if worn or damaged.' },
    { n: 15, text: 'Check clutch hub and shell steel plate slots for wear or damage. Replace if necessary.' },
    { n: 16, text: 'Check coil springs and stopper plate for wear or damage. Replace if necessary.' }
  ]
},

{
  id: 't20-clutch-assemble',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Clutch Pack — Assemble',
  summary: 'Soak friction plates in lubricant, install damper spring, then install friction and steel plates in alternating pattern, pressure plate, springs, stopper plate, and bolts with alternating torque.',
  difficulty: 'Moderate',
  timeMinutes: 60,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 110 },
  figures: [],
  tools: [
    'Torque wrench (in-lbs)',
    'Socket set'
  ],
  parts: [
    { number: '—', description: 'Friction plates (new, if needed)', qty: '(verify)' },
    { number: '—', description: 'Steel plates (new, if needed)', qty: '(verify)' }
  ],
  torque: [
    { fastener: 'Clutch pressure plate bolts', value: '70-100 in-lbs (7.9-11.3 N·m)', note: 'Alternate tightening bolts 1-2 turns to prevent damage to stopper plate.' }
  ],
  steps: [
    { n: 1, text: 'Submerge and soak all friction plates in primary chaincase lubricant for at least five minutes.' },
    { n: 2, text: 'Install damper spring seat into clutch hub.' },
    { n: 3, text: 'Install damper spring onto damper spring seat.' },
    { n: 4, text: 'Install friction and steel plates.' },
    { n: 5, text: 'Install one narrow friction plate into clutch hub.' },
    { n: 6, text: 'Install one wide steel plate onto narrow friction plate and damper spring.' },
    { n: 7, text: 'Beginning with a wide friction plate, alternate remaining wide friction plates with wide steel plates.' },
    { n: 8, text: 'Install narrow friction plate, narrow steel plate and remaining narrow friction plate.' },
    { n: 9, text: 'Install pressure plate.' },
    { n: 10, text: 'Install spring seats.' },
    { n: 11, text: 'Align and install pressure plate onto clutch hub.' },
    { n: 12, text: 'Install springs.' },
    { n: 13, text: 'Install stopper plate.' },
    { n: 14, text: 'Install bolts. Alternate tightening bolts 1-2 turns to prevent damage to stopper plate. Torque: 70-100 in-lbs (7.9-11.3 N·m).' }
  ]
},

{
  id: 't20-clutch-hub-disassemble',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Clutch Hub Assembly — Disassemble',
  summary: 'Remove clutch hub retaining ring, press hub from bearing, remove bearing retaining ring, and press bearing from clutch shell.',
  difficulty: 'Advanced',
  timeMinutes: 90,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 113 },
  figures: [],
  tools: [
    'Retaining ring pliers',
    'Hydraulic press',
    'Press plugs (suitable)',
    'Safety glasses'
  ],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove and discard clutch hub retaining ring.', warning: 'Wear safety glasses or goggles when removing or installing retaining rings. Retaining rings can slip from the pliers and could be propelled with enough force to cause serious eye injury.' },
    { n: 2, text: 'Support clutch shell in press with ring gear side up.' },
    { n: 3, text: 'Press hub from bearing in clutch shell.' },
    { n: 4, text: 'Remove and discard bearing retaining ring.' },
    { n: 5, text: 'Support clutch shell in press with ring gear side down.' },
    { n: 6, text: 'Use a suitable press plug to remove bearing.' },
    { n: 7, text: 'Clean and inspect components.' }
  ]
},

{
  id: 't20-clutch-hub-assemble',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Clutch Hub Assembly — Assemble',
  summary: 'Install new bearing in clutch shell with correct press placement and new retaining ring, then press hub into bearing with new retaining ring.',
  difficulty: 'Advanced',
  timeMinutes: 90,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 114 },
  figures: [],
  tools: [
    'Hydraulic press',
    'Press plugs (suitable)',
    'Retaining ring pliers',
    'Safety glasses'
  ],
  parts: [
    { number: '—', description: 'Bearing, clutch (new)', qty: 1 },
    { number: '—', description: 'Retaining ring, bearing (new)', qty: 1 },
    { number: '—', description: 'Retaining ring, clutch hub (new)', qty: 1 }
  ],
  torque: [],
  steps: [
    { n: 1, text: 'Install new bearing.' },
    { n: 2, text: 'Place clutch shell in press with ring gear side up.' },
    { n: 3, text: 'Support clutch shell bore on sprocket side to avoid damage to ears on clutch basket.' },
    { n: 4, text: 'Using a suitable press plug, press against outer race until bearing contacts shoulder in clutch shell bore.' },
    { n: 5, text: 'Install new bearing retaining ring with flat side toward bearing.', warning: 'Wear safety glasses or goggles when removing or installing retaining rings. Retaining rings can slip from the pliers and could be propelled with enough force to cause serious eye injury.' },
    { n: 6, text: 'Install clutch hub.' },
    { n: 7, text: 'Place clutch shell in press with sprocket side up.' },
    { n: 8, text: 'Center hub in bearing.' },
    { n: 9, text: 'Support bearing inner race with a sleeve on transmission side.' },
    { n: 10, text: 'Press hub into bearing until shoulder contacts bearing inner race.' },
    { n: 11, text: 'Install clutch hub retaining ring in groove of clutch hub.' }
  ]
},

{
  id: 't20-primary-chaincase-housing-remove',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Primary Chaincase Housing — Remove',
  summary: 'Disconnect battery, drain oil, remove starter and drive components. Remove primary chaincase housing screws and discard gasket.',
  difficulty: 'Advanced',
  timeMinutes: 120,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 120 },
  figures: [],
  tools: [
    'Socket set',
    'Wrench set',
    'Gasket scraper'
  ],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Disconnect negative battery cable. See POWER DISCONNECT (Page 8-8).', warning: 'To prevent accidental vehicle start-up, which could cause death or serious injury, disconnect negative (-) battery cable before proceeding.' },
    { n: 2, text: 'Remove rider footboard and bracket, if needed. See RIDER FOOTRESTS (Page 3-142).' },
    { n: 3, text: 'Drain primary chaincase oil. See REPLACE PRIMARY CHAINCASE LUBRICANT (Page 2-11).' },
    { n: 4, text: 'Remove primary chaincase cover. See PRIMARY CHAINCASE COVER (Page 5-13).' },
    { n: 5, text: 'Remove starter. See STARTER (Page 8-11).' },
    { n: 6, text: 'Remove primary chain, clutch and compensating sprocket. See DRIVE COMPONENTS (Page 5-15).' },
    { n: 7, text: 'Remove and discard screws.' },
    { n: 8, text: 'Remove primary chaincase housing.' },
    { n: 9, text: 'Discard gasket.' }
  ]
},

{
  id: 't20-primary-chaincase-housing-inspect',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Primary Chaincase Housing — Inspect',
  summary: 'Inspect housing for cracks or damaged gasket surface. Check mainshaft bearing, oil seal, and shifter shaft bushing condition.',
  difficulty: 'Easy',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 121 },
  figures: [],
  tools: [
    'Inspection light'
  ],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Inspect primary chaincase for cracks or damaged gasket surface.' },
    { n: 2, text: 'Check mainshaft bearing. Replace if bearing does not rotate freely.' },
    { n: 3, text: 'Replace oil seal.' },
    { n: 4, text: 'Inspect shifter shaft bushing. Replace if necessary.' }
  ]
},

{
  id: 't20-primary-chaincase-housing-install',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Primary Chaincase Housing — Install',
  summary: 'Install gasket on surface with dowel engagement verification, spread oil on mainshaft seal lip, install housing, then install and torque sealing screws in proper sequence.',
  difficulty: 'Moderate',
  timeMinutes: 90,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 121 },
  figures: [],
  tools: [
    'Torque wrench (ft-lbs)',
    'Socket set',
    'Tape (masking)'
  ],
  parts: [
    { number: '—', description: 'Gasket, primary chaincase housing (new)', qty: 1 },
    { number: '—', description: 'Screw, primary chaincase housing (new)', qty: 5 }
  ],
  torque: [
    { fastener: 'Primary chaincase sealing screws', value: '26-28 ft-lbs (35.3-38 N·m)', note: 'Tighten in sequence shown.' }
  ],
  steps: [
    { n: 1, text: 'Install gasket on surface. Verify dowels in gasket engage dowel holes.' },
    { n: 2, text: 'Spread a film of oil on mainshaft oil seal lip and rubber portion of crankcase gasket.' },
    { n: 3, text: 'Cover mainshaft clutch hub splines with tape to prevent splines from damaging primary housing inner oil seal.' },
    { n: 4, text: 'Install primary chaincase housing.' },
    { n: 5, text: 'Install new sealing screws.' },
    { n: 6, text: 'Tighten in sequence shown. Torque: 26-28 ft-lbs (35.3-38 N·m) Primary chaincase sealing screws.' }
  ]
},

{
  id: 't20-transmission-sprocket-remove',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Sprocket — Remove',
  summary: 'Loosen drive belt. Remove lockplate screws, install sprocket locking tool and pilot, remove sprocket nut using special wrench tool.',
  difficulty: 'Moderate',
  timeMinutes: 60,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 127 },
  figures: [],
  tools: [
    'Final drive sprocket locking tool (HD-46282A)',
    'Pilot (HD-94660-2)',
    'Mainshaft locknut wrench (HD-47910)',
    'Socket set'
  ],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Loosen drive belt. See INSPECT AND ADJUST DRIVE BELT AND SPROCKETS (Page 2-36).' },
    { n: 2, text: 'Remove and discard screws.' },
    { n: 3, text: 'Remove lockplate.' },
    { n: 4, text: 'Attach sprocket locking tool with arm of tool against bottom of rear fork pivot.' },
    { n: 5, text: 'Install pilot on mainshaft. Special Tool: PILOT (HD-94660-2).' },
    { n: 6, text: 'Remove sprocket nut using locknut wrench. Special Tool: MAINSHAFT LOCKNUT WRENCH (HD-47910).' },
    { n: 7, text: 'Remove sprocket, allowing belt to slip from sprocket as sprocket is removed.' }
  ]
},

{
  id: 't20-transmission-sprocket-inspect',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Sprocket — Clean and Inspect',
  summary: 'Clean sprocket of grease and dirt. Inspect belt and sprocket, main drive gear, and mainshaft seals.',
  difficulty: 'Easy',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 128 },
  figures: [],
  tools: [
    'Non-volatile cleaning solvent'
  ],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Using a non-volatile cleaning solvent, clean sprocket of all grease and dirt.' },
    { n: 2, text: 'Inspect belt and sprocket. See INSPECT AND ADJUST DRIVE BELT AND SPROCKETS (Page 2-36).' },
    { n: 3, text: 'Inspect main drive gear and mainshaft seals. Replace if damaged.' }
  ]
},

{
  id: 't20-transmission-sprocket-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Sprocket — Install',
  summary: 'Place sprocket in position, install and torque nut to 100 ft-lbs, loosen one full turn, torque to 35 ft-lbs, then final torque with angle gauge to 35-40 degrees. Install lockplate and screws.',
  difficulty: 'Advanced',
  timeMinutes: 75,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 128 },
  figures: [],
  tools: [
    'Final drive sprocket locking tool (HD-46282A)',
    'Pilot (HD-94660-2)',
    'Mainshaft locknut wrench (HD-47910)',
    'Torque angle gauge (TA360)',
    'Torque wrench (ft-lbs)'
  ],
  parts: [
    { number: 'Loctite 271', description: 'Loctite 271 high strength threadlocker and sealant (red)', qty: 1 },
    { number: '—', description: 'Screw, transmission sprocket lockplate (new)', qty: 2 }
  ],
  torque: [
    { fastener: 'Transmission sprocket nut, 1st torque', value: '100 ft-lbs (135.6 N·m)', note: '' },
    { fastener: 'Transmission sprocket nut, 2nd torque', value: '35 ft-lbs (47.5 N·m)', note: 'After loosening one full turn.' },
    { fastener: 'Transmission sprocket nut, final torque', value: '35-40 degrees', note: 'Use torque angle gauge or scribe lines.' },
    { fastener: 'Transmission sprocket lockplate screws', value: '90-120 in-lbs (10.2-13.6 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Place transmission sprocket in position. Install belt as sprocket is installed.' },
    { n: 2, text: 'Install sprocket nut.', warning: 'Never get oil on sprocket nut threads.' },
    { n: 3, text: 'Apply a film of clean engine oil to mating surfaces of sprocket nut and sprocket.' },
    { n: 4, text: 'If reusing sprocket nut, apply threadlocker to threads of sprocket nut. LOCTITE 271 HIGH STRENGTH THREADLOCKER AND SEALANT (RED) (Loctite 271).' },
    { n: 5, text: 'Install sprocket nut finger-tight.' },
    { n: 6, text: 'Install sprocket locking tool against rear fork pivot.' },
    { n: 7, text: 'Install pilot on mainshaft.' },
    { n: 8, text: 'Tighten sprocket nut using locking wrench. Torque: 100 ft-lbs (135.6 N·m) Transmission sprocket nut, 1st torque.' },
    { n: 9, text: 'Loosen sprocket nut one full turn.' },
    { n: 10, text: 'Tighten sprocket nut. Torque: 35 ft-lbs (47.5 N·m) Transmission sprocket nut, 2nd torque.' },
    { n: 11, text: 'Scribe lines or use torque angle gauge for final torque.' },
    { n: 12, text: 'Tighten sprocket nut an additional 35-40 degrees. Torque: (35-40 degrees) Transmission sprocket nut, final torque.', warning: 'Do not exceed final torque of 45 degrees.' },
    { n: 13, text: 'Install lockplate. Align lockplate holes with tapped holes in sprocket.' },
    { n: 14, text: 'Install new screws.' },
    { n: 15, text: 'Tighten. Torque: 90-120 in-lbs (10.2-13.6 N·m) Transmission sprocket lockplate screws.' }
  ]
},

{
  id: 't20-transmission-remove',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission — Remove from Motorcycle',
  summary: 'Disconnect battery, drain transmission and engine oil. Remove exhaust, side covers, push rod, footboards, shifter lever. Remove primary components. Remove transmission bearing housing screws and pry assembly free.',
  difficulty: 'Advanced',
  timeMinutes: 180,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 131 },
  figures: [],
  tools: [
    'Socket set',
    'Wrench set',
    'Pry bar',
    'Oil drain container'
  ],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Disconnect negative battery cable. See POWER DISCONNECT (Page 8-8).', warning: 'To prevent accidental vehicle start-up, which could cause death or serious injury, disconnect negative (-) battery cable before proceeding.' },
    { n: 2, text: 'Drain transmission oil. See REPLACE TRANSMISSION LUBRICANT (Page 2-13).' },
    { n: 3, text: 'Drain engine oil. See REPLACE ENGINE OIL AND FILTER (Page 2-9).' },
    { n: 4, text: 'Remove exhaust system. See EXHAUST SYSTEM (Page 6-34).' },
    { n: 5, text: 'Remove transmission side covers. See TRANSMISSION SIDE COVERS: HYDRAULIC CLUTCH (Page 5-9).' },
    { n: 6, text: 'Remove clutch release push rod. See CLUTCH RELEASE BEARING AND PUSH ROD: HYDRAULIC CLUTCH (Page 5-11).' },
    { n: 7, text: 'Remove rider footboard and bracket, if needed. See RIDER FOOTRESTS (Page 3-142).' },
    { n: 8, text: 'Remove heel shift lever. See SHIFTER LINKAGE (Page 5-7).' },
    { n: 9, text: 'Drain primary chaincase oil. See REPLACE PRIMARY CHAINCASE LUBRICANT (Page 2-11).' },
    { n: 10, text: 'Remove primary chaincase cover. See PRIMARY CHAINCASE COVER (Page 5-13).' },
    { n: 11, text: 'Remove starter. See STARTER (Page 8-11).' },
    { n: 12, text: 'Remove primary chain, clutch and compensating sprocket. See DRIVE COMPONENTS (Page 5-15).' },
    { n: 13, text: 'Remove primary chaincase housing. See PRIMARY CHAINCASE HOUSING (Page 5-24).' },
    { n: 14, text: 'Loosen drive belt. See INSPECT AND ADJUST DRIVE BELT AND SPROCKETS (Page 2-36).' },
    { n: 15, text: 'Remove transmission mainshaft bearing inner race. See Mainshaft Bearing Inner Race (Page 5-26).' },
    { n: 16, text: 'Remove transmission top cover.' },
    { n: 17, text: 'Set a rag over transmission case.' },
    { n: 18, text: 'Set shifter cam pawl on rag.' },
    { n: 19, text: 'Cover mainshaft clutch hub splines with tape to prevent damaging main drive gear bearings and oil seal.' },
    { n: 20, text: 'Remove transmission bearing housing screws.', warning: 'Always pry bearing housing loose. Never tap on shafts to remove transmission assembly. The bearing housing bearings will be damaged.' },
    { n: 21, text: 'Pry bearing housing loose.' },
    { n: 22, text: 'Remove bearing housing and transmission components from transmission case as an assembly.' }
  ]
},

{
  id: 't20-transmission-disassemble',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission — Disassemble (Shift Cam/Forks/Shafts/Gears)',
  summary: 'Remove shift fork shafts, shift forks, lock plate, shift cam, and detent assembly. Remove mainshaft and countershaft locknuts. Press out mainshaft and countershaft with gears.',
  difficulty: 'Advanced',
  timeMinutes: 180,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 133 },
  figures: [],
  tools: [
    'Spiral-flute screw extractor',
    'Vise grips',
    'Hydraulic press',
    'Press plugs (suitable)',
    'Socket set'
  ],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove shift fork shafts.' },
    { n: 2, text: 'Set bearing housing on bench with shafts pointing up.' },
    { n: 3, text: 'Remove shift fork shafts using spiral-flute screw extractor or vise grips.', warning: 'Shafts have slight interference fit.' },
    { n: 4, text: 'Mark end of shaft to aid assembly.' },
    { n: 5, text: 'Remove shift forks from dog rings.' },
    { n: 6, text: 'Remove lock plate. Discard screws.' },
    { n: 7, text: 'Hold detent arm back and remove shift cam.' },
    { n: 8, text: 'If needed, remove detent assembly.' },
    { n: 9, text: 'Remove detent screw, detent arm, sleeve and detent spring. Discard detent screw.' },
    { n: 10, text: 'Remove mainshaft and countershaft locknuts.' },
    { n: 11, text: 'Lock two gears in place using dog rings.' },
    { n: 12, text: 'Temporarily put transmission assembly into transmission case.' },
    { n: 13, text: 'Remove locknuts.' },
    { n: 14, text: 'Remove transmission assembly from transmission case.' },
    { n: 15, text: 'Remove mainshaft retaining ring.' },
    { n: 16, text: 'Remove dog ring, guiding hub, mainshaft fifth gear and bearing.', warning: 'Do not press directly on end of mainshaft. Use a spacer between end of mainshaft and press ram.' },
    { n: 17, text: 'Press mainshaft out of bearing housing.' },
    { n: 18, text: 'Replace bearing housing bearing.' },
    { n: 19, text: 'Press countershaft out of bearing housing bearing.', warning: 'Do not press directly on end of countershaft. Place a spacer between end of countershaft and press ram.' },
    { n: 20, text: 'Remove washer, countershaft first gear and bearing.' },
    { n: 21, text: 'Remove countershaft second, third and fourth gears.' },
    { n: 22, text: 'Replace bearing housing bearing.' }
  ]
},

{
  id: 't20-transmission-assemble',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission — Assemble (Shift Cam/Forks/Shafts/Gears)',
  summary: 'Install bearings in bearing housing, install countershaft with gears, install mainshaft with gears, install locknuts, install detent assembly, shift cam, lock plate, and shift fork shafts.',
  difficulty: 'Advanced',
  timeMinutes: 240,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 140 },
  figures: [],
  tools: [
    'Hydraulic press',
    'Press plugs (suitable)',
    'Torque wrench (ft-lbs)',
    'Socket set',
    'Scissor first gear tool (HD-52235)',
    'Safety glasses'
  ],
  parts: [
    { number: '—', description: 'Bearing, transmission (new)', qty: 2 },
    { number: '—', description: 'Retaining ring, bearing (new)', qty: 2 },
    { number: '—', description: 'Locknuts, mainshaft/countershaft (new)', qty: 2 },
    { number: '—', description: 'Detent screw (new)', qty: 1 },
    { number: '—', description: 'Lock plate screw (new)', qty: 2 }
  ],
  torque: [
    { fastener: 'Shift drum detent screw', value: '120-150 in-lbs (13.6-17 N·m)', note: '' },
    { fastener: 'Shift drum lock plate screws', value: '57-63 in-lbs (6.4-7.1 N·m)', note: '' },
    { fastener: 'Transmission mainshaft/countershaft locknuts', value: '85-95 ft-lbs (115.3-128.8 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Install bearings.' },
    { n: 2, text: 'Support bearing housing at bearing bores with a flat plate.' },
    { n: 3, text: 'Position new bearing over bore with number side up.' },
    { n: 4, text: 'Press bearing until seated in bore.' },
    { n: 5, text: 'Install new beveled retaining ring with flat side against bearing.', warning: 'Wear safety glasses or goggles when removing or installing retaining rings. Retaining rings can slip from the pliers and could be propelled with enough force to cause serious eye injury.' },
    { n: 6, text: 'Install countershaft.' },
    { n: 7, text: 'Install countershaft fourth gear.' },
    { n: 8, text: 'Lubricate needle bearings and races using SCREAMIN\' EAGLE ASSEMBLY LUBE.' },
    { n: 9, text: 'Install new needle bearing.' },
    { n: 10, text: 'Install guiding hub.' },
    { n: 11, text: 'Install dog ring.' },
    { n: 12, text: 'Install securing segments with rounded edge facing up. Verify that segments fully engage grooves in countershaft.' },
    { n: 13, text: 'Install lock ring with waved, stepped face toward securing segments.' },
    { n: 14, text: 'Install countershaft third gear.' },
    { n: 15, text: 'Install countershaft second gear.', warning: 'Install second gear guiding hub with deeper counterbore facing countershaft second gear.' },
    { n: 16, text: 'Preload scissor first gear. While holding thick gear, rotate thin gear until holes align. Install HD-52235 (SCISSOR FIRST GEAR TOOL).' },
    { n: 17, text: 'Install new needle bearing, countershaft first gear and washer.' },
    { n: 18, text: 'Install countershaft to bearing housing.' },
    { n: 19, text: 'Support countershaft sixth gear in press.' },
    { n: 20, text: 'Using a suitable sleeve, press on bearing inner race until bearing contacts countershaft first gear washer.' },
    { n: 21, text: 'Install mainshaft.' },
    { n: 22, text: 'Support mainshaft fourth gear in press.' },
    { n: 23, text: 'Raise and hold dog ring engaged with countershaft third gear during press procedure.' },
    { n: 24, text: 'Using a suitable sleeve, press on bearing inner race until bearing contacts mainshaft first gear.' },
    { n: 25, text: 'With bearing housing on end (shafts pointing up), install new bearing and mainshaft fifth gear.' },
    { n: 26, text: 'With guiding hub counterbore facing mainshaft fifth gear, install guiding hub and dog ring.' },
    { n: 27, text: 'Install new retaining ring.' },
    { n: 28, text: 'Remove holding tool from scissor first gear.' },
    { n: 29, text: 'Install new mainshaft and countershaft locknuts.' },
    { n: 30, text: 'Using dog rings, lock two gears in place.' },
    { n: 31, text: 'Temporarily install transmission assembly in transmission case.' },
    { n: 32, text: 'Install locknuts. Tighten. Torque: 85-95 ft-lbs (115.3-128.8 N·m) Transmission mainshaft/countershaft locknuts.' },
    { n: 33, text: 'Remove transmission assembly from transmission case.' },
    { n: 34, text: 'Set bearing housing on bench with shafts pointing up.' },
    { n: 35, text: 'Install detent arm assembly, if removed.' },
    { n: 36, text: 'Clean detent screw mounting hole in transmission bearing housing.' },
    { n: 37, text: 'Assemble new detent screw, detent arm, sleeve and detent spring.' },
    { n: 38, text: 'Align spring and detent arm as shown.' },
    { n: 39, text: 'Install detent assembly in bearing housing with screw. Tighten. Torque: 120-150 in-lbs (13.6-17 N·m) Shift drum detent screw.' },
    { n: 40, text: 'Hold detent arm back and install shift cam assembly.' },
    { n: 41, text: 'Install lock plate and new lock plate screws. Tighten. Torque: 57-63 in-lbs (6.4-7.1 N·m) Shift drum lock plate screws.' },
    { n: 42, text: 'Remove any burrs created on shift shafts during removal.' },
    { n: 43, text: 'Install long shift shaft.' },
    { n: 44, text: 'Insert shifter fork into dog ring between mainshaft fifth and sixth gear.' },
    { n: 45, text: 'Slide shift shaft through shifter fork.' },
    { n: 46, text: 'Install shaft in bearing housing.' },
    { n: 47, text: 'Install short shift shaft.' },
    { n: 48, text: 'Insert shifter fork into dog ring between countershaft third and fourth gear.' },
    { n: 49, text: 'Insert shifter fork into dog ring between countershaft first and second gear.' },
    { n: 50, text: 'Slide shift shaft through shifter forks.' },
    { n: 51, text: 'Install shaft in bearing housing.' }
  ]
},

{
  id: 't20-transmission-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission — Install in Motorcycle',
  summary: 'Install transmission in case with gasket, install bearing housing screws, install top cover, install bearing inner race, push rod, side covers, exhaust, and all removed components.',
  difficulty: 'Advanced',
  timeMinutes: 180,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 131 },
  figures: [],
  tools: [
    'Torque wrench (ft-lbs)',
    'Socket set',
    'Tape (masking)'
  ],
  parts: [
    { number: '—', description: 'Gasket, transmission assembly ring (new)', qty: 1 },
    { number: '—', description: 'Bearing housing screw (new)', qty: 8 },
    { number: '—', description: 'Top cover screw (new)', qty: 2 }
  ],
  torque: [
    { fastener: 'Transmission bearing housing screw', value: '22-25 ft-lbs (29.8-33.9 N·m)', note: 'Tighten in sequence shown.' },
    { fastener: 'Transmission top cover screw', value: '132-156 in-lbs (14.9-17.6 N·m)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Cover mainshaft clutch hub splines with tape to prevent damaging main drive gear bearings and oil seal.' },
    { n: 2, text: 'Install a new gasket on transmission assembly ring dowels.' },
    { n: 3, text: 'Verify transmission filler plug/dipstick is removed.' },
    { n: 4, text: 'Apply clean transmission lubricant to main drive gear bearings.' },
    { n: 5, text: 'Install transmission assembly in transmission case.' },
    { n: 6, text: 'Install transmission bearing housing.' },
    { n: 7, text: 'Install screws.' },
    { n: 8, text: 'Tighten in sequence. Torque: 22-25 ft-lbs (29.8-33.9 N·m) Transmission bearing housing screw.' },
    { n: 9, text: 'Install top cover.' },
    { n: 10, text: 'Set shifter cam pawl on shift cam.' },
    { n: 11, text: 'Inspect transmission top cover gasket. Replace as necessary.' },
    { n: 12, text: 'Install transmission top cover and screws. Tighten. Torque: 132-156 in-lbs (14.9-17.6 N·m) Transmission top cover screw.' },
    { n: 13, text: 'Install vent hose to top cover fitting, if removed.' },
    { n: 14, text: 'Install transmission mainshaft bearing inner race. See Mainshaft Bearing Inner Race (Page 5-26).' },
    { n: 15, text: 'Install clutch release push rod. See CLUTCH RELEASE BEARING AND PUSH ROD: HYDRAULIC CLUTCH (Page 5-11).' },
    { n: 16, text: 'Install transmission side covers. See TRANSMISSION SIDE COVERS: HYDRAULIC CLUTCH (Page 5-9).' },
    { n: 17, text: 'Fill transmission oil. See REPLACE TRANSMISSION LUBRICANT (Page 2-13).' },
    { n: 18, text: 'Fill engine oil. See REPLACE ENGINE OIL AND FILTER (Page 2-9).' },
    { n: 19, text: 'Install exhaust system. See EXHAUST SYSTEM (Page 6-34).' },
    { n: 20, text: 'Install primary chaincase housing. See PRIMARY CHAINCASE HOUSING (Page 5-24).' },
    { n: 21, text: 'Install the primary chain, clutch, compensating sprocket and chain tensioner. See DRIVE COMPONENTS (Page 5-15).' },
    { n: 22, text: 'Install starter. See STARTER (Page 8-11).' },
    { n: 23, text: 'Install primary chaincase cover. See PRIMARY CHAINCASE COVER (Page 5-13).' },
    { n: 24, text: 'Fill primary chaincase oil. See REPLACE PRIMARY CHAINCASE LUBRICANT (Page 2-11).' },
    { n: 25, text: 'Install heel shift lever. See SHIFTER LINKAGE (Page 5-7).' },
    { n: 26, text: 'Install rider left footboard and bracket, if removed. See RIDER FOOTRESTS (Page 3-142).' },
    { n: 27, text: 'Adjust drive belt deflection. See INSPECT AND ADJUST DRIVE BELT AND SPROCKETS (Page 2-36).' },
    { n: 28, text: 'Verify rear fork pivot shaft torque. See REAR FORK (Page 3-71).' },
    { n: 29, text: 'Connect negative battery cable. See POWER DISCONNECT (Page 8-8).' }
  ]
}
,
  // 6.3 AIR CLEANER BACKPLATE ASSEMBLY
  {
    id: 't20-air-cleaner-backplate-remove',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Air Cleaner Backplate Assembly — Remove',
    summary:
      'Remove air cleaner backplate with breather bolts and tube assembly. Discard seal ring. Includes preparation to remove air cleaner cover and filter.',
    difficulty: 'Easy',
    timeMinutes: 15,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove air cleaner cover and filter. See INSPECT AIR FILTER (Page 2-45).'
      },
      {
        n: 2,
        text: 'See Figure 6-1. Remove breather tube (1) from fittings on breather bolts (2).'
      },
      {
        n: 3,
        text: 'Remove two breather bolts (2).'
      },
      {
        n: 4,
        text: 'Remove backplate (3).'
      },
      {
        n: 5,
        text: 'Remove seal ring (4) from backplate. Discard seal ring (4).'
      }
    ]
  },

  {
    id: 't20-air-cleaner-backplate-install',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Air Cleaner Backplate Assembly — Install',
    summary:
      'Install air cleaner backplate with new seal ring, apply LOCTITE 565 to breather bolts, and connect breather tubes. Emit ions note: breather tubes must be properly connected for emissions compliance.',
    difficulty: 'Easy',
    timeMinutes: 15,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [
      { number: '99818-97', description: 'LOCTITE 565 THREAD SEALANT', qty: 1 }
    ],
    torque: [
      {
        fastener: 'Breather bolts',
        value: '22.0-24.0 ft-lbs (29.8-32.5 N·m)',
        note: ''
      }
    ],
    steps: [
      {
        n: 1,
        text: 'See Figure 6-1. Install new seal ring (4) on backplate (3).'
      },
      {
        n: 2,
        text: 'Apply sealant to threads of breather bolts (2). Consumable: LOCTITE 565 THREAD SEALANT (99818-97)',
        warning:
          'Failure to connect the breather tubes allows crankcase vapors to be vented into the atmosphere in violation of legal emissions standards.'
      },
      {
        n: 3,
        text: 'Install backplate with breather bolts. Tighten. Torque: 22.0-24.0 ft-lbs (29.8-32.5 N·m) Breather bolts'
      },
      {
        n: 4,
        text: 'Install breather tubes (1) onto breather bolts.'
      },
      {
        n: 5,
        text: 'Install air cleaner cover and filter. See INSPECT AIR FILTER (Page 2-45).'
      }
    ]
  },

  // 6.4 CONSOLE (Note: scope specifies Air Cleaner filter/cover - 6.4 is CONSOLE, skipping non-fuel items)

  // 6.5 FUEL PRESSURE TEST (verify and test procedure)
  {
    id: 't20-fuel-pressure-test',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Pressure Test',
    summary:
      'Test fuel system pressure using FUEL PRESSURE GAUGE (HD-41182) and adapter. Compare readings to specifications: 55-62 psi (380-425 kPa). Includes purge procedure and safety precautions.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [
      'FUEL PRESSURE GAUGE — HD-41182',
      'FUEL PRESSURE GAUGE ADAPTER — HD-44061 (x2 recommended)'
    ],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Purge and disconnect fuel line. See FUEL TANK (Page 6-9).',
        warning:
          'To prevent spray of fuel, purge system of high-pressure fuel before supply line is disconnected. Gasoline is extremely flammable and highly explosive, which could result in death or serious injury.'
      },
      {
        n: 2,
        text: 'See Figure 6-3. Attach to fuel tank fitting (3) and fuel supply line (1). Special Tool: FUEL PRESSURE GAUGE (HD-41182). Special Tool: FUEL PRESSURE GAUGE ADAPTER (HD-44061).',
        note:
          'Use two fuel pressure gauge adapters to prevent twisting of the fuel supply line. Verify that all connections are secure.'
      },
      {
        n: 3,
        text: 'Close fuel valve (5).'
      },
      {
        n: 4,
        text: 'Insert clear tube of fuel pressure gauge into a suitable container.'
      },
      {
        n: 5,
        text: 'Start engine.'
      },
      {
        n: 6,
        text: 'Open fuel valve.'
      },
      {
        n: 7,
        text: 'Open clear tube bleeder valve.'
      },
      {
        n: 8,
        text: 'Check pressure. Operate engine at various speeds. Note pressure gauge readings. Compare readings to specifications. Refer to Table 6-2: Fuel pressure 55-62 psi (380-425 kPa).'
      },
      {
        n: 9,
        text: 'Turn off engine.'
      },
      {
        n: 10,
        text: 'Open clear tube bleeder to remove pressure.'
      },
      {
        n: 11,
        text: 'Remove fuel pressure tester.'
      },
      {
        n: 12,
        text: 'Connect fuel supply line. See FUEL TANK (Page 6-9).'
      }
    ]
  },

  // 6.6 PURGE FUEL LINE
  {
    id: 't20-fuel-line-purge',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Purge Fuel Line',
    summary:
      'Purge high-pressure fuel from fuel supply line before disconnection. Disable fuel pump via DIGITAL TECHNICIAN II (HD-48650) or by disconnecting connector. Run engine until stall, operate starter 3 seconds additional.',
    difficulty: 'Moderate',
    timeMinutes: 20,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: ['DIGITAL TECHNICIAN II — HD-48650 (preferred)'],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove seat. See SEAT (Page 3-148).',
        warning:
          'To prevent spray of fuel, purge system of high-pressure fuel before supply line is disconnected. Gasoline is extremely flammable and highly explosive, which could result in death or serious injury.'
      },
      {
        n: 2,
        text: 'Disconnect fuel pump. Models with fairing: See Figure 6-4. Disconnect fuel pump connector [13] (gray) (4). Models without fairing: Disconnect fuel pump connector (black) located under the console. See CONSOLE (Page 6-4).',
        note:
          'The preferred method to disable the fuel pump is to use a special tool. The fuel pump can optionally be disconnected instead. DIGITAL TECHNICIAN II (PART NUMBER: HD-48650). The gasoline in the fuel supply line is under high pressure: 58 psi (400 kPa). To avoid an uncontrolled discharge or spray of gasoline, always purge the line before disconnecting.'
      },
      {
        n: 3,
        text: 'Remove fuel from fuel supply line. Run engine until it stalls. Operate starter an additional 3 seconds.'
      },
      {
        n: 4,
        text: 'Remove main fuse.'
      },
      {
        n: 5,
        text: 'Connect fuel pump connector (gray).'
      },
      {
        n: 6,
        text: 'See Figure 6-6. Remove fuel supply line. Pull up on chrome sleeve of quick-connect fitting (1). Pull down on fuel supply line (2) fitting to disconnect.'
      }
    ]
  },

  // 6.7 FUEL LINE
  {
    id: 't20-fuel-line-remove',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Line — Remove',
    summary:
      'Remove fuel line from induction module and fuel tank. Includes preparation: purge fuel line, disconnect fuel pump, remove seat, saddlebag, side cover, and main fuse.',
    difficulty: 'Moderate',
    timeMinutes: 25,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Purge fuel line. See PURGE FUEL LINE (Page 6-6).',
        warning:
          'To prevent spray of fuel, purge system of high-pressure fuel before supply line is disconnected. Gasoline is extremely flammable and highly explosive, which could result in death or serious injury.'
      },
      {
        n: 2,
        text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 3,
        text: 'Remove left saddlebag. See SADDLEBAGS (Page 3-161).'
      },
      {
        n: 4,
        text: 'Remove left side cover. See LEFT SIDE COVER (Page 3-58).'
      },
      {
        n: 5,
        text: 'Remove seat. See SEAT (Page 3-148).'
      },
      {
        n: 6,
        text: 'Models with fairing: See Figure 6-4. Disconnect fuel pump connector (gray) (4). Models without fairing: Disconnect fuel pump connector (black) (5). See TOP CADDY (Page 8-110).'
      },
      {
        n: 7,
        text: 'See Figure 6-5. Remove fuel line from induction module. Push fuel line toward fuel rail. Pull and hold retainer sleeve (2). Remove fuel line.'
      },
      {
        n: 8,
        text: 'See Figure 6-6. Remove fuel line from fuel tank. Pull up on quick-connect fitting (1). Pull down on fuel line.'
      }
    ]
  },

  {
    id: 't20-fuel-line-install',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Line — Install',
    summary:
      'Install fuel line to induction module and fuel tank with proper quick-connect engagement and verification. Includes reconnecting fuel pump and completing connections to saddlebag, side cover, and main fuse.',
    difficulty: 'Moderate',
    timeMinutes: 25,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'See Figure 6-5. Install fuel line to induction module. Push fuel line firmly onto fuel rail inlet fitting (1) until audible click. Tug hose to verify secure attachment.',
        warning:
          'To prevent spray of fuel, be sure quick-connect fittings are properly mated. Gasoline is extremely flammable and highly explosive, which could result in death or serious injury.'
      },
      {
        n: 2,
        text: 'See Figure 6-6. Install fuel line to fuel tank. Connect fuel line (2) to quick disconnect fitting. While pushing up on bottom of fitting, pull down on quick connect fitting (1). Tug on fuel line to verify fuel line is locked in position.'
      },
      {
        n: 3,
        text: 'Models with fairing: See Figure 6-4. Connect fuel pump connector (gray) (4). Models without fairing: Connect fuel pump connector (black) (5). See TOP CADDY (Page 8-110).'
      },
      {
        n: 4,
        text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 5,
        text: 'Install seat. See SEAT (Page 3-148).'
      },
      {
        n: 6,
        text: 'Install left side cover. See LEFT SIDE COVER (Page 3-58).'
      },
      {
        n: 7,
        text: 'Install left saddlebag. See SADDLEBAGS (Page 3-161).'
      },
      {
        n: 8,
        text: 'Set OFF/RUN switch to RUN and check for leaks.'
      }
    ]
  },

  // 6.8 FUEL TANK
  {
    id: 't20-fuel-tank-remove-detail',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Tank — Remove',
    summary:
      'Remove fuel tank from motorcycle frame. Includes purge fuel line, disconnect fuel lines, remove console, seat, and disconnect fuel level sender/pump connectors and vent tube. Includes warnings about gasoline spillage.',
    difficulty: 'Moderate',
    timeMinutes: 40,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Purge fuel line. See PURGE FUEL LINE (Page 6-6).',
        warning:
          'To prevent spray of fuel, purge system of high-pressure fuel before supply line is disconnected. Gasoline is extremely flammable and highly explosive, which could result in death or serious injury.'
      },
      {
        n: 2,
        text: 'Remove left side saddlebag. See SADDLEBAGS (Page 3-161).'
      },
      {
        n: 3,
        text: 'Remove left side cover. See LEFT SIDE COVER (Page 3-58).'
      },
      {
        n: 4,
        text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 5,
        text: 'Disconnect fuel line from tank. See FUEL LINE (Page 6-7).'
      },
      {
        n: 6,
        text: 'Remove seat. See SEAT (Page 3-148).'
      },
      {
        n: 7,
        text: 'Remove console. See CONSOLE (Page 6-4).'
      },
      {
        n: 8,
        text: 'Remove fuel vapor vent tube from fitting on top plate.'
      },
      {
        n: 9,
        text: 'Remove fuel level sender/fuel pump connector from top plate.'
      },
      {
        n: 10,
        text: 'Remove rubber caps from front fuel tank screws.',
        warning:
          'Gasoline can drain from the fuel line when disconnected from fuel tank. Gasoline is extremely flammable and highly explosive, which could result in death or serious injury. Wipe up spilled fuel immediately and dispose of rags in a suitable manner.'
      },
      {
        n: 11,
        text: 'Remove screws.'
      },
      {
        n: 12,
        text: 'Remove two screws to release rear tank bracket from frame backbone.'
      },
      {
        n: 13,
        text: 'Remove fuel tank.'
      }
    ]
  },

  {
    id: 't20-fuel-tank-install',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Tank — Install',
    summary:
      'Install fuel tank onto frame and secure with front and rear bracket screws. Torque specs: 15-20 ft-lbs. Install caps, fuel level sender, and vent tube. Complete by installing console, seat, fuel line, main fuse, and side cover.',
    difficulty: 'Moderate',
    timeMinutes: 40,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [
      {
        fastener: 'Fuel tank front screws',
        value: '15-20 ft-lbs (20.3-27.1 N·m)',
        note: ''
      },
      {
        fastener: 'Fuel tank rear bracket screws',
        value: '15-20 ft-lbs (20.3-27.1 N·m)',
        note: ''
      }
    ],
    steps: [
      {
        n: 1,
        text: 'Place fuel tank onto frame backbone and start front fuel tank screws.'
      },
      {
        n: 2,
        text: 'Install rear fuel tank bracket to frame with two screws. Tighten. Torque: 15-20 ft-lbs (20.3-27.1 N·m) Fuel tank rear bracket screws. If removed, install plastic trim cover over bracket.'
      },
      {
        n: 3,
        text: 'Tighten front fuel tank screws. Torque: 15-20 ft-lbs (20.3-27.1 N·m) Fuel tank front screws'
      },
      {
        n: 4,
        text: 'Install rubber caps over screws. Left and right caps are not interchangeable.'
      },
      {
        n: 5,
        text: 'Install fuel level sender/fuel pump connector from top plate.'
      },
      {
        n: 6,
        text: 'Install fuel vapor vent tube to vapor valve fitting on top plate.'
      },
      {
        n: 7,
        text: 'Install console. See CONSOLE (Page 6-4).'
      },
      {
        n: 8,
        text: 'Install seat. See SEAT (Page 3-148).'
      },
      {
        n: 9,
        text: 'Install fuel line. See FUEL LINE (Page 6-7).'
      },
      {
        n: 10,
        text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 11,
        text: 'Install left side cover. See LEFT SIDE COVER (Page 3-58).'
      },
      {
        n: 12,
        text: 'Install left side saddlebag. See SADDLEBAGS (Page 3-161).'
      }
    ]
  },

  // 6.9 FUEL TANK TOP PLATE
  {
    id: 't20-fuel-tank-top-plate-remove',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Tank Top Plate — Remove',
    summary:
      'Remove fuel tank top plate with cam ring remover/installer (HD-48646). Disconnect fuel lines from filter shell, disconnect ground wire spade terminal, and disconnect bottom connector.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: ['CAM RING REMOVER/INSTALLER — HD-48646'],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove seat. See SEAT (Page 3-148).'
      },
      {
        n: 2,
        text: 'Remove console. See CONSOLE (Page 6-4).'
      },
      {
        n: 3,
        text: 'Relieve fuel system pressure. See PURGE FUEL LINE (Page 6-6).'
      },
      {
        n: 4,
        text: 'Remove left saddlebag. See SADDLEBAGS (Page 3-161).'
      },
      {
        n: 5,
        text: 'Remove left side cover. See LEFT SIDE COVER (Page 3-58).'
      },
      {
        n: 6,
        text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 7,
        text: 'Remove cam ring using remover/installer and raise top plate. Special Tool: CAM RING REMOVER/INSTALLER (HD-48646).',
        note:
          'See Figure 6-7. Always hold on to both the Cam Ring Remover/Installer and ratchet to prevent unexpected separation resulting in possible fuel tank damage.'
      },
      {
        n: 8,
        text: 'Remove connector at bottom of top plate using a small screwdriver.'
      },
      {
        n: 9,
        text: 'See Figure 6-8. Disconnect ground wire spade terminal from slot of top plate.'
      },
      {
        n: 10,
        text: 'See Figure 6-9. Press tabs on fuel line retainers (3) to remove lines from fittings on fuel filter shell.'
      },
      {
        n: 11,
        text: 'If top plate replacement is necessary, remove fuel filter shell. See Disassemble in this section.'
      }
    ]
  },

  {
    id: 't20-fuel-tank-top-plate-install',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Tank Top Plate — Install',
    summary:
      'Install fuel tank top plate with fuel filter shell assembly, seal rings, fuel line retainers, ground wire, and cam ring. Use CAM RING REMOVER/INSTALLER (HD-48646) for installation.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: ['CAM RING REMOVER/INSTALLER — HD-48646'],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'If installing a new top plate, first install fuel filter shell. See Assemble in this section.'
      },
      {
        n: 2,
        text: 'Inspect seal ring at bottom of top plate for damage. If necessary, install new seal ring with nubs contacting ring groove walls.'
      },
      {
        n: 3,
        text: 'See Figure 6-9. Verify retainers (3) are secure on fuel filter fittings, and not damaged. Note that retainers are of different sizes.'
      },
      {
        n: 4,
        text: 'See Figure 6-9. Aligning latches and push tubes onto fittings of fuel filter shell until an audible click is heard. Pull on tubes to verify they are attached securely.'
      },
      {
        n: 5,
        text: 'Install connector at bottom of top plate.'
      },
      {
        n: 6,
        text: 'Route ground wire (from top plate connector) along inboard side of vapor valve and install spade terminal into slot in top plate.'
      },
      {
        n: 7,
        text: 'Install fuel tank top plate engaging index tab in slot at front of fuel tank collar.'
      },
      {
        n: 8,
        text: 'See Figure 6-10. Install cam ring over fuel tank top plate with the TOP stamp up.'
      },
      {
        n: 9,
        text: 'Engage remover/installer in top plate. Push down and rotate tool clockwise until all tabs begin to engage slots in fuel tank collar. Special Tool: CAM RING REMOVER/INSTALLER (HD-48646).',
        note:
          'See Figure 6-7. Always hold on to both the Cam Ring Remover/Installer and ratchet to prevent unexpected separation resulting in possible fuel tank damage.'
      },
      {
        n: 10,
        text: 'Install ratchet and rotate until cam ring is fully installed.'
      },
      {
        n: 11,
        text: 'Install console. See CONSOLE (Page 6-4).'
      },
      {
        n: 12,
        text: 'Install seat. See SEAT (Page 3-148).'
      },
      {
        n: 13,
        text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 14,
        text: 'Install left side cover. See LEFT SIDE COVER (Page 3-58).'
      },
      {
        n: 15,
        text: 'Install left saddlebag. See SADDLEBAGS (Page 3-161).'
      }
    ]
  },

  // 6.10 FUEL LEVEL SENDER
  {
    id: 't20-fuel-level-sender-remove',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Level Sender — Remove',
    summary:
      'Remove fuel level sender from left side of fuel tank. Disconnect 2-place connector, pull up on front finger bracket, and slide rearward to release from catches at top of tunnel.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove seat. See SEAT (Page 3-148).'
      },
      {
        n: 2,
        text: 'Remove console. See CONSOLE (Page 6-4).'
      },
      {
        n: 3,
        text: 'Relieve fuel system pressure. See PURGE FUEL LINE (Page 6-6).'
      },
      {
        n: 4,
        text: 'Remove left saddlebag. See SADDLEBAGS (Page 3-161).'
      },
      {
        n: 5,
        text: 'Remove left side cover. See LEFT SIDE COVER (Page 3-58).'
      },
      {
        n: 6,
        text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 7,
        text: 'Remove top plate. See FUEL TANK TOP PLATE (Page 6-10).'
      },
      {
        n: 8,
        text: 'Disconnect 2-place connector to release fuel level sender from wire harness.',
        warning:
          'Gasoline is extremely flammable and highly explosive. Keep gasoline away from ignition sources which could result in death or serious injury. See the Safety chapter.'
      },
      {
        n: 9,
        text: 'See Figure 6-14. Look into fuel tank at bracketry. Note that finger (1) on front bracket points forward, while finger on rear bracket points rearward.',
        note: ''
      },
      {
        n: 10,
        text: 'Pull up on front finger (1) and slide fuel level sender bracket rearward until four ears on bracket are free of catches at top of tunnel.'
      },
      {
        n: 11,
        text: 'Remove fuel level sender from left side of fuel tank. See Figure 6-15.'
      }
    ]
  },

  {
    id: 't20-fuel-level-sender-install',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Level Sender — Install',
    summary:
      'Install fuel level sender into left side of fuel tank with finger pointing forward. Engage four ears into front set of catches at top of tunnel. Connect fuel level sender connector to wire harness.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'See Figure 6-14. With the finger on the fuel level sender bracket (1) pointing forward, install fuel level sender into left side of fuel tank.'
      },
      {
        n: 2,
        text: 'Engage four ears on fuel level sender bracket with front set of catches at top of tunnel. Push fuel level sender bracket forward until ears are fully engaged.'
      },
      {
        n: 3,
        text: 'Connect fuel level sender connector (2) to wire harness.',
        note:
          'The low fuel lamp will not turn off until there is sufficient fuel in the tank, the ignition switch has been turned off and back on, and the vehicle has begun forward movement.'
      },
      {
        n: 4,
        text: 'Install top plate. See FUEL TANK TOP PLATE (Page 6-10).'
      },
      {
        n: 5,
        text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 6,
        text: 'Install left side cover. See LEFT SIDE COVER (Page 3-58).'
      },
      {
        n: 7,
        text: 'Install left saddlebag. See SADDLEBAGS (Page 3-161).'
      },
      {
        n: 8,
        text: 'Install console. See CONSOLE (Page 6-4).'
      },
      {
        n: 9,
        text: 'Install seat. See SEAT (Page 3-148).'
      }
    ]
  },

  // 6.11 FUEL PUMP
  {
    id: 't20-fuel-pump-remove',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Pump — Remove',
    summary:
      'Remove fuel pump assembly from fuel tank. Disconnect transfer tube from bracket, disconnect fuel pump and level sender wire harness, rotate pump 90 degrees, and slide pump bracket forward to release from catches.',
    difficulty: 'Moderate',
    timeMinutes: 35,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove top plate. See FUEL TANK TOP PLATE (Page 6-10).',
        warning:
          'Gasoline is extremely flammable and highly explosive. Keep gasoline away from ignition sources which could result in death or serious injury. See the Safety chapter. Do not use solvents or other products that contain chlorine on plastic fuel system components. Chlorine can degrade plastic fuel system components, which can cause a loss of fuel system pressure or engine stalling and could result in death or serious injury.'
      },
      {
        n: 2,
        text: 'Remove fuel level sender. See FUEL LEVEL GAUGE (Page 8-35).',
        note:
          'Carefully inspect tubes for damage. Even a small hole can cause a reduction in fuel pressure. Replace fuel pump as necessary. See the electrical diagnostic manual for information on the function and testing of fuel pump.'
      },
      {
        n: 3,
        text: 'See Figure 6-16. Press collar on each side of fitting to disconnect transfer tube (2) from bracket.'
      },
      {
        n: 4,
        text: 'Pull up on rear finger (1) and slide pump bracket (2) forward until four ears are clear of catches at top of tunnel.'
      },
      {
        n: 5,
        text: 'See Figure 6-17. Remove fuel pump from left side of fuel tank. Rotate pump 90 degrees clockwise until transfer tube connection is pointing rearward. Remove from fuel tank.'
      },
      {
        n: 6,
        text: 'Remove fuel pump and fuel level sender wire harness. See Figure 6-18. Cut cable strap to release wire harness and both fuel pump and transfer tubes from arm of fuel pump bracket (2). Release wire harness from molded clip at front of fuel pump bracket. See Figure 6-17. Remove connector at top of fuel bracket.'
      }
    ]
  },

  {
    id: 't20-fuel-pump-install',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Pump — Install',
    summary:
      'Install fuel pump assembly into fuel tank with transfer tube pointing rearward. Secure wiring with cable strap, verify inlet strainer lies flat, engage bracket ears with rear catches at top of tunnel, and install transfer tube.',
    difficulty: 'Moderate',
    timeMinutes: 35,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Capture wires in cable strap. See Figure 6-17. Attach connector at top of fuel pump. See Figure 6-18. Route wire harness rearward and then forward under arm of fuel pump bracket. Install new cable strap at elbow capturing fuel pump and transfer tubes at top of arm and wire harness at bottom. See Figure 6-19. Route wire harness through molded clip at front of fuel pump bracket.'
      },
      {
        n: 2,
        text: 'Install fuel pump. Hold pump assembly with transfer tube (2) connection pointing rearward and insert into tank. Rotate assembly 90 degrees clockwise.'
      },
      {
        n: 3,
        text: 'Look inside fuel tank to verify that fuel inlet strainer lies flat and ends are not folded under pump. See Figure 6-19. Verify that wire harness is still captured in molded clip at front of fuel pump bracket.'
      },
      {
        n: 4,
        text: 'See Figure 6-16. Secure fuel pump bracket. With finger of pump bracket (2) pointing rearward, engage four ears on bracket with rear catches at top of tunnel. Push pump bracket (2) rearward until ears are fully engaged.'
      },
      {
        n: 5,
        text: 'Install transfer tube onto bracket. Fit two tabs at bottom of tube bracket into slots at top of pump bracket. See Figure 6-19. Verify transfer tube is captured in weld clip on right side of tunnel. Verify that free end of tube is in contact with tank bottom.'
      },
      {
        n: 6,
        text: 'Install fuel level sender. See FUEL LEVEL GAUGE (Page 8-35).'
      },
      {
        n: 7,
        text: 'Install top plate. See FUEL TANK TOP PLATE (Page 6-10).'
      }
    ]
  },

  // 6.12 VENT TUBE
  {
    id: 't20-vent-tube-remove',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Vent Tube — Remove',
    summary:
      'Remove fuel vapor vent tube from fuel tank top plate fitting. Discard cable straps securing tube to rear frame downtube. Includes inspection for wear or damage.',
    difficulty: 'Easy',
    timeMinutes: 15,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove seat. See SEAT (Page 3-148).'
      },
      {
        n: 2,
        text: 'Remove console. See CONSOLE (Page 6-4).'
      },
      {
        n: 3,
        text: 'See Figure 6-20. Remove vapor tube from fitting (1) on fuel tank top plate.'
      },
      {
        n: 4,
        text: 'Discard two cable straps (4) securing tube to rear frame downtube.'
      },
      {
        n: 5,
        text: 'Remove tube.'
      },
      {
        n: 6,
        text: 'Inspect parts for wear or damage. Replace if required.'
      }
    ]
  },

  {
    id: 't20-vent-tube-install',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Vent Tube — Install',
    summary:
      'Install fuel vapor vent tube along inner side of rear left downtube with new cable straps. Connect to fitting on fuel tank top plate.',
    difficulty: 'Easy',
    timeMinutes: 15,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'See Figure 6-20. Route tube down along inner side of rear left downtube. Install two new cable straps (4) to secure to frame.'
      },
      {
        n: 2,
        text: 'Route line along center of fuel tank and connect to fitting (1) on fuel tank top plate.'
      },
      {
        n: 3,
        text: 'Install console. See CONSOLE (Page 6-4).'
      },
      {
        n: 4,
        text: 'Install seat. See SEAT (Page 3-148).'
      }
    ]
  },

  // 6.13 VAPOR VALVE (EVAP)
  {
    id: 't20-vapor-valve-inspection',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Vapor Valve (EVAP) — Reference',
    summary:
      'The vapor valve is not serviceable. Damage or failure of the vapor valve requires replacement of the fuel tank top plate. See FUEL TANK TOP PLATE (Page 6-10).',
    difficulty: 'Easy',
    timeMinutes: 5,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'See Figure 6-21. The vapor valve is not serviceable. Damage or failure of the vapor valve requires replacement of the fuel tank top plate. See FUEL TANK TOP PLATE (Page 6-10).',
        note: '(verify in printed manual)'
      }
    ]
  },

  // 6.14 TMAP SENSOR
  {
    id: 't20-tmap-sensor-remove',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Temperature Manifold Absolute Pressure (TMAP) Sensor — Remove',
    summary:
      'Remove TMAP sensor from fuel tank area. Disconnect sensor connector and remove screw securing sensor to mounting location.',
    difficulty: 'Easy',
    timeMinutes: 20,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).',
        warning:
          'Gasoline is extremely flammable and highly explosive. Keep gasoline away from ignition sources which could result in death or serious injury. See the Safety chapter. To prevent spray of fuel, purge system of high-pressure fuel before supply line is disconnected. Gasoline is extremely flammable and highly explosive, which could result in death or serious injury.'
      },
      {
        n: 2,
        text: 'Remove seat. See SEAT (Page 3-148).'
      },
      {
        n: 3,
        text: 'Remove fuel tank. See FUEL TANK (Page 6-9).'
      },
      {
        n: 4,
        text: 'Disconnect sensor connector.'
      },
      {
        n: 5,
        text: 'See Figure 6-22. Remove TMAP sensor. Remove screw (2). Remove sensor (1).'
      }
    ]
  },

  {
    id: 't20-tmap-sensor-install',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Temperature Manifold Absolute Pressure (TMAP) Sensor — Install',
    summary:
      'Install TMAP sensor with screw torqued to 22-40 in-lbs. Connect sensor connector and complete installation.',
    difficulty: 'Easy',
    timeMinutes: 20,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [
      {
        fastener: 'Temperature manifold absolute pressure (TMAP) screw',
        value: '22-40 in-lbs (2.5-4.5 N·m)',
        note: ''
      }
    ],
    steps: [
      {
        n: 1,
        text: 'See Figure 6-22. Install TMAP sensor. Install sensor. Install screw (2). Tighten. Torque: 22-40 in-lbs (2.5-4.5 N·m) Temperature manifold absolute pressure (TMAP) screw'
      },
      {
        n: 2,
        text: 'Connect sensor connector.'
      },
      {
        n: 3,
        text: 'Install fuel tank. See FUEL TANK (Page 6-9).'
      },
      {
        n: 4,
        text: 'Install seat. See SEAT (Page 3-148).'
      },
      {
        n: 5,
        text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).'
      }
    ]
  },

  // 6.15 TWIST GRIP SENSOR (TGS)
  {
    id: 't20-twist-grip-sensor-remove',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Twist Grip Sensor (TGS) — Remove',
    summary:
      'Remove twist grip sensor from handlebar. Remove main fuse, right switch housing, disconnect TGS connector, and pull TGS and harness out of handlebar using chaser wire.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 2,
        text: 'Remove right switch housing and front brake control from the handlebar. See RIGHT HAND CONTROL MODULE (RHCM) (Page 8-25).'
      },
      {
        n: 3,
        text: 'Models with heated hand grips: Pull out hand grip connector. Pry end cap from hand grip. Pull connector out through hand grip end. Do not disconnect heated hand grip power or interconnect connectors. See HAND GRIPS (Page 3-123).'
      },
      {
        n: 4,
        text: 'Remove right hand grip.'
      },
      {
        n: 5,
        text: 'Road King models: See Figure 6-23. Remove harness retainers from right side of handlebar. Remove headlamp and handlebar clamp shroud. See HEADLAMP NACELLE (Page 3-86). Disconnect TGS connector (2). Cut cable strap securing harness to right riser. Remove cable strap gathering TGS harness.'
      },
      {
        n: 6,
        text: 'Fork-mounted fairing models: Remove outer fairing. See Figure 6-24. Disconnect TGS connector. Rotate inner fairing. See FAIRING: FORK MOUNTED (Page 3-88). Cut cable straps securing TGS harness.'
      },
      {
        n: 7,
        text: 'Frame-mounted fairing models: Remove instrument bezel. See FAIRING: FRAME MOUNTED (Page 3-100). See Figure 6-25. Disconnect TGS connector (1). Remove cable strap gathering TGS harness.'
      },
      {
        n: 8,
        text: 'Models with heated hand grips: Disconnect heated hand grip jumper harness connector.'
      },
      {
        n: 9,
        text: 'Remove TGS. Attach a chaser wire to TGS connector. Pull TGS and harness out of handlebar.'
      }
    ]
  },

  {
    id: 't20-twist-grip-sensor-install',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Twist Grip Sensor (TGS) — Install',
    summary:
      'Install twist grip sensor into handlebar with seal cap and align index tabs. Connect TGS connector based on fairing type. Route harness with new cable straps. Reset idle speed after installation.',
    difficulty: 'Moderate',
    timeMinutes: 35,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Install seal cap at end of TGS. If seal cap is not present, remove from inside throttle grip. Check condition of O-ring on seal cap. (available only as part of seal cap assembly). See Figure 6-26. Install seal cap into slots.',
        note:
          'See Figure 6-26. The seal cap serves two functions; cap protects TGS terminals from dirt and moisture and is a retention device for throttle grip.'
      },
      {
        n: 2,
        text: 'See Figure 6-27. Install TGS. Draw harness into handlebar while guiding TGS into end of handlebar. Align index tabs on TGS in handlebar. Verify that TGS is completely engaged into handlebar.'
      },
      {
        n: 3,
        text: 'Connect TGS connector.',
        note:
          'Always follow the procedure in FAIRING WIRE HARNESS (Page 8-119) when installing right switch housing ensuring twist grip operates correctly.'
      },
      {
        n: 4,
        text: 'Install hand grip. Install hand grip properly positioned. Rotate to verify internal splines are engaged with TGS.'
      },
      {
        n: 5,
        text: 'Road King Models: Install handlebar clamp shroud and headlamp. See HEADLAMP NACELLE (Page 3-86). Install cable clips on harnesses and into holes in handlebar. Attach TGS harness and brake line to right handlebar riser with a new cable strap. See Figure 6-23. Connect TGS. See Figure 6-28. Loop TGS harness onto itself. Install new cable strap (2).'
      },
      {
        n: 6,
        text: 'Fork-mounted fairing models: Rotate inner fairing. See FAIRING: FORK MOUNTED (Page 3-88). See Figure 6-24. Connect TGS. Install outer fairing. See Figure 6-28. Fold TGS harness (3) across handlebar. Secure with new cable straps (1).'
      },
      {
        n: 7,
        text: 'Frame-mounted fairing models: See Figure 6-25. Connect TGS connector (1). See Figure 6-29 Loop TGS harness onto itself. Install new cable strap (2). Install instrument bezel. See FAIRING: FRAME MOUNTED (Page 3-100).'
      },
      {
        n: 8,
        text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 9,
        text: 'Reset idle speed. Place engine in run/stop switch in RUN position. Turn ignition/light switch to IGNITION position and then back to OFF four times without starting engine. Allow a minimum of three seconds to elapse between ignition cycles. Start engine to verify installation.',
        note:
          'Whenever a new TGS or ECM is installed, idle speed must be reset. The ECM uses the first four ignition cycles to establish optimum idle speed. If the procedure is not performed, initial performance problems may result.'
      }
    ]
  },

  // 6.16 FUEL INJECTORS
  {
    id: 't20-fuel-injectors-remove',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Injectors — Remove',
    summary:
      'Remove fuel rail and fuel injectors from intake manifold. Disconnect fuel injector connectors and discard O-rings from fuel rail.',
    difficulty: 'Moderate',
    timeMinutes: 25,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove seat. See SEAT (Page 3-148).',
        warning:
          'Gasoline is extremely flammable and highly explosive. Keep gasoline away from ignition sources which could result in death or serious injury. See the Safety chapter. To prevent spray of fuel, purge system of high-pressure fuel before supply line is disconnected. Gasoline is extremely flammable and highly explosive, which could result in death or serious injury.'
      },
      {
        n: 2,
        text: 'Remove fuel tank. See FUEL TANK (Page 6-9).'
      },
      {
        n: 3,
        text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 4,
        text: 'Disconnect fuel injector connectors.'
      },
      {
        n: 5,
        text: 'See Figure 6-30. Remove fuel rail and fuel injectors. Remove screws (2). Remove fuel rail (3). Remove fuel injectors (1, 5).'
      },
      {
        n: 6,
        text: 'Discard all O-rings (4, 6) from fuel rail (3).'
      }
    ]
  },

  {
    id: 't20-fuel-injectors-install',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Fuel Injectors — Install',
    summary:
      'Install fuel injectors to intake manifold with new O-rings. Install fuel rail with screws torqued to 30-50 in-lbs. Connect fuel injector connectors (grey to front, black to rear).',
    difficulty: 'Moderate',
    timeMinutes: 25,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [
      {
        fastener: 'Fuel rail screw',
        value: '30-50 in-lbs (3.5-5.5 N·m)',
        note: ''
      }
    ],
    steps: [
      {
        n: 1,
        text: 'See Figure 6-30. Install fuel injectors to intake manifold. Install new O-rings (4, 6) into intake manifold. Install fuel injectors (1, 5) to intake manifold.'
      },
      {
        n: 2,
        text: 'Install fuel rail. Install rail (3). Install screws (2). Tighten. Torque: 30-50 in-lbs (3.5-5.5 N·m) Fuel rail screw'
      },
      {
        n: 3,
        text: 'Connect fuel injector connectors. Grey connector to front injector. Black connector to rear injector.'
      },
      {
        n: 4,
        text: 'Install fuel tank. See FUEL TANK (Page 6-9).'
      },
      {
        n: 5,
        text: 'Install seat. See SEAT (Page 3-148).'
      },
      {
        n: 6,
        text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).'
      }
    ]
  },

  // 6.17 INDUCTION MODULE
  {
    id: 't20-induction-module-remove',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Induction Module — Remove',
    summary:
      'Remove induction module from motorcycle. Disconnect TMAP and TCA connectors, disconnect fuel line, remove left and right side screws, and discard seals and flange adapters.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: ['INTAKE MANIFOLD SCREWDRIVER — HD-35801 (recommended)'],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove fuel tank. See FUEL TANK (Page 6-9).'
      },
      {
        n: 2,
        text: 'Remove air cleaner and backplate. See INSPECT AIR FILTER (Page 2-45).'
      },
      {
        n: 3,
        text: 'See Figure 6-31. California models: Pull purge line from fitting (13).',
        note:
          'See Figure 6-32. For best results, use intake manifold screwdriver. INTAKE MANIFOLD SCREWDRIVER (PART NUMBER: HD-35801)'
      },
      {
        n: 4,
        text: 'Disconnect connectors: TMAP sensor connector. Front fuel injector connector. Rear fuel injection connector. Disconnect TCA connector (11). Release harness from anchor point (12).'
      },
      {
        n: 5,
        text: 'Remove induction module: See Figure 6-31. Remove right side screws (3). Remove left side screws (4). Remove module from right side.'
      },
      {
        n: 6,
        text: 'Discard seals (1). Remove flange adapters (2, 9).'
      },
      {
        n: 7,
        text: 'Disconnect fuel line from induction module: Push fuel line toward fuel rail. Pull and hold retainer sleeve (7) in direction of arrow. Pull fuel line from fuel rail inlet fitting.'
      }
    ]
  },

  {
    id: 't20-induction-module-install',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Induction Module — Install',
    summary:
      'Install induction module with new seals and flange adapters. Connect fuel line and all electrical connectors. Torque flange adapter screws to 96-156 in-lbs.',
    difficulty: 'Moderate',
    timeMinutes: 35,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: ['INTAKE MANIFOLD SCREWDRIVER — HD-35801 (recommended)'],
    parts: [],
    torque: [
      {
        fastener: 'Induction module flange adapter screws',
        value: '96-156 in-lbs (10.9-17.6 N·m)',
        note: ''
      }
    ],
    steps: [
      {
        n: 1,
        text: 'See Figure 6-31 Connect fuel line to induction module. Push fuel line firmly onto fuel rail inlet fitting (6) until an audible click is heard. Pull on hose to verify that it is securely attached.',
        note:
          'See Figure 6-32. For best results use special tool. INTAKE MANIFOLD SCREWDRIVER (PART NUMBER: HD-35801)'
      },
      {
        n: 2,
        text: 'With counter-bore facing outward, install flange adapters (2, 9) onto induction module.'
      },
      {
        n: 3,
        text: 'Place new seal (1) in each flange adapter with beveled side against counter-bore.'
      },
      {
        n: 4,
        text: 'Install induction module. Slide induction module into position until slots engage left side screws (4). Start right side screws (3). Temporarily fasten mounting bracket to cylinder heads with breather bolts.'
      },
      {
        n: 5,
        text: 'Tighten right side screws (3) finger tight.'
      },
      {
        n: 6,
        text: 'Install left side screws (4). Tighten. Torque: 96-156 in-lbs (10.9-17.6 N·m) Induction module flange adapter screws.'
      },
      {
        n: 7,
        text: 'Tighten right side screws (3). Torque: 96-156 in-lbs (10.9-17.6 N·m) Induction module flange adapter screws.'
      },
      {
        n: 8,
        text: 'See Figure 6-31 Make connections. Rear fuel injector connector (5). Front fuel injector connector (8). TMAP sensor connector (10). TCA connector (11). Fasten TCA harness to anchor point (12) with new anchored cable strap. California Emissions Models: Connect purge tube to fitting (13).'
      },
      {
        n: 9,
        text: 'Install fuel tank. See FUEL TANK (Page 6-9).'
      },
      {
        n: 10,
        text: 'Install air cleaner assembly. See INSPECT AIR FILTER (Page 2-45).'
      }
    ]
  },

  // 6.18 INTAKE LEAK TEST
  {
    id: 't20-intake-leak-test',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Intake Leak Test',
    summary:
      'Test intake system for leaks using PROPANE ENRICHMENT KIT (HD-41417). Run engine to normal operating temperature, use propane tester to detect leaks by listening for engine tone changes.',
    difficulty: 'Easy',
    timeMinutes: 20,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: ['PROPANE ENRICHMENT KIT — HD-41417'],
    parts: [{ number: '', description: 'Small propane cylinder', qty: 1 }],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'See Figure 6-34. Make sure valve knob (6) is closed (fully clockwise).',
        warning:
          'Do not allow open flame or sparks near propane. Propane is extremely flammable, which could cause death or serious injury. Read and follow warnings and directions on propane bottle. Failure to follow warnings and directions can result in death or serious injury.'
      },
      {
        n: 2,
        text: 'Install valve assembly (5) onto propane bottle (1).'
      },
      {
        n: 3,
        text: 'See Figure 6-34. Press and hold trigger button (8). Slowly open valve knob (6) until pellet in flow gauge (7) rises 5-10 SCFH on gauge. Release trigger button.'
      },
      {
        n: 4,
        text: 'Run motorcycle until engine is at normal operating temperature.',
        note:
          'Propane injected into air cleaner causes false readings. Keep air cleaner cover installed.'
      },
      {
        n: 5,
        text: 'Aim nozzle toward possible sources of leak.',
        note: 'The tone of the engine changes when propane enters source of leak.'
      },
      {
        n: 6,
        text: 'Press and release trigger button to dispense propane.'
      },
      {
        n: 7,
        text: 'Repeat as necessary to detect leak.'
      },
      {
        n: 8,
        text: 'When test is finished, close valve.'
      }
    ]
  },

  // 6.19 HEATED OXYGEN SENSORS (HO2S)
  {
    id: 't20-heated-oxygen-sensors-remove',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Heated Oxygen Sensors (HO2S) — Remove',
    summary:
      'Remove front and rear heated oxygen sensors from exhaust system. Disconnect connectors, discard cable straps, and use OXYGEN SENSOR WRENCH (HD-50017) to remove sensors.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: ['OXYGEN SENSOR WRENCH — HD-50017'],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 2,
        text: 'Rear HO2 Sensor: See Figure 6-35. Discard cable straps (9, 10). Disconnect HO2S (Heated oxygen sensor) connector (2). Remove HO2S (3) using special tool. Special Tool: OXYGEN SENSOR WRENCH (HD-50017)'
      },
      {
        n: 3,
        text: 'Front HO2 Sensor: See Figure 6-35. Discard cable straps (7-9). Disconnect HO2S connector (1). Remove HO2S (6) using special tool. Special Tool: OXYGEN SENSOR WRENCH (HD-50017)'
      }
    ]
  },

  {
    id: 't20-heated-oxygen-sensors-install',
    bikeIds: ['touring-2020'],
    system: 'fuel',
    title: 'Heated Oxygen Sensors (HO2S) — Install',
    summary:
      'Install front and rear heated oxygen sensors with new gaskets and anti-seize lubricant. Torque to 12-14 ft-lbs. Route wire harnesses and secure with new cable straps.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: ['OXYGEN SENSOR WRENCH — HD-50017'],
    parts: [
      { number: '98960-97', description: 'ANTI-SEIZE LUBRICANT', qty: 2 }
    ],
    torque: [
      {
        fastener: 'Oxygen sensor, heated',
        value: '12-14 ft-lbs (16-19 N·m)',
        note: ''
      }
    ],
    steps: [
      {
        n: 1,
        text: 'Front HO2 Sensor: See Figure 6-35. Install HO2S (6) using special tool. Tighten. Torque: 12-14 ft-lbs (16-19 N·m) Oxygen sensor, heated. Special Tool: OXYGEN SENSOR WRENCH (HD-50017)',
        note:
          'Do not install sensors that have dropped or have been impacted by other components. Damage to the sensing element can occur. Replacement sensor assemblies have threads coated with ANTI-SEIZE LUBRICANT (98960-97) and new gaskets. If reusing HO2S, replace the gasket. Use a high-quality professional grade side cutter for gasket removal. Make sure larger side of new gasket faces exhaust. If reusing HO2S, apply a thin coat of ANTI-SEIZE LUBRICANT (98960-97) to each oxygen sensor.'
      },
      {
        n: 2,
        text: 'Route wire harness. Route harness along lower frame and above rear engine mount.'
      },
      {
        n: 3,
        text: 'Connect front HO2S connector (1).'
      },
      {
        n: 4,
        text: 'Secure harness. Install harness in clips (4) and multi-clamp (5). Install new cable straps (7-9).'
      },
      {
        n: 5,
        text: 'Rear HO2 Sensor: See Figure 6-35. Install HO2S (3) using special tool. Tighten. Torque: 12-14 ft-lbs (16-19 N·m) Oxygen sensor, heated. Special Tool: OXYGEN SENSOR WRENCH (HD-50017)'
      },
      {
        n: 6,
        text: 'Route wire harness. Route harness along top of transmission to neutral switch area.'
      },
      {
        n: 7,
        text: 'Connect rear HO2S connector (2).'
      },
      {
        n: 8,
        text: 'Secure harness. Install new cable straps (9, 10).'
      },
      {
        n: 9,
        text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).'
      }
    ]
  },

  // 6.20 MUFFLERS (Exhaust system)
  {
    id: 't20-mufflers-remove',
    bikeIds: ['touring-2020'],
    system: 'exhaust',
    title: 'Mufflers — Remove',
    summary:
      'Remove muffler assembly including clamp and rubber mount. Remove two screws and lock washers. Includes inspection of rubber mount.',
    difficulty: 'Easy',
    timeMinutes: 20,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove saddlebags. See SADDLEBAGS (Page 3-161).'
      },
      {
        n: 2,
        text: 'See Figure 6-36. Remove muffler. Remove two screws (1) and lock washers (2). Discard clamp (6). Remove muffler (5).'
      },
      {
        n: 3,
        text: 'Inspect rubber mount (3). Replace if required.'
      }
    ]
  },

  {
    id: 't20-mufflers-install',
    bikeIds: ['touring-2020'],
    system: 'exhaust',
    title: 'Mufflers — Install',
    summary:
      'Install muffler with new clamp, screws, and lock washers. Torque muffler to bracket 14-18 ft-lbs and muffler to clamp 38-43 ft-lbs.',
    difficulty: 'Easy',
    timeMinutes: 20,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [
      {
        fastener: 'Muffler to clamp',
        value: '38-43 ft-lbs (51.5-58.3 N·m)',
        note: ''
      },
      {
        fastener: 'Muffler to saddlebag support screws',
        value: '14-18 ft-lbs (19-24.4 N·m)',
        note: ''
      }
    ],
    steps: [
      {
        n: 1,
        text: 'Install muffler. Slide new muffler clamp (6) onto muffler (5). Install muffler to bracket (4) with screws (1) and lock washers (2). Tighten. 14-18 ft-lbs (19-24.4 N·m). Install clamp (6). Tighten. 38-43 ft-lbs (51.5-58.3 N·m)'
      },
      {
        n: 2,
        text: 'Install saddlebags. See SADDLEBAGS (Page 3-161).'
      }
    ]
  },

  // 6.21 EXHAUST SYSTEM
  {
    id: 't20-exhaust-system-remove',
    bikeIds: ['touring-2020'],
    system: 'exhaust',
    title: 'Exhaust System — Remove',
    summary:
      'Remove complete exhaust system including header pipes, crossover pipe, mufflers, and shields. Disconnect HO2S connectors. Requires removal of saddlebags, seat, and footboard/brackets.',
    difficulty: 'Moderate',
    timeMinutes: 60,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove saddlebags. See SADDLEBAGS (Page 3-161).'
      },
      {
        n: 2,
        text: 'Remove mufflers. See MUFFLERS (Page 6-33).'
      },
      {
        n: 3,
        text: 'Remove seat. See SEAT (Page 3-148).'
      },
      {
        n: 4,
        text: 'Remove right side rider footboard and brackets from frame. See RIDER FOOTRESTS (Page 3-142).'
      },
      {
        n: 5,
        text: 'Disconnect H02 sensor connectors. See HEATED OXYGEN SENSORS (HO2S) (Page 6-31).'
      },
      {
        n: 6,
        text: 'See Figure 6-37. Remove exhaust shields (8, 18, 21).'
      },
      {
        n: 7,
        text: 'Remove cross-over pipe. Discard clamp (4). Remove flange bolt (5). Remove cross-over pipe (7).',
        note:
          'Slide exhaust flange down header pipe to improve clearance around exhaust port.'
      },
      {
        n: 8,
        text: 'Remove exhaust header pipe. Remove flange locknut (20). Remove bracket (17). Remove flange nuts (15). Remove exhaust header pipe. Discard gaskets (13).'
      },
      {
        n: 9,
        text: 'Inspect retaining rings (14) and exhaust flanges (12). Replace if necessary.'
      }
    ]
  },

  {
    id: 't20-exhaust-system-install',
    bikeIds: ['touring-2020'],
    system: 'exhaust',
    title: 'Exhaust System — Install',
    summary:
      'Install complete exhaust system with header pipes, crossover pipe, mufflers, and shields. Torque all fasteners per specifications. Verify clearances and proper routing.',
    difficulty: 'Moderate',
    timeMinutes: 75,
    source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
    figures: [],
    tools: [],
    parts: [],
    torque: [
      {
        fastener: 'Exhaust bracket to transmission, screw',
        value: '100-120 in-lbs (11.3-13.6 N·m)',
        note: ''
      },
      {
        fastener: 'Exhaust cross-over bracket flange bolt',
        value: '14-18 ft-lbs (19-24.4 N·m)',
        note: ''
      },
      {
        fastener: 'Exhaust cross-over pipe clamp',
        value: '38-43 ft-lbs (51.5-58.3 N·m)',
        note: ''
      },
      {
        fastener: 'Exhaust flange nut, 1st torque',
        value: '9-18 in-lbs (1-2 N·m)',
        note: ''
      },
      {
        fastener: 'Exhaust flange nut, final torque',
        value: '100-120 in-lbs (11.3-13.6 N·m)',
        note: ''
      },
      {
        fastener: 'Exhaust header bracket flange locknut',
        value: '15-20 ft-lbs (20.3-27.1 N·m)',
        note: ''
      },
      {
        fastener: 'Exhaust shield clamps',
        value: '20-40 in-lbs (2.3-4.5 N·m)',
        note: ''
      }
    ],
    steps: [
      {
        n: 1,
        text: 'See Figure 6-37. If removed, install transmission exhaust bracket. Install transmission exhaust bracket (10). Tighten screws (9). Torque: 100-120 in-lbs (11.3-13.6 N·m) Exhaust bracket to transmission, screw.',
        note:
          'Roll exhaust header pipe into position from front cylinder to rear cylinder.'
      },
      {
        n: 2,
        text: 'Install exhaust header pipe. Install new gaskets (13) with tapered side out. Install exhaust header pipe. Install flange nuts (15) loosely. Install bracket (17). Install flange locknut (20). Do not tighten.'
      },
      {
        n: 3,
        text: 'Install cross-over pipe. Insert new clamp (4) onto cross-over pipe. Install cross-over pipe (7). Do not tighten clamp (4).'
      },
      {
        n: 4,
        text: 'Install cross-over support clamp. Install cross-over support clamp (6). Install flange bolt (5). Do not tighten.'
      },
      {
        n: 5,
        text: 'Install mufflers. See MUFFLERS (Page 6-33).'
      },
      {
        n: 6,
        text: 'Verify exhaust components have proper clearance to reduce noise and vibration.'
      },
      {
        n: 7,
        text: 'Tighten exhaust flange nuts (15). Tighten bottom nut to first torque. Torque: 9-18 in-lbs (1-2 N·m) Exhaust flange nut, 1st torque. Tighten top nut to final torque. Torque: 100-120 in-lbs (11.3-13.6 N·m) Exhaust flange nut, final torque. Tighten bottom nut to final torque. Torque: 100-120 in-lbs (11.3-13.6 N·m) Exhaust flange nut, final torque'
      },
      {
        n: 8,
        text: 'Tighten remaining exhaust system fasteners. Flange locknut (20). Tighten. Torque: 15-20 ft-lbs (20.3-27.1 N·m) Exhaust header bracket flange locknut. Cross-over pipe clamp (4). Tighten. Torque: 38-43 ft-lbs (51.5-58.3 N·m) Exhaust cross-over pipe clamp. Flange bolt (5). Tighten. Torque: 14-18 ft-lbs (19-24.4 N·m) Exhaust cross-over bracket flange bolt.',
        note:
          'Verify exhaust shields are clear of motorcycle frame or any mounted components. Install cross-over pipe exhaust shield with the longer straight portion toward the muffler. Position each clamp so screw is positioned on outboard side and is accessible.'
      },
      {
        n: 9,
        text: 'Install exhaust shields. Tighten. Torque: 20-40 in-lbs (2.3-4.5 N·m) Exhaust shield clamps'
      },
      {
        n: 10,
        text: 'Connect HO2 sensor connectors. See HEATED OXYGEN SENSORS (HO2S) (Page 6-31).'
      },
      {
        n: 11,
        text: 'Install right side rider foot board and brackets. See RIDER FOOTRESTS (Page 3-142).'
      },
      {
        n: 12,
        text: 'Install seat. See SEAT (Page 3-148).'
      },
      {
        n: 13,
        text: 'Install saddlebags. See SADDLEBAGS (Page 3-161).'
      }
    ]
  }
,
{"id":"t20-coolant-pressure-cap-test","bikeIds":["touring-2020"],"system":"cooling","title":"Coolant Pressure Cap — Test","summary":"Test pressure cap for correct operating range (18–22 psi) every time coolant is changed. Inspect gasket, springs, and sealing surfaces.","difficulty":"Easy","timeMinutes":10,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":7},"figures":[],"tools":["COOLANT SYSTEM PRESSURE TESTER (HD-45335)"],"parts":[],"torque":[],"steps":[{"n":1,"text":"Remove pressure cap."},{"n":2,"text":"Inspect cap for gasket deterioration and inoperative springs."},{"n":3,"text":"New cap: Wet the upper sealing gasket before turning onto adapter."},{"n":4,"text":"Connect tester to pressure cap. Special Tool: COOLANT SYSTEM PRESSURE TESTER (HD-45335)."},{"n":5,"text":"Pump handle to pressurize cap. Stop pumping when pressure limiting valve in cap opens."},{"n":6,"text":"Replace pressure cap if: (a) Opens below low limit, 18 psi (124 kPa). (b) Opens above high limit, 22 psi (152 kPa). (c) Pressure falls rapidly when pressurized within range."},{"n":7,"text":"Remove adapter and cap."}]},
{"id":"t20-coolant-check-level","bikeIds":["touring-2020"],"system":"cooling","title":"Coolant — Check Level","summary":"Verify coolant level is at or slightly above COLD full line on overflow tank when motorcycle is on level ground.","difficulty":"Easy","timeMinutes":5,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":8},"figures":[],"tools":[],"parts":[{"number":"99822-02","description":"GENUINE HARLEY-DAVIDSON EXTENDED LIFE ANTIFREEZE","qty":0.1}],"torque":[],"steps":[{"n":1,"text":"Check motorcycle on level ground."},{"n":2,"text":"Remove access panel from lower right fairing."},{"n":3,"text":"Check that coolant overflow tank is at or slightly above the COLD full line."},{"n":4,"text":"If level is below COLD line, add coolant. Remove overflow tank cap. Add GENUINE HARLEY-DAVIDSON EXTENDED LIFE ANTIFREEZE (99822-02) until fluid level reaches COLD line. Install overflow tank cap."},{"n":5,"text":"Install access panel."}]},
{"id":"t20-coolant-drain-fill","bikeIds":["touring-2020"],"system":"cooling","title":"Coolant — Drain and Fill Cooling System","summary":"Drain old coolant and refill with Genuine Harley-Davidson antifreeze. Use vacuum refiller or manual fill-and-bleed procedure. Capacity 0.8 qt.","difficulty":"Moderate","timeMinutes":30,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":8},"figures":[],"tools":["24 INCH HOSE CLAMP TOOL (HD-52004)","MATCO VACUUM VENTURI COOLING SYSTEM REFILLER (MCR102A)","COOLING SYSTEM ADAPTER (MPT10128)"],"parts":[{"number":"99822-02","description":"GENUINE HARLEY-DAVIDSON EXTENDED LIFE ANTIFREEZE","qty":1}],"torque":[],"steps":[{"n":1,"text":"Remove main fuse."},{"n":2,"text":"Remove access panel from right lower fairing."},{"n":3,"text":"Remove overflow tank cap. Do not remove pressure cap."},{"n":4,"text":"Remove pump cover."},{"n":5,"text":"Disconnect hoses from pump."},{"n":6,"text":"Disconnect hose from right coolant downtube. Lower hose to drain."},{"n":7,"text":"Drain and discard used coolant."},{"n":8,"text":"Connect hose to pump. Install spring clamps. Verify hoses are installed completely with hose end touching pump housing."},{"n":9,"text":"Connect hose to right coolant downtube. Secure with spring clamp."},{"n":10,"text":"Install pump cover."},{"n":11,"text":"Install main fuse."},{"n":12,"text":"Stand motorcycle upright (not on jiffy stand). Remove pressure cap."},{"n":13,"text":"Attach vacuum filler tool per manufacturer instructions. Connect to low-pressure compressed air. Immerse coolant pick-up hose into new coolant mixture. Fill hose and tool with coolant to purge air."},{"n":14,"text":"Turn on air valve and observe vacuum gauge. When stabilized, turn off air valve. Verify gauge remains steady. Open coolant valve to allow system to fill. Remove vacuum filler tool."},{"n":15,"text":"Verify pressure cap is completely tightened. Tab must contact stop for proper system operation. Install pressure cap."},{"n":16,"text":"Fill coolant overflow tank to cold fill line. Install overflow tank cap."},{"n":17,"text":"Start engine and check for leaks when hot."},{"n":18,"text":"Verify level in coolant overflow tank after system has cooled."},{"n":19,"text":"Secure filler neck to bracket."},{"n":20,"text":"Install access panel."}]},
{"id":"t20-coolant-pump-remove-install","bikeIds":["touring-2020"],"system":"cooling","title":"Coolant Pump — Remove and Install","summary":"Remove and install electric coolant pump. Drain coolant beforehand. Disconnect inlet/outlet hoses and electrical connector.","difficulty":"Moderate","timeMinutes":45,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":11},"figures":[],"tools":[],"parts":[],"torque":[],"steps":[{"n":1,"text":"Remove main fuse."},{"n":2,"text":"Drain coolant."},{"n":3,"text":"Disconnect pump connector."},{"n":4,"text":"Remove inlet hose. Remove spring clamp. Remove inlet hose."},{"n":5,"text":"Remove outlet hose. Remove crimp clamp. Remove outlet hose."},{"n":6,"text":"Remove pump from tabs."},{"n":7,"text":"Install coolant pump on tabs."},{"n":8,"text":"Install outlet hose. Install outlet hose. Install crimp clamp."},{"n":9,"text":"Install inlet hose. Install inlet hose. Install spring clamp."},{"n":10,"text":"Connect pump connector."},{"n":11,"text":"Fill cooling system."},{"n":12,"text":"Install main fuse."}]},
{"id":"t20-coolant-overflow-tank-remove-install","bikeIds":["touring-2020"],"system":"cooling","title":"Coolant Overflow Tank — Remove and Install","summary":"Remove and install coolant overflow tank. Detach overflow and vent hoses. Apply sealant to hose barb. Torque nut 65-74 in-lbs.","difficulty":"Easy","timeMinutes":20,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":12},"figures":[],"tools":[],"parts":[{"number":"99653-85","description":"HYLOMAR GASKET AND THREAD SEALANT","qty":1}],"torque":[{"fastener":"Coolant overflow tank nut","value":"65-74 in-lbs (7.3-8.4 N·m)","note":""}],"steps":[{"n":1,"text":"Remove access panel."},{"n":2,"text":"Disconnect coolant overflow hose. Detach clamp. Detach overflow hose."},{"n":3,"text":"Remove coolant overflow tank. Remove nut. Pull tank out enough to access vent hose. Detach vent hose. Remove tank. Empty tank if necessary. Remove overflow hose if necessary."},{"n":4,"text":"Install overflow hose on coolant overflow tank if removed. Clean hose barb and inside of overflow hose end. Apply small amount of sealant to hose barb. Apply sealant completely around flare of barb using applicator. Do not get sealant in opening of barb. HYLOMAR GASKET AND THREAD SEALANT (99653-85)."},{"n":5,"text":"Attach overflow hose to bottom of coolant overflow tank. Attach clamp."},{"n":6,"text":"Install coolant overflow tank. Attach vent hose. Install coolant overflow tank. Install nut. Tighten. Torque: 65-74 in-lbs (7.3-8.4 N·m)."},{"n":7,"text":"Attach overflow hose. Attach clamp."},{"n":8,"text":"Fill coolant overflow tank."},{"n":9,"text":"Install access panel."}]},
{"id":"t20-ect-sensor-remove-install","bikeIds":["touring-2020"],"system":"cooling","title":"Engine Coolant Temperature (ECT) Sensor — Remove and Install","summary":"Remove and install coolant temperature sensor on left radiator. Apply thread sealant. Torque 17.7-19.2 ft-lbs.","difficulty":"Moderate","timeMinutes":30,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":17},"figures":[],"tools":[],"parts":[{"number":"99818-97","description":"LOCTITE 565 THREAD SEALANT","qty":1}],"torque":[{"fastener":"Temperature sensor, radiator","value":"17.7-19.2 ft-lbs (24-26 N·m)","note":""}],"steps":[{"n":1,"text":"Remove main fuse."},{"n":2,"text":"Drain coolant."},{"n":3,"text":"Disassemble left lower fairing."},{"n":4,"text":"Remove ECT sensor. Disconnect connector. Remove ECT sensor."},{"n":5,"text":"Apply sealant to sensor. LOCTITE 565 THREAD SEALANT (99818-97). Avoid getting sealant on sensor probe."},{"n":6,"text":"Install ECT sensor. Install sensor. Tighten. Torque: 17.7-19.2 ft-lbs (24-26 N·m). Install connector."},{"n":7,"text":"Assemble left lower fairing."},{"n":8,"text":"Install main fuse."},{"n":9,"text":"Fill and bleed coolant system."}]},
{"id":"t20-radiator-remove-install","bikeIds":["touring-2020"],"system":"cooling","title":"Radiator — Remove and Install","summary":"Remove and install left or right radiator. Drain coolant and remove inlet/outlet hoses with crimp clamps.","difficulty":"Moderate","timeMinutes":45,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":18},"figures":[],"tools":[],"parts":[],"torque":[],"steps":[{"n":1,"text":"Remove main fuse."},{"n":2,"text":"Drain coolant."},{"n":3,"text":"Disassemble lower fairing."},{"n":4,"text":"Remove fan."},{"n":5,"text":"Remove inlet hose. Discard clamp. Remove inlet hose."},{"n":6,"text":"Remove outlet hose. Discard clamp. Remove outlet hose."},{"n":7,"text":"Remove radiator."},{"n":8,"text":"Right side: Remove filler assembly if necessary. Remove clamp. Remove filler assembly."},{"n":9,"text":"Remove gasket if necessary."},{"n":10,"text":"Left side: Remove ECT sensor if necessary."},{"n":11,"text":"Left side: Install ECT sensor if removed."},{"n":12,"text":"Install gasket if removed."},{"n":13,"text":"Right side: Install filler assembly if removed. Install clamp."},{"n":14,"text":"Install radiator."},{"n":15,"text":"Install outlet hose. Install new clamp."},{"n":16,"text":"Install inlet hose. Install new clamp."},{"n":17,"text":"Fill and bleed coolant system."}]}
,
{"id":"t20-power-disconnect-remove-main-fuse","bikeIds":["touring-2020"],"system":"electrical","title":"Power Disconnect — Remove Main Fuse","summary":"Remove main fuse to prevent accidental vehicle start-up and electrical equipment damage. Critical first step for all electrical work.","difficulty":"Easy","timeMinutes":5,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":8},"figures":[],"tools":[],"parts":[],"torque":[],"steps":[{"n":1,"text":"Models with security: Disable security system. Verify that fob is present. Turn OFF/RUN switch to RUN. Turn ignition switch ON."},{"n":2,"text":"Remove left saddlebag."},{"n":3,"text":"Remove left side cover."},{"n":4,"text":"Remove main fuse (4) from behind left side cover.","warning":"To prevent accidental vehicle start-up, which could cause death or serious injury, remove main fuse before proceeding."},{"n":5,"text":"Models with security: Turn ignition switch OFF."}]},
{"id":"t20-power-disconnect-install-main-fuse","bikeIds":["touring-2020"],"system":"electrical","title":"Power Disconnect — Install Main Fuse","summary":"Install main fuse after completing electrical work. Restore power to motorcycle systems.","difficulty":"Easy","timeMinutes":5,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":8},"figures":[],"tools":[],"parts":[],"torque":[],"steps":[{"n":1,"text":"Install main fuse (4) behind left side cover."},{"n":2,"text":"Install left side cover."},{"n":3,"text":"Install left saddlebag."}]},
{"id":"t20-power-disconnect-disconnect-battery","bikeIds":["touring-2020"],"system":"electrical","title":"Power Disconnect — Disconnect Negative Battery Cable","summary":"Disconnect negative battery cable from battery to prevent starter engagement and engine rotation. Used before major electrical work.","difficulty":"Easy","timeMinutes":10,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":8},"figures":[],"tools":[],"parts":[],"torque":[{"fastener":"Negative battery cable screw","value":"60-70 in-lbs (6.8-7.9 N·m)","note":""}],"steps":[{"n":1,"text":"Models with security: Disable security system. Verify that fob is present. Turn OFF/RUN switch to RUN. Turn ignition switch ON."},{"n":2,"text":"Remove seat."},{"n":3,"text":"Detach ECM (Electronic control module) from top caddy."},{"n":4,"text":"Disconnect negative battery cable.","warning":"To prevent accidental vehicle start-up, which could cause death or serious injury, disconnect negative (−) battery cable before proceeding."},{"n":5,"text":"Models with security: Turn ignition switch OFF."}]},
{"id":"t20-power-disconnect-connect-battery","bikeIds":["touring-2020"],"system":"electrical","title":"Power Disconnect — Connect Negative Battery Cable","summary":"Reconnect negative battery cable after electrical work is complete. Restore battery connection and secure ECM.","difficulty":"Easy","timeMinutes":5,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":8},"figures":[],"tools":[],"parts":[],"torque":[{"fastener":"Negative battery cable screw","value":"60-70 in-lbs (6.8-7.9 N·m)","note":""}],"steps":[{"n":1,"text":"Connect negative battery cable. Tighten. Torque: 60-70 in-lbs (6.8-7.9 N·m)."},{"n":2,"text":"Attach ECM to top caddy."},{"n":3,"text":"Install seat."}]},
{"id":"t20-starter-remove-install","bikeIds":["touring-2020"],"system":"electrical","title":"Starter — Remove and Install","summary":"Remove and install electric starter motor. Disconnect battery cable first. Replace O-ring and apply grease. Torque 22-24 ft-lbs.","difficulty":"Moderate","timeMinutes":60,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":11},"figures":[],"tools":[],"parts":[{"number":"99857-97A","description":"SPECIAL PURPOSE GREASE","qty":1},{"number":"99642-97","description":"LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE)","qty":1}],"torque":[{"fastener":"Starter mounting screw","value":"22-24 ft-lbs (29.8-32.5 N·m)","note":""},{"fastener":"Starter solenoid stud nut","value":"70-104 in-lbs (7.9-11.8 N·m)","note":""}],"steps":[{"n":1,"text":"Disconnect negative battery cable."},{"n":2,"text":"Remove engine oil filler cap/dipstick. Cover fill spout with clean shop cloth."},{"n":3,"text":"Remove starter. Remove battery positive cable from starter solenoid stud. Disconnect starter solenoid connector. Remove starter mounting screws.","warning":"Do not allow ring dowels to drop when removing starter."},{"n":4,"text":"Discard O-ring."},{"n":5,"text":"Install starter. Apply a light coat of grease on new O-ring. SPECIAL PURPOSE GREASE (99857-97A). Install new O-ring. Apply a light coat of threadlocker to starter mounting screws. LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE)."},{"n":6,"text":"Install starter. Verify that ring dowels are installed. Install starter. Install starter mounting screws. Tighten. Torque: 22-24 ft-lbs (29.8-32.5 N·m)."},{"n":7,"text":"Install battery positive cable on starter solenoid stud. Install starter solenoid nut. Tighten. Torque: 70-104 in-lbs (7.9-11.8 N·m)."},{"n":8,"text":"Pull down rubber boot over terminal connection."},{"n":9,"text":"Install starter solenoid connector."},{"n":10,"text":"Install engine oil filler cap/dipstick."},{"n":11,"text":"Connect negative battery cable."}]},
{"id":"t20-ignition-switch-remove-install-fairing","bikeIds":["touring-2020"],"system":"electrical","title":"Ignition Switch — Remove and Install (Fairing Models)","summary":"Remove and install ignition switch on fairing models. Complex knob removal and installation procedure using alignment tool. Torque 85-115 in-lbs.","difficulty":"Advanced","timeMinutes":45,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":16},"figures":[],"tools":["IGNITION SWITCH ALIGNMENT TOOL (HD-51198)"],"parts":[],"torque":[{"fastener":"Ignition switch housing screws: Fairing models","value":"85-115 in-lbs (9.6-13 N·m)","note":""}],"steps":[{"n":1,"text":"Remove left side cover."},{"n":2,"text":"Remove main fuse."},{"n":3,"text":"Fork mounted fairing models: Remove dash panel."},{"n":4,"text":"Frame mounted fairing models: Remove instrument bezel."},{"n":5,"text":"Remove ignition switch knob. Insert key and turn to UNLOCK position. Rotate knob to FORK LOCK. Press and hold release button at bottom of knob, and turn key 60 degrees counterclockwise. Lift knob to remove."},{"n":6,"text":"Disconnect ignition switch connector."},{"n":7,"text":"Remove two screws and flat washers securing ignition switch assembly."},{"n":8,"text":"Remove ignition switch."},{"n":9,"text":"Place ignition switch into position."},{"n":10,"text":"Install two screws and flat washers. Tighten. Torque: 85-115 in-lbs (9.6-13 N·m)."},{"n":11,"text":"Install ignition switch connector."},{"n":12,"text":"Fork mounted fairing models: Install dash panel."},{"n":13,"text":"Frame mounted fairing models: Install instrument bezel."},{"n":14,"text":"Place spring into bore at underside of knob. Install ignition switch knob. Verify button at bottom of knob is pressed and key is turned 60 degrees counterclockwise. With knob pointing toward FORK LOCK, insert shaft into ignition switch. Hold knob down and turn key clockwise to UNLOCK position. Audible click indicates proper engagement. Release knob. Rotate through all four positions to verify operation."},{"n":15,"text":"Install main fuse."},{"n":16,"text":"Install left side cover."}]},
{"id":"t20-spark-plug-cables-remove-install","bikeIds":["touring-2020"],"system":"electrical","title":"Spark Plug Cables — Remove and Install","summary":"Remove and install spark plug cables. Drain fuel tank first. Use special wire puller tool. Route cables through caddy retainers.","difficulty":"Advanced","timeMinutes":60,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":19},"figures":[],"tools":["ADJUSTABLE SPARK PLUG WIRE PULLER (HD-52006)"],"parts":[],"torque":[],"steps":[{"n":1,"text":"Purge fuel line."},{"n":2,"text":"Disconnect fuel line from tank."},{"n":3,"text":"Remove left saddlebag."},{"n":4,"text":"Remove left side cover."},{"n":5,"text":"Remove main fuse."},{"n":6,"text":"Remove seat."},{"n":7,"text":"Remove console."},{"n":8,"text":"Remove fuel tank."},{"n":9,"text":"Remove cables from ignition coil."},{"n":10,"text":"Release cables retainers."},{"n":11,"text":"Using the wire puller, remove boots from spark plugs. Special Tool: ADJUSTABLE SPARK PLUG WIRE PULLER (HD-52006)."},{"n":12,"text":"Connect long cables to front spark plugs."},{"n":13,"text":"Connect short cables to rear spark plugs."},{"n":14,"text":"Adjust spark plug boots to avoid contact with fuel tank."},{"n":15,"text":"Right cables: Secure cable straps. Route front cable through caddy retainers."},{"n":16,"text":"Left cables: Secure left side anchored cable straps to frame backbone."},{"n":17,"text":"Connect cables to ignition coil."},{"n":18,"text":"Install fuel tank."},{"n":19,"text":"Connect fuel line to tank."},{"n":20,"text":"Install console."},{"n":21,"text":"Install seat."},{"n":22,"text":"Install main fuse."},{"n":23,"text":"Install left side cover."},{"n":24,"text":"Install left saddlebag."}]},
{"id":"t20-ignition-coil-remove-install","bikeIds":["touring-2020"],"system":"electrical","title":"Ignition Coil — Remove and Install","summary":"Remove and install ignition coil mounted on battery hold-down bracket. Replace spark plug cables. Torque 32-40 in-lbs.","difficulty":"Moderate","timeMinutes":45,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":20},"figures":[],"tools":[],"parts":[],"torque":[{"fastener":"Ignition coil screws","value":"32-40 in-lbs (3.6-4.5 N·m)","note":""},{"fastener":"Battery hold-down screws","value":"32-40 in-lbs (3.6-4.5 N·m)","note":""},{"fastener":"Harness ground stud flange nut","value":"50-90 in-lbs (5.7-10.2 N·m)","note":""}],"steps":[{"n":1,"text":"Remove left saddlebag."},{"n":2,"text":"Remove left side cover."},{"n":3,"text":"Remove main fuse."},{"n":4,"text":"Remove seat."},{"n":5,"text":"Remove top caddy."},{"n":6,"text":"Remove battery."},{"n":7,"text":"Remove spark plug wires from ignition coil towers."},{"n":8,"text":"Remove ignition coil connector."},{"n":9,"text":"Remove screws."},{"n":10,"text":"Loosen ground terminal nut."},{"n":11,"text":"Hold ground terminal wires out of the way."},{"n":12,"text":"Remove battery hold-down bracket and ignition coil."},{"n":13,"text":"Remove screws and ignition coil."},{"n":14,"text":"Install screws through ignition coil into battery hold-down bracket. Tighten. Torque: 32-40 in-lbs (3.6-4.5 N·m)."},{"n":15,"text":"Hold ground terminal wires out of the way."},{"n":16,"text":"Place ignition coil and battery hold-down bracket into position."},{"n":17,"text":"Install screws. Tighten. Torque: 32-40 in-lbs (3.6-4.5 N·m)."},{"n":18,"text":"Tighten ground terminal nut. Torque: 50-90 in-lbs (5.7-10.2 N·m)."},{"n":19,"text":"Install battery."},{"n":20,"text":"Install top caddy."},{"n":21,"text":"Install seat."},{"n":22,"text":"Install main fuse."},{"n":23,"text":"Install left side cover."},{"n":24,"text":"Install left saddlebag."}]},
{"id":"t20-lhcm-remove-install","bikeIds":["touring-2020"],"system":"electrical","title":"Left Hand Control Module (LHCM) — Remove and Install","summary":"Remove and install left handlebar control module. Replace switch housings and connectors carefully. Never install different model switch. Torque 35-44 in-lbs.","difficulty":"Moderate","timeMinutes":45,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":22},"figures":[],"tools":[],"parts":[],"torque":[{"fastener":"LHCM housing screw","value":"35-44 in-lbs (4-5 N·m)","note":""}],"steps":[{"n":1,"text":"Remove left side cover."},{"n":2,"text":"Remove main fuse."},{"n":3,"text":"FLHRXS: Remove turn signal lamp and mirror."},{"n":4,"text":"Remove clutch handle assembly."},{"n":5,"text":"Remove trigger finger switch cap. Lightly lift to elevate from normal position. Using small screwdriver, carefully pry between cap and plunger. Slide cap off."},{"n":6,"text":"Remove LHCM housing. Loosen screws. Remove front housing."},{"n":7,"text":"Remove connectors. Using a pick, carefully press connector latch down. Use prying motion on latch while pulling on connector."},{"n":8,"text":"FLHRXS: Disconnect turn signal lamp."},{"n":9,"text":"Release connector latch and rotate switch down."},{"n":10,"text":"Remove hand control module from handlebar. Release wires from hand control module. Remove hand control module."},{"n":11,"text":"Connect LHCM connector. Route harness through fingers and into channel. Connect LHCM connectors."},{"n":12,"text":"Install LHCM on handlebar. Rotate switch up and snap latch into place."},{"n":13,"text":"Route wires close to the wire retainer."},{"n":14,"text":"Verify that wire harness is in the recess at bottom of handlebar."},{"n":15,"text":"FLHRXS: Connect turn signal lamp."},{"n":16,"text":"Install front housing. Align switch housing on LHCM. Install screws until snug."},{"n":17,"text":"Install clutch control assembly."},{"n":18,"text":"Tighten screws. Torque: 35-44 in-lbs (4-5 N·m)."},{"n":19,"text":"Install trigger finger switch cap. Raise switch to elevated position. Slide switch cap onto switch until fully seated. Press cap into normal position."}]},
{"id":"t20-battery-remove-inspect","bikeIds":["touring-2020"],"system":"electrical","title":"Battery — Remove and Inspect","summary":"Remove and inspect 28Ah/405 CCA battery. Check for damage and cleanliness before reinstalling.","difficulty":"Easy","timeMinutes":20,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":46},"figures":[],"tools":[],"parts":[],"torque":[],"steps":[{"n":1,"text":"Remove seat."},{"n":2,"text":"Disconnect negative battery cable."},{"n":3,"text":"Disconnect positive battery cable."},{"n":4,"text":"Remove battery hold-down."},{"n":5,"text":"Remove battery."},{"n":6,"text":"Inspect battery for physical damage, cracks, and cleanliness."},{"n":7,"text":"Clean battery terminals if necessary."},{"n":8,"text":"Install battery."},{"n":9,"text":"Install battery hold-down."},{"n":10,"text":"Connect positive battery cable."},{"n":11,"text":"Connect negative battery cable."},{"n":12,"text":"Install seat."}]},
{"id":"t20-battery-test","bikeIds":["touring-2020"],"system":"electrical","title":"Battery — Test","summary":"Test battery using battery tester (HD-23688 or HD-26568). Verify cold cranking amps and state of charge.","difficulty":"Easy","timeMinutes":10,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":46},"figures":[],"tools":["BATTERY TESTER (HD-23688) or (HD-26568)"],"parts":[],"torque":[],"steps":[{"n":1,"text":"Fully charge battery if charge is questionable."},{"n":2,"text":"Remove seat."},{"n":3,"text":"Connect tester leads to battery terminals. Positive lead to positive terminal. Negative lead to negative terminal."},{"n":4,"text":"Read battery tester. If tester indicates good, battery is serviceable. If tester indicates bad or weak, replace battery."},{"n":5,"text":"Install seat."}]},
{"id":"t20-cooling-fan-remove-install","bikeIds":["touring-2020"],"system":"electrical","title":"Cooling Fan — Remove and Install","summary":"Remove and install electric cooling fan for twin-cooled models. Disconnect fan connector and remove retaining screws.","difficulty":"Moderate","timeMinutes":30,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":93},"figures":[],"tools":[],"parts":[],"torque":[],"steps":[{"n":1,"text":"Remove main fuse."},{"n":2,"text":"Disassemble lower fairing to access fan."},{"n":3,"text":"Disconnect fan connector."},{"n":4,"text":"Remove air duct."},{"n":5,"text":"Remove retaining screws."},{"n":6,"text":"Remove fan."},{"n":7,"text":"Install fan on radiator."},{"n":8,"text":"Install retaining screws. Tighten."},{"n":9,"text":"Install air duct."},{"n":10,"text":"Connect fan connector."},{"n":11,"text":"Assemble lower fairing."},{"n":12,"text":"Install main fuse."}]},
{"id":"t20-ambient-air-temperature-sensor-remove-install","bikeIds":["touring-2020"],"system":"electrical","title":"Ambient Air Temperature Sensor — Remove and Install","summary":"Remove and install ambient air temperature sensor. Disconnect connector and remove from mounting location.","difficulty":"Easy","timeMinutes":10,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":96},"figures":[],"tools":[],"parts":[],"torque":[],"steps":[{"n":1,"text":"Remove main fuse."},{"n":2,"text":"Remove left saddlebag."},{"n":3,"text":"Remove left side cover."},{"n":4,"text":"Disconnect ambient air temperature sensor connector."},{"n":5,"text":"Remove sensor from mounting location."},{"n":6,"text":"Install new sensor in mounting location."},{"n":7,"text":"Connect sensor connector."},{"n":8,"text":"Install left side cover."},{"n":9,"text":"Install left saddlebag."},{"n":10,"text":"Install main fuse."}]},
{"id":"t20-crankshaft-position-sensor-remove-install","bikeIds":["touring-2020"],"system":"electrical","title":"Crankshaft Position Sensor (CKP) — Remove and Install","summary":"Remove and install crankshaft position sensor. Disconnect connector and remove retaining screw.","difficulty":"Moderate","timeMinutes":20,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":97},"figures":[],"tools":[],"parts":[],"torque":[],"steps":[{"n":1,"text":"Remove main fuse."},{"n":2,"text":"Remove left saddlebag."},{"n":3,"text":"Remove left side cover."},{"n":4,"text":"Disconnect CKP sensor connector."},{"n":5,"text":"Remove retaining screw."},{"n":6,"text":"Remove sensor."},{"n":7,"text":"Install new sensor. Position sensor properly for rotor clearance."},{"n":8,"text":"Install retaining screw. Tighten."},{"n":9,"text":"Connect sensor connector."},{"n":10,"text":"Install left side cover."},{"n":11,"text":"Install left saddlebag."},{"n":12,"text":"Install main fuse."}]},
{"id":"t20-knock-sensor-remove-install","bikeIds":["touring-2020"],"system":"electrical","title":"Knock Sensor (KS) — Remove and Install","summary":"Remove and install knock sensor on engine block. Disconnect connector and remove sensor.","difficulty":"Moderate","timeMinutes":30,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":99},"figures":[],"tools":[],"parts":[],"torque":[],"steps":[{"n":1,"text":"Remove seat."},{"n":2,"text":"Remove main fuse."},{"n":3,"text":"Remove fuel tank to access knock sensor on engine."},{"n":4,"text":"Disconnect knock sensor connector."},{"n":5,"text":"Remove retaining fastener."},{"n":6,"text":"Remove sensor from engine block."},{"n":7,"text":"Install new knock sensor on engine block."},{"n":8,"text":"Install retaining fastener. Tighten."},{"n":9,"text":"Connect sensor connector."},{"n":10,"text":"Install fuel tank."},{"n":11,"text":"Install main fuse."},{"n":12,"text":"Install seat."}]},
{"id":"t20-jiffy-stand-sensor-remove-install","bikeIds":["touring-2020"],"system":"electrical","title":"Jiffy Stand Sensor (JSS) — Remove and Install","summary":"Remove and install jiffy stand sensor. Disconnect connector and remove retaining screw.","difficulty":"Easy","timeMinutes":15,"source":{"manual":"2020 HD Touring Service Manual.pdf","page":107},"figures":[],"tools":[],"parts":[],"torque":[],"steps":[{"n":1,"text":"Remove main fuse."},{"n":2,"text":"Disconnect JSS connector."},{"n":3,"text":"Remove retaining screw."},{"n":4,"text":"Remove sensor from jiffy stand."},{"n":5,"text":"Install new sensor on jiffy stand."},{"n":6,"text":"Install retaining screw. Tighten."},{"n":7,"text":"Connect sensor connector."},{"n":8,"text":"Test stand sensor operation. Sensor should trigger when stand is down."},{"n":9,"text":"Install main fuse."}]},

{
    id: 't20-maint-schedule',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Maintenance Schedule',
    summary: 'Regular service intervals for all maintenance and inspection tasks.',
    difficulty: 'Easy',
    timeMinutes: 5,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-4'
    },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Every 1,000 miles (1,600 km): Check operation of electrical equipment and switches, check front tire pressure, inspect front brake fluid level, inspect clutch fluid system for leaks, check DOT4 clutch and front brake fluid for moisture, replace engine oil and filter, check engine coolant freeze point, clean radiators or oil cooler, inspect oil lines and brake system for leaks.'
      },
      {
        n: 2,
        text: 'Every 5,000 miles (8,000 km): Repeat 1,000 mile checks, inspect air cleaner and service as required, inspect fuel lines and fittings for leaks, inspect brake pads and discs for wear, check rear tire pressure and inspect tread, inspect and adjust drive belt and sprockets, inspect exhaust system.'
      },
      {
        n: 3,
        text: 'Every 10,000 miles (16,000 km): Perform check and replace brake fluid (drain and replace DOT4 fluid), check front wheel spoke tightness if equipped.'
      },
      {
        n: 4,
        text: 'Every 15,000 miles (24,000 km): Repeat 5,000 mile checks, replace primary chaincase lubricant, inspect and lubricate jiffy stand, check front axle nut torque, check rear axle nut torque.'
      },
      {
        n: 5,
        text: 'Every 20,000 miles (32,000 km): Inspect, lubricate and adjust steering head bearings, replace transmission lubricant, check rear wheel spoke tightness if equipped.'
      },
      {
        n: 6,
        text: 'Every 30,000 miles (48,000 km): Replace coolant every 30,000 mi, replace spark plugs every two years or 30,000 mi whichever comes first.'
      },
      {
        n: 7,
        text: 'Every 50,000 miles (80,000 km): Rebuild front forks and replace fork oil. After 50,000 miles, repeat the service schedule starting at the 8,000 km (5,000 mi) interval.'
      }
    ]
  },

{
    id: 't20-maint-fuel-oil-specs',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Fuel and Oil Specifications',
    summary: 'Recommended fuel grades, oil specifications, and cold-weather considerations.',
    difficulty: 'Easy',
    timeMinutes: 5,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-7'
    },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'FUEL: Always use good quality unleaded gasoline with octane rating of 91 (95 RON) pump octane (R+M)/2.'
      },
      {
        n: 2,
        text: 'Use reformulated or oxygenated gasolines (RFG) whenever possible to reduce emissions. Do not use racing fuel or fuel containing methanol.'
      },
      {
        n: 3,
        text: 'Ethanol fuel with up to 10 percent ethanol content may be used without affecting vehicle performance. E15 (15% ethanol) is currently restricted from use in motorcycles.'
      },
      {
        n: 4,
        text: 'Use only Harley-Davidson approved fuel additives. Other additives may damage the engine, fuel system and other components.'
      },
      {
        n: 5,
        text: 'ENGINE OIL: Originally equipped with Genuine Harley-Davidson H-D 360 Motorcycle Oil 20W50. Recommended: Screamin\' Eagle SYN3 Full Synthetic Motorcycle Lubricant 20W50.'
      },
      {
        n: 6,
        text: 'Use proper oil grade for lowest temperature expected before next oil change. SAE 20W50 for above 30.2°F (-1°C), SAE 20W50 for above 39.2°F (4°C), SAE 50 for above 60.8°F (16°C), SAE 60 for above 80.6°F (27°C).'
      },
      {
        n: 7,
        text: 'If H-D 360 or SYN3 is unavailable, use diesel engine oil certified as CH-4, CI-4 or CJ-4 with preferred viscosities 20W50, 15W40, or 10W40.'
      },
      {
        n: 8,
        text: 'COLD WEATHER: Change engine oil more frequently in colder climates. For temperatures below 60°F (16°C) with short runs (less than 15 mi/24 km), reduce oil change interval to 1500 mi (2,400 km).'
      },
      {
        n: 9,
        text: 'Cold weather operation: Water vapor from combustion condenses on cool engine surfaces. Keep engine at operating temperature to evaporate water and prevent sludge accumulation.'
      }
    ]
  },

{
    id: 't20-maint-oil-filter-change',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Replace Engine Oil and Filter',
    summary: 'Change engine oil and oil filter at regular intervals to maintain engine performance.',
    difficulty: 'Easy',
    timeMinutes: 30,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-9'
    },
    figures: [],
    tools: [
      'Oil filter wrench HD-94686-00',
      'Oil filter wrench HD-94863-10'
    ],
    parts: [
      {
        number: '',
        description: 'Engine oil (Screamin Eagle SYN3 20W50 or equivalent)',
        qty: 1
      },
      {
        number: '',
        description: 'Oil filter',
        qty: 1
      },
      {
        number: '',
        description: 'Oil drain plug O-ring',
        qty: 1
      }
    ],
    torque: [
      {
        fastener: 'Engine oil drain plug',
        value: '14-21 ft-lbs (19-28.5 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'Run motorcycle until engine is at normal operating temperature, then turn off engine.'
      },
      {
        n: 2,
        text: 'Remove filler plug/dipstick.'
      },
      {
        n: 3,
        text: 'Remove the oil drain plug (left side) and O-ring. Allow oil to drain completely.'
      },
      {
        n: 4,
        text: 'Remove the oil filter using oil filter wrench and hand tools. Do not use air tools.'
      },
      {
        n: 5,
        text: 'Clean the oil filter mount flange.'
      },
      {
        n: 6,
        text: 'Clean any residual oil from crankcase and transmission housing.'
      },
      {
        n: 7,
        text: 'Install new oil filter: Lubricate gasket with thin film of clean engine oil, install new filter, hand-tighten one-half to three-quarters turn after gasket contacts mounting surface. Do NOT use wrench for installation.'
      },
      {
        n: 8,
        text: 'Install engine oil drain plug and new O-ring. Torque 14-21 ft-lbs (19-28.5 N·m).'
      },
      {
        n: 9,
        text: 'Add initial volume of engine oil: 4.0 qt (3.8 L).'
      },
      {
        n: 10,
        text: 'Verify proper oil level: Perform engine oil level cold check, start engine and check for oil leaks around drain plug and filter, then perform engine oil level hot check.'
      }
    ]
  },

{
    id: 't20-maint-primary-lubricant',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Replace Primary Chaincase Lubricant',
    summary: 'Drain and refill primary chaincase with proper lubricant to maintain clutch operation.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-11'
    },
    figures: [],
    tools: [],
    parts: [
      {
        number: '',
        description: 'Primary chaincase lubricant (Formula+ or Screamin\' Eagle SYN3 20W50)',
        qty: 1
      },
      {
        number: '',
        description: 'Primary chaincase drain plug O-ring',
        qty: 1
      },
      {
        number: '',
        description: 'Clutch inspection cover seal',
        qty: 1
      }
    ],
    torque: [
      {
        fastener: 'Primary chaincase drain plug',
        value: '14-21 ft-lbs (19-28.5 N·m)'
      },
      {
        fastener: 'Clutch inspection cover screws',
        value: '84-108 in-lbs (9.5-12.2 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'Run motorcycle until engine is at normal operating temperature, then turn off engine.'
      },
      {
        n: 2,
        text: 'Secure motorcycle upright (not on jiffy stand) on a level surface.'
      },
      {
        n: 3,
        text: 'Drain primary chaincase by removing drain plug (bottom).'
      },
      {
        n: 4,
        text: 'Clean drain plug magnet. If excessive debris, inspect chaincase components condition.'
      },
      {
        n: 5,
        text: 'Install drain plug and new O-ring. Torque 14-21 ft-lbs (19-28.5 N·m).'
      },
      {
        n: 6,
        text: 'Remove screws and clutch inspection cover. Remove seal and wipe oil from groove.'
      },
      {
        n: 7,
        text: 'Wipe all lubricant from cover mounting surface and groove in chaincase cover.'
      },
      {
        n: 8,
        text: 'Add lubricant: Pour specified amount (dry fill 34 oz/1.0 L or wet fill 30 oz/0.9 L) of Formula+ or Screamin\' Eagle SYN3 through clutch inspection cover opening. Proper level is approximately at bottom of pressure plate OD.'
      },
      {
        n: 9,
        text: 'Install clutch inspection cover: Position new seal in groove, press nubs into groove, secure cover with screws and captive washers, tighten in sequence to 84-108 in-lbs (9.5-12.2 N·m).'
      },
      {
        n: 10,
        text: 'WARNING: Do not overfill the primary chaincase. Overfilling can cause rough clutch engagement, incomplete disengagement, clutch drag and difficulty finding neutral at engine idle.'
      }
    ]
  },

{
    id: 't20-maint-transmission-lubricant',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Replace Transmission Lubricant',
    summary: 'Drain and refill transmission with proper lubricant for smooth operation.',
    difficulty: 'Easy',
    timeMinutes: 30,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-13'
    },
    figures: [],
    tools: [],
    parts: [
      {
        number: '',
        description: 'Transmission lubricant (Formula+ or Screamin\' Eagle SYN3 20W50)',
        qty: 1
      },
      {
        number: '',
        description: 'Transmission drain plug O-ring',
        qty: 1
      }
    ],
    torque: [
      {
        fastener: 'Transmission drain plug',
        value: '14-21 ft-lbs (19-28.5 N·m)'
      },
      {
        fastener: 'Transmission filler plug/dipstick',
        value: '25-75 in-lbs (2.8-8.5 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'Remove transmission filler plug/dipstick.'
      },
      {
        n: 2,
        text: 'See Figure 2-11. Remove transmission drain plug (left side). Drain transmission.'
      },
      {
        n: 3,
        text: 'Clean and inspect drain plug and O-ring.'
      },
      {
        n: 4,
        text: 'Install drain plug with new O-ring. Torque 14-21 ft-lbs (19-28.5 N·m). Do not over-tighten.'
      },
      {
        n: 5,
        text: 'Fill transmission to specification with recommended Harley-Davidson lubricant (Formula+ or Screamin\' Eagle SYN3). Volume: 28 fl oz (0.83 L).'
      },
      {
        n: 6,
        text: 'Check lubricant level. Add enough to bring level between the add (A) and full (F) marks.'
      },
      {
        n: 7,
        text: 'Install filler plug/dipstick. Torque 25-75 in-lbs (2.8-8.5 N·m).'
      }
    ]
  },

{
    id: 't20-maint-tires-wheels',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Inspect Tires and Wheels',
    summary: 'Check tire pressure, tread wear, and wheel bearing condition.',
    difficulty: 'Easy',
    timeMinutes: 30,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-15'
    },
    figures: [],
    tools: [
      'Tire pressure gauge'
    ],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Check tire pressures when tires are cold. Specified pressures: Front 36 psi (248 kPa), Rear 40 psi (276 kPa).'
      },
      {
        n: 2,
        text: 'Inspect each tire for wear: Replace tires before tread wear indicators appear (when 0.031 in/0.8 mm or less tread remains).'
      },
      {
        n: 3,
        text: 'Inspect each tire for punctures, cuts, breaks, damage to tire that cannot be repaired, tire cords or fabric visible, bumps, bulges or splits in tire.'
      },
      {
        n: 4,
        text: 'Replace tire immediately when wear bars become visible or only 1/32 in (1 mm) tread depth remains.'
      },
      {
        n: 5,
        text: 'WHEEL BEARINGS: Inspect when wheels are removed. Check for play by hand, rotate inner bearing race and check for abnormal noise, ensure bearing rotates smoothly, inspect for wear and corrosion.'
      },
      {
        n: 6,
        text: 'Replace bearings if excessive play exceeds 0.002 in (0.051 mm) service wear limit. Replace bearings in sets only.'
      }
    ]
  },

{
    id: 't20-maint-wheel-spokes',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Adjust Wheel Spokes',
    summary: 'Check and tighten wheel spokes to proper torque specification.',
    difficulty: 'Advanced',
    timeMinutes: 90,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-16'
    },
    figures: [],
    tools: [
      'Spoke torque wrench HD-48985',
      'Spoke wrench HD-94681-80'
    ],
    parts: [],
    torque: [
      {
        fastener: 'Spoke nipple',
        value: '55 in-lbs (6.2 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'Raise wheel and identify spoke groups: Starting at valve stem, mark first group of four spokes (1-4) using different colors for each spoke on nipple and rim.'
      },
      {
        n: 2,
        text: 'Continue around wheel marking remaining spokes same as first group.'
      },
      {
        n: 3,
        text: 'Loosen spoke (1) one-quarter turn using Spoke Wrench HD-94681-80.'
      },
      {
        n: 4,
        text: 'Tighten spoke (1) to 55 in-lbs (6.2 N·m) using Spoke Torque Wrench HD-48985. While tightening, if torque wrench clicks before alignment marks align, continue turning until marks align. If marks align and torque not reached, tighten until correct torque achieved. Do not turn more than one-quarter turn past alignment mark.'
      },
      {
        n: 5,
        text: 'Repeat for spoke (4) in same group.'
      },
      {
        n: 6,
        text: 'Continue around wheel checking spokes 1 and 4 until all groups done.'
      },
      {
        n: 7,
        text: 'Repeat procedure for spokes (2, 3) in each group.'
      },
      {
        n: 8,
        text: 'True the wheel. See CHECKING AND TRUING WHEELS (Page 3-17).'
      },
      {
        n: 9,
        text: 'WARNING: Do not over-tighten spoke nipples. Spokes too tight can draw nipples through rim or distort hub flanges. Spokes too loose can continue loosening in service, affecting stability and handling.'
      }
    ]
  },

{
    id: 't20-maint-cables-chassis-lube',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Lubricate Cables and Chassis',
    summary: 'Lubricate control cables, pivots, hinges and mechanical components.',
    difficulty: 'Easy',
    timeMinutes: 30,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-18'
    },
    figures: [],
    tools: [],
    parts: [
      {
        number: '',
        description: 'Harley Lube',
        qty: 1
      },
      {
        number: '',
        description: 'Anti-Seize Lubricant',
        qty: 1
      }
    ],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Inspect and lubricate components according to maintenance schedule.'
      },
      {
        n: 2,
        text: 'Lubricate the following items with Harley Lube: Throttle cable, Choke cable, Brake line routing, Clutch cable, Front brake lever pivot, Clutch control hand lever pivot, Foot shift lever pivot, Rear brake lever pivot, Hinges and latches (fuel door, footrests), Locks as required.'
      },
      {
        n: 3,
        text: 'Use Anti-Seize Lubricant for Jiffy stand lubrication.'
      },
      {
        n: 4,
        text: 'If motorcycle is operated on muddy or dusty roads, clean and lubricate more frequently.'
      }
    ]
  },

{
    id: 't20-maint-brake-disc-inspect',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Inspect Brake Discs',
    summary: 'Check brake disc thickness and runout for wear and damage.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-19'
    },
    figures: [],
    tools: [
      'Micrometer',
      'Dial indicator'
    ],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'For FRONT DISC: Measure thickness with micrometer. Minimum acceptable thickness is stamped on side of disc.'
      },
      {
        n: 2,
        text: 'Replace disc if disc is scored or measured thickness is less than minimum.'
      },
      {
        n: 3,
        text: 'Measure runout near outside diameter of disc using dial indicator. Replace disc if runout meets or exceeds 0.008 in (0.2 mm).'
      },
      {
        n: 4,
        text: 'Replace disc if warped, badly scored or worn beyond service limit.'
      },
      {
        n: 5,
        text: 'For REAR DISC: Same inspection procedure as front disc.'
      },
      {
        n: 6,
        text: 'NOTE: Minimum acceptable thickness is stamped on side of disc. If replacing disc, order replacement from authorized Harley-Davidson dealer with correct specifications.'
      }
    ]
  },

{
    id: 't20-maint-brake-pads-front',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Replace Front Brake Pads',
    summary: 'Remove and install front brake pads with proper installation sequence.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-20'
    },
    figures: [],
    tools: [
      'C-clamp'
    ],
    parts: [
      {
        number: '',
        description: 'Front brake pads',
        qty: 1
      },
      {
        number: '',
        description: 'Pad pin (metric)',
        qty: 1
      },
      {
        number: '',
        description: 'Pad spring (if damaged)',
        qty: 1
      }
    ],
    torque: [
      {
        fastener: 'Brake pad pin',
        value: '75-102 in-lbs (8.5-11.5 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'Remove caliper. See FRONT BRAKE CALIPER (Page 3-34).'
      },
      {
        n: 2,
        text: 'Loosen master cylinder reservoir cap.'
      },
      {
        n: 3,
        text: 'Remove grit and debris from caliper piston area: Rinse area with warm soapy water, dry using low-pressure compressed air.'
      },
      {
        n: 4,
        text: 'Remove pads: Remove screen from caliper, using old brake pad and C-clamp retract pistons fully into caliper, remove retaining clip, discard old pad pin, remove brake pads, inspect pad spring and replace if needed.'
      },
      {
        n: 5,
        text: 'Install pad spring: Install on flat in caliper so clips on spring engage indentations in caliper. Make sure forked end is on pad pin side of caliper.'
      },
      {
        n: 6,
        text: 'Install new brake pads: Insert each pad with square corner in slot of caliper, push pad pin tab into caliper.'
      },
      {
        n: 7,
        text: 'Install new pad pin. Torque 75-102 in-lbs (8.5-11.5 N·m).'
      },
      {
        n: 8,
        text: 'Install retaining clip.'
      },
      {
        n: 9,
        text: 'Install screen: Engage prongs of screen on forked end of pad spring. Push on opposite side until engaged.'
      },
      {
        n: 10,
        text: 'Tighten master cylinder reservoir cap.'
      },
      {
        n: 11,
        text: 'Install caliper.'
      },
      {
        n: 12,
        text: 'Pump brakes to move pistons out until brake pads contact rotor. Verify piston location against pads.'
      },
      {
        n: 13,
        text: 'Check fluid level in brake master cylinder reservoir.'
      },
      {
        n: 14,
        text: 'Test brakes: Turn ignition ON, check operation of front lamp, test ride at low speed. If brakes feel spongy, bleed brakes.'
      },
      {
        n: 15,
        text: 'WARNING: After repairing brakes, test at low speed. If not operating properly, high speed testing can cause loss of control and death or serious injury.'
      },
      {
        n: 16,
        text: 'NOTE: Avoid hard stops for first 100 mi (160 km) to wear in brakes properly. Always replace both pads as a set for correct and safe brake operation.'
      }
    ]
  },

{
    id: 't20-maint-brake-pads-rear',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Replace Rear Brake Pads',
    summary: 'Remove and install rear brake pads with proper installation sequence.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-21'
    },
    figures: [],
    tools: [
      'C-clamp'
    ],
    parts: [
      {
        number: '',
        description: 'Rear brake pads',
        qty: 1
      },
      {
        number: '',
        description: 'Brake pad paste',
        qty: 1
      },
      {
        number: '',
        description: 'Pad pin (metric)',
        qty: 1
      },
      {
        number: '',
        description: 'Pad spring (if damaged)',
        qty: 1
      }
    ],
    torque: [
      {
        fastener: 'Brake pad pin',
        value: '75-102 in-lbs (8.5-11.5 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'Remove caliper. See FRONT BRAKE CALIPER (Page 3-34).'
      },
      {
        n: 2,
        text: 'Loosen master cylinder reservoir cap.'
      },
      {
        n: 3,
        text: 'Remove grit and debris from caliper piston area: Rinse area with warm soapy water, dry using low-pressure compressed air.'
      },
      {
        n: 4,
        text: 'Remove pads: Using old brake pad and C-clamp retract pistons fully into caliper, remove retaining clip, discard old pad pin, remove brake pads, inspect pad spring and replace if needed.'
      },
      {
        n: 5,
        text: 'Install pad spring: Install on flat in caliper so clips on spring engage indentations in caliper. Make sure forked end is on pad pin side of caliper.'
      },
      {
        n: 6,
        text: 'Install new brake pads: Apply paste supplied in kit to back of brake pads, insert each pad with square corner in slot of caliper, push pad pin tab into caliper.'
      },
      {
        n: 7,
        text: 'Install new pad pin. Torque 75-102 in-lbs (8.5-11.5 N·m).'
      },
      {
        n: 8,
        text: 'Install retaining clip.'
      },
      {
        n: 9,
        text: 'Tighten front master cylinder reservoir cap.'
      },
      {
        n: 10,
        text: 'Install caliper.'
      },
      {
        n: 11,
        text: 'Pump brakes to move pistons out until brake pads contact rotor. Verify piston location against pads.'
      },
      {
        n: 12,
        text: 'Check fluid level in brake master cylinder reservoir.'
      },
      {
        n: 13,
        text: 'Test brakes: Turn ignition ON, check operation of rear lamp, test ride at low speed. If brakes feel spongy, bleed brakes.'
      },
      {
        n: 14,
        text: 'WARNING: After repairing brakes, test at low speed. If not operating properly, high speed testing can cause loss of control and death or serious injury.'
      },
      {
        n: 15,
        text: 'NOTE: Avoid hard stops for first 100 mi (160 km) to wear in brakes properly. Always replace both pads as a set for correct and safe brake operation.'
      }
    ]
  },

{
    id: 't20-maint-brake-fluid',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Check and Replace Brake Fluid',
    summary: 'Check brake fluid level, test moisture content, and perform drain and replace procedure.',
    difficulty: 'Advanced',
    timeMinutes: 90,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-24'
    },
    figures: [],
    tools: [
      'DOT 4 Brake Fluid Moisture Tester HD-48497-A',
      'Basic Vacuum Brake Bleeder BB200A',
      'Digital Technician II HD-48650 (ABS models)'
    ],
    parts: [
      {
        number: '',
        description: 'DOT 4 Brake Fluid (41800219)',
        qty: 1
      }
    ],
    torque: [
      {
        fastener: 'Brake bleeder screw, front',
        value: '72-108 in-lbs (8.1-12.2 N·m)'
      },
      {
        fastener: 'Brake bleeder screw, rear',
        value: '75-102 in-lbs (8.5-11.5 N·m)'
      },
      {
        fastener: 'Brake master cylinder, front, reservoir cover screws',
        value: '12-15 in-lbs (1.4-1.7 N·m)'
      },
      {
        fastener: 'Brake master cylinder, rear, reservoir cover screws',
        value: '12-15 in-lbs (1.4-1.7 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'CHECK BRAKE FLUID LEVEL:'
      },
      {
        n: 2,
        text: 'Clean reservoir filler cap or cover before removing. Use only DOT 4 brake fluid from sealed container.'
      },
      {
        n: 3,
        text: 'At every service, check moisture content of fluid using DOT 4 Brake Fluid Moisture Tester HD-48497-A. Follow instructions included with tool.'
      },
      {
        n: 4,
        text: 'Flush brake system and replace DOT 4 fluid every two years or sooner if brake fluid test shows moisture content is 3% or greater.'
      },
      {
        n: 5,
        text: 'Fluid should never need to be added or removed during normal wear, except for fluid replacement as specified.'
      },
      {
        n: 6,
        text: 'Fluid level in reservoir will decrease with brake pad wear. Reservoir volume is adequate to provide fluid to wear limits.'
      },
      {
        n: 7,
        text: 'Position vehicle on flat level surface.'
      },
      {
        n: 8,
        text: 'Front brake: Position motorcycle and handlebar so master cylinder reservoir is level.'
      },
      {
        n: 9,
        text: 'Rear brake: Position motorcycle so master cylinder reservoir is level.'
      },
      {
        n: 10,
        text: 'View reservoir sight glass. Fluid level must be at or above minimum mark. If below minimum: Check brake system for leaks, check pads and rotors are properly installed and not worn beyond limits, add DOT 4 brake fluid if necessary.'
      },
      {
        n: 11,
        text: 'DRAIN AND REPLACE FLUID:'
      },
      {
        n: 12,
        text: 'Remove bleeder screw cap. Install Basic Vacuum Brake Bleeder BB200A to bleeder screw.'
      },
      {
        n: 13,
        text: 'Wrap clean shop towel around master cylinder reservoir to protect paint.'
      },
      {
        n: 14,
        text: 'Clean reservoir cover before removal.'
      },
      {
        n: 15,
        text: 'Remove cover from master cylinder reservoir.'
      },
      {
        n: 16,
        text: 'Add brake fluid as necessary. Verify proper operation of master cylinder relief port by actuating brake pedal or lever.'
      },
      {
        n: 17,
        text: 'Operate vacuum bleeder while maintaining fluid level. Open bleeder screw about 3/4 turn. Continue until specified volume replaced (non-ABS: front left 3 fl oz, front right 3 fl oz, rear 3 fl oz; ABS: front left 6 fl oz, front right 3 fl oz, rear 3 fl oz).'
      },
      {
        n: 18,
        text: 'Tighten bleeder screw. Install bleeder screw cap.'
      },
      {
        n: 19,
        text: 'Repeat with each caliper following sequence until all brake lines serviced.'
      },
      {
        n: 20,
        text: 'Fill reservoir to specified level.'
      },
      {
        n: 21,
        text: 'Clean gasket and sealing surfaces. Install master cylinder reservoir covers: Front cover with vent holes facing rear, rear cover as-is. Tighten to specification.'
      },
      {
        n: 22,
        text: 'ABS models: Use Digital Technician II HD-48650 and perform ABS Service procedure.'
      },
      {
        n: 23,
        text: 'Apply brakes to check proper lamp operation.'
      },
      {
        n: 24,
        text: 'Test brakes: Turn ignition ON, test ride. If feel spongy, perform bleeding procedure.'
      },
      {
        n: 25,
        text: 'INSPECT BRAKE LINES: Inspect for leaks, contact or abrasion. Steel lines okay if no marks or slight paint mark, replace if worn to bare material. Flexible lines replace if worn through cover or to bottom of ribs.'
      }
    ]
  },

{
    id: 't20-maint-clutch-fluid',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Check and Replace Hydraulic Clutch Fluid',
    summary: 'Check clutch fluid level and perform drain and replace of DOT 4 fluid.',
    difficulty: 'Advanced',
    timeMinutes: 75,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-27'
    },
    figures: [],
    tools: [
      'DOT 4 Brake Fluid Moisture Tester HD-48497-A',
      'Basic Vacuum Brake Bleeder BB200A'
    ],
    parts: [
      {
        number: '',
        description: 'DOT 4 Hydraulic Brake Fluid',
        qty: 1
      }
    ],
    torque: [
      {
        fastener: 'Clutch actuator bleeder screw',
        value: '56-75 in-lbs (6.3-8.5 N·m)'
      },
      {
        fastener: 'Clutch reservoir cover screws',
        value: '12-15 in-lbs (1.4-1.7 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'GENERAL: Clutch is hydraulically actuated. Master cylinder creates pressure in clutch fluid line. Pressure activates secondary clutch actuator. Actuator piston extends and contacts pushrod to disengage clutch.'
      },
      {
        n: 2,
        text: 'Check that clutch hand lever returns completely. If lever does not return completely, problems similar to over-filling can result.'
      },
      {
        n: 3,
        text: 'Inspect hydraulic clutch system for wear and leakage: Follow hydraulic line routing for abnormal wear, verify retaining clips and cable straps secure line adequately, look for evidence of leakage.'
      },
      {
        n: 4,
        text: 'CHECK HYDRAULIC CLUTCH FLUID:'
      },
      {
        n: 5,
        text: 'At every service, check moisture content of fluid using DOT 4 Brake Fluid Moisture Tester HD-48497-A. Follow instructions included with tool.'
      },
      {
        n: 6,
        text: 'Flush clutch system and replace DOT 4 fluid every two years or sooner if brake fluid test shows moisture content is 3% or greater.'
      },
      {
        n: 7,
        text: 'Adding or removing fluid should never be required during normal wear, except for replacement. Fluid level in reservoir will rise with clutch wear.'
      },
      {
        n: 8,
        text: 'REPLACE HYDRAULIC CLUTCH FLUID:'
      },
      {
        n: 9,
        text: 'Remove transmission outer side cover. See TRANSMISSION SIDE COVERS: HYDRAULIC CLUTCH (Page 5-9).'
      },
      {
        n: 10,
        text: 'Install Basic Vacuum Brake Bleeder BB200A to bleeder screw.'
      },
      {
        n: 11,
        text: 'Position vehicle or handlebar so master cylinder reservoir is level.'
      },
      {
        n: 12,
        text: 'Wrap clean shop towel around master cylinder reservoir to protect paint.'
      },
      {
        n: 13,
        text: 'Clean master cylinder reservoir cover before removal.'
      },
      {
        n: 14,
        text: 'Remove cover from master cylinder reservoir.'
      },
      {
        n: 15,
        text: 'WARNING: A plugged or covered relief port can cause clutch drag, which could lead to loss of control.'
      },
      {
        n: 16,
        text: 'Verify master cylinder operation: Add DOT 4 fluid as necessary, operate clutch lever.'
      },
      {
        n: 17,
        text: 'Carefully monitor fluid level in master cylinder reservoir. Add fluid before it empties to avoid drawing air.'
      },
      {
        n: 18,
        text: 'A slight bulge of fluid will break surface in reservoir if internal components working properly.'
      },
      {
        n: 19,
        text: 'Operate vacuum bleeder while maintaining fluid level: Open bleeder screw about 3/4 turn, continue until 3 fl oz (89 ml) replaced, tighten bleeder screw to 56-75 in-lbs (6.3-8.5 N·m).'
      },
      {
        n: 20,
        text: 'Install transmission outer side cover.'
      },
      {
        n: 21,
        text: 'Fill reservoir to specified level.'
      },
      {
        n: 22,
        text: 'Install master cylinder reservoir cover. Tighten to 12-15 in-lbs (1.4-1.7 N·m).'
      },
      {
        n: 23,
        text: 'Verify clutch operation.'
      },
      {
        n: 24,
        text: 'NOTE: Flush clutch system and replace DOT 4 fluid every two years per maintenance schedule. This procedure replaces fluid without introducing air. If air enters lines, revert to BLEED CLUTCH CONTROL SYSTEM (Page 3-84).'
      },
      {
        n: 25,
        text: 'DOT 4 hydraulic brake fluid is used in hydraulic clutch. Do not use other types as they are not compatible and could cause equipment damage.'
      }
    ]
  },

{
    id: 't20-maint-front-fork-rebuild',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Rebuild Front Fork and Replace Oil',
    summary: 'Disassemble, inspect, and rebuild front forks with new fork oil.',
    difficulty: 'Advanced',
    timeMinutes: 180,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-29'
    },
    figures: [],
    tools: [],
    parts: [
      {
        number: '',
        description: 'Type E Hydraulic Fork Oil (62600026)',
        qty: 1
      }
    ],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'For detailed scheduled maintenance procedure for front fork rebuild and oil replacement, see FRONT FORK (Page 3-60).'
      },
      {
        n: 2,
        text: 'This is a complex procedure requiring disassembly of fork legs, cleaning internal components, replacing worn seals and springs, filling with Type E Hydraulic Fork Oil (16 oz bottle), and reassembly.'
      },
      {
        n: 3,
        text: 'Schedule this procedure every 50,000 miles (80,000 km) or as indicated in maintenance schedule.'
      },
      {
        n: 4,
        text: 'Refer to Chapter 3, Section on FRONT FORK for complete procedure.'
      }
    ]
  },

{
    id: 't20-maint-steering-bearings-check',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Adjust and Lubricate Steering Head Bearings - Check and Adjust',
    summary: 'Check fork stem bearings for proper adjustment and perform swing-back measurement.',
    difficulty: 'Advanced',
    timeMinutes: 120,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-30'
    },
    figures: [],
    tools: [
      'Level',
      'Cardboard and tape',
      'Markers (3 colors)',
      'Measuring tape'
    ],
    parts: [],
    torque: [
      {
        fastener: 'Upper steering stem pinch screw',
        value: '22-26 ft-lbs (29.8-35.2 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'WARNING: Properly adjust fork stem bearings. Improper adjustments can affect stability and handling, resulting in death or serious injury.'
      },
      {
        n: 2,
        text: 'MEASURE SWING-BACK (front end freely oscillates side to side):'
      },
      {
        n: 3,
        text: 'Remove all accessory weight such as windshield bag contents or handlebar-mounted navigation unit.'
      },
      {
        n: 4,
        text: 'Models with cable clutch: Disconnect clutch cable from hand control and secure out of way.'
      },
      {
        n: 5,
        text: 'Models with hydraulic clutch: Leave fully assembled.'
      },
      {
        n: 6,
        text: 'Lower frame rails MUST be level in both directions for valid check.'
      },
      {
        n: 7,
        text: 'Raise vehicle until tires are off ground. Place block under rear tire. Lower vehicle until tire contacts block.'
      },
      {
        n: 8,
        text: 'Using level, verify lower frame rails are level front to rear and left to right.'
      },
      {
        n: 9,
        text: 'Swing front end from stop-to-stop to check for smooth movement.'
      },
      {
        n: 10,
        text: 'Attach lightweight cardboard (8-10 in/20-25 cm) to front fender centered and even with fender tip.'
      },
      {
        n: 11,
        text: 'Place stationary pointer tip near cardboard. With front wheel straight forward, center pointer on cardboard.'
      },
      {
        n: 12,
        text: 'Make initial marks: Use first color to mark point where front end just begins to swing back toward center after tapping tire left and right.'
      },
      {
        n: 13,
        text: 'Measure outboard specified distance from each mark (1 in/25.4 mm). Use second color to mark these points.'
      },
      {
        n: 14,
        text: 'Repeat two more times in each direction to validate marks.'
      },
      {
        n: 15,
        text: 'Mark swing-back stops: Turn front end until pointer is at left mark and release. Using third color, mark where swing-back stops. Repeat for right side.'
      },
      {
        n: 16,
        text: 'Repeat two more times in each direction to validate marks.'
      },
      {
        n: 17,
        text: 'Measure distance between final swing-back marks. Readings must be within specification. See Table 2-14 for model-specific specifications.'
      },
      {
        n: 18,
        text: 'NOTE: A clunk indicates loose fork stem. Grasp both forks near front axle and shake front to rear checking for clunk. If heard, perform lubrication procedure.'
      },
      {
        n: 19,
        text: 'NOTE: A measurement greater than specification indicates steering stem too tight. A measurement less indicates steering stem too loose. To adjust, see Adjusting Swing-Back procedure.'
      },
      {
        n: 20,
        text: 'This procedure is for 2-wheel vehicles only. Trike does not require this check due to steering damper use.'
      }
    ]
  },

{
    id: 't20-maint-steering-bearings-adjust',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Adjust and Lubricate Steering Head Bearings - Adjust Swing-Back',
    summary: 'Adjust steering stem bearings to achieve proper swing-back specification.',
    difficulty: 'Advanced',
    timeMinutes: 120,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-31'
    },
    figures: [],
    tools: [
      '1/4 inch drive extension 6 inches long'
    ],
    parts: [
      {
        number: '',
        description: 'Special Purpose Grease (99857-97A)',
        qty: 1
      }
    ],
    torque: [
      {
        fastener: 'Upper steering stem pinch screw',
        value: '22-26 ft-lbs (29.8-35.2 N·m)'
      },
      {
        fastener: 'Upper steering stem, first torque',
        value: '35 ft-lbs (47.5 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'Disassemble motorcycle: Road King models remove headlamp. Fork-mounted fairing models remove outer fairing. Frame-mounted fairing models remove instrument nacelle. Protect front fender from damage.'
      },
      {
        n: 2,
        text: 'Loosen upper steering stem pinch screw.'
      },
      {
        n: 3,
        text: 'Adjust steering stem: Engage 1/4 inch drive extension 6 inches long into bottom of upper steering stem. Based on swing-back dimension, tighten (to increase dimension) or loosen (to decrease dimension) upper steering stem a few degrees.'
      },
      {
        n: 4,
        text: 'It is important that all original mass be in place to accurately measure swing-back.'
      },
      {
        n: 5,
        text: 'Tighten steering stem pinch screw to 22-26 ft-lbs (29.8-35.2 N·m).'
      },
      {
        n: 6,
        text: 'Temporarily install all removed original equipment components. Do not tighten fasteners.'
      },
      {
        n: 7,
        text: 'Check swing-back. Repeat until swing-back is within specification.'
      },
      {
        n: 8,
        text: 'Assemble motorcycle: Road King models install headlamp. Fork-mounted fairing models install outer fairing. Frame-mounted fairing models install instrument nacelle.'
      },
      {
        n: 9,
        text: 'Install any accessories removed earlier.'
      },
      {
        n: 10,
        text: 'LUBRICATE: Disassemble motorcycle same as above.'
      },
      {
        n: 11,
        text: 'Remove upper fork bracket and handlebar as assembly. Support out of way. See STEERING HEAD (Page 3-67).'
      },
      {
        n: 12,
        text: 'Remove upper steering stem. See STEERING HEAD (Page 3-67).'
      },
      {
        n: 13,
        text: 'Remove grease with clean cloth or finger. Do not use solvent.'
      },
      {
        n: 14,
        text: 'Raise motorcycle until lower stem bearing has exited far enough to clean grease from bearing cup and cone.'
      },
      {
        n: 15,
        text: 'Wipe grease from upper and lower bearing cups and cones. Inspect parts for wear or damage.'
      },
      {
        n: 16,
        text: 'Pack bearings with Special Purpose Grease (99857-97A).'
      },
      {
        n: 17,
        text: 'Lower motorcycle until lower bearing just seats. Do not place entire weight of vehicle on bearing.'
      },
      {
        n: 18,
        text: 'Apply Special Purpose Grease to threads of upper and lower steering stems.'
      },
      {
        n: 19,
        text: 'Install upper steering stem. Tighten to 35 ft-lbs (47.5 N·m).'
      },
      {
        n: 20,
        text: 'Lower vehicle until forks begin to compress.'
      },
      {
        n: 21,
        text: 'Loosen upper steering stem 90-100 degrees. Tighten to specification per Table 2-15 (varies by model).'
      },
      {
        n: 22,
        text: 'Install upper fork bracket and handlebar. Assemble motorcycle.'
      },
      {
        n: 23,
        text: 'Check swing-back. Repeat until within specification.'
      },
      {
        n: 24,
        text: 'NOTE: A steering head too tight can interfere with ability to absorb weave. Too loose interferes with ability to absorb wobble.'
      }
    ]
  },

{
    id: 't20-maint-radiator-coolant',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Inspect Radiator and Coolant',
    summary: 'Clean radiator fins and inspect coolant for proper concentration and leaks.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-33'
    },
    figures: [],
    tools: [],
    parts: [
      {
        number: '',
        description: 'Genuine Harley-Davidson Extended Life Antifreeze and Coolant',
        qty: 1
      }
    ],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'CLEAN RADIATOR:'
      },
      {
        n: 2,
        text: 'Remove grille panel from lower fairing: Carefully pry on curved edge of panel to release latches, remove from fascia.'
      },
      {
        n: 3,
        text: 'Clean debris from radiator fins.'
      },
      {
        n: 4,
        text: 'Install grille panel back into place.'
      },
      {
        n: 5,
        text: 'CHECK FREEZE POINT: For this scheduled maintenance procedure, see DIAGNOSE AND TEST (Page 7-5).'
      },
      {
        n: 6,
        text: 'CHECK FOR LEAKS: For this scheduled maintenance procedure, see DIAGNOSE AND TEST (Page 7-5).'
      },
      {
        n: 7,
        text: 'DRAIN AND FILL COOLING SYSTEM: For this scheduled maintenance procedure, see COOLANT (Page 7-8).'
      },
      {
        n: 8,
        text: 'NOTICE: Use only Genuine Harley-Davidson Extended Life Antifreeze and Coolant. Use of other coolants/mixtures may lead to motorcycle damage.'
      },
      {
        n: 9,
        text: 'Genuine Harley-Davidson Extended Life Antifreeze and Coolant is pre-diluted and ready to use full strength. It provides temperature protection to -34°F (-36.7°C). DO NOT add water.'
      },
      {
        n: 10,
        text: 'De-ionized water must be used with antifreeze in cooling system. Hard water can cause scale accumulation in water passages reducing cooling efficiency, leading to overheating and motorcycle damage.'
      },
      {
        n: 11,
        text: 'If Genuine Harley-Davidson Extended Life Antifreeze and Coolant unavailable, mixture of de-ionized water and ethylene glycol-based antifreeze may be used. At first opportunity, change back to Genuine Harley-Davidson product.'
      }
    ]
  },

{
    id: 't20-maint-fuel-lines',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Inspect Fuel Lines and Fittings',
    summary: 'Inspect fuel lines and fittings for leaks, contact or abrasion damage.',
    difficulty: 'Easy',
    timeMinutes: 15,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-34'
    },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'For this scheduled maintenance procedure, see FUEL LINE (Page 6-7).'
      },
      {
        n: 2,
        text: 'Visually inspect all fuel lines and connections for leaks.'
      },
      {
        n: 3,
        text: 'Check for signs of abrasion, contact with other components, cracks or damage.'
      },
      {
        n: 4,
        text: 'Verify that fuel line routing is secure and does not contact sharp edges or hot surfaces.'
      },
      {
        n: 5,
        text: 'Check fuel line clamps and fittings are tight and secure.'
      }
    ]
  },

{
    id: 't20-maint-jiffy-stand',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Inspect and Lubricate Jiffy Stand',
    summary: 'Inspect jiffy stand pivot for wear and lubricate for smooth operation.',
    difficulty: 'Easy',
    timeMinutes: 15,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-35'
    },
    figures: [],
    tools: [],
    parts: [
      {
        number: '',
        description: 'Anti-Seize Lubricant (98960-97)',
        qty: 1
      }
    ],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'For this scheduled maintenance procedure, see JIFFY STAND (Page 3-146).'
      },
      {
        n: 2,
        text: 'Inspect jiffy stand for proper operation: Stand should extend and retract smoothly, spring should return stand to up position with firm pressure.'
      },
      {
        n: 3,
        text: 'Clean stand of debris and corrosion.'
      },
      {
        n: 4,
        text: 'Lubricate stand pivot point with Anti-Seize Lubricant.'
      },
      {
        n: 5,
        text: 'Check stand switch operation: Stand switch should cut engine ignition when stand is down and transmission is in gear.'
      },
      {
        n: 6,
        text: 'Verify that stand does not contact tires or fender when deployed or retracted.'
      }
    ]
  },

{
    id: 't20-maint-belt-inspect',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Inspect Drive Belt and Sprockets - Inspect Belt',
    summary: 'Inspect drive belt for wear, damage, and proper tension.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-36'
    },
    figures: [],
    tools: [
      'Belt Tension Gauge HD-35381-A',
      'Sharp object for chrome plating test'
    ],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'GENERAL: In case of stone damage to belt, inspect sprockets for damage and replace as required. If replacing belt, always replace both transmission and rear sprockets.'
      },
      {
        n: 2,
        text: 'Keep dirt, grease, oil, and debris off drive belt and sprockets. Clean belt with rag slightly dampened with light cleaning agent.'
      },
      {
        n: 3,
        text: 'SPROCKETS:'
      },
      {
        n: 4,
        text: 'Inspect each tooth of rear sprocket for: Major tooth damage, large chrome chips with sharp edges, gouges caused by hard objects, excessive loss of chrome plating.'
      },
      {
        n: 5,
        text: 'Check for worn chrome plating: Drag sharp object across bottom of groove using medium pressure. If object slides without digging or leaving mark, chrome is still good. If object digs in and leaves mark, chrome plating is worn.'
      },
      {
        n: 6,
        text: 'Replace rear sprocket if major tooth damage or loss of chrome exists.'
      },
      {
        n: 7,
        text: 'DRIVE BELT:'
      },
      {
        n: 8,
        text: 'Inspect drive belt for: Cuts or unusual wear patterns, outside bevel wear (some beveling common but indicates misalignment), outside ribbed surface for stone damage, inside (toothed) portion for exposed tensile cords, puncture or cracking at base of teeth.'
      },
      {
        n: 9,
        text: 'Replace belt immediately if cracks extend to edge of belt as failure is imminent.'
      },
      {
        n: 10,
        text: 'Conditions requiring replacement: External tooth cracks, missing teeth, hook wear, stone damage on edge.'
      },
      {
        n: 11,
        text: 'Monitor conditions (not immediate replacement): Internal tooth cracks, chipping not serious, fuzzy edge cord, bevel wear outboard edge only.'
      },
      {
        n: 12,
        text: 'MEASURE DRIVE BELT DEFLECTION:'
      },
      {
        n: 13,
        text: 'Always use Belt Tension Gauge HD-35381-A to measure deflection. Failure to use gauge may cause under-tensioned belts.'
      },
      {
        n: 14,
        text: 'Check deflection: With transmission in neutral, motorcycle at ambient temperature, motorcycle upright or on jiffy stand with rear wheel on ground.'
      },
      {
        n: 15,
        text: 'Disarm security system. Remove main fuse. Shift transmission to neutral.'
      },
      {
        n: 16,
        text: 'When adjusting new belt, rotate rear wheel few revolutions prior to setting tension.'
      },
      {
        n: 17,
        text: 'Measure belt deflection: Slide O-ring to zero mark, fit belt cradle against bottom of drive belt (in belt deflection window if equipped, or halfway between drive pulleys if not), press upward on knob until O-ring slides down to 10 lb mark.'
      },
      {
        n: 18,
        text: 'Models with belt deflection window: Measure deflection as viewed through window (each graduation approximately 1/16 in/1.6 mm). All other models: Measure amount of deflection.'
      },
      {
        n: 19,
        text: 'Service belt tension specification is for belts with more than 1000 mi (1,600 km). Set to new belt tension if less than 1000 mi.'
      },
      {
        n: 20,
        text: 'Compare with specifications (Table 2-17): FLHX, FLHXS, FLTRX models 1/4-7/16 in (6.4-11.1 mm), all others 3/8-9/16 in (9.5-14.3 mm).'
      },
      {
        n: 21,
        text: 'If not within specifications, consult authorized Harley-Davidson dealer.'
      },
      {
        n: 22,
        text: 'Install main fuse.'
      }
    ]
  },

{
    id: 't20-maint-belt-adjust',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Inspect Drive Belt and Sprockets - Adjust Belt',
    summary: 'Adjust drive belt tension to proper specification.',
    difficulty: 'Advanced',
    timeMinutes: 90,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-37'
    },
    figures: [],
    tools: [
      'Axle Nut Torque Adapter HD-47925',
      'Belt Tension Gauge HD-35381-A',
      'Breaker bar',
      'Torque wrench'
    ],
    parts: [
      {
        number: '',
        description: 'E-clip (new)',
        qty: 1
      }
    ],
    torque: [
      {
        fastener: 'Muffler to saddlebag support screws',
        value: '14-18 ft-lbs (19-24.4 N·m)'
      },
      {
        fastener: 'Rear axle cone nut, 1st torque',
        value: '15-20 ft-lbs (20-27 N·m)'
      },
      {
        fastener: 'Rear axle cone nut, final torque',
        value: '135-145 ft-lbs (183-196.6 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'PREPARE:'
      },
      {
        n: 2,
        text: 'Disarm security system. Remove main fuse.'
      },
      {
        n: 3,
        text: 'Remove both saddlebags.'
      },
      {
        n: 4,
        text: 'If Axle Nut Torque Adapter HD-47925 not available, remove both mufflers. See MUFFLERS (Page 6-33).'
      },
      {
        n: 5,
        text: 'ADJUST:'
      },
      {
        n: 6,
        text: 'Remove and discard E-clip from groove at end of axle.'
      },
      {
        n: 7,
        text: 'Install adapter perpendicular to breaker bar. For best clearance with muffler, install torque adapter on outboard side. Special Tool: Axle Nut Torque Adapter HD-47925.'
      },
      {
        n: 8,
        text: 'NOTE: Torque wrench must be perpendicular to torque adapter to obtain proper torque.'
      },
      {
        n: 9,
        text: 'Loosen cone nut.'
      },
      {
        n: 10,
        text: 'Install adapter on torque wrench, perpendicular to torque wrench. Special Tool: Axle Nut Torque Adapter HD-47925.'
      },
      {
        n: 11,
        text: 'Push wheel forward. Verify that cam contacts boss on both sides of rear fork.'
      },
      {
        n: 12,
        text: 'Snug cone nut. Torque 15-20 ft-lbs (20-27 N·m) Rear axle cone nut, 1st torque.'
      },
      {
        n: 13,
        text: 'NOTE: It is beneficial to use second Axle Nut Torque Adapter to rotate and hold weld nut. Position of breaker bar or ratchet in relation to tool not important. Check belt deflection as adjustment is made.'
      },
      {
        n: 14,
        text: 'Adjust belt tension: Rotate weld nut on left side to adjust belt tension. Turn clockwise to tighten or counterclockwise to loosen. If loosening belt tension, push wheel forward. Verify both cams touch bosses on both sides after weld nut rotated.'
      },
      {
        n: 15,
        text: 'ASSEMBLE:'
      },
      {
        n: 16,
        text: 'Hold weld nut and tighten cone nut. Torque 135-145 ft-lbs (183-196.6 N·m) Rear axle cone nut, final torque.'
      },
      {
        n: 17,
        text: 'Again, verify cams touch bosses on both sides of rear fork and belt deflection still within specification.'
      },
      {
        n: 18,
        text: 'With flat side out, install new E-clip in groove on right side of axle.'
      },
      {
        n: 19,
        text: 'COMPLETE:'
      },
      {
        n: 20,
        text: 'If removed, install fasteners that attach mufflers to saddlebag frames and tighten. Torque 14-18 ft-lbs (19-24.4 N·m) Muffler to saddlebag support screws.'
      },
      {
        n: 21,
        text: 'Install saddlebags.'
      },
      {
        n: 22,
        text: 'Install main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 23,
        text: 'NOTE: Do not allow weld nut to rotate once belt tension is correct.'
      }
    ]
  },

{
    id: 't20-maint-rear-sprocket-isolator',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Inspect Rear Sprocket Isolator',
    summary: 'Check rear sprocket compensator for excessive wear and deterioration.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-41'
    },
    figures: [],
    tools: [
      'Weighted string',
      'Masking tape',
      'Measuring tape'
    ],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Support vehicle in upright position in neutral. Do not lift wheels off ground.'
      },
      {
        n: 2,
        text: 'Remove left saddlebag.'
      },
      {
        n: 3,
        text: 'Hang weighted string on left axle spacer as close as possible to, but not touching, rear sprocket.'
      },
      {
        n: 4,
        text: 'Place masking tape on face of sprocket where marks will be drawn.'
      },
      {
        n: 5,
        text: 'WARNING: Do not allow rear wheel to rotate when rotating sprocket or false measurement will occur.'
      },
      {
        n: 6,
        text: 'Rotate rear sprocket by hand in one direction until it stops.'
      },
      {
        n: 7,
        text: 'While holding sprocket in place, mark masking tape in line with string.'
      },
      {
        n: 8,
        text: 'Rotate rear sprocket in opposite direction until it stops.'
      },
      {
        n: 9,
        text: 'While holding sprocket in place, make second mark in line with string.'
      },
      {
        n: 10,
        text: 'Measure distance along edge of sprocket between marks. If measurement exceeds 0.400 in (10.2 mm), replace rubber isolator.'
      },
      {
        n: 11,
        text: 'NOTE: Excessive play in compensator components caused by deteriorated rubber segments. Wear on raised nubs or small amounts of rubber debris are normal and do not indicate worn out isolator.'
      },
      {
        n: 12,
        text: 'Visually inspect components when disassembled. See REAR WHEEL COMPENSATOR (Page 3-19) to repair rear wheel compensator.'
      }
    ]
  },

{
    id: 't20-maint-suspension-adjust',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Adjust Suspension',
    summary: 'Adjust shock absorber preload for total weight the motorcycle will carry.',
    difficulty: 'Easy',
    timeMinutes: 15,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-42'
    },
    figures: [],
    tools: [],
    parts: [],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'Remove left saddlebag.'
      },
      {
        n: 2,
        text: 'A preload table wallet card is provided at back of owner\'s manual for convenience.'
      },
      {
        n: 3,
        text: 'Rotate preload adjustment knob to desired setting for expected load. Knob will click after each half turn. Refer to Table 2-18 (Standard Length Shocks with Tour-Pak), Table 2-19 (Standard Length without Tour-Pak), or Table 2-20 (Low Length Shocks with or without Tour-Pak).'
      },
      {
        n: 4,
        text: 'Adjust total weight = rider weight + passenger weight + cargo and accessories.'
      },
      {
        n: 5,
        text: 'Turn knob half turns to fine tune ride if desired.'
      },
      {
        n: 6,
        text: 'Install left saddlebag.'
      },
      {
        n: 7,
        text: 'NOTE: Increase preload to accommodate more weight. Reduce preload if carrying less weight.'
      }
    ]
  },

{
    id: 't20-maint-exhaust-system',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Inspect Exhaust System',
    summary: 'Check exhaust system for leaks, cracks, and loose fasteners.',
    difficulty: 'Moderate',
    timeMinutes: 30,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-44'
    },
    figures: [],
    tools: [],
    parts: [
      {
        number: '',
        description: 'Permatex Ultra Copper or Loctite 5920 Flange Sealant (if needed)',
        qty: 1
      }
    ],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'LEAK CHECK:'
      },
      {
        n: 2,
        text: 'Check exhaust system for obvious signs of leakage such as carbon tracks and marks at pipe joints.'
      },
      {
        n: 3,
        text: 'a. Check for loose or missing fasteners.'
      },
      {
        n: 4,
        text: 'b. Check for cracked pipe clamps or brackets.'
      },
      {
        n: 5,
        text: 'c. Check for loose or cracked exhaust shields.'
      },
      {
        n: 6,
        text: 'Check exhaust system for audible signs of leakage: Start engine, cover end of muffler with clean dry shop towel, listen for signs of exhaust leakage.'
      },
      {
        n: 7,
        text: 'CORRECT LEAKS:'
      },
      {
        n: 8,
        text: 'Correct any detected leaks: See EXHAUST SYSTEM (Page 6-34). Disassemble exhaust system. Clean all mating surfaces. Repair or replace damaged components. Assemble exhaust system.'
      },
      {
        n: 9,
        text: 'NOTE: If leak continues, disassemble and apply Permatex Ultra Copper or Loctite 5920 Flange Sealant or equivalent oxygen sensor/catalyst-safe alternative to mating surfaces.'
      },
      {
        n: 10,
        text: 'Inspect for missing or damaged fasteners and retighten as necessary.'
      },
      {
        n: 11,
        text: 'Check that all exhaust shields are properly positioned and secured.'
      }
    ]
  },

{
    id: 't20-maint-air-filter',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Inspect Air Filter',
    summary: 'Remove, clean, and inspect air filter element and components.',
    difficulty: 'Easy',
    timeMinutes: 30,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-45'
    },
    figures: [],
    tools: [],
    parts: [
      {
        number: '',
        description: 'Air filter element (if replacement needed)',
        qty: 1
      },
      {
        number: '',
        description: 'Loctite 243 Medium Strength Threadlocker (blue)',
        qty: 1
      }
    ],
    torque: [
      {
        fastener: 'Air cleaner cover screw',
        value: '36-60 in-lbs (4.1-6.8 N·m)'
      },
      {
        fastener: 'Air filter element screws',
        value: '40-60 in-lbs (4.5-6.8 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'REMOVE:'
      },
      {
        n: 2,
        text: 'Remove air cleaner cover: Remove screw, remove cover.'
      },
      {
        n: 3,
        text: 'Remove filter element: Remove screws, remove filter element while pulling breather tube from element.'
      },
      {
        n: 4,
        text: 'CLEAN AND INSPECT:'
      },
      {
        n: 5,
        text: 'Remove breather tube from breather bolts.'
      },
      {
        n: 6,
        text: 'WARNING: Do not strike filter element on hard surface to dislodge dirt. Do not use air cleaner filter oil on Harley-Davidson paper/wire mesh air filter element.'
      },
      {
        n: 7,
        text: 'Inspect breather tube and fittings for damage.'
      },
      {
        n: 8,
        text: 'WARNING: Do not use gasoline or solvents to clean filter element. Flammable cleaning agents can cause intake system fire.'
      },
      {
        n: 9,
        text: 'Clean filter element: Wash filter element and breather tubes in lukewarm water with mild detergent. Allow to air dry or use low-pressure compressed air from inside. Hold filter element up to strong light source. Element is sufficiently clean when light is uniformly visible through media. Replace element if damaged or cannot be adequately cleaned.'
      },
      {
        n: 10,
        text: 'Verify that rubber seal is properly seated and not damaged.'
      },
      {
        n: 11,
        text: 'INSTALL:'
      },
      {
        n: 12,
        text: 'Install filter element: Install breather tube, install filter element while pushing breather tube into element, install screws and tighten to 40-60 in-lbs (4.5-6.8 N·m).'
      },
      {
        n: 13,
        text: 'Install air cleaner cover: Apply Loctite 243 Medium Strength Threadlocker (blue) to threads of screw, install cover, install screw and tighten to 36-60 in-lbs (4.1-6.8 N·m).'
      }
    ]
  },

{
    id: 't20-maint-battery',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Inspect Battery',
    summary: 'Clean battery terminals, check voltage, test charge condition, and perform battery maintenance.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-46'
    },
    figures: [],
    tools: [
      'Voltmeter',
      'Wire brush or sandpaper'
    ],
    parts: [
      {
        number: '',
        description: 'Electrical Contact Lubricant (11300004)',
        qty: 1
      },
      {
        number: '',
        description: 'Baking soda solution (5 tsp per liter water)',
        qty: 1
      }
    ],
    torque: [
      {
        fastener: 'Battery cables screws',
        value: '60-70 in-lbs (6.8-7.9 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'PREPARE:'
      },
      {
        n: 2,
        text: 'Remove seat. See SEAT (Page 3-148).'
      },
      {
        n: 3,
        text: 'Move top caddy away from battery.'
      },
      {
        n: 4,
        text: 'REMOVE:'
      },
      {
        n: 5,
        text: 'Disconnect both battery cables, negative cable first.'
      },
      {
        n: 6,
        text: 'Pull up on battery strap to raise battery.'
      },
      {
        n: 7,
        text: 'Remove battery.'
      },
      {
        n: 8,
        text: 'INSTALL:'
      },
      {
        n: 9,
        text: 'Run battery strap rearward across bottom of battery tray, then up and across frame crossmember.'
      },
      {
        n: 10,
        text: 'Place battery into battery tray, terminal side forward.'
      },
      {
        n: 11,
        text: 'WARNING: Connect positive (+) battery cable first. If cable contacts ground with negative cable connected, sparks can cause battery explosion.'
      },
      {
        n: 12,
        text: 'Connect both battery cables, positive battery cable first. Tighten. Torque 60-70 in-lbs (6.8-7.9 N·m) Battery cables screws.'
      },
      {
        n: 13,
        text: 'WARNING: Connect cables to correct battery terminals. Failure to do so could result in damage to electrical system.'
      },
      {
        n: 14,
        text: 'WARNING: Do not over-tighten bolts on battery terminals. Use recommended torque values.'
      },
      {
        n: 15,
        text: 'NOTICE: Keep battery clean and lightly coat terminals with petroleum jelly to prevent corrosion.'
      },
      {
        n: 16,
        text: 'Apply light coat of petroleum or electrical contact lubricant to both battery terminals.'
      },
      {
        n: 17,
        text: 'Fold battery strap over top of battery.'
      },
      {
        n: 18,
        text: 'CLEAN AND INSPECT:'
      },
      {
        n: 19,
        text: 'Battery top must be clean and dry. Dirt and electrolyte on top causes self-discharge.'
      },
      {
        n: 20,
        text: 'Clean battery top: Mix solution of 5 teaspoons baking soda per liter/quart water, apply to battery top, when solution stops bubbling rinse off battery with clean water.'
      },
      {
        n: 21,
        text: 'Clean cable connectors and battery terminals with wire brush or sandpaper. Remove any oxidation.'
      },
      {
        n: 22,
        text: 'Inspect battery terminal screws and cables for breakage, loose connections, and corrosion.'
      },
      {
        n: 23,
        text: 'Check battery terminals for melting or damage.'
      },
      {
        n: 24,
        text: 'Inspect battery for discoloration, raised top, or warped or distorted case. Replace as necessary.'
      },
      {
        n: 25,
        text: 'Inspect battery case for cracks or leaks.'
      },
      {
        n: 26,
        text: 'VOLTAGE TEST:'
      },
      {
        n: 27,
        text: 'Voltage test provides general indicator of battery condition. Check battery voltage to verify fully charged.'
      },
      {
        n: 28,
        text: 'If open circuit (disconnected) voltage reading below 12.6V: Charge battery, check voltage after battery sets for at least one hour.'
      },
      {
        n: 29,
        text: 'If voltage reading 12.7V or above: Perform battery diagnostic test. See electrical diagnostic manual for load test procedure.'
      },
      {
        n: 30,
        text: 'Voltage specifications: 12.7V = 100% charge, 12.6V = 75% charge, 12.3V = 50% charge, 12.0V = 25% charge, 11.8V = 0% charge.'
      },
      {
        n: 31,
        text: 'STORAGE:'
      },
      {
        n: 32,
        text: 'Battery is affected by self-discharge whether stored in or out of vehicle. Battery in vehicle also affected by parasitic loads.'
      },
      {
        n: 33,
        text: 'Batteries self-discharge faster at higher ambient temperatures. Store battery in cool, dry place to reduce self-discharge rate.'
      },
      {
        n: 34,
        text: 'Charge battery every two weeks if stored in vehicle. Charge battery once per month if removed from vehicle.'
      },
      {
        n: 35,
        text: 'Use Harley-Davidson constant monitoring battery charger/tender for extended storage to maintain charge without overcharging or boiling.'
      },
      {
        n: 36,
        text: 'COMPLETE:'
      },
      {
        n: 37,
        text: 'Install top caddy.'
      },
      {
        n: 38,
        text: 'Install seat.'
      }
    ]
  },

{
    id: 't20-maint-spark-plugs',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Clean and Inspect Spark Plugs',
    summary: 'Remove, clean, inspect, and reinstall spark plugs with proper gap.',
    difficulty: 'Moderate',
    timeMinutes: 45,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-48'
    },
    figures: [],
    tools: [
      'HD-52006 Adjustable Spark Plug Wire Puller (if needed)',
      'Wire-type feeler gauge',
      'Electrode bending tool'
    ],
    parts: [
      {
        number: '',
        description: 'Spark plugs HD-6R10 (if replacement needed)',
        qty: 1
      }
    ],
    torque: [
      {
        fastener: 'Spark plug',
        value: '89-133 in-lbs (10-15 N·m)'
      }
    ],
    steps: [
      {
        n: 1,
        text: 'PREPARE:'
      },
      {
        n: 2,
        text: 'Remove main fuse. See POWER DISCONNECT (Page 8-8).'
      },
      {
        n: 3,
        text: 'NOTE: Fuel tank removal improves access to right spark plugs.'
      },
      {
        n: 4,
        text: 'Remove fuel tank. See FUEL TANK (Page 6-9).'
      },
      {
        n: 5,
        text: 'REMOVE:'
      },
      {
        n: 6,
        text: 'WARNING: Disconnecting spark plug cable with engine running can result in electric shock and death or serious injury.'
      },
      {
        n: 7,
        text: 'NOTE: Never remove spark plugs until heads have cooled. Use HD-52006 (Adjustable Spark Plug Wire Puller) to remove stubborn spark plug boots.'
      },
      {
        n: 8,
        text: 'Disconnect spark plug cables.'
      },
      {
        n: 9,
        text: 'Remove spark plugs.'
      },
      {
        n: 10,
        text: 'CLEAN AND INSPECT:'
      },
      {
        n: 11,
        text: 'NOTE: Discard plugs with eroded electrodes, heavy deposits, or cracked insulator.'
      },
      {
        n: 12,
        text: 'Compare plug deposits to Table 2-22. Wet black and shiny (worn pistons/rings/valves/seals/weak battery/faulty ignition), dry fluffy sooty black (rich air-fuel mixture), light brown glassy (lean mixture/hot engine/valves not seating/improper timing - may crack insulator), white gray tan powdery (balanced combustion - clean off deposits).'
      },
      {
        n: 13,
        text: 'INSTALL:'
      },
      {
        n: 14,
        text: 'Verify proper gap before installing new or cleaned spark plugs: Select wire-type feeler gauge within specification (0.031-0.035 in/0.8-0.9 mm for all models), pass wire gauge between electrodes, use proper tool to bend outer electrode to bring gap within specification.'
      },
      {
        n: 15,
        text: 'Verify spark plug threads are clean and dry.'
      },
      {
        n: 16,
        text: 'Install spark plug. Tighten. Torque 89-133 in-lbs (10-15 N·m).'
      },
      {
        n: 17,
        text: 'Connect spark plug cables. Check connections at coil, spark plugs, and anchor clips or harness caddies.'
      },
      {
        n: 18,
        text: 'Spark plug specification: Type HD-6R10, gap 0.031-0.035 in (0.8-0.9 mm), torque 89-133 in-lbs (10-15 N·m).'
      },
      {
        n: 19,
        text: 'COMPLETE:'
      },
      {
        n: 20,
        text: 'Install fuel tank.'
      },
      {
        n: 21,
        text: 'Install main fuse.'
      }
    ]
  },

{
    id: 't20-maint-storage',
    bikeIds: [
      'touring-2020'
    ],
    system: 'maintenance',
    title: 'Motorcycle Storage',
    summary: 'Prepare motorcycle for storage and perform pre-riding checks when returning to service.',
    difficulty: 'Advanced',
    timeMinutes: 180,
    source: {
      manual: '2020 HD Touring Service Manual',
      page: '2-50'
    },
    figures: [],
    tools: [],
    parts: [
      {
        number: '',
        description: 'Fuel stabilizer',
        qty: 1
      },
      {
        number: '',
        description: 'Engine oil',
        qty: 1
      },
      {
        number: '',
        description: 'Storage cover (breathable material)',
        qty: 1
      }
    ],
    torque: [],
    steps: [
      {
        n: 1,
        text: 'PLACE IN STORAGE:'
      },
      {
        n: 2,
        text: 'WARNING: Do not store motorcycle with gasoline in tank within home or garage where open flames, pilot lights, sparks or electric motors present. Gasoline extremely flammable and explosive.'
      },
      {
        n: 3,
        text: 'Change engine oil and filter. See REPLACE ENGINE OIL AND FILTER (Page 2-9).'
      },
      {
        n: 4,
        text: 'Check transmission lubricant level. See REPLACE TRANSMISSION LUBRICANT (Page 2-13).'
      },
      {
        n: 5,
        text: 'Prepare fuel tank: Fill fuel tank, add fuel stabilizer.'
      },
      {
        n: 6,
        text: 'WARNING: Avoid spills. Slowly remove filler cap. Do not fill above bottom of filler neck insert. Gasoline extremely flammable and explosive.'
      },
      {
        n: 7,
        text: 'WARNING: Use care when refueling. Pressurized air in fuel tank can force gasoline to escape through filler tube.'
      },
      {
        n: 8,
        text: 'Lubricate cylinders: Remove spark plugs (see CLEAN AND INSPECT SPARK PLUGS Page 2-48), inject few squirts of engine oil into each cylinder, crank engine 5-6 revolutions, install spark plugs.'
      },
      {
        n: 9,
        text: 'Inspect drive belt deflection. See INSPECT AND ADJUST DRIVE BELT AND SPROCKETS (Page 2-36).'
      },
      {
        n: 10,
        text: 'Inspect drive belt and sprockets. See INSPECT AND ADJUST DRIVE BELT AND SPROCKETS (Page 2-36).'
      },
      {
        n: 11,
        text: 'Inspect air cleaner filter. See INSPECT AIR FILTER (Page 2-45).'
      },
      {
        n: 12,
        text: 'Lubricate controls. See LUBRICATE CABLES AND CHASSIS (Page 2-18).'
      },
      {
        n: 13,
        text: 'Check tire inflation and inspect tires for wear or damage. See INSPECT TIRES AND WHEELS (Page 2-15).'
      },
      {
        n: 14,
        text: 'If motorcycle will be stored for extended period, securely support under frame so all weight is off tires.'
      },
      {
        n: 15,
        text: 'Inspect operation of all electrical equipment and switches.'
      },
      {
        n: 16,
        text: 'WARNING: Be sure brake fluid or other lubricants do not contact brake pads or discs. Such contact can adversely affect braking ability.'
      },
      {
        n: 17,
        text: 'Wash painted and chrome-plated surfaces. Apply light film of oil to exposed unpainted surfaces.'
      },
      {
        n: 18,
        text: 'Battery maintenance:'
      },
      {
        n: 19,
        text: 'WARNING: Unplug or turn OFF battery charger before connecting cables to battery. Connecting with charger ON can cause spark and battery explosion.'
      },
      {
        n: 20,
        text: 'Remove battery from vehicle. See INSPECT BATTERY (Page 2-46).'
      },
      {
        n: 21,
        text: 'Charge battery until correct voltage obtained.'
      },
      {
        n: 22,
        text: 'If stored at temperatures below 60°F (16°C): Charge battery every other month.'
      },
      {
        n: 23,
        text: 'If stored at temperatures above 60°F (16°C): Charge battery once a month.'
      },
      {
        n: 24,
        text: 'WARNING: Explosive hydrogen gas escapes during charging, could cause death or serious injury. Charge in well-ventilated area. Keep open flames, electrical sparks and smoking materials away from battery.'
      },
      {
        n: 25,
        text: 'WARNING: Unplug or turn OFF battery charger before disconnecting cables from battery. Disconnecting with charger ON can cause spark and battery explosion.'
      },
      {
        n: 26,
        text: 'Covering motorcycle:'
      },
      {
        n: 27,
        text: 'If motorcycle to be covered, use material that will breathe, such as Harley-Davidson storage cover or light canvas.'
      },
      {
        n: 28,
        text: 'Plastic materials that do not breathe promote condensation formation, leading to corrosion.'
      },
      {
        n: 29,
        text: 'REMOVE FROM STORAGE:'
      },
      {
        n: 30,
        text: 'WARNING: Clutch failing to disengage can cause loss of control. Prior to starting after extended storage, place transmission in gear and push vehicle back and forth several times to assure proper clutch disengagement.'
      },
      {
        n: 31,
        text: 'Charge battery.'
      },
      {
        n: 32,
        text: 'Install battery. See INSPECT BATTERY (Page 2-46).'
      },
      {
        n: 33,
        text: 'Inspect spark plugs. See CLEAN AND INSPECT SPARK PLUGS (Page 2-48).'
      },
      {
        n: 34,
        text: 'Fill fuel tank if empty.'
      },
      {
        n: 35,
        text: 'Start engine. Run until reaches normal operating temperature.'
      },
      {
        n: 36,
        text: 'Check engine oil level. See REPLACE ENGINE OIL AND FILTER (Page 2-9).'
      },
      {
        n: 37,
        text: 'Check transmission lubricant level. See REPLACE TRANSMISSION LUBRICANT (Page 2-13).'
      },
      {
        n: 38,
        text: 'Perform all checks in PRE-RIDING CHECKLIST in owner\'s manual.'
      }
    ]
  },

{
  id: 't20-alternator-remove-install',
  bikeIds: ["touring-2020"],
  system: 'electrical',
  title: 'Alternator - Remove and Install',
  summary: 'Remove and install alternator stator and rotor assembly with proper torque specifications.',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 12 },
  figures: [],
  tools: ["ALTERNATOR ROTOR REMOVER AND INSTALLER (HD-52073)"],
  parts: [
    { number: '', description: 'Stator mounting screws (new)', qty: 3 },
    { number: '', description: 'Grommet', qty: 1 },
  ],
  torque: [
    { fastener: 'Stator mounting screws', value: '55-75 in-lbs (6.2-8.5 N·m)' },
  ],
  steps: [
    { n: 1, text: 'Remove primary chaincase cover and chain/sprocket components.' },
    { n: 2, text: 'Remove starter.' },
    { n: 3, text: 'Remove rotor using HD-52073 tool. CAUTION: Powerful magnets - prevent hand injury.' },
    { n: 4, text: 'Remove stator screws (discard) and grommet. Apply alcohol cleaner to crankcase.' },
    { n: 5, text: 'Install new stator screws. Torque: 55-75 in-lbs (6.2-8.5 N·m).' },
    { n: 6, text: 'Install grommet and cable strap. Verify stator wire clearance from engine.' },
    { n: 7, text: 'Apply dielectric grease to connector. ELECTRICAL CONTACT LUBRICANT (11300004).' },
    { n: 8, text: 'Install rotor slowly using tool. Reassemble primary case and components.' },
  ],
},
{
  id: 't20-voltage-regulator-remove-install',
  bikeIds: ["touring-2020"],
  system: 'electrical',
  title: 'Voltage Regulator - Remove and Install',
  summary: 'Remove and install voltage regulator with coolant downtube assembly.',
  difficulty: 'Moderate',
  timeMinutes: 40,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 14 },
  figures: [],
  tools: [],
  parts: [
  ],
  torque: [
    { fastener: 'Voltage regulator screws', value: '96-120 in-lbs (10.8-13.6 N·m)' },
    { fastener: 'Coolant downtube upper screws', value: '90-110 in-lbs (10.2-12.4 N·m)' },
    { fastener: 'Coolant downtube lower screws', value: '20-22 ft-lbs (27.1-29.8 N·m)' },
  ],
  steps: [
    { n: 1, text: 'Remove lower cover. Release stator connector latch and disconnect.' },
    { n: 2, text: 'Remove downtube securing screws and disconnect upper hoses.' },
    { n: 3, text: 'Release voltage regulator cable clip and connector latch.' },
    { n: 4, text: 'Remove regulator screws. Install new regulator and screws. Torque: 96-120 in-lbs.' },
    { n: 5, text: 'Apply dielectric grease to connectors. Reconnect and secure with latches.' },
    { n: 6, text: 'Install downtube screws. Torque upper: 90-110 in-lbs, lower: 20-22 ft-lbs.' },
    { n: 7, text: 'Reconnect stator with dielectric grease. Install lower cover.' },
  ],
},
{
  id: 't20-ignition-switch-remove-install-road-king',
  bikeIds: ["touring-2020"],
  system: 'electrical',
  title: 'Ignition Switch - Remove and Install (Road King)',
  summary: 'Remove and install ignition switch on non-fairing Road King models.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 16 },
  figures: [],
  tools: [],
  parts: [
  ],
  torque: [
    { fastener: 'Ignition switch screws', value: '25-35 in-lbs (2.8-3.9 N·m)' },
  ],
  steps: [
    { n: 1, text: 'Remove seat and console.' },
    { n: 2, text: 'Disconnect ignition switch connector.' },
    { n: 3, text: 'Release conduit from plastic clip if needed.' },
    { n: 4, text: 'Remove switch screws and switch.' },
    { n: 5, text: 'Install switch with screws in cross-wise pattern. Torque: 25-35 in-lbs.' },
    { n: 6, text: 'Connect connector. Reinstall conduit clip. Reinstall console and seat.' },
  ],
},
{
  id: 't20-rhcm-remove-install',
  bikeIds: ["touring-2020"],
  system: 'electrical',
  title: 'Right Hand Control Module (RHCM) - Remove and Install',
  summary: 'Remove and install right hand control module with switch positioning.',
  difficulty: 'Moderate',
  timeMinutes: 50,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 25 },
  figures: [],
  tools: [],
  parts: [
  ],
  torque: [
    { fastener: 'RHCM housing screw', value: '35-44 in-lbs (4-5 N·m)' },
  ],
  steps: [
    { n: 1, text: 'Remove brake master cylinder assembly (without draining).' },
    { n: 2, text: 'Loosen RHCM housing screws and remove front housing.' },
    { n: 3, text: 'Using pick, carefully press connector latch and remove connectors.' },
    { n: 4, text: 'Release connector latch and rotate switch down.' },
    { n: 5, text: 'Remove hand control module from handlebar.' },
    { n: 6, text: 'Install throttle hand grip with proper engagement and alignment.' },
    { n: 7, text: 'Attach harness connectors, route through fingers and channel.' },
    { n: 8, text: 'Install RHCM on handlebar with switch arm rotated up to engage latch.' },
    { n: 9, text: 'Verify wire harness in recess. Connect turn signal (FLHRXS models).' },
    { n: 10, text: 'Install switch housings finger tight. Set end play 0.039-0.079 in (1-2 mm).' },
    { n: 11, text: 'Tighten RHCM housing screws. Torque: 35-44 in-lbs. Verify grip movement.' },
    { n: 12, text: 'Reinstall brake master cylinder assembly.' },
  ],
},
{
  id: 't20-accessory-switches-fork-mounted',
  bikeIds: ["touring-2020"],
  system: 'electrical',
  title: 'Accessory Switches - Remove and Install (Fork-Mounted Fairing)',
  summary: 'Remove and install accessory switches on fork-mounted fairing dashboard.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 28 },
  figures: [],
  tools: [],
  parts: [
  ],
  torque: [
    { fastener: 'Accessory switch module screw', value: '12-17 in-lbs (1.4-1.9 N·m)' },
  ],
  steps: [
    { n: 1, text: 'Remove dash panel. See FAIRING: FORK MOUNTED (Page 3-88).' },
    { n: 2, text: 'Remove switch module or hole plug screws.' },
    { n: 3, text: 'Release lock and pry out switch plunger. Record switch positions.' },
    { n: 4, text: 'Note: Max 2A per switch. Install plunger into module and push lock into place.' },
    { n: 5, text: 'Align switch module to dash panel and install screws. Torque: 12-17 in-lbs.' },
    { n: 6, text: 'Reinstall dash panel. Operate switches to verify.' },
  ],
},
{
  id: 't20-instrument-module-remove-install',
  bikeIds: ["touring-2020"],
  system: 'electrical',
  title: 'Instrument Module (IM) - Remove and Install',
  summary: 'Remove and install instrument module (speedometer) for fork or frame-mounted fairings.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 31 },
  figures: [],
  tools: [],
  parts: [
  ],
  torque: [
    { fastener: 'IM screw (fork-mounted)', value: '10-20 in-lbs (1.1-2.3 N·m)' },
    { fastener: 'IM screw (frame-mounted)', value: '12-17 in-lbs (1.4-1.9 N·m)' },
  ],
  steps: [
    { n: 1, text: 'Fork-mounted: Remove outer fairing, vent, and upper support bracket.' },
    { n: 2, text: 'Frame-mounted: Remove ignition switch knob. Non-fairing: Remove seat and console.' },
    { n: 3, text: 'Disconnect IM connector. Remove IM screws and remove IM.' },
    { n: 4, text: 'Remove bezel if necessary. Non-fairing: Remove anchored cable strap and lock ring.' },
    { n: 5, text: 'Install IM and bezel. Fork: Torque 10-20 in-lbs. Frame: Torque 12-17 in-lbs.' },
    { n: 6, text: 'Connect IM connector. Non-fairing: Install lock ring, cable strap, gasket.' },
    { n: 7, text: 'Reinstall fairing or dashboard components.' },
  ],
},
{
  id: 't20-fairing-gauge-remove-install',
  bikeIds: ["touring-2020"],
  system: 'electrical',
  title: 'Fairing Gauges - Remove and Install',
  summary: 'Remove and install voltmeter and fuel gauge on fairing. Fuel (left, black clamp), voltmeter (right, tan clamp).',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 34 },
  figures: [],
  tools: [],
  parts: [
  ],
  torque: [
    { fastener: 'Fairing gauge screw', value: '8-15 in-lbs (0.9-1.7 N·m)' },
  ],
  steps: [
    { n: 1, text: 'Fork-mounted: Remove outer fairing, vent, upper support bracket.' },
    { n: 2, text: 'Frame-mounted: Remove outer fairing and vent.' },
    { n: 3, text: 'Disconnect gauge connector.' },
    { n: 4, text: 'Remove gauge screws. Remove gauge assembly, back clamp, and bezel.' },
    { n: 5, text: 'Assemble new gauge: Install back clamp and bezel.' },
    { n: 6, text: 'Install gauge assembly and screws. Torque: 8-15 in-lbs.' },
    { n: 7, text: 'Connect gauge connector. Reinstall fairing components.' },
  ],
},
{
  id: 't20-fuel-level-gauge-remove-install',
  bikeIds: ["touring-2020"],
  system: 'electrical',
  title: 'Fuel Level Gauge - Remove and Install',
  summary: 'Remove and install fuel level gauge from fuel tank on non-fairing models.',
  difficulty: 'Moderate',
  timeMinutes: 25,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 35 },
  figures: [],
  tools: [],
  parts: [
  ],
  torque: [
  ],
  steps: [
    { n: 1, text: 'Disconnect fuel level gauge connector and draw out from tunnel under fuel tank.' },
    { n: 2, text: 'Extract terminals from connector (see Electrical Diagnostic Manual).' },
    { n: 3, text: 'Remove convoluted tubing. NOTE: Do not twist during removal.' },
    { n: 4, text: 'Pull gauge up carefully and feed wires up through tube. Inspect gasket for damage.' },
    { n: 5, text: 'For new gauge: Measure original wire length. Cut new wires to same length. Crimp new terminals.' },
    { n: 6, text: 'Install rubber gasket (flat side contacting gauge edge) over wiring.' },
    { n: 7, text: 'Feed wires down fuel tank tube while lowering gauge. Press gauge down until snap.' },
    { n: 8, text: 'Install convoluted tubing and connector. Route connector between crossover hose and tank bottom.' },
  ],
},
{
  id: 't20-oil-pressure-switch-remove-install',
  bikeIds: ["touring-2020"],
  system: 'electrical',
  title: 'Oil Pressure Switch - Remove and Install',
  summary: 'Remove and install oil pressure switch.',
  difficulty: 'Easy',
  timeMinutes: 10,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 36 },
  figures: [],
  tools: [],
  parts: [
  ],
  torque: [
    { fastener: 'Oil Pressure Switch', value: '13-17 ft-lbs (17-23 N·m)' },
  ],
  steps: [
    { n: 1, text: 'Disconnect connector.' },
    { n: 2, text: 'Remove switch.' },
    { n: 3, text: 'Install new switch. Torque: 13-17 ft-lbs (17-23 N·m).' },
    { n: 4, text: 'Connect connector.' },
  ],
},
{
  id: 't20-neutral-indicator-switch-remove-install',
  bikeIds: ["touring-2020"],
  system: 'electrical',
  title: 'Neutral Indicator Switch - Remove and Install',
  summary: 'Remove and install neutral indicator switch on transmission.',
  difficulty: 'Easy',
  timeMinutes: 10,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 37 },
  figures: [],
  tools: [],
  parts: [
  ],
  torque: [
    { fastener: 'Neutral Indicator Switch', value: '120-180 in-lbs (13.6-20.3 N·m)' },
  ],
  steps: [
    { n: 1, text: 'Place transmission in NEUTRAL.' },
    { n: 2, text: 'Remove connectors from switch posts.' },
    { n: 3, text: 'Remove neutral switch and O-ring.' },
    { n: 4, text: 'Verify transmission in NEUTRAL. Install new switch and O-ring. Torque: 120-180 in-lbs.' },
    { n: 5, text: 'Connect harness wires (wires are interchangeable).' },
  ],
},
{
  id: 't20-horn-remove-install',
  bikeIds: ["touring-2020"],
  system: 'electrical',
  title: 'Horn - Remove and Install',
  summary: 'Remove and install horn assembly with bracket and mounting hardware.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 38 },
  figures: [],
  tools: [],
  parts: [
    { number: 'Loctite 271', description: 'LOCTITE 271 HIGH STRENGTH THREADLOCKER (RED)', qty: 1 },
  ],
  torque: [
    { fastener: 'Horn bracket acorn nut', value: '80-120 in-lbs (9-13.6 N·m)' },
    { fastener: 'Horn bracket to cylinder head screws', value: '35-40 ft-lbs (47.5-54.2 N·m)' },
    { fastener: 'Horn rubber mount', value: '120-180 in-lbs (13.6-20.3 N·m)' },
    { fastener: 'Horn cover to bracket', value: '35-40 in-lbs (3.9-4.5 N·m)' },
    { fastener: 'Horn stud flange nut', value: '80-100 in-lbs (9-11.3 N·m)' },
  ],
  steps: [
    { n: 1, text: 'Remove screws (9) and washers (10). Rotate assembly for access.' },
    { n: 2, text: 'Remove wiring from J-clamp (12). Disconnect horn connectors.' },
    { n: 3, text: 'Horn assembly: Remove nut (4), washer (5), wiring. Disconnect connectors.' },
    { n: 4, text: 'Install rubber mount (7) with threadlocker on stud. Torque: 120-180 in-lbs.' },
    { n: 5, text: 'Install horn bracket (6) onto rubber mount with washer (5) and acorn nut (4). Torque: 80-120 in-lbs.' },
    { n: 6, text: 'Attach horn connectors and install wiring in J-clamp.' },
    { n: 7, text: 'Install bracket (8) to cylinder heads with screws (9), washers (10). Torque: 35-40 ft-lbs.' },
    { n: 8, text: 'Horn disassembly/assembly: Remove nut (13). Remove horn (1). Remove J-clamp screws (11).' },
    { n: 9, text: 'Reassemble: Install speednuts on cover. Insert horn stud through cover and bracket.' },
    { n: 10, text: 'Install flange nut (13). Torque: 80-100 in-lbs. Mount cover to bracket with screws.' },
    { n: 11, text: 'Torque cover screws: 35-40 in-lbs. Reinstall wiring in J-clamp.' },
  ],
},
{
  id: 't20-headlamp-halogen-remove-install',
  bikeIds: ["touring-2020"],
  system: 'electrical',
  title: 'Headlamp (Halogen) - Remove and Install',
  summary: 'Remove and install halogen headlamp bulb and housing.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 41 },
  figures: [],
  tools: [],
  parts: [
    { number: '', description: 'Halogen headlamp bulb', qty: 1 },
  ],
  torque: [
    { fastener: 'Headlamp door screw', value: '9-18 in-lbs (1-2 N·m)' },
    { fastener: 'Headlamp retaining ring screws (single)', value: '23-26 in-lbs (2.6-2.9 N·m)' },
  ],
  steps: [
    { n: 1, text: 'Remove screw at bottom of headlamp door (chrome ring).' },
    { n: 2, text: 'Remove door with bulb.' },
    { n: 3, text: 'Rotate bulb counterclockwise and remove from socket.' },
    { n: 4, text: 'Install new halogen bulb carefully (do not touch bulb surface).' },
    { n: 5, text: 'Reinstall door and tighten screw. Torque: 9-18 in-lbs.' },
  ],
},
{
  id: 't20-headlamp-led-remove-install',
  bikeIds: ["touring-2020"],
  system: 'electrical',
  title: 'Headlamp (LED) - Remove and Install',
  summary: 'Remove and install LED headlamp assembly (not serviceable for bulb replacement).',
  difficulty: 'Moderate',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 41 },
  figures: [],
  tools: [],
  parts: [
    { number: '', description: 'LED headlamp complete assembly', qty: 1 },
  ],
  torque: [
    { fastener: 'Headlamp bezel (dual)', value: '8-15 in-lbs (0.9-1.7 N·m)' },
    { fastener: 'Headlamp screws (dual)', value: '48-60 in-lbs (5.4-6.8 N·m)' },
  ],
  steps: [
    { n: 1, text: 'NOTE: LED headlamp contains no service parts. Replace entire assembly if failure occurs.' },
    { n: 2, text: 'Disconnect headlamp electrical connector.' },
    { n: 3, text: 'Remove screws securing headlamp to frame.' },
    { n: 4, text: 'Remove headlamp assembly.' },
    { n: 5, text: 'Install new LED headlamp assembly. Install screws. Torque: 48-60 in-lbs.' },
    { n: 6, text: 'Connect electrical connector.' },
  ],
},
{
  id: 't20-headlamp-adjust',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Headlamp — Adjust',
  summary: 'Adjust headlamp beam aim using horizontal and vertical adjusters or frame-mounted adjuster.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 42 },
  figures: [],
  tools: ['5/32 in ball end hex wrench'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Set headlamp beam. Quartz halogen: Set to high beam. LED fork-mounted: Set to low beam. LED frame-mounted: Set to high beam.' },
    { n: 2, text: 'All except frame-mounted: Insert 5/32 in ball end hex wrench through adjuster slots in trim ring.' },
    { n: 3, text: 'Horizontal: Turn horizontal adjusting screw to adjust light beam left or right.' },
    { n: 4, text: 'Vertical: Turn vertical adjusting screw to adjust light beam up or down.' },
    { n: 5, text: 'See Figure 8-49 or 8-50. Adjust headlamp light beam to proper position.' },
    { n: 6, text: 'Frame-mounted fairing models: See Figure 8-48. Turn adjuster to adjust light beam up or down.' },
    { n: 7, text: 'Frame-mounted fairing models: See Figure 8-51. Adjust headlamp light beam.' },
    { n: 8, text: 'Verify alignment is complete and beam pattern matches specifications.' }
  ]
},
{
  id: 't20-auxiliary-lamps-bulb-replace',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Auxiliary Lamps — Replace Bulb',
  summary: 'Replace quartz halogen or LED bulbs in auxiliary/fog lamps.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 46 },
  figures: [],
  tools: [],
  parts: [
    { number: '11300004', description: 'electrical contact lubricant', qty: 1 }
  ],
  torque: [
    { fastener: 'auxiliary/fog lamp door screw', value: '10-14 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'WARNING: Handle bulb carefully and wear eye protection. Bulb contains pressurized gas.' },
    { n: 2, text: 'NOTICE: Never touch quartz bulb. Fingerprints etch glass and decrease bulb life. Handle with paper or clean cloth.' },
    { n: 3, text: 'See Figure 8-52. Loosen screw. Pull door from lamp housing.' },
    { n: 4, text: 'Disconnect auxiliary/fog lamp connector. Remove lamp.' },
    { n: 5, text: 'Remove nesting ring.' },
    { n: 6, text: 'Quartz halogen: Rotate bulb housing 1/4 turn counterclockwise to remove from lamp.' },
    { n: 7, text: 'Install new bulb/housing assembly. Rotate 1/4 turn clockwise.' },
    { n: 8, text: 'Place nesting ring on back of lamp with tab facing away.' },
    { n: 9, text: 'Mate connector.' },
    { n: 10, text: 'Engage nesting ring index tab in slot at bottom of lamp housing.' },
    { n: 11, text: 'Rotate lamp so index tabs engage slots in nesting ring.' },
    { n: 12, text: 'Install lamp door on housing with screw centered at bottom. Tighten to 10-14 in-lbs.' }
  ]
},
{
  id: 't20-auxiliary-lamps-housing-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Auxiliary Lamps — Housing Remove and Install',
  summary: 'Remove and install complete auxiliary/fog lamp housing assembly.',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 46 },
  figures: [],
  tools: ['flare nut socket'],
  parts: [],
  torque: [
    { fastener: 'auxiliary/fog lamp stud locknut', value: '20-24 ft-lbs' },
    { fastener: 'front turn signal mounting screw: bullet style', value: '96-120 in-lbs' },
    { fastener: 'turn/aux/fog lamp bracket acorn nut, fairing models', value: '120-180 in-lbs' },
    { fastener: 'turn/aux/fog lamp bracket acorn nut, road king models', value: '72-108 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Road King Models: Disconnect both lamp connectors on left steering head.' },
    { n: 2, text: 'Cut cable straps securing harnesses to lower fork bracket.' },
    { n: 3, text: 'Pull harnesses down through openings in lower fork bracket.' },
    { n: 4, text: 'Loosen acorn nuts securing lamp bracket.' },
    { n: 5, text: 'Fairing Models: Remove acorn nuts securing lamp brackets.' },
    { n: 6, text: 'Pull lamp bracket away from fork and separate electrical connector.' },
    { n: 7, text: 'Remove auxiliary/fog lamp bracket.' },
    { n: 8, text: 'Lay old lamp next to new and cut wire to length.' },
    { n: 9, text: 'Strip specified length of insulation off wire and crimp on new socket terminal.' },
    { n: 10, text: 'Install rubber washer on stud.' },
    { n: 11, text: 'Position lamp housing on bracket. Install clamp block, lockwasher and locknut.' },
    { n: 12, text: 'Use flare nut socket to tighten locknut. Torque: 20-24 ft-lbs.' },
    { n: 13, text: 'Route wire through passage in bracket and protective conduit.' },
    { n: 14, text: 'Install terminals into connector housing.' },
    { n: 15, text: 'Install turn signal lamp. Secure with screw. Tighten to 96-120 in-lbs.' },
    { n: 16, text: 'Fairing Models: Mate electrical connectors.' },
    { n: 17, text: 'Attach lamp bracket with acorn nuts. Tighten to 120-180 in-lbs.' },
    { n: 18, text: 'Road King Models: Install bracket with bushings outside bracket.' },
    { n: 19, text: 'Install acorn nuts. Tighten to 72-108 in-lbs.' },
    { n: 20, text: 'Pull harnesses up through openings in lower fork bracket.' },
    { n: 21, text: 'Connect both lamp connectors.' },
    { n: 22, text: 'Install cable straps securing harnesses to lower fork bracket.' }
  ]
},
{
  id: 't20-front-turn-signal-lamps-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Front Turn Signal Lamps — Remove and Install',
  summary: 'Remove and install front turn signal lamp housings with electrical connections.',
  difficulty: 'Moderate',
  timeMinutes: 40,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 49 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Locate front turn signal lamp assembly on fork bracket.' },
    { n: 2, text: 'Disconnect electrical connector from turn signal lamp.' },
    { n: 3, text: 'Remove mounting screws or acorn nuts securing lamp bracket.' },
    { n: 4, text: 'Remove turn signal lamp assembly from bracket.' },
    { n: 5, text: 'Inspect lamp housing for damage. If LED lamp fails, replace entire assembly.' },
    { n: 6, text: 'Position new turn signal lamp on bracket.' },
    { n: 7, text: 'Install mounting screws or acorn nuts. Tighten securely.' },
    { n: 8, text: 'Connect electrical connector.' },
    { n: 9, text: 'Verify turn signal lamp operation before completing repair.' }
  ]
},
{
  id: 't20-front-fender-tip-lamp-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Front Fender Tip Lamp — Remove and Install',
  summary: 'Remove and install front fender tip lamp including bulb and housing.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 52 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'fender tip lamp, front', value: '20-25 in-lbs' },
    { fastener: 'fender trim strips, front', value: '10-15 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Remove fender trim strips if necessary for lamp access.' },
    { n: 2, text: 'Loosen mounting screws securing fender tip lamp to fender bracket.' },
    { n: 3, text: 'Disconnect lamp connector.' },
    { n: 4, text: 'Remove fender tip lamp assembly.' },
    { n: 5, text: 'If bulb replacement only: Push bulb in and rotate counterclockwise. Install new bulb.' },
    { n: 6, text: 'Position new lamp on fender bracket.' },
    { n: 7, text: 'Install mounting screws. Tighten to 20-25 in-lbs.' },
    { n: 8, text: 'Connect electrical connector.' },
    { n: 9, text: 'Install fender trim strips. Tighten to 10-15 in-lbs.' },
    { n: 10, text: 'Test lamp operation.' }
  ]
},
{
  id: 't20-rear-turn-signal-lamps-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Rear Turn Signal Lamps — Remove and Install',
  summary: 'Remove and install rear turn signal lamps with bracket and electrical connections.',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 54 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'license plate bracket screws', value: '60-80 in-lbs' },
    { fastener: 'rear lightbar screw', value: '84-120 in-lbs' },
    { fastener: 'rear turn signal to lightbar screw', value: '30-50 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Disconnect electrical connectors from rear turn signal lamps.' },
    { n: 2, text: 'Remove mounting screws securing turn signal lamp brackets to rear fender.' },
    { n: 3, text: 'Remove turn signal lamp assembly.' },
    { n: 4, text: 'For bulb-only replacement: Push bulb in and rotate counterclockwise to remove.' },
    { n: 5, text: 'Install new bulb by rotating clockwise until seated.' },
    { n: 6, text: 'For housing replacement: Install new housing on bracket.' },
    { n: 7, text: 'Install mounting screws and tighten to specification.' },
    { n: 8, text: 'Connect electrical connectors.' },
    { n: 9, text: 'Test turn signal operation both directions.' }
  ]
},
{
  id: 't20-tail-lamp-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Tail Lamp — Remove and Install',
  summary: 'Remove and install tail/stop lamp housing on rear fender.',
  difficulty: 'Easy',
  timeMinutes: 25,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 59 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'tail lamp base screw', value: '40-48 in-lbs' },
    { fastener: 'tail lamp screws', value: '20-24 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'For bulb replacement only: Remove tail lamp lens screws.' },
    { n: 2, text: 'Push bulb in and rotate counterclockwise to remove bulb socket.' },
    { n: 3, text: 'Install new bulb by rotating clockwise.' },
    { n: 4, text: 'Install lens screws. Tighten to 20-24 in-lbs.' },
    { n: 5, text: 'For complete housing removal: Disconnect electrical connector.' },
    { n: 6, text: 'Remove mounting screws securing lamp base to fender.' },
    { n: 7, text: 'Remove tail lamp assembly.' },
    { n: 8, text: 'Position new lamp base on fender.' },
    { n: 9, text: 'Install mounting screws. Tighten to 40-48 in-lbs.' },
    { n: 10, text: 'Connect electrical connector and test lamp operation.' }
  ]
},
{
  id: 't20-rear-fender-tip-lamp-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Rear Fender Tip Lamp — Remove and Install',
  summary: 'Remove and install rear fender tip lamp with fascia assembly.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 61 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'fascia lamp screw', value: '18-22 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Locate rear fender tip lamp at rear of fender.' },
    { n: 2, text: 'Disconnect lamp electrical connector.' },
    { n: 3, text: 'Remove fascia lamp mounting screws.' },
    { n: 4, text: 'Remove lamp assembly from fender.' },
    { n: 5, text: 'If bulb replacement: Push bulb in and rotate counterclockwise. Install new bulb.' },
    { n: 6, text: 'Position new lamp assembly on fender bracket.' },
    { n: 7, text: 'Install mounting screws. Tighten to 18-22 in-lbs.' },
    { n: 8, text: 'Connect electrical connector.' },
    { n: 9, text: 'Test rear fender tip lamp operation.' }
  ]
},
{
  id: 't20-tour-pak-lighting-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Tour-Pak Lighting — Remove and Install',
  summary: 'Remove and install Tour-Pak side marker lamps, tether lamp, and wrap-around lamp assemblies.',
  difficulty: 'Moderate',
  timeMinutes: 50,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 62 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'AM/FM antenna stud nut', value: '16-19 in-lbs' },
    { fastener: 'CB antenna stud nut', value: '14-16 in-lbs' },
    { fastener: 'ground plate/marker lamp screws', value: '20-25 in-lbs' },
    { fastener: 'wrap-around lamp screws', value: '20-25 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Disconnect all Tour-Pak lamp electrical connectors.' },
    { n: 2, text: 'For side marker lamps: Remove mounting screws from marker lamps.' },
    { n: 3, text: 'Disconnect marker lamp connectors and remove assembly.' },
    { n: 4, text: 'For wrap-around rear lamps: Remove mounting screws securing lamp assembly.' },
    { n: 5, text: 'Disconnect electrical connectors from wrap-around lamps.' },
    { n: 6, text: 'Remove lamp assembly from Tour-Pak.' },
    { n: 7, text: 'For antenna bases: Loosen antenna stud nuts.' },
    { n: 8, text: 'Remove antenna base set screws.' },
    { n: 9, text: 'Remove antenna and bracket assembly.' },
    { n: 10, text: 'Position new wrap-around lamp on Tour-Pak.' },
    { n: 11, text: 'Install mounting screws. Tighten to 20-25 in-lbs.' },
    { n: 12, text: 'Position marker lamps on Tour-Pak bracket.' },
    { n: 13, text: 'Install marker lamp mounting screws. Tighten to 20-25 in-lbs.' },
    { n: 14, text: 'Install antenna base. Tighten stud nuts to 16-19 in-lbs (AM/FM) or 14-16 in-lbs (CB).' },
    { n: 15, text: 'Connect all lamp electrical connectors.' },
    { n: 16, text: 'Test all Tour-Pak lighting functions.' }
  ]
},
{
  id: 't20-rear-stoplamp-switch-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Rear Stoplamp Switch — Remove and Install',
  summary: 'Remove and install rear brake stop lamp switch activated by brake pedal.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 65 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'rear stop lamp switch', value: '144 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Remove main fuse. See POWER DISCONNECT.' },
    { n: 2, text: 'Disconnect stop lamp switch electrical connector.' },
    { n: 3, text: 'Loosen switch mounting fastener from brake bracket.' },
    { n: 4, text: 'Remove switch assembly.' },
    { n: 5, text: 'Inspect switch contacts and plunger for damage or corrosion.' },
    { n: 6, text: 'Position new stop lamp switch on brake bracket.' },
    { n: 7, text: 'Install mounting fastener. Tighten to 144 in-lbs.' },
    { n: 8, text: 'Connect switch electrical connector.' },
    { n: 9, text: 'Install main fuse.' },
    { n: 10, text: 'Test rear stop lamp illumination when brake pedal is depressed.' }
  ]
},
{
  id: 't20-license-plate-lamp-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'License Plate Lamp — Remove and Install',
  summary: 'Remove and install license plate lamp housing.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 66 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Disconnect license plate lamp electrical connector.' },
    { n: 2, text: 'Remove screws securing license plate lamp housing.' },
    { n: 3, text: 'Remove lamp assembly from bracket.' },
    { n: 4, text: 'If bulb replacement: Push bulb in and rotate to remove. Install new bulb.' },
    { n: 5, text: 'For housing replacement: Position new lamp on bracket.' },
    { n: 6, text: 'Install mounting screws.' },
    { n: 7, text: 'Connect electrical connector.' },
    { n: 8, text: 'Test license plate lamp illumination.' }
  ]
},
{
  id: 't20-radio-remove-install-fork-mounted',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Radio — Remove and Install (Fork Mounted Fairing)',
  summary: 'Remove and install Boom Box radio head unit from fork-mounted fairing.',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 67 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'radio-to-upper support bracket screw', value: '60-84 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Disconnect all electrical connectors from radio.' },
    { n: 2, text: 'Remove radio mounting screws from upper support bracket.' },
    { n: 3, text: 'Remove radio assembly from fairing.' },
    { n: 4, text: 'If installing new radio: Position radio on support bracket.' },
    { n: 5, text: 'Install mounting screws. Tighten to 60-84 in-lbs.' },
    { n: 6, text: 'Connect all electrical connectors to radio head unit.' },
    { n: 7, text: 'Connect antenna cable to radio.' },
    { n: 8, text: 'Test radio operation and verify all controls function properly.' }
  ]
},
{
  id: 't20-radio-remove-install-frame-mounted',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Radio — Remove and Install (Frame Mounted Fairing)',
  summary: 'Remove and install Boom Box radio head unit from frame-mounted fairing support bracket.',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 67 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'radio to fairing support bracket screws', value: '60-84 in-lbs' },
    { fastener: 'radio upper bracket: FLTR', value: '25-35 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Disconnect all electrical connectors from radio.' },
    { n: 2, text: 'Remove upper support bracket screws.' },
    { n: 3, text: 'Remove radio mounting screws from fairing support bracket.' },
    { n: 4, text: 'Remove radio assembly.' },
    { n: 5, text: 'If installing new radio: Position radio on support bracket.' },
    { n: 6, text: 'Install lower mounting screws. Tighten to 60-84 in-lbs.' },
    { n: 7, text: 'Install upper bracket screws. Tighten to 25-35 in-lbs.' },
    { n: 8, text: 'Connect all electrical connectors.' },
    { n: 9, text: 'Connect antenna cable.' },
    { n: 10, text: 'Test radio operation and all control functions.' }
  ]
},
{
  id: 't20-front-speakers-remove-install-fork-mounted',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Front Speakers — Remove and Install (Fork Mounted Fairing)',
  summary: 'Remove and install front speaker enclosures in fork-mounted fairing.',
  difficulty: 'Moderate',
  timeMinutes: 40,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 70 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'fairing speaker enclosure to fairing screws', value: '48-60 in-lbs' },
    { fastener: 'fairing speaker grille screws', value: '9-13 in-lbs' },
    { fastener: 'fairing speaker screws', value: '9-13 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Disconnect speaker electrical connectors.' },
    { n: 2, text: 'Remove speaker grille screws.' },
    { n: 3, text: 'Remove speaker grille.' },
    { n: 4, text: 'Remove speaker mounting screws.' },
    { n: 5, text: 'Remove speaker from enclosure.' },
    { n: 6, text: 'If speaker replacement: Position new speaker in enclosure.' },
    { n: 7, text: 'Install speaker mounting screws. Tighten to 9-13 in-lbs.' },
    { n: 8, text: 'Install speaker grille. Tighten screws to 9-13 in-lbs.' },
    { n: 9, text: 'Connect speaker electrical connector.' },
    { n: 10, text: 'Test speaker sound quality.' }
  ]
},
{
  id: 't20-front-speakers-remove-install-frame-mounted',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Front Speakers — Remove and Install (Frame Mounted Fairing)',
  summary: 'Remove and install front speaker enclosures mounted in frame-mounted fairing bracket.',
  difficulty: 'Moderate',
  timeMinutes: 40,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 70 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'speaker enclosure mounting screws, front, FLTR', value: '48-60 in-lbs' },
    { fastener: 'speaker mounting screws', value: '9-13 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Disconnect speaker electrical connectors from audio harness.' },
    { n: 2, text: 'Remove speaker enclosure mounting screws from fairing bracket.' },
    { n: 3, text: 'Remove speaker enclosure assembly.' },
    { n: 4, text: 'Remove speaker grille if equipped.' },
    { n: 5, text: 'Remove speaker mounting screws.' },
    { n: 6, text: 'Remove speaker from enclosure.' },
    { n: 7, text: 'If speaker replacement: Install new speaker in enclosure.' },
    { n: 8, text: 'Install speaker mounting screws. Tighten to 9-13 in-lbs.' },
    { n: 9, text: 'Install speaker grille.' },
    { n: 10, text: 'Position enclosure on fairing bracket.' },
    { n: 11, text: 'Install mounting screws. Tighten to 48-60 in-lbs.' },
    { n: 12, text: 'Connect speaker electrical connectors.' },
    { n: 13, text: 'Test speaker sound quality.' }
  ]
},
{
  id: 't20-rear-speakers-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Rear Speakers — Remove and Install',
  summary: 'Remove and install rear speakers in Tour-Pak audio enclosure.',
  difficulty: 'Moderate',
  timeMinutes: 40,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 73 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'rear speaker enclosure to Tour-Pak screws', value: '20-25 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Disconnect rear speaker electrical connectors from main harness.' },
    { n: 2, text: 'Remove speaker enclosure mounting screws from Tour-Pak.' },
    { n: 3, text: 'Remove speaker enclosure.' },
    { n: 4, text: 'Remove speaker grille if equipped.' },
    { n: 5, text: 'Remove speaker mounting screws.' },
    { n: 6, text: 'Remove speaker from enclosure.' },
    { n: 7, text: 'Install new speaker in enclosure.' },
    { n: 8, text: 'Install speaker mounting screws.' },
    { n: 9, text: 'Install speaker grille.' },
    { n: 10, text: 'Position enclosure on Tour-Pak.' },
    { n: 11, text: 'Install mounting screws. Tighten to 20-25 in-lbs.' },
    { n: 12, text: 'Connect speaker electrical connectors.' },
    { n: 13, text: 'Test rear speaker sound quality.' }
  ]
},
{
  id: 't20-passenger-audio-controls-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Passenger Audio Controls — Remove and Install',
  summary: 'Remove and install passenger audio control panel mounted on Tour-Pak or frame bracket.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 76 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'passenger audio switch screws', value: '25-30 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Disconnect passenger audio control electrical connector.' },
    { n: 2, text: 'Remove mounting screws securing control panel to bracket.' },
    { n: 3, text: 'Remove control panel assembly.' },
    { n: 4, text: 'If control replacement: Position new control panel on bracket.' },
    { n: 5, text: 'Install mounting screws. Tighten to 25-30 in-lbs.' },
    { n: 6, text: 'Connect electrical connector.' },
    { n: 7, text: 'Test passenger audio controls for proper operation.' }
  ]
},
{
  id: 't20-rider-headset-connector-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Rider Headset Connector — Remove and Install',
  summary: 'Remove and install rider audio headset connector on handlebar.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 77 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'rider headset connector nut', value: '7-9 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Disconnect headset from connector.' },
    { n: 2, text: 'Remove connector mounting screws or nuts from handlebar bracket.' },
    { n: 3, text: 'Disconnect connector from main audio harness.' },
    { n: 4, text: 'Remove connector assembly.' },
    { n: 5, text: 'Install new connector on handlebar bracket.' },
    { n: 6, text: 'Install mounting screws/nuts. Tighten to 7-9 in-lbs.' },
    { n: 7, text: 'Connect connector to main audio harness.' },
    { n: 8, text: 'Test headset connectivity and audio quality.' }
  ]
},
{
  id: 't20-cb-module-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'CB Module — Remove and Install',
  summary: 'Remove and install CB radio module and associated mounting bracket.',
  difficulty: 'Moderate',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 78 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'CB module bracket to speaker enclosure screw', value: '25-35 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Disconnect CB module electrical connectors from harness.' },
    { n: 2, text: 'Remove mounting screws securing CB module bracket to speaker enclosure.' },
    { n: 3, text: 'Remove CB module and bracket assembly.' },
    { n: 4, text: 'If module replacement: Remove CB module from bracket.' },
    { n: 5, text: 'Install new CB module on bracket.' },
    { n: 6, text: 'Position bracket assembly on speaker enclosure.' },
    { n: 7, text: 'Install mounting screws. Tighten to 25-35 in-lbs.' },
    { n: 8, text: 'Connect CB module electrical connectors.' },
    { n: 9, text: 'Test CB module operation and channel scanning.' }
  ]
},
{
  id: 't20-gps-antenna-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'GPS Antenna — Remove and Install',
  summary: 'Remove and install GPS antenna from fairing or Tour-Pak mounting location.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 79 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Disconnect GPS antenna cable from connector.' },
    { n: 2, text: 'Remove antenna mounting bracket screws.' },
    { n: 3, text: 'Carefully remove antenna from mounting location.' },
    { n: 4, text: 'Position new GPS antenna on bracket.' },
    { n: 5, text: 'Install mounting screws. Tighten securely.' },
    { n: 6, text: 'Route antenna cable through fairing or Tour-Pak interior.' },
    { n: 7, text: 'Connect antenna cable to GPS receiver connector.' },
    { n: 8, text: 'Test GPS antenna signal reception and positioning accuracy.' }
  ]
},
{
  id: 't20-antenna-cables-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Antenna Cables — Remove and Install',
  summary: 'Remove and install AM/FM radio and CB antenna cable assemblies.',
  difficulty: 'Moderate',
  timeMinutes: 35,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 80 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'AM/FM antenna stud nut', value: '16-19 in-lbs' },
    { fastener: 'CB antenna stud nut', value: '14-16 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Disconnect antenna cable connectors from radio head units.' },
    { n: 2, text: 'Remove antenna cable base mounting nuts from Tour-Pak or fairing bracket.' },
    { n: 3, text: 'Route antenna cable through fairing or Tour-Pak interior.' },
    { n: 4, text: 'Remove cable from motorcycle structure.' },
    { n: 5, text: 'Install new antenna cable through fairing or Tour-Pak interior.' },
    { n: 6, text: 'Position antenna cable base on mounting bracket.' },
    { n: 7, text: 'Install mounting nuts. Tighten to specification (16-19 in-lbs for AM/FM, 14-16 in-lbs for CB).' },
    { n: 8, text: 'Connect antenna cable connectors to radio head units.' },
    { n: 9, text: 'Test antenna signal strength and radio reception.' }
  ]
},
{
  id: 't20-electronic-control-module-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Electronic Control Module — Remove and Install',
  summary: 'Remove and install ECM (engine control computer) from top caddy.',
  difficulty: 'Moderate',
  timeMinutes: 40,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 83 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove seat. See SEAT.' },
    { n: 2, text: 'Disconnect main electrical connectors from ECM.' },
    { n: 3, text: 'Remove cable straps securing harnesses to ECM.' },
    { n: 4, text: 'Remove ECM mounting bolts from top caddy.' },
    { n: 5, text: 'Remove ECM from motorcycle.' },
    { n: 6, text: 'WARNING: Keep ECM away from static electricity and moisture.' },
    { n: 7, text: 'Position new ECM on top caddy.' },
    { n: 8, text: 'Install mounting bolts. Tighten securely.' },
    { n: 9, text: 'Route and secure harnesses with new cable straps.' },
    { n: 10, text: 'Connect main electrical connectors to ECM.' },
    { n: 11, text: 'Install seat and verify ECM power-up and operation.' }
  ]
},
{
  id: 't20-engine-temperature-sensor-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Engine Temperature Sensor — Remove and Install',
  summary: 'Remove and install engine temperature (ET) sensor for coolant temperature monitoring.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 98 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'ET sensor', value: '11-16 ft-lbs' }
  ],
  steps: [
    { n: 1, text: 'Allow engine to cool. WARNING: Hot coolant and components can cause serious burns.' },
    { n: 2, text: 'Remove main fuse. See POWER DISCONNECT.' },
    { n: 3, text: 'Disconnect ET sensor electrical connector.' },
    { n: 4, text: 'Using appropriate socket, loosen ET sensor from engine block mounting location.' },
    { n: 5, text: 'Remove sensor carefully.' },
    { n: 6, text: 'Inspect sensor threads and mounting location for damage.' },
    { n: 7, text: 'Position new ET sensor in mounting location.' },
    { n: 8, text: 'Install and tighten sensor. Torque: 11-16 ft-lbs.' },
    { n: 9, text: 'Connect ET sensor electrical connector.' },
    { n: 10, text: 'Install main fuse and verify coolant temperature gauge operation.' }
  ]
},
{
  id: 't20-vehicle-speed-sensor-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Vehicle Speed Sensor — Remove and Install',
  summary: 'Remove and install vehicle speed sensor for speedometer and cruise control operation.',
  difficulty: 'Moderate',
  timeMinutes: 35,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 102 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'VSS screw', value: '100-120 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Remove main fuse. See POWER DISCONNECT.' },
    { n: 2, text: 'Locate VSS on rear wheel hub or transmission output.' },
    { n: 3, text: 'Disconnect VSS electrical connector.' },
    { n: 4, text: 'Remove VSS mounting screw.' },
    { n: 5, text: 'Remove sensor from mounting location.' },
    { n: 6, text: 'Inspect sensor tip and mounting location for damage or debris.' },
    { n: 7, text: 'Position new VSS in mounting location.' },
    { n: 8, text: 'Install mounting screw. Tighten to 100-120 in-lbs.' },
    { n: 9, text: 'Connect VSS electrical connector.' },
    { n: 10, text: 'Install main fuse.' },
    { n: 11, text: 'Test speedometer operation and verify cruise control function.' }
  ]
},
{
  id: 't20-front-wheel-speed-sensor-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Front Wheel Speed Sensor — Remove and Install (ABS)',
  summary: 'Remove and install front wheel speed sensor for anti-lock braking system.',
  difficulty: 'Moderate',
  timeMinutes: 40,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 103 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove front wheel. See WHEELS.' },
    { n: 2, text: 'Remove brake caliper and rotor to access sensor.' },
    { n: 3, text: 'Disconnect WSS electrical connector from harness.' },
    { n: 4, text: 'Remove cable straps securing WSS cable to fork.' },
    { n: 5, text: 'Remove WSS mounting bracket screws.' },
    { n: 6, text: 'Remove WSS assembly from hub.' },
    { n: 7, text: 'Inspect sensor tip and air gap for proper clearance.' },
    { n: 8, text: 'Install new WSS on hub bracket.' },
    { n: 9, text: 'Install mounting screws. Tighten securely.' },
    { n: 10, text: 'Route WSS cable through fork and secure with new cable straps.' },
    { n: 11, text: 'Connect WSS electrical connector.' },
    { n: 12, text: 'Install rotor and brake caliper.' },
    { n: 13, text: 'Install wheel and verify ABS system operation.' }
  ]
},
{
  id: 't20-rear-wheel-speed-sensor-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Rear Wheel Speed Sensor — Remove and Install (ABS)',
  summary: 'Remove and install rear wheel speed sensor for anti-lock braking system.',
  difficulty: 'Moderate',
  timeMinutes: 40,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 105 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove rear wheel. See WHEELS.' },
    { n: 2, text: 'Remove brake caliper to access sensor.' },
    { n: 3, text: 'Disconnect WSS electrical connector from harness.' },
    { n: 4, text: 'Remove cable straps securing WSS cable.' },
    { n: 5, text: 'Remove WSS mounting bracket screws from hub.' },
    { n: 6, text: 'Remove WSS assembly.' },
    { n: 7, text: 'Inspect sensor tip and rotor ring for debris or damage.' },
    { n: 8, text: 'Install new WSS on hub bracket.' },
    { n: 9, text: 'Install mounting screws. Tighten securely.' },
    { n: 10, text: 'Route WSS cable and secure with cable straps.' },
    { n: 11, text: 'Connect WSS electrical connector.' },
    { n: 12, text: 'Install brake caliper.' },
    { n: 13, text: 'Install wheel and verify ABS system operation.' }
  ]
},
{
  id: 't20-inertial-measurement-unit-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Inertial Measurement Unit — Remove and Install',
  summary: 'Remove and install IMU (bank angle sensor) for stability control and ABS functions.',
  difficulty: 'Moderate',
  timeMinutes: 35,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 106 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'IMU screw', value: '32-40 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Remove main fuse. See POWER DISCONNECT.' },
    { n: 2, text: 'Locate IMU mounted on vehicle frame lower backbone.' },
    { n: 3, text: 'Disconnect IMU electrical connector.' },
    { n: 4, text: 'Remove IMU mounting screws.' },
    { n: 5, text: 'Remove IMU assembly.' },
    { n: 6, text: 'WARNING: Do not drop IMU or subject to shock. Sensor calibration sensitive.' },
    { n: 7, text: 'Position new IMU in mounting location.' },
    { n: 8, text: 'Install mounting screws. Tighten to 32-40 in-lbs.' },
    { n: 9, text: 'Connect IMU electrical connector.' },
    { n: 10, text: 'Install main fuse.' },
    { n: 11, text: 'Perform IMU sensor calibration using diagnostic tool if available.' }
  ]
},
{
  id: 't20-security-siren-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Security Siren — Remove and Install',
  summary: 'Remove and install security alarm siren for motorcycle security system.',
  difficulty: 'Easy',
  timeMinutes: 25,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 91 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Disable security system. See SECURITY SYSTEM.' },
    { n: 2, text: 'Disconnect siren electrical connector from main harness.' },
    { n: 3, text: 'Remove siren mounting bracket screws.' },
    { n: 4, text: 'Remove siren assembly from mounting location.' },
    { n: 5, text: 'Inspect siren housing and connector for damage.' },
    { n: 6, text: 'Position new siren on mounting bracket.' },
    { n: 7, text: 'Install mounting screws. Tighten securely.' },
    { n: 8, text: 'Connect siren electrical connector.' },
    { n: 9, text: 'Enable security system and test alarm activation and siren operation.' }
  ]
},
{
  id: 't20-fuses-relays-check-replace',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Fuses and Relays — Check and Replace',
  summary: 'Check and replace fuses and relays in main fuse block behind left side cover.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 6 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove left saddlebag. See SADDLEBAGS.' },
    { n: 2, text: 'Remove left side cover. See LEFT SIDE COVER.' },
    { n: 3, text: 'Models with security: Disable security system before proceeding.' },
    { n: 4, text: 'Remove main fuse by pulling straight out of holder.' },
    { n: 5, text: 'Press in tabs on left and right sides of fuse block cover to open.' },
    { n: 6, text: 'Remove fuse or relay if needed by pulling straight out.' },
    { n: 7, text: 'Inspect fuse element. Replace if blown or discolored.' },
    { n: 8, text: 'Check fuse rating: Main (50A), System power (7.5A), Radio power (20A), P&A (20A), Cooling (15A), Battery (5A).' },
    { n: 9, text: 'Install new fuse into correct slot. Ensure proper seating.' },
    { n: 10, text: 'Install fuse block cover by engaging tabs on sides.' },
    { n: 11, text: 'Install main fuse if removed.' },
    { n: 12, text: 'WARNING: Verify all lights and switches operate properly before riding.' },
    { n: 13, text: 'Test affected circuit for proper operation.' }
  ]
},
{
  id: 't20-main-wire-harness-remove-install',
  bikeIds: ['touring-2020'],
  system: 'electrical',
  title: 'Main Wire Harness — Remove and Install',
  summary: 'Remove and install main electrical harness assembly with ground stud connections.',
  difficulty: 'Advanced',
  timeMinutes: 120,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 122 },
  figures: [],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'harness ground stud flange nut', value: '50-90 in-lbs' }
  ],
  steps: [
    { n: 1, text: 'Remove main fuse. See POWER DISCONNECT.' },
    { n: 2, text: 'Disconnect negative battery cable. See POWER DISCONNECT.' },
    { n: 3, text: 'Remove left side cover to access fuse block.' },
    { n: 4, text: 'Disconnect main harness connector from fuse block.' },
    { n: 5, text: 'Disconnect all branch harness connectors at left side caddy.' },
    { n: 6, text: 'Remove cable straps securing harness to frame.' },
    { n: 7, text: 'Disconnect ground stud connections at frame.' },
    { n: 8, text: 'Remove harness ground stud flange nuts.' },
    { n: 9, text: 'Route harness out through fairing or frame openings.' },
    { n: 10, text: 'Remove main harness assembly.' },
    { n: 11, text: 'Position new main harness in frame routing path.' },
    { n: 12, text: 'Route harness through same path as original, securing with cable straps.' },
    { n: 13, text: 'Position ground studs at frame attachment points.' },
    { n: 14, text: 'Install ground stud flange nuts. Tighten to 50-90 in-lbs.' },
    { n: 15, text: 'Connect all branch harness connectors at left side caddy.' },
    { n: 16, text: 'Connect main harness connector to fuse block.' },
    { n: 17, text: 'Connect negative battery cable.' },
    { n: 18, text: 'Install main fuse.' },
    { n: 19, text: 'Install left side cover.' },
    { n: 20, text: 'Test all electrical systems for proper operation.' }
  ]
},

{
  id: 't20-shifter-rod-remove-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Shifter Rod — Remove and Install',
  summary: 'Remove and install shifter rod assembly with ball studs.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 7 },
  figures: [{ num: '5-2', title: 'Shifter Linkage' }],
  tools: [],
  parts: [{ number: '', description: 'Washer (ball stud)', qty: 1 }, { number: '', description: 'Nut (shifter rod)', qty: 1 }],
  torque: [{ fastener: 'Shifter rod nut', value: '8-12 ft-lbs (11-16 N·m)' }, { fastener: 'Shifter rod jamnut', value: '80-120 in-lbs (9-13.6 N·m)' }],
  steps: [{ n: 1, text: 'Remove ball stud (14) from rear shifter rod lever.' }, { n: 2, text: 'Remove nut (11) and washer (12).' }, { n: 3, text: 'Remove shifter rod (2).' }, { n: 4, text: 'Install rear ball stud (14) to rear shifter rod lever.' }, { n: 5, text: 'Install front of shifter rod (2) through shifter rod lever (13).' }, { n: 6, text: 'Install washer (12) on ball stud.' }, { n: 7, text: 'Install nut (11). Tighten. Torque: 8-12 ft-lbs (11-16 N·m) Shifter rod nut.' }]
},
{
  id: 't20-shifter-rod-adjust',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Shifter Rod — Adjust',
  summary: 'Adjust shifter rod length to achieve proper gear engagement and lever travel.',
  difficulty: 'Moderate',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 7 },
  figures: [{ num: '5-2', title: 'Shifter Linkage' }],
  tools: [],
  parts: [],
  torque: [{ fastener: 'Shifter rod nut', value: '8-12 ft-lbs (11-16 N·m)' }, { fastener: 'Shifter rod jamnut', value: '80-120 in-lbs (9-13.6 N·m)' }],
  steps: [{ n: 1, text: 'Loosen jamnuts (1).' }, { n: 2, text: 'Remove nut (11) and washer (12).' }, { n: 3, text: 'Remove front of shifter rod (2).' }, { n: 4, text: 'Adjust rod as necessary.' }, { n: 5, text: 'Install front of shifter rod through shifter rod lever (13).' }, { n: 6, text: 'Install washer on ball stud (14).' }, { n: 7, text: 'Install nut (11). Tighten. Torque: 8-12 ft-lbs (11-16 N·m) Shifter rod nut.' }, { n: 8, text: 'Tighten jamnuts (1). Torque: 80-120 in-lbs (9-13.6 N·m) Shifter rod jamnut.' }]
},
{
  id: 't20-foot-shift-lever-remove-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Foot Shift Lever — Remove and Install',
  summary: 'Remove and install foot shift lever assembly with pegs and fasteners.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 7 },
  figures: [{ num: '5-2', title: 'Shifter Linkage' }],
  tools: [],
  parts: [{ number: '', description: 'Spacer (shift lever)', qty: 1 }, { number: '', description: 'Peg (shift lever)', qty: 2 }, { number: '', description: 'Screw (peg)', qty: 2 }, { number: '', description: 'Nut (shift lever)', qty: 2 }],
  torque: [{ fastener: 'Shift lever pinch screw', value: '9.0-12.0 ft-lbs (12.2-16.3 N·m)' }, { fastener: 'Shifter peg screw', value: '96-144 in-lbs (10.9-16.3 N·m)' }],
  steps: [{ n: 1, text: 'Mark position of lever (3) in relation to shaft (9) for reference during reinstallation.' }, { n: 2, text: 'Remove screw (7) and nut (4).' }, { n: 3, text: 'Remove lever from shaft.' }, { n: 4, text: 'Remove spacer (8).' }, { n: 5, text: 'Remove screw (5) and peg (6).' }, { n: 6, text: 'Install spacer (8) on shaft (9).' }, { n: 7, text: 'Align and install lever (3) to mark made during removal.' }, { n: 8, text: 'Install screw (7) and nut (4). Tighten. Torque: 9.0-12.0 ft-lbs (12.2-16.3 N·m) Shift lever pinch screw.' }, { n: 9, text: 'Install screw (5) through peg (6). Tighten. Torque: 96-144 in-lbs (10.9-16.3 N·m) Shifter peg screw.' }, { n: 10, text: 'Verify shift lever operation. NOTE: Peg height is customer preference. Peg must not contact footboard when shifting.' }]
},
{
  id: 't20-shifter-rod-lever-front-remove-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Shifter Rod Lever, Front — Remove and Install',
  summary: 'Remove and install front shifter rod lever with shaft alignment.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 8 },
  figures: [{ num: '5-2', title: 'Shifter Linkage' }],
  tools: [],
  parts: [{ number: '', description: 'Washer (shifter rod)', qty: 1 }, { number: '', description: 'Nut (shifter rod)', qty: 1 }],
  torque: [{ fastener: 'Shifter rod lever pinch screw, front lever', value: '132-156 in-lbs (14.9-17.6 N·m)' }, { fastener: 'Shifter rod nut', value: '8-12 ft-lbs (11-16 N·m)' }],
  steps: [{ n: 1, text: 'Mark position of shifter rod lever (13) in relation to shaft (9).' }, { n: 2, text: 'Remove screw (10).' }, { n: 3, text: 'Slide shaft (9) out enough to remove shifter rod lever.' }, { n: 4, text: 'Remove nut (11) and washer (12) from shifter rod.' }, { n: 5, text: 'Remove shifter rod (2).' }, { n: 6, text: 'Align and install lever (13) to marks made on shifter shaft (9) during removal.' }, { n: 7, text: 'Slide shifter shaft through lever.' }, { n: 8, text: 'Install screw (10). Tighten. Torque: 132-156 in-lbs (14.9-17.6 N·m) Shifter rod lever pinch screw.' }, { n: 9, text: 'Install shifter rod (1) through shifter rod lever (13).' }, { n: 10, text: 'Install washer (12) on shifter rod stud.' }, { n: 11, text: 'Install nut (11). Tighten. Torque: 8-12 ft-lbs (11-16 N·m) Shifter rod nut.' }, { n: 12, text: 'Verify shift lever operation.' }]
},
{
  id: 't20-transmission-side-cover-outer-remove',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Side Cover, Outer — Remove',
  summary: 'Remove outer transmission side cover screws and cover.',
  difficulty: 'Easy',
  timeMinutes: 10,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 9 },
  figures: [{ num: '5-3', title: 'Transmission Side Covers' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'Remove screws (4).' }, { n: 2, text: 'Remove outer cover (5).' }]
},
{
  id: 't20-transmission-side-cover-outer-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Side Cover, Outer — Install',
  summary: 'Install outer transmission side cover with fasteners.',
  difficulty: 'Easy',
  timeMinutes: 10,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 9 },
  figures: [{ num: '5-3', title: 'Transmission Side Covers' }],
  tools: [],
  parts: [{ number: '', description: 'Screw (outer side cover)', qty: 2 }],
  torque: [{ fastener: 'Transmission outer side cover screw', value: '100-120 in-lbs (11.2-13.6 N·m)' }],
  steps: [{ n: 1, text: 'Install outer cover (5).' }, { n: 2, text: 'Install screws (4). Tighten. Torque: 100-120 in-lbs (11.2-13.6 N·m) Transmission outer side cover screw.' }]
},
{
  id: 't20-transmission-side-cover-inner-remove',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Side Cover, Inner — Remove',
  summary: 'Remove inner transmission side cover with gasket.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 9 },
  figures: [{ num: '5-3', title: 'Transmission Side Covers' }],
  tools: [],
  parts: [{ number: '', description: 'Gasket (inner side cover)', qty: 1 }],
  torque: [],
  steps: [{ n: 1, text: 'Remove secondary clutch actuator if necessary. See Secondary Clutch Actuator (Page 5-9).' }, { n: 2, text: 'Remove screws (6).' }, { n: 3, text: 'Remove inner side cover (1).' }, { n: 4, text: 'Discard gasket (2).' }, { n: 5, text: 'NOTE: Clean with denatured alcohol only. Clean and inspect inner cover.' }]
},
{
  id: 't20-transmission-side-cover-inner-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Side Cover, Inner — Install',
  summary: 'Install inner transmission side cover with new gasket.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 9 },
  figures: [{ num: '5-3', title: 'Transmission Side Covers' }],
  tools: [],
  parts: [{ number: '', description: 'Gasket (inner side cover)', qty: 1 }, { number: '', description: 'Screw (inner side cover)', qty: 4 }],
  torque: [{ fastener: 'Transmission inner side cover screw', value: '132-156 in-lbs (14.9-17.6 N·m)' }],
  steps: [{ n: 1, text: 'Install new gasket (2).' }, { n: 2, text: 'Install inner cover (1).' }, { n: 3, text: 'Install screws (6). Tighten. Torque: 132-156 in-lbs (14.9-17.6 N·m) Transmission inner side cover screw.' }, { n: 4, text: 'If removed, install secondary clutch actuator (3). See Secondary Clutch Actuator (Page 5-9).' }]
},
{
  id: 't20-secondary-clutch-actuator-remove',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Secondary Clutch Actuator — Remove',
  summary: 'Remove secondary clutch actuator from transmission side cover.',
  difficulty: 'Moderate',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 9 },
  figures: [{ num: '5-5', title: 'Secondary Clutch Actuator' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'WARNING: A small amount of transmission lubricant drains when secondary clutch actuator is removed. Do not allow DOT 4 fluid to contact diaphragm. If DOT 4 fluid contacts painted surfaces, IMMEDIATELY flush area with clear water.' }, { n: 2, text: 'If replacing actuator: Drain clutch fluid. See HYDRAULIC CLUTCH FLUID (page 2-12).' }, { n: 3, text: 'Disconnect clutch fluid line (2). Place a rag under flare nut.' }, { n: 4, text: 'Disconnect flare nut. Allow fluid to drain.' }, { n: 5, text: 'If removing actuator to service other components: Compress clutch lever slightly and place eyelet of cable strap between lever and housing.' }, { n: 6, text: 'See Figure 5-5. Remove screws (3) and secondary clutch actuator (4).' }]
},
{
  id: 't20-secondary-clutch-actuator-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Secondary Clutch Actuator — Install',
  summary: 'Install secondary clutch actuator with torque sequence and fluid connections.',
  difficulty: 'Moderate',
  timeMinutes: 25,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 9 },
  figures: [{ num: '5-5', title: 'Secondary Clutch Actuator' }, { num: '5-6', title: 'Secondary Clutch Actuator Torque Sequence' }],
  tools: [],
  parts: [{ number: '', description: 'Screw (secondary clutch actuator)', qty: 3 }],
  torque: [{ fastener: 'Secondary clutch actuator screw', value: '8-10 ft-lbs (11.2-13.6 N·m)' }, { fastener: 'Secondary clutch fluid lines', value: '11-15 ft-lbs (15-21 N·m)' }],
  steps: [{ n: 1, text: 'Lubricate mounting bore in side cover with a film of transmission lubricant.' }, { n: 2, text: 'Install secondary clutch actuator (4) and screws (3).' }, { n: 3, text: 'Draw screws down evenly to prevent binding and possible breakage of mounting ears. Tighten. Torque: 8-10 ft-lbs (11.2-13.6 N·m) Secondary clutch actuator screw.' }, { n: 4, text: 'Connect fluid line if removed: Connect fluid line (2). Tighten. Torque: 11-15 ft-lbs (15-21 N·m) Secondary clutch fluid lines.' }, { n: 5, text: 'Fill and bleed clutch control system. See BLEED CLUTCH CONTROL SYSTEM (Page 3-84).' }]
},
{
  id: 't20-clutch-release-bearing-remove',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Clutch Release Bearing — Remove',
  summary: 'Remove clutch cover, bearing plate, and release bearing assembly.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 11 },
  figures: [{ num: '5-8', title: 'Release Bearing and Pushrod' }, { num: '5-9', title: 'Clutch Cover' }],
  tools: [],
  parts: [{ number: '', description: 'Retaining ring (bearing)', qty: 1 }, { number: '', description: 'Gasket (clutch cover)', qty: 1 }],
  torque: [],
  steps: [{ n: 1, text: 'Remove clutch cover. See Figure 5-9.' }, { n: 2, text: 'Remove and discard retaining ring (1) from bearing plate.' }, { n: 3, text: 'Remove bearing plate (3) with bearing (4) and rod (5).' }, { n: 4, text: 'Remove pushrod (6) if necessary.' }]
},
{
  id: 't20-clutch-release-bearing-install',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Clutch Release Bearing — Install',
  summary: 'Install clutch release bearing, plate, and cover with measurement verification.',
  difficulty: 'Moderate',
  timeMinutes: 35,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 11 },
  figures: [{ num: '5-8', title: 'Release Bearing and Pushrod' }, { num: '5-9', title: 'Clutch Cover' }],
  tools: [],
  parts: [{ number: '', description: 'Retaining ring (bearing)', qty: 1 }, { number: '', description: 'Gasket (clutch cover)', qty: 1 }],
  torque: [{ fastener: 'Clutch cover screw', value: '84-108 in-lbs (9.5-12.2 N·m)' }],
  steps: [{ n: 1, text: 'Install pushrod (6) if removed.' }, { n: 2, text: 'Seat bearing plate (3) in clutch.' }, { n: 3, text: 'Install new retaining ring (1).' }, { n: 4, text: 'Thoroughly clean oil from clutch cover and mating surface on primary cover.' }, { n: 5, text: 'Install clutch cover, new gasket and screws. Tighten screws in sequence shown. Torque: 84-108 in-lbs (9.5-12.2 N·m) Clutch cover screw.' }, { n: 6, text: 'Measure release plate movement: Attach dial indicator to measure pushrod axial movement.' }, { n: 7, text: 'Actuate clutch lever to measure axial movement. Minimum axial movement: 0.086 in (2.18 mm). If less, bleed system and remeasure.' }]
},
{
  id: 't20-clutch-release-bearing-disassemble',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Clutch Release Bearing — Disassemble',
  summary: 'Disassemble release bearing from bearing plate and rod.',
  difficulty: 'Moderate',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 11 },
  figures: [{ num: '5-8', title: 'Release Bearing and Pushrod' }],
  tools: [],
  parts: [{ number: '', description: 'Release rod retainer', qty: 1 }],
  torque: [],
  steps: [{ n: 1, text: 'Remove and discard release rod retainer (2).' }, { n: 2, text: 'Press release rod (5) from bearing (4).' }, { n: 3, text: 'Press release bearing (4) from bearing plate (3).' }]
},
{
  id: 't20-clutch-release-bearing-assemble',
  bikeIds: ['touring-2020'],
  system: 'drivetrain',
  title: 'Clutch Release Bearing — Assemble',
  summary: 'Assemble release bearing into bearing plate with rod and retainer.',
  difficulty: 'Moderate',
  timeMinutes: 20,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 11 },
  figures: [{ num: '5-8', title: 'Release Bearing and Pushrod' }],
  tools: [],
  parts: [{ number: '', description: 'Release bearing (new)', qty: 1 }, { number: '', description: 'Release rod retainer (new)', qty: 1 }],
  torque: [],
  steps: [{ n: 1, text: 'Press on the outer race to install a new release bearing (4) into bearing plate (3).' }, { n: 2, text: 'Assemble release rod (5) to bearing.' }, { n: 3, text: 'Install new retainer (2).' }]
},
{
  id: 't20-transmission-top-cover-remove',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Top Cover — Remove',
  summary: 'Remove transmission top cover bolts and cover assembly.',
  difficulty: 'Easy',
  timeMinutes: 10,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 31 },
  figures: [],
  tools: [],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'Remove transmission top cover screws.' }, { n: 2, text: 'Remove top cover assembly.' }]
},
{
  id: 't20-transmission-top-cover-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Top Cover — Install',
  summary: 'Install transmission top cover with gasket and fasteners.',
  difficulty: 'Easy',
  timeMinutes: 10,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 31 },
  figures: [],
  tools: [],
  parts: [{ number: '', description: 'Gasket (top cover)', qty: 1 }],
  torque: [{ fastener: 'Transmission top cover screw', value: '132-156 in-lbs (14.9-17.6 N·m)' }],
  steps: [{ n: 1, text: 'Set shifter cam pawl on shift cam.' }, { n: 2, text: 'Inspect transmission top cover gasket. Replace as necessary.' }, { n: 3, text: 'Install transmission top cover and screws. Tighten. Torque: 132-156 in-lbs (14.9-17.6 N·m) Transmission top cover screw.' }, { n: 4, text: 'Install vent hose to top cover fitting, if removed.' }]
},
{
  id: 't20-transmission-shift-forks-remove',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Shift Forks and Shafts — Remove',
  summary: 'Remove shift fork shafts and forks from transmission drum.',
  difficulty: 'Advanced',
  timeMinutes: 40,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 32 },
  figures: [{ num: '5-45', title: 'Gear Set' }],
  tools: ['Spiral-flute screw extractor or vise grips'],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'Set bearing housing on bench with shafts pointing up.' }, { n: 2, text: 'NOTE: Shafts have slight interference fit.' }, { n: 3, text: 'Remove shift fork shafts using spiral-flute screw extractor (14) or vise grips.' }, { n: 4, text: 'Mark end of shaft to aid assembly.' }, { n: 5, text: 'Remove shift forks from dog rings.' }]
},
{
  id: 't20-transmission-shift-forks-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Shift Forks and Shafts — Install',
  summary: 'Install shift forks into dog rings and install shafts.',
  difficulty: 'Advanced',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 38 },
  figures: [{ num: '5-62', title: 'Transmission Gears and Shifter Forks' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'Install long shift shaft (1).' }, { n: 2, text: 'Insert shifter fork (2) into dog ring between mainshaft fifth and sixth gear.' }, { n: 3, text: 'Slide shift shaft through shifter fork. Install shaft in bearing housing.' }, { n: 4, text: 'Install short shift shaft (4).' }, { n: 5, text: 'Insert shifter fork (6) into dog ring between countershaft third and fourth gear.' }, { n: 6, text: 'Insert shifter fork (9) into dog ring between countershaft first and second gear.' }, { n: 7, text: 'Slide shift shaft through shifter forks. Install shaft in bearing housing.' }]
},
{
  id: 't20-transmission-shift-drum-remove-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Shift Drum (Shift Cam) — Remove and Install',
  summary: 'Remove and install shift drum with lock plate and detent assembly.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 32 },
  figures: [{ num: '5-46', title: 'Shift Drum' }],
  tools: [],
  parts: [{ number: '', description: 'Lock plate screw (new)', qty: 2 }],
  torque: [{ fastener: 'Shift drum lock plate screws', value: '57-63 in-lbs (6.4-7.1 N·m)' }],
  steps: [{ n: 1, text: 'Remove lock plate (2). Discard screws (3).' }, { n: 2, text: 'Hold detent arm back and remove shift cam (4).' }, { n: 3, text: 'Install new lock plate screws (3). Tighten. Torque: 57-63 in-lbs (6.4-7.1 N·m) Shift drum lock plate screws.' }]
},
{
  id: 't20-transmission-detent-lever-spring-remove-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Detent Lever and Spring — Remove and Install',
  summary: 'Remove and install detent screw, arm, sleeve and spring assembly.',
  difficulty: 'Moderate',
  timeMinutes: 25,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 32 },
  figures: [{ num: '5-47', title: 'Detent Assembly' }, { num: '5-59', title: 'Detent Assembly' }],
  tools: [],
  parts: [{ number: '', description: 'Detent screw (new)', qty: 1 }],
  torque: [{ fastener: 'Shift drum detent screw', value: '120-150 in-lbs (13.6-17 N·m)' }],
  steps: [{ n: 1, text: 'Remove detent screw (1), detent arm (2), sleeve (3) and detent spring (4). Discard detent screw.' }, { n: 2, text: 'Mark parts so they can be installed in same direction as removed.' }, { n: 3, text: 'Clean detent screw mounting hole in transmission bearing housing.' }, { n: 4, text: 'Assemble new detent screw (1), detent arm (2), sleeve (3) and detent spring (4).' }, { n: 5, text: 'Align spring and detent arm as shown. Install detent assembly in bearing housing with screw (1). Tighten. Torque: 120-150 in-lbs (13.6-17 N·m) Shift drum detent screw.' }]
},
{
  id: 't20-countershaft-assembly-remove',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Countershaft Assembly — Remove',
  summary: 'Remove countershaft from bearing housing with gears attached.',
  difficulty: 'Advanced',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 34 },
  figures: [{ num: '5-50', title: 'Countershaft First Gear' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'If mainshaft is not removed, hold countershaft third and fourth gear shift dog up while removing countershaft.' }, { n: 2, text: 'NOTE: Do not press directly on end of countershaft. Place a spacer between end of countershaft and press ram.' }, { n: 3, text: 'Press countershaft out of bearing housing bearing.' }]
},
{
  id: 't20-countershaft-assembly-disassemble',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Countershaft Assembly — Disassemble',
  summary: 'Disassemble countershaft gears and bearings from shaft.',
  difficulty: 'Advanced',
  timeMinutes: 50,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 34 },
  figures: [{ num: '5-50', title: 'Countershaft First Gear' }, { num: '5-51', title: 'Countershaft Second Gear' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'Remove washer (1), countershaft first gear (2) and bearing.' }, { n: 2, text: 'Remove countershaft second, third and forth gears: Remove dog ring (5). Remove lock ring (1). Remove securing segments (2).' }, { n: 3, text: 'Remove guiding hub (3), countershaft second gear (4) and bearing.' }, { n: 4, text: 'Repeat steps with third and fourth gears using Figure 5-52 and Figure 5-53.' }, { n: 5, text: 'NOTE: The countershaft fifth gear and sixth gear are integral parts of the shaft. Damage to either gear requires countershaft replacement.' }]
},
{
  id: 't20-countershaft-assembly-assemble',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Countershaft Assembly — Assemble',
  summary: 'Assemble countershaft gears and bearings onto shaft.',
  difficulty: 'Advanced',
  timeMinutes: 55,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 36 },
  figures: [{ num: '5-56', title: 'Preload Scissor First Gear' }, { num: '5-51', title: 'Countershaft Second Gear' }],
  tools: ['Scissor first gear tool (HD-52235)'],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'Install fourth, third and second gears on countershaft.' }, { n: 2, text: 'Install countershaft fourth gear (4). Lubricate needle bearings and races using SCREAMIN\' EAGLE ASSEMBLY LUBE.' }, { n: 3, text: 'Install new needle bearing. Install guiding hub (3). Install dog ring (5).' }, { n: 4, text: 'Install securing segments (2) with rounded edge facing up. Verify that segments fully engage grooves in countershaft.' }, { n: 5, text: 'Install lock ring (1) with waved, stepped face toward securing segments.' }, { n: 6, text: 'Repeat for countershaft third gear (4) and second gear (4). Install second gear guiding hub with deeper counterbore facing countershaft second gear.' }, { n: 7, text: 'Preload scissor first gear: While holding thick gear, rotate thin gear until holes align. Install HD-52235 (SCISSOR FIRST GEAR TOOL).' }, { n: 8, text: 'Install new needle bearing, countershaft first gear (2) and washer (1).' }]
},
{
  id: 't20-countershaft-assembly-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Countershaft Assembly — Install',
  summary: 'Install countershaft into bearing housing with proper support.',
  difficulty: 'Advanced',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 37 },
  figures: [{ num: '5-57', title: 'Installing Countershaft' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'Support countershaft sixth gear in press.' }, { n: 2, text: 'Using a suitable sleeve, press on bearing inner race until bearing contacts countershaft first gear washer.' }, { n: 3, text: 'If mainshaft is installed, raise and hold countershaft third and fourth gear shift dog while installing countershaft.' }, { n: 4, text: 'Install countershaft to bearing housing.' }, { n: 5, text: 'NOTE: If installing countershaft with mainshaft installed, raise and hold countershaft third and fourth gear shift dog up while pressing bearing housing bearing on to countershaft.' }]
},
{
  id: 't20-mainshaft-assembly-remove',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Mainshaft Assembly — Remove',
  summary: 'Remove mainshaft from bearing housing with gears and bearings.',
  difficulty: 'Advanced',
  timeMinutes: 40,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 33 },
  figures: [{ num: '5-49', title: 'Mainshaft Fifth Gear' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'Remove retaining ring from mainshaft fifth gear.' }, { n: 2, text: 'Remove dog ring (3), guiding hub (2), mainshaft fifth gear (4) and bearing.' }, { n: 3, text: 'NOTE: Do not press directly on end of mainshaft. Use a spacer between end of mainshaft and press ram.' }, { n: 4, text: 'Press mainshaft out of bearing housing.' }, { n: 5, text: 'NOTE: Mainshaft fourth gear, third gear, second gear and first gear are integral parts of the shaft. Damage to any gear requires mainshaft replacement.' }]
},
{
  id: 't20-mainshaft-assembly-disassemble',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Mainshaft Assembly — Disassemble',
  summary: 'Disassemble mainshaft fifth and sixth gear components.',
  difficulty: 'Advanced',
  timeMinutes: 40,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 33 },
  figures: [{ num: '5-49', title: 'Mainshaft Fifth Gear' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'Remove retaining ring. Remove dog ring (3), guiding hub (2), mainshaft fifth gear (4) and bearing from mainshaft.' }, { n: 2, text: 'NOTE: Mainshaft fourth, third, second and first gears are integral to shaft. Inspect these gears for wear or damage.' }]
},
{
  id: 't20-mainshaft-assembly-assemble',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Mainshaft Assembly — Assemble',
  summary: 'Assemble mainshaft fifth and sixth gear bearings and components.',
  difficulty: 'Advanced',
  timeMinutes: 35,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 37 },
  figures: [{ num: '5-49', title: 'Mainshaft Fifth Gear' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'With bearing housing on end (shafts pointing up), install new bearing and mainshaft fifth gear (4).' }, { n: 2, text: 'With guiding hub counterbore facing mainshaft fifth gear, install guiding hub (2) and dog ring (3).' }, { n: 3, text: 'Install new retaining ring (1).' }, { n: 4, text: 'Remove holding tool from scissor first gear.' }, { n: 5, text: 'Install new mainshaft and countershaft locknuts. Using dog rings, lock two gears in place.' }]
},
{
  id: 't20-mainshaft-assembly-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Mainshaft Assembly — Install',
  summary: 'Install mainshaft into bearing housing with proper bearing support.',
  difficulty: 'Advanced',
  timeMinutes: 35,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 37 },
  figures: [{ num: '5-58', title: 'Raise and Hold Dog Ring' }],
  tools: [],
  parts: [],
  torque: [{ fastener: 'Transmission mainshaft/countershaft locknuts', value: '85-95 ft-lbs (115.3-128.8 N·m)' }],
  steps: [{ n: 1, text: 'Support mainshaft fourth gear in press.' }, { n: 2, text: 'Raise and hold dog ring engaged with countershaft third gear during press procedure.' }, { n: 3, text: 'Using a suitable sleeve, press on bearing inner race until bearing contacts mainshaft first gear.' }, { n: 4, text: 'If mainshaft is not removed, raise and hold countershaft third and fourth gear shift dog while installing countershaft.' }, { n: 5, text: 'Install new mainshaft and countershaft locknuts. Temporarily install transmission assembly in transmission case. Install locknuts. Tighten. Torque: 85-95 ft-lbs (115.3-128.8 N·m).' }, { n: 6, text: 'Remove transmission assembly from transmission case.' }]
},
{
  id: 't20-main-drive-gear-remove',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Main Drive Gear — Remove',
  summary: 'Remove main drive gear using specialized removal tool.',
  difficulty: 'Advanced',
  timeMinutes: 45,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 41 },
  figures: [{ num: '5-63', title: 'Removing Main Drive Gear' }],
  tools: ['MAIN DRIVE GEAR REMOVER AND INSTALLER SET (HD-35316-D)'],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'See Figure 5-63. Remove main drive gear using MAIN DRIVE GEAR REMOVER AND INSTALLER SET (HD-35316-D).' }, { n: 2, text: 'Remove and discard main drive gear oil seal (4).' }, { n: 3, text: 'Remove and discard retaining ring (3).' }, { n: 4, text: 'Remove and discard main drive gear bearing (2) using MAIN DRIVE GEAR REMOVER AND INSTALLER SET (HD-35316-D).' }]
},
{
  id: 't20-main-drive-gear-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Main Drive Gear — Install',
  summary: 'Install main drive gear with bearing, O-ring, and seals.',
  difficulty: 'Advanced',
  timeMinutes: 50,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 42 },
  figures: [{ num: '5-64', title: 'Main Drive Bearing' }, { num: '5-67', title: 'Installing Main Drive Gear (Typical)' }, { num: '5-68', title: 'Retaining Ring Opening' }],
  tools: ['MAIN DRIVE GEAR REMOVER AND INSTALLER SET (HD-35316-D)', 'MAIN DRIVE GEAR SEAL INSTALLER KIT (HD-47856)'],
  parts: [{ number: '', description: 'Main drive gear bearing (new)', qty: 1 }, { number: '', description: 'Retaining ring (new)', qty: 1 }, { number: '', description: 'O-ring (new)', qty: 1 }, { number: '', description: 'Main drive gear seal (new)', qty: 1 }],
  torque: [],
  steps: [{ n: 1, text: 'See Figure 5-64 and Figure 5-66. Install main drive gear bearing using MAIN DRIVE GEAR REMOVER AND INSTALLER SET (HD-35316-D).' }, { n: 2, text: 'Install new O-ring (4) onto main drive gear (3). Lubricate O-ring with clean engine oil.' }, { n: 3, text: 'Install main drive gear using MAIN DRIVE GEAR REMOVER AND INSTALLER SET (HD-35316-D).' }, { n: 4, text: 'Install new retaining ring. NOTE: Retaining ring opening must be within range shown in Figure 5-68.' }, { n: 5, text: 'See Figure 5-69. Install new main drive gear large seal using MAIN DRIVE GEAR SEAL INSTALLER KIT (HD-47856).' }]
},
{
  id: 't20-main-drive-gear-bearing-inspect',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Main Drive Gear Bearing — Clean and Inspect',
  summary: 'Clean and inspect main drive gear bearings and mainshaft seals.',
  difficulty: 'Moderate',
  timeMinutes: 25,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 42 },
  figures: [{ num: '5-70', title: 'Main Drive Gear Assembly' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'NOTE: Never wash transmission case and needle bearings with solvent unless replacing needle bearings. Normal cleaning methods wash dirt or other contaminants into bearing case (behind the needles) and leads to bearing failure.' }, { n: 2, text: 'Clean all parts in solvent except transmission case and needle bearings. Dry parts with low-pressure, compressed air.' }, { n: 3, text: 'See Figure 5-70. Inspect main drive gear (3) for pitting and wear.' }, { n: 4, text: 'Inspect needle bearings (2) inside main drive gear.' }, { n: 5, text: 'Inspect mainshaft race. Replace needle bearings if mainshaft race is damaged.' }, { n: 6, text: 'Inspect main drive gear and mainshaft seals. Replace if damaged.' }]
},
{
  id: 't20-main-drive-gear-needle-bearings-replace',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Main Drive Gear Needle Bearings — Replace',
  summary: 'Remove and install needle bearings in main drive gear.',
  difficulty: 'Advanced',
  timeMinutes: 40,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 42 },
  figures: [{ num: '5-72', title: 'Installing Outer Needle Bearing in Main Drive Gear' }, { num: '5-73', title: 'Pressing in Seal' }, { num: '5-74', title: 'Installing Inner Needle Bearing in Main Drive Gear' }],
  tools: ['MAIN DRIVE GEAR BEARING AND SEAL INSTALLATION TOOL (HD-47932)'],
  parts: [{ number: '', description: 'Needle bearing (outer)', qty: 1 }, { number: '', description: 'Needle bearing (inner)', qty: 1 }, { number: '', description: 'Mainshaft seal (new)', qty: 1 }, { number: '', description: 'Retaining ring (new)', qty: 2 }, { number: '', description: 'O-ring (new)', qty: 1 }, { number: '', description: 'Spacer', qty: 1 }],
  torque: [],
  steps: [{ n: 1, text: 'Remove and discard mainshaft seal (6).' }, { n: 2, text: 'Remove retaining rings (1), needle bearings (2) and spacer (5) from main drive gear (3). Discard retaining rings.' }, { n: 3, text: 'Discard O-ring (4).' }, { n: 4, text: 'Press in outer needle bearing near spline end of main drive gear until tool contacts spline using MAIN DRIVE GEAR BEARING AND SEAL INSTALLATION TOOL (HD-47932).' }, { n: 5, text: 'Install mainshaft seal with garter spring side down using 0.090-in step of tool. Press until tool contacts gear.' }, { n: 6, text: 'Turn over the main drive gear. Install spacer (5).' }, { n: 7, text: 'Press inner needle bearing from gear end until tool contacts gear using MAIN DRIVE GEAR BEARING AND SEAL INSTALLATION TOOL (HD-47932).' }, { n: 8, text: 'Install new retaining rings (1). Install new O-ring (4).' }]
},
{
  id: 't20-transmission-case-remove',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Case — Remove',
  summary: 'Remove transmission case from motorcycle engine and crankcase.',
  difficulty: 'Advanced',
  timeMinutes: 120,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 46 },
  figures: [{ num: '5-78', title: 'Transmission Case Pry Point' }, { num: '5-79', title: 'Transmission Housing to Crankcase Tightening Sequence' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'Remove battery. See INSPECT BATTERY (Page 2-46). Remove battery tray. See BATTERY TRAY (Page 8-116).' }, { n: 2, text: 'Drain engine oil. See REPLACE ENGINE OIL AND FILTER (Page 2-9).' }, { n: 3, text: 'Drain transmission oil. See REPLACE TRANSMISSION LUBRICANT (Page 2-13).' }, { n: 4, text: 'Drain primary chaincase oil. See REPLACE PRIMARY CHAINCASE LUBRICANT (Page 2-11).' }, { n: 5, text: 'Disconnect oil return line from oil return tube (1).' }, { n: 6, text: 'Remove exhaust system. See EXHAUST SYSTEM (Page 6-34).' }, { n: 7, text: 'Remove clutch outer side cover. See TRANSMISSION SIDE COVERS: HYDRAULIC CLUTCH (Page 5-9).' }, { n: 8, text: 'Remove screw securing jiffy stand sensor, if equipped. See JIFFY STAND SENSOR (JSS) (Page 8-107).' }, { n: 9, text: 'Remove rider footboard and bracket, if needed. See RIDER FOOTRESTS (Page 3-142).' }, { n: 10, text: 'Remove shift levers and shift lever shaft. See SHIFTER LINKAGE (Page 5-7).' }, { n: 11, text: 'Position jack across lower frame. Remove rear fork. See REAR FORK (Page 3-71). Disconnect vehicle speed sensor (VSS) and neutral switch.' }, { n: 12, text: 'Remove transmission assembly. See TRANSMISSION (Page 5-31).' }, { n: 13, text: 'Remove oil pan. See OIL PAN (Page 4-75).' }, { n: 14, text: 'Remove battery negative cable from ground post at top of transmission case.' }, { n: 15, text: 'Move aside harness that terminates at O2 sensor, starter solenoid, neutral switch and VSS.' }, { n: 16, text: 'In a cross-wise pattern, remove four bolts securing transmission to engine. NOTE: Do not use a hammer to remove transmission. If transmission sticks on ring dowels, gently pry away from crankcase using pry point.' }, { n: 17, text: 'Move transmission rearward until two ring dowels in lower flange are free of crankcase. Remove transmission case from left side of motorcycle.' }]
},
{
  id: 't20-transmission-case-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Case — Install',
  summary: 'Install transmission case with gaskets and fasteners to engine.',
  difficulty: 'Advanced',
  timeMinutes: 100,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 46 },
  figures: [{ num: '5-79', title: 'Transmission Housing to Crankcase Tightening Sequence' }],
  tools: [],
  parts: [{ number: '', description: 'Engine-to-transmission gasket (new)', qty: 1 }],
  torque: [{ fastener: 'Transmission mounting bolts, 1st torque', value: '15 ft-lbs (20.3 N·m)' }, { fastener: 'Transmission mounting bolts, final torque', value: '34-39 ft-lbs (46.1-52.9 N·m)' }, { fastener: 'Battery ground cable to transmission', value: '66-114 in-lbs (7.5-12.9 N·m)' }],
  steps: [{ n: 1, text: 'Install new ground post at top of transmission case. Tighten ground post until snug.' }, { n: 2, text: 'Wipe all engine oil from pockets in crankcase flange.' }, { n: 3, text: 'Install new engine-to-transmission gasket.' }, { n: 4, text: 'Verify that transmission dowels are seated. Place transmission case into position.' }, { n: 5, text: 'Install shorter bolts at top, longer bolts at bottom. Hand-tighten bolts.' }, { n: 6, text: 'See Figure 5-79. Tighten bolts in sequence. Torque: 15 ft-lbs (20.3 N·m) Transmission mounting bolts, 1st torque.' }, { n: 7, text: 'Tighten to final torque in same sequence. Torque: 34-39 ft-lbs (46.1-52.9 N·m) Transmission mounting bolts, final torque.' }, { n: 8, text: 'Secure battery ground cable to ground post at top of transmission case. Tighten. Torque: 66-114 in-lbs (7.5-12.9 N·m) Battery ground cable to transmission.' }, { n: 9, text: 'Install transmission assembly. See TRANSMISSION (Page 5-31).' }, { n: 10, text: 'Install oil pan. See OIL PAN (Page 4-75). Install rear fork. See REAR FORK (Page 3-71).' }, { n: 11, text: 'Fill engine oil, transmission oil, and primary chaincase oil. Install battery and battery tray.' }, { n: 12, text: 'Adjust drive belt deflection. See INSPECT AND ADJUST DRIVE BELT AND SPROCKETS (Page 2-36).' }]
},
{
  id: 't20-transmission-case-shifter-pawl-remove',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Case Shifter Pawl Lever — Remove',
  summary: 'Remove shifter pawl assembly, rod lever, and retaining components.',
  difficulty: 'Moderate',
  timeMinutes: 30,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 47 },
  figures: [{ num: '5-82', title: 'Shifter Arm and Pawl Assembly (Typical)' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [{ n: 1, text: 'Mark splines on shifter pawl lever assembly (1) and shift rod lever (9) to help with assembly.' }, { n: 2, text: 'Remove screw (8). Remove shifter rod lever from shifter pawl lever assembly.' }, { n: 3, text: 'Remove retaining ring (7), washer (6) and seal (5). Discard retaining ring and seal.' }, { n: 4, text: 'Remove shifter pawl lever assembly (1).' }, { n: 5, text: 'Inspect sleeve (3) in transmission case.' }]
},
{
  id: 't20-transmission-case-shifter-pawl-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Case Shifter Pawl Lever — Install',
  summary: 'Install shifter pawl assembly with seal and rod lever.',
  difficulty: 'Moderate',
  timeMinutes: 35,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 48 },
  figures: [{ num: '5-82', title: 'Shifter Arm and Pawl Assembly (Typical)' }, { num: '5-83', title: 'Shifter Pawl Lever Assembly' }, { num: '5-84', title: 'Shifter Shaft Lever, Exterior View' }],
  tools: ['SHIFTER SHAFT SEAL INSTALLATION TOOL (HD-51337)'],
  parts: [{ number: '', description: 'Seal (shifter pawl)', qty: 1 }, { number: '', description: 'Washer (shifter pawl)', qty: 1 }, { number: '', description: 'Retaining ring (new)', qty: 1 }],
  torque: [{ fastener: 'Shifter pawl centering screw', value: '18-23 ft-lbs (24.4-31.2 N·m)' }, { fastener: 'Shifter rod lever pinch screw', value: '18-22 ft-lbs (24.4-29.8 N·m)' }],
  steps: [{ n: 1, text: 'Verify that sleeve (3) is in transmission case bore.' }, { n: 2, text: 'Install screw (10) into side of transmission case. Tighten. Torque: 18-23 ft-lbs (24.4-31.2 N·m) Shifter pawl centering screw.' }, { n: 3, text: 'Assemble shifter arm: Slide centering spring (3) over shaft of shifter pawl lever (2). Align opening on spring with tab on lever.' }, { n: 4, text: 'Place lever spring (4) on shifter pawl lever. Flex spring only enough to assemble.' }, { n: 5, text: 'Insert shifter arm assembly into transmission case. Verify that pin of screw sits inside lever spring.' }, { n: 6, text: 'Install new seal with garter spring facing transmission. Drive seal until tool bottoms on transmission case using SHIFTER SHAFT SEAL INSTALLATION TOOL (HD-51337).' }, { n: 7, text: 'Install washer (1) and new retaining ring (2).' }, { n: 8, text: 'Install shifter rod lever (9). Install pinch screw (8). Tighten. Torque: 18-22 ft-lbs (24.4-29.8 N·m) Shifter rod lever pinch screw. NOTE: Install shifter rod lever one spline from vertical toward front of vehicle.' }]
},
{
  id: 't20-transmission-case-oil-return-tube-remove-install',
  bikeIds: ['touring-2020'],
  system: 'transmission',
  title: 'Transmission Case Oil Return Tube/Cover — Remove and Install',
  summary: 'Remove and install oil return tube or cover with O-ring.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2020 HD Touring Service Manual.pdf', page: 47 },
  figures: [{ num: '5-80', title: 'Oil Return Tube/Cover' }],
  tools: [],
  parts: [{ number: '', description: 'O-ring (new)', qty: 1 }],
  torque: [{ fastener: 'Oil return tube screw', value: '100-120 in-lbs (11.3-13.6 N·m)' }],
  steps: [{ n: 1, text: 'If transmission case is installed in vehicle, disconnect battery.' }, { n: 2, text: 'Remove screw (1).' }, { n: 3, text: 'Remove oil return tube (2) or cover (3).' }, { n: 4, text: 'Install new O-ring (4).' }, { n: 5, text: 'Install oil return tube (2) or cover (3).' }, { n: 6, text: 'Install screw (1). Tighten. Torque: 100-120 in-lbs (11.3-13.6 N·m) Oil return tube screw.' }]
},

// --- BEGIN SOFTAIL 2025 CHAPTER 2 JOBS ---
{ id: 's25-maint-engine-oil-change', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Replace Engine Oil and Filter', summary: 'Drain old oil, replace filter and drain plug O-ring, refill with correct grade, and verify level hot and cold.', difficulty: 'Easy', timeMinutes: 45, source: { manual: '2025 HD Softail Service Manual', page: '2-5' }, figures: [{ file: '/figures/softail-2025/p2-5.jpg', caption: 'Manual page 2-5' }], tools: ['Oil Filter Wrench HD-94863-10', 'Oil Filter Wrench HD-94686-00'], parts: [{ number: '', description: 'Engine oil drain plug O-ring', qty: 1 }, { number: '', description: 'Engine oil (4.0 qt / 3.8 L)', qty: 1 }, { number: '', description: 'Oil filter', qty: 1 }], torque: [{ fastener: 'Engine oil drain plug', value: '14–21 ft-lbs (19–28.5 N·m)' }], steps: [{ n: 1, text: 'Run motorcycle until engine reaches normal operating temperature, then turn off.' }, { n: 2, text: 'Remove filler plug/dipstick.' }, { n: 3, text: 'Remove oil drain plug (2) and O-ring, allow oil to drain completely.' }, { n: 4, text: 'Remove oil filter using wrench; do not use air tools. Clean filter mount flange.' }, { n: 5, text: 'Clean any residual oil from crankcase and transmission housing.' }, { n: 6, text: 'Lubricate new oil filter gasket with thin film of clean engine oil.' }, { n: 7, text: 'Install new oil filter, hand-tighten one-half to three-quarters turn after gasket contacts mount. Do not use wrench.' }, { n: 8, text: 'Install engine oil drain plug with new O-ring. Torque: 14–21 ft-lbs (19–28.5 N·m).' }, { n: 9, text: 'Add initial volume of 4.0 qt (3.8 L) of correct grade oil. See Table 2-3 for temperature range.' }, { n: 10, text: 'Verify proper oil level by performing cold check and hot check. Start engine and check for leaks around drain plug and filter.' }, { n: 11, text: 'Check operation of rear lamps and test ride at low speed to wear in brakes properly.' }] },
{ id: 's25-maint-primary-oil-change', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Replace Primary Chaincase Lubricant', summary: 'Drain primary chaincase, clean drain plug magnet, refill with FORMULA+ or SYN3 lubricant to proper level.', difficulty: 'Medium', timeMinutes: 50, source: { manual: '2025 HD Softail Service Manual', page: '2-6' }, figures: [{ file: '/figures/softail-2025/p2-6.jpg', caption: 'Manual page 2-6' }], tools: [], parts: [{ number: '', description: 'Primary chaincase lubricant (40 oz dry fill / 36 oz wet fill)', qty: 1 }, { number: '', description: 'Clutch inspection cover seal', qty: 1 }], torque: [{ fastener: 'Primary chaincase drain plug', value: '14–21 ft-lbs (19–28.5 N·m)' }, { fastener: 'Clutch inspection cover screws', value: '25–35 in-lbs (2.8–3.9 N·m)' }], steps: [{ n: 1, text: 'Run motorcycle until engine reaches normal operating temperature, then turn off.' }, { n: 2, text: 'Secure motorcycle upright on level surface (not on jiffy stand).' }, { n: 3, text: 'Drain primary chaincase by removing drain plug.' }, { n: 4, text: 'Clean drain plug magnet; if excessive debris, inspect chaincase component condition.' }, { n: 5, text: 'Install drain plug with new O-ring. Torque: 14–21 ft-lbs (19–28.5 N·m).' }, { n: 6, text: 'Remove clutch inspection cover screws (3).' }, { n: 7, text: 'Remove clutch inspection cover (2).' }, { n: 8, text: 'Remove seal (1) and wipe oil from cover and O-ring groove.' }, { n: 9, text: 'Pour specified lubricant amount through clutch inspection opening. Fill to approximately bottom of pressure plate OD.' }, { n: 10, text: 'Install new seal (1).' }, { n: 11, text: 'Install clutch inspection cover (2).' }, { n: 12, text: 'Install and finger-tighten screws (3).' }, { n: 13, text: 'Tighten screws in sequence. Torque: 25–35 in-lbs (2.8–3.9 N·m).' }] },
{ id: 's25-maint-transmission-oil-change', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Replace Transmission Lubricant', summary: 'Drain transmission fluid via drain plug, inspect and replace O-ring, refill to proper level between Add and Full marks.', difficulty: 'Medium', timeMinutes: 40, source: { manual: '2025 HD Softail Service Manual', page: '2-12' }, figures: [{ file: '/figures/softail-2025/p2-12.jpg', caption: 'Manual page 2-12' }], tools: [], parts: [{ number: '', description: 'Transmission lubricant (28 fl oz / 0.83 L)', qty: 1 }], torque: [{ fastener: 'Transmission drain plug', value: '14–21 ft-lbs (19–28.5 N·m)' }, { fastener: 'Transmission filler plug/dipstick', value: '25–75 in-lbs (2.8–8.5 N·m)' }], steps: [{ n: 1, text: 'Remove transmission filler plug/dipstick.' }, { n: 2, text: 'Remove transmission drain plug, allow fluid to drain completely.' }, { n: 3, text: 'Clean and inspect drain plug and O-ring.' }, { n: 4, text: 'Install drain plug with new O-ring. Do not over-tighten. Torque: 14–21 ft-lbs (19–28.5 N·m).' }, { n: 5, text: 'Fill transmission with recommended lubricant, volume: 28 fl oz (0.83 L).' }, { n: 6, text: 'Check lubricant level and add enough to bring level between Add (A) and Full (F) marks.' }, { n: 7, text: 'Install filler plug/dipstick and tighten. Torque: 25–75 in-lbs (2.8–8.5 N·m). Do not over-tighten.' }] },
{ id: 's25-maint-inspect-tires', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect Tires and Wheels', summary: 'Check tire pressure and tread wear, inspect wheel bearings and spokes, measure wheel runout if necessary.', difficulty: 'Easy', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '2-14' }, figures: [{ file: '/figures/softail-2025/p2-14.jpg', caption: 'Manual page 2-14' }], tools: [], parts: [], torque: [{ fastener: 'Spoke nut', value: '35 in-lbs (4 N·m)' }], steps: [{ n: 1, text: 'Check tire pressure when tires are cold. Compare with specifications in Table 2-7.' }, { n: 2, text: 'Inspect each tire for tread wear. Replace tires when wear bars become visible or only 1/32 in (1 mm) tread remains.' }, { n: 3, text: 'Inspect each tire for punctures, cuts, and breaks.' }, { n: 4, text: 'Measure wheel bearing play by hand while wheels are installed. Rotate inner bearing race and check for abnormal noise.' }, { n: 5, text: 'Ensure bearings rotate smoothly and check for wear or corrosion. Excessive play or roughness indicates worn bearings.' }, { n: 6, text: 'Starting at valve stem, inspect for loose or damaged spokes. Lightly tap each spoke with screwdriver.' }, { n: 7, text: 'Mark loose or damaged spokes. Continue around wheel.' }, { n: 8, text: 'Correct spoke tension if needed. While holding spoke with wrench, torque spoke nut: 35 in-lbs (4 N·m).' }, { n: 9, text: 'Verify lateral and radial runout if loose spokes found. Refer to Table 2-8.' }] },
{ id: 's25-maint-lubricate-cables', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Lubricate Cables and Controls', summary: 'Lubricate front brake lever, clutch cable and hand lever, jiffy stand, steering head bearings, and fork lock with appropriate greases and lubricants.', difficulty: 'Easy', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '2-18' }, figures: [{ file: '/figures/softail-2025/p2-18.jpg', caption: 'Manual page 2-18' }], tools: [], parts: [{ number: '42830-05', description: 'CCI #20 Brake Grease', qty: 1 }, { number: '94968-09', description: 'HARLEY LUBE', qty: 1 }, { number: '98960-97', description: 'Anti-Seize Lubricant', qty: 1 }, { number: '99857-97A', description: 'Special Purpose Grease', qty: 1 }], torque: [], steps: [{ n: 1, text: 'Lubricate front brake hand lever pivot pin hole and end of piston contacting lever with CCI #20 Brake Grease.' }, { n: 2, text: 'Lubricate clutch cable with HARLEY LUBE (94968-09).' }, { n: 3, text: 'Lubricate clutch hand lever with HARLEY LUBE (94968-09).' }, { n: 4, text: 'Lubricate jiffy stand clevis pin and spring hook groove with Anti-Seize Lubricant (98960-97).' }, { n: 5, text: 'Lubricate steering head bearings with Special Purpose Grease (99857-97A). See CHASSIS > STEERING HEAD section.' }, { n: 6, text: 'Lubricate fork lock internal components with HARLEY LUBE (94968-09).' }] },
{ id: 's25-maint-inspect-brake-pads', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect Brake Pads and Discs', summary: 'Measure brake pad thickness and disc thickness/runout. Replace pads if friction material is 0.016 in (0.4 mm) or less; replace disc if warped or worn.', difficulty: 'Medium', timeMinutes: 40, source: { manual: '2025 HD Softail Service Manual', page: '2-19' }, figures: [{ file: '/figures/softail-2025/p2-19.jpg', caption: 'Manual page 2-19' }], tools: [], parts: [], torque: [], steps: [{ n: 1, text: 'Inspect for grit and debris buildup at caliper piston areas. Rinse with warm soapy water if necessary.' }, { n: 2, text: 'Dry using low-pressure compressed air.' }, { n: 3, text: 'Measure brake pad thickness. Replace pads if friction material thickness is equal to or less than 0.016 in (0.4 mm).' }, { n: 4, text: 'Measure brake disc thickness with micrometer. Minimum acceptable thickness is stamped on side of disc.' }, { n: 5, text: 'Measure disc runout near outside diameter using dial indicator. Replace disc if runout meets or exceeds 0.008 in (0.2 mm).' }, { n: 6, text: 'Replace disc if warped, badly scored, or worn beyond service limit.' }] },
{ id: 's25-maint-replace-front-brake-pads', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Replace Front Brake Pads', summary: 'Remove front caliper, extract worn pads, retract pistons, install new pads and spring, verify contact and brake operation.', difficulty: 'Medium', timeMinutes: 60, source: { manual: '2025 HD Softail Service Manual', page: '2-20' }, figures: [{ file: '/figures/softail-2025/p2-20.jpg', caption: 'Manual page 2-20' }], tools: [], parts: [{ number: '', description: 'Front brake pads (set)', qty: 1 }, { number: '', description: 'Brake pad spring', qty: 1 }], torque: [{ fastener: 'Front brake pad hanger pin', value: '11–14 ft-lbs (14.7–19.6 N·m)' }], steps: [{ n: 1, text: 'Remove front caliper. See CHASSIS > FRONT BRAKE CALIPER section.' }, { n: 2, text: 'Remove brake pad hanger pins (3).' }, { n: 3, text: 'Remove brake pads.' }, { n: 4, text: 'Remove brake pad spring (4).' }, { n: 5, text: 'Loosen front master cylinder reservoir cap.' }, { n: 6, text: 'Using old brake pad and C-clamp, retract pistons fully into caliper.' }, { n: 7, text: 'Install new pads into caliper.' }, { n: 8, text: 'Loosely install new brake pad hanger pins (3) and new brake pad spring (4) with stamped arrow facing up.' }, { n: 9, text: 'Install front caliper. See CHASSIS > FRONT BRAKE CALIPER section.' }, { n: 10, text: 'Tighten brake pad hanger pins. Torque: 11–14 ft-lbs (14.7–19.6 N·m).' }, { n: 11, text: 'Pump brakes to move pistons out until brake pads contact rotor. If wheel off ground, rotate to check for drag.' }, { n: 12, text: 'Check fluid level in front brake master cylinder reservoir.' }, { n: 13, text: 'After repair, test brakes at low speed. If spongy, bleed brakes. Avoid hard stops for first 100 mi (160 km).' }] },
{ id: 's25-maint-replace-rear-brake-pads', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Replace Rear Brake Pads', summary: 'Remove rear caliper, extract worn pads, retract pistons, install new pads with retaining spring and clip, verify contact and operation.', difficulty: 'Medium', timeMinutes: 60, source: { manual: '2025 HD Softail Service Manual', page: '2-21' }, figures: [{ file: '/figures/softail-2025/p2-21.jpg', caption: 'Manual page 2-21' }], tools: [], parts: [{ number: '', description: 'Rear brake pads (set)', qty: 1 }, { number: '', description: 'Brake pad retaining spring', qty: 1 }, { number: '', description: 'Retainer clip', qty: 1 }], torque: [], steps: [{ n: 1, text: 'Remove rear caliper. See CHASSIS > REAR BRAKE CALIPER section.' }, { n: 2, text: 'Remove brake pad hanger pins (2). Inspect for damage or wear; replace if needed.' }, { n: 3, text: 'Remove brake pads (4).' }, { n: 4, text: 'Loosen rear master cylinder reservoir cap.' }, { n: 5, text: 'Using old brake pad and C-clamp, retract pistons fully into caliper.' }, { n: 6, text: 'Inspect brake pad retainer spring (5). Replace if needed.' }, { n: 7, text: 'Remove retainer clip (3) from rear caliper mounting bracket.' }, { n: 8, text: 'Install brake pad retaining spring (5).' }, { n: 9, text: 'Install new brake pads (4).' }, { n: 10, text: 'Install brake pad hanger pin (2). Hand tighten. Pins are torqued after caliper is installed.' }, { n: 11, text: 'Install new retainer clip (3) onto rear caliper mounting bracket.' }, { n: 12, text: 'Install rear caliper. See CHASSIS > REAR BRAKE CALIPER section.' }, { n: 13, text: 'Pump brakes to move pistons out until pads contact rotor. If wheel off ground, rotate to check for drag.' }, { n: 14, text: 'Check fluid level in rear brake master cylinder reservoir.' }, { n: 15, text: 'Test brakes at low speed. If spongy, bleed brakes. Avoid hard stops for first 100 mi (160 km).' }] },
{ id: 's25-maint-brake-fluid-level', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Check and Top Off Brake Fluid', summary: 'Inspect front and rear brake fluid levels at minimum marks. Add DOT 4 fluid if necessary and check for leaks or worn pads.', difficulty: 'Easy', timeMinutes: 20, source: { manual: '2025 HD Softail Service Manual', page: '2-23' }, figures: [{ file: '/figures/softail-2025/p2-23.jpg', caption: 'Manual page 2-23' }], tools: ['DOT 4 Brake Fluid Moisture Tester HD-48497-A'], parts: [{ number: '41800xxx', description: 'Harley-Davidson Platinum Label DOT 4 Brake Fluid', qty: 1 }], torque: [{ fastener: 'Brake master cylinder front reservoir cover screws', value: '9–18 in-lbs (1–2 N·m)' }, { fastener: 'Brake master cylinder rear reservoir cover screws', value: '9–18 in-lbs (1–2 N·m)' }], steps: [{ n: 1, text: 'Front brake: Set motorcycle upright and turn handlebar to level reservoir.' }, { n: 2, text: 'Check low-level mark on front reservoir sight glass. If necessary, add Harley-Davidson Platinum Label DOT 4 fluid.' }, { n: 3, text: 'Rear brake: Stand motorcycle upright on level surface.' }, { n: 4, text: 'Check low-level mark on rear reservoir sight glass. If necessary, add DOT 4 fluid.' }, { n: 5, text: 'If fluid level was below minimum mark, check for brake system leaks and verify pads/rotors are not worn beyond limits.' }, { n: 6, text: 'If master cylinder reservoir cover was removed, tighten. Front torque: 9–18 in-lbs (1–2 N·m); Rear torque: 9–18 in-lbs (1–2 N·m).' }, { n: 7, text: 'Verify front brake hand lever and rear brake foot pedal have firm feel. If not firm, brake system must be bled.' }] },
{ id: 's25-maint-clutch-adjust', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Check and Adjust Clutch', summary: 'Verify clutch free-play at lever (1/16–1/8 in), adjust hub clearance via screw and jamnut, ensure lock button engagement, check lever operation.', difficulty: 'Medium', timeMinutes: 45, source: { manual: '2025 HD Softail Service Manual', page: '2-25' }, figures: [{ file: '/figures/softail-2025/p2-25.jpg', caption: 'Manual page 2-25' }], tools: [], parts: [], torque: [{ fastener: 'Clutch hub jamnut', value: '72–120 in-lbs (8.1–13.6 N·m)' }], steps: [{ n: 1, text: 'Stand motorcycle upright on level surface with front wheel straight ahead.' }, { n: 2, text: 'Access two-piece clutch cable by removing spring clip (1) and sliding cover (2) up.' }, { n: 3, text: 'Identify upper clutch cable (1) and red lock button (2).' }, { n: 4, text: 'Unlock upper clutch cable by pushing tabs on lock button slightly inboard then down to disengage.' }, { n: 5, text: 'Fully collapse cable (spring compressed) and push button in to release cable tension.' }, { n: 6, text: 'Remove clutch inspection cover from primary chaincase and access hub adjuster screw.' }, { n: 7, text: 'Loosen jamnut (1) on clutch adjuster screw. Turn adjuster screw (2) inward (clockwise) until lightly seated.' }, { n: 8, text: 'Squeeze clutch lever to maximum limit three times to set release mechanism.' }, { n: 9, text: 'Back out adjuster screw one-half to one full turn. While holding screw, tighten jamnut. Torque: 72–120 in-lbs (8.1–13.6 N·m).' }, { n: 10, text: 'Secure clutch inspection cover, tighten in sequence.' }, { n: 11, text: 'Ensure clutch lever is in full open position and ferrule (1) is correctly seated in housing.' }, { n: 12, text: 'Disengage lock button (2) to set free-play at clutch lever.' }, { n: 13, text: 'Push in lock button (2) and verify proper engagement. Spring force should ensure correct system free-play.' }, { n: 14, text: 'Check free-play at clutch lever; should be 1/16–1/8 in (1.6–3.2 mm).' }, { n: 15, text: 'Slide cover down and reinstall spring clip (1).' }] },
{ id: 's25-maint-steering-bearings', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Adjust and Lubricate Steering Head Bearings', summary: 'Measure bearing preload via pull force test, adjust fork stem bolt to specification, tighten pinch bolts, lubricate with grease, verify smooth operation.', difficulty: 'Hard', timeMinutes: 90, source: { manual: '2025 HD Softail Service Manual', page: '2-29' }, figures: [{ file: '/figures/softail-2025/p2-29.jpg', caption: 'Manual page 2-29' }], tools: [], parts: [{ number: '99857-97A', description: 'Special Purpose Grease', qty: 1 }], torque: [{ fastener: 'Fork stem bolt, first torque', value: '13–14 ft-lbs (18.1–19 N·m)' }, { fastener: 'Fork stem bolt, final torque (most models)', value: '62–68 in-lbs (7–7.7 N·m)' }, { fastener: 'Fork stem bolt, final torque (FXLRS, FXLRST)', value: '9–10 ft-lbs (12.4–13.8 N·m)' }, { fastener: 'Fork stem pinch bolt', value: '16–20 ft-lbs (21.7–27.1 N·m)' }, { fastener: 'Upper fork bracket pinch bolts', value: '16–20 ft-lbs (21.7–27.1 N·m)' }], steps: [{ n: 1, text: 'Support motorcycle upright with front wheel suspended and level.' }, { n: 2, text: 'Remove all accessory weight from front (e.g., windshield if equipped).' }, { n: 3, text: 'Move forks from stop to stop to check for smooth operation. Rough operation indicates damaged bearings.' }, { n: 4, text: 'Grasping both forks near front axle, pull forks to front then push to rear to test for clunk.' }, { n: 5, text: 'Move handlebars left to right three times, ending at full left stop.' }, { n: 6, text: 'Using 0–25 lb pull force scale with peak hold, pull from inside diameter of front axle until front end is straight.' }, { n: 7, text: 'Keep scale parallel to front tire and perpendicular to fork leg. Pull slowly without tugging.' }, { n: 8, text: 'Repeat until peak force value becomes consistent. Check against Table 2-11 specification for your model.' }, { n: 9, text: 'If force not within spec, loosen fork stem pinch bolt (2) and upper fork bracket pinch bolts (3).' }, { n: 10, text: 'If pull force exceeds maximum, loosen fork stem bolt. If below minimum, tighten fork stem bolt. Initial torque: 13–14 ft-lbs (18.1–19 N·m).' }, { n: 11, text: 'Loosen fork stem bolt 45 degrees.' }, { n: 12, text: 'Tighten fork stem bolt final torque. Most models: 62–68 in-lbs (7–7.7 N·m). FXLRS/FXLRST: 9–10 ft-lbs (12.4–13.8 N·m).' }, { n: 13, text: 'Tighten fork stem pinch bolt (2). Torque: 16–20 ft-lbs (21.7–27.1 N·m).' }, { n: 14, text: 'Tighten upper fork bracket pinch bolts (3). Torque: 16–20 ft-lbs (21.7–27.1 N·m).' }, { n: 15, text: 'Reinstall handlebars and headlight nacelle if removed.' }, { n: 16, text: 'Repeat measure and adjust as needed until specification met.' }, { n: 17, text: 'Disassemble steering head and lubricate tapered roller bearings with Special Purpose Grease (99857-97A).' }, { n: 18, text: 'Lower motorcycle and replace all items removed.' }] },
{ id: 's25-maint-inspect-drive-belt', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect and Adjust Drive Belt and Sprockets', summary: 'Inspect rear sprocket for tooth damage and chrome wear, check belt for cracks/damage, measure deflection, and adjust tension via axle adjusters.', difficulty: 'Medium', timeMinutes: 60, source: { manual: '2025 HD Softail Service Manual', page: '2-33' }, figures: [{ file: '/figures/softail-2025/p2-33.jpg', caption: 'Manual page 2-33' }], tools: ['Belt Tension Gauge HD-35381-A', 'Axle Nut Torque Adapter HD-47925-A'], parts: [], torque: [{ fastener: 'Axle nut, rear', value: '95–105 ft-lbs (128.8–142.4 N·m)' }], steps: [{ n: 1, text: 'Inspect each tooth (1) of rear sprocket for major damage, chrome chips with sharp edges, gouges, and excessive chrome loss.' }, { n: 2, text: 'Drag sharp object across groove bottom with medium pressure to check chrome plating. If it slides without digging or marking, chrome is good. If it digs in, chrome is worn.' }, { n: 3, text: 'Replace rear sprocket if major tooth damage or chrome loss exists.' }, { n: 4, text: 'Inspect drive belt for cuts, unusual wear patterns, outside bevel wear, stone damage, exposed tensile cords, and base cracking.' }, { n: 5, text: 'Replace belt and transmission sprocket if damage found at edge or internal cords exposed.' }, { n: 6, text: 'Keep belt clean with dampened rag using light cleaning agent. Do not bend into loop smaller than sprocket diameter.' }, { n: 7, text: 'Disarm security system and remove main fuse.' }, { n: 8, text: 'Shift transmission to neutral.' }, { n: 9, text: 'For new belt, rotate rear wheel few revolutions before setting tension.' }, { n: 10, text: 'Measure belt deflection using Belt Tension Gauge (HD-35381-A). Slide O-ring to zero mark.' }, { n: 11, text: 'Fit belt cradle against bottom of drive belt at deflection window or halfway between pulleys.' }, { n: 12, text: 'Press upward on knob until O-ring slides to 10 lb (4.54 kg) mark and hold steady.' }, { n: 13, text: 'Measure deflection through window or as shown. Each graduation approximately 1/16 in (1.6 mm).' }, { n: 14, text: 'Compare with Table 2-13. Service belt: 1/2–9/16 in (12.7–14.2 mm). New belt: 3/16–1/2 in (4.7–12.7 mm).' }, { n: 15, text: 'If out of spec, loosen rear axle nut and adjust via screw-style axle adjusters, turning equal amount.' }, { n: 16, text: 'Keep wheel aligned during adjustment.' }, { n: 17, text: 'Tighten axle nut. Torque: 95–105 ft-lbs (128.8–142.4 N·m).' }, { n: 18, text: 'Install E-clip. Verify rear wheel alignment.' }, { n: 19, text: 'Verify drive belt deflection again.' }, { n: 20, text: 'Check wheel bearing end play after tightening axle nut.' }, { n: 21, text: 'Install main fuse.' }] },
{ id: 's25-maint-suspension-preload', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Adjust Rear Shock Preload', summary: 'Calculate preload setting based on rider weight and passenger/cargo weight, adjust shock via cam or hydraulic screw to proper setting.', difficulty: 'Easy', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '2-37' }, figures: [{ file: '/figures/softail-2025/p2-37.jpg', caption: 'Manual page 2-37' }], tools: ['Spanner Wrench Kit 14900102'], parts: [], torque: [], steps: [{ n: 1, text: 'Add weight of rider and riding gear to get rider weight for desired table.' }, { n: 2, text: 'Add weight of passenger, their gear, cargo, and accessories separately.' }, { n: 3, text: 'Use intersection of RIDER WEIGHT row and ADDITIONAL WEIGHT column in appropriate preload table (Tables 2-14 through 2-17) to find preload setting.' }, { n: 4, text: 'Remove seat.' }, { n: 5, text: 'For cam style: Insert tang of Spanner Wrench Kit (14900102) into slots in rear shock. Turn cam until indicator points to appropriate preload setting.' }, { n: 6, text: 'For hydraulic under-seat: Use socket end of Spanner Wrench Kit. Rotate adjustment screw clockwise to increase or counterclockwise to decrease preload until indicator shows appropriate setting.' }, { n: 7, text: 'Adjust motorcycle on jiffy stand. Do not exceed Gross Vehicle Weight Rating (GVWR) or Gross Axle Weight Rating (GAWR).' }] },
{ id: 's25-maint-inspect-exhaust', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect Exhaust System', summary: 'Check for leakage via carbon tracks and fasteners, listen for audible leaks, correct any detected leaks at mating surfaces.', difficulty: 'Medium', timeMinutes: 40, source: { manual: '2025 HD Softail Service Manual', page: '2-39' }, figures: [{ file: '/figures/softail-2025/p2-39.jpg', caption: 'Manual page 2-39' }], tools: [], parts: [], torque: [], steps: [{ n: 1, text: 'Check exhaust system for obvious signs of leakage such as carbon tracks and marks at pipe joints.' }, { n: 2, text: 'Check for loose or missing fasteners.' }, { n: 3, text: 'Check for cracked pipe clamps or brackets.' }, { n: 4, text: 'Check for loose or cracked exhaust shields.' }, { n: 5, text: 'Start engine.' }, { n: 6, text: 'Cover end of muffler with clean, dry shop towel.' }, { n: 7, text: 'Listen for signs of exhaust leakage.' }, { n: 8, text: 'Correct any detected leaks. See FUEL AND EXHAUST > EXHAUST SYSTEM section to disassemble.' }, { n: 9, text: 'Clean all mating surfaces and repair or replace damaged components.' }, { n: 10, text: 'If leak continues, apply Permatex Ultra Copper or Loctite 5920 flange sealant to mating surfaces.' }] },
{ id: 's25-maint-inspect-air-filter-round', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect and Service Air Filter (Round)', summary: 'Remove round air cleaner cover and element, inspect and replace seal if damaged, reinstall with Loctite on cover screw.', difficulty: 'Easy', timeMinutes: 20, source: { manual: '2025 HD Softail Service Manual', page: '2-40' }, figures: [{ file: '/figures/softail-2025/p2-40.jpg', caption: 'Manual page 2-40' }], tools: [], parts: [{ number: '99642-97', description: 'Loctite 243 Medium Strength Threadlocker and Sealant (Blue)', qty: 1 }, { number: '', description: 'Air filter element (round)', qty: 1 }, { number: '', description: 'Air filter seal', qty: 1 }], torque: [{ fastener: 'Air filter round cover screw', value: '92–97 in-lbs (10.4–11 N·m)' }], steps: [{ n: 1, text: 'Remove air cleaner cover by removing screw (1).' }, { n: 2, text: 'Remove cover (2).' }, { n: 3, text: 'Remove filter element (3).' }, { n: 4, text: 'Remove seal (4). Inspect for damage or wear.' }, { n: 5, text: 'Clean seal location groove of all residual oil and debris.' }, { n: 6, text: 'Replace seal if damaged or worn.' }, { n: 7, text: 'Install filter element, align with pin (5) in housing and place in position.' }, { n: 8, text: 'Apply Loctite 243 Medium Strength Threadlocker (99642-97) to threads of cover screw.' }, { n: 9, text: 'Install cover (2) and cover screw (1).' }, { n: 10, text: 'Tighten cover screw. Torque: 92–97 in-lbs (10.4–11 N·m).' }] },
{ id: 's25-maint-inspect-air-filter-cone', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect and Service Air Filter (Cone)', summary: 'Remove cone air cleaner cover and element, clean and inspect seal, reinstall element and cover with proper torque.', difficulty: 'Easy', timeMinutes: 20, source: { manual: '2025 HD Softail Service Manual', page: '2-40' }, figures: [{ file: '/figures/softail-2025/p2-40.jpg', caption: 'Manual page 2-40' }], tools: [], parts: [{ number: '', description: 'Air filter element (cone)', qty: 1 }, { number: '', description: 'Air filter seal', qty: 1 }], torque: [{ fastener: 'Air filter cone inner screw', value: '18–24 in-lbs (2–2.7 N·m)' }, { fastener: 'Air filter cone outer screws', value: '18–24 in-lbs (2–2.7 N·m)' }], steps: [{ n: 1, text: 'Remove air cleaner cover by removing two outer screws (1).' }, { n: 2, text: 'Remove inner screw (4).' }, { n: 3, text: 'Remove air cleaner cover (3) and air filter element (2).' }, { n: 4, text: 'Clean and inspect filter element. Replace if necessary.' }, { n: 5, text: 'Clean seal location groove of all residual oil and debris.' }, { n: 6, text: 'Replace seal if damaged or worn.' }, { n: 7, text: 'Install air filter element into cover.' }, { n: 8, text: 'Install air cleaner cover. Install inner screw (4) and tighten. Torque: 18–24 in-lbs (2–2.7 N·m).' }, { n: 9, text: 'Install cover screws (1) and tighten. Torque: 18–24 in-lbs (2–2.7 N·m).' }] },
{ id: 's25-maint-inspect-air-filter-open', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect and Service Air Filter (Open Front)', summary: 'Remove open front air cleaner cover and element by loosening screw, rotate and tilt element to disengage from snorkel, inspect seal and clean.', difficulty: 'Easy', timeMinutes: 20, source: { manual: '2025 HD Softail Service Manual', page: '2-41' }, figures: [{ file: '/figures/softail-2025/p2-41.jpg', caption: 'Manual page 2-41' }], tools: [], parts: [{ number: '', description: 'Air filter element', qty: 1 }, { number: '', description: 'Air filter seal', qty: 1 }], torque: [{ fastener: 'Air filter open front cover screw', value: '92–97 in-lbs (10.4–11 N·m)' }], steps: [{ n: 1, text: 'Remove air cleaner cover by removing screw (1).' }, { n: 2, text: 'Remove cover (2).' }, { n: 3, text: 'Lubricate element seal with 50% isopropyl alcohol and 50% distilled water.' }, { n: 4, text: 'Rotate filter element to loosen.' }, { n: 5, text: 'Move filter element to rear at upward angle to disengage from snorkel.' }, { n: 6, text: 'Remove filter element and remove seal. Inspect seal for damage or wear.' }, { n: 7, text: 'Clean and inspect filter element. Replace if necessary.' }, { n: 8, text: 'Clean seal location groove of all residual oil and debris.' }, { n: 9, text: 'Replace seal if damaged or worn.' }, { n: 10, text: 'Lubricate element seal with 50% isopropyl alcohol and 50% distilled water.' }, { n: 11, text: 'Install filter element onto snorkel and press forward into position.' }, { n: 12, text: 'Install cover and lubricate seal with alcohol/water mixture to prevent rolling.' }, { n: 13, text: 'Install screw (1) and tighten. Torque: 92–97 in-lbs (10.4–11 N·m).' }] },
{ id: 's25-maint-clean-air-filter', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Clean Air Filter Element', summary: 'Remove breather tube, inspect for damage, wash filter in lukewarm water with mild detergent, rinse and air dry or use low-pressure air.', difficulty: 'Easy', timeMinutes: 20, source: { manual: '2025 HD Softail Service Manual', page: '2-41' }, figures: [{ file: '/figures/softail-2025/p2-41.jpg', caption: 'Manual page 2-41' }], tools: [], parts: [], torque: [], steps: [{ n: 1, text: 'Remove breather tube from breather bolts.' }, { n: 2, text: 'Inspect breather tube and fittings for damage.' }, { n: 3, text: 'Do not strike filter element on hard surface to dislodge dirt.' }, { n: 4, text: 'Do not use air cleaner filter oil on Harley-Davidson paper/wire mesh or synthetic air filter element.' }, { n: 5, text: 'Do not use gasoline or solvents to clean filter. Flammable agents can cause intake fire.' }, { n: 6, text: 'Wash filter element and breather tubes in lukewarm water with mild detergent.' }, { n: 7, text: 'Synthetic element: Rinse with clean water until water runs clear.' }, { n: 8, text: 'Paper/wire mesh element: Hold element to strong light. Element is clean when light uniformly visible through media.' }, { n: 9, text: 'Allow element to air dry or use low-pressure compressed air from inside.' }, { n: 10, text: 'Replace element if damaged or media cannot be adequately cleaned.' }] },
{ id: 's25-maint-inspect-battery', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect and Service Battery', summary: 'Remove battery, clean terminals and case, perform voltage test, check for damage/leaks, test charge state, and reinstall with proper torque.', difficulty: 'Medium', timeMinutes: 50, source: { manual: '2025 HD Softail Service Manual', page: '2-43' }, figures: [{ file: '/figures/softail-2025/p2-43.jpg', caption: 'Manual page 2-43' }], tools: [], parts: [], torque: [{ fastener: 'Battery positive terminal screw', value: '72–96 in-lbs (8.1–10.8 N·m)' }, { fastener: 'Battery negative terminal screw', value: '72–96 in-lbs (8.1–10.8 N·m)' }], steps: [{ n: 1, text: 'Remove seat. See CHASSIS > SEAT section.' }, { n: 2, text: 'If equipped with siren: Remove left side cover and main fuse.' }, { n: 3, text: 'Remove right side cover and close-out cover.' }, { n: 4, text: 'Relocate BCM caddy for service access.' }, { n: 5, text: 'Remove engine oil dipstick and cover fill spout with clean rag.' }, { n: 6, text: 'Disconnect negative battery cable (1).' }, { n: 7, text: 'Remove battery strap by unlocking retaining clip (7) and disconnecting tabs from tray.' }, { n: 8, text: 'Disconnect positive battery cable (2).' }, { n: 9, text: 'Push up and back on top of battery with palm, place other hand under, and remove with both hands.' }, { n: 10, text: 'Clean battery top with baking soda solution (5 tsp per liter of water). Apply, let bubble, rinse.' }, { n: 11, text: 'Clean cable connectors and terminals with wire brush or sandpaper. Remove oxidation.' }, { n: 12, text: 'Inspect battery terminal screws and cables for breakage, loose connections, and corrosion.' }, { n: 13, text: 'Check terminals for melting or damage.' }, { n: 14, text: 'Inspect case for discoloration, raised top, warping, distortion, cracks, or leaks. Replace if necessary.' }, { n: 15, text: 'Perform voltage test. If open circuit voltage below 12.6 V, charge battery. If 12.7 V or above, perform diagnostic load test.' }, { n: 16, text: 'Check Table 2-18 for charge state based on voltage.' }, { n: 17, text: 'Install battery into tray.' }, { n: 18, text: 'Connect positive cable to positive terminal. Tighten. Torque: 72–96 in-lbs (8.1–10.8 N·m).' }, { n: 19, text: 'Install battery strap with front left tab, back tab, and lock retaining clip.' }, { n: 20, text: 'Connect negative cable to negative terminal. Tighten. Torque: 72–96 in-lbs (8.1–10.8 N·m).' }, { n: 21, text: 'Remove rag and install dipstick.' }, { n: 22, text: 'Relocate BCM caddy back.' }, { n: 23, text: 'Install right side cover and close-out cover.' }, { n: 24, text: 'Install main fuse if removed.' }, { n: 25, text: 'Install left side cover if removed.' }, { n: 26, text: 'Install seat.' }] },
{ id: 's25-maint-spark-plugs', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Clean, Inspect, and Replace Spark Plugs', summary: 'Remove and inspect spark plugs for deposits, verify gap specification with feeler gauge, install new or cleaned plugs at proper torque.', difficulty: 'Medium', timeMinutes: 45, source: { manual: '2025 HD Softail Service Manual', page: '2-46' }, figures: [{ file: '/figures/softail-2025/p2-46.jpg', caption: 'Manual page 2-46' }], tools: [], parts: [{ number: '', description: 'Spark plugs', qty: 2 }], torque: [{ fastener: 'Spark plug', value: '84–108 in-lbs (9.5–12.2 N·m)' }], steps: [{ n: 1, text: 'Remove seat. See CHASSIS > SEAT section.' }, { n: 2, text: 'Purge fuel system. See FUEL AND EXHAUST > PURGE FUEL LINE section.' }, { n: 3, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT section.' }, { n: 4, text: 'Remove fuel tank. See FUEL AND EXHAUST > FUEL TANK section.' }, { n: 5, text: 'Remove spark plug cables from spark plugs.' }, { n: 6, text: 'Thoroughly clean around spark plug base.' }, { n: 7, text: 'Remove spark plugs.' }, { n: 8, text: 'Inspect spark plugs. Compare deposits to Table 2-19 to diagnose condition.' }, { n: 9, text: 'Discard plugs with eroded electrodes, heavy deposits, or cracked insulators.' }, { n: 10, text: 'Inspect spark plug cables for cracks or loose terminals.' }, { n: 11, text: 'Check cable boots/caps for cracks or tears. Replace as necessary.' }, { n: 12, text: 'Verify proper gap using wire-type feeler gauge before installing. Table 2-20 specifies 0.8–0.9 mm (0.031–0.035 in).' }, { n: 13, text: 'Pass gauge between center and outer electrodes. Adjust gap to specification.' }, { n: 14, text: 'Verify spark plug threads are clean and dry.' }, { n: 15, text: 'Install spark plugs and tighten. Torque: 84–108 in-lbs (9.5–12.2 N·m).' }, { n: 16, text: 'Install spark plug cables. See ELECTRICAL > SPARK PLUG CABLES section.' }, { n: 17, text: 'Install fuel tank. See FUEL AND EXHAUST > FUEL TANK section.' }, { n: 18, text: 'Install seat.' }, { n: 19, text: 'Install main fuse.' }, { n: 20, text: 'Add at least 3.8 L (1 gal) of fuel before operating fuel pump.' }, { n: 21, text: 'Set OFF/RUN switch to RUN and check for leaks.' }] },
{ id: 's25-maint-storage-prepare', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Prepare Motorcycle for Storage', summary: 'Change oil, check transmission fluid, prepare fuel tank with stabilizer, lubricate cylinders, inspect belt/filters, charge battery, cover motorcycle.', difficulty: 'Hard', timeMinutes: 120, source: { manual: '2025 HD Softail Service Manual', page: '2-48' }, figures: [{ file: '/figures/softail-2025/p2-48.jpg', caption: 'Manual page 2-48' }], tools: [], parts: [{ number: '', description: 'Engine oil and filter', qty: 1 }, { number: '', description: 'Fuel stabilizer', qty: 1 }], torque: [], steps: [{ n: 1, text: 'Change engine oil and filter. See MAINTENANCE > REPLACE ENGINE OIL AND FILTER section.' }, { n: 2, text: 'Check transmission lubricant level. See MAINTENANCE > REPLACE TRANSMISSION LUBRICANT section.' }, { n: 3, text: 'Fill fuel tank completely.' }, { n: 4, text: 'Add fuel stabilizer to tank.' }, { n: 5, text: 'Remove spark plugs. See MAINTENANCE > CLEAN, INSPECT, REPLACE SPARK PLUGS section.' }, { n: 6, text: 'Inject few squirts of engine oil into each cylinder.' }, { n: 7, text: 'Crank engine for 5–6 revolutions.' }, { n: 8, text: 'Reinstall spark plugs.' }, { n: 9, text: 'Inspect drive belt deflection. See MAINTENANCE > INSPECT AND ADJUST DRIVE BELT AND SPROCKETS section.' }, { n: 10, text: 'Inspect drive belt and sprockets. See MAINTENANCE > INSPECT AND ADJUST DRIVE BELT AND SPROCKETS section.' }, { n: 11, text: 'Inspect air cleaner filter. See MAINTENANCE > INSPECT AIR FILTER section.' }, { n: 12, text: 'Lubricate controls. See MAINTENANCE > LUBRICATE CABLES AND CHASSIS section.' }, { n: 13, text: 'Check tire inflation and inspect for wear/damage. See MAINTENANCE > INSPECT TIRES AND WHEELS section.' }, { n: 14, text: 'For extended storage, securely support motorcycle under frame so all weight off tires.' }, { n: 15, text: 'Inspect operation of all electrical equipment and switches.' }, { n: 16, text: 'Wash painted and chrome surfaces. Apply light oil film to unpainted surfaces.' }, { n: 17, text: 'Ensure brake fluid/lubricants do not contact brake pads or discs.' }, { n: 18, text: 'Remove battery from vehicle and charge until correct voltage obtained.' }, { n: 19, text: 'Charge battery every other month if stored below 60 °F (16 °C).' }, { n: 20, text: 'Charge battery monthly if stored above 60 °F (16 °C).' }, { n: 21, text: 'Use breathable storage cover (Harley-Davidson cover or light canvas).' }, { n: 22, text: 'Do not use plastic materials; they promote condensation and corrosion.' }] },
{ id: 's25-maint-storage-retrieve', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Remove Motorcycle from Storage', summary: 'Charge battery, reinstall and test, check clutch engagement, run engine to temperature, verify all fluids and systems, perform pre-ride checklist.', difficulty: 'Medium', timeMinutes: 60, source: { manual: '2025 HD Softail Service Manual', page: '2-49' }, figures: [{ file: '/figures/softail-2025/p2-49.jpg', caption: 'Manual page 2-49' }], tools: [], parts: [], torque: [], steps: [{ n: 1, text: 'Charge battery. See MAINTENANCE > INSPECT BATTERY section.' }, { n: 2, text: 'Install battery. See MAINTENANCE > INSPECT BATTERY section.' }, { n: 3, text: 'Prior to starting after extended storage, place transmission in gear and push vehicle back/forth to assure clutch disengagement.' }, { n: 4, text: 'Inspect spark plugs. See MAINTENANCE > CLEAN, INSPECT, REPLACE SPARK PLUGS section.' }, { n: 5, text: 'Fill fuel tank if empty.' }, { n: 6, text: 'Start engine and run until reaching normal operating temperature.' }, { n: 7, text: 'Check engine oil level. See MAINTENANCE > REPLACE ENGINE OIL AND FILTER section.' }, { n: 8, text: 'Check transmission lubricant level. See MAINTENANCE > REPLACE TRANSMISSION LUBRICANT section.' }, { n: 9, text: 'Perform all checks in the PRE-RIDING CHECKLIST in the owner\'s manual.' }] },
// --- END SOFTAIL 2025 CHAPTER 2 JOBS ---

// --- BEGIN SOFTAIL 2025 CHAPTER 3 JOBS ---
{"id": "s25-chassis-4-remove","bikeIds": ["softail-2025"],"system": "brakes","title": "Front Wheel: Remove","summary": "Remove the front wheel from the fork assembly.","difficulty": "Easy","timeMinutes": 25,"source": {"manual": "2025 HD Softail Service Manual","page": "3-4"},"figures": [{"file": "/figures/softail-2025/p3-4.jpg", "caption": "Manual page 3-4"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Raise front wheel."},{"n": 2,"text": "Check wheel bearing end play."},{"n": 3,"text": "Remove front brake caliper(s)."},{"n": 4,"text": "Loosen pinch bolt(s)."},{"n": 5,"text": "Remove front axle, wheel speed sensor and right bearing spacer."},{"n": 6,"text": "Remove front wheel."}]},
{"id": "s25-chassis-4-install","bikeIds": ["softail-2025"],"system": "brakes","title": "Front Wheel: Install","summary": "Install the front wheel with anti-seize lubricant and secure with axle and pinch bolts.","difficulty": "Easy","timeMinutes": 25,"source": {"manual": "2025 HD Softail Service Manual","page": "3-4"},"figures": [{"file": "/figures/softail-2025/p3-4.jpg", "caption": "Manual page 3-4"}],"tools": [],"parts": [],"torque": [{"fastener": "Front wheel axle","value": "70\u201375 ft-lbs (94.9\u2013101.7 N\u00b7m)"},{"fastener": "Front fork pinch bolt (All except FXLRS, FXLRST)","value": "11\u201315 ft-lbs (14.9\u201320.3 N\u00b7m)"},{"fastener": "Front fork pinch bolt (FXLRS, FXLRST)","value": "21\u201325 ft-lbs (28.4\u201333.9 N\u00b7m)"}],"steps": [{"n": 1,"text": "Apply anti-seize lubricant to front axle and wheel bearing bores."},{"n": 2,"text": "Position front wheel between front forks."},{"n": 3,"text": "Install front axle through right fork and bearing spacer."},{"n": 4,"text": "Position wheel speed sensor with index pin contacting fork."},{"n": 5,"text": "Thread front axle into left fork. Tighten."},{"n": 6,"text": "Tighten pinch bolt(s) to specification."},{"n": 7,"text": "Install caliper(s)."},{"n": 8,"text": "Lower front wheel."}]},
{"id": "s25-chassis-4-disassemble","bikeIds": ["softail-2025"],"system": "brakes","title": "Front Wheel: Disassemble","summary": "Disassemble front wheel hub, brake disc, tire, bearings and spacers.","difficulty": "Medium","timeMinutes": 45,"source": {"manual": "2025 HD Softail Service Manual","page": "3-4"},"figures": [{"file": "/figures/softail-2025/p3-4.jpg", "caption": "Manual page 3-4"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Disassemble hub cap assembly if equipped."},{"n": 2,"text": "Remove retaining ring from hub cap assembly."},{"n": 3,"text": "Remove hub spacer from hub cap."},{"n": 4,"text": "Remove front brake disc(s)."},{"n": 5,"text": "Remove front tire."},{"n": 6,"text": "Remove valve stem."},{"n": 7,"text": "Remove sealed wheel bearings."},{"n": 8,"text": "Remove wheel bearing inner spacer."}]},
{"id": "s25-chassis-4-assemble","bikeIds": ["softail-2025"],"system": "brakes","title": "Front Wheel: Assemble","summary": "Assemble front wheel with new bearings, tire, brake disc and hub cap.","difficulty": "Medium","timeMinutes": 45,"source": {"manual": "2025 HD Softail Service Manual","page": "3-4"},"figures": [{"file": "/figures/softail-2025/p3-4.jpg", "caption": "Manual page 3-4"}],"tools": [],"parts": [],"torque": [{"fastener": "Front brake disc screw","value": "16\u201324 ft-lbs (22\u201333 N\u00b7m)"}],"steps": [{"n": 1,"text": "Install new valve stem."},{"n": 2,"text": "Install tire."},{"n": 3,"text": "Install wheel bearing inner spacer."},{"n": 4,"text": "Install new wheel bearings."},{"n": 5,"text": "Verify ABS wheel bearing is on correct side."},{"n": 6,"text": "Assemble hub cap assembly if equipped."},{"n": 7,"text": "Install brake disc(s)."},{"n": 8,"text": "Install new brake disc screw(s). Tighten."}]},
{"id": "s25-chassis-5-remove","bikeIds": ["softail-2025"],"system": "brakes","title": "Rear Wheel: Remove","summary": "Remove the rear wheel by loosening axle, supporting caliper and removing belt.","difficulty": "Easy","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-5"},"figures": [{"file": "/figures/softail-2025/p3-5.jpg", "caption": "Manual page 3-5"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Remove main fuse."},{"n": 2,"text": "Remove saddlebags if equipped."},{"n": 3,"text": "Measure wheel alignment."},{"n": 4,"text": "Remove belt guards if necessary."},{"n": 5,"text": "Remove muffler if necessary."},{"n": 6,"text": "Raise rear wheel."},{"n": 7,"text": "Check wheel bearing end play."},{"n": 8,"text": "Remove rear axle and spacers."},{"n": 9,"text": "Support brake caliper bracket."},{"n": 10,"text": "Remove drive belt from rear sprocket."},{"n": 11,"text": "Remove rear wheel assembly."}]},
{"id": "s25-chassis-5-install","bikeIds": ["softail-2025"],"system": "brakes","title": "Rear Wheel: Install","summary": "Install the rear wheel with anti-seize lubricant, align belt and tighten axle.","difficulty": "Easy","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-5"},"figures": [{"file": "/figures/softail-2025/p3-5.jpg", "caption": "Manual page 3-5"}],"tools": [],"parts": [],"torque": [{"fastener": "Rear wheel axle","value": "80\u201395 ft-lbs (108\u2013129 N\u00b7m)"},{"fastener": "Rear fork pivot shaft nut (first)","value": "25\u201330 ft-lbs (34\u201341 N\u00b7m)"},{"fastener": "Rear fork pivot shaft nut (final)","value": "154\u2013170 ft-lbs (209\u2013230 N\u00b7m)"}],"steps": [{"n": 1,"text": "Apply anti-seize lubricant to rear axle and bearing bores."},{"n": 2,"text": "Install rear wheel assembly."},{"n": 3,"text": "Align drive belt with rear sprocket."},{"n": 4,"text": "Install rear axle. Tighten."},{"n": 5,"text": "Install spacers."},{"n": 6,"text": "Restore brake system."},{"n": 7,"text": "Lower rear wheel."}]},
{"id": "s25-chassis-5-disassemble","bikeIds": ["softail-2025"],"system": "brakes","title": "Rear Wheel: Disassemble","summary": "Disassemble rear wheel hub, brake disc, sprocket, tire and bearings.","difficulty": "Medium","timeMinutes": 45,"source": {"manual": "2025 HD Softail Service Manual","page": "3-5"},"figures": [{"file": "/figures/softail-2025/p3-5.jpg", "caption": "Manual page 3-5"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Remove rear sprocket."},{"n": 2,"text": "Remove rear brake disc."},{"n": 3,"text": "Remove rear tire."},{"n": 4,"text": "Remove valve stem."},{"n": 5,"text": "Remove sealed wheel bearings."},{"n": 6,"text": "Remove wheel bearing spacers."},{"n": 7,"text": "Clean all parts."}]},
{"id": "s25-chassis-5-assemble","bikeIds": ["softail-2025"],"system": "brakes","title": "Rear Wheel: Assemble","summary": "Assemble rear wheel with new bearings, tire, brake disc and sprocket.","difficulty": "Medium","timeMinutes": 45,"source": {"manual": "2025 HD Softail Service Manual","page": "3-5"},"figures": [{"file": "/figures/softail-2025/p3-5.jpg", "caption": "Manual page 3-5"}],"tools": [],"parts": [],"torque": [{"fastener": "Rear brake disc screws","value": "30\u201345 ft-lbs (40.7\u201361 N\u00b7m)"},{"fastener": "Rear sprocket screws (first)","value": "60 ft-lbs (81.3 N\u00b7m)"},{"fastener": "Rear sprocket screws (final)","value": "77\u201383 ft-lbs (104.4\u2013112.5 N\u00b7m)"}],"steps": [{"n": 1,"text": "Install new valve stem."},{"n": 2,"text": "Install tire."},{"n": 3,"text": "Install wheel bearing spacers."},{"n": 4,"text": "Install new wheel bearings."},{"n": 5,"text": "Install rear brake disc. Tighten screws."},{"n": 6,"text": "Install rear sprocket. Tighten with two-step procedure."}]},
{"id": "s25-chassis-6-check-radial","bikeIds": ["softail-2025"],"system": "brakes","title": "Wheel Runout: Check Radial","summary": "Check wheel radial runout using truing stand and dial indicator.","difficulty": "Easy","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-6"},"figures": [{"file": "/figures/softail-2025/p3-6.jpg", "caption": "Manual page 3-6"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Mount wheel in wheel truing stand."},{"n": 2,"text": "Adjust gauge rod to rim tire bead safety hump."},{"n": 3,"text": "Rotate wheel and measure distance at several locations."},{"n": 4,"text": "Compare to specifications. If out, adjust spokes or replace wheel."}]},
{"id": "s25-chassis-6-check-lateral","bikeIds": ["softail-2025"],"system": "brakes","title": "Wheel Runout: Check Lateral","summary": "Check wheel lateral runout using truing stand and dial indicator.","difficulty": "Easy","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-6"},"figures": [{"file": "/figures/softail-2025/p3-6.jpg", "caption": "Manual page 3-6"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Mount wheel in wheel truing stand."},{"n": 2,"text": "Adjust gauge rod to side of rim."},{"n": 3,"text": "Rotate wheel and measure distance at several locations."},{"n": 4,"text": "Compare to specifications. If out, adjust spokes or replace wheel."}]},
{"id": "s25-chassis-6-true","bikeIds": ["softail-2025"],"system": "brakes","title": "Wheel Runout: True Laced Wheel","summary": "Adjust spokes to true a laced wheel using a truing stand.","difficulty": "Hard","timeMinutes": 90,"source": {"manual": "2025 HD Softail Service Manual","page": "3-6"},"figures": [{"file": "/figures/softail-2025/p3-6.jpg", "caption": "Manual page 3-6"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Mount wheel in wheel truing stand."},{"n": 2,"text": "Identify high and low spots on rim."},{"n": 3,"text": "Loosen spokes on high side opposite gauge indicator."},{"n": 4,"text": "Tighten spokes on low side opposite gauge indicator."},{"n": 5,"text": "Make small adjustments and re-check runout frequently."},{"n": 6,"text": "Continue until wheel is within specifications."}]},
{"id": "s25-chassis-7-inspect","bikeIds": ["softail-2025"],"system": "brakes","title": "Sealed Wheel Bearings: Inspect","summary": "Inspect wheel bearings for proper operation and end play.","difficulty": "Easy","timeMinutes": 20,"source": {"manual": "2025 HD Softail Service Manual","page": "3-7"},"figures": [{"file": "/figures/softail-2025/p3-7.jpg", "caption": "Manual page 3-7"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Raise front or rear wheel."},{"n": 2,"text": "Turn the wheel through several rotations."},{"n": 3,"text": "Pull or push on wheel (not brake disc) to check end play."},{"n": 4,"text": "If end play exceeds 0.005 in., replace bearings."},{"n": 5,"text": "Spin wheel by hand and check for smooth rotation."}]},
{"id": "s25-chassis-7-remove","bikeIds": ["softail-2025"],"system": "brakes","title": "Sealed Wheel Bearings: Remove","summary": "Remove and discard sealed wheel bearings from wheel hub.","difficulty": "Medium","timeMinutes": 40,"source": {"manual": "2025 HD Softail Service Manual","page": "3-7"},"figures": [{"file": "/figures/softail-2025/p3-7.jpg", "caption": "Manual page 3-7"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Mount wheel hub in vise with soft jaw protection."},{"n": 2,"text": "Assemble wheel bearing installer/remover per tool instructions."},{"n": 3,"text": "Hold end of forcing screw against bearing inner race."},{"n": 4,"text": "Turn draw down bolt until bearing separates from hub."},{"n": 5,"text": "Repeat for each bearing. Clean bearing bores."}]},
{"id": "s25-chassis-7-install","bikeIds": ["softail-2025"],"system": "brakes","title": "Sealed Wheel Bearings: Install","summary": "Install new sealed wheel bearings into wheel hub.","difficulty": "Medium","timeMinutes": 40,"source": {"manual": "2025 HD Softail Service Manual","page": "3-7"},"figures": [{"file": "/figures/softail-2025/p3-7.jpg", "caption": "Manual page 3-7"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Mount wheel hub in vise with soft jaw protection."},{"n": 2,"text": "Assemble wheel bearing installer with collet and forcing screw."},{"n": 3,"text": "Insert collet through hub bore from outboard side."},{"n": 4,"text": "Position new bearing on forcing screw."},{"n": 5,"text": "Start bearing into hub using collet and forcing screw."},{"n": 6,"text": "Turn draw down bolt to press bearing fully into hub."},{"n": 7,"text": "Repeat for second bearing on opposite side."}]},
{"id": "s25-chassis-8-remove","bikeIds": ["softail-2025"],"system": "brakes","title": "Tires: Remove","summary": "Remove tire from wheel rim and discard if worn or damaged.","difficulty": "Medium","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-8"},"figures": [{"file": "/figures/softail-2025/p3-8.jpg", "caption": "Manual page 3-8"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Remove wheel from motorcycle."},{"n": 2,"text": "Remove valve stem."},{"n": 3,"text": "Mount wheel in tire machine."},{"n": 4,"text": "Break tire bead from rim using tire machine."},{"n": 5,"text": "Remove tire from rim."},{"n": 6,"text": "Remove and discard rim strip if equipped."},{"n": 7,"text": "Inspect rim for corrosion or damage."}]},
{"id": "s25-chassis-8-install","bikeIds": ["softail-2025"],"system": "brakes","title": "Tires: Install","summary": "Install new tire on wheel rim and balance the wheel.","difficulty": "Medium","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-8"},"figures": [{"file": "/figures/softail-2025/p3-8.jpg", "caption": "Manual page 3-8"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Install new rim strip if equipped."},{"n": 2,"text": "Mount new tire on rim using tire machine."},{"n": 3,"text": "Verify tire bead is seated evenly around rim."},{"n": 4,"text": "Inflate tire to initial pressure. Check for leaks."},{"n": 5,"text": "Deflate and balance wheel on balancing machine."},{"n": 6,"text": "Inflate to final pressure per placard."},{"n": 7,"text": "Install valve stem cap. Install wheel on motorcycle."}]},
{"id": "s25-chassis-9-measure","bikeIds": ["softail-2025"],"system": "brakes","title": "Wheel Alignment: Measure","summary": "Measure rear wheel alignment using alignment plugs and measuring tool.","difficulty": "Medium","timeMinutes": 45,"source": {"manual": "2025 HD Softail Service Manual","page": "3-9"},"figures": [{"file": "/figures/softail-2025/p3-9.jpg", "caption": "Manual page 3-9"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Remove mufflers as necessary."},{"n": 2,"text": "Install alignment plugs in axle holes."},{"n": 3,"text": "Measure distance from rear fork flat to alignment tool center (left)."},{"n": 4,"text": "Measure distance from rear fork flat to alignment tool center (right)."},{"n": 5,"text": "Difference should not exceed 0.5 in. If out, consult dealer."}]},
{"id": "s25-chassis-10-remove","bikeIds": ["softail-2025"],"system": "brakes","title": "Front Brake Master Cylinder: Remove","summary": "Remove the front brake master cylinder after draining brake fluid.","difficulty": "Medium","timeMinutes": 40,"source": {"manual": "2025 HD Softail Service Manual","page": "3-10"},"figures": [{"file": "/figures/softail-2025/p3-10.jpg", "caption": "Manual page 3-10"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Remove right mirror."},{"n": 2,"text": "Drain brake fluid from front brake system."},{"n": 3,"text": "Remove brake line banjo bolt and gasket washers."},{"n": 4,"text": "Remove brake line."},{"n": 5,"text": "Disconnect brake lever switch connector."},{"n": 6,"text": "Remove front brake switch."},{"n": 7,"text": "Remove mounting screws and washers."},{"n": 8,"text": "Remove master cylinder assembly."}]},
{"id": "s25-chassis-10-install","bikeIds": ["softail-2025"],"system": "brakes","title": "Front Brake Master Cylinder: Install","summary": "Install the front brake master cylinder and reconnect brake line.","difficulty": "Medium","timeMinutes": 40,"source": {"manual": "2025 HD Softail Service Manual","page": "3-10"},"figures": [{"file": "/figures/softail-2025/p3-10.jpg", "caption": "Manual page 3-10"}],"tools": [],"parts": [],"torque": [{"fastener": "Front brake master cylinder banjo bolt (Single disk)","value": "21\u201323 ft-lbs (29\u201331 N\u00b7m)"},{"fastener": "Front brake master cylinder banjo bolt (Dual disk)","value": "24\u201325 ft-lbs (32\u201334 N\u00b7m)"},{"fastener": "Master cylinder front clamp screws","value": "89\u201397 in-lbs (10\u201311 N\u00b7m)"}],"steps": [{"n": 1,"text": "Install master cylinder assembly."},{"n": 2,"text": "Install washers and screws. Do not tighten yet."},{"n": 3,"text": "Position hand lever and controls for rider comfort."},{"n": 4,"text": "Tighten both screws starting with top screw."},{"n": 5,"text": "Install front brake switch."},{"n": 6,"text": "Connect brake lever switch connector and install cover."},{"n": 7,"text": "Install banjo bolt, brake line and new gasket washers."},{"n": 8,"text": "Fill and bleed front brake system. Install right mirror."}]},
{"id": "s25-chassis-11-remove","bikeIds": ["softail-2025"],"system": "brakes","title": "Front Brake Caliper: Remove","summary": "Remove the front brake caliper(s) from the brake mounting bracket.","difficulty": "Medium","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-11"},"figures": [{"file": "/figures/softail-2025/p3-11.jpg", "caption": "Manual page 3-11"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Remove front wheel."},{"n": 2,"text": "Disconnect brake hose banjo bolt."},{"n": 3,"text": "Remove and discard gasket washers."},{"n": 4,"text": "Remove caliper mounting bolts."},{"n": 5,"text": "Remove caliper assembly."}]},
{"id": "s25-chassis-11-install","bikeIds": ["softail-2025"],"system": "brakes","title": "Front Brake Caliper: Install","summary": "Install the front brake caliper and reconnect brake line.","difficulty": "Medium","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-11"},"figures": [{"file": "/figures/softail-2025/p3-11.jpg", "caption": "Manual page 3-11"}],"tools": [],"parts": [],"torque": [{"fastener": "Front brake caliper mounting bolts","value": "28\u201338 ft-lbs (38\u201351.5 N\u00b7m)"},{"fastener": "Front brake caliper banjo bolt","value": "14\u201318 ft-lbs (19\u201324.5 N\u00b7m)"}],"steps": [{"n": 1,"text": "Install caliper mounting bolts and tighten."},{"n": 2,"text": "Install brake hose banjo bolt with new gasket washers."},{"n": 3,"text": "Tighten banjo bolt to specification."},{"n": 4,"text": "Install brake pads if removed."},{"n": 5,"text": "Bleed front brake system. Install front wheel."}]},
{"id": "s25-chassis-11-disassemble","bikeIds": ["softail-2025"],"system": "brakes","title": "Front Brake Caliper: Disassemble","summary": "Disassemble the front brake caliper to replace pistons, seals and springs.","difficulty": "Hard","timeMinutes": 60,"source": {"manual": "2025 HD Softail Service Manual","page": "3-11"},"figures": [{"file": "/figures/softail-2025/p3-11.jpg", "caption": "Manual page 3-11"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Remove brake pads from caliper."},{"n": 2,"text": "Using compressed air, push pistons out of caliper bore."},{"n": 3,"text": "Remove and discard piston seals from caliper bore."},{"n": 4,"text": "Remove and discard return springs."},{"n": 5,"text": "Clean all parts with denatured alcohol or brake fluid."},{"n": 6,"text": "Inspect caliper bore for scoring, pitting or corrosion."}]},
{"id": "s25-chassis-11-assemble","bikeIds": ["softail-2025"],"system": "brakes","title": "Front Brake Caliper: Assemble","summary": "Assemble the front brake caliper with new seals and springs.","difficulty": "Hard","timeMinutes": 60,"source": {"manual": "2025 HD Softail Service Manual","page": "3-11"},"figures": [{"file": "/figures/softail-2025/p3-11.jpg", "caption": "Manual page 3-11"}],"tools": [],"parts": [],"torque": [{"fastener": "Front brake caliper bridge bolt","value": "14\u201318 ft-lbs (19.6\u201324.5 N\u00b7m)"},{"fastener": "Front brake caliper bleeder screw","value": "35\u201361 in-lbs (3.9\u20136.9 N\u00b7m)"}],"steps": [{"n": 1,"text": "Install new return springs in caliper bore."},{"n": 2,"text": "Install new piston seals in caliper bore."},{"n": 3,"text": "Lubricate pistons with clean brake fluid."},{"n": 4,"text": "Install pistons into bore using piston installation tool."},{"n": 5,"text": "Install new dust seals over pistons."},{"n": 6,"text": "Install bridge bolt connecting two calipers (if dual disk)."},{"n": 7,"text": "Install brake pads."}]},
{"id": "s25-chassis-12-remove","bikeIds": ["softail-2025"],"system": "brakes","title": "Rear Brake Master Cylinder: Remove","summary": "Remove the rear brake master cylinder after draining brake fluid.","difficulty": "Medium","timeMinutes": 35,"source": {"manual": "2025 HD Softail Service Manual","page": "3-12"},"figures": [{"file": "/figures/softail-2025/p3-12.jpg", "caption": "Manual page 3-12"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Drain brake fluid from rear brake system."},{"n": 2,"text": "Remove brake line."},{"n": 3,"text": "Disconnect brake switch connector if equipped."},{"n": 4,"text": "Remove mounting screws."},{"n": 5,"text": "Remove master cylinder assembly."}]},
{"id": "s25-chassis-12-install","bikeIds": ["softail-2025"],"system": "brakes","title": "Rear Brake Master Cylinder: Install","summary": "Install the rear brake master cylinder and reconnect brake line.","difficulty": "Medium","timeMinutes": 35,"source": {"manual": "2025 HD Softail Service Manual","page": "3-12"},"figures": [{"file": "/figures/softail-2025/p3-12.jpg", "caption": "Manual page 3-12"}],"tools": [],"parts": [],"torque": [{"fastener": "Rear brake master cylinder mounting screws","value": "18\u201322 ft-lbs (24.4\u201329.9 N\u00b7m)"},{"fastener": "Master cylinder rear banjo bolt","value": "14\u201318 ft-lbs (19\u201324.4 N\u00b7m)"}],"steps": [{"n": 1,"text": "Install master cylinder assembly."},{"n": 2,"text": "Install mounting screws. Tighten."},{"n": 3,"text": "Connect brake switch connector if equipped."},{"n": 4,"text": "Install brake line."},{"n": 5,"text": "Tighten banjo bolt to specification."},{"n": 6,"text": "Fill and bleed rear brake system."}]},
{"id": "s25-chassis-13-remove","bikeIds": ["softail-2025"],"system": "brakes","title": "Rear Brake Caliper: Remove","summary": "Remove the rear brake caliper from the mounting bracket.","difficulty": "Medium","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-13"},"figures": [{"file": "/figures/softail-2025/p3-13.jpg", "caption": "Manual page 3-13"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Remove rear wheel."},{"n": 2,"text": "Disconnect brake hose banjo bolt."},{"n": 3,"text": "Remove and discard gasket washers."},{"n": 4,"text": "Remove caliper slider bolts."},{"n": 5,"text": "Remove caliper assembly."}]},
{"id": "s25-chassis-13-install","bikeIds": ["softail-2025"],"system": "brakes","title": "Rear Brake Caliper: Install","summary": "Install the rear brake caliper and reconnect brake line.","difficulty": "Medium","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-13"},"figures": [{"file": "/figures/softail-2025/p3-13.jpg", "caption": "Manual page 3-13"}],"tools": [],"parts": [],"torque": [{"fastener": "Rear brake caliper slider bolt","value": "15\u201318 ft-lbs (20.3\u201324.4 N\u00b7m)"},{"fastener": "Rear brake caliper banjo bolt","value": "21\u201323 ft-lbs (29\u201331 N\u00b7m)"}],"steps": [{"n": 1,"text": "Install caliper slider bolts and tighten."},{"n": 2,"text": "Install brake hose banjo bolt with new gasket washers."},{"n": 3,"text": "Tighten banjo bolt to specification."},{"n": 4,"text": "Install brake pads if removed."},{"n": 5,"text": "Bleed rear brake system. Install rear wheel."}]},
{"id": "s25-chassis-16-bleed","bikeIds": ["softail-2025"],"system": "brakes","title": "Bleed Brakes: Fill and Bleed System","summary": "Fill brake master cylinder reservoir and bleed air from brake lines.","difficulty": "Medium","timeMinutes": 45,"source": {"manual": "2025 HD Softail Service Manual","page": "3-16"},"figures": [{"file": "/figures/softail-2025/p3-16.jpg", "caption": "Manual page 3-16"}],"tools": [],"parts": [],"torque": [{"fastener": "Bleeder screw","value": "35\u201361 in-lbs (3.9\u20136.9 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove master cylinder reservoir cover."},{"n": 2,"text": "Fill reservoir with DOT 4 brake fluid to MAX line."},{"n": 3,"text": "Open bleeder screw on caliper. Attach clear tube to screw."},{"n": 4,"text": "Submerge tube end in brake fluid container."},{"n": 5,"text": "Operate brake lever or pedal slowly. Watch for air bubbles."},{"n": 6,"text": "When no air is visible, close bleeder screw."},{"n": 7,"text": "Repeat for each wheel brake caliper."},{"n": 8,"text": "Fill reservoir to MAX line. Install cover."}]},
{"id": "s25-chassis-19-remove","bikeIds": ["softail-2025"],"system": "chassis","title": "Front Fork: Remove","summary": "Remove the front fork assembly from the steering head.","difficulty": "Medium","timeMinutes": 40,"source": {"manual": "2025 HD Softail Service Manual","page": "3-19"},"figures": [{"file": "/figures/softail-2025/p3-19.jpg", "caption": "Manual page 3-19"}],"tools": [],"parts": [],"torque": [{"fastener": "Fork bracket upper pinch bolt","value": "16\u201320 ft-lbs (21.7\u201327.1 N\u00b7m)"},{"fastener": "Fork bracket lower pinch bolt","value": "16\u201320 ft-lbs (21.7\u201327.1 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove front wheel."},{"n": 2,"text": "Disconnect brake hoses from front calipers."},{"n": 3,"text": "Disconnect ABS sensor harness if equipped."},{"n": 4,"text": "Loosen upper fork bracket pinch bolts."},{"n": 5,"text": "Loosen lower fork bracket pinch bolts."},{"n": 6,"text": "Remove front fork assembly from steering head."}]},
{"id": "s25-chassis-19-install","bikeIds": ["softail-2025"],"system": "chassis","title": "Front Fork: Install","summary": "Install the front fork assembly into the steering head.","difficulty": "Medium","timeMinutes": 40,"source": {"manual": "2025 HD Softail Service Manual","page": "3-19"},"figures": [{"file": "/figures/softail-2025/p3-19.jpg", "caption": "Manual page 3-19"}],"tools": [],"parts": [],"torque": [{"fastener": "Fork bracket upper pinch bolt","value": "16\u201320 ft-lbs (21.7\u201327.1 N\u00b7m)"},{"fastener": "Fork bracket lower pinch bolt","value": "16\u201320 ft-lbs (21.7\u201327.1 N\u00b7m)"}],"steps": [{"n": 1,"text": "Position front fork in steering head."},{"n": 2,"text": "Install upper fork bracket pinch bolts. Tighten alternately."},{"n": 3,"text": "Install lower fork bracket pinch bolts. Tighten alternately."},{"n": 4,"text": "Connect ABS sensor harness if equipped."},{"n": 5,"text": "Connect brake hoses to front calipers."},{"n": 6,"text": "Bleed front brake system."},{"n": 7,"text": "Install front wheel."}]},
{"id": "s25-chassis-20-remove","bikeIds": ["softail-2025"],"system": "chassis","title": "Steering Head/Fork Stem: Remove","summary": "Remove the steering head and fork stem assembly.","difficulty": "Hard","timeMinutes": 120,"source": {"manual": "2025 HD Softail Service Manual","page": "3-20"},"figures": [{"file": "/figures/softail-2025/p3-20.jpg", "caption": "Manual page 3-20"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Remove front fork assembly."},{"n": 2,"text": "Remove handlebars and related controls."},{"n": 3,"text": "Remove steering head lock nut and preload adjustments."},{"n": 4,"text": "Remove fork stem from steering head."},{"n": 5,"text": "Clean all bearing surfaces."}]},
{"id": "s25-chassis-20-install","bikeIds": ["softail-2025"],"system": "chassis","title": "Steering Head/Fork Stem: Install","summary": "Install the steering head and fork stem assembly.","difficulty": "Hard","timeMinutes": 120,"source": {"manual": "2025 HD Softail Service Manual","page": "3-20"},"figures": [{"file": "/figures/softail-2025/p3-20.jpg", "caption": "Manual page 3-20"}],"tools": [],"parts": [],"torque": [{"fastener": "Fork stem pinch bolt","value": "16\u201320 ft-lbs (21.7\u201327.1 N\u00b7m)"},{"fastener": "Fork stem screw (1st torque)","value": "13\u201314 ft-lbs (18.1\u201319 N\u00b7m)"}],"steps": [{"n": 1,"text": "Install fork stem into steering head."},{"n": 2,"text": "Set steering head bearing preload per manufacturer specifications."},{"n": 3,"text": "Install steering head lock nut."},{"n": 4,"text": "Install fork stem pinch bolt. Tighten."},{"n": 5,"text": "Install handlebars and related controls."},{"n": 6,"text": "Verify steering operates smoothly and freely."}]},
{"id": "s25-chassis-22-remove-install","bikeIds": ["softail-2025"],"system": "chassis","title": "Rear Fork/Swingarm: Remove and Install","summary": "Remove and install the rear fork (swingarm) pivot assembly.","difficulty": "Hard","timeMinutes": 90,"source": {"manual": "2025 HD Softail Service Manual","page": "3-22"},"figures": [{"file": "/figures/softail-2025/p3-22.jpg", "caption": "Manual page 3-22"}],"tools": [],"parts": [],"torque": [{"fastener": "Rear fork pivot shaft nut (first)","value": "25\u201330 ft-lbs (34\u201341 N\u00b7m)"},{"fastener": "Rear fork pivot shaft nut (final)","value": "154\u2013170 ft-lbs (209\u2013230 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove rear wheel."},{"n": 2,"text": "Remove shock absorber."},{"n": 3,"text": "Remove drive belt."},{"n": 4,"text": "Remove rear brake caliper."},{"n": 5,"text": "Support frame with jack."},{"n": 6,"text": "Remove rear fork pivot shaft nuts (left side)."},{"n": 7,"text": "Lower and remove rear fork assembly."},{"n": 8,"text": "Install new or repaired rear fork assembly in reverse order."},{"n": 9,"text": "Torque pivot shaft nuts using two-step procedure."}]},
{"id": "s25-chassis-24-remove","bikeIds": ["softail-2025"],"system": "chassis","title": "Rear Shock Absorber: Remove","summary": "Remove the rear shock absorber from the frame and swingarm.","difficulty": "Easy","timeMinutes": 25,"source": {"manual": "2025 HD Softail Service Manual","page": "3-24"},"figures": [{"file": "/figures/softail-2025/p3-24.jpg", "caption": "Manual page 3-24"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Raise rear wheel."},{"n": 2,"text": "Remove upper mounting bolt."},{"n": 3,"text": "Remove lower mounting bolt."},{"n": 4,"text": "Remove shock absorber assembly."}]},
{"id": "s25-chassis-24-install","bikeIds": ["softail-2025"],"system": "chassis","title": "Rear Shock Absorber: Install","summary": "Install the rear shock absorber into the frame and swingarm.","difficulty": "Easy","timeMinutes": 25,"source": {"manual": "2025 HD Softail Service Manual","page": "3-24"},"figures": [{"file": "/figures/softail-2025/p3-24.jpg", "caption": "Manual page 3-24"}],"tools": [],"parts": [],"torque": [{"fastener": "Upper shock screw","value": "80\u201390 ft-lbs (108.5\u2013122 N\u00b7m)"},{"fastener": "Lower shock screw","value": "70\u201375 ft-lbs (94.9\u2013101.7 N\u00b7m)"}],"steps": [{"n": 1,"text": "Position shock absorber between frame and swingarm."},{"n": 2,"text": "Install lower mounting bolt. Tighten."},{"n": 3,"text": "Install upper mounting bolt. Tighten."},{"n": 4,"text": "Lower rear wheel."},{"n": 5,"text": "Verify shock is properly positioned and secured."}]},
{"id": "s25-chassis-25-cable-remove","bikeIds": ["softail-2025"],"system": "drivetrain","title": "Clutch Control: Remove Cable","summary": "Remove the clutch control cable from lever and engine.","difficulty": "Easy","timeMinutes": 20,"source": {"manual": "2025 HD Softail Service Manual","page": "3-25"},"figures": [{"file": "/figures/softail-2025/p3-25.jpg", "caption": "Manual page 3-25"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Remove clutch lever bracket screws from handlebar."},{"n": 2,"text": "Disconnect clutch cable from clutch lever."},{"n": 3,"text": "Route cable away from engine."},{"n": 4,"text": "Disconnect cable from clutch push rod."},{"n": 5,"text": "Remove cable from motorcycle."}]},
{"id": "s25-chassis-25-cable-install","bikeIds": ["softail-2025"],"system": "drivetrain","title": "Clutch Control: Install Cable","summary": "Install the clutch control cable and adjust free play.","difficulty": "Easy","timeMinutes": 20,"source": {"manual": "2025 HD Softail Service Manual","page": "3-25"},"figures": [{"file": "/figures/softail-2025/p3-25.jpg", "caption": "Manual page 3-25"}],"tools": [],"parts": [],"torque": [{"fastener": "Clutch control adjuster lock nut","value": "53 in-lbs (6 N\u00b7m)"},{"fastener": "Clutch lever screw bracket screw","value": "60\u201380 in-lbs (6.8\u20139 N\u00b7m)"}],"steps": [{"n": 1,"text": "Route new cable to clutch push rod."},{"n": 2,"text": "Connect cable to clutch push rod."},{"n": 3,"text": "Route cable to clutch lever."},{"n": 4,"text": "Connect cable to clutch lever."},{"n": 5,"text": "Adjust cable free play. Should be 1/8 in."},{"n": 6,"text": "Install clutch lever bracket screws."},{"n": 7,"text": "Verify cable does not bind or rub."}]},
{"id": "s25-chassis-25-adjust","bikeIds": ["softail-2025"],"system": "drivetrain","title": "Clutch Control: Adjust Cable Free Play","summary": "Adjust clutch cable free play at lever.","difficulty": "Easy","timeMinutes": 15,"source": {"manual": "2025 HD Softail Service Manual","page": "3-25"},"figures": [{"file": "/figures/softail-2025/p3-25.jpg", "caption": "Manual page 3-25"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Locate clutch cable adjuster at handlebar lever."},{"n": 2,"text": "Loosen cable adjuster lock nut."},{"n": 3,"text": "Turn adjuster in or out to set free play to 1/8 in."},{"n": 4,"text": "Tighten lock nut."},{"n": 5,"text": "Verify clutch lever has proper feel and engagement."}]},
{"id": "s25-chassis-17-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Left Side Cover: Remove and Install","summary": "Remove and install the left side cover.","difficulty": "Easy","timeMinutes": 15,"source": {"manual": "2025 HD Softail Service Manual","page": "3-17"},"figures": [{"file": "/figures/softail-2025/p3-17.jpg", "caption": "Manual page 3-17"}],"tools": [],"parts": [],"torque": [{"fastener": "Side cover left side bracket to frame screw","value": "8\u201310 ft-lbs (10.8\u201313.6 N\u00b7m)"},{"fastener": "Side cover screw (single screw)","value": "44\u201350 in-lbs (5\u20135.6 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove screws securing left side cover."},{"n": 2,"text": "Carefully remove side cover by pulling away from frame."},{"n": 3,"text": "Inspect mounting bracket and gasket for damage."},{"n": 4,"text": "Install new gasket if necessary."},{"n": 5,"text": "Position new side cover on frame."},{"n": 6,"text": "Install and tighten mounting screws."}]},
{"id": "s25-chassis-18-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Right Side Cover: Remove and Install","summary": "Remove and install the right side cover.","difficulty": "Easy","timeMinutes": 15,"source": {"manual": "2025 HD Softail Service Manual","page": "3-18"},"figures": [{"file": "/figures/softail-2025/p3-18.jpg", "caption": "Manual page 3-18"}],"tools": [],"parts": [],"torque": [{"fastener": "Side cover screw (vertical screw)","value": "44\u201350 in-lbs (5\u20135.6 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove screws securing right side cover."},{"n": 2,"text": "Carefully remove side cover by pulling away from frame."},{"n": 3,"text": "Inspect mounting bracket and gasket for damage."},{"n": 4,"text": "Install new gasket if necessary."},{"n": 5,"text": "Position new side cover on frame."},{"n": 6,"text": "Install and tighten mounting screws."}]},
{"id": "s25-chassis-23-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Belt Guards: Remove and Install","summary": "Remove and install the belt guard assembly.","difficulty": "Easy","timeMinutes": 20,"source": {"manual": "2025 HD Softail Service Manual","page": "3-23"},"figures": [{"file": "/figures/softail-2025/p3-23.jpg", "caption": "Manual page 3-23"}],"tools": [],"parts": [],"torque": [{"fastener": "Belt guard lower screw","value": "70\u201380 in-lbs (7.9\u20139 N\u00b7m)"},{"fastener": "Belt guard upper screw","value": "70\u201380 in-lbs (7.9\u20139 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove screws securing belt guard assembly."},{"n": 2,"text": "Carefully remove belt guard by pulling away from engine."},{"n": 3,"text": "Inspect guard for cracks or damage."},{"n": 4,"text": "Position new belt guard on engine."},{"n": 5,"text": "Install and tighten upper and lower screws."}]},
{"id": "s25-chassis-26-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Headlamp Nacelle: Remove and Install","summary": "Remove and install the headlamp nacelle assembly.","difficulty": "Medium","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-26"},"figures": [{"file": "/figures/softail-2025/p3-26.jpg", "caption": "Manual page 3-26"}],"tools": [],"parts": [],"torque": [{"fastener": "Headlamp nacelle clamp screw","value": "36\u201348 in-lbs (4.1\u20135.4 N\u00b7m)"}],"steps": [{"n": 1,"text": "Disconnect headlamp and turn signal connectors."},{"n": 2,"text": "Remove mounting screws."},{"n": 3,"text": "Remove nacelle from frame."},{"n": 4,"text": "Position new nacelle on frame."},{"n": 5,"text": "Install and tighten mounting screws."},{"n": 6,"text": "Connect headlamp and turn signal connectors."}]},
{"id": "s25-chassis-27-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Fairing: Remove and Install (Screw-On)","summary": "Remove and install the screw-on fairing.","difficulty": "Medium","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-27"},"figures": [{"file": "/figures/softail-2025/p3-27.jpg", "caption": "Manual page 3-27"}],"tools": [],"parts": [],"torque": [{"fastener": "Fairing screw-on screws","value": "20\u201330 in-lbs (2.3\u20133.4 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove fairing mounting screws."},{"n": 2,"text": "Carefully pull fairing away from frame."},{"n": 3,"text": "Disconnect any electrical connectors if equipped."},{"n": 4,"text": "Position new fairing on frame."},{"n": 5,"text": "Install and tighten mounting screws."},{"n": 6,"text": "Connect electrical connectors if equipped."}]},
{"id": "s25-chassis-29-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Windshield: Remove and Install","summary": "Remove and install the windshield assembly.","difficulty": "Easy","timeMinutes": 20,"source": {"manual": "2025 HD Softail Service Manual","page": "3-29"},"figures": [{"file": "/figures/softail-2025/p3-29.jpg", "caption": "Manual page 3-29"}],"tools": [],"parts": [],"torque": [{"fastener": "Windshield acorn nuts","value": "23\u201327 in-lbs (2.6\u20133 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove windshield mounting nuts."},{"n": 2,"text": "Carefully remove windshield from mounting bracket."},{"n": 3,"text": "Inspect mounting bracket for damage."},{"n": 4,"text": "Position new windshield on mounting bracket."},{"n": 5,"text": "Install and tighten mounting nuts."}]},
{"id": "s25-chassis-30-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Hand Grips: Remove and Install","summary": "Remove and install the handlebar hand grips.","difficulty": "Easy","timeMinutes": 15,"source": {"manual": "2025 HD Softail Service Manual","page": "3-30"},"figures": [{"file": "/figures/softail-2025/p3-30.jpg", "caption": "Manual page 3-30"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Cut away old hand grips using a cutting tool."},{"n": 2,"text": "Clean handlebar of old grip adhesive residue."},{"n": 3,"text": "Apply grip adhesive to handlebar per grip instructions."},{"n": 4,"text": "Slide new grips onto handlebar."},{"n": 5,"text": "Ensure grips are properly positioned and secure."}]},
{"id": "s25-chassis-31-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Handlebar: Remove and Install","summary": "Remove and install the handlebar assembly.","difficulty": "Medium","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-31"},"figures": [{"file": "/figures/softail-2025/p3-31.jpg", "caption": "Manual page 3-31"}],"tools": [],"parts": [],"torque": [{"fastener": "Riser flange nuts","value": "30\u201340 ft-lbs (40.7\u201354.3 N\u00b7m)"}],"steps": [{"n": 1,"text": "Disconnect control cables and electrical connectors."},{"n": 2,"text": "Remove riser flange nuts."},{"n": 3,"text": "Remove handlebar assembly."},{"n": 4,"text": "Position new handlebar on risers."},{"n": 5,"text": "Install and tighten riser flange nuts."},{"n": 6,"text": "Connect control cables and electrical connectors."},{"n": 7,"text": "Adjust cables and verify all controls operate properly."}]},
{"id": "s25-chassis-32-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Mirrors: Remove and Install","summary": "Remove and install the side mirror assemblies.","difficulty": "Easy","timeMinutes": 15,"source": {"manual": "2025 HD Softail Service Manual","page": "3-32"},"figures": [{"file": "/figures/softail-2025/p3-32.jpg", "caption": "Manual page 3-32"}],"tools": [],"parts": [],"torque": [{"fastener": "Mirror mounting nut","value": "96\u2013144 in-lbs (10.8\u201316.3 N\u00b7m)"}],"steps": [{"n": 1,"text": "Disconnect mirror electrical connector if equipped."},{"n": 2,"text": "Remove mirror mounting nut."},{"n": 3,"text": "Remove mirror assembly."},{"n": 4,"text": "Position new mirror on mounting bracket."},{"n": 5,"text": "Install and tighten mounting nut."},{"n": 6,"text": "Connect electrical connector if equipped."},{"n": 7,"text": "Adjust mirror for proper visibility."}]},
{"id": "s25-chassis-33-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Front Fender: Remove and Install","summary": "Remove and install the front fender.","difficulty": "Medium","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-33"},"figures": [{"file": "/figures/softail-2025/p3-33.jpg", "caption": "Manual page 3-33"}],"tools": [],"parts": [],"torque": [{"fastener": "Front fender mounting screw (typical)","value": "16\u201321 ft-lbs (22\u201328 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove front wheel."},{"n": 2,"text": "Remove fender mounting screws."},{"n": 3,"text": "Remove fender assembly."},{"n": 4,"text": "Inspect fender for cracks or damage."},{"n": 5,"text": "Position new fender on frame."},{"n": 6,"text": "Install and tighten mounting screws."},{"n": 7,"text": "Install front wheel."}]},
{"id": "s25-chassis-34-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Rear Fender: Remove and Install","summary": "Remove and install the rear fender.","difficulty": "Medium","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-34"},"figures": [{"file": "/figures/softail-2025/p3-34.jpg", "caption": "Manual page 3-34"}],"tools": [],"parts": [],"torque": [{"fastener": "Rear fender mounting screw","value": "42\u201346 ft-lbs (57\u201362.5 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove rear wheel."},{"n": 2,"text": "Disconnect any electrical connectors (tail light, etc.)."},{"n": 3,"text": "Remove fender mounting screws."},{"n": 4,"text": "Remove fender assembly."},{"n": 5,"text": "Inspect fender for cracks or damage."},{"n": 6,"text": "Position new fender on frame."},{"n": 7,"text": "Install and tighten mounting screws."},{"n": 8,"text": "Connect electrical connectors. Install rear wheel."}]},
{"id": "s25-chassis-36-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Mud Guard: Remove and Install","summary": "Remove and install the mud guard.","difficulty": "Easy","timeMinutes": 15,"source": {"manual": "2025 HD Softail Service Manual","page": "3-36"},"figures": [{"file": "/figures/softail-2025/p3-36.jpg", "caption": "Manual page 3-36"}],"tools": [],"parts": [],"torque": [{"fastener": "Mud guard screw","value": "40\u201345 in-lbs (4.5\u20135.1 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove mounting screw(s)."},{"n": 2,"text": "Remove mud guard."},{"n": 3,"text": "Inspect for cracks or damage."},{"n": 4,"text": "Position new mud guard on bracket."},{"n": 5,"text": "Install and tighten mounting screw(s)."}]},
{"id": "s25-chassis-37-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Saree Guard: Remove and Install","summary": "Remove and install the saree (saddlebag) guard.","difficulty": "Easy","timeMinutes": 15,"source": {"manual": "2025 HD Softail Service Manual","page": "3-37"},"figures": [{"file": "/figures/softail-2025/p3-37.jpg", "caption": "Manual page 3-37"}],"tools": [],"parts": [],"torque": [{"fastener": "Saree lower guard lower screw","value": "10\u201313 ft-lbs (14\u201318 N\u00b7m)"},{"fastener": "Saree upper guard screw","value": "21\u201327 ft-lbs (28\u201337 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove mounting screw(s)."},{"n": 2,"text": "Remove saree guard assembly."},{"n": 3,"text": "Inspect for cracks or damage."},{"n": 4,"text": "Position new saree guard on frame."},{"n": 5,"text": "Install and tighten mounting screw(s)."}]},
{"id": "s25-chassis-38-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Front License Plate Bracket: Remove and Install","summary": "Remove and install the front license plate bracket.","difficulty": "Easy","timeMinutes": 15,"source": {"manual": "2025 HD Softail Service Manual","page": "3-38"},"figures": [{"file": "/figures/softail-2025/p3-38.jpg", "caption": "Manual page 3-38"}],"tools": [],"parts": [],"torque": [{"fastener": "Front licence plate two hole bracket screws","value": "16\u201320 ft-lbs (21.7\u201327 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove license plate mounting screws."},{"n": 2,"text": "Remove bracket assembly."},{"n": 3,"text": "Inspect bracket for damage."},{"n": 4,"text": "Position new bracket on fender."},{"n": 5,"text": "Install and tighten mounting screws."},{"n": 6,"text": "Install license plate."}]},
{"id": "s25-chassis-39-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Rear License Plate Bracket: Remove and Install","summary": "Remove and install the rear license plate bracket.","difficulty": "Easy","timeMinutes": 15,"source": {"manual": "2025 HD Softail Service Manual","page": "3-39"},"figures": [{"file": "/figures/softail-2025/p3-39.jpg", "caption": "Manual page 3-39"}],"tools": [],"parts": [],"torque": [{"fastener": "License plate standard mount screws","value": "71\u201397 in-lbs (8\u201311 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove license plate mounting screws."},{"n": 2,"text": "Remove bracket assembly."},{"n": 3,"text": "Inspect bracket for damage."},{"n": 4,"text": "Position new bracket on fender."},{"n": 5,"text": "Install and tighten mounting screws."},{"n": 6,"text": "Install license plate and lighting if equipped."}]},
{"id": "s25-chassis-40-footboard","bikeIds": ["softail-2025"],"system": "chassis","title": "Left Foot Controls: Footboard Remove and Install","summary": "Remove and install the left footboard assembly.","difficulty": "Easy","timeMinutes": 20,"source": {"manual": "2025 HD Softail Service Manual","page": "3-40"},"figures": [{"file": "/figures/softail-2025/p3-40.jpg", "caption": "Manual page 3-40"}],"tools": [],"parts": [],"torque": [{"fastener": "Footboard assembly left side mounting screw","value": "40\u201345 ft-lbs (54\u201361 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove footboard mounting screw(s)."},{"n": 2,"text": "Remove footboard assembly."},{"n": 3,"text": "Inspect mounting bracket for damage."},{"n": 4,"text": "Position new footboard on bracket."},{"n": 5,"text": "Install and tighten mounting screw(s)."}]},
{"id": "s25-chassis-41-footboard","bikeIds": ["softail-2025"],"system": "chassis","title": "Right Foot Controls: Footboard Remove and Install","summary": "Remove and install the right footboard assembly.","difficulty": "Easy","timeMinutes": 20,"source": {"manual": "2025 HD Softail Service Manual","page": "3-41"},"figures": [{"file": "/figures/softail-2025/p3-41.jpg", "caption": "Manual page 3-41"}],"tools": [],"parts": [],"torque": [{"fastener": "Footboard assembly right side mounting screw","value": "40\u201345 ft-lbs (54\u201361 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove footboard mounting screw(s)."},{"n": 2,"text": "Remove footboard assembly."},{"n": 3,"text": "Inspect mounting bracket for damage."},{"n": 4,"text": "Position new footboard on bracket."},{"n": 5,"text": "Install and tighten mounting screw(s)."}]},
{"id": "s25-chassis-42-remove-install","bikeIds": ["softail-2025"],"system": "chassis","title": "Passenger Footrests: Remove and Install","summary": "Remove and install the passenger footrest assembly.","difficulty": "Easy","timeMinutes": 20,"source": {"manual": "2025 HD Softail Service Manual","page": "3-42"},"figures": [{"file": "/figures/softail-2025/p3-42.jpg", "caption": "Manual page 3-42"}],"tools": [],"parts": [],"torque": [{"fastener": "Passenger footpeg support screw","value": "38\u201347 ft-lbs (51.5\u201363.7 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove mounting screw(s) securing footrest bracket."},{"n": 2,"text": "Remove footrest assembly."},{"n": 3,"text": "Inspect mounting bracket and pivot for damage."},{"n": 4,"text": "Position new footrest assembly on frame."},{"n": 5,"text": "Install and tighten mounting screw(s)."}]},
{"id": "s25-chassis-43-remove-install","bikeIds": ["softail-2025"],"system": "chassis","title": "Jiffy Stand: Remove and Install","summary": "Remove and install the jiffy (kickstand) assembly.","difficulty": "Easy","timeMinutes": 20,"source": {"manual": "2025 HD Softail Service Manual","page": "3-43"},"figures": [{"file": "/figures/softail-2025/p3-43.jpg", "caption": "Manual page 3-43"}],"tools": [],"parts": [],"torque": [{"fastener": "Jiffy stand screws","value": "40\u201345 ft-lbs (54.2\u201361 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove jiffy stand mounting screw(s)."},{"n": 2,"text": "Remove jiffy stand assembly."},{"n": 3,"text": "Inspect mounting bracket and pivot for damage."},{"n": 4,"text": "Position new jiffy stand on bracket."},{"n": 5,"text": "Install and tighten mounting screw(s)."}]},
{"id": "s25-chassis-44-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Seat: Remove and Install","summary": "Remove and install the motorcycle seat.","difficulty": "Easy","timeMinutes": 15,"source": {"manual": "2025 HD Softail Service Manual","page": "3-44"},"figures": [{"file": "/figures/softail-2025/p3-44.jpg", "caption": "Manual page 3-44"}],"tools": [],"parts": [],"torque": [{"fastener": "Seat mounting nut","value": "9\u201315 in-lbs (1\u20131.7 N\u00b7m)"},{"fastener": "Seat thumbscrew","value": "15\u201330 in-lbs (1.7\u20133.4 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove seat mounting screw(s) or thumbscrew(s)."},{"n": 2,"text": "Lift front of seat to disengage from rear mounting pins."},{"n": 3,"text": "Remove seat assembly."},{"n": 4,"text": "Inspect mounting bracket for damage."},{"n": 5,"text": "Position new seat on rear mounting pins."},{"n": 6,"text": "Install and tighten mounting screw(s) or thumbscrew(s)."}]},
{"id": "s25-chassis-45-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Frame Crossmember: Remove and Install","summary": "Remove and install the frame crossmember assembly.","difficulty": "Medium","timeMinutes": 45,"source": {"manual": "2025 HD Softail Service Manual","page": "3-45"},"figures": [{"file": "/figures/softail-2025/p3-45.jpg", "caption": "Manual page 3-45"}],"tools": [],"parts": [],"torque": [{"fastener": "Frame crossmember mounting screws","value": "17\u201320 ft-lbs (23.1\u201327.1 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove mounting screw(s)."},{"n": 2,"text": "Remove frame crossmember assembly."},{"n": 3,"text": "Inspect for cracks or damage."},{"n": 4,"text": "Position new frame crossmember on frame."},{"n": 5,"text": "Install and tighten mounting screw(s)."}]},
{"id": "s25-chassis-46-remove-install-standard","bikeIds": ["softail-2025"],"system": "bodywork","title": "Saddlebags: Remove and Install (Standard)","summary": "Remove and install the standard saddlebag assembly.","difficulty": "Medium","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-46"},"figures": [{"file": "/figures/softail-2025/p3-46.jpg", "caption": "Manual page 3-46"}],"tools": [],"parts": [],"torque": [{"fastener": "Saddlebag mounting screw","value": "21\u201327 ft-lbs (29\u201337 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove mounting screw(s) securing saddlebags to frame."},{"n": 2,"text": "Carefully remove saddlebag assembly."},{"n": 3,"text": "Inspect hinges and mounting bracket for damage."},{"n": 4,"text": "Position new saddlebag assembly on frame."},{"n": 5,"text": "Install and tighten mounting screw(s)."}]},
{"id": "s25-chassis-46-remove-install-quick","bikeIds": ["softail-2025"],"system": "bodywork","title": "Saddlebags: Remove and Install (Quick Disconnect)","summary": "Remove and install the quick-disconnect saddlebag assembly.","difficulty": "Medium","timeMinutes": 30,"source": {"manual": "2025 HD Softail Service Manual","page": "3-46"},"figures": [{"file": "/figures/softail-2025/p3-46.jpg", "caption": "Manual page 3-46"}],"tools": [],"parts": [],"torque": [{"fastener": "Saddlebag mounting bolt","value": "21\u201327 ft-lbs (29\u201337 N\u00b7m)"}],"steps": [{"n": 1,"text": "Remove mounting bolt(s) securing saddlebags to docking bracket."},{"n": 2,"text": "Carefully remove saddlebag assembly from docking rod."},{"n": 3,"text": "Inspect docking rod and connector for damage."},{"n": 4,"text": "Position new saddlebag assembly onto docking rod."},{"n": 5,"text": "Install and tighten mounting bolt(s)."}]},
{"id": "s25-chassis-47-remove-install","bikeIds": ["softail-2025"],"system": "bodywork","title": "Strips / Medallions: Remove and Install","summary": "Remove and install cosmetic strips and medallion decals.","difficulty": "Easy","timeMinutes": 10,"source": {"manual": "2025 HD Softail Service Manual","page": "3-47"},"figures": [{"file": "/figures/softail-2025/p3-47.jpg", "caption": "Manual page 3-47"}],"tools": [],"parts": [],"torque": [],"steps": [{"n": 1,"text": "Heat adhesive backing with heat gun or hair dryer."},{"n": 2,"text": "Carefully peel away old strip or medallion."},{"n": 3,"text": "Remove any remaining adhesive using rubbing alcohol."},{"n": 4,"text": "Clean and dry mounting surface thoroughly."},{"n": 5,"text": "Position new strip or medallion on part."},{"n": 6,"text": "Press firmly to ensure good adhesion."}]},
// --- END SOFTAIL 2025 CHAPTER 3 JOBS ---

// --- BEGIN SOFTAIL 2025 CHAPTER 4 JOBS ---
{ id: 's25-engine-replace-oil-cooler', bikeIds: ['softail-2025'], system: 'engine', title: 'Replace Oil Cooler', summary: 'Remove and install the oil cooler assembly, including hoses and cover.', difficulty: 'Moderate', timeMinutes: 90, source: { manual: '2025 HD Softail Service Manual', page: '4-16' }, figures: [{ file: '/figures/softail-2025/p4-16.jpg', caption: 'Manual page 4-16' }], tools: ['Phillips screwdriver', 'hose clamp pliers'], parts: [{ number: '99642-97', description: 'LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (blue)', qty: 1 }], torque: [{ fastener: 'Oil cooler cover screw', value: '32–42 in-lbs (3.6–4.7 N·m)', note: '4.9 OIL COOLER' }, { fastener: 'Oil cooler screw', value: '84–102 in-lbs (9.5–11.5 N·m)', note: '4.9 OIL COOLER' }], steps: [{ n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' }, { n: 2, text: 'Remove oil cooler cover by removing screw and lifting cover.' }, { n: 3, text: 'Disconnect oil cooler hoses using hose clamp pliers. Discard old clamps.' }, { n: 4, text: 'Remove screw and washer from oil cooler assembly.' }, { n: 5, text: 'Slide oil cooler assembly up to disengage from isolators. Remove assembly.' }, { n: 6, text: 'Inspect isolators for wear or damage. Replace if necessary.' }, { n: 7, text: 'Lubricate new pins with 50/50 mix of isopropyl alcohol and water.' }, { n: 8, text: 'Engage pins on bottom of oil cooler into isolators.' }, { n: 9, text: 'Apply thread locker to screw and install washer and screw. Tighten to 84–102 in-lbs.' }, { n: 10, text: 'Install new clamps onto hose ends and connect hoses to oil cooler.' }, { n: 11, text: 'Tighten clamps close to end of hose, not right behind barb.' }, { n: 12, text: 'Install oil cooler cover and screw. Tighten to 32–42 in-lbs.' }, { n: 13, text: 'Check engine oil level.' }, { n: 14, text: 'Install main fuse.' }] },
{ id: 's25-engine-replace-oil-check-valve', bikeIds: ['softail-2025'], system: 'engine', title: 'Replace Oil Check Valve', summary: 'Remove and install the oil check valve with O-ring seal.', difficulty: 'Easy', timeMinutes: 45, source: { manual: '2025 HD Softail Service Manual', page: '4-18' }, figures: [{ file: '/figures/softail-2025/p4-18.jpg', caption: 'Manual page 4-18' }], tools: ['socket wrench'], parts: [{ number: 'ORM', description: 'Oil check valve O-ring', qty: 1 }], torque: [{ fastener: 'Crankcase oil check valve or plug with O-ring', value: '18–22 ft-lbs (24.4–29.8 N·m)', note: '4.10 OIL CHECK VALVE' }], steps: [{ n: 1, text: 'Remove main fuse.' }, { n: 2, text: 'Disconnect hose from oil check valve using hose clamp pliers.' }, { n: 3, text: 'Remove oil check valve from crankcase.' }, { n: 4, text: 'Discard O-ring.' }, { n: 5, text: 'Lubricate new O-ring with fresh engine oil.' }, { n: 6, text: 'Install oil check valve with new O-ring. Tighten to 18–22 ft-lbs.' }, { n: 7, text: 'Install lower hose with new clamp.' }, { n: 8, text: 'Check engine oil level.' }, { n: 9, text: 'Install main fuse.' }] },
{ id: 's25-engine-replace-oil-coolant-lines', bikeIds: ['softail-2025'], system: 'engine', title: 'Replace Oil Coolant Lines', summary: 'Remove and install oil cooler manifold, head-to-head hose, and oil return line.', difficulty: 'Hard', timeMinutes: 180, source: { manual: '2025 HD Softail Service Manual', page: '4-19' }, figures: [{ file: '/figures/softail-2025/p4-19.jpg', caption: 'Manual page 4-19' }], tools: ['socket wrench', 'Phillips screwdriver', 'hose clamp pliers'], parts: [{ number: '99642-97', description: 'LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (blue)', qty: 1 }], torque: [{ fastener: 'Oil cooler manifold screw', value: '90–120 in-lbs (10.17–13.56 N·m)', note: '4.11 OIL COOLANT LINES' }, { fastener: 'Oil cooler to head fitting', value: '33–37 ft-lbs (44.74–50.17 N·m)', note: '4.11 OIL COOLANT LINES' }, { fastener: 'Oil return line screws', value: '8–10 ft-lbs (11.3–13.5 N·m)', note: '4.11 OIL COOLANT LINES' }], steps: [{ n: 1, text: 'Remove left side cover.' }, { n: 2, text: 'Purge fuel system if removing cylinder head to cylinder head hose.' }, { n: 3, text: 'Remove main fuse.' }, { n: 4, text: 'Remove oil cooler manifold by removing screw and manifold, then remove fitting.' }, { n: 5, text: 'Remove and discard O-rings from fitting.' }, { n: 6, text: 'Remove head-to-head hose clamps and disconnect hose.' }, { n: 7, text: 'Remove oil return line clamps, screws, and hose.' }, { n: 8, text: 'Clean and inspect all components. Remove residual thread locking material.' }, { n: 9, text: 'Install new O-rings on fitting and lubricate with 50/50 isopropyl alcohol and water mix.' }, { n: 10, text: 'Install fitting. Tighten to 33–37 ft-lbs.' }, { n: 11, text: 'Install manifold on fitting with new screw. Tighten to 90–120 in-lbs.' }, { n: 12, text: 'Install inlet hose and new clamp.' }, { n: 13, text: 'Install head-to-head coolant hose with new clamps.' }, { n: 14, text: 'Install oil return line behind rear shifter lever. Install screws. Tighten to 8–10 ft-lbs.' }, { n: 15, text: 'Install return hose with spring clamp and new clamp.' }, { n: 16, text: 'Install main fuse.' }, { n: 17, text: 'Install left side cover.' }, { n: 18, text: 'Check engine oil level.' }] },
{ id: 's25-engine-remove-install-front-mount-lower', bikeIds: ['softail-2025'], system: 'engine', title: 'Remove and Install Lower Front Engine Mount', summary: 'Remove and install the lower front engine mount with pinch bolt and spacer.', difficulty: 'Moderate', timeMinutes: 60, source: { manual: '2025 HD Softail Service Manual', page: '4-22' }, figures: [{ file: '/figures/softail-2025/p4-22.jpg', caption: 'Manual page 4-22' }], tools: ['FAT JACK (HD-45968)', 'socket wrench', 'Allen wrench'], parts: [], torque: [{ fastener: 'Engine mount bolt, front, lower', value: '50–55 ft-lbs (67.8–74.5 N·m)', note: '4.12 FRONT ENGINE MOUNT' }, { fastener: 'Engine mount pinch bolt, front, lower', value: '8–9 ft-lbs (10.2–12.2 N·m)', note: '4.12 FRONT ENGINE MOUNT' }], steps: [{ n: 1, text: 'Support engine using FAT JACK.' }, { n: 2, text: 'Detach right foot control bracket.' }, { n: 3, text: 'Detach rear brake master cylinder bracket.' }, { n: 4, text: 'Loosen pinch bolt.' }, { n: 5, text: 'Remove and discard locknut.' }, { n: 6, text: 'Remove mounting bolt.' }, { n: 7, text: 'Remove spacer.' }, { n: 8, text: 'Install mounting bolt through spacer.' }, { n: 9, text: 'Install new locknut. Tighten to 50–55 ft-lbs.' }, { n: 10, text: 'Verify spacer is installed properly.' }, { n: 11, text: 'Tighten pinch bolt to 8–9 ft-lbs.' }, { n: 12, text: 'Remove jack.' }, { n: 13, text: 'Attach rear brake master cylinder bracket.' }, { n: 14, text: 'Attach right foot control bracket.' }, { n: 15, text: 'Install main fuse.' }] },
{ id: 's25-engine-remove-install-front-mount-upper', bikeIds: ['softail-2025'], system: 'engine', title: 'Remove and Install Upper Front Engine Mount', summary: 'Remove and install the upper front engine mount brackets and fasteners.', difficulty: 'Moderate', timeMinutes: 90, source: { manual: '2025 HD Softail Service Manual', page: '4-22' }, figures: [{ file: '/figures/softail-2025/p4-22.jpg', caption: 'Manual page 4-22' }], tools: ['socket wrench', 'Allen wrench'], parts: [], torque: [{ fastener: 'Engine mount screw, front, upper engine bracket', value: '45–50 ft-lbs (61–67.8 N·m)', note: '4.12 FRONT ENGINE MOUNT' }, { fastener: 'Engine mount screw, front, upper frame bracket', value: '45–50 ft-lbs (61–67.8 N·m)', note: '4.12 FRONT ENGINE MOUNT' }, { fastener: 'Engine mount screw, front, upper frame bracket-to-engine bracket', value: '45–50 ft-lbs (61–67.8 N·m)', note: '4.12 FRONT ENGINE MOUNT' }], steps: [{ n: 1, text: 'Remove frame-to-engine bracket screws.' }, { n: 2, text: 'Remove frame bracket and its screws.' }, { n: 3, text: 'Loosen engine bracket screws.' }, { n: 4, text: 'Remove engine bracket by lifting left side up and pulling to the left.' }, { n: 5, text: 'Install engine bracket and hand tighten screws.' }, { n: 6, text: 'Install frame bracket and hand tighten its screws.' }, { n: 7, text: 'Install frame bracket-to-engine bracket screws and hand tighten.' }, { n: 8, text: 'Tighten engine bracket screws to 45–50 ft-lbs.' }, { n: 9, text: 'Tighten frame bracket screws to 45–50 ft-lbs.' }, { n: 10, text: 'Tighten frame bracket-to-engine bracket screws to 45–50 ft-lbs.' }, { n: 11, text: 'Install main fuse.' }] },
{ id: 's25-engine-remove-install-left-mount', bikeIds: ['softail-2025'], system: 'engine', title: 'Remove and Install Left Side Engine Mount', summary: 'Remove and install the left side engine mount bracket with fasteners to frame and cylinder head.', difficulty: 'Moderate', timeMinutes: 75, source: { manual: '2025 HD Softail Service Manual', page: '4-24' }, figures: [{ file: '/figures/softail-2025/p4-24.jpg', caption: 'Manual page 4-24' }], tools: ['socket wrench', 'Allen wrench'], parts: [], torque: [{ fastener: 'Engine mount screw, left side, bracket-to-frame', value: '45–50 ft-lbs (61–67.8 N·m)', note: '4.13 LEFT SIDE ENGINE MOUNT' }, { fastener: 'Engine mount screw, left side, bracket-to-head', value: '28–33 ft-lbs (38–44.7 N·m)', note: '4.13 LEFT SIDE ENGINE MOUNT' }], steps: [{ n: 1, text: 'Purge fuel system.' }, { n: 2, text: 'Remove left side cover.' }, { n: 3, text: 'Remove main fuse.' }, { n: 4, text: 'Remove seat.' }, { n: 5, text: 'Remove fuel tank.' }, { n: 6, text: 'Disconnect spark plug cables.' }, { n: 7, text: 'Remove ignition coil.' }, { n: 8, text: 'Remove clip from bracket.' }, { n: 9, text: 'Remove bracket screws.' }, { n: 10, text: 'Remove bracket.' }, { n: 11, text: 'Remove knock sensor.' }, { n: 12, text: 'Install knock sensor.' }, { n: 13, text: 'Install bracket and hand tighten screws.' }, { n: 14, text: 'Tighten bracket-to-head screws to 28–33 ft-lbs.' }, { n: 15, text: 'Tighten bracket-to-frame screws to 45–50 ft-lbs.' }, { n: 16, text: 'Install clip.' }, { n: 17, text: 'Install ignition coil.' }, { n: 18, text: 'Connect spark plug cables.' }, { n: 19, text: 'Install fuel tank.' }, { n: 20, text: 'Install seat.' }, { n: 21, text: 'Install main fuse.' }, { n: 22, text: 'Install left side cover.' }] },
{ id: 's25-engine-replace-upper-rocker-covers', bikeIds: ['softail-2025'], system: 'engine', title: 'Replace Upper Rocker Covers', summary: 'Remove and install upper rocker cover with gasket and apply thread locker to fasteners.', difficulty: 'Moderate', timeMinutes: 120, source: { manual: '2025 HD Softail Service Manual', page: '4-25' }, figures: [{ file: '/figures/softail-2025/p4-25.jpg', caption: 'Manual page 4-25' }], tools: ['Phillips screwdriver', 'socket wrench', 'compressed air'], parts: [], torque: [{ fastener: 'Lower rocker cover stud', value: '90–120 in-lbs (10.2–13.6 N·m)', note: '4.14 UPPER ROCKER COVERS' }, { fastener: 'Upper rocker cover screws', value: '120–140 in-lbs (13.6–15.8 N·m)', note: '4.14 UPPER ROCKER COVERS' }], steps: [{ n: 1, text: 'Use low-pressure compressed air to clean exterior surfaces.' }, { n: 2, text: 'Remove main fuse.' }, { n: 3, text: 'Remove seat.' }, { n: 4, text: 'Remove fuel tank.' }, { n: 5, text: 'Remove air cleaner.' }, { n: 6, text: 'Remove air cleaner backplate assembly.' }, { n: 7, text: 'Remove spark plug cables.' }, { n: 8, text: 'Disconnect engine wire harness caddy.' }, { n: 9, text: 'Remove rocker cover screws.' }, { n: 10, text: 'Remove rocker cover and gasket. Discard gasket.' }, { n: 11, text: 'Clean threadlocker from all screws and threaded holes.' }, { n: 12, text: 'Verify all threaded holes are free from oil and threadlocker.' }, { n: 13, text: 'Install new gasket.' }, { n: 14, text: 'Verify stud torque.' }, { n: 15, text: 'Apply LOCTITE 243 to screw threads.' }, { n: 16, text: 'Start all screws.' }, { n: 17, text: 'Hold hex on stud when tightening center screw.' }, { n: 18, text: 'Tighten screws in sequence. Final torque 120–140 in-lbs.' }, { n: 19, text: 'Reattach engine harness and caddy.' }, { n: 20, text: 'Install spark plug cables.' }, { n: 21, text: 'Install air cleaner backplate assembly.' }, { n: 22, text: 'Install air cleaner.' }, { n: 23, text: 'Install fuel tank.' }, { n: 24, text: 'Install seat.' }, { n: 25, text: 'Install main fuse.' }] },
{ id: 's25-engine-replace-breather', bikeIds: ['softail-2025'], system: 'engine', title: 'Replace Breather Assembly', summary: 'Remove and install breather cover, baffle, and hose with gasket.', difficulty: 'Moderate', timeMinutes: 90, source: { manual: '2025 HD Softail Service Manual', page: '4-27' }, figures: [{ file: '/figures/softail-2025/p4-27.jpg', caption: 'Manual page 4-27' }], tools: ['Phillips screwdriver', 'compressed air'], parts: [], torque: [{ fastener: 'Breather cover screws', value: '11–13 ft-lbs (14.91–17.63 N·m)', note: '4.15 BREATHER' }], steps: [{ n: 1, text: 'Use low-pressure compressed air to clean exterior surfaces.' }, { n: 2, text: 'Remove main fuse.' }, { n: 3, text: 'Remove right side cover.' }, { n: 4, text: 'Remove exhaust system.' }, { n: 5, text: 'Remove breather hose from breather and air cleaner backplate.' }, { n: 6, text: 'Remove breather cover screws.' }, { n: 7, text: 'Remove breather cover.' }, { n: 8, text: 'Remove and discard gasket and vent hose from breather cover.' }, { n: 9, text: 'Remove and clean breather baffle.' }, { n: 10, text: 'Install breather baffle in housing.' }, { n: 11, text: 'Clean breather cover gasket groove.' }, { n: 12, text: 'Install vent hose in breather cover.' }, { n: 13, text: 'Install gasket in cover groove with nub aligned to opening.' }, { n: 14, text: 'Install breather cover with vent hose facing engine.' }, { n: 15, text: 'Install and tighten cover screws to 11–13 ft-lbs.' }, { n: 16, text: 'Route breather hose between spark plug wires.' }, { n: 17, text: 'Connect breather hose to breather and air cleaner.' }, { n: 18, text: 'Verify breather hose alignment marks are aligned.' }, { n: 19, text: 'Install exhaust system.' }, { n: 20, text: 'Install right side cover.' }, { n: 21, text: 'Install main fuse.' }] },
{ id: 's25-engine-replace-lower-rocker-covers', bikeIds: ['softail-2025'], system: 'engine', title: 'Replace Lower Rocker Covers', summary: 'Remove and install lower rocker cover with gasket and thread locker.', difficulty: 'Moderate', timeMinutes: 100, source: { manual: '2025 HD Softail Service Manual', page: '4-30' }, figures: [{ file: '/figures/softail-2025/p4-30.jpg', caption: 'Manual page 4-30' }], tools: ['Phillips screwdriver', 'socket wrench', 'compressed air'], parts: [], torque: [{ fastener: 'Rocker cover, lower, screws', value: '90–120 in-lbs (10.2–13.6 N·m)', note: '4.16 LOWER ROCKER COVERS' }], steps: [{ n: 1, text: 'Use low-pressure compressed air to clean exterior surfaces.' }, { n: 2, text: 'Remove main fuse.' }, { n: 3, text: 'Remove seat.' }, { n: 4, text: 'Remove fuel tank.' }, { n: 5, text: 'Remove spark plug cables.' }, { n: 6, text: 'Remove air cleaner.' }, { n: 7, text: 'Remove air cleaner assembly.' }, { n: 8, text: 'Disconnect ACR connectors.' }, { n: 9, text: 'Remove spark plugs.' }, { n: 10, text: 'Remove upper rocker covers.' }, { n: 11, text: 'Remove lower rocker cover screws.' }, { n: 12, text: 'Remove lower rocker cover and discard gasket.' }, { n: 13, text: 'Clean screws and threaded holes.' }, { n: 14, text: 'Cover exposed internal engine area.' }, { n: 15, text: 'Install new gasket.' }, { n: 16, text: 'Apply LOCTITE 243 to screw threads.' }, { n: 17, text: 'Start screws and stud.' }, { n: 18, text: 'Tighten screws in sequence. Final torque 90–120 in-lbs.' }, { n: 19, text: 'Install upper rocker covers.' }, { n: 20, text: 'Install spark plugs.' }, { n: 21, text: 'Connect ACR connectors.' }, { n: 22, text: 'Install air cleaner assembly.' }, { n: 23, text: 'Install air cleaner.' }, { n: 24, text: 'Install spark plug cables.' }, { n: 25, text: 'Install fuel tank.' }, { n: 26, text: 'Install seat.' }, { n: 27, text: 'Install main fuse.' }] },
{ id: 's25-engine-install-rocker-arms', bikeIds: ['softail-2025'], system: 'engine', title: 'Install Rocker Arms', summary: 'Install rocker arms and rocker shaft with proper torque sequence and valve lash adjustment.', difficulty: 'Hard', timeMinutes: 150, source: { manual: '2025 HD Softail Service Manual', page: '4-31' }, figures: [{ file: '/figures/softail-2025/p4-31.jpg', caption: 'Manual page 4-31' }], tools: ['socket wrench', 'Allen wrench', 'feeler gauge'], parts: [], torque: [{ fastener: 'Rocker shaft screw, step 1', value: '59–83 in-lbs (6.7–9.4 N·m)', note: '4.17 ROCKER ARMS' }, { fastener: 'Rocker shaft screw, step 2', value: '23–27 ft-lbs (31.2–36.6 N·m)', note: '4.17 ROCKER ARMS' }], steps: [{ n: 1, text: 'Set piston at approximate BDC of power stroke.' }, { n: 2, text: 'Verify lifters are on base circle of camshaft lobe.' }, { n: 3, text: 'Install rocker arm and rocker shaft.' }, { n: 4, text: 'Place rocker assembly on rocker towers.' }, { n: 5, text: 'Verify rocker shaft is seated in both towers.' }, { n: 6, text: 'Install screws and alternately tighten to pull shaft down evenly.' }, { n: 7, text: 'First torque to 59–83 in-lbs.' }, { n: 8, text: 'Final torque to 23–27 ft-lbs.' }, { n: 9, text: 'Repeat with remaining rocker arms.' }, { n: 10, text: 'Allow lifters to bleed down before rotating crankshaft.' }, { n: 11, text: 'Check valve lash by positioning crankshaft at TDC of compression stroke.' }, { n: 12, text: 'Slide feeler gauge between each valve stem and rocker arm.' }, { n: 13, text: 'Maximum allowable lash is 0.008 in (0.2 mm).' }, { n: 14, text: 'If lash exceeds maximum, disassemble and repair cylinder head assembly.' }] },
{ id: 's25-engine-service-pushrods-lifters', bikeIds: ['softail-2025'], system: 'engine', title: 'Service Pushrods, Lifters and Covers', summary: 'Remove, inspect, and install pushrods, hydraulic lifters, and pushrod covers with proper assembly techniques.', difficulty: 'Hard', timeMinutes: 240, source: { manual: '2025 HD Softail Service Manual', page: '4-33' }, figures: [{ file: '/figures/softail-2025/p4-33.jpg', caption: 'Manual page 4-33' }], tools: ['socket wrench', 'heat gun', 'special tool 94086-09', 'non-volatile solvent', 'compressed air'], parts: [{ number: '11300002', description: 'SCREAMIN EAGLE ASSEMBLY LUBE', qty: 1 }], torque: [{ fastener: 'Lifter anti-rotation device screw', value: '90–120 in-lbs (10.2–13.6 N·m)', note: '4.18 PUSHRODS, LIFTERS AND COVERS' }, { fastener: 'Lifter cover screws', value: '11–13 ft-lbs (14.9–17.6 N·m)', note: '4.18 PUSHRODS, LIFTERS AND COVERS' }], steps: [{ n: 1, text: 'Use low-pressure compressed air to clean exterior surfaces.' }, { n: 2, text: 'Remove upper rocker covers.' }, { n: 3, text: 'Remove rocker arms.' }, { n: 4, text: 'Remove pushrods and mark location.' }, { n: 5, text: 'Remove spring cap retainer using special tool.' }, { n: 6, text: 'Remove pushrod covers.' }, { n: 7, text: 'Disassemble pushrod cover assemblies.' }, { n: 8, text: 'Discard O-rings.' }, { n: 9, text: 'Heat lifter anti-rotation device screw with heat gun.' }, { n: 10, text: 'Remove lifter cover screws and gasket.' }, { n: 11, text: 'Remove lifter anti-rotation device screw.' }, { n: 12, text: 'Remove lifters and place in clean plastic bags.' }, { n: 13, text: 'Clean all parts except lifters in non-volatile solvent.' }, { n: 14, text: 'Dry parts with low-pressure compressed air.' }, { n: 15, text: 'Verify O-ring seats and surfaces are clean.' }, { n: 16, text: 'Measure lifter outer diameter and bore clearance.' }, { n: 17, text: 'Check lifter roller end clearance. Replace if exceeds 0.022 in.' }, { n: 18, text: 'Soak lifters in clean engine oil.' }, { n: 19, text: 'Examine lifter rollers for damage, flat spots, scuff marks or pitting.' }, { n: 20, text: 'Apply clean engine oil to new O-rings on pushrod covers.' }, { n: 21, text: 'Install upper pushrod cover with O-ring.' }, { n: 22, text: 'Slide spring cap and spring onto cover body.' }, { n: 23, text: 'Install middle O-ring into groove on lower pushrod cover.' }, { n: 24, text: 'Slide straight end of upper cover into lower pushrod cover.' }, { n: 25, text: 'Install lower O-ring on lower pushrod cover.' }, { n: 26, text: 'Apply assembly lube to lifter outer surface and cam lobes.' }, { n: 27, text: 'Rotate crankshaft until both cam lobes are visible.' }, { n: 28, text: 'Carefully install lifters in bores without dropping onto lobes.' }, { n: 29, text: 'Install lifter anti-rotation device.' }, { n: 30, text: 'Install screw. Torque 90–120 in-lbs.' }, { n: 31, text: 'Install lifter cover with new gasket and screws. Torque 11–13 ft-lbs.' }, { n: 32, text: 'Install pushrod covers with new O-rings.' }, { n: 33, text: 'Compress and fit pushrod cover into lifter cover bore.' }, { n: 34, text: 'Extend assembly into cylinder head bore.' }, { n: 35, text: 'Verify ends fit snugly into cylinder head and lifter cover bores.' }, { n: 36, text: 'Install spring cap retainers using special tool.' }, { n: 37, text: 'Apply assembly lube to pushrod ends.' }, { n: 38, text: 'Install pushrods in original locations.' }, { n: 39, text: 'Install rocker arms.' }, { n: 40, text: 'Install upper rocker covers.' }] },
{ id: 's25-engine-replace-cylinder-heads', bikeIds: ['softail-2025'], system: 'engine', title: 'Replace Cylinder Heads', summary: 'Remove and install cylinder heads with new gaskets, fasteners, and multi-step torque sequence.', difficulty: 'Hard', timeMinutes: 300, source: { manual: '2025 HD Softail Service Manual', page: '4-37' }, figures: [{ file: '/figures/softail-2025/p4-37.jpg', caption: 'Manual page 4-37' }], tools: ['socket wrench', 'torque wrench', 'special fixture B-49312'], parts: [{ number: 'HD-34736-B', description: 'Valve Spring Compressor', qty: 1 }], torque: [{ fastener: 'Cylinder head nut torque step 1', value: '20–30 ft-lbs (27.1–40.7 N·m)', note: '4.19 CYLINDER HEADS' }, { fastener: 'Cylinder head nut torque step 2', value: '-360° (-360° loosen one turn)', note: '4.19 CYLINDER HEADS' }, { fastener: 'Cylinder head nut torque step 3', value: '9–11 ft-lbs (12.2–14.9 N·m)', note: '4.19 CYLINDER HEADS' }, { fastener: 'Cylinder head nut torque step 4', value: '18–20 ft-lbs (24.4–27.1 N·m)', note: '4.19 CYLINDER HEADS' }, { fastener: 'Cylinder head nut torque step 5', value: '90° (90° tighten additional)', note: '4.19 CYLINDER HEADS' }], steps: [{ n: 1, text: 'Use low-pressure compressed air to clean exterior surfaces.' }, { n: 2, text: 'Remove seat, fuel tank, air cleaner, air cleaner backplate assembly.' }, { n: 3, text: 'Remove spark plug cables and ignition coil.' }, { n: 4, text: 'Disconnect ACR connectors and breather hose.' }, { n: 5, text: 'Front cylinder head: Disconnect ET sensor.' }, { n: 6, text: 'Remove induction module.' }, { n: 7, text: 'Remove head to head coolant hose and disconnect head hoses.' }, { n: 8, text: 'Remove upper front engine mount.' }, { n: 9, text: 'Remove oil cooler cover and upper screw.' }, { n: 10, text: 'Remove upper and lower rocker covers.' }, { n: 11, text: 'Remove rocker arms.' }, { n: 12, text: 'Remove pushrods and pushrod covers.' }, { n: 13, text: 'Remove right rider footboard or mid foot control if equipped.' }, { n: 14, text: 'Remove exhaust system.' }, { n: 15, text: 'Loosen cylinder head nuts in sequence shown.' }, { n: 16, text: 'Discard head nuts.' }, { n: 17, text: 'Lift cylinder head from dowel pins.' }, { n: 18, text: 'Discard gasket.' }, { n: 19, text: 'Remove old gasket material without causing scratches.' }, { n: 20, text: 'Remove all carbon deposits from combustion chamber.' }, { n: 21, text: 'Soak stubborn deposits in carbon dissolving agent.' }, { n: 22, text: 'Thoroughly clean cylinder head, springs, keepers, and valves.' }, { n: 23, text: 'Wash in hot soapy water.' }, { n: 24, text: 'Flush all passages to remove debris.' }, { n: 25, text: 'Dry parts with low-pressure compressed air.' }, { n: 26, text: 'Clean all gasket sealing surfaces.' }, { n: 27, text: 'Check head flatness with feeler gauge.' }, { n: 28, text: 'Verify all passages are clean and open.' }, { n: 29, text: 'Install new gasket with tab placed as shown.' }, { n: 30, text: 'Install cylinder head on dowel pins.' }, { n: 31, text: 'Install new cylinder head flange nuts.' }, { n: 32, text: 'Apply fresh engine oil to nut flanges and threaded portion.' }, { n: 33, text: 'Tighten head nuts in five stages following sequence.' }, { n: 34, text: 'Stage 1: Tighten to 20–30 ft-lbs.' }, { n: 35, text: 'Stage 2: Loosen one full turn.' }, { n: 36, text: 'Stage 3: Tighten to 9–11 ft-lbs.' }, { n: 37, text: 'Stage 4: Tighten to 18–20 ft-lbs.' }, { n: 38, text: 'Stage 5: Tighten additional 90°.' }, { n: 39, text: 'Install pushrods and pushrod covers.' }, { n: 40, text: 'Install rocker arms.' }, { n: 41, text: 'Install lower rocker covers.' }, { n: 42, text: 'Install upper rocker covers.' }, { n: 43, text: 'Install upper front engine mount.' }, { n: 44, text: 'Connect coolant hoses and install head to head hose.' }, { n: 45, text: 'Install induction module.' }, { n: 46, text: 'Front cylinder head: Connect ET sensor.' }, { n: 47, text: 'Install air cleaner assembly.' }, { n: 48, text: 'Install breather hose.' }, { n: 49, text: 'Install ignition coil and knock sensor.' }, { n: 50, text: 'Connect spark plug cables.' }, { n: 51, text: 'Connect ACR connectors.' }, { n: 52, text: 'Install exhaust system.' }, { n: 53, text: 'Install right side components and fuel tank.' }, { n: 54, text: 'Install main fuse and seat.' }] },
{ id: 's25-engine-replace-cylinders', bikeIds: ['softail-2025'], system: 'engine', title: 'Replace Cylinders', summary: 'Remove and install cylinders with rings compressed using special tools and proper gasket installation.', difficulty: 'Hard', timeMinutes: 240, source: { manual: '2025 HD Softail Service Manual', page: '4-43' }, figures: [{ file: '/figures/softail-2025/p4-43.jpg', caption: 'Manual page 4-43' }], tools: ['socket wrench', 'piston ring compressor HD-96333-51', 'piston support plate HD-52185', 'cylinder hold-down nuts HD-52020', 'deglazing tool'], parts: [], torque: [], steps: [{ n: 1, text: 'Prepare for cylinder removal by raising cylinder and placing clean shop towels under piston.' }, { n: 2, text: 'Hold piston to prevent touching studs.' }, { n: 3, text: 'Lift cylinder clear of piston.' }, { n: 4, text: 'Slide protective tubing over each cylinder stud.' }, { n: 5, text: 'Discard gasket.' }, { n: 6, text: 'Clean all gasket material from cylinder.' }, { n: 7, text: 'Clean parts in non-volatile cleaning solution.' }, { n: 8, text: 'Dry with low-pressure compressed air.' }, { n: 9, text: 'Inspect cylinder bore for defects or damage.' }, { n: 10, text: 'Light scratches less than piston travel are normal.' }, { n: 11, text: 'Deglaze cylinders with 240 grit flexible ball-type tool.' }, { n: 12, text: 'Create 60 degree crosshatch pattern.' }, { n: 13, text: 'Wash cylinder bore with liquid dishwashing soap and hot water.' }, { n: 14, text: 'Continue cleaning until cloth shows no dirt or debris.' }, { n: 15, text: 'Hot rinse and dry with moisture-free compressed air.' }, { n: 16, text: 'Apply thin film of clean engine oil with white paper towel.' }, { n: 17, text: 'Repeat wiping until new towel remains white.' }, { n: 18, text: 'Install new base gasket to crankcase.' }, { n: 19, text: 'Verify piston ring alignment.' }, { n: 20, text: 'Apply clean engine oil to piston, rings, and bore.' }, { n: 21, text: 'Rotate crankshaft until piston is at TDC.' }, { n: 22, text: 'Remove protective covers from cylinder studs.' }, { n: 23, text: 'Install support plate under piston.' }, { n: 24, text: 'Rotate crankshaft until piston is firmly seated on support plate.' }, { n: 25, text: 'Compress piston rings with piston ring compressor.' }, { n: 26, text: 'Align top of compressor with center of piston ring land.' }, { n: 27, text: 'Compress piston rings.' }, { n: 28, text: 'Align cooling fin indents to right side of engine.' }, { n: 29, text: 'Slide cylinder over studs and piston until it rests on ring compressor.' }, { n: 30, text: 'Push down on cylinder with sharp, quick motion using both palms.' }, { n: 31, text: 'Remove pliers and piston support plate.' }, { n: 32, text: 'Remove shop towels from crankcase bore.' }, { n: 33, text: 'Push down on cylinder until fully seated in crankcase bore.' }, { n: 34, text: 'Install hold-down nuts onto cylinder studs.' }, { n: 35, text: 'Install cylinder heads.' }, { n: 36, text: 'Install pushrods and pushrod covers.' }, { n: 37, text: 'Install rocker arms.' }, { n: 38, text: 'Install lower rocker covers.' }, { n: 39, text: 'Install upper rocker covers.' }, { n: 40, text: 'Install upper front engine mount.' }, { n: 41, text: 'Connect coolant hoses and install head-to-head hose.' }, { n: 42, text: 'Install induction module and air cleaner assembly.' }, { n: 43, text: 'Install breather hose and ignition components.' }, { n: 44, text: 'Connect spark plug cables, ACR, and other electrical connectors.' }, { n: 45, text: 'Install exhaust system and remaining components.' }] },
{ id: 's25-engine-replace-pistons', bikeIds: ['softail-2025'], system: 'engine', title: 'Replace Pistons', summary: 'Remove and install pistons with piston pins and retaining rings using proper assembly techniques.', difficulty: 'Hard', timeMinutes: 180, source: { manual: '2025 HD Softail Service Manual', page: '4-47' }, figures: [{ file: '/figures/softail-2025/p4-47.jpg', caption: 'Manual page 4-47' }], tools: ['piston pin extractor HD-42320-D', 'piston pin clip remover/installer HD-51069', 'nose adapter HD-51069-17', 'piston pin retaining ring installer HD-51069-2'], parts: [{ number: '11300002', description: 'SCREAMIN EAGLE ASSEMBLY LUBE', qty: 1 }], torque: [], steps: [{ n: 1, text: 'Place clean shop towels over crankcase bore to prevent retaining ring loss.' }, { n: 2, text: 'Remove and discard one piston pin retaining ring using special tools.' }, { n: 3, text: 'Remove piston.' }, { n: 4, text: 'Remove piston pin using piston pin extractor.' }, { n: 5, text: 'Wrap connecting rod to prevent damage.' }, { n: 6, text: 'Mark piston location on piston underside.' }, { n: 7, text: 'Remove piston rings.' }, { n: 8, text: 'Clean all parts in non-volatile cleaning solution.' }, { n: 9, text: 'Dry parts with low-pressure compressed air.' }, { n: 10, text: 'Measure piston ring side clearance and end gap.' }, { n: 11, text: 'Verify all piston rings rotate freely.' }, { n: 12, text: 'Install one new piston pin retaining ring.' }, { n: 13, text: 'Verify retaining ring end gap is opposite from opening.' }, { n: 14, text: 'Verify retaining ring is fully seated in groove.' }, { n: 15, text: 'Apply assembly lube to piston pin and bores.' }, { n: 16, text: 'Remove protective wrap from connecting rod.' }, { n: 17, text: 'Place piston over rod end with arrow pointing toward front.' }, { n: 18, text: 'Insert piston pin through piston and rod until contacting retaining ring.' }, { n: 19, text: 'Install new retaining ring using special tools.' }, { n: 20, text: 'Verify retaining ring end gap is opposite from opening.' }, { n: 21, text: 'Verify retaining ring is fully seated in groove.' }, { n: 22, text: 'Gently tap retaining ring from outside using suitable drift.' }, { n: 23, text: 'Do not damage clip or piston.' }, { n: 24, text: 'Install cylinders.' }, { n: 25, text: 'Install cylinder heads.' }, { n: 26, text: 'Install complete top end assembly.' }] },
{ id: 's25-engine-service-cam-components', bikeIds: ['softail-2025'], system: 'engine', title: 'Service Cam Compartment and Components', summary: 'Remove, inspect, and install camshaft, cam chain tensioner, and related components.', difficulty: 'Hard', timeMinutes: 300, source: { manual: '2025 HD Softail Service Manual', page: '4-53' }, figures: [{ file: '/figures/softail-2025/p4-53.jpg', caption: 'Manual page 4-53' }], tools: ['socket wrench', 'torque wrench', 'crankshaft locking tool HD-52252', 'special alignment tools'], parts: [{ number: '262', description: 'LOCTITE 262 HIGH STRENGTH THREADLOCKER', qty: 1 }], torque: [{ fastener: 'Cam chain tensioner fasteners', value: '90–120 in-lbs (10.2–13.6 N·m)', note: '4.22 CAM COMPARTMENT' }, { fastener: 'Camshaft cover screws', value: '90–120 in-lbs (10.2–13.6 N·m)', note: '4.22 CAM COMPARTMENT' }, { fastener: 'Camshaft sprocket screw, 1st torque', value: '15.0 ft-lbs (20.3 N·m)', note: '4.22 CAM COMPARTMENT' }, { fastener: 'Camshaft sprocket screw, alignment check', value: '15 ft-lbs (20.3 N·m)', note: '4.22 CAM COMPARTMENT' }, { fastener: 'Camshaft sprocket screw, final torque', value: '40 ft-lbs (54 N·m)', note: '4.22 CAM COMPARTMENT' }, { fastener: 'Cam support plate screws', value: '90–120 in-lbs (10.2–13.6 N·m)', note: '4.22 CAM COMPARTMENT' }, { fastener: 'Crankshaft sprocket screw, 1st torque', value: '15.0 ft-lbs (20.3 N·m)', note: '4.22 CAM COMPARTMENT' }, { fastener: 'Crankshaft sprocket screw, alignment check', value: '15 ft-lbs (20.3 N·m)', note: '4.22 CAM COMPARTMENT' }, { fastener: 'Crankshaft sprocket screw, final torque', value: '24 ft-lbs (32.5 N·m)', note: '4.22 CAM COMPARTMENT' }, { fastener: 'Oil pump screws, 1st torque', value: '12–60 in-lbs (1.4–6.8 N·m)', note: '4.22 CAM COMPARTMENT' }, { fastener: 'Oil pump screws (1-4), final torque', value: '90–120 in-lbs (10.2–13.6 N·m)', note: '4.22 CAM COMPARTMENT' }], steps: [{ n: 1, text: 'Remove all external engine covers and related components.' }, { n: 2, text: 'Remove rocker arms and pushrods.' }, { n: 3, text: 'Remove cam compartment cover and gasket.' }, { n: 4, text: 'Remove camshaft sprocket retaining bolt.' }, { n: 5, text: 'Remove cam chain and sprockets.' }, { n: 6, text: 'Remove camshaft using proper support and removal techniques.' }, { n: 7, text: 'Remove cam chain tensioner fasteners.' }, { n: 8, text: 'Remove cam chain tensioner.' }, { n: 9, text: 'Remove cam support plate screws.' }, { n: 10, text: 'Remove cam support plate.' }, { n: 11, text: 'Remove oil pump screws.' }, { n: 12, text: 'Remove oil pump assembly.' }, { n: 13, text: 'Clean all components thoroughly.' }, { n: 14, text: 'Inspect camshaft lobes for excessive wear.' }, { n: 15, text: 'Inspect cam chain and sprockets for wear.' }, { n: 16, text: 'Verify all oil holes are clean and open.' }, { n: 17, text: 'Install oil pump with initial torque.' }, { n: 18, text: 'Final torque oil pump screws.' }, { n: 19, text: 'Install cam support plate.' }, { n: 20, text: 'Install cam chain tensioner.' }, { n: 21, text: 'Install camshaft with proper bearing support.' }, { n: 22, text: 'Install cam chain and sprockets.' }, { n: 23, text: 'Apply LOCTITE 262 to crankshaft sprocket screw.' }, { n: 24, text: 'Install crankshaft sprocket screw.' }, { n: 25, text: 'Torque screw to 15.0 ft-lbs (1st stage).' }, { n: 26, text: 'Verify alignment specification and repeat check at 15 ft-lbs.' }, { n: 27, text: 'Final torque crankshaft sprocket screw to 24 ft-lbs.' }, { n: 28, text: 'Apply LOCTITE 262 to camshaft sprocket screw.' }, { n: 29, text: 'Install camshaft sprocket screw.' }, { n: 30, text: 'Torque screw to 15.0 ft-lbs (1st stage).' }, { n: 31, text: 'Verify alignment specification and repeat check at 15 ft-lbs.' }, { n: 32, text: 'Final torque camshaft sprocket screw to 40 ft-lbs.' }, { n: 33, text: 'Install camshaft cover with new gasket.' }, { n: 34, text: 'Torque cover screws to 90–120 in-lbs.' }, { n: 35, text: 'Install pushrods and rocker arms.' }, { n: 36, text: 'Install all external engine covers and related components.' }] },
{ id: 's25-engine-service-oil-pump', bikeIds: ['softail-2025'], system: 'engine', title: 'Service Oil Pump', summary: 'Remove, inspect, and reinstall oil pump with gasket and fasteners.', difficulty: 'Moderate', timeMinutes: 120, source: { manual: '2025 HD Softail Service Manual', page: '4-60' }, figures: [{ file: '/figures/softail-2025/p4-60.jpg', caption: 'Manual page 4-60' }], tools: ['socket wrench', 'non-volatile solvent', 'compressed air'], parts: [], torque: [{ fastener: 'Oil pump screws, 1st torque', value: '12–60 in-lbs (1.4–6.8 N·m)', note: '4.23 OIL PUMP' }, { fastener: 'Oil pump screws (1-4), final torque', value: '90–120 in-lbs (10.2–13.6 N·m)', note: '4.23 OIL PUMP' }], steps: [{ n: 1, text: 'Remove oil pump fasteners.' }, { n: 2, text: 'Remove oil pump assembly.' }, { n: 3, text: 'Discard gasket.' }, { n: 4, text: 'Clean oil pump in non-volatile solvent.' }, { n: 5, text: 'Dry with low-pressure compressed air.' }, { n: 6, text: 'Inspect gerotor teeth for wear or damage.' }, { n: 7, text: 'Measure rotor tip clearance.' }, { n: 8, text: 'Measure rotor thickness variation.' }, { n: 9, text: 'Replace oil pump if wear exceeds service limits.' }, { n: 10, text: 'Install new gasket on oil pump.' }, { n: 11, text: 'Position oil pump in correct location.' }, { n: 12, text: 'Install oil pump fasteners and tighten to 12–60 in-lbs.' }, { n: 13, text: 'Final torque fasteners 1-4 to 90–120 in-lbs.' }] },
{ id: 's25-engine-replace-engine', bikeIds: ['softail-2025'], system: 'engine', title: 'Replace Engine', summary: 'Remove and install complete engine assembly with all fasteners and connections.', difficulty: 'Hard', timeMinutes: 480, source: { manual: '2025 HD Softail Service Manual', page: '4-63' }, figures: [{ file: '/figures/softail-2025/p4-63.jpg', caption: 'Manual page 4-63' }], tools: ['socket wrench', 'torque wrench', 'transmission jack', 'engine lift device'], parts: [], torque: [], steps: [{ n: 1, text: 'Remove main fuse.' }, { n: 2, text: 'Disconnect all electrical connectors from engine.' }, { n: 3, text: 'Disconnect all fuel lines.' }, { n: 4, text: 'Disconnect all coolant lines.' }, { n: 5, text: 'Remove exhaust system.' }, { n: 6, text: 'Remove primary chaincase cover.' }, { n: 7, text: 'Remove transmission.' }, { n: 8, text: 'Support engine with transmission jack.' }, { n: 9, text: 'Remove engine mounting bolts.' }, { n: 10, text: 'Carefully remove engine from frame using lift device.' }, { n: 11, text: 'Place new engine on transmission jack.' }, { n: 12, text: 'Carefully position engine in frame.' }, { n: 13, text: 'Install engine mounting bolts.' }, { n: 14, text: 'Torque all engine mounting bolts per specification.' }, { n: 15, text: 'Install transmission.' }, { n: 16, text: 'Install primary chaincase cover.' }, { n: 17, text: 'Connect coolant lines.' }, { n: 18, text: 'Connect fuel lines.' }, { n: 19, text: 'Connect all electrical connectors.' }, { n: 20, text: 'Install exhaust system.' }, { n: 21, text: 'Fill coolant and oil.' }, { n: 22, text: 'Install main fuse.' }, { n: 23, text: 'Start engine and check for leaks.' }] },
{ id: 's25-engine-split-disassemble-crankcase', bikeIds: ['softail-2025'], system: 'engine', title: 'Disassemble Crankcase', summary: 'Remove crankcase fasteners and separate crankcase halves for service of internal components.', difficulty: 'Hard', timeMinutes: 300, source: { manual: '2025 HD Softail Service Manual', page: '4-66' }, figures: [{ file: '/figures/softail-2025/p4-66.jpg', caption: 'Manual page 4-66' }], tools: ['socket wrench', 'soft mallet', 'gasket scraper'], parts: [], torque: [{ fastener: 'Crankcase screws, first torque', value: '120 in-lbs (13.6 N·m)', note: '4.25 CRANKCASE, Assemble' }, { fastener: 'Crankcase screws, last torque', value: '15–19 ft-lbs (20.3–25.8 N·m)', note: '4.25 CRANKCASE, Assemble' }, { fastener: 'Cylinder stud', value: '120–240 in-lbs (13.6–27.1 N·m)', note: '4.25 CRANKCASE, Cylinder Studs' }, { fastener: 'Crankcase tapered plugs', value: '120–144 in-lbs (13.6–16.3 N·m)', note: '4.25 CRANKCASE, Plugs and Oil Fittings' }, { fastener: 'Piston jet screws', value: '25–35 in-lbs (2.8–3.9 N·m)', note: '4.25 CRANKCASE, Repair Right Crankcase Half' }, { fastener: 'Balancer bearing screw', value: '80–110 in-lbs (9–12.4 N·m)', note: '4.25 CRANKCASE, Repair Right Crankcase Half' }], steps: [{ n: 1, text: 'Completely disassemble top end of engine.' }, { n: 2, text: 'Remove oil pan.' }, { n: 3, text: 'Drain all engine oil into clean container.' }, { n: 4, text: 'Remove saddlebags if equipped.' }, { n: 5, text: 'Remove transmission.' }, { n: 6, text: 'Support transmission and remove fasteners.' }, { n: 7, text: 'Move transmission back as far as possible.' }, { n: 8, text: 'Mark crankcase halves for alignment during reassembly.' }, { n: 9, text: 'Remove all crankcase fasteners in systematic order.' }, { n: 10, text: 'Use soft mallet to gently separate crankcase halves.' }, { n: 11, text: 'Lift right crankcase half away from left half.' }, { n: 12, text: 'Remove crankshaft and flywheel assembly.' }, { n: 13, text: 'Remove connecting rods if service is required.' }, { n: 14, text: 'Remove balancer shafts if service is required.' }, { n: 15, text: 'Inspect all crankcase bores and passages.' }, { n: 16, text: 'Clean crankcase thoroughly with non-volatile solvent.' }, { n: 17, text: 'Verify all oil holes are clean and open.' }, { n: 18, text: 'Dry with low-pressure compressed air.' }, { n: 19, text: 'Service or replace internal components as needed.' }] },
{ id: 's25-engine-reassemble-crankcase', bikeIds: ['softail-2025'], system: 'engine', title: 'Assemble Crankcase', summary: 'Reassemble crankcase halves with fasteners in proper torque sequence after internal service.', difficulty: 'Hard', timeMinutes: 300, source: { manual: '2025 HD Softail Service Manual', page: '4-66' }, figures: [{ file: '/figures/softail-2025/p4-66.jpg', caption: 'Manual page 4-66' }], tools: ['socket wrench', 'torque wrench'], parts: [], torque: [{ fastener: 'Crankcase screws, first torque', value: '120 in-lbs (13.6 N·m)', note: '4.25 CRANKCASE, Assemble' }, { fastener: 'Crankcase screws, last torque', value: '15–19 ft-lbs (20.3–25.8 N·m)', note: '4.25 CRANKCASE, Assemble' }, { fastener: 'Cylinder stud', value: '120–240 in-lbs (13.6–27.1 N·m)', note: '4.25 CRANKCASE, Cylinder Studs' }], steps: [{ n: 1, text: 'Verify all internal components are clean and properly positioned.' }, { n: 2, text: 'Apply fresh engine oil to all bearing surfaces.' }, { n: 3, text: 'Install crankshaft and flywheel assembly in left crankcase half.' }, { n: 4, text: 'Install connecting rods on crankshaft crank pins.' }, { n: 5, text: 'Install balancer shafts if removed.' }, { n: 6, text: 'Place gasket on left crankcase half.' }, { n: 7, text: 'Carefully position right crankcase half over crankshaft.' }, { n: 8, text: 'Align crankcase halves using marks made during disassembly.' }, { n: 9, text: 'Gently lower right crankcase half onto left half.' }, { n: 10, text: 'Install all crankcase fasteners by hand initially.' }, { n: 11, text: 'Tighten fasteners in systematic pattern to pull halves together evenly.' }, { n: 12, text: 'First torque all fasteners to 120 in-lbs.' }, { n: 13, text: 'Final torque all fasteners to 15–19 ft-lbs.' }, { n: 14, text: 'Verify all fasteners are torqued correctly.' }, { n: 15, text: 'Verify crankshaft rotates freely.' }, { n: 16, text: 'Verify all cylinder studs are properly installed.' }, { n: 17, text: 'Install tapered plugs and torque to specification.' }, { n: 18, text: 'Install oil pan with new gasket.' }, { n: 19, text: 'Install transmission.' }, { n: 20, text: 'Fill with engine oil and check level.' }] },
{ id: 's25-engine-service-flywheel-rods', bikeIds: ['softail-2025'], system: 'engine', title: 'Service Flywheel and Connecting Rods', summary: 'Remove and inspect flywheel assembly and connecting rods for service or replacement.', difficulty: 'Hard', timeMinutes: 200, source: { manual: '2025 HD Softail Service Manual', page: '4-76' }, figures: [{ file: '/figures/softail-2025/p4-76.jpg', caption: 'Manual page 4-76' }], tools: ['socket wrench', 'dial indicator', 'truing stand'], parts: [], torque: [], steps: [{ n: 1, text: 'Remove crankshaft and flywheel assembly from crankcase.' }, { n: 2, text: 'Measure flywheel end play.' }, { n: 3, text: 'Measure flywheel runout on cam plate bearing contact area.' }, { n: 4, text: 'Measure spline runout on left side.' }, { n: 5, text: 'If runout exceeds limits, remove flywheel assembly to check on truing stand.' }, { n: 6, text: 'Mount flywheel assembly in truing stand with bearing races on supports.' }, { n: 7, text: 'Measure runout on machined surface and splines.' }, { n: 8, text: 'Replace flywheel assembly if runout exceeds limits.' }, { n: 9, text: 'Measure connecting rod piston pin fit.' }, { n: 10, text: 'Measure connecting rod side play between flywheels.' }, { n: 11, text: 'Replace connecting rod if clearances exceed limits.' }, { n: 12, text: 'Inspect connecting rods for bending, cracks, or damage.' }, { n: 13, text: 'Verify all rod caps are properly torqued.' }, { n: 14, text: 'Reinstall crankshaft and flywheel assembly in crankcase.' }] },
{ id: 's25-engine-replace-oil-pan', bikeIds: ['softail-2025'], system: 'engine', title: 'Replace Oil Pan', summary: 'Remove and install oil pan with new gasket and fasteners.', difficulty: 'Moderate', timeMinutes: 90, source: { manual: '2025 HD Softail Service Manual', page: '4-78' }, figures: [{ file: '/figures/softail-2025/p4-78.jpg', caption: 'Manual page 4-78' }], tools: ['socket wrench', 'gasket scraper'], parts: [], torque: [{ fastener: 'Engine oil drain plug', value: '14–21 ft-lbs (19–28.5 N·m)', note: '4.27 OIL PAN' }, { fastener: 'Oil pan screws', value: '11–13 ft-lbs (14.9–17.6 N·m)', note: '4.27 OIL PAN' }, { fastener: 'Transmission drain plug', value: '14–21 ft-lbs (19–28.5 N·m)', note: '4.27 OIL PAN' }], steps: [{ n: 1, text: 'Remove main fuse.' }, { n: 2, text: 'Support vehicle on jack stands.' }, { n: 3, text: 'Remove oil pan fasteners.' }, { n: 4, text: 'Carefully lower oil pan and drain remaining oil.' }, { n: 5, text: 'Discard old gasket.' }, { n: 6, text: 'Remove all old gasket material from crankcase and oil pan.' }, { n: 7, text: 'Clean oil pan with non-volatile solvent.' }, { n: 8, text: 'Inspect oil pan for dents or damage.' }, { n: 9, text: 'Verify all oil passages in pan are clean.' }, { n: 10, text: 'Install new gasket on oil pan.' }, { n: 11, text: 'Position oil pan under crankcase.' }, { n: 12, text: 'Install oil pan fasteners by hand initially.' }, { n: 13, text: 'Tighten fasteners to 11–13 ft-lbs.' }, { n: 14, text: 'Install drain plugs with new crush washers.' }, { n: 15, text: 'Torque drain plugs to 14–21 ft-lbs.' }, { n: 16, text: 'Fill crankcase with recommended engine oil.' }, { n: 17, text: 'Check oil level.' }, { n: 18, text: 'Install main fuse.' }] },
// --- END SOFTAIL 2025 CHAPTER 4 JOBS ---

// --- BEGIN SOFTAIL 2025 CHAPTER 5 JOBS ---
{ id: 's25-drivetrain-replace-drive-belt', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Replace drive belt', summary: 'Remove, install, and tension the final drive belt with proper pivot shaft and slot spacer torque sequencing.', difficulty: 'Moderate', timeMinutes: 90, source: { manual: '2025 HD Softail Service Manual', page: '5-7' }, figures: [{ file: '/figures/softail-2025/p5-7.jpg', caption: 'Manual page 5-7' }], tools: ['torque wrench', 'socket set'], parts: [], torque: [{ fastener: 'Drive belt slot spacer screw, 1st torque', value: '50-55 ft-lbs (68-75 N·m)' }, { fastener: 'Drive belt slot spacer screw, final torque', value: '65-70 ft-lbs (88-95 N·m)' }, { fastener: 'Rear fork pivot shaft nut, 1st torque', value: '25-30 ft-lbs (34-41 N·m)' }, { fastener: 'Rear fork pivot shaft nut, 2nd torque', value: '1-48 in-lbs (0.1-5.4 N·m)' }, { fastener: 'Rear fork pivot shaft nut, 3rd torque', value: '154-170 ft-lbs (209-230 N·m)' }, { fastener: 'Rear fork pivot shaft nut, final torque', value: '154-170 ft-lbs (209-230 N·m)' }, { fastener: 'Rear fork pivot shaft pinch bolt', value: '18-20 ft-lbs (24-27 N·m)' }], steps: [{ n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' }, { n: 2, text: 'Remove saddlebags if equipped.' }, { n: 3, text: 'Remove mufflers and exhaust bracket.' }, { n: 4, text: 'Remove rear wheel.' }, { n: 5, text: 'Remove rider footboard and bracket, if needed.' }, { n: 6, text: 'Mid-mount controls: Remove foot shift lever.' }, { n: 7, text: 'Drain primary chaincase oil.' }, { n: 8, text: 'Remove primary chaincase cover.' }, { n: 9, text: 'Remove starter.' }, { n: 10, text: 'Remove primary chain, clutch and compensating sprocket.' }, { n: 11, text: 'Remove primary chaincase housing.' }, { n: 12, text: 'Loosen pivot shaft by removing nut and pinch bolt.' }, { n: 13, text: 'Slide pivot shaft out enough to remove round spacer.' }, { n: 14, text: 'Remove slot spacer screws and slot spacer.' }, { n: 15, text: 'Remove belt.' }, { n: 16, text: 'Install drive belt on final drive sprocket.' }, { n: 17, text: 'Install pivot shaft with round spacer between drive belt, frame and rear fork.' }, { n: 18, text: 'Install pivot shaft nut and tighten to 1st torque (25-30 ft-lbs).' }, { n: 19, text: 'Back off pivot shaft nut 90 degrees.' }, { n: 20, text: 'Tighten pivot shaft nut to 2nd torque (1-48 in-lbs).' }, { n: 21, text: 'Verify round spacer does not have lateral play.' }, { n: 22, text: 'Install slot spacer in center of drive belt between frame and rear fork.' }, { n: 23, text: 'Install slot spacer screws and tighten to 1st torque (50-55 ft-lbs).' }, { n: 24, text: 'Loosen slot spacer screws 90 degrees.' }, { n: 25, text: 'Tighten slot spacer screws to final torque (65-70 ft-lbs).' }, { n: 26, text: 'Place drive belt on sprocket and install rear wheel.' }, { n: 27, text: 'Adjust belt tension after slot spacer screws are torqued and before final pivot shaft torque.' }, { n: 28, text: 'Tighten pivot shaft nut to 3rd torque (154-170 ft-lbs).' }, { n: 29, text: 'Loosen pivot shaft nut 90 degrees.' }, { n: 30, text: 'Tighten pivot shaft nut to final torque (154-170 ft-lbs).' }, { n: 31, text: 'Verify round spacer does not have lateral play.' }, { n: 32, text: 'Tighten pivot shaft pinch bolt to 18-20 ft-lbs.' }, { n: 33, text: 'Install primary chaincase housing.' }, { n: 34, text: 'Install primary chain, clutch, compensating sprocket and chain tensioner.' }, { n: 35, text: 'Install starter.' }, { n: 36, text: 'Install primary chaincase cover and new gasket.' }, { n: 37, text: 'Fill primary chaincase oil.' }, { n: 38, text: 'Mid-mount controls: Install foot shift lever.' }, { n: 39, text: 'Install rider left footboard and bracket, if removed.' }, { n: 40, text: 'Install mufflers and exhaust bracket.' }, { n: 41, text: 'Install saddlebags if equipped.' }, { n: 42, text: 'Install main fuse.' } ] },
{ id: 's25-drivetrain-adjust-shifter-linkage', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Adjust shifter linkage', summary: 'Adjust shifter rod to ensure full gear engagement and full lever travel without shift lever contacting footboard.', difficulty: 'Easy', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '5-9' }, figures: [{ file: '/figures/softail-2025/p5-9.jpg', caption: 'Manual page 5-9' }], tools: [], parts: [], torque: [{ fastener: 'Shifter rod nut', value: '8-12 ft-lbs (11-16 N·m)' }, { fastener: 'Shifter rod jamnut', value: '80-120 in-lbs (9-13.6 N·m)' }], steps: [{ n: 1, text: 'Loosen shifter rod jamnuts.' }, { n: 2, text: 'Remove nut and washer from front of shifter rod.' }, { n: 3, text: 'Remove front of shifter rod.' }, { n: 4, text: 'Adjust rod length as necessary to achieve full gear engagement and lever travel.' }, { n: 5, text: 'Install front of shifter rod through shifter rod lever.' }, { n: 6, text: 'Install washer on ball stud.' }, { n: 7, text: 'Install nut and tighten to 8-12 ft-lbs.' }, { n: 8, text: 'Tighten shifter rod jamnuts to 80-120 in-lbs.' }, { n: 9, text: 'Verify shift lever operation and that peg does not contact footboard when shifting.' } ] },
{ id: 's25-drivetrain-install-shifter-rod', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Install shifter rod', summary: 'Install the shifter rod between rear shifter rod lever and front shifter rod lever with proper bushing alignment.', difficulty: 'Easy', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '5-9' }, figures: [{ file: '/figures/softail-2025/p5-9.jpg', caption: 'Manual page 5-9' }], tools: [], parts: [], torque: [{ fastener: 'Shifter rod nut', value: '8-12 ft-lbs (11-16 N·m)' }], steps: [{ n: 1, text: 'Install rear ball stud to rear shifter rod lever.' }, { n: 2, text: 'Install front of shifter rod through shifter rod lever.' }, { n: 3, text: 'Install washer on ball stud.' }, { n: 4, text: 'Install nut and tighten to 8-12 ft-lbs.' } ] },
{ id: 's25-drivetrain-install-foot-shift-lever', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Install foot shift lever', summary: 'Install and align foot shift lever to marked position with proper peg height for gear engagement without footboard contact.', difficulty: 'Easy', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '5-10' }, figures: [{ file: '/figures/softail-2025/p5-10.jpg', caption: 'Manual page 5-10' }], tools: [], parts: [], torque: [{ fastener: 'Shift lever pinch screw', value: '9.0-12.0 ft-lbs (12.2-16.3 N·m)' }, { fastener: 'Shifter peg screw', value: '96-144 in-lbs (10.9-16.3 N·m)' }], steps: [{ n: 1, text: 'Install pegs by installing screw through peg.' }, { n: 2, text: 'Install screw to lever and tighten to 96-144 in-lbs.' }, { n: 3, text: 'Install spacer on shaft.' }, { n: 4, text: 'Align and install lever to mark made during removal.' }, { n: 5, text: 'Install screw and nut, tighten to 9.0-12.0 ft-lbs.' }, { n: 6, text: 'Verify shift lever operation and peg does not contact footboard.' } ] },
{ id: 's25-drivetrain-install-shifter-rod-lever-front', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Install shifter rod lever (front)', summary: 'Install and align the front shifter rod lever to marked position on shaft with proper pinch screw torque.', difficulty: 'Easy', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '5-10' }, figures: [{ file: '/figures/softail-2025/p5-10.jpg', caption: 'Manual page 5-10' }], tools: [], parts: [], torque: [{ fastener: 'Shifter rod lever pinch screw, front lever', value: '132-156 in-lbs (14.9-17.6 N·m)' }, { fastener: 'Shifter rod nut', value: '8-12 ft-lbs (11-16 N·m)' }], steps: [{ n: 1, text: 'Align and install lever to marks made on shifter shaft during removal.' }, { n: 2, text: 'Slide shifter shaft through lever.' }, { n: 3, text: 'Install screw and tighten to 132-156 in-lbs.' }, { n: 4, text: 'Install shifter rod through shifter rod lever.' }, { n: 5, text: 'Install washer on shifter rod stud.' }, { n: 6, text: 'Install nut and tighten to 8-12 ft-lbs.' }, { n: 7, text: 'Verify shift lever operation.' } ] },
{ id: 's25-drivetrain-remove-install-clutch-release-cover', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Service clutch release cover', summary: 'Remove, disassemble, clean, and reassemble the clutch release cover with ball-ramp clutch actuation mechanism.', difficulty: 'Moderate', timeMinutes: 120, source: { manual: '2025 HD Softail Service Manual', page: '5-11' }, figures: [{ file: '/figures/softail-2025/p5-11.jpg', caption: 'Manual page 5-11' }], tools: [], parts: [], torque: [{ fastener: 'Clutch cable fitting', value: '90-120 in-lbs (10.2-13.6 N·m)' }, { fastener: 'Clutch release cover screws', value: '11-13 ft-lbs (14.9-17.6 N·m)' }], steps: [{ n: 1, text: 'Remove main fuse.' }, { n: 2, text: 'Remove exhaust system as needed.' }, { n: 3, text: 'Drain transmission.' }, { n: 4, text: 'Remove gear position sensor cover and sensor.' }, { n: 5, text: 'Remove clutch release cover screws (actuating clutch hand lever after removing screws helps break cover free).' }, { n: 6, text: 'Remove clutch release cover.' }, { n: 7, text: 'Discard gasket.' }, { n: 8, text: 'Add free play to clutch cable.' }, { n: 9, text: 'Disconnect clutch cable by removing retaining ring.' }, { n: 10, text: 'Lift inner ramp and ramp coupling out of clutch release cover.' }, { n: 11, text: 'Disconnect clutch cable end from ramp coupling.' }, { n: 12, text: 'Remove coupling from inner ramp.' }, { n: 13, text: 'Remove balls and outer ramp.' }, { n: 14, text: 'Remove cable fitting from clutch release cover.' }, { n: 15, text: 'Discard O-ring.' }, { n: 16, text: 'Wash ball and ramp mechanism components in cleaning solvent.' }, { n: 17, text: 'Inspect the three balls and ball socket surfaces on ramps for wear, pitting, surface breakdown.' }, { n: 18, text: 'Check fit of ramp coupling on inner ramp and replace both if excessive wear.' }, { n: 19, text: 'Inspect retaining ring for damage or distortion.' }, { n: 20, text: 'Check clutch cable end for frayed or worn ends and replace if damaged.' }, { n: 21, text: 'Check bore in clutch release cover for wear that would cause ramps to tilt.' }, { n: 22, text: 'Install new O-ring.' }, { n: 23, text: 'Apply LOCTITE 243 to threads on clutch cable fitting.' }, { n: 24, text: 'Install clutch cable fitting in clutch release cover, leave fasteners loose.' }, { n: 25, text: 'Place outer ramp with ball socket side up in clutch release cover, confirm outer ramp tab is in slot.' }, { n: 26, text: 'Apply multi-purpose grease to balls and outer ramp sockets, place a ball in each socket.' }, { n: 27, text: 'Connect clutch cable end to ramp coupling.' }, { n: 28, text: 'Install coupling on inner ramp.' }, { n: 29, text: 'Place inner ramp and coupling in position in clutch release cover.' }, { n: 30, text: 'Center retaining ring opening above break in ribbing at bottom of clutch release cover.' }, { n: 31, text: 'Install retaining ring.' }, { n: 32, text: 'Verify two alignment pins are in place on transmission bearing housing flange.' }, { n: 33, text: 'Install new gasket.' }, { n: 34, text: 'Install clutch release cover.' }, { n: 35, text: 'Install screws.' }, { n: 36, text: 'Tighten screws in sequence shown, torque 11-13 ft-lbs.' }, { n: 37, text: 'Tighten clutch cable fitting if removed, torque 90-120 in-lbs.' }, { n: 38, text: 'Install gear position sensor and cover.' }, { n: 39, text: 'Fill transmission.' }, { n: 40, text: 'Adjust clutch.' }, { n: 41, text: 'Install exhaust system if removed.' }, { n: 42, text: 'Install main fuse.' } ] },
{ id: 's25-drivetrain-service-clutch-release-push-rod', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Service clutch release push rod components', summary: 'Remove and install push rod, release plate, throw out bearing, oil slinger, and related clutch release components.', difficulty: 'Moderate', timeMinutes: 90, source: { manual: '2025 HD Softail Service Manual', page: '5-14' }, figures: [{ file: '/figures/softail-2025/p5-14.jpg', caption: 'Manual page 5-14' }], tools: [], parts: [], torque: [], steps: [{ n: 1, text: 'Remove clutch inspection cover.' }, { n: 2, text: 'Left side: Loosen jamnut on adjuster screw.' }, { n: 3, text: 'Loosen adjuster screw.' }, { n: 4, text: 'Remove retaining ring.' }, { n: 5, text: 'Remove release plate.' }, { n: 6, text: 'If necessary, remove push rod.' }, { n: 7, text: 'Left side: Verify push rod is installed.' }, { n: 8, text: 'Install release plate.' }, { n: 9, text: 'Install retaining ring.' }, { n: 10, text: 'Install adjuster screw.' }, { n: 11, text: 'Install jamnut.' }, { n: 12, text: 'Right side: Verify push rod is installed.' }, { n: 13, text: 'Assemble bearing on oil slinger by installing one thrust washer on oil slinger.' }, { n: 14, text: 'Install throw out bearing on oil slinger.' }, { n: 15, text: 'Install second thrust washer on oil slinger.' }, { n: 16, text: 'Install retaining ring in groove.' }, { n: 17, text: 'Install assembly in transmission input shaft.' }, { n: 18, text: 'If necessary, install clutch release cover.' }, { n: 19, text: 'Fill transmission.' }, { n: 20, text: 'Install exhaust system if removed.' }, { n: 21, text: 'Install mufflers.' }, { n: 22, text: 'Adjust clutch.' }, { n: 23, text: 'Install clutch inspection cover.' } ] },
{ id: 's25-drivetrain-replace-primary-chaincase-cover', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Replace primary chaincase cover', summary: 'Remove old cover and gasket, inspect internal debris, install new cover with gasket and threadlocker-sealed screws in proper sequence.', difficulty: 'Easy', timeMinutes: 60, source: { manual: '2025 HD Softail Service Manual', page: '5-16' }, figures: [{ file: '/figures/softail-2025/p5-16.jpg', caption: 'Manual page 5-16' }], tools: ['torque wrench', 'socket set'], parts: [{ number: 'LOCTITE 243', description: 'Medium strength threadlocker and sealant (blue)', qty: 1 }], torque: [{ fastener: 'Primary cover screws', value: '12-13 ft-lbs (16.3-17.6 N·m)', note: 'See sequence in procedure' }], steps: [{ n: 1, text: 'Remove main fuse.' }, { n: 2, text: 'Remove rider left footboard and bracket, if necessary.' }, { n: 3, text: 'Mid-mount controls: Remove foot shift lever.' }, { n: 4, text: 'Drain primary chaincase oil.' }, { n: 5, text: 'Remove primary chaincase cover screws (short and long).' }, { n: 6, text: 'Remove cover.' }, { n: 7, text: 'Remove and discard gasket.' }, { n: 8, text: 'Verify all debris is washed from inside ribs of cover.' }, { n: 9, text: 'Verify hollow dowels are installed properly.' }, { n: 10, text: 'Install new cover gasket.' }, { n: 11, text: 'Apply a drop of threadlocker (LOCTITE 243) to threads of screws.' }, { n: 12, text: 'Install cover with screws in positions shown.' }, { n: 13, text: 'Tighten screws in sequence shown, torque 12-13 ft-lbs.' }, { n: 14, text: 'Fill primary chaincase with oil.' }, { n: 15, text: 'Mid-mount controls: Install foot shift lever.' }, { n: 16, text: 'Install rider footboard and bracket, if removed.' }, { n: 17, text: 'Install main fuse.' } ] },
{ id: 's25-drivetrain-service-drive-components', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Service drive components (primary chain, clutch, sprockets, tensioner)', summary: 'Remove and install primary chain, clutch assembly, compensating sprocket, and chain tensioner with proper lubrication and tension adjustment.', difficulty: 'Hard', timeMinutes: 180, source: { manual: '2025 HD Softail Service Manual', page: '5-17' }, figures: [{ file: '/figures/softail-2025/p5-17.jpg', caption: 'Manual page 5-17' }], tools: ['torque wrench', 'socket set', 'HD-48219 primary drive locking tool'], parts: [{ number: 'LOCTITE 262', description: 'High strength threadlocker and sealant (red)', qty: 1 }], torque: [{ fastener: 'Clutch hub mainshaft nut', value: '70-80 ft-lbs (95-108.5 N·m)' }, { fastener: 'Compensating sprocket bolt, 1st torque', value: '100 ft-lbs (135.6 N·m)' }, { fastener: 'Compensating sprocket bolt, final torque', value: '175 ft-lbs (237.3 N·m)' }, { fastener: 'Primary chain tensioner fasteners', value: '21-24 ft-lbs (28.5-33 N·m)' }], steps: [{ n: 1, text: 'Remove main fuse.' }, { n: 2, text: 'Remove rider left footboard and bracket, if necessary.' }, { n: 3, text: 'Mid-mount controls: Remove foot shift lever.' }, { n: 4, text: 'Drain primary chaincase oil.' }, { n: 5, text: 'Remove primary chaincase cover.' }, { n: 6, text: 'Install cable strap on chain tensioner as shown.' }, { n: 7, text: 'Remove chain tensioner fasteners.' }, { n: 8, text: 'Remove chain tensioner.' }, { n: 9, text: 'Mark one link on primary chain for reference during installation.' }, { n: 10, text: 'Remove release plate (may not be necessary if only removing compensating sprocket).' }, { n: 11, text: 'Remove mainshaft nut using PRIMARY DRIVE LOCKING TOOL (HD-48219).' }, { n: 12, text: 'Remove compensating sprocket bolt using PRIMARY DRIVE LOCKING TOOL.' }, { n: 13, text: 'Remove retainer and thrust washer.' }, { n: 14, text: 'Inspect thrust washers for damage.' }, { n: 15, text: 'Remove clutch assembly, primary chain and compensating sprocket assembly as a single unit.' }, { n: 16, text: 'Clean sprocket retainer and verify oil holes are clear.' }, { n: 17, text: 'Install spring pack on rotor hub.' }, { n: 18, text: 'Apply thin layer of primary chaincase oil to flywheel shaft.' }, { n: 19, text: 'Apply thin layer of primary chaincase oil to shaft extension.' }, { n: 20, text: 'Install shaft extension.' }, { n: 21, text: 'Install sliding cam.' }, { n: 22, text: 'Install primary chain, compensating sprocket and clutch as an assembly.' }, { n: 23, text: 'Lightly lubricate thrust washer and install.' }, { n: 24, text: 'Install sprocket retainer.' }, { n: 25, text: 'Install new bolt, hand tighten.' }, { n: 26, text: 'Clean and prime threads of clutch hub mainshaft nut.' }, { n: 27, text: 'Apply threadlocker (LOCTITE 262) to nut threads.' }, { n: 28, text: 'Install nut onto mainshaft, hand-tighten.' }, { n: 29, text: 'Tighten mainshaft nut using PRIMARY DRIVE LOCKING TOOL, torque 70-80 ft-lbs.' }, { n: 30, text: 'Tighten compensating sprocket bolt 1st torque to 100 ft-lbs using locking tool.' }, { n: 31, text: 'Loosen compensating sprocket bolt one-half turn.' }, { n: 32, text: 'Final torque compensating sprocket bolt to 175 ft-lbs using locking tool.' }, { n: 33, text: 'Install release plate.' }, { n: 34, text: 'If primary chain tensioner is disassembled, assemble in order shown.' }, { n: 35, text: 'Locate end of spring rod on roll pin.' }, { n: 36, text: 'Slide wedge of primary chain tensioner in direction of arrow until all travel is removed.' }, { n: 37, text: 'Push shoe down until it contacts wedge, keep tension on shoe so wedge stays in place.' }, { n: 38, text: 'Attach cable strap as shown to hold wedge in place.' }, { n: 39, text: 'Install primary chain tensioner with fasteners.' }, { n: 40, text: 'Tighten fasteners to 21-24 ft-lbs.' }, { n: 41, text: 'Remove cable strap.' }, { n: 42, text: 'Set preliminary chain tension: check tension at top span while pulling down on chain midway between sprockets, correct tension is 0.500-0.625 in (12.7-15.88 mm).' }, { n: 43, text: 'If chain is loose, move chain adjuster one notch and check tension.' }, { n: 44, text: 'Repeat until tension is within specification.' }, { n: 45, text: 'Test ride vehicle after tensioner removal/installation to provide proper adjustment.' }, { n: 46, text: 'Install primary chaincase cover.' }, { n: 47, text: 'Fill primary chaincase with oil.' }, { n: 48, text: 'Mid-mount controls: Install foot shift lever.' }, { n: 49, text: 'Install rider footboard and bracket, if removed.' }, { n: 50, text: 'Install main fuse.' } ] },
{ id: 's25-drivetrain-disassemble-assemble-clutch-pack', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Disassemble and assemble clutch pack', summary: 'Remove and install clutch plates (friction and steel), springs, damper spring, and stopper plate with soak and torque sequence.', difficulty: 'Hard', timeMinutes: 120, source: { manual: '2025 HD Softail Service Manual', page: '5-21' }, figures: [{ file: '/figures/softail-2025/p5-21.jpg', caption: 'Manual page 5-21' }], tools: [], parts: [], torque: [{ fastener: 'Clutch, stopper plate bolts', value: '71-106 in-lbs (8-12 N·m)', note: 'Alternate tightening 1-2 turns to prevent damage' }], steps: [{ n: 1, text: 'Remove pressure plate by removing bolts alternating each bolt 1-2 turns.' }, { n: 2, text: 'Remove stopper plate.' }, { n: 3, text: 'Remove springs.' }, { n: 4, text: 'Remove spring seats.' }, { n: 5, text: 'Remove pressure plate.' }, { n: 6, text: 'Remove narrow friction plates and narrow steel plate.' }, { n: 7, text: 'Remove wide steel plates and wide friction plates.' }, { n: 8, text: 'Remove remaining narrow friction plate.' }, { n: 9, text: 'Remove damper spring.' }, { n: 10, text: 'Remove damper spring seat.' }, { n: 11, text: 'Wash parts in cleaning solvent and dry with low-pressure compressed air (do not wash friction plates with solvent, use compressed air only).' }, { n: 12, text: 'Check friction plates: remove lubricant using compressed air, measure thickness, replace entire set if any plate is less than specification, inspect for worn or damaged fiber surface.' }, { n: 13, text: 'Check steel plates: replace entire set if any plates are grooved, lay plate on precision flat surface, use feeler gauge to check distortion, replace if warped beyond 0.006 in (0.15 mm).' }, { n: 14, text: 'Check clutch hub bearing for smooth operation, replace if necessary.' }, { n: 15, text: 'Check clutch shell chain sprocket and starter ring gear, replace if worn or damaged.' }, { n: 16, text: 'Check clutch hub and shell steel plate slots for wear or damage, replace if necessary.' }, { n: 17, text: 'Check coil springs and stopper plate for wear or damage, replace if necessary.' }, { n: 18, text: 'Submerge and soak all friction plates in primary chaincase lubricant for at least five minutes.' }, { n: 19, text: 'Install damper spring seat into clutch hub.' }, { n: 20, text: 'Install damper spring onto damper spring seat with concave side facing outside of motorcycle.' }, { n: 21, text: 'Install one narrow friction plate into clutch hub.' }, { n: 22, text: 'Install one wide steel plate onto narrow friction plate and damper spring.' }, { n: 23, text: 'Beginning with a wide friction plate, alternate remaining wide friction plates with wide steel plates.' }, { n: 24, text: 'Install narrow friction plate, narrow steel plate and remaining narrow friction plate.' }, { n: 25, text: 'Install spring seats.' }, { n: 26, text: 'Align and install pressure plate onto clutch hub.' }, { n: 27, text: 'Install springs.' }, { n: 28, text: 'Install stopper plate.' }, { n: 29, text: 'Install bolts and alternate tighten bolts 1-2 turns to prevent damage to stopper plate.' }, { n: 30, text: 'Tighten bolts to 71-106 in-lbs.' }, { n: 31, text: 'Install primary chaincase cover.' }, { n: 32, text: 'Fill primary chaincase with oil.' }, { n: 33, text: 'Mid-mount controls: Install foot shift lever.' }, { n: 34, text: 'Install rider footboard and bracket, if removed.' }, { n: 35, text: 'Install main fuse.' } ] },
{ id: 's25-drivetrain-disassemble-assemble-clutch-hub', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Disassemble and assemble clutch hub (bearing/shell)', summary: 'Press bearing and hub in and out of clutch shell with proper support and retaining ring installation.', difficulty: 'Hard', timeMinutes: 120, source: { manual: '2025 HD Softail Service Manual', page: '5-24' }, figures: [{ file: '/figures/softail-2025/p5-24.jpg', caption: 'Manual page 5-24' }], tools: ['press', 'bearing race remover/installer'], parts: [], torque: [], steps: [{ n: 1, text: 'Remove and discard clutch hub retaining ring.' }, { n: 2, text: 'Support clutch shell in press with ring gear side up.' }, { n: 3, text: 'Press hub from bearing in clutch shell.' }, { n: 4, text: 'Remove and discard bearing retaining ring.' }, { n: 5, text: 'Support clutch shell in press with ring gear side down.' }, { n: 6, text: 'Use suitable press plug to remove bearing.' }, { n: 7, text: 'Clean and inspect components.' }, { n: 8, text: 'Place clutch shell in press with ring gear side up.' }, { n: 9, text: 'Support clutch shell bore on sprocket side to avoid damage to ears on clutch basket.' }, { n: 10, text: 'Using suitable press plug, press against outer race until bearing contacts shoulder in clutch shell bore.' }, { n: 11, text: 'Install new bearing retaining ring with flat side toward bearing.' }, { n: 12, text: 'Place clutch shell in press with sprocket side up.' }, { n: 13, text: 'Center hub in bearing.' }, { n: 14, text: 'Support bearing inner race with a sleeve on transmission side.' }, { n: 15, text: 'Press hub into bearing until shoulder contacts bearing inner race.' }, { n: 16, text: 'Install clutch hub retaining ring in groove of clutch hub.' }, { n: 17, text: 'Install primary chaincase cover.' } ] },
{ id: 's25-drivetrain-service-primary-chaincase-housing', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Service primary chaincase housing', summary: 'Remove and install primary chaincase housing with bearing, seal, and mainshaft components with proper dowel alignment and sealing screw sequence.', difficulty: 'Hard', timeMinutes: 150, source: { manual: '2025 HD Softail Service Manual', page: '5-26' }, figures: [{ file: '/figures/softail-2025/p5-26.jpg', caption: 'Manual page 5-26' }], tools: ['press', 'bearing driver', 'seal remover'], parts: [], torque: [{ fastener: 'Primary chaincase sealing screws', value: '26-28 ft-lbs (35.3-38 N·m)', note: 'See sequence in procedure' }], steps: [{ n: 1, text: 'Remove main fuse.' }, { n: 2, text: 'Remove rider footboard and bracket, if needed.' }, { n: 3, text: 'Mid-mount controls: Remove foot shift lever.' }, { n: 4, text: 'Drain primary chaincase oil.' }, { n: 5, text: 'Remove primary chaincase cover.' }, { n: 6, text: 'Remove starter.' }, { n: 7, text: 'Remove primary chain, clutch and compensating sprocket.' }, { n: 8, text: 'Remove and discard primary chaincase housing screws.' }, { n: 9, text: 'Remove primary chaincase housing.' }, { n: 10, text: 'Discard gasket.' }, { n: 11, text: 'Inspect primary chaincase for cracks or damaged gasket surface.' }, { n: 12, text: 'Check mainshaft bearing and replace if bearing does not rotate freely.' }, { n: 13, text: 'Replace oil seal.' }, { n: 14, text: 'Inspect shifter shaft bushing and replace if necessary.' }, { n: 15, text: 'Cover mainshaft clutch hub splines with tape to prevent spline damage.' }, { n: 16, text: 'Install gasket on surface, verify dowels in gasket engage dowel holes.' }, { n: 17, text: 'Spread a film of oil on mainshaft oil seal lip and rubber portion of crankcase gasket.' }, { n: 18, text: 'Install primary chaincase housing.' }, { n: 19, text: 'Install new sealing screws.' }, { n: 20, text: 'Tighten in sequence shown, torque 26-28 ft-lbs.' }, { n: 21, text: 'Remove bearing seal with seal remover or rolling head pry bar.' }, { n: 22, text: 'Verify bearing bore is clean and smooth.' }, { n: 23, text: 'Place primary chaincase in press with transmission side up.' }, { n: 24, text: 'Install new bearing with letter side up.' }, { n: 25, text: 'Apply thin film of oil to outer diameter of bearing.' }, { n: 26, text: 'Press outer race until it makes solid contact with bearing support area.' }, { n: 27, text: 'Install new retaining ring in groove on chaincase.' }, { n: 28, text: 'Verify retaining ring does not block oil passage and is fully seated in groove.' }, { n: 29, text: 'Install mainshaft oil seal by lubricating OD with ASSEMBLY LUBE.' }, { n: 30, text: 'Place seal over bore with garter spring side (stamped OIL SIDE) facing toward bearing.' }, { n: 31, text: 'Press against outer rim of oil seal until flush with machined surface of inner primary housing.' }, { n: 32, text: 'Lubricate bearing and seal lip with multi-purpose grease or ASSEMBLY LUBE.' }, { n: 33, text: 'Remove bearing inner race from mainshaft using BEARING RACE REMOVER AND INSTALLER KIT (HD-34902-C).' }, { n: 34, text: 'Lubricate race with ASSEMBLY LUBE.' }, { n: 35, text: 'Install bearing inner race onto mainshaft until edge of race contacts step on shaft using bearing race tool.' }, { n: 36, text: 'Press out old shifter shaft bushing from front to back.' }, { n: 37, text: 'Inspect bushing bore to verify clean and smooth.' }, { n: 38, text: 'Press new bushing from back of chaincase until flush to 0.020 in (0.51 mm) below edge of bore.' }, { n: 39, text: 'Install primary chain, clutch, compensating sprocket and chain tensioner.' }, { n: 40, text: 'Install starter.' }, { n: 41, text: 'Install primary chaincase cover and new gasket.' }, { n: 42, text: 'Fill primary chaincase oil.' }, { n: 43, text: 'Mid-mount controls: Install foot shift lever.' }, { n: 44, text: 'Install rider footboard and bracket, if removed.' }, { n: 45, text: 'Install main fuse.' } ] },
{ id: 's25-drivetrain-replace-engine-oil-fill-spout', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Replace engine oil fill spout', summary: 'Remove old fill spout with O-ring and install new spout with new O-ring and proper screw torque.', difficulty: 'Easy', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '5-30' }, figures: [{ file: '/figures/softail-2025/p5-30.jpg', caption: 'Manual page 5-30' }], tools: ['torque wrench'], parts: [{ number: 'O-ring', description: 'Oil fill spout O-ring', qty: 1 }], torque: [{ fastener: 'Engine oil fill spout screw', value: '100-120 in-lbs (11.3-13.6 N·m)' }], steps: [{ n: 1, text: 'Drain engine oil.' }, { n: 2, text: 'Remove screws.' }, { n: 3, text: 'Remove fill spout.' }, { n: 4, text: 'Discard O-ring.' }, { n: 5, text: 'Install new O-ring.' }, { n: 6, text: 'Install fill spout.' }, { n: 7, text: 'Install screws and tighten to 100-120 in-lbs.' }, { n: 8, text: 'Fill engine oil.' } ] },
{ id: 's25-drivetrain-replace-transmission-sprocket', bikeIds: ['softail-2025'], system: 'drivetrain', title: 'Replace transmission sprocket', summary: 'Remove and install transmission sprocket with proper nut torque sequence, lockplate alignment, and sprocket locking tool usage.', difficulty: 'Moderate', timeMinutes: 90, source: { manual: '2025 HD Softail Service Manual', page: '5-31' }, figures: [{ file: '/figures/softail-2025/p5-31.jpg', caption: 'Manual page 5-31' }], tools: ['torque wrench', 'HD-46282A final drive sprocket locking tool', 'HD-47910 mainshaft locknut wrench', 'HD-94660-2 pilot', 'TA360 torque angle gauge'], parts: [], torque: [{ fastener: 'Transmission sprocket lockplate screws', value: '100-120 in-lbs (11.3-13.6 N·m)', note: 'Lock patch, use 3-5 times' }, { fastener: 'Transmission sprocket nut step 1', value: '100 ft-lbs (135.6 N·m)' }, { fastener: 'Transmission sprocket nut step 2. Loosen one turn', value: '360°' }, { fastener: 'Transmission sprocket nut step 3', value: '35 ft-lbs (47.5 N·m)' }, { fastener: 'Transmission sprocket nut step 4. Additional', value: '35-45°', note: 'Do not loosen to align lockplate screws' }], steps: [{ n: 1, text: 'Remove main fuse.' }, { n: 2, text: 'Remove rider footboard and bracket, if needed.' }, { n: 3, text: 'Mid-mount controls: Remove foot shift lever.' }, { n: 4, text: 'Drain primary chaincase oil.' }, { n: 5, text: 'Remove primary chaincase cover.' }, { n: 6, text: 'Remove starter.' }, { n: 7, text: 'Remove primary chain, clutch and compensating sprocket.' }, { n: 8, text: 'Remove primary chaincase housing.' }, { n: 9, text: 'Loosen drive belt.' }, { n: 10, text: 'Remove and discard sprocket nut lockplate screws.' }, { n: 11, text: 'Remove lockplate.' }, { n: 12, text: 'Attach FINAL DRIVE SPROCKET LOCKING TOOL (HD-46282A) with arm of tool against bottom of rear fork pivot.' }, { n: 13, text: 'Install pilot on mainshaft (HD-94660-2).' }, { n: 14, text: 'Remove sprocket nut using MAINSHAFT LOCKNUT WRENCH (HD-47910).' }, { n: 15, text: 'Remove sprocket, allowing belt to slip from sprocket as sprocket is removed.' }, { n: 16, text: 'Using non-volatile cleaning solvent, clean sprocket of all grease and dirt.' }, { n: 17, text: 'Inspect belt and sprocket.' }, { n: 18, text: 'Inspect main drive gear and mainshaft seals, replace if damaged.' }, { n: 19, text: 'Place transmission sprocket in position and install belt as sprocket is installed.' }, { n: 20, text: 'Apply a film of clean engine oil to mating surfaces of sprocket nut and sprocket.' }, { n: 21, text: 'Never get oil on sprocket nut threads.' }, { n: 22, text: 'If reusing sprocket nut, apply threadlocker (LOCTITE 271) to threads.' }, { n: 23, text: 'Install sprocket nut finger-tight.' }, { n: 24, text: 'Install FINAL DRIVE SPROCKET LOCKING TOOL (HD-46282A) against rear fork pivot.' }, { n: 25, text: 'Install pilot on mainshaft (HD-94660-2).' }, { n: 26, text: 'Tighten sprocket nut step 1 to 100 ft-lbs using MAINSHAFT LOCKNUT WRENCH (HD-47910).' }, { n: 27, text: 'Loosen sprocket nut one full revolution (360 degrees).' }, { n: 28, text: 'Tighten sprocket nut step 3 to 35 ft-lbs.' }, { n: 29, text: 'Scribe lines or use TORQUE ANGLE GAUGE (TA360) for final torque.' }, { n: 30, text: 'Tighten sprocket nut step 4 an additional 35-45 degrees (do not exceed, do not loosen to align screw holes).' }, { n: 31, text: 'If necessary, tighten nut slightly to align lockplate.' }, { n: 32, text: 'Align lockplate holes with tapped holes in sprocket.' }, { n: 33, text: 'Install new screws.' }, { n: 34, text: 'Tighten lockplate screws to 100-120 in-lbs.' }, { n: 35, text: 'Install primary chaincase housing.' }, { n: 36, text: 'Install primary chain, clutch, compensating sprocket and chain tensioner.' }, { n: 37, text: 'Install starter.' }, { n: 38, text: 'Install primary chaincase cover and new gasket.' }, { n: 39, text: 'Fill primary chaincase oil.' }, { n: 40, text: 'Mid-mount controls: Install foot shift lever.' }, { n: 41, text: 'Install rider footboard and bracket, if removed.' }, { n: 42, text: 'Adjust drive belt deflection.' }, { n: 43, text: 'Verify rear fork pivot shaft torque.' }, { n: 44, text: 'Install main fuse.' } ] },
{ id: 's25-transmission-remove-install-bearing-housing', bikeIds: ['softail-2025'], system: 'transmission', title: 'Remove and install transmission bearing housing', summary: 'Remove bearing housing and transmission gear assembly with breather cover, install with gasket and proper screw torque sequence.', difficulty: 'Hard', timeMinutes: 180, source: { manual: '2025 HD Softail Service Manual', page: '5-34' }, figures: [{ file: '/figures/softail-2025/p5-34.jpg', caption: 'Manual page 5-34' }], tools: ['torque wrench', 'pry tool'], parts: [], torque: [{ fastener: 'Transmission bearing housing screw', value: '22-25 ft-lbs (29.8-33.9 N·m)', note: 'See sequence in procedure' }], steps: [{ n: 1, text: 'Remove main fuse.' }, { n: 2, text: 'Drain transmission oil.' }, { n: 3, text: 'Drain engine oil.' }, { n: 4, text: 'Remove exhaust system.' }, { n: 5, text: 'Remove engine oil fill spout.' }, { n: 6, text: 'Remove clutch release cover.' }, { n: 7, text: 'Remove rider footboard and bracket, if needed.' }, { n: 8, text: 'Mid-mount controls: Remove foot shift lever.' }, { n: 9, text: 'Drain primary chaincase oil.' }, { n: 10, text: 'Remove primary chaincase cover.' }, { n: 11, text: 'Remove starter.' }, { n: 12, text: 'Remove primary chain, clutch and compensating sprocket.' }, { n: 13, text: 'Remove primary chaincase housing.' }, { n: 14, text: 'Loosen drive belt.' }, { n: 15, text: 'Remove transmission mainshaft bearing inner race.' }, { n: 16, text: 'Remove breather cover from transmission.' }, { n: 17, text: 'Set a rag over transmission case.' }, { n: 18, text: 'Set shifter cam pawl on rag.' }, { n: 19, text: 'Cover mainshaft clutch hub splines with tape to prevent damaging main drive gear bearings and oil seal.' }, { n: 20, text: 'Always pry bearing housing loose, never tap on shafts (shafts will be damaged).' }, { n: 21, text: 'Remove transmission bearing housing screws.' }, { n: 22, text: 'Pry bearing housing loose.' }, { n: 23, text: 'Remove bearing housing and transmission components from transmission case as an assembly.' }, { n: 24, text: 'Cover mainshaft clutch hub splines with tape to prevent damaging main drive gear bearings and oil seal.' }, { n: 25, text: 'Remove transmission dipstick.' }, { n: 26, text: 'Install a new gasket on transmission assembly dowels.' }, { n: 27, text: 'Apply clean transmission lubricant to main drive gear bearings.' }, { n: 28, text: 'Install bearing housing and transmission assembly screws.' }, { n: 29, text: 'Tighten in sequence shown, torque 22-25 ft-lbs.' }, { n: 30, text: 'Set shifter cam pawl on shift cam.' }, { n: 31, text: 'Install breather cover.' }, { n: 32, text: 'Install transmission mainshaft bearing inner race.' }, { n: 33, text: 'Install clutch release cover.' }, { n: 34, text: 'Fill transmission oil.' }, { n: 35, text: 'Install engine oil fill spout.' }, { n: 36, text: 'Fill engine oil.' }, { n: 37, text: 'Install exhaust system.' }, { n: 38, text: 'Install primary chaincase housing.' }, { n: 39, text: 'Install primary chain, clutch, compensating sprocket and chain tensioner.' }, { n: 40, text: 'Install starter.' }, { n: 41, text: 'Install primary chaincase cover.' }, { n: 42, text: 'Fill primary chaincase oil.' }, { n: 43, text: 'Mid-mount controls: Install foot shift lever.' }, { n: 44, text: 'Install rider footboard and bracket, if removed.' }, { n: 45, text: 'Adjust drive belt deflection.' }, { n: 46, text: 'Verify rear fork pivot shaft torque.' }, { n: 47, text: 'Install main fuse.' } ] },
{ id: 's25-transmission-disassemble-gearset', bikeIds: ['softail-2025'], system: 'transmission', title: 'Disassemble transmission gearset (mainshaft and countershaft)', summary: 'Remove and disassemble mainshaft and countershaft gears, bearings, dog rings, and shift components with inspection and cleaning.', difficulty: 'Hard', timeMinutes: 240, source: { manual: '2025 HD Softail Service Manual', page: '5-35' }, figures: [{ file: '/figures/softail-2025/p5-35.jpg', caption: 'Manual page 5-35' }], tools: ['press', 'screw extractor', 'feeler gauge'], parts: [], torque: [], steps: [{ n: 1, text: 'Remove shift fork shafts using spiral-flute screw extractor or vise grips.' }, { n: 2, text: 'Mark end of shaft to aid assembly.' }, { n: 3, text: 'Remove shift forks from dog rings.' }, { n: 4, text: 'Remove lock plate and discard screws.' }, { n: 5, text: 'Hold detent arm back and remove shift cam.' }, { n: 6, text: 'If needed, remove detent assembly (remove detent screw, detent arm, sleeve and detent spring).' }, { n: 7, text: 'Mark detent parts so they can be installed in same direction as removed.' }, { n: 8, text: 'Lock two gears in place using dog rings.' }, { n: 9, text: 'Temporarily put transmission assembly into transmission case.' }, { n: 10, text: 'Remove mainshaft and countershaft locknuts.' }, { n: 11, text: 'Remove transmission assembly from transmission case.' }, { n: 12, text: 'Remove mainshaft retaining ring.' }, { n: 13, text: 'Remove dog ring, guiding hub, mainshaft fifth gear and bearing.' }, { n: 14, text: 'Do not press directly on end of mainshaft, use a spacer between end and press ram.' }, { n: 15, text: 'Press mainshaft out of bearing housing.' }, { n: 16, text: 'Replace bearing housing bearing.' }, { n: 17, text: 'If mainshaft is not removed, hold countershaft third and fourth gear shift dog up while removing countershaft.' }, { n: 18, text: 'Press countershaft out of bearing housing bearing.' }, { n: 19, text: 'Remove washer, countershaft first gear and bearing.' }, { n: 20, text: 'Remove countershaft second, third and fourth gears.' }, { n: 21, text: 'Remove dog ring.' }, { n: 22, text: 'Remove lock ring.' }, { n: 23, text: 'Remove securing segments.' }, { n: 24, text: 'Remove guiding hub, gear and bearing.' }, { n: 25, text: 'Repeat steps with third and fourth gears.' }, { n: 26, text: 'Replace bearing housing bearing.' }, { n: 27, text: 'Remove and discard retaining rings for bearing housing bearings.' }, { n: 28, text: 'Press bearings out of bearing housing.' }, { n: 29, text: 'Clean parts in non-volatile cleaning solution, dry with low-pressure compressed air.' }, { n: 30, text: 'Replace worn or damaged gears.' }, { n: 31, text: 'Replace dog rings if dogs and/or pockets are rounded, battered or chipped.' }, { n: 32, text: 'Replace guiding hubs if splines are rounded, battered or chipped.' }, { n: 33, text: 'Replace bent or damaged shift fork shafts.' }, { n: 34, text: 'Replace shift fork if excessively worn or showing signs of overheating.' }, { n: 35, text: 'Using a small square, verify that the shift forks are square, replace if not.' }, { n: 36, text: 'Replace shift drum assembly if drum or bearing are damaged.' }, { n: 37, text: 'Clean shift cam lock plate mounting holes in transmission bearing housing.' } ] },
{ id: 's25-transmission-assemble-gearset', bikeIds: ['softail-2025'], system: 'transmission', title: 'Assemble transmission gearset (mainshaft and countershaft)', summary: 'Install and assemble mainshaft and countershaft gears, bearings, dog rings, shift components, and shifter forks with proper torque.', difficulty: 'Hard', timeMinutes: 240, source: { manual: '2025 HD Softail Service Manual', page: '5-39' }, figures: [{ file: '/figures/softail-2025/p5-39.jpg', caption: 'Manual page 5-39' }], tools: ['press', 'torque wrench'], parts: [], torque: [{ fastener: 'Shift drum detent screw', value: '120-150 in-lbs (13.6-17 N·m)' }, { fastener: 'Shift drum lock plate screws', value: '50-70 in-lbs (5.6-7.9 N·m)' }, { fastener: 'Transmission mainshaft/countershaft locknuts', value: '85-95 ft-lbs (115.3-128.8 N·m)' }], steps: [{ n: 1, text: 'Install bearings in bearing housing by supporting bearing housing at bearing bores with flat plate.' }, { n: 2, text: 'Position new bearing over bore with number side up.' }, { n: 3, text: 'Press bearing until seated in bore.' }, { n: 4, text: 'Install new beveled retaining ring with flat side against bearing.' }, { n: 5, text: 'Install countershaft fourth, third and second gears.' }, { n: 6, text: 'Lubricate needle bearings and races using ASSEMBLY LUBE.' }, { n: 7, text: 'Install new needle bearing.' }, { n: 8, text: 'Install guiding hub.' }, { n: 9, text: 'Install dog ring.' }, { n: 10, text: 'Install securing segments with rounded edge facing up, verify segments engage grooves.' }, { n: 11, text: 'Install lock ring with waved, stepped face toward securing segments.' }, { n: 12, text: 'Repeat gear installation for third and second gears.' }, { n: 13, text: 'Preload scissor first gear by holding thick gear, rotate thin gear until holes align.' }, { n: 14, text: 'Install HD-52235 SCISSOR FIRST GEAR TOOL.' }, { n: 15, text: 'Install new needle bearing, countershaft first gear and washer.' }, { n: 16, text: 'Do not press directly on bearing inner race (damages bearing).' }, { n: 17, text: 'Support countershaft sixth gear in press.' }, { n: 18, text: 'Using suitable sleeve, press on bearing inner race until bearing contacts countershaft first gear washer.' }, { n: 19, text: 'If mainshaft is not removed, raise and hold countershaft third and fourth gear shift dog up while installing countershaft.' }, { n: 20, text: 'Install countershaft to bearing housing.' }, { n: 21, text: 'Support mainshaft fourth gear in press.' }, { n: 22, text: 'Raise and hold dog ring engaged with countershaft third gear during press procedure.' }, { n: 23, text: 'Using suitable sleeve, press on bearing inner race until bearing contacts mainshaft first gear.' }, { n: 24, text: 'With bearing housing on end (shafts pointing up), install new bearing and mainshaft fifth gear.' }, { n: 25, text: 'With guiding hub counterbore facing mainshaft fifth gear, install guiding hub and dog ring.' }, { n: 26, text: 'Install new retaining ring.' }, { n: 27, text: 'Remove holding tool from scissor first gear.' }, { n: 28, text: 'Install new mainshaft and countershaft locknuts by using dog rings to lock two gears in place.' }, { n: 29, text: 'Temporarily install transmission assembly in transmission case.' }, { n: 30, text: 'Install locknuts and tighten to 85-95 ft-lbs.' }, { n: 31, text: 'Remove transmission assembly from transmission case.' }, { n: 32, text: 'Set bearing housing on bench with shafts pointing up.' }, { n: 33, text: 'Install detent arm assembly if removed.' }, { n: 34, text: 'Clean detent screw mounting hole in transmission bearing housing.' }, { n: 35, text: 'Assemble new detent screw, detent arm, sleeve and detent spring.' }, { n: 36, text: 'Align spring and detent arm.' }, { n: 37, text: 'Install detent assembly in bearing housing with screw.' }, { n: 38, text: 'Tighten detent screw to 120-150 in-lbs.' }, { n: 39, text: 'Hold detent arm back and install shift cam assembly.' }, { n: 40, text: 'Install lock plate and new lock plate screws.' }, { n: 41, text: 'Tighten lock plate screws to 50-70 in-lbs.' }, { n: 42, text: 'Remove any burrs created on shift shafts during removal.' }, { n: 43, text: 'Install long shift shaft by inserting shifter fork into dog ring between mainshaft fifth and sixth gear.' }, { n: 44, text: 'Slide shift shaft through shifter fork.' }, { n: 45, text: 'Install shaft in bearing housing.' }, { n: 46, text: 'Install short shift shaft by inserting shifter fork into dog ring between countershaft third and fourth gear.' }, { n: 47, text: 'Slide shift shaft through shifter fork.' }, { n: 48, text: 'Install shaft in bearing housing.' }, { n: 49, text: 'Insert shifter fork into dog ring between countershaft first and second gear.' }, { n: 50, text: 'Slide shift shaft through shifter forks.' }, { n: 51, text: 'Install shaft in bearing housing.' }, { n: 52, text: 'Install transmission mainshaft bearing inner race.' }, { n: 53, text: 'Install clutch release cover.' }, { n: 54, text: 'Fill transmission oil.' }, { n: 55, text: 'Install engine oil fill spout.' }, { n: 56, text: 'Fill engine oil.' }, { n: 57, text: 'Install exhaust system.' }, { n: 58, text: 'Install primary chaincase housing.' }, { n: 59, text: 'Install primary chain, clutch, compensating sprocket and chain tensioner.' }, { n: 60, text: 'Install starter.' }, { n: 61, text: 'Install primary chaincase cover.' }, { n: 62, text: 'Fill primary chaincase oil.' }, { n: 63, text: 'Mid-mount controls: Install foot shift lever.' }, { n: 64, text: 'Install rider footboard and bracket, if removed.' }, { n: 65, text: 'Adjust drive belt deflection.' }, { n: 66, text: 'Verify rear fork pivot shaft torque.' }, { n: 67, text: 'Install main fuse.' } ] },
{ id: 's25-transmission-service-main-drive-gear-bearing', bikeIds: ['softail-2025'], system: 'transmission', title: 'Service main drive gear and bearing', summary: 'Remove, inspect, and install main drive gear with bearing, needle bearings, seals, and O-rings using specialized tools.', difficulty: 'Hard', timeMinutes: 180, source: { manual: '2025 HD Softail Service Manual', page: '5-44' }, figures: [{ file: '/figures/softail-2025/p5-44.jpg', caption: 'Manual page 5-44' }], tools: ['HD-35316-D main drive gear remover/installer', 'HD-47856 seal installer kit', 'HD-47932 bearing/seal installation tool', 'HD-47933 seal installer'], parts: [{ number: 'Retaining rings', description: 'Main drive gear retaining rings', qty: 2 }, { number: 'O-ring', description: 'Main drive gear O-ring', qty: 1 }], torque: [], steps: [{ n: 1, text: 'Remove main fuse.' }, { n: 2, text: 'Remove rider footboard and bracket, if needed.' }, { n: 3, text: 'Mid-mount controls: Remove foot shift lever.' }, { n: 4, text: 'Drain primary chaincase oil.' }, { n: 5, text: 'Remove primary chaincase cover.' }, { n: 6, text: 'Remove starter.' }, { n: 7, text: 'Remove primary chain, clutch and compensating sprocket.' }, { n: 8, text: 'Remove primary chaincase housing.' }, { n: 9, text: 'Remove bearing inner race from transmission mainshaft.' }, { n: 10, text: 'Remove transmission sprocket.' }, { n: 11, text: 'Remove transmission bearing housing and gear assembly.' }, { n: 12, text: 'Remove gear using MAIN DRIVE GEAR REMOVER AND INSTALLER SET (HD-35316-D).' }, { n: 13, text: 'Remove tool.' }, { n: 14, text: 'Remove large main drive gear oil seal.' }, { n: 15, text: 'Remove retaining ring from bearing bore.' }, { n: 16, text: 'Remove main drive gear bearing from transmission case using MAIN DRIVE GEAR REMOVER AND INSTALLER SET (HD-35316-D).' }, { n: 17, text: 'Discard main drive gear bearing.' }, { n: 18, text: 'Clean all parts in solvent except transmission case and needle bearings, dry with low-pressure compressed air.' }, { n: 19, text: 'Inspect main drive gear for pitting and wear.' }, { n: 20, text: 'Inspect needle bearings inside main drive gear.' }, { n: 21, text: 'Inspect mainshaft race and replace needle bearings if race is damaged.' }, { n: 22, text: 'Install main drive gear bearing using MAIN DRIVE GEAR REMOVER AND INSTALLER SET (HD-35316-D).' }, { n: 23, text: 'Install new O-ring onto main drive gear and lubricate with clean engine oil.' }, { n: 24, text: 'Install main drive gear using MAIN DRIVE GEAR REMOVER AND INSTALLER SET (HD-35316-D).' }, { n: 25, text: 'Install retaining ring with flat side facing bearing and opening within range shown.' }, { n: 26, text: 'Install new main drive gear large seal using MAIN DRIVE GEAR SEAL INSTALLER KIT (HD-47856).' }, { n: 27, text: 'Remove seal using seal remover or rolling head pry bar if replacing needle bearings.' }, { n: 28, text: 'Remove and discard mainshaft seal.' }, { n: 29, text: 'Remove and discard retaining rings.' }, { n: 30, text: 'Remove needle bearings.' }, { n: 31, text: 'Remove spacer from main drive gear.' }, { n: 32, text: 'Remove and discard O-ring.' }, { n: 33, text: 'Press outer needle bearing near spline end of main drive gear until tool contacts spline using MAIN DRIVE GEAR BEARING AND SEAL INSTALLATION TOOL (HD-47932).' }, { n: 34, text: 'Install mainshaft seal with garter spring side down using 0.090-in step of tool.' }, { n: 35, text: 'Press until tool contacts gear.' }, { n: 36, text: 'Turn over main drive gear and install spacer.' }, { n: 37, text: 'Press inner needle bearing from gear end until tool contacts gear using MAIN DRIVE GEAR BEARING AND SEAL INSTALLATION TOOL (HD-47932).' }, { n: 38, text: 'Install new retaining rings.' }, { n: 39, text: 'Install new O-ring.' }, { n: 40, text: 'Remove seal using seal remover or rolling head pry bar.' }, { n: 41, text: 'Verify bore is clean and smooth.' }, { n: 42, text: 'Place seal protector sleeve of MAIN DRIVE GEAR SEAL INSTALLER (HD-47933) over end of mainshaft.' }, { n: 43, text: 'Lightly lubricate protector sleeve and seal ID with clean transmission oil.' }, { n: 44, text: 'Slide seal on seal protector sleeve with garter spring facing bearing.' }, { n: 45, text: 'Hand press seal onto place until seal driver contacts end of main drive gear using MAIN DRIVE GEAR SEAL INSTALLER (HD-47933).' }, { n: 46, text: 'Lightly tap with rubber mallet if necessary.' }, { n: 47, text: 'Install bearing housing and gear assembly.' }, { n: 48, text: 'Install transmission sprocket.' }, { n: 49, text: 'Install bearing inner race to transmission mainshaft.' }, { n: 50, text: 'Install primary chaincase housing.' }, { n: 51, text: 'Install primary chain, clutch, compensating sprocket and chain tensioner.' }, { n: 52, text: 'Install starter.' }, { n: 53, text: 'Install primary chaincase cover and new gasket.' }, { n: 54, text: 'Fill primary chaincase oil.' }, { n: 55, text: 'Mid-mount controls: Install foot shift lever.' }, { n: 56, text: 'Install rider footboard and bracket, if removed.' }, { n: 57, text: 'Adjust drive belt deflection.' }, { n: 58, text: 'Verify rear fork pivot shaft torque.' }, { n: 59, text: 'Install main fuse.' } ] },
{ id: 's25-transmission-disassemble-case', bikeIds: ['softail-2025'], system: 'transmission', title: 'Disassemble transmission case', summary: 'Remove transmission from engine, disassemble shifter components and oil return tube from transmission case with full prep and removal steps.', difficulty: 'Hard', timeMinutes: 240, source: { manual: '2025 HD Softail Service Manual', page: '5-49' }, figures: [{ file: '/figures/softail-2025/p5-49.jpg', caption: 'Manual page 5-49' }], tools: ['jack', 'pry tool'], parts: [], torque: [], steps: [{ n: 1, text: 'Remove battery.' }, { n: 2, text: 'Remove battery tray.' }, { n: 3, text: 'Drain engine oil.' }, { n: 4, text: 'Drain transmission oil.' }, { n: 5, text: 'Drain primary chaincase oil.' }, { n: 6, text: 'Disconnect oil return line.' }, { n: 7, text: 'Remove exhaust system.' }, { n: 8, text: 'Remove clutch release cover.' }, { n: 9, text: 'Remove screw securing jiffy stand sensor, if equipped.' }, { n: 10, text: 'Remove rider footboard and bracket, if needed.' }, { n: 11, text: 'Mid-mount controls: Remove foot shift lever.' }, { n: 12, text: 'Remove primary chaincase cover.' }, { n: 13, text: 'Remove starter.' }, { n: 14, text: 'Remove primary chain, clutch and compensating sprocket.' }, { n: 15, text: 'Remove primary chaincase housing.' }, { n: 16, text: 'Loosen drive belt.' }, { n: 17, text: 'Remove transmission assembly.' }, { n: 18, text: 'Remove oil pan.' }, { n: 19, text: 'Position jack across lower frame to support rear of motorcycle, slide wooden blocks beneath crankcase.' }, { n: 20, text: 'Remove rear fork.' }, { n: 21, text: 'Disconnect gear position sensor.' }, { n: 22, text: 'Remove battery negative cable from ground post at top of transmission case.' }, { n: 23, text: 'Move aside harness that terminates at O2 sensor, starter solenoid, neutral switch and VSS.' }, { n: 24, text: 'Remove transmission shift lever.' }, { n: 25, text: 'Mark splines on transmission shift lever and shift shaft.' }, { n: 26, text: 'Remove pinch screw.' }, { n: 27, text: 'Pull lever from shaft.' }, { n: 28, text: 'In cross-wise pattern, remove four bolts securing transmission to engine.' }, { n: 29, text: 'Do not use hammer to remove transmission, gently pry away from crankcase using pry point if sticks or binds.' }, { n: 30, text: 'Move transmission rearward until two ring dowels in lower flange are free of crankcase.' }, { n: 31, text: 'Remove transmission case from rear of motorcycle.' }, { n: 32, text: 'Remove shifter rod lever.' }, { n: 33, text: 'Remove pinch screw.' }, { n: 34, text: 'Remove shifter rod lever from shifter pawl lever assembly.' }, { n: 35, text: 'Remove shifter pawl assembly.' }, { n: 36, text: 'Remove retaining ring, washer and seal.' }, { n: 37, text: 'Discard retaining ring and seal.' }, { n: 38, text: 'Remove shifter pawl lever assembly.' }, { n: 39, text: 'Inspect sleeve in transmission case.' }, { n: 40, text: 'If transmission case is installed in vehicle: disconnect battery.' }, { n: 41, text: 'Disconnect oil return hose from return tube.' }, { n: 42, text: 'Remove screws.' }, { n: 43, text: 'Remove oil return tube.' }, { n: 44, text: 'Clean all parts in solvent except case and main drive gear needle bearings, dry with low-pressure compressed air.' }, { n: 45, text: 'Inspect shifter pawl lever assembly for wear, replace if pawl ends are damaged.' }, { n: 46, text: 'Replace centering spring if elongated.' }, { n: 47, text: 'Inspect shifter shaft lever spring, replace if spring fails to hold pawl on cam pins.' }, { n: 48, text: 'Thoroughly clean oil pan.' }, { n: 49, text: 'Inspect transmission top cover vent hose for damage, verify hose and fitting are unobstructed.' } ] },
{ id: 's25-transmission-assemble-case', bikeIds: ['softail-2025'], system: 'transmission', title: 'Assemble transmission case', summary: 'Install transmission case shifter components, oil return tube, and transmission assembly into engine with proper gasket and torque sequencing.', difficulty: 'Hard', timeMinutes: 240, source: { manual: '2025 HD Softail Service Manual', page: '5-50' }, figures: [{ file: '/figures/softail-2025/p5-50.jpg', caption: 'Manual page 5-50' }], tools: ['torque wrench', 'HD-51337 shifter shaft seal installation tool'], parts: [{ number: 'Engine-to-transmission gasket', description: 'New gasket', qty: 1 }, { number: 'O-ring', description: 'Oil return tube adapter O-ring', qty: 1 }], torque: [{ fastener: 'Battery ground cable to transmission', value: '66-114 in-lbs (7.5-12.9 N·m)' }, { fastener: 'Transmission mounting bolts, 1st torque', value: '15 ft-lbs (20.3 N·m)' }, { fastener: 'Transmission mounting bolts, final torque', value: '34-39 ft-lbs (46.1-52.9 N·m)' }, { fastener: 'Oil return tube screw', value: '100-120 in-lbs (11.3-13.6 N·m)' }, { fastener: 'Shifter pawl centering screw', value: '18-23 ft-lbs (24.4-31.2 N·m)' }, { fastener: 'Shifter rod lever pinch screw, transmission lever', value: '18-22 ft-lbs (24.4-29.8 N·m)' }], steps: [{ n: 1, text: 'Install new ground post at top of transmission case, tighten until snug.' }, { n: 2, text: 'Wipe all engine oil from pockets in crankcase flange.' }, { n: 3, text: 'Install new engine-to-transmission gasket.' }, { n: 4, text: 'Verify transmission dowels are seated.' }, { n: 5, text: 'Place transmission case into position.' }, { n: 6, text: 'Secure transmission by installing shorter bolts at top, longer bolts at bottom, hand-tighten.' }, { n: 7, text: 'Tighten bolts in sequence shown to 1st torque (15 ft-lbs).' }, { n: 8, text: 'Tighten to final torque in same sequence (34-39 ft-lbs).' }, { n: 9, text: 'Secure battery ground cable to ground post at top of transmission case.' }, { n: 10, text: 'Tighten ground cable to 66-114 in-lbs.' }, { n: 11, text: 'Install new O-ring on lower oil tube adapter.' }, { n: 12, text: 'Install oil return tube.' }, { n: 13, text: 'Locate oil return tube between shift lever and transmission housing.' }, { n: 14, text: 'Install screws.' }, { n: 15, text: 'Tighten screws to 100-120 in-lbs.' }, { n: 16, text: 'If transmission case is installed in vehicle: connect oil return hose to return tube, secure with clamp.' }, { n: 17, text: 'Connect battery.' }, { n: 18, text: 'Press or drive out countershaft needle bearing using bearing driver 1.25 in (31.75 mm) in diameter.' }, { n: 19, text: 'Install new bearing from outside of transmission case.' }, { n: 20, text: 'Install bearing flush or to maximum depth of 0.030 in (0.76 mm) with outside surface of case.' }, { n: 21, text: 'Lubricate bearing with ASSEMBLY LUBE.' }, { n: 22, text: 'Verify sleeve is in transmission case bore.' }, { n: 23, text: 'Install screw into side of transmission case.' }, { n: 24, text: 'Tighten screw to 18-23 ft-lbs.' }, { n: 25, text: 'Slide shifter lever centering spring over shaft of shifter pawl lever assembly.' }, { n: 26, text: 'Align opening on spring with tab on lever.' }, { n: 27, text: 'Place shifter shaft lever spring on shifter pawl lever assembly, flex spring only enough to assemble.' }, { n: 28, text: 'Insert shifter arm assembly into transmission case.' }, { n: 29, text: 'Verify pin of screw sits inside shifter shaft lever spring.' }, { n: 30, text: 'Install new seal with garter spring facing transmission.' }, { n: 31, text: 'Drive seal until tool bottoms on transmission case using SHIFTER SHAFT SEAL INSTALLATION TOOL (HD-51337).' }, { n: 32, text: 'Install washer and new retaining ring.' }, { n: 33, text: 'Install shifter rod lever one spline from vertical toward front of vehicle.' }, { n: 34, text: 'Install shifter rod lever.' }, { n: 35, text: 'Install pinch screw.' }, { n: 36, text: 'Tighten pinch screw to 18-22 ft-lbs.' }, { n: 37, text: 'Connect gear position sensor.' }, { n: 38, text: 'Install rear fork.' }, { n: 39, text: 'Install oil pan.' }, { n: 40, text: 'Install transmission.' }, { n: 41, text: 'Install primary chaincase housing.' }, { n: 42, text: 'Install primary chain, clutch and compensating sprocket.' }, { n: 43, text: 'Connect oil return line.' }, { n: 44, text: 'Install starter.' }, { n: 45, text: 'Install primary chaincase cover and new gasket.' }, { n: 46, text: 'Mid-mount controls: Install foot shift lever.' }, { n: 47, text: 'Install rider footboard and bracket, if removed.' }, { n: 48, text: 'Install transmission shift linkage.' }, { n: 49, text: 'Install jiffy stand sensor, if removed.' }, { n: 50, text: 'Install clutch release cover.' }, { n: 51, text: 'Install exhaust system.' }, { n: 52, text: 'Fill primary chaincase.' }, { n: 53, text: 'Fill transmission.' }, { n: 54, text: 'Fill engine oil.' }, { n: 55, text: 'Adjust drive belt deflection.' }, { n: 56, text: 'Install battery tray.' }, { n: 57, text: 'Install battery.' }, { n: 58, text: 'Check engine oil level after running engine.' } ] },
// --- END SOFTAIL 2025 CHAPTER 5 JOBS ---

// --- BEGIN SOFTAIL 2025 CHAPTER 6 JOBS ---
{ id: 's25-fuel-replace-air-cleaner-backplate-round', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Air Cleaner Backplate: Round', summary: 'Remove and install round-style air cleaner backplate with throttle body seal.', difficulty: 'Easy', timeMinutes: 20, source: { manual: '2025 HD Softail Service Manual', page: '6-4' }, figures: [{ file: '/figures/softail-2025/p6-4.jpg', caption: 'Manual page 6-4' }], tools: ['Screwdriver set', 'Threadlocker (LOCTITE 243)'], parts: [], torque: [{ fastener: 'Air cleaner round, backplate to head screws', value: '19-21 ft-lbs (25.4-28.1 N·m)' }, { fastener: 'Air cleaner round, backplate to induction module screws', value: '4-5 ft-lbs (5.6-6.8 N·m)' }], steps: [{ n: 1, text: 'Remove air cleaner cover and filter.' }, { n: 2, text: 'See Figure 6-1. Remove backplate by removing screws (4).' }, { n: 3, text: 'Remove screws (2).' }, { n: 4, text: 'Remove breather hose (3) from breather connector.' }, { n: 5, text: 'Remove backplate (1).' }, { n: 6, text: 'Inspect filter seal (5) for wear or damage and replace if necessary.' }, { n: 7, text: 'Inspect throttle body seal (3) for wear or damage and replace if necessary.' }, { n: 8, text: 'Install throttle body seal by cleaning backplate and pressing seal onto backplate.' }, { n: 9, text: 'Install breather hose (3) to breather connector.', warning: 'Failure to connect breather hose allows crankcase vapors to be vented into the atmosphere.' }, { n: 10, text: 'Position backplate (1) on induction module.' }, { n: 11, text: 'Apply threadlocker LOCTITE 243 to screws (4) and install hand tight.' }, { n: 12, text: 'Apply threadlocker LOCTITE 243 to screws (2).' }, { n: 13, text: 'Install screws (2) and tighten to 19-21 ft-lbs.' }, { n: 14, text: 'Tighten screws (4) to 4-5 ft-lbs.' }, { n: 15, text: 'Install filter seal (5).' }] },
{ id: 's25-fuel-replace-air-cleaner-backplate-open-front', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Air Cleaner Backplate: Open Front', summary: 'Remove and install open-front-style air cleaner backplate with snorkel and seal ring.', difficulty: 'Easy', timeMinutes: 25, source: { manual: '2025 HD Softail Service Manual', page: '6-5' }, figures: [{ file: '/figures/softail-2025/p6-5.jpg', caption: 'Manual page 6-5' }], tools: ['Screwdriver set', 'Threadlocker (LOCTITE 565)'], parts: [], torque: [{ fastener: 'Air cleaner open front, backplate to cylinder head screws', value: '19-21 ft-lbs' }, { fastener: 'Air cleaner open front, backplate to induction module screws', value: '50-60 in-lbs' }, { fastener: 'Air cleaner open front, snorkel screws', value: '22-27 in-lbs' }], steps: [{ n: 1, text: 'Remove air cleaner cover and filter.' }, { n: 2, text: 'See Figure 6-3. Remove backplate assembly by removing screws (2).' }, { n: 3, text: 'Remove screws (3).' }, { n: 4, text: 'Tilt backplate assembly to disconnect breather hose.' }, { n: 5, text: 'See Figure 6-4. Remove snorkel by removing screws (6).' }, { n: 6, text: 'Remove snorkel (1).' }, { n: 7, text: 'Remove seal ring (4) if worn or damaged.' }, { n: 8, text: 'See Figure 6-4. Install snorkel (1) and screws (6). Tighten to 22-27 in-lbs.' }, { n: 9, text: 'Install backplate seal ring by cleaning backplate and aligning tab on seal.' }, { n: 10, text: 'Install breather hose to breather connector.', warning: 'Failure to connect breather hose allows crankcase vapors to be vented into the atmosphere.' }, { n: 11, text: 'See Figure 6-3. Position backplate assembly on induction module.' }, { n: 12, text: 'Apply threadlocker LOCTITE 565 to screws and install. Tighten to 50-60 in-lbs.' }, { n: 13, text: 'Install screws (3) and tighten to 19-21 ft-lbs.' }] },
{ id: 's25-fuel-replace-air-cleaner-backplate-cone', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Air Cleaner Backplate: Cone', summary: 'Remove and install cone-style air cleaner backplate with throttle body cover.', difficulty: 'Easy', timeMinutes: 25, source: { manual: '2025 HD Softail Service Manual', page: '6-6' }, figures: [{ file: '/figures/softail-2025/p6-6.jpg', caption: 'Manual page 6-6' }], tools: ['Screwdriver set', 'Threadlocker (LOCTITE 565)'], parts: [], torque: [{ fastener: 'Air cleaner cone, backplate to head screws', value: '19-21 ft-lbs' }, { fastener: 'Air cleaner cone, backplate to induction module screws', value: '50-60 in-lbs' }, { fastener: 'Air cleaner cone, throttle body cover to base plate screws', value: '43-53 in-lbs' }], steps: [{ n: 1, text: 'Remove air cleaner cover and filter.' }, { n: 2, text: 'See Figure 6-5. Remove backplate assembly by removing screws.' }, { n: 3, text: 'Remove screws.' }, { n: 4, text: 'Remove breather hose from breather connector.' }, { n: 5, text: 'Remove backplate (4).' }, { n: 6, text: 'See Figure 6-6. Remove throttle body cover by removing screws (3).' }, { n: 7, text: 'Remove throttle body cover (4).' }, { n: 8, text: 'Remove seal (2).' }, { n: 9, text: 'Inspect seal for wear or damage and replace if necessary.' }, { n: 10, text: 'See Figure 6-6. Install throttle body cover on baseplate (5).' }, { n: 11, text: 'Install screws (3) and tighten to 43-53 in-lbs.' }, { n: 12, text: 'Install backplate seal by cleaning backplate and pressing seal onto backplate.' }, { n: 13, text: 'Install breather hose to breather hose fitting.', warning: 'Failure to connect breather hose allows crankcase vapors to be vented into the atmosphere.' }, { n: 14, text: 'Apply threadlocker LOCTITE 565 to screws and install hand tight.' }, { n: 15, text: 'Apply threadlocker LOCTITE 565 to screws.' }, { n: 16, text: 'Install screws and tighten to 19-21 ft-lbs.' }, { n: 17, text: 'Tighten screws to 50-60 in-lbs.' }, { n: 18, text: 'Install filter and air cleaner cover.' }] },
{ id: 's25-fuel-replace-console-no-instrument', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Console: No Instrument', summary: 'Remove and install console without instrument cluster or display.', difficulty: 'Easy', timeMinutes: 15, source: { manual: '2025 HD Softail Service Manual', page: '6-8' }, figures: [{ file: '/figures/softail-2025/p6-8.jpg', caption: 'Manual page 6-8' }], tools: ['Screwdriver set'], parts: [], torque: [{ fastener: 'Console screw, front, no instrument', value: '30-50 in-lbs' }, { fastener: 'Console screw, rear, no instrument', value: '25-30 in-lbs' }], steps: [{ n: 1, text: 'Remove main fuse.' }, { n: 2, text: 'Remove seat.' }, { n: 3, text: 'See Figure 6-7. Remove front screw (2).' }, { n: 4, text: 'Remove rear screw (4).' }, { n: 5, text: 'Remove console (3).' }, { n: 6, text: 'Remove medallion (1) if necessary.' }, { n: 7, text: 'Install medallion if removed.' }, { n: 8, text: 'Align console with bracket.' }, { n: 9, text: 'Install front screw and tighten to 30-50 in-lbs.' }, { n: 10, text: 'Install rear screw and tighten to 25-30 in-lbs.' }, { n: 11, text: 'Install seat.' }] },
{ id: 's25-fuel-replace-console-single-instrument-with-panel', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Console: Single Instrument With Panel', summary: 'Remove and install console with single instrument and gauge panel.', difficulty: 'Moderate', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '6-8' }, figures: [{ file: '/figures/softail-2025/p6-8.jpg', caption: 'Manual page 6-8' }], tools: ['Screwdriver set', 'Wire crimpers'], parts: [], torque: [{ fastener: 'Console screw (Front)', value: '30-50 in-lbs' }, { fastener: 'Console screw (Rear)', value: '25-30 in-lbs' }], steps: [{ n: 1, text: 'Remove main fuse.' }, { n: 2, text: 'Remove seat.' }, { n: 3, text: 'See Figure 6-8. Remove front screw (1).' }, { n: 4, text: 'Remove rear screw (4).' }, { n: 5, text: 'Move console (2) rearward.' }, { n: 6, text: 'See Figure 6-9. Remove grommet from backbone.' }, { n: 7, text: 'Pull harness from backbone.' }, { n: 8, text: 'Disconnect connector (3).' }, { n: 9, text: 'Remove console.' }, { n: 10, text: 'Connect connector (3).' }, { n: 11, text: 'Feed harness into backbone.' }, { n: 12, text: 'Position grommet into backbone.' }, { n: 13, text: 'Align console with bracket.' }, { n: 14, text: 'Install front screw and tighten to 30-50 in-lbs.' }, { n: 15, text: 'Install rear screw and tighten to 25-30 in-lbs.' }, { n: 16, text: 'Install seat.' }, { n: 17, text: 'Install main fuse.' }] },
{ id: 's25-fuel-replace-console-single-instrument-without-panel', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Console: Single Instrument Without Panel', summary: 'Remove and install console with single instrument without gauge panel.', difficulty: 'Moderate', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '6-9' }, figures: [{ file: '/figures/softail-2025/p6-9.jpg', caption: 'Manual page 6-9' }], tools: ['Screwdriver set', 'Wire crimpers'], parts: [], torque: [{ fastener: 'Console screws', value: '40-50 in-lbs' }], steps: [{ n: 1, text: 'Remove main fuse.' }, { n: 2, text: 'Remove seat.' }, { n: 3, text: 'See Figure 6-10. Remove screws (1).' }, { n: 4, text: 'Move console (2) rearward.' }, { n: 5, text: 'See Figure 6-11. Remove grommet from backbone.' }, { n: 6, text: 'Pull harness from backbone.' }, { n: 7, text: 'Disconnect connector (3).' }, { n: 8, text: 'Remove console.' }, { n: 9, text: 'Connect connector (3).' }, { n: 10, text: 'Feed harness into backbone.' }, { n: 11, text: 'Seat grommet into backbone.' }, { n: 12, text: 'Align console with bracket.' }, { n: 13, text: 'Install screws and tighten to 40-50 in-lbs.' }, { n: 14, text: 'Install seat.' }, { n: 15, text: 'Install main fuse.' }] },
{ id: 's25-fuel-test-fuel-pressure', bikeIds: ['softail-2025'], system: 'fuel', title: 'Test Fuel Pressure', summary: 'Connect fuel pressure gauge to test system pressure and compare to specifications.', difficulty: 'Moderate', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '6-11' }, figures: [{ file: '/figures/softail-2025/p6-11.jpg', caption: 'Manual page 6-11' }], tools: ['Fuel Pressure Gauge (HD-41182)'], parts: [], torque: [], steps: [{ n: 1, text: 'Remove seat.', warning: 'Gasoline is extremely flammable and highly explosive. Keep gasoline away from ignition sources.' }, { n: 2, text: 'Purge fuel system.', warning: 'To prevent spray of fuel, purge system of high-pressure fuel before supply line is disconnected.' }, { n: 3, text: 'See Figure 6-12. Attach valve union (2) on fuel pressure gauge to schrader valve on fuel line.' }, { n: 4, text: 'Close fuel valve.' }, { n: 5, text: 'Insert clear tube of fuel pressure gauge into suitable container.' }, { n: 6, text: 'Start engine.' }, { n: 7, text: 'Open fuel valve.' }, { n: 8, text: 'Open clear tube bleeder valve to remove air.' }, { n: 9, text: 'Close clear tube bleeder valve.' }, { n: 10, text: 'Operate engine at various speeds and note pressure gauge readings.' }, { n: 11, text: 'Compare readings to Table 6-2 specifications.' }, { n: 12, text: 'Turn off engine.' }, { n: 13, text: 'Open clear tube bleeder to remove pressure from gauge.' }, { n: 14, text: 'Remove fuel pressure tester.' }, { n: 15, text: 'Secure fuel tank and install seat.' }] },
{ id: 's25-fuel-purge-fuel-line', bikeIds: ['softail-2025'], system: 'fuel', title: 'Purge Fuel Line', summary: 'Disable fuel pump and purge fuel system of high-pressure fuel before disconnecting fuel lines.', difficulty: 'Easy', timeMinutes: 15, source: { manual: '2025 HD Softail Service Manual', page: '6-12' },
  figures: [{ file: '/figures/softail-2025/p6-12.jpg', caption: 'Manual page 6-12' }], tools: ['Digital Technician II (HD-48650)'], parts: [], torque: [{ fastener: 'Fuel tank mounting screw', value: '28-32 ft-lbs' }], steps: [{ n: 1, text: 'Remove seat.', warning: 'Gasoline is extremely flammable and highly explosive.' }, { n: 2, text: 'See Figure 6-13. Loosen front fuel tank mounting screw.' }, { n: 3, text: 'Remove rear fuel tank mounting screw, washers, and acorn nut.' }, { n: 4, text: 'Lift rear of fuel tank.' }, { n: 5, text: 'Disconnect fuel pump connector.' }, { n: 6, text: 'Purge fuel line using Digital Technician II or manual purge method.' }, { n: 7, text: 'Allow vehicle to stall.' }, { n: 8, text: 'Operate starter for 3 seconds to remove remaining fuel.' }, { n: 9, text: 'Reconnect fuel pump connector.' }, { n: 10, text: 'Install rear fuel tank mounting screw and tighten to 28-32 ft-lbs.' }, { n: 11, text: 'Tighten front fuel tank mounting screw to 28-32 ft-lbs.' }, { n: 12, text: 'Install seat.' }] },
{ id: 's25-fuel-replace-fuel-line', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Fuel Line', summary: 'Remove and install fuel supply line connecting fuel tank to fuel rail with quick disconnect fitting.', difficulty: 'Moderate', timeMinutes: 60, source: { manual: '2025 HD Softail Service Manual', page: '6-13' }, figures: [{ file: '/figures/softail-2025/p6-13.jpg', caption: 'Manual page 6-13' }], tools: ['Socket set', 'Torque wrench'], parts: [{ number: '61100100', description: 'O-ring for fuel line', qty: 1 }], torque: [{ fastener: 'Fuel line to fuel rail screw', value: '22-40 in-lbs' }], steps: [{ n: 1, text: 'Remove seat.', warning: 'Gasoline is extremely flammable and highly explosive.' }, { n: 2, text: 'Purge fuel system.', warning: 'To prevent spray of fuel, purge system before disconnecting supply line.' }, { n: 3, text: 'Remove main fuse.' }, { n: 4, text: 'Remove air cleaner.' }, { n: 5, text: 'Remove air cleaner backplate assembly.' }, { n: 6, text: 'See Figure 6-16. Push up on sleeve of quick disconnect fitting.' }, { n: 7, text: 'Remove fuel line from quick disconnect fitting.' }, { n: 8, text: 'See Figure 6-15. Remove screw attaching fuel line to fuel rail.' }, { n: 9, text: 'Pull fuel line away from fuel rail.' }, { n: 10, text: 'Inspect O-ring for damage and replace as necessary.' }, { n: 11, text: 'Install new O-ring to fuel line if removed.' }, { n: 12, text: 'Connect fuel line to fuel rail.' }, { n: 13, text: 'Install screw and tighten to 22-40 in-lbs.' }, { n: 14, text: 'Press up on sleeve of quick disconnect fitting.' }, { n: 15, text: 'Connect fuel line to quick disconnect fitting.' }, { n: 16, text: 'Release sleeve of quick disconnect fitting to secure fuel line.' }, { n: 17, text: 'Tug on fuel line to verify it is locked in position.' }, { n: 18, text: 'Install air cleaner backplate assembly.' }, { n: 19, text: 'Install air cleaner.' }, { n: 20, text: 'Install main fuse.' }, { n: 21, text: 'Set OFF/RUN switch to RUN and check for leaks.' }, { n: 22, text: 'Install seat.' }] },
{ id: 's25-fuel-replace-fuel-tank', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Fuel Tank', summary: 'Remove and install fuel tank with fuel pump connector, vent lines, and mounting hardware.', difficulty: 'Hard', timeMinutes: 120, source: { manual: '2025 HD Softail Service Manual', page: '6-15' }, figures: [{ file: '/figures/softail-2025/p6-15.jpg', caption: 'Manual page 6-15' }], tools: ['Socket set', 'Torque wrench', 'Jack', 'Jack stands'], parts: [{ number: '61100322', description: 'Fuel tank mounting screw', qty: 2 }, { number: '7637', description: 'Washer', qty: 4 }, { number: '7637X', description: 'Acorn nut', qty: 2 }], torque: [{ fastener: 'Fuel tank, vent screws', value: '11-13 ft-lbs' }], steps: [{ n: 1, text: 'Remove seat.', warning: 'Gasoline is extremely flammable and highly explosive.' }, { n: 2, text: 'Purge fuel system.' }, { n: 3, text: 'Remove main fuse.', warning: 'To prevent spray of fuel, purge system before disconnecting supply line.' }, { n: 4, text: 'Disconnect fuel line at quick disconnect fitting.' }, { n: 5, text: 'Disconnect vent line.' }, { n: 6, text: 'Drain fuel tank.' }, { n: 7, text: 'If equipped, disconnect fuel tank console connector.' }, { n: 8, text: 'If necessary, remove console.' }, { n: 9, text: 'See Figure 6-17. Remove front fuel tank mounting screw, washers, and acorn nut.' }, { n: 10, text: 'Remove fuel tank.' }, { n: 11, text: 'Remove bushings and grommets if necessary.' }, { n: 12, text: 'See Figure 6-18. Note: Vent screws in fuel tank are for manufacturing and not intended to be removed.' }, { n: 13, text: 'Install bushings and grommets if removed.' }, { n: 14, text: 'Place fuel tank onto frame backbone.' }, { n: 15, text: 'Loosely install front fuel tank mounting screw, washers, and acorn nut.' }, { n: 16, text: 'Connect vent line.' }, { n: 17, text: 'Connect fuel line at quick disconnect fitting.' }, { n: 18, text: 'See Figure 6-13. Install rear fuel tank mounting screw and tighten to 28-32 ft-lbs.' }, { n: 19, text: 'Tighten front fuel tank mounting screw to 28-32 ft-lbs.' }, { n: 20, text: 'If equipped, install console and connect console connector.' }, { n: 21, text: 'Install seat.' }, { n: 22, text: 'Install main fuse.' }, { n: 23, text: 'Set OFF/RUN switch to RUN and check for leaks.' }] },
{ id: 's25-fuel-replace-fuel-pump', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Fuel Pump', summary: 'Remove and install fuel pump assembly with level sender, filter, pressure regulator, and inlet strainer.', difficulty: 'Hard', timeMinutes: 90, source: { manual: '2025 HD Softail Service Manual', page: '6-17' }, figures: [{ file: '/figures/softail-2025/p6-17.jpg', caption: 'Manual page 6-17' }], tools: ['Socket set', 'Torque wrench', 'Wooden tool'], parts: [{ number: '61100161', description: 'Fuel pump assembly seal', qty: 1 }, { number: '61100160', description: 'Fuel pump inlet strainer', qty: 1 }, { number: '61100158', description: 'Fuel filter', qty: 1 }, { number: '61100157', description: 'Pressure regulator', qty: 1 }], torque: [{ fastener: 'Fuel pump assembly screws', value: '40-45 in-lbs' }, { fastener: 'Fuel pump, quick connector', value: '22-26 ft-lbs' }], steps: [{ n: 1, text: 'Remove seat.', warning: 'Gasoline is extremely flammable and highly explosive.' }, { n: 2, text: 'Purge fuel system.' }, { n: 3, text: 'Remove main fuse.', warning: 'To prevent spray of fuel, purge system before disconnecting supply line.' }, { n: 4, text: 'Remove fuel tank.' }, { n: 5, text: 'See Figure 6-20. Remove fuel pump assembly by removing screws.' }, { n: 6, text: 'Using a wooden tool, pull inlet strainer from fuel tank.' }, { n: 7, text: 'Remove fuel pump assembly.' }, { n: 8, text: 'Discard seal.' }, { n: 9, text: 'See Figure 6-20. Clean and inspect fuel pump assembly.' }, { n: 10, text: 'Inspect inlet strainer for damage and replace if necessary.' }, { n: 11, text: 'Clean fuel pump assembly.', warning: 'Do not use solvents or products containing chlorine on plastic fuel system components.' }, { n: 12, text: 'Remove level sender by disconnecting electrical connector.' }, { n: 13, text: 'Pull tab to release level sender and slide down bracket.' }, { n: 14, text: 'Remove level sender.' }, { n: 15, text: 'Remove quick connector and discard O-ring.' }, { n: 16, text: 'Remove and discard pressure regulator and O-ring.' }, { n: 17, text: 'Remove fuel filter by pushing clip and removing filter cover.' }, { n: 18, text: 'Remove and discard fuel filter and O-ring.' }, { n: 19, text: 'Remove pump retainer by pressing tabs.' }, { n: 20, text: 'Disconnect electrical connectors.' }, { n: 21, text: 'Remove pump.' }, { n: 22, text: 'Disconnect hose.' }, { n: 23, text: 'Remove and discard inlet strainer.' }, { n: 24, text: 'If necessary, remove and inspect grommet.' }, { n: 25, text: 'Install new seal.' }, { n: 26, text: 'Install level sender by aligning in bracket slot.' }, { n: 27, text: 'Slide level sender up to engage tab.' }, { n: 28, text: 'Connect electrical connector.' }, { n: 29, text: 'Install new pressure regulator and O-ring.' }, { n: 30, text: 'Install clip and lock under retainer.' }, { n: 31, text: 'Install new filter and O-ring.' }, { n: 32, text: 'Install filter cover until it locks.' }, { n: 33, text: 'Install pump.' }, { n: 34, text: 'Connect hose and electrical connector.' }, { n: 35, text: 'Install pump retainer.' }, { n: 36, text: 'If necessary, install new grommet.' }, { n: 37, text: 'Install new inlet strainer in proper orientation.' }, { n: 38, text: 'Insert siphon tube into fuel tank if equipped. Route to opposite side of tank.' }, { n: 39, text: 'Insert fuel level sender float into fuel tank. Do not bend float rod.' }, { n: 40, text: 'Insert fuel pump assembly halfway into fuel tank.' }, { n: 41, text: 'Insert inlet strainer into fuel tank.' }, { n: 42, text: 'Install fuel pump assembly and screws.' }, { n: 43, text: 'See Figure 6-21. Tighten in sequence. Torque: 40-45 in-lbs.' }, { n: 44, text: 'Install fuel tank.' }, { n: 45, text: 'Install seat.' }, { n: 46, text: 'Install main fuse.' }, { n: 47, text: 'Add at least 3.8 L (1 gal) of fuel to tank before operating pump.' }, { n: 48, text: 'Set OFF/RUN switch to RUN and check for leaks.' }] },
{ id: 's25-fuel-replace-vent-tube', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Vent Tube', summary: 'Remove and install fuel tank vent lines with new hose clamps and cable straps.', difficulty: 'Hard', timeMinutes: 120, source: { manual: '2025 HD Softail Service Manual', page: '6-21' }, figures: [{ file: '/figures/softail-2025/p6-21.jpg', caption: 'Manual page 6-21' }], tools: ['Hose clamp pliers (HD-41137)', 'Socket set'], parts: [], torque: [], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Remove left side cover.' }, { n: 3, text: 'Remove main fuse.' }, { n: 4, text: 'Remove right side cover.' }, { n: 5, text: 'Remove battery.' }, { n: 6, text: 'Remove battery tray.' }, { n: 7, text: 'Remove ECM.' }, { n: 8, text: 'Remove ECM caddy.' }, { n: 9, text: 'Remove mud guard.' }, { n: 10, text: 'See Figure 6-28. Remove upper vent line by removing and discarding clamp.' }, { n: 11, text: 'Disconnect upper vent line from fuel tank.' }, { n: 12, text: 'Remove vent line from clip.' }, { n: 13, text: 'Remove and discard cable strap.' }, { n: 14, text: 'See Figure 6-29. Remove and discard clamp.' }, { n: 15, text: 'Disconnect upper vent line from vapor valve.' }, { n: 16, text: 'Remove upper vent line.' }, { n: 17, text: 'Remove lower vent line by removing and discarding clamp.' }, { n: 18, text: 'Disconnect lower vent line hose from vapor valve.' }, { n: 19, text: 'Remove lower vent line from purge caddy clips.' }, { n: 20, text: 'Remove lower vent line.' }, { n: 21, text: 'See Figure 6-29. Inspect O-rings on vent tube and verify proper location.' }, { n: 22, text: 'Install lower vent line.' }, { n: 23, text: 'Route lower vent line as shown in Figure 6-29.' }, { n: 24, text: 'Connect lower vent line to vapor valve.' }, { n: 25, text: 'Install new clamp using hose clamp pliers.' }, { n: 26, text: 'Snap lower vent line into purge caddy.' }, { n: 27, text: 'Install purge caddy.' }, { n: 28, text: 'Install upper vent line.' }, { n: 29, text: 'Route upper vent line as shown in Figure 6-28.' }, { n: 30, text: 'Connect hose to fuel tank.' }, { n: 31, text: 'Install new clamp using hose clamp pliers.' }, { n: 32, text: 'Install new cable strap securing harness and vent line.' }, { n: 33, text: 'Connect upper vent line to vapor valve.' }, { n: 34, text: 'Install new clamp. Inspect all lines for wear or damage.' }, { n: 35, text: 'Install ECM caddy.' }, { n: 36, text: 'Install ECM.' }, { n: 37, text: 'Install mud guard.' }, { n: 38, text: 'Install battery tray.' }, { n: 39, text: 'Install battery.' }, { n: 40, text: 'Install right side cover and closeout cover.' }, { n: 41, text: 'Install left side cover.' }, { n: 42, text: 'Install seat.' }] },
{ id: 's25-fuel-replace-vapor-valve', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Vapor Valve', summary: 'Remove and install vapor control valve on fuel tank vent system.', difficulty: 'Moderate', timeMinutes: 45, source: { manual: '2025 HD Softail Service Manual', page: '6-23' }, figures: [{ file: '/figures/softail-2025/p6-23.jpg', caption: 'Manual page 6-23' }], tools: ['Socket set', 'Hose clamp pliers'], parts: [], torque: [], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Purge fuel system.' }, { n: 3, text: 'Disconnect vent lines from vapor valve.' }, { n: 4, text: 'Remove vapor valve from fuel tank mounting point.' }, { n: 5, text: 'Install new vapor valve onto fuel tank mounting point.' }, { n: 6, text: 'Connect upper vent line to vapor valve.' }, { n: 7, text: 'Connect lower vent line to vapor valve.' }, { n: 8, text: 'Install new hose clamps on all connections.' }, { n: 9, text: 'Verify all connections are secure.' }, { n: 10, text: 'Install seat.' }] },
{ id: 's25-fuel-replace-tmap-sensor', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace TMAP Sensor', summary: 'Remove and install temperature manifold absolute pressure sensor on induction module.', difficulty: 'Easy', timeMinutes: 20, source: { manual: '2025 HD Softail Service Manual', page: '6-24' }, figures: [{ file: '/figures/softail-2025/p6-24.jpg', caption: 'Manual page 6-24' }], tools: ['Socket set', 'Torque wrench'], parts: [], torque: [{ fastener: 'Temperature manifold absolute pressure (TMAP) screw', value: '22-40 in-lbs' }], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Remove main fuse.' }, { n: 3, text: 'Remove air cleaner.' }, { n: 4, text: 'See Figure 6-31. Connect TMAP connector.' }, { n: 5, text: 'Remove screw holding TMAP sensor.' }, { n: 6, text: 'Remove TMAP sensor from induction module.' }, { n: 7, text: 'Install new TMAP sensor.' }, { n: 8, text: 'Install screw and tighten to 22-40 in-lbs.' }, { n: 9, text: 'Connect TMAP connector.' }, { n: 10, text: 'Install air cleaner.' }, { n: 11, text: 'Install main fuse.' }, { n: 12, text: 'Install seat.' }] },
{ id: 's25-fuel-replace-twist-grip-sensor', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Twist Grip Sensor', summary: 'Remove and install twist grip throttle position sensor on handlebar.', difficulty: 'Moderate', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '6-25' }, figures: [{ file: '/figures/softail-2025/p6-25.jpg', caption: 'Manual page 6-25' }], tools: ['Screwdriver set', 'Wire crimpers'], parts: [], torque: [], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Remove main fuse.' }, { n: 3, text: 'Remove air cleaner.' }, { n: 4, text: 'Remove handlebar grips if necessary.' }, { n: 5, text: 'Disconnect twist grip sensor electrical connector.' }, { n: 6, text: 'Remove twist grip sensor mounting screws.' }, { n: 7, text: 'Remove twist grip sensor.' }, { n: 8, text: 'Draw harness into handlebar while guiding TGS into place.' }, { n: 9, text: 'Install new twist grip sensor.' }, { n: 10, text: 'Connect twist grip sensor electrical connector.' }, { n: 11, text: 'Install twist grip sensor mounting screws and tighten.' }, { n: 12, text: 'Install handlebar grips if removed.' }, { n: 13, text: 'Install air cleaner.' }, { n: 14, text: 'Install main fuse.' }, { n: 15, text: 'Install seat.' }] },
{ id: 's25-fuel-replace-fuel-injectors', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Fuel Injectors', summary: 'Remove and install fuel injector assemblies on fuel rail.', difficulty: 'Moderate', timeMinutes: 45, source: { manual: '2025 HD Softail Service Manual', page: '6-27' }, figures: [{ file: '/figures/softail-2025/p6-27.jpg', caption: 'Manual page 6-27' }], tools: ['Screwdriver set', 'Torque wrench'], parts: [], torque: [{ fastener: 'Fuel rail screws', value: '31-49 in-lbs' }], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Purge fuel system.' }, { n: 3, text: 'Remove main fuse.' }, { n: 4, text: 'Remove air cleaner.' }, { n: 5, text: 'Remove air cleaner backplate assembly.' }, { n: 6, text: 'Disconnect fuel injector connectors.' }, { n: 7, text: 'Disconnect fuel line from fuel rail.' }, { n: 8, text: 'Remove fuel rail mounting screws.' }, { n: 9, text: 'Remove fuel rail assembly.' }, { n: 10, text: 'Remove fuel injectors from fuel rail.' }, { n: 11, text: 'Inspect injector O-rings for wear or damage.' }, { n: 12, text: 'Install new fuel injectors into fuel rail.' }, { n: 13, text: 'Install fuel rail onto induction module.' }, { n: 14, text: 'Install fuel rail screws and tighten to 31-49 in-lbs.' }, { n: 15, text: 'Connect fuel line to fuel rail.' }, { n: 16, text: 'Connect fuel injector connectors.' }, { n: 17, text: 'Install air cleaner backplate assembly.' }, { n: 18, text: 'Install air cleaner.' }, { n: 19, text: 'Install main fuse.' }, { n: 20, text: 'Install seat.' }] },
{ id: 's25-fuel-replace-induction-module', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Induction Module', summary: 'Remove and install complete induction module assembly with all sensors and injectors.', difficulty: 'Hard', timeMinutes: 90, source: { manual: '2025 HD Softail Service Manual', page: '6-29' }, figures: [{ file: '/figures/softail-2025/p6-29.jpg', caption: 'Manual page 6-29' }], tools: ['Socket set', 'Torque wrench', 'Screwdriver set'], parts: [], torque: [{ fastener: 'Induction module screw torque step 1', value: '16-20 in-lbs' }, { fastener: 'Induction module screw torque step 2', value: '8-13 ft-lbs' }, { fastener: 'Throttle body to manifold screws', value: '35-53 in-lbs' }], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Remove main fuse.' }, { n: 3, text: 'Purge fuel system.' }, { n: 4, text: 'Remove air cleaner.' }, { n: 5, text: 'Remove air cleaner backplate assembly.' }, { n: 6, text: 'Disconnect all induction module sensor connectors.' }, { n: 7, text: 'Disconnect fuel injector connectors.' }, { n: 8, text: 'Disconnect fuel line from fuel rail.' }, { n: 9, text: 'Remove fuel inlet line screws.' }, { n: 10, text: 'Remove induction module mounting screws.' }, { n: 11, text: 'Remove induction module from cylinder head.' }, { n: 12, text: 'Remove gasket from induction module mounting surface.' }, { n: 13, text: 'Install new gasket on cylinder head.' }, { n: 14, text: 'Install new induction module onto cylinder head.' }, { n: 15, text: 'Install induction module mounting screws.' }, { n: 16, text: 'Tighten screws. First torque: 16-20 in-lbs.' }, { n: 17, text: 'Final torque: 8-13 ft-lbs.' }, { n: 18, text: 'Connect fuel inlet line screws.' }, { n: 19, text: 'Connect fuel line to fuel rail.' }, { n: 20, text: 'Connect fuel injector connectors.' }, { n: 21, text: 'Connect all induction module sensor connectors.' }, { n: 22, text: 'Install air cleaner backplate assembly.' }, { n: 23, text: 'Install air cleaner.' }, { n: 24, text: 'Install main fuse.' }, { n: 25, text: 'Install seat.' }] },
{ id: 's25-fuel-test-intake-leak', bikeIds: ['softail-2025'], system: 'fuel', title: 'Test Intake Leak', summary: 'Test induction system for air leaks using leak test equipment with pressure gauge.', difficulty: 'Moderate', timeMinutes: 45, source: { manual: '2025 HD Softail Service Manual', page: '6-33' },
  figures: [{ file: '/figures/softail-2025/p6-33.jpg', caption: 'Manual page 6-33' }], tools: ['Intake Leak Tester'], parts: [], torque: [], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Remove main fuse.' }, { n: 3, text: 'Remove air cleaner cover.' }, { n: 4, text: 'Install intake leak test equipment per tool manufacturer instructions.' }, { n: 5, text: 'Apply test pressure to induction system.' }, { n: 6, text: 'Observe gauge readings on leak tester.' }, { n: 7, text: 'Listen for audible leaks and visually inspect all connections.' }, { n: 8, text: 'Mark any suspected leak locations.' }, { n: 9, text: 'Apply soapy water solution to suspected leak areas.' }, { n: 10, text: 'Release test pressure from system.' }, { n: 11, text: 'Remove leak test equipment.' }, { n: 12, text: 'Install air cleaner cover.' }, { n: 13, text: 'Install main fuse.' }, { n: 14, text: 'Install seat.' }] },
{ id: 's25-exhaust-replace-heated-oxygen-sensors', bikeIds: ['softail-2025'], system: 'exhaust', title: 'Replace Heated Oxygen Sensors', summary: 'Remove and install front, rear, and optional third heated oxygen sensors (HO2S) in exhaust system.', difficulty: 'Moderate', timeMinutes: 45, source: { manual: '2025 HD Softail Service Manual', page: '6-34' }, figures: [{ file: '/figures/softail-2025/p6-34.jpg', caption: 'Manual page 6-34' }], tools: ['Oxygen sensor socket', 'Torque wrench'], parts: [], torque: [{ fastener: 'HO2S (Heated oxygen sensor)', value: '12-14 ft-lbs' }], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Remove main fuse.' }, { n: 3, text: 'Allow engine to cool before handling oxygen sensors.' }, { n: 4, text: 'Disconnect front HO2S electrical connector.' }, { n: 5, text: 'Remove front HO2S using oxygen sensor socket.' }, { n: 6, text: 'Disconnect rear HO2S electrical connector.' }, { n: 7, text: 'Remove rear HO2S using oxygen sensor socket.' }, { n: 8, text: 'If equipped with third HO2S, disconnect its electrical connector.' }, { n: 9, text: 'Remove third HO2S using oxygen sensor socket.' }, { n: 10, text: 'Install new front HO2S and tighten to 12-14 ft-lbs.' }, { n: 11, text: 'Connect front HO2S electrical connector.' }, { n: 12, text: 'Install new rear HO2S and tighten to 12-14 ft-lbs.' }, { n: 13, text: 'Connect rear HO2S electrical connector.' }, { n: 14, text: 'If equipped, install new third HO2S and tighten to 12-14 ft-lbs.' }, { n: 15, text: 'If equipped, connect third HO2S electrical connector.' }, { n: 16, text: 'Install main fuse.' }, { n: 17, text: 'Install seat.' }] },
{ id: 's25-exhaust-replace-mufflers', bikeIds: ['softail-2025'], system: 'exhaust', title: 'Replace Mufflers', summary: 'Remove and install dual muffler assemblies with mounting clamps and heat shields.', difficulty: 'Moderate', timeMinutes: 60, source: { manual: '2025 HD Softail Service Manual', page: '6-36' }, figures: [{ file: '/figures/softail-2025/p6-36.jpg', caption: 'Manual page 6-36' }], tools: ['Socket set', 'Torque wrench'], parts: [], torque: [{ fastener: 'Muffler clamp', value: '38-43 ft-lbs' }, { fastener: 'Muffler screws', value: '120-144 in-lbs' }], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Allow engine to cool before working on exhaust system.' }, { n: 3, text: 'Remove main fuse.' }, { n: 4, text: 'Remove saddlebags if equipped.' }, { n: 5, text: 'Remove muffler clamps securing exhaust pipes to mufflers.' }, { n: 6, text: 'Remove muffler mounting bracket screws.' }, { n: 7, text: 'Remove muffler assemblies from motorcycle.' }, { n: 8, text: 'Remove heat shields from old mufflers if reusing.' }, { n: 9, text: 'Install heat shields on new mufflers.' }, { n: 10, text: 'Install new muffler assemblies onto motorcycle.' }, { n: 11, text: 'Install muffler mounting bracket screws.' }, { n: 12, text: 'Install muffler clamps and tighten to 38-43 ft-lbs.' }, { n: 13, text: 'Install muffler screws and tighten to 120-144 in-lbs.' }, { n: 14, text: 'Install saddlebags if equipped.' }, { n: 15, text: 'Install main fuse.' }, { n: 16, text: 'Install seat.' }] },
{ id: 's25-exhaust-replace-exhaust-system-standard', bikeIds: ['softail-2025'], system: 'exhaust', title: 'Replace Exhaust System: Standard', summary: 'Remove and install standard dual-pipe exhaust system with mounting brackets and heat shields.', difficulty: 'Hard', timeMinutes: 90, source: { manual: '2025 HD Softail Service Manual', page: '6-37' },
  figures: [{ file: '/figures/softail-2025/p6-37.jpg', caption: 'Manual page 6-37' }], tools: ['Socket set', 'Torque wrench'], parts: [], torque: [{ fastener: 'Exhaust to engine flange nuts', value: '100-120 in-lbs' }, { fastener: 'Exhaust bracket screws', value: '40-50 ft-lbs' }, { fastener: 'Exhaust shield clamps', value: '20-40 in-lbs' }, { fastener: 'Muffler screws', value: '120-144 in-lbs' }], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Allow engine to cool before working on exhaust.' }, { n: 3, text: 'Remove main fuse.' }, { n: 4, text: 'Remove saddlebags if equipped.' }, { n: 5, text: 'Disconnect oxygen sensors.' }, { n: 6, text: 'Remove mufflers.' }, { n: 7, text: 'Remove exhaust mounting bracket screws.' }, { n: 8, text: 'Remove exhaust flange nuts from engine.' }, { n: 9, text: 'Remove complete exhaust system from motorcycle.' }, { n: 10, text: 'Install new exhaust by aligning flanges with engine ports.' }, { n: 11, text: 'Install flange nuts and tighten to 100-120 in-lbs.' }, { n: 12, text: 'Install mounting bracket screws and tighten to 40-50 ft-lbs.' }, { n: 13, text: 'Install heat shield clamps and tighten to 20-40 in-lbs.' }, { n: 14, text: 'Install mufflers with screws. Tighten to 120-144 in-lbs.' }, { n: 15, text: 'Connect oxygen sensors.' }, { n: 16, text: 'Install saddlebags if equipped.' }, { n: 17, text: 'Install main fuse.' }, { n: 18, text: 'Install seat.' }] },
{ id: 's25-exhaust-replace-exhaust-system-two-into-one', bikeIds: ['softail-2025'], system: 'exhaust', title: 'Replace Exhaust System: Two Into One', summary: 'Remove and install two-into-one style exhaust with collector pipe and single muffler.', difficulty: 'Hard', timeMinutes: 90, source: { manual: '2025 HD Softail Service Manual', page: '6-37' }, figures: [{ file: '/figures/softail-2025/p6-37.jpg', caption: 'Manual page 6-37' }], tools: ['Socket set', 'Torque wrench'], parts: [], torque: [{ fastener: 'Exhaust to engine flange nuts', value: '100-120 in-lbs' }, { fastener: 'Exhaust bracket screws', value: '40-50 ft-lbs' }, { fastener: 'Muffler intermediate exhaust shield screw', value: '108-132 in-lbs' }, { fastener: 'Muffler shield clamps', value: '20-40 in-lbs' }, { fastener: 'Muffler screws', value: '120-144 in-lbs' }], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Allow engine to cool before working on exhaust.' }, { n: 3, text: 'Remove main fuse.' }, { n: 4, text: 'Remove saddlebags if equipped.' }, { n: 5, text: 'Disconnect oxygen sensors.' }, { n: 6, text: 'Remove muffler assembly.' }, { n: 7, text: 'Remove exhaust mounting bracket screws.' }, { n: 8, text: 'Remove exhaust flange nuts from engine.' }, { n: 9, text: 'Remove complete two-into-one exhaust from motorcycle.' }, { n: 10, text: 'Install new two-into-one exhaust by aligning flanges with engine ports.' }, { n: 11, text: 'Install flange nuts and tighten to 100-120 in-lbs.' }, { n: 12, text: 'Install mounting bracket screws and tighten to 40-50 ft-lbs.' }, { n: 13, text: 'Install muffler intermediate shield screws and tighten to 108-132 in-lbs.' }, { n: 14, text: 'Install shield clamps and tighten to 20-40 in-lbs.' }, { n: 15, text: 'Install muffler screws and tighten to 120-144 in-lbs.' }, { n: 16, text: 'Connect oxygen sensors.' }, { n: 17, text: 'Install saddlebags if equipped.' }, { n: 18, text: 'Install main fuse.' }, { n: 19, text: 'Install seat.' }] },
{ id: 's25-fuel-replace-purge-solenoid', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Purge Solenoid', summary: 'Remove and install evaporative emissions purge control solenoid valve.', difficulty: 'Easy', timeMinutes: 20, source: { manual: '2025 HD Softail Service Manual', page: '6-42' }, figures: [{ file: '/figures/softail-2025/p6-42.jpg', caption: 'Manual page 6-42' }], tools: ['Socket set', 'Screwdriver set'], parts: [], torque: [], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Remove main fuse.' }, { n: 3, text: 'Locate purge solenoid on engine.' }, { n: 4, text: 'Disconnect purge solenoid electrical connector.' }, { n: 5, text: 'Disconnect purge lines from solenoid.' }, { n: 6, text: 'Remove solenoid mounting bracket screws.' }, { n: 7, text: 'Remove solenoid assembly.' }, { n: 8, text: 'Install new solenoid assembly.' }, { n: 9, text: 'Install mounting bracket screws.' }, { n: 10, text: 'Connect purge lines to solenoid.' }, { n: 11, text: 'Connect solenoid electrical connector.' }, { n: 12, text: 'Install main fuse.' }, { n: 13, text: 'Install seat.' }] },
{ id: 's25-fuel-replace-charcoal-canister', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Charcoal Canister', summary: 'Remove and install charcoal canister for evaporative emissions control.', difficulty: 'Moderate', timeMinutes: 45, source: { manual: '2025 HD Softail Service Manual', page: '6-43' },
  figures: [{ file: '/figures/softail-2025/p6-43.jpg', caption: 'Manual page 6-43' }], tools: ['Socket set', 'Screwdriver set'], parts: [], torque: [{ fastener: 'Charcoal canister bracket to engine case screws', value: '72-96 in-lbs' }, { fastener: 'Charcoal canister to bracket screws', value: '30-36 in-lbs' }], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Remove main fuse.' }, { n: 3, text: 'Remove right side cover.' }, { n: 4, text: 'Disconnect charcoal canister purge line connector.' }, { n: 5, text: 'Remove canister bracket mounting screws.' }, { n: 6, text: 'Remove canister from bracket.' }, { n: 7, text: 'Remove canister assembly.' }, { n: 8, text: 'Install new canister to bracket and tighten to 30-36 in-lbs.' }, { n: 9, text: 'Install bracket mounting screws and tighten to 72-96 in-lbs.' }, { n: 10, text: 'Connect purge line connector.' }, { n: 11, text: 'Install right side cover.' }, { n: 12, text: 'Install main fuse.' }, { n: 13, text: 'Install seat.' }] },
{ id: 's25-fuel-replace-purge-lines', bikeIds: ['softail-2025'], system: 'fuel', title: 'Replace Purge Lines', summary: 'Remove and install evaporative emissions purge lines connecting charcoal canister to induction module.', difficulty: 'Moderate', timeMinutes: 60, source: { manual: '2025 HD Softail Service Manual', page: '6-44' },
  figures: [{ file: '/figures/softail-2025/p6-44.jpg', caption: 'Manual page 6-44' }], tools: ['Hose clamp pliers', 'Screwdriver set'], parts: [], torque: [], steps: [{ n: 1, text: 'Remove seat.' }, { n: 2, text: 'Disconnect fuel tank console connector if equipped.' }, { n: 3, text: 'Remove air cleaner if replacing lower purge line.' }, { n: 4, text: 'Remove and discard purge line clamp.' }, { n: 5, text: 'Disconnect purge line from charcoal canister.' }, { n: 6, text: 'Remove line from purge solenoid or induction module.' }, { n: 7, text: 'Remove purge line from frame routing clamps.' }, { n: 8, text: 'Install new purge line in frame routing clamps.' }, { n: 9, text: 'Connect purge line to induction module or solenoid.' }, { n: 10, text: 'Connect purge line to charcoal canister.' }, { n: 11, text: 'Install new purge line clamp.' }, { n: 12, text: 'Verify purge line routing and connections.' }, { n: 13, text: 'Install fuel tank console connector if equipped.' }, { n: 14, text: 'Install right side cover.' }, { n: 15, text: 'Install mud guard.' }, { n: 16, text: 'Install seat.' }] },
// --- END SOFTAIL 2025 CHAPTER 6 JOBS ---
,

  // --- BEGIN SOFTAIL 2025 CHAPTER 7A JOBS ---
  {
  id: 's25-electrical-replace-fuses',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Primary Fuses',
  summary: 'Remove and inspect primary fuses in fuse block. Replace any blown fuses with correct amperage rating.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2025 HD Softail Service Manual', page: '7-5' },
  figures: [{ file: '/figures/softail-2025/p7-5.jpg', caption: 'Manual page 7-5' }],
  tools: ['Fuse puller'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER.' },
    { n: 2, text: 'Remove fuse block from caddy.' },
    { n: 3, text: 'Remove suspect fuse.' },
    { n: 4, text: 'Inspect fuse. If element is burned or separated, replace with new fuse.' },
    { n: 5, text: 'Verify proper fuse amperage rating (ABS 30A, Infotainment 10A, Battery tender 7.5A, Powertrain 7.5A).' },
    { n: 6, text: 'Install fuse in proper position.' },
    { n: 7, text: 'Install fuse block to caddy. Verify fuse block release snapped into place.' },
    { n: 8, text: 'Install left side cover.' },
    { n: 9, text: 'Verify all lights and switches operate properly before operating motorcycle.' },
    { n: 10, text: 'Test affected circuit for proper operation.' }
  ]
},

{
  id: 's25-electrical-remove-main-fuse',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove Main Fuse',
  summary: 'Remove main fuse to prevent accidental vehicle start-up during service.',
  difficulty: 'Easy',
  timeMinutes: 10,
  source: { manual: '2025 HD Softail Service Manual', page: '7-6' },
  figures: [{ file: '/figures/softail-2025/p7-6.jpg', caption: 'Manual page 7-6' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER.' },
    { n: 2, text: 'For models with security: Verify that fob is present.' },
    { n: 3, text: 'For models with security: Turn OFF/RUN switch to RUN.' },
    { n: 4, text: 'Remove cover of main fuse holder.' },
    { n: 5, text: 'Remove the main fuse.' },
    { n: 6, text: 'For models with security: Turn ignition switch OFF.' },
    { n: 7, text: 'Store main fuse in secure location.' }
  ]
},

{
  id: 's25-electrical-install-main-fuse',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Install Main Fuse',
  summary: 'Reinstall main fuse and restore electrical power to motorcycle.',
  difficulty: 'Easy',
  timeMinutes: 10,
  source: { manual: '2025 HD Softail Service Manual', page: '7-6' },
  figures: [{ file: '/figures/softail-2025/p7-6.jpg', caption: 'Manual page 7-6' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Install main fuse in fuse holder.' },
    { n: 2, text: 'Install main fuse holder cover.' },
    { n: 3, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER.' },
    { n: 4, text: 'Test affected circuits for proper operation.' },
    { n: 5, text: 'Verify all lights and switches operate properly before operating motorcycle.' }
  ]
},

{
  id: 's25-electrical-disconnect-negative-battery',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Disconnect Negative Battery Cable',
  summary: 'Disconnect negative battery cable to prevent electrical hazards during service.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2025 HD Softail Service Manual', page: '7-7' },
  figures: [{ file: '/figures/softail-2025/p7-7.jpg', caption: 'Manual page 7-7' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Battery terminal, negative', value: '72–96 in-lbs (8.1–10.8 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove seat. See CHASSIS > SEAT.' },
    { n: 2, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER.' },
    { n: 3, text: 'For models with security: Verify that fob is present.' },
    { n: 4, text: 'For models with security: Turn OFF/RUN switch to RUN.' },
    { n: 5, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 6, text: 'Remove rear lighting caddy. See ELECTRICAL > REAR LIGHTING CADDY.' },
    { n: 7, text: 'Disconnect negative battery cable from battery terminal.' }
  ]
},

{
  id: 's25-electrical-connect-negative-battery',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Connect Negative Battery Cable',
  summary: 'Reconnect negative battery cable to restore electrical power.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2025 HD Softail Service Manual', page: '7-7' },
  figures: [{ file: '/figures/softail-2025/p7-7.jpg', caption: 'Manual page 7-7' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Battery terminal, negative', value: '72–96 in-lbs (8.1–10.8 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Connect negative battery cable to negative battery terminal.' },
    { n: 2, text: 'Tighten connection. Torque: 72–96 in-lbs (8.1–10.8 N·m).' },
    { n: 3, text: 'Install rear lighting caddy. See ELECTRICAL > REAR LIGHTING CADDY.' },
    { n: 4, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 5, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER.' },
    { n: 6, text: 'Install seat. See CHASSIS > SEAT.' }
  ]
},

{
  id: 's25-electrical-remove-starter',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove Starter',
  summary: 'Remove starter motor assembly for inspection or replacement.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-8' },
  figures: [{ file: '/figures/softail-2025/p7-8.jpg', caption: 'Manual page 7-8' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Disconnect negative battery cable before proceeding.' },
    { n: 2, text: 'Remove right side cover. See CHASSIS > RIGHT SIDE COVER.' },
    { n: 3, text: 'Remove battery. See MAINTENANCE > INSPECT BATTERY.' },
    { n: 4, text: 'For models with side mounted shock adjuster: Remove screw securing shock adjustment knob to ABS bracket.' },
    { n: 5, text: 'Remove positive cable from starter.' },
    { n: 6, text: 'Disconnect connector from solenoid.' },
    { n: 7, text: 'Remove starter mounting screws.' },
    { n: 8, text: 'Remove starter assembly.' },
    { n: 9, text: 'Discard O-ring from starter.' }
  ]
},

{
  id: 's25-electrical-install-starter',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Install Starter',
  summary: 'Install starter motor assembly with proper torque and connections.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-8' },
  figures: [{ file: '/figures/softail-2025/p7-8.jpg', caption: 'Manual page 7-8' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Solenoid nut', value: '80–90 in-lbs (9–10.2 N·m)' },
    { fastener: 'Starter, mounting screw', value: '22–24 ft-lbs (29.8–32.5 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Install new O-ring on starter.' },
    { n: 2, text: 'Lubricate new O-ring with clean engine oil.' },
    { n: 3, text: 'Apply LOCTITE 243 MEDIUM STRENGTH THREADLOCKER AND SEALANT (BLUE) (99642-97) to starter mounting screws.' },
    { n: 4, text: 'Install starter assembly.' },
    { n: 5, text: 'Install and tighten mounting screws. Torque: 22–24 ft-lbs (29.8–32.5 N·m).' },
    { n: 6, text: 'Connect connector to solenoid.' },
    { n: 7, text: 'Install positive battery cable to solenoid at 3 o\'clock position.' },
    { n: 8, text: 'Tighten solenoid nut. Torque: 80–90 in-lbs (9–10.2 N·m).' },
    { n: 9, text: 'Install battery. See MAINTENANCE > INSPECT BATTERY.' },
    { n: 10, text: 'For models with side mounted shock adjuster: Install screw securing shock adjustment knob to ABS bracket.' },
    { n: 11, text: 'Install right side cover. See CHASSIS > RIGHT SIDE COVER.' }
  ]
},

{
  id: 's25-electrical-remove-alternator-rotor-stator',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove Alternator Rotor and Stator',
  summary: 'Remove rotor and stator assembly from alternator for replacement or repair.',
  difficulty: 'Hard',
  timeMinutes: 90,
  source: { manual: '2025 HD Softail Service Manual', page: '7-9' },
  figures: [{ file: '/figures/softail-2025/p7-9.jpg', caption: 'Manual page 7-9' }],
  tools: ['HD-52073 ALTERNATOR ROTOR REMOVER AND INSTALLER'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER.' },
    { n: 2, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 3, text: 'Remove left side rider foot control assembly if necessary. See CHASSIS > LEFT FOOT CONTROLS.' },
    { n: 4, text: 'Drain primary chaincase. See MAINTENANCE > REPLACE PRIMARY CHAINCASE LUBRICANT.' },
    { n: 5, text: 'Remove primary cover. See DRIVE AND TRANSMISSION > PRIMARY CHAINCASE HOUSING.' },
    { n: 6, text: 'Remove compensator assembly. See DRIVE AND TRANSMISSION > DRIVE COMPONENTS.' },
    { n: 7, text: 'Disconnect connector from voltage regulator.' },
    { n: 8, text: 'Remove rotor using special tool HD-52073 ALTERNATOR ROTOR REMOVER AND INSTALLER. Exercise caution - rotor contains powerful magnets.' },
    { n: 9, text: 'Discard cable strap.' },
    { n: 10, text: 'Discard screws.' },
    { n: 11, text: 'Remove grommet from crankcase using awl or small screwdriver.' },
    { n: 12, text: 'Spray isopropyl alcohol or glass cleaner into opening around grommet.' },
    { n: 13, text: 'Repeat spraying at one or two other locations around grommet.' },
    { n: 14, text: 'Push grommet from outside of crankcase while pulling through bore with needle nose pliers.' },
    { n: 15, text: 'Remove stator assembly.' }
  ]
},

{
  id: 's25-electrical-install-alternator-stator',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Install Alternator Stator',
  summary: 'Install stator assembly with proper mounting and grounding.',
  difficulty: 'Hard',
  timeMinutes: 90,
  source: { manual: '2025 HD Softail Service Manual', page: '7-9' },
  figures: [{ file: '/figures/softail-2025/p7-9.jpg', caption: 'Manual page 7-9' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Stator mounting screws', value: '55–75 in-lbs (6.2–8.5 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Install grommet. Lubricate parts with glass cleaner or isopropyl alcohol.' },
    { n: 2, text: 'Ensure ribs of grommet are clean and free of dirt and oily residue.' },
    { n: 3, text: 'Feed connector and harness through hole from inside crankcase.' },
    { n: 4, text: 'Push grommet into crankcase bore while carefully pulling on outside cable.' },
    { n: 5, text: 'Verify installation is complete when cable stop contacts casting and capped rib of grommet exits crankcase bore.' },
    { n: 6, text: 'Do not reuse old stator mounting screws.' },
    { n: 7, text: 'Secure stator to crankcase using new screws. Tighten to 55–75 in-lbs (6.2–8.5 N·m).' },
    { n: 8, text: 'Secure stator wiring to frame with new cable strap. Verify stator wire does not contact engine or frame.' },
    { n: 9, text: 'Apply silicone based dielectric grease to connector.' },
    { n: 10, text: 'Install connector to voltage regulator. Engage locking latch.' }
  ]
},

{
  id: 's25-electrical-install-alternator-rotor',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Install Alternator Rotor',
  summary: 'Install alternator rotor with caution due to powerful magnets.',
  difficulty: 'Hard',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-9' },
  figures: [{ file: '/figures/softail-2025/p7-9.jpg', caption: 'Manual page 7-9' }],
  tools: ['HD-52073 ALTERNATOR ROTOR REMOVER AND INSTALLER'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Install rotor slowly using special tool HD-52073 ALTERNATOR ROTOR REMOVER AND INSTALLER to prevent damaging rotor magnets.' },
    { n: 2, text: 'Exercise caution during installation - rotor contains powerful magnets.' },
    { n: 3, text: 'Verify rotor is seated properly.' },
    { n: 4, text: 'Install compensator assembly. See DRIVE AND TRANSMISSION > DRIVE COMPONENTS.' },
    { n: 5, text: 'Install primary cover. See DRIVE AND TRANSMISSION > PRIMARY CHAINCASE HOUSING.' },
    { n: 6, text: 'Fill primary chaincase. See MAINTENANCE > REPLACE PRIMARY CHAINCASE LUBRICANT.' },
    { n: 7, text: 'Install left side rider foot control assembly. See CHASSIS > LEFT FOOT CONTROLS.' },
    { n: 8, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 9, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER.' }
  ]
},

{
  id: 's25-electrical-remove-voltage-regulator',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove Voltage Regulator',
  summary: 'Remove voltage regulator assembly for inspection or replacement.',
  difficulty: 'Medium',
  timeMinutes: 30,
  source: { manual: '2025 HD Softail Service Manual', page: '7-10' },
  figures: [{ file: '/figures/softail-2025/p7-10.jpg', caption: 'Manual page 7-10' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER.' },
    { n: 2, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 3, text: 'Remove oil cooler cover if removing voltage regulator bracket. See ENGINE > OIL COOLER.' },
    { n: 4, text: 'Remove screws from voltage regulator.' },
    { n: 5, text: 'Remove voltage regulator assembly.' },
    { n: 6, text: 'Disconnect voltage regulator connectors carefully. Note: Locking tab can be damaged if disconnected improperly.' }
  ]
},

{
  id: 's25-electrical-install-voltage-regulator',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Install Voltage Regulator',
  summary: 'Install voltage regulator assembly with proper connections.',
  difficulty: 'Medium',
  timeMinutes: 30,
  source: { manual: '2025 HD Softail Service Manual', page: '7-10' },
  figures: [{ file: '/figures/softail-2025/p7-10.jpg', caption: 'Manual page 7-10' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Voltage regulator, screw', value: '102–104 in-lbs (11.5–11.75 N·m)' },
    { fastener: 'Voltage regulator bracket, screw', value: '100–120 in-lbs (11.3–13.6 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Connect voltage regulator connectors with locking tab engaged.' },
    { n: 2, text: 'Position voltage regulator.' },
    { n: 3, text: 'Install screws. Tighten as required.' },
    { n: 4, text: 'Install oil cooler cover if it was removed. See ENGINE > OIL COOLER.' },
    { n: 5, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 6, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER.' }
  ]
},

{
  id: 's25-electrical-lhcm-remove',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove Left Hand Control Module (LHCM)',
  summary: 'Remove LHCM assembly from handlebar for replacement or repair.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-15' },
  figures: [{ file: '/figures/softail-2025/p7-15.jpg', caption: 'Manual page 7-15' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER.' },
    { n: 2, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 3, text: 'Remove clutch hand control. See CHASSIS > CLUTCH CONTROL.' },
    { n: 4, text: 'Remove LHCM cover screws (do not remove alignment screw).' },
    { n: 5, text: 'Remove cover.' },
    { n: 6, text: 'Disconnect LHCM connector.' },
    { n: 7, text: 'Remove LHCM from handlebar.' }
  ]
},

{
  id: 's25-electrical-lhcm-disassemble',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Disassemble Left Hand Control Module (LHCM)',
  summary: 'Disassemble LHCM components for replacement of switches or internal parts.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-15' },
  figures: [{ file: '/figures/softail-2025/p7-15.jpg', caption: 'Manual page 7-15' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove cable guide screws (note: switch pack buttons are connected by wires - be careful).' },
    { n: 2, text: 'Remove cable guide.' },
    { n: 3, text: 'Remove headlamp switch screws.' },
    { n: 4, text: 'Remove lower switch screws.' },
    { n: 5, text: 'Remove LHCM switch pack screws.' },
    { n: 6, text: 'Remove LHCM switch pack carefully to avoid damaging wires.' }
  ]
},

{
  id: 's25-electrical-lhcm-assemble',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Assemble Left Hand Control Module (LHCM)',
  summary: 'Assemble LHCM components after replacement of switches or internal parts.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-15' },
  figures: [{ file: '/figures/softail-2025/p7-15.jpg', caption: 'Manual page 7-15' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'LHCM, switch pack, screws', value: '3–5 in-lbs (0.3–0.59 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Install LHCM switch pack into housing.' },
    { n: 2, text: 'Install hand control pad screws. Tighten to 3–5 in-lbs (0.3–0.59 N·m).' },
    { n: 3, text: 'Install headlamp switch.' },
    { n: 4, text: 'Install headlamp switch screws. Tighten to 3–5 in-lbs (0.3–0.59 N·m).' },
    { n: 5, text: 'Install lower switch.' },
    { n: 6, text: 'Install lower switch screws. Tighten to 3–5 in-lbs (0.3–0.59 N·m).' },
    { n: 7, text: 'Install cable guide.' },
    { n: 8, text: 'Install cable guide screws. Tighten to 3–5 in-lbs (0.3–0.59 N·m).' }
  ]
},

{
  id: 's25-electrical-lhcm-install',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Install Left Hand Control Module (LHCM)',
  summary: 'Install LHCM assembly on handlebar with proper connections and alignment.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-15' },
  figures: [{ file: '/figures/softail-2025/p7-15.jpg', caption: 'Manual page 7-15' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'LHCM cover screw', value: '27–31 in-lbs (3–3.5 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Install LHCM on handlebar.' },
    { n: 2, text: 'Install hand grip lip in groove on LHCM.' },
    { n: 3, text: 'Route LHCM cable in groove on LHCM cable guide.' },
    { n: 4, text: 'Connect LHCM connector.' },
    { n: 5, text: 'Guide clutch switch cable through cover opening.' },
    { n: 6, text: 'Install cover.' },
    { n: 7, text: 'Align alignment screw with alignment hole in handlebar.' },
    { n: 8, text: 'Verify alignment screw is properly engaged into hole (failure may result in damage).' },
    { n: 9, text: 'Install cover screws. Tighten to 27–31 in-lbs (3–3.5 N·m).' },
    { n: 10, text: 'If alignment screw was removed, install and snug alignment screw.' }
  ]
},

{
  id: 's25-electrical-lhcm-replace-clutch-switch',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Clutch Switch (LHCM)',
  summary: 'Replace clutch switch assembly on LHCM for proper clutch operation.',
  difficulty: 'Medium',
  timeMinutes: 60,
  source: { manual: '2025 HD Softail Service Manual', page: '7-16' },
  figures: [{ file: '/figures/softail-2025/p7-16.jpg', caption: 'Manual page 7-16' }],
  tools: ['HD-48650 DIGITAL TECHNICIAN II'],
  parts: [],
  torque: [
    { fastener: 'Clutch actuator switch screw', value: '12–19 in-lbs (1.4–2.1 N·m)' },
    { fastener: 'Clutch switch cover screw', value: '7–11 in-lbs (0.8–1.2 N·m)' },
    { fastener: 'Clutch switch screw', value: '4–5 in-lbs (0.4–0.6 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Place clutch lever against grip and secure in position (damage may occur if not positioned properly).' },
    { n: 2, text: 'Remove and discard clutch switch cover screw.' },
    { n: 3, text: 'Remove cover.' },
    { n: 4, text: 'Slide back rubber boot.' },
    { n: 5, text: 'Disconnect clutch switch connector.' },
    { n: 6, text: 'Remove and discard clutch switch screw.' },
    { n: 7, text: 'Remove clutch switch.' },
    { n: 8, text: 'Remove actuator switch screw.' },
    { n: 9, text: 'Remove actuator switch.' },
    { n: 10, text: 'Install new actuator switch.' },
    { n: 11, text: 'Install and tighten actuator switch screw to 12–19 in-lbs (1.4–2.1 N·m).' },
    { n: 12, text: 'Install new clutch switch.' },
    { n: 13, text: 'Install and tighten new clutch switch screw to 4–5 in-lbs (0.4–0.6 N·m).' },
    { n: 14, text: 'Connect clutch connector and install boot.' },
    { n: 15, text: 'Install cover.' },
    { n: 16, text: 'Install and tighten new clutch switch cover screw to 7–11 in-lbs (0.8–1.2 N·m).' },
    { n: 17, text: 'Release clutch lever from secured position.' },
    { n: 18, text: 'Verify clutch switch function using digital technician (HD-48650).' }
  ]
},

{
  id: 's25-electrical-rhcm-remove',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove Right Hand Control Module (RHCM)',
  summary: 'Remove RHCM assembly from handlebar for replacement or repair.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-18' },
  figures: [{ file: '/figures/softail-2025/p7-18.jpg', caption: 'Manual page 7-18' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove right side cover. See CHASSIS > RIGHT SIDE COVER.' },
    { n: 2, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 3, text: 'Remove throttle grip and twist sensor assembly. See CHASSIS > THROTTLE CONTROL.' },
    { n: 4, text: 'Remove RHCM cover screws (do not remove alignment screw).' },
    { n: 5, text: 'Remove cover.' },
    { n: 6, text: 'Disconnect RHCM connector.' },
    { n: 7, text: 'Remove RHCM from handlebar.' }
  ]
},

{
  id: 's25-electrical-rhcm-install',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Install Right Hand Control Module (RHCM)',
  summary: 'Install RHCM assembly on handlebar with proper connections and alignment.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-18' },
  figures: [{ file: '/figures/softail-2025/p7-18.jpg', caption: 'Manual page 7-18' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'RHCM cover screws', value: '27–31 in-lbs (3–3.5 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Install RHCM on handlebar.' },
    { n: 2, text: 'Connect RHCM connector.' },
    { n: 3, text: 'Align alignment screw with alignment hole in handlebar.' },
    { n: 4, text: 'Verify alignment screw is properly engaged into hole.' },
    { n: 5, text: 'Install cover.' },
    { n: 6, text: 'Install cover screws. Tighten to 27–31 in-lbs (3–3.5 N·m).' },
    { n: 7, text: 'Install throttle grip and twist sensor assembly. See CHASSIS > THROTTLE CONTROL.' },
    { n: 8, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 9, text: 'Install right side cover. See CHASSIS > RIGHT SIDE COVER.' }
  ]
},

{
  id: 's25-electrical-oil-pressure-switch-replace',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Oil Pressure Switch',
  summary: 'Replace oil pressure switch for accurate engine oil pressure monitoring.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2025 HD Softail Service Manual', page: '7-24' },
  figures: [{ file: '/figures/softail-2025/p7-24.jpg', caption: 'Manual page 7-24' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Switch, Oil Pressure', value: '13–17 ft-lbs (17–23 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 2, text: 'Disconnect connector from oil pressure switch.' },
    { n: 3, text: 'Remove oil pressure switch.' },
    { n: 4, text: 'Install new oil pressure switch.' },
    { n: 5, text: 'Tighten switch to 13–17 ft-lbs (17–23 N·m).' },
    { n: 6, text: 'Connect connector to switch.' },
    { n: 7, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT.' }
  ]
},

{
  id: 's25-electrical-horn-remove',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove Horn',
  summary: 'Remove horn assembly for replacement or repair.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2025 HD Softail Service Manual', page: '7-25' },
  figures: [{ file: '/figures/softail-2025/p7-25.jpg', caption: 'Manual page 7-25' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 2, text: 'Remove narrow screws from horn assembly.' },
    { n: 3, text: 'Remove wide screw from horn assembly.' },
    { n: 4, text: 'Remove horn assembly.' },
    { n: 5, text: 'Disconnect wire connectors from horn.' }
  ]
},

{
  id: 's25-electrical-horn-install',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Install Horn',
  summary: 'Install horn assembly with proper mounting and connections.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2025 HD Softail Service Manual', page: '7-25' },
  figures: [{ file: '/figures/softail-2025/p7-25.jpg', caption: 'Manual page 7-25' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Horn, Narrow Mounting Screw', value: '27–33 in-lbs (3–3.7 N·m)' },
    { fastener: 'Horn, Wide Mounting Screw', value: '84–108 in-lbs (9.5–12.2 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Connect wire connectors to horn.' },
    { n: 2, text: 'Position horn assembly.' },
    { n: 3, text: 'Install wide screw. Tighten to 84–108 in-lbs (9.5–12.2 N·m).' },
    { n: 4, text: 'Install narrow screws. Tighten to 27–33 in-lbs (3–3.7 N·m).' },
    { n: 5, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT.' }
  ]
},

{
  id: 's25-electrical-horn-assemble',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Assemble Horn',
  summary: 'Assemble horn bracket and components.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2025 HD Softail Service Manual', page: '7-25' },
  figures: [{ file: '/figures/softail-2025/p7-25.jpg', caption: 'Manual page 7-25' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Horn, Bracket Screw', value: '62–71 in-lbs (7–8 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Lay out horn bracket (3) and screws (1).' },
    { n: 2, text: 'Verify bracket is clean and all hardware is present.' },
    { n: 3, text: 'Align bracket mounting holes with screw locations.' },
    { n: 4, text: 'Install bracket screws through holes in bracket.' },
    { n: 5, text: 'Hand tighten screws to ensure proper alignment.' },
    { n: 6, text: 'Tighten bracket screws to 62–71 in-lbs (7–8 N·m).' }
  ]
},

{
  id: 's25-electrical-headlamp-led-standard-round',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Headlamp LED Module (Standard Round)',
  summary: 'Replace LED module in standard round headlamp for improved lighting.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-26' },
  figures: [{ file: '/figures/softail-2025/p7-26.jpg', caption: 'Manual page 7-26' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Headlamp bezel screw', value: '9–14 in-lbs (1–1.6 N·m)' },
    { fastener: 'Headlamp isolator bracket screw', value: '8–10 ft-lbs (10.8–13.5 N·m)' },
    { fastener: 'Headlamp retainer screw', value: '12–15 in-lbs (1.4–1.7 N·m)' },
    { fastener: 'Headlamp to isolator screw, headlamp without housing', value: '8–10 ft-lbs (10.8–13.6 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove headlamp housing. See Remove And Install: Standard Round.' },
    { n: 2, text: 'Remove steered fairing if equipped. See CHASSIS > FAIRING.' },
    { n: 3, text: 'Remove screw and nut from headlamp.' },
    { n: 4, text: 'Remove bezel from headlamp.' },
    { n: 5, text: 'For 7-inch headlamps: Remove screws and retainer.' },
    { n: 6, text: 'Remove headlamp from housing.' },
    { n: 7, text: 'Disconnect connector.' },
    { n: 8, text: 'Remove isolator bracket screws.' },
    { n: 9, text: 'Remove isolator bracket.' },
    { n: 10, text: 'Install isolator bracket on new headlamp.' },
    { n: 11, text: 'Install isolator bracket screws. Tighten to 8–10 ft-lbs (10.8–13.6 N·m).' },
    { n: 12, text: 'Connect connector to headlamp.' },
    { n: 13, text: 'Install headlamp into housing (use alignment tabs).' },
    { n: 14, text: 'For 7-inch headlamps: Install retainer and screws. Tighten to 12–15 in-lbs (1.4–1.7 N·m).' },
    { n: 15, text: 'Install bezel.' },
    { n: 16, text: 'Install screw and nut. Tighten to 9–14 in-lbs (1–1.6 N·m).' },
    { n: 17, text: 'Install headlamp housing.' },
    { n: 18, text: 'Install steered fairing if equipped.' }
  ]
},

{
  id: 's25-electrical-headlamp-remove-install-standard-round',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove and Install Headlamp (Standard Round)',
  summary: 'Remove and install complete headlamp assembly for replacement.',
  difficulty: 'Medium',
  timeMinutes: 60,
  source: { manual: '2025 HD Softail Service Manual', page: '7-26' },
  figures: [{ file: '/figures/softail-2025/p7-26.jpg', caption: 'Manual page 7-26' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Headlamp isolator bracket screw', value: '8–10 ft-lbs (10.8–13.5 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove screw and nut from old headlamp.' },
    { n: 2, text: 'Remove bezel from old headlamp.' },
    { n: 3, text: 'Remove screws from headlamp.' },
    { n: 4, text: 'Remove isolator bracket.' },
    { n: 5, text: 'Position isolator bracket on new headlamp.' },
    { n: 6, text: 'Install isolator bracket screws. Tighten to 8–10 ft-lbs (10.8–13.5 N·m).' },
    { n: 7, text: 'Connect connector to new headlamp.' },
    { n: 8, text: 'Install headlamp into housing.' },
    { n: 9, text: 'Install bezel onto new headlamp.' },
    { n: 10, text: 'Install screw and nut. Tighten as required.' }
  ]
},

{
  id: 's25-electrical-headlamp-without-housing',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Headlamp without Housing',
  summary: 'Replace headlamp assembly without separate housing.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-26' },
  figures: [{ file: '/figures/softail-2025/p7-26.jpg', caption: 'Manual page 7-26' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Headlamp to isolator screw, headlamp without housing', value: '8–10 ft-lbs (10.8–13.6 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove connector from old headlamp.' },
    { n: 2, text: 'Remove screws from isolator bracket.' },
    { n: 3, text: 'Remove isolator bracket from old headlamp.' },
    { n: 4, text: 'Position isolator bracket on new headlamp.' },
    { n: 5, text: 'Install screws into isolator bracket. Tighten to 8–10 ft-lbs (10.8–13.6 N·m).' },
    { n: 6, text: 'Connect connector to new headlamp.' }
  ]
},

{
  id: 's25-electrical-headlamp-nacelle-led',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Headlamp LED Module (Nacelle Mounted)',
  summary: 'Replace LED module in nacelle-mounted headlamp.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-27' },
  figures: [{ file: '/figures/softail-2025/p7-27.jpg', caption: 'Manual page 7-27' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Headlamp, nacelle mounted, bezel screw', value: '25–32 in-lbs (2.8–3.6 N·m)' },
    { fastener: 'Headlamp, nacelle mounted, retainer screw', value: '17–25 in-lbs (1.9–2.8 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove screw from bezel.' },
    { n: 2, text: 'Remove bezel (note: bezel is under pressure from isolators - disassemble slowly).' },
    { n: 3, text: 'Remove retainer screws.' },
    { n: 4, text: 'Remove retainer assembly.' },
    { n: 5, text: 'Remove headlamp from retainer.' },
    { n: 6, text: 'Disconnect connector from headlamp.' },
    { n: 7, text: 'Install retainer assembly.' },
    { n: 8, text: 'Install new headlamp into retainer.' },
    { n: 9, text: 'Connect connector to new headlamp.' },
    { n: 10, text: 'Verify gasket is properly installed on retainer.' },
    { n: 11, text: 'Install retainer screws. Tighten to 17–25 in-lbs (1.9–2.8 N·m).' },
    { n: 12, text: 'Install bezel with gasket behind lip.' },
    { n: 13, text: 'Install bezel screw. Tighten to 25–32 in-lbs (2.8–3.6 N·m).' }
  ]
},

{
  id: 's25-electrical-instrument-module-remove-install',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove and Install Instrument Module (IM)',
  summary: 'Remove and install instrument module on handlebar.',
  difficulty: 'Easy',
  timeMinutes: 30,
  source: { manual: '2025 HD Softail Service Manual', page: '7-31' },
  figures: [{ file: '/figures/softail-2025/p7-31.jpg', caption: 'Manual page 7-31' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'IM, round, cover screws', value: '12–17 in-lbs (1.4–1.9 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove IM cover screws.' },
    { n: 2, text: 'Remove cover from IM.' },
    { n: 3, text: 'Disconnect IM connector.' },
    { n: 4, text: 'Remove IM assembly from handlebar.' },
    { n: 5, text: 'Install IM onto handlebar.' },
    { n: 6, text: 'Connect IM connector.' },
    { n: 7, text: 'Install cover onto IM.' },
    { n: 8, text: 'Install and tighten cover screws to 12–17 in-lbs (1.4–1.9 N·m).' }
  ]
},

{
  id: 's25-electrical-indicator-lamp-install',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Install Indicator Lamps',
  summary: 'Install indicator lamps for engine status display.',
  difficulty: 'Easy',
  timeMinutes: 25,
  source: { manual: '2025 HD Softail Service Manual', page: '7-32' },
  figures: [{ file: '/figures/softail-2025/p7-32.jpg', caption: 'Manual page 7-32' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Indicator lamp, screw', value: '20–30 in-lbs (2.26–3.39 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Position indicator lamp assembly.' },
    { n: 2, text: 'Verify housing cavity is clean and free of debris.' },
    { n: 3, text: 'Insert indicator lamp carefully into housing.' },
    { n: 4, text: 'Install lamp mounting screw through housing bracket.' },
    { n: 5, text: 'Tighten mounting screw to 20–30 in-lbs (2.26–3.39 N·m).' },
    { n: 6, text: 'Connect lamp electrical connector ensuring proper engagement.' },
    { n: 7, text: 'Test indicator lamp operation with ignition on.' }
  ]
},

{
  id: 's25-electrical-front-light-bar-remove-install',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove and Install Front Light Bar',
  summary: 'Remove and install front light bar with turn signals and wiring.',
  difficulty: 'Medium',
  timeMinutes: 60,
  source: { manual: '2025 HD Softail Service Manual', page: '7-35' },
  figures: [{ file: '/figures/softail-2025/p7-35.jpg', caption: 'Manual page 7-35' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Front light bar mounting screw', value: '20–25 ft-lbs (27.1–33.9 N·m)' },
    { fastener: 'Front light bar, bracket screw', value: '12–14 ft-lbs (16.3–19.6 N·m)' },
    { fastener: 'Front light bar, clamp screw', value: '6–10 in-lbs (0.67–1.1 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 2, text: 'Remove fuel tank. See FUEL AND EXHAUST > FUEL TANK.' },
    { n: 3, text: 'Disconnect right and left turn signal connectors. See ELECTRICAL > FRONT ELECTRICAL CADDY.' },
    { n: 4, text: 'Remove mounting screws from light bar.' },
    { n: 5, text: 'Remove light bar assembly.' },
    { n: 6, text: 'Discard old cable strap.' },
    { n: 7, text: 'Remove mounting bracket screws.' },
    { n: 8, text: 'Remove bracket.' },
    { n: 9, text: 'Remove auxiliary lamp housings. See ELECTRICAL > AUXILIARY LAMPS.' },
    { n: 10, text: 'Remove clamp screws.' },
    { n: 11, text: 'Install left and right turn signals.' },
    { n: 12, text: 'Install clamps and screws. Tighten to 6–10 in-lbs (0.67–1.1 N·m).' },
    { n: 13, text: 'Install auxiliary lamp housings. See ELECTRICAL > AUXILIARY LAMPS.' },
    { n: 14, text: 'Install bracket and screws. Tighten to 12–14 ft-lbs (16.3–19.6 N·m).' },
    { n: 15, text: 'Install new cable strap.' },
    { n: 16, text: 'Install light bar.' },
    { n: 17, text: 'Install mounting screws. Tighten to 20–25 ft-lbs (27.1–33.9 N·m).' },
    { n: 18, text: 'Connect turn signal connectors.' },
    { n: 19, text: 'Install fuel tank.' },
    { n: 20, text: 'Install main fuse.' }
  ]
},

{
  id: 's25-electrical-auxiliary-lamp-bulb-replace',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Auxiliary Lamp Bulb',
  summary: 'Replace auxiliary lamp LED bulb for improved lighting.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2025 HD Softail Service Manual', page: '7-37' },
  figures: [{ file: '/figures/softail-2025/p7-37.jpg', caption: 'Manual page 7-37' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Auxiliary lamp bezel nut', value: '9–12 in-lbs (1.07–1.36 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 2, text: 'Remove screw and nut from lamp.' },
    { n: 3, text: 'Remove bezel.' },
    { n: 4, text: 'Remove LED lamp from alignment ring.' },
    { n: 5, text: 'Disconnect connector.' },
    { n: 6, text: 'Connect new lamp connector.' },
    { n: 7, text: 'Install new LED lamp in alignment ring.' },
    { n: 8, text: 'Install bezel.' },
    { n: 9, text: 'Install screw and nut. Tighten to 9–12 in-lbs (1.07–1.36 N·m).' },
    { n: 10, text: 'Install main fuse.' }
  ]
},

{
  id: 's25-electrical-auxiliary-lamp-adjust',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Adjust Auxiliary Lamps',
  summary: 'Align auxiliary lamps with proper beam pattern.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-37' },
  figures: [{ file: '/figures/softail-2025/p7-37.jpg', caption: 'Manual page 7-37' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Auxiliary lamp nut', value: '19–23 ft-lbs (25.7–31.1 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Place motorcycle facing target wall (same as headlamp alignment).' },
    { n: 2, text: 'Check headlamp alignment and adjust if necessary.' },
    { n: 3, text: 'Have rider of equal weight sit on motorcycle.' },
    { n: 4, text: 'Measure distance from floor to centerline of each auxiliary lamp.' },
    { n: 5, text: 'Mark center of headlamp high beam on wall with vertical line.' },
    { n: 6, text: 'Measure horizontal distance from headlamp vertical centerline to each auxiliary lamp.' },
    { n: 7, text: 'Mark auxiliary lamp horizontal and vertical centerlines on wall.' },
    { n: 8, text: 'Remove bulb.' },
    { n: 9, text: 'Loosen mounting nut.' },
    { n: 10, text: 'Adjust lamp housing to align beam with centerline marks.' },
    { n: 11, text: 'While holding lamp housing steady, tighten nut to 19–23 ft-lbs (25.7–31.1 N·m).' },
    { n: 12, text: 'Install bulb.' },
    { n: 13, text: 'Verify auxiliary lamp alignment is correct.' }
  ]
},

{
  id: 's25-electrical-front-turn-signal-led-replace',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Front Turn Signal LED Puck',
  summary: 'Replace LED puck in front turn signal lamp assembly.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2025 HD Softail Service Manual', page: '7-39' },
  figures: [{ file: '/figures/softail-2025/p7-39.jpg', caption: 'Manual page 7-39' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Pry LED puck from housing (LED lamps are not replaceable - replace entire puck).' },
    { n: 2, text: 'Disconnect connector from old puck.' },
    { n: 3, text: 'Remove old LED puck.' },
    { n: 4, text: 'Inspect seal for damage or cracks and replace if needed.' },
    { n: 5, text: 'Connect connector to new LED puck.' },
    { n: 6, text: 'Install new LED puck.' },
    { n: 7, text: 'Press evenly until fully seated.' },
    { n: 8, text: 'Check operation of all lamps.' },
    { n: 9, text: 'Verify all lights operate properly before operating motorcycle.' }
  ]
},

{
  id: 's25-electrical-front-turn-signal-handlebar-remove-install',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove and Install Front Turn Signal (Handlebar Mount)',
  summary: 'Remove and install front turn signal on handlebar.',
  difficulty: 'Medium',
  timeMinutes: 60,
  source: { manual: '2025 HD Softail Service Manual', page: '7-39' },
  figures: [{ file: '/figures/softail-2025/p7-39.jpg', caption: 'Manual page 7-39' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 2, text: 'Loosen ball stud clamp from turn signal bracket.' },
    { n: 3, text: 'Loosen jam nut and remove ball stud from turn signal.' },
    { n: 4, text: 'Remove hand control module from handlebar (left or right as applicable).' },
    { n: 5, text: 'Disconnect turn signal connector. See ELECTRICAL > FRONT ELECTRICAL CADDY.' },
    { n: 6, text: 'Attach scrap wire to old turn signal connector.' },
    { n: 7, text: 'Pull wiring through handlebar.' },
    { n: 8, text: 'Disconnect scrap wire from old connector.' },
    { n: 9, text: 'Attach scrap wire to new turn signal wiring.' },
    { n: 10, text: 'Pull new wiring through handlebar.' },
    { n: 11, text: 'Remove scrap wire.' },
    { n: 12, text: 'Install hand control module to handlebar.' },
    { n: 13, text: 'Connect turn signal connector.' },
    { n: 14, text: 'Slide ball stud through ball stud clamp.' },
    { n: 15, text: 'Install jam nut on ball stud.' },
    { n: 16, text: 'Install ball stud to turn signal and hand tighten jam nut.' },
    { n: 17, text: 'Attach ball stud clamp to turn signal bracket.' },
    { n: 18, text: 'Adjust turn signal to desired position.' },
    { n: 19, text: 'Tighten jam nut.' },
    { n: 20, text: 'Note: Do not cover brake lever pivot pin when installing right turn signal.' }
  ]
},

{
  id: 's25-electrical-front-turn-signal-fixed-fairing-remove-install',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove and Install Front Turn Signal (Fixed Fairing Mount)',
  summary: 'Remove and install front turn signal on fixed fairing.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-40' },
  figures: [{ file: '/figures/softail-2025/p7-40.jpg', caption: 'Manual page 7-40' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Turn signal, frame mounted fairing, screw', value: '15–18 ft-lbs (20.34–24.4 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Disconnect connector from turn signal.' },
    { n: 2, text: 'Remove washer and screw.' },
    { n: 3, text: 'Remove turn signal lamp.' },
    { n: 4, text: 'Remove wiring cable from standoff.' },
    { n: 5, text: 'De-pin connector.' },
    { n: 6, text: 'Remove standoff.' },
    { n: 7, text: 'Install wiring cable through standoff opening.' },
    { n: 8, text: 'Re-pin connector.' },
    { n: 9, text: 'Route connector through fairing bracket opening.' },
    { n: 10, text: 'Position standoff on turn signal.' },
    { n: 11, text: 'Install washer and screw.' },
    { n: 12, text: 'Tighten to 15–18 ft-lbs (20.34–24.4 N·m).' },
    { n: 13, text: 'Loosen screw.' },
    { n: 14, text: 'Re-tighten screw.' },
    { n: 15, text: 'Connect turn signal connector.' }
  ]
},

{
  id: 's25-electrical-rear-turn-signal-led-replace',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Rear Turn Signal LED Puck',
  summary: 'Replace LED puck in rear turn signal lamp assembly.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2025 HD Softail Service Manual', page: '7-42' },
  figures: [{ file: '/figures/softail-2025/p7-42.jpg', caption: 'Manual page 7-42' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Carefully pry slots in LED puck.' },
    { n: 2, text: 'Disconnect connector from old puck.' },
    { n: 3, text: 'Remove old LED puck.' },
    { n: 4, text: 'Inspect seal and replace puck if needed.' },
    { n: 5, text: 'Connect connector to new LED puck.' },
    { n: 6, text: 'Align notch to housing.' },
    { n: 7, text: 'Press evenly until fully seated.' },
    { n: 8, text: 'Verify notch is in 12 o\'clock or 6 o\'clock position.' },
    { n: 9, text: 'Check operation of all lamps.' },
    { n: 10, text: 'Verify all lights operate properly before operating motorcycle.' }
  ]
},

{
  id: 's25-electrical-rear-turn-signal-fender-remove-install',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove and Install Rear Turn Signal (Fender Mount)',
  summary: 'Remove and install rear turn signal on fender.',
  difficulty: 'Medium',
  timeMinutes: 60,
  source: { manual: '2025 HD Softail Service Manual', page: '7-42' },
  figures: [{ file: '/figures/softail-2025/p7-42.jpg', caption: 'Manual page 7-42' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Fender Support, Screw', value: '42–46 ft-lbs (57–62 N·m)' },
    { fastener: 'Rear Turn Signal, Fender Mount, Screw', value: '15–18 ft-lbs (20–24 N·m)' },
    { fastener: 'Rear Turn Signal, Fender Support, Screw', value: '21–27 ft-lbs (28–37 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 2, text: 'Remove seat if needed. See CHASSIS > SEAT.' },
    { n: 3, text: 'If removing both turn signals, remove rear fender if needed.' },
    { n: 4, text: 'Remove rear lighting assembly if equipped. See TAIL LAMP > REMOVE AND INSTALL: REAR LIGHTING ASSEMBLY.' },
    { n: 5, text: 'Disconnect connector(s) from turn signal.' },
    { n: 6, text: 'Remove fender support screws.' },
    { n: 7, text: 'Remove fender support washers and screws.' },
    { n: 8, text: 'Remove fender support.' },
    { n: 9, text: 'Remove and discard wire retention pads.' },
    { n: 10, text: 'Remove harness.' },
    { n: 11, text: 'Remove turn signal screws and washers.' },
    { n: 12, text: 'Disassemble turn signal components (license plate mounting support if equipped, lamp mounting support).' },
    { n: 13, text: 'Assemble new turn signal.' },
    { n: 14, text: 'Install screw and washer. Tighten to 15–18 ft-lbs (20–24 N·m).' },
    { n: 15, text: 'Route harness through fender support.' },
    { n: 16, text: 'Install new wire retention pads.' },
    { n: 17, text: 'Install fender support with washers and screws. Tighten to 42–46 ft-lbs (57–62 N·m).' },
    { n: 18, text: 'Install support screws. Tighten to 21–27 ft-lbs (28–37 N·m).' },
    { n: 19, text: 'Connect connector(s) to turn signal.' }
  ]
},

{
  id: 's25-electrical-tail-lamp-rear-lighting-remove-install',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove and Install Tail Lamp (Rear Lighting Assembly)',
  summary: 'Remove and install complete tail lamp with rear lighting assembly.',
  difficulty: 'Medium',
  timeMinutes: 60,
  source: { manual: '2025 HD Softail Service Manual', page: '7-48' },
  figures: [{ file: '/figures/softail-2025/p7-48.jpg', caption: 'Manual page 7-48' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Tail lamp bracket, screw', value: '40–48 in-lbs (4.5–5.4 N·m)' },
    { fastener: 'Tail lamp lens screw', value: '20–24 in-lbs (2.3–2.7 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 2, text: 'Remove seat. See CHASSIS > SEAT.' },
    { n: 3, text: 'Loosen LED housing screw.' },
    { n: 4, text: 'Disconnect connector from LED housing.' },
    { n: 5, text: 'Remove LED housing.' },
    { n: 6, text: 'Inspect seal for damage or wear and replace if needed.' },
    { n: 7, text: 'Remove tail lamp connector from bracket.' },
    { n: 8, text: 'Disconnect turn signal connectors.' },
    { n: 9, text: 'Remove screw from tail lamp assembly.' },
    { n: 10, text: 'Remove tail lamp assembly.' },
    { n: 11, text: 'Remove and inspect gasket.' },
    { n: 12, text: 'Remove and discard anchored cable straps.' },
    { n: 13, text: 'Disconnect right and left turn connectors.' },
    { n: 14, text: 'Disconnect tail lamp connector.' },
    { n: 15, text: 'Remove cable from clip and conduit from fender.' },
    { n: 16, text: 'Remove wiring harness.' },
    { n: 17, text: 'Route new wiring harness through hole in fender.' },
    { n: 18, text: 'Apply adhesive conduit to fender and install cable behind clip.' },
    { n: 19, text: 'Connect turn signal and tail lamp connectors.' },
    { n: 20, text: 'Install new anchored cable straps.' },
    { n: 21, text: 'Install tail lamp gasket.' },
    { n: 22, text: 'Install tail lamp assembly.' },
    { n: 23, text: 'Route wiring harness through opening.' },
    { n: 24, text: 'Install screw. Tighten to 40–48 in-lbs (4.5–5.4 N·m).' },
    { n: 25, text: 'Connect turn signal connectors.' },
    { n: 26, text: 'Connect LED housing and install LED housing. Tighten screws to 20–24 in-lbs (2.3–2.7 N·m).' }
  ]
},

{
  id: 's25-electrical-tail-lamp-standard-remove-install',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove and Install Tail Lamp (Standard)',
  summary: 'Remove and install standard tail lamp assembly.',
  difficulty: 'Easy',
  timeMinutes: 30,
  source: { manual: '2025 HD Softail Service Manual', page: '7-49' },
  figures: [{ file: '/figures/softail-2025/p7-49.jpg', caption: 'Manual page 7-49' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Tail lamp base, standard, screw', value: '40–48 in-lbs (4.5–5.4 N·m)' },
    { fastener: 'Tail lamp lens screw', value: '20–24 in-lbs (2.3–2.7 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 2, text: 'Remove seat. See CHASSIS > SEAT.' },
    { n: 3, text: 'Loosen LED housing screw.' },
    { n: 4, text: 'Disconnect connector from LED housing.' },
    { n: 5, text: 'Remove LED housing.' },
    { n: 6, text: 'Inspect seal for damage or wear and replace if needed.' },
    { n: 7, text: 'Mark connectors for easier installation.' },
    { n: 8, text: 'Disconnect connectors from tail lamp base.' },
    { n: 9, text: 'Remove and discard anchored cable straps.' },
    { n: 10, text: 'Remove base screw.' },
    { n: 11, text: 'Remove tail lamp base.' },
    { n: 12, text: 'Inspect gasket for wear or damage and replace if needed.' },
    { n: 13, text: 'Install new tail lamp gasket.' },
    { n: 14, text: 'Install new tail lamp base.' },
    { n: 15, text: 'Route marked cables through opening in base.' },
    { n: 16, text: 'Install screw. Tighten to 40–48 in-lbs (4.5–5.4 N·m).' },
    { n: 17, text: 'Connect marked connectors.' },
    { n: 18, text: 'Install new anchored cable straps.' },
    { n: 19, text: 'Connect LED housing connector.' },
    { n: 20, text: 'Install LED housing.' },
    { n: 21, text: 'Tighten LED housing screw to 20–24 in-lbs (2.3–2.7 N·m).' }
  ]
},

{
  id: 's25-electrical-rear-stoplamp-switch-install',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Install Rear Stoplamp Switch',
  summary: 'Install rear stoplamp switch for brake operation.',
  difficulty: 'Medium',
  timeMinutes: 30,
  source: { manual: '2025 HD Softail Service Manual', page: '7-51' },
  figures: [{ file: '/figures/softail-2025/p7-51.jpg', caption: 'Manual page 7-51' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'Rear stoplamp switch', value: '12–15 ft-lbs (16.3–20.3 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 2, text: 'Position rear stoplamp switch on mounting bracket.' },
    { n: 3, text: 'Install switch screws.' },
    { n: 4, text: 'Tighten switch to 12–15 ft-lbs (16.3–20.3 N·m).' },
    { n: 5, text: 'Connect switch connector.' },
    { n: 6, text: 'Verify brake operation.' },
    { n: 7, text: 'Test stoplamp function.' },
    { n: 8, text: 'Install main fuse.' }
  ]
},

{
  id: 's25-electrical-license-plate-lamp-side-mount',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Remove and Install License Plate Lamp (Side Mount)',
  summary: 'Remove and install license plate lamp on side fender.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2025 HD Softail Service Manual', page: '7-51' },
  figures: [{ file: '/figures/softail-2025/p7-51.jpg', caption: 'Manual page 7-51' }],
  tools: [],
  parts: [],
  torque: [
    { fastener: 'License Plate Lamp Cover, Screw', value: '8–16 in-lbs (0.9–1.8 N·m)' }
  ],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 2, text: 'Disconnect connector from license plate lamp.' },
    { n: 3, text: 'Remove cover screws.' },
    { n: 4, text: 'Remove lamp assembly.' },
    { n: 5, text: 'Install new license plate lamp.' },
    { n: 6, text: 'Connect connector.' },
    { n: 7, text: 'Install cover.' },
    { n: 8, text: 'Install cover screws. Tighten to 8–16 in-lbs (0.9–1.8 N·m).' },
    { n: 9, text: 'Test lamp operation.' },
    { n: 10, text: 'Install main fuse.' }
  ]
},

{
  id: 's25-electrical-terminating-resistor-install',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Install Terminating Resistor',
  summary: 'Install terminating resistor for turn signal circuit protection.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2025 HD Softail Service Manual', page: '7-53' },
  figures: [{ file: '/figures/softail-2025/p7-53.jpg', caption: 'Manual page 7-53' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT.' },
    { n: 2, text: 'Disconnect turn signal control module connector.' },
    { n: 3, text: 'Locate the appropriate connector cavity for terminating resistor installation.' },
    { n: 4, text: 'Install terminating resistor in correct cavity (consult wiring diagram for proper position).' },
    { n: 5, text: 'Verify resistor is fully seated and held firmly in place.' },
    { n: 6, text: 'Reconnect control module connector ensuring proper engagement.' },
    { n: 7, text: 'Install main fuse to restore power to turn signal circuit.' },
    { n: 8, text: 'Test left turn signal operation.' },
    { n: 9, text: 'Test right turn signal operation.' },
    { n: 10, text: 'Verify turn signal flasher and all lamps operate properly.' }
  ]
},
  // --- BEGIN SOFTAIL 2025 CHAPTER 7B JOBS ---
  {
  id: 's25-electrical-replace-ecm',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Electronic Control Module',
  summary: 'Prepare by removing fuse and covers. Remove ECM by lifting tabs and disconnecting connector. Install new ECM, connect connector, and verify security.',
  difficulty: 'Medium',
  timeMinutes: 30,
  source: { manual: '2025 HD Softail Service Manual', page: '7-56' },
  figures: [{ file: '/figures/softail-2025/p7-56.jpg', caption: 'Manual page 7-56' }],
  tools: ['Torx drivers'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 2, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 3, text: 'Remove splash guard.' },
    { n: 4, text: 'Lift top tabs up and tilt ECM to gain clearance to cam lock connector.' },
    { n: 5, text: 'Disconnect cam lock connector.' },
    { n: 6, text: 'Remove ECM.' },
    { n: 7, text: 'Connect cam lock connector to new ECM. Verify connector lock is engaged.' },
    { n: 8, text: 'Install ECM in lower tabs.' },
    { n: 9, text: 'Pivot ECM up and engage upper tabs.' },
    { n: 10, text: 'Verify ECM is secure in ECM caddy.' },
    { n: 11, text: 'Install splash guard.' },
    { n: 12, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 13, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 14, text: 'Always calibrate replaced ECM with DIGITAL TECHNICIAN II (PART NUMBER: HD-48650).' },
  ]
},
{
  id: 's25-electrical-relocate-bcm-caddy',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Relocate BCM and Caddy for Service',
  summary: 'Disconnect WSS connector, remove cable strap and screws, lift caddy from battery box. Secure out of the way for service access.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-57' },
  figures: [{ file: '/figures/softail-2025/p7-57.jpg', caption: 'Manual page 7-57' }],
  tools: [],
  parts: [['Cable strap (new)']],
  torque: [{ fastener: 'BCM caddy screws', value: '68–83 in-lbs (7.7–9.4 N·m)' }],
  steps: [
    { n: 1, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 2, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 3, text: 'Remove right side cover and close out cover. See CHASSIS > RIGHT SIDE COVER (Page 3-59).' },
    { n: 4, text: 'Disconnect WSS connector (12).' },
    { n: 5, text: 'Remove WSS cable (11) from retainers.' },
    { n: 6, text: 'Remove and discard cable strap (9).' },
    { n: 7, text: 'Remove screws (6).' },
    { n: 8, text: 'Lift BCM caddy from battery box caddy.' },
    { n: 9, text: 'Secure BCM caddy out of the way for service.' },
    { n: 10, text: 'Use caution when moving BCM and wiring around hot exhaust to avoid damage.' },
  ]
},
{
  id: 's25-electrical-install-bcm-caddy',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Install BCM and Caddy',
  summary: 'Install BCM caddy in position, install screws and tighten to spec. Connect WSS connector, install cable, and cable strap.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-57' },
  figures: [{ file: '/figures/softail-2025/p7-57.jpg', caption: 'Manual page 7-57' }],
  tools: [],
  parts: [['Cable strap (new)']],
  torque: [{ fastener: 'BCM caddy screws', value: '68–83 in-lbs (7.7–9.4 N·m)' }],
  steps: [
    { n: 1, text: 'Install BCM caddy in position.' },
    { n: 2, text: 'Install screws (6). Tighten. Torque: 68–83 in-lbs (7.7–9.4 N·m) BCM caddy screws.' },
    { n: 3, text: 'Connect WSS connector (12).' },
    { n: 4, text: 'Install WSS cable (11) into wire retainer.' },
    { n: 5, text: 'Install new cable strap (9).' },
    { n: 6, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 7, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 8, text: 'Install close out cover and right side cover. See CHASSIS > RIGHT SIDE COVER (Page 3-59).' },
  ]
},
{
  id: 's25-electrical-replace-bcm',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Body Control Module',
  summary: 'Remove BCM caddy connectors including battery tender, CAN bus connectors, security siren, and WSS housing. Remove BCM from caddy.',
  difficulty: 'Hard',
  timeMinutes: 60,
  source: { manual: '2025 HD Softail Service Manual', page: '7-57' },
  figures: [{ file: '/figures/softail-2025/p7-57.jpg', caption: 'Manual page 7-57' }],
  tools: [],
  parts: [['Cable strap (new)']],
  torque: [{ fastener: 'BCM caddy screws', value: '68–83 in-lbs (7.7–9.4 N·m)' }],
  steps: [
    { n: 1, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 2, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 3, text: 'Remove right side cover and close out cover. See CHASSIS > RIGHT SIDE COVER (Page 3-59).' },
    { n: 4, text: 'Disconnect WSS connector (12).' },
    { n: 5, text: 'Remove WSS cable (11) from wire retainer.' },
    { n: 6, text: 'Remove and discard cable strap (9).' },
    { n: 7, text: 'Remove screws (6).' },
    { n: 8, text: 'Lift BCM caddy from battery box caddy.' },
    { n: 9, text: 'If completely removing BCM caddy, disconnect battery tender (2).' },
    { n: 10, text: 'Remove primary Controller Area Network (CAN) BUS (4).' },
    { n: 11, text: 'Remove secondary CAN Bus (3).' },
    { n: 12, text: 'Remove security siren (5) from holder and wire retainer.' },
    { n: 13, text: 'Remove WSS connector housing (10) from caddy.' },
    { n: 14, text: 'Disconnect cam lock connector (7).' },
    { n: 15, text: 'Disconnect connector (8).' },
    { n: 16, text: 'Remove BCM (1) from BCM caddy (3).' },
    { n: 17, text: 'Slide new BCM (1) into tabs (4).' },
    { n: 18, text: 'Secure BCM to BCM caddy.' },
    { n: 19, text: 'Connect connector (8).' },
    { n: 20, text: 'Connect cam lock connector (7).' },
  ]
},
{
  id: 's25-electrical-activate-security-system',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Activate Security System with Fobs',
  summary: 'Configure security system by assigning two fobs to vehicle using DIGITAL TECHNICIAN II. Enter initial PIN selected by owner.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-60' },
  figures: [{ file: '/figures/softail-2025/p7-60.jpg', caption: 'Manual page 7-60' }],
  tools: ['DIGITAL TECHNICIAN II (HD-48650)', 'Barcode reader or keyboard'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Obtain DIGITAL TECHNICIAN II (PART NUMBER: HD-48650) diagnostic tool.' },
    { n: 2, text: 'Choose correct fob type. Choosing incorrectly results in failure to assign fob.' },
    { n: 3, text: 'Keep fob within 3 ft (1 m) of vehicle seat during assignment.' },
    { n: 4, text: 'Locate serial number on inside of fob.' },
    { n: 5, text: 'Use DIGITAL TECHNICIAN II to assign first fob. Scan fob serial number with barcode reader or key in manually.' },
    { n: 6, text: 'Use DIGITAL TECHNICIAN II to assign second fob. Repeat process.' },
    { n: 7, text: 'Use DIGITAL TECHNICIAN II to enter initial PIN picked by owner. PIN consists of 5 digits, each 1 through 9, no zeros.' },
    { n: 8, text: 'Record PIN in owner manual. Instruct customer to carry a copy.' },
    { n: 9, text: 'Attach fob label to blank NOTES page in owner manual for reference.' },
    { n: 10, text: 'System arms within 5 seconds of switching ignition switch to OFF and no motorcycle motion.' },
  ]
},
{
  id: 's25-electrical-change-pin',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Change Personal Identification Number',
  summary: 'Change 5-digit PIN (digits 1-9, no zeros) using turn signal switches. Record new PIN on owner manual wallet card.',
  difficulty: 'Easy',
  timeMinutes: 15,
  source: { manual: '2025 HD Softail Service Manual', page: '7-61' },
  figures: [{ file: '/figures/softail-2025/p7-61.jpg', caption: 'Manual page 7-61' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Select a 5-digit PIN (1 thru 9, no zeros) and record on wallet card from owners manual.' },
    { n: 2, text: 'With assigned fob present, turn OFF/RUN switch to OFF.' },
    { n: 3, text: 'Turn OFF/RUN switch to RUN.' },
    { n: 4, text: 'Cycle OFF/RUN switch twice: RUN - OFF - RUN - OFF - RUN.' },
    { n: 5, text: 'Press left turn signal switch two times. ENTER PIN will scroll through odometer window.' },
    { n: 6, text: 'Press right turn signal switch one time. Turn signals will flash three times. Current PIN appears in odometer, first digit flashing.' },
    { n: 7, text: 'Enter first digit of new PIN by pressing left turn signal switch until selected digit appears.' },
    { n: 8, text: 'Press right turn signal switch one time. New digit replaces current in odometer window.' },
    { n: 9, text: 'Enter second digit by pressing left turn signal switch until selected digit appears.' },
    { n: 10, text: 'Press right turn signal switch one time. New digit displayed.' },
    { n: 11, text: 'Enter third digit by pressing left turn signal switch until selected digit appears.' },
    { n: 12, text: 'Press right turn signal switch one time. New digit displayed.' },
    { n: 13, text: 'Enter fourth digit by pressing left turn signal switch until selected digit appears.' },
    { n: 14, text: 'Press right turn signal switch one time. New digit displayed.' },
    { n: 15, text: 'Enter fifth digit by pressing left turn signal switch until selected digit appears.' },
    { n: 16, text: 'Press right turn signal switch one time. New digit displayed.' },
    { n: 17, text: 'Turn OFF/RUN switch OFF, then turn ignition switch to OFF. This stores new PIN in module.' },
  ]
},
{
  id: 's25-electrical-security-service-mode',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Enable Security System Service Mode',
  summary: 'Configure security system for service by disabling with DIGITAL TECHNICIAN II. Vehicle can be operated without assigned fob.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2025 HD Softail Service Manual', page: '7-62' },
  figures: [{ file: '/figures/softail-2025/p7-62.jpg', caption: 'Manual page 7-62' }],
  tools: ['DIGITAL TECHNICIAN II (HD-48650)'],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Have assigned fob present.' },
    { n: 2, text: 'Obtain DIGITAL TECHNICIAN II (PART NUMBER: HD-48650) diagnostic tool.' },
    { n: 3, text: 'Use DIGITAL TECHNICIAN II to disable security system for service.' },
    { n: 4, text: 'Once disabled, vehicle can be operated without assigned fob present.' },
    { n: 5, text: 'Keep assigned fobs out of range to maintain service mode.' },
    { n: 6, text: 'If fob appears in range, service mode is automatically cancelled.' },
  ]
},
{
  id: 's25-electrical-security-transport-mode',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Enable Security System Transport Mode',
  summary: 'Arm security system without motion detector for one ignition cycle. Motorcycle can be moved in armed state.',
  difficulty: 'Easy',
  timeMinutes: 10,
  source: { manual: '2025 HD Softail Service Manual', page: '7-62' },
  figures: [{ file: '/figures/softail-2025/p7-62.jpg', caption: 'Manual page 7-62' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'With security fob present, set OFF/RUN switch to RUN.' },
    { n: 2, text: 'Set OFF/RUN switch to OFF.' },
    { n: 3, text: 'Simultaneously press both left and right turn signal switches within 5 seconds of turning ignition to OFF.' },
    { n: 4, text: 'Following single flash, turn signals flash three times to indicate system is armed in transport mode.' },
    { n: 5, text: 'Motorcycle cannot be turned on or started while in transport mode until fob is present.' },
    { n: 6, text: 'To exit transport mode: with fob present, set OFF/RUN switch to RUN to disarm system.' },
  ]
},
{
  id: 's25-electrical-replace-fob-battery',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Fob Battery',
  summary: 'Replace fob CR2032 battery annually. Open case with blade, remove old battery, install new with positive side up.',
  difficulty: 'Easy',
  timeMinutes: 10,
  source: { manual: '2025 HD Softail Service Manual', page: '7-62' },
  figures: [{ file: '/figures/softail-2025/p7-62.jpg', caption: 'Manual page 7-62' }],
  tools: ['Thin blade tool'],
  parts: [['CR2032 battery (1)']],
  torque: [],
  steps: [
    { n: 1, text: 'Replace fob battery every year.' },
    { n: 2, text: 'Place thin blade in thumbnail slot (1) on fob case.' },
    { n: 3, text: 'Twist blade to separate fob case halves.' },
    { n: 4, text: 'Push latch (3) away from battery.' },
    { n: 5, text: 'Lift battery from side opposite latch.' },
    { n: 6, text: 'Verify metal tabs will firmly contact battery. Bend up slightly if necessary.' },
    { n: 7, text: 'Install new CR2032 battery against latch with positive side up. Use CR1632 or equivalent.' },
    { n: 8, text: 'Drop battery into place.' },
    { n: 9, text: 'Snap case halves back together to close fob.' },
  ]
},
{
  id: 's25-electrical-replace-siren-battery',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Security Siren Battery',
  summary: 'Replace 9V nickel metal hydride battery in security siren. Siren internal battery is rechargeable; life is 3-6 years.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2025 HD Softail Service Manual', page: '7-62' },
  figures: [{ file: '/figures/softail-2025/p7-62.jpg', caption: 'Manual page 7-62' }],
  tools: ['Small screwdriver'],
  parts: [['9V nickel metal hydride battery (1)']],
  torque: [],
  steps: [
    { n: 1, text: 'Disarm security system before servicing siren.' },
    { n: 2, text: 'Remove security siren from motorcycle.' },
    { n: 3, text: 'With small screwdriver, push catches (1) through slots (2) in end of siren.' },
    { n: 4, text: 'Release battery cover (3) from siren case.' },
    { n: 5, text: 'Note: battery terminals and clip are covered with grease to prevent corrosion. Do not wipe away.' },
    { n: 6, text: 'Remove old 9V battery from polarized battery clip.' },
    { n: 7, text: 'Install new 9V nickel metal hydride battery in clip. Recharge if not new.' },
    { n: 8, text: 'Carefully replace rubber seal (5) on battery cover.' },
    { n: 9, text: 'Align cover with case, placing round corners away from connector [142A] (6).' },
    { n: 10, text: 'Snap cover into place.' },
    { n: 11, text: 'Install siren and check operation. Two chirps after arming indicate working siren.' },
  ]
},
{
  id: 's25-electrical-replace-antenna',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Security System Antenna',
  summary: 'Remove main fuse and seat. Remove antenna from caddy and disconnect connector. Install new antenna and reconnect.',
  difficulty: 'Easy',
  timeMinutes: 20,
  source: { manual: '2025 HD Softail Service Manual', page: '7-64' },
  figures: [{ file: '/figures/softail-2025/p7-64.jpg', caption: 'Manual page 7-64' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 2, text: 'Remove seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 3, text: 'Remove antenna (1) from caddy.' },
    { n: 4, text: 'Disconnect connector (2).' },
    { n: 5, text: 'Remove antenna.' },
    { n: 6, text: 'Install new antenna.' },
    { n: 7, text: 'Connect connector (2).' },
    { n: 8, text: 'Connect antenna to caddy.' },
    { n: 9, text: 'Install seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 10, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
  ]
},
{
  id: 's25-electrical-replace-ckp-sensor',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Crankshaft Position Sensor',
  summary: 'Remove main fuse and voltage regulator. Disconnect and remove sensor. Install new sensor with new O-ring, lubricate, torque, and reconnect.',
  difficulty: 'Medium',
  timeMinutes: 30,
  source: { manual: '2025 HD Softail Service Manual', page: '7-65' },
  figures: [{ file: '/figures/softail-2025/p7-65.jpg', caption: 'Manual page 7-65' }],
  tools: ['TORX drivers'],
  parts: [['O-ring (new)', 'Clean engine oil']],
  torque: [{ fastener: 'Sensor, CKP, screw', value: '90–120 in-lbs (10.2–13.6 N·m)' }],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 2, text: 'Remove voltage regulator. See ELECTRICAL > VOLTAGE REGULATOR (Page 7-11).' },
    { n: 3, text: 'Disconnect connector (1).' },
    { n: 4, text: 'Detach connector (1) from voltage regulator bracket.' },
    { n: 5, text: 'Remove screw (2).' },
    { n: 6, text: 'Remove sensor (3).' },
    { n: 7, text: 'Discard old O-ring.' },
    { n: 8, text: 'Lubricate new O-ring with clean engine oil.' },
    { n: 9, text: 'Install new O-ring on sensor.' },
    { n: 10, text: 'Install sensor (3).' },
    { n: 11, text: 'Install screw (2). Tighten. Torque: 90–120 in-lbs (10.2–13.6 N·m) Sensor, CKP, screw.' },
    { n: 12, text: 'Attach connector (1) to voltage regulator bracket.' },
    { n: 13, text: 'Connect connector (1).' },
    { n: 14, text: 'Install voltage regulator. See ELECTRICAL > VOLTAGE REGULATOR (Page 7-11).' },
    { n: 15, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
  ]
},
{
  id: 's25-electrical-replace-camshaft-timing-sensor',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Camshaft Timing Sensor',
  summary: 'Remove saddlebag and side covers. Remove camshaft cover screws and sensor cover. Disconnect connector and remove sensor, discard O-ring.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-66' },
  figures: [{ file: '/figures/softail-2025/p7-66.jpg', caption: 'Manual page 7-66' }],
  tools: [],
  parts: [['O-ring (new)', 'Clean engine oil']],
  torque: [{ fastener: 'Camshaft cover screws', value: '72–96 in-lbs (8.1–10.8 N·m)' }, { fastener: 'Camshaft sensor cover screw', value: '72–96 in-lbs (8.1–10.8 N·m)' }],
  steps: [
    { n: 1, text: 'Remove left saddlebag. See CHASSIS > SADDLEBAGS (Page 3-139).' },
    { n: 2, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 3, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 4, text: 'Remove cover screws (4).' },
    { n: 5, text: 'Remove cover (3).' },
    { n: 6, text: 'Remove screw (1) from sensor cover.' },
    { n: 7, text: 'Remove camshaft sensor cover (2).' },
    { n: 8, text: 'Disconnect connector (2) from camshaft timing sensor.' },
    { n: 9, text: 'Remove camshaft timing sensor (1).' },
    { n: 10, text: 'Discard old O-ring (1).' },
    { n: 11, text: 'Install new O-ring (1) to camshaft timing sensor (2).' },
    { n: 12, text: 'Lubricate O-ring and camshaft timing sensor shaft with clean engine oil.' },
    { n: 13, text: 'Connect camshaft timing sensor connector (2).' },
    { n: 14, text: 'Install camshaft sensor (1).' },
    { n: 15, text: 'Install sensor cover (2).' },
    { n: 16, text: 'Install screw (1). Tighten. Torque: 72–96 in-lbs (8.1–10.8 N·m) Camshaft sensor cover screw.' },
    { n: 17, text: 'Install cover (3).' },
    { n: 18, text: 'Install cover screws (4). Tighten. Torque: 72–96 in-lbs (8.1–10.8 N·m) Camshaft cover screws.' },
    { n: 19, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 20, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 21, text: 'Install left saddlebag. See CHASSIS > SADDLEBAGS (Page 3-139).' },
  ]
},
{
  id: 's25-electrical-replace-et-sensor',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Engine Temperature Sensor',
  summary: 'Purge fuel system and remove fuel tank, seat, covers. Remove sensor socket from engine head. Install new sensor with special socket tool and torque spec.',
  difficulty: 'Hard',
  timeMinutes: 90,
  source: { manual: '2025 HD Softail Service Manual', page: '7-68' },
  figures: [{ file: '/figures/softail-2025/p7-68.jpg', caption: 'Manual page 7-68' }],
  tools: ['TEMPERATURE SENSOR SOCKET (HD-48116-A)'],
  parts: [['Engine temperature sensor (new)']],
  torque: [{ fastener: 'Engine temperature sensor', value: '10–15 ft-lbs (13.6–20.3 N·m)' }],
  steps: [
    { n: 1, text: 'Purge fuel system. See FUEL AND EXHAUST > PURGE FUEL LINE (Page 6-12).' },
    { n: 2, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 3, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 4, text: 'Remove seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 5, text: 'Remove fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 6, text: 'Remove air cleaner assembly. See FUEL AND EXHAUST > AIR CLEANER BACKPLATE ASSEMBLY (Page 6-4).' },
    { n: 7, text: 'Remove throttle body from induction module. See FUEL AND EXHAUST > INDUCTION MODULE (Page 6-29).' },
    { n: 8, text: 'Note: if ET sensor cable has tear tape, do not remove it. Tape secures cable from damage.' },
    { n: 9, text: 'Remove and discard cable strap (6).' },
    { n: 10, text: 'Disconnect connector (3).' },
    { n: 11, text: 'Remove cable (1) from retainer (2).' },
    { n: 12, text: 'Remove engine temperature sensor (4). Use TEMPERATURE SENSOR SOCKET (HD-48116-A).' },
    { n: 13, text: 'Install new engine temperature sensor (4). Tighten. Torque: 10–15 ft-lbs (13.6–20.3 N·m).' },
    { n: 14, text: 'Route cable (1) through retainer (2).' },
    { n: 15, text: 'Connect connector (3).' },
    { n: 16, text: 'Install new cable strap (6) capturing throttle position sensor cable (5) with ETS cable (1).' },
    { n: 17, text: 'Install throttle body to induction module. See FUEL AND EXHAUST > INDUCTION MODULE (Page 6-29).' },
    { n: 18, text: 'Install air cleaner assembly. See FUEL AND EXHAUST > AIR CLEANER BACKPLATE ASSEMBLY (Page 6-4).' },
    { n: 19, text: 'Install fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 20, text: 'Install seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 21, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 22, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
  ]
},
{
  id: 's25-electrical-replace-knock-sensor',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Knock Sensor',
  summary: 'Purge fuel and remove fuel tank. Disconnect spark plugs. Remove engine mount bracket and disconnect knock sensor connector. Remove and reinstall sensor with orientation.',
  difficulty: 'Hard',
  timeMinutes: 90,
  source: { manual: '2025 HD Softail Service Manual', page: '7-69' },
  figures: [{ file: '/figures/softail-2025/p7-69.jpg', caption: 'Manual page 7-69' }],
  tools: [],
  parts: [['Knock sensor (new)', 'Washer (2)']],
  torque: [{ fastener: 'Engine mount screw, left side, bracket-to-frame', value: '45–50 ft-lbs (61–67.8 N·m)' }, { fastener: 'Engine mount screw, left side, bracket-to-head', value: '28–33 ft-lbs (38–44.7 N·m)' }, { fastener: 'Knock sensor screw', value: '16–18 ft-lbs (22–24 N·m)' }],
  steps: [
    { n: 1, text: 'Purge fuel system. See FUEL AND EXHAUST > PURGE FUEL LINE (Page 6-12).' },
    { n: 2, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 3, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 4, text: 'Remove seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 5, text: 'Remove fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 6, text: 'Disconnect spark plug cables from ignition coil. See ELECTRICAL > SPARK PLUG CABLES (Page 7-12).' },
    { n: 7, text: 'Remove screws (2) from engine mount bracket.' },
    { n: 8, text: 'Remove screws (3) and washers (4) from engine mount bracket.' },
    { n: 9, text: 'Remove engine mount bracket (1) to access knock sensor.' },
    { n: 10, text: 'Disconnect connector (2) from knock sensor.' },
    { n: 11, text: 'Remove screw (4) from knock sensor.' },
    { n: 12, text: 'Remove knock sensor (3).' },
    { n: 13, text: 'Install new knock sensor (3) on engine mount bracket (1).' },
    { n: 14, text: 'Loosely install screw (4).' },
    { n: 15, text: 'Orient sensor 30–40 degrees from center of bracket as shown in diagram.' },
    { n: 16, text: 'Tighten screw (4). Torque: 16–18 ft-lbs (22–24 N·m) Knock sensor screw.' },
    { n: 17, text: 'Connect connector (2).' },
    { n: 18, text: 'Install screws (2). Do not tighten yet.' },
    { n: 19, text: 'Install washers (4) and screws (3). Tighten. Torque: 28–33 ft-lbs (38–44.7 N·m) Engine mount screw, left side, bracket-to-head.' },
    { n: 20, text: 'Tighten screws (2). Torque: 45–50 ft-lbs (61–67.8 N·m) Engine mount screw, left side, bracket-to-frame.' },
    { n: 21, text: 'Connect spark plug cables to ignition coil. See ELECTRICAL > IGNITION COIL (Page 7-13).' },
    { n: 22, text: 'Install fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 23, text: 'Install seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 24, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 25, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
  ]
},
{
  id: 's25-electrical-replace-acr',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Automatic Compression Release',
  summary: 'Purge fuel and remove fuel tank. Disconnect ACR connectors and remove cable. Apply threadlocker to new ACR. Tighten with special socket tool.',
  difficulty: 'Hard',
  timeMinutes: 90,
  source: { manual: '2025 HD Softail Service Manual', page: '7-71' },
  figures: [{ file: '/figures/softail-2025/p7-71.jpg', caption: 'Manual page 7-71' }],
  tools: ['ACR SOLENOID SOCKET (HD-48498-B-1)'],
  parts: [['ACR (front and rear)', 'LOCTITE 246 HIGH TEMPERATURE MEDIUM STRENGTH BLUE THREADLOCKER']],
  torque: [{ fastener: 'ACR', value: '17–19 ft-lbs (23–26.4 N·m)' }],
  steps: [
    { n: 1, text: 'Purge fuel system. See FUEL AND EXHAUST > PURGE FUEL LINE (Page 6-12).' },
    { n: 2, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 3, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 4, text: 'Remove seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 5, text: 'Remove fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 6, text: 'Disconnect ACR connectors (1,3).' },
    { n: 7, text: 'Remove rear ACR cable (2) from retainer (4).' },
    { n: 8, text: 'Remove ACR (1,2). Use ACR SOLENOID SOCKET (HD-48498-B-1).' },
    { n: 9, text: 'Verify copper seal washer is in place on new ACR.' },
    { n: 10, text: 'If installing new ACR, verify old copper seal washer does not remain in cylinder head.' },
    { n: 11, text: 'Apply LOCTITE 246 HIGH TEMPERATURE MEDIUM STRENGTH BLUE THREADLOCKER.' },
    { n: 12, text: 'Identify location around threads of ACR approximately one-third distance from end.' },
    { n: 13, text: 'Apply three equally spaced dots of threadlocker on threads.' },
    { n: 14, text: 'Install new ACR (1,2) by hand until finger-tight.' },
    { n: 15, text: 'Use socket to tighten. Torque: 17–19 ft-lbs (23–26.4 N·m) ACR.' },
    { n: 16, text: 'Connect ACR connectors (1,3).' },
    { n: 17, text: 'Install rear ACR cable (2) in retainer (4).' },
    { n: 18, text: 'Install fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 19, text: 'Install seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 20, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 21, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
  ]
},
{
  id: 's25-electrical-replace-gear-sensor',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Gear Position Sensor',
  summary: 'Remove saddlebag and side covers. Remove gear cover. Disconnect connector and remove screws. Install new sensor with seal aligned to shift drum.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-73' },
  figures: [{ file: '/figures/softail-2025/p7-73.jpg', caption: 'Manual page 7-73' }],
  tools: ['DIGITAL TECHNICIAN II (HD-48650) for calibration'],
  parts: [['Gear position sensor (new)', 'Seal (if needed)']],
  torque: [{ fastener: 'Gear position sensor cover screws', value: '72–96 in-lbs (8.13–10.8 N·m)' }],
  steps: [
    { n: 1, text: 'Remove left saddlebag. See CHASSIS > SADDLEBAGS (Page 3-139).' },
    { n: 2, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 3, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 4, text: 'Remove gear cover (1). Cover is held on by clip.' },
    { n: 5, text: 'Remove screws (5).' },
    { n: 6, text: 'Disconnect connector (2).' },
    { n: 7, text: 'Remove gear position sensor (4).' },
    { n: 8, text: 'Check seal (2) in groove. Replace if necessary.' },
    { n: 9, text: 'Clean groove in gear position sensor (3) from all residual oil and debris.' },
    { n: 10, text: 'Press in seal (2) if replacing.' },
    { n: 11, text: 'Connect connector (2) to new sensor.' },
    { n: 12, text: 'Align flat spot on gear position sensor with flat spot on shift drum (3).' },
    { n: 13, text: 'Slide gear position sensor on aligning holes with transmission holes.' },
    { n: 14, text: 'Install screws (5). Tighten. Torque: 72–96 in-lbs (8.13–10.8 N·m) Gear position sensor cover screws.' },
    { n: 15, text: 'Install gear cover (1).' },
    { n: 16, text: 'WARNING: Gear position sensor calibration is required using DIGITAL TECHNICIAN II (PART NUMBER: HD-48650).' },
    { n: 17, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 18, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 19, text: 'Install left saddlebag. See CHASSIS > SADDLEBAGS (Page 3-139).' },
  ]
},
{
  id: 's25-electrical-replace-front-wss',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Front Wheel Speed Sensor',
  summary: 'Remove fuel tank and side covers. Detach WSS wire from clips and remove frame plug. Disconnect connector and remove sensor from axle.',
  difficulty: 'Medium',
  timeMinutes: 60,
  source: { manual: '2025 HD Softail Service Manual', page: '7-75' },
  figures: [{ file: '/figures/softail-2025/p7-75.jpg', caption: 'Manual page 7-75' }],
  tools: [],
  parts: [['Cable strap (new)']],
  torque: [],
  steps: [
    { n: 1, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 2, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 3, text: 'Remove fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 4, text: 'Note location of cable straps and discard as needed.' },
    { n: 5, text: 'Remove brake line clamp screws.' },
    { n: 6, text: 'Detach WSS wire from clips (1).' },
    { n: 7, text: 'Remove frame plug (2).' },
    { n: 8, text: 'Disconnect connector (1).' },
    { n: 9, text: 'Retract front axle until sensor is free. See CHASSIS > FRONT WHEEL (Page 3-11).' },
    { n: 10, text: 'Remove old sensor from axle.' },
    { n: 11, text: 'Align new sensor and insert front axle. See CHASSIS > FRONT WHEEL (Page 3-11).' },
    { n: 12, text: 'Connect connector (1).' },
    { n: 13, text: 'Install frame plug (2).' },
    { n: 14, text: 'Attach WSS wire to clips (1).' },
    { n: 15, text: 'Install brake line clamp screws.' },
    { n: 16, text: 'Install new cable straps as needed.' },
    { n: 17, text: 'Install fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 18, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 19, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
  ]
},
{
  id: 's25-electrical-replace-rear-wss',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Rear Wheel Speed Sensor',
  summary: 'Remove side covers and fuse. Remove WSS wire from clip and clamp screw. Disconnect connector and remove cable from retainers. Retract rear axle to remove sensor.',
  difficulty: 'Medium',
  timeMinutes: 60,
  source: { manual: '2025 HD Softail Service Manual', page: '7-76' },
  figures: [{ file: '/figures/softail-2025/p7-76.jpg', caption: 'Manual page 7-76' }],
  tools: [],
  parts: [['Cable strap (new)']],
  torque: [{ fastener: 'Rear fork clamp screw', value: '24–36 in-lbs (2.7–4.1 N·m)' }],
  steps: [
    { n: 1, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 2, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 3, text: 'Remove right side cover and closeout cover. See CHASSIS > RIGHT SIDE COVER (Page 3-59).' },
    { n: 4, text: 'Remove WSS wire from clip (6).' },
    { n: 5, text: 'Remove screw (2) from clamp (7).' },
    { n: 6, text: 'Remove WSS wire from clamp.' },
    { n: 7, text: 'Disconnect connector (3).' },
    { n: 8, text: 'Remove cable (5) from retainers (4).' },
    { n: 9, text: 'Retract rear axle until WSS (1) is free. See CHASSIS > REAR WHEEL (Page 3-14).' },
    { n: 10, text: 'Remove old sensor from axle.' },
    { n: 11, text: 'Align new WSS (1) and install rear axle. See CHASSIS > REAR WHEEL (Page 3-14).' },
    { n: 12, text: 'Connect WSS sensor connector (3).' },
    { n: 13, text: 'Install cable (5) to retainers (4).' },
    { n: 14, text: 'Install WSS sensor wire into clamp (7).' },
    { n: 15, text: 'Install screw (2) in clamp. Tighten. Torque: 24–36 in-lbs (2.7–4.1 N·m) Rear fork clamp screw.' },
    { n: 16, text: 'Attach WSS wire to clip (6).' },
    { n: 17, text: 'Install closeout cover and right side cover. See CHASSIS > RIGHT SIDE COVER (Page 3-59).' },
    { n: 18, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 19, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
  ]
},
{
  id: 's25-electrical-replace-jiffy-stand-sensor',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Jiffy Stand Sensor',
  summary: 'Remove main fuse and jiffy stand. Disconnect sensor connector. Remove screw and sensor. Reinstall sensor with screw, connector, and cable straps.',
  difficulty: 'Easy',
  timeMinutes: 30,
  source: { manual: '2025 HD Softail Service Manual', page: '7-77' },
  figures: [{ file: '/figures/softail-2025/p7-77.jpg', caption: 'Manual page 7-77' }],
  tools: [],
  parts: [['Jiffy stand sensor (new)', 'Cable strap (new)']],
  torque: [{ fastener: 'JSS screw', value: '20–25 in-lbs (2.3–2.8 N·m)' }],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 2, text: 'Remove jiffy stand. See CHASSIS > JIFFY STAND (Page 3-133).' },
    { n: 3, text: 'Disconnect connector (1) from sensor.' },
    { n: 4, text: 'Make note of cable routing and cable strap locations.' },
    { n: 5, text: 'Discard cable straps.' },
    { n: 6, text: 'Remove screw (2).' },
    { n: 7, text: 'Remove old sensor (3).' },
    { n: 8, text: 'Install new jiffy stand sensor (3).' },
    { n: 9, text: 'Install screw (2). Tighten. Torque: 20–25 in-lbs (2.3–2.8 N·m) JSS screw.' },
    { n: 10, text: 'Connect connector (1).' },
    { n: 11, text: 'Install new cable straps.' },
    { n: 12, text: 'Install jiffy stand. See CHASSIS > JIFFY STAND (Page 3-133).' },
    { n: 13, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
  ]
},
{
  id: 's25-electrical-replace-front-caddy',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Front Electrical Caddy',
  summary: 'Purge fuel and remove fuel tank. Disconnect backbone harness interconnect. Remove brake line clamp screws. Disconnect all connectors and remove caddy.',
  difficulty: 'Hard',
  timeMinutes: 120,
  source: { manual: '2025 HD Softail Service Manual', page: '7-78' },
  figures: [{ file: '/figures/softail-2025/p7-78.jpg', caption: 'Manual page 7-78' }],
  tools: [],
  parts: [['Cable strap (new)']],
  torque: [{ fastener: 'Brake line clamp screw', value: '36–48 in-lbs (4.1–5.4 N·m)' }],
  steps: [
    { n: 1, text: 'Purge fuel system. See FUEL AND EXHAUST > PURGE FUEL LINE (Page 6-12).' },
    { n: 2, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 3, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 4, text: 'Remove seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 5, text: 'Remove fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 6, text: 'Disconnect backbone harness interconnect.' },
    { n: 7, text: 'Remove brake line clamp screws.' },
    { n: 8, text: 'Remove frame plug.' },
    { n: 9, text: 'If needed, label connectors on caddy for reference.' },
    { n: 10, text: 'Disconnect top fold connectors.' },
    { n: 11, text: 'Disconnect bottom fold connectors.' },
    { n: 12, text: 'Disconnect center fold connectors.' },
    { n: 13, text: 'Remove connector housings from caddy.' },
    { n: 14, text: 'Install new caddy. Install connector housings to caddy center fold.' },
    { n: 15, text: 'Install connector housings to caddy bottom fold.' },
    { n: 16, text: 'Install frame plug onto caddy. Close bottom fold.' },
    { n: 17, text: 'Verify tab has secured bottom fold.' },
    { n: 18, text: 'Close top fold until tabs secure top and center folds.' },
    { n: 19, text: 'Verify tabs have secured top fold.' },
    { n: 20, text: 'Install connector housing.' },
    { n: 21, text: 'Install anchored cable straps.' },
    { n: 22, text: 'Install connectors.' },
    { n: 23, text: 'Install front electrical caddy and frame plug into frame.' },
    { n: 24, text: 'Install brake line clamp screws. Tighten. Torque: 36–48 in-lbs (4.1–5.4 N·m) Brake line clamp screw.' },
    { n: 25, text: 'Connect backbone harness interconnect.' },
  ]
},
{
  id: 's25-electrical-replace-usb-caddy',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace USB Caddy',
  summary: 'Purge fuel and remove fuel tank. Remove wide screw from front. Disconnect ET connector and remove retainer pin. Slide caddy forward and disconnect interconnect.',
  difficulty: 'Medium',
  timeMinutes: 60,
  source: { manual: '2025 HD Softail Service Manual', page: '7-82' },
  figures: [{ file: '/figures/softail-2025/p7-82.jpg', caption: 'Manual page 7-82' }],
  tools: [],
  parts: [],
  torque: [{ fastener: 'Wide mounting screw', value: '84–108 in-lbs (9.5–12.2 N·m)' }, { fastener: 'USB caddy screw', value: '14–17 in-lbs (1.6–1.9 N·m)' }],
  steps: [
    { n: 1, text: 'Purge fuel system. See FUEL AND EXHAUST > PURGE FUEL LINE (Page 6-12).' },
    { n: 2, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 3, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 4, text: 'Remove seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 5, text: 'Remove fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 6, text: 'Remove wide screw from front of caddy.' },
    { n: 7, text: 'Disconnect Engine Temperature (ET) connector.' },
    { n: 8, text: 'Remove retainer pin.' },
    { n: 9, text: 'Slide USB caddy forward from engine.' },
    { n: 10, text: 'Disconnect USB caddy interconnect.' },
    { n: 11, text: 'Remove USB caddy.' },
    { n: 12, text: 'If caddy needs repair: remove horn assembly. See ELECTRICAL > HORN (Page 7-25).' },
    { n: 13, text: 'Remove screws from USB caddy to separate upper and lower.' },
    { n: 14, text: 'Remove harness from lower USB caddy.' },
    { n: 15, text: 'Assemble new USB caddy. Install harness into lower caddy.' },
    { n: 16, text: 'Align USB caddy upper and lower halves.' },
    { n: 17, text: 'Install screws. Tighten. Torque: 14–17 in-lbs (1.6–1.9 N·m) USB caddy screw.' },
    { n: 18, text: 'Install horn assembly. See ELECTRICAL > HORN (Page 7-25).' },
    { n: 19, text: 'Slide USB caddy forward and connect USB caddy interconnect.' },
    { n: 20, text: 'Verify main harness tab is installed into main harness slot on USB caddy.' },
    { n: 21, text: 'Install retainer pin.' },
    { n: 22, text: 'Connect ET connector.' },
    { n: 23, text: 'Install wide screw. Tighten. Torque: 84–108 in-lbs (9.5–12.2 N·m) Wide mounting screw.' },
    { n: 24, text: 'Install fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 25, text: 'Install seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 26, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 27, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
  ]
},
{
  id: 's25-electrical-replace-ecm-caddy',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace ECM Caddy',
  summary: 'Remove side covers and main fuse. Remove mud guard and ECM. Remove ECM caddy from tabs and swing away from purge caddy. Install new caddy.',
  difficulty: 'Medium',
  timeMinutes: 45,
  source: { manual: '2025 HD Softail Service Manual', page: '7-85' },
  figures: [{ file: '/figures/softail-2025/p7-85.jpg', caption: 'Manual page 7-85' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 2, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 3, text: 'Remove mud guard. See CHASSIS > MUD GUARD (Page 3-117).' },
    { n: 4, text: 'Remove ECM. See ELECTRICAL > ELECTRONIC CONTROL MODULE (ECM) (Page 7-56).' },
    { n: 5, text: 'Remove ECM caddy from tabs (3).' },
    { n: 6, text: 'Swing ECM caddy away from purge caddy (2).' },
    { n: 7, text: 'Pull ECM caddy from purge caddy and remove.' },
    { n: 8, text: 'Insert tab (1) of new caddy into purge caddy (2) opening.' },
    { n: 9, text: 'Snap ECM caddy to tabs (3) on purge caddy.' },
    { n: 10, text: 'Install ECM. See ELECTRICAL > ELECTRONIC CONTROL MODULE (ECM) (Page 7-56).' },
    { n: 11, text: 'Install mud guard. See CHASSIS > MUD GUARD (Page 3-117).' },
    { n: 12, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 13, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
  ]
},
{
  id: 's25-electrical-replace-rear-lighting-caddy',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Rear Lighting Caddy',
  summary: 'Remove main fuse and seat. Remove security antenna and brake lamp connector. Disconnect turn signal connectors. Remove connector housings and cables. Lift caddy out.',
  difficulty: 'Medium',
  timeMinutes: 60,
  source: { manual: '2025 HD Softail Service Manual', page: '7-86' },
  figures: [{ file: '/figures/softail-2025/p7-86.jpg', caption: 'Manual page 7-86' }],
  tools: [],
  parts: [],
  torque: [],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 2, text: 'Remove seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 3, text: 'Remove security antenna (3).' },
    { n: 4, text: 'Remove brake lamp connector (10).' },
    { n: 5, text: 'Mark turn signal connectors left and right for identification.' },
    { n: 6, text: 'Disconnect turn signal connectors (7,8).' },
    { n: 7, text: 'Remove cables (6) from cable retainer (5).' },
    { n: 8, text: 'Remove turn signal connector housings (1) from caddy.' },
    { n: 9, text: 'Remove cables (2) from caddy.' },
    { n: 10, text: 'Remove push pin retainer (4).' },
    { n: 11, text: 'Remove rear lighting caddy (9).' },
    { n: 12, text: 'Position new rear lighting caddy (9) into place.' },
    { n: 13, text: 'Install push pin retainer (4).' },
    { n: 14, text: 'Install cables (2) in retainers.' },
    { n: 15, text: 'Install brake lamp cable in retainer and snap connector (10) to caddy.' },
    { n: 16, text: 'Install turn signal housings (1) to caddy.' },
    { n: 17, text: 'Connect left turn signal connector (8).' },
    { n: 18, text: 'Connect right turn signal connector (7).' },
    { n: 19, text: 'Install cables (6) in retainers (5).' },
    { n: 20, text: 'Install security antenna (3).' },
    { n: 21, text: 'Install seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 22, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
  ]
},
{
  id: 's25-electrical-replace-battery-tray',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Battery Tray',
  summary: 'Remove side covers, seat, and main fuse. Remove BCM, battery, and battery tray screws. Install new tray with scrivets and screws.',
  difficulty: 'Medium',
  timeMinutes: 60,
  source: { manual: '2025 HD Softail Service Manual', page: '7-87' },
  figures: [{ file: '/figures/softail-2025/p7-87.jpg', caption: 'Manual page 7-87' }],
  tools: [],
  parts: [['Scrivets (3)', 'Screws (3)']],
  torque: [{ fastener: 'Battery tray screw', value: '6–9 ft-lbs (8.1–12.2 N·m)' }],
  steps: [
    { n: 1, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 2, text: 'Remove main fuse. See POWER DISCONNECT > MAIN FUSE (Page 7-6).' },
    { n: 3, text: 'Remove seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 4, text: 'Remove right side cover and close-out cover. See CHASSIS > RIGHT SIDE COVER (Page 3-59).' },
    { n: 5, text: 'Remove BCM and caddy. See ELECTRICAL > BODY CONTROL MODULE (BCM) (Page 7-57).' },
    { n: 6, text: 'Remove battery. See MAINTENANCE > INSPECT BATTERY (Page 2-43).' },
    { n: 7, text: 'Remove scrivets (1) from battery tray.' },
    { n: 8, text: 'Remove screws (3) from battery tray.' },
    { n: 9, text: 'Remove old battery tray (2).' },
    { n: 10, text: 'Install new battery tray (2).' },
    { n: 11, text: 'Install scrivets (1).' },
    { n: 12, text: 'Install screws (3). Tighten. Torque: 6–9 ft-lbs (8.1–12.2 N·m) Battery tray screw.' },
    { n: 13, text: 'Install battery. See MAINTENANCE > INSPECT BATTERY (Page 2-43).' },
    { n: 14, text: 'Install BCM and caddy. See ELECTRICAL > BODY CONTROL MODULE (BCM) (Page 7-57).' },
    { n: 15, text: 'Install close-out cover and right side cover. See CHASSIS > RIGHT SIDE COVER (Page 3-59).' },
    { n: 16, text: 'Install seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 17, text: 'Install main fuse. See POWER DISCONNECT > MAIN FUSE (Page 7-6).' },
    { n: 18, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
  ]
},
{
  id: 's25-electrical-replace-engine-ground-cable',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Engine Ground Cable',
  summary: 'Remove side covers, seat, battery tray, and BCM. Remove ground cable at rear frame stud and transmission stud. Install new cable with anti-rotation bracket.',
  difficulty: 'Hard',
  timeMinutes: 90,
  source: { manual: '2025 HD Softail Service Manual', page: '7-89' },
  figures: [{ file: '/figures/softail-2025/p7-89.jpg', caption: 'Manual page 7-89' }],
  tools: [],
  parts: [['Engine ground cable (new)', 'Anti-rotation bracket (new)']],
  torque: [{ fastener: 'Frame ground stud nut', value: '44–89 in-lbs (5–10 N·m)' }, { fastener: 'Transmission ground stud nut', value: '72–96 in-lbs (8.1–10.9 N·m)' }],
  steps: [
    { n: 1, text: 'Remove right side cover and close-out cover. See CHASSIS > RIGHT SIDE COVER (Page 3-59).' },
    { n: 2, text: 'Remove seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 3, text: 'Remove negative cable. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 4, text: 'Relocate BCM caddy. See ELECTRICAL > BODY CONTROL MODULE (BCM) (Page 7-57).' },
    { n: 5, text: 'Remove battery. See MAINTENANCE > INSPECT BATTERY (Page 2-43).' },
    { n: 6, text: 'Remove battery tray. See ELECTRICAL > BATTERY TRAY (Page 7-88).' },
    { n: 7, text: 'Remove nuts (4) from rear frame ground stud.' },
    { n: 8, text: 'Remove anti rotation bracket (3).' },
    { n: 9, text: 'Remove main harness ground (2).' },
    { n: 10, text: 'Remove ground cable connector (1).' },
    { n: 11, text: 'Remove nut (1) from transmission ground stud.' },
    { n: 12, text: 'Remove old battery ground cable (4).' },
    { n: 13, text: 'Install new battery ground cable (4) on transmission ground stud (2).' },
    { n: 14, text: 'Install nut (1). Do not tighten yet.' },
    { n: 15, text: 'Install ground cable connector (1).' },
    { n: 16, text: 'Install main harness ground connector (2).' },
    { n: 17, text: 'Install anti rotation bracket (3).' },
    { n: 18, text: 'Install nuts (4). Tighten. Torque: 44–89 in-lbs (5–10 N·m) Frame ground stud nut.' },
    { n: 19, text: 'Tighten transmission ground stud nut (1). Torque: 72–96 in-lbs (8.1–10.9 N·m) Transmission ground stud nut.' },
    { n: 20, text: 'Install negative cables. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 21, text: 'Install battery tray. See ELECTRICAL > BATTERY TRAY (Page 7-88).' },
    { n: 22, text: 'Install battery. See MAINTENANCE > INSPECT BATTERY (Page 2-43).' },
    { n: 23, text: 'Install BCM caddy. See ELECTRICAL > BODY CONTROL MODULE (BCM) (Page 7-57).' },
    { n: 24, text: 'Install right side cover and close-out cover. See CHASSIS > RIGHT SIDE COVER (Page 3-59).' },
    { n: 25, text: 'Install seat. See CHASSIS > SEAT (Page 3-135).' },
  ]
},
{
  id: 's25-electrical-replace-engine-harness',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Engine Wire Harness',
  summary: 'Extensive job: purge fuel, remove fuel tank and battery. Disconnect all engine connectors (ECM, injectors, sensors). Remove harness caddies. Route and connect new harness.',
  difficulty: 'Hard',
  timeMinutes: 240,
  source: { manual: '2025 HD Softail Service Manual', page: '7-91' },
  figures: [{ file: '/figures/softail-2025/p7-91.jpg', caption: 'Manual page 7-91' }],
  tools: [],
  parts: [['Engine wire harness (new)']],
  torque: [],
  steps: [
    { n: 1, text: 'Purge fuel system. See FUEL AND EXHAUST > PURGE FUEL LINE (Page 6-12).' },
    { n: 2, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 3, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 4, text: 'Remove right side cover and close out cover. See CHASSIS > RIGHT SIDE COVER (Page 3-59).' },
    { n: 5, text: 'Remove seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 6, text: 'Remove fuel tank counsel (if equipped). See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 7, text: 'Remove fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 8, text: 'Remove battery. See MAINTENANCE > INSPECT BATTERY (Page 2-43).' },
    { n: 9, text: 'Remove battery tray. See ELECTRICAL > BATTERY TRAY (Page 7-88).' },
    { n: 10, text: 'Remove air filter. See MAINTENANCE > INSPECT AIR FILTER (Page 2-40).' },
    { n: 11, text: 'Remove air cleaner backplate. See FUEL AND EXHAUST > AIR CLEANER BACKPLATE ASSEMBLY (Page 6-4).' },
    { n: 12, text: 'Remove ECM. See ELECTRICAL > ELECTRONIC CONTROL MODULE (ECM) (Page 7-56).' },
    { n: 13, text: 'Remove coil. See ELECTRICAL > IGNITION COIL (Page 7-13).' },
    { n: 14, text: 'NOTE: Remove cable strap anchors, wire harness anchors and cable straps as necessary.' },
    { n: 15, text: 'Disconnect all sensors around throttle body area including ETC, TMAP, front/rear injectors, front/rear ACR.' },
    { n: 16, text: 'Disconnect main harness and purge solenoid around ECM area.' },
    { n: 17, text: 'Disconnect backbone harness interconnect.' },
    { n: 18, text: 'Disconnect all sensors around starter/BCM area (HO2S, gear position, post-cat sensors).' },
    { n: 19, text: 'Disconnect oil pressure sensor and JSS around voltage regulator area.' },
    { n: 20, text: 'Disconnect CKP and cam position sensor.' },
    { n: 21, text: 'Remove scrivets from engine wire harness caddy.' },
    { n: 22, text: 'Pry rear caddy tabs away from frame.' },
    { n: 23, text: 'Slide front and rear caddies rearward.' },
    { n: 24, text: 'Remove old harness. Connect new harness to main harness connector.' },
    { n: 25, text: 'Reconnect all electrical connectors around voltage regulator/oil pressure sensor area.' },
    { n: 26, text: 'Reconnect all connectors around starter/BCM area.' },
    { n: 27, text: 'Reconnect connectors around ECM area and backbone harness.' },
    { n: 28, text: 'Reconnect all connectors around throttle body area.' },
    { n: 29, text: 'Install coil. See ELECTRICAL > IGNITION COIL (Page 7-13).' },
    { n: 30, text: 'Install ECM. See ELECTRICAL > ELECTRONIC CONTROL MODULE (ECM) (Page 7-56).' },
    { n: 31, text: 'Install air cleaner backplate assembly.' },
    { n: 32, text: 'Install air filter.' },
    { n: 33, text: 'Install battery tray. See ELECTRICAL > BATTERY TRAY (Page 7-88).' },
    { n: 34, text: 'Install battery. See MAINTENANCE > INSPECT BATTERY (Page 2-43).' },
    { n: 35, text: 'Install fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 36, text: 'Install seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 37, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 38, text: 'Install close out cover and right side cover. See CHASSIS > RIGHT SIDE COVER (Page 3-59).' },
    { n: 39, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
  ]
},
{
  id: 's25-electrical-replace-backbone-harness',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Backbone Wire Harness',
  summary: 'Purge fuel and remove fuel tank. Disconnect main harness connector and remove under seat frame cover. Disconnect fairing connector if equipped. Pull old harness and route new one through.',
  difficulty: 'Hard',
  timeMinutes: 120,
  source: { manual: '2025 HD Softail Service Manual', page: '7-95' },
  figures: [{ file: '/figures/softail-2025/p7-95.jpg', caption: 'Manual page 7-95' }],
  tools: [],
  parts: [['Backbone wire harness (new)', 'Scrap wire (for routing)']],
  torque: [{ fastener: 'Brake line clamp screw', value: '36–48 in-lbs (4.1–5.4 N·m)' }, { fastener: 'Under seat frame cover, front screw', value: '20–30 in-lbs (2.3–3.4 N·m)' }, { fastener: 'Under seat frame, rear screws', value: '96–120 in-lbs (10.9–13.6 N·m)' }],
  steps: [
    { n: 1, text: 'Purge fuel system. See FUEL AND EXHAUST > PURGE FUEL LINE (Page 6-12).' },
    { n: 2, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 3, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 4, text: 'Remove seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 5, text: 'Remove fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 6, text: 'Disconnect main harness connector (5).' },
    { n: 7, text: 'Remove under seat frame cover screws (1,3).' },
    { n: 8, text: 'Remove under seat frame cover (2).' },
    { n: 9, text: 'Disconnect engine harness connector (6).' },
    { n: 10, text: 'Remove brake line clamp screws (2).' },
    { n: 11, text: 'Disconnect fairing connector (3) if equipped.' },
    { n: 12, text: 'Remove and lower engine harness caddies. See ELECTRICAL > ENGINE WIRE HARNESS (Page 7-91).' },
    { n: 13, text: 'Remove frame plug (1) and front electrical caddy.' },
    { n: 14, text: 'Attach scrap wire to old backbone harness (4) main harness connector (5).' },
    { n: 15, text: 'Pull old backbone wire harness through backbone.' },
    { n: 16, text: 'Disconnect scrap wire from old harness.' },
    { n: 17, text: 'Attach scrap wire to new backbone harness (4) main harness connector (5).' },
    { n: 18, text: 'Pull new backbone wire harness through backbone.' },
    { n: 19, text: 'Remove scrap wire.' },
    { n: 20, text: 'Connect engine harness connector (6).' },
    { n: 21, text: 'Connect main harness connector (5).' },
    { n: 22, text: 'Install under seat frame cover (2).' },
    { n: 23, text: 'Align under seat frame cover to frame.' },
    { n: 24, text: 'Install screws (3). Hand tight.' },
    { n: 25, text: 'Install screw (1). Tighten. Torque: 20–30 in-lbs (2.3–3.4 N·m) Under seat frame cover, front screw.' },
    { n: 26, text: 'Tighten screws (3). Torque: 96–120 in-lbs (10.9–13.6 N·m) Under seat frame, rear screws.' },
    { n: 27, text: 'Install front electrical caddy and frame plug. See ELECTRICAL > FRONT ELECTRICAL CADDY (Page 7-78).' },
    { n: 28, text: 'Connect fairing connector (3) if equipped.' },
    { n: 29, text: 'Install brake clamp screws (2). Tighten. Torque: 36–48 in-lbs (4.1–5.4 N·m) Brake line clamp screw.' },
    { n: 30, text: 'Install engine wire harness caddies. See ELECTRICAL > ENGINE WIRE HARNESS (Page 7-91).' },
    { n: 31, text: 'Install fuel tank. See FUEL AND EXHAUST > FUEL TANK (Page 6-15).' },
    { n: 32, text: 'Install seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 33, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 34, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
  ]
},
{
  id: 's25-electrical-replace-fairing-harness',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Fairing Wire Harness',
  summary: 'Remove main fuse and outer fairing shell. Remove connector anchor from fairing. Disconnect backbone harness and turn signal connectors. Install new harness and reconnect.',
  difficulty: 'Medium',
  timeMinutes: 60,
  source: { manual: '2025 HD Softail Service Manual', page: '7-97' },
  figures: [{ file: '/figures/softail-2025/p7-97.jpg', caption: 'Manual page 7-97' }],
  tools: [],
  parts: [['Fairing wire harness (new)', 'Cable strap (new)']],
  torque: [],
  steps: [
    { n: 1, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 2, text: 'Remove outer fairing shell. See CHASSIS > FAIRING: FRAME MOUNTED (Page 3-95).' },
    { n: 3, text: 'Remove connector anchor (6) from fairing.' },
    { n: 4, text: 'Disconnect backbone harness connector (2).' },
    { n: 5, text: 'Disconnect left turn signal connector (4).' },
    { n: 6, text: 'Disconnect right turn signal connector (5).' },
    { n: 7, text: 'Remove cable strap anchors (3).' },
    { n: 8, text: 'Remove old fairing harness.' },
    { n: 9, text: 'Install new fairing harness.' },
    { n: 10, text: 'Install cable strap anchors (3).' },
    { n: 11, text: 'Install new cable straps if removed from wiring harness.' },
    { n: 12, text: 'Connect left turn signal connector (4).' },
    { n: 13, text: 'Connect right turn signal connector (5).' },
    { n: 14, text: 'Connect backbone harness connector (2).' },
    { n: 15, text: 'Install connector anchor (6) to fairing.' },
    { n: 16, text: 'Install outer fairing shell. See CHASSIS > FAIRING: FRAME MOUNTED (Page 3-95).' },
    { n: 17, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
  ]
},{
  id: 's25-electrical-replace-main-harness',
  bikeIds: ['softail-2025'],
  system: 'electrical',
  title: 'Replace Main Wire Harness',
  summary: 'Remove side covers, seat, and main fuse. Remove all connectors from caddy (left side, right side, under seat, ECM area). Disconnect and remove main harness.',
  difficulty: 'Hard',
  timeMinutes: 180,
  source: { manual: '2025 HD Softail Service Manual', page: '7-97' },
  figures: [{ file: '/figures/softail-2025/p7-97.jpg', caption: 'Manual page 7-97' }],
  tools: [],
  parts: [['Main wire harness (new)', 'Cable strap (new)']],
  torque: [],
  steps: [
    { n: 1, text: 'Remove left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
    { n: 2, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 3, text: 'Remove right side cover and close-out cover. See CHASSIS > RIGHT SIDE COVER (Page 3-59).' },
    { n: 4, text: 'Remove seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 5, text: 'Disconnect and remove main fuse holder from caddy.' },
    { n: 6, text: 'Disconnect all electrical connectors on left side.' },
    { n: 7, text: 'Disconnect all electrical connectors under seat.' },
    { n: 8, text: 'Disconnect all electrical connectors around ECM area.' },
    { n: 9, text: 'Disconnect all electrical connectors around starter area.' },
    { n: 10, text: 'Disconnect all electrical connectors around right side.' },
    { n: 11, text: 'Disconnect main harness connector from backbone harness.' },
    { n: 12, text: 'Disconnect main harness connector from front electrical caddy.' },
    { n: 13, text: 'Remove main harness from motorcycle.' },
    { n: 14, text: 'Install new main harness into motorcycle.' },
    { n: 15, text: 'Reconnect main harness connector to front electrical caddy.' },
    { n: 16, text: 'Reconnect main harness connector to backbone harness.' },
    { n: 17, text: 'Reconnect all connectors around right side area.' },
    { n: 18, text: 'Reconnect all connectors around starter area.' },
    { n: 19, text: 'Reconnect all connectors around ECM area.' },
    { n: 20, text: 'Reconnect all connectors under seat area.' },
    { n: 21, text: 'Reconnect all connectors on left side area.' },
    { n: 22, text: 'Install and connect main fuse holder to caddy.' },
    { n: 23, text: 'Install seat. See CHASSIS > SEAT (Page 3-135).' },
    { n: 24, text: 'Install close-out cover and right side cover. See CHASSIS > RIGHT SIDE COVER (Page 3-59).' },
    { n: 25, text: 'Install main fuse. See ELECTRICAL > POWER DISCONNECT (Page 7-6).' },
    { n: 26, text: 'Install left side cover. See CHASSIS > LEFT SIDE COVER (Page 3-58).' },
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
