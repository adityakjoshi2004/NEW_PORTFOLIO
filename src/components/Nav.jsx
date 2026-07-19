// src/components/Nav.jsx
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/',           label: 'Home'       },
  { to: '/about',      label: 'About'      },
  { to: '/experience', label: 'Experience' },
  { to: '/projects',   label: 'Projects'   },
  { to: '/skills',     label: 'Skills'     },
  { to: '/contact',    label: 'Contact'    },
  { to: '/blogs',      label: 'Blog'       },
]

export default function Nav() {
  const { scrollY } = useScroll()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef(null)

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location])

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Scroll-aware background
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1])
  const borderOpacity = useTransform(scrollY, [60, 80], [0, 1])

  return (
    <motion.header
      ref={menuRef}
      className="fixed top-0 left-0 right-0 z-50"
      role="banner"
    >
      {/* Animated nav background */}
      <motion.div
        className="absolute inset-0 border-b"
        style={{
          backgroundColor: `rgba(36, 28, 22, ${bgOpacity.get()})`,
          borderColor: `rgba(167, 151, 138, ${borderOpacity.get() * 0.15})`,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      <nav
        className="container-content relative flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        {/* Logo / name mark */}
        <Link
          to="/"
          className="font-mono text-sm tracking-wider"
          style={{ color: 'var(--accent-primary)' }}
          aria-label="Aditya Kumar Joshi — home"
        >
          AKJ<span style={{ color: 'var(--text-muted)' }}>_</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `font-sans text-sm transition-colors duration-200 ${
                    isActive
                      ? 'text-accent-primary font-semibold'
                      : 'text-primary hover:text-accent-secondary'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent-primary)' : undefined,
                })}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA — desktop */}
        <a
          href="mailto:adityakjoshi01@gmail.com"
          className="hidden md:inline-flex btn-ghost py-2 px-4 text-xs"
        >
          Get in touch
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded focus:outline-none"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
          style={{ color: 'var(--text-primary)' }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <motion.div
        id="mobile-menu"
        initial={false}
        animate={menuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="md:hidden overflow-hidden"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <ul className="container-content py-4 flex flex-col gap-1" role="list">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block py-3 px-2 font-sans text-sm border-b transition-colors duration-200 ${
                    isActive ? 'font-semibold' : ''
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                  borderColor: 'rgba(167, 151, 138, 0.1)',
                })}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className="pt-3">
            <a
              href="mailto:adityakjoshi01@gmail.com"
              className="btn-primary w-full justify-center text-sm"
            >
              Get in touch
            </a>
          </li>
        </ul>
      </motion.div>
    </motion.header>
  )
}
