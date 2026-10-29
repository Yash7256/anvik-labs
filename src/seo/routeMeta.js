import { absoluteUrl } from '@/config/site'

function organizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Anvik Labs',
  }
  const url = absoluteUrl('/')
  if (url) data.url = url
  return data
}

const DEFAULT_META = {
  title: 'Anvik Labs — Product Design & Development Studio',
  description:
    'A product studio that ships its own software and partners with startups and teams on UI/UX design and web development.',
  path: '/',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'Anvik Labs — Product Design & Development Studio',
  jsonLd: [organizationJsonLd()],
}

export function getRouteMeta(pathname = '/') {
  return {
    ...DEFAULT_META,
    path: pathname,
  }
}
