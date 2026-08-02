import React from 'react';

export default function InfiniteMarquee({ items, direction = 'left', speed = 30, className = '' }) {
  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  const renderCard = (item, idx) => (
    <div
      key={`${item.title}-${idx}`}
      className="group/card relative shrink-0 rounded-2xl bg-slate-900/80 border border-slate-800/90 px-5 py-4 min-w-[240px] md:min-w-[270px] backdrop-blur-xl hover:border-indigo-500/50 hover:bg-slate-800/90 hover:shadow-[0_0_30px_rgba(99,102,241,0.22)] hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-4 cursor-pointer overflow-hidden"
    >
      {/* Soft Ambient Card Accent Radial Gradient */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl group-hover/card:scale-150 transition-transform duration-500 pointer-events-none" />

      {/* Icon Container */}
      {item.icon && (
        <div className="w-11 h-11 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-inner group-hover/card:scale-110 group-hover/card:border-indigo-500/40 transition-all duration-300">
          {item.icon}
        </div>
      )}

      {/* Card Content */}
      <div className="overflow-hidden">
        <h4 className="text-xs md:text-sm font-display font-extrabold text-white tracking-tight group-hover/card:text-indigo-300 transition-colors truncate">
          {item.title}
        </h4>
        {item.subtitle && (
          <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5">
            {item.subtitle}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className={`relative overflow-hidden w-full group py-1 ${className}`}>
      {/* Edge Fade Masking Wrapper */}
      <div 
        className="flex overflow-hidden w-full"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        {/* Track 1 */}
        <div 
          className={`flex shrink-0 gap-4 min-w-full justify-around pr-4 ${animationClass}`}
          style={{ animationDuration: `${speed}s` }}
        >
          {items.map((item, idx) => renderCard(item, `t1-${idx}`))}
        </div>

        {/* Track 2 (Duplicate for Seamless Infinite Loop) */}
        <div 
          aria-hidden="true"
          className={`flex shrink-0 gap-4 min-w-full justify-around pr-4 ${animationClass}`}
          style={{ animationDuration: `${speed}s` }}
        >
          {items.map((item, idx) => renderCard(item, `t2-${idx}`))}
        </div>
      </div>
    </div>
  );
}
