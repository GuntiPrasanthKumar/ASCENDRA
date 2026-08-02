import React from 'react';
import { TrendingUp, Target, Award, Code, Video, CheckCircle2 } from 'lucide-react';

export default function LearningAnalytics({ codingCount = 1, quizCount = 3 }) {
  const analytics = [
    { label: 'Overall Progress', value: '74%', change: '+4.2% this week', color: 'text-indigo-600', barColor: 'bg-indigo-600', icon: <TrendingUp className="w-4 h-4 text-indigo-600" /> },
    { label: 'Weekly Activity', value: '6.8 hrs', change: '15% above goal', color: 'text-emerald-600', barColor: 'bg-emerald-600', icon: <Target className="w-4 h-4 text-emerald-600" /> },
    { label: 'Practice Accuracy', value: '88.5%', change: 'High consistency', color: 'text-cyan-600', barColor: 'bg-cyan-600', icon: <CheckCircle2 className="w-4 h-4 text-cyan-600" /> },
    { label: 'Quiz Accuracy', value: '91.2%', change: `${quizCount} Quizzes Passed`, color: 'text-purple-600', barColor: 'bg-purple-600', icon: <Award className="w-4 h-4 text-purple-600" /> },
    { label: 'Coding Progress', value: `${codingCount} Solved`, change: 'CodeLab Workspace', color: 'text-blue-600', barColor: 'bg-blue-600', icon: <Code className="w-4 h-4 text-blue-600" /> },
    { label: 'Interview Readiness', value: '85%', change: 'Gaze & Proctor Passed', color: 'text-amber-600', barColor: 'bg-amber-600', icon: <Video className="w-4 h-4 text-amber-600" /> },
  ];

  return (
    <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-slate-200/50 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" /> Learning Analytics & Skill Metrics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time performance benchmarks across learning modules.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {analytics.map((item) => (
          <div key={item.label} className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">{item.label}</span>
              {item.icon}
            </div>
            
            <div>
              <div className="text-xl md:text-2xl font-black font-display text-slate-900 mb-1">
                {item.value}
              </div>
              <span className={`text-[10px] font-bold ${item.color}`}>
                {item.change}
              </span>
            </div>

            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div className={`h-full ${item.barColor}`} style={{ width: item.value.includes('%') ? item.value : '75%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
