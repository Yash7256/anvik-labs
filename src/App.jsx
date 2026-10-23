import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Footer } from '@/components/footer/Footer'
import { FeaturedProduct } from '@/components/featured/FeaturedProduct'
import { Hero } from '@/components/hero/Hero'
import { HowWeWork } from '@/components/process/HowWeWork'
import { Services } from '@/components/services/Services'
import { WhatWeDo } from '@/components/whatwedo/WhatWeDo'
import { Preloader } from '@/components/hero/Preloader'
import { useLenis } from '@/hooks/lenisContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { ScrollTrigger } from '@/lib/gsap'

const INTRO_KEY = 'anvik:intro-seen'

const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

function hasSeenIntro() {
  if (typeof window === 'undefined') return true

  try {
    return window.sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

export function App() {
  const reducedMotion = usePrefersReducedMotion()
  const { lenisRef, velocityRef } = useLenis()
  useEffect(() => {
    const ids = ['featured', 'what-we-do', 'services', 'process']
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (current && location.hash !== `#${current.target.id}`) history.replaceState(null, '', `#${current.target.id}`)
    }, { threshold: [0.15, 0.35, 0.6], rootMargin: '-15% 0px -45% 0px' })
    sections.forEach((section) => observer.observe(section))
    const jump = (hash) => {
      const target = document.getElementById(decodeURIComponent(hash.replace(/^#/, '')))
      if (!target) return
      if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: .9, offset: 0 })
      else target.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' })
    }
    const onClick = (event) => {
      const link = event.target.closest('a[href^="#"]')
      if (!link || !link.hash) return
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)))
      if (!target) return
      event.preventDefault()
      history.pushState(null, '', link.hash)
      jump(link.hash)
    }
    const onHash = () => jump(location.hash)
    document.addEventListener('click', onClick)
    window.addEventListener('hashchange', onHash)
    if (location.hash) requestAnimationFrame(() => jump(location.hash))
    const safeRefresh = () => ScrollTrigger.refresh()
    let frame = requestAnimationFrame(() => requestAnimationFrame(safeRefresh))
    document.fonts?.ready.then(safeRefresh).catch(() => {})
    window.addEventListener('load', safeRefresh, { once: true })
    return () => { cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener('click', onClick); window.removeEventListener('hashchange', onHash); window.removeEventListener('load', safeRefresh) }
  }, [lenisRef, reducedMotion])
  const [seen, setSeen] = useState(true)
  const [preloaderVisible, setPreloaderVisible] = useState(false)
  const [revealed, setRevealed] = useState(true)
  const [skipped, setSkipped] = useState(false)
  const introCheckedRef = useRef(false)

  useIsoLayoutEffect(() => {
    if (typeof window === 'undefined' || introCheckedRef.current) return
    introCheckedRef.current = true

    const skipIntro = reducedMotion || hasSeenIntro()
    document.documentElement.removeAttribute('data-intro')

    if (skipIntro) {
      setSeen(true)
      setRevealed(true)
      setPreloaderVisible(false)
      return
    }

    setSeen(false)
    setRevealed(false)
    setPreloaderVisible(true)
  }, [reducedMotion])

  const instant = seen || reducedMotion || skipped
  const animateIntro = !seen && !reducedMotion && !skipped
  const introReady = revealed || seen || reducedMotion
  const showPreloader = preloaderVisible && !reducedMotion

  const handleReveal = useCallback(() => {
    setRevealed(true)
  }, [])

  const handleDone = useCallback((wasSkipped) => {
    setPreloaderVisible(false)
    setRevealed(true)

    if (wasSkipped) setSkipped(true)

    try {
      window.sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      // Session storage can be unavailable in private browsing.
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {showPreloader && (
        <Preloader onReveal={handleReveal} onDone={handleDone} />
      )}
      <main id="main" inert={showPreloader}>
        <Hero
          introReady={introReady}
          animateIntro={animateIntro}
          instant={instant}
          reducedMotion={reducedMotion}
          velocityRef={velocityRef}
        />
        <FeaturedProduct
          reducedMotion={reducedMotion}
          velocityRef={velocityRef}
        />
        <WhatWeDo
          reducedMotion={reducedMotion}
          velocityRef={velocityRef}
        />
        <Services
          reducedMotion={reducedMotion}
          velocityRef={velocityRef}
          lenisRef={lenisRef}
        />
        <HowWeWork
          reducedMotion={reducedMotion}
          velocityRef={velocityRef}
        />
        <Footer reducedMotion={reducedMotion} />
      </main>
    </>
  )
}
