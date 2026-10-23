import { useEffect, useRef, useState } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap } from '@/lib/gsap'

function canUseCustomCursor() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: fine)').matches
}

export function CustomCursor() {
  const cursorRef = useRef(null)
  const labelRef = useRef(null)
  const [enabled] = useState(canUseCustomCursor)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!enabled) return

    const cursor = cursorRef.current
    const label = labelRef.current
    if (!cursor || !label) return

    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    gsap.set(cursor, { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    const moveX = gsap.quickTo(cursor, 'x', {
      duration: reducedMotion ? 0 : 0.18,
      ease: 'power3.out',
    })
    const moveY = gsap.quickTo(cursor, 'y', {
      duration: reducedMotion ? 0 : 0.18,
      ease: 'power3.out',
    })

    const setState = (active, text = 'View') => {
      cursor.dataset.active = active ? 'true' : 'false'
      label.textContent = text
    }

    const onPointerMove = (event) => {
      gsap.set(cursor, { autoAlpha: 1 })
      moveX(event.clientX)
      moveY(event.clientY)
    }

    const onPointerOver = (event) => {
      const target = event.target.closest?.('[data-cursor]')
      if (!target) return
      setState(true, target.dataset.cursor || 'View')
    }

    const onPointerOut = (event) => {
      const target = event.target.closest?.('[data-cursor]')
      if (!target) return
      if (target.contains(event.relatedTarget)) return
      setState(false)
    }

    const onPointerDown = () => {
      gsap.to(cursor, { scale: 0.82, duration: 0.18, ease: 'power2.out' })
    }

    const onPointerUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.25, ease: 'power2.out' })
    }

    const onLeaveWindow = () => {
      gsap.to(cursor, { autoAlpha: 0, duration: 0.2 })
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerover', onPointerOver, { passive: true })
    window.addEventListener('pointerout', onPointerOut, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    document.addEventListener('mouseleave', onLeaveWindow)

    return () => {
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('mouseleave', onLeaveWindow)
    }
  }, [enabled, reducedMotion])

  if (!enabled) return null

  return (
    <div ref={cursorRef} className="custom-cursor" data-active="false" aria-hidden="true">
      <span ref={labelRef} className="custom-cursor__label">
        View
      </span>
    </div>
  )
}
