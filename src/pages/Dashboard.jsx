import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { useAuthStore } from '../hooks/useAuthStore';
import { dashboardMockData } from '../components/dashboard/mockData';
import { 
  Sparkles, ArrowRight, PlayCircle, BookOpen, Code, Video, Activity, Zap
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const data = dashboardMockData;
  const navigate = useNavigate();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const studentName = user?.name?.split(' ')[0] || 'Scholar';

  const quickActions = [
    { label: 'Resume Lesson', path: '/learn/adv-algorithms/dynamic-programming/memoization-basics', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Solve CodeLab Challenge', path: '/codelab', icon: <Code className="w-4 h-4" /> },
    { label: 'Start AI Mock Interview', path: '/interview', icon: <Video className="w-4 h-4" /> },
    { label: 'Take Diagnostic Quiz', path: '/practice', icon: <Activity className="w-4 h-4" /> }
  ];

  return (
    <PageTransition>
      <div className="min-h-[85vh] bg-background text-slate-800 dark:text-slate-100 py-6 px-4 md:px-8 max-w-5xl mx-auto flex flex-col justify-between">
        <div className="space-y-12">
          
          {/* Gemini Conversational Greeting Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-black dark:text-white" />
              <span>ASCENDRA Intelligence Brief</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-black dark:text-white leading-tight">
              {greeting}, {studentName}
            </h1>
            
            <p className="text-base text-slate-600 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
              {data.welcomeHero?.aiInsight || "Your personalized learning journey is calibrated. Focus on Memoization & Dynamic Programming to unlock maximum mastery today."}
            </p>
          </div>

          {/* Today's Focus Action Stage */}
          <div className="p-8 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Active Workspace Target
              </span>
              <h3 className="text-2xl font-display font-black text-black dark:text-white">
                {data.continueLearning.chapter}
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {data.continueLearning.subject} • Recommended 15 min focus session
              </p>
            </div>

            <button
              onClick={() => navigate('/learn/adv-algorithms/dynamic-programming/memoization-basics')}
              className="px-6 py-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-all shrink-0 shadow-xs group"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Continue Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick Action Hub */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Quick Intent Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(act.path)}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left flex items-center gap-3 transition-all group"
                >
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-black dark:text-white group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    {act.icon}
                  </div>
                  <span className="text-xs font-bold text-black dark:text-white leading-snug">
                    {act.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Journey Timeline */}
          <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Recent Learning Journey
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-black dark:text-white" />
                  <div>
                    <div className="text-xs font-bold text-black dark:text-white">Dynamic Programming Overview</div>
                    <div className="text-[10px] font-medium text-slate-400">Completed 45m ago • +150 XP</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                  Verified
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-black dark:text-white" />
                  <div>
                    <div className="text-xs font-bold text-black dark:text-white">Two Sum Algorithm Challenge</div>
                    <div className="text-[10px] font-medium text-slate-400">Completed 2h ago • 100% Score</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                  Accepted
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Minimal Footer Insight */}
        <div className="pt-8 mt-12 border-t border-slate-200/60 dark:border-slate-800 text-center">
          <p className="text-xs font-medium text-slate-400">
            ASCENDRA AI Operating System • Autonomous Learning & Biometric Assessment Suite
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
