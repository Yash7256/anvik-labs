import { useCallback, useState } from 'react'

import { NextSection } from '@/components/NextSection'
import { Hero } from '@/components/hero/Hero'
import { Preloader } from '@/components/hero/Preloader'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { useLenis } from '@/hooks/useLenis'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const INTRO_KEY = 'anvik:intro-seen'

function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

export function App() {
  const reducedMotion = usePrefersReducedMotion()
  const { velocityRef } = useLenis()
  const [seen] = useState(hasSeenIntro)
  const [preloaderVisible, setPreloaderVisible] = useState(
    () => !seen && !reducedMotion,
  )
  const [revealed, setRevealed] = useState(() => seen || reducedMotion)
  const [skipped, setSkipped] = useState(false)

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
      <a className="skip-link" href="#work">
        Skip to content
      </a>
      <CustomCursor />
      {showPreloader && (
        <Preloader onReveal={handleReveal} onDone={handleDone} />
      )}
      <main inert={showPreloader}>
        <Hero
          introReady={introReady}
          animateIntro={animateIntro}
          instant={instant}
          reducedMotion={reducedMotion}
          velocityRef={velocityRef}
        />
        <NextSection />
      </main>
    </>
  )
}
