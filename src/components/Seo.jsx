import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config/site.js';

const SITE = SITE_URL.replace(/\/$/, '');
const DEFAULT_IMAGE = `${SITE}/og-image.jpg`;

export default function Seo({
  title,
  description,
  path = '/',
  jsonLd = [],
  noindex = false,
  type = 'website',
  image = DEFAULT_IMAGE,
  imageAlt = 'JustGoPDF — free online PDF tools',
}) {
  const cleanPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`;
  const url = SITE + cleanPath;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex,follow' : 'index,follow'} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="JustGoPDF" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {jsonLd.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj).replace(/</g, '\\u003c') }}
        />
      ))}
    </Helmet>
  );
}

export const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: SITE + (it.path === '/' ? '/' : `/${it.path.replace(/^\/+|\/+$/g, '')}`),
  })),
});