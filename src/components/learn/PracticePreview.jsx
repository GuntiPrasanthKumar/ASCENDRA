import React from 'react';
import { ArrowUpRight, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PracticePreview({ title, difficulty, points, url = '/practice' }) {
  return (
    <div className="p-6 rounded-[2rem] border border-slate-200/50 bg-white/40 flex justify-between items-center group hover:border-primary/20 transition-all duration-300">
      <div className="flex gap-4 items-center">
        <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
          <Code className="w-4 h-4 text-slate-600" />
        </div>
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">Coding Quest Preview</span>
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
          <div className="flex gap-2 items-center mt-1">
            <span className="text-[9px] font-black uppercase text-slate-500">{difficulty}</span>
            <span className="text-slate-350 text-[9px]">•</span>
            <span className="text-[9px] font-black text-indigo-600 uppercase">+{points} XP</span>
          </div>
        </div>
      </div>

      <Link
        to={url}
        className="p-3 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-primary group-hover:text-white transition-all shadow-sm border border-slate-100"
      >
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
