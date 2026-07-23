// src/components/Footer.jsx
import { Link } from 'react-router-dom'
import { ExternalLink, Link2, Mail, Phone, Code2 } from 'lucide-react'

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/AdityaKumarJoshi',
    icon: ExternalLink,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/aditya-kumar-joshi',
    icon: Link2,
  },
  {
    label: 'LeetCode',
    href: 'https://leetcode.com/AdityaKumarJoshi',
    icon: Code2,
  },
  {
    label: 'Email',
    href: 'mailto:adityakjoshi01@gmail.com',
    icon: Mail,
  },
]

export default function Footer() {
  return (
    <footer
      className="border-t py-10 mt-0"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'rgba(167, 151, 138, 0.12)',
      }}
      role="contentinfo"
    >
      <div className="container-content flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Wordmark */}
        <Link
          to="/"
          className="font-mono text-sm tracking-wider"
          style={{ color: 'var(--accent-primary)' }}
          aria-label="Back to home"
        >
          AKJ<span style={{ color: 'var(--text-muted)' }}>_</span>
        </Link>

        {/* Social icons */}
        <nav aria-label="Social links">
          <ul className="flex items-center gap-5" role="list">
            {socials.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="transition-colors duration-200"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-secondary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright */}
        <p
          className="font-mono text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          © {new Date().getFullYear()} Aditya Kumar Joshi
        </p>
      </div>
    </footer>
  )
}
