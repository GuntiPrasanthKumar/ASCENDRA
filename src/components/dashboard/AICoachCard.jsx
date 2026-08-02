import React from 'react';
import { Zap, ArrowRight, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AICoachCard({ title, type, description, aiInsight, matchScore, actionText, actionUrl, onAction }) {
  return (
    <div className="relative overflow-hidden p-8 bg-white border border-slate-200 flex flex-col justify-between h-full group hover:border-black transition-all duration-300">

      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 border border-slate-200 text-black flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> AI Coach
          </span>
          {matchScore && (
            <span className="text-xs font-black text-black bg-slate-100 px-2.5 py-0.5 border border-slate-200">
              {matchScore}% Focus Match
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold font-display text-black mb-2 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 shrink-0" />
          {title}
        </h3>
        
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          {description}
        </p>

        {aiInsight && (
          <div className="p-4 bg-slate-50 border border-slate-200 text-[11px] text-slate-700 leading-relaxed mb-6 font-medium">
            <span className="font-extrabold block mb-0.5 text-black uppercase tracking-widest text-[9px]">Coach Insight:</span>
            {aiInsight}
          </div>
        )}
      </div>

      <button
        onClick={onAction || (() => window.location.href = actionUrl)}
        className="w-full py-4 bg-black text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
      >
        {actionText} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
