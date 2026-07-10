import React from 'react';

export default function OptionCard({ optionText, isSelected, isCorrect, showResults, onSelect }) {
  let btnClass = 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50';

  if (isSelected) {
    btnClass = 'border-primary bg-primary/5 text-primary';
  }
  if (showResults) {
    if (isCorrect) {
      btnClass = 'border-success bg-success/5 text-success font-bold';
    } else if (isSelected) {
      btnClass = 'border-error bg-error/5 text-error font-bold';
    }
  }

  return (
    <button
      onClick={onSelect}
      disabled={showResults}
      className={`w-full text-left p-4 rounded-2xl text-xs font-semibold border transition-all ${btnClass}`}
    >
      {optionText}
    </button>
  );
}
