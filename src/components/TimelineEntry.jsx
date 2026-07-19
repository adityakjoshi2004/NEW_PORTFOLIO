// src/components/TimelineEntry.jsx
import { motion } from 'framer-motion'

export default function TimelineEntry({ entry, index = 0 }) {
  const { role, type, company, location, period, bullets, tags } = entry

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-8 md:pl-12"
    >
      {/* Dot on the timeline line */}
      <div
        className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 -translate-x-[calc(50%+1px)]"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--accent-primary)',
        }}
        aria-hidden="true"
      />

      {/* Content card */}
      <div
        className="p-6 md:p-7 rounded-sm border"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'rgba(167,151,138,0.1)',
        }}
      >
        {/* Period */}
        <p className="font-mono text-xs mb-3" style={{ color: 'var(--accent-primary)' }}>
          {period}
        </p>

        {/* Role */}
        <h3
          className="font-sans font-semibold text-lg md:text-xl leading-tight mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {role}
          {type && (
            <span
              className="ml-2 font-mono text-xs font-normal px-2 py-0.5 rounded-sm border align-middle"
              style={{
                color: 'var(--text-muted)',
                borderColor: 'rgba(167,151,138,0.2)',
              }}
            >
              {type}
            </span>
          )}
        </h3>

        {/* Company */}
        <p className="font-sans text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          {company} · {location}
        </p>

        {/* Bullets */}
        <ul className="flex flex-col gap-2 mb-5" role="list">
          {bullets.map((b, i) => (
            <li
              key={i}
              className="font-sans text-sm leading-relaxed flex gap-3"
              style={{ color: 'var(--text-muted)' }}
            >
              <span
                className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                style={{ backgroundColor: 'var(--accent-primary)' }}
                aria-hidden="true"
              />
              {b}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[0.625rem] tracking-wider px-2 py-0.5 rounded-sm border"
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
      </div>
    </motion.div>
  )
}
