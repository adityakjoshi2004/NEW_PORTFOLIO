import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { rooms } from '../data/content'
import { mats } from './materials'
import { Ball, Box, Cyl } from './shapes'
import { backOut, dawnProgress, introT, INTRO } from './timeline'

export const ISLAND_RADIUS = 15

// Deterministic randomness so the estate looks the same on every visit.
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function stripedLawn() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')
  const bands = 18
  for (let i = 0; i < bands; i++) {
    g.fillStyle = i % 2 ? '#7c9a58' : '#89a763'
    g.fillRect((i * 512) / bands, 0, 512 / bands + 1, 512)
  }
  const rnd = seeded(7)
  for (let i = 0; i < 4000; i++) {
    g.fillStyle = `rgba(40,60,20,${rnd() * 0.12})`
    g.fillRect(rnd() * 512, rnd() * 512, 2, 2)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

export function Island() {
  const lawn = useMemo(() => stripedLawn(), [])
  const cliff = useMemo(() => {
    const g = new THREE.ConeGeometry(ISLAND_RADIUS + 0.2, 6, 14, 3, true)
    g.rotateX(Math.PI)
    g.translate(0, -3.9, 0)
    const pos = g.attributes.position
    const rnd = seeded(3)
    for (let i = 0; i < pos.count; i++) {
      if (pos.getY(i) < -1.2) {
        pos.setX(i, pos.getX(i) * (0.9 + rnd() * 0.2))
        pos.setZ(i, pos.getZ(i) * (0.9 + rnd() * 0.2))
      }
    }
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[ISLAND_RADIUS, 72]} />
        <meshStandardMaterial map={lawn} roughness={1} />
      </mesh>
      {/* a dressed-stone retaining wall around the lawn */}
      <mesh position={[0, -0.45, 0]} material={mats.stoneDark} receiveShadow>
        <cylinderGeometry args={[ISLAND_RADIUS + 0.2, ISLAND_RADIUS + 0.2, 1.0, 72, 1, true]} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.stone}>
        <ringGeometry args={[ISLAND_RADIUS - 0.05, ISLAND_RADIUS + 0.35, 72]} />
      </mesh>
      <mesh geometry={cliff}>
        <meshStandardMaterial color="#6d5b46" roughness={1} flatShading />
      </mesh>
    </group>
  )
}

function Paths() {
  return (
    <group>
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.gravel} receiveShadow>
        <circleGeometry args={[3.5, 48]} />
      </mesh>
      {rooms.map((room) => {
        const [x, , z] = room.position
        const dist = Math.hypot(x, z)
        const from = 3.2
        const to = room.id === 'post' ? ISLAND_RADIUS - 0.1 : dist - 1.4
        const len = to - from
        const mid = from + len / 2
        const angle = Math.atan2(x, z)
        const hedgeFrom = 4.3
        const hedgeTo = dist - (room.id === 'post' ? 2.0 : 3.1)
        return (
          <group key={room.id} rotation={[0, angle, 0]}>
            <mesh position={[0, 0.012, mid]} rotation={[-Math.PI / 2, 0, 0]} material={mats.gravel} receiveShadow>
              <planeGeometry args={[1.3, len]} />
            </mesh>
            {[-1.05, 1.05].map((side) => (
              <Box key={side} s={[0.38, 0.45, hedgeTo - hedgeFrom]} p={[side, 0, (hedgeFrom + hedgeTo) / 2]} m={mats.hedge} />
            ))}
          </group>
        )
      })}
    </group>
  )
}

function Topiary() {
  const cones = useRef()
  const balls = useRef()
  const spots = useMemo(() => {
    const list = []
    rooms.forEach((room) => {
      const [x, , z] = room.position
      const d = Math.hypot(x, z)
      const ux = x / d
      const uz = z / d
      ;[3.9, room.id === 'post' ? d - 1.4 : d - 2.4].forEach((r, i) => {
        ;[-1, 1].forEach((side) => {
          list.push({ x: ux * r + uz * side * 1.05, z: uz * r - ux * side * 1.05, cone: i === 0 })
        })
      })
    })
    return list
  }, [])

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    let c = 0
    let b = 0
    spots.forEach((s) => {
      if (s.cone) {
        m.makeTranslation(s.x, 0.95, s.z)
        cones.current.setMatrixAt(c++, m)
      } else {
        m.makeTranslation(s.x, 0.5, s.z)
        balls.current.setMatrixAt(b++, m)
      }
    })
    cones.current.count = c
    balls.current.count = b
  }, [spots])

  return (
    <>
      <instancedMesh ref={cones} args={[null, mats.hedge, spots.length]} castShadow>
        <coneGeometry args={[0.42, 1.5, 8]} />
      </instancedMesh>
      <instancedMesh ref={balls} args={[null, mats.hedge, spots.length]} castShadow>
        <icosahedronGeometry args={[0.45, 1]} />
      </instancedMesh>
    </>
  )
}

// A lumpy, hand-sculpted crown: a subdivided sphere pushed in and out by a
// little noise, with a flattened underside like a real canopy. The noise is
// a function of position, so shared vertices move together and never crack.
function crownGeometry(seed) {
  const g = new THREE.IcosahedronGeometry(1, 2)
  const pos = g.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const n = Math.sin(v.x * 3.1 + seed) * Math.sin(v.y * 2.7 + seed * 1.3) * Math.sin(v.z * 3.3 + seed * 0.7)
    v.multiplyScalar(1 + n * 0.22)
    if (v.y < -0.35) v.y = -0.35 + (v.y + 0.35) * 0.4
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()
  return g
}

// Foliage that sways in the wind and is shaded darker underneath, lighter
// where the sun catches the top.
function foliageMaterial(time) {
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.85, flatShading: true })
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = time
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform float uTime;\nvarying float vShade;',
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vec2 seat = vec2(0.0);
        #ifdef USE_INSTANCING
          seat = instanceMatrix[3].xz;
        #endif
        float lift = position.y + 1.0;
        float sway = sin(uTime * 1.1 + seat.x * 0.35 + seat.y * 0.27) * 0.045 + sin(uTime * 2.3 + seat.x) * 0.015;
        transformed.x += sway * lift;
        transformed.z += sway * 0.6 * lift;
        vShade = clamp(position.y * 0.5 + 0.5, 0.0, 1.0);`,
      )
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vShade;')
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= mix(0.58, 1.06, vShade);')
  }
  return mat
}

function Trees() {
  const trunks = useRef()
  const oaks = useRef()
  const poplars = useRef()
  const firs = useRef()
  const time = useMemo(() => ({ value: 0 }), [])
  const res = useMemo(
    () => ({
      oakGeo: crownGeometry(1.7),
      poplarGeo: crownGeometry(4.2),
      foliage: foliageMaterial(time),
    }),
    [time],
  )

  const trees = useMemo(() => {
    const rnd = seeded(42)
    const avoid = rooms.map((r) => Math.atan2(r.position[0], r.position[2]))
    const list = []
    for (let i = 0; i < 44; i++) {
      const a = (i / 44) * Math.PI * 2 + rnd() * 0.08
      const near = avoid.some((b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))) < 0.16)
      if (near) continue
      const r = 12.3 + rnd() * 2
      const roll = rnd()
      const kind = roll < 0.55 ? 'oak' : roll < 0.8 ? 'poplar' : 'fir'
      list.push({ kind, x: Math.sin(a) * r, z: Math.cos(a) * r, s: 0.75 + rnd() * 0.5, turn: rnd() * Math.PI * 2, tone: rnd() })
    }
    return list
  }, [])

  const counts = useMemo(
    () => ({
      oak: trees.filter((t) => t.kind === 'oak').length * 4,
      poplar: trees.filter((t) => t.kind === 'poplar').length,
      fir: trees.filter((t) => t.kind === 'fir').length * 3,
    }),
    [trees],
  )

  useLayoutEffect(() => {
    const rnd = seeded(9)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const up = new THREE.Vector3(0, 1, 0)
    const p = new THREE.Vector3()
    const sc = new THREE.Vector3()
    const col = new THREE.Color()
    const n = { oak: 0, poplar: 0, fir: 0 }
    const put = (mesh, kind, pos, scale, turn, color) => {
      q.setFromAxisAngle(up, turn)
      m.compose(pos, q, scale)
      mesh.setMatrixAt(n[kind], m)
      mesh.setColorAt(n[kind], color)
      n[kind]++
    }

    trees.forEach((t, i) => {
      const s = t.s
      // trunks stand on the lawn: the 1.9-tall cylinder is lifted by half its height
      const girth = s * (t.kind === 'oak' ? 1.2 : 0.9)
      const height = s * (t.kind === 'poplar' ? 0.8 : 1)
      q.identity()
      m.compose(p.set(t.x, 0.95 * height, t.z), q, sc.set(girth, height, girth))
      trunks.current.setMatrixAt(i, m)

      if (t.kind === 'oak') {
        const base = col.setHSL(0.23 + t.tone * 0.06, 0.4 + t.tone * 0.1, 0.29 + t.tone * 0.08).clone()
        put(oaks.current, 'oak', p.set(t.x, 2.3 * s, t.z), sc.set(1.25 * s, 1.05 * s, 1.25 * s), t.turn, base)
        for (let k = 0; k < 3; k++) {
          const a = t.turn + k * 2.1 + rnd() * 0.5
          const shade = base.clone().offsetHSL((rnd() - 0.5) * 0.03, 0, (rnd() - 0.5) * 0.06)
          put(
            oaks.current,
            'oak',
            p.set(t.x + Math.sin(a) * 0.8 * s, (1.85 + rnd() * 0.55) * s, t.z + Math.cos(a) * 0.8 * s),
            sc.setScalar((0.72 + rnd() * 0.18) * s),
            rnd() * 6,
            shade,
          )
        }
      } else if (t.kind === 'poplar') {
        col.setHSL(0.2 + t.tone * 0.04, 0.45, 0.35 + t.tone * 0.07)
        put(poplars.current, 'poplar', p.set(t.x, 2.25 * s, t.z), sc.set(0.62 * s, 2.0 * s, 0.62 * s), t.turn, col)
      } else {
        col.setHSL(0.37 + t.tone * 0.04, 0.3, 0.2 + t.tone * 0.05)
        ;[
          [1.35, 1.05],
          [2.15, 0.8],
          [2.9, 0.55],
        ].forEach(([y, r]) => put(firs.current, 'fir', p.set(t.x, y * s, t.z), sc.set(r * s, 1.1 * s, r * s), t.turn, col))
      }
    })

    ;[trunks, oaks, poplars, firs].forEach((ref) => {
      ref.current.instanceMatrix.needsUpdate = true
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
    })
  }, [trees])

  useFrame(({ clock }) => {
    time.value = clock.elapsedTime
  })

  return (
    <>
      <instancedMesh ref={trunks} args={[null, mats.bark, trees.length]} castShadow>
        <cylinderGeometry args={[0.1, 0.17, 1.9, 7]} />
      </instancedMesh>
      <instancedMesh ref={oaks} args={[res.oakGeo, res.foliage, counts.oak]} castShadow receiveShadow />
      <instancedMesh ref={poplars} args={[res.poplarGeo, res.foliage, counts.poplar]} castShadow receiveShadow />
      <instancedMesh ref={firs} args={[null, res.foliage, counts.fir]} castShadow receiveShadow>
        <coneGeometry args={[1, 1.5, 9]} />
      </instancedMesh>
    </>
  )
}

function Fountain() {
  const jet = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    jet.current.scale.set(1 + Math.sin(t * 9) * 0.06, 1 + Math.sin(t * 5.3) * 0.08, 1 + Math.cos(t * 8) * 0.06)
  })
  return (
    <group>
      <Cyl r={1.9} h={0.5} m={mats.stone} seg={32} />
      <Cyl r={2.05} h={0.12} p={[0, 0.5, 0]} m={mats.trim} seg={32} />
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.water}>
        <circleGeometry args={[1.78, 32]} />
      </mesh>
      <Cyl r={0.22} rt={0.16} h={1.35} m={mats.stone} seg={12} />
      <Cyl r={0.2} rt={0.85} h={0.3} p={[0, 1.35, 0]} m={mats.stone} seg={24} />
      <mesh position={[0, 1.62, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.water}>
        <circleGeometry args={[0.78, 24]} />
      </mesh>
      <mesh position={[0, 1.05, 0]} material={mats.spray}>
        <cylinderGeometry args={[0.84, 1.15, 0.9, 24, 1, true]} />
      </mesh>
      <Ball r={0.16} p={[0, 1.72, 0]} m={mats.brass} seg={10} />
      <mesh ref={jet} position={[0, 2.15, 0]} material={mats.spray}>
        <coneGeometry args={[0.16, 0.9, 10, 1, true]} />
      </mesh>
    </group>
  )
}

function Lamps() {
  return [0.785, 2.356, 3.927, 5.498].map((a) => (
    <group key={a} position={[Math.sin(a) * 3.3, 0, Math.cos(a) * 3.3]}>
      <Cyl r={0.05} h={1.7} m={mats.iron} seg={6} />
      <Ball r={0.15} p={[0, 1.82, 0]} m={mats.lamp} seg={10} />
    </group>
  ))
}

// A few rooks wheeling over the estate once the sun is up.
function Birds() {
  const group = useRef()
  const birds = useMemo(() => {
    const rnd = seeded(11)
    return Array.from({ length: 8 }, () => ({
      r: 10 + rnd() * 14,
      h: 9 + rnd() * 6,
      speed: (0.08 + rnd() * 0.08) * (rnd() > 0.3 ? 1 : -1),
      phase: rnd() * Math.PI * 2,
      flap: 7 + rnd() * 4,
    }))
  }, [])
  const wing = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, -0.12, 0, 0, 0.12, 0.55, 0, 0], 3))
    g.computeVertexNormals()
    return g
  }, [])
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#2a2622', side: THREE.DoubleSide }), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const show = dawnProgress()
    group.current.visible = show > 0.5
    group.current.children.forEach((b, i) => {
      const d = birds[i]
      const a = t * d.speed + d.phase
      b.position.set(Math.sin(a) * d.r, d.h + Math.sin(t * 0.7 + d.phase) * 0.8, Math.cos(a) * d.r)
      b.rotation.y = a + (d.speed > 0 ? Math.PI / 2 : -Math.PI / 2)
      const f = Math.sin(t * d.flap + d.phase) * 0.7
      b.children[0].rotation.z = f
      b.children[1].rotation.z = -f
    })
  })

  return (
    <group ref={group}>
      {birds.map((_, i) => (
        <group key={i} scale={0.9}>
          <mesh geometry={wing} material={mat} />
          <mesh geometry={wing} material={mat} scale={[-1, 1, 1]} />
        </group>
      ))}
    </group>
  )
}

function Clouds() {
  const group = useRef()
  const clouds = useMemo(() => {
    const rnd = seeded(5)
    return Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2 + rnd()
      const r = 48 + rnd() * 22
      return {
        p: [Math.sin(a) * r, 6 + rnd() * 16, Math.cos(a) * r],
        puffs: Array.from({ length: 4 }, (_, j) => [j * 2.4 - 3.6 + rnd(), rnd() * 1.2, rnd() * 2, 2 + rnd() * 1.8]),
      }
    })
  }, [])
  useFrame((_, dt) => {
    group.current.rotation.y += dt * 0.004
  })
  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <group key={i} position={c.p}>
          {c.puffs.map(([x, y, z, r], j) => (
            <mesh key={j} position={[x, y, z]}>
              <icosahedronGeometry args={[r, 1]} />
              <meshStandardMaterial color="#fbf5ea" roughness={1} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// The garden grows out of the lawn as dawn breaks at the end of the intro.
export function Garden() {
  const group = useRef()
  useFrame(() => {
    const g = backOut((introT() - INTRO.dawnStart + 0.3) / 1.6)
    group.current.position.y = (g - 1) * 2.2
    group.current.visible = g > 0.001
  })
  return (
    <>
      <group ref={group}>
        <Paths />
        <Topiary />
        <Trees />
        <Fountain />
        <Lamps />
      </group>
      <Birds />
      <Clouds />
    </>
  )
}
