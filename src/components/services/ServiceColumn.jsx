import { MagneticButton } from '@/components/ui/MagneticButton'
import { useMagneticStrength } from '@/hooks/useMagneticStrength'

function splitLinkText(linkText) {
  const arrow = linkText.lastIndexOf('↗')
  if (arrow === -1) return { label: linkText, arrow: '' }
  return {
    label: linkText.slice(0, arrow).trimEnd(),
    arrow: linkText.slice(arrow),
  }
}

export function ServiceColumn({
  index,
  kind,
  title,
  body,
  href,
  linkText,
  reducedMotion = false,
  active = false,
  dim = false,
  onEnter,
  onLeave,
}) {
  const strength = useMagneticStrength(10)
  const { label, arrow } = splitLinkText(linkText)

  const handlePointerEnter = (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    onEnter?.()
  }

  const handlePointerLeave = (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    onLeave?.()
  }

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) onLeave?.()
  }

  return (
    <article
      className="svc__column"
      data-kind={kind}
      data-active={active ? 'true' : undefined}
      data-dim={dim ? 'true' : undefined}
      aria-labelledby={`service-${kind}-title`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={onEnter}
      onBlur={handleBlur}
    >
      <div className="svc__column-top">
        <span className="svc__column-index">{index}</span>
        <span
          className={`svc__swatch svc__swatch--${kind}`}
          aria-hidden="true"
        />
      </div>

      <h3 id={`service-${kind}-title`} className="svc__column-title">
        {title}
      </h3>
      <p className="svc__column-body">{body}</p>

      <MagneticButton
        href={href}
        className="hero-link svc__column-link"
        data-cursor="View"
        strength={reducedMotion ? 0 : strength}
      >
        <span>{label} </span>
        <span className="svc__column-arrow" aria-hidden="true">
          {arrow}
        </span>
      </MagneticButton>
    </article>
  )
}
