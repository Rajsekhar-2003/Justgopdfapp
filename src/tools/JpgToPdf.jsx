import { useEffect, useRef, useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import FileDropzone from '../components/FileDropzone.jsx';
import SortableList from '../components/SortableList.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import useJob from '../hooks/useJob.js';
import { getTool } from '../config/toolsData.js';
import { AppError, baseName, canvasToBlob, download, formatBytes, readBytes, uid } from '../lib/files.js';

const tool = getTool('jpg-to-pdf');
const SIZES = { a4: [595.28, 841.89], letter: [612, 792] };
const MAX_IMAGES = 100;
const MAX_PIXELS = 50e6; // cap for canvas re-encoding
const MAX_PAGE_PT = 14400; // PDF page size limit in Acrobat
const ACCEPT = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] };

const DEFAULTS = { pageSize: 'a4', orientation: 'auto', margin: 10, fit: 'contain' };
const SELECTS = [
  { key: 'pageSize', id: 'ps', label: 'Page size', options: [['a4', 'A4'], ['letter', 'Letter'], ['original', 'Fit to image']] },
  { key: 'orientation', id: 'or', label: 'Orientation', options: [['auto', 'Auto (match image)'], ['portrait', 'Portrait'], ['landscape', 'Landscape']] },
  { key: 'margin', id: 'mg', label: 'Margins', numeric: true, options: [[0, 'No margin'], [5, 'Small'], [10, 'Medium'], [20, 'Large']] },
  { key: 'fit', id: 'ft', label: 'Image fit', options: [['contain', 'Fit to page'], ['shrink', 'Shrink only (no enlarging)'], ['stretch', 'Stretch to fill']] },
];

function sniff(b) {
  if (b[0] === 0xff && b[1] === 0xd8) return 'jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
  return null;
}

// Reads the EXIF orientation tag (1-8) from a JPEG. Returns 1 if absent or unreadable.
function jpegOrientation(b) {
  let p = 2;
  while (p + 4 <= b.length) {
    if (b[p] !== 0xff) return 1;
    const marker = b[p + 1];
    if (marker === 0xda || marker === 0xd9) return 1; // image data reached, no EXIF
    const len = (b[p + 2] << 8) | b[p + 3];
    if (marker === 0xe1 && b[p + 4] === 0x45 && b[p + 5] === 0x78 && b[p + 6] === 0x69 && b[p + 7] === 0x66) {
      const t = p + 10; // TIFF header
      const le = b[t] === 0x49;
      const u16 = (o) => (le ? b[o] | (b[o + 1] << 8) : (b[o] << 8) | b[o + 1]);
      const u32 = (o) => (le
        ? (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0
        : ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0);
      const ifd = t + u32(t + 4);
      if (ifd + 2 > b.length) return 1;
      const n = u16(ifd);
      for (let i = 0; i < n; i++) {
        const e = ifd + 2 + i * 12;
        if (e + 12 > b.length) return 1;
        if (u16(e) === 0x0112) {
          const v = u16(e + 8);
          return v >= 1 && v <= 8 ? v : 1;
        }
      }
      return 1;
    }
    p += 2 + len;
  }
  return 1;
}

// Re-encodes through a canvas. createImageBitmap applies EXIF rotation by default.
async function rasterize(file, mime) {
  const bmp = await createImageBitmap(file);
  try {
    const scale = Math.min(1, Math.sqrt(MAX_PIXELS / (bmp.width * bmp.height)));
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    if (mime === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); }
    ctx.drawImage(bmp, 0, 0, w, h);
    const blob = await canvasToBlob(c, mime, 0.92);
    c.width = 0;
    return new Uint8Array(await blob.arrayBuffer());
  } finally {
    bmp.close?.();
  }
}

async function embed(doc, file) {
  const bytes = await readBytes(file);
  const kind = sniff(bytes);
  try {
    if (kind === 'png') return await doc.embedPng(bytes);
    if (kind === 'jpeg') {
      return jpegOrientation(bytes) === 1
        ? await doc.embedJpg(bytes)
        : await doc.embedJpg(await rasterize(file, 'image/jpeg'));
    }
    return await doc.embedPng(await rasterize(file, 'image/png')); // WebP and others
  } catch {
    try {
      return kind === 'jpeg'
        ? await doc.embedJpg(await rasterize(file, 'image/jpeg'))
        : await doc.embedPng(await rasterize(file, 'image/png'));
    } catch {
      throw new AppError(`"${file.name}" could not be read. It may be corrupted or not a valid image.`);
    }
  }
}

export default function JpgToPdf() {
  const [items, setItems] = useState([]);
  const [opts, setOpts] = useState(DEFAULTS);
  const [notice, setNotice] = useState(null);
  const [result, setResult] = useState(null);
  const job = useJob();
  const urlsRef = useRef(new Set());

  useEffect(() => {
    const urls = urlsRef.current;
    return () => { urls.forEach((u) => URL.revokeObjectURL(u)); urls.clear(); };
  }, []);

  const invalidate = () => { setResult(null); job.reset(); };
  const setOpt = (key, value) => { setOpts((o) => ({ ...o, [key]: value })); invalidate(); };

  const add = (files) => {
    const room = Math.max(0, MAX_IMAGES - items.length);
    const accepted = files.slice(0, room);
    const skipped = files.length - accepted.length;
    setNotice(skipped > 0 ? `${skipped} image${skipped === 1 ? ' was' : 's were'} skipped. The limit is ${MAX_IMAGES} images.` : null);
    const next = accepted.map((file) => {
      const url = URL.createObjectURL(file);
      urlsRef.current.add(url);
      return { id: uid(), file, url };
    });
    if (next.length) setItems([...items, ...next]);
    invalidate();
  };

  const remove = (it) => {
    URL.revokeObjectURL(it.url);
    urlsRef.current.delete(it.url);
    setItems((cur) => cur.filter((x) => x.id !== it.id));
    setNotice(null);
    invalidate();
  };

  const reset = () => {
    urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    urlsRef.current.clear();
    setItems([]);
    setNotice(null);
    setOpts(DEFAULTS);
    setResult(null);
    job.reset();
  };

  const create = () =>
    job.run(async (ctl) => {
      setResult(null);
      const { pageSize, orientation, margin, fit } = opts;
      const name = `${baseName(items[0].file.name)}${items.length > 1 ? '-and-more' : ''}.pdf`;
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      const m = (margin * 72) / 25.4;

      for (let i = 0; i < items.length; i++) {
        ctl.check();
        ctl.progress((i / items.length) * 100, `Adding image ${i + 1} of ${items.length}`);
        const img = await embed(doc, items[i].file);

        let pw; let ph;
        if (pageSize === 'original') {
          pw = img.width * 0.75 + 2 * m;
          ph = img.height * 0.75 + 2 * m;
          const k = Math.min(1, MAX_PAGE_PT / Math.max(pw, ph));
          pw *= k; ph *= k;
        } else {
          [pw, ph] = SIZES[pageSize];
          const landscape = orientation === 'auto' ? img.width > img.height : orientation === 'landscape';
          if (landscape) [pw, ph] = [ph, pw];
        }
        const aw = Math.max(10, pw - 2 * m);
        const ah = Math.max(10, ph - 2 * m);
        let w; let h;
        if (fit === 'stretch') { w = aw; h = ah; }
        else {
          const s = Math.min(aw / img.width, ah / img.height, fit === 'shrink' ? 1 : Infinity);
          w = img.width * s; h = img.height * s;
        }
        const page = doc.addPage([pw, ph]);
        page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
        await new Promise((r) => setTimeout(r, 0)); // let the UI breathe
      }

      ctl.progress(100, 'Saving PDF');
      doc.setProducer('JustGoPDF');
      const bytes = await doc.save();
      setResult({ blob: new Blob([bytes], { type: 'application/pdf' }), name });
    });

  return (
    <ToolShell tool={tool}>
      <FileDropzone
        accept={ACCEPT}
        exts={['.jpg', '.jpeg', '.png']}
        multiple
        maxFiles={MAX_IMAGES}
        maxSizeMB={20}
        title={items.length ? 'Add more images' : 'Drag and drop images here'}
        compact={items.length > 0}
        onFiles={add}
        disabled={job.busy || items.length >= MAX_IMAGES}
      />
      {items.length >= MAX_IMAGES && <p className="small text-muted mt-2 mb-0">Maximum of {MAX_IMAGES} images reached.</p>}
      {notice && <div className="alert alert-warning mt-2 mb-0" role="note">{notice}</div>}
      {items.length > 0 && (
        <>
          <h2 className="h6 mt-4">{items.length} image{items.length === 1 ? '' : 's'} – drag to reorder</h2>
          <SortableList
            label="Images in page order"
            items={items}
            disabled={job.busy}
            onChange={(n) => { setItems(n); invalidate(); }}
            onRemove={remove}
            renderItem={(it, i) => (
              <>
                <img src={it.url} alt="" className="thumb-sm" loading="lazy" decoding="async" />
                <div className="min-w-0">
                  <div className="text-truncate fw-semibold">{i + 1}. {it.file.name}</div>
                  <div className="small text-muted">{formatBytes(it.file.size)}</div>
                </div>
              </>
            )}
          />
          <fieldset className="settings" disabled={job.busy}>
            <legend>Page settings</legend>
            <div className="row g-3">
              {SELECTS.map(({ key, id, label, options, numeric }) => (
                <div className="col-6 col-md-3" key={key}>
                  <label className="form-label" htmlFor={id}>{label}</label>
                  <select
                    id={id}
                    className="form-select"
                    value={opts[key]}
                    disabled={key === 'orientation' && opts.pageSize === 'original'}
                    onChange={(e) => setOpt(key, numeric ? Number(e.target.value) : e.target.value)}
                  >
                    {options.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </fieldset>
          <div className="actions">
            <button type="button" className="btn btn-red" onClick={create} disabled={job.busy}>Convert to PDF</button>
            <button type="button" className="btn btn-outline-secondary" onClick={reset} disabled={job.busy}><RotateCcw size={16} /> Reset</button>
          </div>
        </>
      )}
      <StatusPanel job={job} onCancel={job.cancel} success={result ? `Your PDF is ready (${formatBytes(result.blob.size)}).` : null} />
      {result && (
        <button type="button" className="btn btn-red mt-3" onClick={() => download(result.blob, result.name)}>
          <Download size={16} /> Download PDF
        </button>
      )}
    </ToolShell>
  );
}