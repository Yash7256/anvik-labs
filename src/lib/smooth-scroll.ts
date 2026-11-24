type LenisInstance = import("lenis").default;

let lenis: LenisInstance | null = null;
let tick: ((time: number) => void) | null = null;
let initialization: Promise<void> | null = null;
let stopListening: (() => void) | null = null;

const activationEvents = ["wheel", "touchstart", "keydown"] as const;
const activationKeys = new Set([
  " ",
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
]);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ensureSmoothScroll() {
  if (typeof window === "undefined" || lenis || initialization) {
    return initialization ?? Promise.resolve();
  }
  if (prefersReducedMotion()) return Promise.resolve();

  initialization = Promise.all([
    import("lenis"),
    import("@/lib/gsap"),
  ])
    .then(([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
      if (prefersReducedMotion()) return;

      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
        respectReducedMotion: true,
      });

      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    })
    .finally(() => {
      initialization = null;
    });

  return initialization;
}

function handleActivation(event: Event) {
  if (event.type === "keydown") {
    const key = (event as KeyboardEvent).key;
    if (!activationKeys.has(key)) return;
  }

  void ensureSmoothScroll();
  stopListening?.();
}

export function listenForSmoothScroll() {
  if (typeof window === "undefined") return () => {};
  if (stopListening) return stopListening;

  activationEvents.forEach((event) => {
    window.addEventListener(event, handleActivation, { passive: true });
  });

  stopListening = () => {
    activationEvents.forEach((event) => {
      window.removeEventListener(event, handleActivation);
    });
    stopListening = null;
  };

  return stopListening;
}

export function destroySmoothScroll() {
  stopListening?.();

  const currentTick = tick;
  if (currentTick) {
    tick = null;
    void import("@/lib/gsap").then(({ gsap }) => {
      gsap.ticker.remove(currentTick);
    });
  }

  lenis?.destroy();
  lenis = null;
}

export function scrollToElement(target: Element, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset });
    return;
  }

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0);
    return;
  }

  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}
