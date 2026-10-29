import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap'

const RESULTS = [
  {
    client: 'Nostalgie',
    image: 'https://framerusercontent.com/images/AMFThDoNPWPusJqErRvuXGkxQ.png?width=904&height=1200',
    highlight: '47% increase in new customers.',
    stat1Val: 65, stat1Suffix: '%', stat1Label: 'Increase in CTR',
    stat2Val: 37, stat2Suffix: '%', stat2Label: 'Reduction in CPA',
  },
  {
    client: 'Classicé',
    image: 'https://framerusercontent.com/images/Ax0W6SEU8vhKTPP4NrYJymHJIoM.png?width=1200&height=1200',
    highlight: '34% increase in online sales.',
    stat1Val: 57, stat1Suffix: '%', stat1Label: 'Increase in CTR',
    stat2Val: 69, stat2Suffix: '%', stat2Label: 'Reduction in CPR',
  },
  {
    client: 'Yogamy',
    image: 'https://framerusercontent.com/images/sLRaKXkHf8RbnHdn7LZOqzXjnu4.png?width=1200&height=1200',
    highlight: 'From $0 to $1,000,000 in sales.',
    stat1Val: 85, stat1Suffix: '%', stat1Label: 'Increase in CTR',
    stat2Val: 36, stat2Suffix: '%', stat2Label: 'Reduction in CPR',
  },
]

function animateCounter(el, target, suffix) {
  const obj = { val: 0 }
  gsap.to(obj, {
    val: target,
    duration: 2,
    ease: 'power2.out',
    onUpdate() {
      el.textContent = Math.round(obj.val) + suffix
    },
  })
}

export function WhoWeAreSection() {
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

    // Cards scroll-in
    const cards = rootRef.current?.querySelectorAll('.nd-result-card') || []
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: { trigger: card, start: 'top 85%' },
        },
      )
    })

    // Stat count-up — triggered when first stat enters viewport
    const statEls = rootRef.current?.querySelectorAll('[data-count]') || []
    statEls.forEach((el) => {
      const target = parseFloat(el.dataset.count)
      const suffix = el.dataset.suffix || ''
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => animateCounter(el, target, suffix),
      })
    })
  }, { scope: rootRef })

  return (
    <section id="products" className="nd-results" ref={rootRef} aria-label="Our Products and Results">
      <span id="results" className="sr-only" />
      <div className="nd-container">
        <div className="nd-section-header">
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>Results</span>
          </div>
          <h2 className="nd-section-title">
            Results speak for <em>themselves.</em>
          </h2>
          <p className="nd-section-desc">
            We've worked across a number of industries and have achieved some incredible results with some incredible people and brands.
          </p>
        </div>

        <div className="nd-results__grid">
          {RESULTS.map((res) => (
            <div key={res.client} className="nd-result-card">
              <div className="nd-result-card__image">
                <img src={res.image} alt={res.client} loading="lazy" />
              </div>
              <div className="nd-result-card__body">
                <div>
                  <div className="nd-result-card__client">{res.client}</div>
                  <div className="nd-result-card__metric-big">{res.highlight}</div>
                </div>
                <div className="nd-result-card__stats">
                  <div>
                    <div
                      className="nd-result-card__stat-num"
                      data-count={res.stat1Val}
                      data-suffix={res.stat1Suffix}
                    >
                      {res.stat1Val}{res.stat1Suffix}
                    </div>
                    <div className="nd-result-card__stat-label">{res.stat1Label}</div>
                  </div>
                  <div>
                    <div
                      className="nd-result-card__stat-num"
                      data-count={res.stat2Val}
                      data-suffix={res.stat2Suffix}
                    >
                      {res.stat2Val}{res.stat2Suffix}
                    </div>
                    <div className="nd-result-card__stat-label">{res.stat2Label}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
