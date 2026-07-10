import React from 'react';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import { ArrowLeft } from 'lucide-react';

export default function PracticeHeader({ title, subjectTitle, answeredCount, totalCount, timeLimit, onBack, onTimeUp }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
      <div className="flex gap-4 items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-650 transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-0.5">
            {subjectTitle}
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold text-primary">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-between md:justify-end">
        <ProgressBar current={answeredCount} total={totalCount} />
        {timeLimit && <Timer limitString={timeLimit} onTimeUp={onTimeUp} />}
      </div>
    </div>
  );
}
