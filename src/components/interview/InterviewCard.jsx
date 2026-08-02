import React from 'react';
import { Award, Clock, ChevronRight } from 'lucide-react';

export default function InterviewCard({ title, category, duration, difficulty, description, onSelect }) {
  return (
    <div className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 flex flex-col justify-between group hover:border-slate-300 shadow-xs transition-all duration-300">
      <div>
        <span className="text-[10px] font-extrabold text-black bg-slate-100 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
          {category}
        </span>
        <h3 className="text-base font-display font-medium text-black mb-1 group-hover:text-slate-600 transition-colors tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 font-body leading-relaxed mb-4">{description}</p>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <div className="flex gap-3 items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {duration}</span>
          <span className="flex items-center gap-1 text-black">
            <Award className="w-3.5 h-3.5" /> {difficulty}
          </span>
        </div>

        <button
          onClick={onSelect}
          className="px-4 py-2 rounded-full bg-black hover:bg-slate-800 text-white font-medium transition-all text-xs flex items-center gap-1"
        >
          <span>Start</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
