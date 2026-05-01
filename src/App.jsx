import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from './auth/AuthProvider.jsx'
import BikePicker from './components/BikePicker.jsx'
import JobBrowser from './components/JobBrowser.jsx'
import JobView from './components/JobView.jsx'
import ProcedureBrowser from './components/ProcedureBrowser.jsx'
import ProcedureDetail from './components/ProcedureDetail.jsx'
import Walkthrough from './components/Walkthrough.jsx'
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

  return <RootRouter signInRoute={signInRoute} goToLanding={goToLanding} goToSignIn={goToSignIn} />
}

function RootRouter({ signInRoute, goToLanding, goToSignIn }) {
  const { isSignedIn, loading } = useAuth()

  // While we're determining the session (initial getSession() resolves),
  // show a tiny dark splash so we don't flash the wrong UI.
  if (loading) {
    return (
      <div className="min-h-screen bg-hd-black" aria-hidden="true" />
    )
  }

  if (!isSignedIn) {
    return signInRoute ? (
      <SignInPage onBack={goToLanding} />
    ) : (
      <Landing onSignIn={goToSignIn} />
    )
  }

  return <AuthedApp />
}

function AuthedApp() {
  const { user } = useUser()
  const { isSignedIn } = useAuth()

  useEffect(() => {
    if (isSignedIn && user?.id) {
      // Supabase Auth manages tokens internally — storage just needs
      // the user id to scope localStorage keys.
      setStorageUser(user.id)
      migrateLegacyLocalDataIfNeeded(user.id)
    }
    return () => {
      setStorageUser(null)
    }
  }, [isSignedIn, user?.id])

  // Internal view for the state machine (page-level routing inside the
  // signed-in app).
  //   home / garage / service / intervals
  //   procedures / procedure / walkthrough — new procedure flow (Supabase)
  //   picker / browse / job — legacy job flow (bundled jobs.js, deprecated)
  const [view, setView] = useState('home')
  const [bike, setBike] = useState(null)         // catalog bike (platform) — legacy
  const [garageBike, setGarageBike] = useState(null) // user-owned bike — used for procedures + service book
  const [job, setJob] = useState(null)
  // New procedure flow state — separate from the legacy job/bike state
  // because they live on different data sources (Supabase vs bundled JSON).
  const [procedure, setProcedure] = useState(null)
  const [procedureDetail, setProcedureDetail] = useState(null)

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
    if (
      view === 'picker' ||
      view === 'browse' ||
      view === 'job' ||
      view === 'procedures' ||
      view === 'procedure' ||
      view === 'walkthrough'
    ) {
      return 'manual'
    }
    if (view === 'intervals') return 'intervals'
    return null
  }

  // Single navigation handler used by TopNav and Home's quick actions.
  // Resets transient state (selected bike/job) so we don't carry stale
  // context into a new section.
  function navigate(section) {
    setBike(null)
    setJob(null)
    setProcedure(null)
    setProcedureDetail(null)
    if (section === 'home') {
      setGarageBike(null)
      setView('home')
    } else if (section === 'garage') {
      setGarageBike(null)
      setView('garage')
    } else if (section === 'manual') {
      // New behavior: tap Manual → procedure browser. If there's no
      // garageBike already in state, default to the first bike in the
      // user's garage for the bike-scoped view. ProcedureBrowser will
      // fall back to all-mode if there's no bike at all.
      setView('procedures')
    } else if (section === 'intervals') {
      setGarageBike(null)
      setView('intervals')
    } else {
      setGarageBike(null)
      setView('home')
    }
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

      {/* New Supabase-backed procedure flow */}
      {view === 'procedures' && (
        <ProcedureBrowser
          bike={garageBike}
          onBack={() => navigate('home')}
          onSelectProcedure={(p) => {
            setProcedure(p)
            setView('procedure')
          }}
        />
      )}

      {view === 'procedure' && procedure && (
        <ProcedureDetail
          procedureId={procedure.id}
          bike={garageBike}
          onBack={() => {
            setProcedure(null)
            setProcedureDetail(null)
            setView('procedures')
          }}
          onStartWalkthrough={(_proc, detail) => {
            setProcedureDetail(detail)
            setView('walkthrough')
          }}
        />
      )}

      {view === 'walkthrough' && procedure && procedureDetail && (
        <Walkthrough
          procedure={procedure}
          detail={procedureDetail}
          bike={garageBike}
          onExit={() => {
            // Pause — return to procedure detail
            setView('procedure')
          }}
          onComplete={() => {
            // Service entry already saved (if bike attached). Return
            // to the procedure list so user can pick another.
            setProcedure(null)
            setProcedureDetail(null)
            setView('procedures')
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
            // "Browse jobs" from a bike card → procedure browser scoped
            // to this user-owned bike. The new flow uses garageBike
            // (the user's bike) directly so procedure filtering can
            // match year + model code via the manuals.
            setGarageBike(b)
            setView('procedures')
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
