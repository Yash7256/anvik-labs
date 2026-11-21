import type * as THREE from "three";

export type VisualQuality = {
  dpr: number;
  particleCount: number;
  fluidSize: number;
  topographic: boolean;
};

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  strength: number;
  targetStrength: number;
  trailX: number;
  trailY: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  lastMove: number;
};

type ScrollState = {
  progress: number;
  target: number;
  velocity: number;
  targetVelocity: number;
  speed: number;
  flowOffset: number;
};

export type VisualState = {
  pointer: PointerState;
  scroll: ScrollState;
  fluidTexture: THREE.Texture | null;
};

export const visualState: VisualState = {
  pointer: {
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    strength: 0,
    targetStrength: 0,
    trailX: 0.5,
    trailY: 0.5,
    velocityX: 0,
    velocityY: 0,
    speed: 0,
    lastMove: 0,
  },
  scroll: {
    progress: 0,
    target: 0,
    velocity: 0,
    targetVelocity: 0,
    speed: 0,
    flowOffset: 0,
  },
  fluidTexture: null,
};

export function setPointerTarget(x: number, y: number) {
  const pointer = visualState.pointer;
  const now = performance.now();
  const elapsed = Math.max(16, now - pointer.lastMove) / 1000;
  const deltaX = x - pointer.targetX;
  const deltaY = y - pointer.targetY;

  pointer.velocityX = Math.max(
    -1.5,
    Math.min(1.5, pointer.velocityX * 0.55 + (deltaX / elapsed) * 0.45),
  );
  pointer.velocityY = Math.max(
    -1.5,
    Math.min(1.5, pointer.velocityY * 0.55 + (deltaY / elapsed) * 0.45),
  );
  pointer.speed = Math.min(
    1,
    Math.hypot(pointer.velocityX, pointer.velocityY) * 2.5,
  );

  pointer.targetX = x;
  pointer.targetY = y;
  pointer.targetStrength = 1;
  pointer.lastMove = now;
}

export function releasePointer() {
  visualState.pointer.targetStrength = 0;
  visualState.pointer.trailX = visualState.pointer.targetX;
  visualState.pointer.trailY = visualState.pointer.targetY;
}

export function setScrollTarget(progress: number, velocity = 0) {
  visualState.scroll.target = Math.min(1, Math.max(0, progress));
  visualState.scroll.targetVelocity = Math.min(1, Math.max(-1, velocity));
}

export function advanceVisualState(delta: number) {
  const step = Math.min(delta, 1 / 20);
  const pointerEase = 1 - Math.exp(-step * 4);
  const strengthEase = 1 - Math.exp(-step * 2);
  const trailEase = 1 - Math.exp(-step * 2.2);
  const scrollEase = 1 - Math.exp(-step * 3.2);
  const scrollVelocityEase = 1 - Math.exp(-step * 5);

  const pointer = visualState.pointer;
  pointer.x += (pointer.targetX - pointer.x) * pointerEase;
  pointer.y += (pointer.targetY - pointer.y) * pointerEase;
  pointer.trailX += (pointer.x - pointer.trailX) * trailEase;
  pointer.trailY += (pointer.y - pointer.trailY) * trailEase;
  pointer.strength += (pointer.targetStrength - pointer.strength) * strengthEase;

  const friction = Math.exp(-step * 4);
  pointer.velocityX *= friction;
  pointer.velocityY *= friction;
  pointer.speed *= Math.exp(-step * 3);

  const idle = (performance.now() - pointer.lastMove) / 1000;
  const idleFade = 1 - Math.min(1, Math.max(0, idle - 0.12) / 1.1);
  pointer.targetStrength = Math.min(pointer.targetStrength, idleFade);

  const scroll = visualState.scroll;
  scroll.progress += (scroll.target - scroll.progress) * scrollEase;
  scroll.velocity +=
    (scroll.targetVelocity - scroll.velocity) * scrollVelocityEase;
  scroll.speed = Math.min(1, Math.abs(scroll.velocity) * 2.4);
  scroll.targetVelocity *= Math.exp(-step * 3.5);
  scroll.flowOffset = Math.max(
    -0.55,
    Math.min(0.55, scroll.flowOffset + scroll.velocity * step * 0.36 + step * 0.004),
  );
}

export function getVisualQuality(): VisualQuality {
  if (typeof window === "undefined") {
    return {
      dpr: 1,
      particleCount: 1200,
      fluidSize: 128,
      topographic: true,
    };
  }

  const width = window.innerWidth;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 4;
  const constrained =
    width < 768 || (memory !== undefined && memory <= 4) || cores <= 4;

  return {
    dpr: Math.min(window.devicePixelRatio || 1, constrained ? 1.35 : 1.75),
    particleCount: constrained ? 1400 : 4200,
    fluidSize: constrained ? 128 : 256,
    topographic: true,
  };
}
