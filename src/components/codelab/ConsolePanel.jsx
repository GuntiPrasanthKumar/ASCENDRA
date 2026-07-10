import React from 'react';
import { Keyboard } from 'lucide-react';

export default function ConsolePanel({ value, onChange, placeholder = 'Provide custom inputs here...' }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-slate-500 pl-1 select-none">
        <Keyboard className="w-4 h-4 text-slate-400" /> Custom Test Input
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-205 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xs font-semibold font-mono text-slate-700"
      />
    </div>
  );
}
