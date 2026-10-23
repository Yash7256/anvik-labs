import { useCallback, useEffect, useRef } from 'react'

import { gsap, loadMorphSVG, useGSAP } from '@/lib/gsap'

import { MorphPill } from './MorphPill'
import { PILLS } from './pills'

const COUNTER_DURATION = 1.6
const REVEAL_AT = 2.36
const SPLIT_AT = 2.4
const FINISH_AT = 3.56

export function Preloader({ onReveal, onDone }) {
  const rootRef = useRef(null)
  const veilRef = useRef(null)
  const grainRef = useRef(null)
  const countRef = useRef(null)
  const fillRef = useRef(null)
  const morphRef = useRef(null)
  const timelineRef = useRef(null)
  const clonesRef = useRef([])
  const revealedRef = useRef(false)
  const finishedRef = useRef(false)

  const removeClones = useCallback(() => {
    clonesRef.current.forEach((clone) => clone.remove())
    clonesRef.current = []
  }, [])

  const reveal = useCallback(() => {
    if (revealedRef.current) return
    revealedRef.current = true
    onReveal?.()
  }, [onReveal])

  const finish = useCallback(
    (skipped) => {
      if (finishedRef.current) return
      finishedRef.current = true
      timelineRef.current?.kill()
      timelineRef.current = null
      reveal()
      removeClones()
      onDone?.(skipped)
    },
    [onDone, removeClones, reveal],
  )

  useEffect(() => {
    loadMorphSVG().catch(() => {})

    const onKeyDown = (event) => {
      if (event.key === 'Escape') finish(true)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [finish])

  useGSAP(
    () => {
      const root = rootRef.current
      const veil = veilRef.current
      const grain = grainRef.current
      const pill = root?.querySelector('.preloader__pill')
      const counter = { value: 0 }

      if (!root || !veil || !pill) return

      gsap.set(fillRef.current, {
        scaleY: 0,
        transformOrigin: 'bottom center',
      })

      const updateCounter = () => {
        if (!countRef.current) return
        countRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0')
      }

      const split = () => {
        const pillRect = pill.getBoundingClientRect()
        const targets = Array.from(
          root.ownerDocument.querySelectorAll('[data-hero-pill]'),
        ).map((element) => element.getBoundingClientRect())

        if (targets.length !== PILLS.length || pillRect.width === 0) return

        gsap.set(pill, { autoAlpha: 0 })

        const clones = PILLS.map((item) => {
          const clone = document.createElement('div')
          clone.className = 'preloader__clone'
          clone.style.background = item.color
          document.body.appendChild(clone)

          gsap.set(clone, {
            position: 'fixed',
            left: pillRect.left,
            top: pillRect.top,
            width: pillRect.width,
            height: pillRect.height,
            borderRadius: 999,
            transformOrigin: 'top left',
          })

          return clone
        })

        clonesRef.current = clones

        gsap.to(clones, {
          x: (index) => targets[index].left - pillRect.left,
          y: (index) => targets[index].top - pillRect.top,
          scaleX: (index) => targets[index].width / pillRect.width,
          scaleY: (index) => targets[index].height / pillRect.height,
          duration: 0.72,
          ease: 'power4.inOut',
          stagger: 0.05,
          onComplete: () => {
            gsap.to(clones, {
              autoAlpha: 0,
              duration: 0.18,
              onComplete: removeClones,
            })
          },
        })
      }

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        onComplete: () => finish(false),
      })

      timelineRef.current = timeline

      timeline
        .to(
          counter,
          {
            value: 100,
            duration: COUNTER_DURATION,
            ease: 'power2.inOut',
            onUpdate: updateCounter,
          },
          0,
        )
        .to(
          fillRef.current,
          {
            scaleY: 1,
            duration: COUNTER_DURATION,
            ease: 'power2.inOut',
          },
          0,
        )
        .call(() => morphRef.current?.morphTo(1), [], 1.62)
        .call(() => morphRef.current?.morphTo(2), [], 1.84)
        .call(() => morphRef.current?.morphTo(3), [], 2.06)
        .call(() => reveal(), [], REVEAL_AT)
        .add(split, SPLIT_AT)
        .to(veil, { opacity: 0, duration: 0.58, ease: 'power2.inOut' }, 2.38)
        .to(grain, { opacity: 0, duration: 0.42, ease: 'power2.inOut' }, 2.38)
        .to(
          '.preloader__hint, .preloader__skip',
          { autoAlpha: 0, duration: 0.24, ease: 'power2.out' },
          2.36,
        )
        .call(() => finish(false), [], FINISH_AT)

      return () => {
        timeline.kill()
        timelineRef.current = null
        removeClones()
      }
    },
    { scope: rootRef, dependencies: [finish, reveal] },
  )

  return (
    <div ref={rootRef} className="preloader">
      <div ref={veilRef} className="preloader__veil" />
      <div ref={grainRef} className="preloader__grain" aria-hidden="true" />
      <div className="preloader__stage">
        <MorphPill
          ref={morphRef}
          countRef={countRef}
          fillRef={fillRef}
        />
        <p className="preloader__hint">Question, explore, understand, build.</p>
      </div>
      <button
        type="button"
        className="preloader__skip"
        onClick={() => finish(true)}
        aria-label="Skip introduction"
      >
        Skip
      </button>
    </div>
  )
}
