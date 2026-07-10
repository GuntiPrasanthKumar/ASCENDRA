import React from 'react';
import { AlignLeft } from 'lucide-react';

export default function SummaryCard({ value }) {
  return (
    <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed text-xs font-semibold">
      <span className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[9px] mb-2 text-slate-550">
        <AlignLeft className="w-4 h-4 text-slate-500 shrink-0" /> Lesson Summary
      </span>
      <p>{value}</p>
    </div>
  );
}
