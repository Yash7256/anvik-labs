import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const Spline = lazy(() => import('@splinetool/react-spline'))

export function HeroSplineBg() {
  const reducedMotion = usePrefersReducedMotion()
  const artworkRef = useRef(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const update = () => setIsDesktop(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const element = artworkRef.current
    if (!isDesktop || reducedMotion || !element) return undefined
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true)
        observer.disconnect()
      }
    }, { rootMargin: '120px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [isDesktop, reducedMotion])

  const useStaticFallback = !isDesktop || reducedMotion

  return (
    <div
      ref={artworkRef}
      className={`cv-spline-bg${useStaticFallback ? ' cv-spline-bg--reduced' : ''}`}
      aria-hidden="true"
    >
      {isDesktop && !reducedMotion && shouldLoad && (
        <Suspense fallback={null}>
          <Spline
            scene="https://prod.spline.design/ROLlmmFbujzRxBoV/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      )}
      <div className="cv-spline-fade" />
    </div>
  )
}
