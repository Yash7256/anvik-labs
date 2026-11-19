"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";

const quickLinks = [
  { label: "Works", href: "/works" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
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
      <header className="fixed inset-x-0 top-0 z-50 bg-background/85 backdrop-blur-md">
      <div className="w-full px-4 sm:px-[4vw] lg:px-[5vw] xl:px-[6vw]">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex min-h-[var(--header-height)] items-center justify-between py-0 text-[13px] leading-snug md:text-[14px]"
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
                className="h-5 w-auto md:h-6"
              />
            </Link>
          </div>

          <nav aria-label="Primary navigation" className="hidden items-center gap-5 md:flex">
            <div className="flex items-center gap-1.5 font-sans text-muted">
              {quickLinks.slice(0, 2).map((item, index) => (
                <span key={item.label} className="inline-flex items-center gap-1.5">
                  <Link
                    to={item.href}
                    className="underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
                  >
                    {item.label}
                  </Link>
                  {index === 0 && (
                    <span aria-hidden="true" className="font-normal text-muted">
                      ,
                    </span>
                  )}
                </span>
              ))}
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 font-sans text-[13px] font-semibold tracking-tight text-black transition-colors duration-200 hover:bg-neutral-200"
            >
              Let's talk
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            ref={menuButtonRef}
            className="inline-flex min-h-11 items-center font-mono text-[12px] font-semibold uppercase tracking-wider text-muted transition-opacity duration-200 hover:opacity-60 md:hidden"
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            [ MENU ]
          </button>
        </motion.div>
      </div>

      <div aria-hidden className="w-full px-4 sm:px-[4vw] lg:px-[5vw] xl:px-[6vw]">
        <div className="h-px w-full origin-bottom scale-y-50 bg-white/10" />
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-black px-4 py-5 sm:px-[4vw] md:hidden"
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
                  className="h-6 w-auto"
                />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                ref={closeButtonRef}
                className="inline-flex min-h-11 items-center font-mono text-[12px] font-semibold uppercase tracking-wider text-muted"
                aria-label="Close navigation menu"
              >
                [ CLOSE ]
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="mt-12 flex flex-col gap-5">
              <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                Quick links
              </span>
              {quickLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-11 items-center font-sans text-[22px] font-medium tracking-tight text-foreground transition-opacity duration-200 hover:opacity-60"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-6 text-[13px]">
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
