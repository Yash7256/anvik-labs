"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION } from "@/lib/motion";

type FaqItem = {
  q: string;
  a: string;
};

const faqData: FaqItem[] = [
  {
    q: "What services do you offer?",
    a: "We work across product design, design systems, web development, AI solutions and ongoing website care. Most engagements combine design and front-end engineering.",
  },
  {
    q: "How does a project start?",
    a: "It starts with a short conversation about the product, the people using it and the outcome you need. If the fit is right, we agree on scope, timing and the first milestone before any work begins.",
  },
  {
    q: "What is a typical turnaround?",
    a: "A focused site or product slice usually takes two to four weeks. Larger product work runs in milestones over six to eight weeks. We agree on the first deliverable up front rather than promising a date for everything.",
  },
  {
    q: "Can you work with an existing team?",
    a: "Yes. We can join an existing product team, work alongside your designers or engineers, or take a defined slice of the product from brief to launch.",
  },
  {
    q: "Do you handle both design and build?",
    a: "Yes. The person designing the interface works with the person building it from day one. That removes the handoff gap where intent usually gets lost.",
  },
  {
    q: "How do we communicate during a project?",
    a: "We keep a shared written record, send regular progress notes and hold a weekly call. You will always know what is in progress, what is blocked and what comes next.",
  },
];

export default function Faq({
  items = faqData,
  metaLabel = "Notes / 007",
  metaTitle = "Clarifications",
}: {
  items?: FaqItem[];
  metaLabel?: string;
  metaTitle?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={rootRef}
      id="faq"
      aria-labelledby="faq-heading"
      className="px-4 pt-16 sm:px-[4vw] md:px-8 md:pt-24 lg:px-12"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 pb-4 font-mono text-[12px] uppercase tracking-[0.12em] text-muted md:mb-12">
        <span className="text-muted">{metaLabel}</span>
        <span>{metaTitle}</span>
      </div>

      <div className="flex flex-col items-start justify-between gap-6 pb-10 lg:flex-row lg:items-end">
        <h2
          ref={headingRef}
          id="faq-heading"
          className="font-display text-[clamp(4.5rem,16vw,15rem)] font-extralight leading-[0.8] tracking-[-0.06em] text-foreground"
        >
          Questions.
        </h2>
        <p className="max-w-md font-sans text-[14px] leading-relaxed text-muted md:text-[15px]">
          The practical details, before we begin. If something is missing, ask us
          directly.
        </p>
      </div>

      <div className="mt-6">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;

          return (
            <div key={item.q} className="py-5 md:py-6">
              <button
                id={buttonId}
                type="button"
                onClick={() => toggle(index)}
                className="group flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <div className="flex items-center gap-4 md:gap-8">
                  <span className="w-8 font-mono text-[12px] text-muted">
                    [0{index + 1}]
                  </span>
                  <span className="font-sans text-[17px] font-medium text-foreground transition-colors group-hover:text-accent md:text-[20px]">
                    {item.q}
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border border-black/15 font-mono text-[14px] transition-transform duration-200 ${
                    isOpen
                      ? "rotate-45 border-accent bg-accent text-on-accent"
                      : "text-muted"
                  }`}
                >
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={reduceMotion ? { height: "auto", opacity: 1 } : { height: "auto", opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-3xl pb-2 pl-12 pr-4 pt-3 font-sans text-[14px] leading-relaxed text-muted md:pl-16 md:text-[15px]">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
