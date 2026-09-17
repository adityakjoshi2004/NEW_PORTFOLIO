import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { sound } from '../audio/engine'
import { person, rooms } from '../data/content'
import { clock, INTRO } from '../world/timeline'
import { ArrowIcon, CloseIcon, DownloadIcon, ScrollIcon, SoundIcon } from './icons'
import { Conservatory, Library, Manor, Post, Study, Trophy } from './Rooms'
import Portrait from './Portrait'
import { resumeLink } from './resume'

const hover = () => sound.hover()

const ROOM_VIEWS = { manor: Manor, library: Library, study: Study, trophy: Trophy, conservatory: Conservatory, post: Post }

// Shown only when the estate's address is opened directly, since the browser
// needs a click before it will play sound.
export function Gate({ onEnter, onBack }) {
  const [leaving, setLeaving] = useState(false)
  const enter = (withSound) => {
    // Audio has to be unlocked inside the click itself.
    sound.unlock()
    sound.setMuted(!withSound)
    sound.click()
    setLeaving(true)
    setTimeout(onEnter, 900)
  }
  return (
    <div className={`gate ${leaving ? 'is-leaving' : ''}`}>
      <div className="gate__inner">
        <Portrait size={84} eager />
        <p className="eyebrow eyebrow--light">The 3D estate of</p>
        <h1 className="gate__title">{person.name}</h1>
        <p className="gate__sub">An explorable portfolio: each building holds a part of my work.</p>
        <div className="gate__buttons">
          <button type="button" className="button button--brass" onClick={() => enter(true)} onPointerEnter={hover} autoFocus>
            Enter with sound
          </button>
          <button type="button" className="button button--ghost" onClick={() => enter(false)}>
            Enter in silence
          </button>
        </div>
        <p className="gate__note">Best with headphones · about fifteen seconds of overture</p>
        <button type="button" className="link-button link-button--light" onClick={onBack}>
          Back to the portfolio
        </button>
      </div>
    </div>
  )
}

export function IntroTitles({ onSkip }) {
  const [current, setCurrent] = useState(null)
  useEffect(() => {
    let raf
    const loop = () => {
      const t = clock.t
      const title = INTRO.titles.find((x) => t >= x.from && t < x.to)
      setCurrent(clock.skipped ? null : (title?.id ?? null))
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="intro" aria-live="polite">
      <div className={`intro__card ${current === 'name' ? 'is-on' : ''}`}>
        <p className="intro__name">{person.name}</p>
        <p className="intro__small">{person.title}</p>
      </div>
      <div className={`intro__card ${current === 'words' ? 'is-on' : ''}`}>
        <p className="intro__words">“{person.words}”</p>
        <p className="intro__small">the words of the house</p>
      </div>
      <button type="button" className="skip" onClick={onSkip} onPointerEnter={hover}>
        Skip the overture <ArrowIcon />
      </button>
    </div>
  )
}

function useMuted() {
  return useSyncExternalStore(
    (fn) => sound.subscribe(fn),
    () => sound.muted,
  )
}

export function Hud({ active, onSelect, onHome, onPortfolio, showHint }) {
  const muted = useMuted()
  return (
    <>
      <header className="hud-top">
        <button type="button" className="crest" onClick={onHome} onPointerEnter={hover} aria-label="Return to the estate overview">
          <Portrait size={30} />
          <span className="crest__name">Welcome</span>
        </button>
        <div className="hud-controls">
          <button
            type="button"
            className="icon-button"
            aria-pressed={!muted}
            aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
            title={muted ? 'Sound off' : 'Sound on'}
            onPointerEnter={hover}
            onClick={() => {
              sound.unlock()
              sound.setMuted(!muted)
              if (muted) sound.click()
            }}
          >
            <SoundIcon on={!muted} />
          </button>
          <button type="button" className="icon-button icon-button--label" onClick={onPortfolio} onPointerEnter={hover}>
            <ScrollIcon />
            <span>Portfolio</span>
          </button>
        </div>
      </header>

      <p className={`hint ${showHint && !active ? 'is-on' : ''}`} aria-hidden="true">
        Drag to wander<span className="hint__wide"> · Scroll to draw near</span> · Choose a building
      </p>

      <nav className={`directory-nav ${active ? 'is-docked' : ''}`} aria-label="Estate directory">
        {rooms.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`directory-nav__item ${active === r.id ? 'is-active' : ''}`}
            aria-current={active === r.id ? 'page' : undefined}
            onPointerEnter={hover}
            onClick={() => onSelect(r.id)}
          >
            <span className="directory-nav__purpose">{r.purpose}</span>
            <span className="directory-nav__name">{r.name}</span>
          </button>
        ))}
        <a
          className="directory-nav__item directory-nav__resume"
          {...resumeLink}
          onPointerEnter={hover}
        >
          <span className="directory-nav__purpose">
            <DownloadIcon /> PDF
          </span>
          <span className="directory-nav__name">Download Resume</span>
        </a>
      </nav>
    </>
  )
}

export function Tooltip({ roomId }) {
  const ref = useRef()
  useEffect(() => {
    const move = (e) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 14}px)`
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])
  const room = rooms.find((r) => r.id === roomId)
  return (
    <div ref={ref} className={`tooltip ${room ? 'is-on' : ''}`} aria-hidden="true">
      {room && (
        <>
          <span className="tooltip__name">{room.name}</span>
          <span className="tooltip__purpose">{room.purpose}</span>
        </>
      )}
    </div>
  )
}

export function Panel({ active, onClose, onSelect }) {
  // Keep the last room rendered while the panel slides away.
  const [shown, setShown] = useState(active)
  const heading = useRef()
  const scroller = useRef()
  if (active && active !== shown) setShown(active)

  useEffect(() => {
    if (!active) {
      const id = setTimeout(() => setShown(null), 450)
      return () => clearTimeout(id)
    }
    scroller.current?.scrollTo(0, 0)
    const id = setTimeout(() => heading.current?.focus({ preventScroll: true }), 420)
    return () => clearTimeout(id)
  }, [active])

  if (!shown) return null
  const index = rooms.findIndex((r) => r.id === shown)
  const room = rooms[index]
  const prev = rooms[(index + rooms.length - 1) % rooms.length]
  const next = rooms[(index + 1) % rooms.length]
  const View = ROOM_VIEWS[shown]

  return (
    <aside className={`panel ${active ? 'is-open' : ''}`} role="dialog" aria-labelledby="panel-title">
      <div className="panel__paper" ref={scroller}>
        <header className="panel__head">
          <div>
            <p className="eyebrow">{room.purpose}</p>
            <h2 id="panel-title" ref={heading} tabIndex={-1}>
              {room.name}
            </h2>
          </div>
          <button type="button" className="icon-button icon-button--ink" onClick={onClose} onPointerEnter={hover} aria-label="Close and return to the grounds">
            <CloseIcon />
          </button>
        </header>
        <div className="panel__body" key={shown}>
          <View go={onSelect} />
        </div>
        <footer className="panel__foot">
          <button type="button" className="link-button" onClick={() => onSelect(prev.id)} onPointerEnter={hover}>
            <ArrowIcon dir="left" /> {prev.name}
          </button>
          <button type="button" className="link-button" onClick={() => onSelect(next.id)} onPointerEnter={hover}>
            {next.name} <ArrowIcon />
          </button>
        </footer>
      </div>
    </aside>
  )
}
