import { NdNavbar } from '@/components/nd/NdNavbar'
import { NdFooter } from '@/components/nd/NdFooter'

export function Terms() {
  return (
    <div className="nd-page">
      <NdNavbar />
      <main id="main" style={{ paddingTop: 'clamp(120px, 18vh, 160px)' }}>
        <div className="nd-container" style={{ maxWidth: '800px', marginBottom: 'clamp(64px, 10vw, 120px)' }}>
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>Legal</span>
          </div>
          <h1 className="nd-hero__title" style={{ textAlign: 'left', margin: '0 0 16px' }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--cv-text-subtle)', marginBottom: '40px' }}>Last updated: Q2 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '15px', lineHeight: 1.8, color: 'var(--cv-text-muted)' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                1. Scope of Services
              </h3>
              <p style={{ margin: 0 }}>
                Conversion provides digital advertising management, strategic product design, interface engineering, and performance marketing under agreed statements of work.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                2. Intellectual Property
              </h3>
              <p style={{ margin: 0 }}>
                Upon receipt of full payment, all custom creative deliverables and campaign collateral belong exclusively to the client, excluding internal agency benchmarks and third-party ad network platforms.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                3. Payment &amp; Cancellation
              </h3>
              <p style={{ margin: 0 }}>
                Monthly retainers are billed on a 30-day recurring basis with no lock-in contracts. Either party may terminate with 14 days written notice prior to the next billing cycle.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                4. Confidentiality
              </h3>
              <p style={{ margin: 0 }}>
                We maintain strict non-disclosure of all proprietary client metrics, conversion rates, and sales data under commercial confidentiality standards.
              </p>
            </div>
          </div>
        </div>
      </main>
      <NdFooter />
    </div>
  )
}
