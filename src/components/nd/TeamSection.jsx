import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { MagneticButton } from '@/components/ui/MagneticButton'

const TEAM = [
  {
    name: 'James Dunn',
    role: 'Founder of Conversion',
    image: 'https://framerusercontent.com/images/nH8XKwwz1lIuO90t93Et6aUgxU.png?width=1200&height=1200',
  },
  {
    name: 'Ayesha Dune',
    role: 'Head of Sales',
    image: 'https://framerusercontent.com/images/ORlX1reznkEFWuS1wNveq5fNFFE.png?width=1200&height=904',
  },
  {
    name: 'Joshua Brown',
    role: 'Social Media Executive',
    image: 'https://framerusercontent.com/images/lTKaM2EAlBlgQcH2Sw5ltOovuo.png?width=1200&height=1200',
  },
  {
    name: 'Crystal Lane',
    role: 'Head of Marketing',
    image: 'https://framerusercontent.com/images/4r19SpAS2J6PS1Fuuw1J8qDU8.png?width=800&height=1200',
  },
]

export function TeamSection() {
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

    // Cards entrance
    const cards = rootRef.current?.querySelectorAll('.nd-team-card') || []
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' },
        },
      )

      // Photo parallax subtle shift
      const img = card.querySelector('.nd-team-card__photo img')
      if (img) {
        gsap.fromTo(
          img,
          { y: -10, scale: 1.05 },
          {
            y: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          },
        )
      }
    })
  }, { scope: rootRef })

  return (
    <section id="team" className="nd-team" ref={rootRef}>
      <div className="nd-container">
        <div className="nd-section-header">
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>Team</span>
          </div>
          <h2 className="nd-section-title">
            Meet the <em>incredible</em> team.
          </h2>
          <p className="nd-section-desc">
            We pride ourselves of being the best of the best and our team encapsulates that.
          </p>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
            <MagneticButton href="/contact" className="cv-btn-primary" strength={10}>
              Book a 15-min call
            </MagneticButton>
          </div>
        </div>

        <div className="nd-team__grid">
          {TEAM.map((member) => (
            <div key={member.name} className="nd-team-card">
              <div className="nd-team-card__photo">
                <img src={member.image} alt={member.name} loading="lazy" />
              </div>
              <div className="nd-team-card__info">
                <div className="nd-team-card__name">{member.name}</div>
                <div className="nd-team-card__role">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
