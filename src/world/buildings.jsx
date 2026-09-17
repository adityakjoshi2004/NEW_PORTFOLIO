import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mats } from './materials'
import { Ball, Box, Cyl, Dome, Gable, HipRoof, Row } from './shapes'

// Every building is modelled facing local +z, which Room turns toward the
// fountain at the centre of the estate.

function Window({ w = 0.5, h = 0.85, y, z, lintel = true }) {
  return (
    <>
      <Box s={[w, h, 0.08]} p={[0, y, z]} m={mats.window} />
      {lintel && <Box s={[w + 0.16, 0.1, 0.12]} p={[0, y + h, z]} m={mats.trim} />}
    </>
  )
}

function Flag({ p }) {
  const ref = useRef()
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.1, 0.66, 12, 1)
    g.translate(0.55, 0, 0)
    return g
  }, [])
  const base = useMemo(() => geo.attributes.position.array.slice(), [geo])
  useFrame(({ clock }) => {
    const pos = geo.attributes.position
    const t = clock.elapsedTime
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3]
      pos.array[i * 3 + 2] = Math.sin(x * 4.5 - t * 4.2) * 0.09 * x
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })
  return (
    <group position={p}>
      <Cyl r={0.035} h={2} p={[0, -1.3, 0]} m={mats.iron} seg={6} />
      <Ball r={0.07} p={[0, 0.72, 0]} m={mats.brass} seg={8} />
      <mesh ref={ref} geometry={geo} material={mats.flag} position={[0.04, 0.3, 0]} />
    </group>
  )
}

export function Manor() {
  return (
    <group>
      <Box s={[7.4, 0.35, 3.8]} m={mats.stoneDark} />
      <Box s={[7, 3.4, 3.4]} p={[0, 0.35, 0]} m={mats.brick} />
      <Box s={[7.3, 0.22, 3.7]} p={[0, 3.75, 0]} m={mats.trim} />
      <HipRoof w={7.1} d={3.5} h={1.5} p={[0, 3.97, 0]} m={mats.slate} />
      {[-2.5, 2.5].map((x) => (
        <group key={x}>
          <Box s={[0.45, 1.5, 0.5]} p={[x, 4.1, 0]} m={mats.brick} />
          <Box s={[0.55, 0.1, 0.6]} p={[x, 5.6, 0]} m={mats.trim} />
        </group>
      ))}
      {/* stone quoins */}
      {[-3.45, 3.45].map((x) => (
        <Box key={x} s={[0.2, 3.4, 0.2]} p={[x, 0.35, 1.65]} m={mats.stone} />
      ))}
      <Box s={[7.05, 0.12, 0.1]} p={[0, 2.12, 1.72]} m={mats.stone} />
      <Row xs={[-2.8, -2, 2, 2.8]}>
        <Window y={0.95} z={1.72} />
        <Window y={2.45} z={1.72} />
      </Row>
      <Row xs={[-0.9, 0, 0.9]}>
        <Window w={0.42} h={0.7} y={2.55} z={1.72} lintel={false} />
      </Row>
      {/* portico */}
      <Box s={[3, 0.18, 1.3]} p={[0, 0, 2.3]} m={mats.stoneDark} />
      <Box s={[2.8, 0.18, 1.1]} p={[0, 0.18, 2.2]} m={mats.stone} />
      <Row xs={[-1.1, -0.37, 0.37, 1.1]}>
        <Cyl r={0.14} rt={0.12} h={2.6} p={[0, 0.36, 2.5]} m={mats.trim} seg={12} />
      </Row>
      <Box s={[2.8, 0.26, 1.0]} p={[0, 2.96, 2.25]} m={mats.trim} />
      <Gable w={3.0} h={0.7} d={0.95} p={[0, 3.22, 2.25]} m={mats.trim} ridgeAlongZ />
      <Box s={[0.75, 1.45, 0.08]} p={[0, 0.36, 1.72]} m={mats.green} />
      <Box s={[0.75, 0.16, 0.08]} p={[0, 1.85, 1.72]} m={mats.window} />
      {/* wings */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 4.6, 0, -0.25]}>
          <Box s={[2.2, 0.3, 3.0]} m={mats.stoneDark} />
          <Box s={[2.1, 2.5, 2.8]} p={[0, 0.3, 0]} m={mats.brick} />
          <Box s={[2.25, 0.16, 2.95]} p={[0, 2.8, 0]} m={mats.trim} />
          <HipRoof w={2.1} d={2.8} h={0.9} p={[0, 2.96, 0]} m={mats.slate} />
          <Row xs={[-0.45, 0.45]}>
            <Window y={1.05} z={1.42} w={0.45} h={0.8} />
          </Row>
        </group>
      ))}
      <Flag p={[0, 6.35, 0]} />
    </group>
  )
}

export function Library() {
  return (
    <group>
      <Box s={[5.9, 0.3, 3.6]} m={mats.stoneDark} />
      <Box s={[5.6, 3.0, 3.3]} p={[0, 0.3, 0]} m={mats.stone} />
      <Box s={[5.85, 0.2, 3.55]} p={[0, 3.3, 0]} m={mats.trim} />
      <Box s={[5.4, 0.08, 3.1]} p={[0, 3.5, 0]} m={mats.slate} />
      {/* balustrade */}
      {[1.72, -1.72].map((z) => (
        <Box key={z} s={[5.85, 0.36, 0.12]} p={[0, 3.5, z]} m={mats.stone} />
      ))}
      {[2.87, -2.87].map((x) => (
        <Box key={x} s={[0.12, 0.36, 3.55]} p={[x, 3.5, 0]} m={mats.stone} />
      ))}
      {/* dome */}
      <Cyl r={1.1} h={0.6} p={[0, 3.5, 0]} m={mats.stone} seg={24} />
      <Box s={[2.3, 0.06, 2.3]} p={[0, 4.1, 0]} m={mats.trim} r={[0, Math.PI / 4, 0]} />
      <Dome r={1.1} p={[0, 4.1, 0]} m={mats.copper} />
      <Cyl r={0.22} h={0.45} p={[0, 5.1, 0]} m={mats.trim} seg={10} />
      <Dome r={0.26} p={[0, 5.55, 0]} m={mats.copper} seg={10} />
      <Ball r={0.09} p={[0, 5.9, 0]} m={mats.brass} seg={8} />
      {/* tall arched windows */}
      <Row xs={[-2.15, -1.25, 1.25, 2.15]}>
        <Box s={[0.5, 1.9, 0.08]} p={[0, 0.75, 1.66]} m={mats.window} />
        <mesh position={[0, 2.65, 1.66]} rotation={[-Math.PI / 2, 0, 0]} material={mats.window}>
          <cylinderGeometry args={[0.25, 0.25, 0.08, 12, 1, false, -Math.PI / 2, Math.PI]} />
        </mesh>
      </Row>
      <Box s={[0.9, 1.8, 0.08]} p={[0, 0.3, 1.67]} m={mats.wood} />
      {[-0.66, 0.66].map((x) => (
        <Box key={x} s={[0.2, 2.35, 0.2]} p={[x, 0.3, 1.72]} m={mats.trim} />
      ))}
      <Box s={[1.6, 0.18, 0.28]} p={[0, 2.65, 1.74]} m={mats.trim} />
      <Gable w={1.7} h={0.42} d={0.26} p={[0, 2.83, 1.74]} m={mats.trim} ridgeAlongZ />
    </group>
  )
}

export function Study() {
  return (
    <group>
      <Box s={[3.1, 0.3, 3.1]} m={mats.stoneDark} />
      <Box s={[2.8, 4.2, 2.8]} p={[0, 0.3, 0]} m={mats.brick} />
      <Box s={[2.9, 0.14, 2.9]} p={[0, 2.3, 0]} m={mats.stone} />
      <Box s={[3.0, 0.2, 3.0]} p={[0, 4.5, 0]} m={mats.trim} />
      <HipRoof w={3.0} d={3.0} h={2.1} p={[0, 4.7, 0]} m={mats.slate} />
      <Ball r={0.1} p={[0, 6.85, 0]} m={mats.brass} seg={8} />
      <Box s={[0.4, 1.7, 0.4]} p={[0.8, 4.5, -0.7]} m={mats.brick} />
      {/* bay window */}
      <Box s={[1.5, 1.35, 0.55]} p={[0, 0.3, 1.62]} m={mats.stone} />
      <Box s={[1.2, 0.85, 0.06]} p={[0, 0.55, 1.91]} m={mats.window} />
      <Box s={[1.6, 0.12, 0.65]} p={[0, 1.65, 1.62]} m={mats.slate} />
      <Row xs={[-0.6, 0.6]}>
        <Window w={0.45} h={0.95} y={2.75} z={1.42} />
      </Row>
      {/* wing */}
      <group position={[-2.45, 0, -0.2]}>
        <Box s={[2.2, 0.3, 2.5]} m={mats.stoneDark} />
        <Box s={[2.1, 2.3, 2.3]} p={[0, 0.3, 0]} m={mats.brick} />
        <Gable w={2.5} h={1.0} d={2.25} p={[0, 2.6, 0]} m={mats.slate} />
        <Box s={[0.6, 1.25, 0.08]} p={[0.35, 0.3, 1.17]} m={mats.green} />
        <Window w={0.45} h={0.7} y={1.0} z={1.17} />
      </group>
    </group>
  )
}

export function TrophyHall() {
  const cols = useMemo(() => Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2), [])
  return (
    <group>
      <Cyl r={2.5} h={0.2} m={mats.stoneDark} seg={32} />
      <Cyl r={2.25} h={0.2} p={[0, 0.2, 0]} m={mats.stone} seg={32} />
      <Cyl r={2.0} h={0.2} p={[0, 0.4, 0]} m={mats.stone} seg={32} />
      {cols.map((a) => (
        <Cyl key={a} r={0.13} rt={0.11} h={2.5} p={[Math.sin(a) * 1.72, 0.6, Math.cos(a) * 1.72]} m={mats.trim} seg={10} />
      ))}
      <Cyl r={1.15} h={2.5} p={[0, 0.6, 0]} m={mats.stone} seg={24} />
      <Box s={[0.6, 1.5, 0.12]} p={[0, 0.6, 1.12]} m={mats.wood} />
      <Cyl r={1.98} h={0.32} p={[0, 3.1, 0]} m={mats.trim} seg={32} />
      <Dome r={1.85} p={[0, 3.42, 0]} m={mats.copper} seg={32} />
      <Cyl r={0.07} h={0.4} p={[0, 5.2, 0]} m={mats.brass} seg={8} />
      {/* a gilded trophy cup crowns the dome */}
      <Ball r={0.26} p={[0, 5.78, 0]} m={mats.brass} seg={16} />
      <Cyl r={0.18} rt={0.1} h={0.16} p={[0, 5.98, 0]} m={mats.brass} seg={16} />
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.27, 5.86, 0]} rotation={[0, 0, (s * Math.PI) / 2]} material={mats.brass}>
          <torusGeometry args={[0.1, 0.028, 6, 12, Math.PI]} />
        </mesh>
      ))}
      <Ball r={0.06} p={[0, 6.2, 0]} m={mats.brass} seg={8} />
    </group>
  )
}

export function Conservatory() {
  const xs = [-2.3, -1.15, 0, 1.15, 2.3]
  return (
    <group>
      <Box s={[4.9, 0.45, 3.1]} m={mats.stone} />
      <Box s={[4.6, 2.0, 2.8]} p={[0, 0.45, 0]} m={mats.glass} />
      {xs.map((x) =>
        [1.4, -1.4].map((z) => <Box key={`${x}${z}`} s={[0.08, 2.0, 0.08]} p={[x, 0.45, z]} m={mats.trim} />),
      )}
      {[1.4, -1.4].map((z) => (
        <Box key={z} s={[4.7, 0.1, 0.1]} p={[0, 2.42, z]} m={mats.trim} />
      ))}
      <mesh position={[0, 2.47, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.glass}>
        <cylinderGeometry args={[1.4, 1.4, 4.6, 24, 1, true, 0, Math.PI]} />
      </mesh>
      {xs.map((x) => (
        <mesh key={x} position={[x, 2.47, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.trim}>
          <torusGeometry args={[1.4, 0.04, 6, 20, Math.PI]} />
        </mesh>
      ))}
      <Box s={[4.7, 0.08, 0.08]} p={[0, 3.85, 0]} m={mats.trim} />
      {[-2.35, 2.35].map((x) => (
        <Ball key={x} r={0.1} p={[x, 3.95, 0]} m={mats.brass} seg={8} />
      ))}
      {[-0.42, 0.42].map((x) => (
        <Box key={x} s={[0.07, 1.7, 0.1]} p={[x, 0.45, 1.44]} m={mats.trim} />
      ))}
      <Box s={[0.9, 0.08, 0.1]} p={[0, 2.12, 1.44]} m={mats.trim} />
      {/* the collection inside */}
      <Cyl r={0.06} h={1.2} p={[-1.3, 0.45, -0.2]} m={mats.bark} seg={6} />
      <Ball r={0.6} p={[-1.3, 1.85, -0.2]} m={mats.leaf} seg={8} />
      <Ball r={0.75} p={[1.2, 1.3, -0.3]} m={mats.hedge} seg={8} />
      <mesh position={[0.1, 1.1, 0.4]} material={mats.leaf}>
        <coneGeometry args={[0.45, 1.3, 7]} />
      </mesh>
    </group>
  )
}

export function PostLodge() {
  return (
    <group>
      {/* gate piers with lanterns */}
      {[-1.15, 1.15].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Box s={[0.55, 2.0, 0.55]} m={mats.stone} />
          <Box s={[0.66, 0.12, 0.66]} p={[0, 2.0, 0]} m={mats.trim} />
          <Cyl r={0.05} h={0.25} p={[0, 2.1, 0]} m={mats.iron} seg={6} />
          <Ball r={0.16} p={[0, 2.45, 0]} m={mats.lamp} seg={10} />
        </group>
      ))}
      {/* wrought-iron gates, swung open */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.88, 0.1, 0]} rotation={[0, s * -1.1, 0]}>
          {[0.2, 0.4, 0.6, 0.8].map((x) => (
            <Box key={x} s={[0.04, 1.55, 0.04]} p={[-s * x, 0, 0]} m={mats.iron} />
          ))}
          {[0.25, 1.35].map((y) => (
            <Box key={y} s={[0.8, 0.05, 0.05]} p={[-s * 0.45, y, 0]} m={mats.iron} />
          ))}
        </group>
      ))}
      {/* lodge cottage */}
      <group position={[3.0, 0, -0.5]}>
        <Box s={[2.5, 0.2, 2.1]} m={mats.stoneDark} />
        <Box s={[2.4, 1.8, 2.0]} p={[0, 0.2, 0]} m={mats.brick} />
        <Gable w={2.3} h={1.05} d={2.7} p={[0, 2.0, 0]} m={mats.slate} />
        <Box s={[0.32, 0.9, 0.32]} p={[0.8, 2.3, -0.4]} m={mats.brick} />
        <Window w={0.5} h={0.55} y={0.9} z={1.02} />
        <Box s={[0.55, 1.2, 0.06]} p={[-0.6, 0.2, 1.02]} m={mats.green} />
      </group>
      {/* a red pillar box */}
      <group position={[-2.3, 0, 0.7]}>
        <Cyl r={0.32} h={0.1} m={mats.iron} seg={16} />
        <Cyl r={0.27} h={1.05} p={[0, 0.1, 0]} m={mats.oxblood} seg={16} />
        <Box s={[0.6, 0.08, 0.6]} p={[0, 1.15, 0]} m={mats.oxblood} r={[0, Math.PI / 4, 0]} />
        <Dome r={0.28} p={[0, 1.15, 0]} m={mats.oxblood} seg={16} />
        <Box s={[0.26, 0.04, 0.05]} p={[0, 0.9, 0.27]} m={mats.iron} />
      </group>
    </group>
  )
}

export const BUILDINGS = {
  manor: { Model: Manor, hit: { size: [11.8, 6.5, 5.2], center: [0, 3.2, 0.4] }, view: [23, 10] },
  library: { Model: Library, hit: { size: [6.2, 6, 4.2], center: [0, 3, 0] }, view: [17, 8] },
  study: { Model: Study, hit: { size: [6.4, 7, 4.2], center: [-0.9, 3.5, 0.2] }, view: [17, 9] },
  trophy: { Model: TrophyHall, hit: { size: [5.2, 6, 5.2], center: [0, 3, 0] }, view: [16, 8] },
  conservatory: { Model: Conservatory, hit: { size: [5.2, 4.2, 3.6], center: [0, 2.1, 0] }, view: [14.5, 7] },
  post: { Model: PostLodge, hit: { size: [7.4, 3, 3.2], center: [0.5, 1.5, 0] }, view: [15, 7] },
}
