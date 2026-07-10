import React from 'react';
import { Mic } from 'lucide-react';

export default function MicrophoneIndicator({ isActive, volumeLevel }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <Mic className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-primary animate-pulse' : 'text-slate-300'}`} />
      
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 max-w-[120px]">
        <div 
          className="h-full bg-primary transition-all duration-100" 
          style={{ width: `${Math.min(100, volumeLevel * 2)}%` }} 
        />
      </div>

      <span className="text-[10px] font-black text-textMuted uppercase tracking-wider">
        {isActive ? 'Mic Active' : 'Muted'}
      </span>
    </div>
  );
}
