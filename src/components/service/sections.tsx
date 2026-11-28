"use client";

import { useState } from "react";
import { Link } from "react-router";
import MaskedHeading from "@/components/MaskedHeading";
import { primaryCtaClass } from "@/lib/cta";
import type { IncludedTile, Service } from "@/data/services";
import { services as servicesForRelated } from "@/data/services";

export function SectionHeading({
  children,
  plain = false,
  className = "mb-5",
  size = "default",
  animated = false,
}: {
  children: string;
  plain?: boolean;
  className?: string;
  size?: "default" | "large";
  animated?: boolean;
}) {
  if (plain) {
    const headingClassName = `${className} font-display font-semibold leading-[1.1] tracking-[-0.025em] text-foreground ${
      size === "large"
        ? "text-[clamp(30px,3.75vw,50px)]"
        : "text-[20px] sm:text-[22px]"
    }`;

    return animated
      ? <MaskedHeading className={headingClassName}>{children}</MaskedHeading>
      : <h2 className={headingClassName}>{children}</h2>;
  }

  return (
    <p className={`${className} font-mono text-[12px] uppercase tracking-[0.18em] text-muted`}>
      {children}
    </p>
  );
}

export function GlanceCard({ items, plain = false }: { items: Service["glance"]; plain?: boolean }) {
  if (plain) {
    return (
      <div className="glance-glass relative isolate overflow-hidden rounded-[20px] bg-[var(--sc-bg)] p-5 text-[var(--sc-text)] shadow-[var(--sc-shadow)] backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-500 hover:bg-[var(--sc-bg-hover)] hover:shadow-[var(--sc-shadow-hover)] sm:p-6">
        <div aria-hidden="true" className="service-card__fluid service-card__fluid--a absolute -right-12 -top-16 h-40 w-40 rounded-full opacity-70" />
        <div aria-hidden="true" className="service-card__fluid service-card__fluid--c absolute -bottom-16 -left-10 h-36 w-36 rounded-full opacity-60" />
        <div className="relative z-10">
          <h2 className="mb-5 font-display text-[20px] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--sc-text)] sm:text-[22px]">
            At a glance
          </h2>
          <dl>
            {items.map(([label, value]) => (
              <div key={label} className="glance-glass__row py-3 first:pt-0 last:pb-0">
                <dt className="font-sans text-[13px] font-semibold text-[var(--sc-text-muted)]">
                  {label}
                </dt>
                <dd className="mt-1 text-[14px] leading-[1.5] text-[var(--sc-text)] sm:text-[15px]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-black/10 bg-light-surface p-5 sm:p-6">
      <SectionHeading className="mb-5">At a glance</SectionHeading>
      <dl>
        {items.map(([label, value]) => (
          <div key={label} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[0.7fr_1.3fr] sm:gap-4">
            <dt className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted">{label}</dt>
            <dd className="text-[14px] leading-relaxed text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function NumberedGrid({ items, plain = false }: { items: string[]; plain?: boolean }) {
  return (
    <div className="grid gap-x-8 sm:grid-cols-2">
      {items.map((item, index) => (
        <div key={item} className="px-0 py-4 sm:px-4 sm:py-5">
          {!plain && (
            <span className="font-mono text-[12px] tracking-[0.12em] text-accent">
              [{String(index + 1).padStart(2, "0")}]
            </span>
          )}
          <p className={`${plain ? "max-w-none" : "mt-2 max-w-[34ch]"} text-[14px] leading-relaxed text-foreground sm:text-[15px]`}>
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

function IncludedTileIcon({ icon }: { icon: IncludedTile["icon"] }) {
  const svgProps = {
    "aria-hidden": "true" as const,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "included-tile__icon h-8 w-8 text-[var(--premium-muted)]",
  };

  switch (icon) {
    case "browser":
      return (
        <svg {...svgProps}>
          <rect x="4" y="6" width="24" height="20" rx="2" />
          <path d="M4 11h24" />
          <path d="M8 8.5h.01M11 8.5h.01" strokeWidth="2" />
          <path d="M8 16h9M8 20h6" />
        </svg>
      );
    case "panels":
      return (
        <svg {...svgProps}>
          <rect x="4" y="5" width="10" height="10" rx="1.5" />
          <rect x="18" y="5" width="10" height="10" rx="1.5" />
          <rect x="11" y="17" width="10" height="10" rx="1.5" />
          <path d="M14 10h4M16 15v2" />
        </svg>
      );
    case "network":
      return (
        <svg {...svgProps}>
          <circle cx="16" cy="16" r="3" />
          <circle cx="6" cy="8" r="2" />
          <circle cx="26" cy="8" r="2" />
          <circle cx="7" cy="25" r="2" />
          <circle cx="25" cy="25" r="2" />
          <path d="m8 9.5 6 4.5M24 9.5l-6 4.5M9 23l4.5-4.5M23 23l-4.5-4.5M6 10v13M26 10v13" />
        </svg>
      );
    case "modules":
      return (
        <svg {...svgProps}>
          <rect x="4" y="4" width="10" height="10" rx="1.5" />
          <rect x="18" y="4" width="10" height="6" rx="1.5" />
          <rect x="18" y="14" width="10" height="14" rx="1.5" />
          <rect x="4" y="18" width="10" height="10" rx="1.5" />
          <path d="M14 9h4M9 14v4M14 23h4" />
        </svg>
      );
    case "nodes":
      return (
        <svg {...svgProps}>
          <rect x="11" y="4" width="10" height="6" rx="1.5" />
          <rect x="11" y="22" width="10" height="6" rx="1.5" />
          <rect x="3" y="13" width="9" height="6" rx="1.5" />
          <rect x="12" y="13" width="8" height="6" rx="1.5" />
          <rect x="20" y="13" width="9" height="6" rx="1.5" />
          <path d="M16 10v3M16 19v3M12 16H9M20 16h3" />
        </svg>
      );
    case "expand":
      return (
        <svg {...svgProps}>
          <rect x="4" y="8" width="16" height="16" rx="2" />
          <rect x="10" y="14" width="16" height="16" rx="2" />
          <path d="M19 5h7v7" />
        </svg>
      );
  }
}

export function IncludedTiles({ items }: { items: IncludedTile[] }) {
  return (
    <div>
      <div className="mb-8 sm:mb-10">
        <MaskedHeading className="whitespace-nowrap font-display text-[clamp(30px,3.75vw,50px)] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--premium-heading)]">
          What&apos;s Included
        </MaskedHeading>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        {items.map((item, index) => (
          <Link
            key={item.title}
            to="/contact"
            aria-label={`Discuss ${item.title}`}
            className="included-tile group relative flex min-h-[230px] flex-col rounded-[10px] p-5 focus-visible:outline-offset-2 sm:min-h-[300px] lg:min-h-[260px] xl:min-h-[280px]"
          >
            <span aria-hidden="true" className="included-tile__accent absolute inset-x-0 top-0 h-px bg-[var(--premium-accent)]" />
            <div className="flex items-start justify-between gap-4">
              <IncludedTileIcon icon={item.icon} />
              <span className="font-mono text-[11px] tracking-[0.12em] text-[var(--premium-muted)] opacity-70">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-auto pb-6 pt-8">
              <h3 className="font-display text-[17px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--premium-heading)] sm:text-[18px]">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[34ch] text-[13px] leading-[1.55] text-[var(--premium-muted)] sm:text-[14px]">
                {item.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ProcessTimeline({ items }: { items: Service["process"] }) {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [focusedStep, setFocusedStep] = useState<string | null>(null);
  const [pinnedStep, setPinnedStep] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-10 sm:mb-12">
        <MaskedHeading className="font-display text-[clamp(30px,3.75vw,50px)] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--premium-heading)]">
          Our Process
        </MaskedHeading>
      </div>

      <ol className="process-grid">
        {items.map(({ step, label, desc }) => {
          const expanded = pinnedStep === step || hoveredStep === step || focusedStep === step;
          const descId = `process-desc-${step}`;

          return (
            <li
              key={step}
              className={`process-step group${expanded ? " process-step--active" : ""}`}
              onMouseEnter={() => setHoveredStep(step)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <span aria-hidden="true" className="process-step__segment">
                <span className="process-step__segment-fill" />
              </span>
              <span aria-hidden="true" className="process-step__node">
                <span className="process-step__node-dot" />
              </span>
              <span aria-hidden="true" className="process-step__number">{step}</span>
              <h3 className="process-step__title">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={descId}
                  className="process-step__trigger"
                  onFocus={() => setFocusedStep(step)}
                  onBlur={() => setFocusedStep(null)}
                  onClick={() => {
                    setHoveredStep(null);
                    setFocusedStep(null);
                    setPinnedStep(pinnedStep === step ? null : step);
                  }}
                >
                  {label}
                </button>
              </h3>
              <p id={descId} className="process-step__desc" aria-hidden={!expanded}>
                {desc}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function Chips({ items }: { items: Service["stack"] }) {
  return (
      <div>
      {items.map(({ area, tools }) => (
        <div key={area} className="grid gap-3 py-4 sm:grid-cols-[0.55fr_1.45fr] sm:items-center sm:gap-6 sm:py-5">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">{area}</p>
          <div className="flex flex-wrap gap-2">
            {tools.split(", ").map((tool) => (
              <span key={tool} className="rounded-full border border-black/15 px-3.5 py-1.5 text-[14px] text-muted">{tool}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WhyFeatureVisual({ index }: { index: number }) {
  const props = {
    "aria-hidden": "true" as const,
    viewBox: "0 0 64 40",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "why-feature__visual",
  };

  switch (index) {
    case 0:
      return (
        <svg {...props}>
          <rect x="2" y="8" width="22" height="24" rx="1" />
          <path d="M2 15h22M7 11.5h.01M10 11.5h.01M7 21h10M7 26h7" />
          <rect x="40" y="8" width="22" height="24" rx="1" />
          <path d="m46 16-4 4 4 4m10-8 4 4-4 4m-5-13-2 10" />
          <path d="M24 20h16" />
          <circle cx="32" cy="20" r="2" />
        </svg>
      );
    case 1:
      return (
        <svg {...props}>
          <rect x="6" y="5" width="52" height="30" rx="1" />
          <path d="M6 13h52M19 13v22M11 9h.01M14 9h.01" />
          <circle cx="13" cy="21" r="1.5" />
          <rect x="25" y="18" width="13" height="6" rx="1" />
          <rect x="42" y="18" width="11" height="6" rx="1" />
          <path d="M25 29h16M44 29h8" />
        </svg>
      );
    case 2:
      return (
        <svg {...props}>
          <path d="M4 20h12M48 20h12" />
          <circle cx="4" cy="20" r="2" />
          <circle cx="60" cy="20" r="2" />
          <rect x="16" y="9" width="32" height="20" rx="1" />
          <path d="m23 29 6-6M23 16h18M23 21h11" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="10" cy="30" r="4" />
          <circle cx="32" cy="8" r="4" />
          <circle cx="54" cy="30" r="4" />
          <path d="m13.5 27.5 15.5-16.5M35 11l15.5 16.5M14 30h36" />
          <rect x="28" y="26" width="8" height="8" rx="1" />
        </svg>
      );
  }
}

export function WhyAnvikLabs({ items }: { items: Service["whyUs"] }) {
  return (
    <div>
      <div className="why-header">
        <MaskedHeading className="font-display text-[clamp(30px,3.75vw,50px)] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--premium-heading)]">
          Why Anvik Labs
        </MaskedHeading>
      </div>

      <div className="why-grid">
        {items.map(({ title, desc }, index) => (
          <article key={title} className="why-feature group">
            <span aria-hidden="true" className="why-feature__accent" />
            <div className="flex items-start justify-between gap-5">
              <span className="why-feature__index">{String(index + 1).padStart(2, "0")}</span>
              <WhyFeatureVisual index={index} />
            </div>
            <div className="mt-auto">
              <h3 className="why-feature__title">{title}</h3>
              <p className="why-feature__desc">{desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CardGrid2x2({ items, plain = false }: { items: Service["whyUs"]; plain?: boolean }) {
  return (
    <div className="grid border border-black/10 sm:grid-cols-2">
      {items.map(({ title, desc }) => (
        <div key={title} className="bg-background p-5 sm:p-6">
          <h3 className={plain ? "font-display text-[15px] font-semibold text-foreground sm:text-[16px]" : "font-display text-[15px] text-foreground"}>
            {title}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">{desc}</p>
        </div>
      ))}
    </div>
  );
}

export function ProofStrip() {
  return (
    <Link
      to="/works"
      className={primaryCtaClass}
    >
      Selected work
    </Link>
  );
}

export function RelatedServices({ current, plain = false }: { current: Service; plain?: boolean }) {
  const related = servicesForRelated.filter((service) => service.slug !== current.slug);

  return (
    <section className="px-4 py-8 sm:px-[4vw] sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        {plain ? (
          <h2 className="font-display text-[20px] font-semibold leading-[1.1] tracking-[-0.025em] text-foreground sm:text-[22px]">
            More services
          </h2>
        ) : (
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted">More services</p>
        )}
        <Link
          to="/contact"
          className={plain
            ? "font-sans text-[13px] font-medium text-muted transition-colors hover:text-accent"
            : "font-mono text-[12px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent"}
        >
          Start a project
        </Link>
      </div>
    <div>
        {related.map((service) => (
          <Link key={service.slug} to={`/services/${service.slug}`} className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent sm:py-5">
            <span className="text-[15px] text-foreground transition-colors group-hover:text-accent">{service.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
