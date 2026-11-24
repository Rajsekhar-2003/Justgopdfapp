export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 400" role="img" aria-label="Illustration of a laptop showing a PDF surrounded by Word, Excel and image file icons" className="hero-art">
      <defs>
        <linearGradient id="scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF8A91" /><stop offset="1" stopColor="#F2535C" /></linearGradient>
        <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#E50914" floodOpacity=".18" /></filter>
      </defs>
      <ellipse cx="270" cy="210" rx="210" ry="170" fill="#FFE3E6" opacity=".7" />
      <g fill="none" stroke="#F2535C" strokeWidth="2" strokeLinecap="round">
        <path d="M205 62 Q262 40 318 62" /><path d="M318 62 l-8 -6 M318 62 l-9 5" />
        <path d="M430 105 Q450 140 440 170" /><path d="M440 170 l-7 -7 M440 170 l-10 3" />
        <path d="M110 150 Q125 100 160 80" /><path d="M118 300 Q90 270 92 235" />
        <path d="M430 330 Q455 310 462 280" />
      </g>
      <g filter="url(#sh)">
        <rect x="155" y="120" width="230" height="150" rx="10" fill="#1F2937" transform="rotate(-3 270 195)" />
        <rect x="165" y="130" width="210" height="130" rx="4" fill="url(#scr)" transform="rotate(-3 270 195)" />
        <path d="M120 292 H420 L405 306 H135 Z" fill="#B8C4D9" />
        <rect x="120" y="288" width="300" height="6" rx="3" fill="#97A6C0" />
      </g>
      <g transform="rotate(-3 270 195)">
        <path d="M225 100 h70 l35 35 v95 a8 8 0 0 1 -8 8 h-89 a8 8 0 0 1 -8 -8 v-122 a8 8 0 0 1 8 -8z" fill="#fff" />
        <path d="M295 100 v35 h35z" fill="#FFD3D6" />
        <rect x="240" y="125" width="40" height="5" rx="2.5" fill="#E2E8F0" /><rect x="240" y="138" width="55" height="5" rx="2.5" fill="#E2E8F0" />
        <rect x="232" y="185" width="86" height="34" rx="7" fill="#E50914" />
        <text x="275" y="210" textAnchor="middle" fontWeight="800" fontSize="22" fill="#fff" fontFamily="Plus Jakarta Sans Variable, Arial, sans-serif">PDF</text>
      </g>
      <g filter="url(#sh)">
        <rect x="150" y="20" width="72" height="72" rx="20" fill="#fff" /><rect x="168" y="38" width="38" height="38" rx="7" fill="#2B6CE6" />
        <text x="187" y="66" textAnchor="middle" fontWeight="800" fontSize="24" fill="#fff" fontFamily="Arial,sans-serif">W</text>
        <rect x="372" y="20" width="72" height="72" rx="20" fill="#fff" /><rect x="390" y="38" width="38" height="38" rx="7" fill="#1E9E55" />
        <text x="409" y="66" textAnchor="middle" fontWeight="800" fontSize="24" fill="#fff" fontFamily="Arial,sans-serif">X</text>
        <rect x="40" y="130" width="72" height="72" rx="20" fill="#fff" /><rect x="56" y="146" width="40" height="40" rx="8" fill="#F5A623" />
        <path d="M60 178 l10 -12 9 9 6 -6 10 9z" fill="#fff" /><circle cx="84" cy="158" r="4" fill="#fff" />
        <rect x="430" y="210" width="72" height="72" rx="20" fill="#fff" /><rect x="446" y="226" width="40" height="40" rx="8" fill="#8B5CF6" />
        <path d="M450 258 l10 -12 9 9 6 -6 10 9z" fill="#fff" /><circle cx="474" cy="238" r="4" fill="#fff" />
      </g>
    </svg>
  );
}
