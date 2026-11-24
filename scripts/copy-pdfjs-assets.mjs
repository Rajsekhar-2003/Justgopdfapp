// Copies pdf.js CMaps and standard fonts into public/pdfjs so CJK and non-embedded fonts render correctly.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('node_modules', 'pdfjs-dist');
const out = path.resolve('public', 'pdfjs');
for (const dir of ['cmaps', 'standard_fonts']) {
  const src = path.join(root, dir);
  if (!fs.existsSync(src)) {
    console.warn(`[copy-pdfjs-assets] ${src} not found – run "npm install" first.`);
    continue;
  }
  fs.mkdirSync(out, { recursive: true });
  fs.cpSync(src, path.join(out, dir), { recursive: true });
}
console.log('[copy-pdfjs-assets] done');
