import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, TrendingUp, Award, Calendar, BookOpen, 
  ArrowUpRight, Clock, Star, Target, Sparkles, ChevronRight,
  Activity, Zap, ShieldCheck
} from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import HeatmapCard from '../components/dashboard/HeatmapCard';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [summary, setSummary] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const hour = new Date().getHours();
  const greeting = useMemo(() => {
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, [hour]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, resultsRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/assessments/my-results')
        ]);
        setSummary(sumRes.data);
        setRecentResults(resultsRes.data.slice(0, 3));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { label: 'Global Rank', value: summary?.rank || '#--', change: 'Active', icon: <Target className="w-5 h-5" />, color: 'text-accent' },
    { label: 'Avg. Accuracy', value: summary?.avgScore || '0%', change: '+0%', icon: <Award className="w-5 h-5" />, color: 'text-success' },
    { label: 'Total Quizzes', value: summary?.totalQuizzes || '0', change: 'Lifetime', icon: <TrendingUp className="w-5 h-5" />, color: 'text-accent2' },
    { label: 'Active Streak', value: summary?.streak || '0 Days', change: 'Personal Best', icon: <Star className="w-5 h-5" />, color: 'text-warning' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-6 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 w-fit mb-4"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Neural Link Active</span>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-display font-extrabold text-primary mb-2">
                {greeting}, <span className="text-accent">{user?.name?.split(' ')[0] || 'Scholar'}</span>!
              </h1>
              <p className="text-textMuted text-lg font-medium">Your current performance is in the top <span className="text-accent font-bold">4%</span> this week.</p>
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => window.location.href='/proctoring'} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-accent transition-all shadow-lg shadow-primary/20">
                <Zap className="w-4 h-4" /> Start New Assessment
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-3xl border border-muted hover:border-accent/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl bg-primary/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className="text-[10px] font-black text-success bg-success/10 px-2 py-0.5 rounded-full">{stat.change}</div>
                </div>
                <div className="text-2xl font-display font-black text-primary mb-1">{isLoading ? '...' : stat.value}</div>
                <div className="text-xs font-bold text-textMuted uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Activity Heatmap */}
            <div className="lg:col-span-2">
              <HeatmapCard />
            </div>
            
            {/* Recent Assessments */}
            <div className="glass p-8 rounded-[2rem] border border-muted h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-display font-extrabold text-primary flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" /> Recent Activity
                </h3>
              </div>
              
              <div className="space-y-4 flex-1">
                {recentResults.length > 0 ? recentResults.map((item, i) => (
                  <div key={i} className="group p-4 rounded-2xl bg-white/40 border border-muted/50 hover:border-accent/30 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-accent uppercase tracking-tighter bg-accent/5 px-2 py-0.5 rounded">
                        {item.subject}
                      </span>
                      <span className="text-[10px] font-bold text-success">
                        {Math.round(item.accuracy)}% Accuracy
                      </span>
                    </div>
                    <h4 className="font-bold text-primary text-sm mb-1 group-hover:text-accent transition-colors">{item.topic}</h4>
                    <p className="text-[11px] text-textMuted flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-success" /> Strikes: {item.strikes}
                    </p>
                  </div>
                )) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/20 rounded-3xl border border-dashed border-muted">
                    <p className="text-sm text-textMuted italic">No assessments taken yet. Start your journey today!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Analytics Chart */}
            <div className="lg:col-span-2 h-[400px]">
              <AnalyticsChart />
            </div>

            {/* AI Coaching Card */}
            <div className="glass p-8 rounded-[2rem] border border-muted flex flex-col justify-center bg-gradient-to-br from-white to-accent/5">
              <div className="w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-display font-black text-primary mb-4">Neural Coach Insight</h3>
              <p className="text-textMuted leading-relaxed mb-8">
                Based on your recent <span className="text-accent font-bold">{summary?.totalQuizzes || 0}</span> sessions, your focus should be on higher complexity topics in <span className="text-accent font-bold">{recentResults[0]?.subject || 'your major'}</span> to boost your global rank.
              </p>
              <button onClick={() => window.location.href='/assistant'} className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:bg-accent transition-all flex items-center justify-center gap-2 group">
                Consult AI Assistant <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
