import React from 'react';
import { ArrowRight, BookOpen, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubjectCard({ title, description, difficulty, estimatedHours, lessonsCount, progress, onSelect }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass p-8 rounded-[2rem] border border-slate-200/50 flex flex-col justify-between h-full group hover:border-primary/20 transition-all duration-300"
    >
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
            {difficulty}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-textMuted">
            <Clock className="w-3.5 h-3.5" />
            <span>{estimatedHours} hrs</span>
          </div>
        </div>

        <h3 className="text-xl font-bold font-display text-primary mb-2 truncate group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-xs text-textMuted leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="pt-6 border-t border-slate-100/80 flex flex-col gap-4">
        {/* Progress Tracker bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button
          onClick={onSelect}
          className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group-hover:bg-primary text-xs"
        >
          Explore Subject <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
