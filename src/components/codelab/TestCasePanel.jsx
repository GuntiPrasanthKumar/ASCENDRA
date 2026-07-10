import React from 'react';
import { CheckCircle2, Play } from 'lucide-react';

export default function TestCasePanel({ examples = [], activeCaseIdx, onSelectCase }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-slate-500 pl-1 select-none">
        <CheckCircle2 className="w-4 h-4 text-slate-400" /> Test Cases
      </span>
      <div className="flex gap-2">
        {examples.map((_, i) => {
          const isActive = i === activeCaseIdx;
          return (
            <button
              key={i}
              onClick={() => onSelectCase(i)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all flex items-center gap-1 ${
                isActive
                  ? 'bg-primary border-primary text-white shadow-md'
                  : 'bg-white border-slate-205 text-slate-655 hover:bg-slate-50'
              }`}
            >
              <Play className="w-3 h-3" /> Case {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
