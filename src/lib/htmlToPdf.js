// Renders sanitised mammoth HTML to a PDF with real, selectable text using jsPDF.
// Supports: headings, paragraphs, bold/italic, lists, tables (plain text cells), images, blockquotes, pre, hr.
import { CancelledError } from './files.js';

const SIZES = { h1: 22, h2: 18, h3: 15, h4: 13, h5: 12, h6: 11 };
const WINANSI_EXTRA = /[\u2018\u2019\u201C\u201D\u2013\u2014\u2022\u2026\u20AC\u2122\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u0192\u02C6\u02DC\u2020\u2021\u2030\u2039\u203A]/;

export function countUnsupportedChars(text) {
  let n = 0;
  for (const ch of text) if (ch.charCodeAt(0) > 255 && !WINANSI_EXTRA.test(ch)) n++;
  return n;
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function htmlToPdf(html, { size = 'a4', orientation = 'portrait', margin = 54, fontSize = 11 }, ctl) {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;
  const doc = new jsPDF({ unit: 'pt', format: size, orientation });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const parsed = new DOMParser().parseFromString(html, 'text/html'); // inert document: no scripts or loads
  let y = margin;

  const ensure = (h) => {
    if (y + h > H - margin) { doc.addPage(); y = margin; }
  };
  const fontStyle = (b, i) => (b && i ? 'bolditalic' : b ? 'bold' : i ? 'italic' : 'normal');

  // ---- inline collection -------------------------------------------------
  function collect(node, st, out, st2) {
    for (const ch of node.childNodes) {
      if (ch.nodeType === 3) {
        const text = ch.nodeValue.replace(/\s+/g, ' ');
        if (!text.trim()) { if (text) st2.pending = true; continue; }
        const lead = /^\s/.test(text);
        const trail = /\s$/.test(text);
        const words = text.trim().split(' ');
        words.forEach((w, k) => {
          out.push({ t: 'w', text: w, bold: st.bold, italic: st.italic, sp: (k > 0) || lead || st2.pending });
          st2.pending = false;
        });
        if (trail) st2.pending = true;
      } else if (ch.nodeType === 1) {
        const tag = ch.tagName.toLowerCase();
        if (tag === 'br') out.push({ t: 'br' });
        else if (tag === 'img') out.push({ t: 'img', src: ch.getAttribute('src') });
        else if (tag === 'ul' || tag === 'ol' || tag === 'table') continue;
        else collect(ch, { bold: st.bold || tag === 'strong' || tag === 'b', italic: st.italic || tag === 'em' || tag === 'i' }, out, st2);
      }
    }
    return out;
  }

  async function drawImage(src, maxW) {
    if (!src || !src.startsWith('data:image/')) return;
    const img = await loadImage(src);
    if (!img || !img.naturalWidth) return;
    let dataUrl = src;
    let fmt = /^data:image\/jpe?g/i.test(src) ? 'JPEG' : 'PNG';
    if (fmt === 'PNG' && !/^data:image\/png/i.test(src)) {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      dataUrl = c.toDataURL('image/png');
    }
    let w = img.naturalWidth * 0.75;
    let h = img.naturalHeight * 0.75;
    const maxH = H - 2 * margin;
    const s = Math.min(1, maxW / w, maxH / h);
    w *= s; h *= s;
    ensure(h);
    try { doc.addImage(dataUrl, fmt, margin, y, w, h); } catch { return; }
    y += h + 6;
  }

  // ---- paragraph layout --------------------------------------------------
  async function layout(runs, { x = margin, width = W - 2 * margin, size = fontSize, gap = 6, marker = null, bold = false, mono = false }) {
    const lh = size * 1.3;
    let line = [];
    let lineW = 0;
    let first = true;
    const family = mono ? 'courier' : 'helvetica';
    const measure = (text, b, i) => { doc.setFont(family, fontStyle(b || bold, i)); doc.setFontSize(size); return doc.getTextWidth(text); };
    const flush = () => {
      ensure(lh);
      const top = y;
      if (first && marker) { doc.setFont(family, 'normal'); doc.setFontSize(size); doc.text(marker, x - 14, top + size); }
      first = false;
      let cx = x;
      line.forEach((tk, k) => {
        if (k > 0 && tk.sp) cx += measure(' ', false, false);
        doc.setFont(family, fontStyle(tk.bold || bold, tk.italic)); doc.setFontSize(size);
        doc.text(tk.text, cx, top + size);
        cx += measure(tk.text, tk.bold, tk.italic);
      });
      y += lh; line = []; lineW = 0;
    };
    for (const r of runs) {
      ctl.check();
      if (r.t === 'br') { flush(); continue; }
      if (r.t === 'img') { if (line.length) flush(); await drawImage(r.src, width); continue; }
      const pieces = measure(r.text, r.bold, r.italic) > width ? doc.splitTextToSize(r.text, width) : [r.text];
      pieces.forEach((piece, pi) => {
        const w = measure(piece, r.bold, r.italic);
        const sp = pi === 0 && r.sp && line.length ? measure(' ', false, false) : 0;
        if (line.length && lineW + sp + w > width) flush();
        line.push({ text: piece, bold: r.bold, italic: r.italic, sp: pi === 0 ? r.sp : false });
        lineW += (line.length > 1 ? sp : 0) + w;
      });
    }
    if (line.length) flush();
    else if (first && marker) { ensure(lh); doc.setFontSize(size); doc.text(marker, x - 14, y + size); y += lh; }
    y += gap;
  }

  // ---- block walker --------------------------------------------------------
  async function list(el, level) {
    const ordered = el.tagName.toLowerCase() === 'ol';
    let n = 0;
    for (const li of el.children) {
      if (li.tagName.toLowerCase() !== 'li') continue;
      n++;
      const runs = collect(li, { bold: false, italic: false }, [], { pending: false });
      await layout(runs, { x: margin + 22 + level * 18, width: W - 2 * margin - 22 - level * 18, gap: 2, marker: ordered ? `${n}.` : '•' });
      for (const sub of li.children) {
        const t = sub.tagName.toLowerCase();
        if (t === 'ul' || t === 'ol') await list(sub, level + 1);
        else if (t === 'table') await table(sub);
      }
    }
    y += 4;
  }

  async function table(el) {
    const rows = [...el.querySelectorAll('tr')];
    if (!rows.length) return;
    const cell = (c) => ({ content: c.textContent.replace(/\s+/g, ' ').trim(), colSpan: c.colSpan || 1, rowSpan: c.rowSpan || 1 });
    const hasHead = rows[0].querySelector('th') !== null;
    const head = hasHead ? [[...rows[0].children].map(cell)] : undefined;
    const body = rows.slice(hasHead ? 1 : 0).map((r) => [...r.children].map(cell));
    autoTable(doc, {
      startY: y, head, body,
      margin: { left: margin, right: margin, top: margin, bottom: margin },
      styles: { fontSize: Math.max(8, fontSize - 2), cellPadding: 3, lineWidth: 0.4, lineColor: [190, 190, 190], textColor: 20 },
      headStyles: { fillColor: [238, 238, 238], textColor: 20, fontStyle: 'bold' },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  async function block(el) {
    const tag = el.tagName.toLowerCase();
    if (SIZES[tag]) {
      const runs = collect(el, { bold: true, italic: false }, [], { pending: false });
      ensure(SIZES[tag] * 2.2);
      y += 4;
      await layout(runs, { size: SIZES[tag], bold: true, gap: 6 });
    } else if (tag === 'p') {
      await layout(collect(el, { bold: false, italic: false }, [], { pending: false }), {});
    } else if (tag === 'ul' || tag === 'ol') await list(el, 0);
    else if (tag === 'table') await table(el);
    else if (tag === 'blockquote') {
      await layout(collect(el, { bold: false, italic: true }, [], { pending: false }), { x: margin + 20, width: W - 2 * margin - 20 });
    } else if (tag === 'pre') {
      await layout(collect(el, { bold: false, italic: false }, [], { pending: false }), { size: fontSize - 1, mono: true });
    } else if (tag === 'hr') {
      ensure(10); doc.setDrawColor(190); doc.line(margin, y, W - margin, y); y += 10;
    } else if (tag === 'img') await drawImage(el.getAttribute('src'), W - 2 * margin);
    else if (el.children.length) for (const c of el.children) await block(c);
  }

  const kids = [...parsed.body.children];
  for (let i = 0; i < kids.length; i++) {
    ctl.progress((i / Math.max(1, kids.length)) * 95, `Rendering block ${i + 1} of ${kids.length}`);
    await block(kids[i]);
    if (i % 10 === 0) await new Promise((r) => setTimeout(r, 0));
  }
  doc.setProperties({ creator: 'JustGoPDF', producer: 'JustGoPDF' });
  return doc.output('blob');
}

export { CancelledError };
