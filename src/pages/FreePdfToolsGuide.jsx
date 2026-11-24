import { Link } from 'react-router-dom';
import {
  ShieldCheck, Gauge, Lock, Globe2, MonitorSmartphone,
  MousePointerClick, SlidersHorizontal, Download, Zap,
} from 'lucide-react';
import Seo, { breadcrumbLd } from '../components/Seo.jsx';
import Faq from '../components/Faq.jsx';
import { SITE_FAQ, TOOLS } from '../config/toolsData.js';
import { SITE_URL } from '../config/site.js';

const PATH = '/free-online-pdf-tools';
const TITLE = 'Free Online PDF Tools – Convert JPG to PDF, PDF to JPG, Compress PDF & More';
const DESCRIPTION =
  'Free online PDF tools with no login and no watermark. Convert JPG to PDF, PDF to JPG, compress PDF to 100KB–1MB, merge, split and protect PDFs — processed privately in your browser.';
const PUBLISHED = '2024-08-01';
const UPDATED = '2025-01-15';
const AUTHOR = { '@type': 'Person', name: 'Omebox member', url: SITE_URL + '/about' };
const ORG = { '@type': 'Organization', name: 'JustGoPDF', url: SITE_URL + '/' };

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

const SECTIONS = [
  {
    id: 'jpg-to-pdf', to: '/jpg-to-pdf', tool: 'JPG to PDF',
    h: 'Convert JPG to PDF online for free',
    intro: 'Have photographs, scanned documents or certificates that need to become a PDF? Add one or more JPG (or supported PNG) images and combine them into a single PDF directly in your browser. Useful for passport-size photographs, identity documents, scanned pages and certificates on application portals.',
    steps: ['Open the JPG to PDF converter.', 'Add one or more JPG images.', 'Arrange the images in your preferred order.', 'Click Convert.', 'Download your converted PDF.'],
  },
  {
    id: 'pdf-to-jpg', to: '/pdf-to-jpg', tool: 'PDF to JPG',
    h: 'Convert PDF to JPG or PNG online',
    intro: 'Sometimes you need PDF pages as image files for sharing, editing, presentations or websites. Instead of screenshotting each page, convert the whole document at once — each page becomes an individual image.',
    steps: ['Select the PDF to JPG tool.', 'Add your PDF document.', 'Start the conversion.', 'Download your converted JPG images.'],
    tip: 'Related: PDF to PNG for lossless page images.',
  },
  {
    id: 'compress-pdf', to: '/compress-pdf', tool: 'Compress PDF',
    h: 'Compress PDF online – reduce size to 100KB, 200KB, 500KB or 1MB',
    intro: 'Many government exam portals, college admission sites, scholarship forms and job applications enforce strict size limits. Compression runs in your browser, so large files are not uploaded anywhere.',
    steps: ['Select the Compress PDF tool.', 'Add your PDF document.', 'Choose your compression target: 100KB, 200KB, 500KB or 1MB.', 'Click Compress.', 'Download your compressed PDF.'],
    tip: 'The achievable size depends on the original PDF, its images, fonts and content. Extremely small targets may require reduced image quality and cannot always be guaranteed.',
  },
  {
    id: 'merge-pdf', to: '/merge-pdf', tool: 'Merge PDF',
    h: 'Merge multiple PDF files into one document',
    intro: 'Combine marksheets, certificates and other educational documents into one file, or join reports, invoices and business paperwork — then submit a single PDF instead of managing separate files.',
    steps: ['Open the Merge PDF tool.', 'Add multiple PDF files.', 'Arrange them in your preferred order.', 'Click Merge.', 'Download your combined PDF.'],
  },
  {
    id: 'split-pdf', to: '/split-pdf', tool: 'Split PDF',
    h: 'Split PDF – extract pages from a document',
    intro: 'You rarely need the whole file. Extract only the pages you need — a chapter, a certificate, or one page of a large application — and download them as smaller PDFs.',
    steps: ['Select the Split PDF tool.', 'Add your PDF document.', 'Select the pages you want to extract.', 'Start the splitting process.', 'Download your extracted PDF files.'],
  },
  {
    id: 'protect-pdf', to: '/protect-pdf', tool: 'Protect PDF',
    h: 'Protect a PDF with a password',
    intro: 'For documents containing personal, educational, financial or business information, add password protection before sharing. The password you set stays on your device and is never transmitted to our servers.',
    steps: ['Open the Protect PDF tool.', 'Add your PDF document.', 'Enter a password and confirm it.', 'Apply the protection.', 'Download your password-protected PDF.'],
    tip: 'Use a strong, unique password and share it securely with the intended recipient. Password protection is not a substitute for secure document storage.',
  },
  {
    id: 'pdf-to-word', to: '/pdf-to-word', tool: 'PDF to Word',
    h: 'Convert PDF to Word – make documents editable',
    intro: 'When a received PDF needs further editing, convert it to Word to work with text, paragraphs and formatting in an editable file. Handy for assignments, reports and updates to existing documents.',
    steps: ['Select PDF to Word.', 'Add your PDF document.', 'Start the conversion.', 'Download the Word document.', 'Open it in a compatible word processor.'],
    tip: 'Complex layouts, scanned documents, tables and images may need extra formatting or OCR processing.',
  },
  {
    id: 'word-to-pdf', to: '/word-to-pdf', tool: 'Word to PDF',
    h: 'Word to PDF – convert documents into PDF format',
    intro: 'Word is convenient for editing; PDF is preferred for sharing, printing and submitting official documents. Convert resumes, assignments, office reports and applications into a fixed-layout PDF.',
    steps: ['Open the Word to PDF tool.', 'Add your Word document.', 'Click Convert.', 'Download your PDF file.'],
  },
  {
    id: 'pdf-to-excel', to: '/pdf-to-excel', tool: 'PDF to Excel',
    h: 'Convert PDF to Excel and Excel to PDF',
    intro: 'Working with tables often means moving between formats. Turn supported PDF tables into editable spreadsheets, or export spreadsheets to PDF for printing and submission.',
    steps: ['Use PDF to Excel to extract tables and data into an editable spreadsheet.', 'Use Excel to PDF to export a spreadsheet as a shareable PDF.'],
    tip: 'Complex tables, merged cells, scanned documents and unusual formatting may affect conversion accuracy.',
  },
];

/* Extra FAQ entries — used both visibly and in FAQPage schema. */
const EXTRA_FAQ = [
  {
    q: 'How do I convert JPG to PDF for free?',
    a: 'Open the JPG to PDF converter, add one or more JPG images, arrange them in your preferred order, click Convert, and download the resulting PDF. No account, no watermark, and no upload to a server.',
  },
  {
    q: 'How can I compress a PDF to 100KB or 200KB?',
    a: 'Use the Compress PDF tool, add your document and choose a target such as 100KB, 200KB, 500KB or 1MB. Compression runs in your browser. The achievable size depends on the original PDF, its images and page count — very small targets may require reduced image quality.',
  },
  {
    q: 'How do I merge multiple PDF files into one?',
    a: 'Use the Merge PDF tool, add two or more PDFs, arrange them in the order you want, click Merge, and download the combined PDF — useful for marksheets, certificates, invoices and reports.',
  },
  {
    q: 'How do I extract a single page from a PDF?',
    a: 'Use Split PDF, select the pages you want to keep, and download them as a smaller PDF. You share only what is needed — no need to send the whole document.',
  },
  {
    q: 'How do I add a password to a PDF?',
    a: 'Open Protect PDF, add your document, enter and confirm a password, apply the protection, and download the protected PDF. The password stays on your device and is never transmitted to our servers.',
  },
  {
    q: 'Do these free PDF tools work offline?',
    a: 'Once the page is loaded, processing itself happens locally in your browser. You still need internet access to load the site, but the file contents never leave your device.',
  },
  {
    q: 'Do I need to install anything to use these tools?',
    a: 'No. All tools run in modern desktop, tablet and phone browsers. There is nothing to install, no plugin, and no extension to download.',
  },
  {
    q: 'Are these PDF tools really free?',
    a: 'Yes. Every tool on JustGoPDF is free, requires no account, and adds no watermark to the result.',
  },
];

const ALL_FAQ = [...SITE_FAQ, ...EXTRA_FAQ];

/* ──────────────────────────  Structured data  ────────────────────────── */

const ld = [
  breadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Free Online PDF Tools', path: PATH },
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESCRIPTION,
    url: SITE_URL + PATH,
    mainEntityOfPage: { '@type': 'WebPage', '@id': SITE_URL + PATH },
    image: [SITE_URL + '/og-image.png'],
    datePublished: PUBLISHED,
    dateModified: UPDATED,
    inLanguage: 'en',
    author: AUTHOR,
    publisher: { ...ORG, logo: { '@type': 'ImageObject', url: SITE_URL + '/favicon.svg' } },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.hero-sub'],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'en',
    url: SITE_URL + PATH + '#faq',
    mainEntity: ALL_FAQ.map((f) => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
  ...SECTIONS.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: s.h,
    description: s.intro,
    url: `${SITE_URL}${PATH}#${s.id}`,
    inLanguage: 'en',
    tool: [{ '@type': 'HowToTool', name: s.tool }],
    step: s.steps.map((text, i) => ({
      '@type': 'HowToStep', position: i + 1, text,
      url: `${SITE_URL}${PATH}#${s.id}`,
    })),
  })),
];

/* ──────────────────────────  Page component  ────────────────────────── */

export default function FreePdfToolsGuide() {
  return (
    <>
      <Seo title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={ld} />

      {/* ── Hero ── */}
      <section className="section">
        <div className="container narrow">
          <ul className="trust" aria-label="Highlights">
            <li><Zap size={18} className="text-red" aria-hidden="true" /> Free, no sign-up</li>
            <li><ShieldCheck size={18} className="text-red" aria-hidden="true" /> Private, in-browser</li>
            <li><MonitorSmartphone size={18} className="text-red" aria-hidden="true" /> No installation</li>
          </ul>
          <h1 className="hero-title">
            Free Online <span className="text-red">PDF Tools</span>
          </h1>
          <p className="hero-sub">
            Convert JPG to PDF, PDF to JPG, compress to 100KB–1MB, merge, split and protect
            PDFs — free, without login, and processed privately in your browser.
          </p>
          <p className="text-muted small mb-0">
            By <Link to="/about">Omebox member</Link> · Published{' '}
            <time dateTime={PUBLISHED}>{PUBLISHED}</time> · Updated{' '}
            <time dateTime={UPDATED}>{UPDATED}</time>
          </p>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="section soft">
        <div className="container narrow seo-text">
          <p>
            PDF files are part of everyday digital life. Students, job applicants, teachers,
            office employees, businesses and cyber café operators regularly need to convert,
            compress, edit and manage documents — whether for a government job application,
            educational certificates, photographs or office paperwork.
          </p>
          <p>
            JustGoPDF brings these utilities together in one place. Open the site, choose a tool,
            add your document and finish the task in your browser. No desktop software, no
            account, and no watermark.
          </p>
          <p className="mb-0">
            <strong>Your files are processed locally</strong> — they are not uploaded to our servers.
          </p>
        </div>
      </section>

      {/* ── Table of contents (jump nav) ── */}
      <section className="section">
        <div className="container narrow">
          <h2 className="section-h">On this page</h2>
          <nav aria-label="Tool guides">
            <ol className="steps mt-3">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.h}</a>
                </li>
              ))}
              <li><a href="#faq">Frequently asked questions</a></li>
            </ol>
          </nav>
        </div>
      </section>

      {/* ── Tool table ── */}
      <section className="section soft">
        <div className="container">
          <h2 className="section-h">What can you do with JustGoPDF?</h2>
          <div className="table-responsive mt-3">
            <table className="table table-sm align-middle">
              <caption className="visually-hidden">All free JustGoPDF tools</caption>
              <thead>
                <tr>
                  <th scope="col">PDF tool</th>
                  <th scope="col">What it does</th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map((t) => {
                  const label = t.name ?? t.title ?? t.id;
                  const desc = t.desc ?? t.description ?? `Use the ${label} tool online for free.`;
                  const to = t.path ?? `/${t.id}`;
                  return (
                    <tr key={t.id}>
                      <td><Link to={to}>{label}</Link></td>
                      <td>{desc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section">
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

      {/* ── Why ── */}
      <section className="section soft">
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

      {/* ── Per-tool guide sections ── */}
      {SECTIONS.map((s, i) => (
        <section
          className={`section ${i % 2 === 0 ? 'soft' : ''}`}
          id={s.id}
          key={s.id}
        >
          <div className="container narrow seo-text">
            <h2 className="h4">{s.h}</h2>
            <p>{s.intro}</p>
            <h3 className="h6 mt-3">How to use {s.tool}</h3>
            <ol className="steps">
              {s.steps.map((st) => <li key={st}>{st}</li>)}
            </ol>
            {s.tip && <p className="mb-0">{s.tip}</p>}
            <p className="mt-3 mb-0">
              <Link to={s.to}>Open the {s.tool} tool →</Link>
            </p>
          </div>
        </section>
      ))}

      {/* ── Use cases ── */}
      <section className="section">
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
      <section className="section soft" id="faq">
        <div className="container narrow">
          <h2 className="section-h">Frequently asked questions</h2>
          <Faq items={ALL_FAQ} />
        </div>
      </section>

      {/* ── Closing internal links ── */}
      <section className="section">
        <div className="container narrow seo-text">
          <h2 className="h4">Free online PDF converter and editor</h2>
          <p>
            <Link to="/pdf-to-jpg">Convert PDF to JPG</Link> or PNG, build a PDF from photos
            with <Link to="/jpg-to-pdf">JPG to PDF</Link>, and move content between formats
            with <Link to="/pdf-to-word">PDF to Word</Link>,{' '}
            <Link to="/word-to-pdf">Word to PDF</Link>,{' '}
            <Link to="/pdf-to-excel">PDF to Excel</Link> and{' '}
            <Link to="/excel-to-pdf">Excel to PDF</Link>.
          </p>
          <p className="mb-0">
            Need a smaller file? <Link to="/compress-pdf">Compress PDF</Link> to 200 KB or
            1 MB, <Link to="/merge-pdf">merge PDF</Link> files,{' '}
            <Link to="/split-pdf">split PDF</Link> pages, or{' '}
            <Link to="/protect-pdf">protect a PDF with a password</Link>. Conversion is never
            perfect for every document, so each tool explains its limits before you start.
          </p>
        </div>
      </section>
    </>
  );
}
