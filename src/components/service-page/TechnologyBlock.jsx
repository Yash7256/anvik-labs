import { useRef } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'

import { SectionHeading } from './SectionHeading'

let warnedEmptyTechnology = false

function warnEmptyTechnology() {
  if (!import.meta.env?.DEV || warnedEmptyTechnology) return
  warnedEmptyTechnology = true
  console.warn('TODO_CONFIRM: technology list is empty')
}

function normalizeTechnology(items = []) {
  const groups = []

  for (const entry of items) {
    if (!entry) continue

    if (Array.isArray(entry.items)) {
      const names = entry.items.filter(Boolean)
      if (!names.length) continue
      groups.push({ label: entry.group || entry.label || '', items: names })
      continue
    }

    const name =
      typeof entry === 'string' ? entry : entry.name || entry.label || ''
    if (!name) continue

    const label = entry.group || ''
    let group = groups.find((item) => item.label === label)

    if (!group) {
      group = { label, items: [] }
      groups.push(group)
    }

    if (!group.items.includes(name)) group.items.push(name)
  }

  return groups
}

function ChipList({ items }) {
  return (
    <ul className="svc-tech__chips">
      {items.map((item) => (
        <li key={item} className="svc-tech__chip">
          <span className="svc-tech__dot" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function TechnologyBlock({ content, flipped = false }) {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const groups = normalizeTechnology(content.technology?.items)
  const hasLabels = groups.some((group) => group.label)

  useGSAP(
    () => {
      if (reducedMotion || !rootRef.current) return
      const chips = gsap.utils.toArray('.svc-tech__chip', rootRef.current)
      if (!chips.length) return

      gsap.fromTo(
        chips,
        { autoAlpha: 0, y: 8 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.045,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 88%',
            once: true,
            invalidateOnRefresh: true,
          },
        },
      )
    },
    { scope: rootRef, dependencies: [reducedMotion, groups.length] },
  )

  if (!groups.length) {
    warnEmptyTechnology()
    return null
  }

  return (
    <section ref={rootRef} className="svc-block" aria-labelledby="svc-tech-title">
      <div
        className={`svc-page__inner svc-block__grid svc-block__grid--split${flipped ? ' svc-block__grid--flip' : ''}`}
      >
        <div className="svc-block__heading">
          <SectionHeading id="svc-tech-title">{content.technology.h2}</SectionHeading>
        </div>
        <div className="svc-block__content">
          {hasLabels ? (
            <dl className="svc-tech">
              {groups.map((group) => (
                <div key={group.label || 'other'} className="svc-tech__group">
                  <dt className={`svc-tech__label${group.label ? '' : ' sr-only'}`}>
                    {group.label || 'Other'}
                  </dt>
                  <dd className="svc-tech__definition">
                    <ChipList items={group.items} />
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <ChipList items={groups.flatMap((group) => group.items)} />
          )}
        </div>
      </div>
    </section>
  )
}
