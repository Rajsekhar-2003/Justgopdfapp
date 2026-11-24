import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import FileDropzone from '../components/FileDropzone.jsx';
import FileInfo from '../components/FileInfo.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import usePdfDocument from '../hooks/usePdfDocument.js';
import useJob from '../hooks/useJob.js';
import { getTool } from '../config/toolsData.js';
import { AppError, baseName, download, formatBytes, tick } from '../lib/files.js';
import { extractLines } from '../lib/pdfText.js';

const tool = getTool('pdf-to-word');
const PDF_ACCEPT = { 'application/pdf': ['.pdf'] };
const BULLET = /^([•●▪◦·\-–*]|\d{1,3}[.)])\s+/;

// Control characters and lone surrogates are illegal in XML and make Word report the file as corrupt.
const XML_ILLEGAL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g;
const clean = (s) =>
  String(s ?? '')
    .replace(XML_ILLEGAL, '')
    .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, '')
    .replace(/(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '$1');

const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

// Most common font size, weighted by characters. Cheap and robust against a few large headings.
function bodySize(lines) {
  const hist = new Map();
  for (const l of lines) {
    if (!Number.isFinite(l.size) || l.size <= 0) continue;
    const k = Math.round(l.size * 2) / 2;
    hist.set(k, (hist.get(k) || 0) + Math.min(l.text.length, 200));
  }
  let best = 11;
  let max = 0;
  for (const [k, v] of hist) if (v > max) { max = v; best = k; }
  return best;
}

function headingFor(HeadingLevel, ln, body) {
  const ratio = ln.size / body;
  const len = ln.text.length;
  if (ratio >= 1.6 && len <= 150) return HeadingLevel.HEADING_1;
  if (ratio >= 1.3 && len <= 150) return HeadingLevel.HEADING_2;
  if (ratio >= 1.12 && ln.bold && len < 90) return HeadingLevel.HEADING_3;
  return undefined;
}

// Word run size in half-points. Sizes close to the body size snap to it so the document stays consistent.
function runSize(size, body) {
  const pt = Math.abs(size / body - 1) < 0.08 ? body : size;
  return clamp(Math.round(pt * 2), 16, 144);
}

async function buildChildren(docx, pages, body, ctl) {
  const { Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;
  const children = [];

  for (let p = 0; p < pages.length; p++) {
    ctl.check();
    ctl.progress(80 + (p / pages.length) * 15, `Building page ${p + 1} of ${pages.length}`);
    const pg = pages[p];
    let cur = null; // { runs, heading, centered, pageBreak, lastY }
    let pageStart = true;

    const flush = () => {
      if (!cur) return;
      children.push(new Paragraph({
        children: cur.runs,
        heading: cur.heading,
        alignment: cur.centered ? AlignmentType.CENTER : AlignmentType.LEFT,
        pageBreakBefore: cur.pageBreak,
        spacing: { after: 120 },
      }));
      cur = null;
    };

    for (const ln of pg.lines) {
      const text = clean(ln.text).trim();
      if (!text) continue;

      const heading = headingFor(HeadingLevel, ln, body);
      const centered = Math.abs((ln.x + ln.right) / 2 - pg.width / 2) < pg.width * 0.04 && ln.x > pg.width * 0.15;
      const isItem = BULLET.test(text);
      const gap = cur ? cur.lastY - ln.y : 0; // y decreases down the page
      const continues =
        cur && !isItem && heading === cur.heading && centered === cur.centered &&
        gap >= -ln.size * 0.5 && // a big upward jump means a new column
        gap <= ln.size * (heading ? 1.5 : 1.7);

      if (!continues) {
        flush();
        cur = { runs: [], heading, centered, pageBreak: pageStart && children.length > 0, lastY: ln.y };
        pageStart = false;
      }

      // Merge adjacent items with the same style into runs.
      let buf = '';
      let style = null;
      let lead = cur.runs.length ? ' ' : ''; // joins this line to the previous one
      let prevEnd = null;
      const flushRun = () => {
        if (!buf) return;
        cur.runs.push(new TextRun({
          text: buf,
          bold: style.bold || !!heading,
          italics: style.italic,
          size: heading ? undefined : runSize(ln.size, body),
        }));
        buf = '';
      };

      for (const it of ln.items) {
        const str = clean(it.str);
        if (!str) continue;
        const st = { bold: !!it.bold, italic: !!it.italic };
        if (buf && (st.bold !== style.bold || st.italic !== style.italic)) flushRun();
        if (!buf) { style = st; buf = lead; lead = ''; }
        const needsSpace = prevEnd !== null && it.x - prevEnd > it.size * 0.15 && !buf.endsWith(' ') && !str.startsWith(' ');
        buf += (needsSpace ? ' ' : '') + str;
        prevEnd = it.x + it.w;
      }
      flushRun();
      cur.lastY = ln.y;
    }

    flush();
    if (p % 10 === 9) await tick(); // let the UI breathe
  }
  return children;
}

export default function PdfToWord() {
  const src = usePdfDocument(300);
  const job = useJob();
  const [result, setResult] = useState(null); // { blob, name, skipped }

  const reset = () => { job.reset(); setResult(null); src.clear(); };

  const convert = () =>
    job.run(async (ctl) => {
      setResult(null);
      const name = `${baseName(src.file.name)}.docx`;

      const pages = await extractLines(src.pdf, {
        detectFonts: true,
        onProgress: (p, m) => ctl.progress(p * 0.8, m),
        isCancelled: () => { ctl.check(); return false; },
      });
      const all = pages.flatMap((p) => p.lines);
      if (!all.length) {
        throw new AppError('No selectable text was found. This looks like a scanned or image-only PDF, which this tool cannot convert (no OCR).', 'no-text');
      }

      const body = bodySize(all);
      const docx = await import('docx');
      const children = await buildChildren(docx, pages, body, ctl);
      if (!children.length) throw new AppError('No readable text was found in this PDF.', 'no-text');

      ctl.progress(96, 'Saving Word document…');
      const doc = new docx.Document({
        creator: 'JustGoPDF',
        title: clean(baseName(src.file.name)),
        sections: [{ children }],
      });
      const blob = await docx.Packer.toBlob(doc);
      ctl.check();
      ctl.progress(100, 'Done');
      setResult({ blob, name, skipped: pages.filter((p) => !p.lines.length).length });
    });

  return (
    <ToolShell tool={tool}>
      {!src.file ? (
        <>
          <FileDropzone accept={PDF_ACCEPT} exts={['.pdf']} maxSizeMB={100} onFiles={(f) => { job.reset(); setResult(null); src.load(f[0]); }} />
          {src.loading && <p className="mt-3 mb-0" role="status">Checking PDF…</p>}
          {src.error && <div className="alert alert-danger mt-3 mb-0" role="alert">{src.error}</div>}
        </>
      ) : (
        <>
          <FileInfo file={src.file} pages={src.pages} onRemove={reset} disabled={job.busy} />
          <div className="alert alert-warning mt-3 mb-0" role="note">
            Layout is rebuilt from text. Complex layouts, tables, scanned pages and images may not convert perfectly, and images are not included.
          </div>
          <div className="actions">
            <button type="button" className="btn btn-red" onClick={convert} disabled={job.busy}>Convert to Word</button>
            <button type="button" className="btn btn-outline-secondary" onClick={reset} disabled={job.busy}><RotateCcw size={16} /> Reset</button>
          </div>
        </>
      )}
      <StatusPanel
        job={job}
        onCancel={job.cancel}
        success={result ? `Your Word document is ready (${formatBytes(result.blob.size)}). Open it and review the formatting.` : null}
      />
      {result?.skipped > 0 && (
        <div className="alert alert-warning mt-3 mb-0" role="note">
          {result.skipped} page{result.skipped === 1 ? ' has' : 's have'} no selectable text (scanned or image-only) and {result.skipped === 1 ? 'was' : 'were'} left out.
        </div>
      )}
      {result && (
        <button type="button" className="btn btn-red mt-3" onClick={() => download(result.blob, result.name)}>
          <Download size={16} /> Download DOCX
        </button>
      )}
    </ToolShell>
  );
}