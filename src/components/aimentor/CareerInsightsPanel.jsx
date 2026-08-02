import React from 'react';
import { Briefcase, Award, Cpu, Video, CheckCircle2 } from 'lucide-react';

export default function CareerInsightsPanel() {
  const readinessMetrics = [
    { label: 'Career Readiness Index', value: '86 / 100', status: 'High Placement Potential', color: 'text-emerald-600', barColor: 'bg-emerald-600', pct: 86 },
    { label: 'Interview Readiness', value: '85%', status: 'Gaze & Proctor Certified', color: 'text-indigo-600', barColor: 'bg-indigo-600', pct: 85 },
    { label: 'Portfolio Completion', value: '90%', status: '3 Projects Verified', color: 'text-purple-600', barColor: 'bg-purple-600', pct: 90 },
  ];

  const recommendedSkills = [
    'System Design Patterns',
    'Microservices Architecture',
    'CI/CD Pipeline Automation',
    'Docker & Containerization'
  ];

  const suggestedTech = [
    { name: 'TypeScript', reason: 'High demand in 82% of target tech roles' },
    { name: 'React 19 & Next.js', reason: 'Essential for modern frontend benchmarks' },
    { name: 'Node.js & Express', reason: 'Core backend API requirement' },
    { name: 'PostgreSQL & Redis', reason: 'Database caching & storage fundamentals' }
  ];

  return (
    <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-slate-200/50 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" /> Placement & Career Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Assessing tech stack readiness, resume projects, and placement interview benchmarks.</p>
        </div>
      </div>

      {/* Readiness Scores Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {readinessMetrics.map((m) => (
          <div key={m.label} className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-500">{m.label}</span>
              <Award className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black font-display text-slate-900 mb-0.5">
              {m.value}
            </div>
            <span className={`text-[10px] font-bold ${m.color}`}>
              {m.status}
            </span>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div className={`h-full ${m.barColor}`} style={{ width: `${m.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Tech & Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Skills */}
        <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-200/60">
          <h3 className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Recommended Core Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {recommendedSkills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-indigo-950 shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Suggested Technologies */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-slate-600" /> Industry Tech Stack Focus
          </h3>
          <div className="space-y-2">
            {suggestedTech.map((tech) => (
              <div key={tech.name} className="p-2.5 rounded-xl bg-white border border-slate-200/60 text-xs flex justify-between items-center">
                <span className="font-bold text-slate-900">{tech.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">{tech.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
