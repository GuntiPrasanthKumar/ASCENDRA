import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubjectCard({ title, description, difficulty, estimatedHours, lessonsCount, progress, onSelect }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-7 rounded-[1.75rem] border border-slate-200/80 flex flex-col justify-between h-full group hover:border-slate-300 hover:shadow-md transition-all duration-300"
    >
      <div>
        <div className="flex justify-between items-center mb-5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 border border-slate-200/60 text-slate-700">
            {difficulty}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{estimatedHours} hrs</span>
          </div>
        </div>

        <h3 className="text-xl font-display font-medium text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 font-body leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="pt-5 border-t border-slate-100 flex flex-col gap-4">
        {/* Progress Tracker bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Progress</span>
            <span className="text-slate-700">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
            <div className="h-full bg-indigo-600" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button
          onClick={onSelect}
          className="w-full py-3.5 rounded-full bg-slate-900 text-white font-medium text-xs hover:bg-indigo-600 transition-all flex items-center justify-center gap-1 group/btn shadow-xs active:scale-[0.98]"
        >
          <span>Explore Subject</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
