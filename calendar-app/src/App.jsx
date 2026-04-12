import React, { useState, useEffect } from 'react';
import Banner from './components/Banner';
import NotesPanel from './components/NotesPanel';
import Calendar from './components/Calendar';
import NoteModal from './components/NoteModal';
import { getThemeForMonth, applyTheme } from './utils/themeUtils';
import { isSameDay } from './utils/dateUtils';
import './styles/global.css';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [notes, setNotes] = useState(() => {
    try {
      const savedNotes = localStorage.getItem('calendarNotes');
      if (!savedNotes) return [];

      const parsedNotes = JSON.parse(savedNotes);
      return parsedNotes.map(n => ({
        ...n,
        start: new Date(n.start),
        end: n.end ? new Date(n.end) : null
      }));
    } catch (e) {
      console.error('Failed to parse notes', e);
      return [];
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('month');
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const showToast = (message, type = 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2500);
  };

  // Save notes to local storage when changed
  useEffect(() => {
    localStorage.setItem('calendarNotes', JSON.stringify(notes));
  }, [notes]);

  // Apply theme when month changes
  useEffect(() => {
    const theme = getThemeForMonth(currentDate.getMonth());
    applyTheme(theme.color);
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickedDate = new Date(date);
    clickedDate.setHours(0, 0, 0, 0);

    if (clickedDate < today) {
      showToast("Cannot select past dates", "error");
      return;
    }

    setActiveNoteId(null); // Clear active note when selecting new dates
    
    setSelectedRange(prev => {
      let newRange;
      
      // If nothing selected or both selected, start new range
      if (!prev.start || (prev.start && prev.end)) {
        newRange = { start: date, end: null };
      }
      // If clicking the same start date, clear selection
      else if (isSameDay(prev.start, date)) {
        newRange = { start: null, end: null };
      }
      // If end date is before start date, swap them
      else if (date < prev.start) {
        // This case shouldn't happen with future restriction but keeping for robustness
        newRange = { start: date, end: prev.start };
      }
      // Normal case: set end date
      else {
        newRange = { ...prev, end: date };
      }
      
      // Validate date range (no past dates)
      if (newRange.start && newRange.end) {
        if (newRange.start < today || newRange.end < today) {
          showToast("Date range cannot include past dates", "error");
          return { start: null, end: null };
        }
        // Auto-open modal when both dates are selected
        setTimeout(() => setIsModalOpen(true), 50);
      }
      
      return newRange;
    });
  };

  const handleAddNoteClick = () => {
    // Use today as default if no dates selected
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const rangeToCheck = selectedRange.start ? selectedRange : { start: today, end: null };
    
    // Check for duplicate before opening modal
    const duplicate = notes.find(n => 
      isSameDay(n.start, rangeToCheck.start) && 
      ((!n.end && !rangeToCheck.end) || (n.end && rangeToCheck.end && isSameDay(n.end, rangeToCheck.end)))
    );
    
    if (duplicate) {
      setNoteToEdit(duplicate);
    } else {
      setNoteToEdit(null);
    }
    setIsModalOpen(true);
  };

  const handleSaveNote = (newNote) => {
    if (!newNote.start) return;

    const newStart = new Date(newNote.start).setHours(0, 0, 0, 0);
    const newEnd = newNote.end ? new Date(newNote.end).setHours(0, 0, 0, 0) : newStart;

    setNotes(prev => {
      // Check for exact match (same range)
      const exactMatchIndex = prev.findIndex(n => {
        const nStart = new Date(n.start).setHours(0, 0, 0, 0);
        const nEnd = n.end ? new Date(n.end).setHours(0, 0, 0, 0) : nStart;
        return nStart === newStart && nEnd === newEnd;
      });

      if (exactMatchIndex !== -1) {
        const existingNote = prev[exactMatchIndex];
        if (existingNote.title === newNote.title && existingNote.description === newNote.description) {
          showToast("Duplicate note already exists", "warning");
          return prev;
        } else {
          const updated = [...prev];
          updated[exactMatchIndex] = { ...newNote, id: existingNote.id };
          showToast("Existing note updated", "success");
          return updated.sort((a, b) => a.start - b.start);
        }
      }

      // Check for overlap
      const overlappingNote = prev.find(n => {
        const nStart = new Date(n.start).setHours(0, 0, 0, 0);
        const nEnd = n.end ? new Date(n.end).setHours(0, 0, 0, 0) : nStart;
        return newStart <= nEnd && newEnd >= nStart;
      });

      if (overlappingNote) {
        // Automatic update for overlap as per "Smart" logic instruction
        const updated = prev.filter(n => n.id !== overlappingNote.id);
        showToast("Overlapping note exists. Updating...", "warning");
        return [...updated, newNote].sort((a, b) => a.start - b.start);
      }

      // Normal save
      showToast("Note saved successfully", "success");
      return [...prev, newNote].sort((a, b) => a.start - b.start);
    });

    // Clear selection after saving
    setSelectedRange({ start: null, end: null });
    setNoteToEdit(null);
  };

  const handleNoteClick = (note) => {
    if (activeNoteId === note.id) {
      setActiveNoteId(null);
    } else {
      setActiveNoteId(note.id);
    }
  };

  const currentTheme = getThemeForMonth(currentDate.getMonth());
  
  // Determine which range to show on calendar
  const activeNote = notes.find(n => n.id === activeNoteId);
  const activeNoteRange = activeNote ? { 
    start: activeNote.start, 
    end: activeNote.end || activeNote.start 
  } : null;

  return (
    <div className="app-container">
      <div className="spiral-binder">
        <div className="spiral-holes">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="spiral-hole"></div>
          ))}
        </div>
      </div>
      
      <Banner key={currentTheme.banner} theme={currentTheme} />
      
      <div className="main-layout">
        <NotesPanel 
          notes={notes} 
          onNoteClick={handleNoteClick}
          activeNoteId={activeNoteId}
          isMobileOpen={isNotesOpen}
          onCloseMobile={() => setIsNotesOpen(false)}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          currentMonth={currentDate.getMonth()}
          currentYear={currentDate.getFullYear()}
        />
        
        <Calendar 
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          selectedRange={selectedRange}
          onDateClick={handleDateClick}
          activeNoteRange={activeNoteRange}
          onAddClick={handleAddNoteClick}
        />
      </div>

      {/* Floating Notes Button for Mobile */}
      <button 
        className="mobile-notes-fab"
        onClick={() => setIsNotesOpen(true)}
      >
        <span className="material-symbols-outlined">sticky_note_2</span>
        Notes ({notes.length})
      </button>
      
      <NoteModal 
        key={isModalOpen ? (noteToEdit?.id || 'new-note') : 'modal-closed'}
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setNoteToEdit(null);
        }}
        onSave={handleSaveNote}
        selectedRange={selectedRange}
        noteToEdit={noteToEdit}
      />

      {toast.visible && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
