import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { MB } from '../lib/files.js';

function describe(rejection, exts, maxSizeMB) {
  const name = rejection.file.name;
  return rejection.errors.map((e) => {
    if (e.code === 'file-invalid-type') return `${name}: unsupported file type. Please use ${exts.join(', ')}.`;
    if (e.code === 'file-too-large') return `${name}: larger than the ${maxSizeMB} MB limit.`;
    if (e.code === 'too-many-files') return 'Too many files selected for this tool.';
    if (e.code === 'empty-file') return `${name}: the file is empty.`;
    return `${name}: ${e.message}`;
  });
}

export default function FileDropzone({ accept, exts, multiple = false, maxSizeMB = 100, maxFiles, onFiles, disabled = false, title, compact = false }) {
  const [errors, setErrors] = useState([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    disabled,
    maxFiles: multiple ? maxFiles : 1,
    maxSize: maxSizeMB * MB,
    validator: (f) => (f.size === 0 ? { code: 'empty-file', message: 'File is empty' } : null),
    onDropAccepted: (files) => { setErrors([]); onFiles(files); },
    onDropRejected: (rej) => setErrors(rej.flatMap((r) => describe(r, exts, maxSizeMB))),
  });
  const label = title || (multiple ? 'Drag and drop files here' : 'Drag and drop your file here');
  return (
    <div>
      <div {...getRootProps({ className: `dropzone${isDragActive ? ' active' : ''}${compact ? ' compact' : ''}`, 'aria-label': `${label}, or press Enter to browse files` })}>
        <input {...getInputProps()} aria-label="Choose files" />
        <Upload size={compact ? 22 : 34} aria-hidden="true" className="text-red" />
        <p className="dz-title">{isDragActive ? 'Drop to upload' : label}</p>
        <span className="btn btn-red" aria-hidden="true">Browse files</span>
        <p className="dz-hint">Accepted: {exts.join(', ')} · up to {maxSizeMB} MB{multiple ? ' each' : ''}</p>
      </div>
      {errors.length > 0 && (
        <div className="alert alert-danger mt-3 mb-0" role="alert">
          {errors.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}
    </div>
  );
}
