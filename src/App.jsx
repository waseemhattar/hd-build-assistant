import React, { useEffect, useState } from 'react'
import {
  SignedIn,
  SignedOut,
  UserButton,
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
import PublicBike from './components/PublicBike.jsx'
import Logo from './components/Logo.jsx'
import { bikes as bikeCatalog } from './data/bikes.js'
import { setStorageUser, getUserLogoUrl, subscribe } from './data/storage.js'
import { migrateLegacyLocalDataIfNeeded } from './auth/userStorageMigration.js'

// URL → public-bike-slug helper. Returns the slug if the path is
// /b/<slug>, otherwise null. Done with a regex rather than react-router
// because the rest of the app is a state-machine and adding a real
// router for one route would be overkill. Slugs are restricted to the
// alphabet generatePublicSlug uses.
function readPublicBikeSlug() {
  if (typeof window === 'undefined') return null
  const m = window.location.pathname.match(/^\/b\/([0-9a-z]{4,32})\/?$/i)
  return m ? m[1] : null
}

// Views:
//   'home'        - landing page w/ Garage + Browse Manual cards
//   'garage'      - list of user's own bikes
//   'service'     - service book for a single garage bike
//   'picker'      - pick a platform from the catalog
//   'browse'      - browse jobs for a platform
//   'job'         - single job

// Top-level router. Gates the whole app behind Clerk auth — except
// for /b/<slug>, which is the public build-sheet route. We check the URL
// before the SignedOut/SignedIn split so that hitting a share link as a
// signed-out visitor doesn't bounce them through the sign-in flow.
//
// Signed-out visitors otherwise see Landing (pitch + embedded sign-in);
// signed-in users see AuthedApp (the real product).
export default function App() {
  // Track the slug in state so a future in-app navigation that calls
  // history.pushState (or a popstate event) can react. For now the only
  // way onto a /b/ URL is a hard navigation, so reading once at mount is
  // good enough — but a popstate listener costs nothing.
  const [publicSlug, setPublicSlug] = useState(() => readPublicBikeSlug())
  useEffect(() => {
    const onPop = () => setPublicSlug(readPublicBikeSlug())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  if (publicSlug) {
    return <PublicBike slug={publicSlug} />
  }

  return (
    <>
      <SignedOut>
        <Landing />
      </SignedOut>
      <SignedIn>
        <AuthedApp />
      </SignedIn>
    </>
  )
}

function AuthedApp() {
  // Wire storage to the signed-in user as soon as we have their id, then
  // run the one-time legacy-data migration on this device. Keeping this in
  // a child of SignedIn means `user` is guaranteed to be present.
  const { user } = useUser()
  const { isSignedIn, getToken } = useAuth()

  useEffect(() => {
    if (isSignedIn && user?.id) {
      // Pass getToken so storage can talk to Supabase with a fresh Clerk JWT
      // on every request. storage.js will also kick off a pull from the
      // server to merge any rows written from other devices.
      setStorageUser(user.id, getToken)
      migrateLegacyLocalDataIfNeeded(user.id)
    }
    return () => {
      // On unmount (eg. sign out), clear so we don't keep reading the
      // previous user's keys if another user signs in on the same page.
      setStorageUser(null)
    }
  }, [isSignedIn, user?.id, getToken])

  const [view, setView] = useState('home')
  const [bike, setBike] = useState(null)       // catalog bike (platform)
  const [garageBike, setGarageBike] = useState(null) // user-owned bike
  const [job, setJob] = useState(null)

  // User's uploaded brand logo (if any). Falls back to the default
  // text wordmark in <Logo />. Re-read on storage changes so the brand
  // bar updates the moment the user uploads a new logo.
  const [userLogoUrl, setUserLogoUrl] = useState(() => getUserLogoUrl())
  useEffect(() => {
    setUserLogoUrl(getUserLogoUrl())
    const unsub = subscribe(() => setUserLogoUrl(getUserLogoUrl()))
    return unsub
  }, [user?.id])

  function goHome() {
    setView('home')
    setBike(null)
    setGarageBike(null)
    setJob(null)
  }

  return (
    <div className="min-h-screen bg-hd-black text-hd-text">
      <header className="border-b border-hd-border bg-hd-dark">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <button
            onClick={goHome}
            className="hover:opacity-80 transition"
            title="Sidestand"
          >
            <Logo imageUrl={userLogoUrl} size={26} />
          </button>
          <nav className="flex items-center gap-4 text-xs">
            <button
              onClick={() => {
                setView('garage')
                setBike(null)
                setGarageBike(null)
                setJob(null)
              }}
              className={`hover:text-hd-orange ${
                view === 'garage' || view === 'service'
                  ? 'text-hd-orange'
                  : 'text-hd-muted'
              }`}
            >
              My Garage
            </button>
            <button
              onClick={() => {
                setView('picker')
                setBike(null)
                setGarageBike(null)
                setJob(null)
              }}
              className={`hover:text-hd-orange ${
                view === 'picker' || view === 'browse' || view === 'job'
                  ? 'text-hd-orange'
                  : 'text-hd-muted'
              }`}
            >
              Browse Manual
            </button>
            {bike && (view === 'browse' || view === 'job') && (
              <div className="hidden text-hd-muted sm:block">
                · <span className="text-hd-text">{bike.label}</span>
              </div>
            )}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-7 h-7'
                }
              }}
            />
          </nav>
        </div>
      </header>

      {view === 'home' && (
        <Home
          onOpenGarage={() => setView('garage')}
          onOpenManual={() => setView('picker')}
          onPickJob={(matchedBike, matchedJob) => {
            if (matchedBike) setBike(matchedBike)
            setJob(matchedJob)
            setView('job')
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
          onBack={goHome}
          onOpenServiceBook={(b) => {
            setGarageBike(b)
            setView('service')
          }}
          onOpenBike={(b) => {
            // Find the matching catalog entry for "Browse jobs".
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
    </div>
  )
}
