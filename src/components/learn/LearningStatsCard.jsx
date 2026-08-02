import React from 'react';

export default function LearningStatsCard({ label, value, icon }) {
  return (
    <div className="p-5 rounded-3xl border border-slate-200/80 bg-white flex items-center gap-4 hover:border-slate-300 transition-colors shadow-xs">
      <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-black shrink-0">
        {icon}
      </div>
      <div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">{label}</span>
        <span className="text-sm font-black text-black">{value}</span>
      </div>
    </div>
  );
}
