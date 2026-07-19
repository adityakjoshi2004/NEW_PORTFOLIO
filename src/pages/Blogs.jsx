// src/pages/Blogs.jsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import SectionEyebrow from '../components/SectionEyebrow'
import BlogEntry from '../components/BlogEntry'
import { blogs } from '../data/blogs'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function Blogs() {
  const lineRef  = useRef(null)
  const trackRef = useRef(null)
  const reducedMotion = useReducedMotion()

  // GSAP scroll-scrubbed line — identical technique to Experience timeline
  useEffect(() => {
    const line  = lineRef.current
    const track = trackRef.current
    if (!line || !track) return

    if (reducedMotion) {
      gsap.set(line, { scaleY: 1 })
      return
    }

    gsap.fromTo(
      line,
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          start: 'top 70%',
          end: 'bottom 50%',
          scrub: 0.6,
        },
      }
    )

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [reducedMotion])

  return (
    <article className="section-pad pt-28 md:pt-32" aria-label="Blog posts">
      <div className="container-content">

        {/* Header */}
        <SectionEyebrow>writing</SectionEyebrow>

        <motion.h1
          className="font-display font-light text-h1 md:text-h1-lg mb-4"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Blog
        </motion.h1>

        <motion.p
          className="font-sans text-base max-w-xl mb-14 md:mb-20"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          Technical writing on machine learning, computer vision, full-stack development, and the lessons learned shipping real products.
        </motion.p>

        {/* Timeline track — same structure as Experience */}
        <div ref={trackRef} className="relative max-w-2xl">

          {/* Animated vertical line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{ backgroundColor: 'rgba(167,151,138,0.12)' }}
            aria-hidden="true"
          >
            {/* Amber line (differentiates from Experience's ember line) */}
            <div
              ref={lineRef}
              className="w-full h-full origin-top"
              style={{ backgroundColor: 'var(--accent-secondary)' }}
            />
          </div>

          {/* Blog entries */}
          <div className="flex flex-col gap-10 md:gap-12">
            {blogs.map((post, i) => (
              <BlogEntry key={post.id} post={post} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <motion.p
          className="font-mono text-xs mt-16 max-w-sm"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          // more posts coming — follow on{' '}
          <a
            href="https://github.com/AdityaKumarJoshi"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
            style={{ color: 'var(--accent-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-secondary)')}
          >
            GitHub
          </a>{' '}
          for updates
        </motion.p>

      </div>
    </article>
  )
}
