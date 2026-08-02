import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, Download, FileText, Lock, Shield, 
  Zap, ChevronRight,
  TrendingUp, Activity
} from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import HeatmapCard from '../components/dashboard/HeatmapCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import { useAuthStore } from '../hooks/useAuthStore';
import { EmptyState } from '../components/common/FeedbackStates';
import api from '../utils/api';

const TIER_COLORS = {
  Gold: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  Emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  Silver: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  Bronze: 'text-orange-600 bg-orange-600/10 border-orange-600/20',
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
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,rgba(108,99,255,0.03),transparent)] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <Lock className="w-6 h-6" />
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black text-primary">My Learning</h1>
              </div>
              <p className="text-textMuted text-lg font-medium max-w-2xl">
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
                 <h3 className="text-2xl font-display font-extrabold text-primary flex items-center gap-3">
                   <Zap className="w-6 h-6 text-warning" /> Achievement Wall
                 </h3>
                 <span className="text-xs font-black text-textMuted uppercase tracking-widest bg-muted/30 px-3 py-1 rounded-full">
                   {badges.length} Unlocked
                 </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {badges.map((badge, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="glass p-6 rounded-3xl border border-muted flex flex-col items-center text-center group cursor-default relative overflow-hidden"
                  >
                    <div className="absolute top-3 right-3">
                       <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${TIER_COLORS[badge.tier || 'Silver']}`}>
                         {badge.tier || 'Silver'}
                       </div>
                    </div>
                    <div className="mb-4 group-hover:scale-125 transition-transform duration-500 flex items-center justify-center">
                      {badge.icon || <Award className="w-8 h-8 text-amber-500" />}
                    </div>
                    <h4 className="font-black text-primary text-xs uppercase tracking-tight mb-1">{badge.name}</h4>
                    <p className="text-[10px] text-textMuted leading-tight mb-3 px-2">{badge.desc || 'Unlocked achievement'}</p>
                    <div className="mt-auto pt-3 border-t border-muted/30 w-full text-[9px] font-bold text-textMuted uppercase">
                      {badge.date || 'LOCKED'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Digital Certificates */}
            <section>
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-display font-extrabold text-primary flex items-center gap-3">
                   <Shield className="w-6 h-6 text-accent2" /> Digital Assets
                 </h3>
                 <span className="text-xs font-black text-textMuted uppercase tracking-widest bg-muted/30 px-3 py-1 rounded-full">
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
                    className="group relative overflow-hidden glass p-6 rounded-3xl border border-muted hover:border-accent2/30 transition-all cursor-pointer"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-accent2" />
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-accent2/5 flex items-center justify-center text-accent2 group-hover:bg-accent2 group-hover:text-white transition-all">
                           <FileText className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-accent2 uppercase tracking-widest mb-1">CERT-{cert._id.slice(-6).toUpperCase()}</div>
                          <h4 className="font-display font-black text-primary text-lg leading-tight group-hover:text-accent2 transition-colors">
                            {cert.topic}
                          </h4>
                          <div className="flex gap-4 text-xs font-bold text-textMuted mt-2">
                             <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {Math.round(cert.accuracy)}%</span>
                             <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {cert.level}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="p-3 rounded-xl bg-muted/20 text-textMuted hover:bg-primary hover:text-white transition-all shadow-sm">
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
