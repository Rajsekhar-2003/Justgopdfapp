import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import Logo from './Logo.jsx';
import { TOOLS } from '../config/toolsData.js';
import { initAnalytics, trackPageView } from '../lib/analytics.js';

const CREATOR_EMAIL = 'maityrajsekhar210@gmail.com';

const NAV = [
  ['/', 'Home'],
  ['/all-tools', 'All PDF Tools'],
  ['/jpg-to-pdf', 'JPG to PDF'],
  ['/compress-pdf', 'Compress PDF'],
  ['/merge-pdf', 'Merge PDF'],
  ['/word-to-pdf', 'Word to PDF'],
  ['/blog', 'Blog'],
];

function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-bs-theme') || 'light'
  );

  const apply = (next) => {
    setTheme(next);
    document.documentElement.setAttribute('data-bs-theme', next);
    try { localStorage.setItem('jgp-theme', next); } catch { /* storage unavailable */ }
  };

  const toggle = () => apply(theme === 'dark' ? 'light' : 'dark');

  // Keep the toggle in sync if another tab changes the theme.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== 'jgp-theme') return;
      const next = e.newValue === 'dark' ? 'dark' : 'light';
      setTheme(next);
      document.documentElement.setAttribute('data-bs-theme', next);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <button
      type="button"
      className="icon-btn theme-btn"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close menu on route change.
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Prevent background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container d-flex align-items-center justify-content-between gap-3">
        <Logo />
        <nav
          className={`main-nav${open ? ' open' : ''}`}
          aria-label="Main navigation"
          id="main-nav"
        >
          {NAV.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
          ))}
        </nav>
        <div className="d-flex align-items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn menu-btn"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const popular = TOOLS.filter((t) => t.popular);
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <Logo />
            <p className="mt-3 small text-muted">
              Free online PDF tools that run in your browser. Convert, compress, merge, split and protect
              PDF files without registration — your files never leave your device.
            </p>
          </div>

          <nav className="col-6 col-lg-3" aria-label="All PDF tools">
            <h2 className="foot-h">All PDF Tools</h2>
            <ul>{TOOLS.map((t) => <li key={t.id}><Link to={t.path}>{t.name}</Link></li>)}</ul>
          </nav>

          <nav className="col-6 col-lg-2" aria-label="Popular tools">
            <h2 className="foot-h">Popular Tools</h2>
            <ul>{popular.map((t) => <li key={t.id}><Link to={t.path}>{t.name}</Link></li>)}</ul>
          </nav>

          <nav className="col-12 col-lg-3" aria-label="Company">
            <h2 className="foot-h">Company</h2>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/free-online-pdf-tools">PDF Tools Guide</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions">Terms and Conditions</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </nav>
        </div>

        <p className="copy">
          © {new Date().getFullYear()} JustGoPDF. All rights reserved.
        </p>
        <p className="copy small mb-0">
          Built with care by an{' '}
          <a href={`mailto:${CREATOR_EMAIL}`}>Omebox member</a>.
        </p>
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const main = useRef(null);

  useEffect(() => { initAnalytics(); }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname);
  }, [pathname]);

  return (
    <>
      <a href="#content" className="skip-link">Skip to content</a>
      <Header />
      <main id="content" ref={main} tabIndex={-1}><Outlet /></main>
      <Footer />
    </>
  );
}