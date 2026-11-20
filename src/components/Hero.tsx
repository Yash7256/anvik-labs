import { useRef } from "react";
import { Link } from "react-router";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { primaryCtaClass } from "@/lib/cta";
import { projectCardClass, projectMediaClass } from "@/lib/project-card";
import { gsap } from "@/lib/gsap";
import { projects, type Project } from "@/data/projects";

const heroCopyClass =
  "font-sans text-[14px] font-medium leading-[1.55] text-foreground";

const heroMarqueeClass =
  "font-sans text-[20px] font-medium leading-[1.3] text-foreground";

const featuredIds = ["designers-room", "cybersec-toolkit", "notify-ed"];

const featuredProjects = featuredIds
  .map((id) => projects.find((project) => project.id === id))
  .filter((project): project is Project => Boolean(project));

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  );
}

function ProjectMarquee() {
  const names = projects.map((project) => project.name);

  return (
    <div className="mt-10 md:hidden">
      <span className="sr-only">{names.join(", ")}</span>
      <div aria-hidden="true" className="overflow-hidden">
        <div className="animate-hero-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-8 pr-8">
              {names.map((name) => (
                <span key={name} className="flex shrink-0 items-center gap-8">
                  <span className={heroMarqueeClass}>{name}</span>
                  <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        reduceMotion ||
        !headingRef.current ||
        !copyRef.current ||
        !actionsRef.current ||
        !cardsRef.current
      ) {
        return;
      }

      gsap
        .timeline({ defaults: { duration: 0.8, ease: "power3.out" } })
        .from(headingRef.current, { opacity: 0, y: 14 }, 0.04)
        .from(copyRef.current, { opacity: 0, y: 14 }, 0.1)
        .from(actionsRef.current, { opacity: 0, y: 14 }, 0.16)
        .from(
          Array.from(cardsRef.current.children),
          { opacity: 0, y: 18, stagger: 0.1, duration: 0.7 },
          0.28,
        );

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.55,
          scale: 1.08,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      gsap.utils
        .toArray<HTMLElement>("[data-cover-parallax]", cardsRef.current)
        .forEach((cover) => {
          gsap.fromTo(
            cover,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: cover.closest("a") ?? cover,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
    },
    { scope: rootRef, dependencies: [reduceMotion], revertOnUpdate: true },
  );

  return (
    <section
      ref={rootRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[440px]"
      />

      <div className="container-page relative flex min-h-[calc(100svh-var(--header-height))] flex-col pb-14 pt-28 md:pb-16 md:pt-36 lg:pb-20 lg:pt-40">
        <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col justify-center">
          <h1
            ref={headingRef}
            id="hero-heading"
            className="mx-auto max-w-[40ch] text-center font-display text-[clamp(1.75rem,7.5vw,5.75rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-foreground [word-spacing:0.08em]"
          >
            Curious By Design.
            <br /> Precise By Engineering.
          </h1>

          <p
            ref={copyRef}
            className={`mx-auto mt-5 max-w-[62ch] text-center ${heroCopyClass} md:text-[16px] md:leading-[1.65]`}
          >
            <span className="md:hidden">
              A design and engineering studio building products for startups and
              small businesses.
            </span>
            <span className="hidden md:inline">
              A product design and engineering studio in India. We build our own
              products and help startups and small businesses build theirs.
            </span>
          </p>

          <div
            ref={actionsRef}
            className="mt-9 flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-4 md:mt-11"
          >
            <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-3">
              <Link
                to="/works"
                className="group inline-flex min-h-10 items-center gap-2 font-sans text-[13px] font-medium text-[#3b3b3b] transition-colors duration-200 hover:text-accent"
              >
                All Work
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/contact"
                className={`group gap-2 ${primaryCtaClass}`}
              >
                Work With Us
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          <div ref={cardsRef} className="mt-10 hidden md:mt-12 md:block">
            <div
              data-lenis-prevent
              className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible"
            >
              {featuredProjects.map((project, index) => (
                <Link
                  key={project.id}
                  to={`/works/${project.id}`}
                  aria-label={`${project.name} — ${project.id === "designers-room" ? "view live project" : "view case study"}`}
                  className={`group block min-w-[78vw] snap-start sm:min-w-[46vw] md:min-w-0 ${projectCardClass}`}
                >
                    <div className={projectMediaClass}>
                    <div data-cover-parallax className="absolute -inset-y-6 inset-x-0">
                      <img
                        src={project.coverImage}
                        alt={project.coverAlt}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between gap-3">
                    <h2 className="font-display text-[16px] tracking-[-0.04em] text-foreground [word-spacing:0.04em]">
                      {project.name}
                    </h2>
                    <span className="relative top-0.5 inline-flex w-[112px] shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[linear-gradient(180deg,#242424_0%,#1c1c1c_100%)] px-4 py-2 font-sans text-[13px] font-medium tracking-tight text-white shadow-[0_4px_12px_-8px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.10)] transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
                      {project.id === "designers-room" ? "Live Link" : "Case Study"}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.1em] text-[#454545]">
                    {project.genre}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <ProjectMarquee />
      </div>
    </section>
  );
}
