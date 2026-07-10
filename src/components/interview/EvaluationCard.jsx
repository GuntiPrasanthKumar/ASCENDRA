import React from 'react';
import { Award, Star } from 'lucide-react';

export default function EvaluationCard({ score }) {
  if (!score) return null;

  return (
    <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden bg-gradient-to-br from-indigo-500/[0.02] to-success/[0.02] select-none">
      <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        <span className="text-[10px] font-black text-success bg-success/5 border border-success/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
          Evaluation Diagnostic
        </span>
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-primary mb-1">
          Overall Score: <span className="text-success">{score.overall}% Pass</span>
        </h2>
        <p className="text-xs text-textMuted font-medium">Placement compatibility benchmark evaluations.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 shrink-0 w-full md:w-auto">
        <div className="p-3 rounded-2xl bg-white border border-slate-100 flex flex-col gap-0.5">
          <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Communication</span>
          <span className="text-sm font-black text-slate-800">{score.communication}%</span>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-100 flex flex-col gap-0.5">
          <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Confidence</span>
          <span className="text-sm font-black text-slate-800">{score.confidence}%</span>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-100 flex flex-col gap-0.5">
          <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Accuracy</span>
          <span className="text-sm font-black text-slate-800">{score.accuracy}%</span>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-100 flex flex-col gap-0.5">
          <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Fluency</span>
          <span className="text-sm font-black text-slate-800">{score.fluency}%</span>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-100 flex flex-col gap-0.5">
          <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Response Quality</span>
          <span className="text-sm font-black text-slate-800">{score.responseQuality}%</span>
        </div>
      </div>
    </div>
  );
}
