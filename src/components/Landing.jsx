import React from 'react'
import TopNav from './TopNav.jsx'
import Logo from './Logo.jsx'

// Pre-auth landing page. Tells the story in 5 seconds, then offers a
// big "Get started" that opens the dedicated sign-in page.
//
// Sections:
//   1. TopNav (with "Sign in" on the right instead of the user widget)
//   2. Hero — headline + sub + CTAs + brand mark as graphic
//   3. Feature strip — three columns: Garage / Manual / Build sheets
//   4. CTA strip
//   5. Footer — copyright only
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
              Sidestand · for builders & riders
            </div>
            <h1 className="mt-3 font-display text-5xl tracking-wider text-hd-text sm:text-6xl md:text-7xl">
              WHERE YOUR BUILD<br />LIVES BETWEEN RIDES.
            </h1>
            <p className="mt-5 max-w-xl text-base text-hd-muted sm:text-lg">
              Track service. Log mods. Walk through factory procedures
              step by step. Share your build with a single link. One
              place for everything that happens between rides.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={onSignIn}
                className="rounded bg-hd-orange px-6 py-3 text-base font-semibold text-white hover:brightness-110"
              >
                Get started — it's free
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
              Free while in beta. No credit card. Cancel anytime.
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
                  build · log · share
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
            EVERYTHING YOU NEED, NOTHING YOU DON'T.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              kicker="01 · Garage"
              title="Every bike, in one place"
              body="Log every motorcycle you own — VIN, mileage, photos, install dates. Service intervals follow you, not the bike."
            />
            <FeatureCard
              kicker="02 · Manual"
              title="Step-by-step procedures"
              body="The factory service manual, organized by platform. Torque specs, part numbers, tool lists, figures — every job."
            />
            <FeatureCard
              kicker="03 · Build sheets"
              title="Share your build"
              body="One toggle and your bike has a public page with cover photo, mods list, and service history. Your link, your story."
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
              No setup, no install. Sign in and add your first bike in under a minute.
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
        <div className="text-xs text-hd-muted">
          © Sidestand · sidestand.app
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
