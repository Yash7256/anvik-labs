import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap, SplitText } from "./gsap";

export const MOTION = {
  soft: "power2.out",
  ease: "power3.out",
  dramatic: "expo.out",
  arrive: [0.16, 1, 0.3, 1],
  duration: {
    micro: 0.3,
    standard: 0.7,
    reveal: 1,
    focal: 1.15,
  },
  stagger: {
    tight: 0.06,
    regular: 0.1,
    loose: 0.14,
  },
} as const;

export function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return fine;
}

export function useMagnetic<T extends HTMLElement>(strength = 0.16) {
  const ref = useRef<T>(null);
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduceMotion || !finePointer) return;

    const handleMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      gsap.to(element, {
        x: x * strength,
        y: y * strength,
        duration: MOTION.duration.micro,
        ease: MOTION.ease,
        overwrite: "auto",
      });
    };

    const handleLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: MOTION.duration.standard,
        ease: MOTION.ease,
        overwrite: "auto",
      });
    };

    element.addEventListener("pointermove", handleMove);
    element.addEventListener("pointerleave", handleLeave);

    return () => {
      element.removeEventListener("pointermove", handleMove);
      element.removeEventListener("pointerleave", handleLeave);
      gsap.set(element, { x: 0, y: 0 });
    };
  }, [finePointer, reduceMotion, strength]);

  return ref;
}

export function createMaskedText(
  element: HTMLElement,
  type: "lines" | "words" | "chars" = "words",
) {
  return SplitText.create(element, {
    type,
    mask: type,
    linesClass: "motion-line",
    wordsClass: "motion-word",
    charsClass: "motion-char",
    aria: "auto",
    autoSplit: false,
    reduceWhiteSpace: true,
  });
}
