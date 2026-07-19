// src/pages/Skills.jsx
import { motion } from 'framer-motion'
import SectionEyebrow from '../components/SectionEyebrow'
import SkillTag from '../components/SkillTag'
import { skillCategories } from '../data/skills'

export default function Skills() {
  return (
    <article className="section-pad pt-28 md:pt-32" aria-label="Skills">
      <div className="container-content">

        <SectionEyebrow>skills</SectionEyebrow>
        <motion.h1
          className="font-display font-light text-h1 md:text-h1-lg mb-4"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Capabilities
        </motion.h1>

        <motion.p
          className="font-sans text-base max-w-xl mb-14 md:mb-16"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          Hover any tag to see the detection confidence readout — a playful nod to model output, not a literal metric.
        </motion.p>

        <div className="flex flex-col gap-12 md:gap-16">
          {skillCategories.map((cat, catIndex) => (
            <motion.section
              key={cat.id}
              aria-label={cat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: catIndex * 0.06 }}
            >
              {/* Category label */}
              <div className="flex items-center gap-4 mb-5">
                <p className="eyebrow">{cat.label.toLowerCase()}</p>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: 'rgba(167,151,138,0.1)' }}
                  aria-hidden="true"
                />
              </div>

              {/* Tags */}
              <div
                className="flex flex-wrap gap-2.5"
                role="list"
                aria-label={`${cat.label} skills`}
              >
                {cat.skills.map((skill, i) => (
                  <SkillTag
                    key={skill}
                    name={skill}
                    confidence={cat.confidence[skill] ?? 0.85}
                    index={i}
                  />
                ))}
              </div>
            </motion.section>
          ))}
        </div>

      </div>
    </article>
  )
}
