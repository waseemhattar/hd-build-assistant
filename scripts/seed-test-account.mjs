#!/usr/bin/env node
//
// seed-test-account — populate a test account for App Store Review
//
// Why this script exists:
//
//   App Store reviewers need to sign in and see populated content, not an
//   empty garage. This script creates a fully-seeded test account with:
//
//     - 2 bikes (1 public, 1 private)
//     - 2 public rides for the public bike (with GPS routes, tags, etc.)
//     - 5 service entries across both bikes
//     - 3 mods (2 installed, 1 planned)
//
//   Running the script twice on the same email is safe — it uses natural
//   keys (VIN, started_at, titles) to detect and skip existing rows.
//
// Usage:
//
//   SUPABASE_URL=https://<ref>.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   node scripts/seed-test-account.mjs <email> <password>
//
// The test account will be created via Supabase Auth and seeded with
// content belonging to that user.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Missing env. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.\n' +
      'You can find both in Supabase Dashboard → Project Settings → API.'
  )
  process.exit(1)
}

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('Usage: node seed-test-account.mjs <email> <password>')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
})

// =====================================================================
// Helper: haversine distance (meters)
// =====================================================================
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000 // Earth radius in meters
  const toRad = (x) => (x * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// Compute total distance for a route of [lat, lng] points.
function routeDistance(points) {
  let d = 0
  for (let i = 1; i < points.length; i++) {
    d += haversine(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1])
  }
  return Math.round(d)
}

// Compute bbox from route points.
function routeBbox(points) {
  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity
  for (const [lat, lng] of points) {
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
  }
  return { minLat, maxLat, minLng, maxLng }
}

// =====================================================================
// Seed route generators (LA area)
// =====================================================================
function generateSundayBackroadsLoop() {
  // Roughly circular ~35km loop in LA area
  const points = [
    [34.0522, -118.2437], // Start: Downtown LA
    [34.0750, -118.2580],
    [34.1100, -118.2750],
    [34.1250, -118.2600],
    [34.1450, -118.2400],
    [34.1550, -118.2150],
    [34.1600, -118.1900],
    [34.1450, -118.1700],
    [34.1250, -118.1550],
    [34.1000, -118.1450],
    [34.0750, -118.1600],
    [34.0550, -118.1800],
    [34.0350, -118.1950],
    [34.0200, -118.2150],
    [34.0150, -118.2400],
    [34.0200, -118.2650],
    [34.0350, -118.2750],
    [34.0522, -118.2437] // Back to start
  ]
  return points
}

function generateQuickCoffeeRun() {
  // Shorter ~12km route in LA area
  const points = [
    [34.0522, -118.2437],
    [34.0650, -118.2350],
    [34.0800, -118.2200],
    [34.0900, -118.2050],
    [34.0850, -118.1900],
    [34.0700, -118.2000],
    [34.0550, -118.2250],
    [34.0522, -118.2437]
  ]
  return points
}

async function main() {
  // =====================================================================
  // Step 1: Create or look up user
  // =====================================================================
  console.log(`Creating or looking up test account: ${email}`)

  // Try to look up existing user
  let user = null
  const { data: existing } = await supabase.auth.admin.listUsers()
  user = existing?.users?.find((u) => u.email === email)

  if (user) {
    console.log(`  ✓ User already exists (id=${user.id})`)
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })
    if (error) {
      console.error(`  ✗ Failed to create user: ${error.message}`)
      process.exit(1)
    }
    user = data.user
    console.log(`  ✓ Created user (id=${user.id})`)
  }

  const userId = user.id

  // =====================================================================
  // Step 2: Seed bikes
  // =====================================================================
  console.log('\nSeeding bikes...')

  const bikeA = {
    vin: '1HD1KHM18LB123456',
    year: 2020,
    model: 'FLHX Street Glide',
    nickname: 'Glide',
    mileage: 24500,
    bike_type_id: 'touring-2020',
    cover_photo_url: 'https://via.placeholder.com/600x400?text=2020+Street+Glide',
    display_name: 'Glide'
  }

  const bikeB = {
    vin: '1HD1PXC51NB234567',
    year: 2022,
    model: 'FLHXSE CVO Street Glide',
    nickname: 'CVO',
    mileage: 8200,
    bike_type_id: 'touring-2020',
    cover_photo_url: 'https://via.placeholder.com/600x400?text=2022+CVO+Street+Glide',
    display_name: 'CVO'
  }

  let bikeAId = null,
    bikeBId = null

  // Upsert Bike A
  const { data: existingBikeA } = await supabase
    .from('garage_bikes')
    .select('id')
    .eq('auth_user_id', userId)
    .eq('vin', bikeA.vin)
    .limit(1)
    .maybeSingle()

  if (existingBikeA) {
    bikeAId = existingBikeA.id
    console.log(`  ✓ Bike A exists (VIN=${bikeA.vin})`)
  } else {
    const { data, error } = await supabase
      .from('garage_bikes')
      .insert({
        auth_user_id: userId,
        user_id: userId.toString(),
        ...bikeA,
        is_public: true
      })
      .select('id')
      .single()
    if (error) {
      console.error(`  ✗ Failed to insert Bike A: ${error.message}`)
      process.exit(1)
    }
    bikeAId = data.id
    console.log(`  ✓ Inserted Bike A (${bikeA.nickname})`)
  }

  // Upsert Bike B
  const { data: existingBikeB } = await supabase
    .from('garage_bikes')
    .select('id')
    .eq('auth_user_id', userId)
    .eq('vin', bikeB.vin)
    .limit(1)
    .maybeSingle()

  if (existingBikeB) {
    bikeBId = existingBikeB.id
    console.log(`  ✓ Bike B exists (VIN=${bikeB.vin})`)
  } else {
    const { data, error } = await supabase
      .from('garage_bikes')
      .insert({
        auth_user_id: userId,
        user_id: userId.toString(),
        ...bikeB,
        is_public: false
      })
      .select('id')
      .single()
    if (error) {
      console.error(`  ✗ Failed to insert Bike B: ${error.message}`)
      process.exit(1)
    }
    bikeBId = data.id
    console.log(`  ✓ Inserted Bike B (${bikeB.nickname})`)
  }

  // =====================================================================
  // Step 3: Seed rides (for Bike A only)
  // =====================================================================
  console.log('\nSeeding rides...')

  const startDateA = new Date()
  startDateA.setDate(startDateA.getDate() - 7) // 1 week ago
  startDateA.setHours(9, 0, 0, 0)

  const route1 = generateSundayBackroadsLoop()
  const dist1 = routeDistance(route1)
  const bbox1 = routeBbox(route1)
  const dur1 = 4200 // ~70 mins for 35km

  const { data: existingRide1 } = await supabase
    .from('rides')
    .select('id')
    .eq('auth_user_id', userId)
    .eq('bike_id', bikeAId)
    .eq('title', 'Sunday backroads loop')
    .limit(1)
    .maybeSingle()

  if (!existingRide1) {
    const endDateA = new Date(startDateA)
    endDateA.setSeconds(endDateA.getSeconds() + dur1)

    const { error } = await supabase.from('rides').insert({
      auth_user_id: userId,
      bike_id: bikeAId,
      title: 'Sunday backroads loop',
      started_at: startDateA.toISOString(),
      ended_at: endDateA.toISOString(),
      duration_seconds: dur1,
      distance_m: dist1,
      route: route1,
      is_public: true,
      share_name: 'Sunday Backroads',
      tags: ['scenic', 'twisty'],
      bbox_min_lat: bbox1.minLat,
      bbox_max_lat: bbox1.maxLat,
      bbox_min_lng: bbox1.minLng,
      bbox_max_lng: bbox1.maxLng
    })
    if (error) {
      console.error(`  ✗ Failed to insert ride 1: ${error.message}`)
      process.exit(1)
    }
    console.log('  ✓ Inserted ride: Sunday backroads loop (public)')
  } else {
    console.log('  ✓ Ride 1 already exists')
  }

  const startDateB = new Date()
  startDateB.setDate(startDateB.getDate() - 4) // 4 days ago
  startDateB.setHours(14, 30, 0, 0)

  const route2 = generateQuickCoffeeRun()
  const dist2 = routeDistance(route2)
  const bbox2 = routeBbox(route2)
  const dur2 = 1440 // ~24 mins for 12km

  const { data: existingRide2 } = await supabase
    .from('rides')
    .select('id')
    .eq('auth_user_id', userId)
    .eq('bike_id', bikeAId)
    .eq('title', 'Quick coffee run')
    .limit(1)
    .maybeSingle()

  if (!existingRide2) {
    const endDateB = new Date(startDateB)
    endDateB.setSeconds(endDateB.getSeconds() + dur2)

    const { error } = await supabase.from('rides').insert({
      auth_user_id: userId,
      bike_id: bikeAId,
      title: 'Quick coffee run',
      started_at: startDateB.toISOString(),
      ended_at: endDateB.toISOString(),
      duration_seconds: dur2,
      distance_m: dist2,
      route: route2,
      is_public: false,
      bbox_min_lat: bbox2.minLat,
      bbox_max_lat: bbox2.maxLat,
      bbox_min_lng: bbox2.minLng,
      bbox_max_lng: bbox2.maxLng
    })
    if (error) {
      console.error(`  ✗ Failed to insert ride 2: ${error.message}`)
      process.exit(1)
    }
    console.log('  ✓ Inserted ride: Quick coffee run (private)')
  } else {
    console.log('  ✓ Ride 2 already exists')
  }

  // =====================================================================
  // Step 4: Seed service entries
  // =====================================================================
  console.log('\nSeeding service entries...')

  const serviceEntries = [
    // Bike A: oil change (2 months ago)
    {
      bike_id: bikeAId,
      title: 'Oil and filter change',
      mileage: 24200,
      service_date: (() => {
        const d = new Date()
        d.setMonth(d.getMonth() - 2)
        return d.toISOString().split('T')[0]
      })(),
      parts: 'Synthetic 20W50, OEM filter',
      cost: 89.99
    },
    // Bike A: brake pads (3 months ago)
    {
      bike_id: bikeAId,
      title: 'Brake pads replacement (front)',
      mileage: 24050,
      service_date: (() => {
        const d = new Date()
        d.setMonth(d.getMonth() - 3)
        return d.toISOString().split('T')[0]
      })(),
      parts: 'Harley OEM front brake pads',
      cost: 125.0
    },
    // Bike B: air filter (6 months ago)
    {
      bike_id: bikeBId,
      title: 'Air filter service',
      mileage: 7800,
      service_date: (() => {
        const d = new Date()
        d.setMonth(d.getMonth() - 6)
        return d.toISOString().split('T')[0]
      })(),
      parts: 'Screamin Eagle air filter',
      cost: 45.0
    },
    // Bike B: plug check (9 months ago)
    {
      bike_id: bikeBId,
      title: 'Spark plugs inspection and gap check',
      mileage: 7200,
      service_date: (() => {
        const d = new Date()
        d.setMonth(d.getMonth() - 9)
        return d.toISOString().split('T')[0]
      })(),
      parts: 'OEM spark plugs',
      cost: 35.0
    },
    // Bike A: fork seal (12 months ago)
    {
      bike_id: bikeAId,
      title: 'Front fork seals replaced',
      mileage: 23700,
      service_date: (() => {
        const d = new Date()
        d.setMonth(d.getMonth() - 12)
        return d.toISOString().split('T')[0]
      })(),
      parts: 'HD fork seal kit, fork oil',
      cost: 285.0
    }
  ]

  for (const entry of serviceEntries) {
    const { data: existing } = await supabase
      .from('service_entries')
      .select('id')
      .eq('auth_user_id', userId)
      .eq('bike_id', entry.bike_id)
      .eq('title', entry.title)
      .limit(1)
      .maybeSingle()

    if (!existing) {
      const { error } = await supabase.from('service_entries').insert({
        auth_user_id: userId,
        user_id: userId.toString(),
        ...entry
      })
      if (error) {
        console.error(`  ✗ Failed to insert service entry: ${error.message}`)
        process.exit(1)
      }
      console.log(`  ✓ Inserted: ${entry.title}`)
    } else {
      console.log(`  ✓ Service entry already exists: ${entry.title}`)
    }
  }

  // =====================================================================
  // Step 5: Seed mods
  // =====================================================================
  console.log('\nSeeding mods...')

  const mods = [
    // Bike A: Vance & Hines exhaust (installed)
    {
      bike_id: bikeAId,
      title: 'Vance & Hines 16" Dresser Duals',
      category: 'exhaust',
      brand: 'Vance & Hines',
      part_number: 'VH17304',
      status: 'installed',
      cost: 1100.0,
      install_date: (() => {
        const d = new Date()
        d.setMonth(d.getMonth() - 8)
        return d.toISOString().split('T')[0]
      })()
    },
    // Bike A: sissy bar (installed)
    {
      bike_id: bikeAId,
      title: 'Passenger backrest sissy bar',
      category: 'comfort',
      brand: 'OEM',
      part_number: 'HD49500235',
      status: 'installed',
      cost: 300.0,
      install_date: (() => {
        const d = new Date()
        d.setMonth(d.getMonth() - 6)
        return d.toISOString().split('T')[0]
      })()
    },
    // Bike B: cam upgrade (planned)
    {
      bike_id: bikeBId,
      title: 'S&S Cycle 530G Cam Kit',
      category: 'engine',
      brand: 'S&S Cycle',
      part_number: 'SS330-0605',
      status: 'planned',
      cost: 1800.0,
      install_date: null
    }
  ]

  for (const mod of mods) {
    const { data: existing } = await supabase
      .from('bike_mods')
      .select('id')
      .eq('auth_user_id', userId)
      .eq('bike_id', mod.bike_id)
      .eq('title', mod.title)
      .limit(1)
      .maybeSingle()

    if (!existing) {
      const { error } = await supabase.from('bike_mods').insert({
        auth_user_id: userId,
        user_id: userId.toString(),
        ...mod
      })
      if (error) {
        console.error(`  ✗ Failed to insert mod: ${error.message}`)
        process.exit(1)
      }
      console.log(`  ✓ Inserted: ${mod.title} (${mod.status})`)
    } else {
      console.log(`  ✓ Mod already exists: ${mod.title}`)
    }
  }

  console.log('\nSeed complete!')
  console.log(`\nTest account ready:`)
  console.log(`  Email: ${email}`)
  console.log(`  Bikes: 2 (Glide is public)`)
  console.log(`  Rides: 2 (Sunday Backroads is public)`)
  console.log(`  Service: 5 entries`)
  console.log(`  Mods: 3 (2 installed, 1 planned)`)
}

main().catch((e) => {
  console.error('Seed failed:', e.message || e)
  process.exit(1)
})
