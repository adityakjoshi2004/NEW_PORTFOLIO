/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system tokens — Section 4 of the spec
        'bg-primary':       '#171310', // Espresso — page background
        'bg-secondary':     '#241C16', // Warm Charcoal — cards, nav
        'text-primary':     '#F3E9DA', // Bone — headlines, body
        'text-muted':       '#A7978A', // Warm Taupe — secondary text
        'accent-primary':   '#C1603A', // Ember — CTAs, links, reticle
        'accent-secondary': '#E3A857', // Amber — hover, skill-tag glow
        'accent-tertiary':  '#8B3A2B', // Brick — hackathon badge, hero underline
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans:    ['"Manrope"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        // Type scale: mobile -> desktop via responsive classes
        caption: ['0.75rem',   { lineHeight: '1.4' }],
        body:    ['1rem',      { lineHeight: '1.5' }],
        h3:      ['1.25rem',   { lineHeight: '1.3' }],
        h2:      ['1.75rem',   { lineHeight: '1.15' }],
        h1:      ['2.5rem',    { lineHeight: '1.05' }],
        // Desktop overrides via md: prefix
        'body-lg':  ['1.0625rem', { lineHeight: '1.5' }],
        'h3-lg':    ['1.5rem',    { lineHeight: '1.3' }],
        'h2-lg':    ['2.5rem',    { lineHeight: '1.1' }],
        'h1-lg':    ['4.5rem',    { lineHeight: '1.05' }],
      },
      maxWidth: {
        content: '1140px',
      },
      spacing: {
        section: '6rem',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
