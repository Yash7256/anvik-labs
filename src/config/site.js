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
}
