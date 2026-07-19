// src/main.jsx
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Lenis from 'lenis'
import './index.css'
import App from './App'

// ── Lenis smooth scroll ─────────────────────────────────────────────────────
// Only activate if the user hasn't requested reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis
if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
