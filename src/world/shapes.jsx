import { useMemo } from 'react'
import * as THREE from 'three'

// Tiny building blocks. Positions are given by the *base* of the shape,
// which makes stacking storeys, cornices and roofs much easier to read.

export function Box({ s, p = [0, 0, 0], m, r }) {
  return (
    <mesh position={[p[0], p[1] + s[1] / 2, p[2]]} rotation={r} material={m}>
      <boxGeometry args={s} />
    </mesh>
  )
}

export function Cyl({ r, rt = r, h, p = [0, 0, 0], m, seg = 20 }) {
  return (
    <mesh position={[p[0], p[1] + h / 2, p[2]]} material={m}>
      <cylinderGeometry args={[rt, r, h, seg]} />
    </mesh>
  )
}

export function Ball({ r, p, m, seg = 16 }) {
  return (
    <mesh position={p} material={m}>
      <sphereGeometry args={[r, seg, Math.ceil(seg / 1.5)]} />
    </mesh>
  )
}

export function Dome({ r, p, m, seg = 24 }) {
  return (
    <mesh position={p} material={m}>
      <sphereGeometry args={[r, seg, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
    </mesh>
  )
}

// A hipped roof: a four-sided pyramid stretched over a rectangle.
export function HipRoof({ w, d, h, p, m }) {
  return (
    <mesh position={[p[0], p[1] + h / 2, p[2]]} material={m}>
      <HipGeometry w={w} d={d} h={h} />
    </mesh>
  )
}

function HipGeometry({ w, d, h }) {
  const geo = useMemo(() => {
    // A 4-segment cone has its corners on the axes; turn them onto the
    // diagonals, then stretch to the footprint.
    const g = new THREE.ConeGeometry(Math.SQRT1_2, h, 4, 1)
    g.rotateY(Math.PI / 4)
    g.scale(w, 1, d)
    g.computeVertexNormals()
    return g
  }, [w, d, h])
  return <primitive object={geo} attach="geometry" />
}

// A triangular prism: pediments and pitched roofs. Ridge runs along x.
export function Gable({ w, h, d, p, m, ridgeAlongZ = false }) {
  const geo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-w / 2, 0)
    shape.lineTo(w / 2, 0)
    shape.lineTo(0, h)
    shape.closePath()
    const g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false })
    g.translate(0, 0, -d / 2)
    return g
  }, [w, h, d])
  return <mesh position={p} rotation={ridgeAlongZ ? [0, 0, 0] : [0, Math.PI / 2, 0]} geometry={geo} material={m} />
}

// A row of repeated children, e.g. columns or windows.
export function Row({ xs, children }) {
  return xs.map((x) => (
    <group key={x} position={[x, 0, 0]}>
      {children}
    </group>
  ))
}
