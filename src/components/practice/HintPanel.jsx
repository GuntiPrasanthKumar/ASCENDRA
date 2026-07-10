import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

export default function HintPanel({ hints = [], questionId }) {
  const [hintCount, setHintCount] = useState(0);

  useEffect(() => {
    setHintCount(0);
  }, [questionId]);

  return (
    <div className="p-6 rounded-[2rem] bg-indigo-50/10 border border-indigo-500/10 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" /> AI Hints
        </span>
        {hintCount < hints.length && (
          <button
            onClick={() => setHintCount(prev => prev + 1)}
            className="text-[10px] font-black text-indigo-600 hover:text-indigo-850 uppercase tracking-widest"
          >
            Reveal Hint {hintCount + 1}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {hintCount === 0 ? (
          <p className="text-[11px] text-textMuted italic font-medium">Stuck? Click above to receive a progressive AI hint.</p>
        ) : (
          hints.slice(0, hintCount).map((hint, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-white border border-slate-100/80 text-[11px] text-slate-700 leading-relaxed font-semibold">
              <span className="font-extrabold text-[8px] uppercase tracking-wider block text-indigo-500 mb-0.5">Hint {idx + 1}:</span>
              {hint}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
