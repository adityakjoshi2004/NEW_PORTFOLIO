// src/components/SkillTag.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Skill tag - shows name by default, shows mono confidence readout on hover.
 */
export default function SkillTag({ name, confidence = 0.85, index = 0 }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.3, delay: index * 0.03, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="listitem"
      aria-label={`${name} - confidence ${Math.round(confidence * 100)}%`}
      className="relative inline-flex items-center px-3 py-1.5 rounded-sm border cursor-default select-none
                 transition-all duration-200 overflow-hidden"
      style={{
        backgroundColor: hovered ? 'rgba(193,96,58,0.08)' : 'rgba(36,28,22,0.6)',
        borderColor: hovered ? 'rgba(193,96,58,0.4)' : 'rgba(167,151,138,0.15)',
        boxShadow: hovered ? '0 0 12px rgba(227,168,87,0.08)' : 'none',
      }}
    >
      <motion.span
        animate={{ opacity: hovered ? 0 : 1, y: hovered ? -8 : 0 }}
        transition={{ duration: 0.15 }}
        className="font-sans text-xs font-medium whitespace-nowrap"
        style={{ color: hovered ? 'transparent' : 'var(--text-primary)' }}
      >
        {name}
      </motion.span>

      {/* Hover - mono confidence readout */}
      <motion.span
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
        transition={{ duration: 0.15 }}
        className="font-mono text-[0.625rem] tracking-widest absolute inset-0 flex items-center justify-center whitespace-nowrap px-2"
        style={{ color: 'var(--accent-secondary)' }}
        aria-hidden="true"
      >
        {name.toLowerCase().replace(/\s+/g, '-')} // {confidence.toFixed(2)}
      </motion.span>
    </motion.span>
  )
}
