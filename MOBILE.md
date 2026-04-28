# Sidestand — Mobile (iOS) Build Guide

Sidestand ships to iOS via [Capacitor](https://capacitorjs.com).
Capacitor wraps the React/Vite app into a native iOS shell. The web
app runs inside a `WKWebView`; native plugins expose phone APIs
(camera, GPS, etc.) when we wire them up.

## One-time setup (per Mac)

You need:

- **macOS** with Xcode installed (App Store)
- **Node 20+** (`node --version`)
- **CocoaPods** — install with `brew install cocoapods` (recommended)
- **Apple Developer account** (Individual or Organization, ~$99/year)
- **Bundle ID** registered in [Apple Developer → Identifiers](https://developer.apple.com/account/resources/identifiers/list)
  with App ID = `app.sidestand.app`

After cloning the repo:

```bash
npm install
npx cap add ios          # first time only — creates the ios/ folder
```

`npx cap add ios` is idempotent-ish but you only need it once on a
fresh clone. If `ios/` exists in the repo (we commit it), skip it.

## Day-to-day: build, sync, run

```bash
# Build the web app and sync into the iOS shell
npm run ios:sync

# Open the project in Xcode (build → run → debug from there)
npm run ios:open

# Or build + run on a connected device / simulator from the CLI
npm run ios:run
```

Three scripts, same first two steps; the third wraps Xcode's run.

### First Xcode launch

1. After `npm run ios:open`, Xcode opens `ios/App/App.xcworkspace`
2. Click the project name **App** in the left sidebar
3. Click the **App** target → **Signing & Capabilities** tab
4. **Automatically manage signing** = checked
5. **Team** dropdown = your Apple Developer team
6. **Bundle Identifier** = `app.sidestand.app` (already set by capacitor.config.ts)
7. Pick a run target at the top:
   - "iPhone 16 Pro" (or any simulator) for fast iteration
   - Your physical iPhone (must be plugged in + trusted) for real-device testing
8. Click ▶

The first build takes ~3–5 minutes (CocoaPods + Xcode native compile).
Subsequent builds are ~30 seconds.

## Live reload during dev (optional)

You can run the React dev server on your laptop and have the iPhone
load from it for hot reload. Edit `capacitor.config.ts`:

```ts
server: {
  url: 'http://192.168.1.42:5173', // your laptop IP + Vite port
  cleartext: true
}
```

Then:

```bash
npm run dev          # in one terminal — Vite dev server
npm run ios:open     # in another — opens Xcode pointing at your laptop
```

Run on the iPhone. Edits in `src/` hot-reload the WebView.

**Remember to revert `server.url` before building for TestFlight or
App Store** — production builds must load the bundled `dist/`.

## Shipping to TestFlight

1. In Xcode → **Product → Archive** (top menu)
2. Wait for the build (~5 minutes)
3. Organizer window opens automatically when done
4. Click **Distribute App** → **App Store Connect** → **Upload**
5. Sign with your Apple Developer team
6. Upload completes → goes through Apple's automated processing (~10–30 min)
7. In [App Store Connect](https://appstoreconnect.apple.com) → My Apps → Sidestand → TestFlight
8. Your build shows up with a yellow "Processing" badge → green once cleared
9. Add yourself as an internal tester → install on your iPhone via the TestFlight app

## When something breaks

**`pod install` errors out**
Update CocoaPods: `brew upgrade cocoapods`. If still broken, delete
`ios/App/Pods/` and `ios/App/Podfile.lock`, then run `npx cap sync ios`.

**Xcode can't find your provisioning profile**
Sign in to Xcode (Settings → Accounts) with your Apple ID. Then in
the project's Signing & Capabilities tab, uncheck "Automatically
manage signing", check it again, pick your team. Xcode regenerates.

**WebView is white / nothing loads**
You probably forgot `npm run ios:sync` after a code change. The iOS
shell loads from the bundled `dist/` — any change to `src/` requires
a fresh build + sync.

**"This app is not signed by a recognized developer" on iPhone**
Trust your developer certificate: Settings → General → VPN & Device
Management → tap your dev team → Trust.

## Native plugins we may add later

- `@capacitor/camera` — for VIN scanning, odometer photos
- `@capacitor/geolocation` — for ride-sensor recording
- `@capacitor/push-notifications` — service-due reminders
- `@capacitor/share` — native iOS share sheet for public bike links
- `capacitor-motion` (community) — accelerometer for vibration analysis

Add via `npm install <pkg>` then `npx cap sync ios`.

## File map

```
capacitor.config.ts        — Capacitor config (bundle ID, name, plugins)
ios/                       — Generated Xcode project (commit this)
  App/
    App.xcworkspace          — open this in Xcode (NOT App.xcodeproj)
    App/Info.plist           — iOS metadata
    App/public/              — synced web bundle (don't edit by hand)
src/data/platform.js       — JS helper to detect native vs web at runtime
```
