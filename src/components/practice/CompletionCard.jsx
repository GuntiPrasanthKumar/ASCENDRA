import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function CompletionCard({ title, desc, actionText = 'Go to Next Set', onAction }) {
  return (
    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col justify-between h-full group hover:border-accent/20 transition-all duration-300">
      <div>
        <span className="text-[9px] font-black text-accent bg-accent/5 border border-accent/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3 inline-block">
          AI Recommendation
        </span>
        <h3 className="text-md font-bold font-display text-primary mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent shrink-0 animate-pulse" />
          {title}
        </h3>
        <p className="text-xs text-textMuted leading-relaxed mb-6">
          {desc}
        </p>
      </div>

      <button
        onClick={onAction}
        className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group-hover:bg-primary"
      >
        {actionText} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
