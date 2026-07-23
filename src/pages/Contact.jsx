// src/pages/Contact.jsx
import { motion } from 'framer-motion'
import { Mail, Phone, ExternalLink, Link2, Code2 } from 'lucide-react'
import SectionEyebrow from '../components/SectionEyebrow'
import ContactForm from '../components/ContactForm'

const directLinks = [
  {
    label: 'Email',
    value: 'adityakjoshi01@gmail.com',
    href: 'mailto:adityakjoshi01@gmail.com',
    icon: Mail,
  },
  {
    label: 'LinkedIn',
    value: 'aditya-kumar-joshi',
    href: 'https://www.linkedin.com/in/aditya-kumar-joshi-3919bb255/',
    icon: Link2,
  },
  {
    label: 'GitHub',
    value: 'AdityaKumarJoshi',
    href: 'https://github.com/adityakjoshi2004',
    icon: ExternalLink,
  },
  {
    label: 'LeetCode',
    value: 'AdityaKumarJoshi',
    href: 'https://leetcode.com/u/adityajoshi04/',
    icon: Code2,
  },
]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
})

export default function Contact() {
  return (
    <article className="section-pad pt-28 md:pt-32" aria-label="Contact">
      <div className="container-content">

        <SectionEyebrow>contact</SectionEyebrow>
        <motion.h1
          className="font-display font-light text-h1 md:text-h1-lg mb-4"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          {...fade()}
        >
          Let's Talk
        </motion.h1>
        <motion.p
          className="font-sans text-base max-w-xl mb-14 md:mb-16"
          style={{ color: 'var(--text-muted)' }}
          {...fade(0.12)}
        >
          Whether it's a job opportunity, a hackathon collab, or just a technical question - I'm reachable.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">

          {/* Direct links */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-8"
            {...fade(0.1)}
          >
            <p className="eyebrow">direct links</p>
            <ul className="flex flex-col gap-5" role="list">
              {directLinks.map(({ label, value, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-4 group"
                    aria-label={`${label}: ${value}`}
                  >
                    <span
                      className="mt-0.5 p-2 rounded-sm border transition-colors duration-200 shrink-0"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'rgba(167,151,138,0.12)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      <Icon size={16} strokeWidth={1.5} />
                    </span>
                    <div>
                      <p
                        className="font-mono text-[0.65rem] tracking-wider mb-0.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {label.toLowerCase()}
                      </p>
                      <p
                        className="font-sans text-sm font-medium transition-colors duration-200 group-hover:text-accent-secondary"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-secondary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                      >
                        {value}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact form */}
          <motion.div className="lg:col-span-3" {...fade(0.2)}>
            <p className="eyebrow mb-8">send a message</p>
            <ContactForm />
          </motion.div>

        </div>
      </div>
    </article>
  )
}
