import React from 'react';
import { Zap, ArrowRight, Clock, ShieldAlert } from 'lucide-react';

export default function RecommendationCard({ title, type, description, matchScore, timeEstimate, actionUrl, onAction, isLoading = false, isEmpty = false }) {
  if (isLoading) {
    return <RecommendationCard.Skeleton />;
  }

  if (isEmpty) {
    return <RecommendationCard.Empty />;
  }

  return (
    <div className="relative overflow-hidden p-8 rounded-[2.5rem] border border-slate-200/80 bg-white flex flex-col justify-between h-full group hover:border-slate-300 shadow-xs transition-all duration-300">
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-black flex items-center gap-1">
            <Zap className="w-3 h-3 text-black" /> AI recommendation
          </span>
          {matchScore && (
            <span className="text-xs font-black text-black bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {matchScore}% Match
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold font-display text-black mb-2">{title}</h3>
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
          className="text-xs font-black uppercase tracking-widest text-black hover:text-slate-600 transition-colors flex items-center gap-1 group/btn"
        >
          Initialize <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

RecommendationCard.Skeleton = function RecommendationCardSkeleton() {
  return (
    <div className="p-8 rounded-[2.5rem] border border-slate-200/80 animate-pulse flex flex-col justify-between h-56 bg-white">
      <div>
        <div className="w-32 h-5 bg-slate-100 rounded-lg mb-4" />
        <div className="h-6 bg-slate-100 rounded-lg w-2/3 mb-3" />
        <div className="h-4 bg-slate-100 rounded-lg w-full mb-1" />
        <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="w-16 h-4 bg-slate-100 rounded-lg" />
        <div className="w-20 h-4 bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
};

RecommendationCard.Empty = function RecommendationCardEmpty() {
  return (
    <div className="p-8 rounded-[2.5rem] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center h-56 bg-white">
      <ShieldAlert className="w-8 h-8 text-slate-300 mb-2" />
      <h4 className="font-bold text-slate-400 text-sm">No Recommendations</h4>
      <p className="text-[10px] text-slate-400 max-w-xs mt-1">Converse with AI Mentor or take quizzes to generate dynamic tips.</p>
    </div>
  );
};
