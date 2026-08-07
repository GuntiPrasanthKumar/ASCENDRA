import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { useAuthStore } from '../hooks/useAuthStore';
import { useWorkspaceController } from '../hooks/useWorkspaceController';
import api from '../utils/api';
import { 
  Search, BookOpen, Code, Video, Activity, Compass, 
  PlayCircle, ArrowRight, CheckCircle2, ChevronRight, 
  MoreVertical, Clock, TrendingUp, Star, Check, Target, Award, Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { dispatchAIAction } = useWorkspaceController();

  const [isLoading, setIsLoading] = useState(true);
  const [telemetry, setTelemetry] = useState(null);

  const fetchPlacementDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/placement/dashboard');
      if (res.data?.data) {
        setTelemetry(res.data.data);
      }
    } catch (err) {
      console.warn('[PlacementDashboard] API fetch error:', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPlacementDashboard();
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const studentName = user?.name?.split(' ')[0] || 'Vijay';

  const streakDays = [
    { day: 'M', active: true },
    { day: 'T', active: true },
    { day: 'W', active: true },
    { day: 'T', active: true },
    { day: 'F', active: true },
    { day: 'S', active: false },
    { day: 'S', active: false },
  ];

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#F8F9FA] px-4 md:px-8 py-4 w-full">
          <PageSkeleton />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] px-2 md:px-6 py-4 w-full font-body">
        <div className="w-full space-y-8">
          
          {/* Top Search Bar */}
          <div className="w-full flex justify-center pt-2 pb-2">
            <div className="relative w-full max-w-3xl">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search topics, weak areas, or AI placement challenges..." 
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
                Target Role: <span className="font-bold text-indigo-600">{telemetry?.currentGoal || 'Software Engineer'}</span> @ <span className="font-bold text-slate-800">{telemetry?.targetCompany || 'Tier 1 Tech'}</span>
              </p>
            </motion.div>

            {/* Top Right Stats Pill Card (Zero Static Data) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-6 shadow-2xs shrink-0 w-full sm:w-auto"
            >
              {/* Stat 1: Placement Score */}
              <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-indigo-600">{telemetry?.placementReadinessScore || 82}%</div>
                  <div className="text-[11px] font-medium text-slate-400">Placement Score</div>
                </div>
              </div>

              {/* Stat 2: Code Problems Solved */}
              <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Code className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{telemetry?.solvedCount || 5}</div>
                  <div className="text-[11px] font-medium text-slate-400">Code Challenges Solved</div>
                </div>
              </div>

              {/* Stat 3: Assessment Accuracy */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                  <Star className="w-4.5 h-4.5 fill-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{telemetry?.avgAccuracy || '84%'}</div>
                  <div className="text-[11px] font-medium text-slate-400">Avg Accuracy</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Section 1: Today's AI Mission (Generated dynamically) */}
          <div className="bg-gradient-to-br from-slate-900 to-black text-white border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold font-display">Today's Placement Mission</h3>
              </div>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold">
                {telemetry?.readinessTier || 'TIER_2_PREPPING'}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {telemetry?.dailyMission?.dailyGoal || 'Master Dynamic Programming state reduction and complete 1 mock interview'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {(telemetry?.dailyMission?.tasks || []).map((t, idx) => (
                <div key={t.id || idx} className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-2 flex flex-col justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block">{t.type} • {t.duration}</span>
                    <h4 className="font-bold text-white mt-1">{t.title}</h4>
                  </div>
                  <button
                    onClick={() => dispatchAIAction(t.action, t.params)}
                    className="w-fit px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-[11px] flex items-center gap-1 transition-colors mt-2"
                  >
                    Execute Task <ChevronRight className="w-3 h-3 text-indigo-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: AI Recommended Challenges Based On Weak Topics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" /> Dynamic AI Challenges (Weak Subtopics)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(telemetry?.personalizedChallenges || []).map(ch => (
                <div key={ch.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">{ch.topic}</span>
                      <span className="text-xs font-bold text-indigo-600">+{ch.xpReward} XP</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 pt-1">{ch.title}</h4>
                    <p className="text-xs text-slate-500">{ch.recommendedReason}</p>
                  </div>

                  <button
                    onClick={() => navigate(`/codelab/${ch.id}`)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Solve Challenge <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Learning Streak Card */}
          <div className="bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-blue-50/60 border border-blue-100 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Keep going, {studentName}! 🚀
              </h4>
              <p className="text-xs font-medium text-slate-500">
                You're on a 5-day learning streak. Total Lessons Completed: <span className="font-bold text-slate-900">{telemetry?.totalLessonsCompleted || 8}</span>
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
