import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildServiceJsonLd,
} from '@/seo/jsonLd'
import { SITE, absoluteUrl } from '@/config/site'
import { uiUxDesign } from '@/content/services/ui-ux-design'
import { webDevelopment } from '@/content/services/web-development'

function serviceMeta(content) {
  return {
    title: content.title,
    description: content.metaDescription,
    path: content.path,
    image: SITE.seo.image,
    imageAlt: SITE.seo.imageAlt,
    jsonLd: [
      buildServiceJsonLd(content),
      buildFaqJsonLd(content),
      buildBreadcrumbJsonLd(content),
    ],
  }
}

function organizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
  }
  const url = absoluteUrl('/')
  if (url) data.url = url
  return data
}

const HOME_META = {
  title: SITE.seo.title,
  description: SITE.seo.description,
  path: '/',
  image: SITE.seo.image,
  imageAlt: SITE.seo.imageAlt,
  jsonLd: [organizationJsonLd()],
}

const ROUTE_META = {
  '/': HOME_META,
  '/services/ui-ux-design': serviceMeta(uiUxDesign),
  '/services/web-development': serviceMeta(webDevelopment),
  '/approach': {
    title: 'Our Approach | Anvik Labs',
    description:
      'How Anvik Labs works: an inquiry-first process that starts with the question, explores the constraints and builds with care.',
    path: '/approach',
    image: SITE.seo.image,
    imageAlt: SITE.seo.imageAlt,
    jsonLd: [],
  },
  '/about': {
    title: 'About Anvik Labs | Technology Studio',
    description:
      'Anvik Labs is a technology studio building secure products and precise interfaces. Curious by design, precise by engineering.',
    path: '/about',
    image: SITE.seo.image,
    imageAlt: SITE.seo.imageAlt,
    jsonLd: [organizationJsonLd()],
  },
}

export function getRouteMeta(pathname = '/') {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return ROUTE_META[normalized] || HOME_META
}
