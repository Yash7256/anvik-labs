import { useEffect, useRef } from 'react'

import { gsap, loadSplitText, useGSAP } from '@/lib/gsap'
import { useMagneticStrength } from '@/hooks/useMagneticStrength'
import { MagneticButton } from '@/components/ui/MagneticButton'

import { SITE } from '@/config/site'

export function CtaPill({ reducedMotion = false, cta }) {
  const rootRef = useRef(null)
  const headlineRef = useRef(null)
  const strength = useMagneticStrength(10)
  const resolvedCta = {
    ...SITE.cta,
    ...cta,
    label: cta?.label ?? SITE.cta.label,
    actionLabel: cta?.buttonLabel ?? cta?.actionLabel ?? SITE.cta.actionLabel,
  }

  useGSAP(
    () => {
      if (reducedMotion) return
      const root = rootRef.current
      const headline = headlineRef.current
      if (!root || !headline) return

      let cancelled = false
      let split

      const play = async () => {
        const SplitText = await loadSplitText()
        if (cancelled) return

        headline.setAttribute('aria-label', resolvedCta.headline)
        split = new SplitText(headline, { type: 'lines', mask: 'lines', aria: 'none' })
        split.lines.forEach((line) => line.setAttribute('aria-hidden', 'true'))
        const masks = split.lines.map((line) => line.parentElement)

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: root,
            start: 'top 86%',
            once: true,
            invalidateOnRefresh: true,
          },
          onComplete: () => gsap.set(masks, { overflow: 'visible' }),
        })

        tl.fromTo(
          '.footer__cta-pill',
          { clipPath: 'inset(0 40% 0 40% round 999px)', scaleX: 0.96 },
          { clipPath: 'inset(0 0% 0 0% round 999px)', scaleX: 1, duration: 1.1, ease: 'power4.inOut' },
          0,
        )
          .from('.footer__cta-label', { autoAlpha: 0, y: 10, duration: 0.6 }, 0.18)
          .from(split.lines, { yPercent: 112, duration: 0.9, stagger: 0.08 }, 0.26)
          .fromTo(
            '.footer__cta-button',
            { autoAlpha: 0, scale: 0.96 },
            { autoAlpha: 1, scale: 1, duration: 0.6 },
            0.5,
          )
      }

      play().catch(() => {
        if (cancelled) return
        gsap.set(gsap.utils.toArray('[data-footer-reveal]', root), { autoAlpha: 1, y: 0, scale: 1 })
      })

      return () => {
        cancelled = true
        split?.revert()
      }
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  useEffect(() => {
    if (reducedMotion) return
    const pill = rootRef.current?.querySelector('.footer__cta-pill')
    if (!pill) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onMove = (event) => {
      const rect = pill.getBoundingClientRect()
      const mx = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      const my = ((event.clientY - rect.top) / rect.height - 0.5) * 2
      pill.style.setProperty('--mx', `${(mx + 1) * 50}%`)
      pill.style.setProperty('--my', `${(my + 1) * 20}%`)
    }

    const onLeave = () => {
      pill.style.setProperty('--mx', '50%')
      pill.style.setProperty('--my', '20%')
    }

    pill.addEventListener('pointermove', onMove)
    pill.addEventListener('pointerleave', onLeave)
    return () => {
      pill.removeEventListener('pointermove', onMove)
      pill.removeEventListener('pointerleave', onLeave)
    }
  }, [reducedMotion])

  return (
    <section ref={rootRef} id="contact" className="footer__cta" aria-labelledby="footer-cta-title">
      <div className="footer__cta-pill">
        <span className="footer__cta-shimmer" aria-hidden="true" />
        <span className="footer__cta-highlight" aria-hidden="true" />
        <div className="footer__cta-content">
          <div className="footer__cta-left">
            <p className="footer__cta-label">
              <span className="footer__cta-dot" aria-hidden="true" />
              {resolvedCta.label.replace('● ', '')}
            </p>
            <h2 ref={headlineRef} id="footer-cta-title" className="footer__cta-headline">
              {resolvedCta.headline}
            </h2>
          </div>
          <div className="footer__cta-right">
            <MagneticButton
              href={resolvedCta.href}
              className="footer__cta-button"
              strength={reducedMotion ? 0 : strength}
            >
              {resolvedCta.actionLabel}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}
