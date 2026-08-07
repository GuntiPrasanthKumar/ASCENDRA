import React from 'react';
import OptionCard from './OptionCard';
import { BrainCircuit } from 'lucide-react';

export default function QuestionCard({ question, selectedIdx, onSelectOption }) {
  const bloomsLevel = question.bloomsLevel || question.blooms_level || 'Understand';

  const bloomsColors = {
    Remember: 'bg-blue-50 text-blue-700 border-blue-200',
    Understand: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Apply: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Analyze: 'bg-amber-50 text-amber-700 border-amber-200',
    Evaluate: 'bg-purple-50 text-purple-700 border-purple-200',
    Create: 'bg-pink-50 text-pink-700 border-pink-200'
  };

  const badgeStyle = bloomsColors[bloomsLevel] || bloomsColors.Understand;

  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 rounded-[2rem] bg-indigo-50/15 border border-indigo-500/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block">Quiz Question</span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${badgeStyle}`}>
            <BrainCircuit className="w-3 h-3" /> Bloom's Taxonomy: {bloomsLevel}
          </span>
        </div>
        <p className="text-sm font-bold text-slate-800 leading-relaxed">{question.text}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {question.options.map((opt, idx) => (
          <OptionCard
            key={idx}
            optionText={opt}
            isSelected={selectedIdx === idx}
            onSelect={() => onSelectOption(idx)}
          />
        ))}
      </div>
    </div>
  );
}
