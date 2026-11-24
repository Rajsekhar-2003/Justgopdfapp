import { saveAs } from 'file-saver';

export const MB = 1024 * 1024;

export class CancelledError extends Error {
  constructor() { super('Cancelled'); this.name = 'CancelledError'; }
}
export class AppError extends Error {
  constructor(message, code = 'app') { super(message); this.name = 'AppError'; this.code = code; }
}

export function formatBytes(n) {
  if (!Number.isFinite(n)) return '—';
  if (n < 1024) return `${n} B`;
  if (n < MB) return `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`;
  return `${(n / MB).toFixed(2)} MB`;
}

export const tick = () => new Promise((r) => setTimeout(r, 0));
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
export const baseName = (name) => name.replace(/\.[^.]+$/, '');
export const readBytes = async (file) => new Uint8Array(await file.arrayBuffer());
export const download = (blob, filename) => saveAs(blob, filename);

export function canvasToBlob(canvas, type = 'image/png', quality) {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new AppError('Could not encode the image. The page may be too large for this browser.', 'encode'))), type, quality)
  );
}

export function friendlyError(e) {
  if (e instanceof AppError) return e.message;
  const n = e?.name;
  if (n === 'PasswordException' || n === 'EncryptedPDFError')
    return 'This PDF is password-protected or encrypted. Remove the password or restrictions first, then try again.';
  if (n === 'InvalidPDFException' || n === 'FormatError' || n === 'MissingPDFException')
    return 'This file is not a valid PDF or it is corrupted.';
  if (n === 'RangeError' || /memory|allocation/i.test(e?.message || ''))
    return 'Your browser ran out of memory. Try a smaller file, fewer pages or a lower resolution.';
  return 'Something went wrong while processing this file. Try again, use a smaller file, or try another browser.';
}

/** Parse "1-3, 5, 8-10" into [[1,2,3],[5],[8,9,10]]. */
export function parseRanges(text, max) {
  const out = [];
  const parts = text.split(',').map((s) => s.trim()).filter(Boolean);
  if (!parts.length) throw new AppError('Enter at least one page or range, for example 1-3, 5.', 'range');
  for (const p of parts) {
    const m = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(p);
    if (!m) throw new AppError(`"${p}" is not a valid page or range. Use numbers and dashes, like 1-3, 5.`, 'range');
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    if (a < 1 || b < 1 || a > max || b > max) throw new AppError(`Pages must be between 1 and ${max}.`, 'range');
    if (a > b) throw new AppError(`Range "${p}" is backwards. Use the smaller number first.`, 'range');
    const pages = [];
    for (let i = a; i <= b; i++) pages.push(i);
    out.push(pages);
  }
  return out;
}

export function pagesToText(set) {
  const arr = [...set].sort((a, b) => a - b);
  const parts = [];
  for (let i = 0; i < arr.length; i++) {
    let j = i;
    while (j + 1 < arr.length && arr[j + 1] === arr[j] + 1) j++;
    parts.push(j > i ? `${arr[i]}-${arr[j]}` : `${arr[i]}`);
    i = j;
  }
  return parts.join(', ');
}
