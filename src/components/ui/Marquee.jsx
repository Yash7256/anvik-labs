const ITEMS = ['Security', 'Design', 'Dev Tools', 'AI', 'Freelance']

export function Marquee({ className = '' }) {
  return (
    <div className={`marquee ${className}`}>
      <p className="sr-only">
        Security. Design. Dev Tools. AI. Freelance.
      </p>
      <div className="marquee__track" aria-hidden="true">
        {[0, 1].map((group) => (
          <div className="marquee__group" key={group}>
            {ITEMS.map((item) => (
              <span className="marquee__item" key={`${group}-${item}`}>
                {item}
                <span className="marquee__dot">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
