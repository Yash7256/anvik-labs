export type ScrollSignal = {
  progress: number;
  velocity: number;
  direction: 1 | -1;
};

export const scrollSignal: ScrollSignal = {
  progress: 0,
  velocity: 0,
  direction: 1,
};

export function updateScrollSignal(progress: number, velocity: number) {
  scrollSignal.progress = Math.min(1, Math.max(0, progress));
  scrollSignal.velocity = Math.max(-4000, Math.min(4000, velocity));
  scrollSignal.direction = velocity >= 0 ? 1 : -1;
}
