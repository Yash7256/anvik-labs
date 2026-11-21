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
  accent: number;
};

type CueState = {
  x: number;
  y: number;
  strength: number;
  targetStrength: number;
  pulse: number;
  active: boolean;
};

export type ThemeMode = "light" | "dark";

export type VisualState = {
  pointer: PointerState;
  scroll: ScrollState;
  cue: CueState;
  fluidTexture: THREE.Texture | null;
  theme: ThemeMode;
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
    accent: 0,
  },
  cue: {
    x: 0.5,
    y: 0.82,
    strength: 0,
    targetStrength: 0,
    pulse: 0,
    active: false,
  },
  fluidTexture: null,
  theme: "light",
};

export function setPointerTarget(x: number, y: number) {
  const pointer = visualState.pointer;
  const now = performance.now();
  const elapsed = Math.max(16, now - pointer.lastMove) / 1000;
  const deltaX = x - pointer.targetX;
  const deltaY = y - pointer.targetY;

  const nextVelocityX = deltaX / elapsed;
  const nextVelocityY = deltaY / elapsed;

  pointer.velocityX = Math.max(
    -2.2,
    Math.min(2.2, pointer.velocityX * 0.5 + nextVelocityX * 0.5),
  );
  pointer.velocityY = Math.max(
    -2.2,
    Math.min(2.2, pointer.velocityY * 0.5 + nextVelocityY * 0.5),
  );
  pointer.speed = Math.min(
    1,
    Math.hypot(pointer.velocityX, pointer.velocityY) / 1.8,
  );

  pointer.targetX = x;
  pointer.targetY = y;
  pointer.targetStrength = Math.max(pointer.targetStrength, 0.55 + pointer.speed * 0.45);
  pointer.lastMove = now;
}

export function releasePointer() {
  visualState.pointer.targetStrength = 0.12;
}

export function setScrollTarget(progress: number, velocity = 0) {
  visualState.scroll.target = Math.min(1, Math.max(0, progress));
  visualState.scroll.targetVelocity = Math.min(1, Math.max(-1, velocity));
}

export function setThemeMode(theme: ThemeMode) {
  visualState.theme = theme;
}

export function advanceVisualState(delta: number) {
  const step = Math.min(delta, 1 / 20);
  const pointerEase = 1 - Math.exp(-step * 4.5);
  const strengthEase = 1 - Math.exp(-step * 2.4);
  const trailEase = 1 - Math.exp(-step * 2.8);
  const scrollEase = 1 - Math.exp(-step * 3.2);
  const scrollVelocityEase = 1 - Math.exp(-step * 5.5);

  const pointer = visualState.pointer;
  pointer.x += (pointer.targetX - pointer.x) * pointerEase;
  pointer.y += (pointer.targetY - pointer.y) * pointerEase;
  pointer.trailX += (pointer.x - pointer.trailX) * trailEase;
  pointer.trailY += (pointer.y - pointer.trailY) * trailEase;

  const friction = Math.exp(-step * 4.2);
  pointer.velocityX *= friction;
  pointer.velocityY *= friction;
  pointer.speed *= Math.exp(-step * 3.2);

  const now = performance.now();
  const idle = (now - pointer.lastMove) / 1000;
  const activeBlend = 1 - Math.min(1, Math.max(0, (idle - 0.08) / 0.9));
  const ambientBlend = Math.min(1, Math.max(0, (idle - 0.7) / 1.6));
  const ambientStrength =
    (0.1 + Math.sin(now * 0.00042) * 0.018 + Math.cos(now * 0.00067) * 0.01) *
    ambientBlend;
  const desiredStrength = Math.max(pointer.targetStrength * activeBlend, ambientStrength);
  pointer.strength += (desiredStrength - pointer.strength) * strengthEase;
  pointer.targetStrength *= Math.exp(-step * (idle < 0.2 ? 0.35 : 1.6));

  const scroll = visualState.scroll;
  scroll.progress += (scroll.target - scroll.progress) * scrollEase;
  scroll.velocity +=
    (scroll.targetVelocity - scroll.velocity) * scrollVelocityEase;
  scroll.speed = Math.min(1, Math.abs(scroll.velocity) * 2.8);
  scroll.targetVelocity *= Math.exp(-step * 4.2);
  scroll.flowOffset = Math.max(
    -0.55,
    Math.min(
      0.55,
      scroll.flowOffset + scroll.velocity * step * 0.42 + step * 0.0025,
    ),
  );
  const progressAccent = Math.min(1, Math.max(0, (scroll.progress - 0.08) / 0.72));
  const peak = 1 - Math.min(1, Math.max(0, (scroll.progress - 0.78) / 0.22));
  const accentTarget = Math.min(1, progressAccent * 0.9 * peak + scroll.speed * 0.45);
  scroll.accent += (accentTarget - scroll.accent) * (1 - Math.exp(-step * 3.2));

  const cue = visualState.cue;
  cue.strength +=
    (cue.targetStrength - cue.strength) * (1 - Math.exp(-step * (cue.active ? 8 : 4.5)));
  cue.pulse = Math.max(0, cue.pulse - step * 1.8);
  if (!cue.active) cue.targetStrength *= Math.exp(-step * 3.5);
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
