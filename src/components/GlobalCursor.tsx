"use client";

import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { useFinePointer } from "@/lib/motion";

type CursorState = "default" | "link" | "button" | "talk" | "scroll" | "text" | "design";

function getCursorState(target: HTMLElement): { state: CursorState | "native"; label: string } {
  if (target.closest("input, textarea, select, [contenteditable='true']")) {
    return { state: "native", label: "" };
  }

  const explicit = target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
  if (explicit === "project") return { state: "native", label: "" };
  if (explicit === "talk") return { state: "talk", label: "talk" };
  if (explicit === "scroll") return { state: "scroll", label: "scroll" };
  if (explicit === "design") return { state: "design", label: "DESIGNER ✦" };
  if (explicit === "engineer") return { state: "design", label: "ENGINEER ✦" };
  if (explicit) return { state: "button", label: explicit };

  if (target.closest("a[href], button, [role='button']")) {
    return { state: "link", label: "" };
  }

  const textTarget = target.closest(
    "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption",
  );
  if (textTarget) return { state: "text", label: "" };

  return { state: "default", label: "" };
}

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

    let visible = false;
    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let pressed = false;
    let currentState: CursorState = "default";

    const render = () => {
      frame = 0;
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      const scale = pressed ? 0.88 : 1;
      root.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${scale})`;

      if (
        pressed ||
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1
      ) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const ensureRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const show = () => {
      if (visible) return;
      visible = true;
      root.classList.add("is-active");
      root.style.opacity = "1";
    };

    const hide = () => {
      if (!visible) return;
      visible = false;
      root.classList.remove("is-active");
      root.style.opacity = "0";
    };

    const applyState = (state: CursorState, text: string) => {
      if (state === currentState && label.textContent === text) return;
      currentState = state;
      root.dataset.state = state;
      label.textContent = text;
    };

    applyState("default", "");

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        currentX = targetX;
        currentY = targetY;
        root.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1)`;
      }
      ensureRender();

      if (event.target instanceof Element) {
        const { state, label: text } = getCursorState(event.target as HTMLElement);
        if (state === "native") {
          hide();
          return;
        }
        show();
        applyState(state, text);
      } else {
        show();
        applyState("default", "");
      }
    };

    const handleLeave = () => hide();
    const handleDown = () => {
      pressed = true;
      ensureRender();
    };
    const handleUp = () => {
      pressed = false;
      ensureRender();
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    document.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.removeEventListener("pointerleave", handleLeave);
      if (frame) window.cancelAnimationFrame(frame);
      gsap.set(root, { clearProps: "all" });
      root.style.opacity = "0";
      root.classList.remove("is-active");
      root.removeAttribute("data-state");
    };
  }, [finePointer, reduceMotion, location.pathname]);

  return (
    <div ref={rootRef} aria-hidden="true" className="global-cursor">
      <span className="global-cursor__dot" />
      <span ref={labelRef} className="global-cursor__label" />
    </div>
  );
}
