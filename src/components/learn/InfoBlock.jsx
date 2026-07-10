import React from 'react';
import { BookOpen } from 'lucide-react';

export default function InfoBlock({ value }) {
  return (
    <div className="p-6 rounded-[2rem] bg-indigo-50/10 border border-indigo-500/10 text-slate-700 leading-relaxed text-xs font-semibold flex gap-4">
      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
        <BookOpen className="w-4 h-4 text-indigo-600" />
      </div>
      <div>
        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block mb-1">Concept Explanation</span>
        <p>{value}</p>
      </div>
    </div>
  );
}
