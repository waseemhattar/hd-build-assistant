import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from './auth/AuthProvider.jsx'
import ProcedureBrowser from './components/ProcedureBrowser.jsx'
import ProcedureDetail from './components/ProcedureDetail.jsx'
import Walkthrough from './components/Walkthrough.jsx'
import JobCardDetail from './components/JobCardDetail.jsx'
import RidesPage from './components/RidesPage.jsx'
import RideTracker from './components/RideTracker.jsx'
import Discover from './components/Discover.jsx'
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
  markOnboardingComplete,
  connectAuthUser,
  disconnectAuthUser
} from './data/userPrefs.js'
import { bikes as bikeCatalog } from './data/bikes.js'
import {
  setStorageUser,
  getUserLogoUrl,
  subscribe,
  getBike,
  forceFullPull
} from './data/storage.js'
import { migrateLegacyLocalDataIfNeeded } from './auth/userStorageMigration.js'
import usePullToRefresh from './hooks/usePullToRefresh.jsx'

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

  // Pre-warm iOS WKWebView's text-input subsystem so the first
  // BikeEditor / form open feels instant. WebKit lazy-loads the
  // keyboard, accessory toolbar, autofill stack, and dictation
  // pipeline the first time an input gets focus on a real device —
  // ~1-2s on iPhone. By focusing a hidden, off-screen input during
  // app boot, we pay that cost while the user is reading the home
  // screen instead of when they tap "+ Add". One-shot per app load.
  useEffect(() => {
    if (typeof document === 'undefined') return
    const t = setTimeout(() => {
      try {
        const el = document.createElement('input')
        el.setAttribute('aria-hidden', 'true')
        el.setAttribute('tabindex', '-1')
        el.style.cssText =
          'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;'
        document.body.appendChild(el)
        el.focus({ preventScroll: true })
        setTimeout(() => {
          el.blur()
          el.remove()
        }, 50)
      } catch (_) {
        /* non-fatal — pre-warm is a perf hint, not a requirement */
      }
    }, 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!isSignedIn || !user?.id) {
      return () => {
        setStorageUser(null)
        disconnectAuthUser()
      }
    }
    // Supabase Auth manages tokens internally — storage just needs
    // the user id to scope localStorage keys.
    setStorageUser(user.id)
    migrateLegacyLocalDataIfNeeded(user.id)

    let cancelled = false
    let timeoutId = null
    ;(async () => {
      // Pull server-side prefs (units + onboarding markers) into the
      // local cache BEFORE deciding whether to show FirstTimeSetup.
      // Without this gate, a fresh install would always fall through
      // to "local cache empty → wizard pops" even when the rider
      // already onboarded on a previous device.
      //
      // Capped at 3s so a slow/offline network doesn't leave the user
      // staring at a blank screen — after the timeout we trust the
      // local cache and continue, and the next successful sync will
      // reconcile if needed.
      const fetchPromise = connectAuthUser(user.id)
      const timeoutPromise = new Promise((resolve) => {
        timeoutId = setTimeout(resolve, 3000)
      })
      await Promise.race([fetchPromise, timeoutPromise])
      if (cancelled) return

      if (isOnboardingComplete()) return

      // Existing-user fast-path: a rider with bikes already pre-dates
      // the wizard (or is signing in on a new device after their first
      // setup). Mark complete silently so they're not interrupted.
      // Dynamic import avoids pulling getGarage onto the auth path.
      const { getGarage } = await import('./data/storage.js')
      if (cancelled) return
      const garage = getGarage() || []
      if (garage.length > 0) {
        markOnboardingComplete()
      } else {
        setSetupOpen(true)
      }
    })()

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
      setStorageUser(null)
      disconnectAuthUser()
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
    if (view === 'discover') return 'discover'
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
    } else if (section === 'discover') {
      // Discover is global — community rides nearby. No bike scope.
      setGarageBike(null)
      setView('discover')
    } else {
      setGarageBike(null)
      setView('home')
    }
  }

  return (
    <div className="min-h-screen bg-hd-black pb-24 text-hd-text sm:pb-0">
      {/* Global pull-to-refresh — drag down at the top of any page
          and the spinner runs forceFullPull(), which re-syncs the
          garage / service log / mods / builds + applies any
          server-side deletions. The storage subscribe channel pushes
          fresh data into every mounted component automatically. */}
      <GlobalPullToRefresh />

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

      {view === 'discover' && (
        <Discover
          onBack={() => navigate('home')}
          onOpenRide={() => {
            // Phase 1 — tapping a community ride opens the same
            // detail card. Wishlist + "ride this route" come in
            // a later phase.
          }}
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



// Global pull-to-refresh — listens at the document level so any
// page that's scrolled to the top gets the iOS-native "drag down to
// refresh" gesture. Calls forceFullPull() so the rider sees newly
// added bikes / service entries from another device, and any
// server-side deletions get applied immediately.
function GlobalPullToRefresh() {
  const { indicator } = usePullToRefresh(
    async () => {
      try {
        await forceFullPull()
      } catch (e) {
        console.warn('pull-to-refresh sync failed', e)
      }
    },
    { attachToWindow: true }
  )
  return indicator
}
