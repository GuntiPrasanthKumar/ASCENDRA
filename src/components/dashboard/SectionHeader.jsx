import React from 'react';

export default function SectionHeader({ title, subtitle, badgeText, badgeColor = 'bg-accent/10 text-accent border-accent/20' }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-xl font-display font-black text-primary">{title}</h2>
        {badgeText && (
          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
            {badgeText}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-textMuted font-medium">{subtitle}</p>}
    </div>
  );
}
