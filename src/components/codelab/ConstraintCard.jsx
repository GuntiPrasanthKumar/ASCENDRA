import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function ConstraintCard({ constraints = [] }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-205 select-none">
      <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-slate-500 mb-3">
        <ShieldCheck className="w-4 h-4 text-slate-400" /> Edge Constraints
      </span>
      <div className="flex flex-col gap-2">
        {constraints.map((c, i) => (
          <code key={i} className="text-[10px] text-slate-750 font-bold block bg-white border border-slate-100 p-2 rounded-xl">
            {c}
          </code>
        ))}
      </div>
    </div>
  );
}
