import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import FileDropzone from '../components/FileDropzone.jsx';
import FileInfo from '../components/FileInfo.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import useJob from '../hooks/useJob.js';
import { getTool } from '../config/toolsData.js';
import { AppError, baseName, download, formatBytes, readBytes } from '../lib/files.js';

const tool = getTool('excel-to-pdf');
const MAX_ROWS = 10000;
const MAX_CELLS = 400000;
const PREVIEW_ROWS = 30;
const PREVIEW_COLS = 20;
const ALL = '__all__';
const ACCEPT = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
};

const DEFAULTS = { orientation: 'landscape', paper: 'a4', margin: 10, header: true };
const SELECTS = [
  { key: 'orientation', id: 'eo', label: 'Orientation', options: [['landscape', 'Landscape'], ['portrait', 'Portrait']] },
  { key: 'paper', id: 'ep', label: 'Paper size', options: [['a4', 'A4'], ['a3', 'A3'], ['letter', 'Letter'], ['legal', 'Legal']] },
];

function checkSignature(bytes) {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (b[0] === 0x50 && b[1] === 0x4b) return; // ZIP (.xlsx)
  if (b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0) return; // OLE (.xls or encrypted .xlsx)
  throw new AppError('This file is not a valid Excel workbook.');
}

function visibleSheetNames(workbook) {
  const meta = workbook.Workbook?.Sheets || [];
  const names = workbook.SheetNames.filter((_, i) => !meta[i]?.Hidden);
  return names.length ? names : workbook.SheetNames;
}

function sheetRows(XLSX, ws, maxRows) {
  const opts = { header: 1, raw: false, defval: '', blankrows: false };
  if (maxRows && ws['!ref']) {
    const r = XLSX.utils.decode_range(ws['!ref']);
    r.e.r = Math.min(r.e.r, r.s.r + maxRows - 1);
    opts.range = XLSX.utils.encode_range(r);
  }
  const rows = XLSX.utils.sheet_to_json(ws, opts);
  const width = rows.reduce((m, r) => Math.max(m, r.length), 0);
  return rows.map((r) => Array.from({ length: width }, (_, i) => String(r[i] ?? '')));
}

export default function ExcelToPdf() {
  const [file, setFile] = useState(null);
  const [wb, setWb] = useState(null); // { XLSX, workbook, names }
  const [sheet, setSheet] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [opts, setOpts] = useState(DEFAULTS);
  const [result, setResult] = useState(null);
  const job = useJob();
  const loadId = useRef(0);

  useEffect(() => () => { loadId.current += 1; }, []); // ignore in-flight loads after unmount

  const invalidate = () => { setResult(null); job.reset(); };

  const reset = () => {
    loadId.current += 1;
    job.reset();
    setFile(null);
    setWb(null);
    setSheet('');
    setResult(null);
    setLoadError(null);
    setLoading(false);
    setOpts(DEFAULTS);
  };

  const setOpt = (key, value) => { setOpts((o) => ({ ...o, [key]: value })); invalidate(); };

  const load = async (f) => {
    reset();
    const id = loadId.current;
    setLoading(true);
    try {
      const bytes = await readBytes(f);
      checkSignature(bytes);
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(bytes, { type: 'array', cellDates: true });
      if (!workbook.SheetNames.length) throw new AppError('This workbook has no worksheets.');
      if (id !== loadId.current) return; // superseded or unmounted
      const names = visibleSheetNames(workbook);
      setWb({ XLSX, workbook, names });
      setSheet(names[0]);
      setFile(f);
    } catch (e) {
      if (id !== loadId.current) return;
      const msg = String(e?.message || '');
      setLoadError(
        e instanceof AppError ? e.message
          : /password|encrypt/i.test(msg) ? 'This workbook is password-protected. Remove the password in Excel and try again.'
          : 'This spreadsheet could not be read. It may be corrupted.',
      );
    } finally {
      if (id === loadId.current) setLoading(false);
    }
  };

  const preview = useMemo(
    () => (wb && sheet && sheet !== ALL ? sheetRows(wb.XLSX, wb.workbook.Sheets[sheet], PREVIEW_ROWS) : null),
    [wb, sheet],
  );
  const previewCols = preview?.[0]?.length ?? 0;
  const canConvert = !job.busy && (sheet === ALL || (preview && preview.length > 0));

  const convert = () =>
    job.run(async (ctl) => {
      setResult(null);
      const [{ jsPDF }, atMod, { countUnsupportedChars }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
        import('../lib/htmlToPdf.js'),
      ]);
      const autoTable = atMod.default;
      const doc = new jsPDF({ unit: 'pt', format: opts.paper, orientation: opts.orientation });
      const m = (opts.margin * 72) / 25.4;
      const names = sheet === ALL ? wb.names : [sheet];
      let pages = 0;
      let unsupported = 0;

      for (let s = 0; s < names.length; s++) {
        ctl.check();
        ctl.progress((s / names.length) * 90, `Rendering ${names[s]}`);
        const rows = sheetRows(wb.XLSX, wb.workbook.Sheets[names[s]]);
        if (!rows.length) continue;
        if (rows.length > MAX_ROWS) throw new AppError(`Worksheet "${names[s]}" has ${rows.length} rows. The limit is ${MAX_ROWS}.`);
        const cols = rows[0].length;
        if (rows.length * cols > MAX_CELLS) throw new AppError(`Worksheet "${names[s]}" is too large (${rows.length} rows × ${cols} columns). Reduce it to under ${MAX_CELLS.toLocaleString()} cells.`);
        unsupported += countUnsupportedChars(rows.flat().join(' '));

        if (pages) doc.addPage();
        pages += 1;
        const fontSize = cols > 20 ? 5 : cols > 14 ? 6 : cols > 9 ? 7 : cols > 6 ? 8 : 9;
        let startY = m;
        if (names.length > 1) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(names[s], m, m + 8);
          startY = m + 20;
        }
        autoTable(doc, {
          startY,
          head: opts.header ? [rows[0]] : undefined,
          body: opts.header ? rows.slice(1) : rows,
          margin: { left: m, right: m, top: m, bottom: m },
          styles: { fontSize, cellPadding: 2.5, overflow: 'linebreak', lineWidth: 0.3, lineColor: [200, 200, 200], textColor: 20 },
          headStyles: { fillColor: [229, 9, 20], textColor: 255 },
          horizontalPageBreak: true,
          horizontalPageBreakRepeat: 0,
        });
        await new Promise((r) => setTimeout(r, 0)); // let the UI breathe
      }
      if (!pages) throw new AppError('The selected worksheet is empty.');
      ctl.progress(100, 'Finishing');
      doc.setProperties({ creator: 'JustGoPDF', producer: 'JustGoPDF' });
      setResult({ blob: doc.output('blob'), name: `${baseName(file.name)}.pdf`, unsupported });
    });

  return (
    <ToolShell tool={tool}>
      {!file ? (
        <>
          <FileDropzone accept={ACCEPT} exts={['.xlsx', '.xls']} maxSizeMB={25} onFiles={(f) => load(f[0])} />
          {loading && <p className="mt-3 mb-0" role="status">Reading spreadsheet…</p>}
          {loadError && <div className="alert alert-danger mt-3 mb-0" role="alert">{loadError}</div>}
        </>
      ) : (
        <>
          <FileInfo
            file={file}
            extra={`${wb.names.length} sheet${wb.names.length === 1 ? '' : 's'}`}
            onRemove={reset}
            disabled={job.busy}
          />
          <fieldset className="settings" disabled={job.busy}>
            <legend>Settings</legend>
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <label className="form-label" htmlFor="sh">Worksheet</label>
                <select id="sh" className="form-select" value={sheet} onChange={(e) => { setSheet(e.target.value); invalidate(); }}>
                  {wb.names.map((n) => <option key={n} value={n}>{n}</option>)}
                  {wb.names.length > 1 && <option value={ALL}>All worksheets</option>}
                </select>
              </div>
              {SELECTS.map(({ key, id, label, options }) => (
                <div className="col-6 col-md-3" key={key}>
                  <label className="form-label" htmlFor={id}>{label}</label>
                  <select id={id} className="form-select" value={opts[key]} onChange={(e) => setOpt(key, e.target.value)}>
                    {options.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                  </select>
                </div>
              ))}
              <div className="col-6 col-md-3">
                <label className="form-label" htmlFor="em">Margin: {opts.margin} mm</label>
                <input id="em" type="range" className="form-range" min={5} max={30} value={opts.margin} onChange={(e) => setOpt('margin', Number(e.target.value))} />
              </div>
            </div>
            <div className="form-check mt-2">
              <input className="form-check-input" type="checkbox" id="hd" checked={opts.header} onChange={(e) => setOpt('header', e.target.checked)} />
              <label className="form-check-label" htmlFor="hd">Treat first row as header</label>
            </div>
          </fieldset>

          {sheet === ALL ? (
            <p className="text-muted">All {wb.names.length} visible worksheets will be exported, each starting on a new page.</p>
          ) : preview.length === 0 ? (
            <p className="text-muted">This worksheet is empty.</p>
          ) : (
            <>
              <h2 className="h6">
                Preview (first {preview.length} rows{previewCols > PREVIEW_COLS ? `, first ${PREVIEW_COLS} of ${previewCols} columns` : ''})
              </h2>
              <div className="table-wrap" role="region" tabIndex={0} aria-label="Spreadsheet preview">
                <table className="table table-sm table-bordered mb-0">
                  <caption className="visually-hidden">Preview of worksheet {sheet}</caption>
                  {opts.header && (
                    <thead>
                      <tr>{preview[0].slice(0, PREVIEW_COLS).map((c, j) => <th key={j} scope="col">{c}</th>)}</tr>
                    </thead>
                  )}
                  <tbody>
                    {(opts.header ? preview.slice(1) : preview).map((r, i) => (
                      <tr key={i}>{r.slice(0, PREVIEW_COLS).map((c, j) => <td key={j}>{c}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="alert alert-warning mt-3 mb-0" role="note">
            Only cell values are exported. Charts, images, merged cells and conditional formatting are not reproduced.
          </div>
          <div className="actions">
            <button type="button" className="btn btn-red" onClick={convert} disabled={!canConvert}>Convert to PDF</button>
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