import { useState } from 'react'
import { NdNavbar } from '@/components/nd/NdNavbar'
import { FaqSection } from '@/components/nd/FaqSection'
import { NdFooter } from '@/components/nd/NdFooter'

export function Contacts() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'Meta Ads',
    budget: '$5,000 - $10,000',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="nd-page">
      <NdNavbar />
      <main id="main" style={{ paddingTop: 'clamp(120px, 18vh, 160px)' }}>
        {/* Header */}
        <div className="nd-container" style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 80px)' }}>
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>Contact Us</span>
          </div>
          <h1 className="nd-hero__title" style={{ maxWidth: '840px', margin: '0 auto 20px' }}>
            Ready to scale your brand with <em>paid ads?</em>
          </h1>
          <p className="nd-hero__desc" style={{ maxWidth: '580px', margin: '0 auto' }}>
            Work With US or send us a message below. We'll audit your current funnel and provide an actionable roadmap to increase conversions.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="nd-container" style={{ maxWidth: '720px', marginBottom: 'clamp(64px, 10vw, 120px)' }}>
          <div style={{ background: 'var(--cv-surface)', border: '1px solid var(--cv-border)', borderRadius: '24px', padding: 'clamp(28px, 5vw, 48px)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--cv-accent-soft)', color: 'var(--cv-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 20px' }}>✓</div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Inquiry Received</h2>
                <p style={{ color: 'var(--cv-text-muted)', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto' }}>
                  Thank you for reaching out. A partner from our team will review your business and reply within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--cv-border)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--cv-border)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Primary Service</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--cv-border)', background: '#171717', color: '#fff', fontSize: '14px', outline: 'none' }}
                    >
                      <option value="Meta Ads">Meta Ads (Facebook & Instagram)</option>
                      <option value="Google Ads">Google Ads & Shopping</option>
                      <option value="TikTok Ads">TikTok Ads</option>
                      <option value="Full Omni-Channel">Full Omni-Channel Growth</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Monthly Ad Spend</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--cv-border)', background: '#171717', color: '#fff', fontSize: '14px', outline: 'none' }}
                    >
                      <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                      <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                      <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                      <option value="$25,000+">$25,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Tell us about your brand & goals</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Current revenue, target CPA, and challenges you are facing..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--cv-border)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="cv-btn-primary" style={{ padding: '15px', fontSize: '15px', marginTop: '8px' }}>
                  Book Discovery Call
                </button>
              </form>
            )}
          </div>
        </div>

        <FaqSection />
      </main>
      <NdFooter />
    </div>
  )
}
