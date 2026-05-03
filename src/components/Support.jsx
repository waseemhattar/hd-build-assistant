import React from 'react'
import TopNav from './TopNav.jsx'

// Public support page. Reachable at /support regardless of auth
// state — it's the URL we hand to Apple in App Store Connect's
// "Support URL" field, and it's also linked from the Landing
// page footer.
//
// Apple's only hard requirement for the support URL is that it
// be a real, accessible page where a user could reach a human or
// find self-serve help. The cheapest version is a single page
// with an email address and a short FAQ — that's exactly what
// this is.
//
// Mirrors Privacy.jsx in shape so the two pages feel consistent.

export default function Support({ onBack }) {
  return (
    <div className="min-h-screen bg-hd-black text-hd-text">
      <TopNav
        activeSection={null}
        onNavigate={() => onBack && onBack()}
        signedOut
        onSignInClick={onBack}
      />

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="text-xs uppercase tracking-widest text-hd-orange">
          Support
        </div>
        <h1 className="mt-2 font-display text-4xl tracking-wider text-hd-text sm:text-5xl">
          NEED A HAND?
        </h1>

        {/* Primary CTA — email link. Email-on-link click works on
            iOS, Android, and desktop (mailto: opens the system mail
            client). Big, can't miss, all-in-one tap. */}
        <div className="mt-6 rounded-md border border-hd-orange/30 bg-hd-orange/5 p-5">
          <p className="text-sm text-hd-text">
            <strong>The best way to reach us is email.</strong> Tell
            us what's going on and we'll get back to you — usually
            within a day, sometimes faster.
          </p>
          <a
            href="mailto:hello@sidestand.app?subject=Sidestand%20support"
            className="mt-4 inline-flex items-center gap-2 rounded bg-hd-orange px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
          >
            <MailIcon />
            hello@sidestand.app
          </a>
          <p className="mt-3 text-xs text-hd-muted">
            Pro tip — if something looks broken, include the bike
            you were looking at, what you tapped, and what happened
            (or didn't). That helps us track it down faster.
          </p>
        </div>

        <Section title="Frequently asked">
          <FaqItem
            question="I added a bike but it disappeared after a sync."
            answer="If you've recently signed in on a new device, give the app a moment to pull your data from the server. Pull down to refresh the page. If it's still missing after that, email us with the bike's nickname or VIN and we'll dig in."
          />
          <FaqItem
            question="I changed my service log and the public bike page hasn't updated."
            answer="Public bike pages are cached for a few minutes to keep them fast. Wait 5 minutes and reload — your latest changes will show up. If it's still stale after 15 minutes, email us."
          />
          <FaqItem
            question="The VIN scanner can't read my bike."
            answer="European bikes don't have a barcode on the VIN plate. Tap the scanner anyway — the app falls back to reading the VIN with the camera as text. Make sure the plate is well-lit and in focus. If that still doesn't work, type the VIN in by hand."
          />
          <FaqItem
            question="I want to delete my account."
            answer="Open Settings → Account → Delete account. Deletion is final and removes everything we have on you within 30 days. If you'd rather just take a break, sign out — your data stays put until you come back."
          />
          <FaqItem
            question="My ride didn't save."
            answer="Make sure you tapped Stop, not just Pause. If the app force-quit during a ride, the partial track is in your local cache and may recover when you reopen the app. If a ride genuinely didn't save, email us with the date and approximate route — we can sometimes recover from server-side logs."
          />
          <FaqItem
            question="Can I export my service log?"
            answer="Yes. Open the bike → Service book → tap the menu (top right) → Export PDF. The PDF includes the full service history, mileage, costs, and parts list, with the bike's VIN and current mileage at the top."
          />
          <FaqItem
            question="How do I share a ride to social?"
            answer="Open Rides → tap the ride you want to share → tap Share. Sidestand generates a shareable card with the map, distance, and your bike. Pick where you want to send it — Messages, Instagram, anywhere."
          />
          <FaqItem
            question="Is the AI mechanic always right?"
            answer="No — and we'd never claim it is. The AI quotes your service manual where it can, but always double-check torque values, part numbers, and procedures against the printed manual before you bolt anything together. Treat it like a knowledgeable buddy, not a service technician."
          />
        </Section>

        <Section title="Other things you might want">
          <Bullets
            items={[
              <><a href="/privacy" className="text-hd-orange hover:underline">Privacy policy</a> — what we collect and why.</>,
              <>App not working? Try force-quitting and reopening first; that fixes about 80% of weird states.</>,
              <>Found a bug? Email us with what you tapped and what happened — screenshots help a ton.</>,
              <>Got a feature idea? Email it our way. We read every message and we keep a list.</>
            ]}
          />
        </Section>

        <div className="mt-12 border-t border-hd-border pt-6 text-xs text-hd-muted">
          © Sidestand · sidestand.app
        </div>
      </article>
    </div>
  )
}

// ---------------- bits ----------------

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl tracking-wider text-hd-orange">
        {title.toUpperCase()}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-hd-text/90">
        {children}
      </div>
    </section>
  )
}

function FaqItem({ question, answer }) {
  return (
    <div className="rounded-md border border-hd-border bg-hd-dark p-4">
      <div className="font-semibold text-hd-text">{question}</div>
      <p className="mt-2 text-sm text-hd-text/80">{answer}</p>
    </div>
  )
}

function Bullets({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-hd-orange" />
          <span className="text-[15px] leading-relaxed text-hd-text/90">
            {it}
          </span>
        </li>
      ))}
    </ul>
  )
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}
