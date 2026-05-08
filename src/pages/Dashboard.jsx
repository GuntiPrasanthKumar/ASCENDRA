import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Target, Zap, Clock, Play, BookOpen } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import HeatmapCard from '../components/dashboard/HeatmapCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';

export default function Dashboard() {
  const stats = [
    { label: 'Global Rank', value: '#42', icon: <Trophy className="w-6 h-6 text-warning" />, change: '+5 this week' },
    { label: 'Avg Score', value: '86%', icon: <Target className="w-6 h-6 text-success" />, change: '+2% from last month' },
    { label: 'Active Streak', value: '12 Days', icon: <Zap className="w-6 h-6 text-accent" />, change: 'Personal best: 15' },
    { label: 'Study Time', value: '45h', icon: <Clock className="w-6 h-6 text-accent2" />, change: 'Top 10% in class' },
  ];

  const upcomingQuizzes = [
    { title: 'Data Structures Midterm', dept: 'Computer Science', time: 'Today, 2:00 PM', duration: '60 min' },
    { title: 'Circuit Analysis Quiz 3', dept: 'Electronics', time: 'Tomorrow, 10:00 AM', duration: '30 min' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        {/* Top Header Section */}
        <div className="bg-primary text-white pt-32 pb-24 px-6 relative overflow-hidden rounded-b-[3rem]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-success rounded-full border-2 border-primary flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold mb-1">Welcome back, John!</h1>
                <p className="text-white/70 font-body">Computer Science • Year 3</p>
              </div>
            </div>
            
            <Link 
              to="/quiz" 
              className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-accent hover:text-white transition-all flex items-center gap-2 group shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Quick Match
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-6 rounded-3xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/50 rounded-xl">{stat.icon}</div>
                  <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">{stat.change}</span>
                </div>
                <div className="text-3xl font-display font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-textMuted font-medium text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Analytics & Heatmap */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="h-[350px]"
              >
                <AnalyticsChart />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <HeatmapCard />
              </motion.div>
            </div>

            {/* Right Column - Upcoming & Actions */}
            <div className="flex flex-col gap-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass p-6 rounded-3xl flex-1"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-bold text-primary">Upcoming Quizzes</h3>
                  <button className="text-sm text-accent hover:underline">View All</button>
                </div>
                
                <div className="space-y-4">
                  {upcomingQuizzes.map((quiz, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-muted bg-white/30 hover:bg-white/60 transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-primary">{quiz.title}</h4>
                          <span className="text-xs text-textMuted bg-muted/50 px-2 py-1 rounded-md">{quiz.dept}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                          <Play className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-textMuted mt-4">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {quiz.time}</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {quiz.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link to="/quiz" className="w-full mt-6 bg-primary/5 border border-primary/10 text-primary py-3 rounded-xl font-medium hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                  View Assessment Calendar
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
