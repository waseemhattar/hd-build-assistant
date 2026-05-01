import React from 'react'

// Apple Activity-ring-style progress circle. Renders an SVG arc + a
// number in the center.
//
// Usage:
//   <Ring percent={pct} color="#34d399" />
//
// Color is up to the caller — Home picks color by health bucket
// (green ≥80, amber ≥50, red <50) and other surfaces might pick by
// brand orange.

export default function Ring({ percent, color, size = 64, stroke = 6 }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (Math.max(0, Math.min(100, percent)) / 100) * c
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#fff"
        fontSize={size * 0.3}
        fontWeight="700"
      >
        {percent}
      </text>
    </svg>
  )
}
