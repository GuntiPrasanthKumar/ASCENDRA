import React from 'react';
import OptionCard from './OptionCard';

export default function QuestionCard({ question, selectedIdx, correctIdx, showResults, onSelectOption }) {
  return (
    <div className="flex flex-col gap-6 select-none">
      <div className="p-6 rounded-[2rem] bg-indigo-50/15 border border-indigo-500/10">
        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block mb-2">Question Statement</span>
        <p className="text-sm font-bold text-slate-800 leading-relaxed">{question.text}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {question.options.map((opt, idx) => (
          <OptionCard
            key={idx}
            optionText={opt}
            isSelected={selectedIdx === idx}
            isCorrect={correctIdx === idx}
            showResults={showResults}
            onSelect={() => onSelectOption(idx)}
          />
        ))}
      </div>
    </div>
  );
}
