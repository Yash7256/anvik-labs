import { useRef } from "react";
import { Link } from "react-router";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { projects, type Project } from "@/data/projects";

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
            className="mx-auto max-w-[40ch] text-center font-display text-[clamp(2.75rem,7.5vw,5.75rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-foreground [word-spacing:0.08em]"
          >
            Curious By Design.
            <br className="hidden md:block" /> Precise By Engineering.
          </h1>

          <p
            ref={copyRef}
            className="mx-auto mt-5 max-w-[62ch] text-center font-sans text-[16px] font-medium leading-[1.65] text-foreground"
          >
            A product design and engineering studio in India. We build our own
            products and help startups and small businesses build theirs.
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
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-[linear-gradient(180deg,#242424_0%,#1c1c1c_100%)] px-6 py-3 font-sans text-[15px] font-medium tracking-tight text-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.10)] transition-[transform,box-shadow] duration-200 ease-out active:shadow-[0_5px_14px_-8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                Work With Us
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          <div ref={cardsRef} className="mt-10 md:mt-12">
            <div
              data-lenis-prevent
              className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible"
            >
              {featuredProjects.map((project, index) => (
                <Link
                  key={project.id}
                  to={`/works/${project.id}`}
                  aria-label={`${project.name} — ${project.id === "designers-room" ? "view live project" : "view case study"}`}
                  className="group block min-w-[78vw] snap-start rounded-[8px] border border-black/[0.16] bg-white/[0.68] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_28px_-18px_rgba(23,23,23,0.28)] backdrop-blur-[20px] backdrop-saturate-[1.1] transition-[border-color,box-shadow] duration-300 hover:border-black/25 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_14px_32px_-18px_rgba(23,23,23,0.36)] sm:min-w-[46vw] md:min-w-0"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] border border-black/10 bg-white transition-colors duration-300 group-hover:border-black/20">
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
      </div>
    </section>
  );
}
