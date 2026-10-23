import { useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'

export function BokehBackground({ reducedMotion = false }) {
  const rootRef = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return

      const root = rootRef.current
      if (!root) return

      const canHover = window.matchMedia('(pointer: fine)').matches
      const layers = gsap.utils.toArray('.hero-bokeh__layer', root)

      layers.forEach((layer, index) => {
        gsap.to(layer, {
          xPercent: index % 2 === 0 ? 4 : -3,
          yPercent: index % 2 === 0 ? -3 : 4,
          duration: 18 + index * 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })

      if (!canHover) return

      const movers = layers.map((layer, index) => ({
        depth: 4 + index * 3,
        x: gsap.quickTo(layer, 'x', { duration: 0.9, ease: 'power3.out' }),
        y: gsap.quickTo(layer, 'y', { duration: 0.9, ease: 'power3.out' }),
      }))

      const onPointerMove = (event) => {
        const nx = event.clientX / window.innerWidth - 0.5
        const ny = event.clientY / window.innerHeight - 0.5

        movers.forEach((mover) => {
          mover.x(gsap.utils.clamp(-12, 12, nx * mover.depth * 2.4))
          mover.y(gsap.utils.clamp(-12, 12, ny * mover.depth * 2.4))
        })
      }

      window.addEventListener('pointermove', onPointerMove, { passive: true })
      return () => window.removeEventListener('pointermove', onPointerMove)
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  return (
    <div ref={rootRef} className="hero-bokeh" aria-hidden="true">
      <div className="hero-bokeh__layer hero-bokeh__layer--1" />
      <div className="hero-bokeh__layer hero-bokeh__layer--2" />
      <div className="hero-bokeh__layer hero-bokeh__layer--3" />
      <div className="hero-bokeh__layer hero-bokeh__layer--4" />
      <div className="hero-bokeh__grain" />
    </div>
  )
}
