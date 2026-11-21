"use client";

import { useEffect, useMemo, useRef } from "react";
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

uniform sampler2D uPrev;
uniform vec2 uPointer;
uniform vec2 uTrail;
uniform vec2 uAspect;
uniform float uTime;
uniform float uDelta;
uniform float uStrength;
uniform float uScroll;
uniform float uScrollVelocity;

varying vec2 vUv;

${noiseGLSL}

void main() {
  float frameScale = min(uDelta * 60.0, 2.0);

  vec4 previous = texture2D(uPrev, vUv);
  vec2 velocity = (previous.rg - 0.5) * 2.0;

  vec2 flow = curlNoise(vUv * 3.1 + vec2(uTime * 0.012, -uTime * 0.009));
  velocity = mix(velocity, flow * 0.16, 0.035 * frameScale);

  vec2 segment = uPointer - uTrail;
  vec2 local = vUv - uTrail;
  float along = clamp(
    dot(local, segment) / max(dot(segment, segment), 0.00001),
    0.0,
    1.0
  );
  vec2 nearest = uTrail + segment * along;

  vec2 delta = (vUv - nearest) * uAspect;
  float distanceToPointer = length(delta);
  float influence = exp(-distanceToPointer * distanceToPointer * 24.0) * uStrength;
  vec2 push = delta / max(distanceToPointer, 0.001);
  velocity += push * influence * 0.45 * frameScale;

  float wave = ripple(
    vUv * uAspect,
    uPointer * uAspect,
    0.05 + uStrength * 0.28,
    0.09
  ) * uStrength;
  velocity += push * wave * 0.18 * frameScale;
  velocity.y -= uScrollVelocity * 0.18 * frameScale;
  velocity = clamp(velocity, vec2(-1.0), vec2(1.0));

  vec2 backtrace = clamp(
    vUv - velocity * uDelta * (0.16 + uScroll * 0.34),
    vec2(0.001),
    vec2(0.999)
  );
  float dye = texture2D(uPrev, backtrace).b * pow(0.994, frameScale);

  float ambient = smoothstep(
    0.42,
    0.7,
    fbm(
      vUv * vec2(uAspect.x, 1.0) * 2.4 +
        vec2(uTime * 0.008, -uTime * 0.006)
    )
  );
  dye += (ambient * 0.025 + influence * 0.035 + wave * 0.012) * frameScale;

  vec2 centered = (vUv - 0.5) * vec2(1.15, 1.0);
  float edge = smoothstep(0.12, 0.62, length(centered));
  float lower = 1.0 - smoothstep(0.18, 0.95, vUv.y);
  dye *= mix(0.7, 1.0, edge) * mix(0.85, 1.0, lower);

  float headline =
    (1.0 - smoothstep(0.18, 0.42, abs(vUv.x - 0.5))) *
    smoothstep(0.52, 0.64, vUv.y) *
    (1.0 - smoothstep(0.8, 0.9, vUv.y));
  dye *= 1.0 - 0.6 * headline;

  gl_FragColor = vec4(velocity * 0.5 + 0.5, clamp(dye, 0.0, 1.0), 1.0);
}
`;

export default function FluidSimulation() {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const quality = useMemo(() => getVisualQuality(), []);
  const indexRef = useRef(0);

  const targets = useMemo(() => {
    const make = () => {
      const target = new THREE.WebGLRenderTarget(
        quality.fluidSize,
        quality.fluidSize,
        {
          format: THREE.RGBAFormat,
          type: THREE.HalfFloatType,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          depthBuffer: false,
          stencilBuffer: false,
        },
      );
      target.texture.colorSpace = THREE.NoColorSpace;
      return target;
    };
    return [make(), make()];
  }, [quality.fluidSize]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uPrev: { value: null },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uTrail: { value: new THREE.Vector2(0.5, 0.5) },
          uAspect: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 0 },
          uDelta: { value: 0 },
          uStrength: { value: 0 },
          uScroll: { value: 0 },
          uScrollVelocity: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        depthTest: false,
        depthWrite: false,
      }),
    [],
  );

  const scene = useMemo(() => {
    const next = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);
    next.add(new THREE.Mesh(geometry, material));
    return next;
  }, [material]);

  const camera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    [],
  );

  useEffect(() => {
    const previousTarget = gl.getRenderTarget();
    const previousColor = gl.getClearColor(new THREE.Color()).clone();
    const previousAlpha = gl.getClearAlpha();

    gl.setClearColor(new THREE.Color(0.5, 0.5, 0), 1);
    targets.forEach((target) => {
      gl.setRenderTarget(target);
      gl.clear(true, false, false);
    });

    gl.setRenderTarget(previousTarget);
    gl.setClearColor(previousColor, previousAlpha);

    return () => {
      targets.forEach((target) => target.dispose());
      scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh) child.geometry.dispose();
      });
      material.dispose();
      visualState.fluidTexture = null;
    };
  }, [gl, material, scene, targets]);

  useFrame((state, delta) => {
    const read = targets[indexRef.current];
    const write = targets[1 - indexRef.current];

    material.uniforms.uPrev.value = read.texture;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uDelta.value = delta;
    material.uniforms.uPointer.value.set(
      visualState.pointer.x,
      visualState.pointer.y,
    );
    material.uniforms.uTrail.value.set(
      visualState.pointer.trailX,
      visualState.pointer.trailY,
    );
    material.uniforms.uAspect.value.set(size.width / size.height, 1);
    material.uniforms.uStrength.value = visualState.pointer.strength;
    material.uniforms.uScroll.value = visualState.scroll.progress;
    material.uniforms.uScrollVelocity.value = visualState.scroll.velocity;

    const previousTarget = gl.getRenderTarget();
    gl.setRenderTarget(write);
    gl.render(scene, camera);
    gl.setRenderTarget(previousTarget);

    indexRef.current = 1 - indexRef.current;
    visualState.fluidTexture = write.texture;
  });

  return null;
}
