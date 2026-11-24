import { Link } from 'react-router-dom';
import {
  ArrowRight, Zap, ShieldCheck, MonitorSmartphone, Gauge, Lock, Globe2,
  MousePointerClick, SlidersHorizontal, Download, FileText, ImageIcon,
  FileSpreadsheet, Layers, Scissors, KeyRound,
} from 'lucide-react';
import Seo from '../components/Seo.jsx';
import ToolCard from '../components/ToolCard.jsx';
import Faq from '../components/Faq.jsx';
import HeroIllustration from '../components/HeroIllustration.jsx';
import { HOME, SITE_FAQ, TOOLS } from '../config/toolsData.js';
import { SITE_URL } from '../config/site.js';

/* ──────────────────────────  Content data  ────────────────────────── */

const WHY = [
  [Gauge, 'Fast', 'Work happens on your device, so there is no upload or download queue.'],
  [Lock, 'Private by design', 'Documents are processed in your browser and are not sent to our servers.'],
  [Globe2, 'Free, no sign-up', 'Use every tool without an account or watermark.'],
  [MonitorSmartphone, 'Works everywhere', 'Responsive on desktop, tablet and phone, in light or dark mode.'],
];

const BENEFITS = [
  ['Multiple formats', 'Work with JPG, PNG, PDF, DOC, DOCX, and Excel files in one place.'],
  ['No installation', 'Everything runs in your browser — no downloads, plugins, or extensions.'],
  ['Simple interface', 'Clear, easy-to-understand conversion steps for every tool.'],
  ['Convenient access', 'Use any compatible device with an internet connection.'],
  ['Time-saving workflow', 'Convert, compress, and manage files in just a few clicks.'],
];

const STEPS = [
  [MousePointerClick, 'Choose a tool', 'Pick the conversion or action you need.'],
  [SlidersHorizontal, 'Add files and adjust', 'Drop in your files and set the options.'],
  [Download, 'Download the result', 'Get your file straight from the browser.'],
];

const GUIDE = [
  {
    to: '/jpg-to-pdf',
    name: 'Convert JPG to PDF online for free',
    body: 'Have photographs, scanned documents or certificates that need to become a PDF? Add one or more JPG (or supported PNG) images and combine them into a single PDF — useful for passport-size photographs, ID documents, scanned pages and certificates on application portals.',
    steps: ['Open the JPG to PDF converter.', 'Add one or more JPG images.', 'Arrange the images in your preferred order.', 'Click Convert.', 'Download your converted PDF.'],
  },
  {
    to: '/pdf-to-jpg',
    name: 'Convert PDF to JPG or PNG online',
    body: 'Need PDF pages as image files for sharing, editing, presentations or websites? Convert the whole document at once — each page becomes an individual image, so you avoid screenshotting page by page.',
    steps: ['Select the PDF to JPG tool.', 'Add your PDF document.', 'Start the conversion.', 'Download your converted JPG images.'],
  },
  {
    to: '/compress-pdf',
    name: 'Compress PDF – 100KB, 200KB, 500KB or 1MB',
    body: 'Government exam portals, college admission sites, scholarship forms and job applications enforce strict size limits. Compression runs in your browser, so large files are not uploaded anywhere. Targets depend on the original document; extremely small sizes may require reduced image quality and cannot always be guaranteed.',
    steps: ['Select the Compress PDF tool.', 'Add your PDF document.', 'Choose your target: 100KB, 200KB, 500KB or 1MB.', 'Click Compress.', 'Download your compressed PDF.'],
  },
  {
    to: '/merge-pdf',
    name: 'Merge multiple PDF files into one document',
    body: 'Combine marksheets, certificates and other educational documents into one file, or join reports, invoices and business paperwork — then submit a single PDF instead of managing separate files.',
    steps: ['Open the Merge PDF tool.', 'Add multiple PDF files.', 'Arrange them in your preferred order.', 'Click Merge.', 'Download your combined PDF.'],
  },
  {
    to: '/split-pdf',
    name: 'Split PDF – extract pages from a document',
    body: 'You rarely need the whole file. Extract only the pages you need — a chapter, a certificate, or one page of a large application — and download them as smaller PDFs.',
    steps: ['Select the Split PDF tool.', 'Add your PDF document.', 'Select the pages you want to extract.', 'Start the splitting process.', 'Download your extracted PDF files.'],
  },
  {
    to: '/protect-pdf',
    name: 'Protect a PDF with a password',
    body: 'For documents containing personal, educational, financial or business information, add password protection before sharing. The password you set stays on your device and is never transmitted to our servers.',
    steps: ['Open the Protect PDF tool.', 'Add your PDF document.', 'Enter and confirm a password.', 'Apply the protection.', 'Download your password-protected PDF.'],
  },
  {
    to: '/pdf-to-word',
    name: 'Convert PDF to Word – make documents editable',
    body: 'When a received PDF needs further editing, convert it to Word to work with text, paragraphs and formatting in an editable file. Complex layouts, scanned documents, tables and images may need extra formatting or OCR processing.',
    steps: ['Select PDF to Word.', 'Add your PDF document.', 'Start the conversion.', 'Download the Word document.', 'Open it in a compatible word processor.'],
  },
  {
    to: '/word-to-pdf',
    name: 'Word to PDF – convert documents into PDF format',
    body: 'Word is convenient for editing; PDF is preferred for sharing, printing and submitting official documents. Convert resumes, assignments, office reports and applications into a fixed-layout PDF.',
    steps: ['Open the Word to PDF tool.', 'Add your Word document.', 'Click Convert.', 'Download your PDF file.'],
  },
  {
    to: '/pdf-to-excel',
    name: 'Convert PDF to Excel and Excel to PDF',
    body: 'Turn supported PDF tables into editable spreadsheets with PDF to Excel, or export spreadsheets to PDF for printing and submission with Excel to PDF. Complex tables, merged cells and scanned documents may affect conversion accuracy.',
    steps: ['Use PDF to Excel to extract tables into a spreadsheet.', 'Use Excel to PDF to export a spreadsheet as a shareable PDF.'],
  },
];

/* Extra FAQ entries taken from the article. These are merged into the
   visible FAQ component and into the FAQPage structured data. */
const EXTRA_FAQ = [
  { q: 'How can I convert JPG to PDF for free?', a: 'Open the JPG to PDF converter, upload one or more JPG images, arrange them in the order you want, click Convert, and download the resulting PDF document.' },
  { q: 'How can I convert Word to PDF without installing software?', a: 'Use the online Word to PDF converter. Upload your DOC or DOCX file, start the conversion, and download the resulting PDF — no desktop application is required.' },
  { q: 'How do I convert PDF to Word for free?', a: 'Upload your PDF to the PDF to Word converter and download the converted DOCX file. Complex layouts, tables, and scanned documents may need extra formatting afterwards.' },
  { q: 'How can I reduce PDF file size?', a: 'Use the Compress PDF tool and choose a target size such as 100KB, 200KB, 500KB or 1MB. The achievable size depends on the original document.' },
  { q: 'Can I convert Excel to PDF online?', a: 'Yes. The Excel to PDF converter turns spreadsheet files into PDF documents for easier sharing and printing.' },
  { q: 'Can I convert PDF pages into JPG images?', a: 'Yes. The PDF to JPG converter turns each page of a PDF into an individual JPG image you can download.' },
  { q: 'Do I need to install software to convert PDF files?', a: 'No. All JustGoPDF tools run in your browser — no installation, plugins, or account are required.' },
  { q: 'Can I convert a PDF into editable text?', a: 'Yes. Use a PDF to text extractor to copy readable text out of a PDF. For scanned PDFs, OCR may be required to extract text reliably.' },
];

const ALL_FAQ = [...SITE_FAQ, ...EXTRA_FAQ];

/* ──────────────────────────  Structured data  ────────────────────────── */

const ld = [
  { '@context': 'https://schema.org', '@type': 'WebSite', name: 'JustGoPDF', url: SITE_URL + '/', description: HOME.description },
  { '@context': 'https://schema.org', '@type': 'Organization', name: 'JustGoPDF', url: SITE_URL + '/', logo: SITE_URL + '/favicon.svg' },
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JustGoPDF',
    url: SITE_URL + '/',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    description: HOME.description,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ALL_FAQ.map((f) => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
  ...GUIDE.map((g) => ({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: g.name,
    description: g.body,
    step: g.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s })),
  })),
];

/* ──────────────────────────  Page component  ────────────────────────── */

export default function Home() {
  const popular = TOOLS.filter((t) => t.popular);

  return (
    <>
      <Seo title={HOME.title} description={HOME.description} path="/" jsonLd={ld} />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <ul className="trust" aria-label="Highlights">
                <li><Zap size={18} className="text-red" aria-hidden="true" /> Fast &amp; Free</li>
                <li><ShieldCheck size={18} className="text-red" aria-hidden="true" /> Secure &amp; Private</li>
                <li><MonitorSmartphone size={18} className="text-red" aria-hidden="true" /> No Registration</li>
              </ul>
              <h1 className="hero-title">
                Your Ultimate <span className="text-red">Online PDF Toolkit</span>
              </h1>
              <p className="hero-sub">
                Convert, compress, merge, split and secure your PDF files — all in one place, for free.
              </p>
              <Link to="/all-tools" className="btn btn-red btn-lg pill">
                Explore PDF Tools <ArrowRight size={20} aria-hidden="true" />
              </Link>
            </div>
            <div className="col-lg-6"><HeroIllustration /></div>
          </div>

          <h2 className="visually-hidden">PDF tools</h2>
          <div className="tool-grid five mt-4">
            {TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
          </div>
        </div>
      </section>

      {/* ── Popular tools ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-h">Popular PDF tools</h2>
          <p className="section-sub">The tools people use most.</p>
          <div className="tool-grid four">
            {popular.slice(0, 4).map((t) => <ToolCard key={t.id} tool={t} />)}
          </div>
          <p className="mt-4 mb-0">
            New to PDF tools? Read our{' '}
            <Link to="/free-online-pdf-tools">guide to free online PDF tools</Link>{' '}
            for step-by-step walkthroughs, compression targets and privacy notes.
          </p>
        </div>
      </section>

      {/* ── Why choose + benefits ── */}
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

          <ul className="benefits-list mt-4 mb-0">
            {BENEFITS.map(([title, body]) => (
              <li key={title}><strong>{title}:</strong> {body}</li>
            ))}
          </ul>
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

      {/* ── Privacy ── */}
      <section className="section soft">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h2 className="section-h text-start">Privacy and security</h2>
              <p>
                JustGoPDF tools run inside your browser. Your documents are opened,
                converted and saved by code on your own device — our application does not
                receive them. Passwords entered in the Protect PDF tool stay on your device too.
              </p>
              <p className="mb-0">
                We are open about the limits: the website itself is delivered over HTTPS from
                our host, which keeps standard server logs, and optional analytics never include
                file names or contents. Read our <Link to="/privacy-policy">Privacy Policy</Link>.
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

      {/* ── Tool table (quick-reference + internal links) ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-h">Free online PDF tools — complete guide</h2>
          <p className="section-sub">Everything you can do without login, watermark or installation.</p>

          <div className="table-responsive mt-4">
            <table className="table table-sm align-middle">
              <caption className="visually-hidden">List of free JustGoPDF tools</caption>
              <thead>
                <tr><th scope="col">PDF tool</th><th scope="col">What it does</th></tr>
              </thead>
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
        </div>
      </section>

      {/* ── Accordion: quick steps ── */}
      <section className="section soft">
        <div className="container narrow">
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
        </div>
      </section>

      {/* ── Long-form article (semantic, keyword-rich) ── */}
      <article className="section">
        <div className="container narrow">
          <h2 className="section-h">
            Free Online PDF Converter – Convert, Compress and Manage PDF Files Easily
          </h2>

          <p>
            Managing PDF documents is an essential part of everyday digital work. Whether you
            are a student, teacher, office employee, business owner, or freelancer, you may
            frequently need to convert images into PDFs, change Word documents to PDF, extract
            data from PDF files, or reduce PDF file sizes.
          </p>
          <p>
            <strong>JustGoPDF</strong> makes document management simple with free online PDF
            tools. You can convert, compress, merge, and manage documents directly from your
            browser without installing complicated software.
          </p>
          <p>
            In this guide, discover how to convert JPG to PDF, PNG to JPG, Word to PDF,
            PDF to Word, Excel to PDF, and much more.
          </p>

          {/* 1 */}
          <h3>1. JPG to PDF Converter – Convert Images into PDF</h3>
          <p>
            Do you have multiple JPG images that you want to combine into one PDF document?
            A <Link to="/jpg-to-pdf">JPG to PDF converter</Link> makes this process simple.
          </p>
          <p>
            You can convert JPG images into PDF files for assignments, certificates, scanned
            documents, invoices, and other important records.
          </p>
          <h4>How to convert JPG to PDF</h4>
          <ol>
            <li>Open the <Link to="/jpg-to-pdf">JPG to PDF tool</Link>.</li>
            <li>Upload your JPG images.</li>
            <li>Arrange the images in your preferred order.</li>
            <li>Click the Convert button.</li>
            <li>Download your PDF document.</li>
          </ol>
          <p>
            You can create a convenient PDF document from your images without installing
            additional software.
          </p>

          {/* 2 */}
          <h3>2. PNG to JPG Converter – Change PNG Images to JPG</h3>
          <p>
            PNG images are useful for transparent backgrounds and high-quality graphics.
            However, JPG files are often more convenient for sharing and uploading.
            A <Link to="/png-to-jpg">PNG to JPG converter</Link> helps you change PNG images
            into the widely supported JPG format.
          </p>
          <p>This is useful when:</p>
          <ul>
            <li>A website only accepts JPG images.</li>
            <li>You need smaller image files.</li>
            <li>You want to share pictures easily.</li>
            <li>You need images for online forms or applications.</li>
          </ul>
          <p>Simply upload your PNG image, convert it, and download the JPG version.</p>

          {/* 3 */}
          <h3>3. Compress PDF – Reduce PDF File Size</h3>
          <p>
            Large PDF documents can be difficult to upload, email, or share. PDF compression
            helps reduce document size while maintaining readable quality. Use the{' '}
            <Link to="/compress-pdf">Compress PDF tool</Link> to optimize documents for:
          </p>
          <ul>
            <li>Email attachments.</li>
            <li>Online application forms.</li>
            <li>College assignments.</li>
            <li>Business reports.</li>
            <li>Document sharing and storage.</li>
          </ul>
          <h4>How to compress a PDF</h4>
          <ol>
            <li>Upload your PDF document.</li>
            <li>Select your preferred compression level.</li>
            <li>Start the compression process.</li>
            <li>Download your compressed PDF.</li>
          </ol>
          <p>A smaller PDF file makes document sharing faster and more convenient.</p>

          {/* 4 */}
          <h3>4. Convert Excel to PDF – Excel to PDF Converter</h3>
          <p>
            Excel spreadsheets are commonly used for financial reports, calculations,
            attendance records, and business data. Converting Excel files into PDF with the{' '}
            <Link to="/excel-to-pdf">Excel to PDF converter</Link> makes them easier to share
            while preserving their document layout.
          </p>
          <p>An Excel to PDF converter is useful for:</p>
          <ul>
            <li>Financial statements.</li>
            <li>Student result sheets.</li>
            <li>Business reports.</li>
            <li>Data tables.</li>
            <li>Monthly expense reports.</li>
          </ul>
          <p>
            Upload your Excel document and convert it into a PDF for convenient viewing
            and sharing.
          </p>

          {/* 5 */}
          <h3>5. Word to PDF – Convert DOC and DOCX to PDF Free</h3>
          <p>
            Microsoft Word documents are frequently used for resumes, assignments, applications,
            letters, and professional reports. However, sharing Word files can sometimes cause
            formatting differences between devices. Converting Word to PDF with the{' '}
            <Link to="/word-to-pdf">Word to PDF converter</Link> helps preserve the document's
            appearance.
          </p>
          <p>JustGoPDF makes it easy to convert:</p>
          <ul>
            <li>DOC to PDF.</li>
            <li>DOCX to PDF.</li>
            <li>Word documents to PDF.</li>
            <li>Word files to shareable PDF documents.</li>
          </ul>
          <h4>Steps to convert Word to PDF</h4>
          <ol>
            <li>Select the <Link to="/word-to-pdf">Word to PDF tool</Link>.</li>
            <li>Upload your DOC or DOCX file.</li>
            <li>Start the conversion.</li>
            <li>Download your PDF document.</li>
          </ol>

          {/* 6 */}
          <h3>6. Convert PDF to Word Free – PDF to DOCX Converter</h3>
          <p>
            Sometimes you need to edit an existing PDF document. Instead of recreating the
            entire document, you can convert PDF to Word with the{' '}
            <Link to="/pdf-to-word">PDF to Word converter</Link>.
          </p>
          <p>This tool can be useful for:</p>
          <ul>
            <li>Editing existing documents.</li>
            <li>Updating resumes.</li>
            <li>Modifying reports.</li>
            <li>Reusing document content.</li>
            <li>Making changes to business letters.</li>
          </ul>
          <p>
            Please note that complex layouts, tables, scanned documents, and images may
            require additional formatting after conversion.
          </p>

          {/* 7 */}
          <h3>7. Free PDF to JPG Converter</h3>
          <p>
            Do you want to extract images from a PDF or convert individual PDF pages into
            pictures? A <Link to="/pdf-to-jpg">PDF to JPG converter</Link> lets you transform
            PDF pages into JPG images.
          </p>
          <p>It is useful for:</p>
          <ul>
            <li>Sharing individual PDF pages.</li>
            <li>Creating image previews.</li>
            <li>Extracting document pages.</li>
            <li>Uploading pages to image-supported platforms.</li>
            <li>Preparing presentations.</li>
          </ul>
          <p>Upload your PDF and convert its pages into JPG images.</p>

          {/* 8 */}
          <h3>8. Free PDF to Excel Converter</h3>
          <p>
            PDF documents sometimes contain tables, financial information, and structured
            data that you want to analyze in Excel. A{' '}
            <Link to="/pdf-to-excel">PDF to Excel converter</Link> helps extract tabular
            information into spreadsheet format.
          </p>
          <p>It is useful for:</p>
          <ul>
            <li>Financial data analysis.</li>
            <li>Invoice management.</li>
            <li>Business reports.</li>
            <li>Data entry.</li>
            <li>Spreadsheet editing.</li>
          </ul>
          <p>
            The accuracy of the conversion depends on the structure and quality of the
            original PDF.
          </p>

          {/* 9 */}
          <h3>9. Convert PDF to Text – Extract Text from PDF</h3>
          <p>
            Sometimes you only need the written content of a PDF document rather than the
            complete formatting. A <Link to="/pdf-to-text">PDF to Text converter</Link> helps
            extract readable text from PDF files.
          </p>
          <p>This can save time when working with:</p>
          <ul>
            <li>Research documents.</li>
            <li>Study materials.</li>
            <li>Reports.</li>
            <li>Articles.</li>
            <li>Digital notes.</li>
          </ul>
          <p>
            For scanned PDFs, OCR (Optical Character Recognition) may be required to
            extract text.
          </p>
        </div>
      </article>

      {/* ── Students / cyber cafés ── */}
      <section className="section soft">
        <div className="container narrow seo-text">
          <h2 className="section-h text-start">Helpful for students, job applicants and cyber cafés</h2>
          <p>
            Students and government job aspirants applying through SSC, UPSC, Railway, Banking,
            state recruitment, college admission or scholarship portals can convert
            passport-size photographs and scanned certificates to PDF with{' '}
            <Link to="/jpg-to-pdf">JPG to PDF</Link>,{' '}
            <Link to="/compress-pdf">compress documents</Link> to 100KB or 200KB,{' '}
            <Link to="/merge-pdf">merge certificates</Link> into one file, and{' '}
            <Link to="/split-pdf">extract single pages</Link>.
          </p>
          <p>
            Cyber cafés can do the same for customers — scanned photographs to PDF, certificates
            compressed to portal limits, PDF pages to JPG, certificates merged, pages extracted,
            and documents password-protected — all from one site, with files processed on the
            café's own computer.
          </p>
          <p className="mb-0">
            Always check the portal's accepted formats, size limits and image dimensions before
            uploading. JustGoPDF is free to use, requires no account, and adds no watermark to
            your results.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section">
        <div className="container narrow">
          <h2 className="section-h">Frequently asked questions</h2>
          <Faq items={ALL_FAQ} />
        </div>
      </section>

      {/* ── Closing internal-links block ── */}
      <section className="section soft">
        <div className="container narrow seo-text">
          <h2 className="h4">Free online PDF converter and editor</h2>
          <p>
            JustGoPDF brings the everyday PDF jobs into one clean toolkit.{' '}
            <Link to="/pdf-to-jpg">Convert PDF to JPG</Link> or PNG, build a PDF from photos
            with <Link to="/jpg-to-pdf">JPG to PDF</Link>, and move content between PDF, Word
            and Excel with <Link to="/pdf-to-word">PDF to Word</Link>,{' '}
            <Link to="/word-to-pdf">Word to PDF</Link>,{' '}
            <Link to="/pdf-to-excel">PDF to Excel</Link> and{' '}
            <Link to="/excel-to-pdf">Excel to PDF</Link>.
          </p>
          <p>
            Need a smaller file for email or an upload form?{' '}
            <Link to="/compress-pdf">Compress PDF</Link> to a target such as 200 KB or 1 MB.{' '}
            <Link to="/merge-pdf">Merge PDF</Link> files into one document,{' '}
            <Link to="/split-pdf">split PDF</Link> pages into separate files, or{' '}
            <Link to="/protect-pdf">protect a PDF with a password</Link>.
          </p>
          <p className="mb-0">
            Conversion between formats is never perfect for every document, so each tool
            explains what it can and cannot do before you start.
          </p>
        </div>
      </section>
    </>
  );
}
