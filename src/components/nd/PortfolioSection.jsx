import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, useGSAP } from '@/lib/gsap'

const PROJECTS = [
  {
    num: '01',
    year: '2025',
    client: 'Clandesite',
    name: 'Scalable Design System for Global Expansion',
    tags: ['Branding', 'UI/UX System', 'Web App'],
    slug: 'creating-a-scalable-system-for-growth',
    img: 'https://framerusercontent.com/images/KhsMEuf8YeOVTfeZIX7N0GRtjts.png',
  },
  {
    num: '02',
    year: '2025',
    client: 'Fjordwave',
    name: 'Spatial Product Interface & Micro-Interactions',
    tags: ['Product Design', 'Motion', 'React'],
    slug: 'strategic-thinking-and-brand-foundations-for-dribbble',
    img: 'https://framerusercontent.com/images/N97fVKZ6SNy7gEfd3xX0AtEWXWs.png',
  },
  {
    num: '03',
    year: '2024',
    client: 'AlphaWave',
    name: 'Enterprise Platform with Sub-Second Speeds',
    tags: ['Web Architecture', 'Design System', 'SEO'],
    slug: 'data-driven-ux-decisions',
    img: 'https://framerusercontent.com/images/cQRkOw61thT0YL73tWmNOYblF0.png',
  },
  {
    num: '04',
    year: '2024',
    client: 'Stackd Lab',
    name: 'High-Conversion Lifestyle Flagship Store',
    tags: ['E-Commerce', 'Brand Identity', 'Frontend'],
    slug: 'featured-1',
    img: 'https://framerusercontent.com/images/UuFHF4dLLkC2LUYsvEwMry76BYk.png',
  },
]

export function PortfolioSection() {
  const rootRef = useRef(null)

  useGSAP(() => {
    const cards = rootRef.current?.querySelectorAll('.nd-project-card') || []
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' },
        },
      )
    })
  }, { scope: rootRef })

  return (
    <section id="portfolio" className="nd-portfolio" ref={rootRef} style={{ background: '#0A0A0A', padding: 'clamp(72px, 10vw, 120px) 0' }}>
      <div className="nd-container">
        <div className="nd-section-header" style={{ color: '#fff' }}>
          <div className="nd-badge" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
            <span className="nd-badge__dot" />
            <span>Featured Work</span>
          </div>
          <h2 className="nd-section-title" style={{ color: '#fff' }}>
            Selected work that drove <em style={{ color: 'var(--cv-accent)' }}>real impact</em>.
          </h2>
          <p className="nd-section-desc" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Explore how we combine thoughtful strategy with sub-pixel craft to create enduring digital products.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {PROJECTS.map((p) => (
            <Link
              key={p.slug}
              to={`/projects/${p.slug}`}
              className="nd-project-card"
              style={{
                textDecoration: 'none',
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.25s ease, border-color 0.25s ease',
              }}
            >
              <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />
              </div>
              <div style={{ padding: '24px 28px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    {p.client} &middot; {p.year}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: '0 0 16px', lineHeight: 1.3 }}>
                    {p.name}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {p.tags.map((t) => (
                    <span key={t} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link to="/projects" className="cv-btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  )
}
