import React from 'react';
import { Clock, BarChart3, ChevronRight } from 'lucide-react';

export default function InterviewCard({ title, category, duration, difficulty, description, onSelect }) {
  const getCategoryBadge = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'hr':
        return 'bg-blue-50 text-blue-700 font-bold border-blue-100';
      case 'behavioral':
        return 'bg-purple-50 text-purple-700 font-bold border-purple-100';
      case 'technical':
        return 'bg-amber-50 text-amber-700 font-bold border-amber-100';
      default:
        return 'bg-slate-100 text-slate-700 font-bold border-slate-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between group hover:border-slate-300 shadow-2xs transition-all duration-300">
      <div className="space-y-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full inline-block border ${getCategoryBadge(category)}`}>
          {category}
        </span>
        <h3 className="text-base font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>

      <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-100">
        <div className="flex gap-3 items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {duration}</span>
          <span className="flex items-center gap-1 text-slate-500">
            <BarChart3 className="w-3.5 h-3.5" /> {difficulty}
          </span>
        </div>

        <button
          onClick={onSelect}
          className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 hover:border-slate-300 font-semibold transition-all text-xs flex items-center gap-1 shadow-2xs"
        >
          <span>Start</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
