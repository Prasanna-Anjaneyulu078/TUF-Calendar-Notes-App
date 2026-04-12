import React, { useState } from 'react';
import { formatDateShort } from '../../utils/dateUtils';
import './index.css';

const NoteModal = ({ isOpen, onClose, onSave, selectedRange, noteToEdit }) => {
  const [title, setTitle] = useState(noteToEdit?.title || '');
  const [description, setDescription] = useState(noteToEdit?.description || '');
  const isDuplicate = Boolean(noteToEdit);

  if (!isOpen) return null;

  // Use today as default if no dates selected
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const effectiveRange = selectedRange.start ? selectedRange : { start: today, end: null };

  const handleSave = () => {
    if (!description.trim()) return;
    
    onSave({
      id: noteToEdit ? noteToEdit.id : Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      start: effectiveRange.start,
      end: effectiveRange.end
    });
    onClose();
  };

  const dateStr = effectiveRange.start 
    ? (effectiveRange.end 
        ? `${formatDateShort(effectiveRange.start)} – ${formatDateShort(effectiveRange.end)}`
        : formatDateShort(effectiveRange.start))
    : 'No date selected';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add Note</h3>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {isDuplicate && (
          <div className="duplicate-alert">
            <span className="material-symbols-outlined">info</span>
            <p>Note already exists for selected dates. Updating existing note.</p>
          </div>
        )}
        
        <div className="modal-body">
          <div className="modal-date-badge">
            <span className="material-symbols-outlined">calendar_today</span>
            {dateStr}
          </div>
          
          <div className="form-group">
            <label>Title (Optional)</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="E.g. Summit push window"
              className="modal-input"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Final weather window monitoring..."
              className="modal-textarea"
              rows="4"
            ></textarea>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button 
            className="btn-save" 
            onClick={handleSave}
            disabled={!description.trim() || !effectiveRange.start}
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
