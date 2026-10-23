import { useEffect, useRef } from 'react'

import { gsap } from '@/lib/gsap'

export function ProcessRail({ rootRef, progressRef }) {
  const lineRef = useRef(null)
  const nodesRef = useRef([])

  useEffect(() => {
    const root = rootRef.current
    const line = lineRef.current
    const nodes = nodesRef.current.filter(Boolean)
    if (!root || !line || nodes.length < 4) return

    const update = () => {
      const p = Math.min(1, Math.max(0, progressRef.current || 0))
      gsap.set(line, { scaleY: p })
      nodes.forEach((node, index) => {
        const threshold = (index + 1) / 4
        const active = p >= threshold - 0.12
        const filled = p >= threshold - 0.02
        node.dataset.active = active ? 'true' : 'false'
        node.dataset.filled = filled ? 'true' : 'false'
      })
    }

    const id = setInterval(update, 16)
    update()
    return () => clearInterval(id)
  }, [rootRef, progressRef])

  return (
    <div className="process__rail" aria-hidden="true">
      <div className="process__rail-track" />
      <div ref={lineRef} className="process__rail-fill" />
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          ref={(el) => {
            nodesRef.current[index] = el
          }}
          className="process__rail-node"
          data-active="false"
          data-filled="false"
        />
      ))}
    </div>
  )
}
