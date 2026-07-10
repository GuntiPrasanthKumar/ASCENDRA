import React from 'react';
import { Award } from 'lucide-react';

export default function KeyTakeawayCard({ value }) {
  return (
    <div className="p-5 rounded-2xl bg-indigo-50/20 border-l-4 border-indigo-600 text-indigo-800 leading-relaxed text-[11px] font-semibold">
      <span className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[9px] mb-1">
        <Award className="w-4 h-4 text-indigo-600 shrink-0" /> Key Takeaway
      </span>
      <p>{value}</p>
    </div>
  );
}
