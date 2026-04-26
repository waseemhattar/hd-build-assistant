import React from 'react'
import { SignIn } from '@clerk/clerk-react'
import Logo from './Logo.jsx'

// Pre-auth landing page. Simple pitch on the left, embedded Clerk sign-in on
// the right. On mobile the sign-in stacks below.
//
// Styling: Clerk's <SignIn> accepts an `appearance` prop with CSS variables.
// We feed in the orange + dark palette from tailwind.config.js so the form
// matches the rest of the site. All the real field layout/validation is
// handled by Clerk.
export default function Landing() {
  return (
    <div className="min-h-screen bg-hd-black text-hd-text">
      <header className="border-b border-hd-border bg-hd-dark">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Logo wordmark size={22} />
          <a
            href="https://sidestand.app"
            target="_top"
            rel="noopener"
            className="text-xs text-hd-muted hover:text-hd-orange"
          >
            sidestand.app
          </a>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-2 md:gap-16 md:py-16">
        <section className="flex flex-col justify-center">
          <h1 className="font-light tracking-wordmark text-4xl text-hd-text sm:text-5xl">
            Where your build lives between rides.
          </h1>
          <p className="mt-4 text-base text-hd-muted sm:text-lg">
            Track service, log mods, follow step-by-step procedures from the
            Harley-Davidson service manuals, and share your build — all in one
            place, on every device.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-hd-muted">
            <li>
              <span className="text-hd-text">•</span> Touring M8 Gen 1
              (2017–2023) and Softail M8 Gen 2 (2024–2025) covered
            </li>
            <li>
              <span className="text-hd-text">•</span> Every procedure has the
              manual page, figures, torque values and tools
            </li>
            <li>
              <span className="text-hd-text">•</span> Log completed services
              against each of your bikes, export a PDF service book
            </li>
          </ul>

          <div className="mt-8 rounded-md border border-hd-border bg-hd-dark p-3 text-xs leading-relaxed text-hd-muted sm:text-sm">
            <strong className="text-hd-text">Heads up —</strong> this is a
            personal reference tool, not an official Harley-Davidson
            resource. Always verify torque values and part numbers against
            the printed service manual before final assembly. Harley-Davidson®
            is a registered trademark of H-D U.S.A., LLC — this site is not
            affiliated with or endorsed by Harley-Davidson.
          </div>
        </section>

        <section className="flex items-start justify-center md:justify-end">
          <SignIn
            routing="hash"
            signUpForceRedirectUrl="/"
            signInForceRedirectUrl="/"
            appearance={{
              variables: {
                colorPrimary: '#B8722C', // copper
                colorBackground: '#14171C', // charcoal
                colorText: '#E8E2D5', // bone
                colorTextSecondary: '#9CA3AF', // muted
                colorInputBackground: '#0B0D11', // asphalt
                colorInputText: '#E8E2D5',
                borderRadius: '0.5rem',
                fontFamily: 'inherit'
              },
              elements: {
                card: 'border border-hd-border shadow-none',
                headerTitle: 'font-display tracking-wider',
                socialButtonsBlockButton:
                  'border border-hd-border hover:border-hd-orange',
                formButtonPrimary:
                  'bg-hd-orange hover:brightness-110 normal-case tracking-wide'
              }
            }}
          />
        </section>
      </main>

      <footer className="mt-10 border-t border-hd-border">
        <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-hd-muted">
          Sidestand — a personal build assistant for motorcycle riders.
        </div>
      </footer>
    </div>
  )
}
