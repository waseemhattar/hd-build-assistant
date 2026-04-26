/** @type {import('tailwindcss').Config} */
//
// Sidestand — Workshop Dusk palette.
//
// We keep the legacy token names (hd-*) so we don't have to touch 300+
// className strings across the codebase to do the rebrand. The colors
// themselves are remapped to the new palette below. A follow-up pass
// can rename the tokens to dusk-* once we're confident nothing breaks.
//
// Palette:
//   asphalt   #0B0D11   — true near-black, outer surface
//   charcoal  #14171C   — primary background
//   slate     #1F2530   — card surfaces
//   border    #2A2F38   — dividers, hairlines
//   copper    #B8722C   — single accent, replaces HD orange
//   bone      #E8E2D5   — primary text, off-white
//   muted     #9CA3AF   — secondary text
//
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Legacy tokens — remapped to Workshop Dusk
        hd: {
          orange: '#B8722C',   // was #F58220 (HD orange) → matte copper
          black:  '#0B0D11',   // was #0A0A0A → asphalt
          dark:   '#14171C',   // was #1A1A1A → charcoal
          card:   '#1F2530',   // was #222222 → slate
          border: '#2A2F38',   // was #2E2E2E → slate border
          text:   '#E8E2D5',   // was #E6E6E6 → bone
          muted:  '#9CA3AF'    // was #A3A3A3 → cool muted gray
        },
        // New tokens for use going forward (semantic + Workshop Dusk
        // direct names). Both old and new can coexist.
        dusk: {
          asphalt:  '#0B0D11',
          charcoal: '#14171C',
          slate:    '#1F2530',
          border:   '#2A2F38',
          copper:   '#B8722C',
          bone:     '#E8E2D5',
          muted:    '#9CA3AF'
        }
      },
      fontFamily: {
        // `display` was Bebas Neue (HD-style heavy display). We swap to
        // a lighter geometric sans so wordmarks read premium, not loud.
        // Inter is already loaded; this just chooses a lighter weight
        // and tighter tracking via utility classes where used.
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Mono is handy for part numbers and serial-like data.
        mono: ['"JetBrains Mono"', '"SF Mono"', 'ui-monospace', 'monospace']
      },
      letterSpacing: {
        wordmark: '-0.02em'
      }
    }
  },
  plugins: []
}
