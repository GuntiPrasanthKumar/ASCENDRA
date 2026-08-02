import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, BookOpen, Activity, Code, Video, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AICommandHeader({ greeting, name, streak, aiInsight }) {
  const navigate = useNavigate();
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      setTimeString(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { label: 'Resume Learning', icon: <BookOpen className="w-4 h-4" />, path: '/learn', bg: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/20' },
    { label: 'Practice Now', icon: <Activity className="w-4 h-4" />, path: '/practice', bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20' },
    { label: 'Open CodeLab', icon: <Code className="w-4 h-4" />, path: '/codelab', bg: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 hover:bg-cyan-500/20' },
    { label: 'Start Interview', icon: <Video className="w-4 h-4" />, path: '/interview', bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20' },
  ];

  return (
    <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-slate-200/50 relative overflow-hidden bg-gradient-to-br from-primary/[0.02] via-slate-50/50 to-accent/[0.02] mb-8">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        
        {/* Left Column: Greeting, Time, AI Insight */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-black uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Command Center
            </span>

            {timeString && (
              <span className="text-xs font-bold text-slate-500 bg-slate-100/80 px-3 py-1 rounded-full flex items-center gap-1.5 border border-slate-200/50">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {timeString}
              </span>
            )}

            {streak && (
              <span className="text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-amber-500/20" /> {streak} Streak Active
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            {greeting}, <span className="text-accent">{name || 'Scholar'}</span>
          </h1>

          {aiInsight && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 text-xs text-indigo-900 font-medium leading-relaxed max-w-3xl flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span><strong className="font-extrabold text-indigo-700">AI Momentum Insight:</strong> {aiInsight}</span>
            </div>
          )}
        </div>

        {/* Right Column: Quick Actions Grid */}
        <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 shrink-0">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] ${action.bg}`}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
