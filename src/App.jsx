import React, { useState } from 'react'
import BikePicker from './components/BikePicker.jsx'
import JobBrowser from './components/JobBrowser.jsx'
import JobView from './components/JobView.jsx'

export default function App() {
  const [bike, setBike] = useState(null)
  const [job, setJob] = useState(null)

  return (
    <div className="min-h-screen bg-hd-black text-hd-text">
      {/* Top nav */}
      <header className="border-b border-hd-border bg-hd-dark">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <button
            onClick={() => {
              setBike(null)
              setJob(null)
            }}
            className="font-display text-xl tracking-wider text-hd-orange hover:brightness-110"
          >
            HD BUILD ASSISTANT
          </button>
          {bike && (
            <div className="text-xs text-hd-muted">
              <span className="text-hd-text">{bike.label}</span>
            </div>
          )}
        </div>
      </header>

      {!bike && <BikePicker onSelect={setBike} />}

      {bike && !job && (
        <JobBrowser
          bike={bike}
          onBack={() => setBike(null)}
          onSelectJob={setJob}
        />
      )}

      {bike && job && (
        <JobView
          bike={bike}
          job={job}
          onBack={() => setJob(null)}
        />
      )}
    </div>
  )
}
