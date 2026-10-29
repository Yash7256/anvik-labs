import { Link } from 'react-router-dom'
import { NdNavbar } from '@/components/nd/NdNavbar'
import { NdFooter } from '@/components/nd/NdFooter'

export function NotFound() {
  return (
    <div className="nd-page">
      <NdNavbar />
      <main id="main" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px' }}>
        <div>
          <div className="nd-badge" style={{ marginBottom: 16 }}>
            <span className="nd-badge__dot" />
            <span>404 Error</span>
          </div>
          <h1 className="nd-hero__title" style={{ margin: '0 0 16px' }}>
            Page not <em>found.</em>
          </h1>
          <p className="nd-hero__desc" style={{ maxWidth: 440, margin: '0 auto 32px' }}>
            The page you are looking for does not exist or has been moved to a new URL.
          </p>
          <Link to="/" className="cv-btn-primary">
            Return to Home
          </Link>
        </div>
      </main>
      <NdFooter />
    </div>
  )
}
