import { Helmet } from 'react-helmet-async'

import { SITE, absoluteUrl, warnMissingSiteUrl } from '@/config/site'

export function Seo({
  title,
  description,
  path,
  type = 'website',
  image,
  imageAlt,
  jsonLd = [],
}) {
  warnMissingSiteUrl()

  const canonical = absoluteUrl(path)
  const imageUrl = image ? absoluteUrl(image) : ''

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
      {imageUrl ? <meta property="og:image:alt" content={imageAlt || title} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}
      {imageUrl ? <meta name="twitter:image:alt" content={imageAlt || title} /> : null}

      {jsonLd.filter(Boolean).map((item, index) => (
        <script key={`jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  )
}
