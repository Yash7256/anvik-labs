import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION } from "@/lib/motion";
import { site } from "@/lib/site";
import ContactForm from "./ContactForm";

export default function Contact() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (reduceMotion || !headingRef.current) return;
      const split = createMaskedText(headingRef.current, "chars");
      const chars = split.chars.length ? split.chars : split.words;
      gsap.set(chars, {
        yPercent: 112,
        rotationX: 6,
        opacity: 0,
        transformPerspective: 900,
        transformOrigin: "50% 100%",
      });
      gsap.to(chars, {
        yPercent: 0,
        rotationX: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.045,
        ease: MOTION.ease,
        force3D: true,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          end: "+=55%",
          scrub: 1,
        },
      });
      return () => split.revert();
    },
    { scope: rootRef, dependencies: [reduceMotion], revertOnUpdate: true },
  );

  return (
    <section
      ref={rootRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="pb-16 pt-10 md:pb-24 md:pt-14"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 pb-4 font-mono text-[12px] uppercase tracking-[0.12em] text-muted md:mb-12">
        <span className="text-muted">Inquiry / 006</span>
        <span>{site.studioTagline} / India</span>
      </div>

      <div className="flex flex-col justify-between gap-4 pb-8 md:flex-row md:items-end">
        <h1
          ref={headingRef}
          id="contact-heading"
          className="font-display text-[clamp(4.5rem,16vw,15rem)] font-extralight leading-[0.8] tracking-[-0.06em] text-foreground"
        >
          Start a project.
        </h1>
        <p className="max-w-[32ch] font-mono text-[12px] uppercase leading-relaxed tracking-[0.12em] text-muted">
          Available for new product design and engineering work.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-10 lg:col-span-5">
          <div>
            <span className="mb-2 block font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
              Direct email
            </span>
            <a
              href={`mailto:${site.email}`}
                data-cursor="email"
                className="break-all font-sans text-[22px] font-medium text-foreground underline decoration-white/20 underline-offset-8 transition-colors hover:text-accent md:text-[28px]"
            >
              {site.email}
            </a>
          </div>

          <div>
            <span className="mb-2 block font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
              Studio
            </span>
            <p className="max-w-[34ch] font-sans text-[15px] leading-relaxed text-muted">
              Based in India, working with teams across time zones. Remote-first,
              with calls scheduled around your working day.
            </p>
          </div>

          <div className="pt-6">
            <span className="mb-2 block font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
              What to include
            </span>
            <p className="max-w-[34ch] font-sans text-[15px] leading-relaxed text-muted">
              A short description of the product, who it is for, what stage it is
              at, and any deadline you are working towards.
            </p>
          </div>
        </div>

        <div className="border border-black/10 bg-black/[0.02] p-6 md:p-8 lg:col-span-7">
          <ContactForm idPrefix="contact-page" />
        </div>
      </div>
    </section>
  );
}
