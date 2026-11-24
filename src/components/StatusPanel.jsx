import { AlertTriangle, CheckCircle2 } from 'lucide-react';

/** Progress, errors and success. Screen readers get polite/assertive announcements. */
export default function StatusPanel({ job, success, onCancel }) {
  return (
    <div className="status-panel">
      <div aria-live="polite" className={job.busy ? 'mt-3' : 'visually-hidden'}>
        {job.busy && (
          <>
            <div className="d-flex justify-content-between small mb-1">
              <span>{job.message}</span>
              <span>{job.progress}%</span>
            </div>
            <div className="progress" role="progressbar" aria-label="Processing progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={job.progress}>
              <div className="progress-bar" style={{ width: `${job.progress}%` }} />
            </div>
            {onCancel && <button type="button" className="btn btn-outline-secondary btn-sm mt-2" onClick={onCancel}>Cancel</button>}
          </>
        )}
      </div>
      {job.error && (
        <div className="alert alert-danger d-flex gap-2 mt-3 mb-0" role="alert">
          <AlertTriangle size={20} className="flex-shrink-0" aria-hidden="true" /> <div>{job.error}</div>
        </div>
      )}
      {!job.busy && !job.error && job.message === 'Cancelled.' && <div className="alert alert-secondary mt-3 mb-0" role="status">Processing was cancelled.</div>}
      {success && (
        <div className="alert alert-success d-flex gap-2 mt-3 mb-0" role="status">
          <CheckCircle2 size={20} className="flex-shrink-0" aria-hidden="true" /> <div>{success}</div>
        </div>
      )}
    </div>
  );
}
