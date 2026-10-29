import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, useGSAP } from '@/lib/gsap'

const PLANS = [
  {
    name: 'Launch',
    tagline: 'Ideal for startups needing a high-impact, high-converting presence to hit the market.',
    price: '1,300',
    period: '/month',
    popular: false,
    features: [
      'Custom Landing Page Design',
      'Full Responsive Implementation',
      'SEO & Performance Tuning',
      'Direct Slack Communication',
      '48-hour revision turnarounds',
    ],
  },
  {
    name: 'Growth',
    tagline: 'Built for scaling teams needing multi-page architecture, design systems, and higher volume.',
    price: '3,300',
    period: '/month',
    popular: true,
    features: [
      'Multi-Page Web Application',
      'Complete UI/UX Design System',
      'CMS Integration & Dynamic Views',
      'Interactive Micro-Animations',
      'Dedicated Tech Lead Support',
      'Weekly Strategy & Review Syncs',
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'Full bespoke product engineering and digital partnership for ambitious organizations.',
    price: '5,300',
    period: '/month',
    popular: false,
    features: [
      'Everything in Growth',
      'Custom Full-Stack Engineering',
      'Continuous Conversion Auditing',
      'Multi-Brand & Sub-Brand Systems',
      'Priority 24/7 Dedicated Support',
      'Custom Contract & SLA Terms',
    ],
  },
]

export function PricingSection() {
  const rootRef = useRef(null)

  useGSAP(() => {
    const cards = rootRef.current?.querySelectorAll('.nd-pricing-card') || []
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' },
        },
      )
    })
  }, { scope: rootRef })

  return (
    <section id="pricing" className="nd-pricing" ref={rootRef} style={{ background: '#FCFCFA', padding: 'clamp(72px, 10vw, 120px) 0' }}>
      <div className="nd-container">
        <div className="nd-section-header">
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>Pricing</span>
          </div>
          <h2 className="nd-section-title">
            Transparent pricing for <em>every stage</em>.
          </h2>
          <p className="nd-section-desc">
            Simple, predictable investment models designed around your timeline and scale. No hidden fees.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="nd-pricing-card"
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                border: plan.popular ? '2px solid var(--cv-accent)' : '1px solid rgba(0,0,0,0.08)',
                padding: '36px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: plan.popular ? '0 12px 36px rgba(255,106,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--cv-text)' }}>
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px', background: 'var(--cv-accent)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Most Popular
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--cv-text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>
                  {plan.tagline}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--cv-text)' }}>$</span>
                  <span style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--cv-text)', lineHeight: 1 }}>{plan.price}</span>
                  <span style={{ fontSize: '14px', color: 'var(--cv-text-muted)' }}>{plan.period}</span>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cv-text)', marginBottom: '16px' }}>
                  What's included:
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--cv-text)' }}>
                      <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,106,0,0.1)', color: 'var(--cv-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link
                  to="/contacts"
                  className={plan.popular ? 'cv-btn-primary' : 'cv-btn-secondary'}
                  style={{ width: '100%' }}
                >
                  Get Started with {plan.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
