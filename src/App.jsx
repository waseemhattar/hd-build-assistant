import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from './auth/AuthProvider.jsx'
import ProcedureBrowser from './components/ProcedureBrowser.jsx'
import ProcedureDetail from './components/ProcedureDetail.jsx'
import Walkthrough from './components/Walkthrough.jsx'
import JobCardDetail from './components/JobCardDetail.jsx'
import RidesPage from './components/RidesPage.jsx'
import RideTracker from './components/RideTracker.jsx'
import Garage from './components/Garage.jsx'
import ServiceBook from './components/ServiceBook.jsx'
import Home from './components/Home.jsx'
import Landing from './components/Landing.jsx'
import SignInPage from './components/SignInPage.jsx'
import PublicBike from './components/PublicBike.jsx'
import Settings from './components/Settings.jsx'
import TopNav from './components/TopNav.jsx'
import BottomTabBar from './components/BottomTabBar.jsx'
import MechanicChat from './components/MechanicChat.jsx'
import OnboardingTour from './components/ui/OnboardingTour.jsx'
import FirstTimeSetup from './components/FirstTimeSetup.jsx'
import {
  isOnboardingComplete,
  markOnboardingComplete
} from './data/userPrefs.js'
import { bikes as bikeCatalog } from './data/bikes.js'
import { setStorageUser, getUserLogoUrl, subscribe, getBike } from './data/storage.js'
import { migrateLegacyLocalDataIfNeeded } from './auth/userStorageMigration.js'

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
  const [setupOpen, setSetupOpen] = useState(false)

  useEffect(() => {
    if (isSignedIn && user?.id) {
      // Supabase Auth manages tokens internally — storage just needs
      // the user id to scope localStorage keys.
      setStorageUser(user.id)
      migrateLegacyLocalDataIfNeeded(user.id)

      // First-time setup gate. New users see the wizard once. Existing
      // users (who already have at least one bike) are auto-marked
      // complete so we don't re-prompt them.
      if (!isOnboardingComplete()) {
        // Defer the existing-user check by a tick so the storage cache
        // has time to hydrate from Supabase before we read it.
        const t = setTimeout(() => {
          // Read garage size via dynamic import to avoid pulling getGarage
          // into the import graph alongside the auth path.
          import('./data/storage.js').then(({ getGarage }) => {
            const garage = getGarage() || []
            if (garage.length > 0) {
              // Existing user — they pre-date the wizard. Mark complete
              // silently so they're not interrupted.
              markOnboardingComplete()
            } else {
              setSetupOpen(true)
            }
          })
        }, 250)
        return () => {
          clearTimeout(t)
          setStorageUser(null)
        }
      }
    }
    return () => {
      setStorageUser(null)
    }
  }, [isSignedIn, user?.id])

  // Internal view for the state machine (page-level routing inside the
  // signed-in app).
  //   home / garage / service / job-card
  //   procedures / procedure / walkthrough — Supabase-backed procedure flow
  const [view, setView] = useState('home')
  const [garageBike, setGarageBike] = useState(null) // user-owned bike — used for procedures + service book
  // Procedure flow state (Supabase-backed).
  const [procedure, setProcedure] = useState(null)
  const [procedureDetail, setProcedureDetail] = useState(null)
  // Hints for the destination view, set by Home's quick actions and
  // consumed once on first paint of the target screen. We clear them
  // after the first read so navigating back doesn't re-trigger.
  const [serviceInitial, setServiceInitial] = useState(null) // { tab, autoOpenEditor }
  const [autoOpenAddBike, setAutoOpenAddBike] = useState(false)
  // Active job-card id when the rider is viewing one card's detail
  // page. When `addingProceduresToJobCardId` is also set, the
  // procedure browser is in select-mode and tapping a procedure adds
  // it to that card instead of starting a walkthrough.
  const [activeJobCardId, setActiveJobCardId] = useState(null)
  const [addingProceduresToJobCardId, setAddingProceduresToJobCardId] = useState(null)

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
      view === 'procedures' ||
      view === 'procedure' ||
      view === 'walkthrough'
    ) {
      return 'manual'
    }
    if (view === 'rides' || view === 'ride-tracker') return 'rides'
    return null
  }

  // After saving/discarding a ride, jump back to the global rides list.
  // We pass these inline as callbacks rather than via a router because
  // the rest of the app is state-machine driven.


  // Single navigation handler used by TopNav and Home's quick actions.
  // Resets transient state so we don't carry stale context into a
  // new section.
  function navigate(section) {
    setProcedure(null)
    setProcedureDetail(null)
    if (section === 'home') {
      setGarageBike(null)
      setView('home')
    } else if (section === 'garage') {
      setGarageBike(null)
      setView('garage')
    } else if (section === 'manual') {
      // Tap Service Procedures → procedure browser. ProcedureBrowser
      // self-sources the active bike from the garage if none is set.
      setView('procedures')
    } else if (section === 'rides') {
      // Rides list is global (shows all bikes) so we drop any
      // currently-scoped garageBike. The RidesPage itself surfaces
      // a "+ Start a ride" button that pushes view to 'ride-tracker'.
      setGarageBike(null)
      setView('rides')
    } else {
      setGarageBike(null)
      setView('home')
    }
  }

  return (
    <div className="min-h-screen bg-hd-black pb-24 text-hd-text sm:pb-0">
      <TopNav
        activeSection={activeSection()}
        onNavigate={navigate}
        userLogoUrl={userLogoUrl}
        onOpenSettings={() => setView('settings')}
      />

      {view === 'home' && (
        <Home
          onOpenGarage={() => navigate('garage')}
          onOpenManual={() => navigate('manual')}
          onOpenRides={() => navigate('rides')}
          onStartRide={() => setView('ride-tracker')}
          onOpenServiceBook={(b) => {
            setGarageBike(b)
            setView('service')
          }}
          // Action-flavored quick tiles (replacing the old nav-tile
          // duplicates). Each routes to a specific tab + auto-open
          // mode in the destination so the rider can act in one tap.
          onPlanJob={(b) => {
            if (!b) return navigate('garage')
            setGarageBike(b)
            setServiceInitial({ tab: 'jobs', autoOpenEditor: false })
            setView('service')
          }}
          onLogService={(b) => {
            if (!b) return navigate('garage')
            setGarageBike(b)
            setServiceInitial({ tab: 'log', autoOpenEditor: true })
            setView('service')
          }}
          onAddBike={() => {
            setAutoOpenAddBike(true)
            navigate('garage')
          }}
        />
      )}

      {/* Supabase-backed procedure flow */}
      {view === 'procedures' && (
        <ProcedureBrowser
          bike={garageBike}
          onBack={() => {
            // If we entered the browser from a job card "+ Add
            // procedure" tap, going Back returns to that card. Else
            // back to home.
            if (addingProceduresToJobCardId) {
              setAddingProceduresToJobCardId(null)
              setView('job-card')
            } else {
              navigate('home')
            }
          }}
          addingToJobCardId={addingProceduresToJobCardId}
          onDoneAdding={() => {
            setAddingProceduresToJobCardId(null)
            setView('job-card')
          }}
          onSelectProcedure={(item, activeBike) => {
            // `item` is a paired-or-single object from the browser:
            //   { id, baseTitle, summary, remove?, install?, hasPair }
            // `activeBike` is whichever bike the rider was viewing
            // procedures for — propagate it up so ProcedureDetail
            // and Walkthrough know which bike to log service against.
            setProcedure(item)
            if (activeBike) setGarageBike(activeBike)
            setView('procedure')
          }}
        />
      )}

      {view === 'procedure' && procedure && (
        <ProcedureDetail
          item={procedure}
          procedureId={procedure.id /* fallback for legacy callers */}
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

      {view === 'rides' && (
        <RidesPage
          onStartRide={() => setView('ride-tracker')}
          onBack={() => navigate('home')}
        />
      )}

      {view === 'ride-tracker' && (
        <RideTracker
          onBack={() => setView('rides')}
          onSaved={() => setView('rides')}
        />
      )}

      {view === 'garage' && (
        <Garage
          onBack={() => navigate('home')}
          autoOpenAdd={autoOpenAddBike}
          onOpenServiceBook={(b) => {
            setAutoOpenAddBike(false)
            setGarageBike(b)
            setView('service')
          }}
          onOpenBike={(b) => {
            // Tapping into a bike card → procedure browser scoped to
            // this user-owned bike. The new flow uses garageBike
            // directly so procedure filtering can match year + model
            // code via the manuals.
            setAutoOpenAddBike(false)
            setGarageBike(b)
            setView('procedures')
          }}
        />
      )}

      {view === 'service' && garageBike && (
        <ServiceBook
          bike={garageBike}
          initialTab={serviceInitial?.tab || 'log'}
          autoOpenEditor={!!serviceInitial?.autoOpenEditor}
          onBack={() => {
            setGarageBike(null)
            setServiceInitial(null)
            setView('garage')
          }}
          onOpenJobCard={(cardId) => {
            setServiceInitial(null)
            setActiveJobCardId(cardId)
            setView('job-card')
          }}
        />
      )}

      {view === 'job-card' && activeJobCardId && garageBike && (
        <JobCardDetail
          cardId={activeJobCardId}
          bike={garageBike}
          onBack={() => {
            setActiveJobCardId(null)
            setView('service')
          }}
          onAddProcedures={() => {
            setAddingProceduresToJobCardId(activeJobCardId)
            setView('procedures')
          }}
          onRunJob={() => {
            // Phase 2 — sequential walkthrough lands here.
            alert('Sequential walkthrough is coming next. For now, tap a procedure to walk it individually.')
          }}
          onOpenProcedure={(item) => {
            // Tapping a row in the card list opens that single
            // procedure's walkthrough as a one-off.
            setProcedure({
              id: item.procedureId,
              baseTitle: item.title,
              hasPair: false
            })
            setView('procedure')
          }}
        />
      )}

      {view === 'settings' && (
        <Settings onBack={() => navigate('home')} />
      )}

      {/* Floating mechanic chat — available on every signed-in screen.
          Position is absolute fixed; it uses safe-area-inset and avoids
          overlapping the bottom tab bar via tailwind bottom-24 / sm:bottom-6.
          When the AI emits a [PROC:<id>] link in its reply, the chat
          calls back here so we can navigate the user into the matching
          procedure walkthrough. */}
      <MechanicChat
        onOpenProcedure={(procId, scopedBikeId) => {
          // Set the bike scope so ProcedureDetail/Walkthrough have
          // context (mileage logging, applies_to filters, etc).
          const garageBikeFromId = scopedBikeId
            ? getBike(scopedBikeId)
            : null
          setGarageBike(garageBikeFromId)
          setProcedure({ id: procId })
          setView('procedure')
        }}
      />

      {/* Bottom tab bar — visible on mobile / native, hidden on wide web */}
      <BottomTabBar
        activeSection={activeSection()}
        onNavigate={navigate}
      />

      {/* First-time setup wizard — units + privacy consent. Shown
          once per device for brand-new users (auto-skipped for
          existing users who already have bikes). */}
      {setupOpen && (
        <FirstTimeSetup onDone={() => setSetupOpen(false)} />
      )}

      {/* First-launch onboarding tour. Runs AFTER setup is complete
          (its own localStorage gate ignores the tour gate). */}
      <OnboardingTour />
    </div>
  )
}

