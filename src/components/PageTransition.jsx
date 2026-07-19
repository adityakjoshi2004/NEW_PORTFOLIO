// src/components/PageTransition.jsx
import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

const variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 },
}

const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
}

export default function PageTransition({ children }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      variants={reduced ? reducedVariants : variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
