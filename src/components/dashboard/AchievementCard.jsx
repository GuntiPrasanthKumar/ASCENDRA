import React from 'react';
import { Award, Flame, ShieldCheck, ShieldAlert } from 'lucide-react';

const ICON_MAP = {
  Award: <Award className="w-6 h-6 text-accent2" />,
  Flame: <Flame className="w-6 h-6 text-warning" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-success" />
};

export default function AchievementCard({ title, desc, iconName, unlockedAt, isLoading = false, isEmpty = false }) {
  if (isLoading) {
    return <AchievementCard.Skeleton />;
  }

  if (isEmpty) {
    return <AchievementCard.Empty />;
  }

  const icon = ICON_MAP[iconName] || <Award className="w-6 h-6 text-primary" />;

  return (
    <div className="flex gap-4 items-center glass p-5 rounded-3xl border border-slate-200/50 hover:border-accent2/20 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-slate-800 text-sm truncate">{title}</h4>
        <p className="text-xs text-textMuted truncate mt-0.5">{desc}</p>
        <span className="text-[10px] font-black text-accent2 bg-accent2/5 px-2 py-0.5 rounded-full uppercase tracking-wider mt-2 inline-block">
          {unlockedAt}
        </span>
      </div>
    </div>
  );
}

AchievementCard.Skeleton = function AchievementCardSkeleton() {
  return (
    <div className="flex gap-4 items-center glass p-5 rounded-3xl border border-slate-200/50 animate-pulse">
      <div className="w-12 h-12 rounded-2xl bg-slate-200 shrink-0" />
      <div className="flex flex-col gap-1.5 w-full">
        <div className="h-4 bg-slate-200 rounded-lg w-2/3" />
        <div className="h-3 bg-slate-200 rounded-lg w-full" />
      </div>
    </div>
  );
};

AchievementCard.Empty = function AchievementCardEmpty() {
  return (
    <div className="flex gap-4 items-center glass p-5 rounded-3xl border border-dashed border-slate-200/50 justify-center text-center text-xs text-textMuted">
      <ShieldAlert className="w-5 h-5 text-slate-300 shrink-0" />
      <span>No accomplishments registered.</span>
    </div>
  );
};
