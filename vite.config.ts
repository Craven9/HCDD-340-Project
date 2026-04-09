import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // Auto-open browser
    cors: true,
    // Fallback ports if main port is busy
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // Enable source maps for debugging
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})