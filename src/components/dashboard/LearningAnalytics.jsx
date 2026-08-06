import React from 'react';
import { Sparkles, TrendingUp, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function LearningAnalytics({ codingCount = 1, quizCount = 3 }) {
  return (
    <div className="p-8 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-black dark:text-white" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white">
            AI Weekly Insights & Telemetry Report
          </h2>
        </div>
        <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300">
          Updated 1h ago
        </span>
      </div>

      {/* AI Narrative Story (Primary focus, no charts first) */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
        <h3 className="text-base font-display font-extrabold text-black dark:text-white leading-snug">
          "This week your Python & Algorithmic accuracy improved by 12%. Dynamic Programming memoization still requires targeted practice."
        </h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
          You have maintained an 88.5% accuracy rate across <strong>{quizCount} practice sets</strong> and accepted <strong>{codingCount} CodeLab solutions</strong>. Biometric identity verification remained 100% compliant throughout active sessions.
        </p>
      </div>

      {/* Secondary Benchmark Data (Subtle below the story) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Overall Mastery
          </div>
          <div className="text-xl font-black font-display text-black dark:text-white">74.5%</div>
          <span className="text-[10px] font-semibold text-emerald-500">+4.2% from last week</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Accuracy Rate
          </div>
          <div className="text-xl font-black font-display text-black dark:text-white">88.5%</div>
          <span className="text-[10px] font-semibold text-slate-400">High consistency</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Focus Area
          </div>
          <div className="text-xs font-bold text-black dark:text-white pt-1">Memoization Recursion</div>
          <span className="text-[10px] font-semibold text-amber-500">2 lessons remaining</span>
        </div>
      </div>

    </div>
  );
}
