import React from 'react'
import { SignIn } from '@clerk/clerk-react'
import TopNav from './TopNav.jsx'
import Logo from './Logo.jsx'

// Dedicated sign-in page. Loaded when the URL is /sign-in (handled by
// App.jsx). The whole page is centered around the Clerk <SignIn /> with
// the same TopNav + brand framing as Landing.
//
// The Clerk appearance settings here mirror the dark + signal red
// palette and force light text colors on every Clerk element so
// nothing inherits a default that's invisible against our dark surface.
export default function SignInPage({ onBack }) {
  return (
    <div className="min-h-screen bg-hd-black text-hd-text">
      <TopNav
        activeSection={null}
        onNavigate={onBack}
        signedOut
        onSignInClick={onBack}
      />

      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-10 sm:py-16">
        <div className="mb-6 flex flex-col items-center gap-3">
          <Logo size={36} />
          <div className="text-xs uppercase tracking-widest text-hd-orange">
            Welcome to Sidestand
          </div>
        </div>

        <SignIn
          routing="hash"
          signUpForceRedirectUrl="/"
          signInForceRedirectUrl="/"
          appearance={{
            variables: {
              colorPrimary: '#E03A36',
              colorBackground: '#16161A',
              colorText: '#E8E2D5',
              colorTextSecondary: '#9A9A9F',
              colorTextOnPrimaryBackground: '#FFFFFF',
              colorInputBackground: '#0E0E10',
              colorInputText: '#E8E2D5',
              colorNeutral: '#E8E2D5',
              colorShimmer: 'rgba(232, 226, 213, 0.1)',
              borderRadius: '0.5rem',
              fontFamily: 'inherit'
            },
            elements: {
              card: 'border border-hd-border shadow-none bg-hd-dark',
              headerTitle: 'text-hd-text font-display tracking-wider',
              headerSubtitle: 'text-hd-muted',
              formFieldLabel: 'text-hd-text',
              formFieldInput: 'text-hd-text',
              identityPreviewText: 'text-hd-text',
              identityPreviewEditButton: 'text-hd-orange',
              dividerText: 'text-hd-muted',
              footerActionText: 'text-hd-muted',
              footerActionLink: 'text-hd-orange hover:brightness-110',
              socialButtonsBlockButton:
                'border border-hd-border text-hd-text hover:border-hd-orange',
              socialButtonsBlockButtonText: 'text-hd-text',
              formButtonPrimary:
                'bg-hd-orange text-white hover:brightness-110 normal-case tracking-wide'
            }
          }}
        />

        <button
          onClick={onBack}
          className="mt-6 text-xs text-hd-muted hover:text-hd-orange"
        >
          ← Back to home
        </button>
      </div>
    </div>
  )
}
