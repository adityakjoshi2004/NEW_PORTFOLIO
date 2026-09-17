import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { sound } from './audio/engine'
import { Gate, Hud, IntroTitles, Panel, Tooltip } from './ui/Overlays'
import PlainPage from './ui/PlainPage'
import Welcome from './ui/Welcome'
import { clock, INTRO, startIntro } from './world/timeline'

const loadWorld = () => import('./world/World')
const World = lazy(loadWorld)

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const canRender3D = hasWebGL()

// The site has three screens, kept in the URL hash so the back button works:
//   (none)    the welcome screen
//   #plain    the portfolio page
//   #estate   the 3D estate, opened from the portfolio page
function viewFromHash() {
  const hash = window.location.hash
  if (hash === '#estate') return canRender3D ? 'estate' : 'plain'
  if (hash === '#plain') return 'plain'
  return 'welcome'
}

export default function App() {
  const [view, setView] = useState(viewFromHash)

  useEffect(() => {
    const onHash = () => setView(viewFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Fetch the 3D world quietly while the portfolio is being read, so the
  // estate opens without a wait.
  useEffect(() => {
    if (view !== 'plain' || !canRender3D) return
    const id = setTimeout(loadWorld, 2500)
    return () => clearTimeout(id)
  }, [view])

  const goPortfolio = useCallback(() => {
    window.location.hash = 'plain'
  }, [])

  const goEstate = useCallback(() => {
    // This click is what lets the browser play the intro's sound.
    sound.unlock()
    sound.click()
    window.location.hash = 'estate'
  }, [])

  if (view === 'welcome') return <Welcome onPortfolio={goPortfolio} />
  if (view === 'plain') return <PlainPage onEstate={canRender3D ? goEstate : null} />
  return <Estate onLeave={goPortfolio} />
}

function Estate({ onLeave }) {
  // gate: needs a click first (only when the estate URL is opened directly)
  // loading: waiting for the 3D world · intro: the building overture · estate: exploring
  const [phase, setPhase] = useState(() => (clock.started ? 'estate' : sound.ctx ? 'loading' : 'gate'))
  const [active, setActive] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [explored, setExplored] = useState(false)

  // The overture starts once the visitor has clicked (so sound may play) and
  // the 3D world has rendered, whichever of the two happens last.
  const worldReady = useRef(false)
  const wantsIntro = useRef(phase === 'loading')

  const beginIntro = useCallback(() => {
    if (clock.started) return
    startIntro({ skip: reducedMotion })
    if (!reducedMotion) sound.playIntroTheme()
    setPhase('intro')
  }, [])

  const onReady = useCallback(() => {
    worldReady.current = true
    if (wantsIntro.current) beginIntro()
  }, [beginIntro])

  const enterFromGate = () => {
    wantsIntro.current = true
    if (worldReady.current) beginIntro()
    else setPhase('loading')
  }

  // Leaving the estate silences it; coming back skips the overture.
  useEffect(
    () => () => {
      if (clock.started && clock.t < INTRO.end) clock.skipped = true
      sound.stopIntroTheme()
      sound.stopAmbience()
      document.body.style.cursor = ''
    },
    [],
  )

  const skipIntro = () => {
    clock.skipped = true
    sound.stopIntroTheme()
    sound.click()
  }

  const onIntroEnd = useCallback(() => setPhase('estate'), [])

  // Refs mirror state so sounds fire once per change, outside state updaters.
  const activeRef = useRef(null)
  const hoveredRef = useRef(null)

  const onHover = useCallback((id) => {
    if (id === hoveredRef.current) return
    if (id) sound.hover()
    hoveredRef.current = id
    setHovered(id)
    document.body.style.cursor = id ? 'pointer' : ''
  }, [])

  const select = useCallback((id) => {
    if (activeRef.current === id) return
    activeRef.current = id
    sound.whoosh()
    setTimeout(() => (id === 'trophy' ? sound.chime() : sound.pageTurn()), 380)
    setActive(id)
    hoveredRef.current = null
    setHovered(null)
    setExplored(true)
    document.body.style.cursor = ''
  }, [])

  const close = useCallback(() => {
    if (!activeRef.current) return
    activeRef.current = null
    sound.close()
    setActive(null)
  }, [])

  const onInteract = useCallback(() => setExplored(true), [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  return (
    <main className="stage">
      <Suspense fallback={<div className="world world--loading" />}>
        <World
          phase={phase}
          active={active}
          hovered={hovered}
          onHover={onHover}
          onSelect={select}
          onReady={onReady}
          onIntroEnd={onIntroEnd}
          onInteract={onInteract}
          reducedMotion={reducedMotion}
        />
      </Suspense>
      <div className="vignette" aria-hidden="true" />

      {phase === 'gate' && <Gate onEnter={enterFromGate} onBack={onLeave} />}
      {phase === 'loading' && (
        <p className="estate-loading" role="status">
          Raising the estate…
        </p>
      )}
      {phase === 'intro' && <IntroTitles onSkip={skipIntro} />}
      {phase === 'estate' && (
        <>
          <Hud active={active} onSelect={select} onHome={close} onPortfolio={onLeave} showHint={!explored} />
          <Tooltip roomId={active ? null : hovered} />
        </>
      )}
      <Panel active={active} onClose={close} onSelect={select} />
    </main>
  )
}
