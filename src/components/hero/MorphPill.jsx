import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

import { gsap, loadMorphSVG } from '@/lib/gsap'

const PATHS = [
  'M24 4C29 4 37 7 40 9V22C40 33 33 41 24 45C15 41 8 33 8 22V9C11 7 19 4 24 4Z',
  'M13 43C9 39 9 34 14 31L31 8C34 4 40 5 42 9C44 13 41 17 37 20L22 37C21 41 18 44 13 43Z',
  'M8 10H40C43 10 45 12 45 15V33C45 36 43 38 40 38H8C5 38 3 36 3 33V15C3 12 5 10 8 10ZM14 18L22 24L14 30Z',
  'M10 16H38C41 16 43 18 43 21V32C43 35 41 37 38 37H10C7 37 5 35 5 32V21C5 18 7 16 10 16ZM16 22H21V27H16ZM27 22H32V27H27ZM18 31H30V33H18ZM24 16V9M18 9H30',
]

const LABELS = ['Secure', 'Design', 'Build', 'Automate']

export const MorphPill = forwardRef(function MorphPill(
  { countRef, fillRef, className = '' },
  ref,
) {
  const rootRef = useRef(null)
  const pathRef = useRef(null)
  const labelRef = useRef(null)
  const stageRef = useRef(0)

  useEffect(() => {
    const path = pathRef.current
    const label = labelRef.current

    return () => {
      gsap.killTweensOf([path, label])
    }
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      morphTo: async (index) => {
        if (stageRef.current === index) return
        stageRef.current = index

        try {
          await loadMorphSVG()
        } catch {
          return
        }

        const path = pathRef.current
        const label = labelRef.current
        if (!path || !label) return

        gsap.to(path, {
          morphSVG: { shape: PATHS[index] },
          duration: 0.18,
          ease: 'power2.inOut',
        })

        gsap.fromTo(
          label,
          { autoAlpha: 0, y: 4 },
          { autoAlpha: 1, y: 0, duration: 0.16, ease: 'power2.out' },
        )

        label.textContent = LABELS[index]
      },
      reset: () => {
        stageRef.current = 0
        const path = pathRef.current
        const label = labelRef.current
        if (path) {
          gsap.killTweensOf(path)
          path.setAttribute('d', PATHS[0])
        }
        if (label) {
          gsap.killTweensOf(label)
          gsap.set(label, { autoAlpha: 1, y: 0 })
          label.textContent = LABELS[0]
        }
      },
    }),
    [],
  )

  return (
    <div ref={rootRef} className={`preloader__pill ${className}`}>
      <div ref={fillRef} className="preloader__fill" />
      <div className="preloader__content">
        <svg className="preloader__glyph" viewBox="0 0 48 48" aria-hidden="true">
          <path
            ref={pathRef}
            d={PATHS[0]}
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
        <span ref={labelRef} className="preloader__label">
          {LABELS[0]}
        </span>
      </div>
      <span ref={countRef} className="preloader__count">
        000
      </span>
    </div>
  )
})
