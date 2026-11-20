"use client";

import { useRef } from "react";
import { Link } from "react-router";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { scrollToTop } from "@/lib/smooth-scroll";
import { site } from "@/lib/site";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/works" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (reduceMotion || !taglineRef.current) return;

      gsap.from("[data-footer-word]", {
        opacity: 0,
        y: 14,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: taglineRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: rootRef, dependencies: [reduceMotion], revertOnUpdate: true },
  );

  return (
    <footer
      ref={rootRef}
      className="-mx-4 border-t border-black/10 sm:-mx-[4vw] lg:-mx-[5vw] xl:-mx-[6vw]"
    >
      <div className="container-page py-14 md:py-20">
        <div className="flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
          <span>{site.studioTagline}</span>
          <span>India / Global</span>
        </div>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[minmax(0,1fr)_320px] md:gap-10 lg:gap-16">
          <div>
            <p
              ref={taglineRef}
              className="max-w-[16ch] font-sans text-[clamp(2rem,5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.05em] text-foreground"
            >
              <span data-footer-word className="inline-block">Where&nbsp;</span>
              <span data-footer-word className="inline-block">ideas&nbsp;</span>
              <span data-footer-word className="inline-block">become&nbsp;</span>
              <span data-footer-word className="inline-block text-accent">
                real products.
              </span>
            </p>
            <p className="mt-6 max-w-[42ch] text-[14px] leading-relaxed text-muted md:text-[15px]">
              We design, develop, and launch digital products for ambitious ideas.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-inverse px-6 py-3 font-sans text-[15px] font-medium tracking-tight text-inverse-foreground shadow-lg transition-colors hover:bg-black/80"
            >
              Start a conversation
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10">
            <nav aria-label="Footer navigation">
              <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
                Explore
              </p>
              <div className="flex flex-col items-start gap-3 font-sans text-[14px] text-muted">
                {footerLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="transition-colors duration-200 hover:text-accent"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div>
              <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
                Contact
              </p>
              <div className="flex flex-col items-start gap-3 font-sans text-[14px] text-muted">
                <a
                  href={`mailto:${site.email}`}
                  className="break-all transition-colors duration-200 hover:text-accent"
                >
                  {site.email}
                </a>
                <span className="text-muted">Product design + engineering</span>
                <span className="text-muted">Remote, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-black/10 pt-5 md:mt-24">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <Link to="/" aria-label="Anvik Labs home" className="inline-flex">
              <img
                src="/logo.svg"
                alt="Anvik Labs"
                width={1010}
                height={118}
                className="h-8 w-auto md:h-10"
              />
            </Link>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono font-medium! text-[12px] uppercase tracking-[0.12em] text-muted">
              <span>© 2026 Anvik Labs</span>
              <span>All rights reserved</span>
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex min-h-11 items-center text-muted transition-colors duration-200 hover:text-accent"
              >
                Back to top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
