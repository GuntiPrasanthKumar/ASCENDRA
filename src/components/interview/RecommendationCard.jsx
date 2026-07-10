import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function RecommendationCard({ recommendations = [], onAction }) {
  return (
    <div className="glass p-6 rounded-[2.5rem] border border-indigo-500/10 bg-gradient-to-br from-indigo-500/[0.03] to-accent/[0.03] flex flex-col gap-4 select-none">
      <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5 pl-1">
        <Sparkles className="w-4 h-4" /> AI Suggested Practice Track
      </h4>

      <div className="flex flex-col gap-3">
        {recommendations.map((item, idx) => (
          <div
            key={idx}
            onClick={onAction}
            className="flex justify-between items-center p-4 rounded-3xl bg-white border border-slate-105 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer group"
          >
            <span className="text-xs font-semibold text-slate-700">{item}</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
