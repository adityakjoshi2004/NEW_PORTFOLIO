// src/hooks/useCountUp.js
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Animates a number from 0 to `end` once the element enters the viewport.
 * @param {number} end       - Target value
 * @param {number} duration  - Duration in ms (default 1800)
 * @param {string} suffix    - String appended after the number (e.g. '+', '%')
 */
export function useCountUp(end, duration = 1800, suffix = '') {
  const [count, setCount] = useState(0)
  const [hasRun, setHasRun] = useState(false)
  const ref = useRef(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun) {
          setHasRun(true)

          if (reducedMotion) {
            setCount(end)
            return
          }

          const startTime = performance.now()
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(animate)
            else setCount(end)
          }

          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [end, duration, hasRun, reducedMotion])

  return { ref, display: `${count.toLocaleString()}${suffix}` }
}
