import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'

import { PILLS } from './pills'

const MODE_INDEX = {
  idle: 0,
  products: 1,
  freelance: 2,
}

const VERTEX = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform vec2 uRes;
  uniform vec4 uRect0;
  uniform vec4 uRect1;
  uniform vec4 uRect2;
  uniform vec4 uRect3;
  uniform vec3 uColor0;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uActive0;
  uniform float uActive1;
  uniform float uActive2;
  uniform float uActive3;
  uniform float uMode;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uDpr;

  varying vec2 vUv;

  float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  void paintPill(
    vec4 rect,
    vec3 base,
    float active,
    inout vec3 color,
    inout float alpha,
    inout vec3 glowColor,
    inout float glowAmount
  ) {
    if (rect.z < 1.0 || rect.w < 1.0) return;

    vec2 size = rect.zw;
    vec2 center = rect.xy + size * 0.5;
    vec2 halfSize = size * 0.5;
    float radius = uMode > 0.5 && uMode < 1.5
      ? min(size.y * 0.17, 22.0)
      : min(halfSize.x, halfSize.y);
    vec2 q = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) - center;
    float d = sdRoundRect(q, halfSize, radius);
    float mask = 1.0 - smoothstep(-1.0 * uDpr, 1.0 * uDpr, d);

    if (mask > 0.001) {
      float t = clamp((q.y + halfSize.y) / max(1.0, size.y), 0.0, 1.0);
      vec3 shade = mix(base * 1.13, base * 0.64, t);
      shade += base * smoothstep(0.42, 0.0, t) * 0.2;

      vec2 pointer = uMouse - center;
      float spec = smoothstep(min(halfSize.x, halfSize.y) * 1.05, 0.0, length(q - pointer * 0.72));
      shade += vec3(1.0) * spec * 0.26;

      float sheen = 0.5 + 0.5 * sin(q.x / max(1.0, size.x) * 3.14159 + uTime * 0.45 + rect.x);
      shade += base * sheen * 0.035;

      shade *= mix(0.5, 1.0, active);

      color = mix(color, shade, mask);
      alpha = max(alpha, mask);
    }

    float glow = smoothstep(30.0 * uDpr, 0.0, abs(d)) * (1.0 - mask);
    glowColor += base * glow * (0.1 + 0.16 * active);
    glowAmount = max(glowAmount, glow);
  }

  void main() {
    vec3 color = vec3(0.0);
    float alpha = 0.0;
    vec3 glowColor = vec3(0.0);
    float glowAmount = 0.0;

    paintPill(uRect0, uColor0, uActive0, color, alpha, glowColor, glowAmount);
    paintPill(uRect1, uColor1, uActive1, color, alpha, glowColor, glowAmount);
    paintPill(uRect2, uColor2, uActive2, color, alpha, glowColor, glowAmount);
    paintPill(uRect3, uColor3, uActive3, color, alpha, glowColor, glowAmount);

    color += glowColor * 0.65;
    alpha = clamp(alpha + glowAmount * 0.22, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha);
  }
`

function hexToRgb(hex) {
  const value = hex.replace('#', '')
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
  ]
}

export const PillStack = forwardRef(function PillStack(
  { mode = 'idle', reducedMotion = false },
  ref,
) {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const innerRefs = useRef([])
  const pillRefs = useRef([])
  const activeRef = useRef(-1)
  const modeRef = useRef(mode)

  useEffect(() => {
    modeRef.current = mode
    if (rootRef.current) rootRef.current.dataset.mode = mode
  }, [mode])

  useImperativeHandle(
    ref,
    () => ({
      setActive(index) {
        activeRef.current = index
        pillRefs.current.forEach((pill, pillIndex) => {
          if (!pill) return
          pill.dataset.active = String(index < 0 || pillIndex === index)
        })
      },
    }),
    [],
  )

  useGSAP(
    () => {
      if (reducedMotion) return

      const inners = innerRefs.current

      if (mode === 'freelance') {
        gsap.to(inners, {
          scale: 1.045,
          duration: 0.55,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.08,
        })
      } else if (mode === 'products') {
        gsap.to(inners, {
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power3.out',
        })
      } else {
        gsap.fromTo(
          inners,
          { y: 0 },
          {
            y: (index) => (index % 2 === 0 ? -4 : 4),
            duration: (index) => 3.2 + index * 0.35,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: (index) => index * 0.18,
          },
        )
      }
    },
    { scope: rootRef, dependencies: [mode, reducedMotion] },
  )

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current

    if (!root || !canvas) return

    if (reducedMotion) {
      root.dataset.webgl = 'false'
      return
    }

    let disposed = false
    let renderer
    let mesh
    let ticker
    let resizeObserver
    let intersectionObserver
    let onPointerMove

    const setup = async () => {
      try {
        const { Renderer, Program, Mesh, Triangle, Vec2 } = await import('ogl')
        if (disposed) return

        renderer = new Renderer({
          canvas,
          alpha: true,
          antialias: true,
          dpr: Math.min(window.devicePixelRatio || 1, 2),
        })

        const gl = renderer.gl
        gl.clearColor(0, 0, 0, 0)

        const uniforms = {
          uRes: { value: new Vec2(1, 1) },
          uMode: { value: 0 },
          uMouse: { value: new Vec2(0, 0) },
          uTime: { value: 0 },
          uDpr: { value: renderer.dpr },
        }

        PILLS.forEach((pill, index) => {
          const [r, g, b] = hexToRgb(pill.color)
          uniforms[`uRect${index}`] = { value: new Float32Array(4) }
          uniforms[`uColor${index}`] = { value: new Float32Array([r, g, b]) }
          uniforms[`uActive${index}`] = { value: 1 }
        })

        const geometry = new Triangle(gl)
        const program = new Program(gl, {
          vertex: VERTEX,
          fragment: FRAGMENT,
          transparent: true,
          uniforms,
        })

        mesh = new Mesh(gl, { geometry, program })

        const resize = () => {
          const rect = root.getBoundingClientRect()
          const width = rect.width + 192
          const height = rect.height + 256
          if (!width || !height) return

          renderer.setSize(width, height)
          uniforms.uRes.value.set(gl.canvas.width, gl.canvas.height)
          uniforms.uDpr.value = renderer.dpr
        }

        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(root)
        resize()

        onPointerMove = (event) => {
          const rect = canvas.getBoundingClientRect()
          uniforms.uMouse.value.set(
            (event.clientX - rect.left) * renderer.dpr,
            (event.clientY - rect.top) * renderer.dpr,
          )
        }
        window.addEventListener('pointermove', onPointerMove, { passive: true })

        let visible = true
        intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting
          },
          { threshold: 0 },
        )
        intersectionObserver.observe(root)

        ticker = () => {
          if (disposed || document.hidden || !visible) return

          const canvasRect = canvas.getBoundingClientRect()
          const dpr = renderer.dpr

          innerRefs.current.forEach((element, index) => {
            if (!element) return
            const rect = element.getBoundingClientRect()
            const values = uniforms[`uRect${index}`].value
            values[0] = (rect.left - canvasRect.left) * dpr
            values[1] = (rect.top - canvasRect.top) * dpr
            values[2] = rect.width * dpr
            values[3] = rect.height * dpr
          })

          const active = activeRef.current
          for (let index = 0; index < 4; index += 1) {
            uniforms[`uActive${index}`].value = active < 0 ? 1 : index === active ? 1 : 0
          }

          uniforms.uMode.value = MODE_INDEX[modeRef.current] ?? 0
          uniforms.uTime.value = performance.now() / 1000

          renderer.render({ scene: mesh })
        }

        gsap.ticker.add(ticker)

        root.dataset.webgl = 'true'
        gsap.to(canvas, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' })
      } catch {
        if (root) root.dataset.webgl = 'false'
      }
    }

    setup()

    return () => {
      disposed = true
      if (ticker) gsap.ticker.remove(ticker)
      if (onPointerMove) window.removeEventListener('pointermove', onPointerMove)
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      if (renderer) {
        const loseContext = renderer.gl.getExtension('WEBGL_lose_context')
        loseContext?.loseContext()
      }
      delete root.dataset.webgl
      gsap.set(canvas, { autoAlpha: 0 })
    }
  }, [reducedMotion])

  return (
    <div ref={rootRef} className="pill-stack" data-mode={mode} data-webgl="false">
      <div className="pill-stack__body">
        <div className="pill-stack__glow" aria-hidden="true" />
        <canvas ref={canvasRef} className="pill-stack__canvas" aria-hidden="true" />
        <div className="pill-stack__pills">
          {PILLS.map((pill, index) => (
            <div
              key={pill.label}
              ref={(element) => {
                pillRefs.current[index] = element
              }}
              className="hero-pill"
              data-hero-pill
              data-index={index}
              data-active="true"
              aria-hidden="true"
              style={{ '--pill-color': pill.color, '--pill-ink': pill.ink }}
            >
              <div
                ref={(element) => {
                  innerRefs.current[index] = element
                }}
                className="hero-pill__inner"
              >
                <span className="hero-pill__dot" />
                <span className="hero-pill__label">{pill.label}</span>
                <span className="hero-pill__arrow">↗</span>
              </div>
            </div>
          ))}
        </div>
        <ol className="sr-only" aria-label="Our process">
          {PILLS.map((pill) => (
            <li key={pill.label}>{pill.label}</li>
          ))}
        </ol>
      </div>
    </div>
  )
})
