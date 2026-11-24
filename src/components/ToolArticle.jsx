import { ARTICLES } from '../config/articles.js';

const Item = ({ x }) => (Array.isArray(x) ? <><strong>{x[0]}</strong>{x[1]}</> : x);

export default function ToolArticle({ toolId }) {
  const blocks = ARTICLES[toolId];
  if (!blocks) return null;
  return (
    <article className="tool-article mt-5" aria-label="About this tool">
      {blocks.map((b, i) => {
        if (b.t === 'h2') return <h2 key={i}>{b.x}</h2>;
        if (b.t === 'h3') return <h3 key={i}>{b.x}</h3>;
        if (b.t === 'ul') return <ul key={i}>{b.x.map((it, j) => <li key={j}><Item x={it} /></li>)}</ul>;
        if (b.t === 'ol') return <ol key={i}>{b.x.map((it, j) => <li key={j}><Item x={it} /></li>)}</ol>;
        return <p key={i}>{b.x}</p>;
      })}
    </article>
  );
}
