// src/components/SectionEyebrow.jsx
import { motion } from 'framer-motion'

/**
 * Mono kicker label that appears above section headings.
 * e.g. <SectionEyebrow>experience</SectionEyebrow>
 */
export default function SectionEyebrow({ children, className = '' }) {
  return (
    <motion.p
      className={`eyebrow mb-4 ${className}`}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.p>
  )
}
