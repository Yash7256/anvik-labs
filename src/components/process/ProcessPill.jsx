import { useEffect, useRef } from 'react'

import { gsap } from '@/lib/gsap'
import { useMagneticStrength } from '@/hooks/useMagneticStrength'

const COLORS = [
  { fill: 'var(--pill-cream)', text: 'var(--pill-ink)' },
  { fill: 'var(--pill-grey)', text: 'var(--pill-ink)' },
  { fill: 'var(--pill-burnt)', text: 'var(--pill-ink-light)' },
  { fill: 'var(--pill-vivid)', text: 'var(--pill-ink)' },
]

export function ProcessPill({ index, label, copy, order, reducedMotion, setActive, isActive, dataActive }) {
  const pillRef = useRef(null)
  const fillRef = useRef(null)
  const strength = useMagneticStrength(10)

  useEffect(() => {
    if (reducedMotion) return
    const pill = pillRef.current
    if (!pill) return
    if (!window.matchMedia('(pointer: fine) and (min-width: 768px)').matches) return

    const onMove = (event) => {
      const rect = pill.getBoundingClientRect()
      const offsetX = event.clientX - (rect.left + rect.width / 2)
      const offsetY = event.clientY - (rect.top + rect.height / 2)
      gsap.to(pill, {
        x: gsap.utils.clamp(-strength, strength, offsetX * 0.16),
        y: gsap.utils.clamp(-strength, strength, offsetY * 0.12),
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    const reset = () => {
      gsap.to(pill, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' })
    }

    pill.addEventListener('pointermove', onMove)
    pill.addEventListener('pointerleave', reset)
    return () => {
      pill.removeEventListener('pointermove', onMove)
      pill.removeEventListener('pointerleave', reset)
      gsap.set(pill, { x: 0, y: 0 })
    }
  }, [reducedMotion, strength])

  const colors = COLORS[index - 1] || COLORS[0]

  return (
    <li
      ref={pillRef}
      className="process__pill"
      data-step={index}
      data-order={order}
      data-active={isActive ? 'true' : 'false'}
      data-state={dataActive}
      onMouseEnter={() => setActive?.(index)}
      onFocus={() => setActive?.(index)}
      tabIndex={0}
      style={{ '--pill-fill': colors.fill, '--pill-text': colors.text }}
    >
      <span className="process__pill-glow" aria-hidden="true" />
      <div ref={fillRef} className="process__pill-fill" aria-hidden="true" />
      <div className="process__pill-inner">
        <span className="process__pill-index">{String(index).padStart(2, '0')}</span>
        <strong className="process__pill-name">{label}</strong>
        <p className="process__pill-copy">{copy}</p>
      </div>
    </li>
  )
}
