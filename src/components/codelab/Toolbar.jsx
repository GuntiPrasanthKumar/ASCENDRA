import React from 'react';
import LanguageSelector from './LanguageSelector';
import { Play, Check, RotateCcw, Lightbulb, Bug, History } from 'lucide-react';

export default function Toolbar({ 
  languages = [], 
  selectedLangId, 
  onSelectLang, 
  onRun, 
  onSubmit, 
  onReset, 
  onGetHint, 
  onDebug, 
  onHistory,
  isRunning, 
  isSubmitting 
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 select-none">
      <LanguageSelector
        languages={languages}
        selectedId={selectedLangId}
        onSelect={onSelectLang}
      />

      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={onHistory}
          className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Submission History"
        >
          <History className="w-4 h-4 text-slate-500" />
          <span className="hidden md:inline">History</span>
        </button>

        <button
          onClick={onGetHint}
          className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Progressive AI Hint"
        >
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span className="hidden md:inline">AI Hint</span>
        </button>

        <button
          onClick={onDebug}
          className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 transition-colors flex items-center gap-1 text-xs font-semibold"
          title="AI Debugger"
        >
          <Bug className="w-4 h-4 text-purple-600" />
          <span className="hidden md:inline">AI Debug</span>
        </button>

        <button
          onClick={onReset}
          className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-colors flex items-center justify-center"
          title="Reset Starter Code"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          disabled={isRunning || isSubmitting}
          onClick={onRun}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5" /> Run Code
        </button>

        <button
          disabled={isRunning || isSubmitting}
          onClick={onSubmit}
          className="px-5 py-2.5 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400" /> Submit Code
        </button>
      </div>
    </div>
  );
}
