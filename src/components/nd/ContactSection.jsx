import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STUDIO_INFO } from '@/data/neidenData'

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Full Product Design',
    message: '',
  })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contact" style={{ background: 'var(--cv-bg)', padding: 'clamp(72px, 10vw, 120px) 0', borderTop: '1px solid var(--cv-border)' }}>
      <div className="nd-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 'clamp(32px, 6vw, 64px)', alignItems: 'start' }}>
          {/* Left Info */}
          <div>
            <div className="nd-badge">
              <span className="nd-badge__dot" />
              <span>Get in Touch</span>
            </div>
            <h2 className="nd-section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>
              Let's talk about your <em>next breakthrough</em>.
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--cv-text-muted)', lineHeight: 1.6, marginBottom: '32px' }}>
              Have an idea, redesign, or existing product you want to scale? Send us a note and we'll reply within 24 hours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cv-text-subtle)', marginBottom: '4px' }}>Email Us</div>
                <a href={`mailto:${STUDIO_INFO.email}`} style={{ fontSize: '16px', fontWeight: 600, color: 'var(--cv-text)', textDecoration: 'none' }}>
                  {STUDIO_INFO.email}
                </a>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cv-text-subtle)', marginBottom: '4px' }}>Call Us</div>
                <a href={`tel:${STUDIO_INFO.phone}`} style={{ fontSize: '16px', fontWeight: 600, color: 'var(--cv-text)', textDecoration: 'none' }}>
                  {STUDIO_INFO.phone}
                </a>
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', background: 'rgba(255,69,51,0.1)', color: 'var(--cv-accent)', fontSize: '13px', fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cv-accent)' }} />
              <span>Available for projects Q2–Q3</span>
            </div>
          </div>

          {/* Right Form Card */}
          <div style={{ background: 'var(--cv-surface)', border: '1px solid var(--cv-border)', borderRadius: '24px', padding: 'clamp(24px, 4vw, 40px)' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 16px' }}>✓</div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--cv-text)', marginBottom: '8px' }}>Message Received</h3>
                <p style={{ color: 'var(--cv-text-muted)', lineHeight: 1.6 }}>Thank you for reaching out. We will review your project details and get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--cv-text)', marginBottom: '6px' }}>Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--cv-border)', background: '#141414', color: '#fff', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--cv-text)', marginBottom: '6px' }}>Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--cv-border)', background: '#141414', color: '#fff', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--cv-text)', marginBottom: '6px' }}>What service are you looking for?</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--cv-border)', background: '#141414', color: '#fff', fontSize: '14px', outline: 'none' }}
                  >
                    <option value="Full Product Design" style={{ background: '#141414' }}>Full Product Design & Build</option>
                    <option value="UI/UX Redesign" style={{ background: '#141414' }}>UI/UX Redesign</option>
                    <option value="Web Development" style={{ background: '#141414' }}>Web Development & Speed Optimization</option>
                    <option value="Conversion Optimization" style={{ background: '#141414' }}>Conversion Rate Optimization</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--cv-text)', marginBottom: '6px' }}>Project Overview</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your brand, goals, and timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--cv-border)', background: '#141414', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="cv-btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                  Send Message
                </button>
                <div style={{ fontSize: '11px', color: 'var(--cv-text-subtle)', textAlign: 'center' }}>
                  By submitting, you agree to our <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>Privacy Policy</Link>.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
