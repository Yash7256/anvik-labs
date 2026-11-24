"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { onUserInteraction } from "@/lib/user-interaction";
import { supportsWebGL } from "./support";

const InteractiveCanvas = lazy(() => import("./InteractiveCanvas"));

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
    let unsubscribe = () => {};

    unsubscribe = onUserInteraction(() => {
      if (cancelled) return;
      unsubscribe();
      setMounted(true);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  if (!mounted) return <Fallback />;

  return (
    <Suspense fallback={<Fallback />}>
      <InteractiveCanvas />
    </Suspense>
  );
}
