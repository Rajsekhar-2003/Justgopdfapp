import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, Gauge, Lock, Globe2, MonitorSmartphone,
  MousePointerClick, SlidersHorizontal, Download,
} from 'lucide-react';
import Seo, { breadcrumbLd } from '../components/Seo.jsx';
import ToolCard from '../components/ToolCard.jsx';
import Faq from '../components/Faq.jsx';
import { PAGES, TOOLS } from '../config/toolsData.js';
import { SITE_URL } from '../config/site.js';

const page = PAGES.find((p) => p.path === '/all-tools');

/* ──────────────────────────  Static content  ────────────────────────── */

const WHY = [
  [Gauge, 'Fast', 'Work happens on your device, so there is no upload or download queue.'],
  [Lock, 'Private by design', 'Documents are processed in your browser and are not sent to our servers.'],
  [Globe2, 'Free, no sign-up', 'Use every tool without an account or watermark.'],
  [MonitorSmartphone, 'Works everywhere', 'Responsive on desktop, tablet and phone, in light or dark mode.'],
];

const STEPS = [
  [MousePointerClick, 'Choose a tool', 'Pick the conversion or action you need.'],
  [SlidersHorizontal, 'Add files and adjust', 'Drop in your files and set the options.'],
  [Download, 'Download the result', 'Get your file straight from the browser.'],
];

const CATEGORIES = [
  {
    id: 'convert',
    h: 'Convert PDF files',
    sub: 'Move between PDF, images, Word and Excel.',
    body: 'Switch between PDF and the formats you actually work in. Combine JPG or PNG photos into one PDF for applications and certificates, export every page of a PDF into separate JPG or PNG images for the web and slides, and move text and tables between PDF, Word and Excel without retyping. Each converter runs entirely in your browser — no files are uploaded.',
    items: [
      { to: '/jpg-to-pdf', label: 'JPG to PDF', desc: 'Combine JPG photos into a single PDF — great for scanned pages, ID photos and certificates.' },
      { to: '/png-to-pdf', label: 'PNG to PDF', desc: 'Turn PNG images into a PDF, keeping transparency where the source allows it.' },
      { to: '/pdf-to-jpg', label: 'PDF to JPG', desc: 'Export every PDF page as an individual JPG image for sharing, slides or the web.' },
      { to: '/pdf-to-png', label: 'PDF to PNG', desc: 'Convert PDF pages into PNG images for lossless screenshots and website uploads.' },
      { to: '/pdf-to-word', label: 'PDF to Word', desc: 'Turn a PDF into an editable Word document so you can edit text and formatting.' },
      { to: '/word-to-pdf', label: 'Word to PDF', desc: 'Convert resumes, reports and applications into fixed-layout PDFs for submission.' },
      { to: '/pdf-to-excel', label: 'PDF to Excel', desc: 'Extract supported PDF tables into editable spreadsheets.' },
      { to: '/excel-to-pdf', label: 'Excel to PDF', desc: 'Export spreadsheets to PDF for printing, sharing and official submission.' },
    ],
  },
  {
    id: 'compress',
    h: 'Compress PDF',
    sub: 'Hit the file-size limits that portals enforce.',
    body: 'Many government exam portals, college admission sites, scholarship forms and job applications enforce strict upload limits — commonly 100KB, 200KB, 500KB or 1MB. Use Compress PDF to reduce file size while keeping the document readable. Compression runs locally; the achievable result depends on the original file, its images, fonts and page count. Extremely small targets may require reduced image quality.',
    items: [
      { to: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce PDF size to targets such as 100KB, 200KB, 500KB or 1MB. The achievable result depends on the original file and its images, fonts and content.' },
    ],
  },
  {
    id: 'organize',
    h: 'Organize PDF pages',
    sub: 'Combine or separate documents.',
    body: 'Join marksheets, certificates, invoices or reports into one file with Merge PDF — then submit a single document instead of managing separate attachments. When you only need part of a file, use Split PDF to extract selected pages or divide a large document into smaller PDFs.',
    items: [
      { to: '/merge-pdf', label: 'Merge PDF', desc: 'Combine multiple PDFs — marksheets, certificates, reports — into one file in your chosen order.' },
      { to: '/split-pdf', label: 'Split PDF', desc: 'Extract selected pages from a large PDF, or divide it into smaller files.' },
    ],
  },
  {
    id: 'secure',
    h: 'Protect PDF',
    sub: 'Add a password before sharing.',
    body: 'Before emailing a document that contains personal, educational, financial or business information, add password protection with Protect PDF. The password you set stays on your device and is never transmitted to our servers, so you remain in control of who can open the file.',
    items: [
      { to: '/protect-pdf', label: 'Protect PDF', desc: 'Password-protect documents containing personal, financial or business information. The password you set stays on your device.' },
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: 'Which PDF tool should I use?',
    a: 'Pick by task: use JPG to PDF or PNG to PDF to combine images; PDF to JPG or PDF to PNG to turn pages into images; Word to PDF or PDF to Word to work in an editable format; Excel to PDF or PDF to Excel for spreadsheets; Compress PDF to hit upload limits; Merge PDF and Split PDF to combine or separate files; and Protect PDF to add a password before sharing.',
  },
  {
    q: 'Are all JustGoPDF tools free?',
    a: 'Yes. Every tool on JustGoPDF is free to use, requires no account, and adds no watermark to the result.',
  },
  {
    q: 'Are my files uploaded to a server?',
    a: 'No. All tools process files locally in your browser — nothing is uploaded and nothing is stored on our servers. Passwords set in Protect PDF also stay on your device.',
  },
  {
    q: 'How do I compress a PDF to 100KB, 200KB, 500KB or 1MB?',
    a: 'Open the Compress PDF tool, add your document and choose your target size. Compression runs locally; the achievable result depends on the original file, its images and page count. Very small targets may need reduced image quality and cannot always be guaranteed.',
  },
  {
    q: 'Can I merge several PDF files into one document?',
    a: 'Yes. Merge PDF combines multiple PDFs into a single file in the order you choose — useful for marksheets, certificates, invoices and reports.',
  },
  {
    q: 'Can I extract only one page from a large PDF?',
    a: 'Yes. Split PDF lets you select the pages you want and download them as a smaller PDF, so you only share what is needed.',
  },
  {
    q: 'Do I need to install software to use these tools?',
    a: 'No. Everything runs in your browser. There is nothing to install, no plugin, and no extension to download.',
  },
  {
    q: 'Can I use these tools on a phone or tablet?',
    a: 'Yes. The site is responsive and works on modern desktop browsers, tablets and phones in both light and dark mode.',
  },
];

/* ──────────────────────────  Structured data  ────────────────────────── */

const ld = [
  breadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'All PDF Tools', path: page.path },
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All PDF Tools',
    description: page.description,
    url: SITE_URL + page.path,
    hasPart: TOOLS.map((t) => ({
      '@type': 'SoftwareApplication',
      name: t.name,
      url: SITE_URL + (t.path || `/tool/${t.id}`),
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free online PDF tools',
    itemListElement: TOOLS.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      url: SITE_URL + (t.path || `/tool/${t.id}`),
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Compress PDF to 100KB, 200KB, 500KB or 1MB',
    description: 'Reduce PDF file size online for free, entirely in your browser.',
    step: [
      { '@type': 'HowToStep', position: 1, text: 'Select the Compress PDF tool.' },
      { '@type': 'HowToStep', position: 2, text: 'Add your PDF document.' },
      { '@type': 'HowToStep', position: 3, text: 'Choose your target: 100KB, 200KB, 500KB or 1MB.' },
      { '@type': 'HowToStep', position: 4, text: 'Click Compress.' },
      { '@type': 'HowToStep', position: 5, text: 'Download your compressed PDF.' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
];

/* ──────────────────────────  Page component  ────────────────────────── */

export default function AllTools() {
  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        path={page.path}
        jsonLd={ld}
      />

      <div className="container tool-page">
        <header className="tool-head">
          <h1>All PDF Tools — Free Online PDF Converter, Compressor &amp; Editor</h1>
          <p className="lead-text">
            Convert, compress, merge, split and protect PDF files. Every tool is free,
            requires no login, and runs in your browser — your files are not uploaded to our servers.
          </p>

          {/* Jump nav — anchor links to categories (helps sitelinks + UX) */}
          <nav aria-label="Tool categories" className="mt-3">
            <ul className="list-inline mb-0">
              {CATEGORIES.map((c) => (
                <li className="list-inline-item me-3" key={c.id}>
                  <a href={`#${c.id}`} className="fw-semibold">{c.h}</a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <div className="tool-grid five mt-4">
          {TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
        </div>
      </div>

      {/* ── Intro ── */}
      <section className="section soft">
        <div className="container narrow seo-text">
          <h2 className="h4">Free online PDF tools — no login, no watermark, no installation</h2>
          <p>
            JustGoPDF brings the everyday PDF jobs into one place. Students, job applicants,
            teachers, office teams, businesses and cyber café operators use these tools to
            convert images and documents, compress files to upload limits, combine certificates,
            extract single pages and protect sensitive paperwork — all from a web browser.
          </p>
          <p className="mb-0">
            Pick a tool from the grid above to start. Files are processed locally on your device,
            so nothing is uploaded and nothing is stored on our servers. If you are new to PDF
            tools, read the <Link to="/free-online-pdf-tools">step-by-step guide</Link> for
            detailed walkthroughs, compression targets and privacy notes.
          </p>
        </div>
      </section>

      {/* ── Category sections ── */}
      {CATEGORIES.map((cat, i) => (
        <section className={`section ${i % 2 ? 'soft' : ''}`} key={cat.id} id={cat.id}>
          <div className="container">
            <h2 className="section-h">{cat.h}</h2>
            <p className="section-sub">{cat.sub}</p>

            {cat.body && (
              <p className="text-muted mb-4" style={{ maxWidth: '75ch' }}>
                {cat.body}
              </p>
            )}

            <div className="row g-4 mt-1">
              {cat.items.map((item) => (
                <div className="col-md-6 col-lg-4" key={item.to}>
                  <div className="info-card h-100">
                    <h3 className="h5 mb-2">
                      <Link to={item.to}>{item.label}</Link>
                    </h3>
                    <p className="mb-2">{item.desc}</p>
                    <Link to={item.to} className="fw-semibold">
                      Open {item.label} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── Popular-size / long-tail SEO block ── */}
      <section className="section soft">
        <div className="container narrow seo-text">
          <h2 className="h4">Compress PDF to 100KB, 200KB, 500KB or 1MB</h2>
          <p>
            Government exam portals (SSC, UPSC, Railway, Banking), college admission sites,
            scholarship forms and job applications often cap uploads at{' '}
            <Link to="/compress-pdf">100KB, 200KB, 500KB or 1MB</Link>. Open Compress PDF,
            add your document and choose the target — compression runs locally in your browser.
            The achievable size depends on the original PDF, its images, fonts and page count;
            very small targets may require reduced image quality.
          </p>
          <h2 className="h4 mt-4">Merge and split PDFs online free</h2>
          <p className="mb-0">
            <Link to="/merge-pdf">Merge PDF</Link> joins marksheets, certificates, invoices
            or reports into one file in the order you choose.{' '}
            <Link to="/split-pdf">Split PDF</Link> extracts the pages you actually need —
            a chapter, a certificate or a single page of a large application — and downloads
            them as smaller PDFs. Both tools work locally: no upload, no account, no watermark.
          </p>
        </div>
      </section>

      {/* ── Why choose ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-h">Why choose JustGoPDF?</h2>
          <div className="row g-4 mt-1">
            {WHY.map(([Icon, h, p]) => (
              <div className="col-sm-6 col-lg-3" key={h}>
                <div className="info-card">
                  <Icon size={28} className="text-red" aria-hidden="true" />
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section soft">
        <div className="container">
          <h2 className="section-h">How it works</h2>
          <div className="row g-4 mt-1">
            {STEPS.map(([Icon, h, p], i) => (
              <div className="col-md-4" key={h}>
                <div className="info-card step">
                  <span className="step-no">{i + 1}</span>
                  <Icon size={26} className="text-red" aria-hidden="true" />
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Privacy ── */}
      <section className="section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h2 className="section-h text-start">Privacy and security</h2>
              <p>
                JustGoPDF tools run inside your browser. Your documents are opened, converted
                and saved by code on your own device — our application does not receive them.
                Passwords entered in the Protect PDF tool stay on your device too.
              </p>
              <p className="mb-0">
                We are open about the limits: the website itself is delivered over HTTPS from
                our host, which keeps standard server logs, and optional analytics never include
                file names or contents. Read our{' '}
                <Link to="/privacy-policy">Privacy Policy</Link>.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="info-card">
                <ShieldCheck size={32} className="text-red" aria-hidden="true" />
                <h3>Local processing</h3>
                <p>
                  Close the tab and your working files are gone from the page.
                  Nothing is stored permanently by JustGoPDF.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="section soft">
        <div className="container narrow seo-text">
          <h2 className="h4">Helpful for students, job applicants and cyber cafés</h2>
          <p>
            Students and government job aspirants applying through SSC, UPSC, Railway, Banking,
            state recruitment, college admission or scholarship portals can convert
            passport-size photographs and scanned certificates to PDF with{' '}
            <Link to="/jpg-to-pdf">JPG to PDF</Link>,{' '}
            <Link to="/compress-pdf">compress documents</Link> to 100KB or 200KB,{' '}
            <Link to="/merge-pdf">merge certificates</Link> into one file and{' '}
            <Link to="/split-pdf">extract single pages</Link>.
          </p>
          <p className="mb-0">
            Cyber cafés can do the same for customers — scanned photographs to PDF, certificates
            compressed to portal limits, PDF pages to JPG, certificates merged, pages extracted
            and documents password-protected — all from one site, with files processed on the
            café's own computer. Always check the portal's accepted formats, size limits and
            image dimensions before uploading.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section">
        <div className="container narrow">
          <h2 className="section-h">Frequently asked questions</h2>
          <Faq items={FAQ_ITEMS} />
        </div>
      </section>

      {/* ── Closing internal-links block ── */}
      <section className="section soft">
        <div className="container narrow seo-text">
          <h2 className="h4">Convert, compress, merge and protect PDFs online</h2>
          <p>
            Use <Link to="/jpg-to-pdf">JPG to PDF</Link> and{' '}
            <Link to="/pdf-to-jpg">PDF to JPG</Link> to move between images and documents,{' '}
            <Link to="/pdf-to-word">PDF to Word</Link> and{' '}
            <Link to="/word-to-pdf">Word to PDF</Link> to work in an editable format, and{' '}
            <Link to="/pdf-to-excel">PDF to Excel</Link> /{' '}
            <Link to="/excel-to-pdf">Excel to PDF</Link> for spreadsheets and tables.
          </p>
          <p className="mb-0">
            For upload limits, <Link to="/compress-pdf">compress PDF</Link> to a target such
            as 200 KB or 1 MB. <Link to="/merge-pdf">Merge PDF</Link> files into one document,{' '}
            <Link to="/split-pdf">split PDF</Link> pages into separate files, and{' '}
            <Link to="/protect-pdf">protect a PDF with a password</Link> before sharing.
            Conversion is never perfect for every document, so each tool explains its limits
            before you start.
          </p>
        </div>
      </section>
    </>
  );
}
