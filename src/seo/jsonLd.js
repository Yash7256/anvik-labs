import { SITE, absoluteUrl } from '@/config/site'

export function buildServiceJsonLd(content) {
  const provider = {
    '@type': 'Organization',
    name: SITE.name,
  }
  const providerUrl = absoluteUrl('/')
  if (providerUrl) provider.url = providerUrl

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: content.schema?.name || content.schema?.serviceName || content.h1,
    description: content.schema?.description || content.metaDescription,
    provider,
    serviceType: content.schema?.serviceType,
  }
}

export function buildFaqJsonLd(content) {
  if (!content.faq?.items?.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function buildBreadcrumbJsonLd(content) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: content.breadcrumb.map((item, index) => {
      const isLast = index === content.breadcrumb.length - 1
      const href = item.href || content.path
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: absoluteUrl(href) || href,
        ...(isLast ? { '@id': absoluteUrl(content.path) || content.path } : {}),
      }
    }),
  }
}
