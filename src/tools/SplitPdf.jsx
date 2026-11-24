import { useMemo, useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import FileDropzone from '../components/FileDropzone.jsx';
import FileInfo from '../components/FileInfo.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import PageThumb from '../components/PageThumb.jsx';
import usePdfDocument from '../hooks/usePdfDocument.js';
import useJob from '../hooks/useJob.js';
import { getTool } from '../config/toolsData.js';
import { AppError, baseName, download, formatBytes, pagesToText, parseRanges } from '../lib/files.js';

const tool = getTool('split-pdf');
const MAX_OUTPUT_FILES = 500;
const PDF_ACCEPT = { 'application/pdf': ['.pdf'] };

const MODES = [
  ['select', 'Extract selected pages into one PDF'],
  ['ranges', 'Split by ranges – one PDF per range'],
  ['every', 'Split every page into its own PDF'],
];

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

function uniqueName(name, used) {
  let candidate = name;
  if (used.has(candidate)) {
    const stem = name.replace(/\.pdf$/, '');
    let n = 2;
    do { candidate = `${stem}-${n++}.pdf`; } while (used.has(candidate));
  }
  used.add(candidate);
  return candidate;
}

function groupLabel(mode, g) {
  if (mode === 'select') return 'selected-pages';
  if (mode === 'ranges' && g.length > 1) return `pages-${g[0]}-${g[g.length - 1]}`;
  return `page-${g[0]}`;
}

export default function SplitPdf() {
  const src = usePdfDocument(500);
  const job = useJob();
  const [mode, setMode] = useState('select');
  const [selected, setSelected] = useState(new Set());
  const [text, setText] = useState('');
  const [textError, setTextError] = useState(null);
  const [results, setResults] = useState([]);
  const [zipping, setZipping] = useState(false);
  const [zipError, setZipError] = useState(null);

  const busy = job.busy || zipping;
  const pageList = useMemo(() => Array.from({ length: src.pages }, (_, i) => i + 1), [src.pages]);

  const clearOutput = () => { setResults([]); setZipError(null); };

  const reset = () => {
    job.reset();
    clearOutput();
    setSelected(new Set());
    setText('');
    setTextError(null);
    src.clear();
  };

  const setSel = (set) => { setSelected(set); setText(pagesToText(set)); setTextError(null); clearOutput(); };
  const toggle = (n) => { const s = new Set(selected); if (s.has(n)) s.delete(n); else s.add(n); setSel(s); };

  const onText = (v) => {
    setText(v);
    clearOutput();
    if (!v.trim()) { setSelected(new Set()); setTextError(null); return; }
    try {
      setSelected(new Set(parseRanges(v, src.pages).flat()));
      setTextError(null);
    } catch (e) {
      setTextError(e.message);
    }
  };

  const canSplit =
    !busy &&
    (mode === 'every' ||
      (!textError && (mode === 'select' ? selected.size > 0 : text.trim().length > 0)));

  const split = () =>
    job.run(async (ctl) => {
      clearOutput();
      const base = baseName(src.file.name);

      let groups;
      if (mode === 'every') groups = pageList.map((p) => [p]);
      else if (mode === 'ranges') groups = parseRanges(text, src.pages);
      else {
        if (!selected.size) throw new AppError('Select at least one page, or type a page range.');
        groups = [[...selected].sort((a, b) => a - b)];
      }
      if (groups.length > MAX_OUTPUT_FILES) {
        throw new AppError(`This would create ${groups.length} files. The limit is ${MAX_OUTPUT_FILES}. Use fewer ranges or split the PDF in parts.`);
      }

      const { PDFDocument } = await import('pdf-lib');
      let srcDoc;
      try {
        srcDoc = await PDFDocument.load(src.bytes, { updateMetadata: false });
      } catch {
        throw new AppError('This PDF could not be processed. It may be password-protected or damaged.');
      }

      const out = [];
      const used = new Set();
      for (let i = 0; i < groups.length; i++) {
        ctl.check();
        ctl.progress((i / groups.length) * 100, `Creating file ${i + 1} of ${groups.length}`);
        const g = groups[i];
        const doc = await PDFDocument.create();
        const pages = await doc.copyPages(srcDoc, g.map((p) => p - 1));
        pages.forEach((pg) => doc.addPage(pg));
        doc.setProducer('JustGoPDF');
        const bytes = await doc.save({ useObjectStreams: true });
        out.push({
          name: uniqueName(`${base}-${groupLabel(mode, g)}.pdf`, used),
          blob: new Blob([bytes], { type: 'application/pdf' }),
          pages: g.length,
        });
        if (i % 5 === 0) await new Promise((r) => setTimeout(r, 0)); // let the UI breathe
      }
      ctl.progress(100, 'Finishing');
      setResults(out);
    });

  const zip = async () => {
    setZipping(true);
    setZipError(null);
    try {
      const { default: JSZip } = await import('jszip');
      const z = new JSZip();
      results.forEach((r) => z.file(r.name, r.blob));
      download(await z.generateAsync({ type: 'blob', compression: 'STORE' }), `${baseName(src.file.name)}-split.zip`);
    } catch {
      setZipError('The ZIP file could not be created. Try downloading the files one by one.');
    } finally {
      setZipping(false);
    }
  };

  const interactive = mode === 'select';

  return (
    <ToolShell tool={tool}>
      {!src.file ? (
        <>
          <FileDropzone accept={PDF_ACCEPT} exts={['.pdf']} maxSizeMB={100} onFiles={(f) => { job.reset(); clearOutput(); src.load(f[0]); }} />
          {src.loading && <p className="mt-3 mb-0" role="status">Checking PDF…</p>}
          {src.error && <div className="alert alert-danger mt-3 mb-0" role="alert">{src.error}</div>}
        </>
      ) : (
        <>
          <FileInfo file={src.file} pages={src.pages} onRemove={reset} disabled={busy} />
          <fieldset className="settings" disabled={busy}>
            <legend>Split mode</legend>
            <div className="d-flex flex-column gap-2">
              {MODES.map(([v, l]) => (
                <div className="form-check" key={v}>
                  <input className="form-check-input" type="radio" name="split-mode" id={`m-${v}`} checked={mode === v} onChange={() => { setMode(v); clearOutput(); }} />
                  <label className="form-check-label" htmlFor={`m-${v}`}>{l}</label>
                </div>
              ))}
            </div>
            {mode !== 'every' && (
              <div className="mt-3">
                <label className="form-label" htmlFor="rng">Pages / ranges (e.g. 1-3, 5, 8-10)</label>
                <input
                  id="rng"
                  className={`form-control${textError ? ' is-invalid' : ''}`}
                  value={text}
                  onChange={(e) => onText(e.target.value)}
                  aria-invalid={!!textError}
                  aria-describedby="rng-err"
                  placeholder="1-3, 5, 8-10"
                  autoComplete="off"
                  spellCheck={false}
                />
                <div id="rng-err" className="invalid-feedback">{textError}</div>
                {mode === 'select' && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {[
                      ['Select all', () => new Set(pageList)],
                      ['Clear', () => new Set()],
                      ['Odd pages', () => new Set(pageList.filter((n) => n % 2))],
                      ['Even pages', () => new Set(pageList.filter((n) => !(n % 2)))],
                    ].map(([label, make]) => (
                      <button key={label} type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setSel(make())}>{label}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </fieldset>
          <h2 className="h6 mt-3">Pages {interactive ? '– click to select' : '(preview)'}</h2>
          <div className="page-grid">
            {pageList.map((n) => {
              const on = selected.has(n) && mode !== 'every';
              const cls = `page-cell${on ? ' on' : ''}`;
              const body = (
                <>
                  <PageThumb pdf={src.pdf} pageNumber={n} width={110} alt={`Page ${n}`} />
                  <span>{n}</span>
                </>
              );
              return interactive ? (
                <button key={n} type="button" className={cls} onClick={() => toggle(n)} aria-pressed={on} aria-label={`Page ${n}`} disabled={busy}>
                  {body}
                </button>
              ) : (
                <div key={n} className={cls}>{body}</div>
              );
            })}
          </div>
          <div className="actions">
            <button type="button" className="btn btn-red" onClick={split} disabled={!canSplit}>Split PDF</button>
            <button type="button" className="btn btn-outline-secondary" onClick={reset} disabled={busy}><RotateCcw size={16} /> Reset</button>
          </div>
        </>
      )}
      <StatusPanel
        job={job}
        onCancel={job.cancel}
        success={results.length ? `Done. ${plural(results.length, 'PDF file')} created.` : null}
      />
      {zipError && <div className="alert alert-danger mt-3 mb-0" role="alert">{zipError}</div>}
      {results.length > 0 && (
        <div className="mt-3">
          {results.length > 1 && (
            <button type="button" className="btn btn-red mb-3" onClick={zip} disabled={zipping}>
              <Download size={16} /> {zipping ? 'Creating ZIP…' : 'Download all as ZIP'}
            </button>
          )}
          <ul className="result-list">
            {results.map((r) => (
              <li key={r.name}>
                <span className="text-truncate">
                  {r.name} <span className="text-muted small">· {plural(r.pages, 'page')} · {formatBytes(r.blob.size)}</span>
                </span>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => download(r.blob, r.name)}>Download</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ToolShell>
  );
}