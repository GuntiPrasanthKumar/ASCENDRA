import React from 'react';
import { Award, Zap, AlertCircle, FileCode, CheckCircle, BarChart } from 'lucide-react';

export default function AIReviewCard({ review }) {
  if (!review) return null;

  return (
    <div className="glass p-6 rounded-3xl border border-indigo-500/10 flex flex-col gap-5 bg-gradient-to-br from-indigo-500/[0.01] to-accent/[0.01] animate-fade-in select-none">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-indigo-500" /> AI Review & Diagnostic Details
        </h3>
        <span className="text-[10px] font-black text-white bg-slate-900 border border-slate-800 px-3 py-1 rounded-full flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-warning shrink-0" /> {review.score || 95}% Overall Score
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-slate-700">
        <div className="p-3 rounded-2xl bg-white border border-slate-200">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Time Complexity</span>
          <code className="text-indigo-650 font-bold">{review.timeComplexity || 'O(N)'}</code>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-200">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Space Complexity</span>
          <code className="text-indigo-650 font-bold">{review.spaceComplexity || 'O(1)'}</code>
        </div>
      </div>

      <div className="flex flex-col gap-4 text-[11px] font-semibold text-slate-700">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Code Quality & Readability</span>
          <p className="text-slate-655 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
            {review.quality || 'Excellent clarity and clean variable naming convention.'} (Readability: {review.readability || 'High'})
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Suggested Improvements</span>
          <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-amber-800 text-[10px] font-bold flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>{review.suggestions || 'Use inline swapping to minimize space allocations.'}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Best Practices</span>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-205 text-slate-655 text-[10px] flex gap-2 items-start">
            <FileCode className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>{review.bestPractices || 'Variables scoped correctly. Functional loops are highly readable.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const AIReviewPanel = AIReviewCard;
