import React from 'react';

export default function InfiniteMarquee({ items, direction = 'left', speed = 40, className = '' }) {
  // Multiply items to ensure seamless infinite looping without visible gaps
  const marqueeItems = [...items, ...items, ...items, ...items];

  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className={`relative overflow-hidden w-full group ${className}`}>
      {/* Edge Fade Gradients via CSS Masking */}
      <div 
        className="flex w-max gap-4 py-2 pointer-events-auto"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div 
          className={`flex shrink-0 gap-4 ${animationClass} group-hover:[animation-play-state:paused]`}
          style={{ animationDuration: `${speed}s` }}
        >
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id || item.title}-${idx}`}
              className="shrink-0 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-4 min-w-[200px] max-w-[280px] backdrop-blur-md hover:border-indigo-500/40 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3.5 cursor-pointer"
            >
              {item.icon && (
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0 shadow-sm">
                  {item.icon}
                </div>
              )}
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white tracking-wide truncate">{item.title}</h4>
                {item.subtitle && (
                  <p className="text-[10px] font-semibold text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
