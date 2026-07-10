import React from 'react';
import { Bookmark } from 'lucide-react';

export default function BookmarkButton({ isBookmarked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
        isBookmarked
          ? 'bg-accent/10 border-accent/20 text-accent shadow-sm'
          : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      }`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
    >
      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-accent' : ''}`} />
    </button>
  );
}
