import React from 'react';
import { Terminal } from 'lucide-react';

export default function OutputPanel({ result, isRunning }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-slate-500 pl-1 select-none">
        <Terminal className="w-4 h-4 text-slate-400" /> Output Console
      </span>
      <div className="w-full min-h-[100px] p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold font-mono text-slate-100 flex flex-col justify-between">
        {isRunning ? (
          <span className="text-slate-400 animate-pulse">Running compilation test...</span>
        ) : result ? (
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-2">
              <span className={`text-[10px] font-black uppercase tracking-wider ${result.status === 'Success' ? 'text-success' : 'text-error'}`}>
                {result.status}
              </span>
              {result.time && (
                <span className="text-[9px] text-slate-500">
                  Time: {result.time} | Mem: {result.memory}
                </span>
              )}
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">{result.stdout || 'Execution completed.'}</pre>
          </div>
        ) : (
          <span className="text-slate-550">Click "Run Code" to compile and view outputs.</span>
        )}
      </div>
    </div>
  );
}
