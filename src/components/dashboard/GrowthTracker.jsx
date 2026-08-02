import React from 'react';
import ProgressCard from './ProgressCard';
import { ArrowUpRight } from 'lucide-react';

export default function GrowthTracker({ tracks = [], aiInsight, actionText, actionUrl, onAction }) {
  return (
    <div className="p-6 md:p-8 rounded-[2.5rem] border border-slate-200/80 bg-white flex flex-col justify-between h-full group hover:border-slate-300 shadow-xs transition-all duration-300">
      <div>
        <h3 className="text-md font-bold font-display text-black mb-4">Growth Tracks</h3>
        
        <div className="flex flex-col gap-5 mb-6">
          {tracks.map(track => (
            <ProgressCard
              key={track.id}
              title={track.name}
              value={track.value}
              colorClass="bg-black"
            />
          ))}
        </div>

        {aiInsight && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 leading-relaxed mb-6 font-medium">
            <span className="font-extrabold block mb-0.5 text-black uppercase tracking-widest text-[9px]">Growth Insight:</span>
            {aiInsight}
          </div>
        )}
      </div>

      <button
        onClick={onAction || (() => window.location.href = actionUrl)}
        className="w-full py-4 rounded-2xl bg-black text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
      >
        {actionText} <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  );
}
