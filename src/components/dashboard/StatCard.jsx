import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, change, icon, color = 'text-primary', index = 0, isLoading = false, isEmpty = false }) {
  if (isLoading) {
    return <StatCard.Skeleton index={index} />;
  }

  if (isEmpty) {
    return <StatCard.Empty label={label} index={index} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass p-6 rounded-3xl border border-slate-200/50 hover:border-primary/20 transition-all group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-slate-50 border border-slate-100 ${color} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        {change && (
          <div className="text-[10px] font-black text-success bg-success/5 border border-success/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {change}
          </div>
        )}
      </div>
      <div className="text-2xl font-display font-black text-primary mb-1">{value}</div>
      <div className="text-[10px] font-bold text-textMuted uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}

StatCard.Skeleton = function StatCardSkeleton({ index = 0 }) {
  return (
    <div className="glass p-6 rounded-3xl border border-slate-200/50 animate-pulse flex flex-col gap-4">
      <div className="w-10 h-10 rounded-2xl bg-slate-200" />
      <div className="h-6 bg-slate-200 rounded-lg w-1/2" />
      <div className="h-3 bg-slate-200 rounded-lg w-1/3" />
    </div>
  );
};

StatCard.Empty = function StatCardEmpty({ label, index = 0 }) {
  return (
    <div className="glass p-6 rounded-3xl border border-dashed border-slate-200/50 flex flex-col justify-between h-full">
      <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300">
        --
      </div>
      <div className="text-lg font-bold text-slate-300 mt-4">No Data</div>
      <div className="text-[10px] font-bold text-textMuted uppercase tracking-wider">{label}</div>
    </div>
  );
};
