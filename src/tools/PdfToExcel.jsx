import { useEffect, useRef, useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import FileDropzone from '../components/FileDropzone.jsx';
import FileInfo from '../components/FileInfo.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import usePdfDocument from '../hooks/usePdfDocument.js';
import useJob from '../hooks/useJob.js';
import { getTool } from '../config/toolsData.js';
import { baseName, download, formatBytes } from '../lib/files.js';
import { detectTables, extractLines } from '../lib/pdfText.js';

const tool = getTool('pdf-to-excel');

// Excel sheet name rules: ≤31 chars, cannot contain \ / ? * [ ] :
const sanitizeSheetName = (raw) =>
  String(raw ?? '').replace(/[\\/?*[\]:]/g, '').trim() || 'Sheet';

const isNumericCell = (value) => {
  const s = String(value ?? '').trim();
  if (!s) return false;
  return /^-?\d{1,3}(,\d{3})*(\.\d+)?$|^-?\d+(\.\d+)?$/.test(s);
};

export default function PdfToExcel() {
  const src = usePdfDocument(100);
  const job = useJob();
  const [analysis, setAnalysis] = useState(null); // { tables, pages, hasText }
  const [selected, setSelected] = useState(new Set());
  const [active, setActive] = useState(null);
  const [numeric, setNumeric] = useState(true);
  const [includeText, setIncludeText] = useState(false);
  const [result, setResult] = useState(null);
  const [exportError, setExportError] = useState(null);

  // Invalidate in-flight analyses when the file changes or user resets.
  const fileTokenRef = useRef(0);

  const reset = () => {
    fileTokenRef.current += 1;      // stops any running analysis from writing state
    if (job.busy && job.cancel) job.cancel();
    job.reset();
    setAnalysis(null);
    setSelected(new Set());
    setActive(null);
    setResult(null);
    setExportError(null);
    src.clear();
  };

  const analyze = async (pdf) => {
    const token = ++fileTokenRef.current;
    try {
      await job.run(async (ctl) => {
        const cancelled = () => ctl.check() || fileTokenRef.current !== token;

        const pages = await extractLines(pdf, {
          onProgress: (p, m) => { if (!cancelled()) ctl.progress(p, m); },
          isCancelled: cancelled,
        });
        if (cancelled()) return;

        const tables = detectTables(pages, { numeric: false });
        if (cancelled()) return;

        setAnalysis({ tables, pages, hasText: pages.some((p) => p.lines.length) });
        setSelected(new Set(tables.map((t) => t.id)));
        setActive(tables[0]?.id ?? null);
      });
    } catch {
      // job.run / StatusPanel already renders the error
    }
  };

  const onFile = async (f) => {
    reset();
    try {
      await src.load(f);
    } catch {
      // src.error is rendered below
    }
  };

  // Analyse once the PDF document is ready.
  useEffect(() => {
    if (src.pdf) analyze(src.pdf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src.pdf]);

  const toggle = (id) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const exportXlsx = async () => {
    if (!analysis) return;
    setExportError(null);
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();
      const used = new Set();

      const uniqueName = (raw) => {
        const base = sanitizeSheetName(raw);
        let candidate = base.slice(0, 31);
        let i = 2;
        while (used.has(candidate)) {
          const suffix = ` (${i++})`;
          candidate = base.slice(0, 31 - suffix.length) + suffix;
        }
        used.add(candidate);
        return candidate;
      };

      for (const t of analysis.tables.filter((x) => selected.has(x.id))) {
        const rows = t.rows.map((row) =>
          row.map((cell) => {
            if (!numeric) return cell;
            if (!isNumericCell(cell)) return cell;
            return Number(String(cell).replace(/,/g, ''));
          })
        );
        XLSX.utils.book_append_sheet(
          wb,
          XLSX.utils.aoa_to_sheet(rows),
          uniqueName(String(t.name ?? 'Table').replace('Page ', 'P').replace(' – Table ', '-T'))
        );
      }

      if (includeText && analysis.hasText) {
        const rows = [['Page', 'Text']];
        analysis.pages.forEach((p) => p.lines.forEach((l) => rows.push([p.page, l.text])));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), uniqueName('All text'));
      }

      if (wb.SheetNames.length === 0) {
        setExportError('Nothing to export. Select at least one table, or enable "All text".');
        return;
      }

      const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      setResult(
        new Blob([out], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
      );
    } catch (e) {
      setExportError(
        e instanceof Error
          ? `Could not create the Excel file: ${e.message}`
          : 'Could not create the Excel file.'
      );
    }
  };

  const activeTable = analysis?.tables.find((t) => t.id === active);
  const canExport =
    !!analysis && (selected.size > 0 || (includeText && analysis.hasText));

  return (
    <ToolShell tool={tool}>
      {!src.file ? (
        <>
          <FileDropzone
            accept={{ 'application/pdf': ['.pdf'] }}
            exts={['.pdf']}
            maxSizeMB={50}
            onFiles={(files) => files[0] && onFile(files[0])}
          />
          {src.loading && <p className="mt-3 mb-0" role="status">Checking PDF…</p>}
          {src.error && <div className="alert alert-danger mt-3 mb-0" role="alert">{src.error}</div>}
        </>
      ) : (
        <FileInfo file={src.file} pages={src.pages} onRemove={reset} disabled={job.busy} />
      )}

      <StatusPanel
        job={job}
        onCancel={job.cancel}
        success={result ? `Your Excel file is ready (${formatBytes(result.size)}).` : null}
      />

      {analysis && (
        <div className="mt-4">
          {!analysis.hasText && (
            <div className="alert alert-warning" role="alert">
              No selectable text was found. This looks like a scanned PDF. This tool does not use OCR
              and cannot extract data from it.
            </div>
          )}
          {analysis.hasText && analysis.tables.length === 0 && (
            <div className="alert alert-warning" role="alert">
              No tables could be detected reliably. Tables drawn as images or without clear column
              spacing cannot be detected. You can still export all text as a worksheet below.
            </div>
          )}

          {analysis.tables.length > 0 && (
            <>
              <h2 className="h6">
                {analysis.tables.length} table{analysis.tables.length === 1 ? '' : 's'} detected — select worksheets to export
              </h2>
              <div className="row g-3">
                <div className="col-md-4">
                  <ul className="list-unstyled table-picker">
                    {analysis.tables.map((t) => {
                      const cols = t.rows[0]?.length ?? 0;
                      return (
                        <li key={t.id}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`c-${t.id}`}
                            checked={selected.has(t.id)}
                            onChange={() => toggle(t.id)}
                          />
                          <button
                            type="button"
                            className={`link-btn${active === t.id ? ' on' : ''}`}
                            onClick={() => setActive(t.id)}
                          >
                            {t.name}{' '}
                            <span className="text-muted">
                              ({t.rows.length}×{cols})
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="col-md-8">
                  {activeTable ? (
                    <div className="table-wrap" tabIndex={0} aria-label={`Preview of ${activeTable.name}`}>
                      <table className="table table-sm table-bordered mb-0">
                        <tbody>
                          {activeTable.rows.slice(0, 15).map((r, i) => (
                            <tr key={i}>
                              {r.map((c, j) => (
                                <td key={j}>{c == null ? '' : String(c)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {activeTable.rows.length > 15 && (
                        <div className="small text-muted p-2">
                          Showing 15 of {activeTable.rows.length} rows.
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">Select a table to preview its contents.</p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="form-check mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="num"
              checked={numeric}
              onChange={(e) => setNumeric(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="num">
              Convert numeric text to Excel numbers
            </label>
          </div>
          {analysis.hasText && (
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="txt"
                checked={includeText}
                onChange={(e) => setIncludeText(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="txt">
                Also add an &quot;All text&quot; worksheet
              </label>
            </div>
          )}

          {exportError && (
            <div className="alert alert-danger mt-3 mb-0" role="alert">{exportError}</div>
          )}

          <div className="actions">
            <button type="button" className="btn btn-red" onClick={exportXlsx} disabled={!canExport}>
              Export to Excel
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={reset}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>
      )}

      {result && src.file && (
        <button
          type="button"
          className="btn btn-red mt-3"
          onClick={() => download(result, `${baseName(src.file.name)}.xlsx`)}
        >
          <Download size={16} /> Download XLSX
        </button>
      )}
    </ToolShell>
  );
}