import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { MagneticButton } from '@/components/ui/MagneticButton'
import { gsap, useGSAP } from '@/lib/gsap'

const LINKS = [
  { label: 'Products', to: '/#featured' },
  { label: 'Services', to: '/#services' },
  { label: 'What we do', to: '/#what-we-do' },
]

export function Navbar() {
  const navRef = useRef(null)
  const toggleRef = useRef(null)
  const [open, setOpen] = useState(false)

  useGSAP(
    () => {
      const nav = navRef.current
      if (!nav) return

      const hide = gsap.quickTo(nav, 'yPercent', {
        duration: 0.5,
        ease: 'power3.out',
      })

      let lastScroll = window.scrollY

      const onScroll = () => {
        const current = window.scrollY

        if (open) {
          hide(0)
          lastScroll = current
          return
        }

        if (current > 140 && current > lastScroll + 6) {
          hide(-120)
        } else if (current < lastScroll - 6 || current < 80) {
          hide(0)
        }

        lastScroll = current
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    },
    { scope: navRef, dependencies: [open] },
  )

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const closeMenu = () => {
    setOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <header className="site-header">
      <nav ref={navRef} className="hero-nav" data-reveal aria-label="Primary">
        <Link to="/" className="brand" aria-label="Anvik Labs home">
          <span className="brand__mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="brand__word">Anvik Labs</span>
        </Link>

        <div className="hero-nav__links">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
          <MagneticButton
            href="#contact"
            className="contact-pill"
            strength={10}
          >
            Contact
          </MagneticButton>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="menu-toggle__line" aria-hidden="true" />
          <span className="menu-toggle__line" aria-hidden="true" />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className="mobile-menu"
        data-open={open}
        aria-hidden={!open}
      >
        <div className="mobile-menu__links">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              tabIndex={open ? 0 : -1}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <a href="#contact" tabIndex={open ? 0 : -1} onClick={closeMenu}>
            Contact
          </a>
        </div>
        <p className="mobile-menu__foot">Curious by Design. Precise by Engineering.</p>
      </div>
    </header>
  )
}
