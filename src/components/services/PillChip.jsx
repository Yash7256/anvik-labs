const ART = {
  design: (
    <span className="svc-chip__art svc-chip__art--design">
      <span className="svc-chip__path" />
      <span className="svc-chip__dots">
        <i />
        <i />
        <i />
      </span>
      <span className="svc-chip__cursor" />
    </span>
  ),
  build: (
    <span className="svc-chip__art svc-chip__art--build">
      <span className="svc-chip__bars">
        <span className="svc-chip__bar svc-chip__bar--one" />
        <span className="svc-chip__bar svc-chip__bar--two" />
        <span className="svc-chip__bar svc-chip__bar--three" />
      </span>
      <span className="svc-chip__caret" />
    </span>
  ),
}

export function PillChip({ variant = 'design' }) {
  return (
    <span className={`svc-chip svc-chip--${variant}`} aria-hidden="true">
      <span className="svc-chip__grain" />
      {ART[variant]}
    </span>
  )
}
