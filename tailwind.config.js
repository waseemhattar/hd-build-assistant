/** @type {import('tailwindcss').Config} */
//
// Sidestand — Dark + Signal Red palette.
//
// We keep the legacy hd-* token names so we don't have to touch ~300
// className strings across the codebase to do the rebrand. The colors
// themselves are remapped below. New `brand-*` tokens are also exposed
// for code written from here on.
//
// Palette:
//   bg / asphalt    #0E0E10   — outer background
//   surface         #16161A   — primary surface
//   card / slate    #1A1A1F   — cards, panels
//   border          #2A2A30   — hairlines, dividers
//   text / bone     #E8E2D5   — primary text
//   muted           #9A9A9F   — secondary text
//   accent / red    #E03A36   — single accent (buttons, badges, links)
//   accent-soft     rgba(224,58,54,0.15) — tinted backgrounds for chips
//
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Legacy tokens — remapped to the new dark + red palette
        hd: {
          orange: '#E03A36',   // accent (was HD orange / matte copper)
          black:  '#0E0E10',   // outer bg
          dark:   '#16161A',   // surface
          card:   '#1A1A1F',   // card
          border: '#2A2A30',   // border
          text:   '#E8E2D5',   // primary text
          muted:  '#9A9A9F'    // secondary text
        },
        // New tokens for use going forward
        brand: {
          bg:         '#0E0E10',
          surface:    '#16161A',
          card:       '#1A1A1F',
          border:     '#2A2A30',
          text:       '#E8E2D5',
          muted:      '#9A9A9F',
          red:        '#E03A36',
          'red-soft': 'rgba(224, 58, 54, 0.15)',
          'red-dim':  '#A82924'
        }
      },
      fontFamily: {
        // Bebas Neue: tall, condensed, all-caps display font — the
        // classic "biker / motor" wordmark vibe HD uses on tank
        // graphics and dealer signage. Used by `font-display` for
        // headings, page titles, and stat numbers across the app.
        display: ['"Bebas Neue"', 'Impact', 'system-ui', 'sans-serif'],
        // Inter for body copy — keeps reading comfortable.
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'ui-monospace', 'monospace']
      },
      letterSpacing: {
        wordmark: '-0.025em'
      }
    }
  },
  plugins: []
}
