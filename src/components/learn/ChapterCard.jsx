import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChapterCard({ title, lessonsCount, completedLessons, order, onSelect }) {
  const percent = lessonsCount > 0 ? Math.round((completedLessons / lessonsCount) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-6 rounded-3xl border border-slate-200/80 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-slate-300 transition-all duration-300 w-full shadow-xs"
    >
      <div className="flex gap-4 items-start">
        <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-xs font-black text-black">
          {order}
        </div>
        <div>
          <h4 className="font-bold text-black text-base group-hover:text-slate-600 transition-colors">
            {title}
          </h4>
          <span className="text-xs text-slate-500 mt-1 block">
            {completedLessons} of {lessonsCount} Lessons completed
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-between md:justify-end">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-black text-black">{percent}% Done</span>
          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
            <div className="h-full bg-black rounded-full" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <button
          onClick={onSelect}
          className="p-3.5 rounded-2xl bg-slate-50 hover:bg-black hover:text-white text-black transition-all flex items-center gap-1.5 shrink-0 border border-slate-200/60"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
