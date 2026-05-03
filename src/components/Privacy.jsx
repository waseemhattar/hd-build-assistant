import React from 'react'
import TopNav from './TopNav.jsx'

// Public privacy policy page. Reachable at /privacy regardless of
// auth state — it's the URL we hand to Apple in App Store Connect,
// and it's also linked from the Landing page footer.
//
// The content mirrors the FirstTimeSetup ConsentStep (which is the
// in-app at-signup version) but in long-form, with the standard
// privacy-policy section structure Apple's reviewers and trademark
// holders expect to see:
//
//   1. Plain-English summary at the top
//   2. What we collect
//   3. How we use it
//   4. Where it lives (sub-processors named explicitly)
//   5. Who can see it (sharing & disclosure)
//   6. Your controls (rights & deletion)
//   7. Children's privacy
//   8. Changes to this policy
//   9. Contact
//
// Voice matches the rest of the rewritten copy — talks to the rider,
// not the lawyer. The disclosures themselves are still legally
// accurate (this is a privacy policy, not marketing). When the
// underlying data practices change (e.g. a new sub-processor is
// added), update this page AND the FirstTimeSetup ConsentStep so
// they stay in sync.
//
// Effective date is rendered from a constant — bump it whenever the
// substance of this policy changes.

const EFFECTIVE_DATE = 'May 3, 2026'

export default function Privacy({ onBack }) {
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
          Privacy
        </div>
        <h1 className="mt-2 font-display text-4xl tracking-wider text-hd-text sm:text-5xl">
          PRIVACY POLICY
        </h1>
        <p className="mt-2 text-xs text-hd-muted">
          Effective {EFFECTIVE_DATE}
        </p>

        {/* Plain-English summary up top so people who won't read the
            whole thing still walk away with the right model. */}
        <Callout>
          <p className="text-sm leading-relaxed text-hd-text">
            <strong>The short version.</strong> Sidestand keeps the
            stuff you put in — bikes, rides, service, mods — so you
            can pick up where you left off. We don't sell your data,
            we don't run ads, and we don't share anything outside the
            services we need to run the app. You can delete any of it
            anytime, including your whole account.
          </p>
        </Callout>

        <Section title="Who we are">
          <p>
            Sidestand is a personal-use motorcycle companion app
            ("Sidestand", "we", "us"). This policy explains what
            data Sidestand collects when you use the app or this
            website, why we collect it, where it lives, and what
            choices you have about it.
          </p>
          <p className="mt-3">
            By using Sidestand you agree to this policy. If you
            don't agree, please don't use the app — and reach out
            if you'd like us to delete data you've already added.
          </p>
        </Section>

        <Section title="What we collect">
          <p>Sidestand stores the following on your behalf:</p>
          <Bullets
            items={[
              <><strong>Account info.</strong>{' '}Your email address, your name, and your profile photo. We get these from Apple, Google, or directly from you when you sign up with email.</>,
              <><strong>Your bikes.</strong>{' '}Year, make, model, optional VIN, mileage, nickname, notes, and any photos you upload.</>,
              <><strong>Service entries.</strong>{' '}Dates, mileage at service, parts used, costs, and notes for each entry you log.</>,
              <><strong>Mods.</strong>{' '}Brand, part numbers, costs, install dates, and any photos you upload.</>,
              <><strong>Rides.</strong>{' '}When you press Start, we collect GPS coordinates while the ride is recording, plus distance, speed, duration, and a weather snapshot taken at the start point. We stop when you press Stop.</>,
              <><strong>Mechanic chats.</strong>{' '}The messages you send to the AI mechanic, plus any photos you attach.</>,
              <><strong>Preferences.</strong>{' '}Units (imperial / metric), date format, currency, locale, and the on-by-default flags you've toggled on or off.</>,
              <><strong>Diagnostics.</strong>{' '}If the app crashes, we may receive a crash report from Apple. These reports don't contain your bikes, rides, or any of the content above — only technical info about the crash.</>
            ]}
          />
        </Section>

        <Section title="How we use it">
          <p>We only use your data to run the app:</p>
          <Bullets
            items={[
              'Show you your own bikes, rides, service log, and mods when you sign in.',
              'Compute service intervals and remind you when something is due.',
              'Render route maps from your GPS data on your own device.',
              'Match factory service procedures to your specific model.',
              'Send your AI-mechanic messages to our inference provider so it can answer.',
              'Look up weather conditions for the start point of a ride.',
              'Show your bike on a public build page when (and only when) you turn that on.',
              'Show your shared rides on the Discover map with the start and end points trimmed for privacy.'
            ]}
          />
          <p className="mt-3">
            We <strong>do not</strong> use your data for advertising,
            sell it to anyone, share it with data brokers, or train
            third-party AI models on it.
          </p>
        </Section>

        <Section title="Where your data lives">
          <p>
            Sidestand uses the following sub-processors to run the
            service. Each one only sees the slice of data it needs to
            do its job.
          </p>
          <Bullets
            items={[
              <><strong>Supabase</strong> (Postgres, storage, auth). Hosts your bike data, service log, mods, rides, and AI chat history. Your photos are stored in Supabase Storage. Supabase is a SOC 2 Type II–compliant provider.</>,
              <><strong>Anthropic (Claude API), via Cloudflare Workers AI.</strong>{' '}When you send a message to the AI mechanic, it's forwarded for inference. Photos sent to the mechanic are processed for inference and not retained by Anthropic.</>,
              <><strong>Open-Meteo.</strong>{' '}Free weather lookups during rides. We send latitude and longitude only — no account info, no identifiers.</>,
              <><strong>Stadia Maps.</strong>{' '}Static map tile rendering for ride share cards. We send a bounding box and a polyline only — no account info.</>,
              <><strong>OpenStreetMap.</strong>{' '}Map tiles for in-app maps and Discover. We send tile coordinates only.</>,
              <><strong>Apple and Google.</strong>{' '}If you sign in with Apple or Google, those providers see only the fact that you signed in. Sidestand never sees your password.</>,
              <><strong>Your device.</strong>{' '}Recent data is cached locally so the app works on a slow or offline connection.</>
            ]}
          />
        </Section>

        <Section title="Who else can see it">
          <Bullets
            items={[
              <><strong>You</strong>, through your signed-in account on any device.</>,
              <><strong>Anyone with the link to a public bike page</strong>, but only for the specific bikes, mods, and service entries you've explicitly turned public. The default is private. You can flip a bike back to private at any time and the link stops working.</>,
              <><strong>Other Sidestand riders</strong>, but only for rides you've explicitly turned public on the Discover map. The first and last segment of the route are clipped server-side so the start and end aren't shown.</>,
              'Nobody else. We do not give your data to advertisers, data brokers, analytics resellers, or third-party marketers.'
            ]}
          />
        </Section>

        <Section title="Your controls">
          <Bullets
            items={[
              'Edit or delete any bike, mod, service entry, or ride from inside the app at any time.',
              'Toggle each bike, mod, ride, or service entry between public and private.',
              'Delete your whole account from Settings. Deletion is final and removes everything we have on you within 30 days.',
              'Stop using the AI mechanic at any time — your other data stays untouched.',
              'Turn off ride GPS at any time by stopping the ride. We don’t collect location when no ride is recording.',
              'Ask us a question, request your data, or report a privacy concern using the contact info below.'
            ]}
          />
        </Section>

        <Section title="Children's privacy">
          <p>
            Sidestand is intended for people 16 and older who ride
            motorcycles. We don't knowingly collect data from anyone
            under 13. If you believe a child has signed up, contact
            us and we'll delete the account.
          </p>
        </Section>

        <Section title="Security">
          <p>
            Data is encrypted in transit between your device and our
            sub-processors using TLS 1.2+. Account passwords (when
            you use email sign-in) are never stored by Sidestand —
            they're handled by our auth provider and stored as one-way
            hashes.
          </p>
          <p className="mt-3">
            No method of transmitting or storing data on the internet
            is 100% secure. We work hard to protect your information
            but can't guarantee absolute security.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we change how we handle your data, we'll update this
            page and bump the effective date at the top. For
            material changes — say, a new sub-processor that
            receives a meaningful slice of your data — we'll also
            tell you in the app the next time you open it. Continued
            use of Sidestand after a change means you accept the
            updated policy.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions, requests, or privacy concerns? Reach out at{' '}
            <a
              href="mailto:hello@sidestand.app"
              className="text-hd-orange hover:underline"
            >
              hello@sidestand.app
            </a>
            . We read every message.
          </p>
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
      <div className="mt-3 space-y-1 text-[15px] leading-relaxed text-hd-text/90">
        {children}
      </div>
    </section>
  )
}

function Bullets({ items }) {
  return (
    <ul className="mt-3 space-y-2">
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

function Callout({ children }) {
  return (
    <div className="mt-6 rounded-md border border-hd-orange/30 bg-hd-orange/5 p-4">
      {children}
    </div>
  )
}
