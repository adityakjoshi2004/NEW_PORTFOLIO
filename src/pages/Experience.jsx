// src/pages/Experience.jsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionEyebrow from '../components/SectionEyebrow'
import TimelineEntry from '../components/TimelineEntry'
import { experience } from '../data/experience'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const lineRef   = useRef(null)
  const trackRef  = useRef(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const line  = lineRef.current
    const track = trackRef.current
    if (!line || !track || reducedMotion) {
      // Reduced motion: just show the line fully
      if (line) gsap.set(line, { scaleY: 1 })
      return
    }

    // Start from zero height, scale up as user scrolls
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
    <article className="section-pad pt-28 md:pt-32" aria-label="Work experience">
      <div className="container-content">

        <SectionEyebrow>experience</SectionEyebrow>
        <motion.h1
          className="font-display font-light text-h1 md:text-h1-lg mb-14 md:mb-20"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Work History
        </motion.h1>

        {/* Timeline track */}
        <div ref={trackRef} className="relative max-w-2xl">

          {/* The animated vertical line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{ backgroundColor: 'rgba(167,151,138,0.12)' }}
            aria-hidden="true"
          >
            <div
              ref={lineRef}
              className="w-full h-full origin-top"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            />
          </div>

          {/* Entries */}
          <div className="flex flex-col gap-12 md:gap-14">
            {experience.map((entry, i) => (
              <TimelineEntry key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </div>

      </div>
    </article>
  )
}
