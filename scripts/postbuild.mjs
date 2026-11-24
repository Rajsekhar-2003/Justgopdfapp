// Generates per-route static HTML (title/meta/canonical/OG + crawlable fallback content),
// sitemap.xml and robots.txt after `vite build`.
import fs from 'node:fs';
import path from 'node:path';
import { loadEnv } from 'vite';
import { TOOLS, PAGES, HOME, SITE_FAQ } from '../src/config/toolsData.js';
import { ARTICLES } from '../src/config/articles.js';

const env = loadEnv('production', process.cwd(), 'VITE_');
const SITE = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || 'https://justgopdf.com').replace(/\/$/, '');
const dist = path.resolve('dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const routes = [HOME, ...PAGES, ...TOOLS];

function ldFor(r) {
  const url = SITE + (r.path === '/' ? '/' : r.path);
  if (r.path === '/') {
    return [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'JustGoPDF', url: url, description: HOME.description },
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'JustGoPDF', url: url, logo: SITE + '/favicon.svg' },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: SITE_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ];
  }
  const crumbs = r.tool ? [['Home', '/'], ['All PDF Tools', '/all-tools'], [r.name, r.path]] : [['Home', '/'], [r.h1, r.path]];
  const out = [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + (p === '/' ? '/' : p) })) }];
  if (r.tool) {
    out.push({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: `JustGoPDF – ${r.name}`, url, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any (web browser)', description: r.description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } });
    out.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: r.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
    out.push({ '@context': 'https://schema.org', '@type': 'HowTo', name: `How to use ${r.name}`, step: r.how.map((t, i) => ({ '@type': 'HowToStep', position: i + 1, text: t })) });
  }
  return out;
}

function seoBlock(r) {
  const url = SITE + (r.path === '/' ? '/' : r.path);
  const img = `${SITE}/og-image.jpg`;
  return `<!--SEO-->
    <title>${esc(r.title)}</title>
    <meta name="description" content="${esc(r.description)}" data-rh="true" />
    <link rel="canonical" href="${url}" data-rh="true" />
    <meta property="og:type" content="website" data-rh="true" />
    <meta property="og:site_name" content="JustGoPDF" data-rh="true" />
    <meta property="og:title" content="${esc(r.title)}" data-rh="true" />
    <meta property="og:description" content="${esc(r.description)}" data-rh="true" />
    <meta property="og:url" content="${url}" data-rh="true" />
    <meta property="og:image" content="${img}" data-rh="true" />
    <meta name="twitter:card" content="summary_large_image" data-rh="true" />
    <meta name="twitter:title" content="${esc(r.title)}" data-rh="true" />
    <meta name="twitter:description" content="${esc(r.description)}" data-rh="true" />
    <meta name="twitter:image" content="${img}" data-rh="true" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    ${ldFor(r).map((o) => `<script type="application/ld+json" data-rh="true">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n    ')}
    <!--/SEO-->`;
}

function articleHtml(r) {
  const blocks = ARTICLES[r.id];
  if (!blocks) return '';
  const item = (x) => (Array.isArray(x) ? `<strong>${esc(x[0])}</strong>${esc(x[1])}` : esc(x));
  return blocks.map((b) => (b.t === 'ul' || b.t === 'ol' ? `<${b.t}>${b.x.map((i) => `<li>${item(i)}</li>`).join('')}</${b.t}>` : `<${b.t}>${esc(b.x)}</${b.t}>`)).join('');
}

function fallback(r) {
  const links = TOOLS.map((t) => `<li><a href="${t.path}">${esc(t.name)}</a></li>`).join('');
  return `<div id="root"><main style="font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 16px"><h1>${esc(
    r.h1 || r.title
  )}</h1><p>${esc(r.intro || r.description)}</p>${articleHtml(r)}<nav aria-label="PDF tools"><ul>${links}</ul></nav></main></div>`;
}

for (const r of routes) {
  let html = template.replace(/<!--SEO-->[\s\S]*?<!--\/SEO-->/, seoBlock(r)).replace('<div id="root"></div>', fallback(r));
  const file = r.path === '/' ? path.join(dist, 'index.html') : path.join(dist, r.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url><loc>${SITE}${r.path === '/' ? '/' : r.path}</loc><lastmod>${today}</lastmod><changefreq>${r.tool ? 'monthly' : 'yearly'}</changefreq><priority>${r.path === '/' ? '1.0' : r.tool ? '0.9' : '0.5'}</priority></url>`)
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`[postbuild] ${routes.length} routes, sitemap.xml and robots.txt written for ${SITE}`);
