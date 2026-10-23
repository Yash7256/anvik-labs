import { useRef } from 'react'
import { Link } from 'react-router-dom'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'

import { SectionHeading } from './SectionHeading'

export function AudienceBlock({ content }) {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return
      const rows = gsap.utils.toArray('.svc-audience__row', rootRef.current)
      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { autoAlpha: 0, y: 10 },
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
    <section ref={rootRef} className="svc-block" aria-labelledby="svc-audience-title">
      <div className="svc-page__inner svc-block__grid svc-block__grid--split">
        <div className="svc-block__heading">
          <SectionHeading id="svc-audience-title">{content.audience.h2}</SectionHeading>
        </div>
        <div className="svc-block__content">
          <p className="svc-audience__text">{content.audience.text}</p>
          <div className="svc-audience__rows" aria-hidden="true">
            {content.audience.items.map((item, index) => (
              <div key={item} className="svc-audience__row">
                <span
                  className={`svc-audience__key svc-audience__key--${['cream', 'grey', 'orange'][index] || 'cream'}`}
                />
                <span className="svc-audience__item">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function WhyBlock({ content }) {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const [before, after] = content.why.text.split('Designers Room')

  useGSAP(
    () => {
      if (reducedMotion) return
      const quote = rootRef.current?.querySelector('.svc-quote')
      if (!quote) return

      gsap.fromTo(
        quote,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: quote,
            start: 'top 88%',
            once: true,
            invalidateOnRefresh: true,
          },
        },
      )
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  return (
    <section ref={rootRef} className="svc-block" aria-labelledby="svc-why-title">
      <div className="svc-page__inner svc-block__grid svc-block__grid--split">
        <div className="svc-block__heading">
          <SectionHeading id="svc-why-title">{content.why.h2}</SectionHeading>
        </div>
        <div className="svc-block__content">
          <p className="svc-quote">
            {before}
            <Link className="svc-inline-link" to={content.why.link.href} data-cursor="View">
              Designers Room <span aria-hidden="true">↗</span>
            </Link>
            {after}
          </p>
        </div>
      </div>
    </section>
  )
}
