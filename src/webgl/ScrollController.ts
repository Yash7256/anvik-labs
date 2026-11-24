import { ScrollTrigger } from "@/lib/gsap";
import { setScrollTarget } from "./state";

export function initScrollController() {
  let end = Math.max(1, window.innerHeight * 0.6);

  const measureBounds = () => {
    const works = document.getElementById("works");
    const hero = document.getElementById("hero");
    if (!works || !hero) {
      end = Math.max(1, window.innerHeight * 0.6);
      return;
    }

    const y = window.scrollY;
    const worksTop = works.getBoundingClientRect().top + y;
    const heroBottom = hero.getBoundingClientRect().bottom + y;
    end = Math.max(
      1,
      Math.min(worksTop, heroBottom) - window.innerHeight * 0.4,
    );
  };

  const trigger = ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const velocity =
        (self.getVelocity() / Math.max(1, window.innerHeight)) * 0.35;
      setScrollTarget(window.scrollY / end, velocity);
    },
  });

  const refresh = () => {
    measureBounds();
    setScrollTarget(window.scrollY / end, 0);
  };

  measureBounds();
  setScrollTarget(window.scrollY / end, 0);
  ScrollTrigger.addEventListener("refresh", refresh);

  return () => {
    ScrollTrigger.removeEventListener("refresh", refresh);
    trigger.kill();
    setScrollTarget(0, 0);
  };
}
