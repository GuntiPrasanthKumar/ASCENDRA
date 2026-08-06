import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { useAuthStore } from '../hooks/useAuthStore';
import { 
  Search, BookOpen, Code, Video, Activity, Compass, 
  PlayCircle, ArrowRight, CheckCircle2, ChevronRight, 
  MoreVertical, Clock, TrendingUp, Star, Check
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const studentName = user?.name?.split(' ')[0] || 'Vijay';

  const suggestionChips = [
    { 
      label: 'Dynamic Programming Memoization', 
      path: '/learn/adv-algorithms/dynamic-programming/memoization-basics', 
      icon: <BookOpen className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100'
    },
    { 
      label: 'Two Sum CodeLab Challenge', 
      path: '/codelab/two-sum', 
      icon: <Code className="w-4 h-4 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-100'
    },
    { 
      label: 'AI Technical Mock Round', 
      path: '/interview/int-tech/setup', 
      icon: <Video className="w-4 h-4 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-100'
    },
    { 
      label: 'Aptitude Diagnostic Test', 
      path: '/practice/aptitude/set-1', 
      icon: <Activity className="w-4 h-4 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-100'
    }
  ];

  const streakDays = [
    { day: 'M', active: true },
    { day: 'T', active: true },
    { day: 'W', active: true },
    { day: 'T', active: true },
    { day: 'F', active: true },
    { day: 'S', active: false },
    { day: 'S', active: false },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] px-4 md:px-12 py-6 w-full font-body">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Top Search Bar */}
          <div className="w-full flex justify-center pt-2 pb-4">
            <div className="relative w-full max-w-2xl">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search topics, skills, or courses" 
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 shadow-2xs transition-colors"
              />
            </div>
          </div>

          {/* Hero Greeting & Top Right Stats Card */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-1.5"
            >
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
                {greeting}, {studentName} 👋
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                You are learning 15% faster during early morning sessions. Maintain this momentum today!
              </p>
            </motion.div>

            {/* Top Right Stats Pill Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-6 shadow-2xs shrink-0 w-full sm:w-auto"
            >
              {/* Stat 1: Clock */}
              <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">2.5h</div>
                  <div className="text-[11px] font-medium text-slate-400">Today's Learning</div>
                </div>
              </div>

              {/* Stat 2: Faster Learning */}
              <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">15%</div>
                  <div className="text-[11px] font-medium text-slate-400">Faster Learning</div>
                </div>
              </div>

              {/* Stat 3: Total XP */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                  <Star className="w-4.5 h-4.5 fill-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">1270</div>
                  <div className="text-[11px] font-medium text-slate-400">Total XP</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Section 1: Suggested Intent Actions */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-800 tracking-tight">
              Suggested Intent Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(chip.path)}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-slate-300 hover:shadow-xs transition-all text-left group"
                >
                  <div className={`w-10 h-10 rounded-xl ${chip.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    {chip.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2">
                    {chip.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Active Workspace Target Card */}
          <motion.div 
            whileHover={{ y: -1 }}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-7 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xs"
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <span>Active Workspace Target</span>
              </div>

              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900">
                Dynamic Programming & Memoization
              </h2>

              <div className="flex items-center gap-3 flex-wrap text-xs">
                <span className="bg-blue-50 text-blue-600 font-semibold px-3 py-1 rounded-full border border-blue-100">
                  Advanced Algorithms
                </span>
                <span className="text-slate-400 font-medium">
                  • Recommended 15 min focus session
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/learn/adv-algorithms/dynamic-programming/memoization-basics')}
              className="px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs md:text-sm flex items-center gap-2 transition-all shadow-xs shrink-0 group"
            >
              <PlayCircle className="w-4.5 h-4.5" />
              <span>Resume Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Section 3: Verified Activity Journey */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-800 tracking-tight">
                Verified Activity Journey
              </h3>
              <button 
                onClick={() => navigate('/my-learning')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 flex items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-900">Dynamic Programming Overview</h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">Completed 45m ago • +150 XP</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                  </span>
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 flex items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Code className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-900">Two Sum Algorithm Challenge</h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">Completed 2h ago • 100% Score</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Accepted
                  </span>
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Learning Streak Card */}
          <div className="bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-blue-50/60 border border-blue-100 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Keep going, {studentName}! 🚀
              </h4>
              <p className="text-xs font-medium text-slate-500">
                You're on a 5-day learning streak.
              </p>
              <button 
                onClick={() => navigate('/my-learning')}
                className="text-xs font-semibold text-blue-600 hover:underline pt-1 inline-flex items-center gap-1"
              >
                View Progress <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Streak Days Circles */}
            <div className="flex items-center gap-3 shrink-0">
              {streakDays.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    item.active 
                      ? 'bg-blue-600 text-white shadow-2xs' 
                      : 'border border-slate-300 text-slate-400 bg-transparent'
                  }`}>
                    {item.active ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
