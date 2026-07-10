import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function LessonFooter({ onPrev, onNext, isCompleted, onComplete }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-150">
      <div className="flex gap-3 w-full sm:w-auto justify-between sm:justify-start">
        {onPrev ? (
          <button
            onClick={onPrev}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Previous Lesson
          </button>
        ) : (
          <div />
        )}
      </div>

      <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
        {onComplete && (
          <button
            onClick={onComplete}
            disabled={isCompleted}
            className={`flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-2xl font-bold text-xs transition-all shadow-lg ${
              isCompleted
                ? 'bg-success/10 border border-success/20 text-success shadow-none cursor-default'
                : 'bg-primary text-white hover:bg-accent shadow-primary/15 hover:shadow-accent/15'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-4 h-4" /> Completed
              </>
            ) : (
              'Mark Complete'
            )}
          </button>
        )}

        {onNext ? (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-md"
          >
            Next Lesson <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
