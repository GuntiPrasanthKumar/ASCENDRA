import React from 'react';
import { History, Award } from 'lucide-react';

export default function ActivityCard({ activities = [] }) {
  return (
    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-4">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 pl-1 flex items-center gap-1.5">
        <History className="w-4 h-4 text-slate-400" /> Recent Activities
      </h3>

      <div className="flex flex-col gap-3">
        {activities.map((act, i) => (
          <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100/50 text-[10px] text-textMuted leading-relaxed flex justify-between items-center">
            <div>
              <span className="font-bold text-slate-800 block mb-0.5">{act.title}</span>
              <span>{act.time}</span>
            </div>
            <span className="text-[8px] font-black text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
              {act.xp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
