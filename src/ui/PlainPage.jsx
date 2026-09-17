import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { sound } from '../audio/engine'
import { about, experience, honours, manuscripts, person, projects, skills, testimonials } from '../data/content'
import ContactCard from './ContactCard'
import { ArrowIcon, DownloadIcon, ExternalIcon, MoonIcon, SunIcon } from './icons'
import Portrait from './Portrait'
import SkillIcon from './skillIcons'
import { resumeLink } from './resume'

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
}

// Fades sections in as they scroll into view.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (reducedMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        // Reveal everything that is on screen or already scrolled past, so a
        // jump down the page never leaves hidden sections behind it.
        els.forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('is-visible')
            io.unobserve(el)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function RotatingVerb() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reducedMotion) return
    const id = setInterval(() => setI((n) => (n + 1) % about.verbs.length), 2200)
    return () => clearInterval(id)
  }, [])
  if (reducedMotion) return <span className="hero__verb">{about.verbs.slice(0, 3).join(', ')}</span>
  return (
    <span className="hero__verb" key={i}>
      {about.verbs[i]}
    </span>
  )
}

// Light or dark, remembered between visits.
function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')

  const change = (next, origin) => {
    const apply = () => {
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem('folio-theme', next)
      } catch {
        /* private browsing: the choice simply won't be remembered */
      }
      setTheme(next)
    }

    // Where supported, the new theme sweeps out as a circle from the button.
    if (reducedMotion || !document.startViewTransition || !origin) {
      apply()
      return
    }
    const { x, y } = origin
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    document
      .startViewTransition(() => flushSync(apply))
      .ready.then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 700, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
        ),
      )
      .catch(() => {})
  }

  return [theme, change]
}

function ThemeToggle() {
  const [theme, change] = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        change(dark ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function ResumeButton({ className = 'button button--ghost-ink' }) {
  return (
    <a className={className} {...resumeLink}>
      <DownloadIcon /> Resume
    </a>
  )
}

function SectionHead({ eyebrow, title, children }) {
  return (
    <header className="section-head" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p className="section-head__sub">{children}</p>}
    </header>
  )
}

export default function PlainPage({ onEstate }) {
  const [scrolled, setScrolled] = useState(false)
  useReveal()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.body.classList.add('is-plain')
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.body.classList.remove('is-plain')
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const enterEstate = onEstate && (
    <button type="button" className="button button--brass" onClick={onEstate}>
      Enter the estate <ArrowIcon />
    </button>
  )

  // Buttons and links here answer with the same sounds as the estate.
  const play = (e) => {
    if (!e.target.closest?.('button, a')) return
    sound.unlock()
    sound.click()
  }
  const whisper = (e) => {
    if (e.target.closest?.('button, a')) sound.hover()
  }

  return (
    <div className="folio" onClickCapture={play} onPointerOver={whisper}>
      {/* ---- navigation ---- */}
      <header className={`folio-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <button type="button" className="folio-nav__brand" onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}>
          <Portrait size={34} eager />
          <span>{person.name}</span>
        </button>
        <nav aria-label="Sections">
          {NAV.map((n) => (
            <button key={n.id} type="button" className="folio-nav__link" onClick={() => scrollToSection(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="folio-nav__actions">
          <ResumeButton className="folio-nav__resume" />
          {onEstate && (
            <button type="button" className="button button--brass button--small" onClick={onEstate}>
              Enter the estate
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main>
        {/* ---- about ---- */}
        <section id="about" className="hero">
          <div className="hero__text" data-reveal>
            <p className="eyebrow">About · {person.seat}</p>
            <h1 className="hero__title">
              An AI/ML engineer building systems that <RotatingVerb />
            </h1>
            <p className="hero__intro">{about.intro}</p>
            <div className="hero__actions">
              {enterEstate}
              <ResumeButton />
              <button type="button" className="link-button" onClick={() => scrollToSection('contact')}>
                Get in touch <ArrowIcon />
              </button>
            </div>
            {onEstate && <p className="hero__note">The estate is an explorable 3D version of this portfolio, best with sound.</p>}
          </div>
          <figure className="hero__figure" data-reveal>
            <Portrait variant="arch" eager />
            <figcaption>
              <strong>{person.name}</strong>
              <span>{person.title}</span>
            </figcaption>
          </figure>
        </section>

        <section className="story folio-section" aria-label="My story">
          <h2 className="story__title" data-reveal>
            {about.lede}
          </h2>
          <div className="story__body" data-reveal>
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* ---- selected work ---- */}
        <section id="work" className="folio-section">
          <SectionHead eyebrow="Selected work" title="Things I’ve built">
            Real systems with real numbers, from research models to deployed products.
          </SectionHead>
          <div className="work-grid">
            {projects.map((p) => (
              <article key={p.id} className="work-card" data-reveal>
                <div className="work-card__top">
                  <span className="work-card__index">{String(projects.indexOf(p) + 1).padStart(2, '0')}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <div className="work-card__figures">
                  {p.figures.slice(0, 3).map((f) => (
                    <div key={f.label}>
                      <strong>{f.value}</strong>
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>
                <ul className="chips">
                  {p.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="writing" data-reveal>
            <h3>Writing in progress</h3>
            <ul>
              {manuscripts.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- skills & expertise ---- */}
        <section id="skills" className="folio-section folio-section--tint">
          <SectionHead eyebrow="Skills & expertise" title="What I work with">
            Grouped by how I use them, with machine learning at the centre.
          </SectionHead>
          <div className="skills-grid">
            {skills.map((group, i) => (
              <section key={group.genus} className={`skill-card ${i === 0 ? 'skill-card--wide' : ''}`} data-reveal>
                <header>
                  <h3>{group.genus}</h3>
                  <span>{group.items.length}</span>
                </header>
                <ul className="skill-tiles">
                  {group.items.map((s) => (
                    <li key={s}>
                      <span className="skill-tile__icon">
                        <SkillIcon name={s} />
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        {/* ---- experience & education ---- */}
        <section id="experience" className="folio-section">
          <SectionHead eyebrow="Experience & education" title="Where I’ve worked and learned" />
          <div className="journey">
            <div>
              <h3 className="journey__label" data-reveal>
                Experience
              </h3>
              <ol className="timeline">
                {experience.map((job) => (
                  <li key={job.id} className="timeline__item" data-reveal>
                    <span className="timeline__dot" aria-hidden="true" />
                    <p className="timeline__date">{job.period}</p>
                    <h4>{job.role}</h4>
                    <p className="timeline__org">
                      {job.org} · {job.place}
                    </p>
                    <ul className="timeline__points">
                      {job.duties.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                    <ul className="chips chips--quiet">
                      {job.stack.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="journey__side">
              <h3 className="journey__label" data-reveal>
                Education
              </h3>
              <div className="edu-card" data-reveal>
                <p className="timeline__date">{honours.education.year}</p>
                <h4>{honours.education.degree}</h4>
                <p className="timeline__org">{honours.education.school}</p>
              </div>

              <h3 className="journey__label" data-reveal>
                Honours & leadership
              </h3>
              <ul className="honours" data-reveal>
                <li className="honours__laurel">
                  <strong>
                    {honours.laurel.title} · {honours.laurel.note}
                  </strong>
                </li>
                {honours.offices.map((o) => (
                  <li key={o.role}>
                    <strong>{o.role}</strong>
                    <span>{o.body}</span>
                  </li>
                ))}
                {honours.certificates.map((c) => (
                  <li key={c}>
                    <strong>Certified in {c}</strong>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        {/* ---- what others say ---- */}
        {testimonials.length > 0 && (
          <section id="voices" className="folio-section folio-section--tint">
            <SectionHead eyebrow="What others say" title="In their words" />
            <div className="voices">
              {testimonials.map((t) => (
                <figure key={t.name} className="voice" data-reveal>
                  <blockquote>“{t.quote}”</blockquote>
                  <figcaption>
                    <span className="voice__avatar" aria-hidden="true">
                      {t.name
                        .split(' ')
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                    <span>
                      <strong>{t.name}</strong>
                      <span>
                        {t.role}
                        {t.org ? `, ${t.org}` : ''}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ---- contact ---- */}
        <section id="contact" className="folio-section contact">
          <div className="contact__intro" data-reveal>
            <p className="eyebrow">Contact</p>
            <h2>Let’s build something together.</h2>
            <p>Open to AI/ML and full-stack roles, research collaborations, or simply a good problem to solve. The quickest way to reach me is email.</p>
            <ul className="contact__links">
              <li>
                <span>Email</span>
                <a href={`mailto:${person.email}`}>{person.email}</a>
              </li>
              {person.links.map((l) => (
                <li key={l.label}>
                  <span>{l.label}</span>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.handle} <ExternalIcon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal>
            <ContactCard />
          </div>
        </section>
      </main>

      {/* ---- footer ---- */}
      <footer className="folio-footer">
        <div className="folio-footer__grid">
          <div className="folio-footer__brand">
            <Portrait size={52} />
            <p className="folio-footer__name">{person.name}</p>
            <p>{person.title}</p>
            <p className="folio-footer__words">“{person.words}”</p>
          </div>
          <nav aria-label="Footer">
            <h3>Navigate</h3>
            <ul>
              {NAV.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => scrollToSection(n.id)}>
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3>Connect</h3>
            <ul>
              <li>
                <a href={`mailto:${person.email}`}>Email</a>
              </li>
              {person.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Explore</h3>
            <ul>
              <li>
                <a {...resumeLink}>View &amp; download resume</a>
              </li>
              {onEstate && (
                <li>
                  <button type="button" onClick={onEstate}>
                    Enter the 3D estate
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="folio-footer__base">
          <span>
            © {new Date().getFullYear()} {person.name}
          </span>
          <span>Built with React, three.js and a lot of chai · {person.seat}</span>
        </div>
      </footer>
    </div>
  )
}
