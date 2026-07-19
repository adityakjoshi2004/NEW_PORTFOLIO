# Aditya Kumar Joshi — Portfolio

A multi-page personal portfolio for **Aditya Kumar Joshi**, a Machine Learning Engineer and Full-Stack Developer (final-year B.Tech CSE student at IES IPS Academy, Indore).

## Stack

| Layer | Tech |
|---|---|
| Build | Vite 5 + React 18 |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 (custom palette — Espresso/Ember/Amber) |
| Animation | Framer Motion + GSAP + ScrollTrigger |
| Scroll | Lenis smooth scroll |
| Icons | lucide-react |
| Fonts | Fraunces · Manrope · JetBrains Mono (Google Fonts) |
| Contact form | Formspree (swap in your endpoint — see below) |

## Pages

| Route | Page |
|---|---|
| `/` | Home — Hero, stat counters, featured projects, CTA |
| `/about` | About — bio, education, certifications, recognition |
| `/experience` | Experience — GSAP scroll-drawn timeline |
| `/projects` | Projects — 4 cards with hover reticle |
| `/skills` | Skills — categorized tags with confidence readout |
| `/contact` | Contact — form + direct links |

## Signature Design Motif

The **detection reticle** — animated SVG corner-brackets styled like a CV model's bounding box — appears in exactly three places:
1. Around the hero graphic on load (GSAP stroke-dashoffset animation)
2. On project cards on hover/focus
3. On the Hackathon Winner badge in About

## Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle → dist/
npm run preview  # preview production build locally
```

## Contact Form Setup

In `src/components/ContactForm.jsx`, replace the Formspree endpoint:

```js
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'
```

Get your free endpoint at [formspree.io](https://formspree.io).

## Deploy

**Vercel (recommended):**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm run build
# drag-drop dist/ into netlify.com, or use netlify CLI
```

Add a `_redirects` file (already included for SPA routing):
```
/*  /index.html  200
```

## Accessibility

- Full keyboard navigation with visible focus rings (`accent-secondary` outline)
- `prefers-reduced-motion` respected — scrub/parallax/GSAP disabled, simple fades only
- Semantic HTML: `<nav>`, `<main>`, `<footer>`, one `<h1>` per page
- Skip-to-main-content link in `index.html`
- All form inputs have associated `<label>` elements and ARIA error descriptions
