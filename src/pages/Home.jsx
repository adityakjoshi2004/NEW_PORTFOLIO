// src/pages/Home.jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Hero from '../components/Hero'
import StatCounter from '../components/StatCounter'
import ProjectCard from '../components/ProjectCard'
import SectionEyebrow from '../components/SectionEyebrow'
import { projects } from '../data/projects'

const stats = [
  { value: 10000, suffix: '+', label: 'Custom NLP training problems' },
  { value: 4, suffix: '', label: 'Shipped projects' },
  { value: 1, suffix: '', label: 'National hackathon win' },
  { value: 2026, suffix: '', label: 'Graduating' },
]

const featuredProjects = projects.filter((p) => p.featured)

export default function Home() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <Hero />

      {/* ── Stats strip ───────────────────────────────────────────────── */}
      <section
        className="border-y"
        style={{ borderColor: 'rgba(167,151,138,0.1)' }}
        aria-label="Quick stats"
      >
        <div className="container-content py-14 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
            {stats.map((s) => (
              <StatCounter key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured projects ─────────────────────────────────────────── */}
      <section className="section-pad" aria-label="Featured projects">
        <div className="container-content">
          <SectionEyebrow>featured work</SectionEyebrow>

          <motion.h2
            className="font-display font-light text-h2 md:text-h2-lg mb-10 md:mb-14"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            Selected Projects
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {featuredProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>

          {/* CTA to all projects */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <Link to="/projects" className="btn-ghost group">
              View all projects
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────────────── */}
      <section
        className="section-pad border-t"
        style={{ borderColor: 'rgba(167,151,138,0.1)' }}
        aria-label="Contact call to action"
      >
        <div className="container-content text-center flex flex-col items-center gap-6">
          <SectionEyebrow>let's work together</SectionEyebrow>
          <motion.h2
            className="font-display font-light text-h2 md:text-h2-lg max-w-xl"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Open to ML / Full-Stack roles
          </motion.h2>
          <motion.p
            className="font-sans text-base max-w-md"
            style={{ color: 'var(--text-muted)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Graduating July 2026. Looking for internships and full-time opportunities in ML engineering and full-stack development.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/contact" className="btn-primary">
              Get in touch
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
