import { NdNavbar } from '@/components/nd/NdNavbar'
import { NdHero } from '@/components/nd/NdHero'
import { WhoWeAreSection } from '@/components/nd/WhoWeAreSection'
import { ServicesSection } from '@/components/nd/ServicesSection'
import { FeaturesSection } from '@/components/nd/FeaturesSection'
import { ProcessSection } from '@/components/nd/ProcessSection'
import { ReviewsSection } from '@/components/nd/ReviewsSection'
import { TeamSection } from '@/components/nd/TeamSection'
import { FaqSection } from '@/components/nd/FaqSection'
import { QuoteSection } from '@/components/nd/QuoteSection'
import { NdFooter } from '@/components/nd/NdFooter'

export function Home() {
  return (
    <div className="nd-page">
      <NdNavbar />
      <main id="main">
        <NdHero />
        <WhoWeAreSection />
        <ServicesSection />
        <FeaturesSection />
        <ProcessSection />
        <ReviewsSection />
        <TeamSection />
        <FaqSection />
        <QuoteSection />
      </main>
      <NdFooter />
    </div>
  )
}
