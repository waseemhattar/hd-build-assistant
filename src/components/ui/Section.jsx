import React from 'react'

// Section header — the small uppercase kicker + optional subtitle that
// sits above each Card in our iOS-native layout. Optional right-aligned
// action slot (typically a "See all" link).
//
// Pair this with <Card> to compose a labeled section:
//   <Section title="Recent rides" subtitle="Last few trips." action={...}>
//     <Card padded={false}>
//       <Rows>...</Rows>
//     </Card>
//   </Section>

export function SectionHeader({ title, subtitle, action, accent }) {
  return (
    <div className="mb-2 flex items-end justify-between gap-3 px-1">
      <div>
        <div
          className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
            accent === 'warn' ? 'text-amber-400' : 'text-hd-orange'
          }`}
        >
          {title}
        </div>
        {subtitle && (
          <div className="mt-0.5 text-[13px] text-hd-muted">{subtitle}</div>
        )}
      </div>
      {action}
    </div>
  )
}

// A full Section composes header + a content block (typically a Card).
// The wrapping <section> applies the page-level horizontal padding so
// individual screen files don't have to repeat it.
export default function Section({
  title,
  subtitle,
  action,
  accent,
  children
}) {
  return (
    <section className="px-4 pb-6 sm:px-6">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        action={action}
        accent={accent}
      />
      {children}
    </section>
  )
}
