# Sidestand Manuals — Authoring Guide

This folder is the **source of truth for procedure files** that get
ingested into the Sidestand database. The runtime app reads procedures
from Supabase, but you author them as JSON files here so they're
version-controlled, reviewable in pull requests, and auditable.

## Mental model

```
manufacturer  →  manual  →  chapter  →  procedure
                                        └── tools / parts / fluids
                                            torque / warnings / steps
```

A **procedure** is one thing a rider does — "Change engine oil &
filter," "Adjust primary chain," etc. Procedures are grouped into
**chapters** (Maintenance, Engine, Transmission, …) which belong to a
**manual** (a service-manual book) which belongs to a **manufacturer**.

## Folder layout

```
manuals/
  README.md                            ← this file
  hd-touring-2017-2023/                ← one folder per manual
    manual.json                        ← manual metadata
    maintenance/                       ← one folder per chapter
      oil-and-filter.json              ← one file per procedure
      air-filter.json
      …
    engine/
      …
  hd-softail-2024-2025/
    manual.json
    …
```

## File: `manual.json`

Top-level metadata for the manual itself. One per manual folder.

```json
{
  "slug": "hd-touring-2017-2023",
  "manufacturer": "Harley-Davidson",
  "title": "Harley-Davidson Touring Service Manual (2017–2023)",
  "family": "Touring",
  "year_from": 2017,
  "year_to": 2023,
  "model_codes": ["FLHX", "FLHXS", "FLHTK", "FLTRX", "FLTRXS", "FLHR", "FLHRXS"],
  "tier": "free",
  "source_pdf": "2020 HD Touring Service Manual.pdf",
  "source_owner": "Harley-Davidson, Inc.",
  "notes": "Optional admin notes — never displayed to riders."
}
```

Fields:

- **slug** — unique kebab-case id used in URLs. Don't change after publishing; URLs depend on it.
- **manufacturer** — display name; case-sensitive.
- **title** — full book title.
- **family** — manufacturer's grouping (Touring / Softail / Sport / etc).
- **year_from / year_to** — model-year range covered.
- **model_codes** — leading code letters for each model (e.g. `FLHX` not `Street Glide`). Used to filter procedures by user's bike.
- **tier** — `free` or `premium`. Free is visible to anonymous + authenticated. Premium is gated for paid users (gating not implemented yet — sets the stage for later).
- **source_pdf**, **source_owner** — private audit fields, never displayed to riders. Helps you remember which PDF the procedures came from.

## File: `<chapter>/<procedure>.json`

One file per procedure. The chapter is determined by the folder name.

```json
{
  "slug": "engine-oil-and-filter",
  "title": "Engine oil and filter — change",
  "summary": "Drain old oil, swap the filter, refill with fresh oil to spec.",
  "difficulty": "Easy",
  "time_minutes": 30,
  "applies_to": [],
  "tier": "free",
  "is_clean": true,
  "source_page": 47,
  "source_section": "Chapter 1 — Maintenance",

  "tools": [
    "Oil drain pan (4qt+ capacity)",
    "Oil filter wrench",
    "10mm socket",
    "Torque wrench (in-lb range)"
  ],

  "parts": [
    { "part_number": "63731-99A", "description": "Oil filter (chrome)", "qty": 1 },
    { "part_number": "62700100", "description": "Drain plug O-ring", "qty": 1 }
  ],

  "fluids": [
    { "name": "Genuine engine oil 20W50 SYN3", "capacity": "4 qt", "note": "Use the synthetic for best results." }
  ],

  "torque": [
    { "fastener": "Drain plug", "value": "14–21 N·m (10–15 ft-lb)", "note": "Replace O-ring before reinstalling." },
    { "fastener": "Oil filter", "value": "Hand-tight + 1/2 turn", "note": "Pre-fill with oil and lube the gasket." }
  ],

  "warnings": [
    { "level": "warning", "text": "Hot engine oil can cause severe burns. Let the engine cool before draining." },
    { "level": "caution", "text": "Use only HD-approved oil; non-approved oils may damage the engine." }
  ],

  "steps": [
    { "step_number": 1, "body": "Run the engine for 5 minutes to warm the oil, then shut it off." },
    { "step_number": 2, "body": "Place a drain pan under the engine drain plug.", "warning": "Hot oil — wear gloves." },
    { "step_number": 3, "body": "Remove the drain plug and let oil drain fully (usually 10 min)." },
    { "step_number": 4, "body": "Replace the drain plug O-ring, reinstall the drain plug to spec." },
    { "step_number": 5, "body": "Remove the old oil filter. Catch any drips with a rag." },
    { "step_number": 6, "body": "Pre-fill the new filter with oil. Lube the rubber gasket. Hand-tighten + 1/2 turn." },
    { "step_number": 7, "body": "Refill the engine with the spec'd amount of fresh oil." },
    { "step_number": 8, "body": "Run the engine 1 minute, shut off, check for leaks. Top up if needed.", "note": "Dispose of waste oil at a recycling center." }
  ]
}
```

### Field reference

**Procedure-level fields**

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | string | yes | kebab-case, unique within chapter |
| `title` | string | yes | shown in browse list |
| `summary` | string | no | one-liner under title |
| `difficulty` | `Easy` / `Moderate` / `Advanced` | no | |
| `time_minutes` | int | no | rough estimate |
| `applies_to` | string[] | no | catalog bike ids; empty = all bikes covered by parent manual |
| `tier` | `free` / `premium` | no | defaults to free |
| `is_clean` | bool | yes | set `true` ONLY after you've paraphrased and audited |
| `source_page` | int | no | private audit only |
| `source_section` | string | no | private audit only |

**Component arrays**

- `tools` — strings or `{ "name": "...", "note": "..." }` objects
- `parts` — `{ "part_number": "...", "description": "...", "qty": N, "note": "..." }`
- `fluids` — `{ "name": "...", "capacity": "...", "note": "..." }`
- `torque` — `{ "fastener": "...", "value": "...", "note": "..." }`
- `warnings` — `{ "level": "warning"|"caution"|"notice", "text": "..." }`
- `steps` — `{ "step_number": N, "body": "...", "warning": "...", "note": "...", "image_url": "..." }`

## Critical rule — paraphrasing

**`is_clean = true` is a promise.** It tells Sidestand "this procedure
has been rewritten in original prose, no copy-paste from any
copyrighted manual." Until `is_clean` is true, the procedure is
**invisible to non-admin users** — only you (and other admins) can see
it.

When in doubt, leave `is_clean = false`. You can flip it later via
the in-app admin UI or a SQL update.

**Things that are safe to copy verbatim** (factual, not copyrightable):

- Torque values
- Part numbers
- Fluid capacities + types
- Tool requirements (e.g. "T27 Torx bit")

**Things that must be in your own words:**

- Step text — never copy the manual's prose
- Warning text — paraphrase the safety message
- Summary, descriptions, notes

## Adding a new manual — checklist

1. Create a folder `manuals/<slug>/`
2. Write `manual.json` with the manual metadata
3. Create a folder per chapter (e.g. `maintenance/`, `engine/`)
4. Write one `.json` file per procedure inside the chapter folder
5. Run the ingester:
   ```bash
   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
     node scripts/ingest-manuals.mjs
   ```
6. Verify in Supabase — procedures land with `is_clean=false` by default
7. Audit each procedure → flip `is_clean=true` once paraphrased

## Editing existing procedures

The ingester is idempotent — safe to re-run as you edit files. Procedures
match by `(chapter_id, slug)`, manuals by `slug`, intervals by `legacy_id`.
Re-running with edited files updates the existing rows in place.

## Service intervals

Service intervals (what mileage to do what at) are a separate concept.
They live in the `service_intervals` table and are ALWAYS free —
regardless of the parent manual's tier. This matches Sidestand's
principle: schedule is public knowledge; the procedure is the value.
