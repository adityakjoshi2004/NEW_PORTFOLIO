import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The 3D world is lazy-loaded, so three.js arrives in its own chunk while
// the entrance gate is already on screen.
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1100,
  },
})
