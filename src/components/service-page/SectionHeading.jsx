import { useRef } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, loadSplitText, useGSAP } from '@/lib/gsap'

export function SectionHeading({ id, children, className = '' }) {
  const ref = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return
      const heading = ref.current
      if (!heading) return

      let cancelled = false
      let split

      const play = async () => {
        const SplitText = await loadSplitText()
        if (cancelled) return

        const label = typeof children === 'string' ? children : heading.textContent
        heading.setAttribute('aria-label', label)
        split = new SplitText(heading, {
          type: 'lines',
          mask: 'lines',
          aria: 'none',
        })
        split.lines.forEach((line) => line.setAttribute('aria-hidden', 'true'))
        const masks = split.lines.map((line) => line.parentElement)

        gsap.from(split.lines, {
          yPercent: 112,
          duration: 0.9,
          stagger: 0.075,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 86%',
            once: true,
            invalidateOnRefresh: true,
          },
          onComplete: () => gsap.set(masks, { overflow: 'visible' }),
        })
      }

      play().catch(() => {
        if (!cancelled) gsap.set(heading, { clearProps: 'transform' })
      })

      return () => {
        cancelled = true
        split?.revert()
      }
    },
    { scope: ref, dependencies: [children, reducedMotion] },
  )

  return (
    <h2 ref={ref} id={id} className={`svc-heading ${className}`.trim()}>
      {children}
    </h2>
  )
}
