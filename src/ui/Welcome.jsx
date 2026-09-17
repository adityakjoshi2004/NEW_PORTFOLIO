import { useEffect, useRef, useState } from 'react'
import { person } from '../data/content'
import Portrait from './Portrait'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const DURATION = reducedMotion ? 700 : 2800
const MAX_WAIT = 6000

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// The landing screen: photo, name, designation and a loader. When the loader
// finishes it opens the portfolio by itself.
export default function Welcome({ onPortfolio }) {
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const finished = useRef(false)

  useEffect(() => {
    let raf = 0
    let timer = 0
    const start = performance.now()

    // Don't hand over until the photo and fonts are in, so the portfolio
    // never appears half-drawn.
    let assetsReady = false
    const photo = new Image()
    photo.src = person.photo
    Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      photo.decode?.().catch(() => {}) ?? Promise.resolve(),
    ]).then(() => {
      assetsReady = true
    })

    const finish = () => {
      if (finished.current) return
      finished.current = true
      setProgress(1)
      setLeaving(true)
      timer = setTimeout(onPortfolio, reducedMotion ? 120 : 600)
    }

    const tick = (now) => {
      const elapsed = now - start
      setProgress(easeInOutCubic(Math.min(1, elapsed / DURATION)))
      if (elapsed >= DURATION && (assetsReady || elapsed >= MAX_WAIT)) finish()
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Impatient visitors can tap or press a key to go straight through.
    window.addEventListener('pointerdown', finish)
    window.addEventListener('keydown', finish)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
      window.removeEventListener('pointerdown', finish)
      window.removeEventListener('keydown', finish)
    }
  }, [onPortfolio])

  const percent = Math.round(progress * 100)

  return (
    <div className={`landing ${leaving ? 'is-leaving' : ''}`}>
      <div className="landing__inner">
        <Portrait variant="round" className="landing__portrait" eager />
        <h1 className="landing__name">{person.name}</h1>
        <p className="landing__role">AI/ML Engineer &amp; Full-Stack Developer</p>

        <div
          className="landing__loader"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading portfolio"
        >
          <div className="landing__track">
            <span className="landing__fill" style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div className="landing__meta">
            <span>Loading portfolio</span>
            <span className="landing__percent">{String(percent).padStart(2, '0')}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
