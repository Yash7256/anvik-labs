import { setScrollTarget } from "./state";

export function initScrollController() {
  let frame = 0;
  let lastY = window.scrollY;
  let lastTime = performance.now();

  const measure = () => {
    frame = 0;
    const now = performance.now();
    const y = window.scrollY;
    const elapsed = Math.max(16, now - lastTime) / 1000;
    const velocity =
      ((y - lastY) / elapsed / Math.max(1, window.innerHeight)) * 0.35;

    lastY = y;
    lastTime = now;

    const works = document.getElementById("works");
    const hero = document.getElementById("hero");
    if (!works || !hero) return;

    const worksTop = works.getBoundingClientRect().top + y;
    const heroBottom = hero.getBoundingClientRect().bottom + y;
    const end = Math.max(
      1,
      Math.min(worksTop, heroBottom) - window.innerHeight * 0.4,
    );

    setScrollTarget(y / end, velocity);
  };

  const onScroll = () => {
    if (!frame) frame = window.requestAnimationFrame(measure);
  };

  measure();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (frame) window.cancelAnimationFrame(frame);
    setScrollTarget(0, 0);
  };
}
