import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function PerformanceCard({ strongAreas = [], weakAreas = [], summary }) {
  return (
    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-6">
      {summary && (
        <p className="text-xs text-slate-700 leading-relaxed font-semibold italic border-l-2 border-indigo-600/30 pl-3">
          {summary}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-[9px] font-black text-success uppercase tracking-wider block mb-3">Strong Topics</span>
          {strongAreas.length === 0 ? (
            <span className="text-xs text-textMuted italic font-semibold">None recorded yet</span>
          ) : (
            <div className="flex flex-col gap-2">
              {strongAreas.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4.5 h-4.5 text-success shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-[9px] font-black text-error uppercase tracking-wider block mb-3">Weak Topics</span>
          {weakAreas.length === 0 ? (
            <span className="text-xs text-success italic font-bold">None detected! Excellent coverage.</span>
          ) : (
            <div className="flex flex-col gap-2">
              {weakAreas.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center text-xs font-semibold text-slate-750">
                  <XCircle className="w-4.5 h-4.5 text-error shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
