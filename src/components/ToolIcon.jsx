import { ArrowRight, Layers, Files, Scissors, Lock } from 'lucide-react';

const BADGES = {
  pdf: { bg: '#E50914', label: 'PDF', small: true },
  word: { bg: '#2B6CE6', label: 'W' },
  excel: { bg: '#1E9E55', label: 'X' },
  jpg: { bg: '#F5A623', label: 'JPG', small: true },
  png: { bg: '#8B5CF6', label: 'PNG', small: true },
};

function Badge({ type }) {
  const b = BADGES[type];
  return (
    <span className={`doc-badge${b.small ? ' small' : ''}`} style={{ background: b.bg }} aria-hidden="true">{b.label}</span>
  );
}

const PAIRS = {
  'pdf-to-jpg': ['pdf', 'jpg'],
  'jpg-to-pdf': ['jpg', 'pdf'],
  'word-to-pdf': ['word', 'pdf'],
  'pdf-to-word': ['pdf', 'word'],
  'excel-to-pdf': ['excel', 'pdf'],
  'pdf-to-excel': ['pdf', 'excel'],
};
const SINGLE = {
  'compress-pdf': [Layers, '#8B5CF6'],
  'merge-pdf': [Files, '#2B6CE6'],
  'split-pdf': [Scissors, '#F97316'],
  'protect-pdf': [Lock, '#E50914'],
};

export default function ToolIcon({ id }) {
  if (PAIRS[id]) {
    const [a, b] = PAIRS[id];
    return (
      <span className="tool-icon" aria-hidden="true">
        <Badge type={a} /><ArrowRight size={16} /><Badge type={b} />
      </span>
    );
  }
  const [Icon, color] = SINGLE[id];
  return (
    <span className="tool-icon" aria-hidden="true">
      <Icon size={38} color={color} strokeWidth={2.2} />
    </span>
  );
}
