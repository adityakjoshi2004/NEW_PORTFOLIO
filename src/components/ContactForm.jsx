// src/components/ContactForm.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID' // ← replace with your Formspree ID

export default function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!fields.name.trim()) errs.name = 'Name is required'
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      errs.email = 'Valid email is required'
    if (!fields.message.trim() || fields.message.length < 10)
      errs.message = 'Message must be at least 10 characters'
    return errs
  }

  const handleChange = (e) => {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(fields),
      })
      if (res.ok) {
        setStatus('success')
        setFields({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputStyle = (hasError) => ({
    backgroundColor: 'var(--bg-primary)',
    borderColor: hasError ? 'var(--accent-tertiary)' : 'rgba(167,151,138,0.2)',
    color: 'var(--text-primary)',
    fontFamily: 'Manrope, sans-serif',
  })

  const labelStyle = { color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-6"
      aria-label="Contact form"
    >
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-name" className="text-xs tracking-wider" style={labelStyle}>
          name
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          value={fields.name}
          onChange={handleChange}
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-sm border text-sm outline-none transition-colors duration-200
                     focus:ring-2 focus:ring-offset-0"
          style={{
            ...inputStyle(!!errors.name),
            '--tw-ring-color': 'var(--accent-secondary)',
          }}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'cf-name-error' : undefined}
        />
        {errors.name && (
          <p id="cf-name-error" className="text-xs font-mono" style={{ color: 'var(--accent-tertiary)' }}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-email" className="text-xs tracking-wider" style={labelStyle}>
          email
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-sm border text-sm outline-none transition-colors duration-200"
          style={inputStyle(!!errors.email)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'cf-email-error' : undefined}
        />
        {errors.email && (
          <p id="cf-email-error" className="text-xs font-mono" style={{ color: 'var(--accent-tertiary)' }}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-message" className="text-xs tracking-wider" style={labelStyle}>
          message
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          value={fields.message}
          onChange={handleChange}
          placeholder="Tell me about the opportunity or project..."
          className="w-full px-4 py-3 rounded-sm border text-sm outline-none transition-colors duration-200 resize-y min-h-[120px]"
          style={inputStyle(!!errors.message)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'cf-message-error' : undefined}
        />
        {errors.message && (
          <p id="cf-message-error" className="text-xs font-mono" style={{ color: 'var(--accent-tertiary)' }}>
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'sending' || status === 'success'}
        className="btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? (
          'Sending...'
        ) : (
          <>
            Send Message
            <Send size={15} />
          </>
        )}
      </button>

      {/* Status feedback — mono styled */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 font-mono text-sm"
            style={{ color: 'var(--accent-secondary)' }}
            role="status"
          >
            <CheckCircle size={16} />
            message // sent — I'll get back to you soon.
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 font-mono text-sm"
            style={{ color: 'var(--accent-tertiary)' }}
            role="alert"
          >
            <AlertCircle size={16} />
            error // something went wrong — try emailing directly.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}
