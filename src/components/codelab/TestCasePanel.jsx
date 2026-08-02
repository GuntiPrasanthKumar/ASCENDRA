import React from 'react';
import { CheckCircle2, Play, Lock, XCircle } from 'lucide-react';

export default function TestCasePanel({ examples = [], activeCaseIdx, onSelectCase, testStatus = null }) {
  return (
    <div className="flex flex-col gap-3 glass p-4 rounded-2xl border border-slate-200 select-none">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-slate-500">
          <CheckCircle2 className="w-4 h-4 text-slate-400" /> Test Cases & Assertions
        </span>
        <span className="text-[9px] font-bold text-slate-400">
          {examples.length} Public • 2 Hidden
        </span>
      </div>

      {/* Public Test Case Selectors */}
      <div className="flex flex-wrap gap-2">
        {examples.map((_, i) => {
          const isActive = i === activeCaseIdx;
          const passed = testStatus ? testStatus[i] !== false : true;

          return (
            <button
              key={i}
              onClick={() => onSelectCase(i)}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-primary border-primary text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {testStatus ? (
                passed ? <CheckCircle2 className="w-3 h-3 text-success shrink-0" /> : <XCircle className="w-3 h-3 text-red-500 shrink-0" />
              ) : (
                <Play className="w-3 h-3 shrink-0" />
              )}
              Case {i + 1}
            </button>
          );
        })}

        {/* Hidden Test Case Placeholders */}
        <div className="px-3.5 py-2 rounded-xl text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 flex items-center gap-1.5 cursor-not-allowed opacity-60">
          <Lock className="w-3 h-3" /> Hidden Case 1
        </div>
        <div className="px-3.5 py-2 rounded-xl text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 flex items-center gap-1.5 cursor-not-allowed opacity-60">
          <Lock className="w-3 h-3" /> Hidden Case 2
        </div>
      </div>

      {/* Active Case Preview Details */}
      {examples[activeCaseIdx] && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-700 flex flex-col gap-1 mt-1">
          <div><span className="font-bold text-slate-400 uppercase text-[8px] tracking-wider block">Input:</span> {examples[activeCaseIdx].input}</div>
          <div><span className="font-bold text-slate-400 uppercase text-[8px] tracking-wider block">Expected Output:</span> {examples[activeCaseIdx].output}</div>
        </div>
      )}
    </div>
  );
}
