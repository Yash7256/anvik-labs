"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { noiseGLSL } from "./shaders/noise";
import { getVisualQuality, visualState } from "./state";

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
uniform vec2 uPointerVelocity;
uniform vec2 uAspect;
uniform float uPointerSpeed;
uniform float uTime;
uniform float uStrength;
uniform float uScroll;
uniform float uScrollVelocity;
uniform float uScrollSpeed;
uniform float uFlowOffset;
uniform float uScrollAccent;
uniform float uDark;

varying vec2 vUv;

${noiseGLSL}

float terrain(vec2 uv) {
  vec2 flow = vec2(
    curlNoise(uv * 2.0 + vec2(0.0, uFlowOffset * 0.3)).y * uScrollSpeed * 0.05,
    uFlowOffset
  );
  vec2 p = (uv + flow) * uAspect;
  float region = fbm(
    p * 1.15 + vec2(uTime * 0.002 + uScrollSpeed * 0.012, -uTime * 0.0015)
  );
  float speed = mix(0.35, 1.0, region) * (1.0 + uScrollSpeed * 0.85);

  vec2 warp = vec2(
    fbm(p * 1.8 + vec2(uTime * 0.008 * speed, 2.7)),
    fbm(p * 1.8 + vec2(8.1, -uTime * 0.006 * speed))
  ) - 0.5;

  float wave = sin(
    dot(p, vec2(2.3, 1.7)) * 2.2 -
      uTime * 0.12 * speed -
      uFlowOffset * 2.6 +
      region * 3.0
  );

  return fbm(p * 2.4 + warp * (0.9 + uScrollSpeed * 0.35) + wave * 0.05);
}

void main() {
  vec2 aspectPoint = vUv * uAspect;
  vec2 toPointer = (vUv - uPointer) * uAspect;
  float pointerDistance = length(toPointer);
  float falloff = exp(-pointerDistance * pointerDistance * 18.0);
  vec2 direction = toPointer / max(pointerDistance, 0.001);

  float ring = ripple(
    aspectPoint,
    uPointer * uAspect,
    0.04 + uStrength * 0.26,
    0.055
  ) * uStrength;

  vec2 displacement = direction * (uStrength * falloff * 0.12 + ring * 0.06);
  displacement += uPointerVelocity * falloff * 0.055 * (0.5 + uPointerSpeed);
  displacement += vec2(0.0, uScrollVelocity * 0.03) * (0.35 + falloff);

  float height = terrain(vUv + displacement);
  vec3 normal = normalize(
    vec3(-dFdx(height) * 150.0, -dFdy(height) * 150.0, 1.0)
  );

  float bands = height * 14.0 + ring * 1.4;
  float distanceToBand = abs(fract(bands) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.035, distanceToBand);

  float slope = 1.0 - normal.z;
  float ambientOcclusion = clamp(1.0 - slope * 1.5, 0.72, 1.0);
  vec3 lightDirection = normalize(vec3(-0.4, 0.55, 0.75));
  float diffuse = clamp(dot(normal, lightDirection), 0.0, 1.0);
  float specular = pow(
    clamp(dot(reflect(-lightDirection, normal), vec3(0.0, 0.0, 1.0)), 0.0, 1.0),
    8.0
  );

  float dye = texture2D(uFluid, vUv).b;
  float lower = 1.0 - smoothstep(0.2, 0.9, vUv.y);
  float edge = smoothstep(0.14, 0.62, length((vUv - 0.5) * vec2(1.2, 1.0)));
  float headline =
    (1.0 - smoothstep(0.18, 0.42, abs(vUv.x - 0.5))) *
    smoothstep(0.52, 0.64, vUv.y) *
    (1.0 - smoothstep(0.8, 0.9, vUv.y));

  float reveal =
    mix(0.09, 0.46, lower) *
    mix(0.55, 1.0, edge) *
    (1.0 - 0.94 * headline) *
    (1.0 - uScroll * 0.28);

  vec3 lightWarmGrey = vec3(0.73, 0.72, 0.7);
  vec3 lightShadow = vec3(0.64, 0.63, 0.61);
  vec3 lightHighlight = vec3(1.0, 0.995, 0.985);
  vec3 darkWarmGrey = vec3(0.58, 0.57, 0.55);
  vec3 darkShadow = vec3(0.36, 0.35, 0.34);
  vec3 darkHighlight = vec3(0.95, 0.93, 0.9);
  vec3 warmGrey = mix(lightWarmGrey, darkWarmGrey, uDark);
  vec3 shadow = mix(lightShadow, darkShadow, uDark);
  vec3 highlight = mix(lightHighlight, darkHighlight, uDark);
  vec3 accent = vec3(1.0, 0.353, 0.039);

  vec3 color = mix(shadow, warmGrey, diffuse);
  color = mix(color, highlight, specular * (0.6 - uDark * 0.18));
  color *= ambientOcclusion;
  float accentMix = smoothstep(0.66, 1.0, dye) * (0.08 + uDark * 0.04 + uScrollAccent * 0.12);
  color = mix(color, accent, accentMix);

  float opacityBoost = mix(1.0, 0.82, uDark) * (1.0 + uScrollAccent * 0.08);
  float opacity = line * reveal * (0.7 + diffuse * 0.45) * ambientOcclusion * opacityBoost;

  gl_FragColor = vec4(color, clamp(opacity, 0.0, mix(0.26, 0.22, uDark) + uScrollAccent * 0.05));
}
`;

export default function TopographicField() {
  const size = useThree((state) => state.size);
  const quality = useMemo(() => getVisualQuality(), []);

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
          uPointerVelocity: { value: new THREE.Vector2(0, 0) },
          uAspect: { value: new THREE.Vector2(1, 1) },
          uPointerSpeed: { value: 0 },
          uTime: { value: 0 },
          uStrength: { value: 0 },
          uScroll: { value: 0 },
          uScrollVelocity: { value: 0 },
          uScrollSpeed: { value: 0 },
          uFlowOffset: { value: 0 },
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
    const field = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    field.frustumCulled = false;
    return field;
  }, [material]);

  useEffect(
    () => () => {
      mesh.geometry.dispose();
      material.dispose();
      neutralTexture.dispose();
    },
    [material, mesh, neutralTexture],
  );

  useFrame((state) => {
    const pointer = visualState.pointer;
    const scroll = visualState.scroll;
    material.uniforms.uFluid.value = visualState.fluidTexture ?? neutralTexture;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPointer.value.set(pointer.x, pointer.y);
    material.uniforms.uPointerVelocity.value.set(
      pointer.velocityX,
      pointer.velocityY,
    );
    material.uniforms.uPointerSpeed.value = pointer.speed;
    material.uniforms.uAspect.value.set(size.width / size.height, 1);
    material.uniforms.uStrength.value = pointer.strength;
    material.uniforms.uScroll.value = scroll.progress;
    material.uniforms.uScrollVelocity.value = scroll.velocity;
    material.uniforms.uScrollSpeed.value = scroll.speed;
    material.uniforms.uFlowOffset.value = scroll.flowOffset;
    material.uniforms.uScrollAccent.value = scroll.accent;
    const darkTarget = visualState.theme === "dark" ? 1 : 0;
    material.uniforms.uDark.value +=
      (darkTarget - material.uniforms.uDark.value) * 0.08;
  });

  if (!quality.topographic) return null;

  return <primitive object={mesh} />;
}
