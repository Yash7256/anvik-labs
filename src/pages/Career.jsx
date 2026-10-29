import { useState } from 'react'
import { NdNavbar } from '@/components/nd/NdNavbar'
import { CAREER_ROLES } from '@/data/neidenData'
import { ContactSection } from '@/components/nd/ContactSection'
import { NdFooter } from '@/components/nd/NdFooter'

export function Career() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [applied, setApplied] = useState(false)

  return (
    <div className="nd-page">
      <NdNavbar />
      <main id="main" style={{ paddingTop: 90 }}>
        {/* Header */}
        <section style={{ padding: 'clamp(48px, 6vw, 88px) var(--nd-gutter)', borderBottom: '1px solid var(--cv-border)' }}>
          <div className="nd-container" style={{ maxWidth: 960, margin: '0 auto' }}>
            <div className="nd-badge">
              <span className="nd-badge__dot" />
              <span>Careers</span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--cv-font-sans)',
                fontSize: 'clamp(36px, 6vw, 68px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--cv-text)',
                margin: '20px 0',
              }}
            >
              Build the future of <em style={{ fontFamily: 'var(--cv-font-serif)', fontStyle: 'italic', fontWeight: 400 }}>growth</em> with us.
            </h1>
            <p
              style={{
                fontSize: 'clamp(16px, 1.4vw, 20px)',
                color: 'var(--cv-text-muted)',
                lineHeight: 1.6,
                maxWidth: 720,
              }}
            >
              We are a high-performance marketing and product optimization agency. We offer a high-trust, fast-paced
              environment where you drive direct measurable impact alongside world-class peers.
            </p>
          </div>
        </section>

        {/* Current Openings */}
        <section style={{ padding: 'clamp(48px, 6vw, 96px) var(--nd-gutter)' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: 'var(--cv-text)', marginBottom: 36, letterSpacing: '-0.02em' }}>
              Current Openings
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {CAREER_ROLES.map((role) => (
                <div
                  key={role.title}
                  style={{
                    background: 'var(--cv-surface)',
                    border: '1px solid var(--cv-border)',
                    borderRadius: 20,
                    padding: 'clamp(24px, 4vw, 36px)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--cv-accent)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        <span>{role.department}</span>
                        <span>·</span>
                        <span>{role.location}</span>
                        <span>·</span>
                        <span>{role.type}</span>
                      </div>
                      <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--cv-text)', margin: '12px 0 8px' }}>{role.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.title)
                        setApplied(false)
                      }}
                      className="cv-btn-primary"
                    >
                      Apply Now
                    </button>
                  </div>

                  <p style={{ fontSize: 15, color: 'var(--cv-text-muted)', lineHeight: 1.7, margin: '16px 0 24px' }}>
                    {role.description}
                  </p>

                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--cv-text)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
                      What We Look For:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: 'var(--cv-text-muted)', lineHeight: 1.8 }}>
                      {role.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Application Modal/Drawer if clicked */}
            {selectedRole && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.85)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    background: 'var(--cv-surface)',
                    border: '1px solid var(--cv-border)',
                    borderRadius: 24,
                    maxWidth: 540,
                    width: '100%',
                    padding: 36,
                    position: 'relative',
                  }}
                >
                  <button
                    onClick={() => setSelectedRole(null)}
                    style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}
                  >
                    ×
                  </button>
                  {applied ? (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>✓</div>
                      <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--cv-text)', marginBottom: 8 }}>Application Received!</h3>
                      <p style={{ color: 'var(--cv-text-muted)', fontSize: 14 }}>We have received your application for <strong>{selectedRole}</strong>. We'll be in touch soon.</p>
                    </div>
                  ) : (
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--cv-text)', marginBottom: 4 }}>Apply for {selectedRole}</h3>
                      <p style={{ fontSize: 13, color: 'var(--cv-text-muted)', marginBottom: 20 }}>Fill in your details to join our squad.</p>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          setApplied(true)
                        }}
                        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                      >
                        <input
                          required
                          placeholder="Full Name"
                          style={{ padding: '12px 16px', borderRadius: 10, background: '#141414', border: '1px solid var(--cv-border)', color: '#fff', fontSize: 14 }}
                        />
                        <input
                          required
                          type="email"
                          placeholder="Email Address"
                          style={{ padding: '12px 16px', borderRadius: 10, background: '#141414', border: '1px solid var(--cv-border)', color: '#fff', fontSize: 14 }}
                        />
                        <input
                          required
                          type="url"
                          placeholder="LinkedIn or Portfolio URL"
                          style={{ padding: '12px 16px', borderRadius: 10, background: '#141414', border: '1px solid var(--cv-border)', color: '#fff', fontSize: 14 }}
                        />
                        <button type="submit" className="cv-btn-primary" style={{ marginTop: 8 }}>
                          Submit Application
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <ContactSection />
      </main>
      <NdFooter />
    </div>
  )
}
