import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const AllTools = lazy(() => import('./pages/AllTools.jsx'));
const FreePdfToolsGuide = lazy(() => import('./pages/FreePdfToolsGuide.jsx'));
const named = (name) => lazy(() => import('./pages/StaticPages.jsx').then((m) => ({ default: m[name] })));
const About = named('About'); const Contact = named('Contact'); const Blog = named('Blog');
const Privacy = named('Privacy'); const Terms = named('Terms'); const Disclaimer = named('Disclaimer');
const FaqPage = named('FaqPage'); const NotFound = named('NotFound');

const TOOLS = {
  'pdf-to-jpg': lazy(() => import('./tools/PdfToJpg.jsx')),
  'jpg-to-pdf': lazy(() => import('./tools/JpgToPdf.jsx')),
  'pdf-to-word': lazy(() => import('./tools/PdfToWord.jsx')),
  'word-to-pdf': lazy(() => import('./tools/WordToPdf.jsx')),
  'pdf-to-excel': lazy(() => import('./tools/PdfToExcel.jsx')),
  'excel-to-pdf': lazy(() => import('./tools/ExcelToPdf.jsx')),
  'compress-pdf': lazy(() => import('./tools/CompressPdf.jsx')),
  'merge-pdf': lazy(() => import('./tools/MergePdf.jsx')),
  'split-pdf': lazy(() => import('./tools/SplitPdf.jsx')),
  'protect-pdf': lazy(() => import('./tools/ProtectPdf.jsx')),
};

const Loading = () => <div className="container py-5 text-center" role="status"><div className="spinner-border text-danger" /><span className="visually-hidden">Loading…</span></div>;

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="all-tools" element={<AllTools />} />
            {Object.entries(TOOLS).map(([path, C]) => <Route key={path} path={path} element={<C />} />)}

            {/* Guide page */}
            <Route path="free-online-pdf-tools" element={<FreePdfToolsGuide />} />

            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="blog" element={<Blog />} />
            <Route path="privacy-policy" element={<Privacy />} />
            <Route path="terms-and-conditions" element={<Terms />} />
            <Route path="disclaimer" element={<Disclaimer />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}