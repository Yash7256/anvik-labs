import { useState } from 'react'
import { Link } from 'react-router-dom'

const CURRENT_YEAR = 2026

export function NdFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  return (
    <footer className="nd-footer">
      <div className="nd-container">
        <div className="nd-footer__grid">
          {/* Brand & Newsletter */}
          <div>
            <div className="nd-footer__brand-title">
              <span style={{ color: 'var(--cv-accent)', fontSize: '10px' }}>●</span>
              Conversion
            </div>
            <p className="nd-footer__brand-desc">
              Sign up to our mailing list below and be the first to know about new updates. Don't worry, we hate spam too.
            </p>
            {subscribed ? (
              <div style={{ color: 'var(--cv-accent)', fontSize: '14px', fontWeight: 600 }}>
                Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="nd-footer__newsletter-form">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="nd-footer__newsletter-input"
                />
                <button type="submit" className="nd-footer__newsletter-submit">
                  Join
                </button>
              </form>
            )}
          </div>

          {/* Pages */}
          <div>
            <div className="nd-footer__col-title">Pages</div>
            <ul className="nd-footer__links">
              <li>
                <a href="/#results" className="nd-footer__link">Results</a>
              </li>
              <li>
                <a href="/#services" className="nd-footer__link">Services</a>
              </li>
              <li>
                <a href="/#process" className="nd-footer__link">Process</a>
              </li>
              <li>
                <a href="/#reviews" className="nd-footer__link">Reviews</a>
              </li>
              <li>
                <a href="/#faq" className="nd-footer__link">FAQ</a>
              </li>
              <li>
                <Link to="/blog" className="nd-footer__link">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <div className="nd-footer__col-title">Information</div>
            <ul className="nd-footer__links">
              <li>
                <Link to="/about" className="nd-footer__link">About</Link>
              </li>
              <li>
                <Link to="/services" className="nd-footer__link">Services</Link>
              </li>
              <li>
                <Link to="/contact" className="nd-footer__link">Contact</Link>
              </li>
              <li>
                <Link to="/terms-of-services" className="nd-footer__link">Legal</Link>
              </li>
              <li>
                <Link to="/privacy" className="nd-footer__link">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="nd-footer__bottom">
          <div>&copy; {CURRENT_YEAR} Conversion &middot; All rights reserved.</div>
          <div>
            Created by <a href="https://x.com/hxmzaehsan" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Hamza Ehsan</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
