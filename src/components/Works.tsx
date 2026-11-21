import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION } from "@/lib/motion";
import { getProject, type Project } from "@/data/projects";
import ProjectCard from "./ProjectCard";

const featuredProject = getProject("designers-room");

const gridProjects = ["cybersec-toolkit", "notify-ed", "sedative-physio"]
  .map((id) => getProject(id))
  .filter((project): project is Project => Boolean(project));

export default function Works() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (reduceMotion) return;

      const heading = headingRef.current;
      const lead = leadRef.current;
      const body = bodyRef.current;
      if (!introRef.current || !heading || !lead || !body) return;

      const introSplits = [
        createMaskedText(heading, "chars"),
        createMaskedText(lead, "words"),
        createMaskedText(body, "words"),
      ];
      const allSplits = [...introSplits];
      const [headingParts, leadParts, bodyParts] = introSplits.map((split) =>
        split.chars.length ? split.chars : split.words,
      );

      gsap.set([...headingParts, ...leadParts, ...bodyParts], {
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
        .to(
          headingParts,
          { yPercent: 0, opacity: 1, duration: 1, stagger: 0.045 },
          0,
        )
        .to(
          leadParts,
          { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.025 },
          0.2,
        )
        .to(
          bodyParts,
          { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.018 },
          0.34,
        );

      const grid = gridRef.current;
      if (grid) {
        const cards = gsap.utils.toArray<HTMLElement>(
          grid.querySelectorAll('[data-project-card][data-project-variant="grid"]'),
        );
        const titles = cards
          .map((card) => card.querySelector("h3"))
          .filter((title): title is HTMLHeadingElement => title !== null);
        const cardSplits = titles.map((title) => createMaskedText(title, "words"));
        allSplits.push(...cardSplits);
        const titleParts = cardSplits.flatMap((split) => split.words);

        gsap.set(cards, {
          transformPerspective: 1100,
          transformOrigin: "50% 50%",
        });
        gsap.set(titleParts, { yPercent: 110, opacity: 0 });

        gsap
          .timeline({
            defaults: { ease: MOTION.ease },
            scrollTrigger: {
              trigger: grid,
              start: "top 86%",
              end: "+=70%",
              scrub: 1,
            },
          })
          .fromTo(
            cards,
            { opacity: 0, y: 52, rotationX: 4, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              scale: 1,
              duration: 1,
              stagger: 0.16,
            },
            0,
          )
          .to(
            titleParts,
            { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.07 },
            0.35,
          );
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
      className="theme-transition relative isolate overflow-hidden bg-background py-24 md:py-36"
    >
      <div aria-hidden="true" className="works-fade" />

      <div className="relative z-10">
        <div ref={introRef} className="mx-auto max-w-[980px] text-center">
          <h2
            ref={headingRef}
            id="works-heading"
            className="font-display text-[clamp(4.5rem,16vw,15rem)] font-light leading-[0.8] tracking-[-0.06em] text-foreground"
          >
            WORK
          </h2>
          <p
            ref={leadRef}
            className="mt-8 font-display text-[clamp(1.15rem,2.4vw,1.75rem)] font-light tracking-[-0.02em] text-foreground md:mt-10"
          >
            Ideas made tangible. Products made useful.
          </p>
          <p
            ref={bodyRef}
            className="mx-auto mt-4 max-w-[46ch] text-[14px] leading-[1.65] text-muted md:text-[15px]"
          >
            A selection of digital products and experiences we&apos;ve designed,
            engineered, and brought to life.
          </p>
        </div>

        {featuredProject ? (
          <div className="mx-auto mt-16 w-full md:mt-24 md:w-[96%]">
            <ProjectCard project={featuredProject} variant="featured" priority />
          </div>
        ) : null}

        <div
          ref={gridRef}
          data-project-grid
          className="mt-10 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-2 md:gap-7"
        >
          {gridProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} priority={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
