export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // We want Monday to be 0, so we adjust
  let day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

export const formatMonthYear = (date) => {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

export const formatDateShort = (date) => {
  return date.toLocaleString('default', { month: 'short', day: 'numeric' });
};

export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

export const isDateBetween = (date, start, end) => {
  if (!date || !start || !end) return false;
  const d = date.getTime();
  const s = start.getTime();
  const e = end.getTime();
  return (d > s && d < e) || (d < s && d > e);
};

export const isHoliday = (date) => {
  if (!date) return false;
  const month = date.getMonth();
  const day = date.getDate();
  
  // Mock holidays for demonstration
  const holidays = [
    { m: 0, d: 1 },   // Jan 1: New Year's Day
    { m: 1, d: 14 },  // Feb 14: Valentine's Day
    { m: 2, d: 17 },  // Mar 17: St. Patrick's Day
    { m: 3, d: 1 },   // Apr 1: April Fools
    { m: 4, d: 1 },   // May 1: Labor Day
    { m: 6, d: 4 },   // Jul 4: Independence Day
    { m: 9, d: 31 },  // Oct 31: Halloween
    { m: 10, d: 11 }, // Nov 11: Veterans Day
    { m: 11, d: 25 }, // Dec 25: Christmas
    { m: 11, d: 31 }, // Dec 31: New Year's Eve
  ];
  
  return holidays.some(h => h.m === month && h.d === day);
};

export const generateCalendarGrid = (year, month) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  
  const grid = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    grid.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    grid.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }
  
  // Next month days to fill 6 rows (42 cells)
  const remainingCells = 42 - grid.length;
  for (let i = 1; i <= remainingCells; i++) {
    grid.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false
    });
  }
  
  return grid;
};
