// src/components/Reticle.jsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * SVG corner-bracket "detection reticle" - the site's signature motif.
 *
 * Props:
 *   size     - pixel size of the square bracket frame (default 100%)
 *   label    - mono readout text beside the bracket (e.g. "role // ml engineer")
 *   active   - if true, animates immediately (hero mode)
 *              if false, animates on hover/focus of parent
 *   className - extra classes for the wrapper
 *   strokeWidth - SVG stroke width (default 1.5)
 *   bracketLength - percentage of side the corner bracket covers (0-50, default 18)
 */
export default function Reticle({
  size = '100%',
  label,
  active = false,
  className = '',
  strokeWidth = 1.5,
  bracketLength = 18,
  delay = 0.2,
}) {
  const svgRef = useRef(null)
  const labelRef = useRef(null)
  const tlRef = useRef(null)
  const reducedMotion = useReducedMotion()

  // Build the GSAP timeline once
  useEffect(() => {
    const svg = svgRef.current
    const labelEl = labelRef.current
    if (!svg) return

    const paths = svg.querySelectorAll('path')

    // Set initial state
    paths.forEach((p) => {
      const len = p.getTotalLength()
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 })
    })
    if (labelEl) gsap.set(labelEl, { opacity: 0, x: -6 })

    const tl = gsap.timeline({ paused: true })
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: reducedMotion ? 0 : 0.45,
      ease: 'power2.out',
      stagger: 0.05,
    })
    if (labelEl) {
      tl.to(labelEl, { opacity: 1, x: 0, duration: reducedMotion ? 0 : 0.3 }, '-=0.1')
    }

    tlRef.current = tl

    if (active) {
      tl.delay(delay).play()
    }

    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, delay, reducedMotion])

  // Expose play/reverse for hover
  const play = () => tlRef.current?.play()
  const reverse = () => tlRef.current?.reverse()

  // The SVG uses viewBox 0 0 100 100 for easy percentage maths.
  // Corner brackets: each corner is two line segments of `bracketLength` units.
  const b = bracketLength
  const w = 100
  const h = 100

  // Four corners: top-left, top-right, bottom-right, bottom-left
  const corners = [
    // top-left: horizontal then vertical
    `M ${b} 0 L 0 0 L 0 ${b}`,
    // top-right
    `M ${w - b} 0 L ${w} 0 L ${w} ${b}`,
    // bottom-right
    `M ${w} ${h - b} L ${w} ${h} L ${w - b} ${h}`,
    // bottom-left
    `M ${b} ${h} L 0 ${h} L 0 ${h - b}`,
  ]

  return (
    <span
      className={`reticle-wrapper pointer-events-none absolute inset-0 ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={!active ? play : undefined}
      onMouseLeave={!active ? reverse : undefined}
      onFocus={!active ? play : undefined}
      onBlur={!active ? reverse : undefined}
    >
      {/* SVG bracket frame */}
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {corners.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="var(--accent-primary)"
            strokeWidth={strokeWidth}
            strokeLinecap="square"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* Mono readout label */}
      {label && (
        <span
          ref={labelRef}
          className="absolute bottom-0 right-0 translate-y-[calc(100%+6px)] font-mono text-[0.625rem] tracking-widest text-muted whitespace-nowrap"
          style={{ color: 'var(--text-muted)' }}
          aria-hidden="true"
        >
          {label}
        </span>
      )}
    </span>
  )
}
