"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { createMaskedText, MOTION } from "@/lib/motion";
import testimonialsData from "../data/testimonials.json";

type Testimonial = (typeof testimonialsData)[number] & {
  avatar?: string;
};

const testimonials: Testimonial[] = testimonialsData;

function getInitials(person: string) {
  return person
    .replace(/^(Prof\.|Dr\.)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="theme-transition flex w-[300px] shrink-0 flex-col justify-between rounded-[8px] border border-border bg-light-surface p-6 transition-colors duration-300 hover:border-accent/40 sm:w-[360px] md:w-[420px] md:p-7">
      <blockquote className="font-sans text-[14px] leading-[1.7] text-foreground md:text-[15px]">
        &ldquo;{item.quote.trim()}&rdquo;
      </blockquote>
      <div className="mt-6 flex items-center gap-3.5 pt-4 md:mt-7 md:pt-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] font-mono text-[11px] tracking-[0.04em] text-muted">
          {item.avatar ? (
            <img
              src={item.avatar}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            getInitials(item.person)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[14px] font-medium text-foreground md:text-[15px]">
            {item.person}
          </p>
          <p className="truncate font-mono text-[11px] uppercase tracking-[0.1em] text-muted md:text-[12px]">
            {item.role}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<ReturnType<typeof gsap.to> | null>(null);
  const hoveredRef = useRef(false);
  const offscreenRef = useRef(false);
  const hiddenRef = useRef(false);
  const resetTimerRef = useRef<number | undefined>(undefined);


  useGSAP(
    () => {
      const root = rootRef.current;
      const heading = headingRef.current;
      if (!root) return;

      const splits: Array<ReturnType<typeof createMaskedText>> = [];
      if (heading && !reduceMotion) {
        const split = createMaskedText(heading, "chars");
        splits.push(split);
        const chars = split.chars.length ? split.chars : split.words;
        gsap.set(chars, {
          yPercent: 112,
          rotationX: 6,
          opacity: 0,
          transformPerspective: 900,
          transformOrigin: "50% 100%",
        });
        gsap.to(chars, {
          yPercent: 0,
          rotationX: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.045,
          ease: MOTION.ease,
          force3D: true,
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            end: "+=55%",
            scrub: 1,
          },
        });
      }

      if (reduceMotion || !trackRef.current) {
        return () => splits.forEach((s) => s.revert());
      }

      const tween = gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 45,
        ease: "none",
        repeat: -1,
      });
      tweenRef.current = tween;

      const setSpeed = gsap.quickTo(tween, "timeScale", {
        duration: 0.5,
        ease: "power2.out",
      });
      const trigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (hoveredRef.current || offscreenRef.current || hiddenRef.current) {
            return;
          }

          const boost = Math.min(Math.abs(self.getVelocity()) / 600, 3);
          const direction = self.direction === 1 ? 1 : -1;
          setSpeed(direction * (1 + boost));

          window.clearTimeout(resetTimerRef.current);
          resetTimerRef.current = window.setTimeout(() => {
            if (offscreenRef.current || hiddenRef.current) {
              return;
            }
            setSpeed(direction);
          }, 160);
        },
      });

      const observer =
        typeof IntersectionObserver !== "undefined"
          ? new IntersectionObserver(
              ([entry]) => {
                offscreenRef.current = !entry.isIntersecting;
                applyPlayback();
              },
              { threshold: 0.05 },
            )
          : null;
      observer?.observe(root);

      const onVisibilityChange = () => {
        hiddenRef.current = document.hidden;
        applyPlayback();
      };
      document.addEventListener("visibilitychange", onVisibilityChange);
      hiddenRef.current = document.hidden;

      return () => {
        observer?.disconnect();
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.clearTimeout(resetTimerRef.current);
        trigger.kill();
        tween.kill();
        tweenRef.current = null;
        splits.forEach((s) => s.revert());
      };
    },
    { scope: rootRef, dependencies: [reduceMotion], revertOnUpdate: true },
  );

  function applyPlayback() {
    const tween = tweenRef.current;
    if (!tween) return;

    const shouldPause =
      hoveredRef.current || offscreenRef.current || hiddenRef.current;

    if (shouldPause) {
      window.clearTimeout(resetTimerRef.current);
    }

    gsap.to(tween, {
      timeScale: shouldPause ? 0 : 1,
      duration: 0.3,
      ease: "power2.out",
      overwrite: true,
    });
  }

  function handlePointerEnter() {
    hoveredRef.current = true;
    applyPlayback();
  }

  function handlePointerLeave() {
    hoveredRef.current = false;
    applyPlayback();
  }

  return (
    <section
      ref={rootRef}
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-20 md:py-28 lg:py-36"
    >
      <div className="pb-8 md:pb-10">
        <h2
          ref={headingRef}
          id="testimonials-heading"
          className="font-display text-[clamp(3.5rem,11vw,10rem)] font-extralight leading-[0.82] tracking-[-0.055em] text-foreground"
        >
          <span aria-hidden="true">What people say.</span>
          <span className="sr-only">Client testimonials</span>
        </h2>
      </div>

      <div className="hidden grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6 motion-reduce:grid">
        {testimonials.map((item) => (
          <TestimonialCard key={`grid-${item.id}`} item={item} />
        ))}
      </div>

      <div
        className="relative -mx-4 overflow-hidden sm:-mx-[4vw] lg:-mx-[5vw] xl:-mx-[6vw] motion-reduce:hidden"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocusCapture={handlePointerEnter}
        onBlurCapture={handlePointerLeave}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-20 md:w-32"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-20 md:w-32"
        />

        <div ref={trackRef} className="flex w-max gap-5 py-2 md:gap-6">
          <div className="flex shrink-0 gap-5 md:gap-6">
            {testimonials.map((item) => (
              <TestimonialCard key={`track-1-${item.id}`} item={item} />
            ))}
          </div>
          <div className="flex shrink-0 gap-5 md:gap-6" aria-hidden="true" inert>
            {testimonials.map((item) => (
              <TestimonialCard key={`track-2-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
