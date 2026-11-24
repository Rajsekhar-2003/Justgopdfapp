import { Link } from 'react-router-dom';
import Seo, { breadcrumbLd } from '../components/Seo.jsx';
import Faq from '../components/Faq.jsx';
import { PAGES, SITE_FAQ, TOOLS } from '../config/toolsData.js';
import { CONTACT_EMAIL, SITE_URL } from '../config/site.js';

const CREATOR_EMAIL = 'maityrajsekhar210@gmail.com';
const SITE_NAME = 'JustGoPDF';
const ORG_REF = { '@type': 'Organization', name: SITE_NAME, url: SITE_URL + '/' };

/* Bump these dates when a page changes materially. A stable ISO date is a
   much better freshness signal than new Date() (which changes on every
   request and looks spammy to crawlers). */
const UPDATED = {
  about: '2025-01-15',
  contact: '2025-01-15',
  blog: '2025-01-15',
  privacy: '2025-01-15',
  terms: '2025-01-15',
  disclaimer: '2025-01-15',
  faq: '2025-01-15',
};

/* ──────────────────────────  Doc wrapper  ────────────────────────── */

function Doc({
  path,
  type = 'WebPage',
  updated,
  jsonLd = [],
  noindex = false,
  children,
  faq,
}) {
  const meta = PAGES.find((p) => p.path === path);

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: meta.title,
    description: meta.description,
    url: SITE_URL + path,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL + '/' },
    publisher: ORG_REF,
    ...(updated ? { dateModified: updated } : {}),
  };

  const ld = [
    pageSchema,
    breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: meta.h1, path },
    ]),
    ...jsonLd,
  ];

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        path={path}
        jsonLd={ld}
        noindex={noindex}
      />
      <div className="container narrow doc-page">
        <h1>{meta.h1}</h1>
        {updated && (
          <p className="text-muted small">
            Last updated: <time dateTime={updated}>{updated}</time>
          </p>
        )}
        {children}
        {faq}
      </div>
    </>
  );
}

/* ──────────────────────────  About  ────────────────────────── */

const ABOUT_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Omebox member',
    email: CREATOR_EMAIL,
    jobTitle: 'Creator and maintainer of JustGoPDF',
    url: SITE_URL + '/about',
    worksFor: ORG_REF,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL + '/',
    email: CONTACT_EMAIL,
    founder: { '@type': 'Person', name: 'Omebox member' },
    foundingDate: '2024',
    knowsAbout: ['PDF conversion', 'PDF compression', 'Browser-based document processing'],
  },
];

export const About = () => (
  <Doc path="/about" type="AboutPage" updated={UPDATED.about} jsonLd={ABOUT_LD}>
    <p className="lead-text">
      JustGoPDF exists for one reason: the everyday PDF jobs that shouldn't be a chore — and shouldn't cost you your privacy either.
    </p>

    <h2>Why we built this</h2>
    <p>
      Somewhere between "I just need to merge these two PDFs" and "why is this file too big to upload?" there is a small moment of frustration that millions of people hit every week. Students fighting a 200 KB portal limit. A job applicant trying to combine a dozen certificates at midnight. A cyber café operator helping a queue of customers who all need the same three clicks.
    </p>
    <p>
      We built JustGoPDF so that moment doesn't need a software download, a sign-up form, or a small prayer about whether your passport scan is sitting on someone else's server.
    </p>

    <h2>What we do</h2>
    <p>
      Ten browser-based tools: <Link to="/pdf-to-jpg">PDF to JPG</Link> and PNG, <Link to="/jpg-to-pdf">JPG to PDF</Link> and <Link to="/png-to-pdf">PNG to PDF</Link>, <Link to="/pdf-to-word">PDF to Word</Link>, <Link to="/word-to-pdf">Word to PDF</Link>, <Link to="/pdf-to-excel">PDF to Excel</Link>, <Link to="/excel-to-pdf">Excel to PDF</Link>, <Link to="/compress-pdf">Compress PDF</Link>, <Link to="/merge-pdf">Merge PDF</Link>, <Link to="/split-pdf">Split PDF</Link> and <Link to="/protect-pdf">Protect PDF</Link>. Each one has its own page, its own settings, and — this matters to us — its own plain-language notes about what it can and cannot do.
    </p>

    <h2>How it works</h2>
    <p>
      Files are processed locally in your browser using open-source libraries. They are not uploaded to an application server. Your documents never leave your device. We would much rather tell you what a tool can't do than pretend every conversion is perfect.
    </p>

    <h2>Who it's for</h2>
    <p>
      Students, teachers, office professionals, small businesses, cyber café operators and anyone who just needs a quick fix without an account. <Link to="/all-tools">Browse all tools</Link> and see if we've built the one you needed.
    </p>

    <h2>Who built it</h2>
    <p>
      JustGoPDF was created and is maintained by an <strong>Omebox member</strong> — one person who got tired of the usual "upload your file to our server and hope for the best" routine and decided to build something private, fast and genuinely free.
    </p>
    <p>
      If something works well, or something breaks, that same person is on the other end of the inbox. Write to <a href={`mailto:${CREATOR_EMAIL}`}>{CREATOR_EMAIL}</a> — it goes straight to the maker, not a support queue.
    </p>
  </Doc>
);

/* ──────────────────────────  Contact  ────────────────────────── */

const CONTACT_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: CONTACT_EMAIL,
    availableLanguage: ['en'],
    areaServed: 'Worldwide',
  },
];

export const Contact = () => (
  <Doc path="/contact" type="ContactPage" updated={UPDATED.contact} jsonLd={CONTACT_LD}>
    <p className="lead-text">
      Found a bug? Need a tool we don't have yet? Or just want to tell us something worked? We genuinely want to hear it.
    </p>

    <p>You can reach us at either of these addresses:</p>
    <ul>
      <li>General support: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
      <li>Creator — Omebox member: <a href={`mailto:${CREATOR_EMAIL}`}>{CREATOR_EMAIL}</a></li>
    </ul>

    <p>
      The second address goes straight to the person who built JustGoPDF (an Omebox member). If you have a specific idea for a new tool, a tricky bug, or a story about how a PDF tool saved your day, that inbox is the right one.
    </p>

    <p>
      A small request: please don't attach confidential documents. If a conversion misbehaves, tell us the tool, your browser and device, and describe what went wrong — that gives us far more to work with than the file itself.
    </p>

    <p>
      We read every message. We can't always promise an individual reply, but every report shapes what we build next.
    </p>
  </Doc>
);

/* ──────────────────────────  Blog  ────────────────────────── */

/* Ideally each post lives at its own route, e.g. /blog/reduce-pdf-under-1-mb.
   Until that is set up, each post is anchored (#slug) and gets a
   BlogPosting schema so Google can still recognise them as articles. */
const POSTS = [
  {
    slug: 'reduce-pdf-under-1-mb',
    t: 'How to reduce a PDF to under 1 MB without ruining it',
    date: '2024-06-15',
    updated: '2025-01-10',
    excerpt:
      'Most oversized PDFs are large because of images, not text — here is how to shrink them without destroying legibility.',
    body: [
      'Most oversized PDFs are large because of images, not text. That is actually good news — it means you have room to work with before anything important gets blurry.',
      'Start with a gentle compression level and check the result. If a portal is forcing a hard limit, pick a target size and accept that the tool will do its best within the constraints of the original file.',
      'A last-resort trick: convert pages to pictures. The file gets small fast, but your text stops being selectable or searchable. Use it only when nothing else fits.',
    ],
    related: [
      { to: '/compress-pdf', label: 'Compress PDF' },
      { to: '/pdf-to-jpg', label: 'PDF to JPG' },
    ],
  },
  {
    slug: 'password-vs-permissions',
    t: 'Password protection vs. permissions: what is the difference?',
    date: '2024-09-02',
    updated: '2025-01-10',
    excerpt:
      'Encryption and permission flags are often confused. Only one of them actually stops someone from reading the file.',
    body: [
      'An open password actually encrypts the document. Without it, nobody reads the contents — full stop.',
      'Permissions like "no printing" or "no copying" are flags that compliant viewers agree to respect. Some tools quietly ignore them, so treat permissions as a courtesy, not a lock.',
      'One golden rule: always keep an unprotected original somewhere safe. A forgotten password cannot be recovered — not by us, not by anyone.',
    ],
    related: [{ to: '/protect-pdf', label: 'Protect PDF' }],
  },
  {
    slug: 'why-pdf-to-word-is-imperfect',
    t: 'Why PDF to Word never looks perfect',
    date: '2024-11-20',
    updated: '2025-01-10',
    excerpt:
      'A PDF stores where text sits on a page, not what the page means. Converting back to Word means guessing the structure — and guessing is never perfect.',
    body: [
      'A PDF doesn\'t store paragraphs or tables. It stores where each piece of text sits on a page. Converting means guessing the structure back — and guessing is never perfect.',
      'Text-based, single-column documents convert cleanly. Scanned pages are just pictures, and they need OCR, which is an entirely different technology.',
      'Plan to proofread the converted file, especially headings, tables and lists. It will be close. It will rarely be exact.',
    ],
    related: [
      { to: '/pdf-to-word', label: 'PDF to Word' },
      { to: '/word-to-pdf', label: 'Word to PDF' },
    ],
  },
];

const BLOG_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'JustGoPDF Blog',
    url: SITE_URL + '/blog',
    description:
      'Short, practical guides for the PDF problems people actually run into.',
    inLanguage: 'en',
    publisher: ORG_REF,
    blogPost: POSTS.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.t,
      url: `${SITE_URL}/blog#${p.slug}`,
      datePublished: p.date,
      dateModified: p.updated,
      author: { '@type': 'Person', name: 'Omebox member', url: SITE_URL + '/about' },
      publisher: ORG_REF,
      mainEntityOfPage: `${SITE_URL}/blog#${p.slug}`,
      inLanguage: 'en',
      description: p.excerpt,
    })),
  },
  ...POSTS.map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.t,
    url: `${SITE_URL}/blog#${p.slug}`,
    datePublished: p.date,
    dateModified: p.updated,
    author: { '@type': 'Person', name: 'Omebox member', url: SITE_URL + '/about' },
    publisher: ORG_REF,
    mainEntityOfPage: `${SITE_URL}/blog#${p.slug}`,
    inLanguage: 'en',
    description: p.excerpt,
  })),
];

export const Blog = () => (
  <Doc path="/blog" type="Blog" updated={UPDATED.blog} jsonLd={BLOG_LD}>
    <p className="lead-text">
      Short, practical guides for the PDF problems people actually run into.
    </p>
    {POSTS.map((p) => (
      <article key={p.slug} id={p.slug} className="post">
        <h2>{p.t}</h2>
        <p className="text-muted small">
          By <Link to="/about">Omebox member</Link> · Published{' '}
          <time dateTime={p.date}>{p.date}</time>
          {p.updated !== p.date && (
            <> · Updated <time dateTime={p.updated}>{p.updated}</time></>
          )}
        </p>
        {p.body.map((x) => <p key={x}>{x}</p>)}
        <p className="mb-0">
          Try it:{' '}
          {p.related.map((r, i) => (
            <span key={r.to}>
              <Link to={r.to}>{r.label}</Link>
              {i < p.related.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </p>
      </article>
    ))}
    <p>
      Want more step-by-step walkthroughs? See the{' '}
      <Link to="/all-tools">complete list of free PDF tools</Link>.
    </p>
  </Doc>
);

/* ──────────────────────────  Privacy  ────────────────────────── */

export const Privacy = () => (
  <Doc path="/privacy-policy" type="PrivacyPolicy" updated={UPDATED.privacy}>
    <p>
      Here is what JustGoPDF does — and does not do — with your information.
    </p>

    <h2>Your files</h2>
    <p>
      JustGoPDF tools process files inside your web browser. Our application code does not upload your documents or passwords to an application server, and we do not store them. Files exist only in your browser's memory while you work, and are released the moment you reset a tool or close the page.
    </p>
    <p>
      In plain terms: if someone asked us to produce a copy of your PDF, we couldn't — because we never had it.
    </p>

    <h2>Information we may collect</h2>
    <p>
      Our hosting provider (Cloudflare) processes standard technical data such as IP address and requested URLs to deliver and protect the site. If analytics is enabled, we may collect aggregated usage data such as pages viewed and device type. We never send file names, file contents or passwords to analytics.
    </p>

    <h2>Local storage</h2>
    <p>
      We store only your light/dark theme preference in your browser's local storage. That's it.
    </p>

    <h2>Cookies</h2>
    <p>
      JustGoPDF does not set advertising cookies. If analytics is enabled, the analytics provider may set its own cookies.
    </p>

    <h2>Third parties</h2>
    <p>
      The website is delivered from a third-party host and CDN. Our PDF tools use open-source libraries that run locally in your browser.
    </p>

    <h2>Your choices</h2>
    <p>
      You can clear site data in your browser at any time. Questions? Head to our{' '}
      <Link to="/contact">contact page</Link> — we're happy to clarify anything here.
    </p>
  </Doc>
);

/* ──────────────────────────  Terms  ────────────────────────── */

export const Terms = () => (
  <Doc path="/terms-and-conditions" type="TermsOfService" updated={UPDATED.terms}>
    <p className="lead-text">
      Plain-English terms for using JustGoPDF. If something here surprises you, tell us and we'll explain it properly.
    </p>

    <h2>Use of the service</h2>
    <p>
      JustGoPDF is provided free of charge. You agree to use it lawfully and only with files you have the right to process.
    </p>

    <h2>No warranty</h2>
    <p>
      The tools are provided "as is", without warranties of any kind. Conversion results may differ from the original, and we do not guarantee accuracy, completeness or fitness for a particular purpose. Always check results before relying on them — especially for anything official.
    </p>

    <h2>Limitation of liability</h2>
    <p>
      To the extent permitted by law, JustGoPDF is not liable for loss of data, lost profits or other damages arising from use of the service. Please keep backups of important documents. This is the one paragraph we wish we didn't need.
    </p>

    <h2>Changes</h2>
    <p>
      We may change the service or these terms at any time. Continued use means you accept the updated terms.
    </p>
  </Doc>
);

/* ──────────────────────────  Disclaimer  ────────────────────────── */

export const Disclaimer = () => (
  <Doc path="/disclaimer" updated={UPDATED.disclaimer}>
    <p>
      JustGoPDF tools run in your browser and rely on automated processing. Being upfront about the limits helps you use them well:
    </p>
    <ul>
      <li>Conversions between PDF, Word and Excel are approximations and may not preserve layout, fonts, tables or images.</li>
      <li>Scanned documents are not converted (no OCR) — a scanned page is a picture, and we don't pretend otherwise.</li>
      <li>Compression targets are goals, not guarantees. Actual size depends on the content of your file.</li>
      <li>Password protection is only as strong as the password you choose, and permission restrictions are not enforced by all software.</li>
      <li>Always review results, especially for legal, financial or medical documents.</li>
    </ul>
    <p>
      Nothing on this site is legal, financial or professional advice.
    </p>
  </Doc>
);

/* ──────────────────────────  FAQ  ────────────────────────── */

const FAQ_PAGE_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'en',
    url: SITE_URL + '/faq',
    mainEntity: [
      ...SITE_FAQ,
      ...TOOLS.flatMap((t) => t.faq || []),
    ].map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
];

export const FaqPage = () => (
  <Doc path="/faq" type="FAQPage" updated={UPDATED.faq} jsonLd={FAQ_PAGE_LD} faq={null}>
    <p className="lead-text">
      Everything people ask us most, plus tool-specific answers.
    </p>
    <Faq items={SITE_FAQ} />
    <h2>Tool-specific questions</h2>
    {TOOLS.map((t) => (
      <section key={t.id}>
        <h3 className="h5"><Link to={`/${t.id}`}>{t.name}</Link></h3>
        <Faq items={t.faq} />
      </section>
    ))}
  </Doc>
);

/* ──────────────────────────  404  ────────────────────────── */

export function NotFound() {
  return (
    <>
      <Seo
        title="Page not found | JustGoPDF"
        description="This page could not be found. Browse the free online PDF tools or head back to the homepage."
        path="/404"
        noindex
      />
      <div className="container narrow doc-page text-center">
        <h1>Page not found</h1>
        <p className="lead-text">
          This page has moved on, or maybe it never existed. Either way, no harm done.
        </p>
        <p>
          Head back to the tools and pick up where you left off — your files are still on
          your device, untouched.
        </p>
        <p>
          <Link to="/all-tools" className="btn btn-red me-2">Browse all PDF tools</Link>
          <Link to="/" className="btn btn-outline-secondary">Go to homepage</Link>
        </p>
      </div>
    </>
  );
}
