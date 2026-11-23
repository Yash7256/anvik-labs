import type { MetaFunction } from "react-router";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProjectWorkType, projects, type Project } from "@/data/projects";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION, useFinePointer } from "@/lib/motion";
import { createMeta } from "@/lib/site";

export const meta: MetaFunction = () =>
  createMeta({
    title: "Selected Product Design & Web Work | Anvik Labs",
    description:
      "Explore selected product design, identity, editorial, and web development work by Anvik Labs for startups and growing businesses.",
    path: "/works",
  });

const filters = [
  { value: "all", label: "All work" },
  { value: "Anvik Labs", label: "Studio" },
  { value: "Client Work", label: "Client" },
] as const;

type Filter = (typeof filters)[number]["value"];

const workTypeLabel: Record<string, string> = {
  design: "Design",
  development: "Development",
  both: "Design + Dev",
};

function WorkCard({ project, index }: { project: Project; index: number }) {
  const reduceMotion = useReducedMotion() === true;
  const finePointer = useFinePointer();
  const cardRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const workType = getProjectWorkType(project);

  const onMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion || !finePointer || event.pointerType !== "mouse") return;
    const card = cardRef.current;
    const image = imageRef.current;
    if (!card || !image) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(image, {
      x: x * 14,
      y: y * 10,
      scale: 1.04,
      duration: 0.7,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <motion.article
      ref={cardRef}
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -20 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
      data-work-card
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="service-card group/card relative overflow-hidden rounded-[24px] border border-[var(--sc-border)] bg-[var(--sc-bg)] text-[var(--sc-text)] shadow-[var(--sc-shadow)] backdrop-blur-xl transition-[border-color,box-shadow,background-color,transform] duration-500 hover:-translate-y-1 hover:border-[var(--sc-border-hover)] hover:bg-[var(--sc-bg-hover)] hover:shadow-[var(--sc-shadow-hover)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-80" style={{ background: "var(--sc-gloss)" }} />
      <div aria-hidden="true" className="service-card__fluid service-card__fluid--a absolute -left-16 -top-20 h-56 w-56 rounded-full blur-3xl" />
      <div aria-hidden="true" className="service-card__fluid service-card__fluid--b absolute -bottom-20 right-[-10%] h-64 w-64 rounded-full blur-3xl" />
      <div aria-hidden="true" className="service-card__fluid service-card__fluid--c absolute left-[35%] top-[20%] h-44 w-44 rounded-full blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-500 group-hover/card:opacity-100" style={{ background: "var(--sc-ambient)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: "linear-gradient(to right, transparent, var(--sc-sheen), transparent)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-[var(--sc-ring)]" />

      <Link
        to={`/works/${project.id}`}
        onClick={() => {
          void import("@/lib/posthog.client").then(({ default: posthog }) => {
            posthog.capture("project_case_study_opened", {
              project_id: project.id,
              project_type: project.projectType,
              card_variant: "directory",
            });
          });
        }}
        data-cursor="project"
        className="relative z-10 block p-4 sm:p-5 lg:p-6"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-8">
          <div className="relative overflow-hidden rounded-[18px] border border-[var(--sc-preview-border)] bg-[var(--sc-preview-img-bg)]">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                ref={imageRef}
                src={project.coverImage}
                alt={project.coverAlt}
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover transition-[filter] duration-500 group-hover/card:saturate-[1.02]"
              />
            </div>
            <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--sc-preview-overlay)" }} />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_35%,transparent_70%,rgba(0,0,0,0.18))]" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--sc-pill-border)] bg-[var(--sc-pill-bg)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--sc-pill-text)] backdrop-blur-sm">
                {workTypeLabel[workType]}
              </span>
              <span className="rounded-full border border-[var(--sc-pill-border)] bg-[var(--sc-pill-bg)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--sc-pill-text)] backdrop-blur-sm">
                {project.year}
              </span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col px-1 py-1 sm:px-2 lg:py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--sc-text-faint)]">
              {project.projectType} / {project.genre}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,4.25rem)] font-medium leading-[0.92] tracking-[-0.045em] text-[var(--sc-text)]">
              {project.name}
            </h2>
            <p className="mt-5 max-w-[38ch] text-[15px] leading-relaxed text-[var(--sc-text-muted)] md:text-[16px]">
              {project.description}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--sc-pill-border)] bg-[var(--sc-pill-bg)] px-4 py-2 font-sans text-[13px] font-medium text-[var(--sc-text)] transition-colors duration-300 group-hover/card:border-[var(--sc-border-hover)]">
                View case study
                <span aria-hidden="true" className="transition-transform duration-300 group-hover/card:translate-x-1">→</span>
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--sc-text-faint)]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function WorksPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const reduceMotion = useReducedMotion() === true;
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.projectType === activeFilter);

  const selectFilter = (filter: Filter) => {
    setActiveFilter(filter);
    void import("@/lib/posthog.client").then(({ default: posthog }) => {
      posthog.capture("work_filter_selected", { filter: filter.toLowerCase().replaceAll(" ", "_") });
    });
  };

  useGSAP(
    () => {
      if (reduceMotion || !heroRef.current || !headingRef.current) return;
      const headingSplit = createMaskedText(headingRef.current, "words");
      gsap.set(headingSplit.words, { yPercent: 110, opacity: 0 });
      gsap.to(headingSplit.words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.03,
        ease: MOTION.ease,
        scrollTrigger: { trigger: heroRef.current, start: "top 82%" },
      });
      return () => {
        headingSplit.revert();
      };
    },
    { scope: rootRef, dependencies: [reduceMotion], revertOnUpdate: true },
  );

  return (
    <>
      <Navbar />
      <main ref={rootRef} id="main-content" className="flex flex-1 flex-col pt-[var(--header-height)]">
        <section className="relative overflow-hidden py-20 md:py-28 lg:py-36">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,90,10,0.08),transparent_40%),radial-gradient(ellipse_at_80%_20%,rgba(255,255,255,0.05),transparent_28%)]" />
          <div ref={heroRef} className="relative mx-auto max-w-[1320px]">
            <div>
              <h1
                ref={headingRef}
                className="max-w-none font-display text-[clamp(2rem,6.2vw,6.25rem)] font-medium leading-[0.9] tracking-[-0.055em] text-foreground sm:whitespace-nowrap"
              >
                Work that ships.
              </h1>
            </div>

            <div className="mt-10 flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between md:mt-14">
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                  const active = activeFilter === filter.value;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => selectFilter(filter.value)}
                      className={`rounded-full border px-4 py-2 font-sans text-[13px] font-medium transition-[border-color,background-color,color,transform] duration-200 ${
                        active
                          ? "border-accent bg-accent text-on-accent"
                          : "border-border bg-light-surface/60 text-muted hover:border-foreground/20 hover:text-foreground"
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
                {String(filteredProjects.length).padStart(2, "0")} Projects
              </p>
            </div>

            <div className="mt-10 space-y-6 md:mt-14 md:space-y-8">
              <AnimatePresence initial={false} mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <WorkCard key={project.id} project={project} index={index} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
