import React, { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';

export default function NotesPanel({ lessonId }) {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');

  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${lessonId}`);
    setNotes(savedNotes || '');
    setSaveStatus('Saved');
  }, [lessonId]);

  const handleChange = (e) => {
    const val = e.target.value;
    setNotes(val);
    setIsSaving(true);
    setSaveStatus('Saving...');
  };

  useEffect(() => {
    if (!isSaving) return;

    // Simulate autosave debouncer
    const timer = setTimeout(() => {
      localStorage.setItem(`notes_${lessonId}`, notes);
      setIsSaving(false);
      setSaveStatus('Saved');
    }, 1000);

    return () => clearTimeout(timer);
  }, [notes, lessonId, isSaving]);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Workspace Notes</h4>
        <span className="text-[10px] font-bold text-textMuted flex items-center gap-1">
          {saveStatus === 'Saving...' ? (
            <Save className="w-3.5 h-3.5 text-accent animate-spin" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 text-success" />
          )}
          <span>{saveStatus}</span>
        </span>
      </div>

      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="Draft your key takeaways, recursive code skeletons, or formulas here..."
        className="flex-1 w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xs font-medium text-slate-700 leading-relaxed resize-none min-h-[160px]"
      />
    </div>
  );
}
