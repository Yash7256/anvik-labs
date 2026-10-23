import { memo, useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'

const NODES = [
  { label: 'Learn', state: 'Completed', tone: 'cream' },
  { label: 'Practise', state: 'In progress', tone: 'grey' },
  { label: 'Share', state: 'Next', tone: 'burnt' },
  { label: 'Launch', state: 'Locked', tone: 'vivid' },
]

export const ProductPreview = memo(function ProductPreview({
  reducedMotion = false,
}) {
  const rootRef = useRef(null)
  const frameRef = useRef(null)
  const floatRef = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return

      const root = rootRef.current
      const frame = frameRef.current
      const float = floatRef.current
      if (!root || !frame || !float) return

      const floatTween = gsap.fromTo(
        float,
        { y: 2 },
        {
          y: -4,
          duration: 5.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        },
      )

      const canTilt = window.matchMedia(
        '(min-width: 1024px) and (pointer: fine)',
      ).matches
      if (!canTilt) return () => floatTween.kill()

      const rotateX = gsap.quickTo(frame, 'rotationX', {
        duration: 0.7,
        ease: 'power3.out',
      })
      const rotateY = gsap.quickTo(frame, 'rotationY', {
        duration: 0.7,
        ease: 'power3.out',
      })

      const reset = () => {
        rotateX(4)
        rotateY(-8)
        frame.style.setProperty('--mx', '52%')
        frame.style.setProperty('--my', '28%')
      }

      const onPointerMove = (event) => {
        const rect = root.getBoundingClientRect()
        const nx = gsap.utils.clamp(
          -0.5,
          0.5,
          (event.clientX - rect.left) / rect.width - 0.5,
        )
        const ny = gsap.utils.clamp(
          -0.5,
          0.5,
          (event.clientY - rect.top) / rect.height - 0.5,
        )

        rotateX(4 - ny * 12)
        rotateY(-8 + nx * 12)
        frame.style.setProperty('--mx', `${52 + nx * 60}%`)
        frame.style.setProperty('--my', `${28 + ny * 60}%`)
      }

      root.addEventListener('pointermove', onPointerMove)
      root.addEventListener('pointerleave', reset)

      return () => {
        floatTween.kill()
        root.removeEventListener('pointermove', onPointerMove)
        root.removeEventListener('pointerleave', reset)
      }
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  return (
    <div
      ref={rootRef}
      className="product-preview"
      data-cursor="Preview"
      role="img"
      aria-label="Preview of the Designers Room interface, showing Learn, Practise, Share and Launch stages, a checkout flow challenge, and a community case study post."
    >
      <div className="product-preview__parallax" data-preview-parallax>
        <div className="product-preview__entry" data-preview-entry>
          <div ref={floatRef} className="product-preview__float">
            <div
              ref={frameRef}
              className="product-preview__frame"
              data-preview-frame
              data-ui="true"
              aria-hidden="true"
            >
              <span className="product-preview__specular" aria-hidden="true" />

              <div className="product-preview__topbar">
                <span className="product-preview__mark" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
                <span className="product-preview__appname">Designers Room</span>
                <span className="product-preview__crumb">
                  Roadmap / Product design
                </span>
                <span className="product-preview__avatar">AR</span>
              </div>

              <div className="product-preview__body">
                <div className="product-preview__path">
                  <span className="product-preview__line" aria-hidden="true" />
                  {NODES.map((node) => (
                    <div
                      key={node.label}
                      className={`product-preview__node product-preview__node--${node.tone}`}
                    >
                      <span className="product-preview__node-dot" />
                      <span className="product-preview__node-label">
                        {node.label}
                      </span>
                      <span className="product-preview__node-state">
                        {node.state}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="product-preview__cards">
                  <article className="product-preview__card product-preview__card--challenge">
                    <div className="product-preview__card-top">
                      <span className="product-preview__kicker">Challenge 04</span>
                      <span className="product-preview__tag">Product design</span>
                    </div>
                    <p className="product-preview__card-title">Checkout flow</p>
                    <p className="product-preview__card-copy">
                      Redesign a three-step checkout for a small studio.
                    </p>
                    <div className="product-preview__progress">
                      <span />
                    </div>
                    <div className="product-preview__card-foot">
                      <span>3 of 5 tasks</span>
                      <span>Due Fri</span>
                    </div>
                  </article>

                  <article className="product-preview__card product-preview__card--post">
                    <span className="product-preview__post-avatar">MR</span>
                    <div className="product-preview__post-body">
                      <p className="product-preview__post-name">Maya R.</p>
                      <p className="product-preview__post-copy">
                        Shared a case study on onboarding flows.
                      </p>
                    </div>
                    <span className="product-preview__reaction">+12</span>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
