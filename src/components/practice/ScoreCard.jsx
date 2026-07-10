import React from 'react';

export default function ScoreCard({ label, value, icon }) {
  return (
    <div className="glass p-5 rounded-3xl border border-slate-200/50 flex items-center gap-4 hover:border-primary/10 transition-colors">
      <div className="w-10 h-10 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">{label}</span>
        <span className="text-sm font-black text-primary">{value}</span>
      </div>
    </div>
  );
}
