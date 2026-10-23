const YEAR = new Date().getFullYear()

const ROWS = [
  {
    id: 'products',
    title: 'Products',
    copy: 'Tools we use ourselves. Security, design and development, under one roof.',
  },
  {
    id: 'services',
    title: 'Services',
    copy: 'Design reviews, interface systems, and full-stack builds.',
  },
  {
    id: 'about',
    title: 'About',
    copy: 'A small studio. Senior people only. Working with teams everywhere.',
  },
]

export function NextSection() {
  return (
    <>
      <section id="work" className="studio">
        <div className="studio__inner">
          <p className="studio__label">Studio</p>
          <h2 className="studio__title">Built on questions, not assumptions.</h2>
          <p className="studio__intro">
            We design and engineer our own products, and take on a small number
            of freelance engagements each year.
          </p>

          <div className="studio__rows">
            {ROWS.map((row) => (
              <article key={row.id} id={row.id} className="studio__row">
                <h3>{row.title}</h3>
                <p>{row.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="site-footer">
        <div className="site-footer__inner">
          <p className="site-footer__title">Anvik Labs</p>
          <div className="site-footer__meta">
            <a href="mailto:hello@anviklabs.com" data-cursor="Talk">
              hello@anviklabs.com
            </a>
            <p>Curious by Design. Precise by Engineering.</p>
            <p>© {YEAR}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
