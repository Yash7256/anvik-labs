import { NdNavbar } from '@/components/nd/NdNavbar'
import { ServicesSection } from '@/components/nd/ServicesSection'
import { FeaturesSection } from '@/components/nd/FeaturesSection'
import { ProcessSection } from '@/components/nd/ProcessSection'
import { FaqSection } from '@/components/nd/FaqSection'
import { QuoteSection } from '@/components/nd/QuoteSection'
import { NdFooter } from '@/components/nd/NdFooter'

export function Services() {
  return (
    <div className="nd-page">
      <NdNavbar />
      <main id="main" style={{ paddingTop: 'clamp(120px, 18vh, 160px)' }}>
        <div className="nd-container" style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 80px)' }}>
          <div className="nd-badge">
            <span className="nd-badge__dot" />
            <span>Our Capabilities</span>
          </div>
          <h1 className="nd-hero__title" style={{ maxWidth: '840px', margin: '0 auto 20px' }}>
            Paid advertising that delivers <em>results.</em>
          </h1>
          <p className="nd-hero__desc" style={{ maxWidth: '580px', margin: '0 auto' }}>
            Scale your brand with data-backed paid advertising across Meta, Google, and TikTok. Engineered for high ROAS and low CPA.
          </p>
        </div>

        <ServicesSection />
        <FeaturesSection />
        <ProcessSection />
        <FaqSection />
        <QuoteSection />
      </main>
      <NdFooter />
    </div>
  )
}
