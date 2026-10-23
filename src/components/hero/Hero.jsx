import { useRef } from 'react'

import { Marquee } from '@/components/ui/Marquee'
import { gsap, loadSplitText, useGSAP } from '@/lib/gsap'

import { BokehBackground } from './BokehBackground'
import { Navbar } from './Navbar'
import { StudioMeta } from './StudioMeta'
import { PILLS } from './pills'

const HEADLINE = 'We start with the question.'

export function Hero({
  introReady = true,
  animateIntro = false,
  instant = false,
  reducedMotion = false,
  velocityRef,
}) {
  const rootRef = useRef(null)
  const titleRef = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion || !animateIntro || instant) return

      const root = rootRef.current
      if (!root) return

      gsap.set(root.querySelectorAll('[data-reveal]'), {
        autoAlpha: 0,
        y: 16,
      })
    },
    { scope: rootRef, dependencies: [] },
  )

  useGSAP(
    () => {
      if (!introReady || reducedMotion || !animateIntro || instant) return

      const root = rootRef.current
      const title = titleRef.current
      if (!root || !title) return

      let cancelled = false
      let split

      const play = async () => {
        const SplitText = await loadSplitText()
        if (cancelled) return

        title.setAttribute('aria-label', HEADLINE)
        split = new SplitText(title, {
          type: 'lines,words',
          mask: 'lines',
        })

        split.words.forEach((word) => {
          word.setAttribute('aria-hidden', 'true')
        })

        const revealTargets = gsap.utils.toArray('[data-reveal]', root)
        const lineMasks = split.lines.map((line) => line.parentElement)

        gsap
          .timeline({
            defaults: { ease: 'power4.out' },
            onComplete: () => {
              gsap.set(lineMasks, { overflow: 'visible' })
            },
          })
          .from(
            split.words,
            {
              yPercent: 118,
              duration: 0.95,
              stagger: 0.055,
            },
            0,
          )
          .to(
            revealTargets,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.82,
              stagger: 0.065,
            },
            0.18,
          )
      }

      play().catch(() => {
        if (cancelled) return
        gsap.set([title, ...gsap.utils.toArray('[data-reveal]', root)], {
          autoAlpha: 1,
          y: 0,
        })
      })

      return () => {
        cancelled = true
        split?.revert()
      }
    },
    {
      scope: rootRef,
      dependencies: [introReady, reducedMotion, animateIntro, instant],
    },
  )

  useGSAP(
    () => {
      if (!instant) return

      const root = rootRef.current
      if (!root) return

      gsap.set([titleRef.current, ...gsap.utils.toArray('[data-reveal]', root)], {
        autoAlpha: 1,
        y: 0,
        clearProps: 'transform',
      })
    },
    { scope: rootRef, dependencies: [instant] },
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
        const normalized = gsap.utils.clamp(-1, 1, velocity / 55)

        skew(normalized * 2.4)
        stretch(1 + Math.abs(normalized) * 0.035)
      }

      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: rootRef, dependencies: [reducedMotion, velocityRef] },
  )

  return (
    <section ref={rootRef} id="top" className="hero-section">
      <BokehBackground reducedMotion={reducedMotion} />
      <Navbar />

      <div className="hero-topline" data-reveal>
        <p className="hero-label">
          <span className="hero-label__dot" aria-hidden="true" />
          Technology Studio
        </p>
        <StudioMeta />
      </div>

      <div className="hero-process" aria-label="Our process">
        {PILLS.map((pill, index) => (
          <div key={pill.label} className="hero-process__item" style={{ '--pill-color': pill.color, '--pill-ink': pill.ink }}>
            <span className="hero-process__dot" aria-hidden="true" />
            <span className="hero-process__label">{pill.label}</span>
            <span className="hero-process__index">{String(index + 1).padStart(2, '0')}</span>
            <span className="hero-process__arrow" aria-hidden="true">↗</span>
          </div>
        ))}
      </div>

      <div className="hero-main">
        <div className="hero-copy">
          <h1 ref={titleRef} className="hero-title">
            We start with <br className="hero-title__break" />
            the question<span className="hero-title__period">.</span>
          </h1>

          <div className="hero-meta" data-reveal>
            <p className="hero-tagline">
              Curious by Design. Precise by Engineering.
            </p>

            <div className="hero-text-links">
              <a href="#featured">Own Products</a>
              <span className="hero-text-links__sep">/</span>
              <a href="mailto:hello@anviklabs.com?subject=Freelance%20project">Freelance</a>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-footer" data-reveal>
        <Marquee className="hero-marquee" />
        <a href="#featured" className="scroll-cue">
          <span>↓ scroll</span>
          <span className="scroll-cue__line" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
