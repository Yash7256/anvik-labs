import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Link } from "react-router";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION, useFinePointer } from "@/lib/motion";
import { useUserInteraction } from "@/lib/use-user-interaction";
import { useVideoPlayback } from "@/lib/useVideoPlayback";
import { services as serviceData } from "@/data/services";

type ServiceCardConfig = {
  index: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  meta: string;
  sculpture: "web" | "design" | "ai" | "care";
  image?: string;
  video?: string;
  mediaAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  pills: string[];
};

const serviceCards: ServiceCardConfig[] = [
  {
    index: "01",
    slug: serviceData[0].slug,
    name: "Development",
    description: serviceData[0].heroSubline,
    category: "BUILD / SHIP",
    meta: "PRODUCT SYSTEMS",
    sculpture: "web",
    video: "/assets/development.mp4",
    image: "/assets/webdev-service.webp",
    mediaAlt: "Development visual",
    imageWidth: 640,
    imageHeight: 1137,
    pills: ["Frontend", "Backend", "Web Apps", "Dashboards"],
  },
  {
    index: "02",
    slug: serviceData[1].slug,
    name: "Product Design",
    description: serviceData[1].heroSubline,
    category: "DESIGN / SYSTEMS",
    meta: "INTERFACE CRAFT",
    sculpture: "design",
    video: "/assets/uiuxdesign.mp4",
    image: "/assets/uiux-service.webp",
    mediaAlt: "Product design visual",
    imageWidth: 720,
    imageHeight: 1280,
    pills: ["Product Design", "Design Systems", "Prototypes"],
  },
  {
    index: "03",
    slug: serviceData[3].slug,
    name: "Maintenance & Support",
    description: serviceData[3].heroSubline,
    category: "CARE / PERFORMANCE",
    meta: "LIVE SUPPORT",
    sculpture: "care",
    video: "/assets/maintenance.mp4",
    image: "/assets/maintenance-service.webp",
    mediaAlt: "Website maintenance visual",
    imageWidth: 720,
    imageHeight: 1320,
    pills: ["Maintenance", "Performance", "Security", "Support"],
  },
];

function ServiceSculpture({ variant }: { variant: ServiceCardConfig["sculpture"] }) {
  const paths: Record<ServiceCardConfig["sculpture"], string> = {
    web: "M88 34C132 18 186 18 232 38C278 58 314 98 302 136C290 174 238 196 186 206C134 216 74 202 58 168C42 134 44 50 88 34Z",
    design: "M108 28C156 10 220 24 256 58C292 92 284 142 244 170C204 198 148 214 104 198C60 182 38 132 52 90C66 48 60 46 108 28Z",
    ai: "M98 40C142 20 202 16 246 44C290 72 302 122 276 156C250 190 196 214 144 208C92 202 52 170 52 130C52 90 54 60 98 40Z",
    care: "M92 44C136 24 190 20 236 46C282 72 298 114 280 150C262 186 214 210 160 210C106 210 62 190 52 154C42 118 48 64 92 44Z",
  };
  const inner: Record<ServiceCardConfig["sculpture"], string> = {
    web: "M112 70C150 54 196 56 228 76C260 96 272 126 252 150C232 174 186 186 144 180C102 174 78 150 82 122C86 94 74 86 112 70Z",
    design: "M128 66C164 48 214 56 236 82C258 108 248 140 220 156C192 172 150 178 120 164C90 150 84 122 96 98C108 74 92 84 128 66Z",
    ai: "M120 74C156 58 200 60 228 82C256 104 258 134 236 154C214 174 172 184 134 176C96 168 80 142 88 116C96 90 84 90 120 74Z",
    care: "M118 78C152 62 194 64 222 84C250 104 254 132 234 152C214 172 176 182 140 176C104 170 86 146 92 120C98 94 84 94 118 78Z",
  };

  return (
    <svg
      viewBox="0 0 320 240"
      aria-hidden="true"
      className="service-sculpture h-full w-full"
      fill="none"
    >
      <defs>
        <linearGradient id={`sculpture-fill-${variant}`} x1="60" y1="30" x2="280" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="0.35" stopColor="rgba(190,190,200,0.2)" />
          <stop offset="0.68" stopColor="rgba(145,135,190,0.16)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.06)" />
        </linearGradient>
        <linearGradient id={`sculpture-stroke-${variant}`} x1="70" y1="40" x2="260" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="0.5" stopColor="rgba(200,200,210,0.34)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.12)" />
        </linearGradient>
      </defs>
      <path d={paths[variant]} fill={`url(#sculpture-fill-${variant})`} />
      <path d={paths[variant]} stroke={`url(#sculpture-stroke-${variant})`} strokeWidth="1.2" />
      <path d={inner[variant]} stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      <path d="M72 148C120 112 176 104 246 128" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M92 170C132 144 186 138 236 152" stroke="rgba(175,165,210,0.2)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function ServiceVisual({ card, reduceMotion }: { card: ServiceCardConfig; reduceMotion: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const interacted = useUserInteraction();
  const videoReady = Boolean(card.video) && interacted && !reduceMotion;

  useVideoPlayback(videoRef, videoReady);

  return (
    <div
      data-service-visual
      className="service-visual relative min-h-[18rem] overflow-hidden sm:min-h-[22rem] lg:min-h-[27rem]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "var(--sc-visual-overlay)" }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-8 top-8 h-40 w-40 rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle, var(--sc-visual-blob-a), transparent 68%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-6 h-32 w-32 rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle, var(--sc-visual-blob-b), transparent 70%)" }}
      />

      <div className="service-visual__art absolute inset-[6%_4%_10%_8%] sm:inset-[8%_6%_10%_12%] lg:inset-[8%_2%_10%_10%]">
        {card.video || card.image ? (
          <div className="absolute inset-0 overflow-hidden rounded-[14px] border border-[var(--sc-preview-border)] bg-[var(--sc-preview-img-bg)] shadow-[0_24px_60px_-40px_rgba(0,0,0,0.45)]">
            {card.video ? (
              <video
                ref={videoRef}
                src={videoReady ? card.video : undefined}
                poster={card.image}
                aria-label={card.mediaAlt ?? ""}
                width={card.imageWidth}
                height={card.imageHeight}
                muted
                loop
                playsInline
                preload="none"
                className="h-full w-full object-cover opacity-90 saturate-[0.85] contrast-[1.02]"
              />
            ) : (
              <img
                src={card.image}
                alt={card.mediaAlt ?? ""}
                width={card.imageWidth}
                height={card.imageHeight}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-90 saturate-[0.85] contrast-[1.02]"
              />
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "var(--sc-preview-overlay)" }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_35%,transparent_65%,rgba(0,0,0,0.12))] mix-blend-soft-light"
            />
          </div>
        ) : (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[14px] border border-[var(--sc-preview-border)] bg-[var(--sc-pill-bg)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[14px] opacity-60 [background-image:linear-gradient(var(--sc-line)_1px,transparent_1px),linear-gradient(90deg,var(--sc-line)_1px,transparent_1px)] [background-size:28px_28px]"
            />
            <div aria-hidden="true" className="absolute left-3 top-3 h-3 w-3 border-l border-t border-[var(--sc-text-faint)]" />
            <div aria-hidden="true" className="absolute right-3 top-3 h-3 w-3 border-r border-t border-[var(--sc-text-faint)]" />
            <div aria-hidden="true" className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[var(--sc-text-faint)]" />
            <div aria-hidden="true" className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[var(--sc-text-faint)]" />

            <div className="absolute inset-[10%_8%_14%_8%] opacity-90 blur-[1px]">
              <ServiceSculpture variant={card.sculpture} />
            </div>
            <div className="absolute inset-[10%_8%_14%_8%] mix-blend-screen">
              <ServiceSculpture variant={card.sculpture} />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-x-[16%] bottom-[12%] h-[18%] rounded-[100%] blur-2xl"
              style={{ background: "var(--sc-visual-shadow)" }}
            />
          </>
        )}
      </div>


    </div>
  );
}

export default function Services() {
  const reduceMotion = useReducedMotion() ?? false;
  const finePointer = useFinePointer();
  const rootRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [activeCards, setActiveCards] = useState<ReadonlySet<number>>(() => new Set());

  useEffect(() => {
    const cards = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>("[data-service-card]") ?? [],
    );
    if (!cards.length || typeof IntersectionObserver === "undefined") return;

    const indices = new WeakMap<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        setActiveCards((previous) => {
          const next = new Set(previous);
          for (const entry of entries) {
            const index = indices.get(entry.target);
            if (index === undefined) continue;
            if (entry.isIntersecting) next.add(index);
            else next.delete(index);
          }
          return next;
        });
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );

    cards.forEach((card, index) => {
      indices.set(card, index);
      observer.observe(card);
    });
    return () => observer.disconnect();
  }, []);

  const handleCardPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion || !finePointer || event.pointerType !== "mouse") return;
    const card = event.currentTarget;
    const visual = card.querySelector<HTMLElement>("[data-service-visual]");
    const art = card.querySelector<HTMLElement>(".service-visual__art");
    if (!visual || !art) return;
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(art, { x: x * 14, y: y * 10, duration: 0.7, ease: "power3.out", overwrite: "auto" });
  };

  const handleCardPointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const art = card.querySelector<HTMLElement>(".service-visual__art");
    gsap.to(art, { x: 0, y: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });
  };

  useGSAP(
    () => {
      if (reduceMotion) return;
      const heading = headingRef.current;
      const stack = stackRef.current;
      if (!rootRef.current || !introRef.current || !heading || !stack) return;

      const splits = [createMaskedText(heading, "words")];
      const headingWords = splits[0].words;
      const cards = gsap.utils.toArray<HTMLElement>(
        stack.querySelectorAll("[data-service-card]"),
      );

      gsap.set(headingWords, { yPercent: 110, opacity: 0 });

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
        .to(headingWords, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.04 }, 0);

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
            className="font-display text-[clamp(3rem,8.5vw,7.5rem)] font-extralight leading-[0.84] tracking-[-0.055em] text-foreground lg:pt-[8rem]"
          >
            <span aria-hidden="true">SERVICES</span>
            <span className="sr-only">Product design and engineering services</span>
          </h2>
          <p className="mt-6 max-w-[44ch] font-sans text-[12px] leading-[1.65] text-muted md:text-[13px]">
            We design it, build it, break it, fix it, and stick around to keep making it better. From product design and development to practical AI solutions and website maintenance, we're in it for the long run.
          </p>

        </div>

        <div ref={stackRef} className="service-stack relative lg:pb-[22rem]">
          {serviceCards.map((card, index) => (
            <article
              key={card.slug}
              data-service-card
              data-active={activeCards.has(index) ? "true" : "false"}
              onPointerMove={handleCardPointerMove}
              onPointerLeave={handleCardPointerLeave}
              className="service-card group/card relative mb-6 overflow-hidden rounded-[20px] border border-[var(--sc-border)] bg-[var(--sc-bg)] text-[var(--sc-text)] shadow-[var(--sc-shadow)] backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-500 hover:border-[var(--sc-border-hover)] hover:bg-[var(--sc-bg-hover)] hover:shadow-[var(--sc-shadow-hover)] last:mb-0 lg:sticky lg:mb-0"
              style={
                {
                  "--service-card-offset": `${index * 8}rem`,
                  zIndex: index + 1,
                  marginBottom: index === serviceCards.length - 1 ? 0 : undefined,
                } as CSSProperties
              }
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{ background: "var(--sc-gloss)" }}
              />
              <div
                aria-hidden="true"
                className="service-card__fluid service-card__fluid--a absolute -left-16 -top-20 h-56 w-56 rounded-full blur-3xl"
              />
              <div
                aria-hidden="true"
                className="service-card__fluid service-card__fluid--b absolute -bottom-20 right-[-10%] h-64 w-64 rounded-full blur-3xl"
              />
              <div
                aria-hidden="true"
                className="service-card__fluid service-card__fluid--c absolute left-[35%] top-[20%] h-44 w-44 rounded-full blur-2xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-500 group-hover/card:opacity-100"
                style={{ background: "var(--sc-ambient)" }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
                style={{ backgroundImage: "linear-gradient(to right, transparent, var(--sc-sheen), transparent)" }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-[var(--sc-ring)]"
              />

              <Link
                to={`/services/${card.slug}`}
                data-cursor="service"
                className="group relative block p-6 sm:p-7 lg:p-9 xl:p-10"
              >
                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10 xl:gap-12">
                  <div data-service-body className="relative z-10 flex min-w-0 flex-col">
                    <div className="hidden" aria-hidden="true" />

                    <h3 className="mt-2 max-w-none font-sans text-[clamp(1.9rem,3.6vw,3.6rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-[var(--sc-text)] sm:mt-4 lg:whitespace-nowrap">
                      {card.name}
                    </h3>

                    <div aria-hidden="true" className="mt-7 h-px w-full max-w-[28rem] bg-[var(--sc-line)]" />

                    <p className="mt-7 max-w-[34ch] text-[15px] leading-[1.8] text-[var(--sc-text-muted)] sm:text-[16px]">
                      {card.description}
                    </p>

                    <div className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]" role="group" aria-label={`${card.name} capabilities`}>
                      <div className="flex w-max animate-service-pill-marquee hover:[animation-play-state:paused]">
                        {[0, 1].map((copy) => (
                          <ul
                            key={copy}
                            aria-hidden={copy === 1}
                            className="flex shrink-0 gap-2 pr-2"
                          >
                            {card.pills.map((pill) => (
                              <li
                                key={`${copy}-${pill}`}
                                className="shrink-0 rounded-full border border-[var(--sc-pill-border)] bg-[var(--sc-pill-bg)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--sc-pill-text)]"
                              >
                                {pill}
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    </div>
                  </div>

                  <ServiceVisual card={card} reduceMotion={reduceMotion} />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
