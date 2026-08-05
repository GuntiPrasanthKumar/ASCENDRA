import React from 'react';

export default function ProgressCard({ title, value, colorClass = 'bg-black' }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-xs font-bold text-slate-800">
        <span>{title}</span>
        <span className="text-black font-black">{value}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full border border-slate-200/50 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 bg-black rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
