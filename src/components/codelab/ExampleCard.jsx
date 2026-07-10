import React from 'react';
import { Sparkles } from 'lucide-react';

export default function ExampleCard({ index, example }) {
  return (
    <div className="p-5 rounded-2xl bg-indigo-50/10 border border-indigo-500/5 select-none">
      <span className="flex items-center gap-1 font-black uppercase tracking-widest text-[9px] text-indigo-600 mb-2">
        <Sparkles className="w-3.5 h-3.5" /> Example {index}
      </span>
      <div className="flex flex-col gap-2 font-mono text-[10px]">
        <div className="bg-white border border-slate-100 p-2 rounded-xl">
          <span className="text-slate-400 font-bold block mb-0.5">Input:</span>
          <span className="text-slate-700 font-semibold">{example.input}</span>
        </div>
        <div className="bg-white border border-slate-100 p-2 rounded-xl">
          <span className="text-slate-400 font-bold block mb-0.5">Output:</span>
          <span className="text-slate-750 font-semibold">{example.output}</span>
        </div>
      </div>
    </div>
  );
}
