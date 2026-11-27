"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Theme = "light" | "dark";

const STORAGE_KEY = "anvik-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "light" || current === "dark") {
      setTheme(current);
    }
  }, []);

  function applyTheme(next: Theme) {
    const commit = () => {
      setTheme(next);
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;

      const meta = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]',
      );
      if (meta) meta.content = next === "dark" ? "#101010" : "#f5f5f5";

      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        setTheme(next);
      }
    };

    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };
    if (doc.startViewTransition && !reduceMotion) doc.startViewTransition(commit);
    else commit();
  }

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="relative grid h-9 w-[118px] grid-cols-2 rounded-full border border-border bg-foreground/[0.035] p-[2px]"
    >
      <span
        aria-hidden="true"
        className={`absolute bottom-[2px] left-[2px] top-[2px] w-[calc(50%-2px)] rounded-full bg-foreground shadow-[0_1px_4px_-2px_rgba(23,23,23,0.35)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          theme === "dark" ? "translate-x-full" : "translate-x-0"
        }`}
      />
      {(["light", "dark"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={theme === option}
          onClick={() => applyTheme(option)}
          className={`relative z-10 inline-flex min-h-0 items-center justify-center rounded-full font-sans text-[12px] font-semibold capitalize tracking-[-0.01em] transition-colors duration-300 ${
            theme === option ? "text-background" : "text-muted hover:text-foreground"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
