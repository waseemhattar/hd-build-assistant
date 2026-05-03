import React from 'react'
import TopNav from './TopNav.jsx'
import Logo from './Logo.jsx'

// Pre-auth landing page. Tells the story in 5 seconds, then offers a
// big "Get started" that opens the dedicated sign-in page.
//
// Positioning: Sidestand is the all-in-one motorcycle companion app.
// The original pitch was "service manual + build log" (passive
// reference). Now that ride tracking, Discover (community + curated
// routes), and shareable build sheets are first-class, the headline
// has to bridge active riding AND the static side. "BUILT FOR THE
// WHOLE RIDE" works on two levels — every ride you take, and every
// part of riding life.
//
// Sections:
//   1. TopNav (with "Sign in" on the right instead of the user widget)
//   2. Hero — headline + sub + CTAs + brand mark as graphic
//   3. Feature strip — three columns: Ride / Service & mods /
//      Discover & share. Rebalanced from the old Garage/Manual/Build
//      so rides + community routes are visible above the fold.
//   4. CTA strip
//   5. Footer — disclaimer (brand-neutral) + copyright
//
// All Clerk sign-in is on /sign-in (the SignInPage component); the
// landing page itself is pure marketing.
export default function Landing({ onSignIn, onSampleBike }) {
  return (
    <div className="min-h-screen bg-hd-black text-hd-text">
      <TopNav
        activeSection={null}
        onNavigate={() => onSignIn()}
        signedOut
        onSignInClick={onSignIn}
      />

      {/* HERO */}
      <section className="border-b border-hd-border">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:grid-cols-12 sm:gap-12 sm:px-6 sm:py-20">
          <div className="sm:col-span-7">
            <div className="text-xs uppercase tracking-widest text-hd-orange">
              Sidestand · the all-in-one motorcycle app
            </div>
            <h1 className="mt-3 font-display text-5xl tracking-wider text-hd-text sm:text-6xl md:text-7xl">
              BUILT FOR<br />THE WHOLE RIDE.
            </h1>
            <p className="mt-5 max-w-xl text-base text-hd-muted sm:text-lg">
              Save your rides and share them with friends. Show off
              your build with one link. Stay on top of service
              without thinking about it. Find new roads near you,
              posted by riders who've been there. Everything you'd
              want from your motorcycle — all in one place.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={onSignIn}
                className="rounded bg-hd-orange px-6 py-3 text-base font-semibold text-white hover:brightness-110"
              >
                Get started
              </button>
              {onSampleBike && (
                <button
                  onClick={onSampleBike}
                  className="rounded border border-hd-border bg-hd-dark px-6 py-3 text-base text-hd-text hover:border-hd-orange hover:text-hd-orange"
                >
                  See a build →
                </button>
              )}
            </div>
            <div className="mt-6 text-xs text-hd-muted">
              No credit card. Sign in and you're in.
            </div>
          </div>

          {/* Right side: brand mark as decorative graphic. We render the
              wordmark BIG, vertically, so it reads as a tank-graphic
              treatment without needing a real photo yet. Replaceable
              with a real hero image later by swapping this block. */}
          <div className="sm:col-span-5">
            <div className="flex items-center justify-center rounded-md border border-hd-border bg-hd-dark p-10 sm:p-14">
              <div className="text-center">
                <div className="mb-4 inline-block">
                  <Logo size={48} />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-hd-muted">
                  ride · log · build · share
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-hd-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            What's inside
          </div>
          <h2 className="mt-2 font-display text-3xl tracking-wider sm:text-4xl">
            MADE FOR THE WAY YOU ACTUALLY RIDE.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              kicker="01 · Ride"
              title="Save your rides. Share them."
              body="Hit start before you take off, hit stop when you're back. We'll keep the route, distance, time, and weather. Send it to a friend, post it on social, or just look back on it later."
            />
            <FeatureCard
              kicker="02 · Service & mods"
              title="Never forget what you did to your bike"
              body="Every oil change, brake job, and part you've added — written down where you'll actually find it again. The whole story stays with the bike, even if you sell it down the road."
            />
            <FeatureCard
              kicker="03 · Discover & share"
              title="Find new roads. Show off your build."
              body="See routes nearby that other riders loved, plus a few we've handpicked. When your bike's dialed in, flip a switch and it gets its own page — photos, mods, history — share it with one link."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-hd-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-14">
          <div>
            <h2 className="font-display text-2xl tracking-wider sm:text-3xl">
              READY WHEN YOU ARE.
            </h2>
            <p className="mt-1 text-sm text-hd-muted">
              Nothing to install. Sign in, add your bike, and you're good to go in about a minute.
            </p>
          </div>
          <button
            onClick={onSignIn}
            className="rounded bg-hd-orange px-6 py-3 text-base font-semibold text-white hover:brightness-110"
          >
            Get started
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="text-xs leading-relaxed text-hd-muted">
          <strong className="text-hd-text">Heads up —</strong> Sidestand
          is a reference tool, not your service manual. Always
          double-check torque values and part numbers against the real
          manual before you bolt anything together. Brand names, model
          names, and logos belong to their owners — we're not
          affiliated with any motorcycle manufacturer.
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-hd-muted">
          <span>© Sidestand · sidestand.app</span>
          {/* Anchor tags (not buttons) so right-click → Open in New
              Tab works, Apple's reviewers can copy the URLs, and
              search engines crawl the links. The router handles
              /privacy and /support as top-level routes regardless
              of auth state. */}
          <a href="/privacy" className="hover:text-hd-orange">
            Privacy policy
          </a>
          <a href="/support" className="hover:text-hd-orange">
            Support
          </a>
          <a href="mailto:hello@sidestand.app" className="hover:text-hd-orange">
            Contact
          </a>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ kicker, title, body }) {
  return (
    <div className="rounded-md border border-hd-border bg-hd-dark p-5">
      <div className="text-xs uppercase tracking-widest text-hd-orange">
        {kicker}
      </div>
      <div className="mt-2 font-display text-2xl tracking-wider">
        {title.toUpperCase()}
      </div>
      <p className="mt-2 text-sm text-hd-muted">{body}</p>
    </div>
  )
}
