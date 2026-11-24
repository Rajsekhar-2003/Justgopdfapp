import { useEffect, useRef, useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import FileDropzone from '../components/FileDropzone.jsx';
import SortableList from '../components/SortableList.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import PageThumb from '../components/PageThumb.jsx';
import useJob from '../hooks/useJob.js';
import { getTool } from '../config/toolsData.js';
import { AppError, download, formatBytes, friendlyError, readBytes, uid } from '../lib/files.js';
import { inspectPdf, openPdf } from '../lib/pdf.js';

const tool = getTool('merge-pdf');
const MAX_FILES = 30;
const MAX_PAGES_PER_FILE = 2000;
const MAX_TOTAL_PAGES = 5000;
const MAX_TOTAL_BYTES = 300 * 1024 * 1024;
const PDF_ACCEPT = { 'application/pdf': ['.pdf'] };

export default function MergePdf() {
  const [items, setItems] = useState([]);
  const [problems, setProblems] = useState([]);
  const [adding, setAdding] = useState(false);
  const [result, setResult] = useState(null);
  const [resultPdf, setResultPdf] = useState(null);
  const job = useJob();
  const docs = useRef(new Map()); // id -> pdf.js doc
  const session = useRef(0); // bumped on reset/unmount to discard in-flight adds

  const busy = job.busy || adding;

  // Destroy the previous result document when it is replaced or on unmount.
  useEffect(() => () => resultPdf?.destroy?.(), [resultPdf]);

  useEffect(() => {
    const map = docs.current;
    return () => {
      session.current += 1;
      map.forEach((d) => d.destroy());
      map.clear();
    };
  }, []);

  const invalidate = () => { setResult(null); setResultPdf(null); job.reset(); };

  const add = async (files) => {
    const s = session.current;
    setAdding(true);
    setProblems([]);
    invalidate();

    const errs = [];
    const added = [];
    let totalPages = items.reduce((n, it) => n + it.pages, 0);
    let totalBytes = items.reduce((n, it) => n + it.file.size, 0);

    for (const f of files) {
      if (items.length + added.length >= MAX_FILES) { errs.push(`Maximum of ${MAX_FILES} files reached.`); break; }
      if (totalBytes + f.size > MAX_TOTAL_BYTES) {
        errs.push(`${f.name}: combined size would exceed ${formatBytes(MAX_TOTAL_BYTES)}.`);
        continue;
      }
      let pdf;
      try {
        const res = await inspectPdf(f, { maxPages: MAX_PAGES_PER_FILE });
        pdf = res.pdf;
        if (s !== session.current) { pdf.destroy?.(); return; } // reset or unmounted meanwhile
        if (totalPages + res.pages > MAX_TOTAL_PAGES) {
          pdf.destroy?.();
          errs.push(`${f.name}: combined page count would exceed ${MAX_TOTAL_PAGES.toLocaleString()}.`);
          continue;
        }
        const id = uid();
        docs.current.set(id, pdf);
        added.push({ id, file: f, pages: res.pages });
        totalPages += res.pages;
        totalBytes += f.size;
      } catch (e) {
        if (s !== session.current) return;
        errs.push(`${f.name}: ${friendlyError(e)}`);
      }
    }

    if (s !== session.current) return;
    if (added.length) setItems((c) => [...c, ...added]);
    setProblems(errs);
    setAdding(false);
  };

  const remove = (it) => {
    docs.current.get(it.id)?.destroy();
    docs.current.delete(it.id);
    setItems((c) => c.filter((x) => x.id !== it.id));
    invalidate();
  };

  const reset = () => {
    session.current += 1;
    docs.current.forEach((d) => d.destroy());
    docs.current.clear();
    job.reset();
    setItems([]);
    setProblems([]);
    setResult(null);
    setResultPdf(null);
    setAdding(false);
  };

  const merge = () =>
    job.run(async (ctl) => {
      setResult(null);
      setResultPdf(null);
      const { PDFDocument } = await import('pdf-lib');
      const out = await PDFDocument.create();
      let total = 0;

      for (let i = 0; i < items.length; i++) {
        ctl.check();
        const { file } = items[i];
        ctl.progress((i / items.length) * 95, `Merging ${file.name}`);
        let src;
        try {
          src = await PDFDocument.load(await readBytes(file), { updateMetadata: false });
        } catch {
          throw new AppError(`"${file.name}" could not be merged. It may be password-protected or damaged.`);
        }
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((pg) => out.addPage(pg));
        total += pages.length;
        await new Promise((r) => setTimeout(r, 0)); // let the UI breathe
      }

      ctl.progress(97, 'Saving PDF');
      out.setProducer('JustGoPDF');
      const bytes = await out.save({ useObjectStreams: true });
      const pdf = await openPdf(bytes); // proves the output is a readable PDF
      try {
        ctl.check(); // throws if cancelled
      } catch (e) {
        pdf.destroy?.();
        throw e;
      }
      ctl.progress(100, 'Done');
      setResultPdf(pdf);
      setResult({ blob: new Blob([bytes], { type: 'application/pdf' }), pages: total, files: items.length });
    });

  return (
    <ToolShell tool={tool}>
      <FileDropzone
        accept={PDF_ACCEPT}
        exts={['.pdf']}
        multiple
        maxFiles={MAX_FILES}
        maxSizeMB={100}
        onFiles={add}
        disabled={busy || items.length >= MAX_FILES}
        compact={items.length > 0}
        title={items.length ? 'Add more PDFs' : 'Drag and drop PDF files here'}
      />
      {adding && <p className="mt-3 mb-0" role="status">Checking files…</p>}
      {problems.length > 0 && (
        <div className="alert alert-danger mt-3 mb-0" role="alert">
          {problems.map((p, i) => <div key={i}>{p}</div>)}
        </div>
      )}
      {items.length > 0 && (
        <>
          <h2 className="h6 mt-4">{items.length} file{items.length === 1 ? '' : 's'} – drag to reorder</h2>
          <SortableList
            label="PDF files in merge order"
            items={items}
            disabled={busy}
            onChange={(n) => { setItems(n); invalidate(); }}
            onRemove={remove}
            renderItem={(it, i) => (
              <>
                <PageThumb pdf={docs.current.get(it.id)} width={48} alt="" />
                <div className="min-w-0">
                  <div className="text-truncate fw-semibold">{i + 1}. {it.file.name}</div>
                  <div className="small text-muted">{it.pages} page{it.pages === 1 ? '' : 's'} · {formatBytes(it.file.size)}</div>
                </div>
              </>
            )}
          />
          <div className="actions">
            <button type="button" className="btn btn-red" onClick={merge} disabled={busy || items.length < 2}>Merge PDFs</button>
            <button type="button" className="btn btn-outline-secondary" onClick={reset} disabled={busy}><RotateCcw size={16} /> Reset</button>
          </div>
          {items.length < 2 && <p className="small text-muted mt-2 mb-0">Add at least two PDFs to merge.</p>}
        </>
      )}
      <StatusPanel
        job={job}
        onCancel={job.cancel}
        success={result ? `Merged ${result.files} files into one PDF with ${result.pages} pages (${formatBytes(result.blob.size)}).` : null}
      />
      {result && (
        <div className="mt-3 d-flex flex-wrap gap-3 align-items-end">
          {resultPdf && <PageThumb pdf={resultPdf} width={110} alt="First page of merged PDF" />}
          <button type="button" className="btn btn-red" onClick={() => download(result.blob, 'merged.pdf')}>
            <Download size={16} /> Download merged PDF
          </button>
        </div>
      )}
    </ToolShell>
  );
}