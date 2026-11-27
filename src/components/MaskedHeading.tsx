"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION } from "@/lib/motion";

export default function MaskedHeading({
  children,
  className,
  id,
}: {
  children: string;
  className?: string;
  id?: string;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reduceMotion || !headingRef.current) return;

      const split = createMaskedText(headingRef.current, "chars");
      const chars = split.chars.length ? split.chars : split.words;

      gsap.set(chars, {
        yPercent: 112,
        rotationX: 6,
        opacity: 0,
        transformPerspective: 900,
        transformOrigin: "50% 100%",
      });
      gsap.to(chars, {
        yPercent: 0,
        rotationX: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.045,
        ease: MOTION.ease,
        force3D: true,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          end: "+=55%",
          scrub: 1,
        },
      });

      return () => split.revert();
    },
    {
      scope: headingRef,
      dependencies: [children, reduceMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <h2 ref={headingRef} id={id} className={className}>
      {children}
    </h2>
  );
}
