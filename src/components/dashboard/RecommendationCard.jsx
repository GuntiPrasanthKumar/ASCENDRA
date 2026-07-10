import React from 'react';
import { Sparkles, ArrowRight, Clock, ShieldAlert } from 'lucide-react';

export default function RecommendationCard({ title, type, description, matchScore, timeEstimate, actionUrl, onAction, isLoading = false, isEmpty = false }) {
  if (isLoading) {
    return <RecommendationCard.Skeleton />;
  }

  if (isEmpty) {
    return <RecommendationCard.Empty />;
  }

  return (
    <div className="relative overflow-hidden p-8 rounded-[2rem] bg-gradient-to-br from-indigo-500/[0.04] to-pink-500/[0.04] border border-indigo-500/15 flex flex-col justify-between h-full group hover:border-indigo-500/30 transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-pulse" /> AI recommendation
          </span>
          {matchScore && (
            <span className="text-xs font-black text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-md border border-indigo-100/50">
              {matchScore}% Match
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold font-display text-slate-800 mb-2">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 mt-auto">
        {timeEstimate && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <Clock className="w-4 h-4" />
            <span>{timeEstimate}</span>
          </div>
        )}
        <button
          onClick={onAction || (() => window.location.href = actionUrl)}
          className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 group/btn"
        >
          Initialize <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

RecommendationCard.Skeleton = function RecommendationCardSkeleton() {
  return (
    <div className="glass p-8 rounded-[2rem] border border-slate-200/50 animate-pulse flex flex-col justify-between h-56">
      <div>
        <div className="w-32 h-5 bg-slate-200 rounded-lg mb-4" />
        <div className="h-6 bg-slate-200 rounded-lg w-2/3 mb-3" />
        <div className="h-4 bg-slate-200 rounded-lg w-full mb-1" />
        <div className="h-4 bg-slate-200 rounded-lg w-5/6" />
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="w-16 h-4 bg-slate-200 rounded-lg" />
        <div className="w-20 h-4 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
};

RecommendationCard.Empty = function RecommendationCardEmpty() {
  return (
    <div className="glass p-8 rounded-[2rem] border border-dashed border-slate-200/50 text-center flex flex-col items-center justify-center h-56">
      <ShieldAlert className="w-8 h-8 text-slate-300 mb-2" />
      <h4 className="font-bold text-slate-400 text-sm">No Recommendations</h4>
      <p className="text-[10px] text-textMuted max-w-xs mt-1">Converse with AI Mentor or take quizzes to generate dynamic tips.</p>
    </div>
  );
};
