import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, Download, FileText, Lock, Shield, 
  Zap, TrendingUp, Activity
} from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import HeatmapCard from '../components/dashboard/HeatmapCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import { useAuthStore } from '../hooks/useAuthStore';
import { EmptyState } from '../components/common/FeedbackStates';
import api from '../utils/api';

const TIER_COLORS = {
  Gold: 'text-amber-700 bg-amber-50 border-amber-200/80',
  Emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
  Silver: 'text-slate-600 bg-slate-100 border-slate-200/80',
  Bronze: 'text-orange-700 bg-orange-50 border-orange-200/80',
};

export default function MyLearning() {
  const { user } = useAuthStore();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchVaultData = async () => {
      try {
        const res = await api.get('/assessments/my-results');
        setResults(res.data);
      } catch (err) {
        console.error("Vault fetch error:", err);
      }
    };
    fetchVaultData();
  }, []);

  const badges = user?.badges || [
    { name: 'Starter', icon: <Award className="w-8 h-8 text-amber-500" />, desc: 'Welcome to ASCENDRA', date: 'Joined', tier: 'Bronze' }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-2 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          {/* Header - Google Antigravity Style */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/60 text-indigo-600 flex items-center justify-center shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight">My Learning</h1>
              </div>
              <p className="text-slate-500 text-xs font-body max-w-2xl">
                Your personalized repository of academic achievements, certified skills, and learning trajectory.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 h-[420px]">
              <AnalyticsChart />
            </div>
            <div className="h-[420px]">
              <HeatmapCard />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Achievement Badges */}
            <section>
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-display font-medium text-slate-900 tracking-tight flex items-center gap-3">
                   <Zap className="w-6 h-6 text-amber-500" /> Achievement Wall
                 </h3>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60">
                   {badges.length} Unlocked
                 </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {badges.map((badge, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="bg-white p-6 rounded-[1.75rem] border border-slate-200/80 flex flex-col items-center text-center group cursor-default relative overflow-hidden shadow-xs"
                  >
                    <div className="absolute top-3 right-3">
                       <div className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${TIER_COLORS[badge.tier || 'Silver']}`}>
                         {badge.tier || 'Silver'}
                       </div>
                    </div>
                    <div className="mb-4 flex items-center justify-center">
                      {badge.icon || <Award className="w-8 h-8 text-amber-500" />}
                    </div>
                    <h4 className="font-display font-medium text-slate-900 text-xs uppercase tracking-tight mb-1">{badge.name}</h4>
                    <p className="text-[10px] text-slate-500 font-body leading-tight mb-3 px-2">{badge.desc || 'Unlocked achievement'}</p>
                    <div className="mt-auto pt-3 border-t border-slate-100 w-full text-[9px] font-bold text-slate-400 uppercase">
                      {badge.date || 'LOCKED'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Digital Certificates */}
            <section>
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-display font-medium text-slate-900 tracking-tight flex items-center gap-3">
                   <Shield className="w-6 h-6 text-indigo-600" /> Digital Assets
                 </h3>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60">
                   {results.length} Verified
                 </span>
              </div>

              <div className="space-y-4">
                {results.length > 0 ? results.map((cert, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative overflow-hidden bg-white p-6 rounded-[1.75rem] border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                           <FileText className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest mb-1">CERT-{cert._id.slice(-6).toUpperCase()}</div>
                          <h4 className="font-display font-medium text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors tracking-tight">
                            {cert.topic}
                          </h4>
                          <div className="flex gap-4 text-xs font-bold text-slate-500 mt-2">
                             <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {Math.round(cert.accuracy)}%</span>
                             <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {cert.level}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-xs">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <EmptyState 
                    icon={Award}
                    title="Unlock your first certificate"
                    description="Complete a targeted knowledge path to earn your first verified academic digital asset."
                    actionText="Browse Paths"
                    onAction={() => window.location.href = '/practice'}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
