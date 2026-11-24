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
import { services } from "@/data/services";
import GlobalCursor from "@/components/GlobalCursor";
import MotionRuntime from "@/components/MotionRuntime";
import PostHogAnalytics from "@/components/PostHogAnalytics";
import {
  destroySmoothScroll,
  initSmoothScroll,
  scrollToElement,
} from "@/lib/smooth-scroll";
import { createMeta, organizationId, site, websiteId } from "@/lib/site";
import { searchVerification } from "@/lib/search-verification";
import criticalCss from "./app/critical.css?inline";
import globalCssUrl from "./app/globals.css?url";

const themeInitScript = `try{var t=localStorage.getItem("anvik-theme");if(t!=="light"&&t!=="dark")t="light";var r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t;}catch(e){document.documentElement.dataset.theme="light";}`;
const asyncCssScript = `(()=>{var l=document.createElement("link");l.rel="stylesheet";l.href=${JSON.stringify(globalCssUrl)};l.media="print";l.onload=function(){this.media="all";this.onload=null};document.head.appendChild(l);})()`;

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
  knowsAbout: services.map((service) => service.name),
  areaServed: site.areaServed,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: site.email,
    areaServed: site.areaServed,
    availableLanguage: ["en"],
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Anvik Labs services",
    itemListElement: services.map((service) => ({
      "@type": "Service",
      name: service.name,
      serviceType: service.serviceType,
      description: service.description,
      url: `${site.url}/services/${service.slug}`,
      areaServed: site.areaServed,
    })),
  },
  ...(site.sameAs.length > 0 ? { sameAs: site.sameAs } : {}),
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
        {searchVerification.google ? (
          <meta name="google-site-verification" content={searchVerification.google} />
        ) : null}
        {searchVerification.bing ? (
          <meta name="msvalidate.01" content={searchVerification.bing} />
        ) : null}
        {searchVerification.yandex ? (
          <meta name="yandex-verification" content={searchVerification.yandex} />
        ) : null}
        {searchVerification.baidu ? (
          <meta name="baidu-site-verification" content={searchVerification.baidu} />
        ) : null}
        {searchVerification.naver ? (
          <meta name="naver-site-verification" content={searchVerification.naver} />
        ) : null}
        {searchVerification.pinterest ? (
          <meta name="p:domain_verify" content={searchVerification.pinterest} />
        ) : null}
        <meta name="theme-color" content="#f5f5f5" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#080808" media="(prefers-color-scheme: dark)" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link
          rel="alternate"
          type="text/plain"
          href={`${site.url}/llms.txt`}
          title="Anvik Labs LLM overview"
        />
        <link rel="preload" as="image" href="/assets/logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
        {["geist-latin", "space-grotesk-latin", "geist-mono-latin"].map((font) => (
          <link
            key={font}
            rel="preload"
            href={`/fonts/${font}.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
        <link rel="preload" href={globalCssUrl} as="style" />
        <script dangerouslySetInnerHTML={{ __html: asyncCssScript }} />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<link rel="stylesheet" href="${globalCssUrl}" />`,
          }}
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
        <div className="site-shell w-full flex flex-1 flex-col px-4 sm:px-[4vw] lg:px-[5vw] xl:px-[6vw]">
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
    const onOpen = () => setOpen(true);
    window.addEventListener("contact:open", onOpen as EventListener);
    return () => window.removeEventListener("contact:open", onOpen as EventListener);
  }, []);

  return <ContactDialog open={open} onClose={() => setOpen(false)} />;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <PostHogAnalytics />
      <MotionRuntime />
      <GlobalCursor />
      <SmoothScroll />
      <ScrollToHash />
      <ContactDialogController />
      <AnimatedOutlet />
    </MotionConfig>
  );
}
