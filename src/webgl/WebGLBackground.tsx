"use client";

import { lazy, Suspense, useEffect, useState } from "react";

const InteractiveCanvas = lazy(() => import("./InteractiveCanvas"));

function Fallback() {
  return <div className="webgl-fallback" aria-hidden="true" />;
}

export default function WebGLBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <Fallback />;

  return (
    <Suspense fallback={<Fallback />}>
      <InteractiveCanvas />
    </Suspense>
  );
}
