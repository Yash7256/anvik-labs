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
  plain = false,
  neutral = false,
  showMeta = true,
  showIntro = true,
  headingReveal = "scroll",
}: {
  items?: FaqItem[];
  metaLabel?: string;
  metaTitle?: string;
  initialVisibleCount?: number;
  plain?: boolean;
  neutral?: boolean;
  showMeta?: boolean;
  showIntro?: boolean;
  headingReveal?: "scroll" | "static";
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (reduceMotion || headingReveal === "static" || !headingRef.current) return;
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
    {
      scope: rootRef,
      dependencies: [reduceMotion, headingReveal],
      revertOnUpdate: true,
    },
  );

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={rootRef}
      id="faq"
      aria-labelledby="faq-heading"
      className={`faq-section${plain ? " faq-section--premium" : ""}${neutral ? " faq-section--neutral" : ""} py-20 md:py-28 lg:py-36`}
    >
      {showMeta && (
        <div className="faq-meta">
          <span>{metaLabel}</span>
          <span>{metaTitle}</span>
        </div>
      )}

      <div className={`faq-header${showIntro ? "" : " faq-header--compact"}`}>
        <h2
          ref={headingRef}
          id="faq-heading"
          aria-label="Common questions about Anvik Labs"
          className={plain
            ? "faq-heading font-display text-[clamp(30px,3.75vw,50px)] font-medium leading-[0.95] tracking-[-0.045em]"
            : "faq-heading font-display text-[clamp(3.5rem,11vw,10rem)] font-extralight leading-[0.82] tracking-[-0.055em] text-foreground"}
        >
          Questions.
        </h2>
        {showIntro && (
          <p className="faq-intro max-w-[44ch] font-sans text-[14px] leading-[1.65] md:text-[15px]">
            The practical details, before we begin. If something is missing, ask us
            directly.
          </p>
        )}
      </div>

      <div id="faq-list" className="faq-list mt-8 md:mt-10">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;
          const isVisible = !initialVisibleCount || showAll || index < initialVisibleCount;
          const isRevealed = showAll && initialVisibleCount !== undefined && index >= initialVisibleCount;

          return (
            <div
              key={item.q}
              hidden={!isVisible}
              className={`faq-row${isOpen ? " faq-row--open" : ""}${isRevealed ? " faq-row--reveal" : ""}`}
              style={isRevealed
                ? { animationDelay: `${Math.min(index - (initialVisibleCount ?? 0), 6) * 35}ms` }
                : undefined}
            >
              <button
                id={buttonId}
                type="button"
                onClick={() => toggle(index)}
                className="faq-question group flex w-full items-start justify-between gap-6 text-left"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className={`faq-question__text font-sans font-medium ${plain
                  ? "text-[16px] md:text-[18px]"
                  : "text-[17px] md:text-[20px]"}`}
                >
                  {item.q}
                </span>

                <span aria-hidden="true" className="faq-indicator">
                  <span className="faq-indicator__line faq-indicator__line--horizontal" />
                  <span className="faq-indicator__line faq-indicator__line--vertical" />
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
                className="faq-panel overflow-hidden"
                style={{ pointerEvents: isOpen ? "auto" : "none" }}
              >
                <p className="faq-answer font-sans text-[14px] leading-[1.7] md:text-[15px]">
                  {item.a}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>

      {initialVisibleCount !== undefined && items.length > initialVisibleCount && (
        <div className="faq-more-wrap mt-8 flex justify-center md:mt-10">
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            aria-expanded={showAll}
            aria-controls="faq-list"
            aria-label={showAll ? "Show fewer questions" : `Show all ${items.length} questions`}
            className={`faq-more inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em]${showAll ? " faq-more--open" : ""}`}
          >
            <span>{showAll ? "Show less" : "Show more"}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="faq-more__icon h-3.5 w-3.5"
            >
              <path d="M8 2v12M3 7l5 5 5-5" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
