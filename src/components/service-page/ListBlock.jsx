import { useRef } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'

import { SectionHeading } from './SectionHeading'

export function CoversBlock({ content }) {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return
      const rows = gsap.utils.toArray('.svc-list__row', rootRef.current)
      if (!rows.length) return

      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { autoAlpha: 0, x: -10 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 88%',
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
    <section ref={rootRef} className="svc-block" aria-labelledby="svc-covers-title">
      <div className="svc-page__inner svc-block__grid svc-block__grid--split">
        <div className="svc-block__heading">
          <SectionHeading id="svc-covers-title">{content.covers.h2}</SectionHeading>
        </div>
        <div className="svc-block__content">
          <ul className="svc-list">
            {content.covers.items.map((item, index) => (
              <li key={item} className="svc-list__row">
                <span className="svc-list__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="svc-list__text">{item}</span>
                <span className="svc-list__arrow" aria-hidden="true">
                  →
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function DeliverablesBlock({ content }) {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return
      const items = gsap.utils.toArray('.svc-deliv__item', rootRef.current)
      if (!items.length) return

      items.forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
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
    <section ref={rootRef} className="svc-block" aria-labelledby="svc-deliv-title">
      <div className="svc-page__inner svc-block__grid svc-block__grid--split svc-block__grid--flip">
        <div className="svc-block__heading">
          <SectionHeading id="svc-deliv-title">{content.deliverables.h2}</SectionHeading>
        </div>
        <div className="svc-block__content">
          <ol className="svc-deliv">
            {content.deliverables.items.map((item, index) => (
              <li key={item} className="svc-deliv__item">
                <span className="svc-deliv__marker" aria-hidden="true" />
                <span className="svc-deliv__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="svc-deliv__text">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
