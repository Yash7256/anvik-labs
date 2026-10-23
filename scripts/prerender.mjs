import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { PRERENDER_ROUTES, SITEMAP_ROUTES } from '../src/config/routes.js'
import { render } from '../dist-ssr/entry-server.js'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(rootDir, 'dist')
const templatePath = path.join(distDir, 'index.html')

const siteUrl = (process.env.VITE_SITE_URL || '').replace(/\/+$/, '')

function routeFile(route) {
  if (route === '/') return path.join(distDir, 'index.html')
  return path.join(distDir, ...route.split('/').filter(Boolean), 'index.html')
}

function splitRender(html) {
  const marker = '<div id="app-shell">'
  const index = html.indexOf(marker)

  if (index === -1) {
    return { head: '', body: html }
  }

  return {
    head: html.slice(0, index),
    body: html.slice(index),
  }
}

async function inlineStyles(template) {
  const linkPattern = /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/
  const match = template.match(linkPattern)
  if (!match) return template

  const cssPath = path.join(distDir, match[1].replace(/^\//, ''))
  const css = await fs.readFile(cssPath, 'utf8')

  return template.replace(match[0], `<style>${css}</style>`)
}

function injectPage(template, head, body) {
  const root = '<div id="root"></div>'

  if (!template.includes(root)) {
    throw new Error('Could not find the root element in dist/index.html')
  }

  return template
    .replace('</head>', `${head}\n  </head>`)
    .replace(root, `<div id="root">${body}</div>`)
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

async function writeSitemap() {
  if (!siteUrl) {
    console.warn('[seo] VITE_SITE_URL is empty. Skipping sitemap.xml.')
    return
  }

  const lastmod = new Date().toISOString().slice(0, 10)
  const entries = SITEMAP_ROUTES
    .map(
      (route) =>
        `  <url>\n    <loc>${escapeXml(`${siteUrl}${route}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
    )
    .join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8')
}

async function writeRobots() {
  const lines = ['User-agent: *', 'Allow: /']
  if (siteUrl) lines.push('', `Sitemap: ${siteUrl}/sitemap.xml`)
  await fs.writeFile(path.join(distDir, 'robots.txt'), `${lines.join('\n')}\n`, 'utf8')
}

async function main() {
  const rawTemplate = await fs.readFile(templatePath, 'utf8')
  const template = await inlineStyles(rawTemplate)

  for (const route of PRERENDER_ROUTES) {
    const { head, body } = splitRender(render(route))
    const html = injectPage(template, head, body)
    const file = routeFile(route)

    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, html, 'utf8')
    console.log(`prerendered ${route} -> ${path.relative(rootDir, file)}`)
  }

  await writeSitemap()
  await writeRobots()

  if (!siteUrl) {
    console.warn('[seo] VITE_SITE_URL is empty. Canonical, og:url and sitemap omitted.')
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
