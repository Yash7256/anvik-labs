"use client";

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { supportsWebGL } from "./support";
import type { FeaturedPointer } from "./FeaturedSurface";

const FeaturedSurface = lazy(() => import("./FeaturedSurface"));

type FeaturedImageProps = {
  src: string;
  pointerRef: MutableRefObject<FeaturedPointer>;
  scrollRef: MutableRefObject<number>;
};

export default function FeaturedImage({
  src,
  pointerRef,
  scrollRef,
}: FeaturedImageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!supportsWebGL() || motion.matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "240px 0px" },
    );

    if (rootRef.current) observer.observe(rootRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`featured-surface${ready ? " featured-surface--ready" : ""}`}
    >
      <Suspense fallback={null}>
        {active ? (
          <FeaturedSurface
            src={src}
            pointerRef={pointerRef}
            scrollRef={scrollRef}
            visible={active}
            onReady={handleReady}
          />
        ) : null}
      </Suspense>
    </div>
  );
}
