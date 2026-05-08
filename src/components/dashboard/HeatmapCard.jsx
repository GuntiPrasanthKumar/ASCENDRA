import React from 'react';
import { motion } from 'framer-motion';

export default function HeatmapCard() {
  // Generate mock data for the last 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date,
      count: Math.floor(Math.random() * 5)
    };
  });

  const getColor = (count) => {
    if (count === 0) return 'bg-muted/50';
    if (count === 1) return 'bg-accent/30';
    if (count === 2) return 'bg-accent/60';
    if (count === 3) return 'bg-accent/80';
    return 'bg-accent';
  };

  return (
    <div className="glass p-6 rounded-3xl h-full">
      <h3 className="text-lg font-display font-bold text-primary mb-4 flex items-center justify-between">
        <span>Activity Streak</span>
        <span className="text-sm font-body font-medium bg-accent/10 text-accent px-3 py-1 rounded-full">12 Days</span>
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {days.map((day, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.02 }}
            className={`w-8 h-8 rounded-md ${getColor(day.count)} transition-all hover:scale-110 cursor-pointer relative group`}
          >
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10 transition-opacity">
              {day.count} activities on {day.date.toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-textMuted">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted/50"></div>
          <div className="w-3 h-3 rounded-sm bg-accent/30"></div>
          <div className="w-3 h-3 rounded-sm bg-accent/60"></div>
          <div className="w-3 h-3 rounded-sm bg-accent/80"></div>
          <div className="w-3 h-3 rounded-sm bg-accent"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
