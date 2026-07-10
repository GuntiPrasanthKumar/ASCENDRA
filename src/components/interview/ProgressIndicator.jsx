import React from 'react';

export default function ProgressIndicator({ current, total }) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-1 w-full md:w-32 select-none">
      <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
        <span>Completion</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
        <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
