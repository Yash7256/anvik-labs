import { useRef } from 'react'
import { Link } from 'react-router-dom'

import { MagneticButton } from '@/components/ui/MagneticButton'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, loadSplitText, useGSAP } from '@/lib/gsap'

function Breadcrumb({ items }) {
  return (
    <nav className="svc-breadcrumb" aria-label="Breadcrumb" data-sp-hero-reveal>
      <ol className="svc-breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.label} className="svc-breadcrumb__item">
              {isLast ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link to={item.href}>{item.label}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function DesignArtwork() {
  return (
    <div className="svc-art" aria-hidden="true" data-sp-hero-reveal>
      <span className="svc-art__glow" />
      <div className="svc-art__stage">
        <span className="svc-art__pill svc-art__pill--cream">
          <span className="svc-art__pill-inner">
            <span className="svc-art__highlight" />
            <span className="svc-art__grain" />
          </span>
        </span>
        <span className="svc-art__pill svc-art__pill--grey">
          <span className="svc-art__pill-inner">
            <span className="svc-art__highlight" />
            <span className="svc-art__grain" />
          </span>
        </span>
        <span className="svc-art__pill svc-art__pill--vivid">
          <span className="svc-art__pill-inner">
            <span className="svc-art__highlight" />
            <span className="svc-art__grain" />
          </span>
        </span>

        <svg className="svc-art__flow" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            id="svc-flow-path"
            d="M 20 17 C 46 25, 31 45, 52 54 S 76 70, 82 85"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.18"
            vectorEffect="non-scaling-stroke"
          />
          <circle className="svc-art__dot" r="1.15" fill="var(--pill-vivid)">
            <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
              <mpath href="#svc-flow-path" />
            </animateMotion>
          </circle>
        </svg>
      </div>
    </div>
  )
}

const BUILD_BARS = ['cream', 'grey', 'burnt', 'vivid']

function BuildArtwork() {
  return (
    <div className="svc-art svc-art--build" aria-hidden="true" data-sp-hero-reveal>
      <span className="svc-art__glow" />
      <div className="svc-art__stage svc-art__stage--build">
        <span className="svc-art__baseline" />
        <div className="svc-art__bars">
          {BUILD_BARS.map((tone) => (
            <span key={tone} className={`svc-art__bar svc-art__bar--${tone}`}>
              <span className="svc-art__pill-inner">
                <span className="svc-art__highlight" />
                <span className="svc-art__grain" />
              </span>
            </span>
          ))}
        </div>
        <span className="svc-art__ping" />
      </div>
    </div>
  )
}

function HeroArtwork({ variant = 'design' }) {
  return variant === 'build' ? <BuildArtwork /> : <DesignArtwork />
}

export function ServiceHero({ content, velocityRef }) {
  const rootRef = useRef(null)
  const titleRef = useRef(null)
  const artRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const titleWords = content.h1.trim().split(/\s+/)
  const titleLast = titleWords.pop()
  const titleLead = titleWords.join(' ')

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

        title.setAttribute('aria-label', content.h1)
        split = new SplitText(title, {
          type: 'lines',
          mask: 'lines',
          aria: 'none',
        })
        split.lines.forEach((line) => line.setAttribute('aria-hidden', 'true'))
        const masks = split.lines.map((line) => line.parentElement)

        const reveal = gsap.utils.toArray('[data-sp-hero-reveal]', root)

        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            onComplete: () => gsap.set(masks, { overflow: 'visible' }),
          })
          .from(split.lines, {
            yPercent: 112,
            duration: 1,
            stagger: 0.1,
          })
          .fromTo(
            reveal,
            { y: 16 },
            { y: 0, duration: 0.8, stagger: 0.075 },
            0.24,
          )
      }

      play().catch(() => {
        if (cancelled) return
        gsap.set([title, ...gsap.utils.toArray('[data-sp-hero-reveal]', root)], {
          autoAlpha: 1,
          y: 0,
        })
      })

      return () => {
        cancelled = true
        split?.revert()
      }
    },
    { scope: rootRef, dependencies: [content.h1, reducedMotion] },
  )

  useGSAP(
    () => {
      if (reducedMotion) return
      const stage = artRef.current?.querySelector('.svc-art__stage')
      if (!stage) return

      const inners = gsap.utils.toArray('.svc-art__pill-inner', stage)
      const tweens = inners.map((inner, index) =>
        gsap.to(inner, {
          y: index % 2 === 0 ? -4 : 3,
          duration: 4.2 + index * 0.55,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.22,
        }),
      )

      const canHover =
        window.matchMedia('(pointer: fine)').matches &&
        window.matchMedia('(min-width: 1024px)').matches

      let moveX
      let moveY
      let onPointerMove
      let onPointerLeave

      if (canHover) {
        moveX = gsap.quickTo(stage, 'x', { duration: 0.8, ease: 'power3.out' })
        moveY = gsap.quickTo(stage, 'y', { duration: 0.8, ease: 'power3.out' })

        onPointerMove = (event) => {
          const rect = stage.getBoundingClientRect()
          const nx = (event.clientX - (rect.left + rect.width / 2)) / rect.width
          const ny = (event.clientY - (rect.top + rect.height / 2)) / rect.height
          moveX(gsap.utils.clamp(-10, 10, nx * 20))
          moveY(gsap.utils.clamp(-10, 10, ny * 20))
        }

        onPointerLeave = () => {
          moveX(0)
          moveY(0)
        }

        window.addEventListener('pointermove', onPointerMove, { passive: true })
        window.addEventListener('pointerleave', onPointerLeave, { passive: true })
      }

      return () => {
        tweens.forEach((tween) => tween.kill())
        if (onPointerMove) window.removeEventListener('pointermove', onPointerMove)
        if (onPointerLeave) window.removeEventListener('pointerleave', onPointerLeave)
      }
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  useGSAP(
    () => {
      if (reducedMotion || content.heroVariant !== 'build') return
      const stage = artRef.current?.querySelector('.svc-art__stage')
      const ping = stage?.querySelector('.svc-art__ping')
      const baseline = stage?.querySelector('.svc-art__baseline')
      if (!stage || !ping || !baseline) return

      const timeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 4.35,
        paused: true,
      })

      timeline
        .fromTo(
          ping,
          { x: 0, autoAlpha: 1 },
          {
            x: () => Math.max(0, baseline.offsetWidth - ping.offsetWidth),
            duration: 1.6,
            ease: 'power2.inOut',
          },
        )
        .to(ping, { autoAlpha: 0, duration: 0.25 }, '>-0.2')

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) timeline.play()
          else timeline.pause()
        },
        { threshold: 0.15 },
      )

      observer.observe(stage)

      return () => {
        observer.disconnect()
        timeline.kill()
      }
    },
    { scope: rootRef, dependencies: [reducedMotion, content.heroVariant] },
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

      const tick = () => {
        const normalized = gsap.utils.clamp(-1, 1, (velocityRef.current || 0) / 55)
        skew(normalized * 1.8)
      }

      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: rootRef, dependencies: [reducedMotion, velocityRef] },
  )

  return (
    <section ref={rootRef} className="svc-hero" aria-labelledby="svc-title">
      <div className="svc-page__inner">
        <Breadcrumb items={content.breadcrumb} />

        <div className="svc-hero__grid">
          <div className="svc-hero__copy">
            <h1 ref={titleRef} id="svc-title" className="svc-hero__title">
              <span className="svc-hero__title-line">{titleLead}</span>{' '}
              <span className="svc-hero__title-line svc-hero__title-line--last">
                {titleLast}
              </span>
            </h1>

            <p className="svc-hero__answer" data-sp-hero-reveal>
              {content.directAnswer}
            </p>

            <div className="svc-hero__actions" data-sp-hero-reveal>
              <MagneticButton
                href="#contact"
                className="svc-hero__cta"
                strength={reducedMotion ? 0 : 10}
              >
                {content.cta?.buttonLabel || 'Start a project'}{' '}
                <span className="hero-link__arrow" aria-hidden="true">↗</span>
              </MagneticButton>
              <Link className="svc-quiet-link" to="/approach">
                See our approach <span className="svc-quiet-link__arrow" aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <div ref={artRef} className="svc-hero__art">
            <HeroArtwork variant={content.heroVariant} />
          </div>
        </div>
      </div>
    </section>
  )
}
