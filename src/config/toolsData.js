// Pure data (no JSX, no import.meta) so scripts/postbuild.mjs can import it in Node.

export const HOME = {
  path: '/',
  title: 'Free Online PDF Tools – Convert, Compress, Merge | JustGoPDF',
  description:
    'Convert, compress, merge, split and secure your PDF files in your browser. JustGoPDF is a free, no-registration online PDF toolkit.',
  h1: 'Your Ultimate Online PDF Toolkit',
  intro: 'Convert, compress, merge, split and secure your PDF files — all in one place, for free.',
};

export const TOOLS = [
  {
    id: 'pdf-to-jpg',
    tool: true,
    path: '/pdf-to-jpg',
    name: 'PDF to JPG / PNG',
    short: 'Convert PDF pages to images',
    title: 'PDF to JPG Converter Online Free | JustGoPDF',
    description:
      'Convert PDF pages to high-quality JPG images in your browser. Preview and download single pages or a full ZIP — no sign-up, no watermark.',
    h1: 'PDF to JPG Converter – Turn PDF Pages into Images',
    intro:
      'Render every page of a PDF as a JPG or PNG image. Choose the resolution and quality, preview the results, then download single images or everything as one ZIP file. Conversion runs in your browser.',
    keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to jpg online', 'pdf to png'],
    modified: '2026-11-22',
    popular: true,
    how: [
      'Drop a PDF onto the upload area or choose it with Browse files.',
      'Pick JPG or PNG, a resolution and (for JPG) a quality level.',
      'Select Convert to images and wait for every page to finish.',
      'Download single pages or the full ZIP.',
    ],
    features: [
      'JPG or PNG output with adjustable quality',
      'Resolution from 72 to 300 DPI',
      'Live preview of every page',
      'One-click ZIP download',
      'Files stay in your browser during conversion',
    ],
    faq: [
      { q: 'Which format should I choose, JPG or PNG?', a: 'JPG gives smaller files and suits photos and scans. PNG is lossless and sharper for text, line art and screenshots, but files are larger.' },
      { q: 'What resolution should I use?', a: '150 DPI is a good balance for screens. Use 300 DPI for printing. Very large pages are automatically capped so your browser does not run out of memory.' },
      { q: 'Is there a page limit?', a: 'To keep your browser responsive, PDFs up to 150 pages and 100 MB are supported for image conversion.' },
    ],
    related: ['jpg-to-pdf', 'split-pdf', 'compress-pdf'],
  },
  {
    id: 'jpg-to-pdf',
    tool: true,
    path: '/jpg-to-pdf',
    name: 'JPG / PNG to PDF',
    short: 'Convert images to a PDF',
    title: 'JPG to PDF Converter Online Free | JustGoPDF',
    description:
      'Combine JPG and PNG images into one PDF. Reorder images, choose page size and margins — free, no sign-up, no watermark.',
    h1: 'JPG to PDF Converter – Combine Images into One PDF',
    intro:
      'Turn photos, scans and screenshots into a single PDF. Drag images into the order you want, pick A4, Letter or original size, set margins and choose how each image fits the page.',
    keywords: ['jpg to pdf', 'image to pdf', 'png to pdf', 'combine images into pdf'],
    modified: '2026-11-22',
    popular: true,
    how: [
      'Add one or more JPG, JPEG or PNG images.',
      'Drag the images (or use the arrow buttons) to set the page order.',
      'Choose page size, orientation, margins and image fit.',
      'Select Create PDF and download the result.',
    ],
    features: [
      'Multiple images in one PDF',
      'Drag-and-drop or keyboard reordering',
      'A4, Letter or fit-to-image page size',
      'Portrait, landscape or automatic orientation',
      'JPG and PNG are embedded without extra recompression',
    ],
    faq: [
      { q: 'Are my images re-compressed?', a: 'JPG and PNG files are embedded as they are. Photos with a rotation flag (EXIF) are re-encoded so they appear the right way up.' },
      { q: 'How many images can I add?', a: 'Up to 100 images of 20 MB each, depending on your device memory.' },
      { q: 'What does "Fit to image" do?', a: 'Each page is sized to match its image (at 96 DPI) plus your margin.' },
    ],
    related: ['pdf-to-jpg', 'merge-pdf', 'compress-pdf'],
  },
  {
    id: 'pdf-to-word',
    tool: true,
    path: '/pdf-to-word',
    name: 'PDF to Word',
    short: 'Convert PDF to editable Word',
    title: 'PDF to Word Converter Online Free | JustGoPDF',
    description:
      'Convert text-based PDF files to editable Word DOCX documents. Paragraphs and headings are rebuilt in your browser — no upload, no sign-up.',
    h1: 'PDF to Word Converter – Create an Editable DOCX',
    intro:
      'Extract the text of a PDF and rebuild it as an editable Word document with paragraphs, headings and basic bold and italic formatting. Best for text-based documents such as letters, reports and articles.',
    keywords: ['pdf to word', 'pdf to docx', 'convert pdf to word online', 'editable pdf'],
    modified: '2026-11-22',
    popular: true,
    how: [
      'Upload a text-based PDF.',
      'Select Convert to Word. Text is analysed page by page.',
      'Download the DOCX and review it in Word, LibreOffice or Google Docs.',
    ],
    features: [
      'Editable DOCX output',
      'Heading and paragraph detection',
      'Bold and italic detection where the PDF exposes font names',
      'Page breaks preserved',
      'Clear warning when a PDF has no extractable text',
    ],
    faq: [
      { q: 'Will the layout match exactly?', a: 'No. This tool rebuilds text flow, not the original layout. Multi-column pages, tables, text boxes, headers and footers may need manual editing.' },
      { q: 'Can it convert scanned PDFs?', a: 'No. Scanned pages are pictures of text and contain nothing to extract. OCR is not part of this tool.' },
      { q: 'Are images included?', a: 'Not in this version. Only text content is converted.' },
    ],
    related: ['word-to-pdf', 'pdf-to-excel', 'pdf-to-jpg'],
  },
  {
    id: 'word-to-pdf',
    tool: true,
    path: '/word-to-pdf',
    name: 'Word to PDF',
    short: 'Convert Word to PDF',
    title: 'Word to PDF Converter Online Free | JustGoPDF',
    description:
      'Convert Word DOCX documents to PDF with selectable text. Choose page size, margins and font size, then download — right in your browser.',
    h1: 'Word to PDF Converter – Turn DOCX into PDF',
    intro:
      'Upload a DOCX file, preview it and convert it to a PDF with selectable text. Headings, paragraphs, lists, tables and embedded images are supported. This is a browser-based reconstruction, not Microsoft Word itself.',
    keywords: ['word to pdf', 'docx to pdf', 'convert word to pdf online', 'doc to pdf'],
    modified: '2026-11-22',
    popular: false,
    how: [
      'Upload a .docx file.',
      'Check the preview and choose page size, margins and font size.',
      'Select Convert to PDF and download the result.',
    ],
    features: [
      'Preview before converting',
      'Selectable text in the PDF',
      'Headings, lists, bold, italic, tables and images',
      'A4 or Letter, portrait or landscape',
      'Sanitised rendering – no scripts are ever executed',
    ],
    faq: [
      { q: 'Does it support old .doc files?', a: 'No. Only .docx files are supported. Open a .doc file in Word and save it as .docx first.' },
      { q: 'Will it look exactly like Word?', a: 'Not always. The converter rebuilds content with standard PDF fonts. Custom fonts, headers/footers, text boxes, columns and page-specific layout are not reproduced.' },
      { q: 'What about non-Latin text?', a: 'Standard PDF fonts only cover Latin characters. The tool warns you when characters may not render.' },
    ],
    related: ['pdf-to-word', 'excel-to-pdf', 'jpg-to-pdf'],
  },
  {
    id: 'pdf-to-excel',
    tool: true,
    path: '/pdf-to-excel',
    name: 'PDF to Excel',
    short: 'Extract data to Excel',
    title: 'PDF to Excel Converter Online Free | JustGoPDF',
    description:
      'Extract tables from text-based PDF files into an Excel XLSX workbook. Preview detected tables before you download — free, in your browser.',
    h1: 'PDF to Excel Converter – Extract Tables to XLSX',
    intro:
      'Detect table-like blocks in a text-based PDF, preview them and export the ones you want to an Excel workbook. Table detection is heuristic, so always check the preview.',
    keywords: ['pdf to excel', 'pdf to xlsx', 'extract table from pdf', 'convert pdf to excel online'],
    modified: '2026-11-22',
    popular: false,
    how: [
      'Upload a text-based PDF.',
      'Wait while tables are detected, then review the preview.',
      'Select the tables to include and export to XLSX.',
    ],
    features: [
      'Automatic table detection from text positions',
      'Preview each detected table',
      'One worksheet per selected table',
      'Optional "all text" worksheet as a fallback',
      'Numbers converted to real Excel numbers',
    ],
    faq: [
      { q: 'Why was no table found?', a: 'Scanned PDFs, tables drawn as images and layouts without clear column spacing cannot be detected reliably. The tool will tell you instead of guessing.' },
      { q: 'Are merged cells supported?', a: 'No. Table cells are detected from text position and exported as plain cells.' },
      { q: 'Does it use OCR?', a: 'No. Only text that is already inside the PDF is extracted.' },
    ],
    related: ['excel-to-pdf', 'pdf-to-word', 'split-pdf'],
  },
  {
    id: 'excel-to-pdf',
    tool: true,
    path: '/excel-to-pdf',
    name: 'Excel to PDF',
    short: 'Convert Excel to PDF',
    title: 'Excel to PDF Converter Online Free | JustGoPDF',
    description:
      'Convert XLS and XLSX spreadsheets to PDF. Choose worksheet, orientation, paper size and margins — no sign-up, no watermark.',
    h1: 'Excel to PDF Converter – Export Spreadsheets as PDF',
    intro:
      'Preview a spreadsheet, pick a worksheet (or all of them), set orientation, paper size and margins, and export a tidy PDF table. Cell values are exported as displayed in Excel.',
    keywords: ['excel to pdf', 'xlsx to pdf', 'xls to pdf', 'convert excel to pdf online'],
    modified: '2026-11-22',
    popular: false,
    how: [
      'Upload an .xls or .xlsx file.',
      'Select a worksheet and review the preview.',
      'Choose orientation, paper size and margins.',
      'Select Convert to PDF and download.',
    ],
    features: [
      'XLS and XLSX support',
      'Single worksheet or all worksheets',
      'A4, A3, Letter and Legal paper',
      'Portrait or landscape',
      'Wide sheets continue on extra pages',
    ],
    faq: [
      { q: 'Are charts and images exported?', a: 'No. Only cell values are exported. Charts, images, merged cells and conditional formatting are not reproduced.' },
      { q: 'Are formulas calculated?', a: 'The tool uses the values stored in the file. If a file has never been calculated and saved, formula cells may be empty.' },
      { q: 'Is there a size limit?', a: 'Files up to 25 MB and 10,000 rows per worksheet are supported.' },
    ],
    related: ['pdf-to-excel', 'word-to-pdf', 'merge-pdf'],
  },
  {
    id: 'compress-pdf',
    tool: true,
    path: '/compress-pdf',
    name: 'Compress PDF',
    short: 'Reduce PDF file size',
    title: 'Compress PDF Online Free – Reduce PDF File Size | JustGoPDF',
    description:
      'Compress PDF files online with 100 KB, 200 KB, 500 KB and custom size targets. Optimize PDF file size in your browser — no upload, no sign-up.',
    h1: 'Compress PDF – Reduce PDF File Size Online',
    intro:
      'Reduce the size of a PDF by recompressing and downscaling its JPEG images while keeping text and vector content sharp. Choose a target from 100 KB to 5 MB, or a general compression level. Targets are goals, not guarantees.',
    keywords: ['compress pdf', 'reduce pdf size', 'pdf compressor', 'compress pdf to 100kb', 'compress pdf to 200kb'],
    modified: '2026-11-22',
    popular: true,
    how: [
      'Upload a PDF.',
      'Choose a target size or a compression level.',
      'Select Compress PDF. The tool tries stronger settings until the target is met or quality would suffer.',
      'Compare original and result, then download.',
    ],
    features: [
      'Targets: 100 KB, 200 KB, 500 KB, 1 MB, 2 MB, 5 MB or custom',
      'Low, Recommended and High compression levels',
      'Text and vector content preserved',
      'Optional metadata removal',
      'Honest reporting when a target cannot be reached',
      'Optional last-resort page rasterisation, only if you allow it',
    ],
    faq: [
      { q: 'Will I always get the size I choose?', a: 'No. A PDF made mostly of text and vectors is already small. Without destroying quality, the tool reports the actual size and explains why the target was not reached.' },
      { q: 'What is rasterisation and why is it optional?', a: 'It converts each page to a picture. It can shrink files dramatically but text is no longer selectable or searchable, so it only runs if you switch it on.' },
      { q: 'Does it remove my images?', a: 'No. Images are downscaled and recompressed, never removed. Images that are not JPEG-encoded are left untouched.' },
    ],
    related: ['merge-pdf', 'split-pdf', 'protect-pdf'],
  },
  {
    id: 'merge-pdf',
    tool: true,
    path: '/merge-pdf',
    name: 'Merge PDF',
    short: 'Combine multiple PDFs',
    title: 'Merge PDF Files Online Free – Combine PDFs | JustGoPDF',
    description:
      'Merge multiple PDF files into one document. Reorder, preview and combine PDFs in your browser — free, no sign-up, no watermark.',
    h1: 'Merge PDF – Combine Multiple PDFs into One',
    intro:
      'Add several PDF files, drag them into the right order, remove any you do not need and merge them into a single document.',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'merge pdf online free'],
    modified: '2026-11-22',
    popular: true,
    how: [
      'Add two or more PDF files.',
      'Drag files (or use the arrow buttons) to set the order.',
      'Select Merge PDFs and download the combined file.',
    ],
    features: [
      'Unlimited ordering with drag and drop',
      'First-page preview and page counts',
      'Remove files before merging',
      'Detects protected or corrupted files',
    ],
    faq: [
      { q: 'Can I merge password-protected PDFs?', a: 'No. Remove the password first, then merge.' },
      { q: 'Are bookmarks kept?', a: 'Pages are copied into the new document. Bookmarks and form fields from the source files may not be preserved.' },
      { q: 'How many files can I merge?', a: 'Up to 30 files of 100 MB each, depending on your device memory.' },
    ],
    related: ['split-pdf', 'compress-pdf', 'jpg-to-pdf'],
  },
  {
    id: 'split-pdf',
    tool: true,
    path: '/split-pdf',
    name: 'Split PDF',
    short: 'Extract pages from PDF',
    title: 'Split PDF Online Free – Extract Pages | JustGoPDF',
    description:
      'Split a PDF into separate files or extract selected pages. Custom page ranges and ZIP download in your browser — free, no sign-up.',
    h1: 'Split PDF – Extract Pages or Split into Separate Files',
    intro:
      'Pick pages visually or type page ranges. Extract a selection into one PDF, split every page into its own file, or create one PDF per range.',
    keywords: ['split pdf', 'extract pages from pdf', 'pdf splitter', 'split pdf online free'],
    modified: '2026-11-22',
    popular: true,
    how: [
      'Upload a PDF and wait for page previews.',
      'Choose a mode: extract selected pages, split by ranges or split every page.',
      'Select pages or enter ranges such as 1-3, 5, 8-10.',
      'Split the PDF and download files individually or as a ZIP.',
    ],
    features: [
      'Visual page picker with thumbnails',
      'Custom ranges',
      'Split every page',
      'Download individual PDFs or a ZIP',
    ],
    faq: [
      { q: 'How do I write ranges?', a: 'Use commas and dashes, for example 1-3, 5, 8-10. Page numbers start at 1.' },
      { q: 'Is the original file changed?', a: 'No. Your original file is never modified.' },
      { q: 'Is there a page limit?', a: 'PDFs up to 500 pages and 100 MB are supported.' },
    ],
    related: ['merge-pdf', 'compress-pdf', 'pdf-to-jpg'],
  },
  {
    id: 'protect-pdf',
    tool: true,
    path: '/protect-pdf',
    name: 'Protect PDF',
    short: 'Add a password to your PDF',
    title: 'Protect PDF with Password Online Free | JustGoPDF',
    description:
      'Add a password to your PDF online for free. Encrypt PDF files in your browser and download the protected document — no upload, no sign-up.',
    h1: 'Protect PDF – Encrypt a PDF with a Password',
    intro:
      'Set an open password so the PDF cannot be opened without it. Optionally restrict printing, copying and editing. Encryption happens in your browser and the password is never sent anywhere.',
    keywords: ['protect pdf', 'password protect pdf', 'encrypt pdf', 'lock pdf with password'],
    modified: '2026-11-22',
    popular: false,
    how: [
      'Upload a PDF that is not already protected.',
      'Enter and confirm a strong password.',
      'Choose optional permission restrictions.',
      'Encrypt the PDF. The tool re-opens the result to verify encryption before offering the download.',
    ],
    features: [
      'Open password with strength meter',
      'Optional printing, copying and editing restrictions',
      'Result verified before download',
      'Password never leaves your device',
    ],
    faq: [
      { q: 'What is the difference between a password and restrictions?', a: 'The open password stops anyone without it from reading the file. Restrictions (printing, copying, editing) are flags that well-behaved viewers respect, but some software ignores them.' },
      { q: 'What if I forget the password?', a: 'It cannot be recovered. Keep a copy of the unprotected original in a safe place.' },
      { q: 'Which viewers can open the file?', a: 'Standard PDF viewers such as Acrobat, Chrome, Edge, Firefox and macOS Preview support password-protected PDFs. Test the file in the viewer your recipients use.' },
    ],
    related: ['compress-pdf', 'merge-pdf', 'split-pdf'],
  },
];

export const PAGES = [
  { path: '/all-tools', title: 'All PDF Tools – Free Online PDF Converter & Editor | JustGoPDF', description: 'Browse every JustGoPDF tool: convert PDF to JPG, Word and Excel, compress, merge, split and protect PDF files online.', h1: 'All PDF Tools' },
  { path: '/free-online-pdf-tools', title: 'Free Online PDF Tools Guide – JPG to PDF, Compress & More | JustGoPDF', description: 'Step-by-step guide to every JustGoPDF tool: JPG to PDF, PDF to JPG, compress to 100KB–1MB, merge, split and protect — free, no login, in your browser.', h1: 'Free Online PDF Tools — Complete Guide' },
  { path: '/about', title: 'About JustGoPDF – Free Online PDF Toolkit', description: 'Learn about JustGoPDF, a free browser-based PDF toolkit built around speed, privacy and simplicity.', h1: 'About JustGoPDF' },
  { path: '/contact', title: 'Contact JustGoPDF', description: 'Get in touch with the JustGoPDF team for support, feedback or business enquiries.', h1: 'Contact us' },
  { path: '/blog', title: 'JustGoPDF Blog – PDF Tips and Guides', description: 'Practical guides on compressing, merging, converting and protecting PDF files.', h1: 'PDF tips and guides' },
  { path: '/privacy-policy', title: 'Privacy Policy | JustGoPDF', description: 'How JustGoPDF handles your files, passwords and data.', h1: 'Privacy Policy' },
  { path: '/terms-and-conditions', title: 'Terms and Conditions | JustGoPDF', description: 'The terms that apply when you use JustGoPDF.', h1: 'Terms and Conditions' },
  { path: '/disclaimer', title: 'Disclaimer | JustGoPDF', description: 'Important limitations of the JustGoPDF conversion tools.', h1: 'Disclaimer' },
  { path: '/faq', title: 'Frequently Asked Questions | JustGoPDF', description: 'Answers about privacy, supported files, limits and conversion quality at JustGoPDF.', h1: 'Frequently asked questions' },
];

export const getTool = (id) => TOOLS.find((t) => t.id === id);

export const SITE_FAQ = [
  { q: 'Is JustGoPDF really free?', a: 'Yes. All tools are free to use, require no registration, and add no watermark to your results.' },
  { q: 'Are my files uploaded to a server?', a: 'The tools process files inside your browser. JustGoPDF does not send your documents to an application server — your files never leave your device. The website itself is downloaded from our host, which keeps standard server logs.' },
  { q: 'Which devices and browsers work best?', a: 'Current versions of Chrome, Edge, Firefox and Safari on desktop, tablet and phone, in light or dark mode. Large files need more memory, so a desktop is recommended.' },
  { q: 'Why might a conversion not look perfect?', a: 'PDF is a layout format. Converting to Word or Excel means reconstructing structure from positioned text, which is never perfect — especially for scans and complex tables. Each tool explains its limits before you start.' },
  { q: 'Are there file size limits?', a: 'Yes, to keep your browser responsive — typically 20 MB per image, 100 MB per PDF, and 150–500 pages depending on the tool. Each tool page shows the exact limits and a clear message if a file is too large.' },
  { q: 'Do I need to install any software?', a: 'No. Every tool runs in your web browser. There is nothing to download, no desktop app, no extension and no account to create.' },
  { q: 'Can I use these PDF tools on my phone?', a: 'Yes. The tools are responsive and work on Android and iPhone in a current mobile browser. For very large files, a desktop or laptop gives the smoothest experience.' },
];