import { useRef } from "react";
import { Link } from "react-router";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION } from "@/lib/motion";

const services = [
  {
    name: "Web Development",
    slug: "/services/web-development",
    detail: "React / TypeScript",
    scope: "Design to launch",
  },
  {
    name: "Product Design",
    slug: "/services/product-design",
    detail: "Interface / Systems",
    scope: "Research to UI",
  },
  {
    name: "AI Solutions",
    slug: "/services/ai-solutions",
    detail: "LLM / Automation",
    scope: "Prototype to production",
  },
  {
    name: "Website Maintenance",
    slug: "/services/website-maintenance",
    detail: "Performance / Updates",
    scope: "Ongoing support",
  },
];

export default function Services() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduceMotion || !rootRef.current || !headingRef.current || !rowsRef.current) {
        return;
      }

      const splits = [createMaskedText(headingRef.current, "words")];
      const headingParts = splits[0].words;
      const links = gsap.utils.toArray<HTMLElement>(rowsRef.current.querySelectorAll("a"));
      const lines = links.map((link) => link.querySelector("[data-service-line]"));
      const validLines = lines.filter((line): line is HTMLElement => line !== null);

      gsap.set(headingParts, { yPercent: 110, opacity: 0 });
      gsap.set(links, { transformPerspective: 1100 });
      gsap.set(validLines, { scaleX: 0, transformOrigin: "left center" });

      gsap
        .timeline({
          defaults: { ease: MOTION.ease },
          scrollTrigger: {
            trigger: rowsRef.current,
            start: "top 84%",
            end: "+=75%",
            scrub: 1,
          },
        })
        .to(
          headingParts,
          { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
          0,
        )
        .fromTo(
          links,
          { opacity: 0, y: 24, rotationX: 3 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.9,
            stagger: 0.12,
          },
          0.15,
        )
        .to(
          validLines,
          { scaleX: 1, duration: 0.8, stagger: 0.12 },
          0.25,
        );

      return () => splits.forEach((split) => split.revert());
    },
    { scope: rootRef, dependencies: [reduceMotion], revertOnUpdate: true },
  );

  return (
    <section
      ref={rootRef}
      id="services"
      aria-labelledby="services-heading"
      className="py-16 md:py-24"
    >
      <div className="pb-8 md:pb-10">
        <h2
          ref={headingRef}
          id="services-heading"
          className="mt-3 font-sans text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          What we do.
        </h2>
      </div>

      <div ref={rowsRef} className="flex flex-col gap-2">
        {services.map((item) => (
          <Link
            key={item.name}
            to={item.slug}
            className="group relative grid grid-cols-1 gap-3 py-6 transition-colors duration-300 hover:bg-foreground/[0.03] md:grid-cols-[minmax(0,58fr)_minmax(0,42fr)] md:items-center md:gap-x-4 md:py-7 lg:grid-cols-[minmax(0,56fr)_minmax(0,44fr)] lg:gap-x-6"
          >
            <h3 className="font-display text-[18px] text-foreground transition-colors group-hover:text-accent md:text-[21px]">
              {item.name}
            </h3>
            <div className="grid grid-cols-1 gap-1 font-mono text-[12px] text-muted md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-x-5 lg:gap-x-6">
              <span className="text-muted">{item.detail}</span>
              <span className="text-muted">{item.scope}</span>
            </div>
            <span
              data-service-line
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px bg-border"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
