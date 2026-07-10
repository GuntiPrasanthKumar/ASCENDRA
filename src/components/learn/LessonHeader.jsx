import React from 'react';
import BookmarkButton from './BookmarkButton';
import { ArrowLeft, Clock } from 'lucide-react';

export default function LessonHeader({ title, subjectTitle, readingTime, isBookmarked, onBookmarkToggle, onBack }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
      <div className="flex gap-4 items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-150"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-0.5">
            {subjectTitle}
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold text-primary">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {readingTime && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-textMuted bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min read</span>
          </div>
        )}
        <BookmarkButton isBookmarked={isBookmarked} onToggle={onBookmarkToggle} />
      </div>
    </div>
  );
}
