import React from 'react';

export default function LessonProgress({ completedCount, totalCount }) {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex items-center gap-3 select-none">
      <div className="w-10 h-10 rounded-full border-4 border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-700 shrink-0 relative"
           style={{ borderTopColor: '#6C63FF' }}>
        {percent}%
      </div>
      <div>
        <span className="text-[10px] font-black text-textMuted uppercase tracking-wider block">
          Chapter progress
        </span>
        <span className="text-xs font-bold text-slate-800">
          {completedCount} of {totalCount} completed
        </span>
      </div>
    </div>
  );
}
