import React from 'react';
import { CheckCircle2, XCircle, FileText } from 'lucide-react';

export default function FeedbackCard({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-6">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 pl-1 flex items-center gap-1.5">
        <FileText className="w-4 h-4 text-slate-400" /> Interview Feedback
      </h3>

      <p className="text-xs text-slate-700 leading-relaxed font-semibold italic border-l-2 border-indigo-650/30 pl-3">
        {feedback.summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        <div>
          <span className="text-[9px] font-black text-success uppercase tracking-wider block mb-3">Strengths Unlocked</span>
          <div className="flex flex-col gap-2">
            {feedback.strengths.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4.5 h-4.5 text-success shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[9px] font-black text-error uppercase tracking-wider block mb-3">Areas for Improvement</span>
          <div className="flex flex-col gap-2">
            {feedback.improvements.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center text-xs font-semibold text-slate-750">
                <XCircle className="w-4.5 h-4.5 text-error shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
