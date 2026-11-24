"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { supportsWebGL } from "./support";

const InteractiveCanvas = lazy(() => import("./InteractiveCanvas"));

const activationEvents = [
  "pointermove",
  "pointerdown",
  "wheel",
  "touchstart",
  "keydown",
] as const;

const autoActivateDelay = 6000;

function Fallback() {
  return <div className="webgl-fallback" aria-hidden="true" />;
}

export default function WebGLBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !supportsWebGL()
    ) {
      return;
    }

    let cancelled = false;
    let timer: number | undefined;

    const cleanup = () => {
      activationEvents.forEach((event) => {
        window.removeEventListener(event, activate);
      });
      window.clearTimeout(timer);
    };

    const activate = () => {
      if (cancelled) return;
      cleanup();
      setMounted(true);
    };

    activationEvents.forEach((event) => {
      window.addEventListener(event, activate, { passive: true });
    });
    timer = window.setTimeout(activate, autoActivateDelay);

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  if (!mounted) return <Fallback />;

  return (
    <Suspense fallback={<Fallback />}>
      <InteractiveCanvas />
    </Suspense>
  );
}
