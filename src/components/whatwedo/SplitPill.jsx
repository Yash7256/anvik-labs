export function SplitPill({ anchorRef, pillRef, labelRef, glowRef, reducedMotion }) {
  return (
    <div
      ref={anchorRef}
      className="what__source-anchor"
      data-pill-anchor
      aria-hidden="true"
      data-reduced={reducedMotion ? 'true' : 'false'}
    >
      <div ref={pillRef} className="what__source-pill" data-source-pill>
        <span ref={glowRef} className="what__source-glow" data-source-glow />
        <span className="what__source-sheen" />
        <span ref={labelRef} className="what__source-label" data-source-label>
          One studio
        </span>
      </div>
    </div>
  )
}
