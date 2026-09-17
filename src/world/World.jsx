import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sound } from '../audio/engine'
import { rooms } from '../data/content'
import Atmosphere from './Atmosphere'
import CameraRig from './CameraRig'
import { Garden, Island } from './Garden'
import Room from './Room'
import { clock, INTRO } from './timeline'

// Advances the intro against wall-clock time so it stays in step with the
// music, and announces dawn and the end of the intro exactly once.
function Director({ onIntroEnd }) {
  const fired = useRef({ dawn: false, end: false })
  useFrame(() => {
    if (!clock.started) return
    clock.t = (performance.now() - clock.startedAt) / 1000
    const t = clock.skipped ? INTRO.end + 1 : clock.t
    if (!fired.current.dawn && t >= INTRO.dawnStart) {
      fired.current.dawn = true
      sound.startAmbience()
    }
    if (!fired.current.end && t >= INTRO.end) {
      fired.current.end = true
      onIntroEnd()
    }
  })
  return null
}

export default function World({ phase, active, hovered, onHover, onSelect, onReady, onIntroEnd, onInteract, reducedMotion }) {
  const lowPower = typeof window !== 'undefined' && (window.innerWidth < 700 || navigator.hardwareConcurrency <= 4)
  const interactive = phase === 'estate'

  return (
    <Canvas
      className="world"
      shadows
      dpr={[1, lowPower ? 1.5 : 2]}
      camera={{ fov: 38, near: 0.5, far: 400, position: [0, 8, 20] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        // Give the first frames a moment to compile before the overture starts.
        setTimeout(onReady, 400)
      }}
      onPointerMissed={() => onHover(null)}
    >
      <Director onIntroEnd={onIntroEnd} />
      <CameraRig phase={phase} active={active} onInteract={onInteract} reducedMotion={reducedMotion} />
      <Atmosphere lowPower={lowPower} />
      <Island />
      <Garden />
      {rooms.map((room) => (
        <Room
          key={room.id}
          room={room}
          interactive={interactive}
          hovered={hovered === room.id}
          active={active === room.id}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </Canvas>
  )
}
