// src/components/Hero.jsx
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Link2 } from 'lucide-react'
import Reticle from './Reticle'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Stagger container variants
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}

const itemReduced = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.3 } },
}

/**
 * Abstract CV-grid graphic — references Aditya's own object-detection work
 * without needing a real photograph.
 */
function CVGraphic() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Abstract computer vision detection grid"
      role="img"
      className="w-full h-full"
    >
      {/* Background panel */}
      <rect width="240" height="240" fill="var(--bg-secondary)" rx="4" />

      {/* Grid lines */}
      {[40, 80, 120, 160, 200].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="240"
          stroke="rgba(167,151,138,0.07)" strokeWidth="1" />
      ))}
      {[40, 80, 120, 160, 200].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="240" y2={y}
          stroke="rgba(167,151,138,0.07)" strokeWidth="1" />
      ))}

      {/* Main detection box */}
      <rect x="60" y="55" width="120" height="130" rx="2"
        stroke="var(--accent-primary)" strokeWidth="1.5" strokeDasharray="4 2" />

      {/* Confidence bar */}
      <rect x="60" y="192" width="86" height="4" rx="2" fill="var(--accent-primary)" opacity="0.8" />
      <rect x="60" y="192" width="120" height="4" rx="2" fill="rgba(167,151,138,0.15)" />

      {/* Label chip */}
      <rect x="60" y="44" width="72" height="14" rx="2" fill="var(--accent-primary)" />
      <text x="66" y="54.5" fontSize="7" fill="var(--bg-primary)"
        fontFamily="JetBrains Mono, monospace" fontWeight="500">
        person 0.96
      </text>

      {/* Secondary box (smaller, overlapping) */}
      <rect x="130" y="80" width="70" height="75" rx="2"
        stroke="var(--accent-secondary)" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
      <rect x="130" y="69" width="54" height="12" rx="2" fill="var(--accent-secondary)" opacity="0.7" />
      <text x="135" y="77.5" fontSize="6" fill="var(--bg-primary)"
        fontFamily="JetBrains Mono, monospace">
        face 0.91
      </text>

      {/* Crosshair center */}
      <line x1="120" y1="110" x2="120" y2="130" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.5" />
      <line x1="110" y1="120" x2="130" y2="120" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.5" />
      <circle cx="120" cy="120" r="4" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.5" />

      {/* Status strip */}
      <rect x="0" y="228" width="240" height="12" fill="rgba(36,28,22,0.8)" />
      <text x="8" y="237" fontSize="6.5" fill="var(--accent-primary)"
        fontFamily="JetBrains Mono, monospace">
        model // yolov11 &gt; inference 12ms &gt; status active
      </text>
    </svg>
  )
}

export default function Hero() {
  const reduced = useReducedMotion()
  const heroRef = useRef(null)
  const v = reduced ? itemReduced : item

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-16"
      aria-label="Hero section"
    >
      {/* Subtle radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 60% 50%, rgba(193,96,58,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container-content w-full py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            {/* Kicker */}
            <motion.p variants={v} className="eyebrow">
              machine learning engineer · full-stack developer
            </motion.p>

            {/* Name */}
            <motion.h1
              variants={v}
              className="font-display font-light leading-none"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}
            >
              Aditya<br />
              <span style={{ color: 'var(--accent-primary)' }}>Kumar</span>{' '}
              Joshi
            </motion.h1>

            {/* Pitch */}
            <motion.p
              variants={v}
              className="font-sans text-base md:text-lg leading-relaxed max-w-lg"
              style={{ color: 'var(--text-muted)' }}
            >
              I build real-time computer vision systems and agentic AI tooling —
              end-to-end, from model to UI. Final-year CSE student at IES IPS
              Academy, shipping products that detect, understand, and respond.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={v} className="flex flex-wrap gap-4 pt-2">
              <Link to="/projects" className="btn-primary group">
                View Projects
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
              <Link to="/contact" className="btn-ghost">
                Get in Touch
              </Link>
            </motion.div>

            {/* Social quick-links */}
            <motion.div variants={v} className="flex items-center gap-5 pt-1">
              <a
                href="https://github.com/AdityaKumarJoshi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="transition-colors duration-200"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <ExternalLink size={20} strokeWidth={1.5} />
              </a>
              <a
                href="https://linkedin.com/in/aditya-kumar-joshi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="transition-colors duration-200"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <Link2 size={20} strokeWidth={1.5} />
              </a>
              <span
                className="font-mono text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                / adityakumarjoshi
              </span>
            </motion.div>
          </motion.div>

          {/* Right — CV graphic with reticle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[360px] lg:max-w-none"
          >
            {/* Outer padding to give reticle space to sit outside the graphic */}
            <div className="relative p-6">
              {/* Reticle — draws in on load, sits outside the graphic */}
              <Reticle
                active={true}
                delay={0.9}
                label="role // ml engineer · cv systems"
                bracketLength={14}
                strokeWidth={1.5}
                className="!inset-0"
              />
              {/* Graphic */}
              <div className="rounded-sm overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
                <CVGraphic />
              </div>
            </div>

            {/* Floating mono label — "detection active" badge */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.4 }}
              className="absolute -top-2 -right-2 md:top-4 md:-right-8 flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-mono"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'rgba(193,96,58,0.4)',
                color: 'var(--accent-primary)',
              }}
              aria-hidden="true"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              detection active
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-mono text-[0.625rem] tracking-widest" style={{ color: 'var(--text-muted)' }}>
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 origin-top"
          style={{ backgroundColor: 'var(--accent-primary)', opacity: 0.5 }}
        />
      </motion.div>
    </section>
  )
}
