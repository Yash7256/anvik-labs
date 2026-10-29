import { NdNavbar } from '@/components/nd/NdNavbar'
import { PortfolioSection } from '@/components/nd/PortfolioSection'
import { WhoWeAreSection } from '@/components/nd/WhoWeAreSection'
import { QuoteSection } from '@/components/nd/QuoteSection'
import { NdFooter } from '@/components/nd/NdFooter'

export function Projects() {
  return (
    <div className="nd-page">
      <NdNavbar />
      <main id="main" style={{ paddingTop: 'clamp(120px, 18vh, 160px)' }}>
        <div className="nd-container" style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 80px)' }}>
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>Case Studies</span>
          </div>
          <h1 className="nd-hero__title" style={{ maxWidth: '840px', margin: '0 auto 20px' }}>
            Proven work that drove <em>market growth.</em>
          </h1>
          <p className="nd-hero__desc" style={{ maxWidth: '620px', margin: '0 auto' }}>
            Explore our portfolio of high-performing advertising campaigns, digital products, and brand architecture.
          </p>
        </div>

        <PortfolioSection />
        <WhoWeAreSection />
        <QuoteSection />
      </main>
      <NdFooter />
    </div>
  )
}
