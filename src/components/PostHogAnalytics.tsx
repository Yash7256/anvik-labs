import { useEffect } from "react";
import { useLocation } from "react-router";

let initialized = false;

export default function PostHogAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const key = import.meta.env.VITE_POSTHOG_KEY;
    if (!key || typeof window === "undefined") return;

    let cancelled = false;
    (async () => {
      const { default: posthog } = await import("posthog-js");
      if (cancelled) return;
      if (!initialized) {
        posthog.init(key, {
          api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
          person_profiles: "identified_only",
          capture_pageview: false,
          capture_pageleave: true,
        });
        initialized = true;
      }
      posthog.capture("$pageview", {
        $current_url: window.location.href,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, location.hash]);

  return null;
}
