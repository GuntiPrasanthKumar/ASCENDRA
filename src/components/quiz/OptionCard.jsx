import React from 'react';

export default function OptionCard({ optionText, isSelected, onSelect }) {
  let btnClass = 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50';

  if (isSelected) {
    btnClass = 'border-primary bg-primary/5 text-primary';
  }

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-2xl text-xs font-semibold border transition-all ${btnClass}`}
    >
      {optionText}
    </button>
  );
}
