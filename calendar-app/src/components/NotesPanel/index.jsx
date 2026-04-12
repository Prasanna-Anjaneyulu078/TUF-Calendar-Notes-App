import React, { useMemo } from 'react';
import NoteCard from '../NoteCard';
import './index.css';

const NotesPanel = ({ 
  notes, 
  onNoteClick, 
  activeNoteId, 
  isMobileOpen, 
  onCloseMobile,
  activeFilter,
  onFilterChange,
  currentMonth,
  currentYear
}) => {
  const filteredNotes = useMemo(() => {
    if (activeFilter === 'all') return notes;
    
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);

    return notes.filter(note => {
      const noteStart = note.start;
      const noteEnd = note.end ? note.end : note.start;

      return !(noteEnd < monthStart || noteStart > monthEnd);
    });
  }, [notes, activeFilter, currentMonth, currentYear]);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`notes-mobile-overlay ${isMobileOpen ? 'open' : ''}`} 
        onClick={onCloseMobile}
      ></div>
      
      <div className={`notes-panel ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="notes-mobile-handle" onClick={onCloseMobile}></div>
        
        <div className="notes-header">
          <div className="notes-title-container">
            <span className="material-symbols-outlined notes-icon">edit_note</span>
            <h2 className="notes-title">Notes</h2>
          </div>
          <div className="notes-actions">
            <button className="close-mobile-btn" onClick={onCloseMobile}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="notes-filter-tabs">
          <button 
            className={`filter-tab ${activeFilter === 'month' ? 'active' : ''}`}
            onClick={() => onFilterChange('month')}
          >
            This Month
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All Notes
          </button>
        </div>
        
        <div className="notes-list">
          {filteredNotes.length === 0 ? (
            <div className="empty-note">
              <p>{activeFilter === 'month' ? 'No notes for this month.' : 'No notes added yet.'}</p>
            </div>
          ) : (
            filteredNotes.map(note => {
              const noteStart = note.start;
              const noteEnd = note.end ? note.end : note.start;
              const monthStart = new Date(currentYear, currentMonth, 1);
              const monthEnd = new Date(currentYear, currentMonth + 1, 0);
              const isCurrentMonth = !(noteEnd < monthStart || noteStart > monthEnd);
              
              return (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  isActive={activeNoteId === note.id}
                  onClick={() => onNoteClick(note)}
                  isHighlighted={activeFilter === 'all' && isCurrentMonth}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default NotesPanel;
