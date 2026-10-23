import { Link } from 'react-router-dom'

export function ServiceWebDevelopment() {
  return (
    <main className="approach-page">
      <div className="approach-page__inner">
        <p className="approach-page__label">
          <span className="approach-page__dot" aria-hidden="true" />
          Services / 02
        </p>
        <h1 className="approach-page__title">Web development</h1>
        <p className="approach-page__body">
          Placeholder page. The full web development service page is coming soon.
        </p>
        <Link className="hero-link approach-page__link" to="/">
          Back to home ↗
        </Link>
      </div>
    </main>
  )
}
