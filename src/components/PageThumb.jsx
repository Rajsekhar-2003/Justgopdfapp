import { useEffect, useRef, useState } from 'react';

/** Lazily renders one PDF page thumbnail when scrolled into view. */
export default function PageThumb({ pdf, pageNumber = 1, width = 140, alt }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !('IntersectionObserver' in window)) { setVisible(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !pdf) return undefined;
    let task;
    let cancelled = false;
    (async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;
        const base = page.getViewport({ scale: 1 });
        const scale = (width * Math.min(2, window.devicePixelRatio || 1)) / base.width;
        const vp = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = Math.floor(vp.width);
        canvas.height = Math.floor(vp.height);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        task = page.render({ canvasContext: ctx, viewport: vp });
        await task.promise;
        page.cleanup();
      } catch (e) {
        if (!cancelled && e?.name !== 'RenderingCancelledException') setFailed(true);
      }
    })();
    return () => { cancelled = true; task?.cancel?.(); };
  }, [visible, pdf, pageNumber, width]);

  return (
    <div ref={wrapRef} className="page-thumb" style={{ width }}>
      {failed ? <span className="small text-muted">Preview unavailable</span> : <canvas ref={canvasRef} role="img" aria-label={alt || `Page ${pageNumber} preview`} style={{ width: '100%', height: 'auto' }} />}
    </div>
  );
}
