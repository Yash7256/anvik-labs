import { useRef, useState } from 'react'

import { Marquee } from '@/components/ui/Marquee'
import { gsap, loadSplitText, ScrollTrigger, useGSAP } from '@/lib/gsap'

import { BokehBackground } from './BokehBackground'
import { Navbar } from './Navbar'
import { PillStack } from './PillStack'

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
  const stackRef = useRef(null)
  const activeIndexRef = useRef(-1)
  const [stackMode, setStackMode] = useState('idle')

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
      if (reducedMotion) return

      const root = rootRef.current
      if (!root) return

      const stack = root.querySelector('.pill-stack__body')
      const copy = root.querySelector('.hero-copy')

      const media = gsap.matchMedia()

      media.add('(min-width: 768px)', () => {
        const trigger = ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: '+=110%',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress
            const next =
              progress <= 0.001
                ? -1
                : Math.min(3, Math.floor(progress * 4 + 0.0001))

            if (next !== activeIndexRef.current) {
              activeIndexRef.current = next
              stackRef.current?.setActive(next)
            }

            const exit = gsap.utils.clamp(0, 1, (progress - 0.82) / 0.18)

            gsap.set(stack, {
              yPercent: exit * -6,
              scale: 1 - exit * 0.04,
              opacity: 1 - exit * 0.18,
            })

            gsap.set(copy, { yPercent: exit * -4 })
          },
        })

        return () => {
          trigger.kill()
          stackRef.current?.setActive(-1)
          activeIndexRef.current = -1
          gsap.set([stack, copy], { clearProps: 'transform,opacity' })
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
        const normalized = gsap.utils.clamp(-1, 1, velocity / 55)

        skew(normalized * 2.4)
        stretch(1 + Math.abs(normalized) * 0.035)
      }

      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: rootRef, dependencies: [reducedMotion, velocityRef] },
  )

  const handleMode = (mode) => (event) => {
    if (reducedMotion) return

    if (event.type === 'pointerleave' || event.type === 'blur') {
      setStackMode('idle')
      return
    }

    setStackMode(mode)
  }

  return (
    <section ref={rootRef} id="top" className="hero-section">
      <BokehBackground reducedMotion={reducedMotion} />
      <Navbar />

      <p className="hero-label" data-reveal>
        <span className="hero-label__dot" aria-hidden="true" />
        Technology Studio
      </p>

      <PillStack
        ref={stackRef}
        mode={stackMode}
        reducedMotion={reducedMotion}
      />

      <div className="hero-main">
        <div className="hero-copy">
          <h1 ref={titleRef} className="hero-title">
            We start with <br className="hero-title__break" />
            the question.
          </h1>

          <div className="hero-meta" data-reveal>
            <p className="hero-tagline">
              Curious by Design. Precise by Engineering.
            </p>

            <div className="hero-links" aria-label="Ways to work with us">
              <a
                href="#work"
                className="hero-link"
                data-cursor="View"
                onPointerEnter={handleMode('products')}
                onPointerLeave={handleMode('products')}
                onFocus={handleMode('products')}
                onBlur={handleMode('products')}
              >
                Own Products <span aria-hidden="true">↗</span>
              </a>
              <a
                href="mailto:hello@anviklabs.com?subject=Freelance%20project"
                className="hero-link"
                data-cursor="Talk"
                onPointerEnter={handleMode('freelance')}
                onPointerLeave={handleMode('freelance')}
                onFocus={handleMode('freelance')}
                onBlur={handleMode('freelance')}
              >
                Freelance <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-footer" data-reveal>
        <Marquee className="hero-marquee" />
        <a href="#work" className="scroll-cue" data-cursor="View">
          <span>↓ scroll</span>
          <span className="scroll-cue__line" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
