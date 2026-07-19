// src/components/StatCounter.jsx
import { useCountUp } from '../hooks/useCountUp'

/**
 * A single animated stat.
 * Props: value (number), suffix (string), label (string)
 */
export default function StatCounter({ value, suffix = '', label }) {
  const { ref, display } = useCountUp(value, 1800, suffix)

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <span
        className="font-mono text-4xl md:text-5xl font-medium leading-none"
        style={{ color: 'var(--accent-primary)' }}
      >
        {display}
      </span>
      <span
        className="font-sans text-sm tracking-wide uppercase"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </span>
    </div>
  )
}
