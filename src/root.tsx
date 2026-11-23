import { useEffect, useRef, useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  type MetaFunction,
} from "react-router";
import Background from "@/components/Background";
import ContactDialog from "@/components/ContactDialog";
import GlobalCursor from "@/components/GlobalCursor";
import MotionRuntime from "@/components/MotionRuntime";
import PostHogInit from "@/components/PostHogInit";
import {
  destroySmoothScroll,
  initSmoothScroll,
  scrollToElement,
} from "@/lib/smooth-scroll";
import { createMeta, organizationId, site, websiteId } from "@/lib/site";
import "./app/globals.css";

const themeInitScript = `try{var t=localStorage.getItem("anvik-theme");if(t!=="light"&&t!=="dark")t="light";var r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t;}catch(e){document.documentElement.dataset.theme="light";}`;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: site.name,
  url: site.url,
  logo: {
    "@type": "ImageObject",
    url: `${site.url}${site.logo}`,
    width: 512,
    height: 512,
  },
  image: `${site.url}${site.ogImage}`,
  description: site.description,
  areaServed: site.areaServed,
  email: site.email,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: site.email,
    areaServed: site.areaServed,
    availableLanguage: ["en"],
  },
  ...(site.sameAs.length > 0 ? { sameAs: site.sameAs } : {}),
  ...(site.foundingDate ? { foundingDate: site.foundingDate } : {}),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  url: site.url,
  name: site.name,
  description: site.description,
  inLanguage: "en-IN",
  publisher: { "@id": organizationId },
};

export const meta: MetaFunction = () =>
  createMeta({ description: site.description });

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="google-site-verification"
          content="YKwDO53XArYWQP27b8PIS4l1ALXtKu3OeDreuFCzuN4"
        />
        <meta name="theme-color" content="#f5f5f5" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#080808" media="(prefers-color-scheme: dark)" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="preload" as="image" href="/assets/logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-foreground font-sans flex min-h-full flex-col antialiased">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Background />
        <div className="w-full flex flex-1 flex-col px-4 sm:px-[4vw] lg:px-[5vw] xl:px-[6vw]">
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function SmoothScroll() {
  useEffect(() => {
    initSmoothScroll();
    return destroySmoothScroll;
  }, []);

  return null;
}

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = decodeURIComponent(location.hash.slice(1));
    const timer = window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;
      const headerHeight =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-height",
          ),
        ) || 0;
      scrollToElement(target, -(headerHeight + 16));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return null;
}

function AnimatedOutlet() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    previousPathRef.current = location.pathname;
  }, [location.pathname]);

  if (!hydrated) return <Outlet />;

  const shouldAnimate =
    location.pathname !== previousPathRef.current && !reduceMotion;

  return (
    <motion.div
      key={location.pathname}
      initial={shouldAnimate ? { opacity: 0, y: 4 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.18,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Outlet />
    </motion.div>
  );
}

function ContactDialogController() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      void import("@/lib/posthog.client").then(({ default: posthog }) => {
        posthog.capture("contact_dialog_opened");
      });
    };
    window.addEventListener("contact:open", onOpen as EventListener);
    return () => window.removeEventListener("contact:open", onOpen as EventListener);
  }, []);

  return <ContactDialog open={open} onClose={() => setOpen(false)} />;
}

export default function App() {
  return (
    <PostHogInit>
      <MotionConfig reducedMotion="user">
        <MotionRuntime />
        <GlobalCursor />
        <SmoothScroll />
        <ScrollToHash />
        <ContactDialogController />
        <AnimatedOutlet />
      </MotionConfig>
    </PostHogInit>
  );
}
