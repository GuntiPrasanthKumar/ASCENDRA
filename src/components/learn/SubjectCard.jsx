import React from 'react';
import { ChevronRight, Clock, FileText, Calculator, Code2, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubjectCard({ title, description, difficulty, estimatedHours, progress, themeColor = 'blue', icon, onSelect }) {
  const isGreen = themeColor === 'emerald' || difficulty?.toLowerCase() === 'easy';

  const badgeStyles = isGreen 
    ? 'bg-emerald-50 text-emerald-600 font-bold border-emerald-100'
    : 'bg-blue-50 text-blue-600 font-bold border-blue-100';

  const barStyles = isGreen ? 'bg-emerald-500' : 'bg-blue-600';

  const boxStyles = isGreen
    ? 'bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-100/80 text-emerald-900'
    : 'bg-blue-50/70 hover:bg-blue-100/80 border-blue-100/80 text-blue-900';

  const iconBgStyles = isGreen ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600';
  const arrowStyles = isGreen ? 'text-emerald-600' : 'text-blue-600';

  const defaultIcon = isGreen ? <Calculator className="w-4.5 h-4.5" /> : <FileText className="w-4.5 h-4.5" />;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-7 rounded-[2rem] border border-slate-200/80 flex flex-col justify-between h-full group hover:border-slate-300 transition-all duration-300 shadow-2xs"
    >
      <div>
        <div className="flex justify-between items-center mb-5">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border ${badgeStyles}`}>
            {difficulty}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{estimatedHours} hrs</span>
          </div>
        </div>

        <h3 className="text-xl font-display font-bold text-slate-900 mb-2 truncate group-hover:text-slate-700 transition-colors tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 font-body leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>PROGRESS</span>
            <span className="text-slate-900 font-bold text-xs">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${barStyles}`} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Soft Colored Action Box */}
        <div 
          onClick={onSelect}
          className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${boxStyles}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBgStyles}`}>
              {icon || defaultIcon}
            </div>
            <span className="text-xs font-bold text-slate-900">Explore Subject</span>
          </div>
          <ChevronRight className={`w-4 h-4 ${arrowStyles} transition-transform group-hover:translate-x-0.5`} />
        </div>
      </div>
    </motion.div>
  );
}
