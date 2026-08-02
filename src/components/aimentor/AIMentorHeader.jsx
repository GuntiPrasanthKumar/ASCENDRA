import React, { useMemo } from 'react';
import { Sparkles, Flame, Target, TrendingUp } from 'lucide-react';

export default function AIMentorHeader({ name = 'Scholar', streak = '7 Days', progress = 74, weeklyGoal = '5 / 7 Days' }) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  return (
    <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-slate-200/50 relative overflow-hidden bg-gradient-to-br from-indigo-500/[0.03] via-slate-50/50 to-cyan-500/[0.03] mb-8">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Career & Learning Coach
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-amber-500/20" /> {streak} Streak
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight mb-2">
            {greeting}, <span className="text-indigo-600">{name}</span>!
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">
            Your personal AI Coach is monitoring your practice accuracy, coding challenges, and mock interview readiness in real time.
          </p>
        </div>

        {/* Header Right Status Badges */}
        <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full lg:w-auto">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex-1 sm:flex-initial min-w-[140px]">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> Overall Progress
            </div>
            <div className="text-xl font-black font-display text-slate-900">{progress}%</div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-indigo-600" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex-1 sm:flex-initial min-w-[140px]">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
              <Target className="w-3.5 h-3.5 text-emerald-600" /> Weekly Target
            </div>
            <div className="text-xl font-black font-display text-slate-900">{weeklyGoal}</div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-emerald-600" style={{ width: '71%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
