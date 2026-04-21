import React, { useState } from 'react'
import BikePicker from './components/BikePicker.jsx'
import JobBrowser from './components/JobBrowser.jsx'
import JobView from './components/JobView.jsx'
import Garage from './components/Garage.jsx'
import ServiceBook from './components/ServiceBook.jsx'
import Home from './components/Home.jsx'
import { bikes as bikeCatalog } from './data/bikes.js'

// Views:
//   'home'        - landing page w/ Garage + Browse Manual cards
//   'garage'      - list of user's own bikes
//   'service'     - service book for a single garage bike
//   'picker'      - pick a platform from the catalog
//   'browse'      - browse jobs for a platform
//   'job'         - single job

export default function App() {
  const [view, setView] = useState('home')
  const [bike, setBike] = useState(null)       // catalog bike (platform)
  const [garageBike, setGarageBike] = useState(null) // user-owned bike
  const [job, setJob] = useState(null)

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
            className="font-display text-xl tracking-wider text-hd-orange hover:brightness-110"
          >
            HD BUILD ASSISTANT
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
