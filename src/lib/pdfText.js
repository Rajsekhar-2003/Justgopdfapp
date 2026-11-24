import { CancelledError } from './files.js';

const median = (arr) => {
  if (!arr.length) return 12;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

function fontFlags(page, fontId, cache) {
  if (cache.has(fontId)) return cache.get(fontId);
  let flags = { bold: false, italic: false };
  try {
    const name = (page.commonObjs.get(fontId)?.name || '').toLowerCase();
    flags = { bold: /bold|black|heavy|semibold|demi/.test(name), italic: /italic|oblique/.test(name) };
  } catch { /* font not resolved; keep defaults */ }
  cache.set(fontId, flags);
  return flags;
}

/**
 * Extract positioned lines from every page.
 * Returns [{ page, width, height, lines: [{ y, x, size, bold, italic, items:[{str,x,w,size,bold,italic}], text }] }]
 */
export async function extractLines(pdf, { detectFonts = false, onProgress, isCancelled } = {}) {
  const pages = [];
  const cache = new Map();
  for (let p = 1; p <= pdf.numPages; p++) {
    if (isCancelled?.()) throw new CancelledError();
    onProgress?.(((p - 1) / pdf.numPages) * 100, `Reading page ${p} of ${pdf.numPages}`);
    const page = await pdf.getPage(p);
    const vp = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    if (detectFonts) {
      try { await page.getOperatorList(); } catch { /* ignore */ }
    }
    const items = [];
    for (const it of content.items) {
      if (!it.str || !it.str.trim()) continue;
      const [a, b, , , e, f] = it.transform;
      if (Math.abs(b) > 0.01 && Math.abs(a) < 0.01) continue; // rotated text
      const size = Math.hypot(a, b) || it.height || 10;
      const fl = detectFonts ? fontFlags(page, it.fontName, cache) : { bold: false, italic: false };
      items.push({ str: it.str, x: e, y: f, w: it.width, size, ...fl });
    }
    items.sort((m, n) => n.y - m.y || m.x - n.x);
    const lines = [];
    for (const it of items) {
      const last = lines[lines.length - 1];
      if (last && Math.abs(last.y - it.y) <= Math.max(2, last.size * 0.4)) last.items.push(it);
      else lines.push({ y: it.y, size: it.size, items: [it] });
    }
    for (const ln of lines) {
      ln.items.sort((m, n) => m.x - n.x);
      ln.x = ln.items[0].x;
      ln.size = median(ln.items.map((i) => i.size));
      ln.bold = ln.items.every((i) => i.bold);
      ln.italic = ln.items.every((i) => i.italic);
      let text = '';
      let prevEnd = null;
      for (const i of ln.items) {
        if (prevEnd !== null && i.x - prevEnd > i.size * 0.15) text += ' ';
        text += i.str;
        prevEnd = i.x + i.w;
      }
      ln.text = text.trim();
      ln.right = ln.items[ln.items.length - 1].x + ln.items[ln.items.length - 1].w;
    }
    pages.push({ page: p, width: vp.width, height: vp.height, lines: lines.filter((l) => l.text) });
    page.cleanup();
  }
  return pages;
}

/** Split a line into cells separated by wide horizontal gaps. */
export function splitCells(line) {
  const cells = [];
  let cur = null;
  let prevEnd = null;
  for (const it of line.items) {
    if (cur && it.x - prevEnd <= Math.max(it.size, line.size) * 1.0) {
      cur.text += (it.x - prevEnd > it.size * 0.15 ? ' ' : '') + it.str;
    } else {
      cur = { x: it.x, text: it.str };
      cells.push(cur);
    }
    prevEnd = it.x + it.w;
  }
  return cells.map((c) => ({ x: c.x, text: c.text.trim() }));
}

const NUM = /^-?\d{1,3}(,\d{3})*(\.\d+)?$|^-?\d+(\.\d+)?$/;
export const toCellValue = (s, numeric) => (numeric && NUM.test(s) ? Number(s.replace(/,/g, '')) : s);

/** Heuristic table detection: consecutive lines that each have 2+ cells. */
export function detectTables(pages, { numeric = true } = {}) {
  const tables = [];
  for (const pg of pages) {
    let block = [];
    let n = 0;
    const flush = () => {
      if (block.length >= 2) {
        const xs = block.flatMap((r) => r.cells.map((c) => c.x)).sort((a, b) => a - b);
        const cols = [];
        for (const x of xs) {
          const last = cols[cols.length - 1];
          if (last && x - last.max <= 6) { last.max = x; last.sum += x; last.n++; }
          else cols.push({ min: x, max: x, sum: x, n: 1 });
        }
        const starts = cols.map((c) => c.sum / c.n);
        if (starts.length >= 2) {
          const rows = block.map((r) => {
            const row = new Array(starts.length).fill('');
            for (const c of r.cells) {
              let idx = 0;
              for (let k = 0; k < starts.length; k++) if (starts[k] <= c.x + 6) idx = k;
              row[idx] = row[idx] ? `${row[idx]} ${c.text}` : toCellValue(c.text, numeric);
            }
            return row;
          });
          n++;
          tables.push({ id: `p${pg.page}-t${n}`, page: pg.page, name: `Page ${pg.page} – Table ${n}`, rows });
        }
      }
      block = [];
    };
    for (const ln of pg.lines) {
      const cells = splitCells(ln);
      if (cells.length >= 2) block.push({ cells });
      else flush();
    }
    flush();
  }
  return tables;
}
