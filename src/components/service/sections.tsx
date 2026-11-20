import { Link } from "react-router";
import { primaryCtaClass } from "@/lib/cta";
import type { Service } from "@/data/services";
import { services as servicesForRelated } from "@/data/services";

export function GlanceCard({ items }: { items: Service["glance"] }) {
  return (
    <div className="border border-black/10 bg-light-surface p-5 sm:p-6">
      <p className="mb-5 font-mono text-[12px] uppercase tracking-[0.16em] text-muted">
        At a glance
      </p>
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

export function NumberedGrid({ items }: { items: string[] }) {
  return (
    <div className="grid sm:grid-cols-2">
      {items.map((item, index) => (
        <div
          key={item}
          className="px-0 py-4 sm:px-4 sm:py-5"
        >
          <span className="font-mono text-[12px] tracking-[0.12em] text-accent">[{String(index + 1).padStart(2, "0")}]</span>
          <p className="mt-2 max-w-[34ch] text-[14px] leading-relaxed text-foreground sm:text-[15px]">{item}</p>
        </div>
      ))}
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

export function CardGrid2x2({ items }: { items: Service["whyUs"] }) {
  return (
    <div className="grid border border-black/10 sm:grid-cols-2">
      {items.map(({ title, desc }) => (
        <div key={title} className="bg-background p-5 sm:p-6">
          <h3 className="font-display text-[15px] text-foreground">{title}</h3>
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
      Selected work <span aria-hidden="true">→</span>
    </Link>
  );
}

export function RelatedServices({ current }: { current: Service }) {
  const related = servicesForRelated.filter((service) => service.slug !== current.slug);

  return (
    <section className="px-4 py-8 sm:px-[4vw] sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted">More services</p>
        <Link to="/contact" className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent">Start a project →</Link>
      </div>
    <div>
        {related.map((service) => (
          <Link key={service.slug} to={`/services/${service.slug}`} className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent sm:py-5">
            <span className="text-[15px] text-foreground transition-colors group-hover:text-accent">{service.name}</span>
            <span aria-hidden="true" className="font-mono text-[14px] text-muted transition-transform group-hover:translate-x-1">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

