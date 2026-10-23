import { useEffect, useRef, useState } from 'react'

import { gsap, loadSplitText, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { useMagneticStrength } from '@/hooks/useMagneticStrength'
import { MagneticButton } from '@/components/ui/MagneticButton'

import { ProcessPill } from './ProcessPill'
import { ProcessRail } from './ProcessRail'

const STEPS = [
  { index: 1, label: 'Question', copy: 'We start with the problem, not the solution.' },
  { index: 2, label: 'Explore', copy: 'We look at users, constraints and existing options.' },
  { index: 3, label: 'Understand', copy: 'We define what needs to be true for the work to succeed.' },
  { index: 4, label: 'Build', copy: 'We design and engineer it to a high standard.' },
]

export function HowWeWork({ reducedMotion = false, velocityRef }) {
  const rootRef = useRef(null)
  const titleRef = useRef(null)
  const listRef = useRef(null)
  const progressRef = useRef(0)
  const [active, setActive] = useState(1)
  const strength = useMagneticStrength(10)

  useGSAP(
    () => {
      if (reducedMotion) return
      const root = rootRef.current
      const title = titleRef.current
      if (!root || !title) return

      let cancelled = false
      let split

      const play = async () => {
        const SplitText = await loadSplitText()
        if (cancelled) return

        title.setAttribute('aria-label', 'An inquiry-first process')
        split = new SplitText(title, { type: 'lines', mask: 'lines', aria: 'none' })
        split.lines.forEach((line) => line.setAttribute('aria-hidden', 'true'))
        const accent = title.querySelector('.process__title-accent')
        if (accent) accent.setAttribute('aria-hidden', 'true')

        const masks = split.lines.map((line) => line.parentElement)
        const timeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: root,
            start: 'top 82%',
            once: true,
            invalidateOnRefresh: true,
          },
          onComplete: () => gsap.set(masks, { overflow: 'visible' }),
        })

        timeline
          .from('.process__label, .process__index', { autoAlpha: 0, y: 12, duration: 0.55, stagger: 0.08 }, 0)
          .fromTo('.process__rule', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power4.inOut' }, 0.05)
          .from(split.lines, { yPercent: 118, duration: 0.95, stagger: 0.1 }, 0.12)
          .fromTo(
            '.process__title-underline',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: 'power3.out' },
            0.5,
          )
      }

      play().catch(() => {
        if (cancelled) return
        gsap.set(gsap.utils.toArray('[data-process-reveal]', root), { autoAlpha: 1, y: 0 })
      })

      return () => {
        cancelled = true
        split?.revert()
      }
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  useGSAP(
    () => {
      if (reducedMotion) return
      const root = rootRef.current
      const list = listRef.current
      if (!root || !list) return

      const pills = gsap.utils.toArray('.process__pill', list)
      const fills = gsap.utils.toArray('.process__pill-fill', list)
      const glows = gsap.utils.toArray('.process__pill-glow', list)

      gsap.set(pills, { xPercent: -6, autoAlpha: 0 })
      gsap.set(glows, { autoAlpha: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 78%',
          end: 'bottom 20%',
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress
            progressRef.current = p
            const step = Math.min(4, Math.max(1, Math.ceil(p * 4 + 1e-6)))
            setActive(step)
          },
        },
      })

      pills.forEach((pill, index) => {
        const fill = fills[index]
        const glow = glows[index]
        const start = index * 0.16

        tl.to(pill, { xPercent: 0, autoAlpha: 1, duration: 0.18, ease: 'power2.out' }, start)
        tl.to(fill, { scaleX: 1, duration: 0.24, ease: 'power2.out' }, start + 0.08)
        tl.to(glow, { autoAlpha: 1, duration: 0.16, ease: 'power2.out' }, start + 0.14)
      })

      ScrollTrigger.refresh()

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  useGSAP(
    () => {
      if (reducedMotion || !velocityRef) return
      const title = titleRef.current
      if (!title) return

      const skew = gsap.quickTo(title, 'skewY', { duration: 0.4, ease: 'power3.out' })
      const tick = () => {
        const velocity = velocityRef.current || 0
        const normalized = gsap.utils.clamp(-1, 1, velocity / 70)
        skew(normalized * 1.6)
      }

      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: rootRef, dependencies: [reducedMotion, velocityRef] },
  )

  useEffect(() => {
    if (reducedMotion) return
    const glow = rootRef.current?.querySelector('.process__pulse')
    if (!glow) return
    const onUpdate = () => {
      const p = progressRef.current || 0
      if (p > 0.96) {
        glow.dataset.active = 'true'
      } else if (p < 0.9) {
        glow.dataset.active = 'false'
      }
    }
    const id = setInterval(onUpdate, 32)
    return () => clearInterval(id)
  }, [reducedMotion])

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh).catch(() => {})
    window.addEventListener('resize', refresh)
    window.addEventListener('orientationchange', refresh)
    return () => {
      window.removeEventListener('resize', refresh)
      window.removeEventListener('orientationchange', refresh)
    }
  }, [])

  const getState = (index) => {
    if (reducedMotion) return 'filled'
    if (index === active) return 'active'
    if (index < active) return 'filled'
    return 'outline'
  }

  return (
    <section
      ref={rootRef}
      id="process"
      className="process"
      data-reduced={reducedMotion ? 'true' : undefined}
      aria-labelledby="process-title"
    >
      <span className="process__glow process__glow--one" aria-hidden="true" />
      <span className="process__glow process__glow--two" aria-hidden="true" />
      <span className="process__grain" aria-hidden="true" />
      <span className="process__pulse" aria-hidden="true" />

      <div className="process__inner">
        <div className="process__top">
          <p className="process__label" data-process-reveal>
            <span className="process__label-dot" aria-hidden="true" />
            How we work
          </p>
          <p className="process__index" data-process-reveal>
            04 / 04
          </p>
          <span className="process__rule" aria-hidden="true" />
        </div>

        <header className="process__header">
          <h2 ref={titleRef} id="process-title" className="process__title">
            <span className="process__title-line">
              <span className="process__title-line-inner">
                An <span className="process__title-accent">inquiry-first</span> process
              </span>
            </span>
            <span className="process__title-underline" aria-hidden="true" />
          </h2>
        </header>

        <div className="process__body">
          <ProcessRail rootRef={rootRef} progressRef={progressRef} />
          <ol ref={listRef} className="process__list">
            {STEPS.map((step, index) => (
              <ProcessPill
                key={step.index}
                index={step.index}
                label={step.label}
                copy={step.copy}
                order={index + 1}
                reducedMotion={reducedMotion}
                setActive={setActive}
                isActive={active === step.index}
                dataActive={getState(step.index)}
              />
            ))}
          </ol>
        </div>

        <div className="process__footer">
          <MagneticButton
            href="/approach"
            className="hero-link process__link"
            data-cursor="View"
            strength={reducedMotion ? 0 : strength}
          >
            Read our full approach ↗
          </MagneticButton>
          <span className="process__footer-mark" aria-hidden="true">
            04 / 04
          </span>
        </div>
      </div>
    </section>
  )
}
