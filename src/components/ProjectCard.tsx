"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION } from "@/lib/motion";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  variant?: "featured" | "grid";
  priority?: boolean;
  className?: string;
};

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M5 15 15 5M7 5h8v8" />
    </svg>
  );
}

export default function ProjectCard({
  project,
  variant = "grid",
  priority = false,
  className = "",
}: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const isFeatured = variant === "featured";

  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLSpanElement>(null);
  const lightRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const tiltRef = useRef<{
    x: (value: number) => void;
    y: (value: number) => void;
  } | null>(null);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  useGSAP(
    () => {
      if (reduceMotion) return;
      const media = mediaRef.current;
      const article = rootRef.current;
      if (!media || !article) return;

      if (isFeatured) {
        const splits = titleRef.current
          ? [createMaskedText(titleRef.current, "words")]
          : [];
        const titleParts = splits[0]?.words ?? [];
        gsap.set(titleParts, { yPercent: 110, opacity: 0 });
        gsap.set(media, { transformPerspective: 1200, transformOrigin: "50% 50%" });

        gsap
          .timeline({
            defaults: { ease: MOTION.ease },
            scrollTrigger: {
              trigger: article,
              start: "top 90%",
              end: "top 38%",
              scrub: 1,
            },
          })
          .fromTo(
            media,
            {
              scale: 0.93,
              borderRadius: 28,
              rotationX: 5,
              y: 28,
              opacity: 0.72,
              boxShadow: "0 48px 110px -50px rgba(20,20,20,0.36)",
            },
            {
              scale: 1,
              borderRadius: 10,
              rotationX: 0,
              y: 0,
              opacity: 1,
              boxShadow: "0 18px 52px -40px rgba(20,20,20,0.22)",
              duration: 1,
            },
            0,
          )
          .fromTo(
            imageRef.current,
            { yPercent: -3 },
            { yPercent: 3, duration: 1, ease: "none" },
            0,
          )
          .to(
            titleParts,
            { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
            0.42,
          )
          .fromTo(
            pillRef.current,
            { y: 14, opacity: 0, scale: 0.94 },
            { y: 0, opacity: 1, scale: 1, duration: 0.7 },
            0.58,
          );

        tiltRef.current = {
          x: gsap.quickTo(media, "rotationX", {
            duration: MOTION.duration.micro,
            ease: MOTION.ease,
          }),
          y: gsap.quickTo(media, "rotationY", {
            duration: MOTION.duration.micro,
            ease: MOTION.ease,
          }),
        };

        return () => {
          splits.forEach((split) => split.revert());
          tiltRef.current = null;
        };
      }

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: article,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    },
    {
      scope: rootRef,
      dependencies: [isFeatured, reduceMotion],
      revertOnUpdate: true,
    },
  );

  const animate = () => {
    const follower = followerRef.current;
    if (!follower) return;

    const current = currentRef.current;
    const target = targetRef.current;
    current.x += (target.x - current.x) * 0.14;
    current.y += (target.y - current.y) * 0.14;
    follower.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
    frameRef.current = requestAnimationFrame(animate);
  };

  const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    updatePointer(event);
    currentRef.current = { ...targetRef.current };
    if (followerRef.current) {
      followerRef.current.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`;
    }
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    updatePointer(event);
  };

  const handlePointerLeave = () => {
    cancelAnimationFrame(frameRef.current);
    tiltRef.current?.x(0);
    tiltRef.current?.y(0);
  };

  function updatePointer(event: ReactPointerEvent<HTMLDivElement>) {
    const media = mediaRef.current;
    const follower = followerRef.current;
    if (!media) return;

    const rect = media.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));

    if (lightRef.current) {
      lightRef.current.style.setProperty("--light-x", `${nx * 100}%`);
      lightRef.current.style.setProperty("--light-y", `${ny * 100}%`);
    }

    if (follower) {
      const size = follower.offsetWidth || 72;
      targetRef.current = {
        x: Math.max(0, Math.min(rect.width - size, nx * rect.width - size / 2)),
        y: Math.max(0, Math.min(rect.height - size, ny * rect.height - size / 2)),
      };
    }

    if (isFeatured) {
      tiltRef.current?.x((0.5 - ny) * 7);
      tiltRef.current?.y((nx - 0.5) * 7);
    }
  }

  return (
    <article
      ref={rootRef}
      data-project-card
      data-project-variant={variant}
      className={className}
    >
      <Link
        to={`/works/${project.id}`}
        aria-label={`${project.name} — view case study`}
        data-cursor="project"
        className="project-link group relative block rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div
          ref={mediaRef}
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className={`project-media relative overflow-hidden rounded-[10px] bg-light-surface ${
            isFeatured ? "project-media--featured" : "project-media--grid"
          }`}
        >
          <img
            ref={imageRef}
            src={project.coverImage}
            alt={project.coverAlt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="project-image h-full w-full object-cover object-center"
          />

          <span ref={lightRef} aria-hidden="true" className="project-light" />
          <span aria-hidden="true" className="project-hover-shade" />

          {isFeatured ? (
            <>
              <span aria-hidden="true" className="project-featured-gradient" />
              <div className="absolute inset-x-0 bottom-0 z-[2] flex flex-col gap-4 p-5 sm:p-7 md:flex-row md:items-end md:justify-between md:p-9 lg:p-11">
                <h3
                  ref={titleRef}
                  className="font-display text-[clamp(1.6rem,4.4vw,4rem)] font-light leading-[0.95] tracking-[-0.045em] text-white"
                >
                  {project.name}
                </h3>
                <span
                  ref={pillRef}
                  className="project-pill shrink-0 self-start md:self-auto"
                >
                  {project.genre}
                </span>
              </div>
            </>
          ) : null}

          <span ref={followerRef} aria-hidden="true" className="project-follower">
            <ArrowIcon />
          </span>
          <span aria-hidden="true" className="project-tap">
            <ArrowIcon />
          </span>
        </div>

        {!isFeatured ? (
          <div className="mt-4 flex items-start justify-between gap-4 px-0.5 md:mt-5">
            <div className="min-w-0">
              <h3 className="font-display text-[19px] tracking-[-0.035em] text-foreground md:text-[22px]">
                {project.name}
              </h3>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                {project.genre}
              </p>
            </div>
            <span className="project-arrow" aria-hidden="true">
              <ArrowIcon />
            </span>
          </div>
        ) : null}
      </Link>
    </article>
  );
}
