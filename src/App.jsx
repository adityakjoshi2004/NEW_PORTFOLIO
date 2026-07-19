// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Experience from './pages/Experience'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import Contact from './pages/Contact'
import Blogs from './pages/Blogs'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index        element={<Home />}       />
        <Route path="about"      element={<About />}      />
        <Route path="experience" element={<Experience />} />
        <Route path="projects"   element={<Projects />}   />
        <Route path="skills"     element={<Skills />}     />
        <Route path="contact"    element={<Contact />}    />
        <Route path="blogs"     element={<Blogs />}      />
        {/* 404 fallback */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 pt-24">
            <p className="font-mono text-xs" style={{ color: 'var(--accent-primary)' }}>404</p>
            <h1 className="font-display text-4xl" style={{ color: 'var(--text-primary)' }}>Page not found</h1>
          </div>
        } />
      </Route>
    </Routes>
  )
}
