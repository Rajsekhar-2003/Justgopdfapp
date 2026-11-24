# JustGoPDF – Online PDF Toolkit

React 18 + Vite + Bootstrap 5. Ten PDF tools, all processed **in the browser** (no backend, no database).
Deploys as a static site on Cloudflare Pages.

## Quick start

```bash
npm install
cp .env.example .env.local      # set VITE_SITE_URL etc.
npm run dev                     # http://localhost:5173
npm run build                   # vite build + SEO post-processing -> dist/
npm run preview
```

Node.js ≥ 18 is needed **only** for development and the build. Nothing in production needs Node.

`npm run dev` / `build` first copy pdf.js CMaps and standard fonts into `public/pdfjs/` (needed for CJK and non-embedded fonts).

## Tools and how they work

| Route | Engine | Notes |
|---|---|---|
| /pdf-to-jpg | pdf.js → canvas → JPG/PNG, JSZip | ≤150 pages, canvas capped at 16 MP |
| /jpg-to-pdf | pdf-lib | JPG/PNG embedded as-is; EXIF-rotated JPEG is re-encoded |
| /pdf-to-word | pdf.js text positions → `docx` | Rebuilds paragraphs/headings/bold/italic. No images, no OCR |
| /word-to-pdf | mammoth → DOMPurify → jsPDF (+autotable) | Real selectable text; standard fonts only; **.docx only** |
| /pdf-to-excel | pdf.js text positions → heuristic tables → SheetJS | Detection is heuristic; says so when nothing is found |
| /excel-to-pdf | SheetJS → jsPDF-autotable | Cell values only (no charts/images/merged cells) |
| /compress-pdf | pdf-lib image-stream recompression; optional rasterisation | See below |
| /merge-pdf | pdf-lib | Drag/keyboard reorder, thumbnails |
| /split-pdf | pdf-lib, JSZip | Select / ranges / every page |
| /protect-pdf | `@cantoo/pdf-lib` `encrypt()` + pdf.js verification | Output is re-opened to prove it needs the password |

### Compression strategy
1. Parse the PDF with pdf-lib and find JPEG (DCTDecode) image streams ≥ 12 KB.
2. Decode with `createImageBitmap`, downscale (max dimension ladder) and re-encode JPEG at decreasing quality.
3. Optionally strip metadata; save with object streams. Text and vectors are never touched.
4. For targets, stronger passes run until the target is met; the smallest result is kept.
5. If the target is still unmet, the UI says so with the actual size. Only if the user ticks the opt-in box does it rasterise pages (text becomes non-selectable).
6. If no smaller file is possible the original is returned unchanged and the UI says so.

Non-JPEG images (Flate/JBIG2/JPX) are not recompressed in this version.

## Deploy to Cloudflare Pages
1. Push this folder to GitHub/GitLab.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: `npm run build` · Output directory: `dist` · Env var `NODE_VERSION=20`.
4. Add env vars `VITE_SITE_URL=https://your-domain.com`, `VITE_CONTACT_EMAIL`, optional `VITE_GA_ID`.
5. Add your custom domain. HTTPS is automatic.

`public/_redirects` provides the SPA fallback, `public/_headers` sets the CSP and cache headers.
`scripts/postbuild.mjs` writes a static `index.html` per route (unique title, description, canonical, Open Graph, Twitter tags and crawlable fallback content), plus `sitemap.xml` and `robots.txt` using `VITE_SITE_URL`.

## SEO
Every tool page has a unique title/description, canonical, OG/Twitter tags, one H1, breadcrumb nav + `BreadcrumbList`, `SoftwareApplication` and `FAQPage` JSON-LD (FAQ text is visible on the page). The home page has `WebSite` and `Organization` JSON-LD. Search Console: add the `<meta name="google-site-verification">` line shown (commented) in `index.html`, or verify via DNS. Replace `public/og-image.jpg` if you want a different share image.

## Analytics (optional)
Set `VITE_GA_ID`. Then extend the CSP in `public/_headers`:
`script-src 'self' 'wasm-unsafe-eval' https://www.googletagmanager.com; connect-src 'self' blob: data: https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; img-src 'self' data: blob: https://*.google-analytics.com`.
Only page paths are sent; never file names or contents. Consider a consent banner for regions that require it.

## Privacy and security
- Files are read with the File API and never sent anywhere by app code. No document content is logged.
- Blob URLs are revoked on change/unmount; pdf.js documents and canvases are destroyed/zeroed after use.
- Word preview HTML is sanitised with DOMPurify; the converter parses it in an inert DOM.
- Strict CSP (no inline scripts, no remote scripts, `frame-src 'none'`).
- The privacy policy and homepage state exactly this: processing is local; the host still serves the site and keeps normal server logs.

## Limits (enforced with friendly errors)
PDF→image 150 pages/100 MB · other PDF tools 100 MB, 100–500 pages by tool · images 20 MB × 100 · Word/Excel 25 MB · Excel 10,000 rows/sheet · merge 30 files.

## Known limitations (honest list)
- Heavy work runs on the main thread in async chunks (yielding between pages/images) with cancel support; only pdf.js rendering uses a worker. Moving compression/conversion into dedicated Web Workers is the next performance step.
- Word→PDF is a reconstruction, not Word's layout engine. Non-Latin text cannot be drawn with standard PDF fonts (the UI warns). Old `.doc` is not supported.
- PDF→Word/Excel: no OCR, no images, heuristic structure.
- `pdfjs-dist` 4.x needs a reasonably modern browser (a `Promise.withResolvers` shim is included).
- `xlsx` is installed from the SheetJS CDN tarball (the npm registry copy is outdated and has known advisories).
- Meta tags for crawlers come from the postbuild step; if you skip `npm run build`'s postbuild, only client-side Helmet tags exist.

## Test checklist (run before launch)
Valid / invalid / empty / corrupted / password-protected / large / multi-page PDFs on every tool; multiple images and PDFs; refresh mid-job; cancel mid-job; mobile viewport; slow device (CPU throttling); open every output in Acrobat/Chrome (PDF), Word/LibreOffice (DOCX), Excel/LibreOffice (XLSX); open protected PDFs in at least two viewers and confirm the password prompt.

## Structure
```
src/config   tool data (single source for UI, SEO, sitemap)
src/lib      files, pdf, pdfText, compress, htmlToPdf, analytics
src/hooks    useJob (progress/cancel/errors), usePdfDocument, useBlobUrls
src/components  FileDropzone, StatusPanel, SortableList, PageThumb, ToolShell, Layout…
src/tools    one component per tool route
src/pages    Home, AllTools, static pages, 404
scripts      copy-pdfjs-assets, postbuild (SEO)
```

## SEO checklist (what is implemented)
- Unique title, meta description, canonical, Open Graph and Twitter tags per route (baked into static HTML by `scripts/postbuild.mjs` and kept in sync at runtime by Helmet).
- Long-form, tool-accurate article on every tool page (`src/config/articles.js`, `articlesMore.js`), also written into the static HTML so crawlers without JavaScript can read it.
- JSON-LD: WebSite, Organization, FAQPage (home), BreadcrumbList, SoftwareApplication, HowTo, FAQPage (tools).
- Sitemap, robots.txt, `max-image-preview:large`, one H1 per page, internal links between related tools, 404 page with `noindex`.
- To do after launch (cannot be done in code): set `VITE_SITE_URL`, verify the domain in Google Search Console and Bing Webmaster Tools, submit `/sitemap.xml`, and check pages with the Rich Results Test and PageSpeed Insights.
