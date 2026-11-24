import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from 'lucide-react';

/** Drag-and-drop reorderable list with keyboard-accessible move buttons. */
export default function SortableList({ items, onChange, renderItem, onRemove, disabled, label }) {
  const dragIndex = useRef(null);
  const [over, setOver] = useState(null);
  const move = (from, to) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = items.slice();
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    onChange(next);
  };
  return (
    <ul className="sortable" aria-label={label}>
      {items.map((it, i) => (
        <li
          key={it.id}
          className={`sortable-item${over === i ? ' over' : ''}`}
          draggable={!disabled}
          onDragStart={(e) => { dragIndex.current = i; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); }}
          onDragOver={(e) => { e.preventDefault(); setOver(i); }}
          onDragLeave={() => setOver(null)}
          onDrop={(e) => { e.preventDefault(); setOver(null); if (dragIndex.current !== null) move(dragIndex.current, i); dragIndex.current = null; }}
          onDragEnd={() => { setOver(null); dragIndex.current = null; }}
        >
          <GripVertical size={18} className="text-muted grip" aria-hidden="true" />
          <div className="flex-grow-1 min-w-0 d-flex align-items-center gap-3">{renderItem(it, i)}</div>
          <div className="d-flex gap-1">
            <button type="button" className="icon-btn" disabled={disabled || i === 0} onClick={() => move(i, i - 1)} aria-label={`Move item ${i + 1} up`}><ArrowUp size={16} /></button>
            <button type="button" className="icon-btn" disabled={disabled || i === items.length - 1} onClick={() => move(i, i + 1)} aria-label={`Move item ${i + 1} down`}><ArrowDown size={16} /></button>
            <button type="button" className="icon-btn" disabled={disabled} onClick={() => onRemove(it)} aria-label={`Remove item ${i + 1}`}><Trash2 size={16} /></button>
          </div>
        </li>
      ))}
    </ul>
  );
}
