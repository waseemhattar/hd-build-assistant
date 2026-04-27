import React, { useEffect, useState } from 'react'
import {
  SignedIn,
  SignedOut,
  useAuth,
  useUser
} from '@clerk/clerk-react'
import BikePicker from './components/BikePicker.jsx'
import JobBrowser from './components/JobBrowser.jsx'
import JobView from './components/JobView.jsx'
import Garage from './components/Garage.jsx'
import ServiceBook from './components/ServiceBook.jsx'
import Home from './components/Home.jsx'
import Landing from './components/Landing.jsx'
import SignInPage from './components/SignInPage.jsx'
import PublicBike from './components/PublicBike.jsx'
import TopNav from './components/TopNav.jsx'
import { bikes as bikeCatalog } from './data/bikes.js'
import { setStorageUser, getUserLogoUrl, subscribe } from './data/storage.js'
import { migrateLegacyLocalDataIfNeeded } from './auth/userStorageMigration.js'
import { intervals } from './data/serviceIntervals.js'

// URL → public-bike-slug helper. /b/<slug> is the share-link route.
function readPublicBikeSlug() {
  if (typeof window === 'undefined') return null
  const m = window.location.pathname.match(/^\/b\/([0-9a-z]{4,32})\/?$/i)
  return m ? m[1] : null
}

// URL → "are we on /sign-in?" — used to render the dedicated sign-in
// page when the user clicks "Sign in" from the landing.
function isSignInPath() {
  if (typeof window === 'undefined') return false
  return /^\/sign-in\/?/.test(window.location.pathname)
}

// Tiny URL helpers that update the browser URL without a real router.
// Keeps deep links shareable ("send your buddy /sign-in" etc.) while
// staying within the existing state-machine approach.
function pushPath(path) {
  if (typeof window === 'undefined') return
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path)
  }
}

// Top-level router. Three big modes:
//   1. /b/<slug>          — public bike share page (no auth gate)
//   2. /sign-in           — dedicated sign-in page (signed-out)
//   3. everything else    — Landing (signed out) or AuthedApp (signed in)
export default function App() {
  const [publicSlug, setPublicSlug] = useState(() => readPublicBikeSlug())
  const [signInRoute, setSignInRoute] = useState(() => isSignInPath())

  useEffect(() => {
    function onPop() {
      setPublicSlug(readPublicBikeSlug())
      setSignInRoute(isSignInPath())
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function goToSignIn() {
    pushPath('/sign-in')
    setSignInRoute(true)
  }
  function goToLanding() {
    pushPath('/')
    setSignInRoute(false)
  }

  if (publicSlug) return <PublicBike slug={publicSlug} />

  return (
    <>
      <SignedOut>
        {signInRoute ? (
          <SignInPage onBack={goToLanding} />
        ) : (
          <Landing onSignIn={goToSignIn} />
        )}
      </SignedOut>
      <SignedIn>
        <AuthedApp />
      </SignedIn>
    </>
  )
}

function AuthedApp() {
  const { user } = useUser()
  const { isSignedIn, getToken } = useAuth()

  useEffect(() => {
    if (isSignedIn && user?.id) {
      setStorageUser(user.id, getToken)
      migrateLegacyLocalDataIfNeeded(user.id)
    }
    return () => {
      setStorageUser(null)
    }
  }, [isSignedIn, user?.id, getToken])

  // Internal view for the state machine (page-level routing inside the
  // signed-in app).
  //   home / garage / service / picker / browse / job / intervals
  const [view, setView] = useState('home')
  const [bike, setBike] = useState(null)         // catalog bike (platform)
  const [garageBike, setGarageBike] = useState(null) // user-owned bike
  const [job, setJob] = useState(null)

  // Live brand-logo URL so the top nav swaps when the user uploads.
  const [userLogoUrl, setUserLogoUrl] = useState(() => getUserLogoUrl())
  useEffect(() => {
    setUserLogoUrl(getUserLogoUrl())
    const unsub = subscribe(() => setUserLogoUrl(getUserLogoUrl()))
    return unsub
  }, [user?.id])

  // Map the internal `view` to which top-nav section should highlight.
  // Several views share a "section" — eg. Service Book is part of
  // Garage so the Garage tab stays lit while you're in there.
  function activeSection() {
    if (view === 'home') return 'home'
    if (view === 'garage' || view === 'service') return 'garage'
    if (view === 'picker' || view === 'browse' || view === 'job') return 'manual'
    if (view === 'intervals') return 'intervals'
    return null
  }

  // Single navigation handler used by TopNav and Home's quick actions.
  // Resets transient state (selected bike/job) so we don't carry stale
  // context into a new section.
  function navigate(section) {
    setBike(null)
    setGarageBike(null)
    setJob(null)
    if (section === 'home') setView('home')
    else if (section === 'garage') setView('garage')
    else if (section === 'manual') setView('picker')
    else if (section === 'intervals') setView('intervals')
    else setView('home')
  }

  return (
    <div className="min-h-screen bg-hd-black text-hd-text">
      <TopNav
        activeSection={activeSection()}
        onNavigate={navigate}
        userLogoUrl={userLogoUrl}
      />

      {view === 'home' && (
        <Home
          onOpenGarage={() => navigate('garage')}
          onOpenManual={() => navigate('manual')}
          onOpenIntervals={() => navigate('intervals')}
          onPickJob={(matchedBike, matchedJob) => {
            if (matchedBike) setBike(matchedBike)
            setJob(matchedJob)
            setView('job')
          }}
          onOpenServiceBook={(b) => {
            setGarageBike(b)
            setView('service')
          }}
        />
      )}

      {view === 'picker' && (
        <BikePicker
          onSelect={(b) => {
            setBike(b)
            setView('browse')
          }}
        />
      )}

      {view === 'browse' && bike && (
        <JobBrowser
          bike={bike}
          onBack={() => {
            setBike(null)
            setView('picker')
          }}
          onSelectJob={(j) => {
            setJob(j)
            setView('job')
          }}
        />
      )}

      {view === 'job' && bike && job && (
        <JobView
          bike={bike}
          job={job}
          onBack={() => {
            setJob(null)
            setView('browse')
          }}
        />
      )}

      {view === 'garage' && (
        <Garage
          onBack={() => navigate('home')}
          onOpenServiceBook={(b) => {
            setGarageBike(b)
            setView('service')
          }}
          onOpenBike={(b) => {
            const catalog = bikeCatalog.find((c) => c.id === b.bikeTypeId)
            if (catalog) {
              setBike(catalog)
              setView('browse')
            }
          }}
        />
      )}

      {view === 'service' && garageBike && (
        <ServiceBook
          bike={garageBike}
          onBack={() => {
            setGarageBike(null)
            setView('garage')
          }}
        />
      )}

      {view === 'intervals' && (
        <IntervalsLanding
          onBack={() => navigate('home')}
          onOpenGarage={() => navigate('garage')}
        />
      )}
    </div>
  )
}

// Lightweight reference page for HD intervals. The real per-bike
// evaluation lives inside ServiceBook → Intervals tab; this page is
// the "what does Harley recommend in general?" reference, accessible
// from the top nav even when the user has no bikes yet.
function IntervalsLanding({ onBack, onOpenGarage }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-hd-muted hover:text-hd-orange"
      >
        ← Back
      </button>

      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-hd-orange">
          Reference
        </div>
        <h1 className="mt-1 font-display text-3xl tracking-wider sm:text-4xl">
          HD SERVICE INTERVALS
        </h1>
        <p className="mt-2 text-sm text-hd-muted">
          Harley's recommended schedule. For your own bikes, these
          intervals are evaluated against current mileage in each
          bike's Service Book.
        </p>
        <button
          onClick={onOpenGarage}
          className="mt-4 inline-block rounded border border-hd-border bg-hd-dark px-4 py-2 text-sm text-hd-text hover:border-hd-orange hover:text-hd-orange"
        >
          Open my garage →
        </button>
      </div>

      <ul className="space-y-2">
        {intervals.map((i) => (
          <li
            key={i.id}
            className="rounded-md border border-hd-border bg-hd-dark p-4"
          >
            <div className="font-display text-lg tracking-wider">
              {i.label}
            </div>
            <div className="mt-1 text-xs text-hd-muted">{i.description}</div>
            <div className="mt-2 text-xs text-hd-orange">
              {i.mileageInterval
                ? `Every ${i.mileageInterval.toLocaleString()} mi · first at ${(
                    i.firstDue || i.mileageInterval
                  ).toLocaleString()} mi`
                : i.firstDue
                ? `One-time, at ${i.firstDue.toLocaleString()} mi`
                : ''}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
