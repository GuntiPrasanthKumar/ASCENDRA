import React from 'react';
import { TrendingUp, Target, Award, Code, Video, CheckCircle2 } from 'lucide-react';

export default function LearningAnalytics({ codingCount = 1, quizCount = 3 }) {
  const analytics = [
    { label: 'Overall Progress', value: '74%', change: '+4.2% this week', color: 'text-black', barColor: 'bg-black', icon: <TrendingUp className="w-4 h-4 text-black" /> },
    { label: 'Weekly Activity', value: '6.8 hrs', change: '15% above goal', color: 'text-black', barColor: 'bg-slate-700', icon: <Target className="w-4 h-4 text-black" /> },
    { label: 'Practice Accuracy', value: '88.5%', change: 'High consistency', color: 'text-black', barColor: 'bg-black', icon: <CheckCircle2 className="w-4 h-4 text-black" /> },
    { label: 'Quiz Accuracy', value: '91.2%', change: `${quizCount} Quizzes Passed`, color: 'text-black', barColor: 'bg-slate-800', icon: <Award className="w-4 h-4 text-black" /> },
    { label: 'Coding Progress', value: `${codingCount} Solved`, change: 'CodeLab Workspace', color: 'text-black', barColor: 'bg-black', icon: <Code className="w-4 h-4 text-black" /> },
    { label: 'Interview Readiness', value: '85%', change: 'Gaze & Proctor Passed', color: 'text-black', barColor: 'bg-slate-700', icon: <Video className="w-4 h-4 text-black" /> },
  ];

  return (
    <div className="p-6 md:p-8 rounded-[2.5rem] border border-slate-200/80 mb-8 bg-white shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold font-display text-black flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-black" /> Learning Analytics & Skill Metrics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time performance benchmarks across learning modules.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {analytics.map((item) => (
          <div key={item.label} className="p-5 rounded-[1.75rem] bg-white border border-slate-200/80 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">{item.label}</span>
              {item.icon}
            </div>
            
            <div>
              <div className="text-xl md:text-2xl font-black font-display text-black mb-1">
                {item.value}
              </div>
              <span className={`text-[10px] font-bold ${item.color}`}>
                {item.change}
              </span>
            </div>

            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden border border-slate-200/40">
              <div className={`h-full rounded-full ${item.barColor}`} style={{ width: item.value.includes('%') ? item.value : '75%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
