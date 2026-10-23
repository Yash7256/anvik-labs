import Lenis from 'lenis'
import { useEffect, useRef } from 'react'

import { gsap, ScrollTrigger } from '@/lib/gsap'

import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useLenis() {
  const lenisRef = useRef(null)
  const velocityRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    let active = true
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.15,
    })

    lenisRef.current = lenis
    document.documentElement.classList.add('lenis-active')

    const onScroll = (event) => {
      velocityRef.current = event.velocity
      ScrollTrigger.update()
    }

    const raf = (time) => {
      lenis.raf(time * 1000)
    }

    lenis.on('scroll', onScroll)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const refreshOnce = () => {
      if (active) ScrollTrigger.refresh()
    }

    window.addEventListener('load', refreshOnce)

    if (document.fonts?.ready) {
      document.fonts.ready.then(refreshOnce).catch(() => {})
    }

    ScrollTrigger.refresh()

    return () => {
      active = false
      window.removeEventListener('load', refreshOnce)
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      document.documentElement.classList.remove('lenis-active')

      if (lenisRef.current === lenis) lenisRef.current = null
      velocityRef.current = 0
    }
  }, [reducedMotion])

  return { lenisRef, velocityRef }
}
