import React from 'react'

// Sidestand brand mark — designed as a SYSTEM, not a fixed file.
//
// Today: a clean text wordmark "sidestand" in light Inter. No glyph yet
// (waiting on a designer). When a real logo lands, drop the file URL
// into the `imageUrl` prop and this component swaps over.
//
// Tomorrow: per-user / per-shop custom logos. We store an uploaded
// logo URL on the user (later, on the shop row) and render it here.
//
// Props:
//   imageUrl   — if set, render the uploaded image instead of the
//                wordmark. The image should already be at the correct
//                aspect; we'll constrain by height only.
//   alt        — accessible name (defaults to "Sidestand")
//   size       — pixel height of the rendered mark. Default 24.
//   variant    — 'auto' (default) | 'wordmark' | 'image'
//                'auto' picks based on whether imageUrl is provided.
//   muted      — render the wordmark in muted gray instead of bone.
//                Useful in subdued footers.
//   className  — extra utility classes on the outer span.

export default function Logo({
  imageUrl,
  alt = 'Sidestand',
  size = 24,
  variant = 'auto',
  muted = false,
  className = ''
}) {
  const useImage =
    variant === 'image' || (variant === 'auto' && Boolean(imageUrl))

  if (useImage && imageUrl) {
    // Custom uploaded logo. Sized by height; width auto so any
    // aspect ratio (square mark, horizontal lockup, etc.) renders cleanly.
    return (
      <span
        className={`inline-flex items-center ${className}`}
        style={{ height: size }}
      >
        <img
          src={imageUrl}
          alt={alt}
          style={{
            height: size,
            width: 'auto',
            display: 'block',
            objectFit: 'contain'
          }}
          // Avoid layout-shift jank if the upload is broken or slow.
          loading="eager"
        />
      </span>
    )
  }

  // Default: text wordmark in Bebas Neue (the classic biker / motor
  // display font HD uses). All-caps + wide letter-spacing reads as a
  // tank-graphic wordmark.
  return (
    <span
      className={`inline-flex items-baseline ${className}`}
      aria-label={alt}
      role="img"
    >
      <span
        className={`font-display tracking-wider ${
          muted ? 'text-hd-muted' : 'text-hd-text'
        }`}
        style={{
          // Bebas Neue is condensed, so we render a touch larger than
          // a sans of the same nominal size to match optical weight.
          fontSize: Math.round(size * 1.35),
          lineHeight: 1
        }}
      >
        SIDESTAND
      </span>
    </span>
  )
}

// Convenience: a tiny accent dot the wordmark can sit next to. Used
// where we want a hint of the brand color without needing a real glyph.
// (Not used by default; only export it for places that opt in.)
export function BrandDot({ size = 10 }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '999px',
        background: '#E03A36'
      }}
    />
  )
}
