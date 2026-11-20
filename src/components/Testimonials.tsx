"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
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
    <article className="flex w-[300px] shrink-0 flex-col justify-between rounded-[8px] border border-black/10 bg-light-surface p-6 transition-colors duration-300 hover:border-accent/40 sm:w-[360px] md:w-[420px] md:p-7">
      <blockquote className="font-sans text-[14px] leading-[1.7] text-foreground md:text-[15px]">
        &ldquo;{item.quote.trim()}&rdquo;
      </blockquote>
      <div className="mt-6 flex items-center gap-3.5 pt-4 md:mt-7 md:pt-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/[0.06] font-mono text-[11px] tracking-[0.04em] text-muted">
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
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<ReturnType<typeof gsap.to> | null>(null);
  const hoveredRef = useRef(false);
  const offscreenRef = useRef(false);
  const hiddenRef = useRef(false);
  const resetTimerRef = useRef<number | undefined>(undefined);

  const cards = [...testimonials, ...testimonials];

  useGSAP(
    () => {
      const root = rootRef.current;
      if (reduceMotion || !trackRef.current || !root) return;

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

  if (reduceMotion) {
    return (
      <section
        ref={rootRef}
        id="testimonials"
        aria-labelledby="testimonials-heading"
        className="py-16 md:py-24"
      >
        <div className="pb-8 md:pb-10">
          <h2
            id="testimonials-heading"
            className="mt-3 font-sans text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-foreground"
          >
            What people say.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-16 md:py-24"
    >
      <div className="pb-8 md:pb-10">
        <h2
          id="testimonials-heading"
          className="mt-3 font-sans text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          What people say.
        </h2>
      </div>

      <div
        className="relative -mx-4 overflow-hidden sm:-mx-[4vw] lg:-mx-[5vw] xl:-mx-[6vw]"
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
            {cards.map((item, index) => (
              <TestimonialCard
                key={`track-1-${item.id}-${index}`}
                item={item}
              />
            ))}
          </div>
          <div className="flex shrink-0 gap-5 md:gap-6" aria-hidden="true">
            {cards.map((item, index) => (
              <TestimonialCard
                key={`track-2-${item.id}-${index}`}
                item={item}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
