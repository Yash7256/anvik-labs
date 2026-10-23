import { useRef } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'

import { SectionHeading } from './SectionHeading'

export function StandardsBlock({ content, flipped = false }) {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return
      const rows = gsap.utils.toArray('.svc-standards__row', rootRef.current)
      if (!rows.length) return

      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 90%',
              once: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  return (
    <section ref={rootRef} className="svc-block" aria-labelledby="svc-standards-title">
      <div
        className={`svc-page__inner svc-block__grid svc-block__grid--split${flipped ? ' svc-block__grid--flip' : ''}`}
      >
        <div className="svc-block__heading">
          <SectionHeading id="svc-standards-title">{content.standards.h2}</SectionHeading>
        </div>
        <div className="svc-block__content">
          <ul className="svc-standards">
            {content.standards.items.map((item, index) => (
              <li
                key={item.title}
                className="svc-standards__row"
                data-index={String(index + 1).padStart(2, '0')}
              >
                <p className="svc-standards__text">
                  <strong>{item.title}.</strong>{' '}
                  <span className="svc-standards__description">{item.text}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
