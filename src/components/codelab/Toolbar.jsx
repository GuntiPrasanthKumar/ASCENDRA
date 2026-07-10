import React from 'react';
import LanguageSelector from './LanguageSelector';
import { Play, Check, RotateCcw } from 'lucide-react';

export default function Toolbar({ languages = [], selectedLangId, onSelectLang, onRun, onSubmit, onReset, isRunning, isSubmitting }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 select-none">
      <LanguageSelector
        languages={languages}
        selectedId={selectedLangId}
        onSelect={onSelectLang}
      />

      <div className="flex gap-2.5 w-full sm:w-auto justify-end">
        <button
          onClick={onReset}
          className="p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-655 transition-colors flex items-center justify-center"
          title="Reset Starter Code"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          disabled={isRunning || isSubmitting}
          onClick={onRun}
          className="px-5 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5" /> Run Code
        </button>

        <button
          disabled={isRunning || isSubmitting}
          onClick={onSubmit}
          className="px-5 py-3 rounded-2xl bg-primary text-white hover:bg-accent font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-primary/10 disabled:opacity-50"
        >
          <Check className="w-3.5 h-3.5" /> Submit Code
        </button>
      </div>
    </div>
  );
}
