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
import { PlayCircle, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const data = dashboardMockData;
  const greeting = useMemoGreeting();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

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
          <div className="max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/80 bg-white text-center flex flex-col items-center shadow-xs">
            <ShieldAlert className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-bold text-black mb-2">Command Center Unavailable</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We encountered an issue initializing your real-time telemetry.
            </p>
            <button
              onClick={() => setHasError(false)}
              className="w-full py-4 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all"
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-100/50 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-96 h-96 bg-slate-100/50 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Top: AI Command Header */}
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
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200/80 shadow-xs">
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
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-[10px] text-slate-500 leading-relaxed">
                          <span className="font-extrabold text-[8px] uppercase tracking-wider block text-slate-500 mb-0.5">AI Tip:</span>
                          {task.aiInsight}
                        </div>
                        <button
                          onClick={() => navigate(task.actionUrl)}
                          className="text-[10px] font-black uppercase tracking-widest text-black hover:text-slate-600 transition-colors text-left flex items-center gap-0.5"
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
            {/* AI Recommendation Grid */}
            <AIRecommendationGrid />

            {/* Learning Analytics Section */}
            <LearningAnalytics
              codingCount={completedCodingCount}
              quizCount={completedQuizzesCount}
            />

            {/* Continue Learning */}
            <div className="mb-8">
              <SectionHeader title="Continue Learning Path" subtitle="Resume your active curriculum" />
              <div className="p-6 md:p-8 bg-white rounded-[2.5rem] border border-slate-200/80 flex flex-col justify-between group hover:border-slate-300 shadow-xs transition-all duration-300">
                <div>
                  <span className="text-[10px] font-black text-black bg-slate-100 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                    {data.continueLearning.subject}
                  </span>
                  <h3 className="text-xl font-bold font-display text-black mb-1">{data.continueLearning.chapter}</h3>
                  <p className="text-xs text-slate-500 font-medium mb-4">Lesson {data.continueLearning.completedLessons + 1} of {data.continueLearning.totalLessons}</p>
                  
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                    <span className="font-extrabold block mb-0.5 text-black uppercase tracking-widest text-[9px]">Roadmap Insight:</span>
                    {data.continueLearning.aiInsight}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="flex flex-col gap-1 w-full md:w-auto">
                    <span className="text-xs font-black text-black">{data.continueLearning.progress}% Complete</span>
                    <div className="w-full md:w-32 h-2 bg-slate-100 rounded-full border border-slate-200/40 overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: `${data.continueLearning.progress}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/learn/adv-algorithms/dynamic-programming/dp-introduction')}
                    className="w-full md:w-auto px-6 py-3.5 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shrink-0 group-hover:scale-[1.01]"
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
              <div className="p-6 md:p-8 rounded-[2.5rem] border border-slate-200/80 bg-white flex flex-col gap-6 shadow-xs">
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

function useMemoGreeting() {
  const hour = new Date().getHours();
  return React.useMemo(() => {
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, [hour]);
}
