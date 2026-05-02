import React from 'react'

// Empty-state primitive. Replaces "no entries yet" dead text with an
// illustration, a clear headline, an explainer line, and a single
// primary CTA. Used wherever a list could be empty (Garage, mods,
// service log, ride history, procedures).
//
// Usage:
//   <EmptyState
//     icon={<BikeIcon />}
//     title="Your garage is empty"
//     description="Add your first bike and we'll start tracking service…"
//     ctaLabel="Add a bike"
//     onCtaClick={() => setEditing({ new: true })}
//   />

export default function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  onCtaClick,
  secondaryLabel,
  onSecondaryClick,
  className = ''
}) {
  return (
    <div
      className={`rounded-3xl bg-hd-dark p-7 text-center ${className}`}
    >
      {icon && (
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-hd-orange/15 text-hd-orange">
          {icon}
        </div>
      )}
      {title && (
        <div className="text-2xl font-bold text-hd-text">{title}</div>
      )}
      {description && (
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-hd-muted">
          {description}
        </p>
      )}
      {ctaLabel && onCtaClick && (
        <button
          onClick={onCtaClick}
          className="mt-5 rounded-full bg-hd-orange px-6 py-3 text-[15px] font-semibold text-white transition active:scale-95"
        >
          {ctaLabel}
        </button>
      )}
      {secondaryLabel && onSecondaryClick && (
        <button
          onClick={onSecondaryClick}
          className="ml-2 mt-5 text-[13px] text-hd-muted hover:text-hd-text"
        >
          {secondaryLabel}
        </button>
      )}
    </div>
  )
}
