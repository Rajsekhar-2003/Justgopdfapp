import { useCallback, useEffect, useRef, useState } from 'react';
import { friendlyError } from '../lib/files.js';
import { inspectPdf } from '../lib/pdf.js';

/** Loads and validates one PDF, and destroys the pdf.js document on replace/unmount. */
export default function usePdfDocument(maxPages = 500) {
  const [doc, setDoc] = useState({ file: null, pdf: null, bytes: null, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ref = useRef(null);

  const clear = useCallback(() => {
    ref.current?.destroy?.();
    ref.current = null;
    setDoc({ file: null, pdf: null, bytes: null, pages: 0 });
    setError(null);
  }, []);

  const load = useCallback(async (file) => {
    clear();
    setLoading(true);
    try {
      const { bytes, pdf, pages } = await inspectPdf(file, { maxPages });
      ref.current = pdf;
      setDoc({ file, pdf, bytes, pages });
      return true;
    } catch (e) {
      setError(friendlyError(e));
      return false;
    } finally {
      setLoading(false);
    }
  }, [clear, maxPages]);

  useEffect(() => () => ref.current?.destroy?.(), []);
  return { ...doc, loading, error, load, clear };
}
