import React from 'react';

export default function QuestionNavigator({ totalCount, currentIdx, answers = {}, onSubmit, onSelect }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Question Navigator</h4>
      
      {/* Navigator buttons */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalCount }).map((_, idx) => {
          const isActive = idx === currentIdx;
          const isAnswered = answers[idx] !== undefined;

          let btnClass = 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50';
          if (isAnswered) {
            btnClass = 'bg-primary/5 border-primary/20 text-primary';
          }
          if (isActive) {
            btnClass = 'bg-primary border-primary text-white shadow-md shadow-primary/20';
          }

          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black border transition-all ${btnClass}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <button
        onClick={onSubmit}
        className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all mt-2"
      >
        Submit Set
      </button>
    </div>
  );
}
