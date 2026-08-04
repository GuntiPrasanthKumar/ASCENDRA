import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { useAuthStore } from '../hooks/useAuthStore';
import { dashboardMockData } from '../components/dashboard/mockData';

// Modular Dashboard Components
import AICommandHeader from '../components/dashboard/AICommandHeader';
import AIRecommendationGrid from '../components/dashboard/AIRecommendationGrid';
import LearningAnalytics from '../components/dashboard/LearningAnalytics';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import GoalChecklist from '../components/dashboard/GoalChecklist';
import AICoachCard from '../components/dashboard/AICoachCard';
import GrowthTracker from '../components/dashboard/GrowthTracker';
import UpcomingTaskCard from '../components/dashboard/UpcomingTaskCard';
import ChallengeCard from '../components/dashboard/ChallengeCard';
import AchievementCard from '../components/dashboard/AchievementCard';

// Lucide Icons
import { PlayCircle, ShieldAlert, Sparkles, Target, ArrowRight, Zap, Award, Flame } from 'lucide-react';

function useMemoGreeting() {
  return useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const data = dashboardMockData;
  const greeting = useMemoGreeting();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const studentName = user?.name?.split(' ')[0] || 'Scholar';

  const completedLessonsCount = React.useMemo(() => {
    try {
      const list = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
      return list.length;
    } catch {
      return 0;
    }
  }, []);

  const completedQuizzesCount = React.useMemo(() => {
    try {
      const list = JSON.parse(localStorage.getItem('completed_quizzes') || '[]');
      return list.length;
    } catch {
      return 0;
    }
  }, []);

  const currentStreak = React.useMemo(() => {
    return localStorage.getItem('skilltrove_streak') || '7';
  }, []);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (hasError) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 flex items-center justify-center">
          <div className="max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/80 bg-white text-center flex flex-col items-center shadow-xs">
            <ShieldAlert className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-display font-extrabold text-black mb-2">Command Center Offline</h2>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              We encountered an issue initializing your real-time telemetry.
            </p>
            <button
              onClick={() => setHasError(false)}
              className="w-full py-3.5 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* AI Command Header */}
          <AICommandHeader
            name={studentName}
            greeting={greeting}
            streak={currentStreak}
            focusArea={data.userProgress.focusArea}
            overallProgress={data.userProgress.overallProgress}
            streakCount={data.userProgress.streak}
            lastLessonTitle={data.userProgress.lastLessonTitle}
            lastLessonPath={data.userProgress.lastLessonPath}
          />

          {/* NotebookLM / Linear Style 70% / 30% Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start mb-8">
            
            {/* Left 70%: Primary Workspace Stage */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* Daily Focus Launcher Banner */}
              <div className="p-8 rounded-[2.5rem] border border-slate-200/80 bg-white shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-black uppercase tracking-wider text-black mb-3">
                    <Zap className="w-3.5 h-3.5" /> Daily Focus Action
                  </div>
                  <h3 className="text-xl font-display font-extrabold text-black mb-1">
                    Resume Dynamic Programming & Memoization
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Lesson 9 of 12 • Completion increases core algorithm score by <strong className="text-black">+12%</strong>
                  </p>
                </div>

                <button
                  onClick={() => navigate('/learn/adv-algorithms/dynamic-programming/memoization-basics')}
                  className="px-6 py-3.5 rounded-full bg-black hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all shrink-0 shadow-xs group"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* AI Recommendation Grid */}
              <AIRecommendationGrid recommendations={data.recommendations} />

              {/* Learning Telemetry & Analytics */}
              <LearningAnalytics analytics={data.analytics} />

              {/* Challenge & Achievement Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChallengeCard challenge={data.dailyChallenge} />
                <AchievementCard achievements={data.recentAchievements} />
              </div>

            </div>

            {/* Right 30%: Telemetry & AI Briefing Rail */}
            <div className="lg:col-span-3 flex flex-col gap-6 sticky top-20">
              
              {/* AI Telemetry Quick Panel */}
              <div className="p-6 rounded-[2.5rem] border border-slate-200/80 bg-white shadow-xs flex flex-col gap-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-black" />
                    <h4 className="font-display font-extrabold text-black text-xs uppercase tracking-wider">
                      Command Briefing
                    </h4>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-black text-white px-2 py-0.5 rounded-full uppercase">
                    Active
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase tracking-wider text-[10px]">Mastery Score</span>
                    <span className="text-black font-extrabold">{data.userProgress.overallProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div className="h-full bg-black rounded-full" style={{ width: `${data.userProgress.overallProgress}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Lessons</span>
                    <span className="text-sm font-black text-black">{completedLessonsCount + 8} Done</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Streak</span>
                    <span className="text-sm font-black text-black flex items-center justify-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-black" /> {currentStreak}D
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/ai-mentor')}
                  className="w-full py-3 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open AI Mentor</span>
                </button>
              </div>

              {/* Goal Checklist */}
              <GoalChecklist goals={data.weeklyGoals} />

              {/* Growth Tracker */}
              <GrowthTracker growthData={data.growthData} />

              {/* Activity Timeline */}
              <ActivityTimeline activities={data.activities} />

            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
}
