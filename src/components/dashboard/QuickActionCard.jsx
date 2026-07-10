import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function QuickActionCard({ title, desc, icon: Icon, actionUrl, onAction, bgClass = 'bg-primary/5 text-primary' }) {
  return (
    <button
      onClick={onAction || (() => window.location.href = actionUrl)}
      className="glass p-6 rounded-3xl border border-slate-200/50 hover:border-primary/20 transition-all text-left flex items-start justify-between group w-full"
    >
      <div className="flex gap-4">
        <div className={`p-3 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-300 ${bgClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-xs text-textMuted leading-relaxed mt-0.5">{desc}</p>
        </div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-textMuted group-hover:text-primary transition-colors shrink-0 mt-1" />
    </button>
  );
}
