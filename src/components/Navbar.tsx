"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import ContactDialog from "@/components/ContactDialog";
import { useMagnetic } from "@/lib/motion";
import { site } from "@/lib/site";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/works" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
];

function DiagonalArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  );
}

function TalkCta({ onClick }: { onClick?: () => void }) {
  const ctaRef = useMagnetic<HTMLButtonElement>(0.18);

  return (
    <button
      ref={ctaRef}
      type="button"
      onClick={onClick}
      data-cursor="talk"
      className="nav-cta group inline-flex h-11 items-center gap-4 rounded-full pl-6 pr-1 font-sans text-[15px] font-semibold tracking-[-0.01em] md:h-12 md:pl-7"
    >
      Let&apos;s Talk
      <span className="nav-cta__arrow inline-flex h-9 w-9 items-center justify-center rounded-full">
        <DiagonalArrow className="h-4 w-4" />
      </span>
    </button>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/works") return pathname.startsWith("/works");
  return false;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();
  const location = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navLineRef = useRef<HTMLSpanElement>(null);

  const syncNavLine = useCallback(
    (target?: HTMLElement | null) => {
      const nav = navRef.current;
      const line = navLineRef.current;
      if (!nav || !line) return;

      const item =
        target ??
        nav.querySelector<HTMLElement>('[data-nav-item="active"]') ??
        null;
      if (!item) {
        line.style.opacity = "0";
        line.style.setProperty("--nav-line-scale", "0");
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const rect = item.getBoundingClientRect();
      line.style.opacity = "1";
      line.style.width = `${rect.width}px`;
      line.style.setProperty("--nav-line-x", `${rect.left - navRect.left}px`);
      line.style.setProperty("--nav-line-scale", "1");
    },
    [],
  );

  const moveNavLine = useCallback(
    (target: HTMLElement) => {
      syncNavLine(target);
    },
    [syncNavLine],
  );

  const resetNavLine = useCallback(() => {
    syncNavLine();
  }, [syncNavLine]);

  useEffect(() => {
    syncNavLine();
    const onResize = () => syncNavLine();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [location.pathname, syncNavLine]);

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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background">
        <div className="px-4 sm:px-[4vw] lg:px-[5vw] xl:px-[6vw]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="grid h-[var(--header-height)] grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]"
          >
            <Link
              to="/"
              aria-label="Anvik Labs home"
              className="inline-flex w-fit items-center transition-opacity duration-200 hover:opacity-70"
            >
              <img
                src="/logo.svg"
                alt="Anvik Labs"
                width={1010}
                height={118}
                className="logo-mark h-6 w-auto md:h-7"
              />
            </Link>

            <div className="hidden justify-center md:flex">
              <ThemeToggle />
            </div>

            <nav
              ref={navRef}
              aria-label="Primary navigation"
              className="relative hidden items-center justify-end gap-8 md:flex lg:gap-10"
              onPointerLeave={resetNavLine}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  resetNavLine();
                }
              }}
            >
              {navLinks.map((item) => {
                const active = isActive(location.pathname, item.href);
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    data-nav-item={active ? "active" : undefined}
                    aria-current={active ? "page" : undefined}
                    onPointerEnter={(event) => moveNavLine(event.currentTarget)}
                    onFocus={(event) => moveNavLine(event.currentTarget)}
                    className={`relative py-2 font-sans text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 hover:text-foreground lg:text-[16px] ${
                      active ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <span
                aria-hidden="true"
                ref={navLineRef}
                className="nav-line pointer-events-none absolute bottom-1 left-0 h-px bg-accent"
                style={{ width: 1, opacity: 0 }}
              />
              <TalkCta onClick={() => setContactOpen(true)} />
            </nav>

            <button
              type="button"
              onClick={() => setOpen(true)}
              ref={menuButtonRef}
              className="inline-flex min-h-11 items-center justify-self-end font-mono text-[13px] uppercase tracking-[0.08em] text-foreground transition-opacity duration-200 hover:opacity-60 md:hidden"
              aria-label="Open navigation menu"
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              [ Menu ]
            </button>
          </motion.div>
        </div>
      </header>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
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
                  className="fixed inset-0 z-50 flex flex-col bg-background px-4 py-5 sm:px-[4vw] md:hidden"
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
                        className="logo-mark h-7 w-auto"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      ref={closeButtonRef}
                      className="inline-flex min-h-11 items-center font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-opacity duration-200 hover:opacity-60"
                      aria-label="Close navigation menu"
                    >
                      [ Close ]
                    </button>
                  </div>

                  <nav
                    aria-label="Mobile navigation"
                    className="mt-12 flex flex-col gap-2"
                  >
                    {navLinks.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.22,
                          delay: reduceMotion ? 0 : 0.04 + index * 0.03,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <Link
                          to={item.href}
                          onClick={() => setOpen(false)}
                          className="inline-flex min-h-12 items-center font-sans text-[34px] font-medium tracking-[-0.04em] text-foreground transition-opacity duration-200 hover:opacity-60"
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>

                  <div className="mt-auto flex flex-col items-start gap-6 pb-4 pt-8">
                    <ThemeToggle />
                    <TalkCta
                      onClick={() => {
                        setOpen(false);
                        setContactOpen(true);
                      }}
                    />
                    <div className="flex flex-col gap-1 text-[13px]">
                      <span className="font-sans font-medium text-foreground">
                        {site.studioTagline}
                      </span>
                      <span className="font-sans text-muted">
                        Based in India, working globally
                      </span>
                    </div>
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
