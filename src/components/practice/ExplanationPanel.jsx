import React from 'react';
import { Award } from 'lucide-react';

export default function ExplanationPanel({ explanation }) {
  return (
    <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed text-[11px] font-semibold">
      <span className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[9px] mb-1.5 text-slate-550">
        <Award className="w-4 h-4 text-slate-600 shrink-0" /> Explanation
      </span>
      <p>{explanation}</p>
    </div>
  );
}
