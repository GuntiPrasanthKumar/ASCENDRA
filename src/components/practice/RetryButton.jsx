import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function RetryButton({ onClick, label = 'Retry Practice Set' }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-4 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-xs"
    >
      <RefreshCw className="w-4 h-4 shrink-0" /> {label}
    </button>
  );
}
