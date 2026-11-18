"use client";

import { useState } from "react";
import { Link } from "react-router";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import socials from "@/data/socials.json";

// ── Minimal inline SVG icons ──────────────────────────────────────────────────

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconBehance({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.65.673 1.44.673 2.37 0 .75-.14 1.4-.42 1.96-.28.56-.67 1.03-1.16 1.4-.48.37-1.05.65-1.7.83-.64.18-1.31.27-2.02.27H0V4.503h6.938zm-.34 5.57c.6 0 1.09-.15 1.46-.46.37-.3.55-.75.55-1.35 0-.3-.05-.56-.16-.78-.11-.22-.26-.4-.45-.54-.19-.14-.42-.24-.67-.3-.26-.06-.54-.09-.83-.09H3.5v3.52h3.1zm.16 5.83c.32 0 .62-.03.9-.1.28-.07.52-.18.73-.34.21-.16.37-.37.49-.63.12-.26.18-.58.18-.96 0-.76-.22-1.33-.64-1.7-.43-.37-1-.55-1.72-.55H3.5v4.28h3.26zm11.17-9.25c.56 0 1.08.09 1.56.27.48.18.9.44 1.24.79.35.35.62.78.82 1.29.2.51.3 1.09.3 1.74v.6H14.4c.03.84.27 1.5.7 1.97.44.47 1.05.7 1.84.7.55 0 1.03-.14 1.44-.42.4-.28.65-.58.74-.9h2.63c-.42 1.3-1.07 2.24-1.94 2.82-.87.58-1.93.87-3.17.87-.86 0-1.64-.14-2.33-.42-.69-.28-1.28-.68-1.76-1.19-.48-.51-.85-1.12-1.1-1.83-.26-.71-.39-1.5-.39-2.37 0-.84.14-1.62.4-2.34.27-.72.65-1.34 1.14-1.86.49-.52 1.08-.93 1.77-1.22.69-.29 1.46-.43 2.3-.43zm0 2.08c-.67 0-1.22.19-1.65.57-.43.38-.69.95-.79 1.7h4.76c-.05-.73-.27-1.3-.67-1.69-.4-.39-.93-.58-1.65-.58zM15.6 4.9h4.4v1.37H15.6V4.9z" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function IconFigma({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.02-3.019-3.02h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.026-4.49 4.515-4.49h4.563v4.49c0 2.476-2.014 4.49-4.563 4.49zm-.024-7.51a3.016 3.016 0 0 0-3.019 3.019 3.016 3.016 0 0 0 3.019 3.019c1.665 0 3.093-1.355 3.093-3.019v-3.019H8.148zm7.704 0h-.012c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49 4.49 2.014 4.49 4.49-2.014 4.49-4.478 4.49zm0-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019z" />
    </svg>
  );
}

function IconGitHub({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function IconTwitterX({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

type SocialIconId = "linkedin" | "behance" | "instagram" | "figma" | "github" | "twitter";

function SocialIcon({ id, className }: { id: SocialIconId; className?: string }) {
  if (id === "linkedin") return <IconLinkedIn className={className} />;
  if (id === "behance") return <IconBehance className={className} />;
  if (id === "instagram") return <IconInstagram className={className} />;
  if (id === "figma") return <IconFigma className={className} />;
  if (id === "github") return <IconGitHub className={className} />;
  if (id === "twitter") return <IconTwitterX className={className} />;
  return null;
}

type SocialLink = { id: string; label: string; href: string };

type PortraitProps = {
  src: string;
  alt: string;
  name: string;
  role: string;
  description: string;
  index: string;
  label: string;
  watermark: string;
  id: string;
  delay?: number;
  imagePositionClassName: string;
  width: number;
  height: number;
  showFavicon?: boolean;
  faviconPositionClassName?: string;
  faviconVerticalPositionClassName?: string;
  isOppositeHovered?: boolean;
  reduceMotion: boolean | null;
};

function Portrait({
  src,
  alt,
  name,
  role,
  description,
  index,
  label,
  watermark,
  id,
  delay = 0,
  imagePositionClassName,
  width,
  height,
  showFavicon = false,
  faviconPositionClassName = "left-1/2",
  faviconVerticalPositionClassName = "top-0",
  isOppositeHovered = false,
  reduceMotion,
}: PortraitProps) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 180, damping: 24, mass: 0.45 });
  const springY = useSpring(pointerY, { stiffness: 180, damping: 24, mass: 0.45 });
  const imageX = useTransform(springX, [-0.5, 0.5], [-4, 4]);
  const imageY = useTransform(springY, [-0.5, 0.5], [-3, 3]);

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

  return (
    <motion.figure
      initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.7, delay }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className={`group/portrait relative overflow-hidden rounded-[5px] bg-black ring-1 transition-colors duration-500 ${isOppositeHovered ? "ring-white/30" : "ring-white/10"}`}
    >
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-black"
      >
        {showFavicon && (
          <img
            src="/assets/favicon.ico"
            alt=""
            aria-hidden="true"
            className={`pointer-events-none absolute ${faviconPositionClassName} ${faviconVerticalPositionClassName} z-10 h-full w-full object-contain opacity-20`}
          />
        )}

        {watermark === "Designer" || watermark === "Engineer" ? (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-6 top-6 z-10 flex items-center font-mono text-[clamp(1rem,2.4vw,1.75rem)] font-semibold uppercase leading-none tracking-[0.18em] text-white/20 [writing-mode:vertical-rl] ${watermark === "Designer" ? "left-3 rotate-180" : "right-3"}`}
          >
            {watermark}
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-6 z-10 whitespace-nowrap text-right font-mono text-[clamp(1rem,2.2vw,2rem)] font-semibold uppercase leading-none tracking-[0.12em] text-white/20"
          >
            {watermark}
          </span>
        )}

        <motion.div
          initial={reduceMotion ? undefined : { scale: 1.06 }}
          whileInView={{ scale: 1 }}
          whileHover={reduceMotion ? undefined : { scale: 1.025, y: -2 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.5, delay }}
          className="absolute inset-x-0 top-0 z-20 bottom-4 md:bottom-6"
        >
          <motion.div className="absolute inset-0" style={{ x: imageX, y: imageY }}>
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              loading="lazy"
              decoding="async"
              className={`h-full w-full origin-top scale-[1.1] object-contain object-bottom brightness-[1.06] contrast-[1.16] saturate-[1.04] transition-[filter] duration-500 ${imagePositionClassName}`}
            />
          </motion.div>
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
      />

      <div className="sr-only">
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/70">
          {index}
        </span>
        <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/70">
          <span className="h-1 w-1 rounded-full bg-accent" />
          {label}
        </span>
      </div>

      <figcaption
        className="sr-only"
      >
        <p
          className="font-sans text-[clamp(1.5rem,2.2vw,2.2rem)] font-medium leading-[0.95] tracking-[-0.04em] text-white"
        >
          {name}
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
          {role}
        </p>
        <p>{description}</p>
      </figcaption>
    </motion.figure>
  );
}

export default function MeetTheHumans() {
  const reduceMotion = useReducedMotion();
  const [hoveredProfile, setHoveredProfile] = useState<"harshita" | "aman" | null>(null);

  return (
    <section
      aria-labelledby="humans-heading"
      className="relative overflow-hidden py-16 md:py-24"
    >

      <div className="pb-8 md:pb-10">
        <h2
          id="humans-heading"
          className="mt-3 font-sans text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          Meet the humans.
        </h2>
      </div>

      <div className="relative mx-auto mt-8 grid w-full max-w-[1120px] grid-cols-1 gap-y-14 md:mt-10 md:gap-y-16 lg:grid-cols-2 lg:items-start lg:gap-x-10 lg:gap-y-0 xl:gap-x-12">
        <article
          aria-labelledby="human-harshita"
          onMouseEnter={() => setHoveredProfile("harshita")}
          onMouseLeave={() => setHoveredProfile(null)}
          className="group/profile relative min-w-0 md:max-w-[560px] lg:max-w-none"
        >
          <Portrait
            src="/profile/harshitaupadhyay-cutout.png"
            alt="Harshita Upadhyay, UI/UX Product Designer at Anvik Labs"
            name="Harshita Upadhyay"
            role="Design / Product & UI"
            description="Harshita is the designer in the room, part systems thinker, part compulsive doodler. She turns tangled product flows into interfaces that feel obvious, then worries the last two percent until they feel inevitable."
            index="01"
            label="The Designer"
            watermark="Designer"
            id="human-harshita"
            imagePositionClassName="translate-y-6 md:translate-y-7"
            width={713}
            height={1600}
            showFavicon
            isOppositeHovered={hoveredProfile === "aman"}
            reduceMotion={reduceMotion}
          />

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 110, damping: 22, mass: 0.7, delay: 0.12 }}
            className="mt-4 md:mt-5"
          >
            <h3
              id="human-harshita"
              className="mt-3 font-sans text-[clamp(2.125rem,3.5vw,2.75rem)] font-medium leading-none tracking-[-0.04em] text-foreground"
            >
              Harshita Upadhyay
            </h3>
            <p className="mt-2 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-neutral-400 md:text-[13px]">
              Design / Product / UI
            </p>
            <p className="mt-5 max-w-[46ch] text-pretty text-[14px] leading-[1.65] text-foreground md:text-[15px]">
              Harshita is the designer in the room, part systems thinker, part
              compulsive doodler. She turns tangled product flows into interfaces
              that feel obvious, then worries the last two percent until they feel
              inevitable.
            </p>

            <nav aria-label="Harshita Upadhyay's social profiles" className="mt-6 flex items-center gap-3">
              {(socials.harshita as SocialLink[]).map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-colors duration-200 hover:border-white/30 hover:text-foreground"
                >
                  <SocialIcon id={link.id as SocialIconId} className="h-[14px] w-[14px]" />
                </a>
              ))}
            </nav>

          </motion.div>
        </article>

        <article
          aria-labelledby="human-aman"
          onMouseEnter={() => setHoveredProfile("aman")}
          onMouseLeave={() => setHoveredProfile(null)}
          className="group/profile relative min-w-0 md:ml-auto md:max-w-[560px] lg:mt-24 lg:ml-0 lg:max-w-none xl:mt-28"
        >
          <Portrait
            src="/profile/amanraj-cutout.png"
            alt="Aman Raj, Developer at Anvik Labs"
            name="Aman Raj"
            role="Engineering / Product"
            description="Aman is the engineer who loves the invisible work: architecture, performance, and the small decisions that keep a product fast and honest. He prototypes early, breaks things on purpose, and rebuilds them simpler."
            index="02"
            label="The Engineer"
            watermark="Engineer"
            id="human-aman"
            delay={0.18}
            imagePositionClassName="translate-y-4 md:translate-y-5"
            width={1048}
            height={1600}
            showFavicon
            faviconPositionClassName="-left-1/2"
            faviconVerticalPositionClassName="-top-28"
            isOppositeHovered={hoveredProfile === "harshita"}
            reduceMotion={reduceMotion}
          />

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 110, damping: 22, mass: 0.7, delay: 0.3 }}
            className="mt-4 md:mt-5"
          >
            <h3
              id="human-aman"
              className="mt-3 font-sans text-[clamp(2.125rem,3.5vw,2.75rem)] font-medium leading-none tracking-[-0.04em] text-foreground"
            >
              <Link
                to="/aman-raj"
                className="underline decoration-transparent underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/40"
              >
                Aman Raj
              </Link>
            </h3>
            <p className="mt-2 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-neutral-400 md:text-[13px]">
              Engineering / Product
            </p>
            <Link
              to="/aman-raj"
              className="mt-4 inline-flex font-mono text-[12px] uppercase tracking-[0.12em] text-neutral-400 underline decoration-transparent underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/40"
            >
              View profile
            </Link>
            <p className="mt-5 max-w-[46ch] text-pretty text-[14px] leading-[1.65] text-foreground md:text-[15px]">
              Aman is the engineer who loves the invisible work: architecture,
              performance, and the small decisions that keep a product fast and
              honest. He prototypes early, breaks things on purpose, and rebuilds
              them simpler.
            </p>

            <nav aria-label="Aman Raj's social profiles" className="mt-6 flex items-center gap-3">
              {(socials.aman as SocialLink[]).map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-colors duration-200 hover:border-white/30 hover:text-foreground"
                >
                  <SocialIcon id={link.id as SocialIconId} className="h-[14px] w-[14px]" />
                </a>
              ))}
            </nav>

          </motion.div>
        </article>

      </div>

    </section>
  );
}
