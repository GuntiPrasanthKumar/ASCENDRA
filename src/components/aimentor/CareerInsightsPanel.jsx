import React from 'react';
import { Briefcase, Award, Cpu, CheckCircle2 } from 'lucide-react';

export default function CareerInsightsPanel() {
  const readinessMetrics = [
    { label: 'Career Readiness Index', value: '86 / 100', status: 'High Placement Potential', pct: 86 },
    { label: 'Interview Readiness', value: '85%', status: 'Gaze & Proctor Certified', pct: 85 },
    { label: 'Portfolio Completion', value: '90%', status: '3 Projects Verified', pct: 90 },
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
    <div className="p-6 md:p-8 rounded-[2.5rem] border border-slate-200/80 bg-white mb-8 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold font-display text-black flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-black" /> Placement & Career Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Assessing tech stack readiness, resume projects, and placement interview benchmarks.</p>
        </div>
      </div>

      {/* Readiness Scores Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {readinessMetrics.map((m) => (
          <div key={m.label} className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-500">{m.label}</span>
              <Award className="w-4 h-4 text-black" />
            </div>
            <div className="text-2xl font-black font-display text-black mb-0.5">
              {m.value}
            </div>
            <span className="text-[10px] font-bold text-black">
              {m.status}
            </span>
            <div className="w-full h-1.5 bg-slate-100 rounded-full border border-slate-200/40 mt-3 overflow-hidden">
              <div className="h-full bg-black rounded-full" style={{ width: `${m.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Tech & Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Skills */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
          <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-black" /> Recommended Core Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {recommendedSkills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-black shadow-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Suggested Technologies */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
          <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-black" /> Industry Tech Stack Focus
          </h3>
          <div className="space-y-2">
            {suggestedTech.map((tech) => (
              <div key={tech.name} className="p-3 rounded-2xl bg-white border border-slate-200/60 text-xs flex justify-between items-center shadow-xs">
                <span className="font-bold text-black">{tech.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">{tech.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
