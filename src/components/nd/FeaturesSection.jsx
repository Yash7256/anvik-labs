import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

export function FeaturesSection() {
  const rootRef = useRef(null)

  useGSAP(() => {
    // Header stagger
    const header = rootRef.current?.querySelector('.nd-section-header')
    if (header) {
      gsap.fromTo(
        [...header.children],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: header, start: 'top 85%' },
        },
      )
    }

    // Cards
    const cards = rootRef.current?.querySelectorAll('.nd-comparison__card') || []
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' },
        },
      )

      // List items staggered reveal
      const items = card.querySelectorAll('.nd-comparison__item')
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.06,
            delay: i * 0.12 + 0.25,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          },
        )
      }
    })
  }, { scope: rootRef })

  return (
    <section id="comparison" className="nd-comparison" ref={rootRef}>
      <div className="nd-container">
        <div className="nd-section-header">
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>Comparison</span>
          </div>
          <h2 className="nd-section-title">
            But, why would you want to work <em>with us?</em>
          </h2>
          <p className="nd-section-desc">
            We operate differently than bloated traditional agencies. See how we contrast side-by-side.
          </p>
        </div>

        <div className="nd-comparison__grid">
          {/* Other Agencies */}
          <div className="nd-comparison__card">
            <h3 className="nd-comparison__title">
              Other Agencies
            </h3>
            <ul className="nd-comparison__list">
              <li className="nd-comparison__item">
                <span className="nd-comparison__icon-cross">✕</span>
                <span>Slow communication</span>
              </li>
              <li className="nd-comparison__item">
                <span className="nd-comparison__icon-cross">✕</span>
                <span>Single channel approach</span>
              </li>
              <li className="nd-comparison__item">
                <span className="nd-comparison__icon-cross">✕</span>
                <span>Outdated growth strategies</span>
              </li>
              <li className="nd-comparison__item">
                <span className="nd-comparison__icon-cross">✕</span>
                <span>Lack of industry research</span>
              </li>
              <li className="nd-comparison__item">
                <span className="nd-comparison__icon-cross">✕</span>
                <span>Outsourced to mediocre talent</span>
              </li>
            </ul>
          </div>

          {/* Conversion / Anvik Labs */}
          <div className="nd-comparison__card nd-comparison__card--conversion">
            <h3 className="nd-comparison__title" style={{ color: 'var(--cv-accent)' }}>
              Conversion
            </h3>
            <ul className="nd-comparison__list">
              <li className="nd-comparison__item">
                <span className="nd-comparison__icon-check">✓</span>
                <span>Constant, proactive communication</span>
              </li>
              <li className="nd-comparison__item">
                <span className="nd-comparison__icon-check">✓</span>
                <span>Omni-channel approach</span>
              </li>
              <li className="nd-comparison__item">
                <span className="nd-comparison__icon-check">✓</span>
                <span>Tailored best-fit solutions</span>
              </li>
              <li className="nd-comparison__item">
                <span className="nd-comparison__icon-check">✓</span>
                <span>Provides industry specific expertise</span>
              </li>
              <li className="nd-comparison__item">
                <span className="nd-comparison__icon-check">✓</span>
                <span>Experts with 10+ years of experience</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
