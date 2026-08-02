import React from 'react';
import { Zap, BookOpen, AlertTriangle, Code, Video, ArrowRight } from 'lucide-react';
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
      icon: <BookOpen className="w-4 h-4" />,
      actionText: 'Resume Lesson',
      path: '/learn/adv-algorithms/dynamic-programming/dp-introduction'
    },
    {
      id: 'weak-topic',
      type: 'Weak Topic Review',
      title: 'Heap Priority Queues',
      subtitle: '72% Accuracy in last assessment',
      reason: 'Heaps account for 18% of technical interview questions.',
      icon: <AlertTriangle className="w-4 h-4" />,
      actionText: 'Review Topic',
      path: '/practice'
    },
    {
      id: 'coding-prob',
      type: 'Recommended Coding',
      title: 'Longest Palindromic Substring',
      subtitle: 'Medium • String Processing',
      reason: 'Matches 3 core algorithm patterns tested in placements.',
      icon: <Code className="w-4 h-4" />,
      actionText: 'Solve Problem',
      path: '/codelab'
    },
    {
      id: 'suggested-int',
      type: 'Suggested Interview',
      title: 'System Design Mock Rehearsal',
      subtitle: 'Architecture & Load Balancing',
      reason: 'Proctoring & Gaze Tracking benchmark test ready.',
      icon: <Video className="w-4 h-4" />,
      actionText: 'Start Rehearsal',
      path: '/interview'
    }
  ];

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200/80 mb-8 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold font-display text-black flex items-center gap-2">
            <Zap className="w-5 h-5" /> Personalized Recommendations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Tailored learning items generated based on your accuracy and learning pace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-6 bg-white rounded-[1.75rem] border border-slate-200/80 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-slate-200 bg-slate-100 text-black flex items-center gap-1.5">
                  {rec.icon}
                  {rec.type}
                </span>
              </div>

              <h3 className="text-sm font-bold text-black group-hover:text-slate-600 transition-colors mb-1">
                {rec.title}
              </h3>
              <p className="text-xs font-medium text-slate-500 mb-2">
                {rec.subtitle}
              </p>
              <p className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 leading-relaxed mb-4">
                <span className="font-extrabold text-[9px] uppercase tracking-widest text-slate-500 block mb-0.5">Why Recommended:</span>
                {rec.reason}
              </p>
            </div>

            <button
              onClick={() => navigate(rec.path)}
              className="w-full py-3 rounded-full bg-black text-white hover:bg-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 group/btn"
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
