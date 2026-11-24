import { Link } from 'react-router-dom';

export function LogoMark({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill="#E50914" />
      <path d="M17 9h22l10 10v36H17z" fill="#fff" />
      <path d="M39 9v10h10z" fill="#FFC9CD" />
      <rect x="12" y="30" width="40" height="17" rx="4" fill="#C90012" />
      <text x="32" y="43" fontFamily="Plus Jakarta Sans Variable, Arial, sans-serif" fontWeight="800" fontSize="12" textAnchor="middle" fill="#fff">PDF</text>
    </svg>
  );
}

export default function Logo({ showTagline = true }) {
  return (
    <Link to="/" className="logo" aria-label="JustGoPDF – home">
      <LogoMark />
      <span className="logo-text">
        <span className="logo-word">Just<wbr />Go<span className="text-red">PDF</span></span>
        {showTagline && <span className="logo-tag">All-in-One Online PDF Tools</span>}
      </span>
    </Link>
  );
}
