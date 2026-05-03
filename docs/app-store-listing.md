# Sidestand — App Store listing copy

Source-of-truth document for everything that gets pasted into App Store
Connect. Update here first, then transcribe into the form. Every field
shows the Apple-imposed character limit and the current count.

---

## App Name (30 chars)

```
Sidestand
```

**Count: 9 / 30**

Resist the urge to do "Sidestand: Motorcycle Tracker" or similar —
Apple penalizes keyword-stuffing in the app name, and clean one-word
names rank cleaner in search results. The subtitle does the descriptive
work.

---

## Subtitle (30 chars)

```
The all-in-one motorcycle app
```

**Count: 29 / 30**

This is the line that appears under the app name in search and on the
product page. Apple weights subtitle heavily for search ranking, so we
spend it on the highest-value descriptive term — "motorcycle app" —
rather than something poetic. Means we don't have to "waste" our 100
keyword characters on the word "motorcycle" since Apple already indexes
the subtitle.

Alternates considered:
- "Built for the whole ride" (24) — too poetic, loses search SEO
- "Track. Maintain. Discover." (26) — verby but vague
- "Save rides. Maintain. Share." (28) — closer but cluttered

---

## Promotional Text (170 chars)

```
Save your rides and share them with friends. Show off your build with one link. Stay on top of service. Find new roads — all in one app for riders.
```

**Count: 149 / 170**

Promotional Text appears at the top of the description, *above* "more".
You can change it anytime without resubmitting the build, so it's the
right place for time-bound stuff later: "New: Discover routes near you",
"Now on iPad", etc.

---

## Description (4000 chars)

```
Sidestand is the all-in-one motorcycle app for everyone who actually rides. Save your rides, share them with friends, stay on top of service, find new roads, and show off your build — all in one place.

— SAVE YOUR RIDES, SHARE THEM —
Hit start before you take off, hit stop when you're back. Sidestand keeps the route, distance, time, and weather automatically. Send your favorite rides to a friend, post them on social, or just look back on them later.

— NEVER FORGET WHAT YOU DID TO YOUR BIKE —
Every oil change, every brake job, every part you've added — written down where you'll actually find it again. Sidestand watches your service intervals and reminds you when something's coming due. The whole story stays with the bike, even if you sell it down the road.

— FACTORY PROCEDURES, STEP BY STEP —
The complete service manual for your bike, restructured into clean step-by-step procedures. Torque specs, part numbers, tool lists, exploded diagrams — everything you need to do the job right, in one place. No more flipping through a PDF covered in oil.

— DISCOVER NEW ROADS —
See routes near you that other Sidestand riders have ridden, plus a few we've handpicked. We trim the start and end of every route automatically — so you see the good roads, not where someone parks at night. Save the ones you love for next weekend.

— SHOW OFF YOUR BUILD —
When your bike's dialed in, flip a switch and it gets its own public page — cover photo, mods, service history, your story. Share it with one link.

— ASK YOUR AI MECHANIC —
Stuck on a torque value? Wondering if a strange noise is a quick fix or a teardown? Sidestand's AI mechanic knows your specific bike, quotes your service manual, and can even read photos you send it.

— BUILT FOR THE WHOLE BIKE —
VIN scanning to add bikes in seconds. Mileage tracking that follows the bike across owners. Multi-bike garage if you have more than one. Service log that exports to PDF for selling.

— PRIVACY-FIRST —
Your rides, your bike, your data — yours. Public sharing is opt-in, route privacy is automatic, and we don't sell anything to anyone.

Built by riders, for riders.
```

**Count: ~2370 / 4000**

(We don't mention pricing in the description — Apple shows the "Free"
badge automatically in metadata, and leaving it out keeps our hands
free to add paid tiers later without a copy rewrite.)

Notes on structure:
- The first paragraph is what shows above "more". It must hook in 2-3
  sentences.
- ALL-CAPS section headers with em-dashes are a convention Apple's
  reviewers and users are used to. Don't use markdown — App Store
  Connect strips it.
- Each section leads with the *outcome* for the rider, not the feature
  name. Keeps the voice consistent with the in-app language.

---

## Keywords (100 chars)

```
rider,biker,bike,ride,tracker,gps,log,service,manual,garage,mod,build,vin,route,road,trip,tour
```

**Count: 94 / 100**

Strategy:
- Comma-separated, no spaces around commas (Apple counts spaces).
- Every word from app name + subtitle is auto-indexed, so we DON'T
  repeat "sidestand", "motorcycle", "app", "all-in-one".
- **No brand names.** Apple's review team and trademark holders take
  a dim view of apps keyword-stuffing OEM brand names ("harley",
  "davidson", "honda", etc.) — it's a frequent rejection reason and
  a trademark-infringement risk. We stick to generic rider terms.
- "vin" is here because VIN scanning is a real differentiator vs.
  competitors.
- "bike" is included even though it overlaps cycling apps — Apple's
  Travel-category ranking surfaces motorcycle apps for "bike"
  searches more than fitness/cycling apps.
- Stop words ("the", "and", "for", "a") are a waste of characters —
  Apple ignores them.

---

## What's New in This Version (4000 chars)

For v1.0:

```
Welcome to Sidestand 1.0.

This first release brings everything together for the rider:

• GPS-tracked rides you can save and share with friends or on social
• Per-bike service log that follows the VIN, even if you sell the bike
• Factory service procedures, step by step — torque specs, part numbers, exploded diagrams
• Discover — find routes near you posted by other riders, plus a few we've handpicked
• Public build pages — share your bike with one link
• An AI mechanic that knows your specific bike and your service manual
• Multi-bike garage with VIN scanning to add bikes in seconds

We read every piece of feedback. Send yours through Settings → Get in touch.

Ride safe.
```

**Count: ~620 / 4000**

---

## URLs

| Field            | URL                            | Status                                          |
| ---------------- | ------------------------------ | ----------------------------------------------- |
| Marketing URL    | https://sidestand.app          | Live (Landing page)                             |
| Support URL      | https://sidestand.app/support  | Built — deploys with the next Netlify build. Verify it returns 200 after deploy before pasting into App Store Connect. |
| Privacy Policy   | https://sidestand.app/privacy  | Built — deploys with the next Netlify build. Verify it returns 200 after deploy before pasting into App Store Connect. |

Apple requires Support URL and Privacy Policy URL. Marketing URL is
optional but recommended.

---

## Categorization

| Field          | Value                                          |
| -------------- | ---------------------------------------------- |
| Primary cat.   | **Travel**                                     |
| Secondary cat. | **Lifestyle** (or **Sports** — pick one)       |

Travel is the right primary because Sidestand's daily-loop is rides +
discover (location-based, recurring). Lifestyle is the right secondary
because the build/community side is identity-and-aesthetic-driven, not
strictly a sport.

Avoid Sports as primary — App Store users searching Sports expect
fitness/scoring/leagues content, not vehicle apps.

---

## Age Rating

Run through Apple's age-rating questionnaire and aim for **4+**. The
app has:
- No violence, sexual content, drugs, gambling, or profanity.
- User-generated content (community ride sharing, public bike pages,
  AI mechanic chat) — Apple will ask about this. Answer **Infrequent /
  Mild** at most because we don't allow profile bios or free-form posts;
  the only UGC surfaces are ride titles and bike notes. Confirm your
  moderation plan before submitting.
- Location collection — disclose in the privacy nutrition labels (see
  below), not the age rating.

---

## App Privacy ("Nutrition Labels")

Apple requires you to declare exactly what data you collect and how it's
used. Fill this out in App Store Connect → App Privacy. Source-of-truth
mirrors the FirstTimeSetup consent step.

**Data Linked to User**:
- Contact Info → Email Address
- Contact Info → Name
- Identifiers → User ID
- User Content → Photos (bike photos, mod photos, mechanic chat photos)
- User Content → Other (service entries, mod log, ride titles)
- Location → Precise Location (during active ride recording, opt-in for
  Discover)
- Usage Data → Product Interaction (basic interaction events)
- Diagnostics → Crash Data, Performance Data

**Used for**: App Functionality only. NOT for tracking, advertising,
analytics resold to third parties, or product personalization across
companies.

**Tracking**: NO.

---

## Pricing

| Field           | Value           |
| --------------- | --------------- |
| Tier            | Free            |
| In-App Purchase | None at launch  |

---

## Localizations

English (U.S.) only for v1. The in-app `userPrefs` region picker
formats numbers per locale, but UI strings are English-only. Plan
localization as a post-launch task once we have a feedback signal.

---

## App icon

| Asset | Where it lives | Status |
| ----- | -------------- | ------ |
| 1024×1024 PNG master | `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png` | Built — replaced Capacitor placeholder |
| SVG source | `assets/icon/icon.svg` | Built |

Concept: stylized sidestand pictogram. Bone-colored kickstand lever
with a perpendicular foot pad, leaning at 22° clockwise (top-right
pivot, lower-left foot — matching how a kickstand actually deploys
from the left side of a bike). Brand-red dot at the pivot point on
solid `#0E0E10` background. Two-color, no transparency, no rounded
corners (Apple applies the squircle mask).

Iteration to refresh later — keep both source files (`assets/icon/`)
under version control so the SVG can be re-rendered to PNG anytime
without redrawing. To make changes: edit `assets/icon/icon.svg`,
re-render to 1024×1024 with ImageMagick or any SVG tool, drop the
result into the asset catalog. Xcode generates all device-size
variants from the 1024 master at build time.

---

## Submission checklist

Before you click "Submit for Review":

- [x] App icon present in build (1024×1024 master in asset catalog).
- [ ] Build uploaded via Xcode and processed (~10 min after Archive).
- [ ] All Marketing / Support / Privacy URLs return 200.
- [ ] Screenshots uploaded for at least 6.7" iPhone (Apple will
      auto-scale for older sizes if you don't provide them).
- [ ] Description, keywords, promotional text, what's new — all
      pasted from this doc.
- [ ] Categories set (Travel + Lifestyle).
- [ ] Age rating questionnaire completed.
- [ ] Privacy nutrition labels filled in.
- [ ] Pricing set to Free.
- [ ] At least one Test Information field has a contact email so Apple
      reviewers can reach you if a test login is needed.
- [ ] Demo account credentials in App Review Information if any feature
      is gated behind sign-in (Sidestand is — provide a test account).
- [ ] Export compliance answered (no encryption beyond standard HTTPS
      → "uses standard encryption").

---

## Voice & tone reference

Anything you write for the App Store after this should match the same
voice we landed on in the in-app rewrite:

- **Talk to the rider, not the engineer.** "Save your rides", not
  "GPS-tracked ride logging".
- **Lead with the outcome, not the feature.** "Never forget what you
  did to your bike", not "service log".
- **Conversational contractions.** "you'll", "we'll", "don't" — not
  "you will", "we will", "do not".
- **Short sentences, em-dashes for asides.** Riders read in short
  bursts.
- **No jargon.** "VIN" is fine (riders know it). "Per-VIN scoping" is
  not.
