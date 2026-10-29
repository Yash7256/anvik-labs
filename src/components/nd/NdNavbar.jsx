import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/#services' },
  { label: 'Products', href: '/#products' },
  { label: 'Process', href: '/#process' },
]

export function NdNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const toggleRef = useRef(null)
  const lastScrollY = useRef(0)
  const location = useLocation()

  // Scroll hide/show + compact pill
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      const isScrolled = currentY > 24
      const isHidden = currentY > lastScrollY.current && currentY > 120
      setScrolled(isScrolled)
      setHidden(isHidden && !menuOpen)
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  // Keyboard escape to close menu
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <>
      <header
        className="nd-header"
        data-scrolled={scrolled || undefined}
        data-hidden={hidden || undefined}
      >
        <div className="nd-nav-wrapper">
          <nav className="nd-nav" aria-label="Primary navigation">
            <div className="nd-nav__inner">
              {/* Brand wordmark with accent dot */}
              <Link to="/" className="nd-nav__logo" aria-label="Anvik Labs home">
                <span className="nd-nav__logo-dot" aria-hidden="true" />
                <span className="nd-nav__logo-text">Anvik Labs</span>
              </Link>

              {/* Centered navigation links */}
              <ul className="nd-nav__links" role="list">
                {NAV_LINKS.map(({ label, href }) => {
                  const isExternal = href.startsWith('http')
                  const isHash = href.startsWith('/#') || href.startsWith('#')
                  const isCurrent = location.pathname === href

                  return (
                    <li key={href}>
                      {isHash || isExternal ? (
                        <a
                          href={href}
                          className="nd-nav__link"
                          aria-current={isCurrent ? 'page' : undefined}
                        >
                          {label}
                        </a>
                      ) : (
                        <Link
                          to={href}
                          className="nd-nav__link"
                          aria-current={isCurrent ? 'page' : undefined}
                        >
                          {label}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>

              {/* Nav CTA & mobile hamburger */}
              <div className="nd-nav__actions">
                <Link
                  to="/contact"
                  className="cv-btn-primary nd-nav__cta"
                  aria-label="Work With Us with Anvik Labs"
                >
                  <span>Work With Us</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="nd-nav__cta-arrow"
                  >
                    <path
                      d="M3.33334 8H12.6667M12.6667 8L8.66668 4M12.6667 8L8.66668 12"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

                <button
                  ref={toggleRef}
                  type="button"
                  className="nd-nav__hamburger"
                  aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  aria-expanded={menuOpen}
                  aria-controls="nd-mobile-menu"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <span className="nd-nav__hamburger-line" aria-hidden="true" />
                  <span className="nd-nav__hamburger-line" aria-hidden="true" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        id="nd-mobile-menu"
        className="nd-mobile-menu"
        data-open={menuOpen}
        aria-hidden={!menuOpen}
      >
        <div className="nd-mobile-menu__inner">
          <div className="nd-mobile-menu__links">
            {NAV_LINKS.map(({ label, href }) => {
              const isHash = href.startsWith('/#') || href.startsWith('#')
              return isHash ? (
                <a
                  key={href}
                  href={href}
                  className="nd-mobile-menu__link"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={closeMenu}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  to={href}
                  className="nd-mobile-menu__link"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={closeMenu}
                  aria-current={location.pathname === href ? 'page' : undefined}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 24 }}>
            <Link
              to="/contact"
              className="cv-btn-primary"
              style={{ width: '100%', height: '52px', fontSize: '16px' }}
              onClick={closeMenu}
            >
              <span>Work With Us</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3.33334 8H12.6667M12.6667 8L8.66668 4M12.6667 8L8.66668 12"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
