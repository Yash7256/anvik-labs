"use client";

import { useEffect } from "react";
import { useLocation } from "react-router";
import { ScrollTrigger } from "@/lib/gsap";
import { updateScrollSignal } from "@/lib/scroll-state";

export default function MotionRuntime() {
  const { pathname } = useLocation();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => updateScrollSignal(self.progress, self.getVelocity()),
    });

    updateScrollSignal(0, 0);

    return () => trigger.kill();
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
