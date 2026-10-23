import { useEffect, useRef, useState } from 'react'

import { useHoverLink } from '@/hooks/useHoverLink'
import { gsap, loadSplitText, ScrollTrigger, useGSAP } from '@/lib/gsap'

import { PillChip } from './PillChip'
import { ServiceColumn } from './ServiceColumn'

const TITLE = 'UI/UX design and web development services'

const SERVICES = [
  {
    index: '01',
    kind: 'design',
    title: 'UI/UX design',
    body: 'Research-led interface and experience design for websites, web apps and digital products.',
    href: '/services/ui-ux-design',
    linkText: 'UI/UX design services ↗',
  },
  {
    index: '02',
    kind: 'build',
    title: 'Web development',
    body: 'Fast, accessible, maintainable websites and web applications, built to be found by search engines and used by people.',
    href: '/services/web-development',
    linkText: 'web development services ↗',
  },
]

export function Services({ reducedMotion = false, velocityRef }) {
  const rootRef = useRef(null)
  const titleRef = useRef(null)
  const [loopsActive, setLoopsActive] = useState(false)
  const { active, enter, leave } = useHoverLink()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    let inView = false

    const syncLoops = () => {
      setLoopsActive(inView && !document.hidden)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        syncLoops()
      },
      { rootMargin: '12% 0px' },
    )

    observer.observe(root)
    document.addEventListener('visibilitychange', syncLoops)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncLoops)
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const chipAt = (target) => {
      const chip = target?.closest?.('.svc-chip')
      return chip && root.contains(chip) ? chip : null
    }

    const kindOf = (chip) => {
      if (chip.classList.contains('svc-chip--design')) return 'design'
      if (chip.classList.contains('svc-chip--build')) return 'build'
      return null
    }

    const onOver = (event) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
      const chip = chipAt(event.target)
      if (!chip || chip.contains(event.relatedTarget)) return
      const kind = kindOf(chip)
      if (kind) enter(kind, 'chip')
    }

    const onOut = (event) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
      const chip = chipAt(event.target)
      if (!chip || chip.contains(event.relatedTarget)) return
      const kind = kindOf(chip)
      if (kind) leave(kind, 'chip')
    }

    root.addEventListener('pointerover', onOver)
    root.addEventListener('pointerout', onOut)

    return () => {
      root.removeEventListener('pointerover', onOver)
      root.removeEventListener('pointerout', onOut)
    }
  }, [enter, leave])

  useGSAP(
    () => {
      const root = rootRef.current
      const title = titleRef.current
      if (!root || !title || reducedMotion) return undefined

      let cancelled = false
      let split
      let timeline

      const restore = () => {
        split?.revert()
        split = null
        gsap.set(
          root.querySelectorAll(
            '.svc__reveal, .svc__rule, .svc__underline, .svc__column, .svc-chip',
          ),
          { clearProps: 'all' },
        )
      }

      const play = async () => {
        const SplitText = await loadSplitText()
        if (cancelled) return

        split = new SplitText(title, {
          type: 'lines',
          mask: 'lines',
          aria: 'none',
        })
        split.lines.forEach((line) => line.setAttribute('aria-hidden', 'true'))

        const chips = gsap.utils.toArray('.svc-chip', title)

        timeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: root,
            start: 'top 76%',
            once: true,
            invalidateOnRefresh: true,
          },
          onComplete: restore,
        })

        timeline
          .from('.svc__reveal', {
            autoAlpha: 0,
            y: 10,
            duration: 0.55,
            stagger: 0.07,
            immediateRender: false,
          }, 0)
          .fromTo('.svc__rule', { scaleX: 0 }, {
            scaleX: 1,
            duration: 0.9,
            ease: 'power4.inOut',
            immediateRender: false,
          }, 0)
          .from(split.lines, {
            yPercent: 112,
            duration: 0.95,
            stagger: 0.1,
            immediateRender: false,
          }, 0.12)
          .from(chips[0], {
            scale: 0.6,
            rotate: -7,
            duration: 0.72,
            ease: 'expo.out',
            immediateRender: false,
          }, 1.02)
          .from(chips[1], {
            scale: 0.6,
            rotate: 6,
            duration: 0.72,
            ease: 'expo.out',
            immediateRender: false,
          }, 1.2)
          .fromTo('.svc__underline', { scaleX: 0 }, {
            scaleX: 1,
            duration: 0.85,
            immediateRender: false,
          }, 1.32)
          .from('.svc__column', {
            autoAlpha: 0,
            y: 24,
            duration: 0.7,
            stagger: 0.12,
            immediateRender: false,
          }, 1.05)
      }

      play().catch(() => {
        if (cancelled) return
        restore()
      })

      return () => {
        cancelled = true
        timeline?.scrollTrigger?.kill()
        timeline?.kill()
        restore()
      }
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  useGSAP(
    () => {
      if (reducedMotion || !velocityRef) return undefined

      const title = titleRef.current
      if (!title) return undefined

      const skew = gsap.quickTo(title, 'skewY', {
        duration: 0.45,
        ease: 'power3.out',
      })

      const tick = () => {
        const velocity = velocityRef.current || 0
        skew(gsap.utils.clamp(-1.4, 1.4, velocity / 60))
      }

      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: rootRef, dependencies: [reducedMotion, velocityRef] },
  )

  useEffect(() => {
    let frame

    const refresh = () => ScrollTrigger.refresh()
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(refresh)
    }

    document.fonts?.ready.then(refresh).catch(() => {})
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section
      ref={rootRef}
      id="services"
      className="svc"
      data-hover={active || undefined}
      data-loops={loopsActive ? 'on' : 'off'}
      aria-labelledby="services-title"
    >
      <span className="svc__atmosphere" aria-hidden="true">
        <span className="svc__glow svc__glow--one" />
        <span className="svc__glow svc__glow--two" />
        <span className="svc__grain" />
      </span>

      <div className="svc__inner">
        <div className="svc__top">
          <p className="svc__label svc__reveal">
            <span className="svc__label-dot" aria-hidden="true" />
            Services
          </p>
          <p className="svc__index svc__reveal">03 / 04</p>
          <span className="svc__rule" aria-hidden="true" />
        </div>

        <div className="svc__statement-wrap">
          <h2
            ref={titleRef}
            id="services-title"
            className="svc__statement"
            aria-label={TITLE}
          >
            <span className="svc__line">
              <span className="svc__keep">
                UI/UX design
                <PillChip variant="design" />
              </span>
            </span>{' '}
            <span className="svc__line">
              and web{' '}
              <span className="svc__keep">
                development
                <PillChip variant="build" />
              </span>
            </span>{' '}
            <span className="svc__line">
              <span className="svc__accent">
                services
                <span className="svc__underline" aria-hidden="true" />
              </span>
            </span>
          </h2>
        </div>

        <div className="svc__columns">
          <span className="svc__columns-rule" aria-hidden="true" />
          <div className="svc__grid">
            {SERVICES.map((service) => (
              <ServiceColumn
                key={service.kind}
                {...service}
                reducedMotion={reducedMotion}
                active={active === service.kind}
                dim={active !== null && active !== service.kind}
                onEnter={() => enter(service.kind, 'column')}
                onLeave={() => leave(service.kind, 'column')}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
