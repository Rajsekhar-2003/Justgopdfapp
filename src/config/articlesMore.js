// Long-form SEO articles for the remaining tools. Claims here match what each tool actually does.
const priv = (what) => ({
  t: 'p',
  x: `${what} is processed inside your web browser, on your own device. Nothing is uploaded to our servers, so personal and business documents stay private. Close the tab and the working files are gone from the page.`,
});
const devices = {
  t: 'p',
  x: 'The tool runs in your browser, so there is nothing to install. It works on Windows, macOS, Linux, Android, iPhone and iPad, in light or dark mode. Large files need more memory, so a desktop or laptop gives the best results.',
};

export const MORE = {
  // ─────────────────────────────────────────────────────────────
  'pdf-to-jpg': [
    { t: 'h2', x: 'Free Online PDF to JPG and PNG Converter' },
    { t: 'p', x: 'You have a PDF. You need an image of it — for a slide, a WhatsApp forward, a website listing, or a portal that only accepts JPGs. This tool turns every page of your PDF into a JPG or PNG picture in a few clicks.' },
    { t: 'p', x: 'Upload your PDF, choose the image format, resolution and quality, then download single pages or all images together in one ZIP file. No software to install, no account needed.' },
    { t: 'h2', x: 'Why Convert PDF Pages to Images?' },
    { t: 'p', x: 'The tool is useful in more situations than you might expect:' },
    { t: 'ul', x: [
      ['Presentations and documents: ', 'Place a PDF page into a slide, a web page or a chat message as a picture — most tools handle images better than embedded PDFs.'],
      ['Social media and websites: ', 'Share a flyer, menu, certificate or notice as an image where PDFs are not supported.'],
      ['Forms and portals: ', 'Some upload forms accept only JPG or PNG — common on scholarship and exam registration portals.'],
      ['Previews: ', 'Create thumbnails and preview images of documents for a catalogue, a listing or an internal index.'],
      ['Editing: ', 'Open a page in an image editor to crop, annotate or redact before sharing.'],
    ] },
    { t: 'h2', x: 'JPG or PNG: Which Should You Choose?' },
    { t: 'p', x: 'JPG creates smaller files and suits photographs and scanned pages. PNG is lossless and keeps text and line art crisp, but the files are larger. For JPG you can also choose the quality level.' },
    { t: 'p', x: 'Quick rule of thumb: if the page is mostly text, go with PNG. If it is mostly a photograph or a scan, JPG at a moderate quality is lighter and just as readable.' },
    { t: 'h2', x: 'How to Convert PDF to JPG Online' },
    { t: 'ol', x: [
      ['Add your PDF: ', 'Drag it onto the upload area or use Browse files.'],
      ['Choose settings: ', 'Select JPG or PNG, a resolution from 72 to 300 DPI, and the JPG quality.'],
      ['Convert and download: ', 'Preview each page, then download single images or the full ZIP.'],
    ] },
    { t: 'p', x: 'For an A4 page, 150 DPI is a good balance of sharpness and file size for sharing. Use 300 DPI when the image will be printed.' },
    { t: 'h2', x: 'Limits to Know' },
    { t: 'p', x: 'To keep your browser responsive, PDFs of up to 150 pages and 100 MB are supported for image conversion, and very large pages are automatically capped in pixel size. Password-protected PDFs must be unlocked first.' },
    { t: 'h2', x: 'What to Do Next' },
    { t: 'ul', x: [
      ['File too big to send? ', 'Use Compress PDF to reduce the original before converting.'],
      ['Combining converted images back? ', 'Use JPG to PDF to turn a folder of images into one tidy document.'],
      ['Only need a few pages? ', 'Use Split PDF to pick the pages you need, then convert just those.'],
    ] },
    { t: 'h2', x: 'Your Files Stay Private' }, priv('Your PDF'), devices,
    { t: 'p', x: 'No sign-up. No watermark. Just the images you need, extracted on your own device.' },
  ],

  // ─────────────────────────────────────────────────────────────
  'pdf-to-word': [
    { t: 'h2', x: 'Free Online PDF to Word Converter' },
    { t: 'p', x: 'You received a PDF. Someone asks you to "just change one word." And here you are, wondering if you will have to retype the whole thing. You will not.' },
    { t: 'p', x: 'This converter reads a text-based PDF and rebuilds it as an editable Word document (DOCX) — paragraphs, headings and basic bold and italic formatting — so you can edit the content in Word, LibreOffice or Google Docs.' },
    { t: 'h2', x: 'When PDF to Word Works Best' },
    { t: 'p', x: 'Conversion quality depends on how the original PDF was created. It works best for:' },
    { t: 'ul', x: [
      ['Letters and reports: ', 'Single-column documents with normal paragraphs convert well.'],
      ['Articles and essays: ', 'Headings and body text are detected from font size and style.'],
      ['Contracts and templates: ', 'Reuse the wording, then check the formatting.'],
      ['Resumes and CVs: ', 'Pull the text out of a candidate PDF to reuse it in your own template.'],
    ] },
    { t: 'h2', x: 'How to Convert PDF to Word Online' },
    { t: 'ol', x: [
      ['Add a text-based PDF: ', 'Drag it onto the upload area or use Browse files.'],
      ['Convert: ', 'The text is analysed page by page and a DOCX file is built.'],
      ['Download and review: ', 'Open the file and proofread headings, lists and spacing.'],
    ] },
    { t: 'h2', x: 'Honest Limits of PDF to Word Conversion' },
    { t: 'p', x: 'A PDF stores where text sits on the page, not real paragraphs or tables, so structure has to be reconstructed — and reconstruction is never perfect. Complex layouts, multi-column pages, tables, headers and footers may need manual editing. Scanned pages contain only pictures of text and cannot be converted because this tool does not use OCR. Images are not included in the Word file.' },
    { t: 'p', x: 'If the original PDF came from a clean, single-column Word document, expect a close match. If it came from a design tool or a scanned page, expect to fix a few things. Plan to proofread headings, tables and lists before relying on the result.' },
    { t: 'h2', x: 'What to Do Next' },
    { t: 'ul', x: [
      ['Finished editing? ', 'Use Word to PDF to turn the edited document back into a fixed-layout PDF.'],
      ['Need to shrink the result? ', 'Use Compress PDF if the DOCX-turned-PDF is too large to upload.'],
      ['PDF is a scan? ', 'Try PDF to JPG instead — you can at least view the images while you retype.'],
    ] },
    { t: 'h2', x: 'Your Files Stay Private' }, priv('Your PDF'), devices,
    { t: 'p', x: 'No sign-up. No watermark. Just an editable Word document, rebuilt on your own device.' },
  ],

  // ─────────────────────────────────────────────────────────────
  'word-to-pdf': [
    { t: 'h2', x: 'Free Online Word to PDF Converter' },
    { t: 'p', x: 'You send a Word file. Someone opens it on a different computer, in a different Word version, and your carefully formatted CV collapses into three misaligned pages. PDF fixes that — the layout is locked, so everyone sees the same document.' },
    { t: 'p', x: 'This tool converts a Word document (DOCX) to a PDF with selectable text. Upload the file, check the preview, choose page size, orientation, margins and font size, and download the PDF.' },
    { t: 'h2', x: 'Why Convert Word to PDF?' },
    { t: 'p', x: 'Three reasons come up again and again:' },
    { t: 'ul', x: [
      ['Applications and CVs: ', 'Many portals ask for PDF files — job boards, exam registrations, college admissions.'],
      ['Sharing: ', 'A PDF opens the same way on every device, in every Word version, in every browser.'],
      ['Printing: ', 'PDFs are convenient to print and archive, without "do you have the right fonts?" surprises.'],
    ] },
    { t: 'h2', x: 'How to Convert Word to PDF Online' },
    { t: 'ol', x: [
      ['Add a DOCX file: ', 'Old .doc files must first be saved as .docx in Word.'],
      ['Check the preview and settings: ', 'Choose A4 or Letter, portrait or landscape, margins and body font size.'],
      ['Convert and download: ', 'Your PDF is created and ready to save.'],
    ] },
    { t: 'p', x: 'A4 is the standard for Indian, UK and most international applications. Use Letter for US applications, and Landscape when you have wide tables or images.' },
    { t: 'h2', x: 'What Is Supported and What Is Not' },
    { t: 'p', x: 'Headings, paragraphs, bold and italic text, lists, tables and embedded images are supported. This is a browser-based reconstruction, not Microsoft Word itself: fonts are replaced with standard PDF fonts, and headers, footers, text boxes and multi-column layouts are not reproduced. Table cells keep their text only. Standard PDF fonts cover Latin characters, and the tool warns you when other characters may not display correctly.' },
    { t: 'p', x: 'In practice: simple documents convert beautifully; complex magazine-style layouts will lose detail. Check the preview before you download if the layout matters.' },
    { t: 'h2', x: 'What to Do Next' },
    { t: 'ul', x: [
      ['PDF too big to upload? ', 'Use Compress PDF to bring it under the portal limit.'],
      ['Combining a CV with certificates? ', 'Use Merge PDF to submit one tidy file.'],
      ['Need to edit the PDF later? ', 'Use PDF to Word to get back an editable version.'],
    ] },
    { t: 'h2', x: 'Your Files Stay Private' }, priv('Your document'), devices,
    { t: 'p', x: 'No sign-up. No watermark. Just a clean, ready-to-send PDF.' },
  ],

  // ─────────────────────────────────────────────────────────────
  'pdf-to-excel': [
    { t: 'h2', x: 'Free Online PDF to Excel Converter' },
    { t: 'p', x: 'You are staring at a 40-row table inside a PDF, wishing you could sum the column in Excel. Here is how to get there without retyping a single row.' },
    { t: 'p', x: 'This tool extracts table data from a text-based PDF into an Excel workbook (XLSX). It looks for table-like blocks, shows you a preview of each, and lets you choose which ones to export as worksheets.' },
    { t: 'h2', x: 'Common Uses' },
    { t: 'ul', x: [
      ['Invoices and statements: ', 'Move rows of figures into a spreadsheet for sorting, filtering and totals.'],
      ['Reports: ', 'Reuse tables without retyping — monthly reports, financial summaries, survey results.'],
      ['Data lists: ', 'Turn price lists, schedules, catalogues and contact lists into editable data.'],
      ['Research: ', 'Pull published tables into a form you can actually analyse.'],
    ] },
    { t: 'h2', x: 'How to Convert PDF to Excel Online' },
    { t: 'ol', x: [
      ['Add a text-based PDF: ', 'Tables are detected automatically.'],
      ['Review the preview: ', 'Select the tables you want and choose whether numbers become Excel numbers.'],
      ['Export: ', 'Download the XLSX file with one worksheet per selected table.'],
    ] },
    { t: 'h2', x: 'Honest Limits of Table Extraction' },
    { t: 'p', x: 'Table detection works from the position of text, so it is a best-effort method. Scanned PDFs, tables drawn as images and layouts without clear column spacing cannot be detected reliably, and merged cells are not supported. When no table is found the tool tells you so, and you can still export all text as a worksheet. Always check the preview before relying on the data.' },
    { t: 'p', x: 'A clean, single-table page converts well. A complex annual report with three tables per page will need more checking — that is the honest trade-off of automated extraction.' },
    { t: 'h2', x: 'What to Do Next' },
    { t: 'ul', x: [
      ['Finished editing in Excel? ', 'Use Excel to PDF to export the cleaned-up data as a shareable PDF.'],
      ['PDF is a scan? ', 'The tables cannot be detected. You would need OCR first, which this tool does not provide.'],
    ] },
    { t: 'h2', x: 'Your Files Stay Private' }, priv('Your PDF'), devices,
    { t: 'p', x: 'No sign-up. No watermark. Just your tables, ready to sort and total.' },
  ],

  // ─────────────────────────────────────────────────────────────
  'excel-to-pdf': [
    { t: 'h2', x: 'Free Online Excel to PDF Converter' },
    { t: 'p', x: 'Excel looks different on every screen — different column widths, different fonts, different row heights. PDF does not. When you need everyone to see the same table, PDF is the answer.' },
    { t: 'p', x: 'This tool converts an Excel spreadsheet (XLS or XLSX) into a PDF. Preview your data, choose one worksheet or all of them, then set orientation, paper size and margins before you export.' },
    { t: 'h2', x: 'Why Convert Excel to PDF?' },
    { t: 'ul', x: [
      ['Sharing: ', 'Send figures that look the same for everyone, regardless of what software they have installed.'],
      ['Printing: ', 'Create print-ready tables with the paper size you need — A4 for local printing, A3 for wide sheets.'],
      ['Records: ', 'Archive reports and schedules as PDF for compliance, HR files or long-term reference.'],
      ['Submissions: ', 'Many invoice portals and government forms accept PDF tables, not XLSX.'],
    ] },
    { t: 'h2', x: 'How to Convert Excel to PDF Online' },
    { t: 'ol', x: [
      ['Add your spreadsheet: ', 'Select an .xls or .xlsx file.'],
      ['Choose settings: ', 'Pick the worksheet, A4, A3, Letter or Legal paper, orientation and margins.'],
      ['Convert and download: ', 'Wide sheets continue on additional pages.'],
    ] },
    { t: 'h2', x: 'What Is Exported' },
    { t: 'p', x: 'Cell values are exported as they are displayed in the file. Charts, images, merged cells and conditional formatting are not reproduced. If a workbook has never been calculated and saved, formula cells may appear empty. Worksheets of up to 10,000 rows are supported.' },
    { t: 'p', x: 'A tip before you convert: open the workbook in Excel once and save it. That calculation step is what makes sure formulas show their values rather than blank cells.' },
    { t: 'h2', x: 'What to Do Next' },
    { t: 'ul', x: [
      ['Need to bring the data back into Excel? ', 'Use PDF to Excel to extract the tables again.'],
      ['PDF too big to email? ', 'Use Compress PDF to shrink it under the attachment limit.'],
      ['Combining with other reports? ', 'Use Merge PDF to build a single PDF pack.'],
    ] },
    { t: 'h2', x: 'Your Files Stay Private' }, priv('Your spreadsheet'), devices,
    { t: 'p', x: 'No sign-up. No watermark. Just a clean, shareable PDF table.' },
  ],

  // ─────────────────────────────────────────────────────────────
  'compress-pdf': [
    { t: 'h2', x: 'Free Online PDF Compressor' },
    { t: 'p', x: 'The portal accepts PDFs up to 200 KB. Your file is 2 MB. This is the tool that gets you under the line — without destroying the document.' },
    { t: 'p', x: 'Reduce the size of a PDF so it is easier to email, upload and store. Choose a target such as 100 KB, 200 KB, 500 KB, 1 MB, 2 MB or 5 MB, enter your own target, or pick Low, Recommended or High compression.' },
    { t: 'h2', x: 'Why Compress a PDF?' },
    { t: 'ul', x: [
      ['Upload limits: ', 'Job, exam and government portals often cap PDF size — SSC, UPSC, Railway, Banking and state recruitment portals are the usual suspects.'],
      ['Email: ', 'Stay under attachment limits so your message actually sends.'],
      ['Storage and sharing: ', 'Smaller files are faster to send, faster to open, and easier to archive.'],
    ] },
    { t: 'h2', x: 'How the Compression Works' },
    { t: 'p', x: 'Most large PDFs are large because of images. The tool recompresses and downsizes JPEG images, can remove document metadata, and rebuilds the file, while text and vector content are left untouched. For a size target, stronger settings are tried step by step until the target is reached or further compression would harm quality.' },
    { t: 'p', x: 'That means a 5 MB certificate of scans might drop to 300 KB without looking noticeably different — because the tool is shrinking the scan images, not blurring the text.' },
    { t: 'h2', x: 'How to Compress a PDF Online' },
    { t: 'ol', x: [
      ['Add your PDF: ', 'The original size is shown right away.'],
      ['Choose a target or level: ', 'An estimate of the output size is shown when available.'],
      ['Compress and compare: ', 'See the final size, the space saved and the percentage reduction, preview both versions, then download.'],
    ] },
    { t: 'h2', x: 'Which Level Should You Pick?' },
    { t: 'p', x: 'If you just want a smaller file to email, Recommended is usually the right choice. If a portal specifies a hard target (200 KB, 500 KB), enter that number directly. Use Low only when the file is mostly images and you can afford some quality loss, and use High only when the target is critical and you have checked the result.' },
    { t: 'h2', x: 'Target Sizes Are Goals, Not Guarantees' },
    { t: 'p', x: 'A PDF made mostly of text and vector graphics is already small, and cannot be shrunk a lot without damaging it. If your target cannot be reached, the tool shows the actual size and explains why. As a last resort you can allow pages to be converted to images, which can make files much smaller but makes the text unselectable. This only happens if you switch it on. Actual file size may vary depending on the original PDF content.' },
    { t: 'h2', x: 'What to Do Next' },
    { t: 'ul', x: [
      ['Still too big, and you have several documents? ', 'Use Split PDF to send only the pages you need, or Merge PDF to combine them into one smaller pack.'],
      ['Need to convert pages to images for a portal? ', 'Use PDF to JPG.'],
    ] },
    { t: 'h2', x: 'Your Files Stay Private' }, priv('Your PDF'), devices,
    { t: 'p', x: 'No sign-up. No watermark. Just a smaller file that still opens the way it should.' },
  ],

  // ─────────────────────────────────────────────────────────────
  'merge-pdf': [
    { t: 'h2', x: 'Free Online PDF Merger' },
    { t: 'p', x: 'Your application portal has one upload field. You have twelve documents — marksheets, certificates, an ID proof, a photograph. Merge them.' },
    { t: 'p', x: 'Combine several PDF files into a single document. Add your files, drag them into the right order, remove any you do not need, and merge them with one click.' },
    { t: 'h2', x: 'Why Merge PDF Files?' },
    { t: 'ul', x: [
      ['Applications: ', 'Submit certificates, forms and identity documents as one file — a requirement on many SSC, UPSC, Railway, Banking, college admission and scholarship portals.'],
      ['Reports: ', 'Join chapters or sections written separately into one final document.'],
      ['Invoices and records: ', 'Keep related documents together for archiving or sending to clients.'],
      ['Project packs: ', 'Combine a cover sheet, body, and appendix without emailing three attachments.'],
    ] },
    { t: 'h2', x: 'How to Merge PDF Files Online' },
    { t: 'ol', x: [
      ['Add your PDFs: ', 'Select two or more files. Page counts and first-page previews are shown.'],
      ['Set the order: ', 'Drag files, or use the arrow buttons, then remove anything you do not need.'],
      ['Merge and download: ', 'Download the combined PDF.'],
    ] },
    { t: 'h2', x: 'Good to Know' },
    { t: 'p', x: 'Password-protected files must be unlocked first, and corrupted files are detected and reported. Pages are copied into the new document; bookmarks and form fields from the original files may not be preserved. You can merge up to 30 files of 100 MB each, depending on your device memory.' },
    { t: 'p', x: 'A tip that saves retries: merge first, then compress. Compressing each file individually and then merging them usually produces a bigger result than merging and compressing once at the end.' },
    { t: 'h2', x: 'What to Do Next' },
    { t: 'ul', x: [
      ['Merged file too large? ', 'Use Compress PDF on the combined result.'],
      ['Only want a few pages? ', 'Use Split PDF to extract just the pages you need before merging.'],
      ['Adding a password before sending? ', 'Use Protect PDF on the final document.'],
    ] },
    { t: 'h2', x: 'Your Files Stay Private' }, priv('Your PDF'), devices,
    { t: 'p', x: 'No sign-up. No watermark. Just one tidy PDF instead of a dozen attachments.' },
  ],

  // ─────────────────────────────────────────────────────────────
  'split-pdf': [
    { t: 'h2', x: 'Free Online PDF Splitter' },
    { t: 'p', x: 'A 200-page handbook, and you only need pages 47 to 52. A certificate bundle where you need one page. A large report you must email in parts. Split it.' },
    { t: 'p', x: 'Split a PDF into separate files or extract just the pages you need. Pick pages visually from thumbnails, type page ranges, or split every page into its own PDF, then download the results one by one or as a ZIP.' },
    { t: 'h2', x: 'Why Split a PDF?' },
    { t: 'ul', x: [
      ['Extract pages: ', 'Keep only the pages you want to share — a certificate, one chapter, a single signed page.'],
      ['Separate sections: ', 'Break a large document into chapters, or split a scanned bundle into individual certificates.'],
      ['Meet upload limits: ', 'Send a long document in smaller parts when a portal caps the file size.'],
      ['Privacy: ', 'Share only the pages a recipient needs, not the whole document.'],
    ] },
    { t: 'h2', x: 'Three Ways to Split' },
    { t: 'ul', x: [
      ['Extract selected pages: ', 'Choose pages in the grid or type ranges, and get one PDF.'],
      ['Split by ranges: ', 'Enter ranges such as 1-3, 5, 8-10 to get one PDF per range.'],
      ['Split every page: ', 'Create one PDF for each page — useful when you have scanned several certificates into one file.'],
    ] },
    { t: 'h2', x: 'How to Split a PDF Online' },
    { t: 'ol', x: [
      ['Add your PDF: ', 'The page count and thumbnails appear.'],
      ['Choose a mode and pages: ', 'Use the grid or type page numbers; page numbers start at 1.'],
      ['Split and download: ', 'Your original file is never changed.'],
    ] },
    { t: 'p', x: 'PDFs of up to 500 pages and 100 MB are supported.' },
    { t: 'h2', x: 'What to Do Next' },
    { t: 'ul', x: [
      ['Combining files again? ', 'Use Merge PDF to rejoin the pieces into a single PDF.'],
      ['Single page too large? ', 'Use Compress PDF on the extracted file.'],
      ['Need the pages as images? ', 'Use PDF to JPG to convert them.'],
    ] },
    { t: 'h2', x: 'Your Files Stay Private' }, priv('Your PDF'), devices,
    { t: 'p', x: 'No sign-up. No watermark. Just the pages you need, in the order you want.' },
  ],

  // ─────────────────────────────────────────────────────────────
  'protect-pdf': [
    { t: 'h2', x: 'Free Online PDF Password Protection' },
    { t: 'p', x: 'You are about to attach a passport scan, a salary slip or a medical record to an email. Would you post the same document in an unopened envelope? That is what an unprotected PDF is — anyone who receives it (or any server it passes through) can read it in full.' },
    { t: 'p', x: 'Add a password to a PDF so it cannot be opened without it. Enter and confirm a password, see its strength, choose optional permission restrictions and download the protected file.' },
    { t: 'h2', x: 'Why Protect a PDF?' },
    { t: 'ul', x: [
      ['Sensitive documents: ', 'Protect contracts, statements, salary slips, medical reports and personal records before sharing.'],
      ['Email: ', 'Add a layer of protection to attachments, especially when sharing with someone outside your organisation.'],
      ['Archives: ', 'Keep stored documents from being opened casually on a shared computer.'],
      ['Client work: ', 'Send draft or confidential files with the confidence that only the intended recipient can open them.'],
    ] },
    { t: 'h2', x: 'Password vs. Permissions' },
    { t: 'p', x: 'The open password encrypts the file, so it cannot be read without the password. Permission restrictions for printing, copying and editing are different: they are flags that well-behaved PDF viewers respect, but some software ignores them, so they are not a security barrier on their own.' },
    { t: 'p', x: 'In plain terms: the open password is the lock. Permissions are the polite note on the door. Use both, but trust the lock.' },
    { t: 'h2', x: 'How to Protect a PDF Online' },
    { t: 'ol', x: [
      ['Add a PDF: ', 'Files that are already password-protected must be unlocked first.'],
      ['Set a password: ', 'Use at least 8 characters; longer passwords with mixed characters are stronger.'],
      ['Encrypt and verify: ', 'The tool reopens the result to confirm it requires the password before offering the download.'],
    ] },
    { t: 'p', x: 'Keep your password safe. It cannot be recovered, so keep an unprotected copy of the original somewhere secure. Test the protected file in the PDF viewer your recipients use.' },
    { t: 'h2', x: 'What to Do Next' },
    { t: 'ul', x: [
      ['Sharing only certain pages? ', 'Use Split PDF to extract them first, then protect the extracted file.'],
      ['Combining with other documents? ', 'Use Merge PDF, then protect the merged result.'],
      ['Too large to email? ', 'Use Compress PDF before protecting — the protected file will be smaller too.'],
    ] },
    { t: 'h2', x: 'Your Password and Files Stay Private' },
    { t: 'p', x: 'Encryption happens inside your web browser. Neither your PDF nor your password is sent to our servers or to any third party. Close the tab and both are gone from the page.' },
    devices,
    { t: 'p', x: 'No sign-up. No watermark. Just a locked file, ready to send with confidence.' },
  ],
};