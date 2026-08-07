import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code2, Activity, Video, BarChart3 } from 'lucide-react';

export default function QuickActionChips() {
  const navigate = useNavigate();

  const actions = [
    { label: 'Continue Learning', path: '/learn', icon: <BookOpen className="w-4 h-4 text-slate-600" /> },
    { label: 'Open CodeLab', path: '/codelab', icon: <Code2 className="w-4 h-4 text-slate-600" /> },
    { label: 'Practice DSA', path: '/practice', icon: <Activity className="w-4 h-4 text-slate-600" /> },
    { label: 'Interview Studio', path: '/interview', icon: <Video className="w-4 h-4 text-slate-600" /> },
    { label: 'View Analytics', path: '/my-learning', icon: <BarChart3 className="w-4 h-4 text-slate-600" /> },
  ];

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {actions.map((act, idx) => (
        <button
          key={idx}
          onClick={() => navigate(act.path)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/80 font-semibold text-xs whitespace-nowrap transition-all shadow-2xs shrink-0 hover:border-slate-300"
        >
          {act.icon}
          <span>{act.label}</span>
        </button>
      ))}
    </div>
  );
}
