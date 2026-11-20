import { useRef } from "react";
import { Link } from "react-router";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";

const services = [
  {
    name: "Web Development",
    slug: "/services/web-development",
    discipline: "Engineering",
    detail: "React / TypeScript",
    scope: "Design to launch",
  },
  {
    name: "Product Design",
    slug: "/services/product-design",
    discipline: "Design",
    detail: "Interface / Systems",
    scope: "Research to UI",
  },
  {
    name: "AI Solutions",
    slug: "/services/ai-solutions",
    discipline: "Applied AI",
    detail: "LLM / Automation",
    scope: "Prototype to production",
  },
  {
    name: "Website Maintenance",
    slug: "/services/website-maintenance",
    discipline: "Care",
    detail: "Performance / Updates",
    scope: "Ongoing support",
  },
];

export default function Services() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduceMotion || !rowsRef.current) return;

      const trigger = { trigger: rowsRef.current, start: "top 82%" };

      gsap.fromTo(
        "[data-service-rule]",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.out", scrollTrigger: trigger },
      );
      gsap.from(Array.from(rowsRef.current.querySelectorAll("a")), {
        opacity: 0,
        y: 12,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: trigger,
      });
      gsap.from("[data-service-accent]", {
        opacity: 0,
        x: -6,
        duration: 0.5,
        delay: 0.15,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: trigger,
      });
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
          id="services-heading"
          className="mt-3 font-sans text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          What we do.
        </h2>
      </div>

      <div ref={rowsRef} className="relative divide-y divide-black/10">
        <span
          data-service-rule
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-100 bg-black/10"
        />
        {services.map((item) => (
          <Link
            key={item.name}
            to={item.slug}
            className="group grid grid-cols-1 gap-3 py-6 transition-colors duration-300 hover:bg-black/[0.02] md:grid-cols-[minmax(0,46fr)_minmax(0,20fr)_minmax(0,34fr)] md:items-center md:gap-x-4 md:py-7 lg:grid-cols-[minmax(0,48fr)_minmax(0,20fr)_minmax(0,32fr)] lg:gap-x-6"
          >
            <h3 className="font-display text-[18px] text-foreground transition-colors group-hover:text-accent md:text-[21px]">
              {item.name}
            </h3>
            <span
              data-service-accent
              className="font-sans text-[14px] text-accent-text md:text-[15px]"
            >
              {item.discipline}
            </span>
            <div className="grid grid-cols-1 gap-1 font-mono text-[12px] text-muted md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-x-5 lg:gap-x-6">
              <span className="text-muted">{item.detail}</span>
              <span className="text-muted">{item.scope}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
