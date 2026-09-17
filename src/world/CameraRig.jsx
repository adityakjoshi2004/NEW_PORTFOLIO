import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { sound } from '../audio/engine'
import { rooms } from '../data/content'
import { BUILDINGS } from './buildings'
import { INTRO, introT, smooth } from './timeline'

// Resting view of the estate, and where the intro camera ends up.
const HOME = { az: 0.42, h: 20, r: 33 }
const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const damp = (lambda, dt) => 1 - Math.exp(-lambda * dt)

export const PANEL_BREAKPOINT = 900

export default function CameraRig({ phase, active, onInteract, reducedMotion }) {
  const { camera, gl, size } = useThree()
  const st = useRef({
    orbit: { ...HOME },
    goal: { ...HOME },
    pos: new THREE.Vector3(0, 8, 20),
    look: new THREE.Vector3(),
    wantPos: new THREE.Vector3(),
    wantLook: new THREE.Vector3(),
    offset: { x: 0, y: 0 },
    flying: 0,
    lastInput: 0,
    lastActive: null,
  })
  const live = useRef({ phase, active })
  useEffect(() => {
    live.current = { phase, active }
  }, [phase, active])

  // Pointer drag to wander, wheel or pinch to zoom, arrow keys to turn.
  useEffect(() => {
    const el = gl.domElement
    const pointers = new Map()
    let pinch = 0
    const canOrbit = () => live.current.phase === 'estate' && !live.current.active
    const touched = () => {
      st.current.lastInput = performance.now()
      onInteract()
    }

    const down = (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()]
        pinch = Math.hypot(a.x - b.x, a.y - b.y)
      }
    }
    const move = (e) => {
      const prev = pointers.get(e.pointerId)
      if (!prev || !canOrbit()) return
      const g = st.current.goal
      if (pointers.size === 2) {
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
        const [a, b] = [...pointers.values()]
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        if (pinch) g.r = clamp(g.r * (pinch / dist), 15, 46)
        pinch = dist
      } else {
        const dx = e.clientX - prev.x
        const dy = e.clientY - prev.y
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
        g.az -= dx * 0.006
        g.h = clamp(g.h + dy * 0.05, 4.5, 26)
        sound.setMotion(Math.hypot(dx, dy) / 30)
      }
      touched()
    }
    const up = (e) => {
      pointers.delete(e.pointerId)
      pinch = 0
      sound.setMotion(0)
    }
    const wheel = (e) => {
      if (!canOrbit()) return
      e.preventDefault()
      st.current.goal.r = clamp(st.current.goal.r * (1 + e.deltaY * 0.0012), 15, 46)
      touched()
    }
    const key = (e) => {
      if (!canOrbit() || e.target.closest?.('input, textarea')) return
      if (e.key === 'ArrowLeft') st.current.goal.az += 0.25
      else if (e.key === 'ArrowRight') st.current.goal.az -= 0.25
      else return
      touched()
    }

    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    el.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('keydown', key)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      el.removeEventListener('wheel', wheel)
      window.removeEventListener('keydown', key)
    }
  }, [gl, onInteract])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1)
    const s = st.current
    const aspect = size.width / size.height
    // Pull the camera back on tall, narrow screens so the estate still fits.
    const fit = clamp(1.3 / aspect, 1, 1.8)
    let lambda = 7

    if (active !== s.lastActive) {
      s.flying = reducedMotion ? 0.4 : 1.8
      s.lastActive = active
    }
    s.flying = Math.max(0, s.flying - dt)

    if (phase !== 'estate') {
      // The intro: a low glide around the map, rising as the estate appears.
      const t = introT()
      const p = smooth(t / INTRO.end)
      const az = HOME.az - 2.4 * (1 - p)
      const h = lerp(6, HOME.h, smooth(t / (INTRO.end - 0.8))) * lerp(1, lerp(1, fit, 0.5), p)
      const r = lerp(17, HOME.r, p) * lerp(1, fit, p)
      s.wantPos.set(Math.sin(az) * r, h, Math.cos(az) * r)
      s.wantLook.set(0, lerp(1.5, 0, p), 0)
      s.orbit = { ...HOME }
      s.goal = { ...HOME }
      lambda = 5
    } else if (active) {
      const room = rooms.find((r) => r.id === active)
      const [dist, height] = BUILDINGS[active].view
      const [x, , z] = room.position
      const len = Math.hypot(x, z)
      const k = lerp(1, fit, 0.75)
      s.wantPos.set(x - (x / len) * dist * k, height * k, z - (z / len) * dist * k)
      s.wantLook.set(x, 2.4, z)
      lambda = 2.6
    } else {
      if (!reducedMotion && performance.now() - s.lastInput > 9000) s.goal.az += dt * 0.025
      const k = damp(6, dt)
      s.orbit.az = lerp(s.orbit.az, s.goal.az, k)
      s.orbit.h = lerp(s.orbit.h, s.goal.h, k)
      s.orbit.r = lerp(s.orbit.r, s.goal.r, k)
      const r = s.orbit.r * fit
      s.wantPos.set(Math.sin(s.orbit.az) * r, s.orbit.h * lerp(1, fit, 0.5), Math.cos(s.orbit.az) * r)
      s.wantLook.set(0, 0, 0)
      lambda = s.flying > 0 ? 2.6 : 9
    }

    const k = damp(lambda, dt)
    s.pos.lerp(s.wantPos, k)
    s.look.lerp(s.wantLook, k)
    camera.position.copy(s.pos)
    camera.lookAt(s.look)

    // Slide the scene aside so the open room isn't hidden behind the panel.
    const wide = size.width >= PANEL_BREAKPOINT
    const panelW = Math.min(600, size.width * 0.46)
    const tx = active && wide ? (panelW + 24) / 2 : 0
    const ty = active && !wide ? size.height * 0.3 : 0
    const ko = damp(4, dt)
    s.offset.x = lerp(s.offset.x, tx, ko)
    s.offset.y = lerp(s.offset.y, ty, ko)
    if (Math.abs(s.offset.x) + Math.abs(s.offset.y) > 0.5) {
      camera.setViewOffset(size.width, size.height, s.offset.x, s.offset.y, size.width, size.height)
    } else if (camera.view?.enabled) {
      camera.clearViewOffset()
    }
  })

  return null
}
