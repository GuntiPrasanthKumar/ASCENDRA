import React from 'react';
import { CheckCircle2, Clock, Cpu, Award } from 'lucide-react';

export default function SubmissionSummary({ result, onClose }) {
  if (!result) return null;

  return (
    <div className="glass p-6 rounded-3xl border border-success/20 bg-success/[0.02] flex flex-col gap-4 animate-fade-in select-none">
      <div className="flex justify-between items-center pb-3 border-b border-success/15">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <h3 className="text-sm font-black uppercase tracking-wider text-success">
            {result.status || 'Accepted'}
          </h3>
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase">
          Passed {result.passedCount || 15}/{result.totalCount || 15} Tests
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
        <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
          <div>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Runtime</span>
            <span className="text-slate-800 font-bold">{result.runtime || '72 ms'}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-accent shrink-0" />
          <div>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Memory</span>
            <span className="text-slate-800 font-bold">{result.memory || '42 MB'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
