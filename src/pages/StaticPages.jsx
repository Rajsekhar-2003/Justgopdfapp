import { Link } from 'react-router-dom';
import Seo, { breadcrumbLd } from '../components/Seo.jsx';
import Faq from '../components/Faq.jsx';
import { PAGES, SITE_FAQ, TOOLS } from '../config/toolsData.js';
import { CONTACT_EMAIL } from '../config/site.js';

const CREATOR_EMAIL = 'maityrajsekhar210@gmail.com';

function Doc({ path, children, faq }) {
  const meta = PAGES.find((p) => p.path === path);
  const ld = [breadcrumbLd([{ name: 'Home', path: '/' }, { name: meta.h1, path }])];
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={path} jsonLd={ld} />
      <div className="container narrow doc-page">
        <h1>{meta.h1}</h1>
        {children}
        {faq}
      </div>
    </>
  );
}

export const About = () => (
  <Doc path="/about">
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
      Ten browser-based tools: PDF to JPG and PNG, JPG and PNG to PDF, PDF to Word, Word to PDF, PDF to Excel, Excel to PDF, Compress, Merge, Split and Protect. Each one has its own page, its own settings, and — this matters to us — its own plain-language notes about what it can and cannot do.
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

export const Contact = () => (
  <Doc path="/contact">
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

const POSTS = [
  {
    t: 'How to reduce a PDF to under 1 MB without ruining it',
    b: [
      'Most oversized PDFs are large because of images, not text. That is actually good news — it means you have room to work with before anything important gets blurry.',
      'Start with a gentle compression level and check the result. If a portal is forcing a hard limit, pick a target size and accept that the tool will do its best within the constraints of the original file.',
      'A last-resort trick: convert pages to pictures. The file gets small fast, but your text stops being selectable or searchable. Use it only when nothing else fits.',
    ],
  },
  {
    t: 'Password protection vs. permissions: what is the difference?',
    b: [
      'An open password actually encrypts the document. Without it, nobody reads the contents — full stop.',
      'Permissions like "no printing" or "no copying" are flags that compliant viewers agree to respect. Some tools quietly ignore them, so treat permissions as a courtesy, not a lock.',
      'One golden rule: always keep an unprotected original somewhere safe. A forgotten password cannot be recovered — not by us, not by anyone.',
    ],
  },
  {
    t: 'Why PDF to Word never looks perfect',
    b: [
      'A PDF doesn\'t store paragraphs or tables. It stores where each piece of text sits on a page. Converting means guessing the structure back — and guessing is never perfect.',
      'Text-based, single-column documents convert cleanly. Scanned pages are just pictures, and they need OCR, which is an entirely different technology.',
      'Plan to proofread the converted file, especially headings, tables and lists. It will be close. It will rarely be exact.',
    ],
  },
];

export const Blog = () => (
  <Doc path="/blog">
    <p className="lead-text">
      Short, practical guides for the PDF problems people actually run into.
    </p>
    {POSTS.map((p) => (
      <article key={p.t} className="post">
        <h2>{p.t}</h2>
        {p.b.map((x) => <p key={x}>{x}</p>)}
      </article>
    ))}
    <p>
      Try the tools these guides talk about: <Link to="/compress-pdf">Compress PDF</Link>, <Link to="/protect-pdf">Protect PDF</Link>, <Link to="/pdf-to-word">PDF to Word</Link>.
    </p>
  </Doc>
);

export const Privacy = () => (
  <Doc path="/privacy-policy">
    <p>
      Last updated: {new Date().getFullYear()}. Here is what JustGoPDF does — and does not do — with your information.
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
      You can clear site data in your browser at any time. Questions? Head to our <Link to="/contact">contact page</Link> — we're happy to clarify anything here.
    </p>
  </Doc>
);

export const Terms = () => (
  <Doc path="/terms-and-conditions">
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

export const Disclaimer = () => (
  <Doc path="/disclaimer">
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

export const FaqPage = () => (
  <Doc path="/faq" faq={null}>
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

export function NotFound() {
  return (
    <>
      <Seo
        title="Page not found | JustGoPDF"
        description="This page could not be found."
        path="/404"
        noindex
      />
      <div className="container narrow doc-page text-center">
        <h1>Page not found</h1>
        <p className="lead-text">
          This page has moved on, or maybe it never existed. Either way, no harm done.
        </p>
        <p>
          Head back to the tools and pick up where you left off — your files are still on your device, untouched.
        </p>
        <Link to="/all-tools" className="btn btn-red">Browse all PDF tools</Link>
      </div>
    </>
  );
}