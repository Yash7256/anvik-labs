import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { Link, useParams, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION } from "@/lib/motion";
import { useVideoPlayback } from "@/lib/useVideoPlayback";
import Image from "@/components/Img";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import {
  getNextProject,
  getProject,
  getProjectWorkType,
  projects,
  type ProjectDecision,
  type ProjectOutcome,
} from "@/data/projects";
import { createMeta, createWorkDescription, site } from "@/lib/site";
import { createBreadcrumbJsonLd, createWorkJsonLd } from "@/lib/schema";

export function loader({ params }: LoaderFunctionArgs) {
  if (!getProject(params.slug ?? "")) throw new Response("Work not found", { status: 404 });
  return null;
}

const mono = "font-mono uppercase tracking-[0.02em] text-[12px] leading-[1.2]";
const WORK_TYPE_LABEL = { design: "Design", development: "Development", both: "Design + Development" } as const;

type MarqueeImage = { file: string; width: number; height: number; alt: string };

const MARQUEE_IMAGES: MarqueeImage[] = [
  { file: "2.png", width: 1518, height: 1036, alt: "Sedative Physio course discovery screen" },
  { file: "3.png", width: 1448, height: 1086, alt: "Sedative Physio course overview screen" },
  { file: "4.png", width: 2400, height: 1792, alt: "Sedative Physio course details screen" },
  { file: "5.png", width: 4500, height: 3000, alt: "Sedative Physio learning dashboard" },
  { file: "6.png", width: 3080, height: 2310, alt: "Sedative Physio student learning interface" },
  { file: "7.png", width: 2880, height: 2160, alt: "Sedative Physio lesson interface" },
  { file: "10.png", width: 2880, height: 2602, alt: "Sedative Physio resource library screen" },
  { file: "11.png", width: 2880, height: 2602, alt: "Sedative Physio learning resources screen" },
];

function MarqueeRow({ images, direction }: { images: readonly MarqueeImage[]; direction: "left" | "right" }) {
  const reduceMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const isStatic = hydrated && Boolean(reduceMotion);
  const sequence = isStatic ? images : [...images, ...images];

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const element = marqueeRef.current;
    if (!element || reduceMotion) return;

    let visible = false;
    let pageVisible = !document.hidden;
    const syncPlayback = () => {
      element.dataset.paused = visible && pageVisible ? "false" : "true";
    };

    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      syncPlayback();
    }, { threshold: 0.05 });
    observer.observe(element);

    const handleVisibility = () => {
      pageVisible = !document.hidden;
      syncPlayback();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    syncPlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      delete element.dataset.paused;
    };
  }, [reduceMotion]);

  const renderImages = (duplicate: boolean) => sequence.map((image, index) => (
    <img
      key={`${direction}-${duplicate ? "copy" : "original"}-${index}-${image.file}`}
      src={`/sedativephysio/${image.file}`}
      alt={duplicate || index >= images.length ? "" : image.alt}
      width={image.width}
      height={image.height}
      loading="lazy"
      decoding="async"
      className="block h-[clamp(110px,14vw,220px)] w-auto max-w-none rounded-[6px] border border-border/60 object-cover"
    />
  ));

  return (
    <div
      ref={marqueeRef}
      tabIndex={0}
      role="group"
      aria-label={`Sedative Physio ${direction === "left" ? "first" : "second"} interface row`}
      className={`project-marquee${isStatic ? " project-marquee--static" : ""}`}
    >
      <div className={`project-marquee__track ${direction === "left" ? "project-marquee__track--left" : "project-marquee__track--right"}`}>
        <div className="flex shrink-0 gap-3 pr-3">{renderImages(false)}</div>
        {!isStatic && <div className="flex shrink-0 gap-3 pr-3" aria-hidden="true">{renderImages(true)}</div>}
      </div>
    </div>
  );
}

type NumberedContentBlock =
  | { kind: "heading"; number: string; title: string }
  | { kind: "bullet"; text: string }
  | { kind: "insight"; label: string; text: string };

function parseNumberedContent(content: string): NumberedContentBlock[] {
  const blocks: NumberedContentBlock[] = [];

  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    const heading = line.match(/^(\d{2}\.)\s+(.+)$/);
    if (heading) {
      blocks.push({ kind: "heading", number: heading[1], title: heading[2] });
      continue;
    }

    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet) {
      blocks.push({ kind: "bullet", text: bullet[1] });
      continue;
    }

    const insight = line.match(/^(Key Insight:)\s+(.+)$/);
    if (insight) {
      blocks.push({ kind: "insight", label: insight[1], text: insight[2] });
      continue;
    }

    blocks.push({ kind: "bullet", text: line });
  }

  return blocks;
}

function groupNumberedSections(blocks: NumberedContentBlock[]) {
  const sections: { number: string; title: string; bullets: string[] }[] = [];

  for (const block of blocks) {
    if (block.kind === "heading") {
      sections.push({ number: block.number, title: block.title, bullets: [] });
    } else if (block.kind === "bullet" && sections.length) {
      sections[sections.length - 1].bullets.push(block.text);
    }
  }

  return sections;
}

function ContentBullet({ text }: { text: string }) {
  const labelled = text.match(/^([^:]+):\s+(.+)$/);

  return (
    <li className="flex gap-2 text-[14px] leading-relaxed text-muted">
      <span className="shrink-0 text-foreground">-</span>
      <span>
        {labelled ? (
          <>
            <span className="font-medium text-foreground">{labelled[1]}:</span> {labelled[2]}
          </>
        ) : text}
      </span>
    </li>
  );
}

function ResearchApproachCopy({ content }: { content: string }) {
  const blocks = parseNumberedContent(content);
  const sections = groupNumberedSections(blocks);
  const insight = blocks.find((block) => block.kind === "insight");

  return (
    <div className="mt-4 grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:gap-x-8">
      {sections.map((section, index) => (
        <div
          key={section.number}
          className={index === 1 ? "border-t border-border/30 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0" : ""}
        >
          <h4 className="flex items-baseline gap-2">
            <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-foreground">{section.number}</span>
            <span className="font-sans text-[17px] font-medium text-foreground">{section.title}</span>
          </h4>
          <ul className="mt-3 space-y-2">
            {section.bullets.map((bullet) => <ContentBullet key={bullet} text={bullet} />)}
          </ul>
          {index === 0 && insight?.kind === "insight" && (
            <p className="mt-4 border-t border-border/30 pt-3 text-[14px] leading-relaxed">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">{insight.label}</span>{" "}
              <span className="text-foreground/90">{insight.text}</span>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export const meta: MetaFunction = ({ params }) => {
  const project = getProject(params.slug ?? "");
  if (!project) return [{ title: "Work not found | Anvik Labs" }, { name: "robots", content: "noindex" }];

  return createMeta({
    title: `${project.name} | Anvik Labs`,
    description: createWorkDescription(project),
    path: `/works/${project.id}`,
    image: project.coverImage,
    imageAlt: project.coverAlt,
  });
};

function DecisionSection({ id, label, intro, items, variant = "default", animateHeading = false }: {
  id: string;
  label: string;
  intro?: string;
  items: ProjectDecision[];
  variant?: "default" | "technical";
  animateHeading?: boolean;
}) {
  const technical = variant === "technical";
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="py-16 md:py-24">
      <Reveal>
        <div className="grid gap-10 md:grid-cols-[34%_1fr] md:gap-12">
          <div className={technical ? "" : "md:sticky md:top-[calc(var(--header-height)+32px)] md:self-start"}>
            <h2
              id={`${id}-heading`}
              data-case-heading={animateHeading ? "" : undefined}
              className="mt-4 max-w-[14ch] font-sans text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.9] tracking-[-0.05em]"
            >
              {label}
            </h2>
          </div>
          <div className={technical ? "md:pl-8" : ""}>
            {intro && <p className="max-w-[55ch] text-[17px] leading-[1.45] text-foreground md:text-[20px]">{intro}</p>}
            <div data-decision-list="" className={technical ? `${intro ? "mt-10 " : ""}grid gap-4` : intro ? "mt-8" : ""}>
              {items.map((item, itemIndex) => (
                <article
                  key={item.title}
                  data-decision-row=""
                  className={technical
                    ? "rounded-[6px] border border-border bg-light-surface/40 p-5 sm:p-6"
                    : "grid gap-4 border-t border-border py-5 sm:grid-cols-[52px_minmax(0,1fr)] sm:gap-5"}
                >
                  {technical ? (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="mt-2 font-sans text-[18px] font-medium leading-tight text-foreground">{item.title}</h3>
                        </div>
                        <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-accent/80" />
                      </div>
                      <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-muted">{item.description}</p>
                      {(item.why || item.outcome) && (
                        <dl className="mt-5 grid gap-4 border-t border-border/80 pt-4 sm:grid-cols-2">
                          {item.why && <div><dt className={`${mono} text-muted`}>Why</dt><dd className="mt-2 text-[14px] leading-relaxed text-foreground/85">{item.why}</dd></div>}
                          {item.outcome && <div><dt className={`${mono} text-muted`}>Outcome</dt><dd className="mt-2 text-[14px] leading-relaxed text-foreground/85">{item.outcome}</dd></div>}
                        </dl>
                      )}
                    </>
                  ) : (
                    <>
                      <span className={`${mono} pt-1 text-muted`}>{String(itemIndex + 1).padStart(2, "0")}</span>
                      <div>
                        <h3 className="font-sans text-[18px] font-medium leading-tight text-foreground">{item.title}</h3>
                        <p className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-muted">{item.description}</p>
                        {(item.why || item.outcome) && (
                          <dl className="mt-4 grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-2 sm:gap-5">
                            {item.why && <div><dt className={`${mono} text-muted`}>Why</dt><dd className="mt-2 text-[14px] leading-relaxed text-foreground/85">{item.why}</dd></div>}
                            {item.outcome && <div><dt className={`${mono} text-muted`}>Outcome</dt><dd className="mt-2 text-[14px] leading-relaxed text-foreground/85">{item.outcome}</dd></div>}
                          </dl>
                        )}
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function OutcomesSection({ items }: { items: ProjectOutcome[] }) {
  return (
    <section className="py-16 md:py-24" aria-labelledby="outcomes-heading">
      <Reveal>
        <div className="grid gap-10 md:grid-cols-[34%_1fr] md:gap-12">
          <div>
            <h2 id="outcomes-heading" className="mt-4 max-w-[8ch] font-sans text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.9] tracking-[-0.05em]">Project outcomes</h2>
          </div>
          <div>
            <p className="max-w-[55ch] text-[15px] leading-relaxed text-muted">The delivered work focused on creating a clear, usable, and scalable digital product foundation for Sedative Physio.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {items.map((item, i) => (
                <article key={item.title} className="border border-border p-5">
                  <h3 className="mt-3 font-sans text-[20px] font-medium leading-tight tracking-[-0.02em] text-foreground">{item.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function WorkPage() {
  const { slug = "" } = useParams();
  const reduceMotion = useReducedMotion();
  const project = getProject(slug);
  const isSedative = project?.id === "sedative-physio";
  const rootRef = useRef<HTMLElement>(null);
  const coverVideoRef = useRef<HTMLVideoElement>(null);

  useVideoPlayback(coverVideoRef, Boolean(project?.coverVideo) && !reduceMotion);

  useGSAP(
    () => {
      if (!isSedative || reduceMotion || !rootRef.current) return;

      const root = rootRef.current;
      const splits: ReturnType<typeof createMaskedText>[] = [];

      const coverFrame = root.querySelector<HTMLElement>("[data-case-cover-frame]");
      const coverMedia = root.querySelector<HTMLElement>("[data-case-cover-media]");
      if (coverFrame && coverMedia) {
        gsap.set(coverFrame, { clipPath: "inset(6% 0% 6% 0%)" });
        gsap.set(coverMedia, { scale: 1.04, transformOrigin: "center center" });
        gsap
          .timeline({ scrollTrigger: { trigger: coverFrame, start: "top 90%", once: true } })
          .to(coverFrame, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: MOTION.duration.focal,
            ease: MOTION.ease,
            clearProps: "clipPath",
          }, 0)
          .to(coverMedia, {
            scale: 1,
            duration: MOTION.duration.focal,
            ease: MOTION.ease,
            clearProps: "transform",
          }, 0);
      }

      root.querySelectorAll<HTMLElement>("[data-case-heading]").forEach((heading) => {
        const split = createMaskedText(heading, "lines");
        splits.push(split);
        const lines = split.lines.length ? split.lines : split.words;
        if (!lines.length) return;

        gsap.set(lines, { yPercent: 110, opacity: 0 });
        gsap.to(lines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: MOTION.stagger.tight,
          ease: MOTION.ease,
          scrollTrigger: { trigger: heading, start: "top 88%", once: true },
        });
      });

      root.querySelectorAll<HTMLElement>("[data-case-parallax]").forEach((image) => {
        const frame = image.closest("figure") ?? image;
        gsap.fromTo(image,
          { yPercent: -3, scale: 1.06, transformOrigin: "center center" },
          {
            yPercent: 3,
            scale: 1.06,
            ease: "none",
            force3D: true,
            scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      const decisionList = root.querySelector<HTMLElement>("#design-decisions [data-decision-list]");
      if (decisionList) {
        const rows = Array.from(decisionList.querySelectorAll<HTMLElement>("[data-decision-row]"));
        gsap.set(rows, { opacity: 0, y: 12 });
        gsap.to(rows, {
          opacity: 1,
          y: 0,
          duration: MOTION.duration.standard,
          stagger: MOTION.stagger.tight,
          ease: MOTION.ease,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: decisionList, start: "top 85%", once: true },
        });
      }

      const goalList = root.querySelector<HTMLElement>("[data-goal-list]");
      if (goalList) {
        const pills = Array.from(goalList.querySelectorAll<HTMLElement>("[data-goal-pill]"));
        gsap.set(pills, { opacity: 0, scale: 0.96 });
        gsap.to(pills, {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.04,
          ease: MOTION.ease,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: goalList, start: "top 88%", once: true },
        });
      }

      return () => splits.forEach((split) => split.revert());
    },
    { scope: rootRef, dependencies: [isSedative, reduceMotion, slug], revertOnUpdate: true },
  );

  if (!project) {
    return (
      <><Navbar /><main id="main-content" className="flex flex-1 flex-col items-start justify-center gap-6 px-4 pt-24 sm:px-[4vw] md:px-[5vw] md:pt-28"><h1 className="font-sans text-[clamp(2rem,7vw,6rem)] font-medium uppercase leading-[0.9] tracking-[-0.05em]">Work not found</h1><Link to="/works" className={`${mono} transition-opacity duration-200 hover:opacity-50`}>[ &larr; ALL WORKS ]</Link></main><Footer /></>
    );
  }

  const workType = getProjectWorkType(project);
  const next = getNextProject(project.id);
  const showDesign = workType === "design" || workType === "both";
  const showDevelopment = workType === "development" || workType === "both";
  // section ordering preserved by render flow

  return (
    <><Navbar /><main id="main-content" className="flex flex-1 flex-col px-4 pt-[calc(var(--header-height)+24px)] sm:px-[4vw] md:px-[5vw] md:pt-[calc(var(--header-height)+32px)]">
      <JsonLd data={createBreadcrumbJsonLd([{ name: "Home", url: site.url }, { name: "Works", url: `${site.url}/works` }, { name: project.name, url: `${site.url}/works/${project.id}` }])} />
      <JsonLd data={createWorkJsonLd(project)} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        <Link to="/" className="transition-colors hover:text-foreground">Home</Link><span aria-hidden="true">/</span><Link to="/works" className="transition-colors hover:text-foreground">Works</Link><span aria-hidden="true">/</span><span className="text-muted">{project.name}</span>
      </nav>

      <article ref={rootRef}>
        <header className="pb-10 pt-8 md:pb-14 md:pt-10">
          <div className={`${mono} flex items-center justify-between gap-4`}><Link to="/works" className="transition-opacity duration-200 hover:opacity-50">[ &larr; ALL WORKS ]</Link></div>
          <div className="mt-6 grid gap-5 sm:mt-8 md:mt-12 md:grid-cols-[1fr_0.55fr] md:items-end md:gap-10">
            <h1 className="max-w-[9ch] font-sans text-[clamp(3rem,8.5vw,7.5rem)] font-medium uppercase leading-[0.86] tracking-[-0.055em] break-words">{project.name}</h1>
            <p className="max-w-[40ch] text-[16px] leading-[1.45] text-foreground md:pb-2 md:text-[18px]">{project.description}</p>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-4 border-y border-border py-4 sm:mt-10 sm:grid-cols-4 sm:gap-6 sm:py-5">
            <div className="flex flex-col gap-1.5"><dt className={`${mono} text-muted`}>WORK TYPE</dt><dd className={mono}>{WORK_TYPE_LABEL[workType]}</dd></div>
            <div className="flex flex-col gap-1.5"><dt className={`${mono} text-muted`}>PROJECT</dt><dd className={mono}>{project.projectType}</dd></div>
            <div className="flex flex-col gap-1.5"><dt className={`${mono} text-muted`}>YEAR</dt><dd className={mono}>{project.year}</dd></div>
            <div className="flex flex-col gap-1.5"><dt className={`${mono} text-muted`}>FIELD</dt><dd className={mono}>{project.genre}</dd></div>
          </dl>
        </header>

        <Reveal delay={0.05}>
          <figure className="mx-auto max-w-6xl">
            <div data-case-cover-frame="" className="relative aspect-[16/9] overflow-hidden rounded-[6px] border border-border bg-light-surface">
              {project.coverVideo && !reduceMotion ? (
                <video
                  ref={coverVideoRef}
                  data-case-cover-media=""
                  src={project.coverVideo}
                  poster={project.coverImage}
                  aria-label={project.coverAlt}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image data-case-cover-media="" src={project.coverImage} alt={project.coverAlt} fill className="object-cover" />
              )}
            </div>
            <figcaption className={`${mono} mt-3 flex items-baseline justify-between gap-4 text-muted`}><span>{project.name} / {project.year}</span><span>{WORK_TYPE_LABEL[workType]}</span></figcaption>
          </figure>
        </Reveal>

        {project.gallery?.length ? (
          <section className="py-16 md:py-24" aria-labelledby="case-study-gallery">
            <Reveal>
              <div className="mb-12 max-w-[62ch] md:mb-16">
                <h2 id="case-study-gallery" className="mt-4 font-sans text-[clamp(2rem,4vw,4rem)] font-medium leading-[0.9] tracking-[-0.05em]">Design showcase</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">A guided walkthrough of the key screens, showing how discovery, learning, and content structure come together across the platform.</p>
              </div>
            </Reveal>
            <div className="space-y-16 md:space-y-24">
              {project.gallery.map((img, i) => {
                const flip = i % 2 === 1;
                return (
                  <Reveal key={img.src} delay={0.03}>
                    <div className={`grid items-center gap-8 md:gap-12 ${img.caption ? "lg:grid-cols-2" : ""}`}>
                      <figure className={`overflow-hidden rounded-[6px] border border-border bg-light-surface ${img.caption && flip ? "lg:order-2" : ""}`}>
                        <img
                          data-case-parallax=""
                          src={img.src}
                          alt={img.alt}
                          width={img.width}
                          height={img.height}
                          loading={i < 1 ? "eager" : "lazy"}
                          fetchPriority={i === 0 ? "high" : "auto"}
                          decoding="async"
                          className="h-auto w-full"
                        />
                      </figure>
                      {img.caption ? (
                        <div className={flip ? "lg:order-1" : ""}>
                          <h3 className="mt-4 max-w-[18ch] font-sans text-[clamp(1.5rem,2.4vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.03em] text-foreground">{img.caption}</h3>
                          {img.detail ? <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-muted md:text-[16px]">{img.detail}</p> : null}
                        </div>
                      ) : null}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="py-12 md:py-16 lg:py-20" aria-labelledby="challenge-heading">
          <Reveal>
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-6 md:grid-cols-12 md:gap-x-8 lg:gap-x-10">
                <div className="md:col-span-4 lg:col-span-4">
                  <h2 id="challenge-heading" data-case-heading="" className="max-w-[12ch] font-sans text-[clamp(2.5rem,6vw,4rem)] font-light leading-[0.92] tracking-[-0.045em] text-foreground">
                    The Challenge
                  </h2>
                </div>
                <div className="md:col-span-8 lg:col-span-8 md:pt-6 lg:pt-8">
                  <p className="max-w-[34ch] font-sans text-[clamp(1.5rem,2.8vw,1.875rem)] font-normal leading-[1.25] tracking-[-0.03em] text-foreground [text-wrap:balance] sm:max-w-[38ch] lg:max-w-[42ch]">
                    {project.designThinking?.problem ?? `${project.name} brings product thinking, clear communication, and careful execution into one focused experience.`}
                  </p>
                </div>

                <dl className="grid gap-y-6 md:col-span-12 md:mt-8 md:grid-cols-3 md:gap-x-6 md:gap-y-0 lg:mt-10 lg:gap-x-8">
                  <div className="md:pr-6 lg:pr-8">
                    <dt className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-foreground md:text-[14px]">Audience</dt>
                    <dd className="mt-3 text-[15px] leading-[1.7] text-foreground/80 md:text-[16px]">
                      {project.designThinking?.audience ?? "Students and learners looking for a clearer, more structured digital experience."}
                    </dd>
                  </div>
                  <div className="md:border-l md:border-border/30 md:px-6 lg:px-8">
                    <dt className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-foreground md:text-[14px]">Core challenge</dt>
                    <dd className="mt-3 text-[15px] leading-[1.7] text-foreground/80 md:text-[16px]">
                      {project.designThinking?.coreChallenge ?? "This case study separates the decisions behind the work so the role Anvik Labs played is clear at a glance."}
                    </dd>
                  </div>
                  <div className="md:border-l md:border-border/30 md:pl-6 lg:pl-8">
                    <dt className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-foreground md:text-[14px]">Design goal</dt>
                    <dd className="mt-3 text-[15px] leading-[1.7] text-foreground/80 md:text-[16px]">
                      {project.designThinking?.designGoal ?? "Create a clear, accessible experience that supports both discovery and ongoing use."}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="py-8 md:py-12" aria-label="Project visuals">
          <Reveal>
            <div className="grid items-start gap-4 md:grid-cols-4 md:gap-6">
              <figure className="overflow-hidden rounded-[6px] border border-border bg-light-surface">
                <img data-case-parallax="" src="/sedativephysio/1.png" alt="Sedative Physio homepage interface" width={2880} height={3174} loading="lazy" decoding="async" className="block h-auto w-full" />
              </figure>
              <figure className="overflow-hidden rounded-[6px] border border-border bg-light-surface md:mt-8 lg:mt-12">
                <img data-case-parallax="" src="/sedativephysio/2.png" alt="Sedative Physio platform interface" width={1518} height={1036} loading="lazy" decoding="async" className="block h-auto w-full" />
              </figure>
              <figure className="overflow-hidden rounded-[6px] border border-border bg-light-surface aspect-[2880/3174]">
                <img data-case-parallax="" src="/sedativephysio/12.png" alt="Sedative Physio platform interface" width={2880} height={2858} loading="lazy" decoding="async" className="block h-full w-full object-cover" />
              </figure>
              <figure className="overflow-hidden rounded-[6px] border border-border bg-light-surface md:mt-8 lg:mt-12">
                <img data-case-parallax="" src="/sedativephysio/6.png" alt="Sedative Physio learning interface" width={3080} height={2310} loading="lazy" decoding="async" className="block h-auto w-full" />
              </figure>
            </div>
          </Reveal>
        </section>

        {project.designThinking && (
          <section className="py-14 md:py-20" aria-labelledby="design-thinking-heading">
            <Reveal>
              <div className="grid gap-6 md:grid-cols-12 md:gap-x-10 lg:gap-x-12">
                <div className="md:col-span-3 lg:col-span-3">
                  <h2 id="design-thinking-heading" data-case-heading="" className="max-w-[12ch] font-sans text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[0.9] tracking-[-0.05em]">Design thinking</h2>
                </div>
                <div className="md:col-span-9 lg:col-span-9">
                  <div className="grid gap-8 md:grid-cols-2 md:gap-x-10">
                    <div className="min-w-0">
                      <h3 className="font-sans text-[17px] font-medium text-foreground">Project Direction</h3>
                      <p className="mt-3 max-w-[52ch] text-[17px] leading-[1.5] text-foreground">{project.designThinking.intro}</p>
                    </div>
                    <div className="min-w-0 border-t border-border/30 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                      <h3 className="font-sans text-[17px] font-medium text-foreground">Goals</h3>
                      <ul data-goal-list="" className="mt-3 flex flex-wrap gap-x-3 gap-y-2 sm:items-start">
                        {project.designThinking.goals.map((goal) => (
                          <li data-goal-pill="" key={goal} className="w-fit max-w-full rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] leading-[1.45] text-muted">{goal}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-border/60 pt-6 md:mt-10">
                    <h3 className="font-sans text-[17px] font-medium text-foreground">Research &amp; Approach</h3>
                    <ResearchApproachCopy content={project.designThinking.research} />
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {showDesign && <DecisionSection id="design-decisions" label="Design decisions" intro="A few important decisions shaped how the platform came together. The goal was to keep things clear, make learning easier to access and build around how physiotherapy students actually learn." items={project.designDecisions} animateHeading />}
        {project.id === "sedative-physio" && (
          <section className="-mx-8 py-12 sm:-mx-[8vw] md:-mx-[9vw] lg:-mx-[10vw] xl:-mx-[11vw] md:py-16" aria-label="Sedative Physio interface showcase">
            <MarqueeRow images={MARQUEE_IMAGES.slice(0, 4)} direction="left" />
            <div className="mt-3 md:mt-4">
              <MarqueeRow images={MARQUEE_IMAGES.slice(4)} direction="right" />
            </div>
          </section>
        )}
        {showDevelopment && <DecisionSection id="development-decisions" label="Development decisions" items={project.developmentDecisions} variant="technical" />}

        {project.outcomes?.length ? <OutcomesSection items={project.outcomes} /> : project.illustrativeRevenue ? (
          <section className="py-16 md:py-24" aria-labelledby="impact-heading">
            <Reveal>
              <div className="grid gap-10 md:grid-cols-[34%_1fr] md:gap-12">
                <div>
                  <h2 id="impact-heading" data-case-heading="" className="mt-4 max-w-[14ch] font-sans text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.9] tracking-[-0.05em]">Illustrative impact</h2>
                </div>
                <div>
                  <p className="max-w-[55ch] text-[15px] leading-relaxed text-muted">{project.illustrativeRevenue.note} {project.illustrativeRevenue.assumptions}</p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {project.illustrativeRevenue.scenarios.map((s) => (
                      <div key={s.label} className="border border-border p-4">
                        <p className={`${mono} text-muted`}>{s.label}</p>
                        <p className="mt-2 font-sans text-[1.5rem] font-medium tracking-[-0.03em] text-foreground">{s.monthly}</p>
                        <p className="mt-2 text-[13px] leading-relaxed text-muted">{s.basis}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        ) : null}

        <section className="py-16 md:py-24"><Link to={`/works/${next.id}`} className="group block"><div className={`${mono} flex items-center justify-between gap-4 text-muted`}><span>NEXT PROJECT</span></div><div className="mt-6 flex items-end justify-between gap-6"><h2 className="max-w-[11ch] font-sans text-[clamp(2.5rem,6vw,6rem)] font-medium uppercase leading-[0.9] tracking-[-0.05em] transition-opacity duration-200 group-hover:opacity-50">{next.name}</h2><span className={`${mono} next-project__arrow shrink-0 pb-2`}>[ &rarr; ]</span></div></Link></section>
      </article>
    </main><Footer /></>
  );
}