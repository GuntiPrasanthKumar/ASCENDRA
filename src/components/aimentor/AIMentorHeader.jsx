import React, { useMemo } from 'react';
import { Zap, Flame, Target, TrendingUp } from 'lucide-react';

export default function AIMentorHeader({ name = 'Scholar', streak = '7 Days', progress = 74, weeklyGoal = '5 / 7 Days' }) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  return (
    <div className="p-6 md:p-8 rounded-[2.5rem] border border-slate-200/80 relative overflow-hidden bg-white mb-8 shadow-xs">
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-black bg-slate-100 border border-slate-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> AI Career & Learning Coach
            </span>
            <span className="text-xs font-bold text-black bg-slate-100 border border-slate-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-slate-300" /> {streak} Streak
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-extrabold text-black tracking-tight mb-2">
            {greeting}, <span className="text-slate-700">{name}</span>!
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">
            Your personal AI Coach is monitoring your practice accuracy, coding challenges, and mock interview readiness in real time.
          </p>
        </div>

        {/* Header Right Status Badges */}
        <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full lg:w-auto">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/60 flex-1 sm:flex-initial min-w-[140px] shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-black" /> Overall Progress
            </div>
            <div className="text-xl font-black font-display text-black">{progress}%</div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full border border-slate-200/40 mt-2 overflow-hidden">
              <div className="h-full bg-black rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/60 flex-1 sm:flex-initial min-w-[140px] shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
              <Target className="w-3.5 h-3.5 text-black" /> Weekly Target
            </div>
            <div className="text-xl font-black font-display text-black">{weeklyGoal}</div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full border border-slate-200/40 mt-2 overflow-hidden">
              <div className="h-full bg-black rounded-full" style={{ width: '71%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
