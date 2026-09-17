// A small Web Audio synthesiser. Every sound on the site, from birdsong to
// wax seals to the intro theme, is generated here at runtime, so there are
// no audio files to download and nothing to license.

import { INTRO } from '../world/timeline'

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12)
const NOTE = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 }
// 'A3' -> frequency
const hz = (name) => {
  const m = /^([A-G][#b]?)(-?\d)$/.exec(name)
  return midi(NOTE[m[1]] + (Number(m[2]) + 1) * 12)
}
const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const PREFS_KEY = 'joshi-estate-sound'

function readPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}
  } catch {
    return {}
  }
}

class SoundEngine {
  ctx = null
  muted = false
  listeners = new Set()

  constructor() {
    const prefs = readPrefs()
    this.muted = prefs.muted ?? false
  }

  // ---- lifecycle -----------------------------------------------------------

  // Must be called from a user gesture (browsers block audio until then).
  unlock() {
    if (!this.ctx) this.build()
    if (this.ctx.state === 'suspended') this.ctx.resume()
  }

  build() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    this.ctx = ctx

    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -14
    comp.ratio.value = 3
    comp.connect(ctx.destination)

    this.master = ctx.createGain()
    this.master.gain.value = this.muted ? 0 : 0.9
    this.master.connect(comp)

    this.sfx = this.bus(0.9)
    this.amb = this.bus(0)
    this.music = this.bus(0.8)

    this.reverb = ctx.createConvolver()
    this.reverb.buffer = this.impulse(2.8)
    const wet = ctx.createGain()
    wet.gain.value = 0.55
    this.reverb.connect(wet).connect(this.master)

    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = this.noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) ctx.suspend()
      else ctx.resume()
    })
  }

  bus(level) {
    const g = this.ctx.createGain()
    g.gain.value = level
    g.connect(this.master)
    return g
  }

  impulse(seconds) {
    const { ctx } = this
    const len = ctx.sampleRate * seconds
    const buf = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
    }
    return buf
  }

  // ---- preferences ---------------------------------------------------------

  subscribe(fn) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  emit() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ muted: this.muted }))
    } catch {
      /* storage unavailable: preferences just won't persist */
    }
    this.listeners.forEach((fn) => fn())
  }

  setMuted(muted) {
    this.muted = muted
    if (this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : 0.9, this.ctx.currentTime, 0.15)
    this.emit()
  }

  get live() {
    return this.ctx && !this.muted
  }

  // ---- primitives ----------------------------------------------------------

  out(bus, pan = 0, send = 0) {
    const { ctx } = this
    const g = ctx.createGain()
    let node = g
    if (pan) {
      const p = ctx.createStereoPanner()
      p.pan.value = pan
      g.connect(p)
      node = p
    }
    node.connect(bus)
    if (send) {
      const s = ctx.createGain()
      s.gain.value = send
      node.connect(s).connect(this.reverb)
    }
    return g
  }

  tone({ type = 'sine', f, f2, t, dur, gain, attack = 0.005, bus = this.sfx, pan = 0, send = 0 }) {
    const { ctx } = this
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.setValueAtTime(f, t)
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur)
    const g = this.out(bus, pan, send)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g)
    o.start(t)
    o.stop(t + dur + 0.05)
  }

  hiss({ t, dur, gain, type = 'bandpass', f, f2, q = 1, attack = 0.005, bus = this.sfx, pan = 0, send = 0 }) {
    const { ctx } = this
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    src.playbackRate.value = rand(0.9, 1.1)
    const filt = ctx.createBiquadFilter()
    filt.type = type
    filt.Q.value = q
    filt.frequency.setValueAtTime(f, t)
    if (f2) filt.frequency.exponentialRampToValueAtTime(f2, t + dur)
    const g = this.out(bus, pan, send)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(filt).connect(g)
    src.start(t, Math.random())
    src.stop(t + dur + 0.05)
  }

  // ---- interface sounds ----------------------------------------------------

  hover() {
    if (!this.live) return
    const t = this.ctx.currentTime
    if (t - (this.lastHover || 0) < 0.06) return
    this.lastHover = t
    this.tone({ f: 1320, f2: 1100, t, dur: 0.07, gain: 0.05 })
    this.tone({ type: 'triangle', f: 2640, t, dur: 0.04, gain: 0.012 })
  }

  click() {
    if (!this.live) return
    const t = this.ctx.currentTime
    this.tone({ type: 'triangle', f: 340, f2: 170, t, dur: 0.13, gain: 0.2 })
    this.hiss({ t, dur: 0.035, gain: 0.14, f: 2600 })
  }

  // Paper: a flurry of filtered noise grains rising in pitch.
  pageTurn(grains = 7) {
    if (!this.live) return
    const t = this.ctx.currentTime
    for (let i = 0; i < grains; i++) {
      this.hiss({ t: t + i * 0.045 + rand(0, 0.015), dur: rand(0.05, 0.09), gain: rand(0.05, 0.11), f: 900 + i * 380, q: 0.8, pan: -0.2 + i * 0.06 })
    }
    this.hiss({ t: t + grains * 0.045, dur: 0.12, gain: 0.08, type: 'lowpass', f: 900 })
  }

  close() {
    if (!this.live) return
    const t = this.ctx.currentTime
    for (let i = 0; i < 4; i++) this.hiss({ t: t + i * 0.035, dur: 0.06, gain: 0.07, f: 2800 - i * 500, q: 0.8 })
    this.tone({ type: 'triangle', f: 220, f2: 120, t: t + 0.14, dur: 0.12, gain: 0.12 })
  }

  whoosh() {
    if (!this.live) return
    const { ctx } = this
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const filt = ctx.createBiquadFilter()
    filt.type = 'bandpass'
    filt.Q.value = 0.7
    filt.frequency.setValueAtTime(250, t)
    filt.frequency.exponentialRampToValueAtTime(1300, t + 0.45)
    filt.frequency.exponentialRampToValueAtTime(300, t + 1.1)
    const g = this.out(this.sfx, 0, 0.2)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.45)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.15)
    src.connect(filt).connect(g)
    src.start(t, Math.random())
    src.stop(t + 1.2)
  }

  // Clockwork gear tick with a faint metallic ring.
  tick(at = 0) {
    if (!this.live) return
    const t = this.ctx.currentTime + at
    this.hiss({ t, dur: 0.018, gain: 0.22, type: 'highpass', f: 4200 })
    this.tone({ type: 'square', f: 1900, t, dur: 0.025, gain: 0.025 })
    this.tone({ f: 5100, t, dur: 0.18, gain: 0.012, send: 0.3 })
  }

  // Stone settling into place.
  thud(at = 0) {
    if (!this.live) return
    const t = this.ctx.currentTime + at
    this.tone({ f: 95, f2: 38, t, dur: 0.55, gain: 0.4, send: 0.15 })
    this.hiss({ t, dur: 0.3, gain: 0.2, type: 'lowpass', f: 420 })
  }

  // A brass bell: inharmonic partials, long decay.
  chime(at = 0) {
    if (!this.live) return
    const t = this.ctx.currentTime + at
    ;[1, 2.76, 5.4, 8.93].forEach((p, i) => {
      this.tone({ f: 587 * p, t, dur: 2.6 / (i + 1), gain: 0.09 / (i + 1), send: 0.5 })
    })
  }

  seal() {
    if (!this.live) return
    const t = this.ctx.currentTime
    this.tone({ f: 130, f2: 52, t, dur: 0.32, gain: 0.5 })
    this.hiss({ t, dur: 0.09, gain: 0.3, type: 'lowpass', f: 1100 })
    this.tick(0.16)
  }

  // ---- ambience ------------------------------------------------------------

  loopNoise(type, f, q, level) {
    const { ctx } = this
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    src.loop = true
    const filt = ctx.createBiquadFilter()
    filt.type = type
    filt.frequency.value = f
    filt.Q.value = q
    const g = ctx.createGain()
    g.gain.value = level
    src.connect(filt).connect(g).connect(this.amb)
    src.start()
    return { src, g, filt }
  }

  startAmbience() {
    if (!this.ctx || this.ambience) return
    const { ctx } = this
    const wind = this.loopNoise('lowpass', 360, 0.4, 0.22)
    const fountainHigh = this.loopNoise('bandpass', 2400, 0.5, 0.03)
    const fountainLow = this.loopNoise('lowpass', 650, 0.3, 0.05)
    this.ambience = { wind, fountainHigh, fountainLow, motion: 0 }

    this.amb.gain.setTargetAtTime(0.9, ctx.currentTime, 1.5)

    // Wind gusts drift slowly.
    const gust = () => {
      if (!this.ambience) return
      const now = ctx.currentTime
      const base = 0.14 + Math.random() * 0.16 + this.ambience.motion
      wind.g.gain.setTargetAtTime(base, now, 1.4)
      wind.filt.frequency.setTargetAtTime(260 + Math.random() * 260, now, 1.8)
      fountainHigh.filt.frequency.setTargetAtTime(2100 + Math.random() * 700, now, 0.4)
      this.gustTimer = setTimeout(gust, 1800 + Math.random() * 1800)
    }
    gust()

    const sing = () => {
      if (!this.ambience) return
      if (this.live && !document.hidden) this.bird()
      this.birdTimer = setTimeout(sing, rand(700, 3600))
    }
    this.birdTimer = setTimeout(sing, 600)
  }

  stopAmbience() {
    if (!this.ambience) return
    clearTimeout(this.gustTimer)
    clearTimeout(this.birdTimer)
    const { wind, fountainHigh, fountainLow } = this.ambience
    const t = this.ctx.currentTime
    this.amb.gain.setTargetAtTime(0, t, 0.3)
    ;[wind, fountainHigh, fountainLow].forEach((n) => n.src.stop(t + 1.5))
    this.ambience = null
  }

  // Dragging the camera stirs the wind.
  setMotion(v) {
    if (!this.ambience) return
    const boost = Math.min(v, 1) * 0.25
    this.ambience.motion = boost
    this.ambience.wind.g.gain.setTargetAtTime(0.2 + boost, this.ctx.currentTime, 0.25)
  }

  bird() {
    const t = this.ctx.currentTime + 0.02
    const pan = rand(-0.85, 0.85)
    const bus = this.amb
    const species = pick(['chirp', 'chirp', 'trill', 'whistle', 'whistle', 'pigeon'])

    if (species === 'chirp') {
      const n = Math.floor(rand(2, 6))
      const base = rand(3400, 5200)
      for (let i = 0; i < n; i++) {
        const s = t + i * rand(0.1, 0.15)
        this.tone({ f: base + rand(-200, 300), f2: base - rand(900, 1600), t: s, dur: rand(0.05, 0.08), gain: rand(0.02, 0.05), bus, pan, send: 0.2, attack: 0.004 })
      }
    } else if (species === 'trill') {
      const n = Math.floor(rand(8, 18))
      const base = rand(4200, 6000)
      for (let i = 0; i < n; i++) {
        this.tone({ f: base + (i % 2 ? 350 : -150), f2: base - 500, t: t + i * 0.042, dur: 0.03, gain: 0.018, bus, pan, send: 0.15, attack: 0.003 })
      }
    } else if (species === 'whistle') {
      // A blackbird-like phrase of fluting glides.
      let s = t
      const n = Math.floor(rand(2, 5))
      for (let i = 0; i < n; i++) {
        const d = rand(0.1, 0.24)
        const f = rand(1700, 3200)
        this.tone({ f, f2: f * rand(0.75, 1.3), t: s, dur: d, gain: rand(0.018, 0.035), bus, pan, send: 0.35, attack: 0.02 })
        s += d + rand(0.03, 0.09)
      }
    } else {
      // A distant wood pigeon: "coo-COO-coo, coo-coo".
      const f = rand(480, 560)
      const pattern = [0.22, 0.38, 0.22, 0.3, 0.26]
      let s = t
      pattern.forEach((d, i) => {
        this.tone({ f: f * (i === 1 ? 1.06 : 1), f2: f * 0.94, t: s, dur: d, gain: i === 1 ? 0.03 : 0.02, bus, pan: pan * 0.5, send: 0.4, attack: 0.05 })
        s += d + (i === 2 ? 0.35 : 0.08)
      })
    }
  }

  // ---- music ---------------------------------------------------------------

  // A soft, warm chord: rounded sine and triangle tones swelling in and out,
  // with no vibrato or reedy edge.
  pad(notes, t, dur, gain, bus = this.music) {
    const { ctx } = this
    notes.forEach((n) => {
      const f = hz(n)
      const g = this.out(bus, 0, 0.5)
      const filt = ctx.createBiquadFilter()
      filt.type = 'lowpass'
      filt.frequency.value = 520
      filt.connect(g)
      ;[
        ['sine', f, 1],
        ['triangle', f * 1.003, 0.35],
      ].forEach(([type, freq, level]) => {
        const o = ctx.createOscillator()
        o.type = type
        o.frequency.value = freq
        const lg = ctx.createGain()
        lg.gain.value = level
        o.connect(lg).connect(filt)
        o.start(t)
        o.stop(t + dur + 1)
      })
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.9, dur / 3))
      g.gain.setValueAtTime(gain, t + dur - 0.1)
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.9)
    })
  }

  timpani(t, gain = 0.6, f = 70, bus = this.music) {
    this.tone({ f, f2: f * 0.62, t, dur: 1.1, gain, bus, send: 0.35 })
    this.hiss({ t, dur: 0.28, gain: gain * 0.45, type: 'lowpass', f: 190, bus, send: 0.2 })
  }

  // An original processional of drums and soft chords in D minor that
  // resolves to D major at dawn.
  // It is timed to the intro so each building rises on a drum stroke.
  playIntroTheme() {
    if (!this.ctx) return
    const beat = INTRO.beat
    const t0 = this.ctx.currentTime + 0.08
    const at = (b) => t0 + b * beat
    // The theme gets its own gain so skipping the intro can silence it.
    const bus = this.ctx.createGain()
    bus.connect(this.music)
    this.theme = bus
    this.music.gain.cancelScheduledValues(t0)
    this.music.gain.setValueAtTime(0.8, t0)

    const chords = [
      [0, ['D2', 'A2', 'F3'], 0.035],
      [4, ['F2', 'C3', 'A3'], 0.04],
      [8, ['Bb1', 'F2', 'D3'], 0.045],
      [12, ['A1', 'E2', 'C#3'], 0.05],
      [16, ['D2', 'A2', 'D3', 'F#3'], 0.06],
    ]
    chords.forEach(([b, notes, g]) => this.pad(notes, at(b), 4 * beat, g * 2.2, bus))

    for (let b = 0; b < 16; b += 2) this.timpani(at(b), 0.35 + b * 0.02, b % 4 ? 62 : 70, bus)
    ;[14.5, 15, 15.25, 15.5, 15.75].forEach((b, i) => this.timpani(at(b), 0.25 + i * 0.07, 62, bus))
    this.timpani(at(16), 0.85, 73, bus)
    this.chime(at(16) - this.ctx.currentTime)
  }

  stopIntroTheme() {
    if (!this.theme) return
    this.theme.gain.setTargetAtTime(0, this.ctx.currentTime, 0.12)
    this.theme = null
  }
}

export const sound = new SoundEngine()
