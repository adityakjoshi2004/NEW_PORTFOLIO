import { useState } from 'react'
import { sound } from '../audio/engine'
import { about, experience, honours, manuscripts, person, projects, skills } from '../data/content'
import ContactCard from './ContactCard'
import { DownloadIcon, LeafIcon } from './icons'
import Portrait from './Portrait'
import { resumeLink } from './resume'

const hover = () => sound.hover()

export function ResumeDeed() {
  return (
    <a className="deed" {...resumeLink} onPointerEnter={hover}>
      <DownloadIcon />
      <span>
        <strong>Resume</strong>
        <small>View &amp; download · PDF</small>
      </span>
    </a>
  )
}

export function Manor({ go }) {
  return (
    <>
      <div className="manor-head">
        <Portrait size={64} />
        <div>
          <p className="lede">{about.lede}</p>
          <p className="motto">“{person.words}”</p>
        </div>
      </div>
      {about.paragraphs.map((p, i) => (
        <p key={i} className={i === 0 ? 'dropcap' : undefined}>
          {p}
        </p>
      ))}
      <dl className="ledger">
        <div>
          <dt>Seat</dt>
          <dd>{person.seat}</dd>
        </div>
        <div>
          <dt>Discipline</dt>
          <dd>{person.title}</dd>
        </div>
        <div>
          <dt>Education</dt>
          <dd>B.Tech CSE, IES IPS Academy · 2026</dd>
        </div>
        <div>
          <dt>Distinction</dt>
          <dd>Winner, Smart India Hackathon 2025</dd>
        </div>
      </dl>
      <div className="actions">
        <ResumeDeed />
        <button type="button" className="button" onPointerEnter={hover} onClick={() => go('post')}>
          Write to me
        </button>
      </div>
    </>
  )
}

export function Library() {
  const [open, setOpen] = useState(projects[0].id)
  const book = projects.find((p) => p.id === open)
  return (
    <>
      <p className="room-intro">Five bound volumes of work. Take one from the shelf.</p>
      <div className="shelf" role="tablist" aria-label="Projects">
        {projects.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={p.id === open}
            aria-controls="open-book"
            className="spine"
            style={{ '--cloth': p.cloth }}
            onPointerEnter={hover}
            onClick={() => {
              if (p.id !== open) sound.pageTurn()
              setOpen(p.id)
            }}
          >
            <span className="spine__vol">{p.volume}</span>
            <span className="spine__title">{p.spine}</span>
          </button>
        ))}
        <div className="shelf__plank" aria-hidden="true" />
      </div>

      <article className="book" id="open-book" role="tabpanel" key={book.id}>
        <p className="eyebrow">Volume {book.volume}</p>
        <h3>{book.title}</h3>
        <p className="book__stack">{book.stack.join(' · ')}</p>
        <p>{book.summary}</p>
        <p>{book.detail}</p>
        <div className="figures">
          {book.figures.map((f) => (
            <div key={f.label} className="figure">
              <span className="figure__value">{f.value}</span>
              <span className="figure__label">{f.label}</span>
            </div>
          ))}
        </div>
      </article>

      <h3 className="section-title">Forthcoming manuscripts</h3>
      <ul className="manuscripts">
        {manuscripts.map((m) => (
          <li key={m}>
            <span>{m}</span>
            <span className="stamp">In preparation</span>
          </li>
        ))}
      </ul>
    </>
  )
}

export function Study() {
  return (
    <>
      <p className="room-intro">Letters of appointment, kept in the writing desk.</p>
      {experience.map((job) => (
        <article key={job.id} className="appointment">
          <header className="appointment__head">
            <p className="appointment__org">{job.org}</p>
            <p className="appointment__date">{job.period}</p>
          </header>
          <h3>{job.role}</h3>
          <p className="appointment__place">{job.place}</p>
          <ul>
            {job.duties.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="appointment__tools">
            <em>Instruments:</em> {job.stack.join(', ')}
          </p>
        </article>
      ))}
    </>
  )
}

export function Trophy() {
  return (
    <>
      <div className="plaque">
        <p className="plaque__note">{honours.laurel.note}</p>
        <p className="plaque__title">{honours.laurel.title}</p>
        <p className="plaque__sub">Presented to {person.name}</p>
      </div>

      <h3 className="section-title">The diploma</h3>
      <div className="diploma">
        <p className="diploma__degree">{honours.education.degree}</p>
        <p>{honours.education.school}</p>
        <p className="diploma__year">{honours.education.year}</p>
      </div>

      <h3 className="section-title">Offices held</h3>
      <ul className="honour-list">
        {honours.offices.map((o) => (
          <li key={o.role}>
            <strong>{o.role}</strong>
            <span>{o.body}</span>
          </li>
        ))}
      </ul>

      <h3 className="section-title">Certificates</h3>
      <ul className="honour-list">
        {honours.certificates.map((c) => (
          <li key={c}>
            <strong>{c}</strong>
          </li>
        ))}
      </ul>
    </>
  )
}

export function Conservatory() {
  return (
    <>
      <p className="room-intro">A catalogue of the collection, labelled in brass.</p>
      {skills.map((bed) => (
        <section key={bed.genus} className="specimen">
          <header>
            <h3>{bed.genus}</h3>
            <p>{bed.common}</p>
          </header>
          <ul>
            {bed.items.map((s) => (
              <li key={s}>
                <LeafIcon />
                {s}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}

export function Post() {
  return (
    <>
      <p className="room-intro">Correspondence is welcome: roles, research, or a good problem to solve.</p>
      <ContactCard />
    </>
  )
}
