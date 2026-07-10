import React from 'react';
import { Award, CheckCircle, Clock } from 'lucide-react';

export default function ResultCard({ score, totalQuestions, timeTaken = '2m 15s' }) {
  const percent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden bg-gradient-to-br from-primary/[0.02] to-success/[0.02]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        <span className="text-[10px] font-black text-success bg-success/5 border border-success/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
          Assessment Complete
        </span>
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-primary mb-1">
          Your Performance: <span className="text-success">{percent}% Accuracy</span>
        </h2>
        <p className="text-xs text-textMuted font-medium">You answered {score} out of {totalQuestions} questions correctly.</p>
      </div>

      <div className="flex gap-4 items-center shrink-0 w-full md:w-auto">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/50 px-4 py-3 rounded-2xl">
          <Clock className="w-4 h-4 text-slate-550 shrink-0" />
          <span>{timeTaken}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-white bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl shadow-md">
          <Award className="w-4 h-4 text-warning shrink-0" />
          <span>+{score * 20} Points</span>
        </div>
      </div>
    </div>
  );
}
