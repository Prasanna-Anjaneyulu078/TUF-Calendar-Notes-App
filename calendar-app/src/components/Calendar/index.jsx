import React from 'react';
import CalendarGrid from '../CalendarGrid';
import './index.css';

const Calendar = ({ 
  currentDate, 
  onPrevMonth, 
  onNextMonth, 
  selectedRange, 
  onDateClick,
  activeNoteRange,
  onAddClick
}) => {
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const hasActiveNote = activeNoteRange !== null;
  const hasSelection = selectedRange?.start !== null || selectedRange?.end !== null;

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="nav-btn" onClick={onPrevMonth}>
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h3 className="calendar-title">
            <span className="calendar-title-month">{monthName}</span>
            <span className="calendar-title-year">{year}</span>
          </h3>
          <button className="nav-btn" onClick={onNextMonth}>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <button className="calendar-add-btn" onClick={onAddClick}>
          <span className="material-symbols-outlined add-icon">add</span>
          <span className="add-btn-text">Add Note</span>
        </button>
      </div>
      
      <CalendarGrid 
        currentDate={currentDate}
        selectedRange={selectedRange}
        onDateClick={onDateClick}
        activeNoteRange={activeNoteRange}
      />
      
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-dot dot-selected"></div>
          <span className="legend-label">
            {hasActiveNote ? 'Active Note' : 'Selected Goal'}
          </span>
        </div>
        <div className="legend-item">
          <div className="legend-dot dot-range"></div>
          <span className="legend-label">Range Duration</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot dot-holiday"></div>
          <span className="legend-label">Holiday</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
