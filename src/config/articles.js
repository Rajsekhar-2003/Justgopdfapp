// Long-form SEO content per tool. Block types: h2, h3, p, ul, ol.
import { MORE } from './articlesMore.js';

const BASE = {
  'jpg-to-pdf': [
    { t: 'h2', x: 'Free Online JPG to PDF Converter' },
    { t: 'p', x: 'Turn a folder of photos, scanned documents or screenshots into a single tidy PDF — free, in your browser, and without an account. Add your JPG images, arrange them in the order you need, click Convert to PDF, and download the result. No software to install, no login, and no watermark.' },
    { t: 'p', x: 'If you have ever stared at an application portal that only accepts PDF — when all your documents are photographs — you already know why this tool exists. JustGoPDF was built for that exact moment, and for the students, job applicants, teachers and professionals who hit it every week.' },

    { t: 'h2', x: 'Combine Multiple JPG Images into One PDF' },
    { t: 'p', x: 'Add one or many JPG, JPEG or PNG images, arrange them in your preferred order, and create a single PDF document. Instead of making a separate PDF for every image, you can combine all your selected images into one organized file.' },
    { t: 'p', x: 'That is the difference between submitting a chaotic folder of scan_001.jpg, scan_002.jpg and scan_003.jpg — and submitting one clean document with a name you can be proud of.' },

    { t: 'h2', x: 'Why Convert JPG to PDF?' },
    { t: 'p', x: 'Converting images into PDF documents solves a surprising number of everyday problems:' },
    { t: 'ul', x: [
      ['Government job applications: ', 'Combine scanned certificates, photographs and mark sheets into a PDF when an application portal requires PDF documents.'],
      ['Competitive exams: ', 'Prepare educational certificates and supporting documents for online examination registration — SSC, UPSC, Railway, Banking and state recruitment.'],
      ['College and university admissions: ', 'Submit scanned mark sheets, transfer certificates and identity documents as one organized PDF.'],
      ['Scholarships: ', 'Bundle income certificates, mark sheets and identity proof into a single upload-ready file.'],
      ['Education: ', 'Convert handwritten notes, assignments and classroom materials into PDF files.'],
      ['Office work: ', 'Combine scanned documents, receipts and business records into a single PDF.'],
      ['Document sharing: ', 'Share multiple images as one organized PDF through email and messaging apps.'],
      ['Printing: ', 'Arrange multiple images in a PDF for convenient printing.'],
    ] },

    { t: 'h2', x: 'How to Convert JPG to PDF Online' },
    { t: 'p', x: 'Converting your images into a PDF file is simple. Three steps, no sign-up, no waiting:' },
    { t: 'ol', x: [
      ['Add your images: ', 'Select one or more JPG, JPEG or PNG images from your computer, tablet or smartphone.'],
      ['Arrange and convert: ', 'Organize your images in your preferred order, choose your page settings, and click Convert to PDF.'],
      ['Download your PDF: ', 'When the conversion is complete, download your new PDF document to your device.'],
    ] },
    { t: 'p', x: 'That is it. Your images are now combined into a single PDF file — and because everything happens in your browser, nothing was sent to a server along the way.' },

    { t: 'h2', x: 'Customize Your PDF Page Settings' },
    { t: 'p', x: 'Create PDF documents that match your requirements with these page settings:' },
    { t: 'ul', x: [
      ['Page size: ', 'Choose A4, Letter, or Fit to image. Use A4 for Indian, UK and most international applications; Letter for US applications; Fit to image if you want no white borders around your photos.'],
      ['Orientation: ', 'Select Portrait or Landscape. Portrait is standard for documents; landscape suits wide photographs or ID cards laid side by side.'],
      ['Margins: ', 'Choose no margin or a small, medium or large margin. Passport photos usually look best with a small margin.'],
      ['Image order: ', 'Drag images, or use the arrows on touch screens, to set the page order before you create your PDF.'],
    ] },

    { t: 'h2', x: 'Your Images Stay Private' },
    { t: 'p', x: 'The PDF is created inside your web browser, on your own device. Your images are not uploaded to our servers, which keeps scanned certificates, photographs and other personal documents private. Close the tab and the working files are gone — nothing is stored permanently.' },
    { t: 'p', x: 'You can add JPG, JPEG and PNG files up to 20 MB each, which covers everything from a passport photo to a full-page scan at high resolution.' },

    { t: 'h2', x: 'Works on Different Operating Systems' },
    { t: 'p', x: 'Our online JPG to PDF converter runs in your web browser, so you do not need to install additional software. You can use it on:' },
    { t: 'ul', x: ['Windows', 'macOS', 'Linux', 'Android', 'iPhone and iPad'] },
    { t: 'p', x: 'Whether you are using a desktop computer, laptop, tablet or smartphone, you can convert images into PDF documents whenever you need to. The interface is responsive and works in light or dark mode.' },

    { t: 'h2', x: 'What to Do with Your PDF Next' },
    { t: 'p', x: 'Once your images are in a PDF, a couple of other JustGoPDF tools often come in handy:' },
    { t: 'ul', x: [
      ['Too big to upload? ', 'Use Compress PDF to reduce the file size to a target such as 100 KB, 200 KB, 500 KB or 1 MB, depending on what the portal accepts.'],
      ['Multiple certificates? ', 'Use Merge PDF to combine several JPG-to-PDF results — for example, marksheets and a passport photo — into one final submission file.'],
      ['Need just one page? ', 'Use Split PDF to extract only the pages a particular application requires.'],
    ] },

    { t: 'h2', x: 'Free, Fast, and Easy to Use' },
    { t: 'p', x: 'Enjoy a simple interface, convenient downloads and an easy conversion process — without registration, without a watermark, and without a complicated workflow. Start converting your JPG images into PDF documents today.' },
  ],
};

export const ARTICLES = { ...MORE, ...BASE };