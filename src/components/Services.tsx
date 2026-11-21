import { useRef } from "react";
import { Link } from "react-router";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION } from "@/lib/motion";
import { services as serviceData } from "@/data/services";

type ServiceCardConfig = {
  index: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  image: string | null;
  imageAlt: string;
  imageLabel: string;
  accent: string;
  coordinate: string;
};

const serviceCards: ServiceCardConfig[] = [
  {
    index: "01",
    slug: serviceData[0].slug,
    name: serviceData[0].name,
    description: serviceData[0].heroSubline,
    category: "Build / Ship",
    image: null,
    imageAlt: "Web development project visual placeholder",
    imageLabel: "Web build visual",
    accent: "Product systems",
    coordinate: "48.8°N / 2.3°E",
  },
  {
    index: "02",
    slug: serviceData[1].slug,
    name: serviceData[1].name,
    description: serviceData[1].heroSubline,
    category: "Design / Systems",
    image: null,
    imageAlt: "Product design visual placeholder",
    imageLabel: "Interface visual",
    accent: "Figma to product",
    coordinate: "System / 02",
  },
  {
    index: "03",
    slug: serviceData[2].slug,
    name: serviceData[2].name,
    description: serviceData[2].heroSubline,
    category: "AI / Automation",
    image: null,
    imageAlt: "AI solutions visual placeholder",
    imageLabel: "AI workflow visual",
    accent: "Practical AI",
    coordinate: "Model / 03",
  },
  {
    index: "04",
    slug: serviceData[3].slug,
    name: serviceData[3].name,
    description: serviceData[3].heroSubline,
    category: "Care / Performance",
    image: null,
    imageAlt: "Website maintenance visual placeholder",
    imageLabel: "Maintenance visual",
    accent: "Live support",
    coordinate: "Uptime / 04",
  },
];

function ServiceVisual({ card, index }: { card: ServiceCardConfig; index: number }) {
  return (
    <div
      data-service-visual
      className="service-card__visual relative overflow-hidden rounded-[6px] border border-border bg-background"
    >
      <div className="relative aspect-[16/10] w-full sm:aspect-[16/9] lg:aspect-[5/4]">
        {card.image ? (
          <img
            src={card.image}
            alt={card.imageAlt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,23,23,0.015),rgba(23,23,23,0)),linear-gradient(90deg,rgba(23,23,23,0.045)_1px,transparent_1px),linear-gradient(rgba(23,23,23,0.045)_1px,transparent_1px)] bg-[size:auto,32px_32px,32px_32px]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-6 top-6 border-t border-border/80"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-6 left-6 top-6 border-l border-border/80"
            />
            <div
              aria-hidden="true"
              className={`absolute h-14 w-14 rounded-full border border-accent/35 ${index % 2 === 0 ? "right-6 top-6" : "left-10 top-10"}`}
            />
            <div
              aria-hidden="true"
              className="absolute right-6 top-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted"
            >
              Image slot
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-text">
                {card.imageLabel}
              </p>
              <p className="mt-2 max-w-[22ch] font-display text-[20px] leading-[1.05] tracking-[-0.03em] text-foreground sm:text-[24px]">
                Replace with your project visual.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Services() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduceMotion) return;
      const heading = headingRef.current;
      const copy = copyRef.current;
      const stack = stackRef.current;
      if (!rootRef.current || !introRef.current || !heading || !copy || !stack) return;

      const splits = [
        createMaskedText(heading, "words"),
        createMaskedText(copy, "words"),
      ];
      const headingWords = splits[0].words;
      const copyWords = splits[1].words;
      const cards = gsap.utils.toArray<HTMLElement>(
        stack.querySelectorAll("[data-service-card]"),
      );

      gsap.set(headingWords, { yPercent: 110, opacity: 0 });
      gsap.set(copyWords, { yPercent: 90, opacity: 0 });

      gsap
        .timeline({
          defaults: { ease: MOTION.ease },
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 82%",
            end: "+=55%",
            scrub: 1,
          },
        })
        .to(headingWords, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.04 }, 0)
        .to(copyWords, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.012 }, 0.2);

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        cards.forEach((card, index) => {
          const visual = card.querySelector("[data-service-visual]");
          const body = card.querySelector("[data-service-body]");
          if (index === 0) {
            gsap.set(card, { opacity: 1, y: 0, scale: 1 });
            return;
          }
          gsap.set(card, { opacity: 0, y: 48, scale: 0.988, transformOrigin: "50% top" });
          if (visual) gsap.set(visual, { clipPath: "inset(8% 0% 8% 0%)", scale: 1.03 });
          if (body) gsap.set(body, { opacity: 0, y: 12 });

          const tl = gsap.timeline({
            defaults: { ease: MOTION.ease },
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              end: "top 52%",
              scrub: 1,
            },
          });
          tl.to(card, { opacity: 1, y: 0, scale: 1, duration: 1, clearProps: "opacity,transform" }, 0);
          if (visual)
            tl.to(visual, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.9, clearProps: "clipPath,transform" }, 0.06);
          if (body) tl.to(body, { opacity: 1, y: 0, duration: 0.55, clearProps: "opacity,transform" }, 0.18);
        });
      });

      mm.add("(max-width: 1023px)", () => {
        cards.forEach((card) => {
          const visual = card.querySelector("[data-service-visual]");
          const body = card.querySelector("[data-service-body]");
          gsap.set(card, { opacity: 0, y: 28 });
          if (visual) gsap.set(visual, { clipPath: "inset(6% 0% 6% 0%)", scale: 1.02 });
          if (body) gsap.set(body, { opacity: 0, y: 10 });
          const tl = gsap.timeline({
            defaults: { ease: MOTION.ease },
            scrollTrigger: { trigger: card, start: "top 88%", end: "top 58%", scrub: 1 },
          });
          tl.to(card, { opacity: 1, y: 0, duration: 0.8, clearProps: "opacity,transform" }, 0);
          if (visual) tl.to(visual, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.7, clearProps: "clipPath,transform" }, 0.05);
          if (body) tl.to(body, { opacity: 1, y: 0, duration: 0.45, clearProps: "opacity,transform" }, 0.12);
        });
      });

      return () => {
        mm.revert();
        splits.forEach((split) => split.revert());
      };
    },
    { scope: rootRef, dependencies: [reduceMotion], revertOnUpdate: true },
  );

  return (
    <section
      ref={rootRef}
      id="services"
      aria-labelledby="services-heading"
      className="relative py-20 md:py-28 lg:py-36"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-10 xl:gap-16">
        <div
          ref={introRef}
          className="lg:sticky lg:top-[calc(var(--header-height)+2.25rem)] lg:self-start lg:pb-16"
        >
          <h2
            ref={headingRef}
            id="services-heading"
            className="font-display text-[clamp(2.75rem,8vw,7rem)] font-extralight leading-[0.84] tracking-[-0.05em] text-foreground"
          >
            SERVICES
          </h2>
          <p
            ref={copyRef}
            className="mt-7 max-w-[34ch] text-[15px] leading-[1.75] text-text-secondary sm:text-[16px]"
          >
            Anvik combines creative thinking, product engineering, AI, and
            technology to create useful products and systems for startups and
            small businesses.
          </p>
          <div className="mt-10 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted lg:flex">
            <span aria-hidden="true" className="h-px w-10 bg-accent/70" />
            Scroll to explore
          </div>
        </div>

        <div ref={stackRef} className="service-stack relative lg:pb-[22rem]">
          {serviceCards.map((card, index) => (
            <article
              key={card.slug}
              data-service-card
              className="service-card group/card relative mb-5 overflow-hidden rounded-[10px] border border-border bg-light-surface shadow-[0_24px_60px_-48px_rgba(23,23,23,0.45)] last:mb-0 lg:sticky lg:mb-0"
              style={{
                top: `calc(var(--header-height) + 1rem + ${index} * clamp(4.2rem, 5vw, 4.9rem))`,
                zIndex: index + 1,
                marginBottom: index === serviceCards.length - 1 ? 0 : undefined,
              }}
            >
              <Link
                to={`/services/${card.slug}`}
                className="group block p-5 sm:p-6 lg:min-h-[23rem] lg:p-7"
              >
                <div className="flex min-h-[7.5rem] items-start justify-between gap-4 border-b border-border pb-4 sm:min-h-[8.5rem] sm:pb-5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                      <span className="text-accent-text">{card.index}</span>
                      <span aria-hidden="true" className="h-px w-6 bg-border" />
                      <span>{card.category}</span>
                    </div>
                    <h3 className="mt-3 max-w-[11ch] font-display text-[clamp(1.85rem,4vw,3.35rem)] font-medium leading-[0.93] tracking-[-0.045em] text-foreground transition-colors duration-300 group-hover:text-accent-text">
                      {card.name}
                    </h3>
                  </div>
                  <div className="hidden pt-1 text-right sm:block">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{card.accent}</p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted/80">{card.coordinate}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end lg:gap-6">
                  <div data-service-body className="max-w-[34ch]">
                    <p className="text-[14px] leading-[1.75] text-text-secondary sm:text-[15px]">
                      {card.description}
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors duration-300 group-hover:text-accent-text">
                        <span>View service</span>
                        <span aria-hidden="true">→</span>
                      </span>
                      <span aria-hidden="true" className="h-px flex-1 bg-border/80" />
                    </div>
                  </div>
                  <ServiceVisual card={card} index={index} />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
