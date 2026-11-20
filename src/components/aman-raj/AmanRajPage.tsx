import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useReducedMotion } from "framer-motion";
import ScrollProgressLine from "@/components/ScrollProgressLine";
import { primaryCtaClass } from "@/lib/cta";
import {
  amanCertifications,
  amanEducation,
  amanExperience,
  amanHero,
  amanProfile,
  amanProjects,
  amanStackGroups,
  amanStats,
  type AmanProject,
  type AmanStat,
} from "@/data/aman";

function useInViewOnce(threshold = 0.2) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!node || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, inView, threshold]);

  return { ref: setNode, inView };
}

function formatStatValue(n: number, decimals = 0) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function CountUp({ stat, start }: { stat: AmanStat; start: boolean }) {
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduceMotion) {
      setCurrent(stat.value);
      return;
    }
    const duration = 1200;
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(stat.value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, stat.value, reduceMotion]);

  const shown = !start ? 0 : reduceMotion ? stat.value : current;

  return (
    <span>
      {stat.prefix ?? ""}
      {formatStatValue(shown, stat.decimals ?? 0)}
      {stat.suffix ?? ""}
    </span>
  );
}

function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 520 90"
      role="img"
      aria-label="Architecture diagram: API to Redis and BullMQ queue to workers to PostgreSQL"
      className="mt-4 h-auto w-full max-w-xl text-accent"
    >
      <defs>
        <marker
          id="aman-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" fillOpacity="0.6" />
        </marker>
      </defs>
      <g fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1">
        <rect x="5" y="25" width="90" height="40" rx="0" />
        <rect x="145" y="25" width="120" height="40" rx="0" />
        <rect x="315" y="25" width="80" height="40" rx="0" />
        <rect x="445" y="25" width="70" height="40" rx="0" />
        <line x1="95" y1="45" x2="145" y2="45" markerEnd="url(#aman-arrow)" />
        <line x1="265" y1="45" x2="315" y2="45" markerEnd="url(#aman-arrow)" />
        <line x1="395" y1="45" x2="445" y2="45" markerEnd="url(#aman-arrow)" />
      </g>
      <g
        fill="currentColor"
        fillOpacity="0.85"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        fontSize="11"
        textAnchor="middle"
      >
        <text x="50" y="49">API</text>
        <text x="205" y="43">Redis / BullMQ</text>
        <text x="205" y="56" fontSize="10" fillOpacity="0.6">queue</text>
        <text x="355" y="49">workers</text>
        <text x="480" y="49">PostgreSQL</text>
      </g>
    </svg>
  );
}

function WorkRow({ project }: { project: AmanProject }) {
  const [open, setOpen] = useState(project.featured ?? false);

  return (
    <li>
      <div
        className={`transition-colors ${open ? "bg-black/[0.02]" : ""}`}
        onMouseEnter={() => setOpen(true)}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          onFocus={() => setOpen(true)}
          aria-expanded={open}
          className="group grid w-full grid-cols-1 gap-3 py-6 text-left md:grid-cols-[auto_1fr_auto] md:items-start md:gap-6 md:py-8"
        >
          <span className="font-mono text-[12px] text-muted">
            {project.index}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3
                className={`font-sans font-medium tracking-[-0.02em] transition-colors group-hover:text-accent ${
                  project.featured
                    ? "text-[clamp(1.5rem,2.8vw,2.2rem)]"
                    : "text-[clamp(1.2rem,2vw,1.6rem)]"
                } ${open ? "text-accent" : "text-foreground"}`}
              >
                {project.title}
              </h3>
              <span className="border border-black/10 px-2 py-0.5 font-mono text-[12px] text-muted">
                {project.status}
              </span>
            </div>
            <p className="mt-2 max-w-2xl font-sans text-[14px] leading-relaxed text-muted md:text-[15px]">
              {project.description}
            </p>
          </div>
          <div className="flex items-center md:justify-end">
            <a
              href={project.github}
              onClick={(e) => e.stopPropagation()}
              className="font-mono text-[12px] text-muted underline decoration-transparent underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/40"
              aria-label={`${project.title} on GitHub`}
            >
              GitHub
            </a>
          </div>
        </button>

        <div
          className={`grid transition-all duration-300 ease-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="grid gap-6 pb-7 md:grid-cols-[1.1fr_0.9fr] md:pl-10">
              <div>
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
                  Highlights
                </p>
                <ul className="mt-3 space-y-2">
                  {project.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex gap-3 font-sans text-[14px] leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                {project.diagram && <ArchitectureDiagram />}
              </div>
              <div>
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
                  Stack
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="border border-black/10 px-2.5 py-1 font-mono text-[12px] text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function AmanRajPage() {
  const { ref: statsRef, inView: statsInView } = useInViewOnce(0.3);

  return (
    <div className="flex flex-col">
      <section id="hero" className="relative pt-32 pb-12 md:pt-44 md:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-accent/10 blur-[100px]"
        />
        <div className="relative grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
              {amanProfile.role} / India
            </p>
            <h1 className="mt-4 max-w-3xl font-sans text-[clamp(2.1rem,4vw,3.8rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
              {amanHero.headline}
            </h1>
            <p className="mt-5 max-w-xl font-sans text-[16px] leading-relaxed text-muted md:text-[17px]">
              {amanHero.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={amanHero.primaryCta.href}
                className={primaryCtaClass}
              >
                {amanHero.primaryCta.label}
              </a>
              <a
                href={amanHero.secondaryCta.href}
                className="inline-flex min-h-11 items-center justify-center rounded-[2px] border border-black/20 px-5 font-sans text-[15px] font-medium text-foreground transition-colors hover:border-black/40 hover:bg-black/5"
              >
                {amanHero.secondaryCta.label}
              </a>
            </div>
          </div>

          <div className="md:justify-self-end">
            <div className="w-full max-w-xs border border-black/10 bg-light-surface p-4 font-mono text-[13px] text-muted">
              <p className="text-foreground">{amanProfile.status}</p>
              <p className="mt-1">{amanProfile.location}</p>
              <p className="mt-3 flex items-center gap-2 text-accent-text">
                <span
                  aria-hidden="true"
                  className="inline-block h-2 w-2 rounded-full bg-accent"
                />
                available
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 md:mt-16">
          <p className="font-display text-[clamp(3rem,14vw,13rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-foreground">
            Aman Raj
          </p>
          <div className="mt-4 flex flex-col gap-2 pt-3 font-mono text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>Backend / AI / Security engineer / India</span>
            <span>Selected work</span>
          </div>
        </div>
      </section>

      <section
        ref={statsRef}
        aria-label="Key numbers"
      >
        <div className="grid grid-cols-2 md:grid-cols-4">
          {amanStats.map((stat, i) => (
            <div
              key={stat.caption}
              className={`py-8 md:py-10 ${i % 2 === 0 ? "pr-6" : "pl-6"} ${
                i > 0 ? "md:pl-6" : "md:pr-6"
              }`}
            >
              <p className="font-sans text-[clamp(2rem,4vw,3.2rem)] font-medium leading-none tracking-[-0.03em] text-foreground">
                <CountUp stat={stat} start={statsInView} />
              </p>
              <p className="mt-2 font-mono text-[12px] text-muted">
                {stat.caption}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="work"
        className="scroll-mt-24 py-12 md:py-16"
        aria-labelledby="aman-work-heading"
      >
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
          01 / Work
        </p>
        <h2
          id="aman-work-heading"
          className="mt-3 font-sans text-[clamp(1.8rem,3vw,2.6rem)] font-medium tracking-[-0.03em] text-foreground"
        >
          Selected work
        </h2>
        <ul className="mt-8">
          {amanProjects.map((project) => (
            <WorkRow key={project.index} project={project} />
          ))}
        </ul>
      </section>

      <section
        id="experience"
        className="scroll-mt-24 py-12 md:py-16"
        aria-labelledby="aman-experience-heading"
      >
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
          02 / Experience
        </p>
        <h2
          id="aman-experience-heading"
          className="mt-3 font-sans text-[clamp(1.8rem,3vw,2.6rem)] font-medium tracking-[-0.03em] text-foreground"
        >
          Experience
        </h2>
        <div id="aman-experience-timeline" className="relative mt-10">
          <ScrollProgressLine
            targetId="aman-experience-timeline"
            className="left-[7px] top-2 h-[calc(100%-1rem)] md:left-[140px]"
          />
          <ul className="space-y-10">
            {amanExperience.map((item) => (
              <li
                key={`${item.role}-${item.company}`}
                className="relative grid gap-4 md:grid-cols-[140px_1fr] md:gap-10"
              >
                <div className="flex items-start gap-4 md:block">
                  <span
                    aria-hidden="true"
                    className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 border border-accent bg-background md:absolute md:left-[134px] md:mt-1.5"
                  />
                  <p className="font-mono text-[12px] text-muted md:pr-8 md:text-right">
                    {item.dates}
                  </p>
                </div>
                <div className="pl-7 md:pl-8">
                  <h3 className="font-sans text-[18px] font-medium text-foreground md:text-[20px]">
                    {item.role}
                  </h3>
                  <p className="mt-1 font-mono text-[13px] text-accent-text">
                    {item.company}
                  </p>
                  <p className="mt-3 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="stack"
        className="scroll-mt-24 py-12 md:py-16"
        aria-labelledby="aman-stack-heading"
      >
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
          03 / Stack
        </p>
        <h2
          id="aman-stack-heading"
          className="mt-3 font-sans text-[clamp(1.8rem,3vw,2.6rem)] font-medium tracking-[-0.03em] text-foreground"
        >
          Stack
        </h2>
        <div className="mt-8">
          {amanStackGroups.map((group) => (
            <div
              key={group.group}
              className="grid gap-3 py-4 md:grid-cols-[220px_1fr] md:gap-6 md:py-5"
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
                {group.group}
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[13px]">
                {group.items.map((item) => (
                  <li key={item.name} className="inline-flex items-center gap-1.5">
                    {item.strong && (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-accent"
                      />
                    )}
                    <span
                      className={item.strong ? "text-foreground" : "text-muted"}
                    >
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        id="certifications"
        className="scroll-mt-24 py-12 md:py-16"
        aria-labelledby="aman-certs-heading"
      >
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
          04 / Certifications
        </p>
        <h2
          id="aman-certs-heading"
          className="mt-3 font-sans text-[clamp(1.8rem,3vw,2.6rem)] font-medium tracking-[-0.03em] text-foreground"
        >
          Certifications & Education
        </h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {amanCertifications.map((cert) => (
            <li
              key={cert.name}
              className="border border-black/10 bg-light-surface px-4 py-3"
            >
              <p className="font-sans text-[14px] font-medium text-foreground">
                {cert.name}
              </p>
              <p className="mt-1 font-mono text-[12px] text-muted">
                {cert.issuer}, {cert.year}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl font-mono text-[13px] leading-relaxed text-muted">
          {amanEducation}
        </p>
      </section>

      <section
        id="contact"
        className="scroll-mt-24 py-14 md:py-20"
        aria-labelledby="aman-contact-heading"
      >
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
          05 / Contact
        </p>
        <h2
          id="aman-contact-heading"
          className="mt-6 font-display text-[clamp(2.4rem,7vw,6rem)] leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          Let&apos;s build something.
        </h2>
        <div className="mt-10 flex flex-col gap-8 pt-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <a
              href={`mailto:${amanProfile.email}`}
              className="block font-sans text-[18px] text-foreground underline decoration-white/20 underline-offset-4 transition-colors hover:text-accent md:text-[20px]"
            >
              {amanProfile.email}
            </a>
            <div className="flex flex-wrap gap-4 font-mono text-[13px] text-muted">
              <a
                href={amanProfile.github}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href={amanProfile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <p className="font-mono text-[12px] text-muted">
            <Link to="/" className="transition-colors hover:text-foreground">
              Anvik Labs
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
