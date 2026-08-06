import React from 'react';
import { motion } from 'framer-motion';

export default function InfiniteMarquee({ items, direction = 'left', speed = 30, className = '', isLight = true }) {
  // Duplicate array 4 times for seamless continuous infinite looping
  const marqueeItems = [...items, ...items, ...items, ...items];

  // Calculate motion start and end coordinates
  const animateX = direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'];

  return (
    <div className={`relative overflow-hidden w-full group py-1.5 select-none ${className}`}>
      {/* Edge Fade Gradients */}
      <div 
        className="flex overflow-hidden w-full"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <motion.div
          className="flex shrink-0 gap-4"
          animate={{ x: animateX }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: speed,
              ease: 'linear',
            },
          }}
        >
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.title}-${idx}`}
              className={`group/card relative shrink-0 rounded-2xl border px-5 py-4 min-w-[240px] md:min-w-[270px] transition-all duration-300 flex items-center gap-4 cursor-pointer overflow-hidden ${
                isLight 
                  ? 'bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-400 hover:-translate-y-1'
                  : 'bg-white/5 border-white/10 backdrop-blur-xl hover:border-white/30 hover:bg-white/10 hover:-translate-y-1'
              }`}
            >
              {/* Icon Container */}
              {item.icon && (
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isLight 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white/10 border border-white/15 text-white'
                }`}>
                  {item.icon}
                </div>
              )}

              {/* Text Label */}
              <div className="overflow-hidden">
                <h4 className={`text-xs md:text-sm font-display font-bold tracking-tight truncate ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className={`text-[11px] font-medium truncate mt-0.5 ${
                    isLight ? 'text-slate-500' : 'text-white/50'
                  }`}>
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
