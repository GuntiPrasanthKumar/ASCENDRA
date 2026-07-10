import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function ContinueLearningButton({ onClick, label = 'Continue Learning' }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs"
    >
      {label} <ArrowRight className="w-4 h-4 shrink-0" />
    </button>
  );
}
