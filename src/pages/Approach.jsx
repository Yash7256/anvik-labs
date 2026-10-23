import { Link } from 'react-router-dom'

export function Approach() {
  return (
    <main className="approach-page">
      <div className="approach-page__inner">
        <p className="approach-page__label">
          <span className="approach-page__dot" aria-hidden="true" />
          Approach
        </p>
        <h1 className="approach-page__title">Our full approach</h1>
        <p className="approach-page__body">
          Placeholder page for the full approach. Detailed write-up coming soon.
        </p>
        <Link className="hero-link approach-page__link" to="/">
          Back to home ↗
        </Link>
      </div>
    </main>
  )
}
