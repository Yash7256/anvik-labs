import { Link } from 'react-router-dom'

import { SITE } from '@/config/site'

const hasLink = (href) => Boolean(href && href !== '#')

export function FooterColumns() {
  const columns = [
    {
      title: 'Products',
      links: [
        { label: 'Designers Room', href: SITE.routes.designersRoom },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'UI/UX design', href: SITE.routes.services.uiux },
        { label: 'Web development', href: SITE.routes.services.webdev },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: SITE.routes.about },
        { label: 'Our approach', href: SITE.routes.approach },
      ],
    },
    {
      title: 'Contact',
      links: [
        SITE.contact.email ? { label: SITE.contact.email, href: `mailto:${SITE.contact.email}` } : null,
        ...SITE.contact.socials
          .filter((item) => hasLink(item.href))
          .map((item) => ({
            label: item.label,
            href: item.href,
            external: item.external,
          })),
      ].filter(Boolean),
    },
  ]

  return (
    <nav className="footer__nav" aria-label="Footer">
      <div className="footer__columns">
        {columns.map((column) => (
          <section key={column.title} className="footer__column">
            <h3 className="footer__column-title">{column.title}</h3>
            <ul className="footer__list">
              {column.links.map((link) => {
                const isExternal = link.external || link.href.startsWith('http')
                if (link.href.startsWith('mailto:') || link.href.startsWith('tel:')) {
                  return (
                    <li key={link.label}>
                      <a className="hero-link footer__link" href={link.href}>
                        {link.label}
                      </a>
                    </li>
                  )
                }
                if (isExternal) {
                  return (
                    <li key={link.label}>
                      <a
                        className="hero-link footer__link"
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    </li>
                  )
                }
                if (link.href.startsWith('#')) {
                  return (
                    <li key={link.label}>
                      <a className="hero-link footer__link" href={link.href}>
                        {link.label}
                      </a>
                    </li>
                  )
                }
                return (
                  <li key={link.label}>
                    <Link className="hero-link footer__link" to={link.href}>
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  )
}
