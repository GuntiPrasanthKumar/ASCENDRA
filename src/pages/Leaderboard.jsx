import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, ChevronUp, ChevronDown } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

export default function Leaderboard() {
  const [filter, setFilter] = useState('Global'); // Global, CS, Electronics
  
  const topThree = [
    { rank: 2, name: 'Sarah Jenkins', score: 9850, dept: 'CS', change: 'up' },
    { rank: 1, name: 'Michael Chen', score: 10240, dept: 'Data Science', change: 'same' },
    { rank: 3, name: 'Alex Rodriguez', score: 9620, dept: 'Electronics', change: 'down' },
  ];

  const others = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 4,
    name: `Student ${i + 4}`,
    score: 9500 - (i * 100),
    dept: ['CS', 'Electronics', 'Mech'][Math.floor(Math.random() * 3)],
    change: Math.random() > 0.5 ? 'up' : 'down'
  }));

  const userRank = { rank: 42, name: 'John Doe (You)', score: 7500, dept: 'CS', change: 'up' };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-32 pb-32 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-primary mb-2">Leaderboard</h1>
              <p className="text-textMuted text-lg">Compete with peers and climb the ranks.</p>
            </div>
            
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-muted">
              {['Global', 'CS', 'Electronics'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-primary text-white' : 'text-textMuted hover:text-primary'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Podium for Top 3 */}
          <div className="flex justify-center items-end gap-2 md:gap-6 mb-16 h-64 mt-10">
            {/* 2nd Place */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-1/3 max-w-[200px] flex flex-col items-center"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-slate-200 rounded-full border-4 border-slate-300 shadow-lg flex items-center justify-center mb-2">
                  <Medal className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="font-bold text-primary truncate w-full">{topThree[0].name}</h3>
                <p className="text-accent font-bold">{topThree[0].score}</p>
              </div>
              <div className="w-full h-32 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-2xl border-t-4 border-slate-300 flex justify-center pt-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <span className="text-4xl font-display font-bold text-slate-400">2</span>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-1/3 max-w-[220px] flex flex-col items-center z-10"
            >
              <div className="text-center mb-4 relative">
                <Trophy className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 text-warning animate-bounce" />
                <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full border-4 border-warning shadow-lg shadow-warning/30 flex items-center justify-center mb-2">
                  <Medal className="w-10 h-10 text-warning" />
                </div>
                <h3 className="font-bold text-primary truncate w-full text-lg">{topThree[1].name}</h3>
                <p className="text-warning font-bold">{topThree[1].score}</p>
              </div>
              <div className="w-full h-40 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-2xl border-t-4 border-warning flex justify-center pt-4 shadow-[0_-10px_20px_rgba(245,158,11,0.1)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <span className="text-5xl font-display font-bold text-amber-500 relative z-10">1</span>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-1/3 max-w-[200px] flex flex-col items-center"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full border-4 border-orange-300 shadow-lg flex items-center justify-center mb-2">
                  <Medal className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="font-bold text-primary truncate w-full">{topThree[2].name}</h3>
                <p className="text-accent font-bold">{topThree[2].score}</p>
              </div>
              <div className="w-full h-24 bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-2xl border-t-4 border-orange-300 flex justify-center pt-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <span className="text-4xl font-display font-bold text-orange-400">3</span>
              </div>
            </motion.div>
          </div>

          {/* List */}
          <div className="glass rounded-3xl overflow-hidden mb-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-muted bg-white/40">
                  <th className="p-4 pl-8 text-textMuted font-medium text-sm w-20">Rank</th>
                  <th className="p-4 text-textMuted font-medium text-sm">Student</th>
                  <th className="p-4 text-textMuted font-medium text-sm hidden md:table-cell">Department</th>
                  <th className="p-4 pr-8 text-textMuted font-medium text-sm text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {others.map((user) => (
                  <tr key={user.rank} className="border-b border-muted/50 hover:bg-white/50 transition-colors">
                    <td className="p-4 pl-8 font-mono text-textMuted">#{user.rank}</td>
                    <td className="p-4 font-bold text-primary flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </td>
                    <td className="p-4 text-textMuted text-sm hidden md:table-cell">{user.dept}</td>
                    <td className="p-4 pr-8 font-mono font-bold text-primary text-right flex justify-end items-center gap-2">
                      {user.change === 'up' ? <ChevronUp className="w-4 h-4 text-success" /> : <ChevronDown className="w-4 h-4 text-error" />}
                      {user.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pinned User Rank */}
          <div className="fixed bottom-6 left-0 w-full px-6 z-50 pointer-events-none">
            <div className="max-w-5xl mx-auto pointer-events-auto">
              <div className="bg-primary text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-accent2">#{userRank.rank}</div>
                  <div>
                    <h4 className="font-bold">{userRank.name}</h4>
                    <p className="text-xs text-white/70">{userRank.dept}</p>
                  </div>
                </div>
                <div className="font-mono font-bold text-xl text-accent2">
                  {userRank.score} pts
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
