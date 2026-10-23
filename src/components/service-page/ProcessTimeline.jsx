import { useRef } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'

import { SectionHeading } from './SectionHeading'

export function ProcessTimeline({ content }) {
  const rootRef = useRef(null)
  const lineRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return
      const root = rootRef.current
      const line = lineRef.current
      if (!root || !line) return

      gsap.fromTo(
        line,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      )

      const steps = gsap.utils.toArray('.svc-timeline__step', root)
      steps.forEach((step) => {
        gsap.fromTo(
          step,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
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
    <section ref={rootRef} className="svc-block svc-block--wide" aria-labelledby="svc-process-title">
      <div className="svc-page__inner">
        <div className="svc-block__heading svc-block__heading--wide">
          <SectionHeading id="svc-process-title">{content.process.h2}</SectionHeading>
        </div>

        <div className="svc-timeline">
          <div className="svc-timeline__rail" aria-hidden="true">
            <span ref={lineRef} className="svc-timeline__line" />
          </div>
          <ol className="svc-timeline__list">
            {content.process.steps.map((step, index) => (
              <li key={step.title} className="svc-timeline__step">
                <div className="svc-timeline__node" aria-hidden="true">
                  <span className="svc-timeline__dot" />
                </div>
                <div className="svc-timeline__content">
                  <p className="svc-timeline__index">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="svc-timeline__title">{step.title}</h3>
                  <p className="svc-timeline__text">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
