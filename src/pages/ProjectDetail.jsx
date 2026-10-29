import { useParams, Link, useLocation } from 'react-router-dom'
import { NdNavbar } from '@/components/nd/NdNavbar'
import { ALL_PROJECTS } from '@/data/neidenData'
import { ContactSection } from '@/components/nd/ContactSection'
import { NdFooter } from '@/components/nd/NdFooter'

export function ProjectDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const basePath = location.pathname.startsWith('/work') ? '/work' : '/projects'
  const project = ALL_PROJECTS.find((p) => p.slug === slug) || ALL_PROJECTS[0]
  const currentIndex = ALL_PROJECTS.findIndex((p) => p.slug === project.slug)
  const prevProject = ALL_PROJECTS[(currentIndex - 1 + ALL_PROJECTS.length) % ALL_PROJECTS.length]
  const nextProject = ALL_PROJECTS[(currentIndex + 1) % ALL_PROJECTS.length]

  return (
    <div className="nd-page">
      <NdNavbar />
      <main id="main" style={{ paddingTop: 90 }}>
        {/* Project Hero Header */}
        <section style={{ padding: 'clamp(48px, 6vw, 88px) var(--nd-gutter)', borderBottom: '1px solid var(--cv-border)' }}>
          <div className="nd-container" style={{ maxWidth: 1040, margin: '0 auto' }}>
            <div className="nd-badge">
              <span className="nd-badge__dot" />
              <span>Case Study</span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--cv-font-sans)',
                fontSize: 'clamp(36px, 5.5vw, 72px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--cv-text)',
                margin: '20px 0',
              }}
            >
              {project.title}
            </h1>
            <p
              style={{
                fontSize: 'clamp(16px, 1.4vw, 20px)',
                color: 'var(--cv-text-muted)',
                lineHeight: 1.6,
                maxWidth: 720,
              }}
            >
              {project.subtitle}
            </p>

            {/* Project Metadata Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 24,
                marginTop: 48,
                paddingTop: 32,
                borderTop: '1px solid var(--cv-border)',
              }}
            >
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--cv-text-subtle)', textTransform: 'uppercase' }}>CLIENT</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--cv-text)', marginTop: 4 }}>{project.client}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--cv-text-subtle)', textTransform: 'uppercase' }}>SERVICES</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--cv-text)', marginTop: 4 }}>{project.services}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--cv-text-subtle)', textTransform: 'uppercase' }}>TEAM</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--cv-text)', marginTop: 4 }}>{project.team}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--cv-text-subtle)', textTransform: 'uppercase' }}>STACK</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--cv-text)', marginTop: 4 }}>{project.stack}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Image */}
        <section style={{ maxWidth: 1040, margin: '48px auto 0', padding: '0 var(--nd-gutter)' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--cv-border)' }}>
            <img
              src={project.coverImage}
              alt={project.title}
              style={{ width: '100%', maxHeight: 600, objectFit: 'cover', display: 'block' }}
            />
          </div>
        </section>

        {/* Narrative & Case Sections */}
        <section style={{ padding: 'clamp(48px, 6vw, 96px) var(--nd-gutter)' }}>
          <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 56 }}>
            {/* Intro */}
            <div>
              <div className="nd-badge" style={{ marginBottom: 12 }}>
                <span className="nd-badge__dot" />
                <span>Overview & Context</span>
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--cv-text)', margin: '12px 0 16px', letterSpacing: '-0.02em' }}>
                Finding balance between visual expression and longevity
              </h2>
              <p style={{ fontSize: 16, color: 'var(--cv-text-muted)', lineHeight: 1.8 }}>
                {project.intro}
              </p>
            </div>

            {/* Challenge */}
            <div>
              <div className="nd-badge" style={{ marginBottom: 12 }}>
                <span className="nd-badge__dot" />
                <span>The Challenge</span>
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--cv-text)', margin: '12px 0 16px', letterSpacing: '-0.02em' }}>
                Turning bold visual concepts into clear identity
              </h2>
              <p style={{ fontSize: 16, color: 'var(--cv-text-muted)', lineHeight: 1.8 }}>
                {project.challenge}
              </p>
            </div>

            {/* Solution */}
            <div>
              <div className="nd-badge" style={{ marginBottom: 12 }}>
                <span className="nd-badge__dot" />
                <span>The Solution</span>
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--cv-text)', margin: '12px 0 16px', letterSpacing: '-0.02em' }}>
                Building a flexible, scalable design system
              </h2>
              <p style={{ fontSize: 16, color: 'var(--cv-text-muted)', lineHeight: 1.8 }}>
                {project.solution}
              </p>
            </div>

            {/* Metrics */}
            {project.metrics && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 24,
                  padding: 32,
                  background: 'var(--cv-surface)',
                  border: '1px solid var(--cv-border)',
                  borderRadius: 20,
                }}
              >
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--cv-accent)', margin: 0, letterSpacing: '-0.03em' }}>
                      {m.value}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--cv-text-muted)', marginTop: 4 }}>
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Testimonial */}
            {project.testimonial && (
              <div
                style={{
                  padding: 36,
                  borderLeft: '3px solid var(--cv-accent)',
                  background: 'var(--cv-surface)',
                  borderRadius: '0 16px 16px 0',
                }}
              >
                <p style={{ fontSize: 20, fontStyle: 'italic', color: 'var(--cv-text)', lineHeight: 1.6, margin: 0 }}>
                  "{project.testimonial.quote}"
                </p>
                <p style={{ fontSize: 13, color: 'var(--cv-text-muted)', marginTop: 16 }}>
                  — <strong style={{ color: 'var(--cv-text)' }}>{project.testimonial.author}</strong>, {project.testimonial.role}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <section style={{ maxWidth: 1040, margin: '0 auto', padding: '0 var(--nd-gutter) 64px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {project.gallery.map((imgUrl, i) => (
                <div key={i} style={{ aspectRatio: '16/10', overflow: 'hidden', borderRadius: 16, border: '1px solid var(--cv-border)' }}>
                  <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Prev / Next Navigation */}
        <section
          style={{
            maxWidth: 1040,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderTop: '1px solid var(--cv-border)',
            borderBottom: '1px solid var(--cv-border)',
          }}
        >
          <Link
            to={`${basePath}/${prevProject.slug}`}
            style={{
              padding: 'clamp(24px, 4vw, 48px) var(--nd-gutter)',
              textDecoration: 'none',
              color: 'var(--cv-text)',
              borderRight: '1px solid var(--cv-border)',
            }}
          >
            <span style={{ fontSize: 11, color: 'var(--cv-text-subtle)', letterSpacing: '0.08em' }}>← PREVIOUS</span>
            <h4 style={{ fontSize: 20, fontWeight: 700, margin: '8px 0 0' }}>{prevProject.title}</h4>
          </Link>
          <Link
            to={`${basePath}/${nextProject.slug}`}
            style={{
              padding: 'clamp(24px, 4vw, 48px) var(--nd-gutter)',
              textDecoration: 'none',
              color: 'var(--cv-text)',
              textAlign: 'right',
            }}
          >
            <span style={{ fontSize: 11, color: 'var(--cv-text-subtle)', letterSpacing: '0.08em' }}>NEXT PROJECT →</span>
            <h4 style={{ fontSize: 20, fontWeight: 700, margin: '8px 0 0' }}>{nextProject.title}</h4>
          </Link>
        </section>

        <ContactSection />
      </main>
      <NdFooter />
    </div>
  )
}
