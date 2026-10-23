import { useRef } from 'react'

import { MagneticButton } from '@/components/ui/MagneticButton'
import { useMagneticStrength } from '@/hooks/useMagneticStrength'
import { gsap, useGSAP } from '@/lib/gsap'

import { SplitPill } from './SplitPill'
import { TrackRow } from './TrackRow'

export function WhatWeDo({ reducedMotion = false, velocityRef }) {
  const rootRef = useRef(null)
  const titleRef = useRef(null)
  const sourceAnchorRef = useRef(null)
  const sourcePillRef = useRef(null)
  const sourceLabelRef = useRef(null)
  const sourceGlowRef = useRef(null)
  const magneticStrength = useMagneticStrength(9)

  useGSAP(
    () => {
      if (reducedMotion) return

      const root = rootRef.current
      if (!root) return

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: root,
          start: 'top 82%',
          once: true,
          invalidateOnRefresh: true,
        },
      })

      timeline
        .from('.what__label, .what__index', {
          autoAlpha: 0,
          y: 12,
          duration: 0.55,
          stagger: 0.08,
        })
        .fromTo(
          '.what__rule',
          { scaleX: 0 },
          { scaleX: 1, duration: 1.05, ease: 'power4.inOut' },
          0.05,
        )
        .from(
          '.what__title-line-inner',
          { yPercent: 112, duration: 0.92, stagger: 0.08 },
          0.12,
        )
        .from(
          '.what__source-anchor',
          { autoAlpha: 0, y: 18, scale: 0.96, duration: 0.8 },
          0.3,
        )

      return () => {
        timeline.scrollTrigger?.kill()
        timeline.kill()
      }
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  useGSAP(
    () => {
      if (reducedMotion) return

      const root = rootRef.current
      if (!root) return

      const media = gsap.matchMedia()

      media.add('(min-width: 1024px)', () => {
        const anchor = root.querySelector('[data-pill-anchor]')
        const source = root.querySelector('[data-source-pill]')
        const sourceLabel = root.querySelector('[data-source-label]')
        const sourceGlow = root.querySelector('[data-source-glow]')
        const frames = gsap.utils.toArray('[data-pill-frame]', root)
        const pills = gsap.utils.toArray('[data-pill-target]', root)
        const fills = gsap.utils.toArray('[data-pill-fill]', root)
        const contents = gsap.utils.toArray('[data-row-content]', root)

        if (
          !anchor ||
          !source ||
          !sourceLabel ||
          !sourceGlow ||
          !frames.length ||
          frames.length !== pills.length
        ) {
          return
        }

        const getStart = (index) => {
          const sourceRect = anchor.getBoundingClientRect()
          const frameRect = frames[index].getBoundingClientRect()

          return {
            x:
              sourceRect.left +
              sourceRect.width / 2 -
              (frameRect.left + frameRect.width / 2),
            y:
              sourceRect.top +
              sourceRect.height / 2 -
              (frameRect.top + frameRect.height / 2),
            scaleX: sourceRect.width / frameRect.width,
            scaleY: sourceRect.height / frameRect.height,
            autoAlpha: 0,
          }
        }

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=128%',
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        })

        timeline
          .to(
            source,
            {
              scale: 1.055,
              autoAlpha: 0,
              duration: 0.34,
              ease: 'power1.in',
            },
            0,
          )
          .to(
            sourceLabel,
            {
              autoAlpha: 0,
              yPercent: -72,
              duration: 0.18,
              ease: 'power1.in',
            },
            0,
          )
          .to(
            sourceGlow,
            { autoAlpha: 0, scale: 1.9, duration: 0.34, ease: 'power1.out' },
            0,
          )

        pills.forEach((pill, index) => {
          timeline.fromTo(
            pill,
            {
              x: () => getStart(index).x,
              y: () => getStart(index).y,
              scaleX: () => getStart(index).scaleX,
              scaleY: () => getStart(index).scaleY,
              autoAlpha: 0,
            },
            {
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              autoAlpha: 1,
              duration: 0.56,
              ease: 'power2.inOut',
            },
            0.05 + index * 0.04,
          )
        })

        timeline.fromTo(
          fills,
          { opacity: 0.96 },
          { opacity: 0.055, duration: 0.48, ease: 'none' },
          0.44,
        )

        contents.forEach((content, index) => {
          timeline.fromTo(
            content,
            { autoAlpha: 0, y: 26 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.18,
              ease: 'power2.out',
            },
            0.56 + index * 0.11,
          )
        })

        return () => {
          timeline.scrollTrigger?.kill()
          timeline.kill()
        }
      })

      media.add('(max-width: 1023px)', () => {
        const targets = gsap.utils.toArray('[data-pill-target]', root)
        const contents = gsap.utils.toArray('[data-row-content]', root)
        if (!targets.length) return

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 76%',
            once: true,
            invalidateOnRefresh: true,
          },
          defaults: { ease: 'power3.out' },
        })

        timeline
          .from(targets, {
            autoAlpha: 0,
            scaleX: 0.9,
            scaleY: 0.68,
            duration: 0.72,
            stagger: 0.12,
          })
          .from(
            contents,
            { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.12 },
            0.12,
          )

        return () => {
          timeline.scrollTrigger?.kill()
          timeline.kill()
        }
      })

      return () => media.revert()
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  useGSAP(
    () => {
      if (reducedMotion || !velocityRef) return

      const title = titleRef.current
      if (!title) return

      const skew = gsap.quickTo(title, 'skewY', {
        duration: 0.45,
        ease: 'power3.out',
      })
      const stretch = gsap.quickTo(title, 'scaleY', {
        duration: 0.5,
        ease: 'power3.out',
      })

      const tick = () => {
        const velocity = velocityRef.current || 0
        const normalized = gsap.utils.clamp(-1, 1, velocity / 70)

        skew(normalized * 2.1)
        stretch(1 + Math.abs(normalized) * 0.025)
      }

      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: rootRef, dependencies: [reducedMotion, velocityRef] },
  )

  return (
    <section
      ref={rootRef}
      id="what-we-do"
      className="what"
      aria-labelledby="what-title"
    >
      <span className="what__glow what__glow--one" aria-hidden="true" />
      <span className="what__glow what__glow--two" aria-hidden="true" />
      <span className="what__grain" aria-hidden="true" />

      <div className="what__inner">
        <div className="what__top">
          <p className="what__label">
            <span className="what__label-dot" aria-hidden="true" />
            What we do
          </p>
          <p className="what__index">02 / 04</p>
          <span className="what__rule" aria-hidden="true" />
        </div>

        <div className="what__heading">
          <h2
            ref={titleRef}
            id="what-title"
            className="what__title"
            aria-label="One studio, two tracks."
          >
            <span className="what__title-line">
              <span className="what__title-line-inner">One studio,</span>
            </span>
            <span className="what__title-line">
              <span className="what__title-line-inner">
                two tracks<span className="what__title-dot">.</span>
              </span>
            </span>
          </h2>

          <SplitPill
            anchorRef={sourceAnchorRef}
            pillRef={sourcePillRef}
            labelRef={sourceLabelRef}
            glowRef={sourceGlowRef}
            reducedMotion={reducedMotion}
          />
        </div>

        <div className="what__rows">
          <TrackRow
            index="01"
            variant="one"
            title="Our own products"
            copy={
              <>
                Our main focus: we investigate real problems and turn them into
                products.{' '}
                <MagneticButton
                  href="#featured"
                  className="hero-link what__inline-link"
                  data-cursor="View"
                  strength={reducedMotion ? 0 : magneticStrength}
                >
                  Designers Room
                  <span aria-hidden="true">↗</span>
                </MagneticButton>{' '}
                is the first.
              </>
            }
          />

          <TrackRow
            index="02"
            variant="two"
            title="Client work"
            copy="Our second focus: UI/UX design and web development for startups, businesses and individuals who need a careful technology partner."
            link={
              <MagneticButton
                href="#contact"
                className="hero-link what__row-link"
                data-cursor="Talk"
                strength={reducedMotion ? 0 : magneticStrength}
              >
                Work with us
                <span aria-hidden="true">↗</span>
              </MagneticButton>
            }
            tag="UI/UX Design · Web Development"
          />
        </div>
      </div>
    </section>
  )
}
