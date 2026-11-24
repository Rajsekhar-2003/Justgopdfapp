import { AppError, CancelledError, canvasToBlob, tick } from './files.js';
import { renderPage, releaseCanvas } from './pdf.js';

const LEVELS = {
  low: { quality: 0.85, maxDim: 3000 },
  recommended: { quality: 0.7, maxDim: 1800 },
  high: { quality: 0.5, maxDim: 1200 },
};
const LADDER = [
  { quality: 0.85, maxDim: 3000 },
  { quality: 0.75, maxDim: 2000 },
  { quality: 0.65, maxDim: 1600 },
  { quality: 0.55, maxDim: 1300 },
  { quality: 0.45, maxDim: 1000 },
  { quality: 0.35, maxDim: 800 },
];
const RASTER_LADDER = [
  { dpi: 110, quality: 0.6 },
  { dpi: 96, quality: 0.5 },
  { dpi: 80, quality: 0.45 },
  { dpi: 72, quality: 0.4 },
  { dpi: 60, quality: 0.35 },
];

const MIN_IMAGE_BYTES = 12_000;
const str = (o) => (o ? String(o) : '');

function isDct(PDFArray, f) {
  if (!f) return false;
  if (str(f) === '/DCTDecode') return true;
  return f instanceof PDFArray && f.size() === 1 && str(f.get(0)) === '/DCTDecode';
}

/** Count JPEG images and their total size, so the UI can estimate savings. */
export async function analyzePdf(bytes) {
  const { PDFDocument, PDFName, PDFRawStream, PDFArray } = await import('pdf-lib');
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  let images = 0;
  let jpegBytes = 0;
  for (const [, obj] of doc.context.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream)) continue;
    const d = obj.dict;
    if (str(d.get(PDFName.of('Subtype'))) !== '/Image') continue;
    if (isDct(PDFArray, d.get(PDFName.of('Filter'))) && obj.contents.length >= MIN_IMAGE_BYTES) {
      images++;
      jpegBytes += obj.contents.length;
    }
  }
  return { images, jpegBytes };
}

async function recompressImages(bytes, { quality, maxDim, removeMetadata }, ctl) {
  const { PDFDocument, PDFName, PDFRawStream, PDFArray, PDFNumber } = await import('pdf-lib');
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const ctx = doc.context;
  const entries = ctx.enumerateIndirectObjects();
  let changed = 0;
  let idx = 0;
  for (const [ref, obj] of entries) {
    idx++;
    if (idx % 20 === 0) { ctl.check(); await tick(); }
    if (!(obj instanceof PDFRawStream)) continue;
    const d = obj.dict;
    if (str(d.get(PDFName.of('Subtype'))) !== '/Image') continue;
    if (!isDct(PDFArray, d.get(PDFName.of('Filter')))) continue;
    if (str(d.get(PDFName.of('ImageMask'))) === 'true' || d.has(PDFName.of('Mask'))) continue;
    if (obj.contents.length < MIN_IMAGE_BYTES) continue;
    const w = d.get(PDFName.of('Width'))?.asNumber?.();
    const h = d.get(PDFName.of('Height'))?.asNumber?.();
    if (!w || !h) continue;
    let bmp;
    try {
      bmp = await createImageBitmap(new Blob([obj.contents], { type: 'image/jpeg' }));
    } catch { continue; }
    const scale = Math.min(1, maxDim / Math.max(w, h));
    const nw = Math.max(1, Math.round(w * scale));
    const nh = Math.max(1, Math.round(h * scale));
    const canvas = document.createElement('canvas');
    canvas.width = nw;
    canvas.height = nh;
    const c2 = canvas.getContext('2d');
    c2.fillStyle = '#fff';
    c2.fillRect(0, 0, nw, nh);
    c2.drawImage(bmp, 0, 0, nw, nh);
    bmp.close?.();
    let blob;
    try { blob = await canvasToBlob(canvas, 'image/jpeg', quality); } catch { releaseCanvas(canvas); continue; }
    releaseCanvas(canvas);
    if (blob.size >= obj.contents.length * 0.97) continue; // no real gain
    const out = new Uint8Array(await blob.arrayBuffer());
    const nd = ctx.obj({});
    for (const [k, v] of d.entries()) nd.set(k, v);
    nd.set(PDFName.of('Width'), PDFNumber.of(nw));
    nd.set(PDFName.of('Height'), PDFNumber.of(nh));
    nd.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
    nd.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8));
    nd.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
    nd.delete(PDFName.of('Decode'));
    nd.delete(PDFName.of('DecodeParms'));
    ctx.assign(ref, PDFRawStream.of(nd, out));
    changed++;
  }
  if (removeMetadata) {
    doc.setTitle('');
    doc.setAuthor('');
    doc.setSubject('');
    doc.setKeywords([]);
    doc.setCreator('JustGoPDF');
    doc.setProducer('JustGoPDF');
    doc.catalog.delete(PDFName.of('Metadata'));
  }
  const saved = await doc.save({ useObjectStreams: true });
  return { bytes: saved, changed };
}

async function rasterize(pdfjsDoc, { dpi, quality }, ctl, onPage) {
  const { PDFDocument } = await import('pdf-lib');
  const out = await PDFDocument.create();
  for (let i = 1; i <= pdfjsDoc.numPages; i++) {
    ctl.check();
    onPage(i);
    const page = await pdfjsDoc.getPage(i);
    const base = page.getViewport({ scale: 1 });
    const canvas = await renderPage(page, dpi / 72);
    const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
    releaseCanvas(canvas);
    const img = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
    const pg = out.addPage([base.width, base.height]);
    pg.drawImage(img, { x: 0, y: 0, width: base.width, height: base.height });
    page.cleanup();
    await tick();
  }
  out.setProducer('JustGoPDF');
  return out.save({ useObjectStreams: true });
}

/**
 * options: { level: 'low'|'recommended'|'high' } or { targetBytes }, removeMetadata, allowRasterize, pdfjsDoc
 * returns { bytes, method, reachedTarget, unchanged, imagesChanged }
 */
export async function compressPdf(original, options, ctl) {
  const { level, targetBytes, removeMetadata = false, allowRasterize = false, pdfjsDoc } = options;
  let best = null;
  const consider = (res, method) => {
    if (!best || res.bytes.length < best.bytes.length) best = { ...res, method };
  };

  if (level) {
    ctl.progress(10, 'Optimising images…');
    consider(await recompressImages(original, { ...LEVELS[level], removeMetadata }, ctl), 'optimized');
  } else {
    for (let i = 0; i < LADDER.length; i++) {
      ctl.check();
      ctl.progress(5 + (i / LADDER.length) * 70, `Optimising images (pass ${i + 1} of ${LADDER.length})…`);
      consider(await recompressImages(original, { ...LADDER[i], removeMetadata }, ctl), 'optimized');
      if (best.bytes.length <= targetBytes) break;
    }
    if (best.bytes.length > targetBytes && allowRasterize && pdfjsDoc) {
      let rbest = null;
      for (let i = 0; i < RASTER_LADDER.length; i++) {
        ctl.check();
        const r = await rasterize(pdfjsDoc, RASTER_LADDER[i], ctl, (pg) =>
          ctl.progress(75 + (i / RASTER_LADDER.length) * 20, `Rasterising page ${pg} of ${pdfjsDoc.numPages} (attempt ${i + 1})…`)
        );
        if (!rbest || r.length < rbest.length) rbest = r;
        if (r.length <= targetBytes) break;
      }
      if (rbest && rbest.length < best.bytes.length) best = { bytes: rbest, changed: 0, method: 'rasterized' };
    }
  }
  if (!best) throw new AppError('Compression produced no output.', 'compress');
  const unchanged = best.bytes.length >= original.length;
  return {
    bytes: unchanged ? original : best.bytes,
    method: unchanged ? 'unchanged' : best.method,
    unchanged,
    imagesChanged: best.changed,
    reachedTarget: targetBytes ? (unchanged ? original.length : best.bytes.length) <= targetBytes : null,
  };
}

export const LEVEL_SAVINGS = { low: 0.25, recommended: 0.5, high: 0.7 };
export { CancelledError };
