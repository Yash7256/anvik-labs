"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";

type ScrollProgressLineProps = {
  targetId: string;
  className?: string;
};

export default function ScrollProgressLine({
  targetId,
  className = "",
}: ScrollProgressLineProps) {
  const lineRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      const target = document.getElementById(targetId);
      if (reduceMotion || !lineRef.current || !target) return;

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: target,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    },
    { dependencies: [reduceMotion, targetId], revertOnUpdate: true },
  );

  return (
    <span
      ref={lineRef}
      aria-hidden="true"
      className={`pointer-events-none absolute w-px origin-top scale-y-0 bg-accent/70 ${className}`}
    />
  );
}
