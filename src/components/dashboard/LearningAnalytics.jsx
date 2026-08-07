import React from 'react';
import { Sparkles, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function LearningAnalytics({ codingCount = 1, quizCount = 3 }) {
  return (
    <div className="google-card p-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E3E3E3] dark:border-[#2E2F31]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#1A73E8] dark:text-[#A8C7FA]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#E3E3E3]">
            AI Weekly Insights & Telemetry Report
          </h2>
        </div>
        <span className="text-[10px] font-mono font-bold bg-[#F0F4F9] dark:bg-[#282A2C] px-3 py-1 rounded-full text-[#5F6368] dark:text-[#C4C7C5]">
          Updated 1h ago
        </span>
      </div>

      {/* AI Narrative Story (Primary focus, no charts first) */}
      <div className="p-6 rounded-2xl bg-[#F0F4F9] dark:bg-[#282A2C] border border-[#E3E3E3]/80 dark:border-[#444746] space-y-3">
        <h3 className="text-base font-display font-bold text-[#1F1F1F] dark:text-[#E3E3E3] leading-snug">
          "This week your Python & Algorithmic accuracy improved by 12%. Dynamic Programming memoization still requires targeted practice."
        </h3>
        <p className="text-xs font-medium text-[#5F6368] dark:text-[#8E918F] leading-relaxed">
          You have maintained an 88.5% accuracy rate across <strong>{quizCount} practice sets</strong> and accepted <strong>{codingCount} CodeLab solutions</strong>. Biometric identity verification remained 100% compliant throughout active sessions.
        </p>
      </div>

      {/* Secondary Benchmark Data (Subtle below the story) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl border border-[#E3E3E3] dark:border-[#2E2F31] bg-white dark:bg-[#1E1E20] space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#5F6368] dark:text-[#8E918F] uppercase">
            <TrendingUp className="w-3.5 h-3.5 text-[#1E8E3E]" /> Overall Mastery
          </div>
          <div className="text-xl font-bold font-display text-[#1F1F1F] dark:text-[#E3E3E3]">74.5%</div>
          <span className="text-[10px] font-semibold text-[#1E8E3E]">+4.2% from last week</span>
        </div>

        <div className="p-4 rounded-2xl border border-[#E3E3E3] dark:border-[#2E2F31] bg-white dark:bg-[#1E1E20] space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#5F6368] dark:text-[#8E918F] uppercase">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1E8E3E]" /> Accuracy Rate
          </div>
          <div className="text-xl font-bold font-display text-[#1F1F1F] dark:text-[#E3E3E3]">88.5%</div>
          <span className="text-[10px] font-semibold text-[#5F6368] dark:text-[#8E918F]">High consistency</span>
        </div>

        <div className="p-4 rounded-2xl border border-[#E3E3E3] dark:border-[#2E2F31] bg-white dark:bg-[#1E1E20] space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#5F6368] dark:text-[#8E918F] uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F9AB00]" /> Focus Area
          </div>
          <div className="text-xs font-bold text-[#1F1F1F] dark:text-[#E3E3E3] pt-1">Memoization Recursion</div>
          <span className="text-[10px] font-semibold text-[#F9AB00]">2 lessons remaining</span>
        </div>
      </div>

    </div>
  );
}
