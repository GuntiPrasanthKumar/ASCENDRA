import React from 'react';
import { PlayCircle, Flame } from 'lucide-react';

export default function WelcomeBanner({ greeting, name, streak, aiInsight, actionText = 'Resume Learning', actionUrl = '/my-learning', onAction }) {
  return (
    <div className="p-8 rounded-[2.5rem] border border-slate-200/80 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden bg-white group shadow-xs">
      {/* Info details */}
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-black mb-2">
          {greeting}, <span className="text-slate-700">{name || 'Scholar'}</span>!
        </h2>
        
        <div className="flex flex-col md:flex-row md:items-center gap-3 mt-2 mb-4">
          {streak && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-black bg-slate-100 border border-slate-200 px-3 py-1 rounded-full w-fit shrink-0">
              <Flame className="w-4 h-4 fill-slate-200 text-black" />
              <span>{streak} Streak Active</span>
            </div>
          )}
        </div>

        {/* AI Insight */}
        {aiInsight && (
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl border-l-2 border-slate-300 pl-3 italic">
            {aiInsight}
          </p>
        )}
      </div>

      {/* Primary Action */}
      <button
        onClick={onAction || (() => window.location.href = actionUrl)}
        className="px-6 py-4 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shrink-0 group-hover:scale-[1.01]"
      >
        <PlayCircle className="w-4 h-4" /> {actionText}
      </button>
    </div>
  );
}
