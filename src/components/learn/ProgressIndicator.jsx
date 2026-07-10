import React from 'react';

export default function ProgressIndicator({ value, label }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="w-10 h-10 rounded-full border-4 border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-700 shrink-0 relative"
           style={{ borderTopColor: '#6C63FF' }}>
        {value}%
      </div>
      {label && (
        <div>
          <span className="text-[10px] font-black text-textMuted uppercase tracking-wider block">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
