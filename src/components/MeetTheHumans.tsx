"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION, useFinePointer } from "@/lib/motion";
import socials from "@/data/socials.json";

// ── Minimal inline SVG icons ──────────────────────────────────────────────────

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconBehance({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.65.673 1.44.673 2.37 0 .75-.14 1.4-.42 1.96-.28.56-.67 1.03-1.16 1.4-.48.37-1.05.65-1.7.83-.64.18-1.31.27-2.02.27H0V4.503h6.938zm-.34 5.57c.6 0 1.09-.15 1.46-.46.37-.3.55-.75.55-1.35 0-.3-.05-.56-.16-.78-.11-.22-.26-.4-.45-.54-.19-.14-.42-.24-.67-.3-.26-.06-.54-.09-.83-.09H3.5v3.52h3.1zm.16 5.83c.32 0 .62-.03.9-.1.28-.07.52-.18.73-.34.21-.16.37-.37.49-.63.12-.26.18-.58.18-.96 0-.76-.22-1.33-.64-1.7-.43-.37-1-.55-1.72-.55H3.5v4.28h3.26zm11.17-9.25c.56 0 1.08.09 1.56.27.48.18.9.44 1.24.79.35.35.62.78.82 1.29.2.51.3 1.09.3 1.74v.6H14.4c.03.84.27 1.5.7 1.97.44.47 1.05.7 1.84.7.55 0 1.03-.14 1.44-.42.4-.28.65-.58.74-.9h2.63c-.42 1.3-1.07 2.24-1.94 2.82-.87.58-1.93.87-3.17.87-.86 0-1.64-.14-2.33-.42-.69-.28-1.28-.68-1.76-1.19-.48-.51-.85-1.12-1.1-1.83-.26-.71-.39-1.5-.39-2.37 0-.84.14-1.62.4-2.34.27-.72.65-1.34 1.14-1.86.49-.52 1.08-.93 1.77-1.22.69-.29 1.46-.43 2.3-.43zm0 2.08c-.67 0-1.22.19-1.65.57-.43.38-.69.95-.79 1.7h4.76c-.05-.73-.27-1.3-.67-1.69-.4-.39-.93-.58-1.65-.58zM15.6 4.9h4.4v1.37H15.6V4.9z" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function IconFigma({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.02-3.019-3.02h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.026-4.49 4.515-4.49h4.563v4.49c0 2.476-2.014 4.49-4.563 4.49zm-.024-7.51a3.016 3.016 0 0 0-3.019 3.019 3.016 3.016 0 0 0 3.019 3.019c1.665 0 3.093-1.355 3.093-3.019v-3.019H8.148zm7.704 0h-.012c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49 4.49 2.014 4.49 4.49-2.014 4.49-4.478 4.49zm0-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019z" />
    </svg>
  );
}

function IconGitHub({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function IconTwitterX({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

type SocialIconId = "linkedin" | "behance" | "instagram" | "figma" | "github" | "twitter";
type SocialLink = { id: string; label: string; href: string };

function SocialIcon({ id, className }: { id: SocialIconId; className?: string }) {
  if (id === "linkedin") return <IconLinkedIn className={className} />;
  if (id === "behance") return <IconBehance className={className} />;
  if (id === "instagram") return <IconInstagram className={className} />;
  if (id === "figma") return <IconFigma className={className} />;
  if (id === "github") return <IconGitHub className={className} />;
  if (id === "twitter") return <IconTwitterX className={className} />;
  return null;
}

type Person = {
  id: "harshita" | "aman";
  src: string;
  alt: string;
  name: string;
  role: string;
  description: string;
  width: number;
  height: number;
  delay: number;
  objectPosition: string;
  imageClassName?: string;
  socials: SocialLink[];
  accentSide: "left" | "right";
};

const people: Person[] = [
  {
    id: "harshita",
    src: "/profile/harshitaupadhyay-cutout.png",
    alt: "Harshita Upadhyay, UI/UX Product Designer at Anvik Labs",
    name: "Harshita Upadhyay",
    role: "Design / Product & UI",
    description:
      "Harshita is the designer in the room, part systems thinker, part compulsive doodler. She turns tangled product flows into interfaces that feel obvious, then worries the last two percent until they feel inevitable.",
    width: 713,
    height: 1600,
    delay: 0,
    objectPosition: "50% 100%",
    imageClassName: "inset-x-[14%] sm:inset-x-[16%] -bottom-10 top-4",
    socials: socials.harshita as SocialLink[],
    accentSide: "left",
  },
  {
    id: "aman",
    src: "/profile/amanraj-cutout.png",
    alt: "Aman Raj, Developer at Anvik Labs",
    name: "Aman Raj",
    role: "Engineering / Product",
    description:
      "Aman is the engineer who loves the invisible work: architecture, performance, and the small decisions that keep a product fast and honest. He prototypes early, breaks things on purpose, and rebuilds them simpler.",
    width: 1048,
    height: 1600,
    delay: 0.12,
    objectPosition: "50% 100%",
    socials: socials.aman as SocialLink[],
    accentSide: "right",
  },
];

function PersonCard({
  person,
  reduceMotion,
  finePointer,
}: {
  person: Person;
  reduceMotion: boolean | null;
  finePointer: boolean;
}) {
  const [revealed, setRevealed] = useState(true);
  const articleRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 160, damping: 24, mass: 0.45 });
  const springY = useSpring(pointerY, { stiffness: 160, damping: 24, mass: 0.45 });
  const imageX = useTransform(springX, [-0.5, 0.5], [-5, 5]);
  const imageY = useTransform(springY, [-0.5, 0.5], [-4, 4]);

  useGSAP(
    () => {
      if (reduceMotion || !articleRef.current) return;
      const image = articleRef.current.querySelector<HTMLElement>("[data-human-image]");
      if (!image) return;
      gsap.fromTo(
        image,
        { yPercent: -3.5 },
        {
          yPercent: 3.5,
          ease: "none",
          scrollTrigger: {
            trigger: articleRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: articleRef, dependencies: [reduceMotion], revertOnUpdate: true },
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const detailsVisible = !finePointer || revealed;
  const detailsId = `${person.id}-details`;

  return (
    <motion.article
      ref={articleRef}
      aria-labelledby={`${person.id}-name`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduceMotion ? 0 : 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: reduceMotion ? 0 : person.delay,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="group/profile relative min-w-0"
    >
      <div
        ref={imageWrapRef}
        className="relative overflow-hidden rounded-[12px] bg-light-surface ring-1 ring-border transition-[box-shadow,ring-color] duration-500 group-hover/profile:ring-foreground/20 group-focus-within/profile:ring-foreground/20"
      >
        <div
          className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-950"
          data-cursor={person.id === "harshita" ? "design" : "engineer"}
        >
          <motion.div
            className="absolute inset-0"
            style={{ x: imageX, y: imageY }}
          >
            <div
              data-human-image
              className={`absolute -inset-y-6 inset-x-[8%] sm:inset-x-[10%] ${person.imageClassName ?? ""}`}
            >
              <img
                src={person.src}
                alt={person.alt}
                width={person.width}
                height={person.height}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain object-bottom transition-transform duration-700 ease-out group-hover/profile:scale-[1.02] group-focus-within/profile:scale-[1.02]"
                style={{ objectPosition: person.objectPosition }}
              />
            </div>
          </motion.div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
          />

          {person.id === "harshita" ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-500 group-hover/profile:opacity-100 group-focus-within/profile:opacity-100"
            >
              <span
                className="absolute left-[16%] top-[20%] text-accent transition-transform duration-500 ease-out group-hover/profile:-translate-y-1.5 group-hover/profile:rotate-12 group-focus-within/profile:-translate-y-1.5 group-focus-within/profile:rotate-12"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current drop-shadow-sm">
                  <path d="M12 1.5l2.4 6.1 6.1 2.4-6.1 2.4-2.4 6.1-2.4-6.1L3.5 10l6.1-2.4L12 1.5z" />
                </svg>
              </span>
              <span
                className="absolute right-[18%] top-[28%] text-white/90 transition-transform duration-500 delay-75 ease-out group-hover/profile:-translate-y-1 group-hover/profile:-rotate-12 group-focus-within/profile:-translate-y-1 group-focus-within/profile:-rotate-12"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                  <path d="M12 2l1.7 4.3L18 8l-4.3 1.7L12 14l-1.7-4.3L6 8l4.3-1.7L12 2z" />
                </svg>
              </span>
              <span
                className="absolute right-[24%] bottom-[24%] text-accent/90 transition-transform duration-500 delay-100 ease-out group-hover/profile:-translate-y-[2px] group-hover/profile:scale-110 group-focus-within/profile:-translate-y-[2px] group-focus-within/profile:scale-110"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M12 2.5l1.9 4.8 4.8 1.9-4.8 1.9-1.9 4.8-1.9-4.8-4.8-1.9 4.8-1.9L12 2.5z" />
                </svg>
              </span>
            </div>
          ) : null}

          <div
            aria-hidden="true"
            className={`absolute bottom-0 h-[2px] w-16 bg-accent/80 transition-all duration-500 group-hover/profile:w-24 group-focus-within/profile:w-24 ${
              person.accentSide === "left" ? "left-5" : "right-5"
            }`}
          />

          {finePointer ? (
            <button
              type="button"
              aria-expanded={revealed}
              aria-controls={detailsId}
              onClick={() => setRevealed((v) => !v)}
              className="absolute right-4 top-4 z-10 inline-flex items-center rounded-full border border-white/25 bg-black/25 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm transition-colors duration-300 hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {revealed ? "Close" : "About"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 md:mt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {person.role}
        </p>
        <h3
          id={`${person.id}-name`}
          className="mt-2 font-sans text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          {person.name}
        </h3>

        <div
          id={detailsId}
          className={`grid transition-all duration-500 ease-out ${
            detailsVisible
              ? "mt-4 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          } ${finePointer ? "" : "!mt-4 !grid-rows-[1fr] !opacity-100"}`}
        >
          <div className="overflow-hidden">
            <p className="max-w-[48ch] text-[14px] leading-[1.7] text-text-secondary md:text-[15px]">
              {person.description}
            </p>

            <nav
              aria-label={`${person.name}'s social profiles`}
              className="mt-5 flex items-center gap-3"
            >
              {person.socials.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors duration-200 hover:border-foreground/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <SocialIcon id={link.id as SocialIconId} className="h-[14px] w-[14px]" />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function MeetTheHumans() {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (reduceMotion || !headingRef.current) return;
      const split = createMaskedText(headingRef.current, "chars");
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
          trigger: headingRef.current,
          start: "top 85%",
          end: "top 60%",
          scrub: 1,
        },
      });
      return () => split.revert();
    },
    { scope: rootRef, dependencies: [reduceMotion], revertOnUpdate: true },
  );

  return (
    <section
      ref={rootRef}
      id="about"
      aria-labelledby="humans-heading"
      className="relative overflow-hidden py-20 md:py-28 lg:py-36"
    >
      <div className="pb-10 md:pb-14">
        <h2
          ref={headingRef}
          id="humans-heading"
          className="font-display text-[clamp(3.5rem,11vw,10rem)] font-extralight leading-[0.82] tracking-[-0.055em] text-foreground"
        >
          <span aria-hidden="true">Meet the humans.</span>
          <span className="sr-only">About the Anvik Labs team</span>
        </h2>
      </div>

      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-10 md:gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-14">
        {people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            reduceMotion={reduceMotion}
            finePointer={finePointer}
          />
        ))}
      </div>
    </section>
  );
}
