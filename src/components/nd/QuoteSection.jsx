import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { MagneticButton } from '@/components/ui/MagneticButton'

export function QuoteSection() {
  const rootRef = useRef(null)

  useGSAP(() => {
    const inner = rootRef.current?.querySelector('.nd-cta-banner__inner')
    if (inner) {
      gsap.fromTo(
        [...inner.children],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
        },
      )
    }
  }, { scope: rootRef })

  return (
    <section className="nd-cta-banner" ref={rootRef} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="cv-ambient-glow" style={{ top: '50%', transform: 'translate(-50%, -50%)', opacity: 0.2 }} />
      <div className="nd-cta-banner__inner">
        <h2 className="nd-cta-banner__title">
          Ready to <em>scale</em> your brand to <em>new heights?</em>
        </h2>
        <p className="nd-cta-banner__desc">
          If you want to achieve ground-breaking growth with increased sales and profitability with paid ads, then you're in the right place.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <MagneticButton href="/contact" className="cv-btn-primary" strength={10}>
            Work With Us
          </MagneticButton>
          <MagneticButton href="#results" className="cv-btn-secondary" strength={8}>
            Learn More
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
