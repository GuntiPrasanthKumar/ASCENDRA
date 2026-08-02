import React from 'react';
import { motion } from 'framer-motion';

export default function InfiniteMarquee({ items, direction = 'left', speed = 30, className = '' }) {
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
              className="group/card relative shrink-0 rounded-none bg-white/5 border border-white/10 px-5 py-4 min-w-[240px] md:min-w-[270px] backdrop-blur-xl hover:border-white/30 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 cursor-pointer overflow-hidden"
            >
              {/* Icon Container - Sharp Edges */}
              {item.icon && (
                <div className="w-10 h-10 rounded-none bg-white/10 border border-white/15 flex items-center justify-center shrink-0 group-hover/card:scale-105 group-hover/card:border-white/30 transition-all duration-300">
                  {item.icon}
                </div>
              )}

              {/* Text Label */}
              <div className="overflow-hidden">
                <h4 className="text-xs md:text-sm font-display font-extrabold text-white tracking-tight group-hover/card:text-white transition-colors truncate">
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className="text-[11px] font-semibold text-white/50 truncate mt-0.5">
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
