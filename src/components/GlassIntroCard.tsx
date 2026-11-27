import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { Link } from "react-router";
import { useReducedMotion } from "framer-motion";
import { useFinePointer } from "@/lib/motion";

export type GlassIntroCardProps = {
  /** Top-left primary label, e.g. "Elgar | Design" */
  brand: string;
  /** Top-left secondary label, e.g. "Studio" */
  brandSub: string;
  /** Top-right label */
  actionLabel: string;
  /** Main headline lines */
  headline: string[];
  /** Bottom-left signature */
  signature: string;
  /** Optional link destination; renders a Link when provided */
  href?: string;
  /** Optional extra class on outer article */
  className?: string;
  /** Optional aria-label for linked card */
  ariaLabel?: string;
  /** Optional content rendered below headline for custom use */
  children?: ReactNode;
};

export default function GlassIntroCard({
  brand,
  brandSub,
  actionLabel,
  headline,
  signature,
  href,
  className = "",
  ariaLabel,
  children,
}: GlassIntroCardProps) {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const cardRef = useRef<HTMLElement>(null);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion || !finePointer || event.pointerType !== "mouse") return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--glass-light-x", `${x}%`);
    el.style.setProperty("--glass-light-y", `${y}%`);
    el.style.setProperty("--glass-tilt-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 6}px`);
    el.style.setProperty("--glass-tilt-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 4}px`);
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--glass-light-x", "35%");
    el.style.setProperty("--glass-light-y", "30%");
    el.style.setProperty("--glass-tilt-x", "0px");
    el.style.setProperty("--glass-tilt-y", "0px");
  };

  const content = (
    <>
      <div className="glass-card__bg" aria-hidden="true">
        <div className="glass-card__bg-base" />
        <div className="glass-card__bg-orb glass-card__bg-orb--a" />
        <div className="glass-card__bg-orb glass-card__bg-orb--b" />
        <div className="glass-card__bg-orb glass-card__bg-orb--c" />
        <div className="glass-card__bg-glow" />
        <div className="glass-card__bg-noise" />
      </div>

      <div className="glass-card__panel">
        <div className="glass-card__panel-glow" aria-hidden="true" />
        <div className="glass-card__panel-highlight" aria-hidden="true" />
        <div className="glass-card__panel-edge" aria-hidden="true" />

        <div className="glass-card__content">
          <header className="glass-card__top">
            <div className="glass-card__brand">
              <p className="glass-card__brand-main">{brand}</p>
              <p className="glass-card__brand-sub">{brandSub}</p>
            </div>
            <p className="glass-card__action">
              <span>{actionLabel}</span>
            </p>
          </header>

          <div className="glass-card__body" data-service-body>
            <h3 className="glass-card__headline">
              {headline.map((line, i) => (
                <span key={i} className="glass-card__headline-line">
                  {line}
                </span>
              ))}
            </h3>
            {children ? <div className="glass-card__extra">{children}</div> : null}
          </div>

          <footer className="glass-card__footer">
            <p className="glass-card__signature">{signature}</p>
          </footer>
        </div>
      </div>
    </>
  );

  const classNames = `glass-card group/glass ${className}`.trim();

  if (href) {
    return (
      <article
        ref={cardRef as React.RefObject<HTMLElement>}
        data-service-card
        className={classNames}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <Link to={href} className="glass-card__link" aria-label={ariaLabel}>
          {content}
        </Link>
      </article>
    );
  }

  return (
    <article
      ref={cardRef as React.RefObject<HTMLElement>}
      data-service-card
      className={classNames}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {content}
    </article>
  );
}
