import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ProblemHeader({ title, difficulty, onBack }) {
  const difficultyClass = difficulty === 'Easy'
    ? 'bg-success/5 border-success/15 text-success'
    : difficulty === 'Medium'
    ? 'bg-warning/5 border-warning/15 text-warning'
    : 'bg-error/5 border-error/15 text-error';

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-primary">
            {title}
          </h1>
          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border mt-1.5 inline-block ${difficultyClass}`}>
            {difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
