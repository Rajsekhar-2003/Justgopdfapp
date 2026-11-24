import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, MonitorSmartphone, Gauge, Lock, Globe2, MousePointerClick, SlidersHorizontal, Download } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import ToolCard from '../components/ToolCard.jsx';
import Faq from '../components/Faq.jsx';
import HeroIllustration from '../components/HeroIllustration.jsx';
import { HOME, SITE_FAQ, TOOLS } from '../config/toolsData.js';
import { SITE_URL } from '../config/site.js';

const ld = [
  { '@context': 'https://schema.org', '@type': 'WebSite', name: 'JustGoPDF', url: SITE_URL + '/', description: HOME.description },
  { '@context': 'https://schema.org', '@type': 'Organization', name: 'JustGoPDF', url: SITE_URL + '/', logo: SITE_URL + '/favicon.svg' },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: SITE_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
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

const GUIDE = [
  {
    to: '/jpg-to-pdf', name: 'Convert JPG to PDF online for free',
    body: 'Have photographs, scanned documents or certificates that need to become a PDF? Add one or more JPG (or supported PNG) images and combine them into a single PDF — useful for passport-size photographs, ID documents, scanned pages and certificates on application portals.',
    steps: ['Open the JPG to PDF converter.', 'Add one or more JPG images.', 'Arrange the images in your preferred order.', 'Click Convert.', 'Download your converted PDF.'],
  },
  {
    to: '/pdf-to-jpg', name: 'Convert PDF to JPG or PNG online',
    body: 'Need PDF pages as image files for sharing, editing, presentations or websites? Convert the whole document at once — each page becomes an individual image, so you avoid screenshotting page by page.',
    steps: ['Select the PDF to JPG tool.', 'Add your PDF document.', 'Start the conversion.', 'Download your converted JPG images.'],
  },
  {
    to: '/compress-pdf', name: 'Compress PDF – 100KB, 200KB, 500KB or 1MB',
    body: 'Government exam portals, college admission sites, scholarship forms and job applications enforce strict size limits. Compression runs in your browser, so large files are not uploaded anywhere. Targets depend on the original document; extremely small sizes may require reduced image quality and cannot always be guaranteed.',
    steps: ['Select the Compress PDF tool.', 'Add your PDF document.', 'Choose your target: 100KB, 200KB, 500KB or 1MB.', 'Click Compress.', 'Download your compressed PDF.'],
  },
  {
    to: '/merge-pdf', name: 'Merge multiple PDF files into one document',
    body: 'Combine marksheets, certificates and other educational documents into one file, or join reports, invoices and business paperwork — then submit a single PDF instead of managing separate files.',
    steps: ['Open the Merge PDF tool.', 'Add multiple PDF files.', 'Arrange them in your preferred order.', 'Click Merge.', 'Download your combined PDF.'],
  },
  {
    to: '/split-pdf', name: 'Split PDF – extract pages from a document',
    body: 'You rarely need the whole file. Extract only the pages you need — a chapter, a certificate, or one page of a large application — and download them as smaller PDFs.',
    steps: ['Select the Split PDF tool.', 'Add your PDF document.', 'Select the pages you want to extract.', 'Start the splitting process.', 'Download your extracted PDF files.'],
  },
  {
    to: '/protect-pdf', name: 'Protect a PDF with a password',
    body: 'For documents containing personal, educational, financial or business information, add password protection before sharing. The password you set stays on your device and is never transmitted to our servers.',
    steps: ['Open the Protect PDF tool.', 'Add your PDF document.', 'Enter and confirm a password.', 'Apply the protection.', 'Download your password-protected PDF.'],
  },
  {
    to: '/pdf-to-word', name: 'Convert PDF to Word – make documents editable',
    body: 'When a received PDF needs further editing, convert it to Word to work with text, paragraphs and formatting in an editable file. Complex layouts, scanned documents, tables and images may need extra formatting or OCR processing.',
    steps: ['Select PDF to Word.', 'Add your PDF document.', 'Start the conversion.', 'Download the Word document.', 'Open it in a compatible word processor.'],
  },
  {
    to: '/word-to-pdf', name: 'Word to PDF – convert documents into PDF format',
    body: 'Word is convenient for editing; PDF is preferred for sharing, printing and submitting official documents. Convert resumes, assignments, office reports and applications into a fixed-layout PDF.',
    steps: ['Open the Word to PDF tool.', 'Add your Word document.', 'Click Convert.', 'Download your PDF file.'],
  },
  {
    to: '/pdf-to-excel', name: 'Convert PDF to Excel and Excel to PDF',
    body: 'Turn supported PDF tables into editable spreadsheets with PDF to Excel, or export spreadsheets to PDF for printing and submission with Excel to PDF. Complex tables, merged cells and scanned documents may affect conversion accuracy.',
    steps: ['Use PDF to Excel to extract tables into a spreadsheet.', 'Use Excel to PDF to export a spreadsheet as a shareable PDF.'],
  },
];

export default function Home() {
  const popular = TOOLS.filter((t) => t.popular);
  return (
    <>
      <Seo title={HOME.title} description={HOME.description} path="/" jsonLd={ld} />

      <section className="hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <ul className="trust" aria-label="Highlights">
                <li><Zap size={18} className="text-red" aria-hidden="true" /> Fast &amp; Free</li>
                <li><ShieldCheck size={18} className="text-red" aria-hidden="true" /> Secure &amp; Private</li>
                <li><MonitorSmartphone size={18} className="text-red" aria-hidden="true" /> No Registration</li>
              </ul>
              <h1 className="hero-title">Your Ultimate <span className="text-red">Online PDF Toolkit</span></h1>
              <p className="hero-sub">Convert, compress, merge, split and secure your PDF files — all in one place, for free.</p>
              <Link to="/all-tools" className="btn btn-red btn-lg pill">Explore PDF Tools <ArrowRight size={20} aria-hidden="true" /></Link>
            </div>
            <div className="col-lg-6"><HeroIllustration /></div>
          </div>
          <h2 className="visually-hidden">PDF tools</h2>
          <div className="tool-grid five mt-4">{TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}</div>
        </div>
      </section>

      <section className="section"><div className="container">
        <h2 className="section-h">Popular PDF tools</h2>
        <p className="section-sub">The tools people use most.</p>
        <div className="tool-grid four">{popular.slice(0, 4).map((t) => <ToolCard key={t.id} tool={t} />)}</div>
        <p className="mt-4 mb-0">
          New to PDF tools? Read our <Link to="/free-online-pdf-tools">guide to free online PDF tools</Link> for step-by-step walkthroughs, compression targets and privacy notes.
        </p>
      </div></section>

      <section className="section soft"><div className="container">
        <h2 className="section-h">Why choose JustGoPDF?</h2>
        <div className="row g-4 mt-1">{WHY.map(([Icon, h, p]) => (
          <div className="col-sm-6 col-lg-3" key={h}><div className="info-card"><Icon size={28} className="text-red" aria-hidden="true" /><h3>{h}</h3><p>{p}</p></div></div>
        ))}</div>
      </div></section>

      <section className="section"><div className="container">
        <h2 className="section-h">How it works</h2>
        <div className="row g-4 mt-1">{STEPS.map(([Icon, h, p], i) => (
          <div className="col-md-4" key={h}><div className="info-card step"><span className="step-no">{i + 1}</span><Icon size={26} className="text-red" aria-hidden="true" /><h3>{h}</h3><p>{p}</p></div></div>
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

      {/* ── Article: What you can do + tool walkthroughs ── */}
      <section className="section"><div className="container">
        <h2 className="section-h">Free online PDF tools — complete guide</h2>
        <p className="section-sub">Everything you can do without login, watermark or installation.</p>

        <div className="table-responsive mt-4">
          <table className="table table-sm align-middle">
            <thead><tr><th scope="col">PDF tool</th><th scope="col">What it does</th></tr></thead>
            <tbody>
              <tr><td><Link to="/jpg-to-pdf">JPG to PDF</Link></td><td>Convert JPG images into PDF documents</td></tr>
              <tr><td><Link to="/pdf-to-jpg">PDF to JPG</Link></td><td>Convert PDF pages into JPG images</td></tr>
              <tr><td><Link to="/pdf-to-word">PDF to Word</Link></td><td>Convert PDF documents into editable Word files</td></tr>
              <tr><td><Link to="/word-to-pdf">Word to PDF</Link></td><td>Convert Word documents into PDF format</td></tr>
              <tr><td><Link to="/pdf-to-excel">PDF to Excel</Link></td><td>Extract PDF tables and data into Excel</td></tr>
              <tr><td><Link to="/excel-to-pdf">Excel to PDF</Link></td><td>Convert Excel spreadsheets into PDF files</td></tr>
              <tr><td><Link to="/compress-pdf">Compress PDF</Link></td><td>Reduce PDF file size</td></tr>
              <tr><td><Link to="/merge-pdf">Merge PDF</Link></td><td>Combine multiple PDF documents</td></tr>
              <tr><td><Link to="/split-pdf">Split PDF</Link></td><td>Extract selected pages from a PDF</td></tr>
              <tr><td><Link to="/protect-pdf">Protect PDF</Link></td><td>Add a password to protect your PDF</td></tr>
            </tbody>
          </table>
        </div>
      </div></section>

      <section className="section soft"><div className="container narrow">
        <h2 className="section-h">Step-by-step tool guides</h2>
        <p className="section-sub">Expand any tool to see how it works.</p>
        {GUIDE.map((g) => (
          <details key={g.to} className="info-card mb-3">
            <summary className="fw-semibold" style={{ cursor: 'pointer' }}>{g.name}</summary>
            <p className="mt-3">{g.body}</p>
            <h3 className="h6">How to</h3>
            <ol>{g.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            <p className="mb-0"><Link to={g.to}>Open the tool →</Link></p>
          </details>
        ))}
      </div></section>

      <section className="section"><div className="container narrow seo-text">
        <h2 className="section-h text-start">Helpful for students, job applicants and cyber cafés</h2>
        <p>Students and government job aspirants applying through SSC, UPSC, Railway, Banking, state recruitment, college admission or scholarship portals can convert passport-size photographs and scanned certificates to PDF, compress documents to 100KB or 200KB, merge certificates into one file, and extract single pages.</p>
        <p>Cyber cafés can do the same for customers — scanned photographs to PDF, certificates compressed to portal limits, PDF pages to JPG, certificates merged, pages extracted, and documents password-protected — all from one site, with files processed on the café's own computer.</p>
        <p className="mb-0">Always check the portal's accepted formats, size limits and image dimensions before uploading. JustGoPDF is free to use, requires no account, and adds no watermark to your results.</p>
      </div></section>

      <section className="section soft"><div className="container narrow">
        <h2 className="section-h">Frequently asked questions</h2>
        <Faq items={SITE_FAQ} />
      </div></section>

      <section className="section"><div className="container narrow seo-text">
        <h2 className="h4">Free online PDF converter and editor</h2>
        <p>JustGoPDF brings the everyday PDF jobs into one clean toolkit. <Link to="/pdf-to-jpg">Convert PDF to JPG</Link> or PNG, build a PDF from photos with <Link to="/jpg-to-pdf">JPG to PDF</Link>, and move content between PDF, Word and Excel with <Link to="/pdf-to-word">PDF to Word</Link>, <Link to="/word-to-pdf">Word to PDF</Link>, <Link to="/pdf-to-excel">PDF to Excel</Link> and <Link to="/excel-to-pdf">Excel to PDF</Link>.</p>
        <p>Need a smaller file for email or an upload form? <Link to="/compress-pdf">Compress PDF</Link> to a target such as 200 KB or 1 MB. <Link to="/merge-pdf">Merge PDF</Link> files into one document, <Link to="/split-pdf">split PDF</Link> pages into separate files, or <Link to="/protect-pdf">protect a PDF with a password</Link>.</p>
        <p className="mb-0">Conversion between formats is never perfect for every document, so each tool explains what it can and cannot do before you start.</p>
      </div></section>
    </>
  );
}