import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION, useFinePointer, useMagnetic } from "@/lib/motion";
import { scrollToElement } from "@/lib/smooth-scroll";
import WebGLBackground from "@/webgl/WebGLBackground";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const upperGlowRef = useRef<HTMLDivElement>(null);
  const lowerGlowRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useMagnetic<HTMLButtonElement>(0.18);

  useGSAP(
    () => {
      if (reduceMotion) return;

      const lineElements = Array.from(
        headingRef.current?.querySelectorAll<HTMLElement>("[data-hero-line]") ??
          [],
      );
      const splits = lineElements.map((line) => createMaskedText(line, "lines"));
      const lines = splits.flatMap((split) => split.lines);

      gsap.set([eyebrowRef.current, copyRef.current, cueRef.current], {
        autoAlpha: 1,
      });

      const tl = gsap.timeline({ defaults: { ease: MOTION.ease } });
      tl.from(
        eyebrowRef.current,
        {
          y: 14,
          autoAlpha: 0,
          duration: 0.75,
        },
        0,
      )
        .from(
          lines,
          {
            yPercent: 112,
            autoAlpha: 0,
            duration: MOTION.duration.focal,
            stagger: { each: 0.12, from: "start" },
          },
          0.12,
        )
        .from(
          copyRef.current,
          { autoAlpha: 0, y: 18, duration: 0.85 },
          0.52,
        )
        .from(
          cueRef.current,
          { autoAlpha: 0, y: 14, duration: 0.75 },
          0.64,
        );

      const drift = { duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut" };
      gsap.to(upperGlowRef.current, {
        xPercent: -4,
        yPercent: 5,
        scale: 1.06,
        ...drift,
      });
      gsap.to(lowerGlowRef.current, {
        xPercent: 3,
        yPercent: -5,
        scale: 1.05,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.15,
          },
        })
        .to(contentRef.current, { yPercent: -5, duration: 1 }, 0)
        .to(eyebrowRef.current, { y: -14, autoAlpha: 0.45, duration: 0.35 }, 0.2)
        .to(eyebrowRef.current, { autoAlpha: 0, duration: 0.35 }, 0.65)
        .to(copyRef.current, { y: -24, autoAlpha: 0.35, duration: 0.4 }, 0.35)
        .to(copyRef.current, { autoAlpha: 0, duration: 0.3 }, 0.75)
        .to(cueRef.current, { y: 14, autoAlpha: 0, duration: 0.3 }, 0.15)
        .to(
          lineElements[0],
          { yPercent: -14, xPercent: -1.2, opacity: 0.58, duration: 1 },
          0,
        )
        .to(
          lineElements[1],
          { yPercent: 14, xPercent: 1.2, opacity: 0.58, duration: 1 },
          0,
        )
        .to(upperGlowRef.current, { yPercent: 14, duration: 1 }, 0)
        .to(lowerGlowRef.current, { yPercent: -10, duration: 1 }, 0);

      return () => splits.forEach((split) => split.revert());
    },
    { scope: rootRef, dependencies: [reduceMotion], revertOnUpdate: true },
  );

  useEffect(() => {
    if (reduceMotion || !finePointer) return;

    const heading = headingRef.current;
    const root = rootRef.current;
    if (!heading || !root) return;

    const lineElements = Array.from(
      heading.querySelectorAll<HTMLElement>("[data-hero-line]"),
    );
    const setters = lineElements.map((line) => ({
      line,
      xTo: gsap.quickTo(line, "x", { duration: 0.9, ease: "power3.out" }),
      yTo: gsap.quickTo(line, "y", { duration: 0.9, ease: "power3.out" }),
    }));

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const update = () => {
      frame = 0;
      const rect = heading.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = pointerX - centerX;
      const dy = pointerY - centerY;
      const distance = Math.hypot(dx, dy);
      const radius = Math.max(rect.width, rect.height) * 0.9;

      setters.forEach(({ line, xTo, yTo }, index) => {
        const lineRect = line.getBoundingClientRect();
        const lineCenterX = lineRect.left + lineRect.width / 2;
        const lineCenterY = lineRect.top + lineRect.height / 2;
        const localDx = pointerX - lineCenterX;
        const localDy = pointerY - lineCenterY;
        const localDistance = Math.hypot(localDx, localDy);
        const localRadius = Math.max(lineRect.width, lineRect.height) * 1.05;
        const influence = Math.max(0, 1 - localDistance / localRadius);
        const falloff = Math.max(0, 1 - distance / radius);
        const strength = influence * falloff;
        const direction = index === 0 ? 1 : -1;
        const maxOffset = 2.8;

        xTo((localDx / Math.max(localRadius, 1)) * maxOffset * strength * direction);
        yTo((localDy / Math.max(localRadius, 1)) * maxOffset * 0.35 * strength);
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const reset = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      setters.forEach(({ xTo, yTo }) => {
        xTo(0);
        yTo(0);
      });
    };

    const onLeave = (event: PointerEvent) => {
      const next = event.relatedTarget;
      if (next instanceof Node && root.contains(next)) return;
      reset();
    };

    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      setters.forEach(({ line }) => gsap.set(line, { x: 0, y: 0 }));
    };
  }, [finePointer, reduceMotion]);

  function scrollToWorks() {
    const target = document.getElementById("works");
    if (!target) return;

    scrollToElement(target);
  }

  return (
    <section
      ref={rootRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate -mx-4 flex min-h-[100svh] flex-col overflow-hidden pt-[var(--header-height)] sm:-mx-[4vw] lg:-mx-[5vw] xl:-mx-[6vw]"
    >
      <WebGLBackground />
      <div
        ref={upperGlowRef}
        aria-hidden="true"
        className="hero-ambient hero-ambient--upper"
      />
      <div
        ref={lowerGlowRef}
        aria-hidden="true"
        className="hero-ambient hero-ambient--lower"
      />

      <div
        ref={contentRef}
        className="relative flex flex-1 flex-col justify-between px-4 pb-[6svh] pt-[11svh] sm:px-[4vw] md:pb-[7svh] md:pt-[12svh] lg:px-[5vw] xl:px-[6vw]"
      >
        <div className="flex flex-col items-center">
          <p
            ref={eyebrowRef}
            className="hero-eyebrow mb-6 inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.16em] text-muted md:mb-8"
          >
            <span aria-hidden="true" className="h-px w-8 bg-border" />
            Independent Technology Studio
            <span aria-hidden="true" className="h-px w-8 bg-border" />
          </p>
          <h1
            ref={headingRef}
            id="hero-heading"
            className="text-center font-display text-[clamp(1.75rem,8.2vw,8.1rem)] leading-[0.95] tracking-[-0.045em] text-foreground [word-spacing:0.12em]"
          >
            <span data-hero-line className="block whitespace-nowrap">
              Curious By Design.
            </span>
            <span data-hero-line className="block whitespace-nowrap text-foreground/92">
              Precise By Engineering.
            </span>
          </h1>
        </div>

        <div className="mx-auto flex w-full flex-col items-center">
          <p
            ref={copyRef}
            className="max-w-[520px] text-center text-[16px] leading-[1.6] text-foreground md:text-[17px]"
          >
            AI changed what&apos;s possible. Great products still need taste,
            judgment and engineering. We bring all three together.
          </p>

          <button
            ref={cueRef}
            type="button"
            onClick={scrollToWorks}
            aria-label="Scroll to selected work"
            data-cursor="scroll"
            className="scroll-cue mt-11 inline-flex h-[50px] w-[50px] items-center justify-center rounded-full md:mt-12"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="scroll-cue__icon h-4 w-4"
            >
              <path d="M8 2.5v10M4 8.5l4 4 4-4" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
