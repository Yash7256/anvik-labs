import { Link } from "react-router";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const capabilities = [
  "Product design",
  "Design systems",
  "Web development",
  "AI solutions",
];

function CapabilitiesMarquee() {
  const reduceMotion = useReducedMotion();
  const marqueeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(marqueeRef, { amount: 0.1 });
  const loop = [...capabilities, ...capabilities];

  if (reduceMotion) {
    return (
      <ul className="flex flex-wrap gap-x-5 gap-y-2 border-y border-white/10 py-5 font-sans text-[clamp(1.35rem,3.25vw,2.75rem)] font-medium leading-none tracking-[-0.04em] text-neutral-200">
        {capabilities.map((capability) => (
          <li key={capability}>{capability}</li>
        ))}
      </ul>
    );
  }

  return (
    <div
      ref={marqueeRef}
      className="relative w-full overflow-hidden border-y border-white/10 py-5 md:py-7"
    >
      <ul className="sr-only">
        {capabilities.map((capability) => (
          <li key={capability}>{capability}</li>
        ))}
      </ul>

      <motion.div
        aria-hidden="true"
        animate={isInView ? { x: ["0%", "-50%"] } : { x: "0%" }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="flex w-max whitespace-nowrap font-sans text-[clamp(1.75rem,4.6vw,4.25rem)] font-medium leading-none tracking-[-0.045em] text-neutral-200 will-change-transform"
      >
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {loop.map((capability, index) => (
              <span key={index} className="flex items-center">
                <span className="px-5 md:px-8">{capability}</span>
                <span className="h-2 w-2 rounded-full bg-accent/70" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[14%] bg-gradient-to-r from-background via-background/90 to-transparent backdrop-blur-[3px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[14%] bg-gradient-to-l from-background via-background/90 to-transparent backdrop-blur-[3px]"
      />
    </div>
  );
}

export default function FeaturedProduct() {
  return (
    <section
      id="featured-product"
      aria-labelledby="featured-product-title"
      className="border-t border-white/10 py-12 md:py-20 lg:py-24"
    >
      <div className="mb-10 md:mb-14 lg:mb-16">
        <CapabilitiesMarquee />
      </div>

      <div className="grid grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <div className="w-full lg:col-span-6">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 bg-light-surface">
            <video
              src="/designersroom.mp4"
              autoPlay
              loop
              muted
              playsInline
              aria-label="Designers Room product showcase"
              className="h-full w-full object-contain object-center"
            />
          </div>
        </div>

        <div className="flex flex-col py-1 md:py-2 lg:col-span-6">
          <h2
            id="featured-product-title"
            className="mt-3 flex items-center gap-3 font-sans text-[clamp(2.1rem,4.4vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground md:gap-5"
          >
            <img
              src="/designersroom.svg"
              alt=""
              aria-hidden="true"
              width={64}
              height={64}
              className="h-[0.95em] w-auto shrink-0"
            />
            <span>Designers Room</span>
          </h2>

          <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.7] text-neutral-300 md:mt-6 md:text-[17px] xl:text-[18px]">
            <span>Where</span><span className="text-accent"> designers </span>level up roadmaps, challenges and a community that builds with you.
          </p>

          <div className="mt-8 flex justify-center md:justify-start md:mt-10">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-sans text-[15px] font-semibold tracking-tight text-black shadow-lg transition-colors hover:bg-neutral-200"
            >
              Explore Designers Room
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
