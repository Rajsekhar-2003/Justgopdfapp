import { useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import FileDropzone from '../components/FileDropzone.jsx';
import FileInfo from '../components/FileInfo.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import usePdfDocument from '../hooks/usePdfDocument.js';
import useJob from '../hooks/useJob.js';
import { getTool } from '../config/toolsData.js';
import { AppError, baseName, download, formatBytes } from '../lib/files.js';
import { loadPdfjs } from '../lib/pdf.js';

const tool = getTool('protect-pdf');

function strength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return [['Too weak', 'danger'], ['Weak', 'danger'], ['Fair', 'warning'], ['Good', 'info'], ['Strong', 'success'], ['Very strong', 'success']][s];
}
const randomPassword = () => Array.from(crypto.getRandomValues(new Uint8Array(24)), (b) => b.toString(16).padStart(2, '0')).join('');

export default function ProtectPdf() {
  const src = usePdfDocument(2000);
  const job = useJob();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [show, setShow] = useState(false);
  const [perm, setPerm] = useState({ printing: true, copying: true, modifying: true, annotating: true });
  const [result, setResult] = useState(null);

  const [label, tone] = strength(pw);
  const valid = pw.length >= 8 && pw === pw2;
  const restricted = Object.values(perm).some((v) => !v);

  const reset = () => { job.reset(); setResult(null); setPw(''); setPw2(''); src.clear(); };

  const protect = () =>
    job.run(async (ctl) => {
      setResult(null);
      const { PDFDocument } = await import('@cantoo/pdf-lib');
      ctl.progress(15, 'Loading document…');
      const doc = await PDFDocument.load(src.bytes, { updateMetadata: false });
      if (typeof doc.encrypt !== 'function') throw new AppError('Encryption is not supported by the bundled PDF library. Please report this issue.', 'unsupported');
      ctl.progress(40, 'Encrypting…');
      await doc.encrypt({
        userPassword: pw,
        ownerPassword: restricted ? randomPassword() : pw,
        permissions: {
          printing: perm.printing ? 'highResolution' : false,
          modifying: perm.modifying,
          copying: perm.copying,
          annotating: perm.annotating,
          fillingForms: perm.annotating,
          contentAccessibility: true,
          documentAssembly: perm.modifying,
        },
      });
      const bytes = await doc.save();
      ctl.check();
      ctl.progress(80, 'Verifying encryption…');
      // Verification: the file must demand a password, accept ours, and keep the page count.
      const pdfjs = await loadPdfjs();
      let needsPassword = false;
      const t1 = pdfjs.getDocument({ data: bytes.slice(), isEvalSupported: false });
      try { const d = await t1.promise; d.destroy(); } catch (e) { needsPassword = e?.name === 'PasswordException'; }
      if (!needsPassword) throw new AppError('Verification failed: the output file is not password-protected, so it was not offered for download.', 'verify');
      const d2 = await pdfjs.getDocument({ data: bytes.slice(), password: pw, isEvalSupported: false }).promise.catch(() => null);
      if (!d2 || d2.numPages !== src.pages) { d2?.destroy(); throw new AppError('Verification failed: the protected file could not be re-opened with your password, so it was not offered for download.', 'verify'); }
      d2.destroy();
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    });

  return (
    <ToolShell tool={tool}>
      {!src.file ? (
        <>
          <FileDropzone accept={{ 'application/pdf': ['.pdf'] }} exts={['.pdf']} maxSizeMB={100} onFiles={(f) => { job.reset(); setResult(null); src.load(f[0]); }} />
          {src.loading && <p className="mt-3 mb-0" role="status">Checking PDF…</p>}
          {src.error && <div className="alert alert-danger mt-3 mb-0" role="alert">{src.error}</div>}
        </>
      ) : (
        <>
          <FileInfo file={src.file} pages={src.pages} onRemove={reset} disabled={job.busy} />
          <fieldset className="settings" disabled={job.busy}>
            <legend>Password</legend>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="pw">Password (min. 8 characters)</label>
                <input id="pw" className="form-control" type={show ? 'text' : 'password'} autoComplete="new-password" value={pw} onChange={(e) => { setPw(e.target.value); setResult(null); }} />
                {pw && <div className="small mt-1" aria-live="polite">Strength: <span className={`badge text-bg-${tone}`}>{label}</span></div>}
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="pw2">Confirm password</label>
                <input id="pw2" className={`form-control${pw2 && pw !== pw2 ? ' is-invalid' : ''}`} type={show ? 'text' : 'password'} autoComplete="new-password" value={pw2} onChange={(e) => { setPw2(e.target.value); setResult(null); }} aria-describedby="pw2e" />
                <div id="pw2e" className="invalid-feedback">Passwords do not match.</div>
              </div>
            </div>
            <div className="form-check mt-2"><input className="form-check-input" id="sp" type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /><label className="form-check-label" htmlFor="sp">Show passwords</label></div>
          </fieldset>
          <fieldset className="settings" disabled={job.busy}>
            <legend>Permissions (optional restrictions)</legend>
            <div className="row">
              {[['printing', 'Allow printing'], ['copying', 'Allow copying text'], ['modifying', 'Allow editing and page changes'], ['annotating', 'Allow comments and form filling']].map(([k, l]) => (
                <div className="col-sm-6" key={k}><div className="form-check"><input className="form-check-input" type="checkbox" id={`p-${k}`} checked={perm[k]} onChange={(e) => { setPerm({ ...perm, [k]: e.target.checked }); setResult(null); }} /><label className="form-check-label" htmlFor={`p-${k}`}>{l}</label></div></div>
              ))}
            </div>
            <p className="small text-muted mt-3 mb-0">
              The <strong>password</strong> encrypts the file so it cannot be opened without it. <strong>Restrictions</strong> are different: they are flags that well-behaved viewers respect, but some software ignores them, so they are not a security barrier on their own.
            </p>
          </fieldset>
          <div className="actions">
            <button type="button" className="btn btn-red" onClick={protect} disabled={job.busy || !valid}>Protect PDF</button>
            <button type="button" className="btn btn-outline-secondary" onClick={reset}><RotateCcw size={16} /> Reset</button>
          </div>
          {!valid && pw && <p className="small text-muted mt-2 mb-0">Enter a password of at least 8 characters and confirm it to continue.</p>}
        </>
      )}
      <StatusPanel job={job} onCancel={job.cancel} success={result ? `Your PDF is protected and verified (${formatBytes(result.size)}). Keep the password safe – it cannot be recovered.` : null} />
      {result && <button type="button" className="btn btn-red mt-3" onClick={() => download(result, `${baseName(src.file.name)}-protected.pdf`)}><Download size={16} /> Download protected PDF</button>}
    </ToolShell>
  );
}
