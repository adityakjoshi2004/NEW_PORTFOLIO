import { useState } from 'react'
import { person } from '../data/content'

// Aditya's photo (public/photo.jpg). If the file is missing or fails to
// load, a brass monogram takes its place so the layout never breaks.
export default function Portrait({ variant = 'round', size, className = '', eager = false }) {
  const [failed, setFailed] = useState(false)
  const style = size ? { width: size, height: variant === 'arch' ? size * 1.25 : size } : undefined
  return (
    <span className={`portrait portrait--${variant} ${className}`} style={style}>
      {failed ? (
        <span className="portrait__monogram" aria-label={person.name} role="img">
          {person.initials}
        </span>
      ) : (
        <img
          src={person.photo}
          alt={person.name}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}
