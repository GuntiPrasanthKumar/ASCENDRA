import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function InterviewHeader({ title, category, onBack }) {
  return (
    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
      {onBack && (
        <button
          onClick={onBack}
          className="p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-205 text-slate-655 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      )}
      <div>
        <span className="text-[9px] font-black text-indigo-700 uppercase tracking-widest block mb-0.5">
          {category}
        </span>
        <h1 className="text-xl md:text-2xl font-display font-extrabold text-primary">
          {title}
        </h1>
      </div>
    </div>
  );
}
