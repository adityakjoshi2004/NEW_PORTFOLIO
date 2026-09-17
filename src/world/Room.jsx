import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { sound } from '../audio/engine'
import { mats } from './materials'
import { BUILDINGS } from './buildings'
import { clamp01, clock, INTRO, riseProgress } from './timeline'

function gearGeometry(radius, teeth) {
  const parts = [new THREE.TorusGeometry(radius, 0.09, 6, 64)]
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2
    const tooth = new THREE.BoxGeometry(0.3, 0.28, 0.14)
    tooth.translate(radius + 0.16, 0, 0)
    tooth.rotateZ(a)
    parts.push(tooth)
  }
  // a few spokes make it read as clockwork rather than a ring
  for (let i = 0; i < 4; i++) {
    const spoke = new THREE.BoxGeometry(radius * 2, 0.07, 0.07)
    spoke.rotateZ((i / 4) * Math.PI)
    parts.push(spoke)
  }
  const g = mergeGeometries(parts.map((p) => p.toNonIndexed()))
  g.rotateX(-Math.PI / 2)
  return g
}

const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt))

export default function Room({ room, interactive, hovered, active, onHover, onSelect }) {
  const { Model, hit } = BUILDINGS[room.id]
  const [x, , z] = room.position
  const facing = Math.atan2(-x, -z)
  const outer = useRef()
  const lift = useRef()
  const gear = useRef()
  const model = useRef()
  const fx = useRef({ ticked: false, settled: false })

  const radius = Math.max(hit.size[0], hit.size[2]) / 2 + 0.2
  const geo = useMemo(() => gearGeometry(radius, Math.round(radius * 7)), [radius])

  useLayoutEffect(() => {
    model.current.traverse((o) => {
      if (o.isMesh && o.material !== mats.glass) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
  }, [])

  useFrame((_, dt) => {
    const p = riseProgress(room.id)
    outer.current.position.y = (p - 1) * 6
    outer.current.visible = p > 0.002

    const start = INTRO.rise[room.id] * INTRO.beat
    if (clock.started && !clock.skipped) {
      if (!fx.current.ticked && clock.t >= start - 0.15) {
        fx.current.ticked = true
        for (let i = 0; i < 7; i++) sound.tick(i * 0.17)
      }
      if (!fx.current.settled && clock.t >= start + INTRO.riseDuration * 0.6) {
        fx.current.settled = true
        sound.thud()
      }
    }

    const lit = hovered || active
    lift.current.position.y = damp(lift.current.position.y, lit ? 0.35 : 0, 8, dt)

    // The gear turns beneath each building as it rises, and returns as a
    // hover highlight afterwards. It moves in ticks, like a clock.
    const introGear = clamp01((clock.t - start + 0.5) / (INTRO.riseDuration + 1.2))
    const showIntro = !clock.skipped && introGear > 0 && introGear < 1 ? Math.sin(introGear * Math.PI) : 0
    const target = Math.max(showIntro, lit ? 1 : 0)
    const s = damp(gear.current.scale.x, target, 10, dt)
    gear.current.scale.setScalar(Math.max(s, 0.0001))
    gear.current.visible = s > 0.01
    const steps = Math.floor(performance.now() / 170)
    gear.current.rotation.y = damp(gear.current.rotation.y, (steps * Math.PI) / 24, 18, dt)
  })

  return (
    <group position={[x, 0, z]} rotation={[0, facing, 0]}>
      <mesh ref={gear} geometry={geo} material={mats.brass} position={[0, 0.06, 0]} scale={0.0001} />
      <group ref={outer}>
        <group ref={lift}>
          <group ref={model}>
            <Model />
          </group>
          <mesh
            position={hit.center}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (interactive) onHover(room.id)
            }}
            onPointerOut={() => interactive && onHover(null)}
            onClick={(e) => {
              e.stopPropagation()
              if (!interactive || e.delta > 6) return
              onSelect(room.id)
            }}
          >
            <boxGeometry args={hit.size} />
            <meshBasicMaterial visible={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
