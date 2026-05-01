import React from 'react'

// Generic "inset grouped" card. The visual primitive that anchors the
// iOS-native design — no border, just a subtle bg-hd-dark sitting on
// top of the page's bg-hd-black, with a generous rounded-3xl corner.
//
// Use:
//   <Card>...</Card>                          // default rounded-3xl
//   <Card className="overflow-hidden">...     // for media at the top edge
//   <Card padded={false}>...                  // for full-bleed children
//
// We DON'T add `overflow-hidden` by default because some children (like
// row hover backgrounds) need to bleed slightly. Add it explicitly when
// the card contains a top-edge image or map.

export default function Card({ className = '', padded = true, children }) {
  return (
    <div
      className={`rounded-3xl bg-hd-dark ${padded ? 'p-5' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
