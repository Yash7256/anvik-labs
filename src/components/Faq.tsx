"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { createMaskedText, MOTION } from "@/lib/motion";

type FaqItem = {
  q: string;
  a: string;
};

export const homeFaqData: FaqItem[] = [
  {
    q: "What does Anvik Labs do?",
    a: "Anvik Labs is an independent product design and engineering studio based in India and working with teams worldwide. We design digital experiences, build web products, and explore practical AI solutions for clients, while also building our own independent products.",
  },
  {
    q: "What services does Anvik Labs offer?",
    a: "We offer product design, web development, AI solutions, and website maintenance. Most work combines thoughtful design with careful engineering.",
  },
  {
    q: "Do you work with clients outside India?",
    a: "Yes. Anvik Labs is based in India and works with teams worldwide through video calls, chat, and email.",
  },
  {
    q: "Do you build your own products?",
    a: "Yes. Alongside client work, we build and experiment with independent products. That hands-on product work informs how we design and engineer for clients.",
  },
];

export default function Faq({
  items = homeFaqData,
  metaLabel = "FAQ / 007",
  metaTitle = "Common questions about Anvik Labs",
  initialVisibleCount,
}: {
  items?: FaqItem[];
  metaLabel?: string;
  metaTitle?: string;
  initialVisibleCount?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);
  const visibleCount = initialVisibleCount
    ? showAll
      ? items.length
      : Math.min(initialVisibleCount, items.length)
    : items.length;
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
      className="py-20 md:py-28 lg:py-36"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 pb-4 font-mono text-[12px] uppercase tracking-[0.12em] text-muted md:mb-12">
        <span className="text-muted">{metaLabel}</span>
        <span>{metaTitle}</span>
      </div>

      <div className="flex flex-col items-start justify-between gap-6 pb-10 lg:flex-row lg:items-end">
        <h2
          ref={headingRef}
          id="faq-heading"
          aria-label="Common questions about Anvik Labs"
          className="font-display text-[clamp(2.5rem,6vw,5rem)] font-extralight leading-[0.9] tracking-[-0.055em] text-foreground"
        >
          Questions.
        </h2>
        <p className="max-w-[44ch] font-sans text-[12px] leading-[1.65] text-muted md:text-[13px]">
          The practical details, before we begin. If something is missing, ask us
          directly.
        </p>
      </div>

      <div id="faq-list" className="mt-6">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;

          return (
            <div key={item.q} hidden={index >= visibleCount} className="py-5 md:py-6">
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
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border border-border font-mono text-[14px] transition-transform duration-200 ${
                    isOpen
                      ? "rotate-45 border-accent bg-accent text-on-accent"
                      : "text-muted"
                  }`}
                >
                  +
                </span>
              </button>

              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
                style={{ pointerEvents: isOpen ? "auto" : "none" }}
              >
                <p className="max-w-3xl pb-2 pl-12 pr-4 pt-3 font-sans text-[14px] leading-relaxed text-muted md:pl-16 md:text-[15px]">
                  {item.a}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>

      {initialVisibleCount !== undefined && items.length > initialVisibleCount && (
        <div className="mt-8 flex">
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            aria-expanded={showAll}
            aria-controls="faq-list"
            aria-label={showAll ? "Show fewer questions" : `Show all ${items.length} questions`}
            className="border-b border-border pb-1 font-mono text-[12px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-foreground focus-visible:border-accent focus-visible:text-foreground focus-visible:outline-none"
          >
            {showAll ? "Show less" : "Show more"}
            <span aria-hidden="true" className="ml-2 inline-block">
              {showAll ? "−" : "+"}
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
