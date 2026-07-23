// src/pages/About.jsx
import { motion } from 'framer-motion'
import { GraduationCap, Award, Users } from 'lucide-react'
import SectionEyebrow from '../components/SectionEyebrow'
import Reticle from '../components/Reticle'

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
}

const certifications = [
  'Python Programming',
  'Database Management Systems (DBMS)',
]

const recognition = [
  {
    label: 'Smart India Hackathon 2025 - Winner',
    icon: Award,
    highlight: true,
  },
  {
    label: 'Non-Tech Team Lead, Google Developers Group (GDG) on Campus',
    icon: Users,
    highlight: false,
  },
  {
    label: 'Curation Team Lead, Bad Talks',
    icon: Users,
    highlight: false,
  },
]

export default function About() {
  return (
    <article className="section-pad pt-28 md:pt-32" aria-label="About Aditya Kumar Joshi">
      <div className="container-content max-w-3xl">

        {/* Eyebrow + heading */}
        <SectionEyebrow>about</SectionEyebrow>
        <motion.h1
          className="font-display font-light text-h1 md:text-h1-lg mb-10 md:mb-14"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          {...fade}
        >
          Building applied ML,<br />end-to-end.
        </motion.h1>

        {/* Bio */}
        <motion.div className="flex flex-col gap-4 mb-16" {...fade}>
          {[
            `I'm a final-year Computer Science & Engineering student at IES IPS Academy, Indore, graduating May 2026. My focus sits at the intersection of machine learning and full-stack engineering - I build systems that don't just run inference, but ship as real products people can use.`,
            `My recent work spans real-time computer vision (YOLO-based fall and face-recognition systems), multilingual NLP (Hindi mathematical word-problem solving), and agentic AI tooling using LangChain, LangGraph, and the MCP protocol. I care about the full pipeline: data, model, API, and the user interface on top.`,
            `Outside of shipping code, I help organise GDG on Campus at my college and curate events through Bad Talks - because good engineering culture matters as much as technical craft.`,
          ].map((para, i) => (
            <motion.p
              key={i}
              className="font-sans text-base md:text-[1.0625rem] leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {para}
            </motion.p>
          ))}
        </motion.div>

        <hr className="hairline mb-14" />

        {/* Education */}
        <motion.section
          className="mb-14"
          aria-label="Education"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow mb-6">education</p>
          <div
            className="flex gap-5 p-6 md:p-7 rounded-sm border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'rgba(167,151,138,0.1)',
            }}
          >
            <GraduationCap
              size={24}
              strokeWidth={1.5}
              className="shrink-0 mt-0.5"
              style={{ color: 'var(--accent-primary)' }}
            />
            <div>
              <h2
                className="font-sans font-semibold text-lg mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                Bachelor of Technology in CSE
              </h2>
              <p className="font-sans text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                IES IPS Academy, Indore
              </p>
              <p className="font-mono text-xs" style={{ color: 'var(--accent-secondary)' }}>
                Graduating May 2026
              </p>
            </div>
          </div>
        </motion.section>

        {/* Certifications */}
        <motion.section
          className="mb-14"
          aria-label="Certifications"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="eyebrow mb-6">certifications</p>
          <ul className="flex flex-col gap-3" role="list">
            {certifications.map((cert) => (
              <li
                key={cert}
                className="flex items-center gap-3 font-sans text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                  aria-hidden="true"
                />
                {cert}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Recognition & leadership */}
        <motion.section
          aria-label="Recognition and leadership"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="eyebrow mb-6">recognition & leadership</p>
          <ul className="flex flex-col gap-4" role="list">
            {recognition.map(({ label, icon: Icon, highlight }) => (
              <li key={label} className="relative">
                {highlight ? (
                  /* Hackathon winner - gets the reticle treatment */
                  <div
                    className="relative inline-flex items-center gap-3 px-5 py-3 rounded-sm border"
                    style={{
                      backgroundColor: 'rgba(139,58,43,0.12)',
                      borderColor: 'rgba(139,58,43,0.35)',
                    }}
                  >
                    <Reticle
                      active={false}
                      label="status // winner"
                      bracketLength={20}
                      strokeWidth={1.5}
                      className="!inset-0"
                    />
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      style={{ color: 'var(--accent-tertiary)' }}
                    />
                    <span
                      className="font-sans text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {label}
                    </span>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-3 font-sans text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      style={{ color: 'var(--accent-secondary)' }}
                    />
                    {label}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </motion.section>

      </div>
    </article>
  )
}
