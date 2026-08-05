import React from 'react';

export default function SectionHeader({ title, subtitle, badgeText, badgeColor = 'bg-slate-100 text-black border-slate-200' }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-xl font-display font-extrabold text-black tracking-tight">{title}</h2>
        {badgeText && (
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${badgeColor}`}>
            {badgeText}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs font-medium text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}
