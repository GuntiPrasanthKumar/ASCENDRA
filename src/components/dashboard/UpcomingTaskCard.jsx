import React from 'react';
import { Calendar, ShieldAlert } from 'lucide-react';

export default function UpcomingTaskCard({ title, time, type, status, isLoading = false, isEmpty = false }) {
  if (isLoading) {
    return (
      <div className="flex gap-4 items-start animate-pulse py-3.5">
        <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0" />
        <div className="flex flex-col gap-1.5 w-full">
          <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
          <div className="h-3 bg-slate-200 rounded-lg w-1/2" />
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="py-4 text-center text-xs text-textMuted flex flex-col items-center gap-1">
        <Calendar className="w-6 h-6 text-slate-300 mb-1" />
        <span>No upcoming scheduled tasks.</span>
      </div>
    );
  }

  return (
    <div className="flex gap-3.5 items-start border-b border-slate-100 last:border-0 pb-3.5 last:pb-0 group hover:bg-slate-50/50 p-2.5 -m-2.5 rounded-2xl transition-all duration-300">
      <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
        <Calendar className="w-4 h-4 text-accent" />
      </div>
      <div className="min-w-0">
        <h4 className="text-xs font-bold text-slate-800 truncate">{title}</h4>
        <span className="text-[10px] font-semibold text-textMuted mt-0.5 block">{time}</span>
        {status && (
          <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-wider mt-1.5 inline-block">
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
