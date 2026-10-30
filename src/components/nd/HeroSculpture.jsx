import { useEffect, useRef, useState } from 'react'

const TRACK_ONE = [
  [-2.6, -2.1, -0.9],
  [-1.7, -1.35, 0.55],
  [-0.9, -0.2, 0.8],
  [-0.25, 1.15, 0.65],
  [0.65, 2.1, 0.15],
  [1.6, 1.4, -0.6],
  [1.35, 0.2, -0.85],
  [0.4, -1.1, -0.55],
  [-0.7, -2.0, 0.25],
  [-1.9, -2.45, 0.7],
]

const TRACK_TWO = [
  [2.6, -1.8, -0.8],
  [1.7, -0.8, 0.65],
  [0.9, 0.35, 0.9],
  [0.15, 1.45, 0.55],
  [-0.9, 1.85, -0.2],
  [-1.7, 0.9, -0.75],
  [-1.25, -0.35, -0.85],
  [-0.3, -1.35, -0.5],
  [0.8, -2.15, 0.3],
  [1.9, -2.5, 0.75],
]

function createAShape(THREE) {
  const shape = new THREE.Shape()

  shape.moveTo(-1.8, -2.3)
  shape.lineTo(-1.15, -2.3)
  shape.lineTo(-0.35, -0.55)
  shape.lineTo(0.35, -0.55)
  shape.lineTo(1.15, -2.3)
  shape.lineTo(1.8, -2.3)
  shape.lineTo(0.28, 2.3)
  shape.lineTo(-0.28, 2.3)
  shape.closePath()

  const counter = new THREE.Path()
  counter.moveTo(-0.65, 0.15)
  counter.lineTo(0.65, 0.15)
  counter.lineTo(0, 1.75)
  counter.closePath()
  shape.holes.push(counter)

  return shape
}

function createCurve(THREE, points) {
  return new THREE.CatmullRomCurve3(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    'centripetal',
    0.5,
  )
}

function mountSculpture(THREE, RoomEnvironment, canvas, { onReady }) {
  const container = canvas.parentElement
  if (!container) return () => {}

  const initialWidth = container.clientWidth || 1
  const initialHeight = container.clientHeight || 1
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(initialWidth, initialHeight, false)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.08
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xd4d4d4, 10, 17)

  const camera = new THREE.PerspectiveCamera(33, initialWidth / initialHeight, 0.1, 60)
  camera.position.set(0.1, 0.55, 8.1)
  camera.lookAt(0, 0.25, 0)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = pmrem.fromScene(room, 0.04).texture
  scene.environment = environment

  const group = new THREE.Group()
  group.rotation.set(0.04, -0.22, -0.03)
  scene.add(group)

  const aGeometry = new THREE.ExtrudeGeometry(createAShape(THREE), {
    depth: 0.9,
    bevelEnabled: true,
    bevelThickness: 0.16,
    bevelSize: 0.12,
    bevelOffset: 0,
    bevelSegments: 6,
    curveSegments: 24,
  })
  aGeometry.center()

  const graphite = new THREE.MeshPhysicalMaterial({
    color: 0x252525,
    metalness: 0.9,
    roughness: 0.27,
    clearcoat: 0.55,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.2,
  })

  const letter = new THREE.Mesh(aGeometry, graphite)
  letter.castShadow = true
  letter.receiveShadow = true
  group.add(letter)

  const curveOne = createCurve(THREE, TRACK_ONE)
  const curveTwo = createCurve(THREE, TRACK_TWO)

  const steel = new THREE.MeshPhysicalMaterial({
    color: 0xb9b9b9,
    metalness: 0.98,
    roughness: 0.17,
    clearcoat: 0.4,
    clearcoatRoughness: 0.14,
    envMapIntensity: 1.35,
  })

  const darkSteel = new THREE.MeshPhysicalMaterial({
    color: 0x383838,
    metalness: 0.94,
    roughness: 0.24,
    clearcoat: 0.45,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.2,
  })

  const trackOne = new THREE.Mesh(
    new THREE.TubeGeometry(curveOne, 190, 0.135, 12, false),
    steel,
  )
  const trackTwo = new THREE.Mesh(
    new THREE.TubeGeometry(curveTwo, 190, 0.135, 12, false),
    darkSteel,
  )
  trackOne.castShadow = true
  trackOne.receiveShadow = true
  trackTwo.castShadow = true
  trackTwo.receiveShadow = true
  group.add(trackOne, trackTwo)

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0xe2552a,
    emissive: 0xe2552a,
    emissiveIntensity: 1.35,
    metalness: 0.25,
    roughness: 0.32,
  })

  const accentGeometry = new THREE.SphereGeometry(0.095, 18, 18)
  const accentPoints = [
    curveOne.getPointAt(0.34),
    curveOne.getPointAt(0.68),
    curveTwo.getPointAt(0.27),
    curveTwo.getPointAt(0.72),
  ]

  accentPoints.forEach((point) => {
    const accent = new THREE.Mesh(accentGeometry, accentMaterial)
    accent.position.copy(point)
    accent.castShadow = true
    group.add(accent)
  })

  const beadMaterial = new THREE.MeshStandardMaterial({
    color: 0xff7a43,
    emissive: 0xe2552a,
    emissiveIntensity: 1.8,
    metalness: 0.2,
    roughness: 0.28,
  })
  const beadGeometry = new THREE.SphereGeometry(0.065, 16, 16)
  const beadOne = new THREE.Mesh(beadGeometry, beadMaterial)
  const beadTwo = new THREE.Mesh(beadGeometry, beadMaterial)
  group.add(beadOne, beadTwo)

  const shadowGeometry = new THREE.PlaneGeometry(20, 20)
  const shadowMaterial = new THREE.ShadowMaterial({
    color: 0x1b1714,
    opacity: 0.24,
  })
  const shadowPlane = new THREE.Mesh(shadowGeometry, shadowMaterial)
  shadowPlane.rotation.x = -Math.PI / 2
  shadowPlane.position.y = -2.45
  shadowPlane.receiveShadow = true
  scene.add(shadowPlane)

  const hemisphere = new THREE.HemisphereLight(0xffffff, 0x8b7d73, 0.9)
  scene.add(hemisphere)

  const keyLight = new THREE.DirectionalLight(0xfff1e7, 3.4)
  keyLight.position.set(4.5, 6, 5)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.set(1024, 1024)
  keyLight.shadow.camera.near = 1
  keyLight.shadow.camera.far = 22
  keyLight.shadow.camera.left = -5.5
  keyLight.shadow.camera.right = 5.5
  keyLight.shadow.camera.top = 6
  keyLight.shadow.camera.bottom = -4
  keyLight.shadow.bias = -0.0006
  keyLight.shadow.radius = 6
  scene.add(keyLight)

  const rimLight = new THREE.DirectionalLight(0xffffff, 2.4)
  rimLight.position.set(-5, 2.5, 3.5)
  scene.add(rimLight)

  const warmFill = new THREE.PointLight(0xe2552a, 10, 8, 2)
  warmFill.position.set(2.2, 0.1, 2.6)
  scene.add(warmFill)

  let pointerX = 0
  let pointerY = 0
  let inView = true
  let rafId = 0
  let ready = false
  let lastTime = 0
  const clock = new THREE.Clock()

  const onPointerMove = (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return
    pointerX = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1))
    pointerY = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight) * 2 - 1))
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })

  const updateBeads = (time) => {
    beadOne.position.copy(curveOne.getPointAt((time * 0.035 + 0.12) % 1))
    beadTwo.position.copy(curveTwo.getPointAt((time * 0.028 + 0.58) % 1))
  }

  const renderFrame = (now) => {
    if (!inView || document.hidden) {
      rafId = 0
      return
    }

    const delta = Math.min((now - lastTime) / 1000, 0.05)
    lastTime = now
    const time = clock.getElapsedTime()

    if (!reducedMotion) {
      const targetY = -0.22 + pointerX * 0.14
      const targetX = 0.04 + pointerY * 0.055
      group.rotation.y += (targetY - group.rotation.y) * Math.min(1, delta * 4.5)
      group.rotation.x += (targetX - group.rotation.x) * Math.min(1, delta * 4.5)
      camera.position.y = 0.55 + Math.sin(time * 0.24) * 0.04
      camera.lookAt(0, 0.25, 0)
      updateBeads(time)
      warmFill.intensity = 10 + Math.sin(time * 0.65) * 1.8
    }

    renderer.render(scene, camera)

    if (!ready) {
      ready = true
      onReady()
    }

    rafId = requestAnimationFrame(renderFrame)
  }

  const start = () => {
    if (rafId || reducedMotion) return
    lastTime = performance.now()
    rafId = requestAnimationFrame(renderFrame)
  }

  const stop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  }

  const resize = () => {
    const width = container.clientWidth
    const height = container.clientHeight
    if (!width || !height) return
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.render(scene, camera)
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)

  const onVisibilityChange = () => {
    if (document.hidden) stop()
    else start()
  }
  document.addEventListener('visibilitychange', onVisibilityChange)

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    if (inView) start()
    else stop()
  }, { rootMargin: '100px' })
  intersectionObserver.observe(container)

  if (reducedMotion) {
    updateBeads(0)
    renderer.render(scene, camera)
    ready = true
    onReady()
  } else {
    start()
  }

  return () => {
    stop()
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('pointermove', onPointerMove)
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      }
    })
    environment.dispose()
    pmrem.dispose()
    if (typeof room.dispose === 'function') room.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
  }
}

function SculptureFallback() {
  return (
    <svg
      className="nd-hero__sculpture-fallback"
      viewBox="-3.2 -3.2 6.4 6.4"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="sculpture-glow" cx="58%" cy="46%" r="55%">
          <stop offset="0%" stopColor="#e2552a" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#e2552a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e2552a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sculpture-graphite" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="36%" stopColor="#272727" />
          <stop offset="100%" stopColor="#151515" />
        </linearGradient>
        <linearGradient id="sculpture-steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#666666" />
          <stop offset="48%" stopColor="#d0d0d0" />
          <stop offset="100%" stopColor="#6b6b6b" />
        </linearGradient>
        <linearGradient id="sculpture-dark-steel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5a5a5a" />
          <stop offset="50%" stopColor="#222222" />
          <stop offset="100%" stopColor="#0f0f0f" />
        </linearGradient>
        <filter id="sculpture-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0.08" dy="0.22" stdDeviation="0.16" floodColor="#2d241f" floodOpacity="0.28" />
        </filter>
      </defs>

      <ellipse cx="0.55" cy="0.1" rx="3" ry="2.8" fill="url(#sculpture-glow)" />

      <path
        d="M-2.6 -2.1 C-2.2 -1.8 -1.9 -1.55 -1.7 -1.35 C-1.35 -0.95 -1.1 -0.5 -0.9 -0.2 C-0.7 0.15 -0.48 0.62 -0.25 1.15 C0.02 1.72 0.34 2.02 0.65 2.1 C0.96 2.18 1.3 1.88 1.6 1.4 C1.82 1.06 1.72 0.6 1.35 0.2 C1.05 -0.12 0.74 -0.34 0.4 -1.1 C0.16 -1.63 -0.25 -1.84 -0.7 -2 C-1.1 -2.14 -1.52 -2.33 -1.9 -2.45"
        fill="none"
        stroke="url(#sculpture-steel)"
        strokeWidth="0.145"
        strokeLinecap="round"
      />
      <path
        d="M2.6 -1.8 C2.25 -1.52 1.94 -1.16 1.7 -0.8 C1.38 -0.31 1.14 0.02 0.9 0.35 C0.63 0.72 0.4 1.1 0.15 1.45 C-0.16 1.86 -0.52 2.02 -0.9 1.85 C-1.25 1.69 -1.5 1.33 -1.7 0.9 C-1.88 0.52 -1.62 0.08 -1.25 -0.35 C-0.95 -0.7 -0.62 -0.98 -0.3 -1.35 C0.03 -1.74 0.42 -1.98 0.8 -2.15 C1.16 -2.31 1.53 -2.43 1.9 -2.5"
        fill="none"
        stroke="url(#sculpture-dark-steel)"
        strokeWidth="0.145"
        strokeLinecap="round"
      />

      <path
        d="M-1.8-2.3H-1.15L-0.35-0.55H0.35L1.15-2.3H1.8L0.28 2.3H-0.28ZM-0.65 0.15H0.65L0 1.75Z"
        fill="url(#sculpture-graphite)"
        fillRule="evenodd"
        filter="url(#sculpture-shadow)"
      />
      <path
        d="M-1.7-2.22H-1.22L-0.42-0.46H0.42L1.22-2.22H1.7L0.24 2.22H-0.24Z"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.09"
        strokeWidth="0.018"
      />

      <circle cx="-0.61" cy="0.62" r="0.075" fill="#e2552a" />
      <circle cx="0.47" cy="1.52" r="0.06" fill="#e2552a" />
      <circle cx="1.16" cy="-0.33" r="0.07" fill="#e2552a" />
      <circle cx="-0.98" cy="-1.18" r="0.055" fill="#e2552a" />
    </svg>
  )
}

export function HeroSculpture() {
  const canvasRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const update = () => setEnabled(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    let disposed = false
    let cleanup = () => {}

    import('three')
      .then(async (THREE) => {
        if (disposed) return
        const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js')
        if (disposed) return
        cleanup = mountSculpture(THREE, RoomEnvironment, canvas, {
          onReady: () => setReady(true),
        })
      })
      .catch(() => {
        if (!disposed) setFailed(true)
      })

    return () => {
      disposed = true
      cleanup()
    }
  }, [enabled])

  return (
    <div
      className="nd-hero__sculpture"
      data-ready={ready || undefined}
      data-failed={failed || undefined}
      aria-hidden="true"
    >
      <SculptureFallback />
      {enabled && (
        <canvas ref={canvasRef} className="nd-hero__sculpture-canvas" />
      )}
    </div>
  )
}
