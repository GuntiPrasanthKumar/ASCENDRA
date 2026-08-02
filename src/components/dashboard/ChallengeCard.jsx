import React from 'react';
import { ArrowRight, Code, Trophy, ShieldAlert } from 'lucide-react';

export default function ChallengeCard({ title, category, difficulty, points, description, actionUrl, onAction, icon: Icon = Code, isLoading = false, isEmpty = false }) {
  if (isLoading) {
    return <ChallengeCard.Skeleton />;
  }

  if (isEmpty) {
    return <ChallengeCard.Empty category={category} />;
  }

  return (
    <div className="p-8 rounded-[2.5rem] border border-slate-200/80 bg-white flex flex-col justify-between h-full group hover:border-slate-300 shadow-xs transition-all duration-300">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-2.5">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
              {category}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-black">
              {difficulty}
            </span>
          </div>
          {points && (
            <div className="flex items-center gap-1 text-xs font-black text-black">
              <Trophy className="w-3.5 h-3.5" />
              <span>+{points} pts</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold font-display text-black mb-2 flex items-center gap-2">
          <Icon className="w-5 h-5 text-black shrink-0" />
          {title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <button
        onClick={onAction || (() => window.location.href = actionUrl)}
        className="w-full py-4 rounded-2xl bg-black text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
      >
        Solve Challenge <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}

ChallengeCard.Skeleton = function ChallengeCardSkeleton() {
  return (
    <div className="p-8 rounded-[2.5rem] border border-slate-200/80 animate-pulse flex flex-col justify-between h-56 bg-white">
      <div>
        <div className="flex gap-2 mb-4">
          <div className="w-16 h-4 bg-slate-100 rounded-lg" />
          <div className="w-16 h-4 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-6 bg-slate-100 rounded-lg w-3/4 mb-3" />
        <div className="h-4 bg-slate-100 rounded-lg w-full mb-1" />
        <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
      </div>
      <div className="h-10 bg-slate-100 rounded-2xl w-full mt-4" />
    </div>
  );
};

ChallengeCard.Empty = function ChallengeCardEmpty({ category = 'Challenge' }) {
  return (
    <div className="p-8 rounded-[2.5rem] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center h-56 bg-white">
      <ShieldAlert className="w-8 h-8 text-slate-300 mb-2" />
      <h4 className="font-bold text-slate-400 text-sm">No Active Challenge</h4>
      <p className="text-[10px] text-slate-400 max-w-xs mt-1">Check back later for new daily quests in {category}.</p>
    </div>
  );
};
