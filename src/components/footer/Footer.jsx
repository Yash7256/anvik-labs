import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { useLenis } from '@/hooks/lenisContext'

import { useIstClock } from '@/hooks/useIstClock'

import { CtaPill } from './CtaPill'
import { FooterColumns } from './FooterColumns'

export function Footer({ reducedMotion = false, cta, related = [] }) {
  const rootRef = useRef(null)
  const time = useIstClock()
  const { lenisRef } = useLenis()

  useGSAP(
    () => {
      if (reducedMotion) return
      const root = rootRef.current
      if (!root) return

      const columns = gsap.utils.toArray('.footer__column', root)
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: root,
          start: 'top 88%',
          once: true,
          invalidateOnRefresh: true,
        },
      })

      tl.fromTo('.footer__divider', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power4.inOut' }, 0)
      tl.fromTo(columns, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.16)

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh).catch(() => {})
    window.addEventListener('resize', refresh)
    return () => {
      window.removeEventListener('resize', refresh)
    }
  }, [])

  const scrollTop = (event) => {
    event.preventDefault()
    const lenis = lenisRef?.current
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 })
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer ref={rootRef} className="footer" aria-label="Site footer">
      <span className="footer__glow footer__glow--one" aria-hidden="true" />
      <span className="footer__glow footer__glow--two" aria-hidden="true" />
      <span className="footer__grain" aria-hidden="true" />

      <div className="footer__inner">
        {related.length ? (
          <nav className="footer__related" aria-label="Related pages">
            {related.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="footer__related-link"
              >
                {link.label} <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
        ) : null}

        <CtaPill reducedMotion={reducedMotion} cta={cta} />

        <div className="footer__divider" aria-hidden="true" />
        <FooterColumns />

        <div className="footer__divider footer__divider--bottom" aria-hidden="true" />
        <div className="footer__bottom">
          <div className="footer__bottom-group">
            <span className="footer__bottom-item" aria-label="Indian Standard Time">
              {time} IST
            </span>
            <button type="button" className="footer__backtop" onClick={scrollTop}>
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
