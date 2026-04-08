import React from 'react';
import { formatDateShort } from '../../utils/dateUtils';
import './index.css';

const NoteCard = ({ note, isActive, onClick, isHighlighted }) => {
  const { title, description, start, end } = note;
  
  const dateStr = end 
    ? `${formatDateShort(new Date(start))} – ${formatDateShort(new Date(end))}`
    : formatDateShort(new Date(start));

  return (
    <div 
      className={`note-card ${isActive ? 'active' : ''} ${isHighlighted ? 'highlighted' : ''}`} 
      onClick={onClick}
    >
      <span className="note-date">{dateStr}</span>
      {title && <h4 className="note-title">{title}</h4>}
      <p className="note-desc">{description}</p>
    </div>
  );
};

export default NoteCard;
