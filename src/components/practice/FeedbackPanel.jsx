import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function FeedbackPanel({ isCorrect, onRetry }) {
  return (
    <div className={`p-5 rounded-[2rem] border text-xs font-bold flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
      isCorrect 
        ? 'bg-success/5 border-success/15 text-success' 
        : 'bg-error/5 border-error/15 text-error'
    }`}>
      <div className="flex gap-2 items-center">
        {isCorrect ? (
          <CheckCircle className="w-5 h-5 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 shrink-0" />
        )}
        <span>{isCorrect ? 'Correct! Excellent accuracy match.' : 'Incorrect answer choice.'}</span>
      </div>
      {!isCorrect && onRetry && (
        <button
          onClick={onRetry}
          className="text-[10px] font-black uppercase tracking-widest text-error border-b border-error leading-none"
        >
          Retry Question
        </button>
      )}
    </div>
  );
}
