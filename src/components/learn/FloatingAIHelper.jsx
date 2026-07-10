import React from 'react';
import { Sparkles, HelpCircle, FileText, Bot } from 'lucide-react';

export default function FloatingAIHelper({ top, left, selectedText, onAction }) {
  const actions = [
    { label: 'Explain', query: `Explain this concept: "${selectedText}"` },
    { label: 'Simplify', query: `Simplify and explain this simply: "${selectedText}"` },
    { label: 'Example', query: `Generate a JavaScript code snippet showing: "${selectedText}"` },
    { label: 'Summary', query: `Provide a 1-sentence summary of: "${selectedText}"` },
    { label: 'Flashcards', query: `Convert this into a flashcard study definition: "${selectedText}"` },
    { label: 'Quiz', query: `Generate an MCQ quiz question testing: "${selectedText}"` },
    { label: 'Ask Question', query: `Answer this question or discuss: "${selectedText}"` }
  ];

  return (
    <div
      style={{ top, left }}
      className="absolute z-50 flex flex-wrap gap-1 p-1 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-[280px] animate-fade-in"
    >
      <div className="w-full px-2.5 py-1 border-b border-white/5 text-[8px] font-black uppercase tracking-widest text-slate-450 flex items-center gap-1">
        <Bot className="w-3.5 h-3.5 text-accent animate-pulse" /> AI Selection Menu
      </div>
      {actions.map((act) => (
        <button
          key={act.label}
          onClick={() => onAction(act.query)}
          className="px-2.5 py-1.5 rounded-lg text-white hover:bg-white/10 transition-colors text-[9px] font-black uppercase tracking-wider text-left shrink-0"
        >
          {act.label}
        </button>
      ))}
    </div>
  );
}
