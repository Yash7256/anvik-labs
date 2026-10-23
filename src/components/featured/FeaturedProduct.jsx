import { useRef } from 'react'

import { MagneticButton } from '@/components/ui/MagneticButton'
import { useCountdown } from '@/hooks/useCountdown'
import { useMagneticStrength } from '@/hooks/useMagneticStrength'
import { gsap, loadSplitText, useGSAP } from '@/lib/gsap'

import { Countdown } from './Countdown'
import { ProductPreview } from './ProductPreview'

const PRODUCT_URL = import.meta.env.VITE_DESIGNERS_ROOM_URL || '#featured'

function FeaturedLink({ strength, reducedMotion }) {
  const { linkLabel } = useCountdown()

  return (
    <MagneticButton
      href={PRODUCT_URL}
      className="hero-link featured__link"
      data-cursor="Explore"
      data-featured-reveal
      strength={reducedMotion ? 0 : strength}
    >
      {linkLabel}
      <span className="featured__link-arrow" aria-hidden="true">
        ↗
      </span>
    </MagneticButton>
  )
}

export function FeaturedProduct({ reducedMotion = false, velocityRef }) {
  const rootRef = useRef(null)
  const titleRef = useRef(null)
  const magneticStrength = useMagneticStrength(9)

  useGSAP(
    () => {
      if (reducedMotion) return

      const root = rootRef.current
      if (!root) return

      let cancelled = false
      let split
      let timeline

      const showFallback = () => {
        gsap.set(
          gsap.utils.toArray(
            '[data-featured-reveal], [data-preview-entry]',
            root,
          ),
          { autoAlpha: 1, y: 0, yPercent: 0, scale: 1, scaleX: 1, rotateY: 0 },
        )
        if (split) {
          const masks = split.lines
            .map((line) => line.parentElement)
            .filter(Boolean)

          gsap.set(split.lines, { y: 0, yPercent: 0, autoAlpha: 1 })
          gsap.set(masks, { overflow: 'visible' })
        }
      }

      const play = async () => {
        const SplitText = await loadSplitText()
        if (cancelled) return

        const title = titleRef.current
        if (!title) return

        split = new SplitText(title, { type: 'lines', mask: 'lines', aria: 'none' })
        title.setAttribute('aria-label', 'Designers Room')
        split.lines.forEach((line) => line.setAttribute('aria-hidden', 'true'))

        const lineMasks = split.lines.map((line) => line.parentElement)

        timeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: root,
            start: 'top 78%',
            once: true,
            invalidateOnRefresh: true,
          },
          onComplete: () => {
            gsap.set(lineMasks, { overflow: 'visible' })
          },
        })

        timeline
          .from(
            '.featured__label, .featured__index',
            { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.08 },
            0,
          )
          .fromTo(
            '.featured__rule',
            { scaleX: 0 },
            { scaleX: 1, duration: 1.1, ease: 'power4.inOut' },
            0.08,
          )
          .from(
            split.lines,
            { yPercent: 115, duration: 1.05, stagger: 0.09 },
            0.18,
          )
          .from(
            '.featured__byline',
            { autoAlpha: 0, y: 12, duration: 0.65 },
            0.55,
          )
          .from(
            '.featured__date-pill',
            { autoAlpha: 0, y: 10, duration: 0.6 },
            0.62,
          )
          .from(
            '[data-countdown-roll]',
            { yPercent: 118, duration: 0.9, stagger: 0.05 },
            0.7,
          )
          .from(
            '.featured__days-label, .featured__unit',
            { autoAlpha: 0, y: 10, duration: 0.55, stagger: 0.06 },
            0.82,
          )
          .from(
            '.featured__days-underline',
            { scaleX: 0, duration: 0.8, ease: 'power4.inOut' },
            0.94,
          )
          .from(
            '.featured__lede',
            { autoAlpha: 0, y: 16, duration: 0.75 },
            0.9,
          )
          .from(
            '.featured__link',
            { autoAlpha: 0, y: 14, duration: 0.7 },
            1,
          )
          .fromTo(
            '[data-preview-entry]',
            { autoAlpha: 0, y: 52, scale: 0.955, rotateY: -4 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotateY: 0,
              duration: 1.2,
            },
            0.42,
          )
      }

      play().catch(() => {
        if (cancelled) return
        showFallback()
      })

      return () => {
        cancelled = true
        timeline?.scrollTrigger?.kill()
        timeline?.kill()
        split?.revert()
      }
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  useGSAP(
    () => {
      if (reducedMotion) return

      const root = rootRef.current
      if (!root) return

      const preview = root.querySelector('[data-preview-parallax]')
      if (!preview) return

      const tween = gsap.fromTo(
        preview,
        { y: 22 },
        {
          y: -22,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  useGSAP(
    () => {
      if (reducedMotion || !velocityRef) return

      const root = rootRef.current
      const target = root?.querySelector('.featured__countdown')
      if (!target) return

      const skew = gsap.quickTo(target, 'skewY', {
        duration: 0.45,
        ease: 'power3.out',
      })

      const tick = () => {
        const velocity = velocityRef.current || 0
        const normalized = gsap.utils.clamp(-1, 1, velocity / 70)
        skew(normalized * 2)
      }

      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: rootRef, dependencies: [reducedMotion, velocityRef] },
  )

  return (
    <section
      ref={rootRef}
      id="featured"
      className="featured"
      aria-labelledby="featured-title"
    >
      <span className="featured__glow featured__glow--top" aria-hidden="true" />
      <span
        className="featured__glow featured__glow--bottom"
        aria-hidden="true"
      />
      <span className="featured__grain" aria-hidden="true" />

      <div className="featured__inner">
        <div className="featured__top">
          <p className="featured__label" data-featured-reveal>
            <span className="featured__label-dot" aria-hidden="true" />
            Featured product
          </p>
          <p className="featured__index" data-featured-reveal>
            01 / 04
          </p>
          <span
            className="featured__rule"
            data-featured-reveal
            aria-hidden="true"
          />
        </div>

        <div className="featured__grid">
          <div className="featured__copy">
            <div className="featured__heading">
              <h2
                ref={titleRef}
                id="featured-title"
                className="featured__title"
                aria-label="Designers Room"
              >
                <span className="featured__title-line">Designers</span>
                <span className="featured__title-line">Room</span>
              </h2>
              <p className="featured__byline" data-featured-reveal>
                by Anvik Labs
              </p>
            </div>

            <Countdown />

            <p className="featured__lede" data-featured-reveal>
              A learning and community platform where designers follow clear
              roadmaps, practise on real challenges, and share their experience.
            </p>

            <FeaturedLink
              strength={magneticStrength}
              reducedMotion={reducedMotion}
            />
          </div>

          <div className="featured__preview">
            <ProductPreview reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>
    </section>
  )
}
