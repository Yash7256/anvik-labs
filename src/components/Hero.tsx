import { Link } from "react-router";
import { motion, useReducedMotion } from "framer-motion";
import { projects, type Project } from "@/data/projects";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const featuredIds = ["designers-room", "cybersec-toolkit", "notify-ed"];

const featuredProjects = featuredIds
  .map((id) => projects.find((project) => project.id === id))
  .filter((project): project is Project => Boolean(project));

const filters = [
  { label: "Web Development", href: "/services/web-development" },
  { label: "UI/UX Design", href: "/services/product-design" },
  { label: "AI Development", href: "/services/ai-solutions" },
];

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

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[440px]"
      />

      <div className="container-page relative flex min-h-[calc(100svh-var(--header-height))] flex-col py-14 md:py-16 lg:py-20">
        <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col justify-center">
          <motion.h1
            id="hero-heading"
            {...rise(0.04)}
            className="mx-auto max-w-[30ch] text-center font-sans text-[clamp(2.2rem,4.6vw,3.75rem)] font-bold leading-[1.04] tracking-[-0.04em] text-foreground"
          >
            We build useful products,
            <br className="hidden md:block" /> and help you build yours.
          </motion.h1>

          <motion.p
            {...rise(0.1)}
            className="mx-auto mt-5 max-w-[62ch] text-center font-sans text-[16px] leading-[1.65] text-muted"
          >
            A product design and engineering studio in India. We build our own
            products and help startups and small businesses build theirs.
          </motion.p>

          <motion.div
            {...rise(0.16)}
            className="mx-auto mt-9 w-full max-w-[920px] md:mt-11"
          >
            <div className="flex items-stretch rounded-[8px] border border-white/10 bg-surface">
              <div className="hidden shrink-0 items-center gap-2 border-r border-white/10 px-4 font-sans text-[13px] font-medium text-muted sm:flex">
                <span aria-hidden="true" className="text-accent">
                  /
                </span>
                Explore By
              </div>
              <nav
                aria-label="Explore work by discipline"
                className="no-scrollbar flex min-w-0 flex-1 items-stretch overflow-x-auto"
              >
                {filters.map((filter, index) => (
                  <Link
                    key={filter.href}
                    to={filter.href}
                    className={`flex shrink-0 items-center px-4 py-3 font-sans text-[13px] text-muted transition-colors duration-200 hover:bg-white/[0.04] hover:text-foreground active:bg-accent-soft active:text-foreground ${
                      index < filters.length - 1 ? "border-r border-white/10" : ""
                    }`}
                  >
                    {filter.label}
                  </Link>
                ))}
              </nav>
              <Link
                to="/works"
                className="group inline-flex shrink-0 items-center gap-2 border-l border-white/10 px-4 font-sans text-[13px] font-medium text-foreground transition-colors duration-200 hover:bg-white/[0.04] sm:px-5"
              >
                All Work
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            {...rise(0.22)}
            className="mx-auto mt-4 flex w-full max-w-[920px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="font-sans text-[13px] text-muted">
              Product design &amp; engineering studio{" "}
              <span aria-hidden="true" className="mx-1.5 text-white/20">
                /
              </span>{" "}
              Based in India
            </p>
            <Link
              to="/contact"
              className="group inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-[4px] bg-accent px-4 font-sans text-[13px] font-medium text-on-accent transition-colors duration-200 hover:bg-accent-strong sm:self-auto"
            >
              Work With Us
              <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          <motion.div {...rise(0.28)} className="mt-10 md:mt-12">
            <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible">
              {featuredProjects.map((project, index) => (
                <Link
                  key={project.id}
                  to={`/works/${project.id}`}
                  aria-label={`${project.name} — view project`}
                  className="group block min-w-[78vw] snap-start rounded-[6px] sm:min-w-[46vw] md:min-w-0"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] border border-white/10 bg-[#141414] transition-colors duration-300 group-hover:border-white/20">
                    <img
                      src={project.coverImage}
                      alt={project.coverAlt}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <h2 className="font-sans text-[16px] font-semibold tracking-[-0.02em] text-foreground">
                      {project.name}
                    </h2>
                    <ArrowIcon className="h-3.5 w-3.5 shrink-0 text-muted transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </div>
                  <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
                    {project.genre}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        <div aria-hidden="true" className="mx-auto mt-10 h-px w-full max-w-[1180px] bg-white/10 md:mt-12" />
      </div>
    </section>
  );
}
