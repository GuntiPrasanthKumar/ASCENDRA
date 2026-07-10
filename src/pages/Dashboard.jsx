import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { useAuthStore } from '../hooks/useAuthStore';
import { dashboardMockData } from '../components/dashboard/mockData';

// Reusable Dashboard components
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import SectionHeader from '../components/dashboard/SectionHeader';
import StatCard from '../components/dashboard/StatCard';
import GoalChecklist from '../components/dashboard/GoalChecklist';
import ChallengeCard from '../components/dashboard/ChallengeCard';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import AchievementCard from '../components/dashboard/AchievementCard';
import UpcomingTaskCard from '../components/dashboard/UpcomingTaskCard';

// Sprint 1B new components
import AICoachCard from '../components/dashboard/AICoachCard';
import GrowthTracker from '../components/dashboard/GrowthTracker';

// Lucide icons
import { Target, Award, Activity, Flame, ShieldCheck, Sparkles, PlayCircle, BookOpen } from 'lucide-react';

const STAT_ICONS = {
  rank: <Target className="w-5 h-5" />,
  accuracy: <Award className="w-5 h-5" />,
  quizzes: <Activity className="w-5 h-5" />,
  streak: <Flame className="w-5 h-5" />
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const data = dashboardMockData;
  const greeting = useMemoGreeting();
  const navigate = useNavigate();

  // Load dynamically synchronized state
  const completedLessonsCount = React.useMemo(() => {
    const list = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
    return list.length;
  }, []);

  const completedQuizzesCount = React.useMemo(() => {
    const list = JSON.parse(localStorage.getItem('completed_quizzes') || '[]');
    return list.length;
  }, []);

  const completedCodingCount = React.useMemo(() => {
    const list = JSON.parse(localStorage.getItem('completed_coding') || '[]');
    return list.length || 1; // mock baseline
  }, []);

  const completedInterviewsCount = React.useMemo(() => {
    const list = JSON.parse(localStorage.getItem('completed_interviews') || '[]');
    return list.length || 1; // mock baseline
  }, []);

  const currentStreak = React.useMemo(() => {
    return localStorage.getItem('skilltrove_streak') || '7';
  }, []);

  // Update summary stats cards dynamically
  const dynamicSummary = React.useMemo(() => {
    return [
      { id: 'rank', label: 'Global Rank', value: '#142', change: 'Active', color: 'text-accent' },
      { id: 'accuracy', label: 'Solved Problems', value: `${completedCodingCount} Tasks`, change: 'CodeLab', color: 'text-success' },
      { id: 'quizzes', label: 'Completed Quizzes', value: `${completedQuizzesCount}`, change: 'Diagnostics', color: 'text-accent2' },
      { id: 'streak', label: 'Rehearsals Passed', value: `${completedInterviewsCount}`, change: 'Interview Studio', color: 'text-warning' }
    ];
  }, [completedCodingCount, completedQuizzesCount, completedInterviewsCount]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-6 relative overflow-hidden">
        {/* Sleek, minimal theme backdrops */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/[0.01] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-96 h-96 bg-primary/[0.01] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Dashboard Header */}
          <DashboardHeader 
            title="Command Center" 
            description="Your personal learning stats, metrics, and coaching insight recommendations." 
          />

          {/* 1. Welcome Hero */}
          <div className="mb-12">
            <WelcomeBanner 
              greeting={greeting}
              name={user?.name?.split(' ')[0] || 'Scholar'}
              streak={`${currentStreak} Days`}
              aiInsight={data.welcomeHero.aiInsight}
              actionText={data.welcomeHero.actionText}
              onAction={() => navigate('/learn')}
            />
          </div>

          {/* Stat Cards Grid (Dynamic summary details) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {dynamicSummary.map((stat, i) => (
              <StatCard
                key={stat.id}
                label={stat.label}
                value={stat.value}
                change={stat.change}
                color={stat.color}
                icon={STAT_ICONS[stat.id] || <Award className="w-5 h-5" />}
                index={i}
              />
            ))}
          </div>


          {/* Dashboard Main Grid Split */}
          <DashboardLayout
            sidebar={
              <>
                {/* 2. AI Coach panel */}
                <AICoachCard 
                  title={data.aiCoach.title}
                  type={data.aiCoach.type}
                  description={data.aiCoach.description}
                  aiInsight={data.aiCoach.aiInsight}
                  matchScore={data.aiCoach.matchScore}
                  actionText={data.aiCoach.actionText}
                  onAction={() => navigate('/practice')}
                />

                {/* Today's Goals Checklist */}
                <GoalChecklist initialGoals={data.goals} />

                {/* 6. Growth Tracker (Includes linear tracks + AI insight) */}
                <GrowthTracker 
                  tracks={data.progressTracks.tracks}
                  aiInsight={data.progressTracks.aiInsight}
                  actionText={data.progressTracks.actionText}
                  onAction={() => navigate('/my-learning')}
                />

                {/* 8. Upcoming Schedule Calendar */}
                <div className="glass p-6 rounded-3xl border border-slate-200/50">
                  <h3 className="text-md font-bold font-display text-primary mb-4">Upcoming Schedule</h3>
                  <div className="flex flex-col gap-4">
                    {data.upcomingTasks.map(task => (
                      <div key={task.id} className="flex flex-col gap-2 border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                        <UpcomingTaskCard
                          title={task.title}
                          time={task.time}
                          type={task.type}
                          status={task.status}
                        />
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/50 text-[10px] text-textMuted leading-relaxed">
                          <span className="font-extrabold text-[8px] uppercase tracking-wider block text-slate-500 mb-0.5">AI Tip:</span>
                          {task.aiInsight}
                        </div>
                        <button
                          onClick={() => navigate(task.actionUrl)}
                          className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent transition-colors text-left flex items-center gap-0.5"
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
            {/* 4. Continue Learning (Refactored to match structural formats) */}
            <div>
              <SectionHeader title="Continue Learning" subtitle="Resume your learning roadmap" />
              <div className="glass p-8 rounded-[2.5rem] border border-slate-200/50 flex flex-col justify-between h-full group hover:border-primary/20 transition-all duration-300">
                <div>
                  <span className="text-[10px] font-black text-primary bg-primary/5 border border-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3 inline-block">
                    {data.continueLearning.subject}
                  </span>
                  <h3 className="text-xl font-bold font-display text-primary mb-1">{data.continueLearning.chapter}</h3>
                  <p className="text-xs text-textMuted font-medium mb-4">Lesson {data.continueLearning.completedLessons + 1} of {data.continueLearning.totalLessons}</p>
                  
                  {/* AI Insight */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 text-[11px] text-slate-600 leading-relaxed mb-6 font-medium">
                    <span className="font-extrabold block mb-0.5 text-slate-700 uppercase tracking-widest text-[9px]">Roadmap Insight:</span>
                    {data.continueLearning.aiInsight}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-slate-100/80">
                  <div className="flex flex-col gap-1 w-full md:w-auto">
                    <span className="text-xs font-black text-primary">{data.continueLearning.progress}% Complete</span>
                    <div className="w-full md:w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div className="h-full bg-primary animate-pulse" style={{ width: `${data.continueLearning.progress}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/learn/adv-algorithms/dynamic-programming/dp-introduction')}
                    className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-primary/15 group-hover:scale-[1.01]"
                  >
                    <PlayCircle className="w-4.5 h-4.5" /> {data.continueLearning.actionText}
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Mission Control */}
            <div>
              <SectionHeader title="Mission Control" subtitle="Dynamic challenges to verify your target concepts" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Daily Coding Challenge */}
                <div className="flex flex-col justify-between h-full">
                  <ChallengeCard
                    title={data.codingChallenge.title}
                    category={data.codingChallenge.category}
                    difficulty={data.codingChallenge.difficulty}
                    points={data.codingChallenge.points}
                    description={data.codingChallenge.description}
                    onAction={() => navigate('/codelab')}
                  />
                  <div className="p-4 rounded-b-[2rem] bg-indigo-50/20 border border-t-0 border-slate-200/50 text-[10px] text-indigo-700 leading-relaxed font-medium">
                    <span className="font-extrabold text-[8px] uppercase tracking-wider block text-indigo-800 mb-0.5">AI Target Insight:</span>
                    {data.codingChallenge.aiInsight}
                  </div>
                </div>

                {/* Practice Challenge */}
                <div className="flex flex-col justify-between h-full">
                  <ChallengeCard
                    title={data.practiceChallenge.title}
                    category="Aptitude Practice"
                    difficulty={data.practiceChallenge.difficulty}
                    points={100}
                    description={data.practiceChallenge.description}
                    onAction={() => navigate('/practice')}
                  />
                  <div className="p-4 rounded-b-[2rem] bg-slate-50/55 border border-t-0 border-slate-200/50 text-[10px] text-slate-600 leading-relaxed font-medium">
                    <span className="font-extrabold text-[8px] uppercase tracking-wider block text-slate-700 mb-0.5">AI Target Insight:</span>
                    {data.practiceChallenge.aiInsight}
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Achievements */}
            <div>
              <SectionHeader title="Recent Achievements" subtitle="Badges unlocked across your practice cycles" />
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
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 text-[11px] text-slate-600 leading-relaxed flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="font-medium">
                    <span className="font-extrabold block text-slate-700 uppercase tracking-widest text-[9px] mb-0.5">Badges Insight:</span>
                    {data.achievements.aiInsight}
                  </div>
                  <button
                    onClick={() => navigate('/profile')}
                    className="text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors shrink-0"
                  >
                    {data.achievements.actionText}
                  </button>
                </div>
              </div>
            </div>

            {/* 5. Quick Actions */}
            <div>
              <SectionHeader title="Quick Actions" subtitle="Fast triggers to adjust settings or check biometric registration" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickActionCard 
                  title="Biometric Face Registry" 
                  desc="Register or update your face authentication descriptor." 
                  icon={ShieldCheck} 
                  onAction={() => navigate('/settings')}
                  bgClass="bg-success/5 text-success"
                />
                <QuickActionCard 
                  title="Interactive AI Mentor" 
                  desc="Ask code snippets or topic analysis directly." 
                  icon={Sparkles} 
                  onAction={() => navigate('/ai-mentor')}
                  bgClass="bg-accent/5 text-accent"
                />
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
