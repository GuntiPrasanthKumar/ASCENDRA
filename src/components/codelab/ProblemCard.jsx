import React from 'react';
import { PlayCircle, CheckCircle2, Clock, Tag } from 'lucide-react';

export default function ProblemCard({ problem, onSelect }) {
  const isEasy = problem.difficulty === 'Easy';
  const isMedium = problem.difficulty === 'Medium';

  let diffBadge = 'bg-success/5 border-success/15 text-success';
  if (isMedium) diffBadge = 'bg-warning/5 border-warning/15 text-warning';
  if (problem.difficulty === 'Hard') diffBadge = 'bg-red-500/5 border-red-500/15 text-red-600';

  return (
    <div
      onClick={onSelect}
      className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-accent/20 transition-all duration-300 w-full cursor-pointer select-none"
    >
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${diffBadge}`}>
            {problem.difficulty}
          </span>

          {problem.solved && (
            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-success/10 border border-success/20 text-success flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Solved
            </span>
          )}

          {problem.estimatedTime && (
            <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {problem.estimatedTime}
            </span>
          )}
        </div>

        <h4 className="font-bold text-slate-800 text-base group-hover:text-accent transition-colors mb-1">
          {problem.title}
        </h4>
        
        <p className="text-xs text-textMuted leading-relaxed line-clamp-2 mb-3">
          {problem.description}
        </p>

        <div className="flex flex-wrap gap-1.5 items-center">
          {problem.tags?.map((tag, idx) => (
            <span key={idx} className="text-[9px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
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
        className="px-5 py-3 rounded-2xl bg-slate-900 text-white hover:bg-primary transition-all flex items-center gap-1.5 shrink-0 text-xs font-bold shadow-sm"
      >
        Code <PlayCircle className="w-4 h-4 shrink-0" />
      </button>
    </div>
  );
}
