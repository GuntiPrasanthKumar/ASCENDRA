import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { useAuthStore } from '../hooks/useAuthStore';
import { dashboardMockData } from '../components/dashboard/mockData';
import { 
  Sparkles, ArrowRight, PlayCircle, BookOpen, Code, Video, Activity, Zap, Compass, CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const data = dashboardMockData;
  const navigate = useNavigate();
  const [activePrompt, setActivePrompt] = useState('');

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const studentName = user?.name?.split(' ')[0] || 'Scholar';

  const suggestionChips = [
    { label: 'Dynamic Programming Memoization', category: 'Learning', path: '/learn/adv-algorithms/dynamic-programming/memoization-basics', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: 'Two Sum CodeLab Challenge', category: 'CodeLab', path: '/codelab/two-sum', icon: <Code className="w-3.5 h-3.5" /> },
    { label: 'AI Technical Mock Round', category: 'Interview', path: '/interview/int-tech/setup', icon: <Video className="w-3.5 h-3.5" /> },
    { label: 'Aptitude Diagnostic Test', category: 'Assessment', path: '/practice/aptitude/set-1', icon: <Activity className="w-3.5 h-3.5" /> }
  ];

  return (
    <PageTransition>
      <div className="min-h-[85vh] bg-[#F8F9FA] dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] py-8 px-4 md:px-8 max-w-5xl mx-auto flex flex-col justify-between transition-colors duration-300">
        <div className="space-y-10">
          
          {/* Gemini Ambient Gradient Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight leading-tight">
              {greeting}, <span className="gemini-gradient-text">{studentName}</span>
            </h1>
            
            <p className="text-base text-[#5F6368] dark:text-[#C4C7C5] font-medium max-w-2xl leading-relaxed">
              {data.welcomeHero?.aiInsight || "Your learning journey is synchronized. Focus on Memoization & Dynamic Programming to unlock maximum mastery today."}
            </p>
          </motion.div>

          {/* Interactive Suggestion Chips */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5F6368] dark:text-[#8E918F]">
              Suggested Intent Actions
            </span>
            <div className="flex flex-wrap gap-2.5">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(chip.path)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#1E1E20] border border-[#E3E3E3] dark:border-[#2E2F31] text-xs font-bold text-[#1F1F1F] dark:text-[#E3E3E3] hover:border-[#1A73E8] dark:hover:border-[#A8C7FA] hover:bg-[#F0F4F9] dark:hover:bg-[#282A2C] transition-all shadow-xs group"
                >
                  <span className="text-[#1A73E8] dark:text-[#A8C7FA] group-hover:scale-110 transition-transform">
                    {chip.icon}
                  </span>
                  <span>{chip.label}</span>
                  <ArrowRight className="w-3 h-3 text-[#5F6368] dark:text-[#8E918F] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Today's Active Focus Workspace Container */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="google-card p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#1A73E8] dark:text-[#A8C7FA]">
                <Compass className="w-4 h-4" /> Active Workspace Target
              </div>
              <h3 className="text-2xl font-display font-bold text-[#1F1F1F] dark:text-[#E3E3E3]">
                {data.continueLearning.chapter}
              </h3>
              <p className="text-xs font-medium text-[#5F6368] dark:text-[#C4C7C5]">
                {data.continueLearning.subject} • Recommended 15 min focus session
              </p>
            </div>

            <button
              onClick={() => navigate('/learn/adv-algorithms/dynamic-programming/memoization-basics')}
              className="px-7 py-3.5 rounded-full bg-[#1A73E8] dark:bg-[#A8C7FA] hover:bg-[#1557B0] dark:hover:bg-[#8AB4F8] text-white dark:text-[#041E49] font-bold text-xs flex items-center gap-2 transition-all shrink-0 shadow-md group"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Resume Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Recent Journey Timeline */}
          <div className="space-y-4 pt-4 border-t border-[#E3E3E3] dark:border-[#2E2F31]">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5F6368] dark:text-[#8E918F]">
              Verified Activity Journey
            </h3>
            <div className="space-y-3">
              <div className="google-card p-4.5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-full bg-[#E8F0FE] dark:bg-[#282A2C] text-[#1A73E8] dark:text-[#A8C7FA]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1F1F1F] dark:text-[#E3E3E3]">Dynamic Programming Overview</div>
                    <div className="text-[10px] font-medium text-[#5F6368] dark:text-[#8E918F]">Completed 45m ago • +150 XP</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#1E8E3E] bg-[#E6F4EA] dark:bg-[#0C3B19] px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>

              <div className="google-card p-4.5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-full bg-[#E8F0FE] dark:bg-[#282A2C] text-[#1A73E8] dark:text-[#A8C7FA]">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1F1F1F] dark:text-[#E3E3E3]">Two Sum Algorithm Challenge</div>
                    <div className="text-[10px] font-medium text-[#5F6368] dark:text-[#8E918F]">Completed 2h ago • 100% Score</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#1E8E3E] bg-[#E6F4EA] dark:bg-[#0C3B19] px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Accepted
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
