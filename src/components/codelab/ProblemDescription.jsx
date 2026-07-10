import React from 'react';
import ConstraintCard from './ConstraintCard';
import ExampleCard from './ExampleCard';

export default function ProblemDescription({ description, examples = [], constraints = [] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 rounded-[2.5rem] bg-indigo-50/15 border border-indigo-500/10 text-xs font-semibold text-slate-655 leading-relaxed">
        <span className="block text-[8px] uppercase tracking-widest text-indigo-600 mb-2">Problem Statement</span>
        <p>{description}</p>
      </div>

      <div className="flex flex-col gap-4">
        {examples.map((ex, i) => (
          <ExampleCard key={i} index={i + 1} example={ex} />
        ))}
      </div>

      {constraints.length > 0 && <ConstraintCard constraints={constraints} />}
    </div>
  );
}
