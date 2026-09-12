import React from 'react';
import BookmarkButton from './BookmarkButton';
import { ArrowLeft, Clock, Zap } from 'lucide-react';

export default function LessonHeader({ title, subjectTitle, chapterTitle, readingTime, xp, isBookmarked, onBookmarkToggle, onBack }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-5 border-b border-slate-100 bg-white px-6 md:px-12 pt-5">
      <div className="flex gap-4 items-start">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200 mt-0.5 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
              {subjectTitle}
            </span>
            {chapterTitle && (
              <>
                <span className="text-slate-300 text-[10px]">›</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{chapterTitle}</span>
              </>
            )}
          </div>
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        {readingTime && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <Clock className="w-3.5 h-3.5" />
            <span>{readingTime} min</span>
          </div>
        )}
        {xp && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            <Zap className="w-3.5 h-3.5" />
            <span>+{xp} XP</span>
          </div>
        )}
        <BookmarkButton isBookmarked={isBookmarked} onToggle={onBookmarkToggle} />
      </div>
    </div>
  );
}
