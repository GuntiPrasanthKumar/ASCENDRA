import React from 'react';
import { Award, Clock, ArrowRight } from 'lucide-react';

export default function InterviewCard({ title, category, duration, difficulty, description, onSelect }) {
  const isHard = difficulty === 'Hard';
  const isMedium = difficulty === 'Medium';

  return (
    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col justify-between group hover:border-indigo-500/25 hover:shadow-lg transition-all duration-300">
      <div>
        <span className="text-[9px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3 inline-block">
          {category}
        </span>
        <h3 className="text-base font-extrabold font-display text-primary mb-1 group-hover:text-indigo-650 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-textMuted leading-relaxed font-semibold mb-4">{description}</p>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <div className="flex gap-3 items-center text-[10px] font-black text-slate-500 uppercase tracking-wider">
          <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {duration}</span>
          <span className={`flex items-center gap-0.5 ${isHard ? 'text-error' : isMedium ? 'text-warning' : 'text-success'}`}>
            <Award className="w-3.5 h-3.5" /> {difficulty}
          </span>
        </div>

        <button
          onClick={onSelect}
          className="p-2.5 rounded-xl bg-slate-900 group-hover:bg-primary text-white transition-all shadow-md"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
