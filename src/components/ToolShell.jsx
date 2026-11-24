import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import Seo, { breadcrumbLd } from './Seo.jsx';
import Faq from './Faq.jsx';
import ToolCard from './ToolCard.jsx';
import ToolArticle from './ToolArticle.jsx';
import { TOOLS } from '../config/toolsData.js';
import { SITE_URL } from '../config/site.js';

export default function ToolShell({ tool, children }) {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'All PDF Tools', path: '/all-tools' }, { name: tool.name, path: tool.path }];
  const related = tool.related.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean);
  const ld = [
    breadcrumbLd(crumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `JustGoPDF – ${tool.name}`,
      url: SITE_URL + tool.path,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any (web browser)',
      description: tool.description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to use ${tool.name}`,
      step: tool.how.map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
  return (
    <>
      <Seo title={tool.title} description={tool.description} path={tool.path} jsonLd={ld} />
      <div className="container tool-page">
        <nav aria-label="Breadcrumb" className="crumbs">
          <ol>
            {crumbs.map((c, i) => (
              <li key={c.path}>
                {i < crumbs.length - 1 ? <Link to={c.path}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
                {i < crumbs.length - 1 && <ChevronRight size={14} aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </nav>
        <header className="tool-head">
          <h1>{tool.h1}</h1>
          <p className="lead-text">{tool.intro}</p>
        </header>
        <section className="workspace" aria-label={`${tool.name} workspace`}>{children}</section>

        <div className="row g-4 mt-4">
          <section className="col-lg-6" aria-labelledby="how-h">
            <h2 id="how-h" className="h4">How to use {tool.name}</h2>
            <ol className="steps">{tool.how.map((s) => <li key={s}>{s}</li>)}</ol>
          </section>
          <section className="col-lg-6" aria-labelledby="feat-h">
            <h2 id="feat-h" className="h4">Features and benefits</h2>
            <ul className="check-list">
              {tool.features.map((f) => <li key={f}><CheckCircle2 size={18} className="text-red" aria-hidden="true" />{f}</li>)}
            </ul>
          </section>
        </div>

        <ToolArticle toolId={tool.id} />

        <section className="mt-5" aria-labelledby="faq-h">
          <h2 id="faq-h" className="h4">Frequently asked questions</h2>
          <Faq items={tool.faq} />
        </section>

        <section className="mt-5" aria-labelledby="rel-h">
          <h2 id="rel-h" className="h4">Related PDF tools</h2>
          <div className="tool-grid three">{related.map((t) => <ToolCard key={t.id} tool={t} />)}</div>
        </section>
      </div>
    </>
  );
}
