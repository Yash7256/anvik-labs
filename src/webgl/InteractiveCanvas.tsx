"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import FluidSimulation from "./FluidSimulation";
import FluidWash from "./FluidWash";
import ParticleField from "./ParticleField";
import TopographicField from "./TopographicField";
import { initScrollController } from "./ScrollController";
import {
  advanceVisualState,
  getVisualQuality,
  releasePointer,
  setPointerTarget,
} from "./state";
import { supportsWebGL } from "./support";

function FrameDriver() {
  useFrame((_, delta) => advanceVisualState(delta));
  return null;
}

function ContextGuard({
  onLost,
  onRestored,
}: {
  onLost: () => void;
  onRestored: () => void;
}) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (event: Event) => {
      event.preventDefault();
      onLost();
    };

    canvas.addEventListener("webglcontextlost", handleLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl, onLost, onRestored]);

  return null;
}

export default function InteractiveCanvas() {
  const quality = useMemo(() => getVisualQuality(), []);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lost, setLost] = useState(false);

  const handleLost = useCallback(() => setLost(true), []);
  const handleRestored = useCallback(() => setLost(false), []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncSupport = () =>
      setEnabled(supportsWebGL() && !motion.matches);

    syncSupport();
    motion.addEventListener("change", syncSupport);

    const stopScroll = initScrollController();

    const handlePointerMove = (event: PointerEvent) => {
      setPointerTarget(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight,
      );
    };
    const handlePointerEnd = () => releasePointer();

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("pointerleave", handlePointerEnd);
    window.addEventListener("blur", handlePointerEnd);

    const hero = document.getElementById("hero");
    let observer: IntersectionObserver | undefined;

    const syncVisibility = () => {
      const rect = hero?.getBoundingClientRect();
      setVisible(
        !document.hidden &&
          Boolean(rect && rect.bottom > 0 && rect.top < window.innerHeight),
      );
    };

    if (hero && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => setVisible(entry.isIntersecting && !document.hidden),
        { threshold: 0 },
      );
      observer.observe(hero);
    }

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    window.addEventListener("resize", syncVisibility);

    return () => {
      motion.removeEventListener("change", syncSupport);
      stopScroll();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerEnd);
      window.removeEventListener("blur", handlePointerEnd);
      document.removeEventListener("visibilitychange", syncVisibility);
      window.removeEventListener("resize", syncVisibility);
      observer?.disconnect();
      releasePointer();
    };
  }, []);

  if (!enabled) {
    return <div className="webgl-fallback" aria-hidden="true" />;
  }

  return (
    <div className={`webgl-stage${lost ? " webgl-stage--lost" : ""}`} aria-hidden="true">
      {lost ? <div className="webgl-fallback" /> : null}
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={quality.dpr}
        gl={{
          alpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <FrameDriver />
        <ContextGuard onLost={handleLost} onRestored={handleRestored} />
        <FluidSimulation />
        <FluidWash />
        <ParticleField />
        <TopographicField />
      </Canvas>
    </div>
  );
}
