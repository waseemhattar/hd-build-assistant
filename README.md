# HD Build Assistant

A personal web app for Harley-Davidson builds and maintenance. Pick the bike
you're working on, then jump to step-by-step procedures, torque specs, part
numbers and required tools — all sourced from your own service manuals.

## Stack

- Vite + React 18
- Tailwind CSS
- Pure JSON data (no backend yet)

## Run it

```bash
cd "hd-build-assistant"
npm install
npm run dev
```

Open http://localhost:5173

To build for deploy:
```bash
npm run build
npm run preview
```

## Flow

1. **Bike picker** — pick the year/model you're working on (Touring, Softail,
   CVO — all years you have manuals for are listed in `src/data/bikes.js`).
2. **Job browser** — search by keyword (e.g. *"air filter"*) or browse by
   system (Engine, Brakes, Chassis, …).
3. **Job view** — tabs for **Steps**, **Torque Specs**, **Parts**, and
   **Tools**.

## Adding a new job

Open `src/data/jobs.js`. Copy one of the existing entries and fill it in. The
important fields are:

```js
{
  id: 'unique-id',
  bikeIds: ['touring-2019'],        // one or more bike ids from bikes.js
  system: 'brakes',                 // one of the ids from systems[] in bikes.js
  title: 'Front Brake Pads — Replace',
  summary: 'Short one-liner.',
  difficulty: 'Moderate',
  timeMinutes: 60,
  source: { manual: '2019 HD Touring Service Manual.pdf', page: 214 },
  tools: ['3/8" drive torque wrench', 'T40 Torx bit'],
  parts: [{ number: '41300221', description: 'Pad kit, front', qty: 1 }],
  torque: [
    { fastener: 'Caliper mounting bolts', value: '38–42 N·m (28–31 ft-lbs)', note: '' }
  ],
  steps: [
    { n: 1, text: 'Put bike on lift, remove front wheel per wheel removal procedure.' },
    { n: 2, text: 'Remove caliper bolts.', warning: 'Support caliper — do not let it hang by the hose.' }
  ]
}
```

The `bikeIds` list means one procedure can cover multiple years when the
spec is identical — just add both ids.

## Adding a new bike / year

Open `src/data/bikes.js` and add an entry. The `manualFolder` and `manuals`
fields just record where the PDFs live on disk, so future features (linking
to PDFs, extracting text) have the reference.

## Manuals on disk

The app expects the user's service manuals to live in sibling folders on the
user's machine. Current folders:

- `2017/` — 2017 Touring service manual + parts catalogs (incl. FLHXSE/FLHTKSE)
- `2018/` — 2018 CVO Road Glide (FLTRXSE) service manual supplement
- `Touring--2019/` — 2019 Touring service manual + CVO supplements + parts + Boombox
- `Touring--2020/` — 2020 Touring service manual + parts catalog
- `SOFTAIL--2019/` — 2019 Softail service manual + parts
- `SOFTAIL--2020/` — 2020 Softail service manual

Nothing in the app reads these PDFs directly yet. The current data in
`src/data/jobs.js` was extracted from the 2018 CVO Road Glide Service Manual
Supplement. More procedures can be added over time.

## Deploying to Netlify (harley.h-dbuilds.com)

The repo is set up to deploy directly to Netlify as a static site.

- `netlify.toml` — build config (Node 20, `npm run build`, publish `dist/`)
- `public/_redirects` — SPA fallback so deep links resolve
- `public/robots.txt` — lets search engines index the site

Options to deploy:

1. **Netlify CLI** (from this folder):
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init         # link or create site
   netlify deploy --build --prod
   ```
2. **Drag-and-drop**: run `npm run build` and drop the `dist/` folder onto
   https://app.netlify.com/drop.
3. **Git-connected**: push this repo to GitHub and link the repo in Netlify —
   every push to the main branch will auto-deploy.

After first deploy, add `harley.h-dbuilds.com` as a custom domain in the
Netlify site settings, then add a `CNAME` record at your DNS host pointing
`harley` to the Netlify subdomain Netlify gives you.

## What's next

Ideas for future features:

- Open the source PDF at the right page when you click the source link.
- "Checklist mode" — tick off steps as you do them.
- Persist favorites / jobs in progress (IndexedDB).
- Import wizard that parses a service manual PDF into job entries.
- Export a printable job card with all the torque values and part numbers.
- Deploy as a PWA so it works in the garage with no internet.
