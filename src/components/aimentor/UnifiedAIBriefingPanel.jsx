import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, TrendingUp, AlertCircle, ArrowRight, ShieldCheck, Flame, Award, Sparkles 
} from 'lucide-react';

export default function UnifiedAIBriefingPanel({ 
  progress = 74, 
  weeklyGoal = '5 / 7 Days',
  streak = '7 Days'
}) {
  const navigate = useNavigate();

  return (
    <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col gap-6 sticky top-20">
      
      {/* Header Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-black" />
          <h3 className="font-display font-extrabold text-black text-sm uppercase tracking-wider">
            AI Briefing Center
          </h3>
        </div>
        <span className="text-[9px] font-mono font-bold bg-black text-white px-2 py-0.5 rounded-full uppercase">
          Live Data
        </span>
      </div>

      {/* 1. Today's Focus */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Target className="w-3.5 h-3.5 text-black" /> Today's Focus
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
          <h4 className="text-xs font-bold text-black mb-1">Dynamic Programming & Memoization</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Lesson 9 of 12 • Expected mastery gain: <strong className="text-black">+12%</strong>
          </p>
        </div>
      </div>

      {/* 2. Learning Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5 text-slate-400 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-black" /> Learning Progress
          </span>
          <span className="text-black font-extrabold">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
          <div 
            className="h-full bg-black rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      {/* 3. Weak Topics */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <AlertCircle className="w-3.5 h-3.5 text-black" /> Priority Focus Areas
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
            Heap Priority Queues (72%)
          </span>
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
            Graph BFS/DFS (78%)
          </span>
        </div>
      </div>

      {/* 4. Next Recommendation */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Next Recommended Action
        </div>
        <button
          onClick={() => navigate('/practice/adv-algorithms/set-dp-1')}
          className="w-full p-3.5 rounded-2xl bg-black hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-between transition-all shadow-xs group"
        >
          <span>Start DP Practice Set</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 5. Interview Readiness */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-black" /> Interview Readiness
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
          <div>
            <span className="text-sm font-extrabold text-black block">85% Placement Ready</span>
            <span className="text-[10px] text-slate-500 font-medium">Gaze tracking & proctoring verified</span>
          </div>
          <button 
            onClick={() => navigate('/interview')}
            className="text-[10px] font-bold text-black underline hover:text-slate-600"
          >
            Rehearse
          </button>
        </div>
      </div>

      {/* 6. Daily Goal & Streak */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Daily Streak</span>
          <span className="text-sm font-black text-black flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-black" /> {streak}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Weekly Goal</span>
          <span className="text-sm font-black text-black">{weeklyGoal}</span>
        </div>
      </div>

      {/* 7. Recent Achievement */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-black shrink-0">
          <Award className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recent Achievement</span>
          <span className="text-xs font-bold text-black">Algorithm Specialist Badge</span>
        </div>
      </div>

    </div>
  );
}
