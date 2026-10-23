export function TrackRow({ index, variant, title, copy, link, tag }) {
  const isProducts = variant === 'one'

  return (
    <article
      className={`what__row what__row--${variant}`}
      data-what-row={variant}
    >
      <span className="what__row-glow" aria-hidden="true" />

      <div className="what__row-pill-frame" data-pill-frame aria-hidden="true">
        <div className="what__row-pill" data-pill-target>
          <span className="what__row-pill-fill" data-pill-fill />
        </div>
      </div>

      <div className="what__row-content" data-row-content>
        <p className="what__row-index" aria-hidden="true">
          {index}
        </p>

        <div className="what__row-main">
          <h3 className="what__row-title">{title}</h3>
        </div>

        <div className="what__row-body">
          <p className="what__row-copy">{copy}</p>
          {(link || tag) && (
            <div className="what__row-action">
              {link}
              {tag && <p className="what__row-tag">{tag}</p>}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
