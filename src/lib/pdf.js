import { AppError, readBytes } from './files.js';

let pdfjsPromise;
export function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const pdfjs = await import('pdfjs-dist');
      const worker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      pdfjs.GlobalWorkerOptions.workerSrc = worker;
      return pdfjs;
    })();
  }
  return pdfjsPromise;
}

function mapPdfError(e) {
  const n = e?.name;
  if (n === 'PasswordException')
    return new AppError('This PDF is password-protected. Remove the password first, then try again.', 'password');
  if (n === 'InvalidPDFException' || n === 'FormatError' || n === 'MissingPDFException')
    return new AppError('This file is not a valid PDF or it is corrupted.', 'corrupt');
  return e;
}

export async function openPdf(bytes, password) {
  const pdfjs = await loadPdfjs();
  const task = pdfjs.getDocument({
    data: bytes.slice(), // pdf.js transfers the buffer to its worker, so always pass a copy
    password,
    isEvalSupported: false,
    cMapUrl: '/pdfjs/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: '/pdfjs/standard_fonts/',
  });
  try {
    return await task.promise;
  } catch (e) {
    throw mapPdfError(e);
  }
}

export function assertPdfHeader(bytes) {
  const head = new TextDecoder('latin1').decode(bytes.subarray(0, 1024));
  if (!head.includes('%PDF-')) throw new AppError('This file is not a valid PDF (missing PDF header).', 'corrupt');
}

/** Validate and open a PDF file. Caller must destroy() the returned pdf when done. */
export async function inspectPdf(file, { maxPages = 500 } = {}) {
  if (!file || file.size === 0) throw new AppError('This file is empty.', 'empty');
  const bytes = await readBytes(file);
  assertPdfHeader(bytes);
  const pdf = await openPdf(bytes);
  if (pdf.numPages > maxPages) {
    const n = pdf.numPages;
    pdf.destroy();
    throw new AppError(`This PDF has ${n} pages. The limit for this tool is ${maxPages} pages.`, 'limit');
  }
  return { bytes, pdf, pages: pdf.numPages };
}

const MAX_PIXELS = 16_000_000;

/** Render a pdf.js page to a new canvas. Scale is clamped to protect browser memory. */
export async function renderPage(page, scale) {
  let vp = page.getViewport({ scale });
  const px = vp.width * vp.height;
  if (px > MAX_PIXELS) vp = page.getViewport({ scale: scale * Math.sqrt(MAX_PIXELS / px) });
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(vp.width));
  canvas.height = Math.max(1, Math.floor(vp.height));
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  return canvas;
}

export function releaseCanvas(canvas) {
  canvas.width = 0;
  canvas.height = 0;
}
