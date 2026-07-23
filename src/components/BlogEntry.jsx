// src/components/BlogEntry.jsx
import { motion } from 'framer-motion'
import { ArrowUpRight, Clock } from 'lucide-react'

/**
 * A single blog entry on the timeline.
 * Mirrors TimelineEntry's layout - dot on the line, card body, date kicker.
 */
export default function BlogEntry({ post, index = 0 }) {
  const { date, title, excerpt, readTime, tags, link } = post
  const isExternal = link && link !== '#'

  return (
    <motion.article
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-8 md:pl-12"
      aria-label={`Blog post: ${title}`}
    >
      {/* Dot on the timeline line */}
      <div
        className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 -translate-x-[calc(50%+1px)]"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--accent-secondary)',
        }}
        aria-hidden="true"
      />

      {/* Card body */}
      <div
        className="p-6 md:p-7 rounded-sm border transition-colors duration-300 group"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'rgba(167,151,138,0.1)',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = 'rgba(227,168,87,0.2)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = 'rgba(167,151,138,0.1)')
        }
      >
        {/* Date + read time row */}
        <div className="flex items-center gap-4 mb-3">
          <p className="font-mono text-xs" style={{ color: 'var(--accent-secondary)' }}>
            {date}
          </p>
          <span
            className="flex items-center gap-1.5 font-mono text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            <Clock size={11} strokeWidth={1.5} aria-hidden="true" />
            {readTime}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-sans font-semibold text-lg md:text-xl leading-snug mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>

        {/* Excerpt */}
        <p
          className="font-sans text-sm leading-relaxed mb-5"
          style={{ color: 'var(--text-muted)' }}
        >
          {excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[0.625rem] tracking-wider px-2 py-0.5 rounded-sm border"
              style={{
                backgroundColor: 'rgba(227,168,87,0.05)',
                borderColor: 'rgba(227,168,87,0.18)',
                color: 'var(--text-muted)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Read link */}
        <a
          href={link}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold transition-colors duration-200"
          style={{ color: 'var(--accent-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-secondary)')}
          aria-label={`Read: ${title}${!isExternal ? ' (coming soon)' : ''}`}
        >
          {isExternal ? 'Read post' : 'Coming soon'}
          <ArrowUpRight size={14} />
        </a>
      </div>
    </motion.article>
  )
}
