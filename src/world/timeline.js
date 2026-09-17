// The intro is choreographed to the music: 84 bpm, one building rising on
// every other drum stroke, dawn breaking on the D major chord.

const beat = 60 / 84

export const INTRO = {
  beat,
  // room id -> the beat it starts rising on
  rise: { post: 4, conservatory: 6, trophy: 8, study: 10, library: 12, manor: 14 },
  riseDuration: 1.3,
  dawnStart: 16 * beat,
  dawnEnd: 20 * beat,
  end: 21 * beat,
  titles: [
    { id: 'name', from: 0.8, to: 6.6 },
    { id: 'words', from: 7.4, to: 13.6 },
  ],
}

// Mutable state shared between React and the render loop. Reading these in
// useFrame avoids re-rendering React sixty times a second.
export const clock = {
  started: false,
  startedAt: 0,
  t: 0, // seconds since the intro began
  skipped: false,
}

export function startIntro({ skip = false } = {}) {
  clock.started = true
  clock.startedAt = performance.now()
  clock.skipped = skip
}

export const clamp01 = (x) => Math.min(1, Math.max(0, x))
export const smooth = (x) => {
  const c = clamp01(x)
  return c * c * (3 - 2 * c)
}
// Overshoots slightly, like stone settling into place.
export const backOut = (x) => {
  const c = clamp01(x)
  const s = 1.4
  return 1 + (s + 1) * Math.pow(c - 1, 3) + s * Math.pow(c - 1, 2)
}

export const introT = () => (clock.skipped ? INTRO.end + 1 : clock.t)
export const riseProgress = (id) => backOut((introT() - INTRO.rise[id] * beat) / INTRO.riseDuration)
export const dawnProgress = () => smooth((introT() - INTRO.dawnStart) / (INTRO.dawnEnd - INTRO.dawnStart))
