import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Medal, ChevronUp, ChevronDown, Search, Filter, 
  Target, Users, Zap, TrendingUp, Award
} from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

const DEPARTMENTS = ['Global', 'Computer Science', 'Electronics', 'Data Science', 'Mechanical'];

export default function Leaderboard() {
  const { user: currentUser } = useAuthStore();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filter, setFilter] = useState('Global');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        setLeaderboardData(res.data);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const filteredData = useMemo(() => {
    return leaderboardData.filter(u => {
      const matchFilter = filter === 'Global' || u.department === filter;
      const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    }).map((u, index) => ({ ...u, rank: index + 1 }));
  }, [filter, search, leaderboardData]);

  const topThree = useMemo(() => {
    return leaderboardData.slice(0, 3);
  }, [leaderboardData]);

  const currentUserStats = useMemo(() => {
    const index = leaderboardData.findIndex(u => u._id === currentUser?.id);
    if (index === -1) return { rank: '--', points: currentUser?.points || 0, department: currentUser?.department || 'N/A' };
    return { 
      rank: index + 1, 
      points: leaderboardData[index].points, 
      department: leaderboardData[index].department,
      percentile: Math.round(((leaderboardData.length - index) / leaderboardData.length) * 100)
    };
  }, [leaderboardData, currentUser]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-32 pb-40 px-4 md:px-6 relative overflow-hidden">
        
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-8">
            <div className="text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 mb-4"
              >
                <TrendingUp className="w-3.5 h-3.5 text-warning" />
                <span className="text-[10px] font-bold text-warning uppercase tracking-widest">Global Standings</span>
              </motion.div>
              <h1 className="text-5xl font-display font-extrabold text-primary mb-2">Hall of Fame</h1>
              <p className="text-textMuted text-lg">Top performers across all academic disciplines.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative group flex-1 sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-4 h-4 group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Find student..."
                  className="w-full bg-white/60 border border-muted rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-accent transition-all text-sm shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex bg-white/60 rounded-2xl p-1 shadow-sm border border-muted overflow-x-auto whitespace-nowrap scrollbar-hide">
                {DEPARTMENTS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                      filter === f 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-textMuted hover:text-primary hover:bg-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: 'Participants', value: leaderboardData.length, icon: <Users className="w-4 h-4" />, color: 'text-accent' },
              { label: 'Avg. Score', value: Math.round(leaderboardData.reduce((a,b) => a + (b.points || 0), 0) / (leaderboardData.length || 1)), icon: <Zap className="w-4 h-4" />, color: 'text-warning' },
              { label: 'Top Dept.', value: 'CS', icon: <Target className="w-4 h-4" />, color: 'text-accent2' },
              { label: 'Hall of Fame', value: '10', icon: <Award className="w-4 h-4" />, color: 'text-success' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-4 rounded-2xl border border-muted flex items-center gap-4"
              >
                <div className={`p-3 rounded-xl bg-primary/5 ${stat.color}`}>{stat.icon}</div>
                <div>
                  <div className="text-[10px] font-bold text-textMuted uppercase tracking-widest">{stat.label}</div>
                  <div className="text-xl font-display font-bold text-primary">{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 3D Podium for Top 3 */}
          <div className="flex justify-center items-end gap-2 md:gap-8 mb-12 md:mb-20 mt-16 md:mt-24 h-[320px] md:h-[450px] px-4 relative">
            {topThree[1] && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 1, delay: 0.2 }} className="w-1/3 max-w-[200px] flex flex-col items-center group cursor-default">
                <div className="text-center mb-4 md:mb-6">
                  <div className="relative mb-2 md:mb-3">
                    <div className="w-12 h-12 md:w-20 md:h-20 mx-auto bg-slate-100 rounded-full border-2 md:border-4 border-slate-300 shadow-xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                      <span className="text-sm md:text-xl font-bold text-slate-400">{topThree[1].name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <Medal className="absolute -bottom-1 -right-1 w-4 h-4 md:w-6 md:h-6 text-slate-400 fill-white" />
                  </div>
                  <h3 className="font-bold text-primary text-[10px] md:text-base truncate w-full px-1">{topThree[1].name}</h3>
                  <p className="text-accent font-extrabold text-[10px] md:text-sm">{topThree[1].points}</p>
                </div>
                <div className="w-full h-24 md:h-40 bg-gradient-to-t from-slate-200 to-slate-50 rounded-t-[1.5rem] md:rounded-t-[2rem] border-t-2 md:border-t-4 border-slate-300 flex justify-center pt-3 md:pt-6 shadow-2xl relative">
                  <span className="text-3xl md:text-6xl font-display font-black text-slate-300/50">2</span>
                </div>
              </motion.div>
            )}

            {topThree[0] && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 1, delay: 0.1 }} className="w-1/3 max-w-[240px] flex flex-col items-center z-10 group cursor-default">
                <div className="text-center mb-4 md:mb-6 relative">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2">
                    <Trophy className="w-6 h-6 md:w-10 md:h-10 text-warning filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  </motion.div>
                  <div className="relative mb-2 md:mb-3">
                    <div className="w-16 h-16 md:w-28 md:h-28 mx-auto bg-amber-50 rounded-full border-2 md:border-4 border-warning shadow-2xl shadow-warning/20 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                       <span className="text-lg md:text-2xl font-bold text-warning">{topThree[0].name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <Award className="absolute -bottom-1 -right-1 w-5 h-5 md:w-8 md:h-8 text-warning fill-white" />
                  </div>
                  <h3 className="font-display font-black text-primary text-xs md:text-xl truncate w-full px-1">{topThree[0].name}</h3>
                  <p className="text-warning font-black text-sm md:text-lg">{topThree[0].points}</p>
                </div>
                <div className="w-full h-36 md:h-60 bg-gradient-to-t from-amber-200 to-amber-50 rounded-t-[2rem] md:rounded-t-[2.5rem] border-t-2 md:border-t-4 border-warning flex justify-center pt-4 md:pt-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1),transparent)]" />
                  <span className="text-5xl md:text-8xl font-display font-black text-amber-500/30 relative z-10">1</span>
                </div>
              </motion.div>
            )}

            {topThree[2] && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 1, delay: 0.3 }} className="w-1/3 max-w-[200px] flex flex-col items-center group cursor-default">
                <div className="text-center mb-4 md:mb-6">
                  <div className="relative mb-2 md:mb-3">
                    <div className="w-12 h-12 md:w-20 md:h-20 mx-auto bg-orange-50 rounded-full border-2 md:border-4 border-orange-200 shadow-xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                       <span className="text-sm md:text-xl font-bold text-orange-300">{topThree[2].name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <Medal className="absolute -bottom-1 -right-1 w-4 h-4 md:w-6 md:h-6 text-orange-300 fill-white" />
                  </div>
                  <h3 className="font-bold text-primary text-[10px] md:text-base truncate w-full px-1">{topThree[2].name}</h3>
                  <p className="text-accent font-extrabold text-[10px] md:text-sm">{topThree[2].points}</p>
                </div>
                <div className="w-full h-20 md:h-32 bg-gradient-to-t from-orange-200 to-orange-50 rounded-t-[1.5rem] md:rounded-t-[2rem] border-t-2 md:border-t-4 border-orange-200 flex justify-center pt-2 md:pt-4 shadow-2xl relative">
                  <span className="text-3xl md:text-6xl font-display font-black text-orange-300/40">3</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Leaderboard List */}
          <div className="glass rounded-[1.5rem] md:rounded-[2rem] border border-muted overflow-hidden shadow-xl mb-32 bg-white/40 mx-2 md:mx-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-primary/5 text-textMuted uppercase tracking-widest text-[8px] md:text-[10px] font-black border-b border-muted">
                    <th className="px-4 md:px-8 py-5 w-16 md:w-24">Rank</th>
                    <th className="px-4 py-5">Student</th>
                    <th className="px-4 py-5 hidden md:table-cell">Department</th>
                    <th className="px-4 md:px-8 py-5 text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredData.map((u, idx) => (
                      <motion.tr 
                        key={u._id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`group border-b border-muted/30 last:border-0 hover:bg-white/80 transition-all ${u._id === currentUser?.id ? 'bg-accent/5' : ''}`}
                      >
                        <td className="px-4 md:px-8 py-4 font-mono font-bold text-textMuted text-xs md:text-sm">
                          <span className={u.rank <= 3 ? 'text-accent' : ''}>#{u.rank}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-muted flex items-center justify-center font-bold text-primary text-xs md:text-sm group-hover:scale-110 transition-transform shrink-0">
                              {u.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-primary text-xs md:text-sm group-hover:text-accent transition-colors truncate">
                                {u.name} {u._id === currentUser?.id && '(You)'}
                              </h4>
                              <p className="text-[8px] md:text-[10px] text-textMuted font-bold uppercase md:hidden">{u.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-xs font-bold text-textSecondary bg-muted/30 px-3 py-1 rounded-full">{u.department}</span>
                        </td>
                        <td className="px-4 md:px-8 py-4 text-right">
                          <div className="flex flex-col items-end">
                            <div className="font-mono font-black text-primary text-sm md:text-base flex items-center gap-1 md:gap-2">
                              {u.points?.toLocaleString() || 0}
                            </div>
                            <div className="text-[8px] md:text-[10px] font-bold text-textMuted uppercase">points</div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {filteredData.length === 0 && !isLoading && (
              <div className="p-10 md:p-20 text-center text-textMuted">
                <Search className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 opacity-10" />
                <p className="font-bold italic text-sm">No students found matching your search.</p>
              </div>
            )}
          </div>

          {/* Floating Personal Rank Card */}
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] max-w-4xl z-50 px-2 md:px-4"
          >
            <div className="bg-primary/95 backdrop-blur-xl text-white p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-2xl flex items-center justify-between border border-white/20 shadow-primary/30">
              <div className="flex items-center gap-3 md:gap-6">
                <div className="relative">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center font-black text-lg md:text-2xl text-accent2 border border-white/10">
                    {currentUserStats.rank}
                  </div>
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 bg-accent2 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-2 h-2 md:w-3 md:h-3 text-primary" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="font-display font-black text-sm md:text-lg tracking-tight truncate max-w-[120px] md:max-w-none">{currentUser?.name} (You)</h4>
                  <p className="text-[8px] md:text-[10px] font-bold text-white/50 uppercase tracking-widest truncate">{currentUserStats.department}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 md:gap-8">
                <div className="hidden sm:block text-right border-r border-white/10 pr-4 md:pr-8">
                  <div className="text-[8px] md:text-[10px] font-bold text-white/50 uppercase tracking-widest">Percentile</div>
                  <div className="text-sm md:text-xl font-display font-black text-accent2">Top {currentUserStats.percentile || '--'}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] md:text-[10px] font-bold text-white/50 uppercase tracking-widest">Global Score</div>
                  <div className="text-sm md:text-2xl font-display font-black text-white">{currentUserStats.points?.toLocaleString() || 0}</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </PageTransition>
  );
}
