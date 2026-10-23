import { useRef } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'

export function MagneticButton({
  children,
  className = '',
  href,
  strength = 12,
  onClick,
  type = 'button',
  ...rest
}) {
  const ref = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const element = ref.current
      const canHover = window.matchMedia('(pointer: fine)').matches

      if (!element || reducedMotion || !canHover) return

      const moveX = gsap.quickTo(element, 'x', {
        duration: 0.45,
        ease: 'power3.out',
      })
      const moveY = gsap.quickTo(element, 'y', {
        duration: 0.45,
        ease: 'power3.out',
      })

      const onPointerMove = (event) => {
        const rect = element.getBoundingClientRect()
        const offsetX = event.clientX - (rect.left + rect.width / 2)
        const offsetY = event.clientY - (rect.top + rect.height / 2)

        moveX(gsap.utils.clamp(-strength, strength, offsetX * 0.32))
        moveY(gsap.utils.clamp(-strength, strength, offsetY * 0.32))
      }

      const reset = () => {
        moveX(0)
        moveY(0)
      }

      element.addEventListener('pointermove', onPointerMove)
      element.addEventListener('pointerleave', reset)
      element.addEventListener('blur', reset)

      return () => {
        element.removeEventListener('pointermove', onPointerMove)
        element.removeEventListener('pointerleave', reset)
        element.removeEventListener('blur', reset)
      }
    },
    { scope: ref, dependencies: [reducedMotion, strength] },
  )

  const Tag = href ? 'a' : 'button'

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      type={href ? undefined : type}
      className={`magnetic ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
