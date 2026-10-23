import { useRef, useState } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'

import { SectionHeading } from './SectionHeading'

export function Faq({ content }) {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const [openItems, setOpenItems] = useState(() => {
    if (!content.faq?.items?.length) return []
    return [0]
  })

  useGSAP(
    () => {
      if (reducedMotion) return
      const items = gsap.utils.toArray('.svc-faq__item', rootRef.current)
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 92%',
              once: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  const toggleItem = (index) => {
    setOpenItems((current) => {
      if (current.includes(index)) {
        return current.filter((item) => item !== index)
      }
      return [...current, index]
    })
  }

  return (
    <section ref={rootRef} className="svc-block" aria-labelledby="svc-faq-title">
      <div className="svc-page__inner svc-block__grid svc-block__grid--split">
        <div className="svc-block__heading">
          <SectionHeading id="svc-faq-title">{content.faq.h2}</SectionHeading>
        </div>
        <div className="svc-block__content">
          <div className="svc-faq">
            {content.faq.items.map((item, index) => {
              const isOpen = openItems.includes(index)
              const panelId = `svc-faq-panel-${index}`
              const buttonId = `svc-faq-button-${index}`
              return (
                <article key={item.question} className="svc-faq__item">
                  <h3 className="svc-faq__question">
                    <button
                      id={buttonId}
                      className="svc-faq__button"
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(index)}
                    >
                      <span className="svc-faq__question-text">{item.question}</span>
                      <span className="svc-faq__toggle" aria-hidden="true">
                        <span className="svc-faq__toggle-bar" />
                        <span className="svc-faq__toggle-bar svc-faq__toggle-bar--vertical" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    className="svc-faq__panel"
                    role="region"
                    aria-labelledby={buttonId}
                    data-open={isOpen}
                    inert={!isOpen}
                  >
                    <div className="svc-faq__panel-inner">
                      <p className="svc-faq__answer">{item.answer}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
