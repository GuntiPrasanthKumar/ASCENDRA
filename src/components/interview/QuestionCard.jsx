import React from 'react';

export default function QuestionCard({ question, index, total }) {
  return (
    <div className="p-6 rounded-[2.5rem] bg-indigo-50/15 border border-indigo-500/10">
      <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block mb-2">
        Question {index} of {total}
      </span>
      <p className="text-sm font-bold text-slate-800 leading-relaxed">
        {question.text}
      </p>
    </div>
  );
}
