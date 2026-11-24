import { useEffect, useRef, useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import FileDropzone from '../components/FileDropzone.jsx';
import FileInfo from '../components/FileInfo.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import useJob from '../hooks/useJob.js';
import { getTool } from '../config/toolsData.js';
import { AppError, baseName, download, formatBytes } from '../lib/files.js';

const tool = getTool('word-to-pdf');
const MARGINS = { narrow: 36, normal: 54, wide: 72 }; // points (0.5", 0.75", 1")
const DOCX_ACCEPT = { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] };
const MAX_HTML_CHARS = 8e6; // guards against huge embedded images and ZIP bombs

const FIELDS = [
  { key: 'size', label: 'Page size', options: [['a4', 'A4'], ['letter', 'Letter']] },
  { key: 'orientation', label: 'Orientation', options: [['portrait', 'Portrait'], ['landscape', 'Landscape']] },
  { key: 'margin', label: 'Margins', options: [['narrow', 'Narrow (0.5")'], ['normal', 'Normal (0.75")'], ['wide', 'Wide (1")']] },
  { key: 'fontSize', label: 'Body font size', options: [10, 11, 12, 13, 14].map((n) => [n, `${n} pt`]) },
];

const DEFAULTS = { size: 'a4', orientation: 'portrait', margin: 'normal', fontSize: 11 };

function checkSignature(buf) {
  const b = new Uint8Array(buf, 0, Math.min(4, buf.byteLength));
  if (b[0] === 0x50 && b[1] === 0x4b) return; // ZIP (valid .docx)
  if (b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0) {
    throw new AppError('This file is an old .doc file or is password-protected. Remove the password or save it as .docx in Word and try again.');
  }
  throw new AppError('This file is not a valid .docx document.');
}

async function loadLibs() {
  try {
    const [mammothMod, purifyMod] = await Promise.all([import('mammoth'), import('dompurify')]);
    return {
      mammoth: mammothMod.default || mammothMod,
      DOMPurify: purifyMod.default || purifyMod,
    };
  } catch {
    throw new AppError('The converter could not be loaded. Check your connection and try again.');
  }
}

export default function WordToPdf() {
  const [file, setFile] = useState(null);
  const [html, setHtml] = useState('');
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [opts, setOpts] = useState(DEFAULTS);
  const [result, setResult] = useState(null);
  const job = useJob();
  const loadId = useRef(0);
  const cancelRef = useRef(null);
  cancelRef.current = job.cancel;

  useEffect(() => () => {
    loadId.current += 1; // ignore in-flight loads after unmount
    cancelRef.current?.(); // stop a running conversion
  }, []);

  const reset = () => {
    loadId.current += 1;
    job.reset();
    setFile(null);
    setHtml('');
    setResult(null);
    setWarnings([]);
    setLoadError(null);
    setLoading(false);
    setOpts(DEFAULTS);
  };

  const setOpt = (key) => (e) => {
    const v = key === 'fontSize' ? Number(e.target.value) : e.target.value;
    setOpts((o) => ({ ...o, [key]: v }));
    setResult(null);
    job.reset();
  };

  const load = async (f) => {
    reset();
    const id = loadId.current;
    setLoading(true);
    try {
      const buf = await f.arrayBuffer();
      checkSignature(buf);
      const { mammoth, DOMPurify } = await loadLibs();
      const res = await mammoth.convertToHtml({ arrayBuffer: buf });
      if (res.value.length > MAX_HTML_CHARS) {
        throw new AppError('This document has too much content or too many large images to convert in the browser.');
      }
      const clean = DOMPurify.sanitize(res.value, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form'],
        FORBID_ATTR: ['style', 'onerror', 'onload'],
      });
      if (!clean.replace(/<[^>]+>/g, '').trim() && !/<img/i.test(clean)) {
        throw new AppError('No readable content was found in this document.');
      }
      if (id !== loadId.current) return; // superseded or unmounted
      setHtml(clean);
      setWarnings([...new Set(res.messages.map((m) => m.message))].slice(0, 5));
      setFile(f);
    } catch (e) {
      if (id !== loadId.current) return;
      setLoadError(e instanceof AppError ? e.message : 'This document could not be read. It may be corrupted.');
    } finally {
      if (id === loadId.current) setLoading(false);
    }
  };

  const convert = () =>
    job.run(async (ctl) => {
      setResult(null);
      const name = `${baseName(file.name)}.pdf`;
      const { htmlToPdf, countUnsupportedChars } = await import('../lib/htmlToPdf.js');
      const text = new DOMParser().parseFromString(html, 'text/html').body.textContent || '';
      const blob = await htmlToPdf(
        html,
        { size: opts.size, orientation: opts.orientation, margin: MARGINS[opts.margin], fontSize: opts.fontSize },
        ctl,
      );
      ctl.check(); // throws if cancelled during the last step
      ctl.progress(100, 'Done');
      setResult({ blob, name, unsupported: countUnsupportedChars(text) });
    });

  // Keep preview links from navigating away (click, Enter and middle-click).
  const blockLinks = (e) => { if (e.target.closest('a')) e.preventDefault(); };

  return (
    <ToolShell tool={tool}>
      {!file ? (
        <>
          <FileDropzone accept={DOCX_ACCEPT} exts={['.docx']} maxSizeMB={25} onFiles={(f) => load(f[0])} />
          {loading && <p className="mt-3 mb-0" role="status">Reading document…</p>}
          {loadError && <div className="alert alert-danger mt-3 mb-0" role="alert">{loadError}</div>}
        </>
      ) : (
        <>
          <FileInfo file={file} onRemove={reset} disabled={job.busy} />
          <h2 className="h6 mt-4">Preview</h2>
          <div
            className="docx-preview"
            role="region"
            tabIndex={0}
            aria-label="Document preview"
            onClick={blockLinks}
            onAuxClick={blockLinks}
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {warnings.length > 0 && (
            <div className="alert alert-warning mt-3 mb-0" role="note">Some Word features are not supported: {warnings.join(' ')}</div>
          )}
          <fieldset className="settings" disabled={job.busy}>
            <legend>PDF settings</legend>
            <div className="row g-3">
              {FIELDS.map(({ key, label, options }) => (
                <div className="col-6 col-md-3" key={key}>
                  <label className="form-label" htmlFor={`w2p-${key}`}>{label}</label>
                  <select id={`w2p-${key}`} className="form-select" value={opts[key]} onChange={setOpt(key)}>
                    {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </fieldset>
          <div className="alert alert-warning mt-3 mb-0" role="note">
            This is a browser-based reconstruction, not Microsoft Word. Fonts are replaced with standard PDF fonts and headers, footers, text boxes and columns are not reproduced. Table cells keep text only.
          </div>
          <div className="actions">
            <button type="button" className="btn btn-red" onClick={convert} disabled={job.busy}>Convert to PDF</button>
            <button type="button" className="btn btn-outline-secondary" onClick={reset} disabled={job.busy}><RotateCcw size={16} /> Reset</button>
          </div>
        </>
      )}
      <StatusPanel job={job} onCancel={job.cancel} success={result ? `Your PDF is ready (${formatBytes(result.blob.size)}).` : null} />
      {result?.unsupported > 0 && (
        <div className="alert alert-warning mt-3 mb-0" role="note">
          {result.unsupported} character{result.unsupported === 1 ? '' : 's'} outside the Latin alphabet may not display correctly in the PDF.
        </div>
      )}
      {result && (
        <button type="button" className="btn btn-red mt-3" onClick={() => download(result.blob, result.name)}>
          <Download size={16} /> Download PDF
        </button>
      )}
    </ToolShell>
  );
}