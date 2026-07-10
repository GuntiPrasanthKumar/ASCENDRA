import React from 'react';
import { Award } from 'lucide-react';

export default function ProgressSummaryCard({ lessonCompletion, chapterProgress, overallLearningProgress }) {
  return (
    <div className="glass p-6 rounded-3xl border border-slate-200/50 flex flex-col gap-5 select-none">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 pl-1">Syllabus Progress Summary</h3>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">
            <span>Lessons Completed</span>
            <span>{lessonCompletion}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div className="h-full bg-primary" style={{ width: `${lessonCompletion}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">
            <span>Chapter Mastery</span>
            <span>{chapterProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div className="h-full bg-indigo-600" style={{ width: `${chapterProgress}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">
            <span>Overall Roadmap Progress</span>
            <span>{overallLearningProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div className="h-full bg-success" style={{ width: `${overallLearningProgress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
