import Lenis from 'lenis'
import { useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { gsap, ScrollTrigger } from '@/lib/gsap'

import { LenisContext } from './lenisContext'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function LenisProvider({ children }) {
  const lenisRef = useRef(null)
  const velocityRef = useRef(0)
  const reducedMotion = usePrefersReducedMotion()
  const location = useLocation()

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

  useEffect(() => {
    const hash = location.hash ? decodeURIComponent(location.hash.slice(1)) : ''

    const scroll = () => {
      if (hash) {
        const target = document.getElementById(hash)
        if (target) {
          const lenis = lenisRef.current
          if (lenis) {
            lenis.scrollTo(target, { duration: reducedMotion ? 0 : 0.9 })
          } else {
            target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
          }
          return
        }
      }

      const lenis = lenisRef.current
      if (lenis) {
        lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
    }

    const frame = requestAnimationFrame(() => {
      window.setTimeout(scroll, 60)
    })
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 360)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(refresh)
    }
  }, [location.pathname, location.hash, reducedMotion])

  const value = useMemo(() => ({ lenisRef, velocityRef }), [])

  return (
    <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
  )
}

