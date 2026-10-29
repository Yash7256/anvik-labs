import { useState, useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

const CONVERSION_FAQS = [
  {
    question: "How do you tailor Google Ads strategies for different businesses?",
    answer: "We start by analyzing your audience, business metrics, and historical performance data to design bespoke bidding strategies, keyword structures, and copy that targets high-intent customers.",
  },
  {
    question: "What's unique about your Meta Ads approach?",
    answer: "Our approach focuses on rapid creative testing, algorithmic audience matching, and holistic funnel architecture that prevents ad fatigue while scaling return on ad spend.",
  },
  {
    question: "How do you ensure effective TikTok Ads targeting and engagement?",
    answer: "We blend high-performing UGC short-form creative trends with strict event tracking and demographic signals to capture engaged, mobile-native audiences.",
  },
  {
    question: "How do you choose ad formats and placements across platforms?",
    answer: "Every placement is chosen based on user journey touchpoints — from top-of-funnel awareness to instant retargeting across search, stories, and feed.",
  },
  {
    question: "What reporting and analytics do you provide for ad campaign tracking?",
    answer: "We provide live dashboard reporting with granular metrics on CAC, ROAS, CPA, and conversion velocity with zero vanity metrics.",
  },
  {
    question: "Do you offer ongoing ad optimization and management services?",
    answer: "Yes, our team provides weekly creative refreshes, daily bid management, budget pacing, and dedicated Slack support.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const rootRef = useRef(null)

  // Scroll-in: stagger section header children then FAQ items
  useGSAP(() => {
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

    const items = rootRef.current?.querySelectorAll('.nd-faq__item') || []
    gsap.fromTo(
      items,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.07,
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
      },
    )
  }, { scope: rootRef })

  return (
    <section id="faq" className="nd-faq" ref={rootRef}>
      <div className="nd-container">
        <div className="nd-section-header">
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>FAQ</span>
          </div>
          <h2 className="nd-section-title">
            Frequently asked <em>questions.</em>
          </h2>
          <p className="nd-section-desc">
            Everything you need to know about our collaboration, process, timelines, and deliverables.
          </p>
        </div>

        <div className="nd-faq__list">
          {CONVERSION_FAQS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`nd-faq__item${isOpen ? ' nd-faq__item--open' : ''}`}
              >
                <button
                  type="button"
                  className="nd-faq__trigger"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className="nd-faq__question">{item.question}</span>
                  <span className="nd-faq__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {/* CSS grid-template-rows accordion — no layout thrash */}
                <div className={`nd-faq__body${isOpen ? ' nd-faq__body--open' : ''}`}>
                  <div className="nd-faq__body-inner">
                    <div className="nd-faq__answer">
                      <p style={{ margin: 0 }}>{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
