"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { visualState } from "./state";

const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D uFluid;
uniform vec2 uPointer;
uniform vec2 uTrail;
uniform vec2 uAspect;
uniform float uStrength;
uniform float uScroll;
uniform float uScrollAccent;
uniform float uDark;

varying vec2 vUv;

void main() {
  float dye = texture2D(uFluid, vUv).b;
  float pigment = smoothstep(0.04, 0.5, dye);

  vec2 segment = uPointer - uTrail;
  vec2 local = vUv - uTrail;
  float along = clamp(
    dot(local, segment) / max(dot(segment, segment), 0.00001),
    0.0,
    1.0
  );
  vec2 toNearest = (vUv - (uTrail + segment * along)) * uAspect;
  float hover = exp(-dot(toNearest, toNearest) * 18.0) * uStrength;

  vec2 toPointer = (vUv - uPointer) * uAspect;
  float halo = exp(-dot(toPointer, toPointer) * 10.0) * uStrength;

  float lower = 1.0 - smoothstep(0.2, 0.9, vUv.y);
  float edge = smoothstep(0.14, 0.62, length((vUv - 0.5) * vec2(1.2, 1.0)));
  float headline =
    (1.0 - smoothstep(0.18, 0.42, abs(vUv.x - 0.5))) *
    smoothstep(0.52, 0.64, vUv.y) *
    (1.0 - smoothstep(0.8, 0.9, vUv.y));

  float mask =
    mix(0.5, 1.0, lower) *
    mix(0.85, 1.0, edge) *
    (1.0 - 0.85 * headline) *
    (1.0 - uScroll * 0.28);

  vec3 warmGrey = mix(vec3(0.8, 0.79, 0.77), vec3(0.62, 0.6, 0.58), uDark);
  vec3 burntOrange = vec3(0.72, 0.28, 0.08);
  float accentBoost = 1.0 + uScrollAccent * 0.9;
  float tint = clamp(
    halo * 0.55 + smoothstep(0.72, 1.0, dye) * (0.05 + uScrollAccent * 0.12),
    0.0,
    0.32 + uScrollAccent * 0.18
  );
  vec3 color = mix(warmGrey, burntOrange, tint);

  float baseWash = mix(0.11, 0.085, uDark) * accentBoost;
  float haloBase = mix(0.17, 0.13, uDark) * (1.0 + uScrollAccent * 0.55);
  float washAlpha = pigment * mask * baseWash * (1.0 + hover * 0.55);
  float haloAlpha = halo * (0.6 + pigment * 0.4) * haloBase;
  float maxAlpha = mix(0.18, 0.16, uDark) + uScrollAccent * 0.07;
  gl_FragColor = vec4(color, clamp(washAlpha + haloAlpha, 0.0, maxAlpha));
}
`;

export default function FluidWash() {
  const size = useThree((state) => state.size);
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
          uTrail: { value: new THREE.Vector2(0.5, 0.5) },
          uAspect: { value: new THREE.Vector2(1, 1) },
          uStrength: { value: 0 },
          uScroll: { value: 0 },
          uScrollAccent: { value: 0 },
          uDark: { value: 0 },
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
    const wash = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    wash.frustumCulled = false;
    return wash;
  }, [material]);

  useEffect(
    () => () => {
      mesh.geometry.dispose();
      material.dispose();
      neutralTexture.dispose();
    },
    [material, mesh, neutralTexture],
  );

  useFrame(() => {
    const pointer = visualState.pointer;
    material.uniforms.uFluid.value = visualState.fluidTexture ?? neutralTexture;
    material.uniforms.uPointer.value.set(pointer.x, pointer.y);
    material.uniforms.uTrail.value.set(pointer.trailX, pointer.trailY);
    material.uniforms.uAspect.value.set(size.width / size.height, 1);
    material.uniforms.uStrength.value = pointer.strength;
    material.uniforms.uScroll.value = visualState.scroll.progress;
    material.uniforms.uScrollAccent.value = visualState.scroll.accent;
    const darkTarget = visualState.theme === "dark" ? 1 : 0;
    material.uniforms.uDark.value +=
      (darkTarget - material.uniforms.uDark.value) * 0.08;
  });

  return <primitive object={mesh} />;
}
