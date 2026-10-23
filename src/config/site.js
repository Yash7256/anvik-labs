const configuredSiteUrl = import.meta.env?.VITE_SITE_URL ?? ''

// TODO_SITE_URL: set VITE_SITE_URL in the deployment environment.
export const SITE_URL = configuredSiteUrl.replace(/\/+$/, '')

let warnedMissingSiteUrl = false

export function warnMissingSiteUrl() {
  if (SITE_URL || warnedMissingSiteUrl) return
  warnedMissingSiteUrl = true
  console.warn(
    '[seo] VITE_SITE_URL is empty. Skipping canonical, og:url and sitemap.xml.',
  )
}

export function absoluteUrl(path = '/') {
  if (!SITE_URL) return ''
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export const SITE = {
  name: 'Anvik Labs',
  year: 2026,
  seo: {
    title: 'Anvik Labs — Technology Studio',
    description:
      'Anvik Labs is a technology studio building secure products and precise interfaces. Curious by design, precise by engineering.',
    image: '/og.png',
    imageAlt:
      'Anvik Labs — a technology studio. Curious by Design. Precise by Engineering.',
  },
  cta: {
    label: '● Start a project',
    headline: 'Bring us the question.',
    actionLabel: 'Work with us ↗',
    href: 'mailto:TODO_EMAIL@example.com',
  },
  contact: {
    email: 'TODO_EMAIL@example.com',
    socials: [
      { label: 'GitHub', href: 'https://github.com/TODO_GITHUB', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/TODO_LINKEDIN', external: true },
      { label: 'X', href: 'https://x.com/TODO_X', external: true },
    ],
  },
  routes: {
    designersRoom: '#featured',
    services: {
      uiux: '/services/ui-ux-design',
      webdev: '/services/web-development',
    },
    approach: '/approach',
    about: '/about',
  },
  legal: [],
}

export const getCtaHref = () => SITE.cta.href
