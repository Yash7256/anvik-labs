import { site } from "@/lib/site";
import { Link } from "react-router";
import { useReducedMotion } from "framer-motion";
import Img from "./Img";

function HeroMedia() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-label="Designers Room product preview"
      className="relative aspect-[16/10] h-[var(--hero-frame-height)] max-w-full shrink-0 overflow-hidden rounded-[2px] border border-white/10 bg-light-surface [--hero-frame-height:clamp(220px,52vw,340px)] lg:[--hero-frame-height:clamp(260px,22vw,420px)]"
    >
      {reduceMotion ? (
        <Img
          fill
          src="/mockups/designersroom.webp"
          alt="Designers Room product preview"
          loading="eager"
          className="object-cover object-center"
        />
      ) : (
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          src="/designersroom.mp4"
          poster="/mockups/designersroom.webp"
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          aria-label="Designers Room product preview video"
        />
      )}
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
            <h1
              id="hero-heading"
              className="mt-4 max-w-[18ch] font-sans text-[clamp(2.35rem,4.2vw,4rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground"
            >
              We build useful products, and help you build yours.
            </h1>
            <p className="mt-4 max-w-[58ch] font-sans text-[16px] leading-relaxed text-neutral-300 md:text-[17px]">
              Anvik Labs is a design and engineering studio in India. We own
              Designers Room, and design and build websites, web apps and AI
              tools for startups and small businesses.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#featured-product"
                className="inline-flex min-h-11 items-center justify-center rounded-[2px] bg-accent px-5 font-sans text-[15px] font-medium text-on-accent transition-colors hover:bg-accent-strong"
              >
                See our products
              </a>
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-[2px] border border-white/20 px-5 font-sans text-[15px] font-medium text-foreground transition-colors hover:border-white/40 hover:bg-white/5"
              >
                Work with us
              </Link>
            </div>
          </div>


        </div>

        <div className="flex w-full justify-end lg:col-span-5 lg:-mt-2 xl:col-span-5">
          <HeroMedia />
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
