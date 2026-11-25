import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION } from "@/lib/motion";
import { getProject, type Project } from "@/data/projects";
import ProjectCard from "./ProjectCard";

const featuredProject = getProject("sedative-physio");

const gridProjects = ["cybersec-toolkit", "designers-room"]
  .map((id) => getProject(id))
  .filter((project): project is Project => Boolean(project));

export default function Works() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (reduceMotion) return;

      const heading = headingRef.current;
      const body = bodyRef.current;
      if (!introRef.current || !heading || !body) return;

      const introSplits = [
        createMaskedText(heading, "chars"),
        createMaskedText(body, "words", "none"),
      ];
      const allSplits = [...introSplits];
      const [headingParts, bodyParts] = introSplits.map((split) =>
        split.chars.length ? split.chars : split.words,
      );

      gsap.set([...headingParts, ...bodyParts], {
        yPercent: 110,
        opacity: 0,
      });

      gsap
        .timeline({
          defaults: { ease: MOTION.ease },
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 82%",
            end: "+=65%",
            scrub: 1,
          },
        })
        .to(headingParts, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.045 }, 0)
        .to(bodyParts, { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.018 }, 0.2);

      const featuredCard = rootRef.current?.querySelector<HTMLElement>(
        '[data-project-card][data-project-variant="featured"]',
      );
      if (featuredCard) {
        const featuredTitle = featuredCard.querySelector<HTMLElement>("h3");
        const featuredPill = featuredCard.querySelector<HTMLElement>(".project-pill");
        const featuredInner = featuredCard.querySelector<HTMLElement>("[data-project-image-inner]");
        const featuredOverlay = featuredCard.querySelector<HTMLElement>(".project-featured-gradient");
        const featuredTitleSplit = featuredTitle ? createMaskedText(featuredTitle, "words") : null;
        if (featuredTitleSplit) allSplits.push(featuredTitleSplit);

        gsap.set(featuredCard, { opacity: 0, y: 48, scale: 0.985, force3D: true });
        if (featuredInner) gsap.set(featuredInner, { clipPath: "inset(7% 0% 7% 0%)", scale: 1.04, force3D: true });
        if (featuredOverlay) gsap.set(featuredOverlay, { opacity: 0.7 });
        if (featuredTitleSplit) gsap.set(featuredTitleSplit.words, { yPercent: 105, opacity: 0 });
        if (featuredPill) gsap.set(featuredPill, { y: 10, opacity: 0 });

        gsap
          .timeline({
            defaults: { ease: MOTION.ease },
            scrollTrigger: { trigger: featuredCard, start: "top 88%", end: "+=60%", scrub: 1 },
          })
          .to(featuredCard, { opacity: 1, y: 0, scale: 1, duration: 1, clearProps: "opacity,transform" }, 0)
          .to(featuredInner ?? [], { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.9, clearProps: "clipPath,transform" }, 0.08)
          .to(featuredOverlay ?? [], { opacity: 1, duration: 0.6, clearProps: "opacity" }, 0.1)
          .to(featuredTitleSplit?.words ?? [], { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.045 }, 0.26)
          .to(featuredPill ?? [], { y: 0, opacity: 1, duration: 0.45, clearProps: "opacity,transform" }, 0.38);
      }

      const grid = gridRef.current;
      if (grid) {
        const cards = gsap.utils.toArray<HTMLElement>(
          grid.querySelectorAll('[data-project-card][data-project-variant="grid"]'),
        );
        const titles = cards
          .map((card) => card.querySelector("h3"))
          .filter((title): title is HTMLHeadingElement => title !== null);
        const inners = cards
          .map((card) => card.querySelector<HTMLElement>("[data-project-image-inner]"))
          .filter((el): el is HTMLElement => el !== null);
        const infos = cards
          .map((card) => card.querySelector<HTMLElement>("[data-project-info]"))
          .filter((el): el is HTMLElement => el !== null);
        const cardSplits = titles.map((title) => createMaskedText(title, "words"));
        allSplits.push(...cardSplits);
        const titleParts = cardSplits.flatMap((split) => split.words);

        gsap.set(cards, { transformPerspective: 1100, transformOrigin: "50% 50%" });
        gsap.set(inners, { clipPath: "inset(6% 0% 6% 0%)", scale: 1.04, force3D: true });
        gsap.set(infos, { y: 14, opacity: 0 });
        gsap.set(titleParts, { yPercent: 110, opacity: 0 });

        gsap
          .timeline({
            defaults: { ease: MOTION.ease },
            scrollTrigger: { trigger: grid, start: "top 86%", end: "+=70%", scrub: 1 },
          })
          .fromTo(
            cards,
            { opacity: 0, y: 44, rotationX: 2.5, scale: 0.985 },
            { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 1, stagger: 0.14, clearProps: "transform,opacity" },
            0,
          )
          .to(inners, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.85, stagger: 0.14, clearProps: "clipPath,transform" }, 0.06)
          .to(infos, { y: 0, opacity: 1, duration: 0.55, stagger: 0.14, clearProps: "transform,opacity" }, 0.28)
          .to(titleParts, { yPercent: 0, opacity: 1, duration: 0.62, stagger: 0.045 }, 0.3);
      }

      return () => allSplits.forEach((split) => split.revert());
    },
    { scope: rootRef, dependencies: [reduceMotion], revertOnUpdate: true },
  );

  return (
    <section
      ref={rootRef}
      id="works"
      aria-labelledby="works-heading"
      className="theme-transition relative isolate overflow-hidden bg-background py-20 md:py-28 lg:py-36"
    >
      <div aria-hidden="true" className="works-fade" />

      <div className="relative z-10">
        <div ref={introRef} className="mx-auto max-w-[980px] text-center">
          <h2
            ref={headingRef}
            id="works-heading"
            className="font-display text-[clamp(4.5rem,14vw,12rem)] font-extralight leading-[0.8] tracking-[-0.06em] text-foreground"
          >
            <span aria-hidden="true">WORK</span>
            <span className="sr-only">Selected client and independent digital product work</span>
          </h2>
          <p
            ref={bodyRef}
            className="mx-auto mt-8 max-w-[44ch] font-sans text-[12px] leading-[1.65] text-muted md:mt-10 md:text-[13px]"
          >
            From wild ideas to working things, a mix of client work and our own little experiments, brought to life with care.
          </p>
        </div>

        {featuredProject ? (
          <div className="mx-auto mt-12 w-full max-w-[1040px] md:mt-16 md:w-[88%] lg:w-[78%]">
            <ProjectCard project={featuredProject} variant="featured" priority />
          </div>
        ) : null}

        <div
          ref={gridRef}
          data-project-grid
          className="mx-auto mt-6 grid w-full max-w-[1040px] grid-cols-1 gap-5 md:mt-8 md:grid-cols-2 md:gap-5"
        >
          {gridProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
