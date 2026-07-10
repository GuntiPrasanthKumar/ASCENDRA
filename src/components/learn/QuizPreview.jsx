import React, { useState } from 'react';
import { HelpCircle, Check, AlertCircle } from 'lucide-react';
import { useToastStore } from '../common/Toast';

export default function QuizPreview({ question, options, correctIndex, explanation }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addToast } = useToastStore();

  const handleSelect = (idx) => {
    if (isSubmitted) return;
    setSelectedIdx(idx);
  };

  const handleSubmit = () => {
    if (selectedIdx === null) {
      addToast('Select an answer option first.', 'warning');
      return;
    }
    setIsSubmitted(true);
    if (selectedIdx === correctIndex) {
      addToast('Correct! Great job.', 'success');
    } else {
      addToast('Incorrect. Review the concept explanation.', 'error');
    }
  };

  return (
    <div className="p-6 rounded-[2rem] border border-slate-200/50 bg-slate-50/50 flex flex-col gap-4">
      <div className="flex gap-2 items-center text-slate-700">
        <HelpCircle className="w-5 h-5 text-accent shrink-0" />
        <h4 className="font-bold text-xs">{question}</h4>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = correctIndex === idx;
          let btnClass = 'border-slate-200 text-slate-750 bg-white hover:bg-slate-50';

          if (isSelected) {
            btnClass = 'border-primary bg-primary/5 text-primary';
          }
          if (isSubmitted) {
            if (isCorrect) {
              btnClass = 'border-success bg-success/5 text-success';
            } else if (isSelected) {
              btnClass = 'border-error bg-error/5 text-error';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-3.5 rounded-2xl text-[11px] font-semibold border transition-all ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
        >
          Check Answer
        </button>
      ) : (
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-[10px] text-textMuted font-medium leading-relaxed">
          <span className="font-extrabold text-[8px] uppercase tracking-wider block text-slate-500 mb-0.5">Explanation:</span>
          {explanation}
        </div>
      )}
    </div>
  );
}
