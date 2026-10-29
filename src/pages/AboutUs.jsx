import { NdNavbar } from '@/components/nd/NdNavbar'
import { TeamSection } from '@/components/nd/TeamSection'
import { QuoteSection } from '@/components/nd/QuoteSection'
import { NdFooter } from '@/components/nd/NdFooter'

export function AboutUs() {
  return (
    <div className="nd-page">
      <NdNavbar />
      <main id="main" style={{ paddingTop: 'clamp(120px, 18vh, 160px)' }}>
        {/* Page Title */}
        <section className="nd-container" style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 80px)' }}>
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>About Conversion</span>
          </div>
          <h1 className="nd-hero__title" style={{ maxWidth: '840px', margin: '0 auto 20px' }}>
            Driven by results, powered by <em>personality.</em>
          </h1>
          <p className="nd-hero__desc" style={{ maxWidth: '620px', margin: '0 auto' }}>
            We're a specialized collective dedicated to helping brands scale sustainably through high-converting advertising, strategic positioning, and technical precision.
          </p>
        </section>

        {/* Notes Grid */}
        <section className="nd-container" style={{ marginBottom: 'clamp(64px, 10vw, 120px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'var(--cv-surface)', border: '1px solid var(--cv-border)', borderRadius: '20px', padding: 'clamp(32px, 5vw, 48px)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cv-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
                On a professional note
              </div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 16px' }}>
                We believe in metrics that directly move the needle.
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--cv-text-muted)', lineHeight: 1.7, margin: 0 }}>
                Too many agencies hide behind vanity metrics and convoluted jargon. We focus entirely on cost per action, conversion velocity, and return on ad spend, treating your budget as if it were our own.
              </p>
            </div>

            <div style={{ background: 'var(--cv-surface)', border: '1px solid var(--cv-border)', borderRadius: '20px', padding: 'clamp(32px, 5vw, 48px)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cv-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
                On a personal note
              </div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 16px' }}>
                True partnership requires authentic connection.
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--cv-text-muted)', lineHeight: 1.7, margin: 0 }}>
                We don't hand your account off to an inexperienced intern. When you work with us, you get direct collaboration with senior practitioners who take the time to deeply understand your mission and users.
              </p>
            </div>
          </div>
        </section>

        <TeamSection />
        <QuoteSection />
      </main>
      <NdFooter />
    </div>
  )
}
