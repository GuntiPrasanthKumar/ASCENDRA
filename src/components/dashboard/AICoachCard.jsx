import React from 'react';
import { Sparkles, ArrowRight, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AICoachCard({ title, type, description, aiInsight, matchScore, actionText, actionUrl, onAction }) {
  return (
    <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/[0.04] to-pink-500/[0.04] border border-indigo-500/15 flex flex-col justify-between h-full group hover:border-indigo-500/35 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header (Information) */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> AI Coach
          </span>
          {matchScore && (
            <span className="text-xs font-black text-indigo-600 bg-indigo-50/50 px-2.5 py-0.5 rounded-full border border-indigo-100/50">
              {matchScore}% Focus Match
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold font-display text-slate-800 mb-2 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-600 shrink-0" />
          {title}
        </h3>
        
        {/* Info detail */}
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          {description}
        </p>

        {/* AI Insight */}
        {aiInsight && (
          <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 text-[11px] text-indigo-700 leading-relaxed mb-6 font-medium">
            <span className="font-extrabold block mb-0.5 text-indigo-800 uppercase tracking-widest text-[9px]">Coach Insight:</span>
            {aiInsight}
          </div>
        )}
      </div>

      {/* Primary Action */}
      <button
        onClick={onAction || (() => window.location.href = actionUrl)}
        className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
      >
        {actionText} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
