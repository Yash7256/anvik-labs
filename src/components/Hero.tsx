import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION } from "@/lib/motion";
import { scrollToElement } from "@/lib/smooth-scroll";
import WebGLBackground from "@/webgl/WebGLBackground";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const upperGlowRef = useRef<HTMLDivElement>(null);
  const lowerGlowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (reduceMotion) return;

      const lineElements = Array.from(
        headingRef.current?.querySelectorAll<HTMLElement>("[data-hero-line]") ??
          [],
      );
      const splits = lineElements.map((line) => createMaskedText(line, "chars"));
      const chars = splits.flatMap((split) => split.chars);

      gsap
        .timeline({ defaults: { ease: MOTION.ease } })
        .from(
          chars,
          {
            yPercent: 110,
            opacity: 0,
            duration: MOTION.duration.focal,
            stagger: { each: 0.018, from: "start" },
          },
          0.08,
        )
        .from(copyRef.current, { opacity: 0, y: 16, duration: 0.8 }, 0.42)
        .from(cueRef.current, { opacity: 0, y: 12, duration: 0.7 }, 0.54);

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
            scrub: 1,
          },
        })
        .to(copyRef.current, { y: -44, opacity: 0, duration: 0.3 }, 0)
        .to(cueRef.current, { y: 18, opacity: 0, duration: 0.22 }, 0)
        .to(
          lineElements[0],
          { yPercent: -32, xPercent: -3, opacity: 0.16, duration: 1 },
          0,
        )
        .to(
          lineElements[1],
          { yPercent: 32, xPercent: 3, opacity: 0.16, duration: 1 },
          0,
        )
        .to(upperGlowRef.current, { yPercent: 18, duration: 1 }, 0)
        .to(lowerGlowRef.current, { yPercent: -14, duration: 1 }, 0);

      return () => splits.forEach((split) => split.revert());
    },
    { scope: rootRef, dependencies: [reduceMotion], revertOnUpdate: true },
  );

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

      <div className="relative flex flex-1 flex-col justify-between px-4 pb-[6svh] pt-[11svh] sm:px-[4vw] md:pb-[7svh] md:pt-[12svh] lg:px-[5vw] xl:px-[6vw]">
        <h1
          ref={headingRef}
          id="hero-heading"
          className="text-center font-display text-[clamp(1.5rem,8.1vw,8rem)] leading-[0.98] tracking-[-0.04em] text-foreground [word-spacing:0.15em]"
        >
          <span data-hero-line className="block whitespace-nowrap">
            Curious By Design.
          </span>
          <span data-hero-line className="block whitespace-nowrap">
            Precise By Engineering.
          </span>
        </h1>

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
              className="h-4 w-4"
            >
              <path d="M8 2.5v10M4 8.5l4 4 4-4" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
