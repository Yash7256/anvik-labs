import { site } from "@/lib/site";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import Img from "./Img";

const products = ["Chisel UI", "CyberSec Toolkit", "Designers Room"];

const slides = [
  {
    src: "/mockups/designersroom.webp",
    width: 1519,
    height: 1036,
    label: "Designers Room",
    alt: "Designers Room community product mockup",
  },
  {
    src: "/mockups/cybersec-toolkit.webp",
    width: 1672,
    height: 941,
    label: "CyberSec Toolkit",
    alt: "CyberSec Toolkit dashboard mockup",
  },
  {
    src: "/mockups/notifyed.webp",
    width: 1672,
    height: 941,
    label: "Notifyed",
    alt: "Notifyed product interface mockup",
  },
  {
    src: "/mockups/sedativephysio.webp",
    width: 1447,
    height: 1085,
    label: "Sedative Physio",
    alt: "Sedative Physio website mockup",
  },
];

function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || paused) return;

    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [reduceMotion, paused, index]);

  const showSlide = (nextIndex: number) => {
    setDirection(nextIndex >= index ? 1 : -1);
    setIndex(nextIndex);
  };

  const current = slides[index];

  return (
    <div
      role="group"
      aria-label="Selected work mockups"
      style={{
        height: "var(--hero-frame-height)",
        width: `calc(var(--hero-frame-height) * ${
          current.width / current.height
        })`,
      }}
      className="relative max-w-full shrink-0 overflow-hidden rounded-[2px] border border-white/10 bg-light-surface [--hero-frame-height:clamp(160px,44vw,260px)] lg:[--hero-frame-height:clamp(180px,18vw,280px)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current.src}
          custom={direction}
          variants={{
            enter: (slideDirection: number) => ({
              x: slideDirection > 0 ? "100%" : "-100%",
            }),
            center: { x: "0%" },
            exit: (slideDirection: number) => ({
              x: slideDirection > 0 ? "-100%" : "100%",
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            ease: [0.32, 0.72, 0, 1],
          }}
          className="absolute inset-0"
        >
          <Img
            fill
            src={current.src}
            alt={current.alt}
            loading="eager"
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-white/10 bg-background/85 px-3 py-2 sm:px-4">
        <p className="truncate font-mono text-[12px] uppercase tracking-[0.16em] text-neutral-400">
          {slides[index].label}
        </p>
        <div className="flex items-center">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => showSlide(slideIndex)}
              aria-label={`Show ${slide.label}`}
              aria-current={slideIndex === index ? "true" : undefined}
              className="group flex h-6 items-center px-1"
            >
              <span
                aria-hidden="true"
                className={`h-[2px] w-5 transition-colors duration-300 sm:w-6 ${
                  slideIndex === index
                    ? "bg-accent"
                    : "bg-white/25 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[calc(100svh-var(--header-height))] flex-col justify-between pb-3 pt-32 md:pb-5 md:pt-44"
    >
      <div className="grid flex-1 grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex h-full flex-col justify-between pb-2 pt-0 lg:col-span-7 xl:col-span-7">
          <div>
            <h1 id="hero-heading" className="mt-4 font-sans text-[clamp(2.1rem,3.8vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
              Curious by design.
              <br />
              Precise by engineering.
            </h1>
            <p className="mt-4 max-w-[58ch] font-sans text-[15px] leading-relaxed text-neutral-300 md:text-[16px]">
              Anvik Labs is a product design and engineering studio in India. We
              help startups and small businesses with{" "}
              <Link className="text-foreground underline decoration-white/25 underline-offset-4 transition-colors hover:text-accent" to="/services/product-design">
                product design
              </Link>,{" "}
              <Link className="text-foreground underline decoration-white/25 underline-offset-4 transition-colors hover:text-accent" to="/services/web-development">
                web development
              </Link>,{" "}
              <Link className="text-foreground underline decoration-white/25 underline-offset-4 transition-colors hover:text-accent" to="/services/ai-solutions">
                practical AI solutions
              </Link>, and ongoing{" "}
              <Link className="text-foreground underline decoration-white/25 underline-offset-4 transition-colors hover:text-accent" to="/services/website-maintenance">
                website maintenance
              </Link>.
            </p>
          </div>

          <div className="mt-8 w-full border-y border-white/10 py-4 lg:mt-10">
            <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-neutral-500">
              Selected products
            </p>
            <ul className="mt-3 flex w-full flex-nowrap items-center gap-x-4 overflow-x-auto whitespace-nowrap font-sans text-[15px] font-medium text-foreground md:gap-x-5 md:text-[16px]">
              {products.map((product, index) => (
                <li key={product} className="flex shrink-0 items-center gap-x-4 md:gap-x-5">
                  <span>{product}</span>
                  {index < products.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 shrink-0 rounded-full bg-accent"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex w-full justify-end lg:col-span-5 lg:-mt-2 xl:col-span-5">
          <HeroSlideshow />
        </div>
      </div>

      <div aria-hidden className="my-4 h-px w-full bg-white/15 md:my-5" />

      <div className="relative w-full overflow-visible py-2 md:py-3">
        <div className="relative z-10 flex w-full items-center justify-center font-sans font-bold leading-none tracking-[-0.045em] text-foreground">
          <span className="inline-block whitespace-nowrap font-michroma font-normal text-[clamp(2rem,12vw,12rem)] [word-spacing:0.2em]">
            Anvik Labs
          </span>
        </div>
      </div>

      <div aria-hidden className="my-2 h-px w-full bg-white/15 md:my-3" />

      <div className="flex flex-col items-center justify-between gap-3 pb-1 pt-1 font-mono text-[12px] tracking-[0.04em] text-neutral-400 sm:flex-row md:text-[12px]">
        <span>{site.studioTagline} / India</span>
        <a
          href="#featured-product"
          className="text-neutral-300 transition-colors duration-200 hover:text-foreground"
        >
          Selected work
        </a>

      </div>
    </section>
  );
}
