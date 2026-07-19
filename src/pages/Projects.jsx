// src/pages/Projects.jsx
import SectionEyebrow from '../components/SectionEyebrow'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import { motion } from 'framer-motion'

export default function Projects() {
  return (
    <article className="section-pad pt-28 md:pt-32" aria-label="Projects">
      <div className="container-content">

        <SectionEyebrow>work</SectionEyebrow>
        <motion.h1
          className="font-display font-light text-h1 md:text-h1-lg mb-4"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          All Projects
        </motion.h1>

        <motion.p
          className="font-sans text-base max-w-xl mb-14 md:mb-16"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          Four shipped projects spanning computer vision, NLP, agentic AI, and MERN-stack development. Each card shows the reticle detection frame on hover.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

      </div>
    </article>
  )
}
