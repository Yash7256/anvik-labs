import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

export function initSmoothScroll() {
  if (typeof window === "undefined" || lenis) return;

  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false,
    respectReducedMotion: true,
  });

  lenis.on("scroll", ScrollTrigger.update);
  tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

export function destroySmoothScroll() {
  if (tick) {
    gsap.ticker.remove(tick);
    tick = null;
  }
  lenis?.destroy();
  lenis = null;
  gsap.ticker.lagSmoothing(500, 33);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
