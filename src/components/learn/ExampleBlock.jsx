import React from 'react';
import { Copy, Terminal } from 'lucide-react';
import { useToastStore } from '../common/Toast';

export default function ExampleBlock({ value, language = 'javascript' }) {
  const { addToast } = useToastStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    addToast('Code snippet copied to clipboard!', 'success');
  };

  return (
    <div className="relative group overflow-hidden bg-slate-900 border border-white/5 rounded-3xl my-6">
      <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-slate-950 text-slate-400 text-[10px] font-black uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-accent" /> {language}
        </span>
        <button onClick={handleCopy} className="hover:text-white transition-colors p-1" aria-label="Copy code">
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>
      <pre className="p-5 overflow-x-auto text-[11px] font-mono text-slate-200 leading-relaxed">
        <code>{value}</code>
      </pre>
    </div>
  );
}
