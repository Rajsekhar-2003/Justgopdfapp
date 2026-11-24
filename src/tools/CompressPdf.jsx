import { useEffect, useMemo, useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import FileDropzone from '../components/FileDropzone.jsx';
import FileInfo from '../components/FileInfo.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import PageThumb from '../components/PageThumb.jsx';
import usePdfDocument from '../hooks/usePdfDocument.js';
import useJob from '../hooks/useJob.js';
import { getTool } from '../config/toolsData.js';
import { baseName, download, formatBytes, MB } from '../lib/files.js';
import { openPdf } from '../lib/pdf.js';
import { analyzePdf, compressPdf, LEVEL_SAVINGS } from '../lib/compress.js';

const tool = getTool('compress-pdf');
const PDF_ACCEPT = { 'application/pdf': ['.pdf'] };
const MIN_KB = 20;
const MAX_KB = 50000;
const MAX_JPEG_SAVINGS = 0.85; // best-case share of JPEG bytes a target can remove

const PRESETS = [
  { id: 't100', label: 'Target 100 KB', target: 100 * 1024 },
  { id: 't200', label: 'Target 200 KB', target: 200 * 1024 },
  { id: 't500', label: 'Target 500 KB', target: 500 * 1024 },
  { id: 't1m', label: 'Target 1 MB', target: MB },
  { id: 't2m', label: 'Target 2 MB', target: 2 * MB },
  { id: 't5m', label: 'Target 5 MB', target: 5 * MB },
  { id: 'low', label: 'Low compression', level: 'low', note: 'Best quality' },
  { id: 'recommended', label: 'Recommended', level: 'recommended', note: 'Balanced' },
  { id: 'high', label: 'High compression', level: 'high', note: 'Smallest, lower image quality' },
  { id: 'custom', label: 'Custom target' },
];

const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

export default function CompressPdf() {
  const src = usePdfDocument(1000);
  const job = useJob();
  const [preset, setPreset] = useState('recommended');
  const [customKb, setCustomKb] = useState('300');
  const [removeMeta, setRemoveMeta] = useState(false);
  const [raster, setRaster] = useState(false);
  const [info, setInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [resultPdf, setResultPdf] = useState(null);

  // Destroy the previous result document when it is replaced or on unmount.
  useEffect(() => () => resultPdf?.destroy?.(), [resultPdf]);

  useEffect(() => {
    setInfo(null);
    if (!src.bytes) return undefined;
    let live = true;
    analyzePdf(src.bytes)
      .then((r) => live && setInfo(r))
      .catch(() => live && setInfo({ images: 0, jpegBytes: 0, failed: true }));
    return () => { live = false; };
  }, [src.bytes]);

  const clearResult = () => { setResult(null); setResultPdf(null); };

  const reset = () => {
    job.reset();
    clearResult();
    setInfo(null);
    src.clear();
  };

  // Any setting change invalidates the previous result.
  const changed = (setter) => (value) => { setter(value); clearResult(); };
  const choosePreset = changed(setPreset);
  const chooseCustom = changed(setCustomKb);
  const chooseMeta = changed(setRemoveMeta);
  const chooseRaster = changed(setRaster);

  const p = PRESETS.find((x) => x.id === preset);
  const isCustom = p.id === 'custom';
  const customNum = Number(customKb);
  const customValid = customKb.trim() !== '' && Number.isFinite(customNum) && customNum >= MIN_KB && customNum <= MAX_KB;
  const targetBytes = p.level ? null : isCustom ? (customValid ? Math.round(customNum) * 1024 : null) : p.target;
  const orig = src.file?.size ?? 0;
  const canRun = !job.busy && (p.level || targetBytes !== null);

  const { estimate, feasibilityNote } = useMemo(() => {
    if (!info || info.failed || !orig) return {};
    if (p.level) {
      return { estimate: clamp(Math.round(orig - info.jpegBytes * LEVEL_SAVINGS[p.level]), 0, orig) };
    }
    if (targetBytes === null) return {};
    const floor = Math.round(orig - info.jpegBytes * MAX_JPEG_SAVINGS);
    return {
      estimate: Math.max(Math.min(targetBytes, orig), floor),
      feasibilityNote: floor > targetBytes
        ? `Only about ${formatBytes(info.jpegBytes)} of this file is compressible JPEG image data, so ${formatBytes(targetBytes)} is probably out of reach without rasterising pages.`
        : null,
    };
  }, [info, orig, p, targetBytes]);

  const run = () =>
    job.run(async (ctl) => {
      clearResult();
      const { bytes, ...meta } = await compressPdf(src.bytes, {
        level: p.level,
        targetBytes: p.level ? undefined : targetBytes,
        removeMetadata: removeMeta,
        allowRasterize: raster && !p.level,
        pdfjsDoc: src.pdf,
      }, ctl);
      ctl.progress(97, 'Verifying result…');
      const pdf = await openPdf(bytes); // proves the output is a readable PDF
      try {
        ctl.check(); // throws if cancelled
      } catch (e) {
        pdf.destroy?.();
        throw e;
      }
      setResultPdf(pdf);
      setResult({ ...meta, blob: new Blob([bytes], { type: 'application/pdf' }) });
    });

  const saved = result ? Math.max(0, orig - result.blob.size) : 0;
  const pct = result && orig ? (saved / orig) * 100 : 0;

  return (
    <ToolShell tool={tool}>
      {!src.file ? (
        <>
          <FileDropzone accept={PDF_ACCEPT} exts={['.pdf']} maxSizeMB={100} onFiles={(f) => { job.reset(); clearResult(); src.load(f[0]); }} />
          {src.loading && <p className="mt-3 mb-0" role="status">Analysing PDF…</p>}
          {src.error && <div className="alert alert-danger mt-3 mb-0" role="alert">{src.error}</div>}
        </>
      ) : (
        <>
          <FileInfo
            file={src.file}
            pages={src.pages}
            onRemove={reset}
            disabled={job.busy}
            extra={info && !info.failed ? `${info.images} compressible image${info.images === 1 ? '' : 's'}` : undefined}
          />
          <fieldset className="settings" disabled={job.busy}>
            <legend>Compression preset</legend>
            <div className="preset-grid">
              {PRESETS.map((x) => (
                <label key={x.id} className={`preset${preset === x.id ? ' on' : ''}`}>
                  <input type="radio" name="compress-preset" className="visually-hidden" checked={preset === x.id} onChange={() => choosePreset(x.id)} />
                  <strong>{x.label}</strong>{x.note && <small>{x.note}</small>}
                </label>
              ))}
            </div>
            {isCustom && (
              <div className="mt-3" style={{ maxWidth: 220 }}>
                <label className="form-label" htmlFor="ckb">Target size (KB)</label>
                <input
                  id="ckb"
                  className={`form-control${customValid ? '' : ' is-invalid'}`}
                  type="number"
                  inputMode="numeric"
                  min={MIN_KB}
                  max={MAX_KB}
                  step={10}
                  value={customKb}
                  onChange={(e) => chooseCustom(e.target.value)}
                  aria-invalid={!customValid}
                  aria-describedby="ckb-err"
                />
                <div id="ckb-err" className="invalid-feedback">Enter a size between {MIN_KB} and {MAX_KB.toLocaleString()} KB.</div>
              </div>
            )}
            <div className="size-row mt-3">
              <div><span>Original size</span><strong>{formatBytes(orig)}</strong></div>
              <div><span>{p.level ? 'Compression level' : 'Selected target'}</span><strong>{p.level ? p.label : targetBytes ? formatBytes(targetBytes) : 'n/a'}</strong></div>
              <div><span>Estimated output</span><strong>{estimate ? `~${formatBytes(estimate)}` : 'n/a'}</strong></div>
            </div>
            {feasibilityNote && <div className="alert alert-warning mt-3 mb-0" role="note">{feasibilityNote}</div>}
            <div className="form-check mt-3">
              <input className="form-check-input" id="meta" type="checkbox" checked={removeMeta} onChange={(e) => chooseMeta(e.target.checked)} />
              <label className="form-check-label" htmlFor="meta">Remove document metadata (title, author, XMP)</label>
            </div>
            {!p.level && (
              <div className="form-check">
                <input className="form-check-input" id="ras" type="checkbox" checked={raster} onChange={(e) => chooseRaster(e.target.checked)} />
                <label className="form-check-label" htmlFor="ras">
                  If the target cannot be reached, allow converting pages to images <span className="text-muted">(text will no longer be selectable)</span>
                </label>
              </div>
            )}
          </fieldset>
          <div className="actions">
            <button type="button" className="btn btn-red" onClick={run} disabled={!canRun}>Compress PDF</button>
            <button type="button" className="btn btn-outline-secondary" onClick={reset} disabled={job.busy}><RotateCcw size={16} /> Reset</button>
          </div>
        </>
      )}
      <StatusPanel job={job} onCancel={job.cancel} success={null} />
      <div aria-live="polite">
        {result && (
          <div className="mt-4">
            <div className="alert alert-success mb-3">
              {result.unchanged
                ? 'This PDF is already well optimised, so the original was kept. No smaller version could be produced without removing content.'
                : 'Your PDF was optimized successfully.'}
            </div>
            <div className="size-row">
              <div><span>Original</span><strong>{formatBytes(orig)}</strong></div>
              <div><span>Final</span><strong>{formatBytes(result.blob.size)}</strong></div>
              <div><span>Saved</span><strong>{formatBytes(saved)}</strong></div>
              <div><span>Reduction</span><strong>{pct.toFixed(1)}%</strong></div>
            </div>
            {result.reachedTarget === false && targetBytes && (
              <div className="alert alert-warning mt-3" role="note">
                The target of {formatBytes(targetBytes)} could not be reached without unacceptable quality loss. The best result is {formatBytes(result.blob.size)}.
                {!raster && ' Enabling page-to-image conversion may shrink it further, at the cost of selectable text.'}
              </div>
            )}
            {result.method === 'rasterized' && (
              <div className="alert alert-warning mt-3" role="note">Pages were converted to images to reach a smaller size. Text in this file is no longer selectable or searchable.</div>
            )}
            <p className="small text-muted mt-3">Actual file size may vary depending on the original PDF content.</p>
            <div className="d-flex flex-wrap gap-4 mb-3">
              <div><div className="small fw-semibold mb-1">Original (page 1)</div><PageThumb pdf={src.pdf} width={150} alt="Original PDF, first page" /></div>
              <div><div className="small fw-semibold mb-1">Compressed (page 1)</div>{resultPdf && <PageThumb pdf={resultPdf} width={150} alt="Compressed PDF, first page" />}</div>
            </div>
            <button type="button" className="btn btn-red" onClick={() => download(result.blob, `${baseName(src.file.name)}-compressed.pdf`)}>
              <Download size={16} /> Download compressed PDF
            </button>
          </div>
        )}
      </div>
    </ToolShell>
  );
}