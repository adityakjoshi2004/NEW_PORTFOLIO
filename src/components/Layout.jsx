// src/components/Layout.jsx
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Nav from './Nav'
import Footer from './Footer'
import PageTransition from './PageTransition'

export default function Layout() {
  const location = useLocation()

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <Nav />
      <main id="main-content" className="flex-1" role="main">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
