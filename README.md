# The Joshi Estate

Portfolio of **Aditya Kumar Joshi**, AI/ML Engineer & Full-Stack Developer, presented as a small English country estate you can explore in 3D.

The site has three screens:

1. **Welcome** (`/`): the name, role, and a glimpse of what has been built.
2. **Portfolio** (`/#plain`): about, selected work, skills & expertise, experience & education, what others say, contact and footer.
3. **The estate** (`/#estate`): opened with "Enter the estate". A candle-lit surveyor's map where each building rises on clockwork gears to an original overture, then dawn breaks and the 3D estate is yours to wander:

| Building | Holds |
|---|---|
| The Manor | About |
| The Library | Projects (bound volumes) and forthcoming writing |
| The Study | Experience (letters of appointment) |
| The Trophy Hall | Smart India Hackathon 2025, education, offices, certificates |
| The Conservatory | Skills, catalogued as a botanical collection |
| The Post Lodge | Contact: a visiting card with email, resume and links |

## Stack

- **Vite + React 19**
- **three.js + @react-three/fiber** for the estate. Everything is modelled from primitives in code, so there are no model files.
- **Web Audio API** for all sound: birdsong, wind, the fountain, the intro theme, and the page, gear, bell and wax-seal effects are synthesised at runtime. There are no audio files and nothing to license.
- **Hand-written CSS** (no framework), set in Cormorant Garamond, Cormorant SC and EB Garamond.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/ (a static site: deploy anywhere, e.g. Vercel)
npm run preview  # serve the production build
```

## Configuration

**Resume.** Every resume button downloads the PDF and also opens it in a new tab. It serves `public/Aditya_Kumar_Joshi_Resume.pdf`. Replace that file to update it.

**Content.** Every word on the site lives in `src/data/content.js`, including testimonials for "What others say" (the section appears once one is added).

**Photo.** `public/aditya_joshi.jpg`, set as `photo` in `src/data/content.js`. If it is missing, a gold monogram is shown.

## Where things live

```
src/
  data/content.js      all portfolio text
  audio/engine.js      the synthesiser: effects, ambience, music
  world/               the 3D estate
    timeline.js        intro choreography (synced to the music)
    buildings.jsx      the six buildings
    Room.jsx           rising, gears, hover and click behaviour
    Garden.jsx         island, lawn, paths, hedges, trees, fountain, birds
    Atmosphere.jsx     sky, night→dawn lighting, the parchment map
    CameraRig.jsx      intro flight, drag/zoom, flying to rooms
  ui/                  welcome screen, portfolio page, estate overlays and panels
  styles/              base, overlays, panel, plain
```



