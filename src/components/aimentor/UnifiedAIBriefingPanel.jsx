import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, TrendingUp, AlertCircle, ArrowRight, ShieldCheck, Flame, Award, Sparkles, ChevronRight, CheckCircle2 
} from 'lucide-react';

export default function UnifiedAIBriefingPanel({ 
  progress = 74, 
  weeklyGoal = '5 / 7 Days',
  streak = '7 Days'
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-6 sticky top-6">
      
      {/* Header Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="tracking-wider uppercase">AI BRIEFING CENTER</span>
        </div>
        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
          LIVE DATA
        </span>
      </div>

      {/* 1. Today's Focus */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <Target className="w-3.5 h-3.5 text-slate-600" /> TODAY'S FOCUS
        </div>
        <div 
          onClick={() => navigate('/learn/adv-algorithms')}
          className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <div>
            <h4 className="text-xs font-bold text-slate-900">Dynamic Programming &amp; Memoization</h4>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Lesson 9 of 12 • Expected mastery gain: <strong className="text-slate-900">+12%</strong>
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      </div>

      {/* 2. Learning Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5 text-slate-400 uppercase tracking-wider text-[11px]">
            <TrendingUp className="w-3.5 h-3.5 text-slate-600" /> LEARNING PROGRESS
          </span>
          <span className="text-slate-900 font-bold">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      {/* 3. Priority Focus Areas */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <AlertCircle className="w-3.5 h-3.5 text-slate-600" /> PRIORITY FOCUS AREAS
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full">
            Heap Priority Queues (72%)
          </span>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full">
            Graph BFS/DFS (78%)
          </span>
        </div>
      </div>

      {/* 4. Next Recommended Action */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          NEXT RECOMMENDED ACTION
        </div>
        <button
          onClick={() => navigate('/practice/adv-algorithms/set-dp-1')}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-semibold text-xs flex items-center justify-between transition-all shadow-xs group"
        >
          <span>Start DP Practice Set</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 5. Interview Readiness */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-600" /> INTERVIEW READINESS
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">85% Placement Ready</span>
              <span className="text-[10px] text-slate-500 font-medium">Gaze tracking &amp; proctoring verified</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/interview')}
            className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-0.5"
          >
            Rehearse <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 6. Daily Streak & Weekly Goal */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">DAILY STREAK</span>
          <span className="text-base font-bold text-slate-900 flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-blue-600" /> {streak}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">WEEKLY GOAL</span>
          <span className="text-base font-bold text-slate-900 flex items-center justify-center gap-1">
            <Target className="w-4 h-4 text-blue-600" /> {weeklyGoal}
          </span>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '71%' }} />
          </div>
        </div>
      </div>

      {/* 7. Recent Achievement */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">RECENT ACHIEVEMENT</span>
            <span className="text-xs font-bold text-slate-900 block">Algorithm Specialist Badge</span>
            <span className="text-[10px] text-slate-400 block">Earned 2 days ago</span>
          </div>
        </div>
        <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>

    </div>
  );
}
