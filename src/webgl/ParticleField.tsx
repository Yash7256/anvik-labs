"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { noiseGLSL } from "./shaders/noise";
import { getVisualQuality, visualState } from "./state";

const vertexShader = /* glsl */ `
precision highp float;

attribute vec4 aSeed;

uniform sampler2D uFluid;
uniform vec2 uPointer;
uniform vec2 uAspect;
uniform float uTime;
uniform float uStrength;
uniform float uScroll;

varying vec2 vUv;
varying float vAlpha;
varying float vTint;

${noiseGLSL}

void main() {
  vUv = uv;

  vec2 point = aSeed.xy * 2.0 - 1.0;
  float depth = aSeed.w;

  vec2 drift = curlNoise(point * 1.6 + vec2(uTime * 0.02, depth * 4.0));
  point += drift * (0.012 + depth * 0.02);
  point.x += sin(uTime * 0.08 + aSeed.z * 12.0) * 0.006;

  vec2 pointerClip = uPointer * 2.0 - 1.0;
  vec2 delta = (point - pointerClip) * uAspect;
  float distanceToPointer = length(delta);
  float repulsion = exp(-distanceToPointer * distanceToPointer * 9.0) * uStrength;
  point += (delta / max(distanceToPointer, 0.001)) / uAspect * repulsion * (0.08 + depth * 0.06);

  point.y -= uScroll * (0.12 + depth * 0.35);

  vec2 fluidUv = clamp(point * 0.5 + 0.5, vec2(0.001), vec2(0.999));
  float dye = texture2D(uFluid, fluidUv).b;

  float particleSize = (0.7 + aSeed.z * 1.7) * (0.65 + depth * 0.7) * (0.8 + dye * 0.8);
  vec2 scale = vec2(particleSize / uAspect.x, particleSize) * 0.0022;
  vec2 clip = point + position.xy * scale;

  gl_Position = vec4(clip, 0.0, 1.0);
  vAlpha = (0.06 + aSeed.z * 0.14) * (0.55 + dye * 0.9) * (1.0 - uScroll * 0.3);
  vTint = aSeed.z;
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;
varying float vAlpha;
varying float vTint;

void main() {
  float distanceToCenter = length(vUv - 0.5);
  float alpha = smoothstep(0.5, 0.05, distanceToCenter) * vAlpha;

  vec3 warmWhite = vec3(0.99, 0.985, 0.975);
  vec3 warmGrey = vec3(0.72, 0.71, 0.69);
  vec3 accent = vec3(1.0, 0.353, 0.039);

  vec3 color = mix(warmGrey, warmWhite, smoothstep(0.15, 0.8, vTint));
  color = mix(color, accent, smoothstep(0.88, 1.0, vTint) * 0.12);

  gl_FragColor = vec4(color, alpha);
}
`;

export default function ParticleField() {
  const size = useThree((state) => state.size);
  const quality = useMemo(() => getVisualQuality(), []);

  const geometry = useMemo(() => {
    const base = new THREE.PlaneGeometry(1, 1);
    const instanced = new THREE.InstancedBufferGeometry();
    instanced.index = base.index;
    instanced.setAttribute("position", base.getAttribute("position"));
    instanced.setAttribute("uv", base.getAttribute("uv"));

    const seeds = new Float32Array(quality.particleCount * 4);
    for (let i = 0; i < quality.particleCount; i += 1) {
      seeds[i * 4] = Math.random();
      seeds[i * 4 + 1] = Math.random();
      seeds[i * 4 + 2] = Math.random();
      seeds[i * 4 + 3] = Math.random();
    }

    instanced.setAttribute(
      "aSeed",
      new THREE.InstancedBufferAttribute(seeds, 4),
    );
    instanced.instanceCount = quality.particleCount;
    return instanced;
  }, [quality.particleCount]);

  const neutralTexture = useMemo(() => {
    const texture = new THREE.DataTexture(
      new Uint8Array([128, 128, 0, 255]),
      1,
      1,
    );
    texture.needsUpdate = true;
    texture.colorSpace = THREE.NoColorSpace;
    return texture;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uFluid: { value: null },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uAspect: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 0 },
          uStrength: { value: 0 },
          uScroll: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    [],
  );

  const mesh = useMemo(() => {
    const particleMesh = new THREE.Mesh(geometry, material);
    particleMesh.frustumCulled = false;
    return particleMesh;
  }, [geometry, material]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      neutralTexture.dispose();
    },
    [geometry, material, neutralTexture],
  );

  useFrame((state) => {
    material.uniforms.uFluid.value = visualState.fluidTexture ?? neutralTexture;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPointer.value.set(
      visualState.pointer.x,
      visualState.pointer.y,
    );
    material.uniforms.uAspect.value.set(size.width / size.height, 1);
    material.uniforms.uStrength.value = visualState.pointer.strength;
    material.uniforms.uScroll.value = visualState.scroll.progress;
  });

  return <primitive object={mesh} />;
}
