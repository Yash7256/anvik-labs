"use client";

import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { useFinePointer } from "@/lib/motion";

export default function GlobalCursor() {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    if (!root || !label || !finePointer || reduceMotion) return;

    gsap.set(root, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(root, "x", { duration: 0.28, ease: "power3.out" });
    const yTo = gsap.quickTo(root, "y", { duration: 0.28, ease: "power3.out" });
    let active = false;

    const show = (text: string) => {
      label.textContent = text;
      if (active) return;
      active = true;
      gsap.to(root, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const hide = () => {
      if (!active) return;
      active = false;
      gsap.to(root, {
        opacity: 0,
        scale: 0.6,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      xTo(event.clientX);
      yTo(event.clientY);

      if (event.target instanceof Element) {
        const target = event.target.closest<HTMLElement>("[data-cursor]");
        const value = target?.dataset.cursor;
        if (value && value !== "project") show(value);
        else hide();
      }
    };

    const handleLeave = () => hide();

    window.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", handleLeave);
      gsap.killTweensOf(root);
      gsap.set(root, { opacity: 0, scale: 0.6, x: 0, y: 0 });
    };
  }, [finePointer, reduceMotion, location.pathname]);

  return (
    <div ref={rootRef} aria-hidden="true" className="global-cursor">
      <span ref={labelRef} />
    </div>
  );
}
