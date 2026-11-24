import { Link } from 'react-router-dom';
import ToolIcon from './ToolIcon.jsx';

export default function ToolCard({ tool }) {
  return (
    <Link to={tool.path} className="tool-card" aria-label={`${tool.name}: ${tool.short}`}>
      <ToolIcon id={tool.id} />
      <span className="tool-card-name">{tool.name}</span>
      <span className="tool-card-desc">{tool.short}</span>
    </Link>
  );
}
