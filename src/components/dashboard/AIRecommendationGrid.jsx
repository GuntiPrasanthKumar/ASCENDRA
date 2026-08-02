import React from 'react';
import { Sparkles, BookOpen, AlertTriangle, Code, Video, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AIRecommendationGrid() {
  const navigate = useNavigate();

  const recommendations = [
    {
      id: 'next-lesson',
      type: 'Next Lesson',
      title: 'Dynamic Programming & Memoization',
      subtitle: 'Advanced Algorithms • Lesson 9',
      reason: 'Completing this finishes 75% of your core algorithms milestone.',
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      actionText: 'Resume Lesson',
      path: '/learn/adv-algorithms/dynamic-programming/dp-introduction'
    },
    {
      id: 'weak-topic',
      type: 'Weak Topic Review',
      title: 'Heap Priority Queues',
      subtitle: '72% Accuracy in last assessment',
      reason: 'Heaps account for 18% of technical interview questions.',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
      actionText: 'Review Topic',
      path: '/practice'
    },
    {
      id: 'coding-prob',
      type: 'Recommended Coding',
      title: 'Longest Palindromic Substring',
      subtitle: 'Medium • String Processing',
      reason: 'Matches 3 core algorithm patterns tested in placements.',
      icon: <Code className="w-4 h-4 text-cyan-600" />,
      tagColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      actionText: 'Solve Problem',
      path: '/codelab'
    },
    {
      id: 'suggested-int',
      type: 'Suggested Interview',
      title: 'System Design Mock Rehearsal',
      subtitle: 'Architecture & Load Balancing',
      reason: 'Proctoring & Gaze Tracking benchmark test ready.',
      icon: <Video className="w-4 h-4 text-emerald-600" />,
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      actionText: 'Start Rehearsal',
      path: '/interview'
    }
  ];

  return (
    <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-slate-200/50 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" /> AI Personalized Recommendations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Tailored learning items generated based on your accuracy and learning pace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/60 hover:border-indigo-400/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${rec.tagColor}`}>
                  {rec.icon}
                  {rec.type}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                {rec.title}
              </h3>
              <p className="text-xs font-medium text-slate-500 mb-2">
                {rec.subtitle}
              </p>
              <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100/80 leading-relaxed mb-4">
                <span className="font-extrabold text-[9px] uppercase tracking-widest text-slate-500 block mb-0.5">Why Recommended:</span>
                {rec.reason}
              </p>
            </div>

            <button
              onClick={() => navigate(rec.path)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 font-bold text-xs transition-all flex items-center justify-center gap-1.5 group/btn"
            >
              <span>{rec.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
