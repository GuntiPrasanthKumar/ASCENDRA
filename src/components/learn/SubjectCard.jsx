import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubjectCard({ title, description, difficulty, estimatedHours, lessonsCount, progress, onSelect }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-full group hover:border-slate-300 transition-all duration-300 shadow-2xs"
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
            {difficulty}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{estimatedHours} hrs</span>
          </div>
        </div>

        <h3 className="text-xl font-display font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 font-body leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
        {/* Progress Tracker bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Progress</span>
            <span className="text-blue-600 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button
          onClick={onSelect}
          className="w-full py-3 rounded-full bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-1 group/btn shadow-xs active:scale-[0.98]"
        >
          <span>Explore Subject</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
