import { useEffect, useRef } from 'react'

import { Footer } from '@/components/footer/Footer'
import { Navbar } from '@/components/hero/Navbar'
import { useLenis } from '@/hooks/lenisContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

import { AudienceBlock, WhyBlock } from './AudienceBlock'
import { Faq } from './Faq'
import { CoversBlock, DeliverablesBlock } from './ListBlock'
import { ProcessTimeline } from './ProcessTimeline'
import { ServiceHero } from './ServiceHero'
import { StandardsBlock } from './StandardsBlock'
import { TechnologyBlock } from './TechnologyBlock'

const warnedTodoConfirm = new Set()

const DEFAULT_SECTIONS = [
  'covers',
  'deliverables',
  'process',
  'audience',
  'why',
  'faq',
]

const SECTION_COMPONENTS = {
  covers: CoversBlock,
  deliverables: DeliverablesBlock,
  standards: StandardsBlock,
  technology: TechnologyBlock,
  process: ProcessTimeline,
  audience: AudienceBlock,
  why: WhyBlock,
  faq: Faq,
}

const SPLIT_SECTIONS = new Set([
  'covers',
  'deliverables',
  'standards',
  'technology',
  'audience',
  'why',
  'faq',
])

function sectionHasContent(content, id) {
  switch (id) {
    case 'covers':
      return Boolean(content.covers?.items?.length)
    case 'deliverables':
      return Boolean(content.deliverables?.items?.length)
    case 'standards':
      return Boolean(content.standards?.items?.length)
    case 'technology':
      return Boolean(content.technology?.items?.length)
    case 'process':
      return Boolean(content.process?.steps?.length)
    case 'audience':
      return Boolean(content.audience?.items?.length)
    case 'why':
      return Boolean(content.why?.text)
    case 'faq':
      return Boolean(content.faq?.items?.length)
    default:
      return false
  }
}

function resolveSections(content) {
  const requested = Array.isArray(content.sections)
    ? content.sections
    : DEFAULT_SECTIONS
  const seen = new Set()
  const resolved = []
  let splitIndex = 0

  for (const id of requested) {
    if (seen.has(id) || !SECTION_COMPONENTS[id]) continue
    seen.add(id)

    const hasContent = sectionHasContent(content, id)
    if (!hasContent && id !== 'technology') continue

    const isSplit = SPLIT_SECTIONS.has(id)
    const autoFlip = hasContent && isSplit && splitIndex++ % 2 === 1
    const alignment = content.sectionAlign?.[id]
    const flipped =
      hasContent && alignment === 'right'
        ? true
        : hasContent && alignment === 'left'
          ? false
          : autoFlip

    resolved.push({ id, flipped })
  }

  return resolved
}

export function ServicePage({ content }) {
  const reducedMotion = usePrefersReducedMotion()
  const { velocityRef } = useLenis()
  const mainRef = useRef(null)
  const sections = resolveSections(content)

  useEffect(() => {
    if (!import.meta.env?.DEV || warnedTodoConfirm.has(content.path)) return
    warnedTodoConfirm.add(content.path)
    content.todoConfirm?.forEach((item) => {
      console.warn(`[TODO_CONFIRM] ${item}`)
    })
  }, [content])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main" ref={mainRef} className="svc-page" data-service-page>
        <ServiceHero content={content} velocityRef={velocityRef} />

        {sections.map(({ id, flipped }) => {
          const Block = SECTION_COMPONENTS[id]
          return <Block key={id} content={content} flipped={flipped} />
        })}
      </main>

      <Footer
        reducedMotion={reducedMotion}
        cta={content.cta}
        related={content.related}
      />
    </>
  )
}
