import React, { useState, useEffect } from 'react';
import { Zap, Clock, BookOpen, Activity, Code, Video, Flame } from 'lucide-react';
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
    { label: 'Resume Learning', icon: <BookOpen className="w-4 h-4" />, path: '/learn' },
    { label: 'Practice Now', icon: <Activity className="w-4 h-4" />, path: '/practice' },
    { label: 'Open CodeLab', icon: <Code className="w-4 h-4" />, path: '/codelab' },
    { label: 'Start Interview', icon: <Video className="w-4 h-4" />, path: '/interview' },
  ];

  return (
    <div className="bg-white p-6 md:p-8 border border-slate-200 relative overflow-hidden mb-8">

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        
        {/* Left Column: Greeting, Time, AI Insight */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-black uppercase tracking-widest text-black bg-slate-100 border border-slate-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Command Center
            </span>

            {timeString && (
              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {timeString}
              </span>
            )}

            {streak && (
              <span className="text-xs font-bold text-black bg-slate-100 border border-slate-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> {streak} Streak Active
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-extrabold text-black tracking-tight">
            {greeting}, <span className="text-slate-500">{name || 'Scholar'}</span>
          </h1>

          {aiInsight && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium leading-relaxed max-w-3xl flex items-start gap-2">
              <Zap className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span><strong className="font-extrabold text-black">AI Insight:</strong> {aiInsight}</span>
            </div>
          )}
        </div>

        {/* Right Column: Quick Actions Grid */}
        <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 shrink-0">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="px-4 py-3 border border-slate-200 bg-white text-black text-xs font-bold transition-all flex items-center justify-center gap-2 hover:bg-black hover:text-white hover:border-black"
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
