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
{ id: 's25-maint-engine-oil-change', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Replace Engine Oil and Filter', summary: 'Drain old oil, replace filter and drain plug O-ring, refill with correct grade, and verify level hot and cold.', difficulty: 'Easy', timeMinutes: 45, source: { manual: '2025 HD Softail Service Manual', page: '2-5' }, figures: [], tools: ['Oil Filter Wrench HD-94863-10', 'Oil Filter Wrench HD-94686-00'], parts: [{ number: '', description: 'Engine oil drain plug O-ring', qty: 1 }, { number: '', description: 'Engine oil (4.0 qt / 3.8 L)', qty: 1 }, { number: '', description: 'Oil filter', qty: 1 }], torque: [{ fastener: 'Engine oil drain plug', value: '14–21 ft-lbs (19–28.5 N·m)' }], steps: [{ n: 1, text: 'Run motorcycle until engine reaches normal operating temperature, then turn off.' }, { n: 2, text: 'Remove filler plug/dipstick.' }, { n: 3, text: 'Remove oil drain plug (2) and O-ring, allow oil to drain completely.' }, { n: 4, text: 'Remove oil filter using wrench; do not use air tools. Clean filter mount flange.' }, { n: 5, text: 'Clean any residual oil from crankcase and transmission housing.' }, { n: 6, text: 'Lubricate new oil filter gasket with thin film of clean engine oil.' }, { n: 7, text: 'Install new oil filter, hand-tighten one-half to three-quarters turn after gasket contacts mount. Do not use wrench.' }, { n: 8, text: 'Install engine oil drain plug with new O-ring. Torque: 14–21 ft-lbs (19–28.5 N·m).' }, { n: 9, text: 'Add initial volume of 4.0 qt (3.8 L) of correct grade oil. See Table 2-3 for temperature range.' }, { n: 10, text: 'Verify proper oil level by performing cold check and hot check. Start engine and check for leaks around drain plug and filter.' }, { n: 11, text: 'Check operation of rear lamps and test ride at low speed to wear in brakes properly.' }] },
{ id: 's25-maint-primary-oil-change', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Replace Primary Chaincase Lubricant', summary: 'Drain primary chaincase, clean drain plug magnet, refill with FORMULA+ or SYN3 lubricant to proper level.', difficulty: 'Medium', timeMinutes: 50, source: { manual: '2025 HD Softail Service Manual', page: '2-6' }, figures: [], tools: [], parts: [{ number: '', description: 'Primary chaincase lubricant (40 oz dry fill / 36 oz wet fill)', qty: 1 }, { number: '', description: 'Clutch inspection cover seal', qty: 1 }], torque: [{ fastener: 'Primary chaincase drain plug', value: '14–21 ft-lbs (19–28.5 N·m)' }, { fastener: 'Clutch inspection cover screws', value: '25–35 in-lbs (2.8–3.9 N·m)' }], steps: [{ n: 1, text: 'Run motorcycle until engine reaches normal operating temperature, then turn off.' }, { n: 2, text: 'Secure motorcycle upright on level surface (not on jiffy stand).' }, { n: 3, text: 'Drain primary chaincase by removing drain plug.' }, { n: 4, text: 'Clean drain plug magnet; if excessive debris, inspect chaincase component condition.' }, { n: 5, text: 'Install drain plug with new O-ring. Torque: 14–21 ft-lbs (19–28.5 N·m).' }, { n: 6, text: 'Remove clutch inspection cover screws (3).' }, { n: 7, text: 'Remove clutch inspection cover (2).' }, { n: 8, text: 'Remove seal (1) and wipe oil from cover and O-ring groove.' }, { n: 9, text: 'Pour specified lubricant amount through clutch inspection opening. Fill to approximately bottom of pressure plate OD.' }, { n: 10, text: 'Install new seal (1).' }, { n: 11, text: 'Install clutch inspection cover (2).' }, { n: 12, text: 'Install and finger-tighten screws (3).' }, { n: 13, text: 'Tighten screws in sequence. Torque: 25–35 in-lbs (2.8–3.9 N·m).' }] },
{ id: 's25-maint-transmission-oil-change', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Replace Transmission Lubricant', summary: 'Drain transmission fluid via drain plug, inspect and replace O-ring, refill to proper level between Add and Full marks.', difficulty: 'Medium', timeMinutes: 40, source: { manual: '2025 HD Softail Service Manual', page: '2-12' }, figures: [], tools: [], parts: [{ number: '', description: 'Transmission lubricant (28 fl oz / 0.83 L)', qty: 1 }], torque: [{ fastener: 'Transmission drain plug', value: '14–21 ft-lbs (19–28.5 N·m)' }, { fastener: 'Transmission filler plug/dipstick', value: '25–75 in-lbs (2.8–8.5 N·m)' }], steps: [{ n: 1, text: 'Remove transmission filler plug/dipstick.' }, { n: 2, text: 'Remove transmission drain plug, allow fluid to drain completely.' }, { n: 3, text: 'Clean and inspect drain plug and O-ring.' }, { n: 4, text: 'Install drain plug with new O-ring. Do not over-tighten. Torque: 14–21 ft-lbs (19–28.5 N·m).' }, { n: 5, text: 'Fill transmission with recommended lubricant, volume: 28 fl oz (0.83 L).' }, { n: 6, text: 'Check lubricant level and add enough to bring level between Add (A) and Full (F) marks.' }, { n: 7, text: 'Install filler plug/dipstick and tighten. Torque: 25–75 in-lbs (2.8–8.5 N·m). Do not over-tighten.' }] },
{ id: 's25-maint-inspect-tires', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect Tires and Wheels', summary: 'Check tire pressure and tread wear, inspect wheel bearings and spokes, measure wheel runout if necessary.', difficulty: 'Easy', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '2-14' }, figures: [], tools: [], parts: [], torque: [{ fastener: 'Spoke nut', value: '35 in-lbs (4 N·m)' }], steps: [{ n: 1, text: 'Check tire pressure when tires are cold. Compare with specifications in Table 2-7.' }, { n: 2, text: 'Inspect each tire for tread wear. Replace tires when wear bars become visible or only 1/32 in (1 mm) tread remains.' }, { n: 3, text: 'Inspect each tire for punctures, cuts, and breaks.' }, { n: 4, text: 'Measure wheel bearing play by hand while wheels are installed. Rotate inner bearing race and check for abnormal noise.' }, { n: 5, text: 'Ensure bearings rotate smoothly and check for wear or corrosion. Excessive play or roughness indicates worn bearings.' }, { n: 6, text: 'Starting at valve stem, inspect for loose or damaged spokes. Lightly tap each spoke with screwdriver.' }, { n: 7, text: 'Mark loose or damaged spokes. Continue around wheel.' }, { n: 8, text: 'Correct spoke tension if needed. While holding spoke with wrench, torque spoke nut: 35 in-lbs (4 N·m).' }, { n: 9, text: 'Verify lateral and radial runout if loose spokes found. Refer to Table 2-8.' }] },
{ id: 's25-maint-lubricate-cables', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Lubricate Cables and Controls', summary: 'Lubricate front brake lever, clutch cable and hand lever, jiffy stand, steering head bearings, and fork lock with appropriate greases and lubricants.', difficulty: 'Easy', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '2-18' }, figures: [], tools: [], parts: [{ number: '42830-05', description: 'CCI #20 Brake Grease', qty: 1 }, { number: '94968-09', description: 'HARLEY LUBE', qty: 1 }, { number: '98960-97', description: 'Anti-Seize Lubricant', qty: 1 }, { number: '99857-97A', description: 'Special Purpose Grease', qty: 1 }], torque: [], steps: [{ n: 1, text: 'Lubricate front brake hand lever pivot pin hole and end of piston contacting lever with CCI #20 Brake Grease.' }, { n: 2, text: 'Lubricate clutch cable with HARLEY LUBE (94968-09).' }, { n: 3, text: 'Lubricate clutch hand lever with HARLEY LUBE (94968-09).' }, { n: 4, text: 'Lubricate jiffy stand clevis pin and spring hook groove with Anti-Seize Lubricant (98960-97).' }, { n: 5, text: 'Lubricate steering head bearings with Special Purpose Grease (99857-97A). See CHASSIS > STEERING HEAD section.' }, { n: 6, text: 'Lubricate fork lock internal components with HARLEY LUBE (94968-09).' }] },
{ id: 's25-maint-inspect-brake-pads', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect Brake Pads and Discs', summary: 'Measure brake pad thickness and disc thickness/runout. Replace pads if friction material is 0.016 in (0.4 mm) or less; replace disc if warped or worn.', difficulty: 'Medium', timeMinutes: 40, source: { manual: '2025 HD Softail Service Manual', page: '2-19' }, figures: [], tools: [], parts: [], torque: [], steps: [{ n: 1, text: 'Inspect for grit and debris buildup at caliper piston areas. Rinse with warm soapy water if necessary.' }, { n: 2, text: 'Dry using low-pressure compressed air.' }, { n: 3, text: 'Measure brake pad thickness. Replace pads if friction material thickness is equal to or less than 0.016 in (0.4 mm).' }, { n: 4, text: 'Measure brake disc thickness with micrometer. Minimum acceptable thickness is stamped on side of disc.' }, { n: 5, text: 'Measure disc runout near outside diameter using dial indicator. Replace disc if runout meets or exceeds 0.008 in (0.2 mm).' }, { n: 6, text: 'Replace disc if warped, badly scored, or worn beyond service limit.' }] },
{ id: 's25-maint-replace-front-brake-pads', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Replace Front Brake Pads', summary: 'Remove front caliper, extract worn pads, retract pistons, install new pads and spring, verify contact and brake operation.', difficulty: 'Medium', timeMinutes: 60, source: { manual: '2025 HD Softail Service Manual', page: '2-20' }, figures: [], tools: [], parts: [{ number: '', description: 'Front brake pads (set)', qty: 1 }, { number: '', description: 'Brake pad spring', qty: 1 }], torque: [{ fastener: 'Front brake pad hanger pin', value: '11–14 ft-lbs (14.7–19.6 N·m)' }], steps: [{ n: 1, text: 'Remove front caliper. See CHASSIS > FRONT BRAKE CALIPER section.' }, { n: 2, text: 'Remove brake pad hanger pins (3).' }, { n: 3, text: 'Remove brake pads.' }, { n: 4, text: 'Remove brake pad spring (4).' }, { n: 5, text: 'Loosen front master cylinder reservoir cap.' }, { n: 6, text: 'Using old brake pad and C-clamp, retract pistons fully into caliper.' }, { n: 7, text: 'Install new pads into caliper.' }, { n: 8, text: 'Loosely install new brake pad hanger pins (3) and new brake pad spring (4) with stamped arrow facing up.' }, { n: 9, text: 'Install front caliper. See CHASSIS > FRONT BRAKE CALIPER section.' }, { n: 10, text: 'Tighten brake pad hanger pins. Torque: 11–14 ft-lbs (14.7–19.6 N·m).' }, { n: 11, text: 'Pump brakes to move pistons out until brake pads contact rotor. If wheel off ground, rotate to check for drag.' }, { n: 12, text: 'Check fluid level in front brake master cylinder reservoir.' }, { n: 13, text: 'After repair, test brakes at low speed. If spongy, bleed brakes. Avoid hard stops for first 100 mi (160 km).' }] },
{ id: 's25-maint-replace-rear-brake-pads', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Replace Rear Brake Pads', summary: 'Remove rear caliper, extract worn pads, retract pistons, install new pads with retaining spring and clip, verify contact and operation.', difficulty: 'Medium', timeMinutes: 60, source: { manual: '2025 HD Softail Service Manual', page: '2-21' }, figures: [], tools: [], parts: [{ number: '', description: 'Rear brake pads (set)', qty: 1 }, { number: '', description: 'Brake pad retaining spring', qty: 1 }, { number: '', description: 'Retainer clip', qty: 1 }], torque: [], steps: [{ n: 1, text: 'Remove rear caliper. See CHASSIS > REAR BRAKE CALIPER section.' }, { n: 2, text: 'Remove brake pad hanger pins (2). Inspect for damage or wear; replace if needed.' }, { n: 3, text: 'Remove brake pads (4).' }, { n: 4, text: 'Loosen rear master cylinder reservoir cap.' }, { n: 5, text: 'Using old brake pad and C-clamp, retract pistons fully into caliper.' }, { n: 6, text: 'Inspect brake pad retainer spring (5). Replace if needed.' }, { n: 7, text: 'Remove retainer clip (3) from rear caliper mounting bracket.' }, { n: 8, text: 'Install brake pad retaining spring (5).' }, { n: 9, text: 'Install new brake pads (4).' }, { n: 10, text: 'Install brake pad hanger pin (2). Hand tighten. Pins are torqued after caliper is installed.' }, { n: 11, text: 'Install new retainer clip (3) onto rear caliper mounting bracket.' }, { n: 12, text: 'Install rear caliper. See CHASSIS > REAR BRAKE CALIPER section.' }, { n: 13, text: 'Pump brakes to move pistons out until pads contact rotor. If wheel off ground, rotate to check for drag.' }, { n: 14, text: 'Check fluid level in rear brake master cylinder reservoir.' }, { n: 15, text: 'Test brakes at low speed. If spongy, bleed brakes. Avoid hard stops for first 100 mi (160 km).' }] },
{ id: 's25-maint-brake-fluid-level', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Check and Top Off Brake Fluid', summary: 'Inspect front and rear brake fluid levels at minimum marks. Add DOT 4 fluid if necessary and check for leaks or worn pads.', difficulty: 'Easy', timeMinutes: 20, source: { manual: '2025 HD Softail Service Manual', page: '2-23' }, figures: [], tools: ['DOT 4 Brake Fluid Moisture Tester HD-48497-A'], parts: [{ number: '41800xxx', description: 'Harley-Davidson Platinum Label DOT 4 Brake Fluid', qty: 1 }], torque: [{ fastener: 'Brake master cylinder front reservoir cover screws', value: '9–18 in-lbs (1–2 N·m)' }, { fastener: 'Brake master cylinder rear reservoir cover screws', value: '9–18 in-lbs (1–2 N·m)' }], steps: [{ n: 1, text: 'Front brake: Set motorcycle upright and turn handlebar to level reservoir.' }, { n: 2, text: 'Check low-level mark on front reservoir sight glass. If necessary, add Harley-Davidson Platinum Label DOT 4 fluid.' }, { n: 3, text: 'Rear brake: Stand motorcycle upright on level surface.' }, { n: 4, text: 'Check low-level mark on rear reservoir sight glass. If necessary, add DOT 4 fluid.' }, { n: 5, text: 'If fluid level was below minimum mark, check for brake system leaks and verify pads/rotors are not worn beyond limits.' }, { n: 6, text: 'If master cylinder reservoir cover was removed, tighten. Front torque: 9–18 in-lbs (1–2 N·m); Rear torque: 9–18 in-lbs (1–2 N·m).' }, { n: 7, text: 'Verify front brake hand lever and rear brake foot pedal have firm feel. If not firm, brake system must be bled.' }] },
{ id: 's25-maint-clutch-adjust', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Check and Adjust Clutch', summary: 'Verify clutch free-play at lever (1/16–1/8 in), adjust hub clearance via screw and jamnut, ensure lock button engagement, check lever operation.', difficulty: 'Medium', timeMinutes: 45, source: { manual: '2025 HD Softail Service Manual', page: '2-25' }, figures: [], tools: [], parts: [], torque: [{ fastener: 'Clutch hub jamnut', value: '72–120 in-lbs (8.1–13.6 N·m)' }], steps: [{ n: 1, text: 'Stand motorcycle upright on level surface with front wheel straight ahead.' }, { n: 2, text: 'Access two-piece clutch cable by removing spring clip (1) and sliding cover (2) up.' }, { n: 3, text: 'Identify upper clutch cable (1) and red lock button (2).' }, { n: 4, text: 'Unlock upper clutch cable by pushing tabs on lock button slightly inboard then down to disengage.' }, { n: 5, text: 'Fully collapse cable (spring compressed) and push button in to release cable tension.' }, { n: 6, text: 'Remove clutch inspection cover from primary chaincase and access hub adjuster screw.' }, { n: 7, text: 'Loosen jamnut (1) on clutch adjuster screw. Turn adjuster screw (2) inward (clockwise) until lightly seated.' }, { n: 8, text: 'Squeeze clutch lever to maximum limit three times to set release mechanism.' }, { n: 9, text: 'Back out adjuster screw one-half to one full turn. While holding screw, tighten jamnut. Torque: 72–120 in-lbs (8.1–13.6 N·m).' }, { n: 10, text: 'Secure clutch inspection cover, tighten in sequence.' }, { n: 11, text: 'Ensure clutch lever is in full open position and ferrule (1) is correctly seated in housing.' }, { n: 12, text: 'Disengage lock button (2) to set free-play at clutch lever.' }, { n: 13, text: 'Push in lock button (2) and verify proper engagement. Spring force should ensure correct system free-play.' }, { n: 14, text: 'Check free-play at clutch lever; should be 1/16–1/8 in (1.6–3.2 mm).' }, { n: 15, text: 'Slide cover down and reinstall spring clip (1).' }] },
{ id: 's25-maint-steering-bearings', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Adjust and Lubricate Steering Head Bearings', summary: 'Measure bearing preload via pull force test, adjust fork stem bolt to specification, tighten pinch bolts, lubricate with grease, verify smooth operation.', difficulty: 'Hard', timeMinutes: 90, source: { manual: '2025 HD Softail Service Manual', page: '2-29' }, figures: [], tools: [], parts: [{ number: '99857-97A', description: 'Special Purpose Grease', qty: 1 }], torque: [{ fastener: 'Fork stem bolt, first torque', value: '13–14 ft-lbs (18.1–19 N·m)' }, { fastener: 'Fork stem bolt, final torque (most models)', value: '62–68 in-lbs (7–7.7 N·m)' }, { fastener: 'Fork stem bolt, final torque (FXLRS, FXLRST)', value: '9–10 ft-lbs (12.4–13.8 N·m)' }, { fastener: 'Fork stem pinch bolt', value: '16–20 ft-lbs (21.7–27.1 N·m)' }, { fastener: 'Upper fork bracket pinch bolts', value: '16–20 ft-lbs (21.7–27.1 N·m)' }], steps: [{ n: 1, text: 'Support motorcycle upright with front wheel suspended and level.' }, { n: 2, text: 'Remove all accessory weight from front (e.g., windshield if equipped).' }, { n: 3, text: 'Move forks from stop to stop to check for smooth operation. Rough operation indicates damaged bearings.' }, { n: 4, text: 'Grasping both forks near front axle, pull forks to front then push to rear to test for clunk.' }, { n: 5, text: 'Move handlebars left to right three times, ending at full left stop.' }, { n: 6, text: 'Using 0–25 lb pull force scale with peak hold, pull from inside diameter of front axle until front end is straight.' }, { n: 7, text: 'Keep scale parallel to front tire and perpendicular to fork leg. Pull slowly without tugging.' }, { n: 8, text: 'Repeat until peak force value becomes consistent. Check against Table 2-11 specification for your model.' }, { n: 9, text: 'If force not within spec, loosen fork stem pinch bolt (2) and upper fork bracket pinch bolts (3).' }, { n: 10, text: 'If pull force exceeds maximum, loosen fork stem bolt. If below minimum, tighten fork stem bolt. Initial torque: 13–14 ft-lbs (18.1–19 N·m).' }, { n: 11, text: 'Loosen fork stem bolt 45 degrees.' }, { n: 12, text: 'Tighten fork stem bolt final torque. Most models: 62–68 in-lbs (7–7.7 N·m). FXLRS/FXLRST: 9–10 ft-lbs (12.4–13.8 N·m).' }, { n: 13, text: 'Tighten fork stem pinch bolt (2). Torque: 16–20 ft-lbs (21.7–27.1 N·m).' }, { n: 14, text: 'Tighten upper fork bracket pinch bolts (3). Torque: 16–20 ft-lbs (21.7–27.1 N·m).' }, { n: 15, text: 'Reinstall handlebars and headlight nacelle if removed.' }, { n: 16, text: 'Repeat measure and adjust as needed until specification met.' }, { n: 17, text: 'Disassemble steering head and lubricate tapered roller bearings with Special Purpose Grease (99857-97A).' }, { n: 18, text: 'Lower motorcycle and replace all items removed.' }] },
{ id: 's25-maint-inspect-drive-belt', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect and Adjust Drive Belt and Sprockets', summary: 'Inspect rear sprocket for tooth damage and chrome wear, check belt for cracks/damage, measure deflection, and adjust tension via axle adjusters.', difficulty: 'Medium', timeMinutes: 60, source: { manual: '2025 HD Softail Service Manual', page: '2-33' }, figures: [], tools: ['Belt Tension Gauge HD-35381-A', 'Axle Nut Torque Adapter HD-47925-A'], parts: [], torque: [{ fastener: 'Axle nut, rear', value: '95–105 ft-lbs (128.8–142.4 N·m)' }], steps: [{ n: 1, text: 'Inspect each tooth (1) of rear sprocket for major damage, chrome chips with sharp edges, gouges, and excessive chrome loss.' }, { n: 2, text: 'Drag sharp object across groove bottom with medium pressure to check chrome plating. If it slides without digging or marking, chrome is good. If it digs in, chrome is worn.' }, { n: 3, text: 'Replace rear sprocket if major tooth damage or chrome loss exists.' }, { n: 4, text: 'Inspect drive belt for cuts, unusual wear patterns, outside bevel wear, stone damage, exposed tensile cords, and base cracking.' }, { n: 5, text: 'Replace belt and transmission sprocket if damage found at edge or internal cords exposed.' }, { n: 6, text: 'Keep belt clean with dampened rag using light cleaning agent. Do not bend into loop smaller than sprocket diameter.' }, { n: 7, text: 'Disarm security system and remove main fuse.' }, { n: 8, text: 'Shift transmission to neutral.' }, { n: 9, text: 'For new belt, rotate rear wheel few revolutions before setting tension.' }, { n: 10, text: 'Measure belt deflection using Belt Tension Gauge (HD-35381-A). Slide O-ring to zero mark.' }, { n: 11, text: 'Fit belt cradle against bottom of drive belt at deflection window or halfway between pulleys.' }, { n: 12, text: 'Press upward on knob until O-ring slides to 10 lb (4.54 kg) mark and hold steady.' }, { n: 13, text: 'Measure deflection through window or as shown. Each graduation approximately 1/16 in (1.6 mm).' }, { n: 14, text: 'Compare with Table 2-13. Service belt: 1/2–9/16 in (12.7–14.2 mm). New belt: 3/16–1/2 in (4.7–12.7 mm).' }, { n: 15, text: 'If out of spec, loosen rear axle nut and adjust via screw-style axle adjusters, turning equal amount.' }, { n: 16, text: 'Keep wheel aligned during adjustment.' }, { n: 17, text: 'Tighten axle nut. Torque: 95–105 ft-lbs (128.8–142.4 N·m).' }, { n: 18, text: 'Install E-clip. Verify rear wheel alignment.' }, { n: 19, text: 'Verify drive belt deflection again.' }, { n: 20, text: 'Check wheel bearing end play after tightening axle nut.' }, { n: 21, text: 'Install main fuse.' }] },
{ id: 's25-maint-suspension-preload', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Adjust Rear Shock Preload', summary: 'Calculate preload setting based on rider weight and passenger/cargo weight, adjust shock via cam or hydraulic screw to proper setting.', difficulty: 'Easy', timeMinutes: 30, source: { manual: '2025 HD Softail Service Manual', page: '2-37' }, figures: [], tools: ['Spanner Wrench Kit 14900102'], parts: [], torque: [], steps: [{ n: 1, text: 'Add weight of rider and riding gear to get rider weight for desired table.' }, { n: 2, text: 'Add weight of passenger, their gear, cargo, and accessories separately.' }, { n: 3, text: 'Use intersection of RIDER WEIGHT row and ADDITIONAL WEIGHT column in appropriate preload table (Tables 2-14 through 2-17) to find preload setting.' }, { n: 4, text: 'Remove seat.' }, { n: 5, text: 'For cam style: Insert tang of Spanner Wrench Kit (14900102) into slots in rear shock. Turn cam until indicator points to appropriate preload setting.' }, { n: 6, text: 'For hydraulic under-seat: Use socket end of Spanner Wrench Kit. Rotate adjustment screw clockwise to increase or counterclockwise to decrease preload until indicator shows appropriate setting.' }, { n: 7, text: 'Adjust motorcycle on jiffy stand. Do not exceed Gross Vehicle Weight Rating (GVWR) or Gross Axle Weight Rating (GAWR).' }] },
{ id: 's25-maint-inspect-exhaust', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect Exhaust System', summary: 'Check for leakage via carbon tracks and fasteners, listen for audible leaks, correct any detected leaks at mating surfaces.', difficulty: 'Medium', timeMinutes: 40, source: { manual: '2025 HD Softail Service Manual', page: '2-39' }, figures: [], tools: [], parts: [], torque: [], steps: [{ n: 1, text: 'Check exhaust system for obvious signs of leakage such as carbon tracks and marks at pipe joints.' }, { n: 2, text: 'Check for loose or missing fasteners.' }, { n: 3, text: 'Check for cracked pipe clamps or brackets.' }, { n: 4, text: 'Check for loose or cracked exhaust shields.' }, { n: 5, text: 'Start engine.' }, { n: 6, text: 'Cover end of muffler with clean, dry shop towel.' }, { n: 7, text: 'Listen for signs of exhaust leakage.' }, { n: 8, text: 'Correct any detected leaks. See FUEL AND EXHAUST > EXHAUST SYSTEM section to disassemble.' }, { n: 9, text: 'Clean all mating surfaces and repair or replace damaged components.' }, { n: 10, text: 'If leak continues, apply Permatex Ultra Copper or Loctite 5920 flange sealant to mating surfaces.' }] },
{ id: 's25-maint-inspect-air-filter-round', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect and Service Air Filter (Round)', summary: 'Remove round air cleaner cover and element, inspect and replace seal if damaged, reinstall with Loctite on cover screw.', difficulty: 'Easy', timeMinutes: 20, source: { manual: '2025 HD Softail Service Manual', page: '2-40' }, figures: [], tools: [], parts: [{ number: '99642-97', description: 'Loctite 243 Medium Strength Threadlocker and Sealant (Blue)', qty: 1 }, { number: '', description: 'Air filter element (round)', qty: 1 }, { number: '', description: 'Air filter seal', qty: 1 }], torque: [{ fastener: 'Air filter round cover screw', value: '92–97 in-lbs (10.4–11 N·m)' }], steps: [{ n: 1, text: 'Remove air cleaner cover by removing screw (1).' }, { n: 2, text: 'Remove cover (2).' }, { n: 3, text: 'Remove filter element (3).' }, { n: 4, text: 'Remove seal (4). Inspect for damage or wear.' }, { n: 5, text: 'Clean seal location groove of all residual oil and debris.' }, { n: 6, text: 'Replace seal if damaged or worn.' }, { n: 7, text: 'Install filter element, align with pin (5) in housing and place in position.' }, { n: 8, text: 'Apply Loctite 243 Medium Strength Threadlocker (99642-97) to threads of cover screw.' }, { n: 9, text: 'Install cover (2) and cover screw (1).' }, { n: 10, text: 'Tighten cover screw. Torque: 92–97 in-lbs (10.4–11 N·m).' }] },
{ id: 's25-maint-inspect-air-filter-cone', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect and Service Air Filter (Cone)', summary: 'Remove cone air cleaner cover and element, clean and inspect seal, reinstall element and cover with proper torque.', difficulty: 'Easy', timeMinutes: 20, source: { manual: '2025 HD Softail Service Manual', page: '2-40' }, figures: [], tools: [], parts: [{ number: '', description: 'Air filter element (cone)', qty: 1 }, { number: '', description: 'Air filter seal', qty: 1 }], torque: [{ fastener: 'Air filter cone inner screw', value: '18–24 in-lbs (2–2.7 N·m)' }, { fastener: 'Air filter cone outer screws', value: '18–24 in-lbs (2–2.7 N·m)' }], steps: [{ n: 1, text: 'Remove air cleaner cover by removing two outer screws (1).' }, { n: 2, text: 'Remove inner screw (4).' }, { n: 3, text: 'Remove air cleaner cover (3) and air filter element (2).' }, { n: 4, text: 'Clean and inspect filter element. Replace if necessary.' }, { n: 5, text: 'Clean seal location groove of all residual oil and debris.' }, { n: 6, text: 'Replace seal if damaged or worn.' }, { n: 7, text: 'Install air filter element into cover.' }, { n: 8, text: 'Install air cleaner cover. Install inner screw (4) and tighten. Torque: 18–24 in-lbs (2–2.7 N·m).' }, { n: 9, text: 'Install cover screws (1) and tighten. Torque: 18–24 in-lbs (2–2.7 N·m).' }] },
{ id: 's25-maint-inspect-air-filter-open', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect and Service Air Filter (Open Front)', summary: 'Remove open front air cleaner cover and element by loosening screw, rotate and tilt element to disengage from snorkel, inspect seal and clean.', difficulty: 'Easy', timeMinutes: 20, source: { manual: '2025 HD Softail Service Manual', page: '2-41' }, figures: [], tools: [], parts: [{ number: '', description: 'Air filter element', qty: 1 }, { number: '', description: 'Air filter seal', qty: 1 }], torque: [{ fastener: 'Air filter open front cover screw', value: '92–97 in-lbs (10.4–11 N·m)' }], steps: [{ n: 1, text: 'Remove air cleaner cover by removing screw (1).' }, { n: 2, text: 'Remove cover (2).' }, { n: 3, text: 'Lubricate element seal with 50% isopropyl alcohol and 50% distilled water.' }, { n: 4, text: 'Rotate filter element to loosen.' }, { n: 5, text: 'Move filter element to rear at upward angle to disengage from snorkel.' }, { n: 6, text: 'Remove filter element and remove seal. Inspect seal for damage or wear.' }, { n: 7, text: 'Clean and inspect filter element. Replace if necessary.' }, { n: 8, text: 'Clean seal location groove of all residual oil and debris.' }, { n: 9, text: 'Replace seal if damaged or worn.' }, { n: 10, text: 'Lubricate element seal with 50% isopropyl alcohol and 50% distilled water.' }, { n: 11, text: 'Install filter element onto snorkel and press forward into position.' }, { n: 12, text: 'Install cover and lubricate seal with alcohol/water mixture to prevent rolling.' }, { n: 13, text: 'Install screw (1) and tighten. Torque: 92–97 in-lbs (10.4–11 N·m).' }] },
{ id: 's25-maint-clean-air-filter', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Clean Air Filter Element', summary: 'Remove breather tube, inspect for damage, wash filter in lukewarm water with mild detergent, rinse and air dry or use low-pressure air.', difficulty: 'Easy', timeMinutes: 20, source: { manual: '2025 HD Softail Service Manual', page: '2-41' }, figures: [], tools: [], parts: [], torque: [], steps: [{ n: 1, text: 'Remove breather tube from breather bolts.' }, { n: 2, text: 'Inspect breather tube and fittings for damage.' }, { n: 3, text: 'Do not strike filter element on hard surface to dislodge dirt.' }, { n: 4, text: 'Do not use air cleaner filter oil on Harley-Davidson paper/wire mesh or synthetic air filter element.' }, { n: 5, text: 'Do not use gasoline or solvents to clean filter. Flammable agents can cause intake fire.' }, { n: 6, text: 'Wash filter element and breather tubes in lukewarm water with mild detergent.' }, { n: 7, text: 'Synthetic element: Rinse with clean water until water runs clear.' }, { n: 8, text: 'Paper/wire mesh element: Hold element to strong light. Element is clean when light uniformly visible through media.' }, { n: 9, text: 'Allow element to air dry or use low-pressure compressed air from inside.' }, { n: 10, text: 'Replace element if damaged or media cannot be adequately cleaned.' }] },
{ id: 's25-maint-inspect-battery', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Inspect and Service Battery', summary: 'Remove battery, clean terminals and case, perform voltage test, check for damage/leaks, test charge state, and reinstall with proper torque.', difficulty: 'Medium', timeMinutes: 50, source: { manual: '2025 HD Softail Service Manual', page: '2-43' }, figures: [], tools: [], parts: [], torque: [{ fastener: 'Battery positive terminal screw', value: '72–96 in-lbs (8.1–10.8 N·m)' }, { fastener: 'Battery negative terminal screw', value: '72–96 in-lbs (8.1–10.8 N·m)' }], steps: [{ n: 1, text: 'Remove seat. See CHASSIS > SEAT section.' }, { n: 2, text: 'If equipped with siren: Remove left side cover and main fuse.' }, { n: 3, text: 'Remove right side cover and close-out cover.' }, { n: 4, text: 'Relocate BCM caddy for service access.' }, { n: 5, text: 'Remove engine oil dipstick and cover fill spout with clean rag.' }, { n: 6, text: 'Disconnect negative battery cable (1).' }, { n: 7, text: 'Remove battery strap by unlocking retaining clip (7) and disconnecting tabs from tray.' }, { n: 8, text: 'Disconnect positive battery cable (2).' }, { n: 9, text: 'Push up and back on top of battery with palm, place other hand under, and remove with both hands.' }, { n: 10, text: 'Clean battery top with baking soda solution (5 tsp per liter of water). Apply, let bubble, rinse.' }, { n: 11, text: 'Clean cable connectors and terminals with wire brush or sandpaper. Remove oxidation.' }, { n: 12, text: 'Inspect battery terminal screws and cables for breakage, loose connections, and corrosion.' }, { n: 13, text: 'Check terminals for melting or damage.' }, { n: 14, text: 'Inspect case for discoloration, raised top, warping, distortion, cracks, or leaks. Replace if necessary.' }, { n: 15, text: 'Perform voltage test. If open circuit voltage below 12.6 V, charge battery. If 12.7 V or above, perform diagnostic load test.' }, { n: 16, text: 'Check Table 2-18 for charge state based on voltage.' }, { n: 17, text: 'Install battery into tray.' }, { n: 18, text: 'Connect positive cable to positive terminal. Tighten. Torque: 72–96 in-lbs (8.1–10.8 N·m).' }, { n: 19, text: 'Install battery strap with front left tab, back tab, and lock retaining clip.' }, { n: 20, text: 'Connect negative cable to negative terminal. Tighten. Torque: 72–96 in-lbs (8.1–10.8 N·m).' }, { n: 21, text: 'Remove rag and install dipstick.' }, { n: 22, text: 'Relocate BCM caddy back.' }, { n: 23, text: 'Install right side cover and close-out cover.' }, { n: 24, text: 'Install main fuse if removed.' }, { n: 25, text: 'Install left side cover if removed.' }, { n: 26, text: 'Install seat.' }] },
{ id: 's25-maint-spark-plugs', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Clean, Inspect, and Replace Spark Plugs', summary: 'Remove and inspect spark plugs for deposits, verify gap specification with feeler gauge, install new or cleaned plugs at proper torque.', difficulty: 'Medium', timeMinutes: 45, source: { manual: '2025 HD Softail Service Manual', page: '2-46' }, figures: [], tools: [], parts: [{ number: '', description: 'Spark plugs', qty: 2 }], torque: [{ fastener: 'Spark plug', value: '84–108 in-lbs (9.5–12.2 N·m)' }], steps: [{ n: 1, text: 'Remove seat. See CHASSIS > SEAT section.' }, { n: 2, text: 'Purge fuel system. See FUEL AND EXHAUST > PURGE FUEL LINE section.' }, { n: 3, text: 'Remove main fuse. See ELECTRICAL > POWER DISCONNECT section.' }, { n: 4, text: 'Remove fuel tank. See FUEL AND EXHAUST > FUEL TANK section.' }, { n: 5, text: 'Remove spark plug cables from spark plugs.' }, { n: 6, text: 'Thoroughly clean around spark plug base.' }, { n: 7, text: 'Remove spark plugs.' }, { n: 8, text: 'Inspect spark plugs. Compare deposits to Table 2-19 to diagnose condition.' }, { n: 9, text: 'Discard plugs with eroded electrodes, heavy deposits, or cracked insulators.' }, { n: 10, text: 'Inspect spark plug cables for cracks or loose terminals.' }, { n: 11, text: 'Check cable boots/caps for cracks or tears. Replace as necessary.' }, { n: 12, text: 'Verify proper gap using wire-type feeler gauge before installing. Table 2-20 specifies 0.8–0.9 mm (0.031–0.035 in).' }, { n: 13, text: 'Pass gauge between center and outer electrodes. Adjust gap to specification.' }, { n: 14, text: 'Verify spark plug threads are clean and dry.' }, { n: 15, text: 'Install spark plugs and tighten. Torque: 84–108 in-lbs (9.5–12.2 N·m).' }, { n: 16, text: 'Install spark plug cables. See ELECTRICAL > SPARK PLUG CABLES section.' }, { n: 17, text: 'Install fuel tank. See FUEL AND EXHAUST > FUEL TANK section.' }, { n: 18, text: 'Install seat.' }, { n: 19, text: 'Install main fuse.' }, { n: 20, text: 'Add at least 3.8 L (1 gal) of fuel before operating fuel pump.' }, { n: 21, text: 'Set OFF/RUN switch to RUN and check for leaks.' }] },
{ id: 's25-maint-storage-prepare', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Prepare Motorcycle for Storage', summary: 'Change oil, check transmission fluid, prepare fuel tank with stabilizer, lubricate cylinders, inspect belt/filters, charge battery, cover motorcycle.', difficulty: 'Hard', timeMinutes: 120, source: { manual: '2025 HD Softail Service Manual', page: '2-48' }, figures: [], tools: [], parts: [{ number: '', description: 'Engine oil and filter', qty: 1 }, { number: '', description: 'Fuel stabilizer', qty: 1 }], torque: [], steps: [{ n: 1, text: 'Change engine oil and filter. See MAINTENANCE > REPLACE ENGINE OIL AND FILTER section.' }, { n: 2, text: 'Check transmission lubricant level. See MAINTENANCE > REPLACE TRANSMISSION LUBRICANT section.' }, { n: 3, text: 'Fill fuel tank completely.' }, { n: 4, text: 'Add fuel stabilizer to tank.' }, { n: 5, text: 'Remove spark plugs. See MAINTENANCE > CLEAN, INSPECT, REPLACE SPARK PLUGS section.' }, { n: 6, text: 'Inject few squirts of engine oil into each cylinder.' }, { n: 7, text: 'Crank engine for 5–6 revolutions.' }, { n: 8, text: 'Reinstall spark plugs.' }, { n: 9, text: 'Inspect drive belt deflection. See MAINTENANCE > INSPECT AND ADJUST DRIVE BELT AND SPROCKETS section.' }, { n: 10, text: 'Inspect drive belt and sprockets. See MAINTENANCE > INSPECT AND ADJUST DRIVE BELT AND SPROCKETS section.' }, { n: 11, text: 'Inspect air cleaner filter. See MAINTENANCE > INSPECT AIR FILTER section.' }, { n: 12, text: 'Lubricate controls. See MAINTENANCE > LUBRICATE CABLES AND CHASSIS section.' }, { n: 13, text: 'Check tire inflation and inspect for wear/damage. See MAINTENANCE > INSPECT TIRES AND WHEELS section.' }, { n: 14, text: 'For extended storage, securely support motorcycle under frame so all weight off tires.' }, { n: 15, text: 'Inspect operation of all electrical equipment and switches.' }, { n: 16, text: 'Wash painted and chrome surfaces. Apply light oil film to unpainted surfaces.' }, { n: 17, text: 'Ensure brake fluid/lubricants do not contact brake pads or discs.' }, { n: 18, text: 'Remove battery from vehicle and charge until correct voltage obtained.' }, { n: 19, text: 'Charge battery every other month if stored below 60 °F (16 °C).' }, { n: 20, text: 'Charge battery monthly if stored above 60 °F (16 °C).' }, { n: 21, text: 'Use breathable storage cover (Harley-Davidson cover or light canvas).' }, { n: 22, text: 'Do not use plastic materials; they promote condensation and corrosion.' }] },
{ id: 's25-maint-storage-retrieve', bikeIds: ['softail-2025'], system: 'maintenance', title: 'Remove Motorcycle from Storage', summary: 'Charge battery, reinstall and test, check clutch engagement, run engine to temperature, verify all fluids and systems, perform pre-ride checklist.', difficulty: 'Medium', timeMinutes: 60, source: { manual: '2025 HD Softail Service Manual', page: '2-49' }, figures: [], tools: [], parts: [], torque: [], steps: [{ n: 1, text: 'Charge battery. See MAINTENANCE > INSPECT BATTERY section.' }, { n: 2, text: 'Install battery. See MAINTENANCE > INSPECT BATTERY section.' }, { n: 3, text: 'Prior to starting after extended storage, place transmission in gear and push vehicle back/forth to assure clutch disengagement.' }, { n: 4, text: 'Inspect spark plugs. See MAINTENANCE > CLEAN, INSPECT, REPLACE SPARK PLUGS section.' }, { n: 5, text: 'Fill fuel tank if empty.' }, { n: 6, text: 'Start engine and run until reaching normal operating temperature.' }, { n: 7, text: 'Check engine oil level. See MAINTENANCE > REPLACE ENGINE OIL AND FILTER section.' }, { n: 8, text: 'Check transmission lubricant level. See MAINTENANCE > REPLACE TRANSMISSION LUBRICANT section.' }, { n: 9, text: 'Perform all checks in the PRE-RIDING CHECKLIST in the owner\'s manual.' }] }
// --- END SOFTAIL 2025 CHAPTER 2 JOBS ---
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
