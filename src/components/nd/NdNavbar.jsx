import { useEffect, useRef, useState } from 'react'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'Process', href: '#process' },
]

const START_PROJECT_HREF = 'mailto:hello@anviklabs.com?subject=Start%20a%20project'

function ArrowIcon() {
  return (
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
  )
}

export function NdNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const toggleRef = useRef(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 24)
      setHidden(currentY > lastScrollY.current && currentY > 120 && !menuOpen)
      lastScrollY.current = currentY
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

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
              <a href="/" className="nd-nav__logo" aria-label="Anvik Labs home">
                <img
                  src="/logo.svg"
                  alt="Anvik Labs"
                  className="nd-nav__logo-img"
                  width="1010"
                  height="118"
                />
              </a>

              <ul className="nd-nav__links" role="list">
                {NAV_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href} className="nd-nav__link">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="nd-nav__actions">
                <a
                  href={START_PROJECT_HREF}
                  className="btn btn-primary nd-nav__cta"
                  aria-label="Start a project with Anvik Labs"
                >
                  <span>Start a Project</span>
                  <ArrowIcon />
                </a>

                <button
                  ref={toggleRef}
                  type="button"
                  className="nd-nav__hamburger"
                  aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  aria-expanded={menuOpen}
                  aria-controls="nd-mobile-menu"
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <span className="nd-nav__hamburger-line" aria-hidden="true" />
                  <span className="nd-nav__hamburger-line" aria-hidden="true" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div
        id="nd-mobile-menu"
        className="nd-mobile-menu"
        data-open={menuOpen}
        aria-hidden={!menuOpen}
      >
        <div className="nd-mobile-menu__inner">
          <div className="nd-mobile-menu__links">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="nd-mobile-menu__link"
                tabIndex={menuOpen ? 0 : -1}
                onClick={closeMenu}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="nd-mobile-menu__cta">
            <a
              href={START_PROJECT_HREF}
              className="btn btn-primary"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span>Start a Project</span>
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
