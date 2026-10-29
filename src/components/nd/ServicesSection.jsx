import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

const SERVICES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    name: 'Meta Ads',
    desc: 'Our team has decades of combined experience creating winning Facebook & Instagram campaigns that convert cold traffic into loyal brand buyers.',
    tags: ['Audience Targeting', 'Creative Strategy', 'Retargeting Funnels', 'A/B Testing'],
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    name: 'Google Ads',
    desc: 'Put your products in front of active buyers and beat out the competition with expert Google Shopping, Search, and YouTube campaign architecture.',
    tags: ['Search Ads', 'Google Shopping', 'Keyword Optimization', 'Negative Matching'],
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
      </svg>
    ),
    name: 'TikTok Ads',
    desc: 'With over 800 million monthly users, TikTok is the strongest link between your brand and the next generation of engaged consumers.',
    tags: ['Short-Form Video', 'UGC Creatives', 'Spark Ads', 'Trend Hijacking'],
  },
]

export function ServicesSection() {
  const rootRef = useRef(null)

  useGSAP(() => {
    // Section header stagger
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

    // Cards + icon pop-in
    const cards = rootRef.current?.querySelectorAll('.nd-service-card') || []
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: { trigger: card, start: 'top 85%' },
        },
      )

      // Icon scale-in
      const icon = card.querySelector('.nd-service-card__icon')
      if (icon) {
        gsap.fromTo(
          icon,
          { opacity: 0, scale: 0.6, rotate: -10 },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.5,
            ease: 'back.out(1.7)',
            delay: i * 0.12 + 0.2,
            scrollTrigger: { trigger: card, start: 'top 85%' },
          },
        )
      }

      // Tag chips pop-in
      const tags = card.querySelectorAll('.nd-service-card__tag')
      gsap.fromTo(
        tags,
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.05,
          delay: i * 0.12 + 0.35,
          scrollTrigger: { trigger: card, start: 'top 85%' },
        },
      )
    })
  }, { scope: rootRef })

  return (
    <section id="services" className="nd-services" ref={rootRef}>
      <div className="nd-container">
        <div className="nd-section-header">
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>Services</span>
          </div>
          <h2 className="nd-section-title">
            How can we help <em>you?</em>
          </h2>
          <p className="nd-section-desc">
            From Google ads, to Meta ads, to TikTok ads, and even content creation, we've got you covered on everything front.
          </p>
        </div>

        <div className="nd-services__grid">
          {SERVICES.map((s) => (
            <div key={s.name} className="nd-service-card">
              <div>
                <div className="nd-service-card__icon">{s.icon}</div>
                <h3 className="nd-service-card__name">{s.name}</h3>
                <p className="nd-service-card__desc">{s.desc}</p>
              </div>
              <div className="nd-service-card__tags">
                {s.tags.map((tag) => (
                  <span key={tag} className="nd-service-card__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
