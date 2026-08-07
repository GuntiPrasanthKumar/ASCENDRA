import React from 'react';
import { CheckCircle2, Clock, ChevronRight } from 'lucide-react';

export default function ProblemCard({ problem, onSelect }) {
  const getDiffBadge = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100';
      case 'medium':
        return 'bg-amber-50 text-amber-700 font-bold border border-amber-100';
      case 'hard':
        return 'bg-rose-50 text-rose-700 font-bold border border-rose-100';
      default:
        return 'bg-slate-100 text-slate-700 font-bold border border-slate-200';
    }
  };

  return (
    <div
      onClick={onSelect}
      className="bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-slate-300 transition-all duration-300 w-full cursor-pointer select-none shadow-2xs"
    >
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap gap-3 items-center">
          <span className={`text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full ${getDiffBadge(problem.difficulty)}`}>
            {problem.difficulty}
          </span>

          {problem.solved && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Solved
            </span>
          )}

          {problem.estimatedTime && (
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {problem.estimatedTime}
            </span>
          )}
        </div>

        <h4 className="font-display font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors tracking-tight">
          {problem.title}
        </h4>
        
        <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl line-clamp-2">
          {problem.description}
        </p>

        <div className="flex flex-wrap gap-2 items-center pt-1">
          {problem.tags?.map((tag, idx) => (
            <span key={idx} className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="px-6 py-2.5 rounded-full bg-black hover:bg-slate-800 text-white transition-all flex items-center gap-1 shrink-0 text-xs font-semibold shadow-xs"
      >
        <span>Code</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
