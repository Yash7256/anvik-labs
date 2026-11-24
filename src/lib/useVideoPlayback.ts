"use client";

import { useEffect, type RefObject } from "react";

/**
 * Keeps decorative videos off the main thread unless they are near the
 * viewport. Audio is muted at the call sites, so playback can start as soon as
 * the element is about to be seen.
 */
export function useVideoPlayback(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!(video instanceof HTMLVideoElement)) return;
    if (!enabled) {
      video.pause();
      return;
    }

    let nearViewport = false;
    let frame = 0;

    const sync = () => {
      frame = 0;

      if (!nearViewport || document.hidden) {
        if (!video.paused) video.pause();
        return;
      }

      if (video.paused) {
        const playback = video.play();
        if (playback && typeof playback.catch === "function") {
          playback.catch(() => {
            // Autoplay can be blocked while the tab is settling; the next
            // visibility or viewport change retries.
          });
        }
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(sync);
    };

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              nearViewport = entry.isIntersecting;
              schedule();
            },
            { rootMargin: "200px 0px", threshold: 0.01 },
          )
        : null;

    const rect = video.getBoundingClientRect();
    nearViewport = rect.bottom > -200 && rect.top < window.innerHeight + 200;

    if (observer) observer.observe(video);
    else nearViewport = true;

    document.addEventListener("visibilitychange", schedule);
    sync();

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      video.pause();
    };
  }, [videoRef, enabled]);
}
