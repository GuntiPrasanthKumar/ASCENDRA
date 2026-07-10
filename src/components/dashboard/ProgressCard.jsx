import React from 'react';

export default function ProgressCard({ title, value, colorClass = 'bg-primary' }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
        <span>{title}</span>
        <span className="text-primary font-black">{value}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
