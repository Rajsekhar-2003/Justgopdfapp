import { Link } from 'react-router-dom';
import { ShieldCheck, Gauge, Lock, Globe2, MonitorSmartphone, MousePointerClick, SlidersHorizontal, Download, Zap } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Faq from '../components/Faq.jsx';
import { SITE_FAQ, TOOLS } from '../config/toolsData.js';
import { SITE_URL } from '../config/site.js';

const PATH = '/free-online-pdf-tools';
const TITLE = 'Free Online PDF Tools – Convert JPG to PDF, PDF to JPG, Compress PDF & More';
const DESCRIPTION =
  'Free online PDF tools with no login and no watermark. Convert JPG to PDF, PDF to JPG, compress PDF to 100KB–1MB, merge, split and protect PDFs — processed privately in your browser.';

const ld = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESCRIPTION,
    mainEntityOfPage: SITE_URL + PATH,
    author: { '@type': 'Organization', name: 'JustGoPDF' },
    publisher: { '@type': 'Organization', name: 'JustGoPDF', logo: { '@type': 'ImageObject', url: SITE_URL + '/favicon.svg' } },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SITE_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
];

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

// Each entry mirrors an existing tool route so links stay internal.
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

export default function FreePdfToolsGuide() {
  return (
    <>
      <Seo title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={ld} />

      <section className="section">
        <div className="container narrow">
          <ul className="trust" aria-label="Highlights">
            <li><Zap size={18} className="text-red" aria-hidden="true" /> Free, no sign-up</li>
            <li><ShieldCheck size={18} className="text-red" aria-hidden="true" /> Private, in-browser</li>
            <li><MonitorSmartphone size={18} className="text-red" aria-hidden="true" /> No installation</li>
          </ul>
          <h1 className="hero-title">Free Online <span className="text-red">PDF Tools</span></h1>
          <p className="hero-sub">
            Convert JPG to PDF, PDF to JPG, compress to 100KB–1MB, merge, split and protect PDFs — free,
            without login, and processed privately in your browser.
          </p>
        </div>
      </section>

      <section className="section soft">
        <div className="container narrow seo-text">
          <p>PDF files are part of everyday digital life. Students, job applicants, teachers, office employees, businesses and cyber café operators regularly need to convert, compress, edit and manage documents — whether for a government job application, educational certificates, photographs or office paperwork.</p>
          <p>JustGoPDF brings these utilities together in one place. Open the site, choose a tool, add your document and finish the task in your browser. No desktop software, no account, and no watermark.</p>
          <p className="mb-0"><strong>Your files are processed locally</strong> — they are not uploaded to our servers.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-h">What can you do with JustGoPDF?</h2>
          <div className="table-responsive mt-3">
            <table className="table table-sm align-middle">
              <thead><tr><th scope="col">PDF tool</th><th scope="col">What it does</th></tr></thead>
              <tbody>
                {TOOLS.map((t) => (
                  <tr key={t.id}>
                    <td><Link to={`/${t.id}`}>{t.name ?? t.title ?? t.id}</Link></td>
                    <td>{t.desc ?? t.description ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section soft"><div className="container">
        <h2 className="section-h">How it works</h2>
        <div className="row g-4 mt-1">{STEPS.map(([Icon, h, p], i) => (
          <div className="col-md-4" key={h}><div className="info-card step"><span className="step-no">{i + 1}</span><Icon size={26} className="text-red" aria-hidden="true" /><h3>{h}</h3><p>{p}</p></div></div>
        ))}</div>
      </div></section>

      <section className="section"><div className="container">
        <h2 className="section-h">Why choose JustGoPDF?</h2>
        <div className="row g-4 mt-1">{WHY.map(([Icon, h, p]) => (
          <div className="col-sm-6 col-lg-3" key={h}><div className="info-card"><Icon size={28} className="text-red" aria-hidden="true" /><h3>{h}</h3><p>{p}</p></div></div>
        ))}</div>
      </div></section>

      <section className="section soft"><div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <h2 className="section-h text-start">Privacy and security</h2>
            <p>JustGoPDF tools run inside your browser. Your documents are opened, converted and saved by code on your own device — our application does not receive them. Passwords entered in the Protect PDF tool stay on your device too.</p>
            <p className="mb-0">We are open about the limits: the website itself is delivered over HTTPS from our host, which keeps standard server logs, and optional analytics never include file names or contents. Read our <Link to="/privacy-policy">Privacy Policy</Link>.</p>
          </div>
          <div className="col-lg-6"><div className="info-card"><ShieldCheck size={32} className="text-red" aria-hidden="true" /><h3>Local processing</h3><p>Close the tab and your working files are gone from the page. Nothing is stored permanently by JustGoPDF.</p></div></div>
        </div>
      </div></section>

      {SECTIONS.map((s) => (
        <section className="section" id={s.id} key={s.id}><div className="container narrow seo-text">
          <h2 className="h4">{s.h}</h2>
          <p>{s.intro}</p>
          <h3 className="h6 mt-3">How to use {s.tool}</h3>
          <ol>{s.steps.map((st) => <li key={st}>{st}</li>)}</ol>
          {s.tip && <p className="mb-0">{s.tip}</p>}
          <p className="mt-3 mb-0"><Link to={s.to}>Open the {s.tool} tool →</Link></p>
        </div></section>
      ))}

      <section className="section soft"><div className="container narrow seo-text">
        <h2 className="h4">Helpful for students, job applicants and cyber cafés</h2>
        <p>Students and government job aspirants applying through SSC, UPSC, Railway, Banking, state recruitment, college admission or scholarship portals can convert passport-size photographs and scanned certificates to PDF, compress documents to 100KB or 200KB, merge certificates into one file and extract single pages.</p>
        <p className="mb-0">Cyber cafés can do the same for customers — scanned photographs to PDF, certificates compressed to portal limits, PDF pages to JPG, certificates merged, pages extracted and documents password-protected — all from one site, with files processed on the café's own computer. Always check the portal's accepted formats, size limits and image dimensions before uploading.</p>
      </div></section>

      <section className="section"><div className="container narrow">
        <h2 className="section-h">Frequently asked questions</h2>
        <Faq items={SITE_FAQ} />
      </div></section>

      <section className="section soft"><div className="container narrow seo-text">
        <h2 className="h4">Free online PDF converter and editor</h2>
        <p><Link to="/pdf-to-jpg">Convert PDF to JPG</Link> or PNG, build a PDF from photos with <Link to="/jpg-to-pdf">JPG to PDF</Link>, and move content between formats with <Link to="/pdf-to-word">PDF to Word</Link>, <Link to="/word-to-pdf">Word to PDF</Link>, <Link to="/pdf-to-excel">PDF to Excel</Link> and <Link to="/excel-to-pdf">Excel to PDF</Link>.</p>
        <p className="mb-0">Need a smaller file? <Link to="/compress-pdf">Compress PDF</Link> to 200 KB or 1 MB, <Link to="/merge-pdf">merge PDF</Link> files, <Link to="/split-pdf">split PDF</Link> pages, or <Link to="/protect-pdf">protect a PDF with a password</Link>. Conversion is never perfect for every document, so each tool explains its limits before you start.</p>
      </div></section>
    </>
  );
}