import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NdNavbar } from '@/components/nd/NdNavbar'
import { ALL_ARTICLES } from '@/data/neidenData'
import { QuoteSection } from '@/components/nd/QuoteSection'
import { NdFooter } from '@/components/nd/NdFooter'

const CATEGORIES = ['All', 'Design Systems', 'Interaction', 'Branding']

export function Blog() {
  const [filter, setFilter] = useState('All')

  const filteredArticles = ALL_ARTICLES.filter((a) => {
    if (filter === 'All') return true
    return a.category.toLowerCase().includes(filter.toLowerCase())
  })

  return (
    <div className="nd-page">
      <NdNavbar />
      <main id="main" style={{ paddingTop: 'clamp(120px, 18vh, 160px)' }}>
        {/* Header */}
        <section className="nd-container" style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 80px)' }}>
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>Articles &amp; Insights</span>
          </div>
          <h1 className="nd-hero__title" style={{ maxWidth: '840px', margin: '0 auto 20px' }}>
            Thoughts on growth, design &amp; <em>conversion.</em>
          </h1>
          <p className="nd-hero__desc" style={{ maxWidth: '600px', margin: '0 auto 36px' }}>
            Practical guides and lessons from our team on building high-converting funnels, resilient UI systems, and scaling ad campaigns.
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                style={{
                  padding: '8px 18px',
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: '999px',
                  border: filter === cat ? '1px solid var(--cv-accent)' : '1px solid var(--cv-border)',
                  background: filter === cat ? 'var(--cv-accent)' : 'var(--cv-surface)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="nd-container" style={{ marginBottom: 'clamp(64px, 10vw, 120px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {filteredArticles.map((article) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                style={{
                  background: 'var(--cv-surface)',
                  border: '1px solid var(--cv-border)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease, border-color 0.25s ease',
                }}
              >
                <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '24px 28px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--cv-text-subtle)', textTransform: 'uppercase', marginBottom: 12 }}>
                      <span style={{ color: 'var(--cv-accent)' }}>{article.category}</span>
                      <span>&middot;</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: '0 0 12px', lineHeight: 1.35 }}>
                      {article.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--cv-text-muted)', lineHeight: 1.6, margin: 0 }}>
                      {article.excerpt}
                    </p>
                  </div>
                  <div style={{ marginTop: 20, fontSize: 13, fontWeight: 600, color: 'var(--cv-accent)' }}>
                    Read Article →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <QuoteSection />
      </main>
      <NdFooter />
    </div>
  )
}
