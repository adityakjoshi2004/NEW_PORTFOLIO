// src/hooks/useReducedMotion.js
import { useEffect, useState } from 'react'

/**
 * Returns true if the user has requested reduced motion via
 * the OS/browser `prefers-reduced-motion: reduce` media query.
 */
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}
