import * as THREE from 'three'

const std = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...opts })

// Shared across every building so the whole estate costs a handful of materials.
export const mats = {
  stone: std('#e8dfca'),
  stoneDark: std('#c9b996'),
  brick: std('#9a5440'),
  slate: std('#4d555c', { roughness: 0.7 }),
  copper: std('#76a292', { roughness: 0.6, metalness: 0.2 }),
  brass: std('#c9a261', { roughness: 0.4, metalness: 0.3 }),
  trim: std('#f4efe3'),
  wood: std('#3b2a20'),
  green: std('#1f3a2e'),
  oxblood: std('#6b1e23'),
  iron: std('#1c1f1e', { roughness: 0.5, metalness: 0.5 }),
  window: std('#1d2731', { roughness: 0.25, metalness: 0.2, emissive: '#ffb45c', emissiveIntensity: 2 }),
  glass: new THREE.MeshStandardMaterial({ color: '#d7ece6', roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.32, depthWrite: false }),
  hedge: std('#3d5a33'),
  leaf: std('#557a41'),
  bark: std('#5b4331'),
  gravel: std('#dcd0b4', { roughness: 1 }),
  water: std('#6f97a0', { roughness: 0.15, metalness: 0.25 }),
  spray: new THREE.MeshStandardMaterial({ color: '#f2fbff', transparent: true, opacity: 0.45, roughness: 0.1, depthWrite: false }),
  lamp: std('#fff1d0', { emissive: '#ffc670', emissiveIntensity: 2 }),
  flag: std('#6b1e23', { side: THREE.DoubleSide }),
}
