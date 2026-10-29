import { useParams, Link } from 'react-router-dom'
import { NdNavbar } from '@/components/nd/NdNavbar'
import { ALL_ARTICLES } from '@/data/neidenData'
import { SubscribeSection } from '@/components/nd/SubscribeSection'
import { ContactSection } from '@/components/nd/ContactSection'
import { NdFooter } from '@/components/nd/NdFooter'

export function BlogPost() {
  const { slug } = useParams()
  const article = ALL_ARTICLES.find((a) => a.slug === slug) || ALL_ARTICLES[0]
  const related = ALL_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2)

  return (
    <div className="nd-page">
      <NdNavbar />
      <main id="main" style={{ paddingTop: 90 }}>
        {/* Article Header */}
        <article style={{ padding: 'clamp(48px, 6vw, 88px) var(--nd-gutter)', borderBottom: '1px solid var(--cv-border)' }}>
          <div style={{ maxWidth: 840, margin: '0 auto' }}>
            <div className="nd-badge">
              <span className="nd-badge__dot" />
              <span>{article.category || 'Article'}</span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--cv-font-sans)',
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: 'var(--cv-text)',
                margin: '24px 0 20px',
              }}
            >
              {article.title}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                fontSize: 13,
                color: 'var(--cv-text-subtle)',
                paddingTop: 16,
                borderTop: '1px solid var(--cv-border)',
              }}
            >
              <span>By <strong style={{ color: 'var(--cv-text)' }}>{article.author}</strong> ({article.authorRole})</span>
              <span>·</span>
              <span>{article.date}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>
          </div>
        </article>

        {/* Hero Image */}
        <div style={{ maxWidth: 1040, margin: '48px auto 0', padding: '0 var(--nd-gutter)' }}>
          <div style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: 20, border: '1px solid var(--cv-border)' }}>
            <img
              src={article.image}
              alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Article Body */}
        <div style={{ maxWidth: 760, margin: '64px auto', padding: '0 var(--nd-gutter)' }}>
          {article.content.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: 18,
                lineHeight: 1.85,
                color: 'var(--cv-text-muted)',
                marginBottom: 28,
              }}
            >
              {p}
            </p>
          ))}

          {/* Key Takeaways */}
          <div
            style={{
              marginTop: 48,
              padding: 36,
              background: 'var(--cv-surface)',
              border: '1px solid var(--cv-border)',
              borderRadius: 20,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--cv-text)', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              Summary &amp; Guiding Principles
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, color: 'var(--cv-text-muted)', lineHeight: 1.8 }}>
              <li>Design must be tested in real production environments under varying constraints.</li>
              <li>Accessibility and performance are integral architecture layers, not optional add-ons.</li>
              <li>Clear typographic hierarchy outlasts transient aesthetic fads.</li>
            </ul>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section style={{ maxWidth: 1040, margin: '0 auto', padding: '0 var(--nd-gutter) 80px' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--cv-text)', marginBottom: 28 }}>
              Related Insights
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/blog/${rel.slug}`}
                  style={{
                    textDecoration: 'none',
                    background: 'var(--cv-surface)',
                    border: '1px solid var(--cv-border)',
                    borderRadius: 20,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                    <img src={rel.image} alt={rel.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: 24 }}>
                    <div style={{ fontSize: 11, color: 'var(--cv-accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>
                      {rel.category}
                    </div>
                    <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--cv-text)', margin: '0 0 8px', lineHeight: 1.3 }}>
                      {rel.title}
                    </h4>
                    <p style={{ fontSize: 13, color: 'var(--cv-text-muted)', margin: 0 }}>{rel.date} · {rel.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <SubscribeSection />
        <ContactSection />
      </main>
      <NdFooter />
    </div>
  )
}
