import React from 'react'

// Shimmering skeleton placeholder — replaces dull "Loading…" text.
//
// Implementation:
//   - Uses Tailwind's animate-pulse (built in)
//   - bg-white/[0.04] is barely-there gray, which sits on bg-hd-black
//     without being too loud. Cards underneath get bg-white/[0.06].
//
// Common shapes:
//   <Skeleton.Block height="h-44" />        // full-width block
//   <Skeleton.Line width="w-32" />          // text line
//   <Skeleton.Tile />                       // square stat tile
//   <Skeleton.Card />                       // full hero-style card

function Block({ height = 'h-6', width = 'w-full', className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/[0.04] ${height} ${width} ${className}`}
    />
  )
}

function Line({ width = 'w-full', className = '' }) {
  return <Block height="h-3" width={width} className={className} />
}

function Tile() {
  return (
    <div className="space-y-2 rounded-2xl bg-white/[0.04] p-4">
      <Block height="h-3" width="w-1/2" />
      <Block height="h-5" width="w-3/4" />
    </div>
  )
}

function Card() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white/[0.04]">
      <div className="aspect-[4/3] w-full bg-white/[0.04] sm:aspect-[16/9]" />
      <div className="space-y-3 p-5">
        <Block height="h-3" width="w-20" />
        <Block height="h-7" width="w-2/3" />
        <Block height="h-3" width="w-1/3" />
      </div>
    </div>
  )
}

function Row() {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-3.5 last:border-b-0">
      <div className="flex-1 space-y-1.5">
        <Block height="h-4" width="w-1/2" />
        <Block height="h-3" width="w-1/3" />
      </div>
      <Block height="h-3" width="w-12" />
    </div>
  )
}

const Skeleton = { Block, Line, Tile, Card, Row }
export default Skeleton
