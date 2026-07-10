import React from 'react';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChapterCard({ title, lessonsCount, completedLessons, order, onSelect }) {
  const percent = lessonsCount > 0 ? Math.round((completedLessons / lessonsCount) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-accent/20 transition-all duration-300 w-full"
    >
      <div className="flex gap-4 items-start">
        <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-xs font-black text-slate-500">
          {order}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-base group-hover:text-accent transition-colors">
            {title}
          </h4>
          <span className="text-xs text-textMuted mt-1 block">
            {completedLessons} of {lessonsCount} Lessons completed
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-between md:justify-end">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-black text-primary">{percent}% Done</span>
          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <button
          onClick={onSelect}
          className="p-3.5 rounded-2xl bg-slate-50 hover:bg-primary/5 text-slate-700 hover:text-primary transition-all flex items-center gap-1.5 shrink-0 shadow-sm border border-slate-100"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
