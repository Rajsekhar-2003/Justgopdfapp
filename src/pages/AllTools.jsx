import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Gauge, Lock, Globe2, MonitorSmartphone, MousePointerClick, SlidersHorizontal, Download } from 'lucide-react';
import Seo, { breadcrumbLd } from '../components/Seo.jsx';
import ToolCard from '../components/ToolCard.jsx';
import { PAGES, TOOLS } from '../config/toolsData.js';

const page = PAGES.find((p) => p.path === '/all-tools');

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
    items: [
      { to: '/compress-pdf', label: 'Compress PDF', desc: 'Reduce PDF size to targets such as 100KB, 200KB, 500KB or 1MB. The achievable result depends on the original file and its images, fonts and content.' },
    ],
  },
  {
    id: 'organize',
    h: 'Organize PDF pages',
    sub: 'Combine or separate documents.',
    items: [
      { to: '/merge-pdf', label: 'Merge PDF', desc: 'Combine multiple PDFs — marksheets, certificates, reports — into one file in your chosen order.' },
      { to: '/split-pdf', label: 'Split PDF', desc: 'Extract selected pages from a large PDF, or divide it into smaller files.' },
    ],
  },
  {
    id: 'secure',
    h: 'Protect PDF',
    sub: 'Add a password before sharing.',
    items: [
      { to: '/protect-pdf', label: 'Protect PDF', desc: 'Password-protect documents containing personal, financial or business information. The password you set stays on your device.' },
    ],
  },
];

export default function AllTools() {
  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        path={page.path}
        jsonLd={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'All PDF Tools', path: page.path }])]}
      />

      <div className="container tool-page">
        <header className="tool-head">
          <h1>All PDF Tools</h1>
          <p className="lead-text">
            Convert, compress, merge, split and protect PDF files. Every tool is free, requires no login, and runs in your browser — your files are not uploaded to our servers.
          </p>
        </header>
        <div className="tool-grid five">{TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}</div>
      </div>

      {/* ── Intro ── */}
      <section className="section soft">
        <div className="container narrow seo-text">
          <h2 className="h4">Free online PDF tools — no login, no watermark, no installation</h2>
          <p>
            JustGoPDF brings the everyday PDF jobs into one place. Students, job applicants, teachers, office teams, businesses and cyber café operators use these tools to convert images and documents, compress files to upload limits, combine certificates, extract single pages and protect sensitive paperwork — all from a web browser.
          </p>
          <p className="mb-0">
            Pick a tool from the grid above to start. Files are processed locally on your device, so nothing is uploaded and nothing is stored on our servers. If you are new to PDF tools, read the <Link to="/free-online-pdf-tools">step-by-step guide</Link> for detailed walkthroughs.
          </p>
        </div>
      </section>

      {/* ── Category sections ── */}
      {CATEGORIES.map((cat, i) => (
        <section className={`section ${i % 2 ? 'soft' : ''}`} key={cat.id} id={cat.id}>
          <div className="container">
            <h2 className="section-h">{cat.h}</h2>
            <p className="section-sub">{cat.sub}</p>
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

      {/* ── Why choose ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-h">Why choose JustGoPDF?</h2>
          <div className="row g-4 mt-1">{WHY.map(([Icon, h, p]) => (
            <div className="col-sm-6 col-lg-3" key={h}>
              <div className="info-card"><Icon size={28} className="text-red" aria-hidden="true" /><h3>{h}</h3><p>{p}</p></div>
            </div>
          ))}</div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section soft">
        <div className="container">
          <h2 className="section-h">How it works</h2>
          <div className="row g-4 mt-1">{STEPS.map(([Icon, h, p], i) => (
            <div className="col-md-4" key={h}>
              <div className="info-card step">
                <span className="step-no">{i + 1}</span>
                <Icon size={26} className="text-red" aria-hidden="true" />
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            </div>
          ))}</div>
        </div>
      </section>

      {/* ── Privacy ── */}
      <section className="section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h2 className="section-h text-start">Privacy and security</h2>
              <p>
                JustGoPDF tools run inside your browser. Your documents are opened, converted and saved by code on your own device — our application does not receive them. Passwords entered in the Protect PDF tool stay on your device too.
              </p>
              <p className="mb-0">
                We are open about the limits: the website itself is delivered over HTTPS from our host, which keeps standard server logs, and optional analytics never include file names or contents. Read our <Link to="/privacy-policy">Privacy Policy</Link>.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="info-card">
                <ShieldCheck size={32} className="text-red" aria-hidden="true" />
                <h3>Local processing</h3>
                <p>Close the tab and your working files are gone from the page. Nothing is stored permanently by JustGoPDF.</p>
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
            Students and government job aspirants applying through SSC, UPSC, Railway, Banking, state recruitment, college admission or scholarship portals can convert passport-size photographs and scanned certificates to PDF, compress documents to 100KB or 200KB, merge certificates into one file and extract single pages.
          </p>
          <p className="mb-0">
            Cyber cafés can do the same for customers — scanned photographs to PDF, certificates compressed to portal limits, PDF pages to JPG, certificates merged, pages extracted and documents password-protected — all from one site, with files processed on the café's own computer. Always check the portal's accepted formats, size limits and image dimensions before uploading.
          </p>
        </div>
      </section>

      {/* ── Closing SEO ── */}
      <section className="section">
        <div className="container narrow seo-text">
          <h2 className="h4">Convert, compress, merge and protect PDFs online</h2>
          <p>
            Use <Link to="/jpg-to-pdf">JPG to PDF</Link> and <Link to="/pdf-to-jpg">PDF to JPG</Link> to move between images and documents, <Link to="/pdf-to-word">PDF to Word</Link> and <Link to="/word-to-pdf">Word to PDF</Link> to work in an editable format, and <Link to="/pdf-to-excel">PDF to Excel</Link> / <Link to="/excel-to-pdf">Excel to PDF</Link> for spreadsheets and tables.
          </p>
          <p className="mb-0">
            For upload limits, <Link to="/compress-pdf">compress PDF</Link> to a target such as 200 KB or 1 MB. <Link to="/merge-pdf">Merge PDF</Link> files into one document, <Link to="/split-pdf">split PDF</Link> pages into separate files, and <Link to="/protect-pdf">protect a PDF with a password</Link> before sharing. Conversion is never perfect for every document, so each tool explains its limits before you start.
          </p>
        </div>
      </section>
    </>
  );
}