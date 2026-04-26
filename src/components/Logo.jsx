import React from 'react'

// Sidestand brand mark.
//
// Visual concept: two facing brackets that together hint at the
// letter S — abstracted from the shapes a bike's stand makes when
// kicked out and folded up. Modern/abstract, holds up at any size.
//
// Style: stamped/embossed — the glyph is rendered in matte copper
// (#B8722C) with a faint dark drop offset to suggest it was pressed
// into a metal plate.
//
// Usage:
//   <Logo />               — 24px glyph alone
//   <Logo size={32} />     — custom glyph size
//   <Logo wordmark />      — glyph + "sidestand" lockup
//   <Logo wordmark muted /> — wordmark in subdued bone, no copper

export default function Logo({
  size = 24,
  wordmark = false,
  muted = false,
  className = ''
}) {
  // The bracket monogram. Left bracket is full opacity; right bracket
  // is faded to suggest depth + the "S" silhouette without spelling
  // it out literally. Drawn in an 80×80 viewBox so we can reuse the
  // same path math as the brand identity mockups.
  const glyph = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      role="img"
      aria-label="Sidestand"
      className="shrink-0"
    >
      <g transform="translate(40 40)">
        {/* Left bracket — full opacity copper */}
        <line
          x1="-22" y1="-22" x2="-22" y2="22"
          stroke="currentColor" strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="-22" y1="-22" x2="-12" y2="-22"
          stroke="currentColor" strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="-22" y1="22" x2="-2" y2="22"
          stroke="currentColor" strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Right bracket — faded for depth */}
        <line
          x1="22" y1="-22" x2="22" y2="22"
          stroke="currentColor" strokeWidth="3"
          strokeLinecap="round" opacity="0.35"
        />
        <line
          x1="22" y1="-22" x2="12" y2="-22"
          stroke="currentColor" strokeWidth="3"
          strokeLinecap="round" opacity="0.35"
        />
        <line
          x1="22" y1="22" x2="2" y2="22"
          stroke="currentColor" strokeWidth="3"
          strokeLinecap="round" opacity="0.35"
        />
      </g>
    </svg>
  )

  if (!wordmark) {
    return (
      <span
        className={`inline-flex items-center text-hd-orange ${className}`}
      >
        {glyph}
      </span>
    )
  }

  // Lockup: glyph + wordmark, with light/airy lowercase Inter.
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <span className="text-hd-orange">{glyph}</span>
      <span
        className={`font-light tracking-wordmark ${
          muted ? 'text-hd-muted' : 'text-hd-text'
        }`}
        style={{ fontSize: Math.round(size * 0.95), lineHeight: 1 }}
      >
        sidestand
      </span>
    </span>
  )
}
