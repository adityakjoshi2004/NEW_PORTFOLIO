import { useState } from 'react'
import { sound } from '../audio/engine'
import { contact, person } from '../data/content'
import { DownloadIcon, ExternalIcon } from './icons'
import Portrait from './Portrait'
import { resumeLink } from './resume'

// A gentleman's visiting card: the quickest ways to get in touch.
export default function ContactCard() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
      sound.seal()
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${person.email}`
    }
  }

  return (
    <div className="calling-card">
      <div className="calling-card__head">
        <Portrait size={72} />
        <div>
          <p className="calling-card__name">{person.name}</p>
          <p className="calling-card__title">{person.title}</p>
          <p className="calling-card__seat">{person.seat}</p>
        </div>
      </div>

      <a className="calling-card__email" href={`mailto:${person.email}`} onPointerEnter={() => sound.hover()}>
        {person.email}
      </a>

      <div className="calling-card__actions">
        <a className="button" href={`mailto:${person.email}`} onPointerEnter={() => sound.hover()}>
          Write an email
        </a>
        <button type="button" className="button button--ghost-ink" onClick={copyEmail} onPointerEnter={() => sound.hover()}>
          {copied ? 'Copied ✓' : 'Copy email'}
        </button>
        <a className="button button--ghost-ink" {...resumeLink} onPointerEnter={() => sound.hover()}>
          <DownloadIcon /> Resume
        </a>
      </div>

      <div className="calling-card__open">
        <p className="calling-card__label">Open to</p>
        <ul className="chips">
          {contact.openTo.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>

      <ul className="calling-card__links">
        {person.links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" onPointerEnter={() => sound.hover()}>
              {l.label} <ExternalIcon />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
