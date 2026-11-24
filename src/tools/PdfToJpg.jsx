import { useMemo, useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import FileDropzone from '../components/FileDropzone.jsx';
import FileInfo from '../components/FileInfo.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import usePdfDocument from '../hooks/usePdfDocument.js';
import useJob from '../hooks/useJob.js';
import useBlobUrls from '../hooks/useBlobUrls.js';
import { getTool } from '../config/toolsData.js';
import { AppError, baseName, canvasToBlob, download, formatBytes, tick } from '../lib/files.js';
import { releaseCanvas, renderPage } from '../lib/pdf.js';

const tool = getTool('pdf-to-jpg');
const PDF_ACCEPT = { 'application/pdf': ['.pdf'] };
const MAX_PIXELS = 16e6; // safe canvas size on iOS Safari
const MAX_TOTAL_BYTES = 500 * 1024 * 1024;

const FORMATS = {
  jpeg: { mime: 'image/jpeg', ext: 'jpg' },
  png: { mime: 'image/png', ext: 'png' },
};
const DPI_OPTIONS = [
  [72, '72 DPI – small'],
  [110, '110 DPI – web'],
  [150, '150 DPI – balanced'],
  [200, '200 DPI – sharp'],
  [300, '300 DPI – print'],
];

export default function PdfToJpg() {
  const src = usePdfDocument(150);
  const job = useJob();
  const [format, setFormat] = useState('jpeg');
  const [quality, setQuality] = useState(0.85);
  const [dpi, setDpi] = useState(150);
  const [output, setOutput] = useState(null); // { files: [{ page, name, blob }], capped }
  const [zipping, setZipping] = useState(false);
  const [zipError, setZipError] = useState(null);

  const files = output?.files;
  const blobs = useMemo(() => (files ? files.map((f) => f.blob) : []), [files]);
  const urls = useBlobUrls(blobs);
  const busy = job.busy || zipping;

  const clearOutput = () => { setOutput(null); setZipError(null); };
  const invalidate = () => { clearOutput(); job.reset(); };

  const reset = () => {
    job.reset();
    clearOutput();
    src.clear();
  };

  const convert = () =>
    job.run(async (ctl) => {
      clearOutput();
      const { mime, ext } = FORMATS[format];
      const base = baseName(src.file.name);
      const want = dpi / 72;
      const total = src.pages;
      const out = [];
      let bytes = 0;
      let capped = false;

      for (let i = 1; i <= total; i++) {
        ctl.check();
        ctl.progress(((i - 1) / total) * 100, `Rendering page ${i} of ${total}`);
        let page;
        let blob;
        try {
          page = await src.pdf.getPage(i);
          const vp = page.getViewport({ scale: 1 });
          const scale = Math.min(want, Math.sqrt(MAX_PIXELS / (vp.width * vp.height)));
          if (scale < want) capped = true;
          const canvas = await renderPage(page, scale);
          try {
            blob = await canvasToBlob(canvas, mime, format === 'jpeg' ? quality : undefined);
          } finally {
            releaseCanvas(canvas);
          }
        } finally {
          page?.cleanup();
        }
        bytes += blob.size;
        if (bytes > MAX_TOTAL_BYTES) {
          throw new AppError(`The images would exceed ${formatBytes(MAX_TOTAL_BYTES)}. Use a lower resolution or the JPG format.`);
        }
        out.push({ page: i, name: `${base}-page-${i}.${ext}`, blob });
        await tick();
      }

      ctl.progress(100, 'Done');
      setOutput({ files: out, capped });
    });

  const zipAll = async () => {
    setZipping(true);
    setZipError(null);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      files.forEach((f) => zip.file(f.name, f.blob));
      const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
      download(blob, `${baseName(src.file.name)}-images.zip`);
    } catch {
      setZipError('The ZIP file could not be created. Try downloading the images one by one.');
    } finally {
      setZipping(false);
    }
  };

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
            <legend>Settings</legend>
            <div className="row g-3">
              <div className="col-sm-4">
                <label className="form-label" htmlFor="fmt">Output format</label>
                <select id="fmt" className="form-select" value={format} onChange={(e) => { setFormat(e.target.value); invalidate(); }}>
                  <option value="jpeg">JPG</option>
                  <option value="png">PNG (lossless)</option>
                </select>
              </div>
              <div className="col-sm-4">
                <label className="form-label" htmlFor="dpi">Resolution</label>
                <select id="dpi" className="form-select" value={dpi} onChange={(e) => { setDpi(Number(e.target.value)); invalidate(); }}>
                  {DPI_OPTIONS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                </select>
              </div>
              <div className="col-sm-4">
                <label className="form-label" htmlFor="q">JPG quality: {Math.round(quality * 100)}%</label>
                <input
                  id="q"
                  type="range"
                  className="form-range"
                  min={0.4}
                  max={1}
                  step={0.05}
                  value={quality}
                  disabled={format !== 'jpeg'}
                  onChange={(e) => { setQuality(Number(e.target.value)); invalidate(); }}
                />
              </div>
            </div>
          </fieldset>
          <div className="actions">
            <button type="button" className="btn btn-red" onClick={convert} disabled={busy}>Convert to images</button>
            <button type="button" className="btn btn-outline-secondary" onClick={reset} disabled={busy}><RotateCcw size={16} /> Reset</button>
          </div>
        </>
      )}
      <StatusPanel
        job={job}
        onCancel={job.cancel}
        success={files?.length ? `Done. ${files.length} image${files.length === 1 ? '' : 's'} created.` : null}
      />
      {output?.capped && (
        <div className="alert alert-warning mt-3 mb-0" role="note">
          Some large pages were rendered below {dpi} DPI to stay within the browser's image size limit.
        </div>
      )}
      {zipError && <div className="alert alert-danger mt-3 mb-0" role="alert">{zipError}</div>}
      {files?.length > 0 && (
        <div className="mt-4">
          <button type="button" className="btn btn-red mb-3" onClick={zipAll} disabled={zipping}>
            <Download size={16} /> {zipping ? 'Creating ZIP…' : 'Download all as ZIP'}
          </button>
          <div className="result-grid">
            {files.map((f, i) => (
              <figure key={f.page} className="result-card">
                {urls[i] && <img src={urls[i]} alt={`Page ${f.page}`} loading="lazy" decoding="async" />}
                <figcaption>
                  <span>Page {f.page} · {formatBytes(f.blob.size)}</span>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => download(f.blob, f.name)}>Download</button>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </ToolShell>
  );
}