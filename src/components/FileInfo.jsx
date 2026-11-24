import { FileText, X } from 'lucide-react';
import { formatBytes } from '../lib/files.js';

export default function FileInfo({ file, pages, extra, onRemove, disabled }) {
  return (
    <div className="file-info">
      <FileText size={28} className="text-red flex-shrink-0" aria-hidden="true" />
      <div className="flex-grow-1 min-w-0">
        <div className="fw-semibold text-truncate">{file.name}</div>
        <div className="small text-muted">{formatBytes(file.size)}{pages ? ` · ${pages} page${pages === 1 ? '' : 's'}` : ''}{extra ? ` · ${extra}` : ''}</div>
      </div>
      {onRemove && (
        <button type="button" className="icon-btn" onClick={onRemove} disabled={disabled} aria-label={`Remove ${file.name}`}><X size={18} /></button>
      )}
    </div>
  );
}
