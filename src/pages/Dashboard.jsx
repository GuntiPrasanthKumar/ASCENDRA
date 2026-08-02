import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { useAuthStore } from '../hooks/useAuthStore';
import { dashboardMockData } from '../components/dashboard/mockData';

// Modular Dashboard Components
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AICommandHeader from '../components/dashboard/AICommandHeader';
import AIRecommendationGrid from '../components/dashboard/AIRecommendationGrid';
import LearningAnalytics from '../components/dashboard/LearningAnalytics';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import GoalChecklist from '../components/dashboard/GoalChecklist';
import AICoachCard from '../components/dashboard/AICoachCard';
import GrowthTracker from '../components/dashboard/GrowthTracker';
import UpcomingTaskCard from '../components/dashboard/UpcomingTaskCard';
import SectionHeader from '../components/dashboard/SectionHeader';
import ChallengeCard from '../components/dashboard/ChallengeCard';
import AchievementCard from '../components/dashboard/AchievementCard';

// Lucide Icons
import { PlayCircle, ShieldAlert, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const data = dashboardMockData;
  const greeting = useMemoGreeting();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Load dynamically synchronized metrics from localStorage
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

  const completedCodingCount = React.useMemo(() => {
    try {
      const list = JSON.parse(localStorage.getItem('completed_coding') || '[]');
      return list.length || 1;
    } catch {
      return 1;
    }
  }, []);

  const completedInterviewsCount = React.useMemo(() => {
    try {
      const list = JSON.parse(localStorage.getItem('completed_interviews') || '[]');
      return list.length || 1;
    } catch {
      return 1;
    }
  }, []);

  const currentStreak = React.useMemo(() => {
    return localStorage.getItem('skilltrove_streak') || '7';
  }, []);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-28 pb-20 px-4 md:px-6">
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
        <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-6 flex items-center justify-center">
          <div className="glass max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/50 text-center flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-rose-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Command Center Unavailable</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We encountered an issue initializing your real-time telemetry.
            </p>
            <button
              onClick={() => setHasError(false)}
              className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-indigo-600 transition-all"
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
      <div className="min-h-screen bg-background pt-0 pb-12 px-4 md:px-6 relative overflow-hidden">
        {/* Subtle background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-96 h-96 bg-cyan-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Top: AI Command Header (Greeting, Time, AI Insight, Quick Actions) */}
          <AICommandHeader
            greeting={greeting}
            name={user?.name?.split(' ')[0] || 'Scholar'}
            streak={`${currentStreak} Days`}
            aiInsight={data.welcomeHero.aiInsight}
          />

          {/* Main Layout Grid */}
          <DashboardLayout
            sidebar={
              <>
                {/* AI Mentor Coach Card */}
                <AICoachCard
                  title={data.aiCoach.title}
                  type={data.aiCoach.type}
                  description={data.aiCoach.description}
                  aiInsight={data.aiCoach.aiInsight}
                  matchScore={data.aiCoach.matchScore}
                  actionText={data.aiCoach.actionText}
                  onAction={() => navigate('/practice')}
                />

                {/* Today's Goals & Daily Target */}
                <GoalChecklist initialGoals={data.goals} />

                {/* Growth Tracker */}
                <GrowthTracker
                  tracks={data.progressTracks.tracks}
                  aiInsight={data.progressTracks.aiInsight}
                  actionText={data.progressTracks.actionText}
                  onAction={() => navigate('/my-learning')}
                />

                {/* Recent Activity Timeline */}
                <ActivityTimeline
                  completedLessons={completedLessonsCount}
                  completedQuizzes={completedQuizzesCount}
                  completedCoding={completedCodingCount}
                  completedInterviews={completedInterviewsCount}
                />

                {/* Upcoming Schedule */}
                <div className="glass p-6 rounded-3xl border border-slate-200/50">
                  <h3 className="text-md font-bold font-display text-slate-900 mb-4">Upcoming Schedule</h3>
                  <div className="flex flex-col gap-4">
                    {data.upcomingTasks.map(task => (
                      <div key={task.id} className="flex flex-col gap-2 border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                        <UpcomingTaskCard
                          title={task.title}
                          time={task.time}
                          type={task.type}
                          status={task.status}
                        />
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/50 text-[10px] text-slate-500 leading-relaxed">
                          <span className="font-extrabold text-[8px] uppercase tracking-wider block text-slate-500 mb-0.5">AI Tip:</span>
                          {task.aiInsight}
                        </div>
                        <button
                          onClick={() => navigate(task.actionUrl)}
                          className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors text-left flex items-center gap-0.5"
                        >
                          {task.actionText}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            }
          >
            {/* AI Recommendation Grid (Next lesson, Weak topics, Recommended coding, Suggested interview) */}
            <AIRecommendationGrid />

            {/* Learning Analytics Section */}
            <LearningAnalytics
              codingCount={completedCodingCount}
              quizCount={completedQuizzesCount}
            />

            {/* Continue Learning */}
            <div className="mb-8">
              <SectionHeader title="Continue Learning Path" subtitle="Resume your active curriculum" />
              <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col justify-between group hover:border-indigo-500/20 transition-all duration-300">
                <div>
                  <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3 inline-block">
                    {data.continueLearning.subject}
                  </span>
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-1">{data.continueLearning.chapter}</h3>
                  <p className="text-xs text-slate-500 font-medium mb-4">Lesson {data.continueLearning.completedLessons + 1} of {data.continueLearning.totalLessons}</p>
                  
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                    <span className="font-extrabold block mb-0.5 text-slate-700 uppercase tracking-widest text-[9px]">Roadmap Insight:</span>
                    {data.continueLearning.aiInsight}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-slate-100/80">
                  <div className="flex flex-col gap-1 w-full md:w-auto">
                    <span className="text-xs font-black text-slate-900">{data.continueLearning.progress}% Complete</span>
                    <div className="w-full md:w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div className="h-full bg-indigo-600 animate-pulse" style={{ width: `${data.continueLearning.progress}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/learn/adv-algorithms/dynamic-programming/dp-introduction')}
                    className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-indigo-600 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md group-hover:scale-[1.01]"
                  >
                    <PlayCircle className="w-4 h-4" /> {data.continueLearning.actionText}
                  </button>
                </div>
              </div>
            </div>

            {/* Challenges & Coding Targets */}
            <div className="mb-8">
              <SectionHeader title="Mission Control Challenges" subtitle="Dynamic problems to verify your target concepts" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-between h-full">
                  <ChallengeCard
                    title={data.codingChallenge.title}
                    category={data.codingChallenge.category}
                    difficulty={data.codingChallenge.difficulty}
                    points={data.codingChallenge.points}
                    description={data.codingChallenge.description}
                    onAction={() => navigate('/codelab')}
                  />
                </div>

                <div className="flex flex-col justify-between h-full">
                  <ChallengeCard
                    title={data.practiceChallenge.title}
                    category="Aptitude Practice"
                    difficulty={data.practiceChallenge.difficulty}
                    points={100}
                    description={data.practiceChallenge.description}
                    onAction={() => navigate('/practice')}
                  />
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <SectionHeader title="Badges & Milestones" subtitle="Achievements earned across your learning journey" />
              <div className="glass p-6 rounded-[2.5rem] border border-slate-200/50 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.achievements.items.map(ach => (
                    <AchievementCard
                      key={ach.id}
                      title={ach.title}
                      desc={ach.desc}
                      iconName={ach.icon}
                      unlockedAt={ach.unlockedAt}
                    />
                  ))}
                </div>
              </div>
            </div>

          </DashboardLayout>
        </div>
      </div>
    </PageTransition>
  );
}

// Hook helper to calculate greeting
function useMemoGreeting() {
  const hour = new Date().getHours();
  return React.useMemo(() => {
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, [hour]);
}
