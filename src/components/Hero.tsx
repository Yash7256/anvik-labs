import { useCallback, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION, useFinePointer, useMagnetic } from "@/lib/motion";
import { scrollToElement } from "@/lib/smooth-scroll";
import WebGLBackground from "@/webgl/WebGLBackground";
import { visualState } from "@/webgl/state";

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
  const cueButtonRef = useRef<HTMLButtonElement | null>(null);
  const cueDotRef = useRef<HTMLSpanElement>(null);
  const cueFillRef = useRef<HTMLSpanElement>(null);
  const cueMagneticRef = useMagnetic<HTMLButtonElement>(0.14);
  const cueWakeRef = useRef(0);
  const cueRef = useCallback(
    (node: HTMLButtonElement | null) => {
      cueButtonRef.current = node;
      cueMagneticRef.current = node;
    },
    [cueMagneticRef],
  );

  useGSAP(
    () => {
      if (reduceMotion) return;

      const lineElements = Array.from(
        headingRef.current?.querySelectorAll<HTMLElement>("[data-hero-line]") ??
          [],
      );
      const splits = lineElements.map((line) => createMaskedText(line, "lines"));
      const lines = splits.flatMap((split) => split.lines);

      const heroTargets = [eyebrowRef.current, copyRef.current, cueButtonRef.current].filter(Boolean);
      if (heroTargets.length) gsap.set(heroTargets, { autoAlpha: 1 });

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
          cueButtonRef.current,
          { autoAlpha: 0, y: 14, duration: 0.75 },
          0.64,
        );

      const drift = { duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut" };
      if (upperGlowRef.current) {
        gsap.to(upperGlowRef.current, {
          xPercent: -4,
          yPercent: 5,
          scale: 1.06,
          ...drift,
        });
      }
      if (lowerGlowRef.current) {
        gsap.to(lowerGlowRef.current, {
          xPercent: 3,
          yPercent: -5,
          scale: 1.05,
          duration: 15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.15,
            onUpdate: (self) => {
              const now = self.scroll();
              const delta = Math.abs(now - cueWakeRef.current);
              if (delta > 18 && self.progress > 0.01 && self.progress < 0.35) {
                visualState.cue.pulse = Math.max(visualState.cue.pulse, 0.55);
                visualState.cue.targetStrength = Math.max(
                  visualState.cue.targetStrength,
                  0.55,
                );
              }
              cueWakeRef.current = now;
            },
          },
        })
        .to(contentRef.current, { yPercent: -5, duration: 1 }, 0)
        .to(eyebrowRef.current, { y: -14, autoAlpha: 0.45, duration: 0.35 }, 0.2)
        .to(eyebrowRef.current, { autoAlpha: 0, duration: 0.35 }, 0.65)
        .to(copyRef.current, { y: -24, autoAlpha: 0.35, duration: 0.4 }, 0.35)
        .to(copyRef.current, { autoAlpha: 0, duration: 0.3 }, 0.75)
        .to(cueDotRef.current, { y: 44, duration: 0.28, ease: "none" }, 0)
        .to(cueFillRef.current, { scaleY: 1, duration: 0.28, ease: "none" }, 0)
        .to(
          cueButtonRef.current,
          { y: 18, autoAlpha: 0, duration: 0.24, ease: "power1.in" },
          0.12,
        )
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
    const button = cueButtonRef.current;
    if (!button) return;

    const updateCuePosition = () => {
      const rect = button.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      visualState.cue.x = (rect.left + rect.width / 2) / window.innerWidth;
      visualState.cue.y = (rect.top + rect.height / 2) / window.innerHeight;
    };

    updateCuePosition();
    window.addEventListener("resize", updateCuePosition);
    window.addEventListener("scroll", updateCuePosition, { passive: true });

    return () => {
      window.removeEventListener("resize", updateCuePosition);
      window.removeEventListener("scroll", updateCuePosition);
      visualState.cue.active = false;
      visualState.cue.targetStrength = 0;
    };
  }, []);

  useEffect(() => {
    const button = cueButtonRef.current;
    if (!button) return;

    const active = !reduceMotion && finePointer;
    if (!active) {
      visualState.cue.active = false;
      visualState.cue.targetStrength = 0;
      return;
    }

    const onEnter = () => {
      visualState.cue.active = true;
      visualState.cue.targetStrength = 0.7;
    };
    const onLeave = () => {
      visualState.cue.active = false;
      visualState.cue.targetStrength = 0;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = button.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      const proximity = Math.max(0, 1 - dist / 120);
      visualState.cue.active = proximity > 0.02;
      visualState.cue.targetStrength = proximity * 0.85;
    };
    const onClick = () => {
      visualState.cue.pulse = 1;
      visualState.cue.targetStrength = Math.max(visualState.cue.targetStrength, 1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    button.addEventListener("pointerenter", onEnter);
    button.addEventListener("pointerleave", onLeave);
    button.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      button.removeEventListener("pointerenter", onEnter);
      button.removeEventListener("pointerleave", onLeave);
      button.removeEventListener("click", onClick);
      visualState.cue.active = false;
      visualState.cue.targetStrength = 0;
    };
  }, [finePointer, reduceMotion]);

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
            <span className="sr-only">Anvik Labs is an independent technology studio designing and engineering digital products.</span>
            <span data-hero-line className="block whitespace-nowrap" aria-hidden="true">
              Curious By Design.
            </span>
            <span data-hero-line className="block whitespace-nowrap text-foreground/92" aria-hidden="true">
              Precise By Engineering.
            </span>
          </h1>
        </div>

        <div className="mx-auto flex w-full flex-col items-center">
          <p
            ref={copyRef}
            className="max-w-[520px] text-center text-[16px] leading-[1.6] text-foreground md:text-[17px]"
          >
            An independent technology studio making the internet a little more interesting. We design, build, experiment, and occasionally get carried away with ideas. Based in India, building for everywhere.
          </p>

          <button
            ref={cueRef}
            type="button"
            onClick={scrollToWorks}
            aria-label="Scroll to selected work"
            data-cursor="scroll"
            className="scroll-cue group mt-11 inline-flex flex-col items-center gap-3 md:mt-12"
          >
            <span className="scroll-cue__label font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              Scroll
            </span>
            <span aria-hidden="true" className="scroll-cue__track">
              <span ref={cueFillRef} className="scroll-cue__fill" />
              <span ref={cueDotRef} className="scroll-cue__dot" />
            </span>
            <span aria-hidden="true" className="scroll-cue__ring">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="scroll-cue__icon"
              >
                <path d="M12 5v12M7.5 13.5 12 18l4.5-4.5" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
