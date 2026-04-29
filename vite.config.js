import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Vite by default ignores files starting with `.` in publicDir.
  // Explicitly tell it that the .well-known/ directory IS public —
  // we need apple-app-site-association served verbatim at
  // sidestand.app/.well-known/apple-app-site-association so iOS can
  // verify Universal Links.
  publicDir: 'public',
  server: {
    port: 5173,
    open: true
  },
  build: {
    // Copy hidden files (.well-known/ folder) into the build output.
    // Without this, Vite's default behavior strips dot-prefixed files
    // and Universal Links break.
    assetsInlineLimit: 0,
    copyPublicDir: true
  }
})
