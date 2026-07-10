import React from 'react';
import { PlayCircle, Flame } from 'lucide-react';

export default function WelcomeBanner({ greeting, name, streak, aiInsight, actionText = 'Resume Learning', actionUrl = '/my-learning', onAction }) {
  return (
    <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      {/* Info details (Greeting, Name, Streak) */}
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-primary mb-2">
          {greeting}, <span className="text-accent">{name || 'Scholar'}</span>!
        </h2>
        
        <div className="flex flex-col md:flex-row md:items-center gap-3 mt-2 mb-4">
          {streak && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-warning bg-warning/5 border border-warning/10 px-3 py-1 rounded-full w-fit shrink-0">
              <Flame className="w-4 h-4 fill-warning/10" />
              <span>{streak} Streak Active</span>
            </div>
          )}
        </div>

        {/* AI Insight */}
        {aiInsight && (
          <p className="text-xs text-textMuted leading-relaxed max-w-2xl border-l-2 border-accent/20 pl-3 italic">
            {aiInsight}
          </p>
        )}
      </div>

      {/* Primary Action */}
      <button
        onClick={onAction || (() => window.location.href = actionUrl)}
        className="px-6 py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-primary/20 group-hover:scale-[1.01]"
      >
        <PlayCircle className="w-4 h-4" /> {actionText}
      </button>
    </div>
  );
}
