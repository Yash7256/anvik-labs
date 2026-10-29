import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

const STEPS = [
  {
    num: '01 / AUDIT',
    title: 'Funnel Audit',
    desc: "We'll start by analyzing your sales funnel and seeing what's holding you back.",
  },
  {
    num: '02 / SETUP',
    title: 'Campaign Setup',
    desc: 'Then, with your business goals in mind, we will set up the advertising campaigns.',
  },
  {
    num: '03 / SCALE',
    title: 'Maximize Profit',
    desc: "We'll then work towards driving the cost per action down to maximize profit.",
  },
]

export function ProcessSection() {
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

    // Step cards
    const cards = rootRef.current?.querySelectorAll('.nd-process__card') || []
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

      // Step connector line
      const connector = card.querySelector('.nd-process__connector')
      if (connector) {
        gsap.fromTo(
          connector,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.7,
            delay: i * 0.12 + 0.3,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          },
        )
      }
    })
  }, { scope: rootRef })

  return (
    <section id="process" className="nd-process" ref={rootRef}>
      <div className="nd-container">
        <div className="nd-section-header">
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>Process</span>
          </div>
          <h2 className="nd-section-title">
            Our simple 3-step process to <em>skyrocket</em> your business.
          </h2>
          <p className="nd-section-desc">
            From Google ads, to Meta ads, to TikTok ads, and even content creation, we've got you covered on everything front.
          </p>
        </div>

        <div className="nd-process__grid">
          {STEPS.map((step) => (
            <div key={step.num} className="nd-process__card">
              <div className="nd-process__step-num">{step.num}</div>
              <h3 className="nd-process__card-title">{step.title}</h3>
              <p className="nd-process__card-desc">{step.desc}</p>
              <div className="nd-process__connector" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
