import React from 'react';
import { CheckCircle2, Clock, Tag, ChevronRight } from 'lucide-react';

export default function ProblemCard({ problem, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-slate-300 transition-all duration-300 w-full cursor-pointer select-none shadow-xs"
    >
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 items-center mb-2.5">
          <span className="text-[9px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-black">
            {problem.difficulty}
          </span>

          {problem.solved && (
            <span className="text-[9px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-black flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-black" /> Solved
            </span>
          )}

          {problem.estimatedTime && (
            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {problem.estimatedTime}
            </span>
          )}
        </div>

        <h4 className="font-display font-medium text-black text-base group-hover:text-slate-600 transition-colors mb-1 tracking-tight">
          {problem.title}
        </h4>
        
        <p className="text-xs text-slate-500 font-body leading-relaxed line-clamp-2 mb-3">
          {problem.description}
        </p>

        <div className="flex flex-wrap gap-1.5 items-center">
          {problem.tags?.map((tag, idx) => (
            <span key={idx} className="text-[9px] font-bold text-black bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Tag className="w-2.5 h-2.5 text-slate-400" /> {tag}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-slate-800 transition-all flex items-center gap-1 shrink-0 text-xs font-medium"
      >
        <span>Code</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
