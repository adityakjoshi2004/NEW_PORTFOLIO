// src/components/ProjectCard.jsx
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Reticle from './Reticle'

export default function ProjectCard({ project, index = 0 }) {
  const { title, tagline, description, stack, status, github, id } = project
  const cardRef = useRef(null)

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-sm overflow-visible"
      aria-label={`Project: ${title}`}
    >
      {/* Card body */}
      <div
        className="relative p-6 md:p-8 h-full flex flex-col gap-5 rounded-sm border transition-border-color duration-300"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'rgba(167,151,138,0.1)',
        }}
      >
        {/* Reticle on hover — wraps the whole card */}
        <div className="absolute inset-0 pointer-events-none">
          <Reticle
            active={false}
            label={`project // ${String(index + 1).padStart(2, '0')} · ${status}`}
            bracketLength={12}
            strokeWidth={1.5}
          />
        </div>

        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          {/* Index */}
          <span
            className="font-mono text-xs shrink-0"
            style={{ color: 'var(--accent-primary)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Status badge */}
          <span
            className="font-mono text-[0.625rem] tracking-wider px-2 py-0.5 rounded-sm border"
            style={{
              color: 'var(--text-muted)',
              borderColor: 'rgba(167,151,138,0.2)',
            }}
          >
            {status}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-sans font-semibold text-lg md:text-xl leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>

        {/* Tagline */}
        <p
          className="font-mono text-xs tracking-wide"
          style={{ color: 'var(--accent-secondary)' }}
        >
          {tagline}
        </p>

        {/* Description */}
        <p
          className="font-sans text-sm leading-relaxed flex-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {description}
        </p>

        {/* Stack tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {stack.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[0.625rem] tracking-wider px-2 py-1 rounded-sm border"
              style={{
                backgroundColor: 'rgba(193,96,58,0.06)',
                borderColor: 'rgba(193,96,58,0.2)',
                color: 'var(--text-muted)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Link */}
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold transition-colors duration-200 mt-auto pt-2 self-start"
          style={{ color: 'var(--accent-primary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
          aria-label={`View ${title} on GitHub`}
        >
          View on GitHub
          <ArrowUpRight size={14} />
        </a>
      </div>
    </motion.article>
  )
}
