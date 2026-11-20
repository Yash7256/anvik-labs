"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { primaryCtaClass } from "@/lib/cta";
import { site } from "@/lib/site";

const quickLinks = [
  { label: "Works", href: "/works" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = document.getElementById("mobile-navigation");
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-background/80 shadow-[0_10px_30px_-18px_rgba(23,23,23,0.35)] backdrop-blur-xl backdrop-saturate-150">
      <div className="w-full px-10 sm:px-[12vw] lg:px-[16vw] xl:px-[18vw]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex min-h-[var(--header-height)] items-center justify-between py-0 text-[14px] leading-snug md:text-[15px]"
        >
          <div className="flex flex-col">
            <Link
              to="/"
              aria-label="Anvik Labs home"
              className="inline-flex items-center transition-opacity duration-200 hover:opacity-70"
            >
              <img
                src="/logo.svg"
                alt="Anvik Labs"
                width={1010}
                height={118}
                className="h-5 w-auto [filter:brightness(0)_invert(0.09)] md:h-6"
              />
            </Link>
          </div>

          <nav aria-label="Primary navigation" className="hidden items-center gap-10 md:flex lg:gap-14">
            <div className="flex items-center gap-6 font-sans text-[16px] font-medium text-foreground">
              {quickLinks.slice(0, 2).map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              to="/contact"
              className={primaryCtaClass}
            >
              Let's talk
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            ref={menuButtonRef}
            className="inline-flex min-h-11 items-center font-mono text-[13px] uppercase tracking-[0.04em] text-foreground transition-opacity duration-200 hover:opacity-60 md:hidden"
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            [ MENU ]
          </button>
        </motion.div>
      </div>
      </header>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open && (
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed inset-0 z-50 flex flex-col bg-background px-10 py-5 sm:px-[12vw] md:hidden"
          >
            <div className="flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                aria-label="Anvik Labs home"
                className="inline-flex items-center"
              >
                <img
                  src="/logo.svg"
                  alt="Anvik Labs"
                  width={1010}
                  height={118}
                  className="h-6 w-auto [filter:brightness(0)_invert(0.09)]"
                />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                ref={closeButtonRef}
                className="inline-flex min-h-11 items-center font-mono text-[13px] uppercase tracking-[0.04em] text-foreground transition-opacity duration-200 hover:opacity-60"
                aria-label="Close navigation menu"
              >
                [ CLOSE ]
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="mt-12 flex flex-col gap-5">
              <span className="font-mono text-[13px] uppercase tracking-[0.04em] text-muted">
                Quick links
              </span>
              {quickLinks.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.22,
                    delay: reduceMotion ? 0 : 0.04 + index * 0.012,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-11 items-center font-sans text-[24px] font-medium tracking-tight text-foreground transition-opacity duration-200 hover:opacity-60"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-1 pt-6 text-[13px]">
              <span className="font-sans font-medium text-foreground">
                {site.studioTagline}
              </span>
              <span className="font-sans text-muted">
                Based in India, working globally
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
