import { useCallback, useRef, useState } from 'react';
import { CancelledError, friendlyError } from '../lib/files.js';

const IDLE = { status: 'idle', progress: 0, message: '', error: null };

/** Runs an async job with progress, cancellation and centralised error handling. */
export default function useJob() {
  const [state, setState] = useState(IDLE);
  const cancelled = useRef(false);

  const run = useCallback(async (fn) => {
    cancelled.current = false;
    setState({ status: 'processing', progress: 0, message: 'Starting…', error: null });
    const ctl = {
      progress: (p, m) => setState((s) => (s.status === 'processing' ? { ...s, progress: Math.min(100, Math.round(p)), message: m ?? s.message } : s)),
      check: () => { if (cancelled.current) throw new CancelledError(); },
    };
    try {
      const result = await fn(ctl);
      setState({ status: 'done', progress: 100, message: '', error: null });
      return result;
    } catch (e) {
      if (e instanceof CancelledError) setState({ ...IDLE, message: 'Cancelled.' });
      else setState({ status: 'error', progress: 0, message: '', error: friendlyError(e) });
      return undefined;
    }
  }, []);

  const cancel = useCallback(() => { cancelled.current = true; }, []);
  const reset = useCallback(() => { cancelled.current = true; setState(IDLE); }, []);
  const fail = useCallback((message) => setState({ status: 'error', progress: 0, message: '', error: message }), []);
  return { ...state, busy: state.status === 'processing', run, cancel, reset, fail };
}
