import { useRef } from 'react'

import { Footer } from '@/components/footer/Footer'
import { Navbar } from '@/components/hero/Navbar'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { useLenis } from '@/hooks/lenisContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

import { AudienceBlock, WhyBlock } from './AudienceBlock'
import { Faq } from './Faq'
import { CoversBlock, DeliverablesBlock } from './ListBlock'
import { ProcessTimeline } from './ProcessTimeline'
import { ServiceHero } from './ServiceHero'

export function ServicePage({ content }) {
  const reducedMotion = usePrefersReducedMotion()
  const { velocityRef } = useLenis()
  const mainRef = useRef(null)

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CustomCursor />
      <Navbar />
      <main id="main" ref={mainRef} className="svc-page" data-service-page>
        <ServiceHero content={content} velocityRef={velocityRef} />

        {content.covers?.items?.length ? (
          <CoversBlock content={content} />
        ) : null}

        {content.deliverables?.items?.length ? (
          <DeliverablesBlock content={content} />
        ) : null}

        {content.process?.steps?.length ? (
          <ProcessTimeline content={content} />
        ) : null}

        {content.audience?.items?.length ? (
          <AudienceBlock content={content} />
        ) : null}

        {content.why?.text ? <WhyBlock content={content} /> : null}

        {content.faq?.items?.length ? <Faq content={content} /> : null}
      </main>

      <Footer
        reducedMotion={reducedMotion}
        cta={content.cta}
        related={content.related}
      />
    </>
  )
}
