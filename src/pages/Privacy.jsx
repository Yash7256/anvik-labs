import { NdNavbar } from '@/components/nd/NdNavbar'
import { NdFooter } from '@/components/nd/NdFooter'

export function Privacy() {
  return (
    <div className="nd-page">
      <NdNavbar />
      <main id="main" style={{ paddingTop: 'clamp(120px, 18vh, 160px)' }}>
        <div className="nd-container" style={{ maxWidth: '800px', marginBottom: 'clamp(64px, 10vw, 120px)' }}>
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>Privacy</span>
          </div>
          <h1 className="nd-hero__title" style={{ textAlign: 'left', margin: '0 0 16px' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--cv-text-subtle)', marginBottom: '40px' }}>Last updated: Q2 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '15px', lineHeight: 1.8, color: 'var(--cv-text-muted)' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                1. Information We Collect
              </h3>
              <p style={{ margin: 0 }}>
                We collect personal information directly provided by you through discovery forms, inquiry emails, and project communications (such as name, email address, company name, and marketing objectives).
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                2. How We Use Information
              </h3>
              <p style={{ margin: 0 }}>
                Information is used solely to respond to project inquiries, deliver agreed marketing services, and fulfill commercial contracts. We never sell or distribute your data to third-party data brokers.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                3. Data Security
              </h3>
              <p style={{ margin: 0 }}>
                We employ industry-standard encryption protocols (TLS/HTTPS) and access controls to safeguard all transmitted and stored client information.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                4. Your Rights
              </h3>
              <p style={{ margin: 0 }}>
                Under GDPR and international privacy regulations, you retain full rights to request access to, correction of, or permanent deletion of your stored records at any time.
              </p>
            </div>
          </div>
        </div>
      </main>
      <NdFooter />
    </div>
  )
}
