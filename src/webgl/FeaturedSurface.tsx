"use client";

import { useEffect, useMemo, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getVisualQuality } from "./state";

export type FeaturedPointer = {
  x: number;
  y: number;
  strength: number;
};

type FeaturedSurfaceProps = {
  src: string;
  pointerRef: MutableRefObject<FeaturedPointer>;
  scrollRef: MutableRefObject<number>;
  visible: boolean;
  onReady: () => void;
};

const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uImageAspect;
uniform float uStrength;
uniform float uTime;
uniform float uScroll;
uniform float uParallax;

varying vec2 vUv;

void main() {
  float containerAspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 cover = vec2(1.0);
  if (uImageAspect > containerAspect) {
    cover.x = containerAspect / uImageAspect;
  } else {
    cover.y = uImageAspect / containerAspect;
  }

  vec2 uv = (vUv - 0.5) * cover + 0.5;
  uv = (uv - 0.5) * (1.0 - uStrength * 0.025) + 0.5;
  uv.y += uParallax;

  vec2 aspectPoint = vUv * vec2(containerAspect, 1.0);
  vec2 aspectPointer = uPointer * vec2(containerAspect, 1.0);
  vec2 toPointer = aspectPoint - aspectPointer;
  float distanceToPointer = length(toPointer);
  float falloff = exp(-distanceToPointer * distanceToPointer * 14.0) * uStrength;
  float ripple = sin(distanceToPointer * 24.0 - uTime * 2.4) * falloff;

  vec2 displacement = normalize(toPointer + vec2(0.0001)) * ripple * 0.006;
  displacement += vec2(
    sin(uv.y * 9.0 + uTime * 0.35),
    cos(uv.x * 8.0 - uTime * 0.28)
  ) * 0.0016 * (0.4 + uScroll);

  vec3 color = texture2D(uTexture, clamp(uv + displacement, vec2(0.001), vec2(0.999))).rgb;
  color *= 1.0 + falloff * 0.09;

  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

function ContextGuard({ onLost }: { onLost: () => void }) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (event: Event) => {
      event.preventDefault();
      onLost();
    };
    canvas.addEventListener("webglcontextlost", handleLost);
    return () => canvas.removeEventListener("webglcontextlost", handleLost);
  }, [gl, onLost]);

  return null;
}

function Surface({
  src,
  pointerRef,
  scrollRef,
  onLost,
  onReady,
}: Omit<FeaturedSurfaceProps, "visible"> & {
  onLost: () => void;
}) {
  const size = useThree((state) => state.size);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loaded = new THREE.TextureLoader().load(src, () => {
      if (!cancelled) setTexture(loaded);
    });
    loaded.colorSpace = THREE.SRGBColorSpace;
    loaded.minFilter = THREE.LinearMipmapLinearFilter;
    loaded.magFilter = THREE.LinearFilter;

    return () => {
      cancelled = true;
      loaded.dispose();
    };
  }, [src]);

  useEffect(() => {
    if (texture) onReady();
  }, [onReady, texture]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: null },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uImageAspect: { value: 1 },
          uStrength: { value: 0 },
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uParallax: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        depthTest: false,
        depthWrite: false,
      }),
    [],
  );

  const mesh = useMemo(() => {
    const surface = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    surface.frustumCulled = false;
    return surface;
  }, [material]);

  useEffect(
    () => () => {
      mesh.geometry.dispose();
      material.dispose();
    },
    [material, mesh],
  );

  useFrame((state) => {
    if (!texture) return;

    const pointer = pointerRef.current;
    const scroll = scrollRef.current;
    const image = texture.image as { width?: number; height?: number };
    const aspect =
      image.width && image.height ? image.width / image.height : 1;

    material.uniforms.uTexture.value = texture;
    material.uniforms.uResolution.value.set(size.width, size.height);
    material.uniforms.uPointer.value.set(pointer.x, pointer.y);
    material.uniforms.uImageAspect.value = aspect;
    material.uniforms.uStrength.value = pointer.strength;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uScroll.value = scroll;
    material.uniforms.uParallax.value = (scroll - 0.5) * 0.035;
  });

  if (!texture) return null;

  return (
    <>
      <ContextGuard onLost={onLost} />
      <primitive object={mesh} />
    </>
  );
}

export default function FeaturedSurface({
  src,
  pointerRef,
  scrollRef,
  visible,
  onReady,
}: FeaturedSurfaceProps) {
  const quality = useMemo(() => getVisualQuality(), []);
  const [lost, setLost] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) onReady();
  }, [onReady, ready]);

  if (lost) return null;

  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={quality.dpr}
      gl={{
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Surface
        src={src}
        pointerRef={pointerRef}
        scrollRef={scrollRef}
        onLost={() => setLost(true)}
        onReady={() => setReady(true)}
      />

    </Canvas>
  );
}
