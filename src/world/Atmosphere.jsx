import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { rooms } from '../data/content'
import { mats } from './materials'
import { dawnProgress, introT, INTRO, smooth } from './timeline'

const NIGHT = {
  top: new THREE.Color('#04070a'),
  horizon: new THREE.Color('#1c1812'),
  hemiSky: new THREE.Color('#40506a'),
  hemiGround: new THREE.Color('#15110d'),
  sun: new THREE.Color('#7f93c4'),
  lake: new THREE.Color('#0b1518'),
}
const DAY = {
  top: new THREE.Color('#8fb0bf'),
  horizon: new THREE.Color('#f3dfb6'),
  hemiSky: new THREE.Color('#fff2d6'),
  hemiGround: new THREE.Color('#4f5e3c'),
  sun: new THREE.Color('#ffd9a0'),
  lake: new THREE.Color('#6f97a0'),
}

function Sky({ uniforms }) {
  return (
    <mesh scale={160} renderOrder={-1}>
      <sphereGeometry args={[1, 32, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`uniform vec3 top; uniform vec3 horizon; varying vec3 vDir;
          void main(){
            float h = clamp(vDir.y * 1.6, 0.0, 1.0);
            gl_FragColor = vec4(mix(horizon, top, pow(h, 0.7)), 1.0);
            #include <colorspace_fragment>
          }`}
      />
    </mesh>
  )
}

function Stars({ material }) {
  const geo = useMemo(() => {
    const pts = []
    for (let i = 0; i < 700; i++) {
      const u = Math.random() * Math.PI * 2
      const v = Math.random() * 0.9 + 0.08
      pts.push(Math.cos(u) * Math.sqrt(1 - v * v) * 140, v * 140, Math.sin(u) * Math.sqrt(1 - v * v) * 140)
    }
    return new THREE.Float32BufferAttribute(pts, 3)
  }, [])
  return (
    <points material={material}>
      <bufferGeometry attributes-position={geo} />
    </points>
  )
}

// The surveyor's map the estate rises out of, drawn once on a canvas.
function drawMap(canvas) {
  const S = canvas.width
  const g = canvas.getContext('2d')
  const W = 34
  const px = (x) => ((x + W / 2) / W) * S
  const k = S / W

  const grad = g.createRadialGradient(S / 2, S / 2, S * 0.15, S / 2, S / 2, S * 0.72)
  grad.addColorStop(0, '#eadbb6')
  grad.addColorStop(1, '#a88a5a')
  g.fillStyle = grad
  g.fillRect(0, 0, S, S)
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = `rgba(90,60,30,${Math.random() * 0.08})`
    g.fillRect(Math.random() * S, Math.random() * S, 2, 2)
  }

  const ink = '#3b2a1c'
  g.strokeStyle = ink
  g.fillStyle = ink
  g.lineWidth = 6
  g.strokeRect(40, 40, S - 80, S - 80)
  g.lineWidth = 2
  g.strokeRect(58, 58, S - 116, S - 116)

  // island outline and inner lawn
  g.lineWidth = 4
  g.beginPath()
  g.arc(S / 2, S / 2, 15 * k, 0, Math.PI * 2)
  g.stroke()
  g.setLineDash([6, 10])
  g.lineWidth = 2
  g.beginPath()
  g.arc(S / 2, S / 2, 15.6 * k, 0, Math.PI * 2)
  g.stroke()

  // paths
  g.setLineDash([14, 12])
  g.lineWidth = 3
  rooms.forEach((r) => {
    g.beginPath()
    g.moveTo(S / 2, S / 2)
    g.lineTo(px(r.position[0]), px(r.position[2]))
    g.stroke()
  })
  g.setLineDash([])

  // fountain
  g.beginPath()
  g.arc(S / 2, S / 2, 1.9 * k, 0, Math.PI * 2)
  g.stroke()
  g.beginPath()
  g.arc(S / 2, S / 2, 0.5 * k, 0, Math.PI * 2)
  g.stroke()

  // rooms: hatched footprints + labels
  g.textAlign = 'center'
  rooms.forEach((r) => {
    const x = px(r.position[0])
    const y = px(r.position[2])
    g.save()
    g.translate(x, y)
    g.rotate(-Math.atan2(-r.position[0], -r.position[2]))
    g.lineWidth = 3
    g.strokeRect(-1.6 * k, -1.2 * k, 3.2 * k, 2.4 * k)
    g.lineWidth = 1.5
    for (let i = -3; i <= 3; i++) {
      g.beginPath()
      g.moveTo(i * 0.45 * k - 0.8 * k, -1.2 * k)
      g.lineTo(i * 0.45 * k + 0.8 * k, 1.2 * k)
      g.stroke()
    }
    g.restore()
    g.font = `italic 600 ${0.95 * k}px "Cormorant Garamond", Georgia, serif`
    g.fillText(r.name, x, y + (r.position[2] > 0 ? 2.4 : -1.9) * k)
  })

  // compass rose
  const cx = S - 3.4 * k
  const cy = S - 3.4 * k
  g.lineWidth = 2
  g.beginPath()
  g.arc(cx, cy, 1.5 * k, 0, Math.PI * 2)
  g.stroke()
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const len = (i % 2 ? 1.1 : 2.1) * k
    g.beginPath()
    g.moveTo(cx + Math.cos(a + 0.18) * 0.3 * k, cy + Math.sin(a + 0.18) * 0.3 * k)
    g.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len)
    g.lineTo(cx + Math.cos(a - 0.18) * 0.3 * k, cy + Math.sin(a - 0.18) * 0.3 * k)
    g.fill()
  }
  g.font = `600 ${0.8 * k}px "Cormorant SC", Georgia, serif`
  g.fillText('N', cx, cy - 2.3 * k)

  // cartouche
  g.font = `600 ${1.25 * k}px "Cormorant SC", Georgia, serif`
  g.fillText('The Joshi Estate', S / 2, 2.6 * k)
  g.font = `italic ${0.7 * k}px "Cormorant Garamond", Georgia, serif`
  g.fillText('surveyed in the year MMXXVI', S / 2, 3.5 * k)
}

function MapSheet({ material }) {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 2048
    return c
  }, [])
  const tex = useMemo(() => {
    drawMap(canvas)
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [canvas])

  useEffect(() => {
    material.map = tex
    material.needsUpdate = true
    // Redraw once the serif fonts have arrived.
    Promise.all([
      document.fonts.load('italic 600 40px "Cormorant Garamond"'),
      document.fonts.load('600 40px "Cormorant SC"'),
    ]).then(() => {
      drawMap(canvas)
      tex.needsUpdate = true
    })
  }, [canvas, tex, material])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]} material={material} receiveShadow>
      <planeGeometry args={[34, 34]} />
    </mesh>
  )
}

export default function Atmosphere({ lowPower }) {
  const { scene } = useThree()
  const hemi = useRef()
  const sun = useRef()
  const candle = useRef()
  const lake = useRef()
  const uniforms = useMemo(() => ({ top: { value: NIGHT.top.clone() }, horizon: { value: NIGHT.horizon.clone() } }), [])
  const starMat = useMemo(() => new THREE.PointsMaterial({ color: '#fff4dc', size: 0.7, transparent: true, fog: false, depthWrite: false }), [])
  const mapMat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 1, transparent: true }), [])
  const fog = useMemo(() => new THREE.Fog(NIGHT.horizon.clone(), 40, 150), [])

  useEffect(() => {
    scene.fog = fog
    return () => {
      scene.fog = null
    }
  }, [scene, fog])

  useFrame(({ clock }) => {
    const d = dawnProgress()
    uniforms.top.value.lerpColors(NIGHT.top, DAY.top, d)
    uniforms.horizon.value.lerpColors(NIGHT.horizon, DAY.horizon, d)
    fog.color.copy(uniforms.horizon.value)
    hemi.current.color.lerpColors(NIGHT.hemiSky, DAY.hemiSky, d)
    hemi.current.groundColor.lerpColors(NIGHT.hemiGround, DAY.hemiGround, d)
    hemi.current.intensity = 0.35 + d * 1.1
    sun.current.color.lerpColors(NIGHT.sun, DAY.sun, d)
    sun.current.intensity = 0.25 + d * 2.9
    lake.current.color.lerpColors(NIGHT.lake, DAY.lake, d)
    starMat.opacity = 1 - d

    const t = clock.elapsedTime
    const flicker = 1 + Math.sin(t * 13) * 0.06 + Math.sin(t * 29) * 0.04
    candle.current.intensity = (1 - d) * 140 * flicker
    candle.current.position.set(Math.sin(t * 0.3) * 4, 6.5, 4 + Math.cos(t * 0.23) * 3)

    mats.window.emissiveIntensity = 0.02 + (1 - d) * 2.4
    mats.lamp.emissiveIntensity = 0.4 + (1 - d) * 2.2

    const fade = 1 - smooth((introT() - INTRO.dawnStart - 0.2) / 1.2)
    mapMat.opacity = fade
    mapMat.visible = fade > 0.001
  })

  const shadowSize = lowPower ? 1024 : 2048

  return (
    <>
      <Sky uniforms={uniforms} />
      <Stars material={starMat} />
      <hemisphereLight ref={hemi} />
      <directionalLight
        ref={sun}
        position={[-16, 22, 12]}
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-19}
        shadow-camera-right={19}
        shadow-camera-top={19}
        shadow-camera-bottom={-19}
        shadow-camera-far={70}
      />
      <pointLight ref={candle} color="#ffae55" distance={40} decay={1.6} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
        <circleGeometry args={[150, 64]} />
        <meshStandardMaterial ref={lake} roughness={0.2} metalness={0.3} />
      </mesh>
      <MapSheet material={mapMat} />
    </>
  )
}
