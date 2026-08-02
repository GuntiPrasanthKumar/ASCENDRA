import React from 'react';
import { BookOpen, CheckCircle2, AlertTriangle, Clock, Flame, Award, Percent } from 'lucide-react';

export default function LearningInsightsPanel() {
  const strongSubjects = ['Data Structures', 'Quantitative Aptitude', 'SQL & Databases'];
  const weakSubjects = ['Heap Priority Queues', 'Graph Traversal (BFS/DFS)', 'Dynamic Programming'];

  const metrics = [
    { label: 'Total Study Time', value: '42.5 hrs', sub: 'Active this month', icon: <Clock className="w-4 h-4 text-indigo-600" /> },
    { label: 'Learning Streak', value: '7 Days', sub: 'Flame streak active', icon: <Flame className="w-4 h-4 text-amber-600" /> },
    { label: 'Practice Accuracy', value: '88.5%', sub: 'High consistency', icon: <Percent className="w-4 h-4 text-emerald-600" /> },
    { label: 'Completion Rate', value: '74%', sub: '2 modules remaining', icon: <Award className="w-4 h-4 text-purple-600" /> },
  ];

  return (
    <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-slate-200/50 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" /> Learning Analytics & Mastery Insights
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Deep diagnostics on topic strengths, time allocation, and accuracy trends.</p>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">{m.label}</span>
              {m.icon}
            </div>
            <div className="text-xl md:text-2xl font-black font-display text-slate-900 mb-0.5">
              {m.value}
            </div>
            <span className="text-[10px] font-semibold text-slate-400">
              {m.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Strong vs Weak Subjects Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Subjects */}
        <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/60">
          <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Strong Subjects (&gt;85% Accuracy)
          </h3>
          <div className="flex flex-wrap gap-2">
            {strongSubjects.map((subject) => (
              <span key={subject} className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-900 shadow-sm">
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* Weak Subjects */}
        <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60">
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Focus Areas for Review
          </h3>
          <div className="flex flex-wrap gap-2">
            {weakSubjects.map((subject) => (
              <span key={subject} className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs font-bold text-amber-900 shadow-sm">
                {subject}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
