import React from 'react';
import { generateCalendarGrid, isSameDay, isDateBetween, isHoliday } from '../../utils/dateUtils';
import './index.css';

const CalendarGrid = ({ currentDate, selectedRange, onDateClick, activeNoteRange }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const grid = generateCalendarGrid(year, month);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rangeToUse = activeNoteRange || selectedRange || { start: null, end: null };

  const renderCell = (cell, index) => {
    const isToday = isSameDay(cell.date, today);
    const isStart = isSameDay(cell.date, rangeToUse.start);
    const isEnd = isSameDay(cell.date, rangeToUse.end);
    const isBetween = isDateBetween(cell.date, rangeToUse.start, rangeToUse.end);
    const isCellHoliday = isHoliday(cell.date);
    
    // Check if it's a weekend (Saturday or Sunday)
    const dayOfWeek = cell.date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    let cellClass = "calendar-cell";
    if (!cell.isCurrentMonth) cellClass += " out-of-month";
    else if (isWeekend && !isStart && !isEnd && !isBetween) cellClass += " weekend";
    else cellClass += " in-month";
    
    let wrapperClass = `calendar-cell-wrapper ${isBetween ? 'is-between' : ''} ${isStart ? 'is-start-range' : ''} ${isEnd ? 'is-end-range' : ''}`;
    if (!cell.isCurrentMonth) wrapperClass += " out-of-month-wrapper";
    
    return (
      <div 
        key={index} 
        className={wrapperClass}
        onClick={() => cell.isCurrentMonth && onDateClick(cell.date)}
      >
        {/* Background highlight for range */}
        {(rangeToUse.start && rangeToUse.end && (isBetween || isStart || isEnd)) && (
          <div className={`range-bg ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}`}></div>
        )}
        
        {/* The actual date number */}
        <div className={`date-number ${isStart || isEnd ? 'selected' : ''} ${isToday && !isStart && !isEnd ? 'today' : ''} ${cellClass}`}>
          {cell.date.getDate().toString().padStart(2, '0')}
        </div>
        
        {/* Holiday Marker */}
        {isCellHoliday && (
          <div className={`holiday-marker ${isStart || isEnd || isToday ? 'marker-on-selected' : ''}`}></div>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-grid">
      {/* Day Headers */}
      <div className="day-header">Mon</div>
      <div className="day-header">Tue</div>
      <div className="day-header">Wed</div>
      <div className="day-header">Thu</div>
      <div className="day-header">Fri</div>
      <div className="day-header weekend-header">Sat</div>
      <div className="day-header weekend-header">Sun</div>
      
      {/* Grid Cells */}
      {grid.map((cell, index) => renderCell(cell, index))}
    </div>
  );
};

export default CalendarGrid;
