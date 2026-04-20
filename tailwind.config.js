/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        hd: {
          orange: '#F58220',
          black: '#0A0A0A',
          dark: '#1A1A1A',
          card: '#222222',
          border: '#2E2E2E',
          text: '#E6E6E6',
          muted: '#A3A3A3'
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
