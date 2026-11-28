import { Link } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import ScrollProgressLine from "@/components/ScrollProgressLine";
import type { Service } from "@/data/services";
import { primaryCtaClass } from "@/lib/cta";
import { createBreadcrumbJsonLd, createFaqJsonLd, createServiceJsonLd } from "@/lib/schema";
import { site } from "@/lib/site";
import { CardGrid2x2, Chips, GlanceCard, IncludedTiles, NumberedGrid, ProcessTimeline, ProofStrip, RelatedServices, SectionHeading, WhyAnvikLabs } from "@/components/service/sections";

export default function ServicePage({ service, index }: { service: Service; index: number }) {
  const plain = Boolean(service.plainSections);
  const usePremiumSections = plain && service.slug === "development";
  const stepGrid = service.process.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";
  const leadClass = usePremiumSections
    ? "max-w-[52ch] text-[14px] leading-[1.55] tracking-[-0.01em]"
    : service.leadVariant === "long"
      ? "max-w-[52ch] text-[clamp(1.25rem,1.9vw,1.5rem)] leading-[1.2] tracking-[-0.025em]"
      : "max-w-[28ch] text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.05] tracking-[-0.03em]";
  const heroSectionClass = plain
    ? "px-4 pb-8 pt-8 sm:px-[4vw] sm:pb-10 sm:pt-10 md:px-8 md:pb-12 md:pt-12 lg:px-12 lg:pb-16 lg:pt-14"
    : "px-4 py-8 sm:px-[4vw] sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-16";
  const includedSectionClass = plain
    ? "included-section px-4 py-12 sm:px-[4vw] sm:py-16 md:px-8 lg:px-12 lg:py-20"
    : "px-4 py-8 sm:px-[4vw] sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-16";

  return (
    <>
      <Navbar />
      <main id="main-content" data-premium-page={usePremiumSections ? "true" : undefined} className="flex flex-1 flex-col pt-[var(--header-height)]">
        <JsonLd data={createServiceJsonLd(service)} />
        <JsonLd data={createFaqJsonLd(service)} />
        <JsonLd
          data={createBreadcrumbJsonLd([
            { name: "Home", url: site.url },
            { name: "Services", url: `${site.url}/#services` },
            { name: service.name, url: `${site.url}/services/${service.slug}` },
          ])}
        />
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted sm:px-[4vw] md:px-8 lg:px-12"
        >
          <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/#services" className="transition-colors hover:text-foreground">Services</Link>
          <span aria-hidden="true">/</span>
          <span className="text-muted">{service.name}</span>
        </nav>

        <header className="px-4 py-8 sm:px-[4vw] sm:py-10 md:hidden">
          {plain ? (
            <p className="font-sans text-[12px] font-medium text-muted">{service.serviceType}</p>
          ) : (
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted">Service [{String(index + 1).padStart(2, "0")}]</p>
          )}
          <h1 className="-ml-6 mt-3 break-words font-display text-[clamp(2.5rem,11vw,4rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-foreground">{service.name}.</h1>
          <p className="mt-4 text-[14px] leading-relaxed text-foreground/70">{service.heroSubline}</p>
          <div className="mt-6 flex justify-center sm:justify-start">
            <Link to="/contact" className={`${primaryCtaClass} service-cta--quiet`}>
              Start a Project
            </Link>
          </div>
        </header>

        <div className="flex flex-1 flex-col md:flex-row">
          <aside className="hidden shrink-0 md:flex md:w-[42%] lg:w-[40%] xl:w-[38%]">
            <div className={`sticky top-[var(--header-height)] flex h-[calc(100svh-var(--header-height))] w-full flex-col px-[5vw] lg:px-[4vw] xl:px-[5vw] relative ${
              plain
                ? `pb-8 ${usePremiumSections ? "pt-[clamp(146px,22vh,238px)]" : "pt-6"}`
                : "justify-between py-12"
            }`}
            >
              {!usePremiumSections && (
                <ScrollProgressLine targetId="service-content" className="right-0 top-0 h-full" />
              )}
              {plain ? (
                <>
                  <Reveal delay={0.04} className="mt-4">
                    <div aria-hidden="true" className="-ml-6 font-display text-[clamp(36px,4.55vw,65px)] font-semibold leading-[0.92] tracking-[-0.052em] text-foreground">{service.name}.</div>
                    <p className="-ml-6 mt-5 max-w-[32ch] text-[14px] leading-relaxed text-foreground/70 lg:text-[15px]">{service.heroSubline}</p>
                    <Link to="/contact" className={`mt-7 ${primaryCtaClass}${usePremiumSections ? " -ml-6 service-sidebar-cta service-cta--quiet" : ""}`}>
                      Start a Project
                    </Link>
                  </Reveal>
                  <p className="mt-auto pt-10 font-sans text-[12px] text-muted">Based in India · Working worldwide</p>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted">Service [{String(index + 1).padStart(2, "0")}]</p>
                    <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">{service.serviceType}</p>
                  </div>
                  <div>
                    <div aria-hidden="true" className="-ml-6 font-sans text-[clamp(2.5rem,5vw,5.5rem)] font-medium leading-[0.88] tracking-[-0.055em] text-foreground">{service.name}.</div>
                    <p className="mt-6 max-w-[32ch] text-[14px] leading-relaxed text-muted lg:text-[15px]">{service.heroSubline}</p>
                    <Link to="/contact" className={`mt-8 ${primaryCtaClass}`}>Start a project</Link>
                  </div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">Based in India · Working worldwide</p>
                </>
              )}
            </div>
          </aside>

          <div id="service-content" className="flex-1">
            <section className={heroSectionClass}>
              <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr] xl:gap-10">
                <Reveal delay={0.08} className="min-w-0">
                  <SectionHeading plain={plain} size="large" animated className={plain ? "mb-4" : "mb-5"}>Overview</SectionHeading>
                  <p className={`${leadClass} font-sans text-foreground`}>{service.lead}</p>
                  <p className={usePremiumSections
                    ? "mt-5 max-w-[46ch] text-[14px] leading-[1.55] text-foreground/70"
                    : plain
                      ? "mt-5 max-w-[46ch] text-[15px] leading-[1.65] text-foreground/70 sm:text-[16px] lg:text-[17px]"
                      : "mt-6 max-w-[58ch] text-[14px] leading-relaxed text-muted sm:text-[15px]"}
                  >
                    {service.intro}
                  </p>
                </Reveal>
                <Reveal delay={0.14} className="min-w-0">
                  <GlanceCard items={service.glance.filter(([label]) => label !== "Based in")} plain={plain} />
                </Reveal>
              </div>
            </section>

            <section className={includedSectionClass}>
              {plain && service.includedTiles ? (
                <IncludedTiles items={service.includedTiles} />
              ) : (
                <>
                  <SectionHeading plain={plain} className="mb-6">What’s included</SectionHeading>
                  <NumberedGrid items={service.included} plain={plain} />
                </>
              )}
            </section>

            {service.stack.length > 0 && (
              <section className="px-4 py-8 sm:px-[4vw] sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-16">
                <SectionHeading plain={plain} className="mb-6">Tools we use</SectionHeading>
                <Chips items={service.stack} />
              </section>
            )}

            <section className={usePremiumSections
              ? "process-section px-4 py-12 sm:px-[4vw] sm:py-16 md:px-8 lg:px-12 lg:py-20"
              : "px-4 py-8 sm:px-[4vw] sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-16"}
            >
              {usePremiumSections ? (
                <Reveal delay={0.06}>
                  <ProcessTimeline items={service.process} />
                </Reveal>
              ) : (
                <>
                  <SectionHeading plain={plain} className="mb-6">Our Process</SectionHeading>
                  <div className={`grid gap-6 sm:grid-cols-2 ${stepGrid}`}>
                    {service.process.map(({ step, label, desc }) => (
                      <div key={step} className="pt-4 sm:pt-5">
                        {!plain && <p className="font-mono text-[12px] tracking-[0.12em] text-accent">{step}</p>}
                        <h3 className={plain
                          ? "font-display text-[15px] font-semibold text-foreground sm:text-[16px]"
                          : "mt-2.5 font-display text-[15px] text-foreground sm:text-[16px]"}
                        >
                          {label}
                        </h3>
                        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{desc}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>

            <section className={usePremiumSections
              ? "why-section px-4 py-12 sm:px-[4vw] sm:py-16 md:px-8 lg:px-12 lg:py-20"
              : "px-4 py-8 sm:px-[4vw] sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-16"}
            >
              {usePremiumSections ? (
                <Reveal delay={0.04}>
                  <WhyAnvikLabs items={service.whyUs} />
                </Reveal>
              ) : (
                <>
                  <SectionHeading plain={plain} className="mb-6">Why Anvik Labs</SectionHeading>
                  <CardGrid2x2 items={service.whyUs} plain={plain} />
                </>
              )}
            </section>

            {!usePremiumSections && (
              <section className="px-4 py-8 sm:px-[4vw] sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-16"><ProofStrip /></section>
            )}

            <Faq
              items={service.faqs}
              metaLabel="FAQs"
              metaTitle="Before we begin"
              showMeta={!usePremiumSections}
              initialVisibleCount={service.initialFaqCount}
              plain={plain}
              neutral={usePremiumSections}
              headingReveal={usePremiumSections ? "static" : "scroll"}
            />
            <RelatedServices current={service} plain={plain} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
