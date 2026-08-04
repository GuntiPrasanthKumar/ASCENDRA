import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code, Activity, Video, BarChart3 } from 'lucide-react';

export default function QuickActionChips() {
  const navigate = useNavigate();

  const actions = [
    { label: 'Continue Learning', path: '/learn', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: 'Open CodeLab', path: '/codelab', icon: <Code className="w-3.5 h-3.5" /> },
    { label: 'Practice DSA', path: '/practice', icon: <Activity className="w-3.5 h-3.5" /> },
    { label: 'Interview Studio', path: '/interview', icon: <Video className="w-3.5 h-3.5" /> },
    { label: 'View Analytics', path: '/my-learning', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
      {actions.map((act, idx) => (
        <button
          key={idx}
          onClick={() => navigate(act.path)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-100 text-black border border-slate-200/80 font-bold text-xs whitespace-nowrap transition-all shadow-xs shrink-0 hover:scale-105 active:scale-95"
        >
          {act.icon}
          <span>{act.label}</span>
        </button>
      ))}
    </div>
  );
}
